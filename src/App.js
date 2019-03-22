import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Container, Button, Col, Row, Image, Alert, OverlayTrigger, Popover } from 'react-bootstrap';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      items: Array(50).fill(null),
      selected_item: null
    };
    this.handler = this.handler.bind(this);
    axios.get('https://www.osrsbox.com/osrsbox-db/items-complete.json').then((data) => this.setItemData(data.data)).catch(console.error);
  }

  render() {
    if (this.state.ready) {
      return (
        <Container>
          <Row>
            <Col xs={12}>
              {Object.keys(this.state.items).map(item =>(
                <Item information={this.state.items[item]} isSelected={ this.state.items[item].id == this.state.selected_item} handler={this.handler}/>
              ))}
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Graph/>       
            </Col>
          </Row>
        </Container>
      );
    }
    return '';
  }

  setItemData(data) {
    this.setState({
      ready: true,
      items: this.state.items.map((value, index) => data[index]),
    });
  }
  
  handler(itemId) {
    this.setState({
      selected_item: itemId
    });
  }
}

class Item extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    };
  }

  render() {

    const popover =
    <Popover id="popover-basic">
      <Controls></Controls>
    </Popover>
    return (
      <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
        <Button
        onClick={() => this.handleClick()} 
        variant={this.props.isSelected ? "success" : "link"}
        disabled={!this.props.information.tradeable}
        >
        {this.props.information.name}
        </Button>
      </OverlayTrigger>
    );
  }

  handleMouseEnter() {
    this.setState({
      hide_controls: false
    });
  }
  
  handleMouseLeave() {
    this.setState({
      hide_controls: true
    })
  }

  handleClick() {
    if (!this.props.isSelected) {
      axios.get('http://localhost:81/api/item-graph-data/' + this.props.information.id).then((data) => updateGraph(data.data)).catch((data) => updateGraph({error: true}));
      this.props.handler(this.props.information.id);
      return;
    }

    // Remove from graph
    this.props.handler(null);
    return;
  }

  handleNoResults() {
    this.setState({
      error: true
    });
  }
}

function updateGraph(data) {
  this.setState({
    itemData: data
  });
}

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemId: null
    };
    updateGraph = updateGraph.bind(this);
  }
  render() {
    if (this.state.itemData && !this.state.itemData.error) {
      const options = {
        title: {
          text: this.state.itemData.name
        },
        xAxis: {
          categories: this.state.itemData.daily.headers
        },
        series: [{
          data: this.state.itemData.daily.values
        }]
      }
      return (
        <HighchartsReact
        highcharts={Highcharts}
        options={options}/>
      );
    } else if (this.state.itemData && this.state.itemData.error) {
      return (
        <Alert variant="primary">Couldn't find sufficient information for that item.</Alert>
      )
    }
    return '';
  }
}

class Controls extends Component {
  
}

export default App;