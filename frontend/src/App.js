
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
    this.state = {
      now_playing: null,
      items: [],
      activeType: 'tracks',
      playlists: [],
      selected: null
    };

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
      activeType: type
    });
  }
  voteItem(value, item = this.currentItem()) {
    backend.call('add_vote', {
      vote: value,
      id: item.external_id,
      type: item.type
    });
  }
  currentItem() {
    let index = this.state.items.findIndex((item) => item.id === this.state.selected)
    return this.state.items[index];
  }
  addItem(mediaItem) {
    let {id, type} = mediaItem;
    backend.call('add_item', {id, type});
  }
  deleteItem() {
    let selectedItem = this.state.items.find((item) => item.id === this.state.selected);
    this.nextItem();

    let items = this.state.items.filter((item) => item.id !== selectedItem.id);
    backend.call('remove_item', {id: selectedItem.external_id, type: selectedItem.type});
    this._update_queue(items);
  }
  prevItem() {
    let index = this.state.items.indexOf(this.currentItem());
    index = Math.max(index - 1, 0);
    this.setItem(this.state.items[index].id);
  }
  nextItem() {
    let index = this.state.items.indexOf(this.currentItem());
    index = Math.min(index + 1, this.state.items.length - 1);
    this.setItem(this.state.items[index].id);
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
  render() {
    return (
      <div>
        <Searchbox addItem={this.addItem.bind(this)} changeQueueType={this._changeQueueType.bind(this)} />
        <VideoFeed active={this.state.activeType === 'playlists'} connected={this.backendConnected} methods={this.methods.playlists} voteItem={this.voteItem.bind(this)} />
        <VideoFeed active={this.state.activeType === 'tracks'} connected={this.backendConnected} methods={this.methods.tracks} voteItem={this.voteItem.bind(this)} />
        <NowPlaying item={this.state.now_playing} />
      </div>
    );
  }
}
