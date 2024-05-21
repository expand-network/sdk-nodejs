const Web3 = require('web3')
const axios = require('axios')
const SERVER_URL = "https://api.expand.network/"
const config = require('../../configuration/config.json')

// Create an Axios instance with default headers
async function initializeAxios(xAPIKey) {
  const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    headers: {
      'x-api-key': xAPIKey,
    },
  })
  return axiosInstance
}

module.exports = {
  approveAndSwap: async (options) => {
    const { privateKey, xApiKey, chainId, from, path, gas, amountIn, dexId } = options
    const spender = config['dexes'][dexId]?.routerAddress
    console.log("Spender ---", spender)

    if (parseInt(dexId) === 1900 || parseInt(dexId) === 1901)
      throw new Error('unsuppoerted dex')
    else if (!spender)
      throw new Error('Invalid dex')

    let swapParams = options

    delete swapParams.xApiKey
    delete swapParams.privateKey
    delete swapParams.chainId

    const axiosInstance = await initializeAxios(xApiKey)

    let publicRpcResponse = null
    let rpc = null

    try {
      publicRpcResponse = await axiosInstance.get(`chain/getpublicrpc?chainId=${chainId}`)
      if (publicRpcResponse && publicRpcResponse?.data?.status === 200)
        rpc = publicRpcResponse?.data?.data?.rpc
      console.log("RPC --", rpc)
    } catch (error) {
      console.log("Error getting RPC url - ", error)
      return
    }

    console.log("Rpc --", rpc)
    const web3 = new Web3(rpc)
    const batch = new web3.BatchRequest()

    try {
      let nonce = await web3.eth.getTransactionCount(from, 'pending')
      console.log("Nonce before approval --", nonce)
      const allowanceResponse = await axiosInstance.get('fungibletoken/getuserallowance', {
        params: {
          owner: from,
          spender,
          tokenAddress: path[0],
        },
      })

      const allowance = allowanceResponse?.data?.data?.allowance || "0"

      console.log("Allowance --", allowance)
      let approvalResponse = null
      let updateAllowance = 0
      if (allowance < amountIn) {
        approvalResponse = await axiosInstance.post('fungibletoken/approve', {
          from,
          tokenAddress: path[0],
          amount: amountIn.toString(),
          to: spender,
          gas,
          chainId,
        })
      } else {
        updateAllowance = parseInt(allowance) - parseInt(amountIn)
      }


      if (approvalResponse?.data?.status === 200) {
        const approvalData = approvalResponse?.data?.data
        const approveTxObject = {
          chainId: approvalData.chainId,
          from,
          to: approvalData.to,
          value: approvalData.value,
          gas: approvalData.gas,
          data: approvalData.data,
          nonce
        }

        console.log("Approval object --", approveTxObject)

        const approveSignedTX = await web3.eth.accounts.signTransaction(approveTxObject, privateKey)
        console.log("Approve signed tx --", approveSignedTX)

        nonce = await web3.eth.getTransactionCount(from, "pending")

        await batch.add(web3.eth.sendSignedTransaction.request(approveSignedTX.rawTransaction, (err, data) => {
          if (err) {
            console.error('Error executing approve transaction:', err)
          } else {
            console.log('Approval transaction successful:', data)
          }
        }))
      }

      nonce = await web3.eth.getTransactionCount(from, 'pending')

      console.log("Nonce after approval but before swap  -----> ", nonce)

      const swapResponse = await axiosInstance.post('dex/swap', swapParams)

      const swapTxData = swapResponse?.data?.data
      const swapTxObject = {
        chainId: swapTxData.chainId,
        from,
        to: swapTxData.to,
        value: swapTxData.value,
        gas: swapTxData.gas,
        data: swapTxData.data,
        nonce: nonce + 1
      }

      console.log("SwapTXobject --", swapTxObject)
      const swapSignedTx = await web3.eth.accounts.signTransaction(swapTxObject, privateKey)
      nonce = await web3.eth.getTransactionCount(from, 'pending')

      await batch.add(web3.eth.sendSignedTransaction.request(swapSignedTx.rawTransaction, (err, data) => {
        if (err) {
          console.error('Error executing swap transaction:', err)
        } else {
          console.log('Swap transaction successful:', data)
        }
      }))
      
      await batch.execute()

    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message)
    }
  }
}
