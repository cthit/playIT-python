import React, { Component } from "react";

export default class ToggleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.default
    };
  }
  next() {
    let length = this.props.options.length;
    let nextIndex = this.props.options.indexOf(this.state.selected) + 1;
    if (nextIndex >= length) {
      nextIndex = 0;
    }
    this.setState({
      selected: this.props.options[nextIndex]
    });
    if (this.props.onChange) {
      this.props.onChange(this.props.options[nextIndex].toLowerCase());
    }
  }
  titleCase(string) {
    return string[0].toUpperCase() + string.slice(1);
  }
  render() {
    return (
      <button className="tglbutton" onClick={this.next.bind(this)}>{ this.titleCase(this.state.selected) }</button>
    );
  }
}
