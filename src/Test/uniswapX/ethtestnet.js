
 const axios = require('axios');
const { ethers } = require('ethers');
 
 const generateSignature = async () => {
     const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
     const signer = new ethers.Wallet('a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86', provider);
 
     const data = JSON.stringify({
        "dexId": "1901",
        "amountIn": "100000",
        "path": [
          "0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb",
          "0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1"
        ],
        "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "decayStartTime": "1700140876",
        "decayEndTime": "1710140876",
        "amountOut": "1000000000000",
        "gas": "373376",
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