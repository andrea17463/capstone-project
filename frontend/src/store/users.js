// frontend/src/store/users.js
import { csrfFetch } from '../store/csrf';

// Action Types
const SET_LOADING = 'user/SET_LOADING';
const SET_ERROR = 'user/SET_ERROR';
const SET_USER = 'user/SET_USER';
const CLEAR_USER = 'user/CLEAR_USER';

// Action Creators
export const setLoading = (isLoading) => ({
    type: SET_LOADING,
    payload: isLoading,
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error,
});

const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

export const clearUser = () => ({
    type: CLEAR_USER,
});

// Thunk Action Creators
export const fetchUser = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await csrfFetch('/api/users', {
            credentials: 'include'
        });

        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        dispatch(setUser(data));
    } catch (err) {
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const createUser = (userData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await csrfFetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!res.ok) throw new Error('Failed to create user');
        const data = await res.json();
        dispatch(setUser({ id: data.userId }));
    } catch (err) {
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const updateUser = (updates) => async (dispatch) => {

    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (!csrfToken) {
        dispatch(setError('Missing CSRF token'));
        return;
    }

    dispatch(setLoading(true));
    try {
        const res = await csrfFetch('/api/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken, },
            credentials: 'include',
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Failed to update profile');
        const data = await res.json();
        dispatch(setUser(data.user));
    } catch (err) {
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const deleteUser = () => async (dispatch) => {

    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (!csrfToken) {
        dispatch(setError('Missing CSRF token'));
        return;
    }

    dispatch(setLoading(true));
    try {
        const res = await csrfFetch('/api/users', {
            method: 'DELETE',
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to delete account');
        dispatch(clearUser());
    } catch (err) {
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Initial State
const initialState = {
    user: null,
    loading: false,
    error: null,
};

// Reducer
const usersReducer = (state = initialState, action) => {
    // if (!action || typeof action.type !== 'string') return state;
    if (action.type.startsWith('@@redux/')) return state;

    switch (action.type) {
        case SET_LOADING:
            return { ...state, loading: action.payload };
        case SET_ERROR:
            return { ...state, error: action.payload };
        case SET_USER:
            return { ...state, user: action.payload, error: null };
        case CLEAR_USER:
            return { ...state, user: null, error: null };
        default:
            return state;
    }
};

export default usersReducer;