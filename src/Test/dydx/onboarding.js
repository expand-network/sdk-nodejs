const dydx = require('../../dydx');

const onboardingTest = async () => { 
    const res = await dydx.userOnboarding({privateKey: "0xa10916eb80bd5af3b1cc3c12ae03a8e9f9aef8442b9b306640fa5cb98f641a86"});
    console.log(res);
};
onboardingTest();