import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import Emulation from "./Emulation";

@inject("emulStore")
@observer
class EmulationContainer extends React.Component {

  getContent(){
    return <Emulation />;
  };

  render() {
    const { emulationStore } = this.props;
    return this.getContent();
  };
}

export default EmulationContainer;
