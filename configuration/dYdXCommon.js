const { LocalWallet, Network, CompositeClient, BECH32_PREFIX, SubaccountClient, ValidatorClient } = require("@dydxprotocol/v4-client-js");

exports.getSubAccountCompositeClient = async (mnemonic, subAccountNumber) => {
    const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
    const client = await CompositeClient.connect(Network.testnet());

    const subaccount = new SubaccountClient(wallet, subAccountNumber);
    return {client, subaccount};
};

exports.getSubAccountValidatorClient = async (mnemonic, subAccountNumber) => {
    const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
    const client = await ValidatorClient.connect(Network.testnet().validatorConfig);

    const subaccount = new SubaccountClient(wallet, subAccountNumber);
    return {client, subaccount};
};