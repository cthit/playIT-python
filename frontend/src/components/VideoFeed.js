import React from "react"
import VideoItem from "./VideoItem"


const VideoFeed = ({ items, onUpvote, onDownvote, selectedId }) => (
  <ol className="view-feed">
    {items.map(item => (
      <VideoItem key={item.id}
                 item={item}
                 active={selectedId === item.id}
                 onUpvote={() => onUpvote(item)}
                 onDownvote={() => onDownvote(item)} />
    ))}
  </ol>
);



VideoFeed.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.any.isRequired,
    user_vote: React.PropTypes.number,
    value: React.PropTypes.number.isRequired
  }).isRequired).isRequired,
  onUpvote: React.PropTypes.func.isRequired,
  onDownvote: React.PropTypes.func.isRequired,
  selectedId: React.PropTypes.number.isRequired
}

export default VideoFeed
