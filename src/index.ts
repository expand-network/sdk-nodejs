import axios from "axios";
import BN from 'bn.js';
import rawTransaction from './signtransaction/index';
import config from "./configuration/config";
import Common from "./common/common";
import SchemaValidator from "./validation/schemaValidator";
import IntializeWeb3 from "./common/initializeWeb3";

export default class ExpandSDK {
    prepareTransaction = async(apiURL, options) => {

        const filterOptions = options ;
        filterOptions.function = "prepareTransaction()";
        const validJson = await SchemaValidator.prototype.validateInput(filterOptions);
    
        if ( !validJson.valid ) {
            return (validJson);
        }
    
        try {
    
            const paramConfig = {
                method: "post",
                url: apiURL,
                data: filterOptions,
                headers: {
                    "x-api-key" : filterOptions.xApiKey
                  }
                
            };
    
            const response = await axios(paramConfig).then(result => result.data);
            return response;
    
        }
        catch(error){
            return error;
        }
    
    };
    
    signTransaction = async(transactionObject, options) => {
    
        const configuration : any= {};
    
        const filterOptions = options ;
        filterOptions.function = "signTransaction()";
        const validJson = await SchemaValidator.prototype.validateInput(options);
    
        const transactionOptions = transactionObject;
        transactionOptions.function = "transactionObject()";
        const validObject = await SchemaValidator.prototype.validateInput(transactionObject);
        
    
        if ( !validJson.valid  ) {
            return (validJson);
        }
    
        if ( !validObject.valid  ) {
            return (validObject);
        }
    
        axios.defaults.headers['X-API-KEY'] = options.xApiKey;
    
        const apiURL = `${config.url.apiurl  }/chain/getpublicrpc/`;
    
        const chainId = await Common.prototype.getChainId({chainId:filterOptions.chainId,chainSymbol:filterOptions.chainSymbol});
    
        // console.log(chainId);
        
        configuration.params = {
            chainId
        };
    
        const rpc = await axios.get(apiURL, configuration);
        filterOptions.rpc = rpc.data.data.rpc;
        const web3 = await IntializeWeb3.prototype.initialiseWeb3({rpc:filterOptions.rpc,chainId,key:filterOptions.key});
        transactionOptions.value = new BN(transactionOptions.value);
    
        filterOptions.chainName = config.chains[chainId].chainName;
    
        const rawData = await rawTransaction[`signTransaction${ filterOptions.chainName}`](web3,transactionObject,options);
    
        return rawData;
    
    };
    
  sendTransaction = async(options) => {
    
        const filterOptions = options ;
        filterOptions.function = "sendTransaction()";
        const validJson = await SchemaValidator.prototype.validateInput(options);
    
        if ( !validJson.valid ) {
            return (validJson);
        }
    
        try {
    
            const apiURL = `${config.url.apiurl  }/chain/sendtransaction/`;
            
            const params = {
                method: "post",
                url: apiURL,
                data: options,
                headers: {
                    "x-api-key" : options.xApiKey
                  }
            };
        
            const transactionHash = await axios(params);
            return transactionHash.data;    
    
        }
    
        catch(error){
            return error;
        }
    
    };
}