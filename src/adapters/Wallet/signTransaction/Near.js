const nearAPI  = require('near-api-js');

const sha256 = require("js-sha256");

const {  KeyPair, keyStores } = nearAPI;


module.exports = {
    
    signTransactionNear: async(web3,transactionObject,options) => {
    /*
     * Function will sign the transaction payload for Near chain
     */

        try {
        
            const keyStore = new keyStores.InMemoryKeyStore();

            const keyPair = KeyPair.fromString(options.privateKey);

            // adds the key you just created to your keyStore which can hold multiple keys
            await keyStore.setKey(transactionObject.networkId, transactionObject.from, keyPair);

            // connect to NEAR
            const near = new nearAPI.providers.JsonRpcProvider(options.rpc);

            const publicKey = keyPair.getPublicKey();

            const actions = [nearAPI.transactions.transfer(transactionObject.value)];

            const accessKey = await near.query(
                `access_key/${transactionObject.from}/${publicKey.toString()}`,
                ""
            );
            
            // eslint-disable-next-line no-plusplus
            const nonce = ++accessKey.nonce;

            const recentBlockHash = nearAPI.utils.serialize.base_decode(
                accessKey.block_hash
            );

            const transaction = nearAPI.transactions.createTransaction(
                transactionObject.from,
                publicKey,
                transactionObject.to,
                nonce,
                actions,
                recentBlockHash
            );

            const serializedTx = nearAPI.utils.serialize.serialize(
                nearAPI.transactions.SCHEMA,
                transaction
            );

            const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx));

            const signature = keyPair.sign(serializedTxHash);

            const signedTransaction = new nearAPI.transactions.SignedTransaction({
                transaction,
                signature: new nearAPI.transactions.Signature({
                keyType: transaction.publicKey.keyType,
                data: signature.signature,
                }),
            });

            const rawTransaction = signedTransaction.encode().toString("base64");
            return {"rawTransaction":rawTransaction};

        }
        catch(error) {
            return error;
        }

    }

};