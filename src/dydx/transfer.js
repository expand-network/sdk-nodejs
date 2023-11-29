const { getSubAccountClient } = require('../../configuration/dYdXCommon');

module.exports = {
    cancelOrder: async (options) => {
        const {
            subAccountNumber,
            mnemonic,
            recipientAddress,
            recipientSubAccountNumber,
            amount
        } = options;
        const { client, subaccount } = await getSubAccountClient(mnemonic, subAccountNumber);

        try {
            const tx = await client.transferToSubaccount(
                subaccount,
                 recipientAddress, 
                 recipientSubAccountNumber, 
                 amount
            );
            return tx;
        } catch (error) {
            return (error.message);
        }
    }
};
