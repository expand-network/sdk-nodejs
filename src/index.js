const axios = require('axios').default;
const config = require('../configuration/config.json');
const schemaValidator = require('../configuration/schemaValidator');
const { Wallet, WalletFordefi } = require('./interfaces/index');

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


exports.sendTransaction = async(options) => {

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

exports.Wallet = Wallet;

exports.WalletFordefi = WalletFordefi;



