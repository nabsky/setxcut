import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";
import { Button, InputNumber, Row, Col, Form, Input } from 'antd';

@inject("emulStore")
@observer
class Emulation extends React.Component {

  @action
  click = e => {
    const { emulStore } = this.props;
    emulStore.result = emulStore.doEmulation();
  }

  initialBalanceChange = value => {
    const { emulStore } = this.props;
    emulStore.initialBalance = value;
  }

  maxBalanceChange = value => {
    const { emulStore } = this.props;
    emulStore.maxBalance = value;
  }

  maxBetChange = value => {
    const { emulStore } = this.props;
    emulStore.maxBet = value;
  }

  freeSpinBetChange = value => {
    const { emulStore } = this.props;
    emulStore.freeSpinBet = value;
  }

  wageRadiusChange = value => {
    const { emulStore } = this.props;
    emulStore.wageRadius = value;
  }

  betRadiusChange = value => {
    const { emulStore } = this.props;
    emulStore.betRadius = value;
  }

  winRadiusChange = value => {
    const { emulStore } = this.props;
    emulStore.winRadius = value;
  }

  emulationCountChange = value => {
    const { emulStore } = this.props;
    emulStore.emulationCount = value;
  }

  render() {
    const { emulStore } = this.props;
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <Form style={{width:400}}>
          <Form.Item
            label="Initial Balance"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <InputNumber ref="initialBalance" min={1} max={100000} defaultValue={150} onChange={this.initialBalanceChange} />
          </Form.Item>
          <Form.Item
            label="Max Balance"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <InputNumber ref="maxBalance" min={1} max={100000} defaultValue={1500} onChange={this.maxBalanceChange} />
          </Form.Item>
          <Form.Item
            label="Max Bet"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <InputNumber ref="maxBet" min={1} max={100} defaultValue={37} onChange={this.maxBetChange} />
          </Form.Item>
          <Form.Item
            label="Free Spin Bet"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <InputNumber ref="freeSpinBet" min={1} max={300} defaultValue={100} onChange={this.freeSpinBetChange} />
          </Form.Item>
          <Form.Item
            label="Wage Radius"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <InputNumber ref="wageRadius" min={1} max={200} defaultValue={140} onChange={this.wageRadiusChange} />
          </Form.Item>
          <Form.Item
            label="Bet Radius"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <InputNumber ref="betRadius" min={1} max={100} defaultValue={50} onChange={this.betRadiusChange} />
          </Form.Item>
          <Form.Item
            label="Win Radius"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <InputNumber ref="winRadius" min={1} max={100} defaultValue={40} onChange={this.winRadiusChange} />
          </Form.Item>
          <Form.Item
            label="Emulation Count"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <InputNumber ref="emulationCount" min={1} max={100000} defaultValue={1000} onChange={this.emulationCountChange} />
          </Form.Item>
          <Form.Item
            wrapperCol={{ span: 12, offset: 12 }}
          >
            <Button type="primary" onClick={this.click}>Emulate</Button>
          </Form.Item>
        </Form>
        <div>
          <div>Total Players: {emulStore.result.playerCount}</div>
          <div>Winner Players: {emulStore.result.winnerCount} (average balance: {emulStore.result.avgWinnerBalance})</div>
          <div>Casino Balance: {emulStore.result.casinoBalace}</div>
          <hr/>
          <div>Total Spin Count: {emulStore.result.spinCount} ({emulStore.result.spinTime})</div>
          <div>Average Spin Count per Player: {emulStore.result.avgSpinCount} ({emulStore.result.avgSpinTime})</div>
          <div>Total Free Spins: {emulStore.result.freeSpinsCount}</div>
          <div>Max Free Spins Count Per Player: {emulStore.result.maxFreeSpinsCount}</div>
          <div>Avg Free Spins Count Per Player: {emulStore.result.avgFreeSpinsCount}</div>
          <div>Total Free Spin Win: {emulStore.result.totalFreeSpinWin}</div>
          <div>Max Free Spin Win: {emulStore.result.maxFreeSpinWin}</div>
          <div>Avg Free Spin Win: {emulStore.result.avgFreeSpinWin}</div>
          <hr/>
          <div>Jack Pot: {emulStore.result.jackPot}</div>
          <hr/>
          <div>Total Bet: {emulStore.result.totalBet}</div>
          <div>Total Win: {emulStore.result.totalWin}</div>
          <div>Payout Percent: {emulStore.result.payoutPercent}</div>
          <hr/>
          <div>Total In: {emulStore.result.totalIn}</div>
          <div>Total Out: {emulStore.result.totalOut}</div>
        </div>
      </div>
    );
  };
}

export default Emulation;
