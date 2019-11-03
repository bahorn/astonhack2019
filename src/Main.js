import React from 'react';
import { WebGazeContext } from './WebGazeContext';
import UsableButton from './components/Buttons';
import axios from 'axios';


import './Main.css';

class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }

    this.regularCount = this.regularCount.bind(this);
  }

  /* */
  regularCount() {
    const active = this.doChecks();
    const newData = this.state.data.map(
      (b) => {
        let res = b;
        if (b.uid == active) {
          res.count += 5;
          if (res.count >= 100) {
            // reset and trigger action
            res.count = 0;
            axios.get(`https://maker.ifttt.com/trigger/${b.action}/with/key/${process.env.REACT_APP_IFTTT_KEY}`)
              .then(res => {
                console.log(res);
              });

          }
        } else {
          res.count -= 2.5;
          if (res.count < 0) {
            res.count = 0;
          }
        }
        return res;
      }
    );

    this.setState({data: newData});
  }

  /* Remove the interval */
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    /* Fetch a list of all the state */
    axios.get(process.env.REACT_APP_CONFIG)
      .then(res => {
        this.setState({data: res.data});
      });
    this.interval = setInterval(
      () => {
        this.regularCount();
      },
      250
    );
  }


  doChecks() {
    if (this.context === undefined) {
      return -1;
    }
    /* Loop through until we find an element that we have setup our selves */
    const tags = document.elementsFromPoint(this.context.x, this.context.y);
    for (let i = 0; i < tags.length; i++) {
      const element = tags[i];
      if (element.className === process.env.REACT_APP_CLASS_NAME) {
        return element.getAttribute('uid') || -1;
      }

    }
    return -1;
  }

  render() {
    const active = this.doChecks();
    /* Generate a list of all the buttons */
    const VisableButtons = this.state.data.map(
      (b) => (
        <UsableButton
          name={b.name}
          uid={b.uid}
          active={active}
          count={b.count}
        />)
    );
    return (
      <div id="container">
        <h1>Visuabilty</h1>
        <h2>Please Have the AstonHack Slack open!</h2>
        <WebGazeContext.Consumer>
          {value => (<div>{value.x} {value.y}</div>)}
        </WebGazeContext.Consumer>
        {VisableButtons}
      </div>
    );
  }
}
MainApp.contextType = WebGazeContext;

export default MainApp;
