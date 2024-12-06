// import Algorand from './Algorand';
import { signTransactionEvm } from './Ethereum';
// import Near from './Near';
// import Solana from './Solana';
// import Tron from './Tron';
// import Sui from './Sui';
// import Aptos from './Aptos';
// import StarkNet from './Starknet';

// export const signTransactionAlgorand = async (web3: any, transactionObject: any, options: any) => {

//     const rawData = await Algorand.signTransactionAlgorand(web3, transactionObject, options);
//     return rawData;

// };

export const signTransactionEvm = async (web3: any, transactionObject: any, options: any) => {
    const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, options.privateKey);
    return signedTransaction;
};

export default signTransactionEvm;

// exports.signTransactionNear = async (web3, transactionObject, options) => {

//     const rawData = await Near.signTransactionNear(web3, transactionObject, options);
//     return rawData;

// };

// exports.signTransactionTron = async (web3, transactionObject, options) => {

//     const rawData = await Tron.signTransactionTron(web3, transactionObject, options);
//     return rawData;
// };

// exports.signTransactionSolana = async (web3, transactionObject, options) => {

//     const rawData = await Solana.signTransactionSolana(web3, transactionObject, options);
//     return rawData;
// };

// exports.signTransactionSui = async (web3, transactionObject, options) => {

//     const rawData = await Sui.signTransactionSui(web3, transactionObject, options);
//     return rawData;
// };


// exports.signTransactionAptos = async (web3, transactionObject, options) => {

//     const rawData = await Aptos.signTransactionAptos(web3, transactionObject, options);
//     return rawData;
// };

// exports.signTransactionStarkNet = async (web3, transactionObject, options) => {

//     const rawData = await StarkNet.signTransactionStarkNet(web3, transactionObject, options);
//     return rawData;
// };

// exports.signVersionedTransactionSolana = async (web3, transactionObject, options) => {

//     const rawData = await Solana.signVersionedTransactionSolana(web3, transactionObject, options);
//     return rawData;
// };


