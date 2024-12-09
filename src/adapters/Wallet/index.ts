import axios, { AxiosRequestConfig } from 'axios';
import BN from 'bn.js';
import * as rawTransaction from './signTransaction/index';
import config from '../../../configuration/config.json';
import * as common from '../../../configuration/common';
import * as schemaValidator from '../../../configuration/schemaValidator';
import { initialiseWeb3 } from '../../../configuration/intialiseWeb3';
import { ethers } from 'ethers-5';

interface WalletOptions {
    privateKey: string;
    xApiKey: string;
}

interface TransactionObject {
    chainId: number;
    chainSymbol: string;
    value: string | BN;
    to?: string;  
    gas?: string; 
    [key: string]: any;
}

interface SignOrderOptions {
    dexId: number;
    domain: any;
    types: any;
    values?: any;
    message?: any;
    orderType?: string;
}



class Wallet {
    private privateKey: string;
    private xApiKey: string;

    constructor(options: WalletOptions) {
        this.privateKey = options.privateKey;
        this.xApiKey = options.xApiKey;
    }

    signTransaction = async (transactionObject: TransactionObject) => {
        const configuration: AxiosRequestConfig = { params: {} };
        const transactionOptions = { ...transactionObject, function: "transactionObject()" };
        const validObject = await schemaValidator.validateInput(transactionObject);

        if (!validObject.valid) {
            return validObject;
        }

        axios.defaults.headers['X-API-KEY'] = this.xApiKey;
        const apiURL = `${config.url.apiurl}/chain/getpublicrpc/`;
        const chainId = await common.getChainId({
            chainId: transactionObject.chainId,
            chainSymbol: transactionObject.chainSymbol
        });

        if (chainId === null) {
            throw new Error("chainId is null");
        }

        configuration.params = { chainId };

        let rpc = await axios.get(apiURL, configuration);
        rpc = rpc.data.data.rpc;

        const web3 = await initialiseWeb3({ rpc, chainId, key: this.xApiKey });
        transactionOptions.value = new BN(transactionOptions.value);

        const chainName = config.chains[chainId as keyof typeof config.chains].chainName;
        console.log(chainName);

        const options = {
            privateKey: this.privateKey,
            chainId: transactionObject.chainId,
            rpc
        };
        
        const rawData = await rawTransaction[`signTransaction${chainName}`](web3, transactionObject, options);
        rawData.chainId = chainId;

        return rawData;
    };

    signVersionedTransaction = async (transactionObject: TransactionObject) => {
        const configuration: AxiosRequestConfig = { params: {} };
        transactionObject.function = "txObjSol()";
        const validObject = await schemaValidator.validateInput(transactionObject);

        if (!validObject.valid) {
            return validObject;
        }

        axios.defaults.headers['X-API-KEY'] = this.xApiKey;
        const apiURL = `${config.url.apiurl}/chain/getpublicrpc/`;
        const chainId = await common.getChainId({
            chainId: transactionObject.chainId,
            chainSymbol: transactionObject.chainSymbol
        });

        const chainName: string = config.chains[chainId as keyof typeof config.chains].chainName;

        if (chainName !== "Solana") {
            throw new Error("Chain not supported");
        }

        configuration.params = { chainId };

        let rpc = await axios.get(apiURL, configuration);
        rpc = rpc.data.data.rpc;

        const web3 = await initialiseWeb3({ rpc, chainId, key: this.xApiKey });
        const options = { privateKey: this.privateKey };
        const rawData = await rawTransaction[`signVersionedTransaction${chainName}`](web3, transactionObject, options);
        rawData.chainId = chainId;

        return rawData;
    };

    sendTransaction = async (options: Record<string, any>) => {
        const filterOptions = { ...options, function: "sendTransaction()" };
        const validJson = await schemaValidator.validateInput(filterOptions);

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
                    "x-api-key": this.xApiKey
                }
            };

            const transactionHash = await axios(params);
            return transactionHash.data;
        } catch (error) {
            return error;
        }
    };

    signOrderRFQ = async (options: SignOrderOptions) => {
        const filterOptions = { ...options, function: "signOrderRFQ()" };
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return validJson;
        }

        const { dexId, domain, types, values } = options;
        const { chainId } = config.dexes[dexId as unknown as keyof typeof config.dexes];

        const apiConfig: AxiosRequestConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${config.url.apiurl}/chain/getpublicrpc?chainId=${chainId}`,
            headers: { 'x-api-key': this.xApiKey }
        };

        let rpc = await axios.request(apiConfig);
        rpc = rpc.data.data.rpc;

        const provider = new ethers.providers.JsonRpcProvider(rpc);
        const signer = new ethers.Wallet(this.privateKey, provider);
        const signature = await signer._signTypedData(domain, types, values);

        return { signature };
    };

    signLimitOrder = async (options: SignOrderOptions) => {
        const filterOptions = { ...options, function: "signLimitOrder()" };
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return validJson;
        }

        const { dexId, orderType, domain, types, message } = options;
        const { chainId } = config.dexes[dexId as unknown as keyof typeof config.dexes];

        const apiConfig: AxiosRequestConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${config.url.apiurl}/chain/getpublicrpc?chainId=${chainId}`,
            headers: { 'x-api-key': this.xApiKey }
        };

        let rpc = await axios.request(apiConfig);
        rpc = rpc.data.data.rpc;

        const provider = new ethers.providers.JsonRpcProvider(rpc);
        const signer = new ethers.Wallet(this.privateKey, provider);
        const signature = orderType === "create"
            ? await signer._signTypedData(domain, { Order: types.Order }, message)
            : await signer._signTypedData(domain, { CancelOrder: types.CancelOrder }, message);

        return { signature, ...(orderType === "create" && { salt: message?.salt }) };
    };
}

export { Wallet };
