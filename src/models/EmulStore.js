import { observable, computed } from "mobx";

class EmulStore {
  @observable initialBalance = 150;
  @observable maxBalance = 1500;
  @observable playerStopBalance = this.initialBalance*10;
  @observable bet = 37;//37;
  @observable freeSpinBet = 50;
  @observable emulationCount = 1000;

  @observable wageRadius = 140;
  @observable betRadius = 50;
  @observable winRadius = 40;
  freeSpins = 0;

  degreeDiff = (from, to, angle) => {
    while (to < from) to += 360;
    while (angle < from) angle += 360;
    if(angle >= from && angle <= to){
      return angle - from;
    } else {
      return 0;
    }
  }

  getWage = (bet) => {
    let betDegrees = bet * 180 / (Math.PI * this.betRadius);
    let wageDegrees = betDegrees;
    let wageLength = (Math.PI * this.wageRadius * wageDegrees) / 180;
    return wageLength;
  }

  doSpin(bet) {
    let win = 0;

    //---------------------
    let wageLength = this.getWage(bet);
    let playerBetDegrees = Math.floor(Math.random()*360);
    let gameStartDegrees = Math.floor(Math.random()*360);
    let gameLengthDegrees = wageLength * 180 / (Math.PI * this.winRadius);
    let gameEndDegrees = gameStartDegrees + gameLengthDegrees;
    let winDegree = this.degreeDiff(gameStartDegrees, gameEndDegrees, playerBetDegrees);
    let winLength = Math.floor(winDegree * Math.PI * this.winRadius / 180);
    //console.log(gameStartDegrees + " - " + gameEndDegrees + "[" + playerBetDegrees + "]" + " = " + resultDegree);

    if(winLength == 0){
      win = 0;
    } else {
      win = winLength;
    }
    //console.log(win);
    //---------------------

    if(win > 0){
      return {
        win: win,
        freeSpins: wageLength-win,
      };
    } else {
      return {
        win: -bet,
        freeSpins: 0,
      };
    }
  }

  doFreeSpin(bet) {
    let win = 0;
    //---------------------
    let wageLength = this.getWage(bet);
    let playerBetDegrees = Math.floor(Math.random()*360);
    let gameStartDegrees = Math.floor(Math.random()*360);
    let gameLengthDegrees = wageLength * 180 / (Math.PI * this.winRadius);
    let gameEndDegrees = gameStartDegrees + gameLengthDegrees;
    let winDegree = this.degreeDiff(gameStartDegrees, gameEndDegrees, playerBetDegrees);
    let winLength = Math.floor(winDegree * Math.PI * this.winRadius / 180);
    //console.log(gameStartDegrees + " - " + gameEndDegrees + "[" + playerBetDegrees + "]" + " = " + resultDegree);

    if(winLength == 0){
      win = 0;
    } else {
      win = winLength;
    }

    if(win > 0){
      return {
        win: win
      };
    } else {
      return {
        win: 0
      };
    }
  }

  doPlayerCycle() {
    let balance = this.initialBalance;
    let spinCount = 0;
    let winCount = 0;
    let totalBet = 0;
    let totalWin = 0;
    let freeSpinsCount = 0;

    while(balance > 0 && balance <= this.playerStopBalance){
      let bet = this.bet < balance ? this.bet : balance;
      totalBet+=bet;

      if(this.freeSpins == 1000){
        freeSpinsCount++;
        while(this.freeSpins > 0){
          let freeSpinResult = this.doFreeSpin(this.freeSpinBet);
          this.freeSpins-=this.freeSpinBet;
          if(freeSpinResult.win > 0){
            winCount++;
            totalWin+=freeSpinResult.win;
          }
        }
      }

      let spinResult = this.doSpin(bet);
      if(spinResult.win > 0){
        winCount++;
        totalWin+=spinResult.win;
        this.freeSpins+=spinResult.freeSpins;
        if(this.freeSpins > 1000){
          this.freeSpins = 1000;
        }
      }
      balance += spinResult.win;
      spinCount++;
    }
    return {
      balance: balance,
      winCount: winCount,
      spinCount: spinCount,
      totalBet: totalBet,
      totalWin: totalWin,
      freeSpinsCount: freeSpinsCount,
    }
  }

  doEmulation(){
    let emulationCount = this.emulationCount;
    let emulationResult = {
      playerCount: emulationCount,
      casinoBalace: 0,
      winnerCount: 0,
      spinCount: 0,
      totalBet: 0,
      totalWin: 0,
      avgSpinCount: 0,
      freeSpinsCount: 0,
    }
    while(emulationCount > 0){
      let playerResult = this.doPlayerCycle();
      //console.log(playerResult);
      if(playerResult.balance > 0){
        emulationResult.casinoBalace-=playerResult.balance;
        emulationResult.winnerCount++;
      } else {
        emulationResult.casinoBalace+=this.initialBalance;
      }
      emulationResult.spinCount+=playerResult.spinCount;
      emulationResult.totalBet+=playerResult.totalBet;
      emulationResult.totalWin+=playerResult.totalWin;
      emulationResult.freeSpinsCount+=playerResult.freeSpinsCount;
      emulationCount--;
    }
    emulationResult.avgSpinCount = emulationResult.spinCount / emulationResult.playerCount;
    return emulationResult;
  }

}

export default new EmulStore();
