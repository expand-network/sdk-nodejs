const { stripHexPrefix } = require('@dydxprotocol/v4-client-js/build/src/lib/helpers');
const { HDKey } = require('@scure/bip32');
const { entropyToMnemonic, mnemonicToSeedSync } = require('@scure/bip39');
const { wordlist } = require('@scure/bip39/wordlists/english');
const { keccak256 } = require('ethereum-cryptography/keccak');

const config = require("../../configuration/config.json");
const {initialiseWeb3} = require('../../configuration/intialiseWeb3');

const exportMnemonicAndPrivateKey = (entropy, path = "m/44'/118'/0'/0/0") => {
    const mnemonic = entropyToMnemonic(entropy, wordlist);
    const seed = mnemonicToSeedSync(mnemonic);

    const hdkey = HDKey.fromMasterSeed(seed);
    const derivedHdkey = hdkey.derive(path);

    if (!hdkey.privateKey) {
        throw new Error('null hd key');
    }

    return {
        mnemonic,
        privateKey: derivedHdkey.privateKey,
        publicKey: derivedHdkey.publicKey,
    };
};

module.exports = {
    userOnboarding: async (options) => {
        const web3 = await initialiseWeb3({chainId: '1'});
        const {signature} = await web3.eth.accounts.sign(config.dYdXV4.signingMsg, options.privateKey);
        const buffer = Buffer.from(stripHexPrefix(signature), 'hex');

        if (buffer.length !== 65) {
            throw new Error('Signature must be 65 bytes');
        }

        const rsValues = buffer.subarray(0, 64);
        const entropy = keccak256(rsValues);
        return exportMnemonicAndPrivateKey(entropy);
    }
};
