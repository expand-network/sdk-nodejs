const { signTransaction, prepareTransaction} = require('../../../../index');
const {sendTransaction} = require("expand-network");
// const { privateKey } = require('./privatekey');
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =  {
               "method": "en_exitIsolationMode",
                        "params": [
                            {
                                "lendborrowId":"1201",
                                "asset":"0x6d906e526a4e2ca02097ba9d0caa3c382f52278e",
                                "from":"0x6Fb447Ae94F5180254D436A693907a1f57696900",
                                "gas":"929000"
                              
                            }
                        ],
                   
        
            "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
            "id": "expand.hemanth",
            "ids": "2c03e048-5778-4944-b804-0de77df9363r"
        };

    const preparedTx = await prepareTransaction('https://lend-borrow.quicknode.expand.network/lendborrow', txObject);
    console.log(preparedTx);
    const privateKey = 'c03e8ee249d32de6a5e15cf526f05c89d574c275890be6ddbc61128facde79da';
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