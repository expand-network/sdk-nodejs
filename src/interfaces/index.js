const { Wallet } = require('../adapters/Wallet');
const { WalletFordefi } = require('../adapters/WalletFordefi');
const { WalletDFNS } = require('../adapters/WalletDFNS');
const { WalletTON } = require('../adapters/WalletTON');


module.exports = {
    Wallet,
    WalletFordefi,
    WalletDFNS,
    WalletTON
};