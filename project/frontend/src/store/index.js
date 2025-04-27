import { combineReducers } from 'redux';
// import <name-of-reducer-plural>Reducer from './<name-of-model-plural>';
import sessionReducer from './session';

const rootReducer = combineReducers({
  session: sessionReducer
  // ,
  // <name-of-model-plural>: <name-of-reducer-plural>Reducer
});

export default rootReducer;