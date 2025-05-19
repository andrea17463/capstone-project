// frontend/src/store/game-plays.js
import { csrfFetch } from '../utils/csrf';

// Action Types
const START_GAME = 'START_GAME';
const GET_GAME_PLAY = 'GET_GAME_PLAY';
const GET_USER_GAME_PLAYS = 'GET_USER_GAME_PLAYS';
const UPDATE_PROMPT = 'UPDATE_PROMPT';
const DELETE_ALL_GAME_PLAYS = 'DELETE_ALL_GAME_PLAYS';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const SET_GAME = 'SET_GAME';
const SET_SELECTED_TRAIT = 'SET_SELECTED_TRAIT';
const UPDATE_GAME_TRAIT = 'UPDATE_GAME_TRAIT';
const UPDATE_GAME_CORRECTNESS = 'UPDATE_GAME_CORRECTNESS';
const UPDATE_GAME_INTERACTION_TYPE = 'UPDATE_GAME_INTERACTION_TYPE';
const UPDATE_GAME_SUCCESS = 'UPDATE_GAME_SUCCESS';
const GAME_REQUEST_FAILURE = 'GAME_REQUEST_FAILURE';
const SET_CURRENT_GAME = 'SET_CURRENT_GAME';
const RESET_GAME_STATE = 'RESET_GAME_STATE';

// Action Creators
export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const setGame = (game) => ({
  type: SET_GAME,
  game,
});

export const setSelectedTrait = (trait) => ({
  type: SET_SELECTED_TRAIT,
  payload: trait
});

export const setCurrentGame = (game) => ({
  type: SET_CURRENT_GAME,
  payload: game
});

export const resetGameState = () => ({
  type: RESET_GAME_STATE
});

// Thunk Action Creators
export const startGame = ({ user1Id, user2Id }) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const res = await csrfFetch('/api/game-plays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_1_id: user1Id,
        user_2_id: user2Id,
        traitCategory: null,
        traitName: null,
        interactionType: "guessing"
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Game creation failed:', errorData);
      dispatch(setError(errorData?.error || 'Failed to start game'));
      return;
    }

    const data = await res.json();
    dispatch(setGame(data));
    dispatch({
      type: START_GAME,
      payload: data
    });
    return data;
  } catch (error) {
    console.error('Error creating game:', error);
    dispatch(setError(error.message || 'Something went wrong'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const getGamePlay = (gamePlayId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await csrfFetch(`/api/game-plays/${gamePlayId}`);
    if (!res.ok) throw new Error('Failed to fetch game play');

    const data = await res.json();
    dispatch({
      type: GET_GAME_PLAY,
      payload: data
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const getUserGamePlays = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await csrfFetch('/api/game-plays');
    if (!res.ok) throw new Error('Failed to fetch user game plays');

    const data = await res.json();
    dispatch({
      type: GET_USER_GAME_PLAYS,
      payload: data
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updatePrompt = (gamePlayId, promptData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await csrfFetch(`/api/game-plays/${gamePlayId}/prompt`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promptData),
    });

    if (!res.ok) throw new Error('Failed to update prompt');

    const data = await res.json();
    dispatch({
      type: UPDATE_PROMPT,
      payload: data
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteAllGamePlays = (user_1_id, user_2_id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await csrfFetch('/api/game-plays', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_1_id, user_2_id }),
    });

    if (!res.ok) throw new Error('Failed to delete all game plays');

    dispatch({
      type: DELETE_ALL_GAME_PLAYS
    });
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateGameTrait = (gamePlayId, traitData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await csrfFetch(`/api/game-plays/${gamePlayId}/trait`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(traitData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to update game trait: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    dispatch({
      type: UPDATE_GAME_TRAIT,
      payload: data
    });

    dispatch(setGame(data));
  } catch (error) {
    console.error('Error in updateGameTrait:', error);
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateGameCorrectness = (gamePlayId, data) => async (dispatch) => {
  dispatch({ type: UPDATE_GAME_CORRECTNESS });

  try {
    const response = await csrfFetch(`/api/game-plays/${gamePlayId}/correctness`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update game correctness');
    }

    const updatedGame = await response.json();

    dispatch({
      type: UPDATE_GAME_SUCCESS,
      payload: updatedGame,
    });

    return updatedGame;
  } catch (error) {
    dispatch({
      type: GAME_REQUEST_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

export const updateGameInteractionType = (gamePlayId, data) => async (dispatch) => {
  dispatch({ type: UPDATE_GAME_INTERACTION_TYPE });

  try {
    const response = await csrfFetch(`/api/game-plays/${gamePlayId}/interaction-type`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update interaction type');
    }

    const updatedGame = await response.json();

    dispatch({
      type: 'UPDATE_GAME_SUCCESS',
      payload: updatedGame,
    });

    return updatedGame;
  } catch (error) {
    dispatch({
      type: 'GAME_REQUEST_FAILURE',
      payload: error.message,
    });
    throw error;
  }
};

// Initial State
const initialState = {
  gamePlays: [],
  currentGamePlay: null,
  loading: false,
  error: null,
  game: null,
};

// Reducer
const gamePlaysReducer = (state = initialState, action) => {
  // if (!action || typeof action.type !== 'string') return state;
  if (action.type.startsWith('@@redux/')) return state;

  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        gamePlays: [...state.gamePlays, action.payload],
        error: null,
      };
    case GET_GAME_PLAY:
      return {
        ...state,
        currentGamePlay: action.payload,
        error: null,
      };
    case GET_USER_GAME_PLAYS:
      return {
        ...state,
        gamePlays: action.payload,
        game: action.payload[0] || null,
        loading: false,
        error: null,
      };
    case UPDATE_PROMPT:
      return {
        ...state,
        currentGamePlay: {
          ...state.currentGamePlay,
          prompt: action.payload,
        },
        error: null,
      };
    case DELETE_ALL_GAME_PLAYS:
      return {
        ...state,
        gamePlays: [],
        currentGamePlay: null,
        error: null,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case SET_GAME:
      return { ...state, game: action.game };
    case SET_SELECTED_TRAIT:
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          selectedTrait: action.payload
        },
        error: null,
      };
    case UPDATE_GAME_TRAIT: {
      const updatedPayload = action.payload;
      return {
        ...state,
        gamePlays: state.gamePlays.map((gamePlay) =>
          gamePlay.id === updatedPayload.id ? updatedPayload : gamePlay
        ),
        game: state.game && state.game.id === updatedPayload.id
          ? updatedPayload
          : state.game,
        error: null,
      };
    }
    case UPDATE_GAME_CORRECTNESS:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_GAME_INTERACTION_TYPE:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_GAME_SUCCESS:
      return {
        ...state,
        game: action.payload,
        loading: false,
        error: null,
      };
    case GAME_REQUEST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SET_CURRENT_GAME:
      return {
        ...state,
        game: action.payload,
        loading: false,
        error: null
      };
    case RESET_GAME_STATE:
      return {
        ...state,
        game: null,
        gamePlays: [],
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

export default gamePlaysReducer;