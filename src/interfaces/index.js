const { Wallet } = require('../adapters/Wallet');
const { WalletFordefi } = require('../adapters/WalletFordefi');
const { WalletDFNS } = require('../adapters/WalletDFNS');
const { WalletPhantom } = require('../adapters/WalletPhantom');
const { WalletCoinbase } = require('../adapters/WalletCoinbase');
const { WalletTON } = require('../adapters/WalletTON');
const { WalletFireblocks } = require('../adapters/WalletFireblocks');
const { WalletCircle } = require('../adapters/WalletCircle');
const { WalletCosmos } = require("../adapters/WalletCosmos");
const { WalletStellar } = require('../adapters/WalletStellar');
const { WalletXRPL } = require('../adapters/WalletXRPL');
const { WalletStacks } = require('../adapters/WalletStacks');
const { WalletBitcoin } = require('../adapters/WalletBitcoin');

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
