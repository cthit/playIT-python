import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'

import reducer from './reducer'

const store = createStore(
  reducer,
  undefined,
  compose(
    autoRehydrate(),
    window.devToolsExtension ? window.devToolsExtension() : undefined
  )
);
persistStore(store)
export default store
