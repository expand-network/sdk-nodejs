const dydx = require('../../dydx');

const placeOrderTest = async () => {
    const type = "LIMIT";
    const timeInForce = "GTT";
    const side = "BUY1";
    const price = '2800';
    const market = "ETH-USD";
    const mnemonic = "giraffe jazz panic usage auto expose salmon few chicken guilt hood weather barely demand juice rice luggage lazy farm camp poet violin urban apart"

    const tx = await dydx.placeOrder({
        subAccountNumber: '0',
        mnemonic,
        market,
        type,
        side,
        timeInForce,
        time: "300",
        price
    });
    console.log(tx);
};

placeOrderTest();