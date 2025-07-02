import { Wallet, prepareTransaction } from "../src/index";
import dotenv from 'dotenv';

async function swap() {
  dotenv.config();

  const xApiKey = process.env.xApiKey || ''
  const privateKey = process.env.privateKey || ''

  const wallet = new Wallet({ privateKey , xApiKey });
  
  // Preparing transaction
  const preparedTx = await prepareTransaction('https://api.expand.network/dex/swap', {
    "dexId": "1300",
    "path": [
      "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      "0xdac17f958d2ee523a2206206994597c13d831ec7"
    ],
    "amountIn": "50000000000000000000",
    "amountOutMin": "730655",
    "to": "<user address>",
    "gas": "80000",
    "from": "<user address>",
    "deadline": "1716461989",
    "slippage": "1",
    xApiKey,
    function: ""
  });

  console.log(preparedTx);
  
  // Signing transaction
  const signedTx = await wallet.signTransaction(preparedTx); 
  console.log("Transaction Pending....", signedTx);

  // //Sending transaction
  // const tx = await wallet.sendTransaction(signedTx);
  // console.log("Transaction Pending....", tx.data);
}
swap();