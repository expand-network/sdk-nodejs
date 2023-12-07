const {  signTransaction, prepareTransaction} = require('../../../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =  {
        "method": "en_deposit",
        "params": [
            {
                "lendborrowId": "1000",
                "asset": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                "amount": "100000000000000",
                "from": "0x0a8062EeAA97b0CC055510eA125faA2cb37C1b3d",
                "onBehalfOf": "0x0a8062EeAA97b0CC055510eA125faA2cb37C1b3d",
                "gas": "408298"
                              
                            }
                        ],
                   
        
            "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
            "id": "expand.hemanth",
            "ids": "2c03e048-5778-4944-b804-0de77df9363r"
        };

    const preparedTx = await prepareTransaction('https://lend-borrow.quicknode.expand.network/lendborrow', txObject);
    console.log(preparedTx);
    const privateKey = '0x84d9b4595762f360fe58cc49dd5466d7d61e367322070899e5a213fd66e61c62';
    const chainId = '1';
    const signedTx = await signTransaction(preparedTx.result.result,{
        chainId,
        xApiKey,
        privateKey
    });
    console.log(signedTx);
    // signedTx.xApiKey = xApiKey;
    // signedTx.chainId = '5';
    const tx = await sendTransaction({
        "chainId": "1",
        "rawTransaction":signedTx.rawTransaction,
        "xApiKey": xApiKey
    
    });
    console.log("Transaction Pending....", tx);
}
main();