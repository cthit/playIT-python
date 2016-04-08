import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'

import { searchSaga } from "../actions/searchBoxSaga"
import reducer from './reducer'

const store = createStore(
  reducer,
  undefined,
  compose(
    applyMiddleware(createSagaMiddleware(searchSaga)),
    autoRehydrate(),
    window.devToolsExtension()
  )
);

persistStore(store);

if (module.hot) {
  module.hot.accept(() => {
    const nextReducer = require('./reducer').default;
    store.replaceReducer(nextReducer);
  });
}


export default store
