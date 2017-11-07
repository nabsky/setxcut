import React, { Component } from "react";
import { observer } from "mobx-react";
import Velocity from 'velocity-animate';
import { autorun } from 'mobx';

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
    this.disposer = autorun(() => {
      if (store.isSet) {
        console.log('set');
        Velocity(this.refs.block,{  opacity: "1" }, { duration: 0})
        .then(e=> {
          Velocity(this.refs.block,{ rotateZ: "+=1080" }, { duration: 3000, easing: "linear"});
        }).then(e=> {
          Velocity(this.refs.block,{ rotateZ: `+=${store.result}` }, { duration: store.resultSpeed, easing: "linear"});
        }).then(e=> {
          Velocity(this.refs.block,{  opacity: "0" }, { duration: 1000});
        }).then(e=> {
          Velocity(this.refs.block,{  rotateZ: "0deg" }, { duration: 0});
          Velocity(this.refs.block,{  opacity: "0" }, { duration: 0});
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
        <g transform="translate(150,150)">
            <circle cx="0" cy="0" r={store.betRadius} fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"/>
            <circle cx="0" cy="0" r={store.cutRadius} fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"/>
            <circle cx="0" cy="0" r={store.wageRadius} fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"/>
            <path d={path(store.balanceDegrees, store.betRadius)} fillOpacity="0" stroke="#42A5F5" strokeWidth="2"/>
            <path d={path(store.betDegrees, store.betRadius)} fillOpacity="0" stroke="#FF8A65" strokeWidth="3"/>
            <path d={path(store.wageDegrees, store.wageRadius)} fillOpacity="0" stroke="#9932CC" strokeWidth="2"/>
            <path ref="block" d={path(store.cutDegrees, store.cutRadius)} fillOpacity="0" stroke="#9932CC" strokeWidth="2"/>
        </g>
        <g transform={transform(store.triangleDegrees, store.betRadius)}>
          <path fill="#FFFFFF" stroke="#777777" strokeWidth="1" d="M 5,3 0,-3 -5,3"/>
        </g>
      </svg>
    );
  }
}

export default Arc;
