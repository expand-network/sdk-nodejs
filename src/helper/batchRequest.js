const {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
  TransactionWorkerEventsEnum,
  U64,
} = require("@aptos-labs/ts-sdk");

function convertTaggedU64(value) {
  if (Array.isArray(value)) {
    if (value.length === 2 && value[1] === "u64") return new U64(BigInt(value[0]));
    return value.map((v) => convertTaggedU64(v));
  }
  return value;
}

async function getNonce(web3, account) {
  const [pendingNonce, latestNonce] = await Promise.all([
    web3.eth.getTransactionCount(account, "pending"),
    web3.eth.getTransactionCount(account),
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

      if (
        typeof transactions === "object" &&
        transactions !== null &&
        !Array.isArray(transactions)
      ) {
        batches = Object.values(transactions);
      }
      for (let i = 0; i < batches.length; i++) {
        const txParams = {
          ...batches[i],
          nonce: web3.utils.toHex(initialNonce + i),
        };
        const signedTx = await web3.eth.accounts.signTransaction(
          txParams,
          privateKey
        );

        const promise = new Promise((resolve, reject) => {
          batch.add(
            web3.eth.sendSignedTransaction.request(
              signedTx.rawTransaction,
              (err, data) => {
                if (err) {
                  console.error("Error executing transaction:", err);
                  reject(err);
                } else {
                  console.log("Transaction Sent:", data);
                  resolve(data);
                }
              }
            )
          );
        });
        promises.push(promise);
      }

      await batch.execute();
      const transactionHash = await Promise.all(promises);
      return transactionHash;
    } catch (error) {
      console.error("Batch request failed:", error);
      throw error;
    }
  },
  batchRequestAptos: async (web3, transactionObject, privateKey) => {
    try {
      const config = new AptosConfig({
        network: transactionObject.chainId === "1400" ? Network.MAINNET : Network.TESTNET,
      });
      const aptos = new Aptos(config);
      const account = Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(privateKey),
      });
      const { transactions } = transactionObject;
      const decodedPayloads = Object.values(transactions).map((tx) => {
        const parsed = JSON.parse(Buffer.from(tx.data, "base64").toString());
        parsed.functionArguments = parsed.functionArguments.map((arg) =>
          convertTaggedU64(arg)
        );
        return parsed;
      });
      try {
            // Now add event listeners
        aptos.transaction.batch.on(TransactionWorkerEventsEnum.TransactionSent, (data) => {
          console.log("✅ Transaction Sent:", data.message);
          console.log("🔗 Transaction Hash:", data.transactionHash);
        });

        aptos.transaction.batch.on(TransactionWorkerEventsEnum.TransactionSendFailed, (data) => {
          console.warn("❌ Transaction Send Failed:", data.message);
        });

        aptos.transaction.batch.on(TransactionWorkerEventsEnum.TransactionExecuted, (data) => {
          console.log("🎉 Transaction Executed:", data.message);
        });

        aptos.transaction.batch.on(TransactionWorkerEventsEnum.TransactionExecutionFailed, (data) => {
          console.warn("💥 Transaction Execution Failed:", data.message);
        });

        aptos.transaction.batch.on(TransactionWorkerEventsEnum.ExecutionFinish, async (data) => {
          console.log("🛑 Execution Finished:", data.message);

        aptos.transaction.batch.removeAllListeners();
        });

        aptos.transaction.batch.forSingleAccount({
          sender: account,
          data: decodedPayloads,
        });
        return "Batch transaction submitted";
      } catch (error) {
        return "Transaction Failed";
      }
    } catch (error) {
      console.error("Batch request failed:", error);
      throw error;
    }
  },
};
