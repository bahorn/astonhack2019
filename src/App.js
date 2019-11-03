import React from 'react';
import { WebGazeContext } from './WebGazeContext';
import MainApp from './Main';

import './App.css';



import Script from 'react-load-script'
declare var webgazer;

class WebGazeLoader extends React.Component {
  constructor() {
    super();
    this.state = {
      context: {x: -1, y: -1}
    };
  }

  handleScriptLoad() {
    webgazer.setGazeListener((data, elapsedTime) => {
      if (data == null) {
        return;
      }
      this.setState({context: webgazer.util.bound(data)})
    }).begin();
  }

  handleScriptError() {
    console.log('error');
  }

  render() {
    return (

      <WebGazeContext.Provider value={this.state.context}>
        <Script
          url="https://webgazer.cs.brown.edu/webgazer.js"
          onLoad={this.handleScriptLoad.bind(this)}
          onError={this.handleScriptError.bind(this)}
        />
        <MainApp />
      </WebGazeContext.Provider>

    );
  }
}
WebGazeLoader.contextType = WebGazeContext;

function App() {

  return (
    <div className="App">
      <WebGazeLoader />
    </div>
  );
}

export default App;
