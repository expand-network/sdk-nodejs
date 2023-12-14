const { Wallet } = require('../adapters/Wallet');
const { WalletFordefi } = require('../adapters/WalletFordefi');
const { WalletDFNS } = require('../adapters/WalletDFNS');
const { WalletCircle } = require('../adapters/WalletCircle')
module.exports = {
    Wallet,
    WalletFordefi,
    WalletDFNS,
    WalletCircle
};