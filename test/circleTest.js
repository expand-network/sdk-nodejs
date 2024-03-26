const { WalletCircle, prepareTransaction } = require('../src/index');
const dotenv = require('dotenv');

async function initcircleWallet(options){
    const userToken = await WalletCircle.getUserToken(options);
    options.userToken = userToken.userToken;
    options.encryptionKey = userToken.encryptionKey;
    const wallet = new WalletCircle(options);
    return wallet;
}

async function main(){

    // configure the env
    dotenv.config();

    // Initialise the wallet client
    const wallet = await initcircleWallet({
        appId: process.env.appId,
        apiKey: process.env.apiKey,
        userId: process.env.userId,
        walletId: process.env.walletId
    });
    
    // Prepare the transaction from expand api
    // We are making an approve call here
    const prepareApproveTx = await prepareTransaction('https://api.expand.network/fungibletoken/approve', {
        "from": "0x6E5eAf34c73D1CD0be4e24f923b97CF38e10d1f3",
        "tokenAddress": "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
        "to": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        "amount": "10000",
        "gas": "25000",
        "xApiKey": process.env.xApiKey
    });


    // Securely sign the transaction on user's end
    const signedTx = await wallet.signTransaction(prepareApproveTx);
    // Signed Transaction
    console.log("signedTx: " ,signedTx);
    // Send the transaction
    const tx = await wallet.sendTransaction(signedTx);
    // This challenge id and details can be used to send this transaction through circle on supported networks
    console.log("sent tx: ", tx);
}

main();

