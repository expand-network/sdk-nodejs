const { Aptos, Ed25519PrivateKey, 
    AccountAddress, Network, Account } = require("@aptos-labs/ts-sdk");
const config = require('../../../../configuration/config.json');

module.exports = {

    signTransactionAptos: async (web3, transactionObject, options) => {
        /*
         * Function will sign the transaction payload for Aptos chain
         */

        try {
            let { privateKey } = options;
            const chainId = (options.chainId && options.chainId === "1400") ? "1" : "2";
            const aptos = new Aptos({ network:chainId==="1" ? Network.MAINNET : Network.TESTNET });
            privateKey = new Ed25519PrivateKey(privateKey);
            const account = Account.fromPrivateKey({ privateKey });

            let { data } = transactionObject;

            let transaction;
            let payload;
            // If `data` is provided, assume it's a base64-encoded JSON payload and decode it
            if (transactionObject.data) {
                const decodedPayloadJson = JSON.parse(
                Buffer.from(transactionObject.data, "base64").toString("utf-8")
                );
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
            const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
            const signedTxn = await aptos.transaction.sign({ signer: account, transaction });
            const base64SignedTxn = Buffer.from(signedTxn).toString("base64");

            const rawTransaction = [base64Payload, base64SignedTxn]

            return { "rawTransaction": rawTransaction };

        }
        catch (error) {
            return error;
        }
    }
};