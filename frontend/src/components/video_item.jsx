import React from "react";
import VotingArrows from "./voting_arrows.jsx";
import Helpers from "../helpers.js";

var VideoItem = React.createClass({
  vote(value) {
    this.props.playIT.voteItem(value, this.props.item);
  },
  setAsCurrent() {
    this.props.setItem(this.props.item.id);
  },
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
          <small>Added by: <span title={item.cid}>{item.nick}</span></small>
          <p>
            <em>{item.author}</em><br/>
            <strong>{item.description}</strong>
          </p>
        </div>
      </li>
    );
  }
});

export default VideoItem;
