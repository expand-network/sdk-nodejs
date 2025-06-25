const TronWeb = require('tronweb');

module.exports = {

  signTransactionTron: async (web3, transactionObject, options) => {
    const { from, to, data, value } = transactionObject;

    try {
      const tronWeb = new TronWeb({
        fullHost: options.rpc
      });

      let transaction;
      if (!data) {
        transaction = await tronWeb.transactionBuilder.sendTrx(tronWeb.address.toHex(to), value, tronWeb.address.toHex(from));   
      } else {
        transaction = JSON.parse(atob(data));
      };

      const signedTx = await tronWeb.trx.sign(
        transaction,
        options.privateKey
      );

      const rawTransaction = btoa(JSON.stringify(signedTx));
      return { "rawTransaction": rawTransaction };
    }
    catch (error) {
      return error;
    }
  }
};
