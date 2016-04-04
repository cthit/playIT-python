import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class ResultItem extends Component {
  componentDidUpdate() {
    if (this.props.selected) {
      ReactDOM.findDOMNode(this).scrollIntoView(false);
    }
  }
  render() {
    const { result, onClick, selected } = this.props;
    return (
      <li onClick={() => onClick(result)} className={selected ? 'selected' : ''}>
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
