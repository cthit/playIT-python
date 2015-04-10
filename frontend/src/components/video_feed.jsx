import React from "react";
import VideoItem from "./video_item.jsx";

var VideoFeed = React.createClass({
  render() {
    let items = this.props.items.map((item) => {
      return (<VideoItem key={item.id} item={item} setItem={this.props.setItem} playIT={this.props.playIT} selected={item.id === this.props.selected} />);
    });
    return (<ol>{items}</ol>);
  }
});

export default VideoFeed;
