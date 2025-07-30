import axios, { AxiosRequestConfig } from 'axios';
import * as rawTransaction from './signTransaction/index';
import * as common from '../../../configuration/common';
import config from '../../../configuration/config';
import { initialiseWeb3 } from '../../../configuration/intialiseWeb3';
import * as schemaValidator from '../../../configuration/schemaValidator';

interface WalletPhantomOptions {
    privateKey: string;
    xApiKey: string;
}

interface TransactionObject {
    function?: string;
    chainId: string | number;
    chainSymbol: string;
    [key: string]: any;
}

interface ValidObject {
    valid: boolean;
    [key: string]: any;
}

class WalletPhantom {
    private privateKey: string;
    private xApiKey: string;

    constructor(options: WalletPhantomOptions) {
        this.privateKey = options.privateKey;
        this.xApiKey = options.xApiKey;
    }

    signTransaction = async (transactionObject: TransactionObject): Promise<any> => {
        const configuration: AxiosRequestConfig = { params: {} };
        transactionObject.function = "txObjSol()";
        
        const validObject: ValidObject = await schemaValidator.validateInput(transactionObject);
        if (!validObject.valid) {
            return validObject;
        }

        axios.defaults.headers['X-API-KEY'] = this.xApiKey;
        const apiURL = `${config.url.apiurl}/chain/getpublicrpc/`;

        const chainId = await common.getChainId({
            chainId: transactionObject.chainId,
            chainSymbol: transactionObject.chainSymbol,
        });

        if (!chainId) {
            return new Error("Invalid chain ID");
        }

        const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

        if (chainName !== "Evm" && chainName !== "Solana") {
            return new Error("Chain not supported");
        }

        configuration.params = { chainId };

        const rpcResponse = await axios.get(apiURL, configuration);
        const rpc = rpcResponse.data.data.rpc;

        const web3 = await initialiseWeb3({ rpc, chainId, key: this.xApiKey });

        const options = { privateKey: this.privateKey };
        const rawData = await rawTransaction[`signTransaction${chainName}`](web3, transactionObject, options);
        rawData.chainId = chainId;

        return rawData;
    };

    signVersionedTransaction = async (transactionObject: TransactionObject): Promise<any> => {
        const configuration: AxiosRequestConfig = { params: {} };
        transactionObject.function = "txObjectSol()";

        const validObject: ValidObject = await schemaValidator.validateInput(transactionObject);
        if (!validObject.valid) {
            return validObject;
        }

        axios.defaults.headers['X-API-KEY'] = this.xApiKey;
        const apiURL = `${config.url.apiurl}/chain/getpublicrpc/`;

        const chainId = await common.getChainId({
            chainId: transactionObject.chainId,
            chainSymbol: transactionObject.chainSymbol,
        });

        if (!chainId) {
            return new Error("Invalid chain ID");
        }

        const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

        if (chainName !== "Solana") {
            return new Error("Chain not supported");
        }

        configuration.params = { chainId };

        const rpcResponse = await axios.get(apiURL, configuration);
        const rpc = rpcResponse.data.data.rpc;

        const web3 = await initialiseWeb3({ rpc, chainId, key: this.xApiKey });

        const options = { privateKey: this.privateKey };
        const rawData = await rawTransaction[`signVersionedTransaction${chainName}`](web3, transactionObject, options);
        rawData.chainId = chainId;

        return rawData;
    };

    sendTransaction = async (options: TransactionObject): Promise<any> => {
        options.function = "sendTransaction()";

        const validJson: ValidObject = await schemaValidator.validateInput(options);
        if (!validJson.valid) {
            return validJson;
        }

        try {
            const apiURL = `${config.url.apiurl}/chain/sendtransaction/`;

            const params: AxiosRequestConfig = {
                method: "post",
                url: apiURL,
                data: options,
                headers: {
                    "x-api-key": this.xApiKey,
                },
            };

            const transactionHash = await axios(params);
            return transactionHash.data;
        } catch (error) {
            return error;
        }
    };
}

export { WalletPhantom };
