import Ethereum from './Ethereum';


export const signTransactionEvm = async (
  transactionObject: any,
  options: any
): Promise<any> => {
  const rawData = await Ethereum.signTransactionEvm(transactionObject, options);
  return rawData;
};
