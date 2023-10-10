const axios = require('axios');
const rawTransaction = require('./signTransaction/index');
const config = require('../../../configuration/config.json');
const common = require('../../../configuration/common');
const schemaValidator = require('../../../configuration/schemaValidator');

class WalletFordefi {
    constructor(options){
        this.accessToken = options.accessToken;
        this.xApiKey = options.xApiKey;
        this.privateKeyFile = options.privateKeyFile;
        this.vault_id = options.vault_id;
    };

    signTransaction = async(transactionObject) => {
        
        try{
            const transactionOptions = transactionObject;
            transactionOptions.function = "transactionObject()";
            // const validObject = await schemaValidator.validateInput(transactionObject);

            // if ( !validObject.valid  ) {
            //         return (validObject);
            // }

            const chainId = await common.getChainId({chainId:transactionObject.chainId,chainSymbol:transactionObject.chainSymbol});
            let chainName = config.chains[chainId].chainName;
            console.log(chainName);
            if(chainName !== "Evm" && chainName !== "Solana")
                return new Error("chain not Supported");
            const options = {};
            options.vault_id = this.vault_id;
            options.privateKeyFile = this.privateKeyFile;
            options.accessToken = this.accessToken;
            options.xApiKey = this.xApiKey;
            const response = await rawTransaction[`signTransaction${chainName}`](transactionObject, options);
            return response;
        } catch(error){
            return error;
        }
    };

    sendTransaction = async(response) => {
        try{
            const path = "/api/v1/transactions";
            const config = {
                method: "POST",
                url: `https://api.fordefi.com${path}`,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": response.accessToken,
                    'X-Timestamp': response.timestamp,
                    'X-Signature': response.signature,
                },
                data: response.data
            };
         return await axios.request(config);
            // .then((response) => {
            //     return (JSON.stringify(response.data));
            //  })
            // .catch((error) => {
            //  return (error.response.data.detail);
            // });

        } catch(error){
            return error;
        }

    }
}

module.exports = { WalletFordefi };