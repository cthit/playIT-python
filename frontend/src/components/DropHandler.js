import React from 'react'
import mediaEndpoints from "../lib/media_endpoints"

const DropHandler = React.createClass({
  handleDrop(event) {
    event.preventDefault();
    const items = Array.from(event.dataTransfer.items);
    const tracksPromise = items
      .map(droppedItems => new Promise(resolve => droppedItems.getAsString(resolve)));

    Promise.all(tracksPromise)
      .then(([tracksSeparatedByNewline]) => {
        console.log(tracksSeparatedByNewline);
        const tracks = tracksSeparatedByNewline.split('\n');

        tracks.forEach(track => {
          const [trackItem, ...restItems] = mediaEndpoints.urlToMediaItem(track);

          if (trackItem) {
            this.props.addNewItem(trackItem);
          }
        })

      });
  },
  handleDragOver(event) {
    event.preventDefault();
  },
  render() {
    return (
      <div className="drop-zone" onDrop={this.handleDrop}
           onDragOver={this.handleDragOver}>
        {this.props.children}
      </div>
    )
  }
})


export default DropHandler