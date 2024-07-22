<a name="readme-top"></a>
<h1 align="center">
  <br>
    <center>
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://github.com/expand-network/sdk-nodejs/blob/main/logo/whiteLogo.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://github.com/expand-network/sdk-nodejs/blob/main/logo/blackLogo.svg">
            <img alt="expand.network SDK">
        </picture>   
    </center>    
  <br>
  expand.network
  <br>
</h1>
<p align="center">
  <a href="#about-us">:wave: About Us</a> •
  <a href="#client-side-security-essentials">:shield: Client-Side Security Essentials</a> •
  <a href="#installation">:desktop_computer: Installation</a> •
  <a href="#usage">:technologist: Usage</a> •
  <a href="#examples">:page_with_curl: Examples</a>•
  <a href="#socials">:globe_with_meridians: Socials</a> 
</p>
<h3 align="center">:large_orange_diamond: SDK for <a href="https://expand.network/" target="_blank">expand.network</a> built on top of Node.js :large_orange_diamond:</h3>
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
      <td>Arbitrum, Avalanche, Base, Binance Smart Chain, Cronos, Ethereum, Fantom, Optimism, Polygon, zkSync</td>
    </tr>
    <tr>
      <td>Non-EVM</td>
      <td>Algorand, Aptos, NEAR, Solana, Starknet, Stellar, Sui, TON, Tron</td>
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
      <td>DEX & Aggregators </td>
      <td>0x, 1inch, Balancer, Curve, Kyberswap, Pancakeswap, Sushiswap, Trader Joe, Uniswap (V2, V3, X)</td>
    </tr>
    <tr>
        <td>Bridge </td>
        <td>Stargate, Squid Router</td>
    </tr>
     <tr>
      <td>Lend and Borrow</td>
      <td>Aave V2, Aave V3, Compound V2, Compound V3</td>
    </tr>
    <tr>
        <td>Synthetic</td>
        <td>Synthetix</td>
    </tr>
    <tr>
        <td>Yield aggregator</td>
        <td>Yearn Finance, Harvest Finance</td>
    </tr>
    <tr>
        <td>Oracle</td>
        <td>Chainlink, Pyth Network, Winklink</td>
    </tr>
    <tr>
      <td>Derivative</td>
      <td>dYdX v4</td>
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
      <td>Liquid Staking</td>
      <td>Lido</td>
    </tr>
  </tbody>
</table>
<br> 

>All transactions are securely signed on your end, so your private key remains with you and never comes to us over API. We do not hold your crypto at any point: :closed_lock_with_key: **Your keys, Your crypto**. Our APIs are a one-stop-shop for you to make the enquiries and conduct the transactions as you want.

## Client-Side Security Essentials

### Certificate transparency
CT makes it easier to detect and prevent digital certificate fraud, thereby improving the security of internet connections.
>**In addition to implementing certificate transparency measures on our end, we _highly recommend_ users to also consider implementing these measures for added security benefits.**

### Private Key
A user's private key is stored securely in a digital wallet, and should never be shared with anyone as it provides full access and control over their digital assets.
>**It is _highly recommended_ that users take necessary precautions to ensure the safety and confidentiality of their private keys, as we do not possess any access or control over them.**

### Additional Security Precautions
* It is important for the user to safeguard both their data and workstation from potential risks such as spoofing, tampering, and other related threats.
* It is important for the end user to connect to a secure network and ensure that they use only TLS 1.2 or a newer version for enhanced security to safeguard them from any kind of threats and attacks.

## Installation
To install, clone the repository from git directly.

```
git clone https://github.com/expand-network/sdk-nodejs.git
```

Or, use the following npm package.

```
npm i expand-network
```

