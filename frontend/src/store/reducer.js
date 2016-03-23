import { combineReducers } from 'redux'

import * as mainActions from '../actions/mainActions'
import * as trackActions from '../actions/trackActions'

import searchBox from './searchBoxReducer'
import tracks from './trackReducer'
import playlists from './playlistReducer'

const main = (state = { show: 'tracks' }, action) => {
    switch (action.type) {
        case mainActions.SHOW_TRACKS:
            return {
                ...state,
                show: 'tracks'
            }
        case mainActions.SHOW_PLAYLISTS:
            return {
                ...state,
                show: 'playlists'
            }
        case mainActions.SET_NOW_PLAYING:
            return {
                ...state,
                nowPlaying: action.item
            }
        default:
            return state
    }
}

export default combineReducers({
    main,
    tracks,
    playlists,
    searchBox
})
