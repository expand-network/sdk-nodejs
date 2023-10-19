const {signTransaction} = require('../../index');

async function main(){
const d = await signTransaction( {
    from: 'hk1646455.testnet',
    to:'hk1646455.testnet',
    value: "100000000",
    gas:"670543",
    xApiKey:"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"}
,
{
    privateKey:"ed25519:4FZYNyYnGNjDYfa4fot6y9dCM7fC8Z2jFnrz5G7KqsQ7Kb96HZH9yQQfkWZEMPjPKNEo2LzN65WiTdQt9cYZtLNr", 
    chainId:"1201",
    xApiKey:"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"});
// const data = JSON.parse(Buffer.from(d.rawTransaction,"base64").toString());
console.log(d);
}
main();














