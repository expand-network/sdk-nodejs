import EvmWeb from "web3";
import solanaWeb from "@solana/web3.js";
import TronWeb from "tronweb";
import nearApi from "near-api-js";
import algosdk from "algosdk";
import { JsonRpcProvider, Connection } from "@mysten/sui.js";
import { AptosClient } from "aptos";
import { TonClient } from "@ton/ton";
import { StargateClient } from "@cosmjs/stargate";
import StellarSdk from "stellar-sdk";
import * as common  from "./common";
import config from "./config.json";
import errorMessage from "./errorMessage.json";

import { Server } from "stellar-sdk";

const invalidChainId = {
  error: errorMessage.error.message.invalidChainId,
  code: errorMessage.error.code.invalidInput
};

export const initialiseWeb3 = async (data: any) => {
  const chainId = await common.getChainId({
    chainId: data.chainId,
    chainSymbol: data.chainSymbol
  });

  let rpc;
  let chainName;

  try {
    rpc = data.rpc || config.chains[chainId].rpc;
    chainName = config.chains[chainId].chainName;
  } catch (error) {
    return invalidChainId;
  }

  let web3;

  if (chainName === "Evm") {
    web3 = new EvmWeb(rpc);
  } else if (chainName === "Solana") {
    web3 = new solanaWeb.Connection(rpc);
  } else if (chainName === "Tron") {
    const { HttpProvider } = TronWeb.providers;
    const fullNode = new HttpProvider(rpc);
    const solidityNode = new HttpProvider(rpc);
    const eventServer = new HttpProvider(rpc);
    web3 = new TronWeb(fullNode, solidityNode, eventServer);
  } else if (chainName === "Near") {
    web3 = await nearApi.connect({
      networkId: data.networkId,
      nodeUrl: rpc
    });
  } else if (chainName === "Algorand") {
    const token = { "x-api-key": data.key };
    web3 =
      data.connectionType === "idx"
        ? new algosdk.Indexer(token, rpc, "")
        : new algosdk.Algodv2(token, rpc, "");
  } else if (chainName === "Sui") {
    const connection = new Connection({ fullnode: rpc });
    web3 = new JsonRpcProvider(connection);
  } else if (chainName === "Aptos") {
    web3 = new AptosClient(rpc);
  } else if (chainName === "TON") {
    web3 = new TonClient({ endpoint: rpc, apiKey: config.chains[chainId]?.apiKey });
  } else if (chainName === "Stellar") {
    web3 = new HorizonServer(rpc);
  } else if (chainName === "Cosmos") {
    web3 = await StargateClient.connect(rpc);
  }

  return web3;
};
