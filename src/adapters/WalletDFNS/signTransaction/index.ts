import * as Ethereum from './Ethereum';

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
  transactionObject: TransactionObject,
  options: Options
): Promise<any> => {
  const rawData = await Ethereum.signTransactionEvm(transactionObject, options);
  return rawData;
};
