import React from "react";
import { connect } from "react-redux"

import Mousetrap from "./lib/mousetrap";
import polyfill from "./lib/polyfill";
polyfill();

import KeyBindsListener from "./components/KeyBindsListener";
import NowPlaying from "./components/NowPlaying";
import ActiveVideoFeed from "./components/ActiveVideoFeed";
import SearchBoxContainer from "./components/SearchBoxContainer";
import backend from './lib/backend.js';

window.React = React;

const App = React.createClass({
  componentWillMount() {
    backend.connect(this.props.url, this.props.dispatch)
      .then((backend) => {
        backend.call('get_current');
        backend.call('get_queue');
        backend.call('get_playlist_queue');
        window.backend = backend;
    });
  },
  render() {
    return (
      <div>
        <KeyBindsListener />
        <SearchBoxContainer />
        <ActiveVideoFeed />
        <NowPlaying />
      </div>
    )
  }
})

export default connect()(App)
