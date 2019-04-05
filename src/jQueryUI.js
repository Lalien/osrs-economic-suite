import React, { Component } from 'react';
const $ = window.$;

var style = {
    background: '#eaeaea',
    minWidth: '700px',
    minHeight: '500px',
    padding: '5px 5px 45px 5px',
    display: 'inline-block'
}

class UIBlock extends Component {

  componentDidMount() {
    this.$el = $(this.el);
    this.$el.draggable();
    this.$el.resizable();
  }

  render() {
    return (
      <div className="draggable-ui" ref={el => this.el = el} style={style}>
        {this.props.children}
      </div>
    );
  }
}

export {
    UIBlock
}