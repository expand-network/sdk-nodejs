const { sendTransaction, Wallet, signTransaction} = require('../../adapters/Wallet/index');
const {prepareTransaction} = require('../../../src/index')

// const baseurl = "http://localhost:3000";
const xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';


async function main() {
    const wallet = new Wallet({privateKey: "a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86",xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"});       
    const result =  {
        "dexId": "2101",
        "tokenA": "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
        "tokenB": "0xB6076C93701D6a07266c31066B298AeC6dd65c2d",
        "amountBMin": "150",
        "amountAMin": "9140195223753",
        "to": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "deadline": "1704994811",
        "from": "0xa67E9B68c41b0f26184D64C26e0b2B81466E5994",
        "gas": "420000",
        "gasPriority":"high",
        "binStep":"20",
        "chainId":"43113",
        "ids":["8375816","8375817","8375818","8375819","8375820","8375821","8375822","8375823","8375824","8375825","8375826"],
        "amounts":["6125082604576892342340742933771827806208","6125082604576892342340742933771827806208","6125082604576892342340742933771827806208","6125082604576892342340742933771827806208","6092234575456602778057561670181153099728","27680318192948304012362129290692653566283","49451196782276463859932823798226771515026","49649387794231952910105025177550757137373","49747539066384995844387966236176975326734","49845022333457547462772063936365946907208","49759874534344782452838208519883050222759"],
        "xApiKey":"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"    };
    const rawtx = await prepareTransaction('http://localhost:3000/dex/removeliquidity', result);
    console.log(rawtx);
    // rawtx.privateKey = 'a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86';
    rawtx.chainId = '43113';
    const raw = await wallet.signTransaction(rawtx);
    // console.log(raw,'------>');
    raw.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    raw.chainId = '43113';
    // const x = await wallet.sendTransaction(raw);
    // console.log(x);
}
main();
