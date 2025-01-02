import axios, { AxiosRequestConfig } from 'axios';
import * as rawTransaction from './signTransaction/index';
import config from '../../../configuration/config';
import { getChainId } from '../../../configuration/common';
import * as schemaValidator from '../../../configuration/schemaValidator';

interface WalletOptions {
    accessToken: string;
    xApiKey: string;
    privateKeyFile: string;
    vault_id: string;
}

interface TransactionObject {
    chainId: string;
    chainSymbol?: string;
    [key: string]: any;
}

interface SendTransactionResponse {
    accessToken: string;
    timestamp: string;
    signature: string;
    data: any;
}

class WalletFordefi {
    private accessToken: string;
    private xApiKey: string;
    private privateKeyFile: string;
    private vault_id: string;

    constructor(options: WalletOptions) {
        this.accessToken = options.accessToken;
        this.xApiKey = options.xApiKey;
        this.privateKeyFile = options.privateKeyFile;
        this.vault_id = options.vault_id;
    }

    signTransaction = async (transactionObject: TransactionObject): Promise<any> => {
        try {
            const transactionOptions = { ...transactionObject, function: "transactionObject()" };
            const validObject = await schemaValidator.validateInput(transactionObject);

            if (!validObject.valid) {
                return validObject;
            }

            const chainId = await getChainId({ chainId: transactionObject.chainId, chainSymbol: transactionObject.chainSymbol });
            const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

            if (chainName !== "Evm" && chainName !== "Solana") {
                throw new Error("Chain not supported");
            }

            const options = {
                vault_id: this.vault_id,
                privateKeyFile: this.privateKeyFile,
                accessToken: this.accessToken,
                xApiKey: this.xApiKey,
            };

            const response = await rawTransaction[`signTransaction${chainName}`](transactionObject, options);
            return response;
        } catch (error: any) {
            return error;
        }
    };

    sendTransaction = async (response: SendTransactionResponse): Promise<any> => {
        try {
            const filterOptions = { ...response, function: "FordefiTransaction()" };
            const validJson = await schemaValidator.validateInput(filterOptions);

            if (!validJson.valid) {
                return validJson;
            }

            const path = "/api/v1/transactions";
            const axiosConfig: AxiosRequestConfig = {
                method: "POST",
                url: `https://api.fordefi.com${path}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: response.accessToken,
                    'X-Timestamp': response.timestamp,
                    'X-Signature': response.signature,
                },
                data: response.data,
            };

            const resp = await axios.request(axiosConfig);
            return resp.data;
        } catch (error: any) {
            return error.response?.data || error;
        }
    };
}

export { WalletFordefi };
