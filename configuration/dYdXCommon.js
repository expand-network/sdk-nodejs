const { LocalWallet, Network, CompositeClient, BECH32_PREFIX, SubaccountClient } = require("@dydxprotocol/v4-client-js");

exports.getSubAccountClient = async (mnemonic, subAccountNumber) => {
    const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
    const network = Network.testnet();
    const client = await CompositeClient.connect(network);

    const subaccount = new SubaccountClient(wallet, subAccountNumber);
    return {client, subaccount};
};
