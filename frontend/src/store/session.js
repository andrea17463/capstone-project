// // frontend/src/store/session.js
import { csrfFetch } from './csrf';

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

// Action Creators
export const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

export const removeUser = () => ({
  type: REMOVE_USER
});

// Thunk Action Creators

// Login Functionality
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  try {
    const response = await csrfFetch("/session", {
      method: "POST",
      body: JSON.stringify({ credential, password })
      ,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return { error: error.message };
  }
};

export const restoreUser = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/session");
    if (!response.ok) throw new Error('Failed to restore user session');
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } catch (error) {
    console.error('Restore user session error:', error);
    return { error: error.message };
  }
};

// Signup Functionality
export const signup = (user) => async (dispatch) => {
  const { username, fullName, email, password } = user;
  try {
    const response = await csrfFetch("/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        fullName,
        email,
        password
      })
    });

    if (!response.ok) throw new Error('Signup failed');
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return { error: error.message };
  }
};

// Logout Functionality
export const logout = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/session', {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Logout failed');
    dispatch(removeUser());
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return { error: error.message };
  }
};

// Initial State
const initialState = { user: null };

// SESSION REDUCER
const sessionReducer = (state = initialState, action) => {
  console.log("Received action in sessionReducer:", action);
  // if (!action || typeof action.type !== 'string') return state;
  if (action.type.startsWith('@@redux/')) return state;

  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;