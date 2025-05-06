// frontend/src/store/selectors.js
import { createSelector } from 'reselect';

const selectChatMessagesState = (state) => state.chatMessages;

export const selectMessages = createSelector(
    [selectChatMessagesState],
    (chatMessages) => chatMessages?.messages || []
);