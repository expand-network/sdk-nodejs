require("dotenv").config({ path: '../.env' });
const axios = require("axios");
const config = require('../configuration/config.json');
const { Wallet } = require("../src");


const expand_url = config.localurl.apiurl;
const chainId = "1401";
const headers = { 'x-api-key': process.env.xApiKey };
const wallet = new Wallet({privateKey: process.env.WALLET_PRIVATE_KEY, xApiKey: process.env.xApiKey})

async function addLiquidityTxn(options) {
    const rawApprovedTx = await axios.post(expand_url + 'dex/addliquidity', options, { headers });
    return rawApprovedTx.data.data;
}


async function main() {
    const transaction = {
        "createFeeTxn": {
            "chainId": "1401",
            "from": "Wallet Address",
            "to": "Wallet Address",
            "data": "<---data---->"
        },
        "createFeeTxn1": {
            "chainId": "1401",
            "from": "Wallet Address",
            "to": "Wallet Address",
            "data": "<---data---->"
        },
    }
    try{const executeBatchCall = await wallet.signSendBatchTransactions({chainId, transactions: transaction});
    console.log("executeBatch --", executeBatchCall);
    }
    catch(e){
        console.log("executeBatch --", e);
    }
    
};


main();
