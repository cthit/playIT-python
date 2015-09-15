
import polyfill from './lib/polyfill.js';
polyfill();

import React, { Component } from "react";


import NowPlaying from './components/NowPlaying.js';
import VideoFeed from './components/VideoFeed.js';
import Searchbox from './components/Searchbox';
import Backend from './lib/backend.js';
import Mousetrap from './lib/mousetrap.js';
import firstBy from "./lib/thenby.js";




window.React = React;

var backend;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      now_playing: null,
      items: [],
      queueType: 'tracks',
      playlists: [],
      selected: null
    };
  }

  _update_now_playing(currentItem) {
    this.setState({now_playing: currentItem});
    if (currentItem && currentItem.id) {
      let items = this.state.items.filter((item) => item.id !== currentItem.id);
      this._update_queue(items);
    }
  }
  _update_playlist_queue(queue) {
    this.setState({
      playlists: queue
    });
  }
  _update_item(newItem) {
    let items = this.state.items.map((item) => {
      if (item.id == newItem.id) {
        return newItem;
      } else {
        return item;
      }
    });
    this.setState({items: items});
  }
  _update_queue(items) {
    items = items.sort(firstBy('value').thenBy('created_at'));
    this.setState({items: items}, function() {
      if (!this.state.selected && items[0]) {
        this.setState({selected: items[0].id});
      }
    });
  }
  _changeQueueType(type) {

    this.setState({
      queueType: type
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
  setItem(id) {
    if (id !== this.state.selected) {
      this.setState({selected: id});
    }
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
    backend.connect().then(() => {
      backend.registerListener('playing/status', this._update_now_playing.bind(this));
      backend.registerListener('media_item/update', this._update_item.bind(this));
      backend.registerListener('media_list/queue/update', this._update_playlist_queue.bind(this));
      backend.registerListener('queue/update', this._update_queue.bind(this));
      backend.call('get_queue');
      backend.call('get_current');
      backend.call('get_playlist_queue');
    });
    window.backend = backend;
  }
  render() {
    let items = this.state.queueType === 'tracks' ? this.state.items : this.state.playlists;
    return (
      <div>
        <Searchbox addItem={this.addItem.bind(this)} changeQueueType={this._changeQueueType.bind(this)} />
        <VideoFeed items={items} setItem={this.setItem.bind(this)} selected={this.state.selected} voteItem={this.voteItem.bind(this)} />
        <NowPlaying item={this.state.now_playing} />
      </div>
    );
  }
}
