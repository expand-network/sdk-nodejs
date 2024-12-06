import * as Ethereum from './Ethereum';
import * as Solana from './Solana';

interface TransactionObject {
  to?: string;
  value?: string | number;
  gas?: number | string;
  chainId?: number;
  data?: string;
  [key: string]: any; // Additional properties for flexibility
}

interface Options {
  [key: string]: any; // Adjust based on your specific `options` structure
}

export const signTransactionEvm = async (
  transactionObject: TransactionObject,
  options: Options
): Promise<any> => {
  const rawData = await Ethereum.signTransactionEvm(transactionObject, options);
  return rawData;
};

export const signTransactionSolana = async (
  transactionObject: TransactionObject,
  options: Options
): Promise<any> => {
  const rawData = await Solana.signTransactionSolana(transactionObject, options);
  return rawData;
};
