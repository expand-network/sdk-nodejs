const { Ed25519Keypair } = require("@mysten/sui/keypairs/ed25519");
const { Transaction } = require("@mysten/sui/transactions");

module.exports = {

    signTransactionSui: async (web3, transactionObject, options) => {
        const { to, value } = transactionObject;
        let { data } = transactionObject;

        let tx;
        try {
            const secretKey = options.privateKey;
            const signer = Ed25519Keypair.fromSecretKey(secretKey);

            if (data){
                data = JSON.parse(atob(data));
                tx = Transaction.from(JSON.stringify(data));
            } else {
                tx = new Transaction();

                const [coin] = tx.splitCoins(tx.gas, [value.toString()]);
                tx.transferObjects([coin], to);
            }

            const { bytes, signature } = await tx.sign({signer, client: web3, onlyTransactionKind: false});
            return { rawTransaction: bytes, signature };
        } catch (error) {
            return (error);
        }
    }
};
