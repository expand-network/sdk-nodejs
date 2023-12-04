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
            triggerPrice
        } = options;
        const { client, subaccount } = await getSubAccountCompositeClient(mnemonic, subAccountNumber);
        try {
            const {size} = config.dYdXV4;
            const type = OrderType[orderType];
            const side = OrderSide[orderSide];
            const timeInForceString = ordertimeInForce;
            const timeInForce = OrderTimeInForce[timeInForceString];
            const timeInForceSeconds = (timeInForce === OrderTimeInForce.GTT) ? time : 0;

            const tx = await client.placeOrder(
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
            return (tx);
        } catch (error) {
            console.log(error);
            return (error.message);
        }
    }
};
