import React from "react";

var ResultItem = React.createClass({
  componentDidUpdate() {
    if (this.props.selected) {
      this.getDOMNode().scrollIntoView();
    }
  },
  render() {
    let result = this.props.result;
    return (
      <li onClick={() => this.props.onClick(result)} className={this.props.selected ? 'selected' : ''}>
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
});

export default ResultItem;
