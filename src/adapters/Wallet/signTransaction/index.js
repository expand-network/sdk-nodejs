const Algorand = require('./Algorand');
const Ethereum = require('./Ethereum');
const Near = require('./Near');
const Solana = require('./Solana');
const Tron = require('./Tron');
const Sui = require('./Sui');
const Aptos = require('./Aptos');
const StarkNet = require('./Starknet');

exports.signTransactionAlgorand = async (web3, transactionObject, options) => {

    const rawData = await Algorand.signTransactionAlgorand(web3, transactionObject, options);
    return rawData;

};

exports.signTransactionEvm = async (web3, transactionObject, options) => {

    const rawData = await Ethereum.signTransactionEvm(web3, transactionObject, options);
    return rawData;
};

exports.signTransactionNear = async (web3, transactionObject, options) => {

    const rawData = await Near.signTransactionNear(web3, transactionObject, options);
    return rawData;

};

exports.signTransactionTron = async (web3, transactionObject, options) => {

    const rawData = await Tron.signTransactionTron(web3, transactionObject, options);
    return rawData;
};

exports.signTransactionSolana = async (web3, transactionObject, options) => {

    const rawData = await Solana.signTransactionSolana(web3, transactionObject, options);
    return rawData;
};

exports.signTransactionSui = async (web3, transactionObject, options) => {

    const rawData = await Sui.signTransactionSui(web3, transactionObject, options);
    return rawData;
};


exports.signTransactionAptos = async (web3, transactionObject, options) => {

    const rawData = await Aptos.signTransactionAptos(web3, transactionObject, options);
    return rawData;
};

exports.signTransactionStarkNet = async (web3, transactionObject, options) => {

    const rawData = await StarkNet.signTransactionStarkNet(web3, transactionObject, options);
    return rawData;
};

exports.signVersionedTransactionSolana = async (web3, transactionObject, options) => {

    const rawData = await Solana.signVersionedTransactionSolana(web3, transactionObject, options);
    return rawData;
};


