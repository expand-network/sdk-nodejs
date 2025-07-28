const { default: axios } = require("axios");
const dotenv = require('dotenv');
const { Wallet } = require("../src");

dotenv.config();

const wallet = new Wallet({
  xApiKey: process.env.xApiKey,
  privateKey: process.env.privateKey
});

const signCreateLimitOrder = async () => {
  const apiConfig = JSON.stringify({
    "dexId": "2200",
    "makerAsset": "0x853d955aCEf822Db058eb8505911ED77F175b99e",
    "takerAsset": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "from": "0xB409cB0b5DB9f148d0bc491E140D9E0FDd789C11",
    "to": "0xB409cB0b5DB9f148d0bc491E140D9E0FDd789C11",
    "amountIn": "2000000000000000000",
    "amountOut": "2000000",
    "deadline": "1738898848"
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
  const { domain, types, message } = res.data.data.unsignedCreateOrder;
  
  const orderType = "create";
  const sig = await wallet.signLimitOrder({ domain, types, message, orderType });
  console.log(sig);
};

const signCancelLimitOrder = async () => {
  const apiConfig = JSON.stringify({
    "dexId": "2200",
    "orderId": "<orderId>",
    "from": "0xB409cB0b5DB9f148d0bc491E140D9E0FDd789C11"
});

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.expand.network/dex/cancelorder',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': process.env.xApiKey
    },
    data: apiConfig
  };

  const res = await axios.request(config);
  const { domain, types, message } = res.data.data.unsignedCancelOrder;
  const orderType = "cancel";
  const sig = await wallet.signLimitOrder({ domain, types, message, orderType });
  console.log(sig);
};

// signCreateLimitOrder();
// signCancelLimitOrder();
