const { default: axios } = require("axios");
const { Wallet } = require("../src");
const dotenv = require('dotenv');

const amountIn = "10000000000000000";
const amountOutMin = "10000000000000000";
const fromToken = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"; //weth
const toToken = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; //uni
const dexId = "1901";

const user = "<user wallet address>"  // weth: 0.069, UNI: 0
const now = Math.floor(Date.now() / 1000);
const deadline = Math.floor(Date.now() / 1000) + 3600000;

const main = async () => {
  dotenv.config();
  const wallet = new Wallet({
    xApiKey: process.env.xApiKey,
    privateKey: process.env.privateKey
  });

  const apiConfig = JSON.stringify({
    dexId,
    amountIn,
    amountOutMin,
    path: [
      fromToken,
      toToken
    ],
    to: user,
    from: user,
    decayStartTime: now.toString(),
    decayEndTime: deadline.toString(),
    deadline: deadline.toString()
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.expand.network/dex/createorder',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': process.env.xApiKey
    },
    data: apiConfig
  };

  const res = await axios.request(config);
  const { domain, types, values, } = res.data.data;

  const sig = await wallet.signOrderRFQ({ domain, types, values });
  console.log(sig);
}
main();
