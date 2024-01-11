const { sendTransaction, Wallet, signTransaction} = require('../../adapters/Wallet/index');
const {prepareTransaction} = require('../../../src/index')

// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const wallet = new Wallet({privateKey: "a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86",xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"});       
    const result =  {
        "dexId": "2101",
        "tokenA": "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
        "tokenB": "0xB6076C93701D6a07266c31066B298AeC6dd65c2d",
        "amountA": "10000000000000000",
        "amountB": "1000",
        "amountAMin": "0",
        "amountBMin": "0",
        "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "deadline": "1736978170",
        "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "gas": "50000",
        "gasPriority":"low",
        "strategy":"bidask",
        "xApiKey":"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
    };
    const rawtx = await prepareTransaction('http://localhost:3000/dex/addliquidity', result);
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