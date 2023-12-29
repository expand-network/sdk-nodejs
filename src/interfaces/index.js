const { Wallet } = require('../adapters/Wallet');
const { WalletFordefi } = require('../adapters/WalletFordefi');
const { WalletDFNS } = require('../adapters/WalletDFNS');
const { WalletPhantom } = require('../adapters/WalletPhantom');
const { WalletCoinbase } = require('../adapters/WalletCoinbase');
const { WalletTON } = require('../adapters/WalletTON');
const { WalletFireblocks } = require('../adapters/WalletFireblocks');

module.exports = {
    Wallet,
    WalletFordefi,
    WalletDFNS,
    WalletPhantom,
    WalletCoinbase,
    WalletTON,
    WalletFireblocks
};