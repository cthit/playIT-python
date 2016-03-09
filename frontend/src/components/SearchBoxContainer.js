import { connect } from "react-redux"

import * as mainActions from '../actions/mainActions'
import * as searchBoxActions from '../actions/searchBoxActions'

import Searchbox from './Searchbox'


const mapStateToProps = (state) => ({
  searchSource: state.searchBox.source,
  searchResultVisible: state.searchBox.searchResultVisible,
  searchQuery: state.searchBox.searchQuery,
  searchResults: state.searchBox.searchResults
})

const mapDispatchToProps = (dispatch, props) => {
  const actions = {
    setShowResults: (visible) => dispatch(searchBoxActions.setSearchResultVisibility(visible)),
    onSelectSource: (source) => dispatch(searchBoxActions.setSearchSource(source)),
    setSearchQuery: (query, searchSource) => dispatch(searchBoxActions.setSearchQuery(query, searchSource, props.activeFeedId))
  }
  if (props.activeFeedId === 'tracks') {
    return {
      ...actions,
      onToggleButton: () => dispatch(mainActions.showPlaylists())
    }
  } else {
    return {
      ...actions,
      onToggleButton: () => dispatch(mainActions.showTracks())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Searchbox)
