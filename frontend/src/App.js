import React from "react";
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import Mousetrap from "./lib/mousetrap";
import polyfill from "./lib/polyfill";
polyfill();

import KeyBindsListener from "./components/KeyBindsListener";
import NowPlaying from "./components/NowPlaying";
import ActiveVideoFeed from "./components/ActiveVideoFeed";
import DropHandler from "./components/DropHandler";
import SearchBoxContainer from "./components/SearchBoxContainer";
import backend from './lib/backend.js';
import store from './store/store';

import * as mainActions from "./actions/mainActions";
import * as trackActions from "./actions/trackActions";

window.React = React;

const App = React.createClass({
  connect() {
    backend.connect(this.props.url, store.dispatch, this.handleDisconnect)
      .then((backend) => {
        backend.call('get_current');
        backend.call('get_queue');
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
        <DropHandler addNewItem={this.props.addNewItem}>
          <KeyBindsListener />
          <SearchBoxContainer />
          <ActiveVideoFeed />
          <NowPlaying />
        </DropHandler>
      </div>
    )
  }
})

const mapStateToProps = state => ({
  connected: state.main.connected
})

const mapDispatchToProps = dispatch => bindActionCreators({
  ...mainActions,
  ...trackActions
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App)
