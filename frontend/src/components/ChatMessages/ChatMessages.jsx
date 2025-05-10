// frontend/src/components/ChatMessages/ChatMessages.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

const ChatMessages = () => {
  const { user1Id, user2Id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

  // WebSocket setup
  useEffect(() => {
    // const socketConnection = new WebSocket('ws://localhost:8080');
    const socketConnection = new WebSocket('ws://localhost:3001');
    socketRef.current = socketConnection;

    socketConnection.onopen = () => {
      console.log('WebSocket connection established');
      socketConnection.send(`user-id:${user1Id}`);
    };
    socketConnection.onmessage = (event) => {
      const [senderId, receiverId, content] = event.data.split(':');
      setMessages((prev) => [...prev, { senderId, receiverId, content }]);
    };

    socketConnection.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => {
      socketConnection.close(); // Close socket on component unmount
    };
  }, [user1Id]);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (socketRef.current && trimmed) {
      const formattedMessage = `${user1Id}:${user2Id}:${trimmed}`;
      socketRef.current.send(formattedMessage);
      setMessages((prev) => [
        ...prev,
        { senderId: user1Id, receiverId: user2Id, content: trimmed }
      ]);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat between User {user1Id} and User {user2Id}</h2>

      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        <h3>Messages</h3>
        <>
          {messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.senderId === user1Id ? 'You' : `User ${msg.senderId}`}</strong>: {msg.content}
            </p>
          ))}
        </>
      </div>
    </div>
  );
};

export default ChatMessages;