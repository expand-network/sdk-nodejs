const Web3 = require('web3');

// Connect to Ethereum network
const web3 = new Web3("https://aged-bold-general.quiknode.pro/aca755115e18fb7c58c55a9e7c1af78e55e9cde2/");

async function getNonce(account) {
  const pendingNonce = await web3.eth.getTransactionCount(account, 'pending');
  const latestNonce = await web3.eth.getTransactionCount(account);
  return Math.max(pendingNonce, latestNonce);
}

module.exports = {
  batchRequest: async (transactionObjects, privateKey, account) => {
    if (transactionObjects.length > 0) {
      let count = 0;
      const batch = new web3.BatchRequest();
      // let nonce = await getNonce(account);
      // console.log("nonce --", nonce)
      while (transactionObjects.length > count) {
        let nonce = await getNonce(account);
        console.log("nonce --", nonce);
        
        const signedTx = await web3.eth.accounts.signTransaction({ ...transactionObjects[count], nonce: nonce + count }, privateKey);
        console.log('Transaction Signed:', signedTx);

        await new Promise((resolve, reject) => {
          batch.add(web3.eth.sendSignedTransaction.request(signedTx.rawTransaction, (err, data) => {
            if (err) {
              console.error('Error executing approve transaction:', err);
              reject(err);
            } else {
              console.log('Transaction Sent:', data);
              resolve(data);
            }
          }));
        });
        count++;
      }
      await batch.execute()
    }
    return false;
  }
};