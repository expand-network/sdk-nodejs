const { signTransaction } = require('../../index');

async function main() {
    const d = await signTransaction({
        
        from: '0xa2e73C17F437688946993F683930E3Fd42Dd4F8C',
        to: '0xa67E9B68c41b0f26184D64C26e0b2B81466E5994',
        value: "10000000000000000000",
        "gas":"874321",
        xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
    },
        {
            privateKey:"a0dc0a1da34821e9066c31fb2910ad73395105258309cacd7d8f26dc68d5f760",
            chainId: "10",
            xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
        });
    // const data = JSON.parse(Buffer.from(d.rawTransaction,"base64").toString());
    console.log(d);
}
main();














