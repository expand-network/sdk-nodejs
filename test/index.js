const sdk = require('../src/approveAndSwap')

let options = {
  "dexId": "1100",
  "amountIn": "1000000000000000",
  "amountOutMin": "0",
  "path": ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0x6B175474E89094C44Da98b954EedeAC495271d0F"],
  "to": "0x971A163468df199897cdEf656aAcBFAF32BB395E",
  "poolFees": "3000",
  "from": "",
  "gas": "200400",
  "privateKey": "",
  "xApiKey": "",
  "deadline": "1714719430",
  "chainId": "1",
  "involveBaseToken":"1"
}

sdk.approveAndSwap(options)