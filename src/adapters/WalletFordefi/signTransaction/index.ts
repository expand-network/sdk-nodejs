import  Ethereum from './Ethereum';
import Solana from './Solana';


 const signTransactionEvm = async (
    transactionObject: any,
    options: any
): Promise<any> => {
    const rawData = await Ethereum.signTransactionEvm(transactionObject, options);
    return rawData;
};

 const signTransactionSolana = async (
    transactionObject: any,
    options: any
): Promise<any> => {
    const rawData = await Solana.signTransactionSolana(transactionObject, options);
    return rawData;
};

export { signTransactionEvm, signTransactionSolana  };