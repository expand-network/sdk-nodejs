const { Transaction, VersionedTransaction } = require('@solana/web3.js');
const { signVersionedTransactionSolana, signTransactionSolana } = require('../adapters/Wallet/signTransaction/Solana');

async function getNonce(web3, account) {
  const [pendingNonce, latestNonce] = await Promise.all([
    web3.eth.getTransactionCount(account, 'pending'), 
    web3.eth.getTransactionCount(account)
  ]);
  return Math.max(pendingNonce, latestNonce);
}

module.exports = {
  batchRequestEvm: async (web3, transactionObject, privateKey) => {
    try {
      const { transactions } = transactionObject;
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const initialNonce = await getNonce(web3, account.address);

      const batch = new web3.BatchRequest();
      const promises = [];
      let batches = transactions;

      if (typeof transactions === 'object' && transactions !== null && !Array.isArray(transactions)) {
        batches = Object.values(transactions);
      }
      for (let i = 0; i < batches.length; i+1) {
        const txParams = { ...batches[i], nonce: web3.utils.toHex(initialNonce + i) };
        const signedTx = await web3.eth.accounts.signTransaction(txParams, privateKey);

        const promise = new Promise((resolve, reject) => {
          batch.add(web3.eth.sendSignedTransaction.request(signedTx.rawTransaction, (err, data) => {
            if (err) {
              console.error('Error executing transaction:', err);
              reject(err);
            } else {
              console.log('Transaction Sent:', data);
              resolve(data);
            }
          }));
        });
        promises.push(promise);
      }

      await batch.execute();
      const transactionHash = await Promise.all(promises);
      return transactionHash;
    } catch (error) {
      console.error('Batch request failed:', error);
      throw error;
    }
  },
  batchRequestSolana: async (web3, transactionObject, options) => {
    try {
      const { transactions } = transactionObject;
      let batches = transactions;

      if (typeof transactions === 'object' && transactions !== null && !Array.isArray(transactions)) {
        batches = Object.values(transactions);
      }
      const rawTransactions = [];
      for (let i = 0; i < batches.length; i+1) {
        const buffer = Buffer.from(batches[i].data, "base64");
        let isVersioned = false;
        try {
          VersionedTransaction.deserialize(buffer);
          isVersioned = true;
        } catch {
          Transaction.from(buffer);
        }
        
        if (isVersioned) {
          const { rawTransaction } = signVersionedTransactionSolana(web3, batches[i], options);
          rawTransactions.push(rawTransaction);
        }
        else{
          const { rawTransaction }= signTransactionSolana(web3, batches[i], options);
          rawTransactions.push(rawTransaction);
        }
      }
      const receipts = [];
      for (const tx of rawTransactions) {
      try {
          const receipt = await web3.sendRawTransaction(Buffer.from(tx, "base64"));
          receipts.push(receipt);
      } catch (err) {
          return err;
      }
      }
      return { transactionHash: receipts };
    } catch (error) {
      console.error('Batch request failed:', error);
      throw error;
    }
  }
};
