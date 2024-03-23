const axios = require('axios').default;
const BN = require('bn.js');
const rawTransaction = require('./signTransaction/index');
const config = require('../../../configuration/config.json');
const common = require('../../../configuration/common');
const schemaValidator = require('../../../configuration/schemaValidator');
const {initialiseWeb3} = require('../../../configuration/intialiseWeb3');
const { ethers } = require('ethers-5');

class Wallet {

    constructor(options) {
        this.privateKey = options.privateKey;
        this.xApiKey = options.xApiKey;
    };

    signTransaction = async (transactionObject) => {

        const configuration = { "params": {} };
        const transactionOptions = transactionObject;
        transactionOptions.function = "transactionObject()";
        const validObject = await schemaValidator.validateInput(transactionObject);

        if (!validObject.valid) {
            return (validObject);
        }

        axios.defaults.headers['X-API-KEY'] = this.xApiKey;
        const apiURL = `${config.url.apiurl}/chain/getpublicrpc/`;

        const chainId = await common.getChainId({ chainId: transactionObject.chainId, chainSymbol: transactionObject.chainSymbol });


        configuration.params = {
            chainId
        };

        let rpc = await axios.get(apiURL, configuration);
        rpc = rpc.data.data.rpc;
        const web3 = await initialiseWeb3({ rpc: rpc, chainId, key: this.xApiKey });
        transactionOptions.value = new BN(transactionOptions.value);

            let chainName = config.chains[chainId].chainName;
            
            const options = {};
            options.privateKey = this.privateKey;
            if(chainName === "Aptos" || chainName === "Starknet") options.chainId = transactionObject.chainId;
            if(chainName === "Near") options.rpc = rpc;
            const rawData = await rawTransaction[`signTransaction${chainName}`](web3,transactionObject,options);
            rawData.chainId = chainId;

        return rawData;
    };

    sendTransaction = async (options) => {

        const filterOptions = options;
        filterOptions.function = "sendTransaction()";
        const validJson = await schemaValidator.validateInput(filterOptions);
        if (!validJson.valid) {
            return (validJson);
        }

        try {

            const apiURL = `${config.url.apiurl}/chain/sendtransaction/`;

            const params = {
                method: "post",
                url: apiURL,
                data: options,
                headers: {
                    "x-api-key": this.xApiKey
                }
            };

            const transactionHash = await axios(params);
            return transactionHash.data;
        }

        catch (error) {
            return error;
        }

    };

    signOrderRFQ = async (options) => {
        const filterOptions = options;
        filterOptions.function = "signOrderRFQ()";
        const validJson = await schemaValidator.validateInput(options);
        if (!validJson.valid) {
            return (validJson);
        }

        const { dexId, domain, types, values } = options;
        const { chainId } = config.dexes[dexId]

        let apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${config.url.apiurl}/chain/getpublicrpc?chainId=${chainId}`,
            headers: {
                'x-api-key': this.xApiKey
            }
        };

        let rpc = await axios.request(apiConfig);

        rpc = rpc.data.data.rpc;

        const provider = new ethers.providers.JsonRpcProvider(rpc);
        const signer = new ethers.Wallet(this.privateKey, provider);
        const signature = await signer._signTypedData(domain, types, values);
        return { signature };
    };

}

module.exports = { Wallet };

