// frontend/src/store/chat-messages.js
// Action Types
const SEND_MESSAGE = 'SEND_MESSAGE';
const GET_MESSAGES = 'GET_MESSAGES';
const EDIT_MESSAGE = 'EDIT_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';
const GET_CHAT_HISTORY = 'GET_CHAT_HISTORY';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

// Action Creators
export const setLoading = (isLoading) => ({
    type: SET_LOADING,
    payload: isLoading
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error
});

// Thunk Action Creators
export const sendMessage = (messageData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData),
        });

        if (!response.ok) throw new Error('Failed to send message');

        const data = await response.json();
        dispatch({
            type: SEND_MESSAGE,
            payload: data
        });
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const getMessages = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await fetch('/api/messages');

        if (!response.ok) throw new Error('Failed to fetch messages');

        const data = await response.json();
        dispatch({
            type: GET_MESSAGES,
            payload: data
        });
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const getChatHistory = (userId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await fetch(`api/messages/${userId}`);

        if (!response.ok) throw new Error('Failed to get chat history');

        const data = await response.json();
        dispatch({
            type: GET_CHAT_HISTORY,
            payload: data
        });
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const editMessage = (messageId, updatedMessage) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await fetch(`api/messages/${messageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMessage),
        });

        if (!response.ok) throw new Error('Failed to edit message');

        const data = await response.json();
        dispatch({
            type: EDIT_MESSAGE,
            payload: data
        });
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const deleteMessage = (messageId, userId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await fetch(`/api/messages/${messageId}/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete message');

        dispatch({
            type: DELETE_MESSAGE,
            payload: messageId
        });
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Initial State
const initialState = {
    messages: [],
    chatHistory: [],
    loading: false,
    error: null,
};

// Reducer
const chatMessagesReducer = (state = initialState, action) => {
    // if (!action || typeof action.type !== 'string') return state;
    if (action.type.startsWith('@@redux/')) return state;

    switch (action.type) {
        case SEND_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload],
                error: null,
            };
        case GET_MESSAGES:
            return {
                ...state,
                messages: action.payload,
                error: null,
            };
        case GET_CHAT_HISTORY:
            return {
                ...state,
                chatHistory: action.payload,
                error: null,
            };
        case EDIT_MESSAGE:
            return {
                ...state,
                messages: state.messages.map((msg) =>
                    msg._id === action.payload._id ? action.payload : msg
                ),
                error: null,
            };
        case DELETE_MESSAGE:
            return {
                ...state,
                messages: state.messages.filter((msg) => msg._id !== action.payload),
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
        default:
            return state;
    }
};

export default chatMessagesReducer;