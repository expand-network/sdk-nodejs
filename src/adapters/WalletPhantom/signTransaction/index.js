const Solana = require('./Solana');
const Ethereum = require('./Ethereum');

exports.signTransactionEvm = async (web3, transactionObject, options) => {
    const rawData = await Ethereum.signTransactionEvm(web3, transactionObject, options);
    return rawData;
};

exports.signSendBatchTransactionsEvm = async (web3, transactionObject, options) => {
    const rawData = await Ethereum.signSendBatchTransactionsEvm(web3, transactionObject, options);
    return rawData;
};

exports.signTransactionSolana = async (web3, transactionObject, options) => {
    const rawData = await Solana.signTransactionSolana(web3, transactionObject, options);
    return rawData;
};

exports.signVersionedTransactionSolana = async (web3, transactionObject, options) => {
    const rawData = await Solana.signVersionedTransactionSolana(web3, transactionObject, options);
    return rawData;
};
