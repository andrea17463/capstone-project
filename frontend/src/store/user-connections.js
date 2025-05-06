// frontend/src/store/user-connections.js
// Action Types
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
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
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const addConnection = (connectionData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await fetch('/api/connections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(connectionData),
        });

        if (!res.ok) throw new Error('Failed to create connection');
        const data = await res.json();
        dispatch({
            type: ADD_CONNECTION,
            payload: data
        });
    } catch (err) {
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const updateConnectionStatus = (connectionId, status) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await fetch(`/api/connections/${connectionId}/status`, {
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
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const updateMeetingStatus = (connectionId, meetingStatus) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await fetch(`/api/connections/${connectionId}/meeting`, {
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
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const updateFeedback = (connectionId, feedback) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await fetch(`/api/connections/${connectionId}/feedback`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feedback }),
        });

        if (!res.ok) throw new Error('Failed to update feedback');
        const data = await res.json();
        dispatch({
            type: UPDATE_CONNECTION_FEEDBACK,
            payload: data
        });
    } catch (err) {
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const removeConnection = (connectionId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await fetch(`/api/connections/${connectionId}`, {
            method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete connection');
        dispatch({
            type: DELETE_CONNECTION,
            payload: connectionId
        });
    } catch (err) {
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
        case GET_CONNECTIONS:
            return { ...state, connections: action.payload, error: null };
        case ADD_CONNECTION:
            return { ...state, connections: [...state.connections, action.payload] };
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