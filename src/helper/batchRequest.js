const {Aptos, AptosConfig, Network, 
      Account, Ed25519PrivateKey } = require("@aptos-labs/ts-sdk");



module.exports = {
  batchRequestAptos: async (web3, transactionObject, privateKey) => {
    try {
      const chainId = (transactionObject.chainId && transactionObject.chainId === "1400") ? "1" : "2";
      const config = new AptosConfig({network:chainId==="1" ? Network.MAINNET : Network.DEVNET});
      const aptos = new Aptos(config);
      privateKey = new Ed25519PrivateKey(privateKey);
      const account = Account.fromPrivateKey({ privateKey });
      await aptos.account.getAccountInfo({ accountAddress: account.accountAddress });
      let transactions = transactionObject.transactions;
      const decodedTransactions = await decodeTransactions(transactions, false);
      try{
        await aptos.transaction.batch.forSingleAccount({
        sender: account,
        data: decodedTransactions,
        });
        return "Transaction Successful"
        }catch(error){
          return "Transaction Failed"
        }
      // Extract transaction hashes
      // const txHashes = responses.map((tx) => tx.hash);

      // console.log("Batch submitted tx hashes:", txHashes);
      return responses;
    }
    catch (error) {
      console.error('Batch request failed:', error);
      throw error;
    }
  }
};