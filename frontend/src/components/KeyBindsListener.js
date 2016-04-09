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
        this.props.dispatch(this.currentFeedObject.feedNavigate(1))
      });
      Mousetrap.bind(['k', 'up'], () => {
        this.props.dispatch(this.currentFeedObject.feedNavigate(-1))
      });
      Mousetrap.bind(['g g', 'home'], () => {
        this.props.dispatch(this.currentFeedObject.feedNavigateTop())
      });
      Mousetrap.bind(['G', 'end'], () => {
        this.props.dispatch(this.currentFeedObject.feedNavigateBottom())
      });
      Mousetrap.bind('a', () => {
        if(this.props.selectedItem.user_vote !== 1) {
          this.props.dispatch(this.currentFeedObject.upvoteItem(this.props.selectedItem))
        }
      });
      Mousetrap.bind('z', () => {
        if(this.props.selectedItem.user_vote !== -1) {
          this.props.dispatch(this.currentFeedObject.downvoteItem(this.props.selectedItem))
        }
      });
      Mousetrap.bind('d d', () => {
        this.props.dispatch(this.currentFeedObject.requestRemoveItem(this.props.selectedItem))
      });
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

const mapStateToProps = state => {
  const activeFeedId = state.main.show
  const selectedId = state[activeFeedId].selectedId

  return {
    activeFeedId,
    selectedItem: state[activeFeedId].items.find(item => item.id === selectedId)
  }
}

export default connect(mapStateToProps)(KeyBindsListener)
