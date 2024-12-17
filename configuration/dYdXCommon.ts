import {
    LocalWallet,
    Network,
    CompositeClient,
    BECH32_PREFIX,
    SubaccountClient,
    ValidatorClient,
  } from "@dydxprotocol/v4-client-js";
  
  export const getSubAccountCompositeClient = async (
    mnemonic: string,
    subAccountNumber: number
  ): Promise<{
    client: CompositeClient;
    subaccount: SubaccountClient;
  }> => {
    const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
    const client = await CompositeClient.connect(Network.testnet());
  
    const subaccount = new SubaccountClient(wallet, subAccountNumber);
    return { client, subaccount };
  };
  
  export const getSubAccountValidatorClient = async (
    mnemonic: string,
    subAccountNumber: number
  ): Promise<{
    client: ValidatorClient;
    subaccount: SubaccountClient;
  }> => {
    const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
    const client = await ValidatorClient.connect(Network.testnet().validatorConfig);
  
    const subaccount = new SubaccountClient(wallet, subAccountNumber);
    return { client, subaccount };
  };
  