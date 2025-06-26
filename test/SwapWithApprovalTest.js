require("dotenv").config();
const axios = require("axios");
const web3 = require("web3");
const { batchRequest } = require('../src/batchRequest');
const config = require('../configuration/config.json');


const expand_url = config.url.apiurl;
const headers = { 'x-api-key': process.env.xApiKey };
const privateKey  = process.env.WALLET_PRIVATE_KEY;


async function getswapWithApproveTx(options) {
    const rawApprovedAndSwapTx = await axios.post(expand_url + 'dex/swapwithapproval', options, { headers });
    return rawApprovedAndSwapTx.data.data;
 }


async function main() {


    const Params = {

        "dexId":"1000",
        "amountIn": "1000000000000000",
        "amountOutMin": "0",
        "path": ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","0x6B175474E89094C44Da98b954EedeAC495271d0F"],
        "to": "<EOA_ADDRESS>", // Your EOA Address
        "deadline": "1665990894",
        "from": "<EOA_ADDRESS>", // Your EOA Address
        "gas": "173376"
    };



   // Prepare the Approve and Swap Transactions together
   const approveAndSwapTx = await getswapWithApproveTx(Params);
   console.log("approveAndSwapTx --", approveAndSwapTx);
  

};


main();



