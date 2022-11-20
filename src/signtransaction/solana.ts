import solanaSdk from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export default class Solana {
    signTransactionSolana = async (web3: any, transactionObject: any, options: any) => {
        /*
         * Function will sign the transaction payload for Solana Chain
         */

        try {

            const from = solanaSdk.Keypair.fromSecretKey(bs58.decode(options.privateKey));

            // const toKey = solanasdk.Keypair.generate(transactionObject.to);

            const recentBlockhash = await web3.getRecentBlockhash();
            const manualTransaction = new solanaSdk.Transaction({
                recentBlockhash: recentBlockhash.blockhash,
                feePayer: from.publicKey
            });
            manualTransaction.add(solanaSdk.SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: transactionObject.to,
                lamports: transactionObject.value
            }));

            const transactionBuffer = manualTransaction.serializeMessage();
            const signature: any = nacl.sign.detached(transactionBuffer, from.secretKey);

            manualTransaction.addSignature(from.publicKey, signature);

            // const isVerifiedSignature = manualTransaction.verifySignatures();
            //   console.log(`The signatures were verifed: ${isVerifiedSignature}`);

            const serializedTx = manualTransaction.serialize();
            const rawTransaction = Buffer.from(serializedTx).toString("base64");
            return rawTransaction;
        }
        catch (error) {
            return error;
        }

    }
}