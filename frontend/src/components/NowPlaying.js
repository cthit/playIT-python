import React, { Component } from "react";
import Helpers from "../lib/helpers.js";

const NowPlaying = ({ track }) => {
  if (!track) {
    return (
      <div className="now-playing"><span>Nothing playing right now...</span></div>
    )
  } else {
    return (
      <div className="now-playing">
        <span>Now playing: <a href={Helpers.get_link(item)}>{item.title}</a> [{Helpers.format_time(item.duration)}] - {item.author} <em>Queued by {item.nick}</em></span>
      </div>
    )
  }
}

export default NowPlaying