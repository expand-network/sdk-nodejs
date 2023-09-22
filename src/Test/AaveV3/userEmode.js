const { sendTransaction, signTransaction, prepareTransaction} = require('../../index');

// const baseurl = "https://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const result =  {
        "lendborrowId":"1201",
        "asset":"0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
        "from":'0xa67E9B68c41b0f26184D64C26e0b2B81466E5994', 
        "gas":"399000",
        "categoryId":"1",     
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
    };
    const rawtx = await prepareTransaction('http://localhost:3000/lendborrow/setuseremode', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    const chainId = '11155111';
    const raw = await signTransaction(rawtx,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    raw.chainId = '11155111';
    const x = await sendTransaction(raw);
    console.log(x);
}

main();
