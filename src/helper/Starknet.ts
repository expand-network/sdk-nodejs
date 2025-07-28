/* eslint-disable camelcase */
import BN from "bn.js";
import Web3 from 'web3';
import config from '../../configuration/config';

interface Call {
  contractAddress: string;
  entrypoint: string;
  calldata?: string[];
}

interface CallArrayItem {
  to: string;
  selector: string;
  data_offset: string;
  data_len: string;
}

interface MulticallArrays {
  callArray: CallArrayItem[];
  calldata: string[];
}

export const callsToArrayData = async (callObject: Call[]): Promise<string[]> => {
  const web3 = new Web3();

  function bigNumberishArrayToDecimalStringArray(rawCalldata: (string | number | bigint)[]): string[] {
    return rawCalldata.map((x) => BigInt(x).toString(10));
  }

  const transformCallsToMulticallArrays = (calls: Call[]): MulticallArrays => {
    const callArray: CallArrayItem[] = [];
    const calldata: (string | number | bigint)[] = [];

    calls.forEach((call) => {
      const selectordata = new BN(
        `${BigInt(BigInt(web3.utils.keccak256(call.entrypoint)).toString(10)).toString(16)}`,
        16
      ).iand(new BN(config.Mask250, 16));

      const data = call.calldata || [];
      callArray.push({
        to: BigInt(call.contractAddress).toString(10),
        selector: `${BigInt(`0x${selectordata}`).toString(16)}`,
        data_offset: calldata.length.toString(),
        data_len: data.length.toString(),
      });

      calldata.push(...data);
    });

    return {
      callArray,
      calldata: bigNumberishArrayToDecimalStringArray(calldata),
    };
  };

  const fromCallsToExecuteCalldata = (): string[] => {
    const { callArray, calldata } = transformCallsToMulticallArrays(callObject);

    return [
      callArray.length.toString(),
      ...callArray
        .map(({ to, selector, data_offset, data_len }) => [to, selector, data_offset, data_len])
        .flat(),
      calldata.length.toString(),
      ...calldata,
    ];
  };

  return fromCallsToExecuteCalldata();
};
