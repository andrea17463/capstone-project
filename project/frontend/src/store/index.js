// frontend/src/store/index.js
import { combineReducers } from 'redux';
// import <name-of-reducer-plural>Reducer from './<name-of-model-plural>';
import sessionReducer from './session';
import chatMessagesReducer from './chat-messages';
import gamePlaysReducer from './game-plays';
import userConnectionsReducer from './user-connections';

const rootReducer = combineReducers({
  session: sessionReducer,
  // <name-of-model-plural>: <name-of-reducer-plural>Reducer
  chatmessages: chatMessagesReducer,
  gameplays: gamePlaysReducer,
  userconnections: userConnectionsReducer
});

export default rootReducer;