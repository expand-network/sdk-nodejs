

const {  Wallet, prepareTransaction} = require('expand-network');
// const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const wallet = new Wallet({privateKey: "96f965af1b75c901aea4a2f887a7b721b49834ca4f7daab1fa0047b2c57bc9a1",xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"});
    const txObject =  {
            "from": "0x356dB816602c85e2075774bB77D13995c8Bab023",
            "value": "100000", 
            "to": "0x6Fb447Ae94F5180254D436A693907a1f57696900",
            "gas": "250000",
            "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
            "chainId": "1"
        };

    const chainId = '1';
    const signedTx = await wallet.signTransaction(txObject);
    console.log(signedTx);
    signedTx.bdnTransaction = true;
    signedTx.xApiKey = xApiKey;
    signedTx.chainId = '1';
    // const tx = await wallet.sendTransaction(signedTx);
    // console.log("Transaction Pending....", tx);
}
main();




