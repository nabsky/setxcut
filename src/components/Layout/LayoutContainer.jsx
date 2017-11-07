import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import Layout from "../Layout/Layout";

@inject("store")
@observer
class LayoutContainer extends React.Component {

  getContent(step){
    return <Layout />;
  };

  render() {
    const { store } = this.props;
    return this.getContent();
  };
}

export default LayoutContainer;
