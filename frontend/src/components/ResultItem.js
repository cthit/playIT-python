import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class ResultItem extends Component {
  componentDidUpdate() {
    if (this.props.selected) {
      ReactDOM.findDOMNode(this).scrollIntoView(false);
    }
  }
  clickEvent(event) {
    this.props.onClick(this.props.result);
  }
  render() {
    let result = this.props.result;
    return (
      <li onClick={this.clickEvent.bind(this)} className={this.props.selected ? 'selected' : ''}>
        <img src={result.thumbnail} className="video-thumbnail" />
        <div className="details">
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
