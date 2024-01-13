const { BECH32_PREFIX, LocalWallet } = require('@dydxprotocol/v4-client-js');
const { ethers } = require('ethers-5');
const config = require("../../configuration/config.json");
const { deriveHDKeyFromEthereumSignature } = require('@dydxprotocol/v4-client-js/build/src/lib/onboarding');

module.exports = {
    userOnboarding: async (options) => {
        const provider = new ethers.providers.JsonRpcProvider(config.dYdXV4.rpc);
        const signer = new ethers.Wallet(options.privateKey, provider);
        const {signingMsg} = config.dYdXV4;

        const signature = await signer._signTypedData(signingMsg.domain, { dYdX: signingMsg.types.dYdX }, signingMsg.message);
        const keys = deriveHDKeyFromEthereumSignature(signature);
        const {mnemonic, publicKey, privateKey} = keys;
        const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
        return {mnemonic, publicKey, privateKey, address: wallet.address}
    }
};
