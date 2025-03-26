const { ethers } = require("ethers");

module.exports = {



    signTransactionEvm: async (web3, transactionObject, options) => {
        /*
         * Function will sign the transaction payload for ethereum based chains
         */

        try {
            const wallet = new ethers.Wallet(options.privateKey, web3);
            const signedTransaction = await wallet.signTransaction(transactionObject);
            return (signedTransaction);

        }
        catch (error) {
            return (error);
        }

    }

};
