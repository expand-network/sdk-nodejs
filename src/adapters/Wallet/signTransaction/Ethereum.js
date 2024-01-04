
module.exports = {
    


signTransactionEvm:async(web3,transactionObject, options) => {
    /*
     * Function will sign the transaction payload for ethereum based chains
     */

        try {

            const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, options.privateKey);
            return (signedTransaction);

        }
        catch(error){
            return(error);
        }
    
}

};
