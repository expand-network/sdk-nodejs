const { DfnsApiClient } = require("@dfns/sdk");
const { AsymmetricKeySigner } = require("@dfns/sdk-keysigner");
const { DfnsWallet } = require("@dfns/lib-ethersjs6");
const { JsonRpcProvider, Network, Transaction } = require("ethers");
const axios = require('axios');
const rawTransaction = require('./signTransaction/index');
const config = require('../../../configuration/config.json');
const common = require('../../../configuration/common');
const schemaValidator = require('../../../configuration/schemaValidator');


class WalletDFNS {

    constructor(options){
        this.xApiKey = options.xApiKey;
        this.privateKey = options.privateKey;
        this.credId = options.credId;
        this.appId = options.appId;
        this.authToken = options.authToken;
        this.walletId = options.walletId;
        this.baseUrl = options.baseUrl
        this.appOrigin = options.appOrigin
        this.signer = new AsymmetricKeySigner({
            privateKey: options.privateKey,
            credId: options.credId,
            appOrigin: options.appOrigin
        });
        this.dfnsClient = new DfnsApiClient({
            appId: options.appId,
            authToken: options.authToken,
            baseUrl: options.baseUrl,
            signer: this.signer
        });
        this.wallet = new DfnsWallet({
            walletId: this.walletId,
            dfnsClient: this.dfnsClient,
            maxRetries: 10,
        });
        
    }


    signTransaction = async(transactionObject) => {
        
        try{
            const transactionOptions = transactionObject;
            transactionOptions.function = "transactionObject()";
            const validObject = await schemaValidator.validateInput(transactionObject);

            if ( !validObject.valid  ) {
                    return (validObject);
            }
            
            
            const chainId = await common.getChainId({chainId:transactionObject.chainId,chainSymbol:transactionObject.chainSymbol});
            let chainName = config.chains[chainId].chainName;
            axios.defaults.headers['X-API-KEY'] = this.xApiKey;
            const apiURL = `${config.url.apiurl  }/chain/getpublicrpc/`;
            const configuration = {};
            configuration.params = {
                chainId
            };
            let rpc = await axios.get(apiURL, configuration);
            rpc = rpc.data.data.rpc;

            const rpcProvider = new JsonRpcProvider(rpc,Number(transactionObject.chainId));


            if(chainName !== "Evm")
                return new Error("chain not Supported");

            const options = {};
            options.wallet =  this.wallet  //.connect(rpcProvider);
            options.xApiKey = this.xApiKey;
            options.rpcProvider = rpcProvider;
            const response = await rawTransaction[`signTransaction${chainName}`](transactionObject, options);
            return response;
        } catch(error){
            return error;
        }
    };

    sendTransaction = async(transactionObject) => {
        try{

            const filterOptions = transactionObject ;
            filterOptions.function = "DFNSTransaction()";
            const validJson = await schemaValidator.validateInput(filterOptions);

            if ( !validJson.valid ) {
                return (validJson);
            }
            axios.defaults.headers['X-API-KEY'] = this.xApiKey;
            const chainId = await common.getChainId({chainId:transactionObject.chainId,chainSymbol:transactionObject.chainSymbol});
            let chainName = config.chains[chainId].chainName;
            const apiURL = `${config.url.apiurl  }/chain/getpublicrpc/`;
            const configuration = {};
            configuration.params = {
                chainId
            };
            let rpc = await axios.get(apiURL, configuration);
            rpc = rpc.data.data.rpc;
            if(chainName !== "Evm")
                return new Error("chain not Supported");

            const rpcProvider = new JsonRpcProvider(rpc,Number(transactionObject.chainId));
            
            let wallet = this.wallet.connect(rpcProvider);

            let transaction = Transaction.from(transactionObject.rawTransaction);
            let TxHash = await wallet.sendTransaction(transaction);
            return {"TxHash": TxHash.hash}

        } catch(error){
            return error;
        }

    }
}

module.exports = { WalletDFNS };