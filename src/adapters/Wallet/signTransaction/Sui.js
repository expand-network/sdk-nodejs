const { TransactionBlock, Ed25519Keypair, RawSigner } = require('@mysten/sui.js');
const { fromB64 } = require("@mysten/bcs");

module.exports = {

    signTransactionSui: async (web3, transactionObject, options) => {

        try {
            // get the secretkey from options
            const secretKey = options.privateKey;
            const privateKeyBase64 = Buffer.from(secretKey, "hex").toString("base64"); // Convert hex to base64 string
            // Create the keypair from converted private key
            const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKeyBase64));
            // Create a signer with the provided keypair and network
            const signer = new RawSigner(keypair, web3);
            // Create the transaction with given input
            const tx = new TransactionBlock();
            // Currently we support sui coin transfer
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(transactionObject.value)]);
            // Add the instruction
            tx.transferObjects(
                [coin],
                tx.pure(
                    transactionObject.to
                )
            );
            // Sign the transaction Block
            const signedTransaction = await signer.signTransactionBlock({
                transactionBlock: tx,
            });
            // Return the raw Transaction
            return { "rawTransaction": signedTransaction };

        } catch (error) {
            return (error);

        }
    }
};