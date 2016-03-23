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
    // Mousetrap.registerKeys(this);
    this.backendConnected = backend.connect(this.props.url, this.props.dispatch);
    this.backendConnected.then((backend) => {
      backend.call('get_current');
      backend.call('get_queue');
      backend.call('get_playlist_queue');
    });
    window.backend = backend;
  },
  render() {
    const activeFeedId = this.props.activeFeedId
    return (
      <div>
        <KeyBindsListener activeFeedId={activeFeedId}/>
        <SearchBoxContainer activeFeedId={activeFeedId}/>
        <ActiveVideoFeed activeFeedId={activeFeedId}/>
        <NowPlaying />
      </div>
    )
  }
})

export default connect((state) => ({
  activeFeedId: state.main.show
}))(App)
