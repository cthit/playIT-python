import React from "react";

var NowPlaying = React.createClass({
  render() {
    let item = this.props.item;
    if (!item) {
      return (<div><span>Nothing playing right now...</span></div>);
    } else {
      return (
        <div>
          <span title={item.nick}>Now playing: <a href={'item.url'}>{item.title}</a> [{item.duration}] - {item.author}</span>
        </div>
      );
    }
  }
});

export default NowPlaying;
