//Task
//https://docs.google.com/document/d/1HY7Dl-5itYD3C_gkueBvvBFpT4CecGPiR30BsARlTpQ/edit
'use strict'
const casino = require('./../Casino');
const Mt19937 = require('@crand/mt19937');

const MIN_SEED_SHIFT = 0;
const MAX_SEED_SHIFT = 1000;
const TEST_LIMIT = 100;

const sleep = time => new Promise((resolve) => setTimeout(resolve, time));

const getRealNumber = async() => (await casino.betMT(2)).realNumber;

const findSeed = async () =>{
    await casino.createAccount();
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const number = await getRealNumber();
    console.log("Real: ", number);

    let seed;
    for(let i = MIN_SEED_SHIFT; i < MAX_SEED_SHIFT; ++i){
        const generator = new Mt19937(currentTimeInSeconds - i);
        const generatedN = generator.next();
        if(number === generatedN){
            seed = currentTimeInSeconds - i;
            console.log("Found: ", seed);
            return [seed, 1];// 1 - times generated number
        }
    }
    throw new Error("Algorithm has failed successfully. Please, run it again.")
}

const main = async () => {
    try{
        let [seed, generatedNumbers] = await findSeed();
        
        const generator = new Mt19937(seed);
        for(let i = 0; i < generatedNumbers; ++i){
            //Get to the state of casino generator
            generator.next();
        }
        //This is not final
        //There should be tempering and untempering. Now there is a lot of false positives
        //But it works if run a few times
        // //Test numbers
        // for(let i = 0; i < TEST_LIMIT; ++i){
        //     const generated = generator.next();
        //     const real = await getRealNumber()
        //     if(generated !== real){
        //         console.log("Test #" + i);
        //         console.log("Generated: ", generated);
        //         console.log("Real: ", real);
        //         throw new Error("Seed is wrong. Please, restart the program");
        //     }
        // }

        let currentMoney;
        while(!currentMoney || currentMoney < 10e6){
            const response = await casino.betMT(parseInt(generator.next()), 100);
            currentMoney = response.account.money;
            console.log(response.message);
            console.log("CurrentMoney: ", currentMoney);
        }
    } catch(e){
        console.log(e);
    }
}

if(require.main === module){
    main();
}