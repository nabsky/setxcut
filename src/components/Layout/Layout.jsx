import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import Arc from "../Layout/Arc";

@inject("store")
@observer
class Layout extends React.Component {

  @action
  wheel = e => {
    const { store } = this.props;
    if (!store.isSet) {
      if (e.deltaY > 0) {
          store.triangleDegrees++;
      } else {
          store.triangleDegrees--;
      }
    }
  }

  @action
  click = e => {
    const { store } = this.props;
    if (store.isSet === false) {
      store.result = 360 + Math.floor(360*Math.random());
      store.isSet = true;
    }
  }

  render() {
    const { store } = this.props;
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{width: "100%", height:"100%"}} onWheel={this.wheel} onClick={this.click}>
          <Arc store={store} />
        </div>
      </div>
    );
  };
}

export default Layout;
