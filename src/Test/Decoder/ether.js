const { signTransaction } = require('../../index');

async function main() {
    const d = await signTransaction({
        
        from: '0x02735e60F0346A8827636290220e995117cc14280543d5CD5C8d544D7334bEF8',
        to: '0x02735e60F0346A8827636290220e995117cc14280543d5CD5C8d544D7334bEF8',
        value: "1000000000",
        gas:"874321",
        xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
    },
        {
            privateKey:"423149548499943607318567778264048419352230277059557554818325647718469263324",
            chainId: "301",
            xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
        });
    // const data = JSON.parse(Buffer.from(d.rawTransaction,"base64").toString());
    console.log(d);
}
main();














