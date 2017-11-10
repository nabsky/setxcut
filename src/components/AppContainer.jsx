import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";
import { Radio } from 'antd';

import LayoutContainer from "./Layout/LayoutContainer";
import EmulationContainer from "./Emulation/EmulationContainer";

@inject("appStore")
@observer
class AppContainer extends React.Component {

  @action
  handleModeChange = (e) => {
    const { appStore } = this.props;
    appStore.mode = e.target.value;
  }

  getContent = (mode) => {
    switch(mode){
      case 'GAME': return <LayoutContainer />;
      case 'EMUL': return <EmulationContainer />;
    }
  }

  render() {
    const { appStore } = this.props;
    return (
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <img src="img/setxcut.png" alt="SETxCUT" width="160px"/>
        <div style={{marginBottom: 20}}>
          <Radio.Group value={appStore.mode} onChange={this.handleModeChange}>
            <Radio.Button value="GAME">Game</Radio.Button>
            <Radio.Button value="EMUL">Emulator</Radio.Button>
          </Radio.Group>
        </div>
        {this.getContent(appStore.mode)}
      </div>
    );
  };
}

export default AppContainer;
