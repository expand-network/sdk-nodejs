import algosdk from 'algosdk';

class Algorand {
    signTransactionAlgorand = async (algorandWeb3: any, transactionObject: any, options: any) => {
        /*
         * Function will sign the transaction payload for Algorand chain
         */
        try {
            const params = await algorandWeb3.getTransactionParams().do();

            // Here private key is the menmonic key
            const account = algosdk.mnemonicToSecretKey(options.privateKey);

            const transaction = {
                "from": transactionObject.from,
                "to": transactionObject.to,
                "fee": Number(transactionObject.gas),
                "amount": Number(transactionObject.value),
                "firstRound": params.firstRound,
                "lastRound": params.lastRound,
                "genesisID": params.genesisID,
                "genesisHash": params.genesisHash,
                "note": new Uint8Array(0)
            };

            const signedTransaction = algosdk.signTransaction(transaction, account.sk);
            const rawTransaction = Buffer.from(signedTransaction.blob).toString("base64");

            return {"rawTransaction":rawTransaction};
        }
        catch (error) {
            return error;
        }
    }
}

export default new Algorand();