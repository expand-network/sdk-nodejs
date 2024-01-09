const dydx = require('../../dydx');
// eslint-disable-next-line max-len
// const mnemonic = "wisdom visa angry pattern memory install save skin ankle tumble double runway small feature text large act garage ceiling puppy lucky refuse food oak";
const mnemonic = "giraffe jazz panic usage auto expose salmon few chicken guilt hood weather barely demand juice rice luggage lazy farm camp poet violin urban apart"

const onboardingTest = async () => {
    const res = await dydx.userOnboarding({privateKey: "0xa10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86"});
    console.log(res);
};


const placeOrderTest = async () => {
    const type = "LIMIT";
    const timeInForce = "GTT";
    const side = "BUY";
    const price = '2600';
    const market = "ETH-USD";

    const tx = await dydx.placeOrder({
        subAccountNumber: '0',
        mnemonic,
        market,
        type,
        side,
        timeInForce,
        time: "500",
        price
    });
    console.log(tx);
};

const cancelOrderTest = async () => {
    const orderId = "9c9e3d7e-1007-5b17-ade5-940808e76961";
    const res = await dydx.cancelOrder({ subAccountNumber: '0', mnemonic, orderId });
    console.log(res);
};

const transferTest = async () => {
    const res = await dydx.transfer(
        {
            subAccountNumber: '0', 
            mnemonic,
            recipient: "dydx150c8hssycjem2p9yfs9pa2xm4jjuvkn6t6w3v6",
            assetId: "0",
            amount: "10000",
        }
    );
    console.log(res);
};

const depositTest = async () => {
    const res = await dydx.deposit(
        {
            srcChainId: "5", 
            tokenIn: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", 
            from: "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994", 
            amountIn: "10000000000000000", // 0.01
            to: "dydx13uxwm6gyyggdz92z47h0h2xdfqdfa0wrtykp2d", 
            privateKey: "a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86",
            gas: "800000"
        }
    );
    console.log(res);
};

// onboardingTest();
placeOrderTest();
// cancelOrderTest();
// transferTest();
// depositTest();
