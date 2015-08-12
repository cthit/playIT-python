import React, { Component } from "react";
import VotingArrows from "./VotingArrows.js";
import Helpers from "../lib/helpers.js";

export default class VideoItem extends Component {
  vote(value) {
    this.props.playIT.voteItem(value, this.props.item);
  }
  setAsCurrent() {
    this.props.setItem(this.props.item.id);
  }
  componentDidUpdate() {
    if (this.props.selected) {
      this.getDOMNode().scrollIntoView();
    }
  }
  render() {
    let item = this.props.item;
    let classes = ['media', item.type];
    if (this.props.selected) {
      classes.push('selected');
    }

    return (
      <li className={classes.join(' ')} onClick={this.setAsCurrent}>
        <VotingArrows value={item.value} vote={this.vote} />
        <div className="image">
          <a href={Helpers.get_link(item)} target="_blank">
            <img src={item.thumbnail} alt={item.external_id} />
          </a>
        </div>
        <div className="info">
          <h3>{item.title} [{Helpers.format_time(item.duration)}]</h3>
          <small><strong>{item.author}</strong> — Added by: <span title={item.cid}>{item.nick}</span></small>
          <p>{item.description}</p>
        </div>
      </li>
    );
  }
}