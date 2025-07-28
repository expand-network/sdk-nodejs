import { OrderFlags } from '@dydxprotocol/v4-client-js';
import axios from 'axios';
import { getSubAccountCompositeClient } from '../../configuration/dYdXCommon';
import errorMessage from '../../configuration/errorMessage';

interface CancelOrderOptions {
  subAccountNumber: number;
  mnemonic: string;
  orderId: string;
  goodTillTimeInSeconds: string;
}

interface OrderResponse {
  clientId: string;
  ticker: string;
}

interface ErrorResponse {
  message: string;
  code: number;
}

export const cancelOrder = async (options: CancelOrderOptions): Promise<any> => {
  const { subAccountNumber, mnemonic, orderId, goodTillTimeInSeconds } = options;

  const { client, subaccount } = await getSubAccountCompositeClient(mnemonic, subAccountNumber);

  const orderConfig = {
    method: 'get' as const,
    maxBodyLength: Infinity,
    url: `https://indexer.v4testnet.dydx.exchange/v4/orders/${orderId}`,
    headers: {},
  };

  let order: OrderResponse;

  try {
    const res = await axios.request<OrderResponse>(orderConfig);
    order = res.data; // Assuming the response directly contains `clientId` and `ticker`
  } catch (err) {
    return {
      message: errorMessage.error.message.invalidOrderId,
      code: errorMessage.error.code.invalidInput,
    } as ErrorResponse;
  }

  try {
    const tx = await client.cancelOrder(
      subaccount,
      Number(order.clientId),
      OrderFlags.LONG_TERM,
      order.ticker,
      0,
      Number(goodTillTimeInSeconds)
    );
    return tx;
  } catch (error: any) {
    return error.message;
  }
};
