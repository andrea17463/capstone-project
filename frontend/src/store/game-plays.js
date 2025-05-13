// frontend/src/store/game-plays.js
import { csrfFetch } from '../utils/csrf';

// Action Types
const START_GAME = 'START_GAME';
const GET_GAME_PLAY = 'GET_GAME_PLAY';
const GET_USER_GAME_PLAYS = 'GET_USER_GAME_PLAYS';
const UPDATE_GUESS = 'UPDATE_GUESS';
const UPDATE_PROMPT = 'UPDATE_PROMPT';
const DELETE_ALL_GAME_PLAYS = 'DELETE_ALL_GAME_PLAYS';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const SET_GAME = 'SET_GAME';

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

// Thunk Action Creators
export const startGame = (gameData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await csrfFetch('/api/game-plays', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData),
        });

        if (!res.ok) throw new Error('Failed to start game');

        const data = await res.json();
        dispatch({
            type: START_GAME,
            payload: data
        });
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const getGamePlay = (gamePlayId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await fetch(`/api/game-plays/${gamePlayId}`);
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
        const res = await fetch('/api/game-plays');
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

export const updateGuess = (gamePlayId, guessResult) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await csrfFetch(`/api/game-plays/${gamePlayId}/guess`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guessResult),
        });

        if (!res.ok) throw new Error('Failed to update guess');

        const data = await res.json();
        dispatch({
            type: UPDATE_GUESS,
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

export const deleteAllGamePlays = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await csrfFetch('/api/game-plays', {
            method: 'DELETE',
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
                error: null,
            };
        case UPDATE_GUESS:
            return {
                ...state,
                gamePlays: state.gamePlays.map((game) =>
                    game._id === action.payload._id ? action.payload : game
                ),
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
        default:
            return state;
    }
};

export default gamePlaysReducer;