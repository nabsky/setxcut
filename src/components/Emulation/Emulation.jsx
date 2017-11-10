import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";
import { Button, Slider, InputNumber, Row, Col } from 'antd';

@inject("emulStore")
@observer
class Emulation extends React.Component {

  @action
  click = e => {
    const { emulStore } = this.props;
    console.log(emulStore.doEmulation());
  }

  render() {
    const { emulStore } = this.props;
    return (
      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <Button type="primary" onClick={this.click}>Emulate</Button>
      </div>
    );
  };
}

export default Emulation;
