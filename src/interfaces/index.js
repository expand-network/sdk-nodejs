const { Wallet } = require('../adapters/Wallet');
const { WalletFordefi } = require('../adapters/WalletFordefi');
const { WalletDFNS } = require('../adapters/WalletDFNS');
const { WalletPhantom } = require('../adapters/WalletPhantom');
const { WalletTON } = require('../adapters/WalletTON');
const { WalletFireblocks } = require('../adapters/WalletFireblocks');

module.exports = {
    Wallet,
    WalletFordefi,
    WalletDFNS,
    WalletPhantom,
    WalletTON,
    WalletFireblocks
};