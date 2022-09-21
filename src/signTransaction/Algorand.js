const algosdk=require('algosdk');

module.exports ={
    
    signTransactionAlgorand: async(algorandWeb3, transactionObject, options) => {
    /*
     * Function will sign the transaction payload for Algorand chain
     */

        try {

            let params = await algorandWeb3.getTransactionParams().do();
            
            // Here private key is the menmonic key
            var account = algosdk.mnemonicToSecretKey(options.privateKey);

            transaction = {
                "from": transactionObject.from,
                "to": transactionObject.to,
                "fee": transactionObject.gas,
                "amount": Number(transactionObject.value),
                "firstRound": params.firstRound,
                "lastRound": params.lastRound,
                "genesisID": params.genesisID,
                "genesisHash": params.genesisHash,
                "note": new Uint8Array(0)
            };

            var signedTransaction = algosdk.signTransaction(transaction, account.sk);
            rawTransaction = Buffer.from(signedTransaction.blob).toString("base64");

            return rawTransaction;
        }
        catch(error)
        {
            return error;
        }

}

}

