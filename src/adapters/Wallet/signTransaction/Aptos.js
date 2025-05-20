const { Aptos, Hex, Ed25519PrivateKey, AccountAuthenticator, Deserializer, Serializer, 
     AptosConfig, Network, Account } = require("@aptos-labs/ts-sdk");
const { batchRequestAptos } = require("../../../helper/batchRequest");
const config = require('../../../../configuration/config.json');
const { decodeTransactions } = require("../../../helper/aptosHelper");

module.exports = {

    signTransactionAptos: async (web3, transactionObject, options) => {
        /*
         * Function will sign the transaction payload for Aptos chain
         */

        try {
            let { privateKey } = options;
            const chainId = (options.chainId && options.chainId === "1400") ? "1" : "2";
            const config = new AptosConfig({network:chainId==="1" ? Network.MAINNET : Network.DEVNET});
            const aptos = new Aptos(config);
            privateKey = new Ed25519PrivateKey(privateKey);
            const account = Account.fromPrivateKey({ privateKey });

            let transaction;
            let payload;
            // If `data` is provided, assume it's a base64-encoded JSON payload and decode it
            if (transactionObject.data) {
                const decodedPayloadJson = await decodeTransactions(transactionObject.data);
                payload = {
                sender: account.accountAddress,
                data: decodedPayloadJson,
                }
                transaction = await aptos.transaction.build.simple({
                sender: account.accountAddress,
                data: decodedPayloadJson,
                });
            } else {
                // Manually build payload
                const dataPayload = {
                function: "0x1::coin::transfer",
                typeArguments: ["0x1::aptos_coin::AptosCoin"],
                functionArguments: [transactionObject.to, transactionObject.value],
                };
                payload = {
                sender: account.accountAddress,
                data: dataPayload,
                }
                transaction = await aptos.transaction.build.simple({
                sender: account.accountAddress,
                data: dataPayload,
                });
            }
            
            let signedTxn = await aptos.transaction.sign({ signer: account, transaction });
            let signedTxn1 = signedTxn.bcsToBytes();
            const deserialixe = new Deserializer(Deserializer.fromHex(Hex.fromHexString(signedTxn.toString())));
            const de1 = AccountAuthenticator.deserialize(deserialixe);
            console.log(de1);
            const base64SignedTxn = Buffer.from(signedTxn).toString("base64");
            console.log(base64SignedTxn);
            return 0;
            // const rawTransaction = [transactionObject.data
            // ]

            // return { "rawTransaction": rawTransaction };

        }
        catch (error) {
            return error;
        }
    },

    signSendBatchTransactionsAptos: async (web3, transactionObject, options) => {
        /*
         * Function will sign and send the batch the transactions for ethereum based chains
         */

        try {
            const transaction = await batchRequestAptos(web3, transactionObject, options.privateKey);
            return transaction;
        }
        catch (error) {
            return (error);
        }
    }
};