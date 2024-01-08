const dydx = require('./src/dydx');
const cancelOrderTest = async () => {
    const orderId = "9c9e3d7e-1007-5b17-ade5-940808e76961";
    const res = await dydx.cancelOrder({ subAccountNumber: '0', mnemonic, orderId });
    console.log(res);
};
