import { connect } from "react-redux"

import * as trackActions from '../actions/trackActions'
import * as playlistActions from '../actions/playlistActions'

import VideoFeed from './VideoFeed'


const mapStateToProps = (state) => ({
  activeFeedId: state.main.show,
  items: state[state.main.show]
})

const mapDispatchToProps = (dispatch, props) => {
  if (props.activeFeedId === 'tracks') {
    return {
      onUpvote: (track) => {
        dispatch(trackActions.upvoteTrack(track))
      },
      onDownvote: (track) => {
        dispatch(trackActions.downvoteTrack(track))
      }
    }
  } else {
    return {
      onUpvote: (playlist) => {
        dispatch(playlistActions.upvotePlaylist(playlist))
      },
      onDownvote: (playlist) => {
        dispatch(playlistActions.downvotePlaylist(playlist))
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoFeed)