const {signTransaction} = require("./index");

async function main(){
const d = await signTransaction( {
    from: 'RPBJHUAJ7EUCNEUYNATJR65W62B57P3FYQUBQ3LYEAU6FTTIYCLIGP5EMI',
    to: '56FNTRT5DKHX2MFQL5SSITQEU6SOG2OL7LCAN4ECHA67KBBS4X7VH27T2M',
    value: "100000000000000000000",
    gas:"1000",
    xApiKey:"9c04WzEh912AAmGuNV76I62CcsRHhdPs8bTJIwBi"}
,
{
    privateKey:"423149548499943607318567778264048419352230277059557554818325647718469263324" , 
    chainId:"1301" , 
    xApiKey:"9c04WzEh912AAmGuNV76I62CcsRHhdPs8bTJIwBi",
    key:"ZRJLa44Mxr7ZDfpvB0VcN6SxcUaMRLEjaxadc1w9"});
// const data = JSON.parse(Buffer.from(d.rawTransaction,"base64").toString());
console.log(d);
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