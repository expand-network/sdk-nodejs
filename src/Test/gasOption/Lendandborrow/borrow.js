
const {sendTransaction} = require("expand-network");
const {  signTransaction, prepareTransaction} = require('../../../index');

const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
async function main() {
    const txObject =  {
        "lendborrowId": "1000",
        "asset": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        // "involveBaseToken":"1",
        "amount": "10000000000",
        // "deadline":"1710041427063",
        "from": "0xDeBB1a42a27051FD18d6d6C2055A44d330A4D80a",
        "onBehalfOf": "0xDeBB1a42a27051FD18d6d6C2055A44d330A4D80a",
        "gas": "10000",
        "interestRateMode": "2",
        "gasPriority":"low",
        "xApiKey": "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
            
        };

    const result = await prepareTransaction('http://localhost:3000/lendborrow/borrow', txObject);
    console.log(result);
    const privateKey = '0xe2c8146fe580f079c2bd2825d2f7069355b41e007772d7d725b6f856a751f8f9';
    const chainId = '1';
    const signedTx = await signTransaction(result,{
        chainId,
        xApiKey,
        privateKey
    });
    console.log(signedTx);
    // signedTx.xApiKey = xApiKey;
    // signedTx.chainId = '5';
    // const tx = await sendTransaction({
    //     "chainId": "1",
    //     "rawTransaction":signedTx.rawTransaction,
    //     "xApiKey": xApiKey
    
    // });
    // console.log("Transaction Pending....", );
}
main();




