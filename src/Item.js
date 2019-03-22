import React, { Component } from 'react';
import axios from 'axios';
import { Button, OverlayTrigger, Popover, Image, Alert, Col, Dropdown } from 'react-bootstrap';
import Controls from './Controls';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
function updateGraph(data) {
    this.setState({
      itemData: data
    });
}

class ItemDropdownItem extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isSelected: false
      };
    }
  
    render() {
      return (
        <Dropdown.Item>
            <Button
            onClick={() => this.handleClick()} 
            variant={this.props.isSelected ? "success" : "link"}
            disabled={!this.props.information.tradeable}
            >
            <Image
            src={`https://www.osrsbox.com/osrsbox-db/items-icons/${this.props.information.id}.png`}
            />
            {this.props.information.name}
            </Button>
        </Dropdown.Item>
      );
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

  class ItemGraph extends Component {
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
          <Alert variant="primary">Could not find sufficient information for that item.</Alert>
        )
      }
      return '';
    }
  }

  class ItemDropdown extends Component {
    constructor(props) {
      super(props);
      this.state = {
        selected_item: null,
      }
      this.handler = this.handler.bind(this);
    }

    render() {
      return(
        <Col md="3">
            <Dropdown>
                <Dropdown.Toggle>
                    Item
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {Object.keys(this.props.items).map(item =>(
                        <ItemDropdownItem information={this.props.items[item]} isSelected={ this.props.items[item].id == this.props.selected_item} handler={this.handler}/>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </Col>
      )
    }
  
    handler(itemId) {
      this.setState({
        selected_item: itemId
      });
    }
  }

  
  export {
      ItemDropdownItem,
      ItemGraph,
      ItemDropdown
  }