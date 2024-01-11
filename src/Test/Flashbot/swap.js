const { sendTransaction, Wallet, signTransaction} = require('../../adapters/Wallet/index');
const {prepareTransaction} = require('../../index')

// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const wallet = new Wallet({privateKey: "a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86",xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"});       
    const result =  {
        "dexId":"1002",
        "amountIn": "100000000000",
        "amountOutMin": "0",
        "path": ["0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6","0x07865c6E87B9F70255377e024ace6630C1Eaa37F"],
        "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "deadline": "1765990894",
        "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "xApiKey":xApiKey,
        "gas": "173376",
        "chainId":"5",
        "gasPriority":"high"
    };
    const rawtx = await prepareTransaction('https://uat.expand.network/dex/swap', result);
    console.log(rawtx);
    rawtx.privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    rawtx.chainId = '5';
    const raw = await wallet.signTransaction(rawtx);
    console.log(raw,'------>');
    // raw.mevProtection = true;
    raw.xApiKey = xApiKey;
    raw.chainId = '5';
    const x = await wallet.sendTransaction(raw);
    console.log(x);
}

main();

