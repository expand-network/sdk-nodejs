import {
    TxnBuilderTypes,
    BCS,
    AptosAccount,
    AptosClient,
    HexString,
  } from 'aptos';
  import config from '../../../../configuration/config.json';
  
  interface TransactionObject {
    from: string;
    to: string;
    value: number | string;
    data?: string;
  }
  
  interface Options {
    privateKey: string;
    chainId?: string;
    gas?: number;
  }
  
  interface Web3Client {
    getAccount: (address: string) => Promise<{ sequence_number: string }>;
  }
  
  export const AptosUtils = {
    async signTransactionAptos(
      web3: Web3Client,
      transactionObject: TransactionObject,
      options: Options
    ): Promise<{ rawTransaction: string } | Error> {
      /*
       * Function will sign the transaction payload for Aptos chain
       */
  
      try {
        const { privateKey } = options;
        const chainId = options.chainId === '1400' ? 1 : 2;
  
        const accountFrom = new AptosAccount(
          HexString.ensure(privateKey).toUint8Array()
        );
  
        let transactionBuffer: TxnBuilderTypes.RawTransaction;
  
        if (!transactionObject.data) {
          const seq = await web3.getAccount(accountFrom.address().hex());
  
          transactionBuffer = new TxnBuilderTypes.RawTransaction(
            TxnBuilderTypes.AccountAddress.fromHex(transactionObject.from),
            BigInt(seq.sequence_number),
            new TxnBuilderTypes.TransactionPayloadEntryFunction(
              TxnBuilderTypes.EntryFunction.natural(
                '0x1::coin',
                'transfer',
                [
                  new TxnBuilderTypes.TypeTagStruct(
                    TxnBuilderTypes.StructTag.fromString(
                      config.chains[options.chainId || '1'].aptosCoin
                    )
                  ),
                ],
                [
                  BCS.bcsToBytes(
                    TxnBuilderTypes.AccountAddress.fromHex(transactionObject.to)
                  ),
                  BCS.bcsSerializeUint64(Number(transactionObject.value)),
                ]
              )
            ),
            options.gas || 1000,
            100,
            BigInt(Math.floor(Date.now() / 1000) + 10000),
            new TxnBuilderTypes.ChainId(chainId)
          );
        } else {
          const decodedBytes = Buffer.from(transactionObject.data, 'base64');
          const deserializer = new BCS.Deserializer(
            new Uint8Array(decodedBytes)
          );
          transactionBuffer =
            TxnBuilderTypes.RawTransaction.deserialize(deserializer);
        }
  
        const bcsTxn = AptosClient.generateBCSTransaction(
          accountFrom,
          transactionBuffer
        );
  
        const rawTransaction = Buffer.from(bcsTxn).toString('base64');
  
        return { rawTransaction };
      } catch (error) {
        return error as Error;
      }
    },
  };
  