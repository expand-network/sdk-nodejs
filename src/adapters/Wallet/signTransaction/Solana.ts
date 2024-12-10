import { Wallet } from '@project-serum/anchor';
import {
  Keypair,
  Transaction,
  SystemProgram,
  VersionedTransaction,
  TransactionMessage,
  PublicKey,
  Connection,
} from '@solana/web3.js';
import { sign } from 'tweetnacl';
import { decode } from 'bs58';
import BN from 'bn.js';

interface TransactionObject {
  data?: string;
  from?: string;
  to: string;
  value?: number | BN;
  additionalSigners?: string;
}

interface Options {
  privateKey: string;
}

export const SolanaUtils:any = {
  async signTransactionSolana(
    web3: Connection,
    transactionObject: TransactionObject,
    options: Options
  ): Promise<{ rawTransaction: string } | Error | { msg: string }> {
    /*
     * Function will sign the transaction payload for Solana Chain
     */
    try {
      const from = Keypair.fromSecretKey(decode(options.privateKey));
      const blockHeight = await web3.getLatestBlockhash();
      let preparedTx: Transaction;
      let transactionBuffer: Buffer;

      if (!transactionObject.data) {
        transactionObject.value = new BN(transactionObject.value || 0);
        preparedTx = new Transaction({
          blockhash: blockHeight.blockhash,
          lastValidBlockHeight: blockHeight.lastValidBlockHeight + 1500,
          feePayer: from.publicKey,
        });
        preparedTx.add(
          SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: new PublicKey(transactionObject.to),
            lamports: transactionObject.value.toNumber(),
          })
        );
      } else {
        if (transactionObject.from !== from.publicKey.toBase58()) {
          return { msg: 'Signer is not matching with the from address' };
        }
        const buffer = Buffer.from(transactionObject.data, 'base64');
        preparedTx = Transaction.from(buffer);
        preparedTx.recentBlockhash = blockHeight.blockhash;
      }

      transactionBuffer = preparedTx.serializeMessage();
      const signature = sign.detached(transactionBuffer, from.secretKey);
      preparedTx.addSignature(from.publicKey, signature);

      if (transactionObject.additionalSigners) {
        const additionalKey = Keypair.fromSecretKey(decode(transactionObject.additionalSigners));
        const additionalSignature = sign.detached(transactionBuffer, additionalKey.secretKey);
        preparedTx.addSignature(additionalKey.publicKey, additionalSignature);
      }

      const serializedTx = preparedTx.serialize();
      const rawTransaction = Buffer.from(serializedTx).toString('base64');
      return { rawTransaction };
    } catch (error) {
      return error as Error;
    }
  },

  async signVersionedTransactionSolana(
    web3: Connection,
    transactionObject: TransactionObject,
    options: Options
  ): Promise<{ rawTransaction: string } | Error | { msg: string }> {
    
    try {
      const from = Keypair.fromSecretKey(decode(options.privateKey));
      const wallet = new Wallet(from);
      const recentBlockhash = await web3.getRecentBlockhash();
      let preparedTx: VersionedTransaction;

      if (!transactionObject.data) {
        const instructions = [
          SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: new PublicKey(transactionObject.to),
            lamports: transactionObject.value instanceof BN ? transactionObject.value.toNumber() : transactionObject.value || 0,
          }),
        ];
        const versionedMessage = new TransactionMessage({
          payerKey: from.publicKey,
          recentBlockhash: recentBlockhash.blockhash,
          instructions,
        }).compileToV0Message();
        preparedTx = new VersionedTransaction(versionedMessage);
      } else {
        if (transactionObject.from !== from.publicKey.toBase58()) {
          return { msg: 'Signer is not matching with the from address' };
        }
        const buffer = Buffer.from(transactionObject.data, 'base64');
        preparedTx = VersionedTransaction.deserialize(buffer);
      }

      preparedTx.sign([wallet.payer]);

      if (transactionObject.additionalSigners) {
        const additionalKey = Keypair.fromSecretKey(decode(transactionObject.additionalSigners));
        preparedTx.sign([additionalKey]);
      }

      const serializedTx = preparedTx.serialize();
      const rawTransaction = Buffer.from(serializedTx).toString('base64');
      return { rawTransaction };
    } catch (error) {
      return error as Error;
    }
  },
};
