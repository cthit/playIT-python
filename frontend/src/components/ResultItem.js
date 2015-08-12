import React, { Component } from "react";

export default class ResultItem extends Component {
  componentDidUpdate() {
    if (this.props.selected) {
      this.getDOMNode().scrollIntoView();
    }
  }
  clickEvent(event) {
    console.log(event);
    event.stopPropagation();
    this.props.clickEvent(this.props.result);
  }
  render() {
    let result = this.props.result;
    return (
      <li onClick={this.clickEvent} className={this.props.selected ? 'selected' : ''}>
        <img src={result.thumbnail} onClick={this.clickEvent} className="video-thumbnail" />
        <div className="details" onClick={this.clickEvent}>
          <div className="name">
            {result.name}
          </div>
          <div className="author">
            {result.author}
          </div>
        </div>
      </li>
    );
  }
}
