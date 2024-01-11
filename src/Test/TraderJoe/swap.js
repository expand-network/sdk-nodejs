const { sendTransaction, Wallet, signTransaction} = require('../../adapters/Wallet/index');
const {prepareTransaction} = require('../../../src/index')

// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const wallet = new Wallet({privateKey: "a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86",xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"});       
    const result =  {
        "dexId":"2101",
        "amountIn": "10000000000",
        "amountOutMin": "0",
        "path": ["0xd00ae08403B9bbb9124bB305C09058E32C39A48c","0xB6076C93701D6a07266c31066B298AeC6dd65c2d"],
        "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "involveBaseToken":"0",
        "deadline": "1733156839",
        "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "gas": "373376",
        "gasPriority":"high",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
        "chainId":"43113"
    };
    const rawtx = await prepareTransaction('https://uat.expand.network/dex/swap', result);
    console.log(rawtx);
    rawtx.privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    rawtx.chainId = '43113';
    const raw = await wallet.signTransaction(rawtx);
    // console.log(raw,'------>');
    raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    raw.chainId = '43113';
    const x = await wallet.sendTransaction(raw);
    console.log(x);
}

main();