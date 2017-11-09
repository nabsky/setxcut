import { observable, computed } from "mobx";

class AppStore {
  @observable mode = 'GAME';//EMUL
}

export default new AppStore();
