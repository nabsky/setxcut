import React from "react";
import { render } from "react-dom";
import DevTools from "mobx-react-devtools";
import { Provider } from 'mobx-react';
import { Row, Col } from 'antd';

import LayoutContainer from "./components/Layout/LayoutContainer";
import store from "./models/store";

const stores = {
  store,
};

render(
  <div>
    <DevTools />
    <Provider {...stores}>
      <Row type="flex" justify="center" align="middle">
        <Col span={6}>
          <LayoutContainer />
        </Col>
      </Row>
    </Provider>
  </div>,
  document.getElementById("root")
);
