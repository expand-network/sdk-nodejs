const {sendTransaction} = require("expand-network");
const {  signTransaction, prepareTransaction} = require('../../index');
// const { privateKey } = require('./privatekey');
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =  {
        "bridgeId":"201",
        "srcChainId":"5",
        "dstChainId":"80001",
        "srcTokenSymbol":"WETH",
        "dstTokenSymbol":"aUSDC",
        "amountIn":"1000000000000",
        "from":"0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "gas":"920000",
        "to":"0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "xApiKey":"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
            
        };

    const preparedTx = await prepareTransaction('https://uat.expand.network/bridge/swap', txObject);
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
        "chainId": "5",
        "rawTransaction":signedTx.rawTransaction,
        "xApiKey": xApiKey

    });
    console.log("Transaction Pending....", tx);
}
main();