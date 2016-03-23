import React from "react"
import { connect } from "react-redux"
import Mousetrap from "mousetrap"

import * as trackActions from "../actions/trackActions"
import * as playlistActions from "../actions/playlistActions"

const KeyBindsListener = React.createClass({
    componentDidMount() {
      const activeFeedId = this.props.activeFeedId
      this.setCurrentFeedObject(activeFeedId)

      //Mousetrap.bind('/', (e) => {
      //  document.getElementById('insert_video').focus();
      //  e.preventDefault();
      //});
      //Mousetrap.bind('esc', (e) => {
      //  document.getElementById('insert_video').blur();
      //});
      Mousetrap.bind(['j', 'down'], () => {
        console.log("mousetrap j");
        this.props.dispatch(this.currentFeedObject.feedNavigate(1))
      });
      Mousetrap.bind(['k', 'up'], () => {
        console.log("mousetrap k");
        this.props.dispatch(this.currentFeedObject.feedNavigate(-1))
      });
      Mousetrap.bind(['g g', 'home'], () => {
        console.log("mousetrap g g");
        this.props.dispatch(this.currentFeedObject.feedNavigateTop())
      });
      Mousetrap.bind(['G', 'end'], () => {
        console.log("mousetrap G");
        this.props.dispatch(this.currentFeedObject.feedNavigateBottom())
      });
      //Mousetrap.bind('a', () => {
      //  app.voteItem(1);
      //});
      //Mousetrap.bind('z', () => {
      //  app.voteItem(-1);
      //});
      //Mousetrap.bind(['d d', 'x'], () => {
      //  app.deleteItem();
      //});
    },

    componentWillReceiveProps(props) {
        this.setCurrentFeedObject(props.activeFeedId)
    },

    setCurrentFeedObject(activeFeedId) {
        this.currentFeedObject = activeFeedId === "tracks" ? trackActions : playlistActions
    },

    render() {
      return null
    }
})

export default connect()(KeyBindsListener)
