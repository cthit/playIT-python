import React from "react";
import VotingArrows from "./VotingArrows";
import Helpers from "../lib/helpers";

const VideoItem = ({ item, onUpvote, onDownvote }) => {
  let classes = ['media', item.type, 'selected'];
  const className = classes.join(' ')

  let duration;
  if (item.type.indexOf('_list') != -1) {
    duration = '[' + Helpers.format_time(item.duration) + ']';
  }

  return (
    <li className={className}>
      <VotingArrows {...item} onUpvote={onUpvote} onDownvote={onDownvote} />
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

VideoItem.propTypes = {
  item: React.PropTypes.shape({
    id: React.PropTypes.any.isRequired,
    value: React.PropTypes.number.isRequired
  }).isRequired,
  onUpvote: React.PropTypes.func.isRequired,
  onDownvote: React.PropTypes.func.isRequired
}

export default VideoItem
