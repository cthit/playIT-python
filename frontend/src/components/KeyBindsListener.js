import React from "react"
import { connect } from "react-redux"
import Mousetrap from "mousetrap"

import * as trackActions from "../actions/trackActions"

const KeyBindsListener = React.createClass({
    componentDidMount() {
      //Mousetrap.bind('/', (e) => {
      //  document.getElementById('insert_video').focus();
      //  e.preventDefault();
      //});
      //Mousetrap.bind('esc', (e) => {
      //  document.getElementById('insert_video').blur();
      //});
      Mousetrap.bind(['j', 'down'], () => {
        this.props.dispatch(trackActions.feedNavigate(1))
      });
      Mousetrap.bind(['k', 'up'], () => {
        this.props.dispatch(trackActions.feedNavigate(-1))
      });
      Mousetrap.bind(['g g', 'home'], () => {
        this.props.dispatch(trackActions.feedNavigateTop())
      });
      Mousetrap.bind(['G', 'end'], () => {
        this.props.dispatch(trackActions.feedNavigateBottom())
      });
      Mousetrap.bind('a', () => {
        if(this.props.selectedItem.user_vote !== 1) {
          this.props.dispatch(trackActions.upvoteItem(this.props.selectedItem))
        }
      });
      Mousetrap.bind('z', () => {
        if(this.props.selectedItem.user_vote !== -1) {
          this.props.dispatch(trackActions.downvoteItem(this.props.selectedItem))
        }
      });
      Mousetrap.bind('d d', () => {
        this.props.dispatch(trackActions.requestRemoveItem(this.props.selectedItem))
      });
    },

    render() {
      return null
    }
})

const mapStateToProps = state => {
  const selectedId = state.tracks.selectedId

  return {
    selectedItem: state.tracks.items.find(item => item.id === selectedId)
  }
}

export default connect(mapStateToProps)(KeyBindsListener)
