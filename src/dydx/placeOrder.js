const { OrderExecution, OrderType, OrderSide, OrderTimeInForce } = require('@dydxprotocol/v4-client-js');
const {getSubAccountCompositeClient} = require('../../configuration/dYdXCommon');
const config = require("../../configuration/config.json");

module.exports = {
    placeOrder: async (options) => {
        const {
            subAccountNumber,
            mnemonic,
            market,
            type: orderType,
            side: orderSide,
            timeInForce: ordertimeInForce,
            time,
            price,
            postOnly,
            reduceOnly,
            triggerPrice,
            size
        } = options;
        const { client, subaccount } = await getSubAccountCompositeClient(mnemonic, subAccountNumber);
        try {
            const type = OrderType[orderType];
            const side = OrderSide[orderSide];
            const timeInForceString = ordertimeInForce;
            const timeInForce = OrderTimeInForce[timeInForceString];
            const timeInForceSeconds = (timeInForce === OrderTimeInForce.GTT) ? time : 0;

            let tx;
            tx = await client.placeOrder(
                subaccount,
                market,
                type,
                side,
                price,
                size,
                Math.floor(Math.random() * config.dYdXV4.MAX_CLIENT_ID),
                timeInForce,
                timeInForceSeconds,
                OrderExecution.DEFAULT,
                postOnly,
                reduceOnly,
                triggerPrice
            );

            if (typeof tx.hash === 'object') {
                tx = {...tx, 'hex': `0x${Buffer.from(tx.hash).toString('hex')}`}
            }
            return (tx);
        } catch (error) {
            return (error.message);
        }
    }
};
