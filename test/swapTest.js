const dotenv = require('dotenv');
const { Wallet, prepareTransaction } = require("../src");

async function swap() {
  dotenv.config();

  const xApiKey = process.env.xApiKey;
  const privateKey = process.env.privateKey;

  const wallet = new Wallet({ privateKey, xApiKey });
  
  // Preparing transaction
  const preparedTx = await prepareTransaction('https://api.expand.network/dex/swap', {
    "dexId": "1300",
    "path": [
        "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
        "0xdac17f958d2ee523a2206206994597c13d831ec7"
    ],
    "amountIn": "50000000000000000000", // 50 Matic
    "amountOutMin": "730655",
    "to": "<user address>",
    "gas": "80000",
    "from": "<user address>",
    "deadline": "1716461989",
    "slippage": "1",
    xApiKey
});

  console.log(preparedTx);
  
  // Signing transaction
  const signedTx = await wallet.signTransaction(preparedTx); 

  // //Sending transaction
  const tx = await wallet.sendTransaction(signedTx);
  console.log("Transaction Pending....", tx.data);
}
swap();