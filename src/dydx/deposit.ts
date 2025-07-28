import axios from 'axios';
import dotenv from 'dotenv';
import config from '../../configuration/config';
import errorMessage from '../../configuration/errorMessage';
import tokenConfig from '../../configuration/squidRouterTokenConfig';
import { Wallet } from '../adapters/Wallet';

dotenv.config();

interface DepositOptions {
  srcChainId: number;
  from: string;
  to: string;
  amountIn: string;
  tokenIn: string;
  slippage: number;
  gas: number;
  privateKey: string;
}

interface ErrorResponse {
  message: string;
  code: string;
}

interface TransactionRequest {
  gasPrice: string;
  data: string;
  targetAddress: string;
  value: string;
}

export const deposit = async (options: DepositOptions): Promise<any> => {
  const { 
    srcChainId: fromChain, 
    from: fromAddress, 
    to: toAddress, 
    amountIn: fromAmount, 
    tokenIn, 
    slippage, 
    gas, 
    privateKey 
  } = options;

  const fromToken = tokenConfig[fromChain]?.[tokenIn.toUpperCase()];

  if (fromToken === undefined) {
    return {
      message: errorMessage.error.message.invalidSrcToken,
      code: errorMessage.error.code.invalidInput,
    };
  }

  const routeURL = `${config.dYdXV4.squidRouterAPIBaseUrl}route`;

  let result;
  try {
    result = await axios.get(routeURL, {
      params: {
        fromChain,
        fromToken,
        fromAddress,
        fromAmount,
        toChain: config.dYdXV4.chainId,
        toToken: config.dYdXV4.USDC,
        toAddress,
        slippage,
        quoteOnly: false,
      },
    });
  } catch (err: any) {
    return err.response?.data || { message: 'An unknown error occurred.' };
  }

  const { gasPrice, data, targetAddress: to, value } = result.data.route.transactionRequest as TransactionRequest;

  const wallet = new Wallet({
    privateKey,
    xApiKey: process.env.xApiKey || '',
  });

  const createTransaction = await wallet.signTransaction({
    chainId: String(fromChain),
    from: fromAddress,
    gas: String(gas),
    gasPrice,
    data,
    value,
    to,
  });

  if (!createTransaction?.name?.valid) {
    return new Error('Invalid transaction: ' + createTransaction?.message);
  }

  const transactionReceipt = await wallet.sendTransaction(createTransaction);
  return transactionReceipt;
};
