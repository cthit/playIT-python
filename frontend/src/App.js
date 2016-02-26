import React from "react";
import Mousetrap from "./lib/mousetrap";
import polyfill from "./lib/polyfill";
polyfill();

import NowPlaying from "./components/NowPlaying";
import ActiveVideoFeed from "./components/ActiveVideoFeed";
import Searchbox from "./components/Searchbox";
// import Backend from './lib/backend.js';

window.React = React;

const App = React.createClass({
  componentWillMount() {
    // Mousetrap.registerKeys(this);
    // backend = new Backend(this.props.url);
    // this.backendConnected = backend.connect();
    // this.backendConnected.then((backend) => {
    //   backend.registerListener('playing/status', this._update_now_playing.bind(this));
    //   backend.call('get_current');
    // });
    // window.backend = backend;
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

export default App