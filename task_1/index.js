//Task
//https://docs.google.com/document/d/1HY7Dl-5itYD3C_gkueBvvBFpT4CecGPiR30BsARlTpQ/edit
'use strict'
const casino = require('./../Casino');

const M = BigInt(Math.pow(2, 32));
const MAX_INT = 2147483647;
const MIN_INT = -2147483647;

const getRealNumber = async() => BigInt((await casino.betLCG(2)).realNumber);
//Look here
//https://en.wikibooks.org/wiki/Algorithm_Implementation/Mathematics/Extended_Euclidean_algorithm
const egcd = (a, b) =>{
    if(a === 0n){
        return [b, 0n, 1n];
    } else{
        const [g, x, y] = egcd(b % a, a);
        return [g, y - b / a * x, x]
    }
}

const modulusInverse = (b, n) =>{
    const [g, x] = egcd(b, n);
    if (g !== 1n){
        console.log(g);
        throw new Error("Error has happened while calculating gcd")
    }
    return x % n;
}

const solveLCG = async() =>{
    console.log("LCG");
    //Bet at any number to get generator numbers
    let firstNumber = await getRealNumber();
    let secondNumber = await getRealNumber();
    let thirdNumber = await getRealNumber();
    let a;
    let c;
    let prediction;
    while(!a || !c || (firstNumber * a + c) % M !== secondNumber || (secondNumber * a + c) % M !== thirdNumber){
        try{
            a = (thirdNumber - secondNumber) * modulusInverse(secondNumber - firstNumber, M) % M;
        } catch(e){
            firstNumber = await getRealNumber();
            secondNumber = await getRealNumber();
            thirdNumber = await getRealNumber();
            prediction = 0;
            continue;
        }
        c = (secondNumber - a * firstNumber) % M;
        firstNumber = secondNumber;
        secondNumber = thirdNumber;
        thirdNumber = await getRealNumber();
        prediction = (secondNumber * a + c) % M
        console.log("Second number", thirdNumber);
        console.log("First number", (secondNumber * a + c) % M);
        console.log(a, c);
    }
    return [a, c];
}

const main = async() => {
    try{
        await casino.createAccount();
        const [a, c] = await solveLCG();

        //Win game
        let prevReal = await getRealNumber();
        let currentMoney;
        while(!currentMoney || currentMoney < 10e6){
            prevReal = (prevReal * a + c) % M;
            if(prevReal > MAX_INT || prevReal < MIN_INT){
                prevReal = prevReal > 0 ? prevReal - M : prevReal + M;
            }
            const response = await casino.betLCG(parseInt(prevReal), 100);
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