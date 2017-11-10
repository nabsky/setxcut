import { observable, computed } from "mobx";

class EmulStore {
  @observable initialBalance = 150;
  @observable maxBalance = 1500;
  @observable playerStopBalance = this.initialBalance*10;
  @observable bet = 50;
  @observable emulationCount = 1000;

  @observable wageRadius = 140;
  @observable betRadius = 50;
  @observable winRadius = 40;

  degreeDiff = (from, to, angle) => {
    while (to < from) to += 360;
    while (angle < from) angle += 360;
    if(angle >= from && angle <= to){
      return angle - from;
    } else {
      return 0;
    }
  }

  doSpin(bet) {
    let win = 0;

    //---------------------
    let playerBetDegrees = Math.floor(Math.random()*360);
    let gameStartDegrees = Math.floor(Math.random()*360);
    let wageDegrees = bet * 180 / (Math.PI * this.betRadius);
    let wageLength = (Math.PI * this.wageRadius * wageDegrees) / 180;
    let gameEndDegrees = gameStartDegrees + wageLength * 180 / (Math.PI * this.betRadius);
    let winDegree = this.degreeDiff(gameStartDegrees, gameEndDegrees, playerBetDegrees);
    //console.log(gameStartDegrees + " - " + gameEndDegrees + "[" + playerBetDegrees + "]" + " = " + resultDegree);

    if(winDegree == 0){
      win = 0;
    } else {
      win = Math.floor(winDegree * Math.PI * this.winRadius / 180);
    }
    //console.log(win);
    //---------------------

    if(win > 0){
      return win;
    } else {
      return -bet;
    }
  }

  doPlayerCycle() {
    let balance = this.initialBalance;
    let spinCount = 0;
    let winCount = 0;
    let totalBet = 0;
    let totalWin = 0;
    while(balance > 0 && balance <= this.playerStopBalance){
      let bet = this.bet < balance ? this.bet : balance;
      totalBet+=bet;
      let spinResult = this.doSpin(bet);
      if(spinResult > 0){
        winCount++;
        totalWin+=spinResult;
      }
      balance += spinResult;
      spinCount++;
    }
    return {
      balance: balance,
      winCount: winCount,
      spinCount: spinCount,
      totalBet: totalBet,
      totalWin: totalWin,
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
      emulationCount--;
    }
    emulationResult.avgSpinCount = emulationResult.spinCount / emulationResult.playerCount;
    return emulationResult;
  }

}

export default new EmulStore();
