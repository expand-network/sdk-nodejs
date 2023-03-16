const solanasdk = require('@solana/web3.js');
const nacl = require('tweetnacl');
const bs58 = require('bs58');

module.exports = {

signTransactionSolana: async(web3,transactionObject,options) => {
    /*
     * Function will sign the transaction payload for Solana Chain
     */
    
    try{
    
    const from = solanasdk.Keypair.fromSecretKey(bs58.decode(options.privateKey));

    // const toKey = solanasdk.Keypair.generate(transactionObject.to);
    
      const recentBlockhash = await web3.getRecentBlockhash();
      const manualTransaction = new solanasdk.Transaction({
          recentBlockhash: recentBlockhash.blockhash,
          feePayer: from.publicKey
      });
      manualTransaction.add(solanasdk.SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: transactionObject.to,
          lamports: transactionObject.value
      }));
      
      const transactionBuffer = manualTransaction.serializeMessage();
      const signature = nacl.sign.detached(transactionBuffer, from.secretKey);
      
      manualTransaction.addSignature(from.publicKey, signature);
      const transactionHash = bs58.encode(manualTransaction.signatures[0].signature);
    // const isVerifiedSignature = manualTransaction.verifySignatures();
    //   console.log(`The signatures were verifed: ${isVerifiedSignature}`);
      
      const serializedTx = manualTransaction.serialize();
      const rawTransaction = Buffer.from(serializedTx).toString("base64");
      return { "rawTransaction": rawTransaction, "transactionHash": transactionHash };
    }
    catch(error)
    {
        return error;
    }

}

};