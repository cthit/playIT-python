export const PERFORM_SEARCH = 'PERFORM_SEARCH'
export const SET_SEARCH_SOURCE = 'SET_SEARCH_SOURCE'

export const performSearch = (query) => ({
    type: PERFORM_SEARCH,
    query
})

export const setSearchSource = (source) => ({
    type: SET_SEARCH_SOURCE,
    source
})
