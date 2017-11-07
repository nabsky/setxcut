import { observable, computed } from "mobx";

class Store {

  @observable isSet = false;

  @observable result = 280;

  @observable balanceLength = 100;

  @observable betLength = 10;
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

}

export default new Store();
