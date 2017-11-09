import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";
import { Button, Slider, InputNumber, Row, Col } from 'antd';

import Arc from "../Layout/Arc";

@inject("store")
@observer
class Layout extends React.Component {
  //TODO rename variables
  //TODO separate graphics from logic (use segment)
  //TODO use Free Spins
  //TODO skill-mode (off, freespins-only, all)
  //TODO headshot

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
    store.spin();
  }

  @action
  onChange = (value) => {
    const { store } = this.props;
    store.betLength = value;
  }

  @action
  addBalance = (value) => {
    const { store } = this.props;
    store.balanceLength = 150;
    store.betLength = store.maxBet;
  }

  getBetContent = (onClickHandler) => {
    const { store } = this.props;
    if(store.balanceLength){
      return (
        <div>
          <div>Bet: {store.betLength}</div>
          <div>Max Wage: {store.maxWage}</div>
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
      )
    } else {
      return <Button type="primary" ghost onClick={onClickHandler} style={{marginTop: 20}}>Add Balance</Button>;
    }
  }

  render() {
    const { store } = this.props;
    return (
      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{width: "100%"}} onWheel={this.wheel} onClick={this.click}>
          <Arc store={store} />
        </div>
        <div style={{width: "100%"}} >
          <div>Balance: {store.balanceLength}</div>
          <div>Last Win: {store.lastWin}</div>
          <div>Game Number: {store.gameNumber}</div>
          <div>Free Spins: {store.freeSpinsLength}</div>
          {this.getBetContent(this.addBalance)}
        </div>
      </div>
    );
  };
}

export default Layout;
