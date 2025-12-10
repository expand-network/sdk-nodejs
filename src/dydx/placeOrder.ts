import { OrderExecution, OrderType, OrderSide, OrderTimeInForce } from '@dydxprotocol/v4-client-js';
import config from "../../configuration/config";
import { getSubAccountCompositeClient } from '../../configuration/dYdXCommon';

interface PlaceOrderOptions {
    subAccountNumber: number;
    mnemonic: string;
    market: string;
    type: keyof typeof OrderType;
    side: keyof typeof OrderSide;
    timeInForce: keyof typeof OrderTimeInForce;
    time: number;
    price: number;
    postOnly: boolean;
    reduceOnly: boolean;
    triggerPrice?: number;
    size: number;
}

export const placeOrder = async (options: PlaceOrderOptions) => {
    const {
        subAccountNumber,
        mnemonic,
        market,
        type: orderType,
        side: orderSide,
        timeInForce: orderTimeInForce,
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
        const timeInForce = OrderTimeInForce[orderTimeInForce];
        const timeInForceSeconds = timeInForce === OrderTimeInForce.GTT ? time : 0;

        let tx = await client.placeOrder(
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
            tx = { ...(tx as any), hex: `0x${Buffer.from(tx.hash).toString('hex')}` };
        }

        return tx;
    } catch (error) {
        return (error as Error).message;
    }
};
