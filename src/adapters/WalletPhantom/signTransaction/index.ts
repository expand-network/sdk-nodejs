import * as Ethereum from './Ethereum';
import * as Solana from './Solana';

export const signTransactionEvm = async (
  web3: any,
  transactionObject: any,
  options: any
): Promise<any> => {
  const rawData = await Ethereum.signTransactionEvm(web3, transactionObject, options);
  return rawData;
};

export const signTransactionSolana = async (
  web3: any,
  transactionObject: any,
  options: any
): Promise<any> => {
  const rawData = await Solana.signTransactionSolana(web3, transactionObject, options);
  return rawData;
};

export const signVersionedTransactionSolana = async (
  web3: any,
  transactionObject: any,
  options: any
): Promise<any> => {
  const rawData = await Solana.signVersionedTransactionSolana(web3, transactionObject, options);
  return rawData;
};
