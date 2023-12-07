const {  signTransaction, prepareTransaction} = require('../../index');
// const baseurl = "https://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';

async function main() {
    const result =  {
        lendborrowId:'1200',
        from:'0x82ebd51870A35E82Eba123DBdAA61c13E04C2552',
        assets:["0x6B175474E89094C44Da98b954EedeAC495271d0F"],      
        gas: '990000',
        gasPriority:"low",
        xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('http://localhost:3000/lendborrow/migrate', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = '99e8b78d485eb9061d2a5e61e15595fc68335ae3e424d40f39b3c2e23d156168';
    const chainId = '1';
    const raw = await signTransaction(rawtx,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    // raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    // raw.chainId = '1';
    // const x = await sendTransaction(raw);
    // console.log(x);
}

main();
