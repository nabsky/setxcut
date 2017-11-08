import React, { Component } from "react";
import { observer } from "mobx-react";
import Velocity from 'velocity-animate';
import { autorun } from 'mobx';
import Segment from 'segment-js';

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

const describeSlice = (x, y, radius, startAngle, endAngle) => {

    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
        "M", start.x, start.y, start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
};

const path = (degrees = 90, radius = 100) => {
    return describeSlice(0, 0, radius, 0, degrees);
};

const transform = (degrees = 90, radius = 100) => {
    return `translate(150,${150 - radius + 15}) rotate(${degrees}, 0, ${radius - 15})`;
};


@observer
class Arc extends React.Component {

  componentDidMount() {
    const { store } = this.props;
    let segment = new Segment(this.refs.balance);
    segment.draw(0, 0, 0);
    segment.draw(0, store.balanceLength, 0.5);          
    this.disposer = autorun(() => {
      if (store.isSet) {
        Velocity(this.refs.block,{  opacity: "1" }, { duration: 0})
        .then(e=> {
          return Velocity(this.refs.block,{ rotateZ: "+=1080" }, { duration: 3000, easing: "linear"});
        }).then(e=> {
          return Velocity(this.refs.block,{ rotateZ: `+=${store.result}` }, { duration: store.resultSpeed, easing: "linear"});
        }).then(e=> {
          return Velocity(this.refs.block,{  opacity: "0" }, { duration: 1000});
        }).then(e=> {
          Velocity(this.refs.block,{  rotateZ: "0deg" }, { duration: 0});
          Velocity(this.refs.block,{  opacity: "0" }, { duration: 0});

          console.log(`${store.resultStartDegrees} - ${store.resultEndDegrees} : ${store.normalizedTriangleDegrees}`)
          console.log(`${store.isWin}`)
          console.log(`${store.winLength}`)
          if(store.isWin){
            store.lastWin = store.winLength;
            store.balanceLength += store.winLength;
          } else {
            store.lastWin = 0;
            store.balanceLength -= store.betLength;
          }
          segment.draw(0, store.balanceLength, 0.5);
          store.isSet = false;
        });
      } else {
        Velocity(this.refs.block,{  opacity: "0" }, { duration: 0});
      }
    });
  }

  disposer = null;
  componentWillUnmount() {
    if (this.disposer) {
      this.disposer();
    }
  }

  render() {
    const { store } = this.props;
    return (
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
          <g transform="translate(150,150)">
              <circle cx="0" cy="0" r={store.cutRadius} fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"/>
              <circle cx="0" cy="0" r={store.betRadius} fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"/>
              <circle cx="0" cy="0" r={store.wageRadius} fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"/>
              <path d={path(store.wageDegrees, store.wageRadius)} fillOpacity="0" stroke="#9932CC" strokeWidth="2"/>
              <path ref="block" d={path(store.cutDegrees, store.cutRadius)} fillOpacity="0" stroke="#9932CC" strokeWidth="2"/>
          </g>
          <g transform={transform(store.triangleDegrees, store.betRadius)}>
            <path fill="#FFFFFF" stroke="#777777" strokeWidth="1" d="M 5,3 0,-3 -5,3"/>
          </g>
          <path fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"
          d="m 150.27969,99.297091 c 29.13883,0.507109 52.69092,25.541579 52.16656,54.537139 -0.54412,30.08851 -26.40251,54.40331 -56.34776,53.84267 -31.03816,-0.5811 -56.115714,-27.26345 -55.518763,-58.15837 0.618069,-31.98784 28.124383,-57.828152 59.968993,-57.194871 32.93749,0.655014 59.54059,28.985321 58.87096,61.779601 -0.69194,33.88716 -29.84626,61.25306 -63.59022,60.54707 -34.83682,-0.72885 -62.965532,-30.7072 -62.223165,-65.40083 0.765751,-35.78649 31.568135,-64.678032 67.211445,-63.899274 36.73616,0.802635 66.39054,32.429074 65.57538,69.022064 -0.83951,37.68582 -33.29002,68.10305 -70.83268,67.25147 -38.63548,-0.87636 -69.81558,-34.15095 -68.927578,-72.64329 0.913213,-39.58515 35.011898,-71.528115 74.453908,-70.603677 40.53481,0.950052 73.24066,35.872837 72.27978,76.264527 -0.98688,41.48447 -36.73378,74.95322 -78.07514,73.95588 -42.43414,-1.0237 -76.665781,-37.59473 -75.63198,-79.88576 1.060512,-43.3838 38.45566,-78.378349 81.69637,-77.308079 44.33346,1.097317 80.09093,39.316609 78.98418,83.506989 -1.13411,45.28312 -40.17755,81.80351 -85.3176,80.66028 -46.23279,-1.17091 -83.516104,-41.0385 -82.336383,-87.12822 1.20769,-47.18245 41.899443,-85.228698 88.938833,-84.012482 48.13212,1.244469 86.9413,42.760382 85.68858,90.749452 -1.28124,49.08178 -43.62132,88.65391 -92.56006,87.36468 -21.55039,-0.56771 -42.53818,-8.96601 -58.570854,-23.37013" />
          <path ref="balance" fillOpacity="0" stroke="#42A5F5" strokeWidth="2"
          d="m 150.27969,99.297091 c 29.13883,0.507109 52.69092,25.541579 52.16656,54.537139 -0.54412,30.08851 -26.40251,54.40331 -56.34776,53.84267 -31.03816,-0.5811 -56.115714,-27.26345 -55.518763,-58.15837 0.618069,-31.98784 28.124383,-57.828152 59.968993,-57.194871 32.93749,0.655014 59.54059,28.985321 58.87096,61.779601 -0.69194,33.88716 -29.84626,61.25306 -63.59022,60.54707 -34.83682,-0.72885 -62.965532,-30.7072 -62.223165,-65.40083 0.765751,-35.78649 31.568135,-64.678032 67.211445,-63.899274 36.73616,0.802635 66.39054,32.429074 65.57538,69.022064 -0.83951,37.68582 -33.29002,68.10305 -70.83268,67.25147 -38.63548,-0.87636 -69.81558,-34.15095 -68.927578,-72.64329 0.913213,-39.58515 35.011898,-71.528115 74.453908,-70.603677 40.53481,0.950052 73.24066,35.872837 72.27978,76.264527 -0.98688,41.48447 -36.73378,74.95322 -78.07514,73.95588 -42.43414,-1.0237 -76.665781,-37.59473 -75.63198,-79.88576 1.060512,-43.3838 38.45566,-78.378349 81.69637,-77.308079 44.33346,1.097317 80.09093,39.316609 78.98418,83.506989 -1.13411,45.28312 -40.17755,81.80351 -85.3176,80.66028 -46.23279,-1.17091 -83.516104,-41.0385 -82.336383,-87.12822 1.20769,-47.18245 41.899443,-85.228698 88.938833,-84.012482 48.13212,1.244469 86.9413,42.760382 85.68858,90.749452 -1.28124,49.08178 -43.62132,88.65391 -92.56006,87.36468 -21.55039,-0.56771 -42.53818,-8.96601 -58.570854,-23.37013" />
          <g transform="translate(150,150)">
              <path d={path(store.betDegrees, store.betRadius)} fillOpacity="0" stroke="#FF8A65" strokeWidth="4"/>
          </g>
        </svg>
      </div>
    );
  }
}

export default Arc;
