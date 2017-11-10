import React from "react";
import { render } from "react-dom";
import DevTools from "mobx-react-devtools";
import { Provider } from 'mobx-react';
import { Row, Col } from 'antd';

import AppContainer from "./components/AppContainer";
import store from "./models/store";
import appStore from "./models/AppStore";
import emulStore from "./models/EmulStore";

const stores = {
  store,
  appStore,
  emulStore
};

render(
  <div>
    <DevTools />
    <Provider {...stores}>
        <AppContainer />
    </Provider>
  </div>,
  document.getElementById("root")
);
