const {signTransaction,sendTransaction} = require('../../index');

async function main(){
const tx = await signTransaction( {
    from: '0xa67E9B68c41b0f26184D64C26e0b2B81466E5994',
    to: '0xF73eE0e06a1B8Ec3A7Ff860D766E75f3EEA7b985',
    value: "1000000000000",
    gas:"670543",
    xApiKey:"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"}
,
{
    privateKey:"a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86" , 
    chainId:"5" , 
    xApiKey:"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"});
// const data = JSON.parse(Buffer.from(d.rawTransaction,"base64").toString());
console.log(tx);
const tx = await sendTransaction({
    "chainId": "5",
    "rawTransaction":signedTx.rawTransaction,
    "xApiKey": xApiKey

});
}
main();














