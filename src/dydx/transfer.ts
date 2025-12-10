import { EncodeObject } from '@cosmjs/proto-signing';
import { Method } from '@cosmjs/tendermint-rpc';
import Long from 'long';
import { getSubAccountValidatorClient } from '../../configuration/dYdXCommon';

interface TransferOptions {
  subAccountNumber: number;
  mnemonic: string;
  recipient: string;
  assetId: number;
  amount: string | number | Long;
}

export const transfer = async (options: TransferOptions): Promise<any> => {
  const { subAccountNumber, mnemonic, recipient, assetId } = options;
  const amount: Long = Long.fromValue(options.amount);

  const { client, subaccount } = await getSubAccountValidatorClient(mnemonic, subAccountNumber);
  // amount = Long.fromValue(amount);

  const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
    const msg = client.post.composer.composeMsgWithdrawFromSubaccount(
      subaccount.address,
      subaccount.subaccountNumber,
      Number(assetId),
      amount,
      recipient,
    );

    resolve([msg]);
  });

  const totalFee = await client.post.simulate(
    subaccount.wallet,
    () => msgs,
    undefined,
  );

  const amountAfterFee = amount.sub(Long.fromString(totalFee.amount[0].amount));

  const tx = await client.post.withdraw(
    subaccount,
    assetId,
    amountAfterFee,
    recipient,
    Method.BroadcastTxCommit,
  );

  return tx;
};