## Usage
>You can get your API key by visiting our [website](https://expand.network/) or by clicking [here](https://auth.expand.network/)

### Chain functions
Sample code: Send one Wei from one public address to another public address. You need to use your private key to sign the transaction. The return value is the transaction hash (`res`).

```js
const { Wallet, prepareTransaction } = require('expand-network');

async function main(){
    const wallet = new Wallet({ privateKey: 'YOUR_PRIVATE_KEY', xApiKey: 'YOUR_API_KEY' });

    // Signing transaction
    const signedTx = await wallet.signTransaction({
        from: 'PUBLIC_ADDRESS',
        to: 'PUBLIC_ADDRESS',
        value: '1',
        chainId: '1',
        gas: '50000',
    }); 

    //Sending transaction
    const tx = await wallet.sendTransaction(signedTx);
    console.log("Transaction Pending....", tx.data);
}
main()
```
### Fungible functions approve
Sample code: Approve 5 DAI (token ending in `d0F`),In this example, the "from" is the user address (ending in `006`) and "to" is protocol address (ending in `056`), so 5 DAI is approved from user address on the protocol address. User need to use private key to sign the transaction. 
```js
const { Wallet, prepareTransaction } = require('expand-network');

async function approve() {
    const wallet = new Wallet({ privateKey: 'YOUR_PRIVATE_KEY', xApiKey: 'YOUR_API_KEY' });
    
    // Preparing transaction
    const preparedTx = await prepareTransaction('https://api.expand.network/fungibletoken/approve', {
      from: 'PUBLIC_ADDRESS',
      to: 'PUBLIC_ADDRESS', // The spender's or contract's or router's address that needs to be approved
      tokenAddress:"0x6B175474E89094C44Da98b954EedeAC495271d0F", 
      amount: "5000000000000000000",
      gas: '100000',
      chainId:"1"
      xApiKey: "YOUR_API_KEY"
    });

    // Signing transaction
    const signedTx = await wallet.signTransaction(preparedTx); 

    //Sending transaction
    const tx = await wallet.sendTransaction(signedTx);
    console.log("Transaction Pending....", tx.data);
}

approve();
```
### Dex functions swap
Sample code: Swap 5 DAI (token ending in `d0F`) with WETH (token ending in `Cc2`). In this example, the "to" and "from" are the same (ending in `006`), so the swapped tokens will come back into the same address. Again, you need to use your private key to sign the transaction. 
```js
const { Wallet, prepareTransaction } = require('expand-network');

async function swap() {
  const wallet = new Wallet({ privateKey: 'YOUR_PRIVATE_KEY', xApiKey: 'YOUR_API_KEY' });
  
  // Preparing transaction
  const preparedTx = await prepareTransaction('https://api.expand.network/dex/swap', {
    amountIn: '5000000000000000000',
    amountOutMin: '0',
    path: ['0x6B175474E89094C44Da98b954EedeAC495271d0F','0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'], // DAI and WETH contract addresses
    to: 'PUBLIC_ADDRESS',
    deadline: '1693143453', // Epoch Unix timestamp
    from: 'PUBLIC_ADDRESS',
    gas: '229880',
    xApiKey : 'YOUR_API_KEY',
    chainId:"1"
  });

  // Signing transaction
  const signedTx = await wallet.signTransaction(preparedTx); 

  //Sending transaction
  const tx = await wallet.sendTransaction(signedTx);
  console.log("Transaction Pending....", tx.data);
}
swap();
```
## Examples
### Get balance 
Sample code: get balances from different chains: Ethereum, BSC and Solana.
```js
//Setting API-KEY for axios header 
axios.defaults.headers['X-API-KEY'] = "YOUR_API_KEY";
 // Fetching balance from Ethereum
config.params = {
    address: publicAddressEvm
}
response = await axios.get(baseUrl + '/chain/getbalance/', config);
balance = response.data.data.balance / 10**18; // Divide by 10 to the power decimals of the asset (18 for ETH)
console.log (`${publicAddressEvm} balance on ethereum chain is ${balance}`);
// Fetching balance from Binance Smart Chain 
config.params = {
    chainId: '56',
    address: publicAddressBsc
}
response = await axios.get(baseUrl + '/chain/getbalance/', config);
balance = response.data.data.balance / 10**18;
console.log (`${publicAddressBsc} balance on binance smart chain is ${balance}`);
// Fetching balance from Solana 
config.params = {
    chainSymbol: 'SOL',
    address: publicAddressSolana
}
response = await axios.get(baseUrl + '/chain/getbalance/', config);
balance = response.data.data.balance / 10**9;
console.log (`${publicAddressSolana} balance on solana chain is ${balance}`);
```
### Swap with best price
Sample Code: For the swap pair DAI <> WETH, find the best price on three different DEX protocols: Uniswap v2, v3, and Sushiswap. Whichever DEX has the best price, swap the DAI with WETH on that particular DEX.
```js
const { Wallet, prepareTransaction } = require('expand-network');

const getPrice = async(dexId) => {
  config.params = {
      dexId: dexId,
      path: '0x6B175474E89094C44Da98b954EedeAC495271d0F' + ',' + '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      amountIn: amount
  }
  const response = await axios.get(baseUrl + '/dex/getprice/', config);
  prices[dexId] = response.data.amountsOut[1];
}

const swap = async(dexId) => {
  const wallet = new Wallet({ privateKey: 'YOUR_PRIVATE_KEY', xApiKey: 'YOUR_API_KEY' });

  const preparedTx = await prepareTransaction(baseUrl + '/dex/swap', {
    dexId,
    amountIn: amount,
    amountOutMin: '0',
    path: [ '0x6B175474E89094C44Da98b954EedeAC495271d0F', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' ],
    to: 'PUBLIC_ADDRESS',
    deadline: Date.now() + 60*60*20,
    from: 'PUBLIC_ADDRESS',
    gas: '229880',
    xApiKey : 'YOUR_API_KEY'
  });

  // Signing transaction
  const signedTx = await wallet.signTransaction(preparedTx); 

  //Sending transaction
  const tx = await wallet.sendTransaction(signedTx);
  console.log("Transaction Pending....", tx.data);
}

const bestBuy = async() => {
  // Fetching price from Uniswap V2
  await getPrice('1000');
  // Fetching price from Sushiswap
  await getPrice('1100');
  // Fetching price from Uniswap V3
  await getPrice('1300');
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
## Socials:
> [![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?logo=Twitter&logoColor=white)](https://twitter.com/expand_network)
<p align="right">(<a href="#readme-top">back to top</a>)</p>
