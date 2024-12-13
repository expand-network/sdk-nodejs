const { Wallet } = require('@project-serum/anchor');
const { Keypair, Transaction, SystemProgram, VersionedTransaction, 
    TransactionMessage, PublicKey } = require('@solana/web3.js')
const { sign } = require('tweetnacl');
const { decode } = require('bs58');
const BN = require('bn.js');

module.exports = {

  signTransactionSolana: async (web3, transactionObject, options) => {
    /*
     * Function will sign the transaction payload for Solana Chain
     */

    try {

      const from = Keypair.fromSecretKey(decode(options.privateKey));
      const blockHeight = await web3.getLatestBlockhash();
      let preparedTx;
      let transactionBuffer;

      if (!(transactionObject.data)) {
        transactionObject.value = new BN(transactionObject.value);
        preparedTx = new Transaction({
          blockhash: blockHeight.blockhash,
          lastValidBlockHeight: blockHeight + 1500,
          feePayer: from.publicKey
        });
        preparedTx.add(SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: transactionObject.to,
          lamports: transactionObject.value
        }));
      } else {
        if (transactionObject.from !== from.publicKey.toBase58()) {
          return {
            msg: "signer is not matching with the from address"
          }
        };
        let buffer = Buffer.from(transactionObject.data, "base64");
        preparedTx = Transaction.from(buffer);
        preparedTx.recentBlockhash = blockHeight.blockhash;
      }

      transactionBuffer = preparedTx.serializeMessage();
      const signature = sign.detached(transactionBuffer, from.secretKey);
      preparedTx.addSignature(from.publicKey, signature);
      if (transactionObject.additionalSigners) {
        const additionalKey = Keypair.fromSecretKey(decode(transactionObject.additionalSigners));
        const signature = sign.detached(transactionBuffer, additionalKey.secretKey);
        preparedTx.addSignature(additionalKey.publicKey, signature);
      }
      const serializedTx = preparedTx.serialize();
      const rawTransaction = Buffer.from(serializedTx).toString("base64");
      return { "rawTransaction": rawTransaction };
    }
    catch (error) {
      return error;
    }
  },

 signVersionedTransactionSolana: async (web3, transactionObject, options) => {
    /*
     * Function will sign the transaction payload for Solana Chain
     */

    try {

      const from = Keypair.fromSecretKey(decode(options.privateKey));
      const wallet = new Wallet(from);
      let recentBlockhash = await web3.getLatestBlockhash();
      let preparedTx;

      if (!(transactionObject.data)) {
        const instructions = [
          SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: new PublicKey(transactionObject.to),
            lamports: transactionObject.value,
          }),
        ];
        const versionedMessage = new TransactionMessage({
          payerKey: from.publicKey,
          recentBlockhash: recentBlockhash.blockhash,
          instructions
        }).compileToV0Message();
        preparedTx = new VersionedTransaction(versionedMessage);
      } else {
        if (transactionObject.from !== from.publicKey.toBase58()) {
          return {
            msg: "signer is not matching with the from address"
          }
        };
        let buffer = Buffer.from(transactionObject.data, "base64");
        preparedTx = VersionedTransaction.deserialize(buffer);
      }

      preparedTx.sign([wallet.payer]);
      if (transactionObject.additionalSigners) {
        preparedTx.sign([Keypair.fromSecretKey(decode(transactionObject.additionalSigners))]);
      }
      const serializedTx = preparedTx.serialize();
      const rawTransaction = Buffer.from(serializedTx).toString("base64");
      return { "rawTransaction": rawTransaction };
    }
    catch (error) {
      return error;
    }
  }
};
