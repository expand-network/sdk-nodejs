const {signTransaction} = require('../src/index');
async function main(){
const d = await signTransaction( {
    from:"0x02735e60F0346A8827636290220e995117cc14280543d5CD5C8d544D7334bEF8",
    to:"0x047dE4A0a68557f38B754E6d875acd4972Cbd2b222dE9BA32f4CE0902a3089Ff",
    value:"213131",
    gas:"0",
    data:"0x"
},{privateKey:"423149548499943607318567778264048419352230277059557554818325647718469263324" , chainId:"301" , xApiKey:"9c04WzEh912AAmGuNV76I62CcsRHhdPs8bTJIwBi"});
// const data = JSON.parse(Buffer.from(d.rawTransaction,"base64").toString());
console.log(d);
}
main();