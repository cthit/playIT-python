import React, { Component } from "react";

export default class VotingArrows extends Component {
  constructor(props) {
    super(props);
    let savedState = JSON.parse(localStorage.getItem('vote-' + this.props.item.id));
    console.log(savedState);
    this.state = savedState || {
      value: 0,
      upvoted: false,
      downvoted: false
    };
  }
  saveState(state) {
    this.setState(state, function() {
      localStorage.setItem('vote-' + this.props.item.id, JSON.stringify(state))
    });
  }
  upvote() {
    if (this.state.upvoted) {
      return;
    }
    this.props.vote(1);
    this.saveState({
      value: 1,
      upvoted: true,
      downvoted: false
    });
  }
  downvote() {
    if (this.state.downvoted) {
      return;
    }
    this.props.vote(-1);
    this.saveState({
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
