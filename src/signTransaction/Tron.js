const TronWeb = require('tronweb');

module.exports = {

    signTransactionTron: async(web3,transactionObject,options) => {

        try{
            const tronWeb = new TronWeb({
                fullHost: options.rpc,   
                privateKey: options.privateKey,
            });
            const tradeobj = await tronWeb.transactionBuilder.sendTrx(
                  tronWeb.address.toHex(transactionObject.to),
                  transactionObject.value,
                  tronWeb.address.toHex(transactionObject.from)
            );
            const signedtxn = await tronWeb.trx.sign(
                  tradeobj,
                  options.privateKey
            );

            const rawTransaction = Buffer.from(JSON.stringify(signedtxn)).toString("base64");
            return { 'rawTransaction': rawTransaction, 'transactionHash': signedtxn.txID };
    
          }
          catch(error){
            return error;
          }
    }

};