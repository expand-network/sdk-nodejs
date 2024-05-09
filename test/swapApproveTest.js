const Web3 = require('web3');
const erc20ABI = require('../assets/abis/WETHERC20.json');
const uniswapRouterABI = require('../assets/abis/UniswapRouterV2.json');
const { batchRequest } = require('../src/batchRequest')
const SEPOLIA_RPC_URL = "https://aged-bold-general.quiknode.pro/aca755115e18fb7c58c55a9e7c1af78e55e9cde2/"
const WETH_CONTRACT_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
const DAI_CONTRACT_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

// Connect to Ethereum network
const web3 = new Web3(SEPOLIA_RPC_URL);

// Instantiate ERC20 token contract
const tokenContract = new web3.eth.Contract(erc20ABI, WETH_CONTRACT_ADDRESS); // WETH contract address

// Instantiate Uniswap Router contract
const uniswapRouterContract = new web3.eth.Contract(uniswapRouterABI, UNISWAP_ROUTER_ADDRESS);

async function getApproveRawTransaction(valueInWei, account, gas, gasPrice) {
    // Approve transaction
    const approveTx = tokenContract.methods.approve(UNISWAP_ROUTER_ADDRESS, valueInWei);
    const approveTxData = approveTx.encodeABI();
    const rawApptoveTx = {
        from: account,
        to: tokenContract.options.address,
        value: '0x0',
        data: approveTxData,
        gas,
        // gasPrice: web3.utils.toWei(gasPrice, 'gwei')
    }
    console.log("Raw Approve Transaction --", rawApptoveTx)
    return rawApptoveTx;
}

async function getSwapTransactionData(valueInWei, account, gas, gasPrice) {
    const swapTx = uniswapRouterContract.methods.swapExactTokensForTokens(
        valueInWei,                                       // Amount to swap
        '0',                                              // Minimum amount of output tokens
        [WETH_CONTRACT_ADDRESS, DAI_CONTRACT_ADDRESS],    // Path: WETH -> DAI
        account,                                          // Recipient address
        Date.now() + 1000 * 60 * 10                       // Deadline (10 minutes from now)
    );
    const swapTxData = swapTx.encodeABI();
    const rawSwapTx = {
        from: account,
        to: uniswapRouterContract.options.address,
        value: '0x0',
        data: swapTxData,
        gas,
        // gasPrice: web3.utils.toWei(gasPrice, 'gwei')
    };
    console.log("Raw Swap Transaction --", rawSwapTx)
    return rawSwapTx;
}

async function executeBatch(value, from, privateKey, gas, gasPrice) {

    // Token amount
    const valueInWei = web3.utils.toWei(value, 'ether');

    const rawApproveTx = await getApproveRawTransaction(valueInWei, from, gas, gasPrice)
    const rawSwapTx = await getSwapTransactionData(valueInWei, from, gas, gasPrice)

    let transactionObjects = [rawApproveTx, rawSwapTx]
    // let approveObject = {
    //     "from": "0x1F552c1068042F4c38e85C8Cc743737B38276295",
    //     "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    //     "value": "0x0",
    //     "data": '0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d00000000000000000000000000000000000000000000000000000000000007d0',
    //     "gas": "200000",
    //     "gasPrice": "1000000000000"
    // }
    // let swapObject = {
    //     "from": "0x1F552c1068042F4c38e85C8Cc743737B38276295",
    //     "to": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    //     "value": "0x0",
    //     "data": '0x38ed173900000000000000000000000000000000000000000000000000000000000007d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000001f552c1068042f4c38e85c8cc743737b382762950000000000000000000000000000000000000000000000000000018f337abec60000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000006b175474e89094c44da98b954eedeac495271d0f',
    //     "gas": "200000",
    //     "gasPrice": "1000000000000"
    // }
    // let transactionObjects = [approveObject, swapObject]

    await batchRequest(transactionObjects, privateKey, from)
}

// Account
const from = '0x1F552c1068042F4c38e85C8Cc743737B38276295';
const PRIVATE_KEY = 'b18502e6b52f210eade60a8f355dc5e4ef65aabf24197062cd7d4a35491dc5fd';
const gas = '300000';
const value = '2000000000000000'

executeBatch(value, from, PRIVATE_KEY, gas);
