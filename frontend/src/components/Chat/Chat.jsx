// frontend/src/components/Chat/Chat.jsx
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function Chat() {
  const { user1Id, user2Id } = useParams();
  const currentUserId = useSelector((state) => state.session.user?.id);
  const user = useSelector((state) => state.session.user);

  const id1 = parseInt(user1Id, 10);
  const id2 = parseInt(user2Id, 10);
  const chatPartnerId = currentUserId === id1 ? id2 : id1;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const messagesEndRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!user) return <div>Loading user...</div>;

  const isParticipant = currentUserId === id1 || currentUserId === id2;
  if (!isParticipant) {
    return <div>You are not authorized to view this conversation.</div>;
  }

  return (
    <div className="chat-box" style={{ border: '1px solid #ccc', padding: '10px' }}>
      <div className="messages" style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg) => {
          const created = new Date(msg.createdAt).toLocaleString();
          const edited = msg.editedAt
            ? ` (edited: ${new Date(msg.editedAt).toLocaleString()})`
            : '';

          return (
            <div key={msg.id} style={{ marginBottom: '10px' }}>
              <div>
                <strong>{msg.sender?.username || 'Unknown'}:</strong>{' '}
                {editingMessageId === msg.id ? (
                  <>
                    <textarea
                      rows={2}
                      style={{ width: '100%' }}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <button
                      onClick={() => debouncedEditMessage(msg.id)}
                      disabled={isEditing}
                    >
                      {isEditing ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingMessageId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {msg.content}{' '}
                    {msg.senderId === user.id && (
                      <>
                        <button
                          onClick={() => {
                            setEditingMessageId(msg.id);
                            setEditedContent(msg.content);
                          }}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
                      </>
                    )}
                  </>
                )}
              </div>
              <div style={{ fontSize: '0.8em', color: '#666' }}>
                Sent: {created}
                {edited}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ marginTop: '10px' }}>
        <textarea
          rows={2}
          style={{ width: '80%' }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" disabled={!newMessage.trim()}>Send</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Chat;