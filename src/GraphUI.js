import React, { Component } from 'react';
import axios from 'axios';
import { Container, Col, Row } from 'react-bootstrap';
import {ItemGraph, ItemDropdown} from './Item';
import { Button as MaterialButton, Grid, Paper, Card, CardContent, CardMedia} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { UIBlock } from './jQueryUI';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

class GraphUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      itemDropdownCount: 1,
      items: Array(50).fill(null),
      selected_item: null,
      itemDropdowns: Array(1).fill(false)
    };
    axios.get('https://www.osrsbox.com/osrsbox-db/items-complete.json').then((data) => this.setItemData(data.data)).catch(console.error);
  }
  
  render() {
    if (this.state.ready && this.props.open) {
      return (
        <UIBlock>
            <div>
                <Grid xs={12} item>
                    <MaterialButton
                        style={{float: 'right'}}
                        onClick={() => this.props.closeGraphHandler()}>
                        Exit
                    </MaterialButton>
                </Grid>
                <Grid container justify="center" xs={12}>
                    {this.state.itemDropdowns.map((value,index) => (
                        <ItemDropdown
                        key={index}
                        domKey={index}
                        items={this.state.items}
                        handleDropdownDelete={this.handleDropdownDelete.bind(this)}
                        hide={value}
                        />
                    ))}
                    <MaterialButton
                        onClick={() => this.addDropdown()}
                        hidden={this.state.itemDropdownCount >= 4}
                    ><AddIcon/>
                    </MaterialButton>
                </Grid>
            </div>
            <Grid container justify="center">
                <ItemGraph/>       
            </Grid>
        </UIBlock>
      );
    }
    return '';
  }

  closeUI() {
    this.setState({
        open: false
    });
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

export default GraphUI;