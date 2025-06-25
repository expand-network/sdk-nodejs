const nearAPI = require('near-api-js');
const BN = require('bn.js');
const sha256 = require("js-sha256");

const { KeyPair, keyStores } = nearAPI;


module.exports = {

    signTransactionNear: async (web3, transactionObject, options) => {
        /*
         * Function will sign the transaction payload for Near chain
         */
    
        try {
            const keyStore = new keyStores.InMemoryKeyStore();
            const keyPair = KeyPair.fromString(options.privateKey);
    
            await keyStore.setKey(transactionObject.networkId, transactionObject.from, keyPair);
    
            const near = new nearAPI.providers.JsonRpcProvider(options.rpc);
            const publicKey = keyPair.getPublicKey();
    
            const accessKey = await near.query(
                `access_key/${transactionObject.from}/${publicKey.toString()}`,
                ""
            );
    
            const recentBlockHash = nearAPI.utils.serialize.base_decode(accessKey.block_hash);
            let nonce = accessKey.nonce;
    

    
            if (transactionObject.data) {
                const signedTransactions = [];
                if (!Array.isArray(transactionObject.data)) {
                    transactionObject.data = [transactionObject.data];
                }

                for (let i = 0; i < transactionObject.data.length; i += 1) {
                    const decodedTransaction = JSON.parse(
                        Buffer.from(transactionObject.data[i], 'base64').toString('utf-8')
                    );
                    const actions = decodedTransaction.actions
                                    ? decodedTransaction.actions.map((action) => {
                                        const { methodName, args, gas, deposit } = action.params;

                                        if (!deposit) {
                                            return nearAPI.transactions.functionCall(
                                                methodName,
                                                args,
                                                new BN(gas)
                                            );
                                        }
                                        return nearAPI.transactions.functionCall(
                                            methodName,
                                            args,
                                            new BN(gas),
                                            new BN(deposit)
                                        );
                                    })
                                    : decodedTransaction.functionCalls
                                    ? decodedTransaction.functionCalls.map((funcCall) => {
                                        const { methodName, args, gas, amount } = funcCall;
                                        const validAmount = amount ? new BN(amount.replace(/\./g, '')) : new BN(0);
                                        // Ensure `args` is passed correctly
                                        return nearAPI.transactions.functionCall(
                                            methodName,
                                            args,
                                            new BN(gas),
                                            validAmount
                                        );
                                    })
                                    : [];
    
                    const tx = nearAPI.transactions.createTransaction(
                        transactionObject.from,
                        publicKey,
                        decodedTransaction.receiverId,
                        ++nonce,
                        actions,
                        recentBlockHash
                    );
                    const serializedTx = nearAPI.utils.serialize.serialize(
                        nearAPI.transactions.SCHEMA.Transaction,
                        tx
                    );
                    const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx));
                    const signature = keyPair.sign(serializedTxHash);
    
                    const signedTx = new nearAPI.transactions.SignedTransaction({
                        transaction: tx,
                        signature: new nearAPI.transactions.Signature({
                            keyType: tx.publicKey.keyType,
                            data: signature.signature,
                        }),
                    });
                    const rawTransaction = Buffer.from(signedTx.encode()).toString('base64');
                    signedTransactions.push(rawTransaction);
                }
    
                return { rawTransaction: signedTransactions };
            } else {
                const actions = [nearAPI.transactions.transfer(transactionObject.value)];
                const transaction = nearAPI.transactions.createTransaction(
                    transactionObject.from,
                    publicKey,
                    transactionObject.to,
                    ++nonce,
                    actions,
                    recentBlockHash
                );
    
                const serializedTx = nearAPI.utils.serialize.serialize(
                    nearAPI.transactions.SCHEMA.Transaction,
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
    
                // Encode the single signed transaction to base64 and return as an array
                const rawTransaction = Buffer.from(signedTransaction.encode()).toString('base64');
                return { rawTransaction: [rawTransaction] };
            }
        } catch (error) {
            return error;
        }
    }
};