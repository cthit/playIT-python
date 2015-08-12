import React, { Component } from "react";
import Helpers from "../lib/helpers.js";

export default class NowPlaying extends Component {
  render() {
    let item = this.props.item;
    if (!item) {
      return (<div className="now-playing"><span>Nothing playing right now...</span></div>);
    } else {
      return (
        <div className="now-playing">
          <span title={item.nick}>Now playing: <a href={Helpers.get_link(item)}>{item.title}</a> [{item.duration}] - {item.author}</span>
        </div>
      );
    }
  }
}