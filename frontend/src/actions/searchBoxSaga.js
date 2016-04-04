import { takeLatest } from 'redux-saga'
import { put, call } from 'redux-saga/effects'
import * as searchBoxActions from "./searchBoxActions"
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
