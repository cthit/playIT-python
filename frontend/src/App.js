import React from "react";
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import Mousetrap from "./lib/mousetrap";
import polyfill from "./lib/polyfill";
polyfill();

import KeyBindsListener from "./components/KeyBindsListener";
import NowPlaying from "./components/NowPlaying";
import ActiveVideoFeed from "./components/ActiveVideoFeed";
import SearchBoxContainer from "./components/SearchBoxContainer";
import backend from './lib/backend.js';
import store from './store/store';

import * as mainActions from "./actions/mainActions";

window.React = React;

const App = React.createClass({
  connect() {
    backend.connect(this.props.url, store.dispatch, this.handleDisconnect)
      .then((backend) => {
        backend.call('get_current');
        backend.call('get_queue');
        backend.call('get_playlist_queue');
        window.backend = backend;
        this.props.setConnected();
    });
  },
  handleDisconnect() {
    this.props.setDisconnected();
    setTimeout(() => this.connect(), 10000);
  },
  componentWillMount() {
    this.connect();
  },
  render() {
    return (
      <div className={"app " + (this.props.connected ? 'online' : 'offline')}>
        <KeyBindsListener />
        <SearchBoxContainer />
        <ActiveVideoFeed />
        <NowPlaying />
      </div>
    )
  }
})

export default connect(state => ({
  connected: state.main.connected
}), dispatch => bindActionCreators(mainActions, dispatch))(App)
