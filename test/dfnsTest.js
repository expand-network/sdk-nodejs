const { WalletDFNS , prepareTransaction } = require('../src/index');
const dotenv = require('dotenv');

async function main() {

    dotenv.config();
    let preparedTx =  {
        "from": "FROM_WALLET_ADDRESS", 
        "value": "1000000",                  
        "to": "TO_WALLET_ADDRESS", 
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

    const wallet  = new WalletDFNS(options);
    const signedTx = await wallet.signTransaction(preparedTx);
    const tx = await wallet.sendTransaction(signedTx);
    console.log("Transaction Pending....", tx);
}
    
main();
