import { xdr, StrKey } from "@stellar/stellar-sdk";
import * as schemaValidator from "../../configuration/schemaValidator";
import { bufferToString, getTransactionByHash } from './helpers';

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

interface Asset {
    [key: string]: string | number;
}

interface ScVal {
    value?(): any;
    [key: string]: any;
}

export default {
    getAllAssets: async (options: FilterOptions): Promise<Asset[] | null | ValidationResult> => {
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
                throw new Error("Invalid transaction response: missing result");
            }

            while (getResponse.result.status === "NOT_FOUND") {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                getResponse = await getTransactionByHash(chainId, transactionHash);
                if (!getResponse.result) {
                    throw new Error("Invalid transaction response: missing result");
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

            // Type guard to check if response is an array-like structure
            if (response && typeof response === 'object' && '_value' in response && Array.isArray(response._value)) {
                return response._value.map((assetResponse: any) => {
                    const assetValues = assetResponse._value;
                    if (!assetValues || !Array.isArray(assetValues) || assetValues.length < 4) {
                        throw new Error("Invalid asset response structure");
                    }

                    const attributes = assetValues[3]?._attributes?.val?._value?._attributes;
                    if (!attributes?.hi?._value || !attributes?.lo?._value) {
                        throw new Error("Invalid asset value structure");
                    }

                    // Convert to BigInt safely
                    const hi = BigInt(attributes.hi._value.toString());
                    const lo = BigInt(attributes.lo._value.toString());
                    const fullValue = (hi << BigInt(64)) + lo;

                    return {
                        [assetValues[1]._attributes.key._value]: bufferToString(assetValues[1]._attributes.val._value),
                        [assetValues[2]._attributes.key._value]: StrKey.encodeEd25519PublicKey(assetValues[2]._attributes.val._value._value._value),
                        [assetValues[3]._attributes.key._value]: fullValue.toString(),
                        [assetValues[0]._attributes.key._value]: assetValues[0]._attributes.val._value
                    } as Asset;
                });
            }
            
            return null;
        } catch (err) {
            console.error("Transaction not found", err);
            return null;
        }
    }
};