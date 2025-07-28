import { xdr, StrKey } from "@stellar/stellar-sdk";
import { bufferToString, getTransactionByHash } from './helpers';
import * as schemaValidator from '../../configuration/schemaValidator';

// Type definitions
interface FilterOptions {
    function?: string;
    chainId: string;
    transactionHash: string;
    [key: string]: any;
}

interface ValidationResult {
    valid: boolean;
    errors?: any;
}

interface TransactionResult {
    status: string;
    resultMetaXdr?: string;
    [key: string]: any;
}

interface TransactionResponse {
    result?: TransactionResult;
    [key: string]: any;
}

interface AssetResult {
    [key: string]: string | number;
}

interface ScValAttributes {
    key: { _value: string };
    val: { _value: any };
    [key: string]: any;
}

interface ScValObject {
    _attributes: ScValAttributes;
    _value?: any;
    [key: string]: any;
}

interface ScMapEntry {
    _value: ScValObject[];
}

type ScVal = xdr.ScVal | ScValObject;

// Type guard for ScVal with attributes
function isScValObject(value: any): value is ScValObject {
    return value && 
           typeof value === 'object' && 
           '_attributes' in value && 
           typeof value._attributes === 'object' &&
           'key' in value._attributes &&
           'val' in value._attributes;
}

// Type guard for array of ScVal objects
function isScValArray(value: any): value is ScValObject[] {
    return Array.isArray(value) && value.every(isScValObject);
}

export default {
    getOwnerAssets: async (options: FilterOptions): Promise<AssetResult[] | null | ValidationResult> => {
        const filterOptions: FilterOptions = { ...options };
        filterOptions.function = "stellarDecodeTransaction()";
        
        const validJson: ValidationResult = await schemaValidator.validateInput(filterOptions);
        if (!validJson.valid) {
            return validJson;
        }

        const { chainId, transactionHash } = filterOptions;
        
        try {
            let getResponse: TransactionResponse = await getTransactionByHash(chainId, transactionHash);
            
            if (!getResponse.result) {
                throw new Error("Transaction response missing result");
            }

            while (getResponse.result.status === "NOT_FOUND") {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                getResponse = await getTransactionByHash(chainId, transactionHash);
                if (!getResponse.result) {
                    throw new Error("Transaction response missing result during polling");
                }
            }

            if (!getResponse.result.resultMetaXdr) {
                throw new Error("Empty resultMetaXDR in getTransaction response");
            }

            const transactionMeta: string = getResponse.result.resultMetaXdr;
            const xdrBuffer: Buffer = Buffer.from(transactionMeta, 'base64');
            const resultMeta: xdr.TransactionMeta = xdr.TransactionMeta.fromXDR(xdrBuffer);
            
            const transactionMetaV3 = resultMeta.v3();
            if (!transactionMetaV3) {
                throw new Error("Transaction meta V3 not found");
            }

            const sorobanMeta = transactionMetaV3.sorobanMeta();
            if (!sorobanMeta) {
                throw new Error("Soroban meta not found");
            }

            const returnValue: xdr.ScVal = sorobanMeta.returnValue();
            const response = returnValue.value();

            if (response && isScValArray(response)) {
                return response.map(assetResponse => {
                    if (!isScValObject(assetResponse) || !assetResponse._value || !Array.isArray(assetResponse._value)) {
                        throw new Error("Invalid asset response structure");
                    }

                    const assetValues = assetResponse._value;
                    if (assetValues.length < 4 || 
                        !isScValObject(assetValues[0]) ||
                        !isScValObject(assetValues[1]) ||
                        !isScValObject(assetValues[2]) ||
                        !isScValObject(assetValues[3])) {
                        throw new Error("Invalid asset values structure");
                    }

                    const val3 = assetValues[3]._attributes.val?._value;
                    if (!val3 || !val3._attributes) {
                        throw new Error("Missing value attributes in assetValues[3]");
                    }

                    const attributes = val3._attributes;
                    if (typeof attributes.hi?._value === 'undefined' || 
                        typeof attributes.lo?._value === 'undefined') {
                        throw new Error("Missing hi/lo values in response");
                    }

                    // Safe BigInt conversion
                    const hi = BigInt(attributes.hi._value.toString());
                    const lo = BigInt(attributes.lo._value.toString());
                    const fullValue = (hi << BigInt(64)) + lo;

                    return {
                        [assetValues[1]._attributes.key._value]: bufferToString(assetValues[1]._attributes.val._value),
                        [assetValues[2]._attributes.key._value]: StrKey.encodeEd25519PublicKey(assetValues[2]._attributes.val._value._value._value),
                        [assetValues[3]._attributes.key._value]: fullValue.toString(),
                        [assetValues[0]._attributes.key._value]: assetValues[0]._attributes.val._value
                    } as AssetResult;
                });
            }
            
            return null;
        } catch (err) {
            console.error("Error in getOwnerAssets:", err);
            return null;
        }
    }
};