const aptos = require('aptos');
const config = require('../../configuration/config.json');

module.exports = {

    signTransactionAptos: async (web3, transactionObject, options) => {
        /*
         * Function will sign the transaction payload for Aptos chain
         */

        try {

            const TxnBuilderTypes = aptos.TxnBuilderTypes;
            const BCS = aptos.BCS;
            const privateKey = options.privateKey;
            const chainId = (options.chainId && options.chainId === "1400" ) ? "1" : "2";

            // Create an account instance with the wallet

            const accountFrom = new aptos.AptosAccount(aptos.HexString.ensure(privateKey).toUint8Array());

            // Creating a Transaction Payload for Transfer 

            const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
                TxnBuilderTypes.EntryFunction.natural(
                    transactionObject.module,   // '0x1::coin' 
                    transactionObject.method,   // "transfer"
                    [new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString(config.chains[options.chainId].aptosCoin))],
                    [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(transactionObject.to)), BCS.bcsSerializeUint64(transactionObject.value)]
                ),
            );

            //Original transaction processing to make a Raw Transaction

            const Txn = new TxnBuilderTypes.RawTransaction(
                TxnBuilderTypes.AccountAddress.fromHex(transactionObject.from),
                BigInt(transactionObject.sequenceNumber),
                entryFunctionPayload,
                options.gas ? options.gas : 1000,
                100,
                BigInt(Math.floor(Date.now() / 1000) + 10000),
                new TxnBuilderTypes.ChainId(chainId),
            );

            // Generate BCS transaction for Sending to the Aptos Chain

            const bcsTxn = aptos.AptosClient.generateBCSTransaction(accountFrom, Txn);
            
            // Generating a encoded Raw Transaction for Sending it to Aptos Chain 

            const rawTransaction = Buffer.from(bcsTxn).toString("base64");

            return { "rawTransaction": rawTransaction };

        }
        catch (error) {
            return error;
        }

    }

};