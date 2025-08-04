import { fromB64 } from "@mysten/bcs";
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';



  const  signTransactionSui =  async (web3:any, transactionObject:any, options:any) => {

        try {
            // get the secretkey from options
            const secretKey = options.privateKey;
            const privateKeyBase64 = Buffer.from(secretKey, "hex").toString("base64"); // Convert hex to base64 string
            // Create the keypair from converted private key
            const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKeyBase64));
            // Create the transaction with given input
            const tx = new Transaction();
            // Currently we support sui coin transfer
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(transactionObject.value)]);
            // Add the instruction
            tx.transferObjects(
                [coin],
                tx.pure(
                    transactionObject.to
                )
            );
            // Sign the transaction
            const signedTransaction = await web3.signTransaction({
                transaction: tx,
                signer: keypair,
            });
            // Return the raw Transaction
            return { "rawTransaction": signedTransaction };

        } catch (error) {
            return (error);

        }
    };

    export { signTransactionSui };