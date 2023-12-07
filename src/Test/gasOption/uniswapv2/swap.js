const { sendTransaction, signTransaction, prepareTransaction} = require('../../../index');

// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const result =  {
        from: "0xfAE7D9854995E28BEB1B1da864ee2A1E2EC17f07",
        tokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        amount: "100000000000",
        VaultNumber: "1",
        yieldAggregatorId: "5100",
        gas: "2307200",
        gasPriority:"medium",
        chainId: '1',
        xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T",
    };
    const rawtx = await prepareTransaction('http://localhost:3000/yieldaggregator/depositvault', result);
    const privateKey = 'f1c4832c6ed16a35f727befed43b0c9551903830513b9610d31d0a0aaa60dc1c';
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
