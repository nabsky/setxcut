import { observable, computed } from "mobx";
import moment from 'moment';

class EmulStore {
  @observable initialBalance = 150;
  @observable maxBalance = 1500;
  @observable maxBet = 37;
  @observable freeSpinBet = 100;
  @observable emulationCount = 1000;

  @observable wageRadius = 140;
  @observable betRadius = 50;
  @observable winRadius = 40;

  @observable freeSpins = 0;
  @observable result = {};

  @observable breakAfterFirstFreeSpin = false;
  @observable bonusAsBet = false;

  @observable jackPot = 0;


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

  doFreeSpin(bet, isLast) {
    let win = 0;
    let wageLength;
    if(this.bonusAsBet){
      wageLength = this.getWage(bet);
    } else {
      wageLength = bet;
    }
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
        win: win,
        jackPot: isLast ? wageLength - winLength : 0,
      };
    } else {
      return {
        win: 0,
        jackPot: 0,
      };
    }
  }

  doPlayerCycle() {
    let balance = this.initialBalance;
    let spinCount = 0;
    let winCount = 0;
    let totalBet = 0;
    let totalWin = 0;
    let totalFreeSpinWin = 0;
    let freeSpinsCount = 0;

    while(balance > 0 && balance <= this.maxBalance){
      let bet = this.maxBet < balance ? this.maxBet : balance;
      totalBet+=bet;

      if(this.freeSpins == 1000){
        freeSpinsCount++;
        while(this.freeSpins > 0){
          let freeSpinResult = this.doFreeSpin(this.freeSpinBet, this.freeSpins == this.freeSpinBet);
          this.freeSpins-=this.freeSpinBet;
          if(freeSpinResult.win > 0){
            winCount++;
            //totalWin+=freeSpinResult.win;
            totalFreeSpinWin+=freeSpinResult.win;
            this.jackPot+=freeSpinResult.jackPot;
            balance += freeSpinResult.win;
          }
        }
        if(this.breakAfterFirstFreeSpin){
          break;
        }
      }

      let spinResult = this.doSpin(bet);
      if(spinResult.win > 0){
        winCount++;
        totalWin+=(spinResult.win + bet);
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
      totalFreeSpinWin: totalFreeSpinWin,
    }
  }

  doEmulation(){
    this.jackPot = 0;
    let emulationCount = this.emulationCount;
    let emulationResult = {
      playerCount: emulationCount,
      casinoBalace: 0,
      winnerCount: 0,
      spinCount: 0,
      spinTime: '',
      totalBet: 0,
      totalWin: 0,
      payoutPercent: 0,
      avgSpinCount: 0,
      avgSpinTime: '',
      freeSpinsCount: 0,
      avgFreeSpinsCount: 0,
      maxFreeSpinsCount: 0,
      totalFreeSpinWin: 0,
      avgFreeSpinWin: 0,
      maxFreeSpinWin: 0,
      totalIn: 0,
      totalOut: 0,
      winnerWithoutFreeSpinsCount: 0,
      totalWinnerBalance: 0,
      avgWinnerBalance: 0,
      jackPot: 0,
    }
    while(emulationCount > 0){
      let playerResult = this.doPlayerCycle();
      if(playerResult.balance > 0){
        let pureWinAmount = playerResult.balance - this.initialBalance;
        emulationResult.casinoBalace-=pureWinAmount;
        emulationResult.totalWinnerBalance+=playerResult.balance;
        emulationResult.winnerCount++;
        if(playerResult.freeSpinsCount == 0){
          emulationResult.winnerWithoutFreeSpinsCount++;
        }
      } else {
        emulationResult.casinoBalace+=this.initialBalance;
      }
      emulationResult.spinCount+=playerResult.spinCount;
      emulationResult.totalBet+=playerResult.totalBet;
      emulationResult.totalWin+=playerResult.totalWin;
      emulationResult.freeSpinsCount+=playerResult.freeSpinsCount;
      emulationResult.totalOut += playerResult.balance;
      emulationResult.totalFreeSpinWin+=playerResult.totalFreeSpinWin;
      if(playerResult.totalFreeSpinWin > emulationResult.maxFreeSpinWin){
        emulationResult.maxFreeSpinWin = playerResult.totalFreeSpinWin;
      }
      if(playerResult.freeSpinsCount > emulationResult.maxFreeSpinsCount){
        emulationResult.maxFreeSpinsCount = playerResult.freeSpinsCount;
      }
      emulationCount--;
    }
    emulationResult.avgSpinCount = (emulationResult.spinCount + emulationResult.freeSpinsCount*10) / emulationResult.playerCount;
    emulationResult.payoutPercent = emulationResult.totalWin / emulationResult.totalBet * 100;
    emulationResult.payoutPercentFreeSpin = (emulationResult.totalWin + emulationResult.totalFreeSpinWin) / emulationResult.totalBet * 100;
    emulationResult.totalIn = emulationResult.playerCount * this.initialBalance;
    emulationResult.spinTime = moment.duration((emulationResult.spinCount + emulationResult.freeSpinsCount) * 5, "seconds").humanize();
    emulationResult.avgSpinTime = moment.duration(emulationResult.avgSpinCount * 5, "seconds").humanize();
    emulationResult.avgWinnerBalance = emulationResult.totalWinnerBalance/emulationResult.winnerCount;
    emulationResult.avgFreeSpinWin = emulationResult.totalFreeSpinWin / emulationResult.freeSpinsCount;
    emulationResult.avgFreeSpinsCount = emulationResult.freeSpinsCount / emulationResult.playerCount;
    emulationResult.jackPot = this.jackPot;
    emulationResult.maxWage = this.getWage(this.maxBet)
    emulationResult.winnerPercent = emulationResult.winnerCount*100/emulationResult.playerCount;

    return emulationResult;
  }

}

export default new EmulStore();
