import algosdk, { Algodv2, SuggestedParams } from 'algosdk';

interface TransactionObject {
  from: string;
  to: string;
  gas: number | string;
  value: number | string;
}

interface Options {
  privateKey: string; // Mnemonic key
}

export const AlgorandUtils:any = {
  async signTransactionAlgorand(
    algorandWeb3: Algodv2,
    transactionObject: TransactionObject,
    options: Options
  ): Promise<{ rawTransaction: string } | Error> {
    /*
     * Function will sign the transaction payload for Algorand chain
     */

    try {
      // Fetch transaction parameters
      const params: SuggestedParams = await algorandWeb3.getTransactionParams().do();

      // Convert mnemonic key to secret key
      const account = algosdk.mnemonicToSecretKey(options.privateKey);

      // Create the payment transaction
      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: transactionObject.from,
        to: transactionObject.to,
        amount: Number(transactionObject.value), // Convert value to number
        suggestedParams: {
          ...params,
          fee: Number(transactionObject.gas), // Override fee
        },
        note: new Uint8Array(0), // Empty note
      });

      // Sign the transaction
      const signedTransaction = transaction.signTxn(account.sk);

      // Serialize transaction to base64
      const rawTransaction = Buffer.from(signedTransaction).toString('base64');

      return { rawTransaction };
    } catch (error) {
      return error as Error;
    }
  },
};
