import React, { Component } from "react";
import VotingArrows from "./VotingArrows.js";
import Helpers from "../lib/helpers.js";

export default class VideoItem extends Component {
  constructor(props) {
    super(props);

    let savedState = JSON.parse(localStorage.getItem('vote-' + this.props.item.id));
    this.state = savedState || {value: 0};
  }
  saveState(state) {
    this.setState(state, function() {
      localStorage.setItem('vote-' + this.props.item.id, JSON.stringify(state))
    });
  }
  upvote() {
    if (this.state.upvoted) {
      return false;
    }
    this.saveState({value: 1, upvoted: true});
    return true;
  }
  downvote() {
    if (this.state.downvoted) {
      return false;
    }
    this.saveState({value: -1, downvoted: true});
    return true;
  }
  vote(value) {
    if (value > 0) {
      return this.upvote();
    } else {
      return this.downvote();
    }
  }
  updateButtons(value) {
    let didVote = this.vote(value);
    if (didVote) {
      this.props.voteItem(value);
    }
  }
  setAsCurrent() {
    this.props.setItem(this.props.item.id);
  }
  componentDidUpdate(prevProps) {
    if (this.props.selected && prevProps.selected !== this.props.selected) {
      let node = React.findDOMNode(this);
      if (!Helpers.elementInViewport(node)) {
        node.scrollIntoView();
      }
    }
  }
  render() {
    let item = this.props.item;
    let classes = ['media', item.type];
    if (this.props.selected) {
      classes.push('selected');
    }

    let duration;
    if (item.type.indexOf('_list') != -1) {
      duration = '[' + Helpers.format_time(item.duration) + ']';
    }

    return (
      <li className={classes.join(' ')} onClick={this.setAsCurrent.bind(this)}>
        <VotingArrows item={item} value={this.state.value} vote={this.updateButtons.bind(this)} />
        <div className="image">
          <a href={Helpers.get_link(item)} target="_blank">
            <img src={item.thumbnail} alt={item.external_id} />
          </a>
        </div>
        <div className="info">
          <h3>{item.title} {duration}</h3>
          <small><strong>{item.author}</strong> — Added by: <span title={item.cid}>{item.nick}</span></small>
          <p>{item.description}</p>
        </div>
      </li>
    );
  }
}
