const { signTransaction, prepareTransaction} = require('../../../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =  {
               "method": "en_setUserEMode",
                        "params": [
                            {
                                "lendborrowId":"1201",
                                "asset":"0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
                                "from":"0xa67E9B68c41b0f26184D64C26e0b2B81466E5994", 
                                "gas":"399000",
                                "categoryId":"1"
                              
                            }
                        ],
                   
        
            "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
            "id": "expand.hemanth",
            "ids": "2c03e048-5778-4944-b804-0de77df9363r"
        };

    const preparedTx = await prepareTransaction('https://lend-borrow.quicknode.expand.network/lendborrow', txObject);
    console.log(preparedTx);
    const privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    const chainId = '11155111';
    const signedTx = await signTransaction(preparedTx.result.result,{
        chainId,
        xApiKey,
        privateKey
    });
    console.log(signedTx);
    // signedTx.xApiKey = xApiKey;
    // signedTx.chainId = '5';
    const tx = await sendTransaction({
        "chainId": "11155111",
        "rawTransaction":signedTx.rawTransaction,
        "xApiKey": xApiKey
    
    });
    console.log("Transaction Pending....", tx);
}
main();