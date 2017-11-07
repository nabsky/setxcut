import { observable, computed } from "mobx";

class Store {

  @observable isSet = false;

  @observable result = 0;

  @observable balanceLength = 150;

  @observable betLength = 30;
  @observable betRadius = 50;

  @observable triangleDegrees = 0;

  @computed
  get betDegrees() {
    return this.betLength * 180 / (Math.PI * this.betRadius);
  }

  @computed
  get wageDegrees() {
    return this.betDegrees;
  }

  @computed
  get wageRadius() {
    return this.betRadius + 90;
  }

 @computed
 get cutRadius() {
  return this.betRadius - 10;
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
    return (this.degreeDiff(this.resultStartDegrees, this.resultEndDegrees, this.normalizedTriangleDegrees) * Math.PI * this.cutRadius) / 180;
  }

}

export default new Store();
