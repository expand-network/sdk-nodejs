const { WalletDFNS, prepareTransaction } = require('../src/index');
const dotenv = require('dotenv');

async function main() {

    dotenv.config();
    let preparedTx = {
        "from": "0x4D62A8147c18B45D72BF02378329989533114aDf",
        "value": "1000000",
        "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "gas": "100000",
        "chainId": "5",
        "xApiKey": xApiKey,
    };
    const options = {};
    options.privateKey = process.env.DFNS_PRIVATE_KEY;
    options.credId = process.env.DFNS_CRED_ID;
    options.xApiKey = process.env.xApiKey;
    options.appId = process.env.DFNS_APP_ID;
    options.authToken = process.env.DFNS_ACCESS_TOKEN
    options.baseUrl = process.env.DFNS_API_URL;
    options.walletId = process.env.WALLET_ID;
    options.appOrigin = 'http://localhost:3000';
    // console.log(options);
    // preparedTx = {
    //     from: "0x4D62A8147c18B45D72BF02378329989533114aDf",
    //     to:   "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
    //     data:  "0x",
    //     value: '100000',
    //     maxFeePerGas: '120000000000',
    //     maxPriorityFeePerGas: '120000000000',
    //     gasLimit: '100000',
    //     chainId: '5',
    // }
    const wallet = new WalletDFNS(options);
    // console.log(preparedTx);
    const signedTx = await wallet.signTransaction(preparedTx);
    // console.log(signedTx);
    signedTx.chainId = '5';
    const tx = await wallet.sendTransaction(signedTx);
    // console.log(signedTx);
    console.log("Transaction Pending....", tx);
}

main();
