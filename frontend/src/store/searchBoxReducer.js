import * as searchBoxActions from '../actions/searchBoxActions'

export default (state = {source: 'youtube', searchResultVisible: false, searchResults: []}, action) => {
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
          return {
            ...state,
            searchQuery: action.query
          }
        case searchBoxActions.RECEIVE_SEARCH_RESULTS:
          return {
            ...state,
            searchResults: action.results
          }
        default:
            return state
    }
}
