import React from "react";
import { render } from "react-dom";
import DevTools from "mobx-react-devtools";
import { Provider } from 'mobx-react';
import { Row, Col } from 'antd';

import AppContainer from "./components/AppContainer";
import store from "./models/store";
import appStore from "./models/AppStore";

const stores = {
  store,
  appStore
};

render(
  <div>
    <DevTools />
    <Provider {...stores}>
      <Row type="flex" justify="center" align="middle">
        <Col span={6}>
          <AppContainer />
        </Col>
      </Row>
    </Provider>
  </div>,
  document.getElementById("root")
);
