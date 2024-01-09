const { Wallet } = require('../adapters/Wallet');
const { WalletFordefi } = require('../adapters/WalletFordefi');
const { WalletDFNS } = require('../adapters/WalletDFNS');
const { WalletTON } = require('../adapters/WalletTON');
const { WalletFireblocks } = require('../adapters/WalletFireblocks');
const { WalletCircle } = require('../adapters/WalletCircle');
module.exports = {
    Wallet,
    WalletFordefi,
    WalletDFNS,
    WalletTON,
    WalletFireblocks,
    WalletCircle
};