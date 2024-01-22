const dydx = require('../src/dydx');
const dotenv = require('dotenv').config();

const mnemonic = process.env.dydxMnemonic;

const onboardingTest = async () => {
    const res = await dydx.userOnboarding({privateKey: process.env.privateKey});
    console.log(res);
};


const placeOrderTest = async () => {
    const type = "limit";
    const timeInForce = "GTT";
    const side = "sell";
    const price = '2600';
    const market = "ETH-USD";
    const size = "0.01";

    const tx = await dydx.placeOrder({
        subAccountNumber: '0',
        mnemonic,
        market,
        type,
        side,
        timeInForce,
        time: "500",
        price,
        size
    });
    console.log(tx);
};

const cancelOrderTest = async () => {
    const orderId = "<order id>";
    const res = await dydx.cancelOrder({ subAccountNumber: '0', mnemonic, orderId });
    console.log(res);
};

const transferTest = async () => {
    const res = await dydx.transfer(
        {
            subAccountNumber: '0', 
            mnemonic,
            recipient: "<recipient address>",
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
            tokenIn: "ETH", 
            from: "<user address>", 
            amountIn: "10000000000000000", // 0.01
            to: "<recipient address>", 
            privateKey: process.env.privateKey,
            gas: "800000"
        }
    );
    console.log(res);
};

// onboardingTest();
// placeOrderTest();
// cancelOrderTest();
// transferTest();
// depositTest();