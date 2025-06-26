require("dotenv").config();
const axios = require("axios");
const config = require('../configuration/config.json');
const { Wallet } = require("../src");


const expand_url = config.localurl.apiurl;
const chainId = "1400";
const headers = { 'x-api-key': process.env.xApiKey };
const wallet = new Wallet({privateKey: process.env.WALLET_PRIVATE_KEY, xApiKey: process.env.xApiKey})

async function addLiquidityTxn(options) {
    const rawApprovedTx = await axios.post(expand_url + 'dex/addliquidity', options, { headers });
    return rawApprovedTx.data.data;
}


async function main() {
    const addLiquidityParams = {
    "amountIn": ["733700","529428"],
    "from": "0xa182b65f4bf10be7ef870496893c170af3079a2540c63b470445417fcfb21c5b",
    "path": [
        "0x1::aptos_coin::AptosCoin",
        "0x53a30a6e5936c0a4c5140daed34de39d17ca7fcae08f947c02e979cef98a3719::coin::LSD"
    ],
    "slippage": "50",
    "dexId": "3200",
    "gas":"10000",
    "enableFee":true
    };



    // Prepare the Approved transaction
    const transaction = await addLiquidityTxn(addLiquidityParams);
    console.log("approvedTx --", transaction);

    try{const executeBatchCall = await wallet.signSendBatchTransactions({chainId, transactions: transactions});
    console.log("executeBatch --", executeBatchCall);
    }
    catch(e){
        console.log("executeBatch --", e);
    }
    
};


main();
