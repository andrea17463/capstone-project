// frontend/src/store/user-connections.js
import { csrfFetch } from '../utils/csrf';

// Action Types
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const GET_CONNECTION = 'GET_CONNECTION';
const GET_CONNECTIONS = 'GET_CONNECTIONS';
const ADD_CONNECTION = 'ADD_CONNECTION';
const UPDATE_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS';
const UPDATE_MEETING_STATUS = 'UPDATE_MEETING_STATUS';
const UPDATE_CONNECTION_FEEDBACK = 'UPDATE_CONNECTION_FEEDBACK';
const DELETE_CONNECTION = 'DELETE_CONNECTION';

// Action Creators
export const setLoading = (loading) => ({
    type: SET_LOADING,
    payload: loading,
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error,
});

// Thunk Action Creators
export const getConnection = (userId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await csrfFetch(`/api/connections/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch connection');
        const data = await res.json();
        dispatch({
            type: GET_CONNECTION,
            payload: data,
        });
        console.log('Fetched connection data:', data);
    } catch (err) {
        console.error('Error:', err);
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const fetchAllConnections = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await fetch('/api/connections');
        if (!res.ok) throw new Error('Failed to fetch connections');
        const data = await res.json();
        dispatch({
            type: GET_CONNECTIONS,
            payload: data
        });
    } catch (err) {
        console.error('Error:', err);
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const addConnection = (connectionData, onError) => async (dispatch, getState) => {
    const state = getState();
    const currentUserId = state.session?.user?.id;

    if (!currentUserId) {
        const errorMsg = "User is not logged in.";
        if (onError) onError(errorMsg);
        console.error(errorMsg);
        return;
    }

    try {
        const { user2Id, suggestedActivity, meetingTime } = connectionData;
        const res = await csrfFetch('/api/connections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user2Id, suggestedActivity, meetingTime }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            const errorMsg = errorData.message || 'Failed to add connection.';
            if (onError) onError(errorMsg);
            console.error(errorMsg);
            return;
        }

        const newConnection = await res.json();
        dispatch({ type: ADD_CONNECTION, payload: newConnection });
        dispatch(getConnection(user2Id));

    } catch (err) {
        const errorMsg = err.message || 'A connection now exists.';
        if (onError) onError(errorMsg);
        console.error(errorMsg);
    }
};

export const updateConnectionStatus = (connectionId, status) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await csrfFetch(`/api/connections/${connectionId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (!res.ok) throw new Error('Failed to update connection status');
        const data = await res.json();
        dispatch({
            type: UPDATE_CONNECTION_STATUS,
            payload: data
        });
    } catch (err) {
        console.error('Error:', err);
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const updateMeetingStatus = (connectionId, meetingStatus) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await csrfFetch(`/api/connections/${connectionId}/meeting`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ meetingStatus }),
        });

        if (!res.ok) throw new Error('Failed to update meeting status');
        const data = await res.json();
        dispatch({
            type: UPDATE_MEETING_STATUS,
            payload: data
        });
    } catch (err) {
        console.error('Error:', err);
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const updateFeedback = (connectionId, feedback) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await csrfFetch(`/api/connections/${connectionId}/feedback`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ meetAgain: feedback }),
        });

        if (!res.ok) throw new Error('Failed to update feedback');
        const data = await res.json();
        console.log('Updated connection:', data);
        dispatch({
            type: UPDATE_CONNECTION_FEEDBACK,
            payload: data
        });
    } catch (err) {
        console.error('Error:', err);
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const removeConnection = (connectionId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await csrfFetch(`/api/connections/${connectionId}`, {
            method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete connection');
        dispatch({
            type: DELETE_CONNECTION,
            payload: connectionId
        });
    } catch (err) {
        console.error('Error:', err);
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Initial State
const initialState = {
    connections: [],
    loading: false,
    error: null,
};

// Reducer
const userConnectionsReducer = (state = initialState, action) => {
    // if (!action || typeof action.type !== 'string') return state;
    if (action.type.startsWith('@@redux/')) return state;

    switch (action.type) {
        case SET_LOADING:
            return { ...state, loading: action.payload };
        case SET_ERROR:
            return { ...state, error: action.payload };
        case GET_CONNECTION: {
            const exists = state.connections.find(conn => conn.id === action.payload.id);
            return {
                ...state,
                connections: exists
                    ? state.connections.map(conn =>
                        conn.id === action.payload.id ? action.payload : conn
                    )
                    : [...state.connections, action.payload],
            };
        }
        case GET_CONNECTIONS:
            console.log('Received GET_CONNECTION action payload:', action.payload);
            return { ...state, connections: action.payload, error: null };
        case ADD_CONNECTION:
            return {
                ...state,
                connections: [
                    ...state.connections.filter(conn => conn.id !== action.payload.id),
                    action.payload
                ]
            };
        case UPDATE_CONNECTION_STATUS:
            return {
                ...state,
                connections: state.connections.map((conn) =>
                    conn.id === action.payload.id ? action.payload : conn
                ),
            };
        case UPDATE_MEETING_STATUS:
            return {
                ...state,
                connections: state.connections.map((conn) =>
                    conn.id === action.payload.id ? action.payload : conn
                ),
            };
        case UPDATE_CONNECTION_FEEDBACK:
            return {
                ...state,
                connections: state.connections.map((conn) =>
                    conn.id === action.payload.id ? action.payload : conn
                ),
            };
        case DELETE_CONNECTION:
            return {
                ...state,
                connections: state.connections.filter(
                    (conn) => conn.id !== action.payload
                ),
            };
        default:
            return state;
    }
};

export default userConnectionsReducer;