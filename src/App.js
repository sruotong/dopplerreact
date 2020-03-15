import React from 'react';
import './App.css';
import star from './images/star-small.png'
import { VelocityInput } from './velocityinput/velocityinput';
import { VelocitySlider } from './velocityslider/velocityslider';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      velocityValue: 0,
      hueColor: { backgroundColor: 'transparent' },
      //asume default light speed is 300000 mk/s
      lightSpeed: 300000,
      //asume default yellow color wavelength is 580
      //when velocity the original color of the star is yellow
      yellowWavelength: 580,
      velocityScale: 0
    };
  }

  exponentialScale(velocity) {
    let minp = 0;
    let maxp = 100;
    let minv = Math.log(1000);
    let maxv = Math.log(130000);
    let scale = (maxv - minv) / (maxp - minp);
    return -Math.exp(minv + scale * (-velocity - minp));
  }

  normalScale(velocity) {
    return velocity * 600;
  }

  onVelocityChange(velocity) {
    let temp = velocity.target ? velocity.target.value : velocity;

    //check if velocity out of range
    if (temp > 100) {
      temp = 100;
    } else if (temp < -100) {
      temp = -100;
    }

    //detect which way to scale
    if (temp > 0 && temp <= 100) {
      this.setState({ velocityValue: temp, velocityScale: this.normalScale(temp) });
    } else if (temp <= -1 && temp >= -100) {
      this.setState({ velocityValue: temp, velocityScale: this.exponentialScale(temp) });
    } else {
      this.setState({ velocityValue: 0, velocityScale: 0 });
    }
    //update img color
    this.updateColor();
  }

  render() {
    return (
      <div className="App" >
        <div className="Background"></div>
        <header className="App-header">
          <p>Doppler Effects</p>
        </header>
        <div className="content">
          <div className="img-container">
            <div className="img-cover" style={this.state.hueColor} ></div>
            <img src={star} alt="a star" />
          </div>
          <div className="input-container">
            <VelocityInput value={this.state.velocityValue} velocityChange={(velocity) => this.onVelocityChange(velocity)}></VelocityInput>
            <VelocitySlider value={this.state.velocityValue} velocityChange={(velocity) => this.onVelocityChange(velocity)}></VelocitySlider>
          </div>
        </div>
      </div>
    );
  }


  updateColor() {
    if (this.state.velocityValue === 0) {
      this.setState({ hueColor: { backgroundColor: 'transparent' } });
    } else {
      let wavelength = Math.round(this.state.yellowWavelength * this.state.lightSpeed / (this.state.lightSpeed - this.state.velocityScale));
      let red, green, blue, factor;
      const gamma = 0.8;
      const intensity_max = 255;
      if ((380 <= wavelength) && (wavelength <= 439)) {
        red = -(wavelength - 440) / (440 - 380);
        green = 0;
        blue = 1;
      }
      else if ((440 <= wavelength) && (wavelength <= 489)) {
        red = 0;
        green = (wavelength - 440) / (490 - 440);
        blue = 1;
      }
      else if ((490 <= wavelength) && (wavelength <= 509)) {
        red = 0;
        green = 1;
        blue = -(wavelength - 510) / (510 - 490);
      }
      else if ((510 <= wavelength) && (wavelength <= 579)) {
        red = (wavelength - 510) / (580 - 510);
        green = 1;
        blue = 0;
      }
      else if ((580 <= wavelength) && (wavelength <= 644)) {
        red = 1;
        green = -(wavelength - 645) / (645 - 580);
        blue = 0;
      }
      else if ((645 <= wavelength) && (wavelength <= 725)) {
        red = 1;
        green = 0;
        blue = 0;
      }
      if ((380 <= wavelength) && (wavelength <= 419)) {
        factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
      } else if ((420 <= wavelength) && (wavelength <= 644)) {
        factor = 1;
      } else if ((645 <= wavelength) && (wavelength <= 725)) {
        factor = 0.3 + 0.7 * (725 - wavelength) / (725 - 700);
      } else {
        factor = 0;
      }
      red = red === 0 ? red : Math.round(intensity_max * Math.pow(red * factor, gamma));
      green = green === 0 ? green : Math.round(intensity_max * Math.pow(green * factor, gamma));
      blue = blue === 0 ? blue : Math.round(intensity_max * Math.pow(blue * factor, gamma));
      this.setState({ hueColor: { backgroundColor: 'rgb(' + red + ', ' + green + ', ' + blue + ')' } });
    }
  }

}

export default App;
