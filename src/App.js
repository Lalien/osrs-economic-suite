import React, { Component } from 'react';
import GraphUI from './GraphUI';
import { BottomNavigation, BottomNavigationAction} from '@material-ui/core';
const style = {
  bottomNav: {
    position: 'fixed',
    bottom: '0'
  }
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGraph: false
    } 
  }
  
  render() {
    return (
    <div>
      <GraphUI
        open={this.state.showGraph}
        closeGraphHandler = {this.closeGraph.bind(this)}
      />
      <BottomNavigation
        showLabels
        style={style.bottomNav}
      >
        <BottomNavigationAction label="Graph" onClick={() => this.showGraphUI()} />
        <BottomNavigationAction label="Graph" onClick={() => this.showGraphUI()} />
      </BottomNavigation>
    </div>
    )
  }
  showGraphUI() {
    this.setState({
      showGraph: true
    });
  }

  closeGraph() {
    this.setState({
      showGraph: false
    });
  }
}

export default App;