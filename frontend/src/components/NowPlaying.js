import React from "react";
import { connect } from "react-redux"

import Helpers from "../lib/helpers"

const NowPlaying = ({ connected, item }) => (
  <div className="now-playing">
    {!connected && <span>Disconnected: Can't reach server</span>}
    {connected && (item ?
      <span>
        Now playing: <a href={Helpers.get_link(item)}>{item.title}</a> [{Helpers.format_time(item.duration)}] - {item.author} <em>Queued by {item.nick}</em>
      </span>
      :
      <span>Nothing playing right now...</span>
    )}
  </div>
)

export default connect(state => ({
  item: state.main.nowPlaying,
  connected: state.main.connected
}))(NowPlaying)
