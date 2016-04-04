import * as searchBoxActions from '../actions/searchBoxActions'
import * as trackActions from '../actions/trackActions'
import * as playlistActions from '../actions/playlistActions'

const initialState = {
  source: 'youtube',
  searchResultVisible: false,
  searchResults: [],
  dropdownIndex: 0
}
export default (state = initialState, action) => {
    switch (action.type) {
        case searchBoxActions.SET_SEARCH_SOURCE:
          return {
            ...state,
            source: action.source
          }
        case searchBoxActions.SET_SEARCH_RESULT_VISIBILITY:
          return {
            ...state,
            searchResultVisible: action.visible
          }
        case searchBoxActions.SET_SEARCH_QUERY:
          let searchResults = state.searchResults
          let searchResultsVisible = true
          if (action.query.trim() === "") {
            searchResults = []
            searchResultsVisible = false
          }
          return {
            ...state,
            searchQuery: action.query,
            searchResults,
            searchResultsVisible
          }
        case searchBoxActions.RECEIVE_SEARCH_RESULTS:
          return {
            ...state,
            searchResults: action.results
          }
        case searchBoxActions.NAVIGATE_DROPDOWN:
          let newValue = state.dropdownIndex + action.direction
          newValue %= state.searchResults.length
          if (newValue < 0) {
            newValue = newValue + state.searchResults.length
          }
          return {
            ...state,
            dropdownIndex: newValue
          }
        case trackActions.TRACK_ADD_NEW: case playlistActions.PLAYLIST_ADD_NEW:
          return {
            ...initialState,
            source: state.source
          }
        default:
            return state
    }
}
