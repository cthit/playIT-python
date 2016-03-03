import * as searchBoxActions from '../actions/searchBoxActions'

export default (state = {source: 'youtube'}, action) => {
    switch (action.type) {
        case searchBoxActions.SET_SEARCH_SOURCE:
          return {
            ...state,
            source: action.source
          }
        default:
            return state
    }
}
