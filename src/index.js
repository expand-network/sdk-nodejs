const axios = require('axios').default;
const BN = require('bn.js');
const rawTransaction = require('./signTransaction/index');
const config = require('../configuration/config.json');
const common = require('../configuration/common');

const schemaValidator = require('../configuration/schemaValidator');
const {initialiseWeb3} = require('../configuration/intialiseWeb3');


exports.prepareTransaction = async(apiURL, options) => {

    const filterOptions = options ;
    filterOptions.function = "prepareTransaction()";
    const validJson = await schemaValidator.validateInput(filterOptions);

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
        return response.data;

    }
    catch(error){
        return error;
    }

};

exports.signTransaction = async(transactionObject, options) => {

    const configuration = {};

    const filterOptions = options ;
    filterOptions.function = "signTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    const transactionOptions = transactionObject;
    transactionOptions.function = "transactionObject()";
    const validObject = await schemaValidator.validateInput(transactionObject);
    

    if ( !validJson.valid  ) {
        return (validJson);
    }

    if ( !validObject.valid  ) {
        return (validObject);
    }

    axios.defaults.headers['X-API-KEY'] = options.xApiKey;

    const apiURL = `http://localhost:3000/chain/getpublicrpc/`;

    const chainId = await common.getChainId({chainId:filterOptions.chainId,chainSymbol:filterOptions.chainSymbol});

    // console.log(chainId);
    
    configuration.params = {
        chainId
    };

    const rpc = await axios.get(apiURL, configuration);
    filterOptions.rpc = rpc.data.data.rpc;
    const web3 = await initialiseWeb3({rpc:filterOptions.rpc,chainId,key:filterOptions.key});
    transactionOptions.value = new BN(transactionOptions.value);

    filterOptions.chainName = config.chains[chainId].chainName;

    const rawData = await rawTransaction[`signTransaction${ filterOptions.chainName}`](web3,transactionObject,options);

    return rawData;

};

exports.sendTransaction = async(options) => {

    const filterOptions = options ;
    filterOptions.function = "sendTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    try {

        const apiURL = `http://localhost:3000/chain/sendtransaction/`;
        
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



