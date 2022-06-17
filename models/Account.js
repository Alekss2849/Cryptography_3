'use strict'

module.exports = class Account{
    constructor(id, money, deletionTime){
        this.id = id;
        this.money = money;
        this.deletionTime = deletionTime;
    }
}