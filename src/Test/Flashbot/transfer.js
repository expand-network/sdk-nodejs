const { sendTransaction, Wallet, signTransaction} = require('../../adapters/Wallet/index');
const {prepareTransaction} = require('../../index')

// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const wallet = new Wallet({privateKey: "a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86",xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"});       
    const result =  {
        "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994", 
        "tokenAddress":"0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",  
        "amount": "10000000000000",                  
        "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994", 
        "gas": "100000",
        "gasPriority":"low",
        "chainId": "5",
        "xApiKey": xApiKey
   };
    const rawtx = await prepareTransaction('https://localhost:3000/fungibletoken/transfer', result);
    console.log(rawtx);
    rawtx.privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    rawtx.chainId = '5';
    const raw = await wallet.signTransaction(rawtx);
    console.log(raw,'------>');
    raw.mevProtection = true;
    raw.xApiKey = xApiKey;
    raw.chainId = '5';
    const x = await wallet.sendTransaction(raw);
    console.log(x.response.data);
}

main();