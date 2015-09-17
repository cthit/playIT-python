import React, { Component } from "react";

export default class VotingArrows extends Component {
  render() {
    return (
      <div className="vote">
          <span className={"upvote vote-arrow" + (this.props.value > 0 ? ' upvoted' : '')} onClick={() => this.props.vote(1)}>
            <i className="fa fa-arrow-up"></i>
          </span>
          <span className="rating">{this.props.item.value + this.props.value}</span>
          <span className={"downvote vote-arrow" + (this.props.value < 0 ? ' downvoted' : '')} onClick={() => this.props.vote(-1)}>
            <i className="fa fa-arrow-down"></i>
          </span>
      </div>
    );
  }
}
