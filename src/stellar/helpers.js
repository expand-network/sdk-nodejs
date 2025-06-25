const axios = require('axios'); 
const config = require("../../configuration/config.json");
function bufferToString(buffer) {
    return buffer.toString('utf-8');
  }

async function getTransactionByHash(chainId,transactionHash) {
    const requestBody = {
      "jsonrpc": "2.0",
      "id": 8675309,
      "method": "getTransaction",
      "params": {
        "hash": transactionHash
      }
    };
  
    try {
      const res = await axios.post(config.chains[chainId].sorobanRpc, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return res.data;
    } catch (error) {
      console.error('Error making request:', error);
      throw error;
    }
  }

module.exports = { getTransactionByHash,
                    bufferToString };