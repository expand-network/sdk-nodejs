const { default: axios } = require('axios');
const { getSubAccountCompositeClient } = require('../../configuration/dYdXCommon');
const { OrderFlags } = require('@dydxprotocol/v4-client-js');

module.exports = {
    cancelOrder: async (options) => {
        const {
            subAccountNumber,
            mnemonic,
            orderId,
            goodTillTimeInSeconds
        } = options;
        const { client, subaccount } = await getSubAccountCompositeClient(mnemonic, subAccountNumber);

        const orderConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://indexer.v4testnet.dydx.exchange/v4/orders/${orderId}`,
            headers: {}
        };
        let order;

        try {
            const res = await axios.request(orderConfig);
            order = res.data;
        } catch (err) {
            return err;
        }

        console.log(order);
        
        try {
            const tx = await client.cancelOrder(
                subaccount,
                order.clientId,
                OrderFlags.LONG_TERM,
                order.ticker,
                0,
                Number(goodTillTimeInSeconds)
              );
            return tx;
        } catch (error) {
            return (error.message);
        }
    }
};
