 import * as Algorand from './Algorand';
import * as Aptos from './Aptos';
import  Ethereum   from './Ethereum';
 import * as Near from './Near';
 import * as Solana from './Solana';
 import * as Sui from './Sui';
import * as Tron from './Tron';
// import StarkNet from './Starknet';

const signTransactionAlgorand:any = async (web3: any, transactionObject: any, options: any) => {

    const rawData = await Algorand.AlgorandUtils.signTransactionAlgorand(web3, transactionObject, options);
    return rawData;

};

const signTransactionEvm:any = async (web3: any, transactionObject: any, options: any) => {
    const rawData = await Ethereum.signTransactionEvm(web3, transactionObject, options);
    return rawData;
};



const signTransactionNear = async (web3:any, transactionObject:any , options:any) => {

    const rawData = await Near.signTransactionNear(web3, transactionObject, options);
    return rawData;

};

const signTransactionTron = async (web3:any, transactionObject:any, options:any) => {

   const rawData = await Tron.signTransactionTron(web3, transactionObject, options);
     return rawData;
 };

const signTransactionSolana:any = async (web3:any, transactionObject:any, options:any) => {

    const rawData = await Solana.SolanaUtils.signVersionedTransactionSolana(web3, transactionObject, options);
    return rawData;
};

const signTransactionSui = async (web3:any, transactionObject:any, options:any) => {

    const rawData = await Sui.signTransactionSui(web3, transactionObject, options);
    return rawData;
};


const signTransactionAptos = async (web3:any, transactionObject:any, options:any) => {

    const rawData = await Aptos.signTransactionAptos(web3, transactionObject, options);
    return rawData;
};

// exports.signTransactionStarkNet = async (web3, transactionObject, options) => {

//     const rawData = await StarkNet.signTransactionStarkNet(web3, transactionObject, options);
//     return rawData;
// };

const signVersionedTransactionSolana = async (web3:any, transactionObject:any, options:any) => {

    const rawData = await Solana.SolanaUtils.signVersionedTransactionSolana(web3, transactionObject, options);
    return rawData;
};


export  {signTransactionEvm, 
         signTransactionSolana, 
         signVersionedTransactionSolana, 
         signTransactionAlgorand, 
         signTransactionNear, 
         signTransactionSui,
         signTransactionTron,
         signTransactionAptos,};