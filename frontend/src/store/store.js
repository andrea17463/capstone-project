// frontend/src/store/store.js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import sessionReducer from './session';
import chatMessagesReducer from './chat-messages';
import gamePlaysReducer from './game-plays';
import userConnectionsReducer from './user-connections';

const rootReducer = combineReducers({
  session: sessionReducer,
  chatMessages: chatMessagesReducer,
  gamePlays: gamePlaysReducer,
  userConnections: userConnectionsReducer
});

const loggerMiddleware = store => next => action => {
  const result = next(action);
  console.log('New State:', store.getState());
  return result;
};

let enhancer;
if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk, loggerMiddleware);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger, loggerMiddleware));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;