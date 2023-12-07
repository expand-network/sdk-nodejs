
const {sendTransaction} = require("expand-network");
const {  signTransaction, prepareTransaction} = require('../../../index');

const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =  {
        
            "lendborrowId": "1200",
            "asset": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            "amount": "100000000",
            "from": "0x4C99D660A51D41bE5D47D66a3d89d5B83D92f27E",
            "to": "0x4C99D660A51D41bE5D47D66a3d89d5B83D92f27E",
            "gas": "408298",
            "gasPriority":"low",
        "chainId":"1",
       "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
            
        };

    const rawtx = await prepareTransaction('http://localhost:3000/lendborrow/withdraw', txObject);
    console.log(rawtx);
    const privateKey = 'c195d006d15ded3b424b90f81f3195eb8dd5731d1d50c2fb7dd781f9020dc272';
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
