const Ethereum = require('./Ethereum');

exports.signTransactionEvm = async(transactionObject, options) =>{

    const rawData = await Ethereum.signTransactionEvm(transactionObject, options);
    return rawData;
};

