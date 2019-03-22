import React, { Component } from 'react';
import axios from 'axios';
import { Container, Button, Col, Row } from 'react-bootstrap';
import {ItemGraph, ItemDropdown} from './Item';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      items: Array(50).fill(null),
      selected_item: null,
      itemDropdowns: Array(1).fill(null)
    };
    axios.get('https://www.osrsbox.com/osrsbox-db/items-complete.json').then((data) => this.setItemData(data.data)).catch(console.error);
  }
  render() {
    if (this.state.ready) {
      return (
        <Container>
          <Row>
              {this.state.itemDropdowns.map(() => (
                <ItemDropdown
                  items={this.state.items}
                />
              ))}
            <Col md="12">
              <Button
                onClick={() => this.addDropdown()}
              >Add</Button>
              <Button
                onClick={() => this.removeDropdown()}
                disabled={this.state.itemDropdowns.length == 1}
              >Remove</Button>
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

  addDropdown() {
    this.state.itemDropdowns.push(null);
    this.setState({
      itemDropdowns: this.state.itemDropdowns
    });
  }

  removeDropdown() {
    this.state.itemDropdowns.pop();
    this.setState({
      itemDropdowns: this.state.itemDropdowns
    })
  }

  setItemData(data) {
    this.setState({
      ready: true,
      items: this.state.items.map((value, index) => data[index]),
    });
  }
}

export default App;