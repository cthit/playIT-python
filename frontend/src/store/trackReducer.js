import { combineReducers } from 'redux'
import _ from 'lodash'

import * as trackActions from '../actions/trackActions'
import * as mainActions from '../actions/mainActions'

export default (state = {items: [], selectedId: -1}, action) => {
    switch (action.type) {
      case trackActions.TRACKS_FEED_NAVIGATE:
          return {
            ...state,
            selectedId: navigateId(state.items, state.selectedId, action.direction)
          }
      case trackActions.TRACKS_FEED_NAVIGATE_SET:
          return {
              ...state,
              selectedId: action.id
          }
      case trackActions.TRACKS_FEED_NAVIGATE_TOP:
          const firstItem = state.items[0]
          return {
            ...state,
            selectedId: (firstItem ? firstItem.id : -1)
          }
      case trackActions.TRACKS_FEED_NAVIGATE_BOTTOM:
          const lastItem = state.items[state.items.length-1]
          return {
            ...state,
            selectedId: (lastItem ? lastItem.id : -1)
          }
      case trackActions.TRACK_RECEIVE_SUCCESS:
          return {
            ...state,
            selectedId: action.item.id,
            items: _.orderBy(reduceItems(state.items, action), ['value', 'created_at'], ['desc', 'asc'])
          }
      case mainActions.SET_NOW_PLAYING:
      case trackActions.TRACK_UPVOTE:
      case trackActions.TRACK_DOWNVOTE:
      case trackActions.TRACK_UPDATE:
      case trackActions.TRACK_REMOVE:
      case trackActions.TRACK_REQUEST_REMOVE:
      case trackActions.TRACK_RECEIVE:
      case trackActions.TRACKS_RECEIVE_SUCCESS:
          return {
            ...state,
            items: _.orderBy(reduceItems(state.items, action), ['value', 'created_at'], ['desc', 'asc'])
          }
      default:
          return state
    }
}

const reduceItems = (state = [], action) => {
    switch (action.type) {
        case trackActions.TRACK_UPVOTE:
            return state.map(track => {
                if (track.id === action.item.id) {
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
                if (track.id === action.item.id) {
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
                if (track.id === action.item.id) {
                    return {
                        ...track,
                        ...action.item
                    }
                } else {
                    return track
                }
            })
        case mainActions.SET_NOW_PLAYING:
          if (!action.item) {
            return state
          }
        case trackActions.TRACK_REQUEST_REMOVE:
        case trackActions.TRACK_REMOVE:
            return state.filter(item => item.id !== action.item.id)
        case trackActions.TRACK_RECEIVE_SUCCESS:
        case trackActions.TRACK_RECEIVE:
            return [
                ...state,
                {
                  ...action.item,
                  value: action.item.value || 0
                }
            ]
        case trackActions.TRACKS_RECEIVE_SUCCESS:
          return action.items.map(item => {
            const oldItem = state.find(item => item.id === item.id)
            if (oldItem) {
              return {
                ...oldItem,
                ...item
              }
            } else {
              return item
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
        console.log("else firstItem: ", firstItem);
        if (firstItem) {
            return firstItem.id
        }
    }
}
