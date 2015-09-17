import React, { Component } from "react";

export default class VotingArrows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      upvoted: false,
      downvoted: false
    };
  }
  upvote() {
    this.props.vote(1);
    this.setState({
      value: 1,
      upvoted: true,
      downvoted: false
    });
  }
  downvote() {
    this.props.vote(-1);
    this.setState({
      value: -1,
      downvoted: true,
      upvoted: false
    });
  }
  render() {
    return (
      <div className="vote">
          <span className={"upvote vote-arrow" + (this.state.upvoted ? ' upvoted' : '')} onClick={this.upvote.bind(this)}>
            <i className="fa fa-arrow-up"></i>
          </span>
          <span className="rating">{this.props.value + this.state.value}</span>
          <span className={"downvote vote-arrow" + (this.state.downvoted ? ' downvoted' : '')} onClick={this.downvote.bind(this)}>
            <i className="fa fa-arrow-down"></i>
          </span>
      </div>
    );
  }
}
