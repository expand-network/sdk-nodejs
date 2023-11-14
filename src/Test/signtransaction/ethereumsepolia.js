const { signTransaction } = require('../../index');

async function main() {
    try{
    const d = await signTransaction({
        
        from: '0xa67E9B68c41b0f26184D64C26e0b2B81466E5994',
        to: '0xa67E9B68c41b0f26184D64C26e0b2B81466E5994',
        value: "1000000000",
        gas: "671111",
        xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
    },
        {
            privateKey:"a10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86",
            chainId:"84532",
            xApiKey: "vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"
        });
    // const data = JSON.parse(Buffer.from(d.rawTransaction,"base64").toString());
    console.log(d);
    }
    catch(err){
        console.log(err);
    }
}
main();














