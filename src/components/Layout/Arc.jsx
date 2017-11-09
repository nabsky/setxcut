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
            let freeSpinsAdd = store.wageLength - store.winLength;
            store.freeSpinsLength += freeSpinsAdd;
            if(store.freeSpinsLength > store.maxFreeSpins){
              store.freeSpinsLength = store.maxFreeSpins;
            }
          } else {
            store.lastWin = 0;
            store.balanceLength -= store.betLength;
          }
          segment.draw(0, store.balanceLength, 0.5);
          if(store.balanceLength == 0){
            store.betLength = 0;
            store.triangleDegrees = 0;
          }
          store.isSet = false;
          if(store.autorun){
            store.spin()
          }
        });
      } else {
        Velocity(this.refs.block,{  opacity: "0" }, { duration: 0});
        segment.draw(0, store.balanceLength, 0.5);
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
          <g transform="translate(160,160)">
              <circle cx="0" cy="0" r={store.cutRadius} fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"/>
              <circle cx="0" cy="0" r={store.betRadius} fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"/>
              <circle cx="0" cy="0" r={store.wageRadius} fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"/>
              <circle cx="0" cy="0" r={store.freeSpinsRadius} fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"/>
              <path d={path(store.wageDegrees, store.wageRadius)} fillOpacity="0" stroke="#9932CC" strokeWidth="2"/>
              <path ref="freeSpins" d={path(store.freeSpinsDegrees, store.freeSpinsRadius)} fillOpacity="0" stroke="#3CB371" strokeWidth="2"/>
              <path ref="block" d={path(store.cutDegrees, store.cutRadius)} fillOpacity="0" stroke="#9932CC" strokeWidth="2"/>
          </g>
<g transform="translate(10,10)">
          <g transform={transform(store.triangleDegrees, store.betRadius)}>
            <path fill="#FFFFFF" stroke="#777777" strokeWidth="1" d="M 5,3 0,-3 -5,3"/>
          </g>
          </g>
<g transform="translate(10,10)">
          <path fillOpacity="0" stroke="#EEEEEE" strokeWidth="2"
          d="m 150.00591,100.00438 c 29.11431,0.26394 52.79465,25.11909 52.50612,54.06882 -0.30105,30.2057 -26.09828,54.7671 -56.13941,54.44255 -31.29707,-0.33811 -56.739568,-27.07748 -56.378967,-58.21 0.375148,-32.38845 28.056677,-58.712074 60.280587,-58.315388 33.47983,0.412147 60.68461,29.035868 60.25181,62.351178 -0.44912,34.5712 -30.01506,62.65717 -64.42176,62.18823 -35.66259,-0.48606 -64.629764,-30.99426 -64.124655,-66.49235 0.522979,-36.75396 31.973455,-66.602372 68.562935,-66.061075 37.84534,0.559875 68.575,32.952655 67.9975,70.633525 -0.59675,38.93671 -33.93186,70.54765 -72.70411,69.93392 -40.02809,-0.63361 -72.520318,-34.91106 -71.870342,-74.7747 0.670451,-41.11947 35.890252,-74.492998 76.845292,-73.806763 42.21084,0.707277 76.46569,36.869453 75.74318,78.915873 -0.74409,43.30222 -37.84866,78.4384 -80.98647,77.6796 -17.67084,-0.31083 -35.00554,-6.56786 -48.834644,-17.56609" />
          <path ref="balance" fillOpacity="0" stroke="#42A5F5" strokeWidth="2"
          d="m 150.00591,100.00438 c 29.11431,0.26394 52.79465,25.11909 52.50612,54.06882 -0.30105,30.2057 -26.09828,54.7671 -56.13941,54.44255 -31.29707,-0.33811 -56.739568,-27.07748 -56.378967,-58.21 0.375148,-32.38845 28.056677,-58.712074 60.280587,-58.315388 33.47983,0.412147 60.68461,29.035868 60.25181,62.351178 -0.44912,34.5712 -30.01506,62.65717 -64.42176,62.18823 -35.66259,-0.48606 -64.629764,-30.99426 -64.124655,-66.49235 0.522979,-36.75396 31.973455,-66.602372 68.562935,-66.061075 37.84534,0.559875 68.575,32.952655 67.9975,70.633525 -0.59675,38.93671 -33.93186,70.54765 -72.70411,69.93392 -40.02809,-0.63361 -72.520318,-34.91106 -71.870342,-74.7747 0.670451,-41.11947 35.890252,-74.492998 76.845292,-73.806763 42.21084,0.707277 76.46569,36.869453 75.74318,78.915873 -0.74409,43.30222 -37.84866,78.4384 -80.98647,77.6796 -17.67084,-0.31083 -35.00554,-6.56786 -48.834644,-17.56609" />
</g>
          <g transform="translate(160,160)">
              <path d={path(store.betDegrees, store.betRadius)} fillOpacity="0" stroke="#FF8A65" strokeWidth="4"/>
          </g>
        </svg>
      </div>
    );
  }
}

export default Arc;
