import { connect } from "react-redux"

import * as trackActions from '../actions/trackActions'

import VideoFeed from './VideoFeed'


const mapStateToProps = (state) => ({
  activeFeedId: state.main.show,
  items: state.tracks.items,
  selectedId: state.tracks.selectedId
})

const mapDispatchToProps = (dispatch) => ({
  onUpvote: (track) => dispatch(trackActions.upvoteItem(track)),
  onDownvote: (track) => dispatch(trackActions.downvoteItem(track)),
  onClickItem: (track) => dispatch(trackActions.setFeedNavigate(track.id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoFeed)
