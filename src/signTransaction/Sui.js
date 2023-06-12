const { TransactionBlock , Ed25519Keypair, RawSigner } = require('@mysten/sui.js');
const { fromB64 } = require("@mysten/bcs");

module.exports = {

    signTransactionSui: async (web3,transactionObject, options)=> {

        try{
            const secretKey = options.privateKey;
            const privateKeyBase64 = Buffer.from(secretKey,"hex").toString("base64"); // Convert hex to base64 string
            const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKeyBase64));
            const signer = new RawSigner(keypair, web3);
            const tx = new TransactionBlock();
            console.log(tx);
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(transactionObject.value)]);
            console.log([coin]);
            tx.transferObjects(
                [coin],
                tx.pure(
                    transactionObject.to
                )
            );
            console.log(tx);
            const signedTransaction = await signer.signTransactionBlock({
                transactionBlock: tx,
            });
            return signedTransaction;

        } catch(error){
            return (error);

        }
    }
};