// const Web3 = require('web3');

const { batchRequestEvm } = require("../../../helper/batchRequest");


module.exports = {



    signTransactionEvm: async (web3, transactionObject, options) => {
        /*
         * Function will sign the transaction payload for ethereum based chains
         */

        try {

            const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, options.privateKey);
            return (signedTransaction);

        }
        catch (error) {
            return (error);
        }

    },

    signSendBatchTransactionsEvm: async (web3, transactionObject, options) => {
        /*
         * Function will sign and send the batch the transactions for ethereum based chains
         */

        try {
            const transaction = await batchRequestEvm(web3, transactionObject, options.privateKey);
            return transaction;
        }
        catch (error) {
            return (error);
        }
    }
};
