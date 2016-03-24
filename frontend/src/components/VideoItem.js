import React from "react";
import ReactDOM from "react-dom";
import VotingArrows from "./VotingArrows";
import Helpers from "../lib/helpers";

const VideoItem = React.createClass({
  componentDidUpdate() {
    if (this.props.active) {
      ReactDOM.findDOMNode(this).scrollIntoView(true);
    }
  },
  propTypes: {
    item: React.PropTypes.shape({
      id: React.PropTypes.any.isRequired,
      user_vote: React.PropTypes.number,
      value: React.PropTypes.number.isRequired
    }).isRequired,
    onUpvote: React.PropTypes.func.isRequired,
    onDownvote: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool.isRequired
  },
  render() {
    const { item, onUpvote, onDownvote, active } = this.props;
    const itemIsPlaylist = item.type.indexOf('_list') !== -1;

    return (
      <li className={['media', item.type, (active ? 'selected' : '')].join(' ')}>
        <VotingArrows {...item} onUpvote={onUpvote} onDownvote={onDownvote} />
        <div className="image">
          <a href={Helpers.get_link(item)} target="_blank">
            <img src={item.thumbnail} alt={item.external_id} />
          </a>
        </div>
        <div className="info">
          <h3>{item.title} {itemIsPlaylist && '[' + Helpers.format_time(item.duration) + ']'}</h3>
          <small><strong>{item.author}</strong> — Added by: <span title={item.cid}>{item.nick}</span></small>
          <p>{item.description}</p>
        </div>
      </li>
    )
  }
});

export default VideoItem
