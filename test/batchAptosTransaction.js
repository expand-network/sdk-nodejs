require("dotenv").config();
const axios = require("axios");
const config = require('../configuration/config.json');
const { Wallet } = require("../src");


const expand_url = config.url.apiurl;
const chainId = "1401";
const headers = { 'x-api-key': process.env.xApiKey };
const wallet = new Wallet({privateKey: "ed25519-priv-0xfd787cabc622c32cde4439cc78c4e3cb944bbbc5f5246c6f7c7f3595ccb0f039", xApiKey: "tK503cR23o8YTvXhNoDNo7kQf5sQdbXP8qbqkBeQ"})

// async function getApproveTx(options) {
//     const rawApprovedTx = await axios.post(expand_url + 'fungibletoken/approve', options, { headers });
//     return rawApprovedTx.data.data;
// }

// async function getSwapTransaction(options) {
//     const rawSwapTx = await axios.post(expand_url + 'dex/swap', options, { headers });
//     return rawSwapTx.data.data;
// };


// async function getFeeTx(swapTx) {
//     const feeTx = await axios.post(expand_url + 'chain/createfeetransaction', swapTx, { headers });
//     return feeTx.data.data;
// }


async function main() {
    // const approveParams = {
    //     "from": "<Wallet address>",
    //     "tokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    //     "amount": "1000000000000000000000",
    //     "to": "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45", 
    //     "gas": "100000",
    //     "chainId": "1"
    // };

    // const swapParams = {
    //     "dexId": "1300",
    //     "amountIn": "1000000000000000",
    //     "amountOutMin": "0",
    //     "path": [
    //         "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    //         "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    //     ],
    //     "to": "<Wallet address>",
    //     "deadline": "1965990894",
    //     "from": "<Wallet address>",
    //     "gas": "203376",
    //     "involveBaseToken": "1"
    // };


    // Prepare the Approved transaction
    // const approvedTx = await getApproveTx(approveParams);
    // console.log("approvedTx --", approvedTx);

    // // Prepare the swap transaction
    // const swapTx = await getSwapTransaction(swapParams);
    // console.log("swapTx --", swapTx);

    // const feeTx = await getFeeTx(swapTx);
    // console.log("feeTx --", feeTx);
    const transactions = {
        "createFeeTxn": {
        "chainId": "1401",
        "from": "0x48662289e5162786d30e4934104a7463cab8312a96920633ea31f79abf7cbae0",
        "to": "0xdb2db1fa42691694c902e0edd3496aa6202604b31b9cf93ef1ad235171959985",
        "data":'eyJmdW5jdGlvbiI6IjB4MTo6YXB0b3NfYWNjb3VudDo6dHJhbnNmZXIiLCJmdW5jdGlvbkFyZ3VtZW50cyI6WyIweGRiMmRiMWZhNDI2OTE2OTRjOTAyZTBlZGQzNDk2YWE2MjAyNjA0YjMxYjljZjkzZWYxYWQyMzUxNzE5NTk5ODUiLDEwXSwiYXJndW1lbnRzVHlwZXMiOlsiYWRkcmVzcyIsInU2NCJdfQ==',
    },
        "addLiquidityTxn": {
        "chainId": "1401",
        "from": "0x48662289e5162786d30e4934104a7463cab8312a96920633ea31f79abf7cbae0",
        "to": "0x23e2fe30825983a8476c84c14a104a94207684b925e47cd9df62002e3de3be91",
        "data":'eyJmdW5jdGlvbiI6IjB4MTo6YXB0b3NfYWNjb3VudDo6dHJhbnNmZXIiLCJmdW5jdGlvbkFyZ3VtZW50cyI6WyIweDIzZTJmZTMwODI1OTgzYTg0NzZjODRjMTRhMTA0YTk0MjA3Njg0YjkyNWU0N2NkOWRmNjIwMDJlM2RlM2JlOTEiLDEwXSwiYXJndW1lbnRzVHlwZXMiOlsiYWRkcmVzcyIsInU2NCJdfQ==',
    }}
    try{const executeBatchCall = await wallet.signSendBatchTransactions({chainId, transactions: transactions});
    console.log("executeBatch --", executeBatchCall);
    }
    catch(e){
        console.log("executeBatch --", e);
    }
    
};


main();
