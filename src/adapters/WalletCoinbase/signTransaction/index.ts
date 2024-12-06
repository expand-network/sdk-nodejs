import * as Ethereum from './Ethereum';



export const signTransactionEvm = async (web3: any, transactionObject: any, options:any) => {

    const rawData = await Ethereum.signTransactionEvm(web3, transactionObject, options);
    return rawData;
};

