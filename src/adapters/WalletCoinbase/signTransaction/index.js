const Ethereum = require('./Ethereum');

exports.signTransactionEvm = async (web3, transactionObject, options) => {
    const rawData = await Ethereum.signTransactionEvm(web3, transactionObject, options);
    return rawData;
};

exports.signSendBatchTransactionsEvm = async (web3, transactionObject, options) => {
    const rawData = await Ethereum.signSendBatchTransactionsEvm(web3, transactionObject, options);
    return rawData;
};
