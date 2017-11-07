import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";
import { Slider, InputNumber, Row, Col } from 'antd';

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

  onChange = (value) => {
    const { store } = this.props;
    store.betLength = value;
  }

  render() {
    const { store } = this.props;
    return (
      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        <img src="img/setxcut.png" alt="SETxCUT" width="160px"/>
        <div style={{width: "100%"}} onWheel={this.wheel} onClick={this.click}>
          <Arc store={store} />
        </div>
        <div style={{width: "100%"}} >
          <div>Balance: {store.balanceLength}</div>
          <div>Bet: {store.betLength}</div>
          <div>Max Wage: {store.maxWage}</div>
          <div>Last Win: {store.lastWin}</div>
          <Row>
            <Col span={18}>
              <Slider min={store.minBet} max={store.maxBet} onChange={this.onChange} value={store.betLength} />
            </Col>
            <Col span={4}>
              <InputNumber
                min={store.minBet}
                max={store.maxBet}
                style={{ marginLeft: 16 }}
                value={store.betLength}
                onChange={this.onChange}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  };
}

export default Layout;
