const solanasdk = require('@solana/web3.js');
const nacl = require('tweetnacl');
var bs58 = require('bs58');

module.exports = {

signTransactionSolana: async(web3,transactionObject,options) => {
    /*
     * Function will sign the transaction payload for Solana Chain
     */
    
    try{
    
    const from = solanasdk.Keypair.fromSecretKey(bs58.decode(options.privateKey));

    // const toKey = solanasdk.Keypair.generate(transactionObject.to);
    
      let recentBlockhash = await web3.getRecentBlockhash();
      let manualTransaction = new solanasdk.Transaction({
          recentBlockhash: recentBlockhash.blockhash,
          feePayer: from.publicKey
      });
      manualTransaction.add(solanasdk.SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: transactionObject.to,
          lamports: transactionObject.value * solanasdk.LAMPORTS_PER_SOL
      }));
      
      let transactionBuffer = manualTransaction.serializeMessage();
      let signature = nacl.sign.detached(transactionBuffer, from.secretKey);
      
      manualTransaction.addSignature(from.publicKey, signature);
      
      let isVerifiedSignature = manualTransaction.verifySignatures();
      console.log(`The signatures were verifed: ${isVerifiedSignature}`)
      
      let serializedTx = manualTransaction.serialize();
      const rawTransaction = Buffer.from(serializedTx).toString("base64");
      return rawTransaction;
    }
    catch(error)
    {
        return error;
    }

}

}