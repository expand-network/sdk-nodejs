const { Wallet } = require('../adapters/Wallet');
const { WalletFordefi } = require('../adapters/WalletFordefi');
const { WalletDFNS } = require('../adapters/WalletDFNS');
const { WalletCoinbase } = require('../adapters/WalletCoinbase');
module.exports = {
    Wallet,
    WalletFordefi,
    WalletDFNS,
    WalletCoinbase
};