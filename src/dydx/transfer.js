const Long = require('long');
const { Method } = require('@cosmjs/tendermint-rpc');
const { getSubAccountValidatorClient } = require('../../configuration/dYdXCommon');


module.exports = {
    transfer: async (options) => {
        const {
            subAccountNumber,
            mnemonic,
            recipient,
            assetId
        } = options;
        let {amount} = options;

        const { client, subaccount } = await getSubAccountValidatorClient(mnemonic, subAccountNumber);
        amount = new Long(Number(amount));

        const msgs = new Promise((resolve) => {
          const msg = client.post.composer.composeMsgWithdrawFromSubaccount(
            subaccount.address,
            subaccount.subaccountNumber,
            Number(assetId),
            amount.toString(),
            recipient,
          );
      
          resolve([msg]);
        });
      
        const totalFee = await client.post.simulate(
          subaccount.wallet,
          () => msgs,
          undefined
        );
      
        const amountAfterFee = amount.sub(Long.fromString(totalFee.amount[0].amount));
      
        const tx = await client.post.withdraw(
          subaccount,
          assetId,
          amountAfterFee.toString(),
          recipient,
          Method.BroadcastTxCommit,
        );
        return tx;
    }
};
