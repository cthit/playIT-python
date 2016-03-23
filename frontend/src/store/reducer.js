import { combineReducers } from 'redux'

import * as mainActions from '../actions/mainActions'
import * as trackActions from '../actions/trackActions'

import searchBox from './searchBoxReducer'

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
        case trackActions.TRACK_UPVOTE:
            return state.map(track => {
                if (track.id === action.track.id) {
                    return {
                        ...track,
                        user_vote: 1,
                        value: track.value + (track.user_vote === 0 ? 1 : 2)
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
                        user_vote: -1,
                        value: track.value - (track.user_vote === 0 ? 1 : 2)
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
        case trackActions.TRACK_RECEIVE:
            return [
                ...state,
                {
                  ...action.track,
                  value: action.track.value || 0
                }
            ]
        case trackActions.TRACKS_RECEIVE_SUCCESS:
          return action.tracks.map(track => {
            const oldTrack = state.find(oldTrack => oldTrack.id === track.id)
            if (oldTrack) {
              return {
                ...oldTrack,
                ...track
              }
            } else {
              return track
            }
          })
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

export default combineReducers({
    main,
    tracks,
    playlists,
    searchBox
})
