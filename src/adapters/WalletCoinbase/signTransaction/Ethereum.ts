import Web3 from "web3";

interface TransactionObject {
  to: string;
  value: string | number;
  gas: number | string;
  gasPrice?: number | string;
  data?: string;
  nonce?: number;
}

interface Options {
  privateKey: string;
}

export const signTransactionEvm = async (
  web3: Web3,
  transactionObject: TransactionObject,
  options: Options
): Promise<Web3.eth.SignedTransaction | Error> => {
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
    return error as Error;
  }
};
