const {
  Aptos,
  Ed25519PrivateKey,
  RawTransaction,
  Deserializer,
  SimpleTransaction,
  AptosConfig,
  Network,
  Account,
} = require("@aptos-labs/ts-sdk");
const { batchRequestAptos } = require("../../../helper/batchRequest");
const TEN_SECONDS = 600;
module.exports = {
  signTransactionAptos: async (web3, transactionObject, options) => {
    /*
     * Function will sign the transaction payload for Aptos chain
     */

    try {
      let { privateKey } = options;
      const config = new AptosConfig({
        network: options.chainId === "1400" ? Network.MAINNET : Network.TESTNET,
      });
      const aptos = new Aptos(config);
      const account = Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(privateKey),
      });
      let transaction;
      if (transactionObject.data) {
        transaction = new SimpleTransaction(
          RawTransaction.deserialize(
            Deserializer.fromHex(transactionObject.data)
          )
        );
      } else {
        const dataPayload = {
          function: "0x1::coin::transfer",
          typeArguments: ["0x1::aptos_coin::AptosCoin"],
          functionArguments: [
            transactionObject.to,
            Number(transactionObject.value),
          ],
        };
        transaction = await aptos.transaction.build.simple({
          sender: account.accountAddress,
          data: dataPayload,
          options: {
            expireTimestamp: Math.floor(Date.now() / 1000) + TEN_SECONDS,
          },
        });
      }
      const signedTxn = aptos.transaction.sign({
        signer: account,
        transaction,
      });
      const signedTxn1 = signedTxn.bcsToHex().toString();
      const rawTransaction = [transaction.bcsToHex().toString(), signedTxn1];

      return { rawTransaction: rawTransaction };
    } catch (error) {
      return error;
    }
  },

  signSendBatchTransactionsAptos: async (web3, transactionObject, options) => {
    /*
     * Function will sign and send the batch the transactions for ethereum based chains
     */

    try {
      const transaction = await batchRequestAptos(
        web3,
        transactionObject,
        options.privateKey
      );
      return transaction;
    } catch (error) {
      return error;
    }
  },
};
