import axios from "axios";
import * as config from "../configuration/config";
import * as schemaValidator from "../configuration/schemaValidator";
import {
  Wallet,
  WalletFordefi,
  WalletDFNS,
  WalletTON,
  WalletFireblocks,
  WalletPhantom,
  WalletCoinbase,
  WalletCircle,
  WalletCosmos,
  WalletStellar,
  WalletXRPL,
} from "./interfaces/index.ts";

export const prepareTransaction = async (apiURL, options) => {
  const filterOptions = options;
  filterOptions.function = "prepareTransaction()";
  const validJson = await schemaValidator.validateInput(filterOptions);

  if (!validJson.valid) {
    return validJson;
  }

  const { chainId, xApiKey } = filterOptions;
  try {
    const paramConfig = {
      method: "post",
      url: apiURL,
      data: filterOptions,
      headers: {
        "x-api-key": xApiKey,
      },
    };

    const response = await axios(paramConfig).then((result) => result.data);
    if (chainId) response.data.chainId = chainId;
    return response.data;
  } catch (error) {
    return error;
  }
};

export const decodeTransaction = async (options) => {
  const filterOptions = options;
  filterOptions.function = "decodeTransaction()";
  const validJson = await validateInput(options);

  if (!validJson.valid) {
    return validJson;
  }

  try {
    const apiURL = `${config.url.apiurl}/chain/decodetransaction/`;

    const paramConfig = {
      method: "post",
      url: apiURL,
      data: filterOptions,
      headers: {
        "x-api-key": filterOptions.xApiKey,
      },
    };

    const response = await axios(paramConfig).then((result) => result.data);
    return response.data;
  } catch (error) {
    return error;
  }
};

// Replace `exports.Wallet = Wallet;` with:
export {
  Wallet,
  WalletFordefi,
  WalletDFNS,
  WalletTON,
  WalletFireblocks,
  WalletPhantom,
  WalletCoinbase,
  WalletCircle,
  WalletCosmos,
  WalletStellar,
  WalletXRPL,
};
