require("./polyfill.js")();
import React from "react";
import NowPlaying from "./components/now_playing.jsx";
import VideoFeed from "./components/video_feed.jsx";
import Backend from "./backend.js";
import Mousetrap from "./mousetrap.js";

window.React = React;

var backend = null;

var PlayIT = React.createClass({
  getInitialState() {
    return {
      now_playing: null,
      items: [],
      selected: null
    };
  },
  _update_now_playing(item) {
    this.setState({now_playing: item});
  },
  _update_item(newItem) {
    let items = this.state.items.map((item) => {
      if (item.id == newItem.id) {
        return newItem;
      } else {
        return item;
      }
    });
    this.setState({items: items});
  },
  _update_queue(items) {
    this.setState({items: items});
    if (!this.state.selected) {
      this.setState({selected: items[0].id});
    }
  },
  voteItem(value, item = this.currentItem()) {
    backend.call('add_vote', {
      vote: value,
      id: item.external_id,
      type: item.type
    });
  },
  currentItem() {
    let index = this.state.items.findIndex((item) => item.id === this.state.selected)
    return this.state.items[index];
  },
  setItem(id) {
    if (id !== this.state.selected) {
      this.setState({selected: id});
    }
  },
  prevItem() {
    let index = this.state.items.indexOf(this.currentItem());
    index = Math.max(index - 1, 0);
    this.setItem(this.state.items[index].id);
  },
  nextItem() {
    let index = this.state.items.indexOf(this.currentItem());
    index = Math.min(index + 1, this.state.items.length - 1);
    this.setItem(this.state.items[index].id);
  },
  componentWillMount() {
    Mousetrap.registerKeys(this);
    backend = new Backend(this.props.url, () => {

      backend.registerListener('playing/status', this._update_now_playing);
      backend.registerListener('media_item/update', this._update_item);
      backend.registerListener('queue/update', this._update_queue);
      backend.call('get_queue');
      backend.call('get_current');
    });
  },
  render() {
    return (
      <div>
        <NowPlaying item={this.state.now_playing} />
        <header>
          <search/>
        </header>
        <div>
          <alert></alert>
        </div>
        <VideoFeed items={this.state.items} setItem={this.setItem} selected={this.state.selected} playIT={this} />
      </div>
    );
  }
});

React.render(<PlayIT url="ws://10.1.0.6:8888/ws/action"/>, document.body);
