<a name="readme-top"></a>
<h1 align="center">
  <br>
    <center>
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://github.com/expand-network/sdk-nodejs/blob/main/logo/whiteLogo.png">
            <source media="(prefers-color-scheme: light)" srcset="https://github.com/expand-network/sdk-nodejs/blob/main/logo/blackLogo.png">
            <img alt="expand.network SDK">
        </picture>   
    </center>    
  <br>
  expand.network
  <br>
</h1>

<p align="center">
  <a href="#about-us">About Us</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#examples">Examples</a>
</p>

<h3 align="center">SDK for <a href="https://expand.network/" target="_blank">expand.network</a> built on top of Node.js</h3>

## About us

This is the free and open-source node.js SDK for expand.network, an adapter API service that offers one common gateway for various queries (read functions) and transactions (write functions) for all  major blockchains and smart contract based protocols. We offer a single integration point for access to all of DeFi.


For details on the complete capabilities of the API, please refer to the categories section in [our technical documentation](https://docs.expand.network).

We currently support the following blockchains:
<table>
  <thead>
    <tr>
      <th>Blockchain Types</th>
        <th>Blockchains</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>EVM compatible</td>
      <td>Ethereum, Binance Smart Chain, Avalanche, Polygon, Cronos, Arbitrum, Fantom, Optimism</td>
    </tr>
    <tr>
      <td>Non-EVM</td>
      <td>Solana, Tron, NEAR, Algorand</td>
      </tr>
  </tbody>
</table>

<br>

In addition, we currently support the following DeFi protocols:
<table>
  <thead>
    <tr>
      <th>Protocol types</th>
        <th>Protocol</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>DEX</td>
      <td>Uniswap v2, v3, Sushiswap, Pancakeswap, Curve, Balancer</td>
    </tr>
    <tr>
      <td>Lend and Borrow</td>
      <td>Aave, Compound</td>
    </tr>
    <tr>
        <td>Derivatives </td>
        <td>Synthetix</td>
    </tr>
    <tr>
        <td>Yield aggregators </td>
        <td>Yearn Finance, Harvest Finance</td>
    </tr>
    <tr>
        <td>Oracles </td>
        <td>Chainlink, Winklink</td>
    </tr>
  </tbody>
</table>
<br>

Coming soon:
<table>
  <thead>
    <tr>
      <th>Protocol Types</th>
        <th>Protocol</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Derivatives</td>
      <td>dYdX v4</td>
    </tr>
  </tbody>
</table>

<br> 

>All transactions are securely signed on your end, so your private key remains with you and never comes to us over API. We do not hold your crypto at any point: your keys, your crypto. Our APIs are a one-stop-shop for you to make the enquiries and conduct the transactions as you want.

## Installation
To install, just clone the repository from git directly. (npm install coming soon)
```
git clone https://github.com/4cmlab/expand.network
```

## Usage

### Chain functions
Sample code: Send one Wei from address ending in `2c7` to address ending in `86F`. You need to use your private key to sign the transaction. The return value is the transaction hash (`res`).

```js
const rawTransaction = await signTransaction({
    from: '0x1BdC0A29f667E2cc74e55531431986838023E2c7',
    to: '0x94a5E554DC172A472421291Ae6e6c0e3C150286F',
    value: '1',
    gas: '50000',
},{
    privateKey: 'YOUR_PRIVATE_KEY',
    xApiKey : 'YOUR_API_KEY'
}).then(rawTransaction => sendTransaction({
    rawTransaction: rawTransaction.rawTransaction,
    xApiKey : 'YOUR_API_KEY'
})).then(res => console.log(res));

```

### Dex functions swap
Sample code: Swap 5 DAI (token ending in `38D`) with WETH (token ending in `5Ab`). In this example, the "to" and "from" are the same (ending in `006`), so the swapped tokens will come back into the same address. Again, you need to use your private key to sign the transaction. 

```js

var transaction = await prepareTransaction('https://uat.expand.network/dex/swap', {
     amountIn: '5000000000000000000',
     amountOutMin: '0',
     path: ['0xaD6D458402F60fD3Bd25163575031ACDce07538D','0xc778417E063141139Fce010982780140Aa0cD5Ab'],
     to: '0x63056E00436Da25BcF48A40dfBbDcc7089351006',
     deadline: '1663143453',
     from: '0x63056E00436Da25BcF48A40dfBbDcc7089351006',
     gas: '229880',
     xApiKey : 'YOUR_API_KEY'
});

const rawTransaction = await signTransaction(transaction, {
      chainId: '1',
      privateKey: 'YOUR_PRIVATE_KEY',
      xApiKey : 'YOUR_API_KEY'
}).then(rawTransaction => sendTransaction({
      rawTransaction: rawTransaction.rawTransaction,
      chainId:'1',
      xApiKey : 'YOUR_API_KEY'
})).then(res => console.log(res))

```

## Examples

### Get balance 
Sample code: get balances from different chains: Ethereum, BSC and Solana.

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
Sample Code: For the swap pair DAI <> WETH, find the best price on three different DEX protocols: Uniswap v2, v3, and Sushiswap. Whichever DEX has the best price, swap the DAI with WETH on that particular DEX.
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
        gas: '229880',
        xApiKey : 'YOUR_API_KEY'
    });

    const rawTransaction = await signTransaction(transaction, {
        chainId: '3',
        privateKey: privateKey,
        xApiKey : 'YOUR_API_KEY'
    }).then(rawTransaction => sendTransaction({
        rawTransaction: rawTransaction.rawTransaction,
        chainId:'3',
        xApiKey : 'YOUR_API_KEY'
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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br> 
<br>

> Twitter [@expand_network](https://twitter.com/expand_network)
