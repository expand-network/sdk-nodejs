const { sendTransaction, signTransaction, prepareTransaction} = require('../index');

// const baseurl = "https://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const result =  {
        lendborrowId: '1200',
        from:'0x122Eb6Cd95593b6401ce282453717f2f9A5c6bD5',
        asset:'0x6B175474E89094C44Da98b954EedeAC495271d0F',
        amount:'100000000000000000', // erc20 token
        onBehalfOf:'0x122Eb6Cd95593b6401ce282453717f2f9A5c6bD5',
        gas: '329000',
        involveBaseToken:"1",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('http://localhost:3000/lendborrow/deposit', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = '0x2c5f35127c98904a733649d228a4c46580f9afd9680ae38418542f0ff083d3c1';
    const chainId = '1';
    const raw = await signTransaction(rawtx,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    raw.chainId = '1';
    const x = await sendTransaction(raw);
    console.log(x);
}

main();
