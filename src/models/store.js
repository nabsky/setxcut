import { observable, computed, action } from "mobx";

class Store {

  @observable isSet = false;

  @observable result = 0;

  @observable lastWin = 0;

  @observable minBet = 1;
  @observable _maxBet = 34;//37;

  @observable balanceLength = 0;

  @observable betLength = 0;

  @observable betRadius = 50;
  @observable wageRadius = 147//140;
  @observable cutRadius = 44;//40;

  @observable triangleDegrees = 0;

  @observable freeSpinsLength = 0;

  @observable gameNumber = 0;

  @observable
  autorun = true;

  @computed
  get maxBet() {
    return this.balanceLength >= this._maxBet ? this._maxBet : this.balanceLength;
  }

  @computed
  get betDegrees() {
    return this.betLength * 180 / (Math.PI * this.betRadius);
  }

  @computed
  get wageDegrees() {
    return this.betDegrees;
  }


  @computed
  get freeSpinsRadius() {
    return this.betRadius + 109.156;//98;
  }

 @computed
 get wageLength() {
   return (Math.PI * this.wageRadius * this.wageDegrees) / 180;
 };

 @computed
 get cutDegrees() {
   return this.wageLength * 180 / (Math.PI * this.cutRadius);
 }

 @computed
 get freeSpinsDegrees() {
   return this.freeSpinsLength * 180 / (Math.PI * this.freeSpinsRadius);
 }

 @computed
 get maxFreeSpins() {
   return 2 * Math.PI * this.freeSpinsRadius - 0.01;
 }

 @computed
 get balanceDegrees() {
   return this.balanceLength * 180 / (Math.PI * this.betRadius);
 }

 @computed
 get resultSpeed() {
   return this.result * 1000 / 360;
 }

 @computed
 get resultStartDegrees() {
   return this.result % 360;
 }

  @computed
  get resultEndDegrees() {
    return this.result % 360 + this.cutDegrees;
  }

  @computed
  get normalizedTriangleDegrees() {
    return this.triangleDegrees % 360;
  }

  isInRange = (from, to, angle) => {
    // make sure to >= from
    while (to < from) to += 360;
    // make sure angle >= from
    while (angle < from) angle += 360;
    // compare
    return angle >= from && angle <= to;
  }

  degreeDiff = (from, to, angle) => {
    while (to < from) to += 360;
    while (angle < from) angle += 360;
    if(angle >= from && angle <= to){
      return angle - from;
    } else {
      return 0;
    }
  }

  @computed
  get isWin() {
    return this.isInRange(this.resultStartDegrees, this.resultEndDegrees, this.normalizedTriangleDegrees);
  }

  @computed
  get winLength() {
    return Math.floor((this.degreeDiff(this.resultStartDegrees, this.resultEndDegrees, this.normalizedTriangleDegrees) * Math.PI * this.cutRadius) / 180);
  }

  @computed
  get maxWage() {
    return Math.floor(this.wageLength);
  }

  @action
  spin = () => {
    if (this.isSet === false && this.balanceLength > 0) {
      this.result = 360 + Math.floor(360*Math.random());
      this.gameNumber++;
      this.isSet = true;
    }
  }

}

export default new Store();
