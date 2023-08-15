const { ethers } = require("ethers");

module.exports = {
  getSignatureDutchOrder: async (options, privateKey) => {
    /*
     * Function will generate the signature for uniswapX DutchOrder
     */
    const provider = new ethers.providers.JsonRpcProvider(options.rpc);
    const signer = new ethers.Wallet(privateKey, provider);
    try {
      return await signer._signTypedData(
        options.domain,
        options.types,
        options.values
      );
    } catch (error) {
      return error;
    }
  },
};
