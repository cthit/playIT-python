import { takeEvery } from 'redux-saga'
import { put, call } from 'redux-saga/effects'
import * as searchBoxActions from "./searchBoxActions"
import MediaEndpoints from "../lib/media_endpoints.js";

const endpoints = new MediaEndpoints();

export function* searchSaga() {
  yield* takeEvery(searchBoxActions.SET_SEARCH_QUERY, search)
}

function* search(action) {
  try {
    if (action.activeFeedId === 'playlists' || action.query === "") {
      return;
    }

    const results = yield call(endpoints['search_' + action.searchSource], action.query)

    yield put(searchBoxActions.receiveSearchResults(results))
  } catch (e) {
    throw e
  }
}
