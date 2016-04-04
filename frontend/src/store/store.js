import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'

import { searchSaga } from "../actions/searchBoxSaga"
import reducer from './reducer'



var theComposedThing=undefined;
if(window.devToolsExtension){
  theComposedThing=compose(
    applyMiddleware(createSagaMiddleware(searchSaga)),
    autoRehydrate(),
    window.devToolsExtension()
  )
}else{
  theComposedThing=compose(
    applyMiddleware(createSagaMiddleware(searchSaga)),
    autoRehydrate()
  )

}

const store = createStore(
  reducer,
  undefined,
  theComposedThing
);
persistStore(store)
export default store
