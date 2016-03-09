import * as searchBoxActions from '../actions/searchBoxActions'

export default (state = {source: 'youtube', searchResultVisible: false}, action) => {
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
        default:
            return state
    }
}
