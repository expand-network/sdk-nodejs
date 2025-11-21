const {  Wallet, prepareTransaction} = require('../src');

// const {prepareTransaction} = require('../index')

// const baseurl = "http://localhost:3000";

const xApiKey = 'userXapikey'

async function main() {

    const wallet = new Wallet({privateKey: "UserPrivateKey",xApiKey: "userXapikey"});      

    const result =  {

        "dexId": "1307",

        "tokenA": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",

        "tokenB": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",

        "poolFees": "3000",

        "amountADesired": "100000000000000",

        "amountBDesired": "0",

        "amountAMin": "0",

        "amountBMin": "0",

        "deadline": "1797485659",

        "to": "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",

        "from": "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",

        "gas": "544672",

        "chainSymbol":"BSC",

        "xApiKey":xApiKey,

        "gasPriority":"medium"

    };

    const rawtx = await prepareTransaction('https://api.expand.network/dex/addliquidity', result);

    console.log(rawtx);

  //  const raw = await wallet.signTransaction(rawtx);

  //  console.log(raw,'------>');

  //  raw.xApiKey = xApiKey;

    // const x = await wallet.sendTransaction(raw);

    // console.log(x);

}

main();

