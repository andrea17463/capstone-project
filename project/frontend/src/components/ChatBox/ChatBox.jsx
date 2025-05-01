
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const ChatBox = () => {
  const { user1Id, user2Id } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      const res = await fetch(`/api/messages/${user2Id}`);
      const data = await res.json();
      setMessages(data);
    };
    loadMessages();
  }, [user2Id]);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080');
    socketRef.current.onopen = () => {
      socketRef.current.send(JSON.stringify({ type: 'join', userId: user1Id }));
    };
    socketRef.current.onmessage = (event) => {
      const incoming = JSON.parse(event.data);
      if (incoming.type === 'chat') {
        setMessages((prev) => [...prev, incoming]);
      }
    };
    return () => socketRef.current?.close();
  }, [user1Id]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    if (editingIndex !== null) {
      const msgToEdit = messages[editingIndex];
      const res = await fetch(`/api/messages/${msgToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
      if (res.ok) {
        const updated = await res.json();
        const newMessages = [...messages];
        newMessages[editingIndex] = updated;
        setMessages(newMessages);
        setEditingIndex(null);
        setMessage('');
      }
      return;
    }

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: user2Id, content: message }),
    });
    if (res.ok) {
      const newMsg = await res.json();
      socketRef.current.send(JSON.stringify({ ...newMsg, type: 'chat' }));
      setMessages((prev) => [...prev, newMsg]);
      setMessage('');
    }
  };

  const editMessage = (index) => {
    setEditingIndex(index);
    setMessage(messages[index].content);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setMessage('');
  };

  const deleteMessage = async (index) => {
    const msg = messages[index];
    const res = await fetch(`/api/messages/${msg.id}`, { method: 'DELETE' });
    if (res.ok) {
      const updated = messages.filter((_, i) => i !== index);
      setMessages(updated);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div>
      <h2>Chat between User {user1Id} and User {user2Id}</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <div>
        <button onClick={sendMessage}>
          {editingIndex !== null ? 'Save' : 'Send'}
        </button>
        {editingIndex !== null && <button onClick={cancelEdit}>Cancel</button>}
      </div>

      <ul>
        {messages.map((msg, index) => (
          <li key={msg.id}>
            <div>
              <strong>{msg.sender?.username || msg.senderId}</strong>: {msg.content}
            </div>
            <div style={{ fontSize: '0.8em', color: '#666' }}>
              {formatTimestamp(msg.createdAt || msg.timestamp)}
            </div>
            {String(msg.senderId) === String(user1Id) && (
              <div>
                <button onClick={() => editMessage(index)}>Edit</button>
                <button onClick={() => deleteMessage(index)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatBox;