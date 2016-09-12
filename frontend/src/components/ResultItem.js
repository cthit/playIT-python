import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

export default class ResultItem extends Component {
  componentDidUpdate() {
    if (this.props.selected) {
      const node = ReactDOM.findDOMNode(this)
      if (node.scrollIntoViewIfNeeded) {
        node.scrollIntoViewIfNeeded(false)
      } else {
        node.scrollIntoView();
      }
    }
  }
  render() {
    const { result, onClick, selected } = this.props;
    return (
      <li onClick={() => onClick(result)} className={classNames({selected: 'selected'})}>
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
