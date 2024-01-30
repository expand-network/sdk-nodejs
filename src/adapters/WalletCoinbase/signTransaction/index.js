const Ethereum = require('./Ethereum');



exports.signTransactionEvm = async (web3, transactionObject, options) =>{

    const rawData = await Ethereum.signTransactionEvm(web3, transactionObject, options);
    return rawData;
};

