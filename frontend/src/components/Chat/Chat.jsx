// frontend/src/components/Chat/Chat.jsx
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import './Chat.css';

function Chat() {
  const { user1Id, user2Id } = useParams();
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.session.user?.id);
  const sessionUser = useSelector((state) => state.session.user);

  const id1 = parseInt(user1Id, 10);
  const id2 = parseInt(user2Id, 10);
  const chatPartnerId = currentUserId === id1 ? id2 : id1;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState(null);
  const [, setIsEditing] = useState(false);
  const [chatPartnerUsername, setChatPartnerUsername] = useState('');

  const messagesEndRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newMessage.trim()) return;

    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const res = await fetch('/api/chat-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          receiverId: chatPartnerId,
          content: newMessage.trim(),
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
      setError('Failed to send message.');
    }
  };

  const handleEditMessage = async (messageId) => {
    setIsEditing(true);
    setError(null);

    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const res = await fetch(`/api/chat-messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ content: editedContent }),
      });

      if (!res.ok) throw new Error('Failed to edit message');

      const updated = await res.json();
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, ...updated } : msg))
      );
      setEditingMessageId(null);
      setEditedContent('');
    } catch (err) {
      console.error(err);
      setError('Could not edit message.');
    } finally {
      setIsEditing(false);
    }
  };

  const debouncedEditMessage = (messageId) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      handleEditMessage(messageId);
    }, 500);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const res = await fetch(`/api/chat-messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to delete message');

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      console.error(err);
      setError('Could not delete message.');
    }
  };

  useEffect(() => {
    if (!chatPartnerId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat-messages/${chatPartnerId}`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load messages.');
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatPartnerId]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchChatPartner = async () => {
      try {
        const res = await fetch(`/api/users/${chatPartnerId}`);
        if (!res.ok) throw new Error('Failed to fetch user info');
        const userData = await res.json();
        if (!userData?.id) throw new Error('User not found');
        setChatPartnerUsername(userData.username);
      } catch (err) {
        console.error(err);
        navigate('/chats');
      }
    };

    if (chatPartnerId) {
      fetchChatPartner();
    }
  }, [chatPartnerId, navigate]);

  if (!sessionUser) return <div>Loading user...</div>;

  const isParticipant = currentUserId === id1 || currentUserId === id2;
  if (!isParticipant) {
    return <div>You are not authorized to view this conversation.</div>;
  }

  return (
    <div className="chat-box-container">
      <div className="chat-box-outer-theme">
        <div className="chat-header">Instant Messenger</div>

        <div className="chat-box-outer-theme">
          <div className="chat-header">Chat with {chatPartnerUsername || '...'}</div>

          <div className="messages">
            {messages.map((msg) => (
              <div className="message-bubble" key={msg.id}>
                <div className="message-meta">{msg.sender?.username}</div>
                {editingMessageId === msg.id ? (
                  <>
                    <textarea
                      className="edit-textarea"
                      value={editedContent}
                      onChange={(e) => {
                        setEditedContent(e.target.value);
                        debouncedEditMessage(msg.id);
                      }}
                      rows={2}
                    />
                    <button onClick={() => {
                      setEditingMessageId(null);
                      setEditedContent('');
                    }}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="message-content">
                      {editingMessageId === msg.id ? editedContent : msg.content}
                    </div>
                    {msg.senderId === sessionUser.id && (
                      <div className="message-actions">
                        <button onClick={() => {
                          setEditingMessageId(msg.id);
                          setEditedContent(msg.content);
                        }}>Edit</button>
                        <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
                      </div>
                    )}
                  </>
                )}
                <div className="timestamp">{new Date(msg.createdAt).toLocaleString()}
                  {msg.editedAt &&
                    ` (edited: ${new Date(msg.editedAt).toLocaleString()})`}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <textarea
              className="chat-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={2}
              placeholder="Type your message..."
            />
            <button className="send-button" type="submit" disabled={!newMessage.trim()}>
              Send
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Chat;