const { sendTransaction, signTransaction, prepareTransaction} = require('../index');

const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const result =  {
        from: '0xa67e9b68c41b0f26184d64c26e0b2b81466e5994',
        tokenAddress:'0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7',
        amount: '1000000', // erc20 token
        to: '0xf471d32cb40837bf24529fcf17418fc1a4807626',
        gas: '900000',
        chainId: '80001',
        xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('http://localhost:3000/fungibletoken/approve', result);
    console.log(rawtx,'}}}}}}}}');
    const privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    const chainId = '80001';
    const raw = await signTransaction(rawtx,{
        chainId,
        xApiKey,
        privateKey,
    });
    console.log(raw,'------>');
    raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    raw.chainId = '80001';
    const x = await sendTransaction(raw);
    console.log(x);
}

main();
