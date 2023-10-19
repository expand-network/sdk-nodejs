const {signTransaction} = require('../../index');

async function main(){
const d = await signTransaction( {
    from: '5FxzzbvHSoa9WH4VrMChdp23CcacCpbfpmgKxMFYXJVM',
    to:"5FxzzbvHSoa9WH4VrMChdp23CcacCpbfpmgKxMFYXJVM",
    value:"1000000000000",
    gas:"670543",
    xApiKey:"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"}
,
{
    privateKey:"5UrRBtsJghxMe2arxjxtRXiYg5UPxdvttYfV4cLfsDH3FBzXHqEzHqkvqnTVTGLK5MK9jtqdb9w8cytcmKwwsr2b" , 
    chainId:"900" , 
    xApiKey:"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"});
// const data = JSON.parse(Buffer.from(d.rawTransaction,"base64").toString());
console.log(d);
}
main();














