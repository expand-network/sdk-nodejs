const axios = require('axios').default;
const config = require('../configuration/config.json');
const schemaValidator = require('../configuration/schemaValidator');
const { Wallet, WalletFordefi, WalletDFNS, WalletTON, WalletFireblocks } = require('./interfaces/index');

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


exports.decodeTransaction = async (options)=> {

    const filterOptions = options;
    filterOptions.function = "decodeTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if( !validJson.valid ) {
        return (validJson);
    }

    try {

        const apiURL = `${config.url.apiurl  }/chain/decodetransaction/`;

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

    } catch(error){
        return error;
    }


};



exports.Wallet = Wallet;

exports.WalletFordefi = WalletFordefi;

exports.WalletDFNS = WalletDFNS;

exports.WalletTON = WalletTON;

exports.WalletFireblocks = WalletFireblocks;





