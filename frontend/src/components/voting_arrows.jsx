import React from "react";

var VotingArrows = React.createClass({
  getInitialState() {
    return {
      value: 0,
      voted: false
    };
  },
  upvote() {
    this.props.vote(1);
    this.setState({
      value: 1,
      voted: true
    });
  },
  downvote() {
    this.props.vote(-1);
    this.setState({
      value: -1,
      voted: true
    });
  },
  render() {
    return (
      <div className="vote">
          <span className="upvote vote-arrow" onClick={this.upvote}>⬆</span>
          <span className="rating">{this.props.value + this.state.value}</span>
          <span className="downvote vote-arrow" onClick={this.downvote}>⬇</span>
      </div>
    );
  }
});

export default VotingArrows;
