const {  signTransaction, prepareTransaction} = require('../../index');

// const baseurl = "https://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const result =  {
     
            "lendborrowId":"1201",
            "asset":"0x6d906e526a4e2ca02097ba9d0caa3c382f52278e",
            "from":"0x6Fb447Ae94F5180254D436A693907a1f57696900",
            "gas":"929000",  
            "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
    };
    const rawtx = await prepareTransaction('http://localhost:3000/lendborrow/exitisolationmode', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = 'c03e8ee249d32de6a5e15cf526f05c89d574c275890be6ddbc61128facde79da';
    const chainId = '11155111';
    const raw = await signTransaction(rawtx,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    // raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    // raw.chainId = '11155111';
    // const x = await sendTransaction(raw);
    // console.log(x);
}

main();
