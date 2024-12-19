import { WalletCircle, prepareTransaction } from '../src/index';
import dotenv from 'dotenv';

interface CircleWalletOptions {
    appId: string;
    apiKey: string;
    userId: string;
    walletId: string;
    userToken?: string; 
    encryptionKey?: string; 
}

interface UserTokenResponse {
    userToken: string;
    encryptionKey: string;
}

async function initCircleWallet(options: CircleWalletOptions): Promise<WalletCircle> {
   
    const userTokenResponse = await WalletCircle.getUserToken(options);

    
    const userToken: UserTokenResponse = typeof userTokenResponse === 'string'
        ? JSON.parse(userTokenResponse) 
        : userTokenResponse;

    
    const walletOptions = {
        ...options,
        userToken: userToken.userToken,
        encryptionKey: userToken.encryptionKey,
    } as Required<CircleWalletOptions>; 

    
    const wallet = new WalletCircle(walletOptions);
    return wallet;
}

async function main() {
   
    dotenv.config();

   
    const wallet = await initCircleWallet({
        appId: process.env.appId as string,
        apiKey: process.env.apiKey as string,
        userId: process.env.userId as string,
        walletId: process.env.walletId as string,
    });

   
    const prepareApproveTx = await prepareTransaction('https://api.expand.network/fungibletoken/approve', {
        from: "0x6E5eAf34c73D1CD0be4e24f923b97CF38e10d1f3",
        tokenAddress: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
        to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        amount: "10000",
        gas: "25000",
        xApiKey: process.env.xApiKey as string,
    });

    
    const signedTx = await wallet.signTransaction(prepareApproveTx);

    
    console.log("signedTx:", signedTx);

    
    const tx = await wallet.sendTransaction(signedTx);

    
    console.log("sent tx:", tx);
}

main().catch((error) => {
    console.error("An error occurred:", error);
});
