import Web3 from 'web3';

interface TransactionObject {
    to: string;
    value: string;
    gas: string;
    data?: string;
    // Add other properties as necessary
}

interface Options {
    privateKey: string;
}

 const signTransactionEvm:any = async (
    web3: Web3,
    transactionObject: TransactionObject,
    options: Options
): Promise<string> => {
    /*
     * Function will sign the transaction payload for Ethereum-based chains
     */

    try {
        const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, options.privateKey);
        return signedTransaction.rawTransaction as string;  // Assuming you need the raw transaction
    } catch (error) {
        console.error('Error signing transaction:', error);
        throw new Error('Transaction signing failed');
    }
};


export default { signTransactionEvm }; f