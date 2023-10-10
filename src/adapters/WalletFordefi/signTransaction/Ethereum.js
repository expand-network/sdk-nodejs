const crypto = require("crypto");
const fs = require('fs');

module.exports = {
    


    signTransactionEvm:async(transactionObject, options) => {
        /*
         * Function will sign the transaction payload for ethereum based chains
         */
    
            try {

                let reqBody = {};
                reqBody.type = "evm_transaction";
                reqBody.vault_id = options.vault_id;
                const path = "/api/v1/transactions";
                const details = transactionObject;
                details.chain = parseInt(transactionObject.chainId)||1;
                const gas = {
                    type: "priority",
                    priority_level: "medium",
                    gas_limit: transactionObject.gas
                }
                details.gas = gas;
                details.to = transactionObject.to;
                details.value = transactionObject.value;
                details.type = "evm_raw_transaction";
                details.data = {
                    type: "hex",
                    hex_data: transactionObject.data
                }
                reqBody.details = details;
                reqBody.signer_type = "api_signer";
                reqBody = JSON.stringify(reqBody);
                const timestamp = new Date().getTime();
                const payload = `${path}|${timestamp}|${reqBody}`;
                const secretPem = fs.readFileSync(options.privateKeyFile, 'utf8');
                const privateKey = crypto.createPrivateKey(secretPem);
                const sign = crypto.createSign('SHA256').update(payload, 'utf8').end();
                const signature = sign.sign(privateKey, 'base64');

                const response = {};
                response.data = reqBody;
                response.timestamp = timestamp;
                response.signature = signature;
                response.accessToken = `Bearer ${options.accessToken}`;
                return response;
            }
            catch(error){
                return(error);
            }
        
    }

};
    