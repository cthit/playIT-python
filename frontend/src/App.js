
import polyfill from './lib/polyfill.js';
polyfill();

import React, { Component } from "react";


import NowPlaying from './components/NowPlaying.js';
import VideoFeed from './components/VideoFeed.js';
import Searchbox from './components/Searchbox';
import Backend from './lib/backend.js';
import Mousetrap from './lib/mousetrap.js';




window.React = React;

var backend;

export default class App extends Component {
  constructor(props) {
    super(props);
    let defaultType = 'tracks';
    this.state = {
      now_playing: null,
      items: [],
      activeType: defaultType,
      activeFeed: null,
      playlists: [],
      selected: null
    };

    this.myItems = [];

    this.methods = {
      tracks: {
        queue_update: 'queue/update',
        update: 'media_item/update',
        get: 'get_queue'
      },
      playlists: {
        queue_update: 'media_list/queue/update',
        update: 'media_list/update',
        get: 'get_playlist_queue'
      }
    };

  }

  _update_now_playing(currentItem) {
    this.setState({now_playing: currentItem});
  }
  _update_playlist_queue(queue) {
    this.setState({
      playlists: queue
    });
  }
  _changeQueueType(type) {
    console.log('change type to', type);
    this.setState({
      activeType: type,
      activeFeed: this.refs[type]
    });
  }
  voteItem(value, item = this.currentItem()) {
    backend.call('add_vote', {
      vote: value,
      id: item.external_id,
      type: item.type
    });
    this.state.activeFeed.voteItem(item);
  }
  currentItem() {
    return this.state.activeFeed.currentItem();
  }
  addItem(mediaItem) {
    this.myItems.push(mediaItem);
    let {id, type} = mediaItem;
    backend.call('add_item', {id, type});
  }
  deleteItem() {
    let selectedItem = this.state.activeFeed.deleteItem();
    backend.call('remove_item', {id: selectedItem.external_id, type: selectedItem.type});
  }
  prevItem() {
    this.state.activeFeed.prevItem();
  }
  nextItem() {
    this.state.activeFeed.nextItem();
  }
  componentWillMount() {
    Mousetrap.registerKeys(this);
    backend = new Backend(this.props.url);
    this.backendConnected = backend.connect();
    this.backendConnected.then((backend) => {
      backend.registerListener('playing/status', this._update_now_playing.bind(this));
      backend.call('get_current');
    });
    window.backend = backend;
  }
  componentDidMount() {
    this.setState({
      activeFeed: this.refs[this.state.activeType]
    });
  }
  render() {
    return (
      <div className="root">
        <Searchbox addItem={this.addItem.bind(this)} changeQueueType={this._changeQueueType.bind(this)} />
        <VideoFeed active={this.state.activeType === 'playlists'} ref="playlists" connected={this.backendConnected} myItems={this.myItems} methods={this.methods.playlists} voteItem={this.voteItem.bind(this)} />
        <VideoFeed active={this.state.activeType === 'tracks'} ref="tracks" connected={this.backendConnected} myItems={this.myItems} methods={this.methods.tracks} voteItem={this.voteItem.bind(this)} />
        <NowPlaying item={this.state.now_playing} />
      </div>
    );
  }
}
