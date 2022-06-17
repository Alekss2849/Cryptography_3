'use strict'
const axios = require('axios');
const Account = require('./models/Account.js');

// const DEFAULT_ID = 58856;
const DEFAULT_ID = Math.floor(Math.random() * 500000);

class Casino{
    createAccount = async (id = DEFAULT_ID) => {
        const path = `http://95.217.177.249/casino/createacc?id=${id}`;
        try{
            const {id, money, deletionTime} = (await axios.get(path)).data;
            this.account = new Account(id, money, deletionTime);
            return this.account;
            console.log(this.account);
        } catch (e){
            console.log(e);
            console.log("Error has happened:\n", e.response.data.error);
            throw e;
        }
    }

    betLCG = async (numberToBet, money = 1) =>{
        const path = `http://95.217.177.249/casino/playLcg?id=${this.account.id}&bet=${money}&number=${numberToBet}`;
        try{
            const res = await axios.get(path);
            return res.data;
        } catch (e){
            console.log("Error has happened:\n", e.response.data.error);
            throw e;
        }
    }

    betMT = async (numberToBet, money = 1) =>{
        const path = `http://95.217.177.249/casino/playMt?id=${this.account.id}&bet=${money}&number=${numberToBet}`;
        try{
            const res = await axios.get(path);
            return res.data;
        } catch (e){
            console.log("Error has happened:\n", e.response.data.error);
            throw e;
        }
    }
}

module.exports = new Casino();