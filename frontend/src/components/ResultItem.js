import React, { Component } from "react";

export default class ResultItem extends Component {
  componentDidUpdate() {
    if (this.props.selected) {
      React.findDOMNode(this).scrollIntoView();
    }
  }
  clickEvent(event) {
    event.stopPropagation();
    this.props.clickEvent(this.props.result);
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
