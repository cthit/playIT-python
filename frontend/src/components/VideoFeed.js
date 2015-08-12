import React, { Component } from "react";
import VideoItem from "./VideoItem.js";

export default class VideoFeed extends Component {
  render() {
    let items = this.props.items.map((item) => {
      return (<VideoItem key={item.id} item={item} setItem={this.props.setItem} playIT={this.props.playIT} setSelectedNode={this.setSelectedNode} selected={item.id === this.props.selected} />);
    });
    return (<ol className="view-feed">{items}</ol>);
  }
}