export const signTransactionEvm = async (
    web3: any,
    transactionObject: Record<string, any>,
    options: { privateKey: string }
  ): Promise<any> => {
    /**
     * Function to sign the transaction payload for Ethereum-based chains
     */
    try {
      const signedTransaction = await web3.eth.accounts.signTransaction(
        transactionObject,
        options.privateKey
      );
      return signedTransaction;
    } catch (error) {
      return error;
    }
  };
  