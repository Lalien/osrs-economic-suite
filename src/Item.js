import React, { Component } from 'react';
import axios from 'axios';
import { Image, Alert } from 'react-bootstrap';
import {Button, Menu, MenuItem, Grid} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import DeleteIcon from '@material-ui/icons/Delete';

var style = {
  font: {
    fontSize: '10px',
  },
  img_thumbnail: {
    width: '20px'
  }
};

function updateGraph(data,key) {
    var output = {};
        output.itemData = {
            ...this.state.itemData
        };
    if (!data) {
      delete output.itemData[key]
    } else {
      output.itemData[key] = data
    }
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
        <MenuItem onClick={() => this.handleItemSelection()}>
            <Button
            selected={this.props.isSelected}
            disabled={!this.props.information.tradeable}
            >
            <Image
            src={`https://www.osrsbox.com/osrsbox-db/items-icons/${this.props.information.id}.png`}
            />
            {this.props.information.name}
            </Button>
        </MenuItem>
      );
    }

    handleItemSelection = event => {
      axios.get('http://localhost:81/api/item-graph-data/' + this.props.information.id).then((data) => this.props.handler(this.props.information,data.data)).catch(() => this.props.handler({error: true}));
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
            series: [],
            title: {
                text: ''
            },
            xAxis: {
              enabled: true,
              labels: []
            }
        }
        Object.keys(this.state.itemData).forEach((key) => (
          (this.state.itemData[key] != null) ? options.series.push({data: this.state.itemData[key].daily.values}) : options.series.push({data: null})
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
        menuAnchorEl: null,
        itemAnchorEl: null
      }
      this.handler = this.handler.bind(this);
    }

    render() {
      if (!this.props.hide) {
        return(
          <Grid item lg={3}>
            <Image
              style={style.img_thumbnail}
              src={this.state.selected_item.id ? `https://www.osrsbox.com/osrsbox-db/items-icons/${this.state.selected_item.id}.png` : ``}
            />
            <Button
              onClick={this.handleItemMenuDropdownToggle}
              style={style.font}
              >
              {this.state.selected_item.name || 'None'}
            </Button>
            <Button
              onClick={() => this.handleDropdownDelete()}
              ><DeleteIcon/></Button>
            <Menu
              anchorEl={this.state.itemAnchorEl}
              open={Boolean(this.state.itemAnchorEl)}
              onClose={() => this.handleItemMenuClose()}
              >
              {Object.keys(this.props.items).map(item =>(
                  <ItemDropdownItem 
                    key={this.props.items[item].id} 
                    information={this.props.items[item]}
                    isSelected={ this.props.items[item].id == this.props.selected_item} 
                    handleItemSelection={this.handleItemSelection.bind(this)}
                    handler={this.handler}
                  />
              ))}
            </Menu>
          </Grid>
        );
      }
      return '';
    }

    handleItemMenuClose() {
      this.setState({
        itemAnchorEl: null
      })
    }

    handleItemSelection = () => {
      this.setState({
        itemAnchorEl: null
      })
    }

    handleItemMenuDropdownToggle = event => {
      this.setState({
        itemAnchorEl: event.currentTarget
      });
    }

    handleDropdownDelete() {
      updateGraph(null,this.props.domKey);
      this.props.handleDropdownDelete(this.props.domKey);
    }

    removeItem = () => {
      this.handleMenuItemSelect();
    }

    handleMenuToggle = event => {
      this.setState({
        menuAnchorEl: event.currentTarget
      })
    }

    handleMenuClose = () => {
      this.setState({
        menuAnchorEl: null
      })
    }

    handleMenuItemSelect = () => {
      this.setState({
        menuAnchorEl: null
      })
    }

    handler(item, data) {
      this.setState({
        selected_item: item,
        itemAnchorEl: null
      });
      updateGraph(data,this.props.domKey);
    }
  }

export {
    ItemDropdownItem,
    ItemGraph,
    ItemDropdown
}