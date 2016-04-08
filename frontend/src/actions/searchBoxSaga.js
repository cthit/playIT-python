import { takeLatest, takeEvery } from 'redux-saga'
import { put, call } from 'redux-saga/effects'
import * as searchBoxActions from "./searchBoxActions"
import * as trackActions from "./trackActions"
import * as playlistActions from "./trackActions"
import endpoints from "../lib/media_endpoints";

export function* searchSaga() {
  yield* takeLatest(searchBoxActions.SET_SEARCH_QUERY, search)
}

function* search(action) {
  try {
    if (action.activeFeedId === 'playlists' || action.query === "") {
      return;
    }

    const results = yield call(endpoints['search_' + action.searchSource], action.query)

    yield put(searchBoxActions.receiveSearchResults(results))
  } catch (e) {
    if (e.type !== "MANUAL_CANCEL") {
      throw e
    }
  }
}

export function* addVoteSaga() {
  yield* takeEvery(
    [
      trackActions.TRACK_UPVOTE,
      trackActions.TRACK_DOWNVOTE,
      trackActions.PLAYLIST_UPVOTE,
      trackActions.PLAYLIST_DOWNVOTE,
    ]
    , addVote)
}

export function* addItemSaga() {
  yield* takeEvery(
    [
      trackActions.TRACK_ADD_NEW,
      playlistActions.PLAYLIST_ADD_NEW,
    ]
    , addItem)
}

function addVote(action) {
  console.log("action:",action);
  const { item } = action
  backend.call('add_vote', {
    id: item.id,
    vote: action.user_vote,
    type: item.type
  })
}

function* addItem(action) {
  const { item } = action
  backend.call('add_item', {
    ...item
  });
}

export default [searchSaga, addVoteSaga, addItemSaga];
