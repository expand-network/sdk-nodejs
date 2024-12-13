import { WalletCosmos } from '../src';

const xApiKey = 'X_API_KEY';

async function main() {
    const preparedTx: any = {
        "chainId": "theta-testnet-001",
        "from": "cosmos1h7sp085zemehp5gunplymxhflrp8ls4qm3mxrq",
        "to": "cosmos1h6r7sgwxfxps4payfyc8rl56svzmx6t5kpumg3",
        "value": "1000",
    }
    
    const wallet  = new WalletCosmos({ privateKey:'your Mnemonic in English', xApiKey:xApiKey});
    const signedTx = await wallet.signTransaction(preparedTx);
    console.log(signedTx);
    // const TxHash = await wallet.sendTransaction(signedTx);
    // console.log(TxHash);
}
    
main();