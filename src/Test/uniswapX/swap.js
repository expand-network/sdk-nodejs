const axios = require('axios');
const { ethers } = require('ethers');
 
 const generateSignature = async () => {
     const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
     const signer = new ethers.Wallet('0x8c471bc03e223f0d868f3ca9889608df55d711163cce1a61e5c1ba4024d303a3', provider);
 
     const data = JSON.stringify({
    "dexId": "1900",
    "amountIn": "10000000000000000",
    "path": ["0x6b175474e89094c44da98b954eedeac495271d0f","0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"],
    "to": "0x23Fc2AAc23E297605a2242fFeb19C869e4A1b520",
    "from": "0x23Fc2AAc23E297605a2242fFeb19C869e4A1b520",
    "decayStartTime":"1701688477",
    "decayEndTime": "1710140876",
    "amountOut": "0",
    "deadline": "1795982024"
     });
 
     const config = {
         method: 'post',
         maxBodyLength: Infinity,
         url: 'http://localhost:3000/dex/swap',
         headers: {
             'accept': 'application/json',
             'Content-Type': 'application/json'
         },
         // eslint-disable-next-line object-shorthand
         data : data
     };
 
     const res = await axios.request(config);
     const { domain, types, values } = res.data.data;
     const signature = await signer._signTypedData(domain, types, values);
     console.log(signature);
 };
 
 generateSignature();

