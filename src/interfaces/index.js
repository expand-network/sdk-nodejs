const { Wallet } = require('../adapters/Wallet');
const { WalletBitcoin } = require('../adapters/WalletBitcoin');
const { WalletCircle } = require('../adapters/WalletCircle');
const { WalletCoinbase } = require('../adapters/WalletCoinbase');
const { WalletCosmos } = require("../adapters/WalletCosmos");
const { WalletDFNS } = require('../adapters/WalletDFNS');
const { WalletFireblocks } = require('../adapters/WalletFireblocks');
const { WalletFordefi } = require('../adapters/WalletFordefi');
const { WalletPhantom } = require('../adapters/WalletPhantom');
const { WalletStacks } = require('../adapters/WalletStacks');
const { WalletStellar } = require('../adapters/WalletStellar');
const { WalletTON } = require('../adapters/WalletTON');
const { WalletXRPL } = require('../adapters/WalletXRPL');

module.exports = {
    Wallet,
    WalletFordefi,
    WalletDFNS,
    WalletPhantom,
    WalletCoinbase,
    WalletTON,
    WalletFireblocks,
    WalletCircle,
    WalletStellar,
    WalletXRPL,
    WalletCosmos,
    WalletStacks,
    WalletBitcoin
};
