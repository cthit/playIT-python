import React from "react";
import { connect } from "react-redux"

import Mousetrap from "./lib/mousetrap";
import polyfill from "./lib/polyfill";
polyfill();

import NowPlaying from "./components/NowPlaying";
import ActiveVideoFeed from "./components/ActiveVideoFeed";
import Searchbox from "./components/Searchbox";
import Backend from './lib/backend.js';

window.React = React;

let backend;

const App = React.createClass({
  componentWillMount() {
    // Mousetrap.registerKeys(this);
    backend = new Backend(this.props.url, this.props.dispatch);
    this.backendConnected = backend.connect();
    this.backendConnected.then((backend) => {
      backend.call('get_current');
      backend.call('get_queue');
      backend.call('get_playlist_queue');
    });
    window.backend = backend;
  },
  render() {
    return (
      <div>
        <ActiveVideoFeed />
      {/*
        <Searchbox addItem={this.addItem} changeQueueType={this._changeQueueType} />
      */}
        <NowPlaying />
      </div>
    )
  }
})

export default connect(() => ({}))(App)