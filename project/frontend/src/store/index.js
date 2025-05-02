// frontend/src/store/index.js
import { combineReducers } from 'redux';
import sessionReducer from './session';
import chatMessagesReducer from './chat-messages';
import gamePlaysReducer from './game-plays';
import userConnectionsReducer from './user-connections';

const rootReducer = combineReducers({
  session: sessionReducer,
  chatmessages: chatMessagesReducer,
  gameplays: gamePlaysReducer,
  userconnections: userConnectionsReducer
});

export default rootReducer;