const {Aptos, AptosConfig, Network, 
      Account, AccountAddress, Ed25519PrivateKey, InputGenerateTransactionPayloadData } = require("@aptos-labs/ts-sdk");

function castArgument(arg, type) {
  switch (type) {
    case "address":
      return AccountAddress.fromString(arg);
    case "u64":
      return BigInt(arg);
    case "string":
      return String(arg);
    default:
      return arg; // fallback to original
  }
}
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
      const decodedTransactions = Object.values(transactions).map((tx) => {
        const jsonStr = Buffer.from(tx.data, "base64").toString("utf-8");
        const parsed = JSON.parse(jsonStr);

        const types = parsed.argumentsTypes || [];
        parsed.functionArguments = parsed.functionArguments.map((arg, idx) => castArgument(arg, types[idx]));

        return {
                function: parsed.function,
                functionArguments:parsed.functionArguments,
                typeArguments: parsed.typeArguments || []
                };
      });
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
