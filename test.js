const dydx = require('./src/dydx');
// eslint-disable-next-line max-len
const mnemonic = "wisdom visa angry pattern memory install save skin ankle tumble double runway small feature text large act garage ceiling puppy lucky refuse food oak";

const onboardingTest = async () => {
    const res = await dydx.userOnboarding({});
    console.log(res);
};

const placeOrderTest = async () => {
    const type = "LIMIT";
    const timeInForce = "GTT";
    const side = "BUY";
    const price = '2000';
    const market = "BTC-USD";

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

const cancelOrderTest = async() => {
    const orderId = "a17f98a3-4a21-504f-a48d-efe29f3e4f76";
    const res = await dydx.cancelOrder({subAccountNumber: '0', mnemonic, orderId});
    console.log(res);
};

const transferTest = async() => {
    const res = await dydx.transfer({subAccountNumber: '0', mnemonic,
    recipient: "dydx150c8hssycjem2p9yfs9pa2xm4jjuvkn6t6w3v6",
    recipientSubAccountNumber: "0",
    amount: "100"});
    console.log(res);
};

// onboardingTest();
// placeOrderTest();
// cancelOrderTest();
transferTest();