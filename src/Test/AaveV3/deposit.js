const { sendTransaction, signTransaction, prepareTransaction} = require('../../index');

// const baseurl = "https://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const result =  {
        lendborrowId: '1200',
        from:'0xFA2261A11eEd6a1209E3Ccf4b665C42692A4A88B',
        asset:'0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        amount:'100000000000000000', // erc20 token
        onBehalfOf:'0xFA2261A11eEd6a1209E3Ccf4b665C42692A4A88B',
        gas: '329000',
        // involveBaseToken:"1",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('http://localhost:3000/lendborrow/deposit', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = 'eeb5cdc6423ec97f6901466544e4295d65bec984217a3d8fa46fd86bc1431065';
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
