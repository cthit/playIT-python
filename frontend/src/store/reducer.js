import { combineReducers } from 'redux'

import * as mainActions from '../actions/mainActions'
import * as trackActions from '../actions/trackActions'

import searchBox from './searchBoxReducer'
import tracks from './trackReducer'

export const main = (state = { show: 'tracks', connected: false, nowPlaying: null }, action) => {
    switch (action.type) {
        case mainActions.SET_CONNECTED:
            return {
                ...state,
                connected: true
            }
        case mainActions.SET_DISCONNECTED:
            return {
                ...state,
                connected: false
            }
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
    searchBox
})
