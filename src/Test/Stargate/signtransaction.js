const { signTransaction } = require('../../index');

async function main() {
    const d = await signTransaction({
        
        from: '0x6Fb447Ae94F5180254D436A693907a1f57696900',
        to: '0x6Fb447Ae94F5180254D436A693907a1f57696900',
        value: "1000000000",
        gas: "671111",
        xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
    },
        {
            privateKey:"c03e8ee249d32de6a5e15cf526f05c89d574c275890be6ddbc61128facde79da",
            chainId:"8453",
            xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
        });
    // const data = JSON.parse(Buffer.from(d.rawTransaction,"base64").toString());
    console.log(d);
}
main();














