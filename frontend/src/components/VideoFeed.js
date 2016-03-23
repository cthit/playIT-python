import React from "react"
import VideoItem from "./VideoItem"


const VideoFeed = React.createClass({

  render() {
    const { items, onUpvote, onDownvote } = this.props
    return (
      <ol className="view-feed">
        {items.map(item => (
          <VideoItem key={item.id}
                     item={item}
                     onUpvote={() => onUpvote(item)}
                     onDownvote={() => onDownvote(item)} />
        ))}
      </ol>
    )
  },

  componentWillReceiveProps(newProps) {
    console.log("New props, videofeed: ", newProps);
  }
})



VideoFeed.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.any.isRequired,
    user_vote: React.PropTypes.number,
    value: React.PropTypes.number.isRequired
  }).isRequired).isRequired,
  onUpvote: React.PropTypes.func.isRequired,
  onDownvote: React.PropTypes.func.isRequired
}

export default VideoFeed
