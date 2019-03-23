import React, { Component } from 'react';
import axios from 'axios';
import { Button, OverlayTrigger, Popover, Image, Alert, Col, Dropdown } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function updateGraph(data,key) {
    var output = {};
        output.itemData = {
            ...this.state.itemData
        };
    output.itemData[key] = data
    this.setState(output);
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
        axios.get('http://localhost:81/api/item-graph-data/' + this.props.information.id).then((data) => this.props.handler(this.props.information,data.data)).catch(() => this.props.handler({error: true}));
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
        itemId: null,
      };
      updateGraph = updateGraph.bind(this);
    }

    render() {
      if (this.state.itemData && !this.state.itemData.error) {
        var options = {
            series: []
        //   title: {
        //     text: this.state.itemData.name
        //   },
        //   xAxis: {
        //     categories: this.state.itemData.daily.headers
        //   },
        //   series: [{
        //     data: this.state.itemData.daily.values
        //   }]
        }
        Object.keys(this.state.itemData).forEach((key) => (
          options.series.push({data: this.state.itemData[key].daily.values})
        ));
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
        selected_item: {},
      }
      this.handler = this.handler.bind(this);
    }

    render() {
      return(
        <Col md="3">
            <Dropdown>
                <Dropdown.Toggle>
                    {this.state.selected_item.name || 'No Item Selected'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {Object.keys(this.props.items).map(item =>(
                        <ItemDropdownItem 
                        key={this.props.items[item].id} 
                        information={this.props.items[item]} 
                        isSelected={ this.props.items[item].id == this.props.selected_item} 
                        handler={this.handler}
                        />
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </Col>
      )
    }

    handler(item, data) {
      this.setState({
        selected_item: item
      });
      updateGraph(data,this.props.domKey);
    }
  }

export {
    ItemDropdownItem,
    ItemGraph,
    ItemDropdown
}