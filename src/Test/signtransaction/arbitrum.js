// const { signTransaction } = require('../index');

// async function main() {
//     const d = await signTransaction({
        
//         from: '0x6Fb447Ae94F5180254D436A693907a1f57696900',
//         to: '0x6Fb447Ae94F5180254D436A693907a1f57696900',
//         value: "1000000000",
//         gas: "671111",
//         xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
//     },
//         {
//             privateKey:"c03e8ee249d32de6a5e15cf526f05c89d574c275890be6ddbc61128facde79da",
//             chainId:"421614",
//             xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
//         });
//     // const data = JSON.parse(Buffer.from(d.rawTransaction,"base64").toString());
//     console.log(d);
// }
// main();

const {sendTransaction} = require("expand-network");
const {  signTransaction, prepareTransaction} = require('../../index');
// const { privateKey } = require('./privatekey');
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =  {
        from: '0x6Fb447Ae94F5180254D436A693907a1f57696900',
        to: '0x6Fb447Ae94F5180254D436A693907a1f57696900',
        value: "1000000000",
        gas: "671111",
        xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
            
        };

    const preparedTx = await prepareTransaction('https://uat.expand.network/chain/sendtransaction', txObject);
    console.log(preparedTx);
    const privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    const chainId = '5';
    const signedTx = await signTransaction(preparedTx,{
        chainId,
        xApiKey,
        privateKey
    });
    console.log(signedTx);
    // signedTx.xApiKey = xApiKey;
    // signedTx.chainId = '5';
    const tx = await sendTransaction({
        "chainId": "421613",
        "rawTransaction":signedTx.rawTransaction,
        "xApiKey": xApiKey

    });
    console.log("Transaction Pending....", tx);
}
main();












