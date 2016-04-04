import { connect } from "react-redux"
import _ from 'lodash'

import * as trackActions from '../actions/trackActions'
import * as playlistActions from '../actions/playlistActions'

import VideoFeed from './VideoFeed'


const mapStateToProps = (state) => ({
  activeFeedId: state.main.show,
  items: _.orderBy(state[state.main.show].items, ["value", "created_at"], ['desc', 'asc']),
  selectedId: state[state.main.show].selectedId
})

const mapDispatchToProps = (dispatch) => ({
  tracks: {
    onUpvote: (track) => dispatch(trackActions.upvoteTrack(track)),
    onDownvote: (track) => dispatch(trackActions.downvoteTrack(track)),
    onClickItem: (track) => dispatch(trackActions.setFeedNavigate(track.id))
  },
  playlists: {
    onUpvote: (playlist) => dispatch(playlistActions.upvotePlaylist(playlist)),
    onDownvote: (playlist) => dispatch(playlistActions.downvotePlaylist(playlist)),
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
