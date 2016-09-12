import React from "react";
import { connect } from "react-redux"

import Helpers from "../lib/helpers"

const get_nice_error_msg = (error, authUrl) => {
  switch (error) {
    case "No token":
      return (
        <span>
          Sign in <a href={`${authUrl}?redirect_to=${window.location}`}>here</a>
        </span>
      )
    default:
      return error
  }
}

const NowPlaying = ({ connected, error, item, authUrl }) => (
  <div className="now-playing">
    {!connected && <span>Disconnected: {get_nice_error_msg(error, authUrl) || "Can't reach server"}</span>}
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
  connected: state.main.connected,
  error: state.main.error,
  authUrl: state.main.config.auth_url
}))(NowPlaying)
