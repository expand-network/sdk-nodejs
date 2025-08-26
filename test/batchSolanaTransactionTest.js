require("dotenv").config();
const { Wallet } = require("../src");


// const expandUrl = config.url.apiurl;
const chainId = "901";
const wallet = new Wallet({privateKey: process.env.WALLET_PRIVATE_KEY, xApiKey: process.env.xApiKey});


async function main() {
    const transaction = {
    "createFeeTxn": {
        "chainId": "901",
        "from": "AwP5MbpfkWE5rTexpvyYcUbwMVRPREJUvRAaG3RMFjZB",
        "to": "5J6965sgJL2mqQKTAzwzu5aU4kqzdX5K317dvBtsMVrV",
        "data": "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEDk6eBpBpTtqRL9iOgd3cC9LRqU4n9nOyHeLcAsmI79qI/z27B3cVlDTskOZvU9YB2VgrhMCghcDHAVfJ/UqM9RgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbwfjd7qsaDWPMUbCCj7okevdbVEMUd4GwWeZ1F1mtcBAgIAAQwCAAAAgLLmDgAAAAA="
    },
    "createFeeTxn1": {
        "chainId": "901",
        "from": "AwP5MbpfkWE5rTexpvyYcUbwMVRPREJUvRAaG3RMFjZB",
        "to": "E5WuBKn4FgSicu6MEBtAaYKdJZDvH4gtmCnGFW1eLMYn",
        "data": "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEDk6eBpBpTtqRL9iOgd3cC9LRqU4n9nOyHeLcAsmI79qLCUA+WVeHjAIqYVVNIsgfA1X7kQXykCnOpaofSMAFniwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbwfjd7qsaDWPMUbCCj7okevdbVEMUd4GwWeZ1F1mtcBAgIAAQwCAAAAgLLmDgAAAAA="
    }
    };
    const executeBatchCall = await wallet.signSendBatchTransactions({chainId, transactions: transaction});
    console.log("executeBatch --", executeBatchCall);
};


main();