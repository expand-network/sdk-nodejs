# expand.network - node.js SDK

This is the free and open-source node.js SDK to connect to expand.network, an adapter API service that offers one common gateway for the various queries (read) and transactions (write) functions for all  major blockchains and smart contract based protocols. We offer a single integration point for access to all of DeFi.

For details on the complete capabilities of the API, please refer to the categories section in [our technical documentation](https://docs.expand.network).


We currently support the following blockchains:

| Blockchain types      | Blockchains           |
| ------------- |-------------|
| EVM compatible    |  Ethereum, Binance Smart Chain, Avalanche, Polygon, Cronos, Arbitrum |
| Non-EVM     | Solana, Tron, NEAR, Algorand      |

In addition, we currently support the following DeFi protocols:

| Protocol types      | Protocol           |
| ------------- |-------------|
| DEX    |  Uniswap v2, v3, Sushiswap, Pancakeswap, Curve, Balancer coming soon |
| Lend and Borrow     | Aave, Compound      |
| Derivatives    |  Synthetix, DyDx v4 coming soon |
| Yield aggregators     | Yearn, Harvest coming soon      |
| Oracles     | Chainlink coming soon |

Coming soon:

Chains -

| Blockchain types      | Blockchains           |
| ------------- |-------------|
| EVM compatible    |  Optimism |

Protocol -

| Protocol types      | Protocol           |
| ------------- |-------------|
| DEX    |  Balancer |
| Derivatives    |  Synthetix, DyDx v4 |
| Yield aggregators     | Yearn, Harvest      |
| Oracles     | Chainlink |

All transactions are securely signed on your end, so your private key remains with you and never comes to us over API. We do not hold your crypto at any point: your keys, your crypto. Our APIs are a one-stop-shop for you to make the enquiries and conduct the transactions as you want.

## Installation
To install, just clone the repository from git directly. (npm install coiming soon.)
```
git clone https://github.com/4cmlab/expand.network
```

## Usage

### Chain functions
Example code: Send one Wei from address ending in `2c7` to address ending in `86F`. You need to use your private key to sign the transaction. The return value is the transaction hash (`res`).

```js
const rawTransaction = await signTransaction({
    from: '0x1BdC0A29f667E2cc74e55531431986838023E2c7',
    to: '0x94a5E554DC172A472421291Ae6e6c0e3C150286F',
    value: '1',
    gas: 50000,
},{
    privateKey: YOUR_PRIVATE_KEY'
}).then(rawTransaction => sendTransaction({
    rawTransaction: rawTransaction.rawTransaction,
})).then(res => console.log(res));

```

### Dex functions swap
Example code: Swap 5 DAI (token ending in `38D`) with WETH (token ending in `5Ab`). In this example, the "to" and "from" are the same (ending in `006`), so the swapped tokens will come back into the same address. Again, you need to use your private key to sign the transaction. 

```js

var transaction = await prepareTransaction('https://uat.expand.network/dex/swap', {
     amountIn: '5000000000000000000',
     amountOutMin: '0',
     path: ['0xaD6D458402F60fD3Bd25163575031ACDce07538D','0xc778417E063141139Fce010982780140Aa0cD5Ab'],
     to: '0x63056E00436Da25BcF48A40dfBbDcc7089351006',
     deadline: '1663143453',
     from: '0x63056E00436Da25BcF48A40dfBbDcc7089351006',
     gas: '229880'
});

const rawTransaction = await signTransaction(transaction, {
      chainId: '1',
      privateKey: 'YOUR_PRIVATE_KEY'
}).then(rawTransaction => sendTransaction({
      rawTransaction: rawTransaction.rawTransaction,
      chainId:'1'
})).then(res => console.log(res))

```

## Examples

### Get balance 
Example code: get balances from different chains: Ethereum, BSC and Solana.

```js

 // Fetching balance from Ethereum
config.params = {
    address: publicAddressEvm
}
response = await axios.get(baseUrl + '/chain/getbalance/', config);
balance = response.data.balance / 10**18;
console.log (`${publicAddressEvm} balance on ethereum chain is ${balance}`);


// Fetching balance from Binance Smart Chain 
config.params = {
    chainId: '56',
    address: publicAddressEvm
}
response = await axios.get(baseUrl + '/chain/getbalance/', config);
balance = response.data.balance / 10**18;
console.log (`${publicAddressEvm} balance on binance smart chain is ${balance}`);


// Fetching balance from Solana 
config.params = {
    chainSymbol: 'SOL',
    address: publicAddressSolana
}
response = await axios.get(baseUrl + '/chain/getbalance/', config);
balance = response.data.balance / 10**9;
console.log (`${publicAddressSolana} balance on solana chain is ${balance}`);

```

### Swap with best price
For the swap pair DAI <> WETH, find the best price on three different DEX protocols: Uniswap v2, v3, and Sushiswap. Whichever DEX has the best price, swap the DAI with WETH on that DEX.
```js

 const getPrice = async(dexId) => {

    config.params = {
        dexId: dexId,
        path: DAI + ',' + WETH,
        amountIn: amount
    }

    const response = await axios.get(baseUrl + '/dex/getprice/', config);
    // console.log(response)
    prices[dexId] = response.data.amountsOut[1];

}


const swap = async(dexId) => {

    var transaction = await prepareTransaction(baseUrl + '/dex/swap', {
        dexId: dexId,
        amountIn: amount,
        amountOutMin: '0',
        path: [ DAI, WETH ],
        to: publicAddress,
        deadline: Date.now() + 60*60*20,
        from: publicAddress,
        gas: '229880'
    });

    const rawTransaction = await signTransaction(transaction, {
        chainId: '3',
        privateKey: privateKey
    }).then(rawTransaction => sendTransaction({
        rawTransaction: rawTransaction.rawTransaction,
        chainId:'3'
    })).then(res => console.log(res))

}


const bestBuy = async() => {

    // Fetching price from Uniswap V2
    await getPrice('1001');
    // Fetching price from Sushiswap
    await getPrice('1101');
    // Fetching price from Uniswap V3
    await getPrice('1301');

    var max = 0;
    var maxDexId = 0;

    for ( var dexId in prices ){
        if ( Number(prices[dexId]) > max ) {
            max = prices[dexId];
            maxDexId = dexId;
        }
    }
    
    console.log(`${maxDexId} gives the best swap price of ${max}`);

    // Time to swap the tokens
    swap(maxDexId);

}

bestBuy();

```

