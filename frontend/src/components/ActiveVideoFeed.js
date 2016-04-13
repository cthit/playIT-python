import { connect } from "react-redux"

import * as trackActions from '../actions/trackActions'
import * as playlistActions from '../actions/playlistActions'

import VideoFeed from './VideoFeed'


const mapStateToProps = (state) => ({
  activeFeedId: state.main.show,
  items: state[state.main.show].items,
  selectedId: state[state.main.show].selectedId || -1
})

const mapDispatchToProps = (dispatch) => ({
  tracks: {
    onUpvote: (track) => dispatch(trackActions.upvoteItem(track)),
    onDownvote: (track) => dispatch(trackActions.downvoteItem(track)),
    onClickItem: (track) => dispatch(trackActions.setFeedNavigate(track.id))
  },
  playlists: {
    onUpvote: (playlist) => dispatch(playlistActions.upvoteItem(playlist)),
    onDownvote: (playlist) => dispatch(playlistActions.downvoteItem(playlist)),
    onClickItem: (playlist) => dispatch(playlistActions.setFeedNavigate(playlist.id))
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps[stateProps.activeFeedId]
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(VideoFeed)
