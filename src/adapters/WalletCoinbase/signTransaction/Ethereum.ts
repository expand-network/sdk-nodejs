import Web3 from 'web3';

interface TransactionObject {
  to: string;
  value: string;
  gas?: string;
  gasPrice?: string;
  data?: string;
  nonce?: number; 
}

interface SignTransactionOptions {
  privateKey: string;
}

export const signTransactionEvm = async (
  web3: Web3,
  transactionObject: TransactionObject,
  options: SignTransactionOptions
): Promise<any> => {
  /*
   * Function will sign the transaction payload for Ethereum-based chains
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
