const {signTransaction, sendTransaction} = require("../index");

async function main(){
const d = await signTransaction( {
    from: '5FxzzbvHSoa9WH4VrMChdp23CcacCpbfpmgKxMFYXJVM',
    to: '9B5XszUGdMaxCZ7uSQhPzdks5ZQSmWxrmzCSvtJ6Ns6g',
    value: "10000",
    xApiKey:"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"}
,
{
    privateKey:"5UrRBtsJghxMe2arxjxtRXiYg5UPxdvttYfV4cLfsDH3FBzXHqEzHqkvqnTVTGLK5MK9jtqdb9w8cytcmKwwsr2b" , 
    chainId:"901" , 
    xApiKey:"vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T"});
// const data = JSON.parse(Buffer.from(d.rawTransaction,"base64").toString());
    console.log(d);
    d.xApiKey = 'vF2rU96xCr9yJCgSVnSxR9yKOBd1U21z9jYcFb5T';
    d.chainId = '901';
    const x = await sendTransaction(d);
    console.log(x);
}
main();















    //     test('Should Sign Transaction for Algorand' , async() => {
    //         var rawTransaction = await signTransaction({
    //                 from: 'RPBJHUAJ7EUCNEUYNATJR65W62B57P3FYQUBQ3LYEAU6FTTIYCLIGP5EMI',
    //                 to: '56FNTRT5DKHX2MFQL5SSITQEU6SOG2OL7LCAN4ECHA67KBBS4X7VH27T2M',
    //                 value: "100000000000000000000",
    //                 gas:"1000"
    //         },{xApiKey:"scefgpvLmn3Pam0Cf9O1r2HKCWlkI7Bo3gnNJ3t9",chainId:"1301", key:"ZRJLa44Mxr7ZDfpvB0VcN6SxcUaMRLEjaxadc1w9" , privateKey:"immense advance member fringe useless cloud typical civil sea impulse bunker engage payment brown name hockey hurry extra style gadget blame obvious stone able rally"}).then(res => console.log(res))//then(rawTransaction => sendTransaction({xApiKey:"scefgpvLmn3Pam0Cf9O1r2HKCWlkI7Bo3gnNJ3t9",chainId:"1301",rawTransaction:rawTransaction,key:"ZRJLa44Mxr7ZDfpvB0VcN6SxcUaMRLEjaxadc1w9"})).then(res => console.log(res))
    //             // expect(res.status).toBe(200))
    //     })
    // });