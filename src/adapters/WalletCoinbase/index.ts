import axios from 'axios';
import BN from 'bn.js';
import * as rawTransaction from './signTransaction/index';
import config from '../../../configuration/config';
import * as common from '../../../configuration/common';
import * as schemaValidator from '../../../configuration/schemaValidator';
import { initialiseWeb3 } from '../../../configuration/intialiseWeb3';

type TransactionObject = {
    chainId: string;
    chainSymbol: string;
    value: string | BN;
    [key: string]: any;
};

type SendTransactionOptions = {
    [key: string]: any;
};

type ValidObject = {
    valid: boolean;
    [key: string]: any;
};

class WalletCoinbase {
    private privateKey: string;
    private xApiKey: string;

    constructor(options: { privateKey: string; xApiKey: string }) {
        this.privateKey = options.privateKey;
        this.xApiKey = options.xApiKey;
    }

    signTransaction = async (transactionObject: TransactionObject): Promise<any> => {
        const configuration: { params: Record<string, any> } = { params: {} };
        const transactionOptions = { ...transactionObject, function: 'transactionObject()' };

        const validObject: ValidObject = await schemaValidator.validateInput(transactionObject);

        if (!validObject.valid) {
            return validObject;
        }

        axios.defaults.headers['X-API-KEY'] = this.xApiKey;
        const apiURL = `${config.url.apiurl}/chain/getpublicrpc/`;

        const chainId = await common.getChainId({ chainId: transactionObject.chainId, chainSymbol: transactionObject.chainSymbol });

        const chainName = config.chains[chainId as keyof typeof config.chains].chainName;

        if (chainName !== 'Evm') {
            throw new Error('chain not Supported');
        }

        configuration.params = { chainId };

        let rpcResponse = await axios.get(apiURL, configuration);
        const rpc = rpcResponse.data.data.rpc;
        const web3 = await initialiseWeb3({ rpc, chainId, key: this.xApiKey });

        transactionOptions.value = new BN(transactionOptions.value);

        const options = { privateKey: this.privateKey };
        const rawData = await rawTransaction[`signTransaction${chainName}`](web3, transactionObject, options);
        rawData.chainId = chainId;

        return rawData;
    };

    sendTransaction = async (options: SendTransactionOptions): Promise<any> => {
        const filterOptions = { ...options, function: 'sendTransaction()' };
        const validJson: ValidObject = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return validJson;
        }

        try {
            const apiURL = `${config.url.apiurl}/chain/sendtransaction/`;

            const params = {
                method: 'post',
                url: apiURL,
                data: options,
                headers: {
                    'x-api-key': this.xApiKey,
                },
            };

            const transactionHash = await axios(params);
            return transactionHash.data;
        } catch (error: any) {
            return error;
        }
    };
}

export { WalletCoinbase };
