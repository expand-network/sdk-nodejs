const axios = require('axios').default;
const BN = require('bn.js');
const rawTransaction = require('./signTransaction/index');
const config = require('../../../configuration/config.json');
const common = require('../../../configuration/common');
const schemaValidator = require('../../../configuration/schemaValidator');
const {initialiseWeb3} = require('../../../configuration/intialiseWeb3');

class Wallet {

    constructor( options ){
        this.privateKey = options.privateKey;
        this.xApiKey = options.xApiKey;
    };
    
    signTransaction = async( transactionObject ) => {
            
            const configuration = { "params": {}  };
            // const filterOptions = options ;
            // filterOptions.function = "signTransaction()";
            // const validJson = await schemaValidator.validateInput(options);
            const transactionOptions = transactionObject;
            transactionOptions.function = "transactionObject()";
            const validObject = await schemaValidator.validateInput(transactionObject);
            

            // if ( !validJson.valid  ) {
            //     return (validJson);
            // }

            if ( !validObject.valid  ) {
                return (validObject);
            }

            // axios.defaults.headers['X-API-KEY'] = options.xApiKey;
            axios.defaults.headers['X-API-KEY'] = this.xApiKey;
            const apiURL = `${config.url.apiurl  }/chain/getpublicrpc/`;

            // const chainId = await common.getChainId({chainId:filterOptions.chainId,chainSymbol:filterOptions.chainSymbol});
            const chainId = await common.getChainId({chainId:transactionObject.chainId,chainSymbol:transactionObject.chainSymbol});

            // console.log(chainId);
            
            configuration.params = {
                chainId
            };

            let rpc = await axios.get(apiURL, configuration);
            rpc = rpc.data.data.rpc;
            const web3 = await initialiseWeb3({rpc:rpc,chainId,key:this.xApiKey});
            transactionOptions.value = new BN(transactionOptions.value);

            let chainName = config.chains[chainId].chainName;
            
            const options = {};
            options.privateKey = this.privateKey;
            const rawData = await rawTransaction[`signTransaction${chainName}`](web3,transactionObject,options);

            return rawData;
    };

    sendTransaction = async(options) => {

        const filterOptions = options ;
        filterOptions.function = "sendTransaction()";
        const validJson = await schemaValidator.validateInput(options);
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
                    "x-api-key" : this.xApiKey
                  }
            };
        
            const transactionHash =  axios(params);
            // console.log("sent to blockchain");
            return options.transactionHash && options.transactionHash;    
        }
    
        catch(error){
            return error;
        }
    
    };

}

module.exports = { Wallet };