
// require("./polyfill.js")();
import React, { Component } from "react";


import NowPlaying from "./components/NowPlaying.js";
import VideoFeed from "./components/VideoFeed.js";
import Searchbox from "./components/Searchbox";
// import Backend from "./backend.js";
// import Mousetrap from "./mousetrap.js";
// import firstBy from "./thenby.js";




window.React = React;

var backend;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      now_playing: null,
      items: [],
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
    // Mousetrap.registerKeys(this);
    // backend = new Backend(this.props.url);
    // backend.connect().then(() => {

      // backend.registerListener('playing/status', this._update_now_playing);
      // backend.registerListener('media_item/update', this._update_item);
      // backend.registerListener('queue/update', this._update_queue);
      // backend.call('get_queue');
      // backend.call('get_current');
    // });
    // window.backend = backend;
  }
  render() {
    return (
      <div>
        <Searchbox addItem={this.addItem} />
        <VideoFeed items={this.state.items} setItem={this.setItem} selected={this.state.selected} playIT={this} />
        <NowPlaying item={this.state.now_playing} />
      </div>
    );
  }
}