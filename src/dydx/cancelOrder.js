const { default: axios } = require('axios');
const { getSubAccountClient } = require('../../configuration/dYdXCommon');

module.exports = {
    cancelOrder: async (options) => {
        const {
            subAccountNumber,
            mnemonic,
            orderId
        } = options;
        const { client, subaccount } = await getSubAccountClient(mnemonic, subAccountNumber);

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

        try {
            const tx = await client.cancelOrder(
                subaccount,
                order.clientId,
                order.orderFlags,
                order.clobPairId,
                order.ticker,
                order.goodTilBlockTime
              );
            return tx;
        } catch (error) {
            return (error.message);
        }
    }
};
