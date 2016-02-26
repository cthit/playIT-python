import { combineReducers, createStore } from 'redux'

import * as mainActions from '../actions/mainActions'
import * as trackActions from '../actions/trackActions'

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

const tracks = (state = [], action) => {
    switch (action.type) {
        case trackActions.TRACK_ADD_NEW:
            return [
                ...state,
                action.track
            ]
        case trackActions.TRACK_UPVOTE:
            return state.map(track => {
                if (track.id === action.track.id) {
                    return {
                        ...track,
                        downvoted: false,
                        upvoted: true
                    }
                } else {
                    return track
                }
            })
        case trackActions.TRACK_DOWNVOTE:
            return state.map(track => {
                if (track.id === action.track.id) {
                    return {
                        ...track,
                        downvoted: true,
                        upvoted: false
                    }
                } else {
                    return track
                }
            })
        case trackActions.TRACK_UPDATE:
            return state.map(track => {
                if (track.id === action.track.id) {
                    return {
                        ...track,
                        ...action.track
                    }
                } else {
                    return track
                }
            })
        case trackActions.TRACK_REMOVE:
            return state.filter(track => track.id !== action.track.id)
        default:
            return state
    }
}

const playlists = (state = [], action) => {
    switch (action.type) {
        default:
            return state
    }
}

const app = combineReducers({
    main,
    tracks,
    playlists
})


export default createStore(app);
