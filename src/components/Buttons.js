import React from 'react';
import { Button, Progress } from 'reactstrap';
import axios from 'axios';
import './Buttons.css';

/* Component for triggering IFTTT webhooks */
class UsableButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  action() {
    axios.get(`${process.env.REACT_APP_IFTTT_WEBHOOK}/${this.props.action}`)
      .then(res => {
        console.log(res);
      });
  }

  render() {
    return (
      <div className={process.env.REACT_APP_CLASS_NAME} uid={this.props.uid} key={this.props.active}>
         <Button size="lg" className="test" color={(this.props.active==this.props.uid) ? "primary" : "secondary"}>
          {this.props.name}
           </Button>
              <Progress classNAme="test" color={(this.props.active==this.props.uid) ? "primary" : "secondary"} value={this.props.count} />
                <br />
      </div>
    );
  }
}


export default UsableButton;
