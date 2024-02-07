const crypto = require("crypto");
const fs = require('fs');

module.exports = {



    signTransactionSolana: async (transactionObject, options) => {
        /*
         * Function will sign the transaction payload for ethereum based chains
         */

        try {

            let reqBody = {};
            reqBody.vault_id = options.vault_id;
            reqBody.type = "solana_transaction";
            reqBody.signer_type = "api_signer";
            let chain = 'solana_mainnet'
            if (transactionObject.chainId === '901') {
                chain = 'solana_devnet'
            } else {
                chain = 'solana_mainnet';
            }
            const path = "/api/v1/transactions";
            const details = {};
            details.format = "hash_binary";
            details.type = "solana_transfer";
            details.to = transactionObject.to;
            details.value = {
                type: "value",
                value: transactionObject.value
            },
                details.asset_identifier = {
                    type: "solana",
                    details: {
                        type: "native",
                        chain: chain
                    }
                }
            reqBody.details = details;
            reqBody = JSON.stringify(reqBody);
            // return reqBody;
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
        catch (error) {
            return (error);
        }

    }

};
