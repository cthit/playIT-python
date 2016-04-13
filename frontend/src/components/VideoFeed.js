import React from "react"
import VideoItem from "./VideoItem"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"


const VideoFeed = ({ items, onUpvote, onClickItem, onDownvote, selectedId }) => (
  <ol className="view-feed">
    <ReactCSSTransitionGroup transitionName="swipe" transitionAppear={false} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
      {items.map(item => (
        <VideoItem key={item.id}
                   item={item}
                   onClick={() => onClickItem(item)}
                   active={selectedId === item.id}
                   onUpvote={() => onUpvote(item)}
                   onDownvote={() => onDownvote(item)} />
      ))}
      {!items.length && <li className="error-item">No items in queue</li>}
    </ReactCSSTransitionGroup>
  </ol>
);



VideoFeed.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.any.isRequired,
    user_vote: React.PropTypes.number,
    value: React.PropTypes.number.isRequired
  }).isRequired).isRequired,
  onUpvote: React.PropTypes.func.isRequired,
  onClickItem: React.PropTypes.func.isRequired,
  onDownvote: React.PropTypes.func.isRequired,
  selectedId: React.PropTypes.number.isRequired
}

export default VideoFeed
