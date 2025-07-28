import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';

async function getNonce(web3: Web3, account: string): Promise<number> {
  const [pendingNonce, latestNonce] = await Promise.all([
    web3.eth.getTransactionCount(account, 'pending'), 
    web3.eth.getTransactionCount(account)
  ]);
  return Math.max(pendingNonce, latestNonce);
}

interface TransactionObject {
  transactions: TransactionConfig[] | Record<string, TransactionConfig>;
}

const batchRequestEvm = async (
  web3: Web3,
  transactionObject: TransactionObject,
  privateKey: string
): Promise<string[]> => {
  try {
    const { transactions } = transactionObject;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const initialNonce = await getNonce(web3, account.address);

    const batch = new web3.BatchRequest();
    const promises: Promise<string>[] = [];
    let batches: TransactionConfig[] = [];

    if (typeof transactions === 'object' && transactions !== null && !Array.isArray(transactions)) {
      batches = Object.values(transactions);
    } else if (Array.isArray(transactions)) {
      batches = transactions;
    }

    for (let i = 0; i < batches.length; i++) {
      const txParams: TransactionConfig = { 
        ...batches[i], 
        nonce: initialNonce + i  
      };

      const signedTx = await web3.eth.accounts.signTransaction(txParams, privateKey);
      
      if (!signedTx.rawTransaction) {
        throw new Error('Transaction signing failed: rawTransaction is undefined');
      }

      const promise = new Promise<string>((resolve, reject) => {
        batch.add(
          (web3.eth.sendSignedTransaction as any).request(
            signedTx.rawTransaction,
            (err: Error | null, hash: string) => {
              if (err) {
                console.error('Error executing transaction:', err);
                reject(err);
              } else {
                console.log('Transaction Sent:', hash);
                resolve(hash);
              }
            }
          )
        );
      });

      promises.push(promise);
    }

    await batch.execute();
    return await Promise.all(promises);
  } catch (error) {
    console.error('Batch request failed:', error);
    throw error;
  }
};

// Export the function
export { batchRequestEvm };