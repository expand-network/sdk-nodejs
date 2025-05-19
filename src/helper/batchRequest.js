const {Aptos, AptosConfig, 
  Network, Account, Ed25519PrivateKey } = require("@aptos-labs/ts-sdk")

module.exports = {
  batchRequestAptos: async (web3, transactionObject, options) => {
    try {
      let { privateKey } = options;
      const chainId = (options.chainId && options.chainId === "1400") ? "1" : "2";
      const aptos = new Aptos({ network:chainId==="1" ? Network.MAINNET : Network.TESTNET });
      privateKey = new Ed25519PrivateKey(privateKey);
      const account = Account.fromPrivateKey({ privateKey });

      let { data } = transactionObject;
      const transactions = base64Payloads.map((b64) => {
      const jsonStr = Buffer.from(b64, "base64").toString("utf-8");
      return JSON.parse(jsonStr);
      });
      const responses = await aptos.transaction.batch.forSingleAccount({
      sender: account,
      data: transactions,
      });
      // Extract transaction hashes
      const txHashes = responses.map((tx) => tx.hash);

      console.log("Batch submitted tx hashes:", txHashes);
      return txHashes;
    }
    catch (error) {
      console.error('Batch request failed:', error);
      throw error;
    }
  }
};
