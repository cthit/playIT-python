import React, { Component } from "react";
import VideoItem from "./VideoItem.js";
import firstBy from "../lib/thenby.js";

export default class VideoFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      selected: null
    };
  }
  _update_queue(items) {
    items = items.sort(firstBy('value', -1).thenBy('created_at'));
    this.setState({items: items}, function() {
      if (!this.state.selected && items[0]) {
        this.setState({selected: items[0].id});
      }
    });
  }
  setItem(id) {
    if (id !== this.state.selected) {
      this.setState({selected: id});
    }
  }
  _update_now_playing(currentItem) {
    if (currentItem && currentItem.id && this.props.active) {
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
  componentDidMount() {
    let methods = this.props.methods;
    this.props.connected.then((backend) => {
      backend.registerListener(methods.queue_update, this._update_queue.bind(this));
      backend.registerListener(methods.update, this._update_item.bind(this));
      backend.registerListener('playing/status', this._update_now_playing.bind(this));
      backend.call(methods.get);
    });
  }
  render() {
    let items = this.state.items.map((item) => {
      return (<VideoItem key={item.id} item={item} setItem={this.setItem.bind(this)} voteItem={this.props.voteItem} setSelectedNode={this.setSelectedNode} selected={item.id === this.state.selected} />);
    });
    return (<ol style={{display: this.props.active ? 'block' : 'none'}} className="view-feed">{items}</ol>);
  }
}
