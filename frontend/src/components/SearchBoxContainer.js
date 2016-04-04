import { connect } from "react-redux"
import * as playlistActions from "../actions/playlistActions"
import * as trackActions from "../actions/trackActions"
import * as mainActions from '../actions/mainActions'
import * as searchBoxActions from '../actions/searchBoxActions'

import Searchbox from './Searchbox'


const mapStateToProps = (state) => ({
  activeFeedId: state.main.show,
  searchSource: state.searchBox.source,
  searchResultVisible: state.searchBox.searchResultVisible,
  searchQuery: state.searchBox.searchQuery,
  searchResults: state.searchBox.searchResults,
  dropdownIndex: state.searchBox.dropdownIndex
})

const mapDispatchToProps = (dispatch) => {
  const tracks = {
    onToggleButton: () => dispatch(mainActions.showPlaylists()),
    submitMedia: (track) => dispatch(trackActions.addNewTrack(track))
  }
  const playlists = {
    onToggleButton: () => dispatch(mainActions.showTracks()),
    submitMedia: (playlist) => dispatch(playlistActions.addNewPlaylist(playlist))
  }

  return {
    playlists,
    tracks,
    setShowResults: (visible) => dispatch(searchBoxActions.setSearchResultVisibility(visible)),
    onSelectSource: (source) => dispatch(searchBoxActions.setSearchSource(source)),
    setSearchQuery: (query, searchSource, activeFeedId) => dispatch(searchBoxActions.setSearchQuery(query, searchSource, activeFeedId)),
    navigateDropdown: (direction) => dispatch(searchBoxActions.navigateDropdown(direction))
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  ...dispatchProps[stateProps.activeFeedId],
  setSearchQuery: (query, searchSource) => dispatchProps.setSearchQuery(query, searchSource, stateProps.activeFeedId),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Searchbox)
