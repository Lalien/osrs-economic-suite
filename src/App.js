import React, { Component } from 'react';
import axios from 'axios';
import { Container, Col, Row } from 'react-bootstrap';
import {ItemGraph, ItemDropdown} from './Item';
import { Button as MaterialButton} from '@material-ui/core';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      items: Array(50).fill(null),
      selected_item: null,
      itemDropdowns: Array(1).fill(false),
      itemDropdownCount: 1,
    };
    console.log(this.state.itemDropdownCount);
    axios.get('https://www.osrsbox.com/osrsbox-db/items-complete.json').then((data) => this.setItemData(data.data)).catch(console.error);
  }

  render() {
    if (this.state.ready) {
      console.log(this.state.itemDropdowns);
      return (
        <Container>
          <Row>
              {this.state.itemDropdowns.map((value,index) => (
                <ItemDropdown
                  key={index}
                  domKey={index}
                  items={this.state.items}
                  handleDropdownDelete={this.handleDropdownDelete.bind(this)}
                  hide={value}
                />
              ))}
            <Col md="12">
              <MaterialButton
                onClick={() => this.addDropdown()}
                disabled={this.state.itemDropdownCount >= 4}
                color="primary"
              >Add</MaterialButton>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ItemGraph/>       
            </Col>
          </Row>
        </Container>
      );
    }
    return '';
  }

  handleDropdownDelete(index) {
    this.state.itemDropdowns[index] = true;
    this.state.itemDropdownCount--;
    this.setState({
      itemDropdowns: this.state.itemDropdowns,
      itemDropdownCount: this.state.itemDropdownCount
    })
  }

  addDropdown() {
    this.state.itemDropdowns.push(false);
    this.state.itemDropdownCount++;
    this.setState({
      itemDropdowns: this.state.itemDropdowns,
      itemDropdownCount: this.state.itemDropdownCount
    });
  }

  setItemData(data) {
    this.setState({
      ready: true,
      items: this.state.items.map((value, index) => data[index]),
    });
  }
}

export default App;