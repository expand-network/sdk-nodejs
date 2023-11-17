/* eslint-disable camelcase */
const web3 = require('web3');
const BN = require("bn.js");
const config = require('../../configuration/config.json');

module.exports = {

    callsToArrayData: async (callObject) => {

        function bigNumberishArrayToDecimalStringArray(rawCalldata) {
            return rawCalldata.map((x) => BigInt(x).toString(10));
        }

        const transformCallsToMulticallArrays = (calls) => {
            const callArray = [];
            const calldata = [];

            calls.forEach((call) => {
                // eslint-disable-next-line max-len
                const selectordata = new BN(`${(BigInt(BigInt((web3.utils.keccak256(call.entrypoint))).toString(10)).toString(16))}`, 16).iand(new BN(config.Mask250, 16));
                const data = call.calldata || [];
                callArray.push({
                    to: BigInt(call.contractAddress).toString(10),
                    selector: `${(BigInt(`0x${selectordata}`).toString(16))}`,
                    data_offset: calldata.length.toString(),
                    data_len: data.length.toString()
                });
                calldata.push(...data);
            });

            return {
                callArray,
                calldata: bigNumberishArrayToDecimalStringArray(calldata)
            };
        };

        const fromCallsToExecuteCalldata = () => {
            const { callArray, calldata } = transformCallsToMulticallArrays(callObject);
            return [
                callArray.length.toString(),
                ...callArray.map(
                    ({ to, selector, data_offset, data_len }) => [to, selector, data_offset, data_len]
                ).flat(),
                calldata.length.toString(),
                ...calldata
            ];
        };

        return fromCallsToExecuteCalldata();
    }
};