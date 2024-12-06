import { Wallet, providers } from "ethers";

interface TransactionObject {
  to: string;
  value: string | number;
  gas: number | string;
  chainId: number;
  data?: string;
}

interface Options {
  wallet: Wallet;
  rpcProvider: providers.JsonRpcProvider;
}

interface SignedTransactionResponse {
  rawTransaction: string;
}

export const signTransactionEvm = async (
  transactionObject: TransactionObject,
  options: Options
): Promise<SignedTransactionResponse | Error> => {
  /*
   * Function will sign the transaction payload for Ethereum-based chains
   */
  try {
    const nonce = await options.rpcProvider.getTransactionCount(
      await options.wallet.getAddress(),
      "latest"
    );

    const tx = {
      nonce,
      to: transactionObject.to,
      data: transactionObject.data,
      value: transactionObject.value,
      gas: transactionObject.gas,
      chainId: transactionObject.chainId,
      maxFeePerGas: "120000000000", // Set these values as required
      maxPriorityFeePerGas: "120000000000",
      gasLimit: transactionObject.gas,
    };

    const signedTx = await options.wallet.signTransaction(tx);
    const response: SignedTransactionResponse = { rawTransaction: signedTx };

    return response;
  } catch (error) {
    return error as Error;
  }
};
