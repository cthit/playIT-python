import { combineReducers } from 'redux'

import * as playlistActions from '../actions/playlistActions'

export default (state = {items: [], selectedId: null}, action) => {
    switch (action.type) {
      case playlistActions.PLAYLISTS_FEED_NAVIGATE:
          return {
            ...state,
            selectedId: navigateId(state.items, state.selectedId, action.direction)
          }
      case playlistActions.PLAYLISTS_FEED_NAVIGATE_SETSET:
          return {
              ...state,
              selectedId: action.playlistId
          }
      case playlistActions.PLAYLISTS_FEED_NAVIGATE_TOP:
          const firstItem = state.items[0]
          return {
            ...state,
            selectedId: (firstItem ? firstItem.id : null)
          }
      case playlistActions.PLAYLISTS_FEED_NAVIGATE_BOTTOM:
          const lastItem = state.items[state.items.length-1]
          return {
            ...state,
            selectedId: (lastItem ? lastItem.id : null)
          }
      case playlistActions.PLAYLIST_UPVOTE:
      case playlistActions.PLAYLIST_DOWNVOTE:
      case playlistActions.PLAYLIST_UPDATE:
      case playlistActions.PLAYLIST_REMOVE:
      case playlistActions.PLAYLIST_REQUEST_REMOVE:
      case playlistActions.PLAYLIST_RECEIVE:
      case playlistActions.PLAYLISTS_RECEIVE_SUCCESS:
          return {
            ...state,
            items: reduceItems(state.items, action)
        }
      default:
          return state
    }
}

const reduceItems = (state = [], action) => {
    switch (action.type) {
        case playlistActions.PLAYLIST_UPVOTE:
            return state.map(playlist => {
                if (playlist.id === action.playlist.id) {
                    return {
                        ...playlist,
                        user_vote: 1,
                        value: playlist.value + (playlist.user_vote === 0 ? 1 : 2)
                    }
                } else {
                    return playlist
                }
            })
        case playlistActions.PLAYLIST_DOWNVOTE:
            return state.map(playlist => {
                if (playlist.id === action.playlist.id) {
                    return {
                        ...playlist,
                        user_vote: -1,
                        value: playlist.value - (playlist.user_vote === 0 ? 1 : 2)
                    }
                } else {
                    return playlist
                }
            })
        case playlistActions.PLAYLIST_UPDATE:
            return state.map(playlist => {
                if (playlist.id === action.playlist.id) {
                    return {
                        ...playlist,
                        ...action.playlist
                    }
                } else {
                    return playlist
                }
            })
        case playlistActions.PLAYLIST_REQUEST_REMOVE:
        case playlistActions.PLAYLIST_REMOVE:
            return state.filter(playlist => playlist.id !== action.playlist.id)
        case playlistActions.PLAYLIST_RECEIVE:
            return [
                ...state,
                {
                  ...action.playlist,
                  value: action.playlist.value || 0
                }
            ]
        case playlistActions.PLAYLISTS_RECEIVE_SUCCESS:
          return action.playlists.map(playlist => {
            const oldTrack = state.find(oldTrack => oldTrack.id === playlist.id)
            if (oldTrack) {
              return {
                ...oldTrack,
                ...playlist
              }
            } else {
              return playlist
            }
          })
        default:
            return state
    }
}

const navigateId = (items, selectedId, direction) => {
    const itemIndex = items.findIndex((item) => item.id === selectedId)
    if (itemIndex !== -1) {
        const nextItem = items[itemIndex + direction]
        if (nextItem) {
          return nextItem.id
        } else {
          return selectedId
        }
    } else {
        const firstItem = items[0]
        if (firstItem) {
            return firstItem.id
        }
    }
}
