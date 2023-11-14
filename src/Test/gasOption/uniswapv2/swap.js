   
const { sendTransaction, signTransaction, prepareTransaction} = require('../../../index');
// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =   {

        "lendborrowId": "1202",
        "asset": "0xff34b3d4aee8ddcd6f9afffb6fe49bd371b8a357",
        "amount": "100000000000000",
        "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "gas": "834538",
        "gasPriority":"medium",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
       
    };
    const rawtx = await prepareTransaction('https://uat.expand.network/lendborrow/withdraw', txObject);
    console.log(rawtx,'******');

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
