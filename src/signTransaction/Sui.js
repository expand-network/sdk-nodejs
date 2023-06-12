const { TransactionBlock , ED25519Keypair, RawSigner } = require('@mysten/sui.js')

module.exports = {

    signTransactionSui: async (web3,transactionObject, options)=> {

        try{
            const secretKey = options.privateKey;
            const privateKeyBase64 = Buffer.from(secretKey,"hex").toString("base64"); // Convert hex to base64 string
            const keypair = ED25519Keypair.fromSecretKey(fromB64(privateKeyBase64));
            const signer = new RawSigner(keypair, web3);
            const tx = new TransactionBlock();
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(transactionObject.value)]);
            tx.transferObjects(
                [coin],
                tx.pure(
                    transactionObject.to
                )
            );
            const signedTransaction = await signer.signTransactionBlock({
                transactionBlock: tx,
            });
            return signedTransaction;

        } catch(error){
            return (error);

        }
    }
}