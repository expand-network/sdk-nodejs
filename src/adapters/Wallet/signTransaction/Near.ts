import sha256 from "js-sha256";
import nearAPI from 'near-api-js';


const { KeyPair, keyStores } = nearAPI;


interface AccessKey {
    nonce: number;
    block_hash: string;
    block_height:any;
}

  const  signTransactionNear = async (web3:any, transactionObject:any, options:any) => {
        /*
         * Function will sign the transaction payload for Near chain
         */

        try {
            const keyStore = new keyStores.InMemoryKeyStore();

            const keyPair = KeyPair.fromString(options.privateKey);

            // adds the key you just created to your keyStore which can hold multiple keys
            await keyStore.setKey(transactionObject.networkId, transactionObject.from, keyPair);

            // connect to NEAR
            const near = new nearAPI.providers.JsonRpcProvider(options.rpc);

            const publicKey = keyPair.getPublicKey();

            const actions = [nearAPI.transactions.transfer(transactionObject.value)];

            const accessKey = await near.query<AccessKey>(
                `access_key/${transactionObject.from}/${publicKey.toString()}`,
                ""
            );
            // eslint-disable-next-line no-plusplus
            const nonce:number = ++accessKey.nonce;

            const recentBlockHash = nearAPI.utils.serialize.base_decode(
                accessKey.block_hash
            );

            const transaction = nearAPI.transactions.createTransaction(
                transactionObject.from,
                publicKey,
                transactionObject.to,
                nonce,
                actions,
                recentBlockHash
            );

            const serializedTx = nearAPI.utils.serialize.serialize(
                nearAPI.transactions.SCHEMA.Transaction,
                transaction
            );

            const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx));

            const signature = keyPair.sign(serializedTxHash);

            const signedTransaction = new nearAPI.transactions.SignedTransaction({
                transaction,
                signature: new nearAPI.transactions.Signature({
                keyType: transaction.publicKey.keyType,
                data: signature.signature,
                }),
            });

            const rawTransaction = Buffer.from(signedTransaction.encode()).toString('base64');
            return {"rawTransaction": rawTransaction };

        }
        catch (error) {
            return error;
        }

    };

export {signTransactionNear};