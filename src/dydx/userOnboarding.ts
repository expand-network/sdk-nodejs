import { BECH32_PREFIX, LocalWallet } from '@dydxprotocol/v4-client-js';
import { deriveHDKeyFromEthereumSignature } from '@dydxprotocol/v4-client-js/build/src/lib/onboarding';
import { ethers } from 'ethers-5';
import config from '../../configuration/config';


export const  userOnboarding= async (options:any) => {
        const provider = new ethers.providers.JsonRpcProvider(config.dYdXV4.rpc);
        const signer = new ethers.Wallet(options.privateKey, provider);
        const {signingMsg} = config.dYdXV4;

        const signature = await signer._signTypedData(signingMsg.domain, { dYdX: signingMsg.types.dYdX }, signingMsg.message);
        const keys = deriveHDKeyFromEthereumSignature(signature);
        const {mnemonic, publicKey, privateKey} = keys;
        const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
        return {mnemonic, publicKey, privateKey, address: wallet.address};
    };

