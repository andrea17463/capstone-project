import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  addIncomingMessage
} from '../../store/chat-messages';
import { selectMessages } from '../../store/selectors';
// import useExtractCookiesCsrfToken from '../../hooks/extract-cookies-csrf-token';
// import { csrfFetch } from '../../utils/csrf';

const ChatBox = ({ user1Id, user2Id }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.chatMessages?.loading);
  const error = useSelector((state) => state.chatMessages?.error);
  const messages = useSelector(selectMessages);

  const [message, setMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // useExtractCookiesCsrfToken();

  // Setup WebSocket connection
  useEffect(() => {
    const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3001';
    socketRef.current = new WebSocket(WS_BASE_URL);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
      if (user1Id) {
        socketRef.current.send(JSON.stringify({ type: 'join', userId: user1Id }));
      }
    };

    socketRef.current.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data);
        if (incoming.type === 'chat') {
          dispatch(addIncomingMessage(incoming));
        } else if (incoming.type === 'typing') {
          console.log(`${incoming.userId} is typing...`);
        }
      } catch (err) {
        console.error('Invalid message format:', err);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    socketRef.current.onclose = () => {
      console.warn('WebSocket disconnected.');
    };

    return () => {
      socketRef.current?.close();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [user1Id, dispatch]);

  useEffect(() => {
    if (user2Id) {
      dispatch(getMessages(user2Id));
    }
  }, [user2Id, dispatch]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;

    setIsSending(true);

    try {
      if (editingIndex !== null) {
        const msgToEdit = messages[editingIndex];
        await dispatch(editMessage(msgToEdit._id, { content: message }));
        setEditingIndex(null);
      } else {
        await dispatch(sendMessage({ receiverId: user2Id, content: message }));
      }

      // Send WebSocket broadcast
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: 'chat',
            userId: user1Id,
            receiverId: user2Id,
            content: message
          })
        );
      }

      setMessage('');
    } finally {
      setIsSending(false);
    }
  }, [message, editingIndex, user2Id, user1Id, dispatch, messages]);

  const handleTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: 'typing',
            userId: user1Id,
            receiverId: user2Id
          })
        );
      }
    }, 500);
  }, [user1Id, user2Id]);

  const formatTimestamp = useCallback((timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }, []);

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setMessage('');
  };

  const renderedMessages = useMemo(() => {
    const handleEdit = (index) => {
      setEditingIndex(index);
      setMessage(messages[index].content);
    };

    const handleDelete = async (index) => {
      const msg = messages[index];
      await dispatch(deleteMessage(msg.id, user1Id));
    };

    return messages.map((msg, index) => (
      <li key={msg.id}>
        <div>
          <strong>{msg.sender?.username || msg.senderId}</strong>: {msg.content}
        </div>
        <div style={{ fontSize: '0.8em', color: '#666' }}>
          {formatTimestamp(msg.createdAt || msg.timestamp)}
        </div>
        {String(msg.senderId) === String(user1Id) && (
          <div>
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </div>
        )}
      </li>
    ));
  }, [messages, formatTimestamp, dispatch, user1Id]);

  return (
    <div>
      <h2>Chat between User {user1Id} and User {user2Id}</h2>

      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping();
        }}
        placeholder="Type a message..."
      />

      <div>
        <button onClick={handleSendMessage} disabled={isSending}>
          {isSending ? 'Sending...' : editingIndex !== null ? 'Save' : 'Send'}
        </button>
        {editingIndex !== null && (
          <button onClick={handleCancelEdit}>Cancel</button>
        )}
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      <ul>{renderedMessages}</ul>
    </div>
  );
};

export default ChatBox;