export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY'
export const SET_SEARCH_RESULT_VISIBILITY = 'SET_SEARCH_RESULT_VISIBILITY'
export const SET_SEARCH_SOURCE = 'SET_SEARCH_SOURCE'
export const RECEIVE_SEARCH_RESULTS = 'RECEIVE_SEARCH_RESULTS'
export const NAVIGATE_DROPDOWN = 'NAVIGATE_DROPDOWN'


export const setSearchQuery = (query, searchSource, activeFeedId) => ({
    type: SET_SEARCH_QUERY,
    query,
    searchSource,
    activeFeedId
})

export const setSearchSource = (source) => ({
    type: SET_SEARCH_SOURCE,
    source
})

export const setSearchResultVisibility = (visible) => ({
    type: SET_SEARCH_RESULT_VISIBILITY,
    visible
})

export const receiveSearchResults = (results) => ({
    type: RECEIVE_SEARCH_RESULTS,
    results
})

export const navigateDropdown = (direction) => ({
    type: NAVIGATE_DROPDOWN,
    direction
})
