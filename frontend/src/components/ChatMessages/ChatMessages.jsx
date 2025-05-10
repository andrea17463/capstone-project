// frontend/src/components/ChatMessages/ChatMessages.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import useExtractCookiesCsrfToken from '../../hooks/extract-cookies-csrf-token';

const ChatMessages = () => {
  const { user1Id, user2Id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  // useExtractCookiesCsrfToken();

  // WebSocket setup
  useEffect(() => {
    // const socketConnection = new WebSocket('ws://localhost:8080');
    const socketConnection = new WebSocket('ws://localhost:3001');

    socketConnection.onopen = () => {
      console.log('WebSocket connection established');
      // Send user ID for identifying the connection
      socketConnection.send(`user-id:${user1Id}`);
    };

    socketConnection.onmessage = (event) => {
      const newMessage = event.data;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    setSocket(socketConnection);

    return () => {
      socketConnection.close(); // Close socket on component unmount
    };
  }, [user1Id]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      const formattedMessage = `${user1Id}:${user2Id}:${message}`;
      socket.send(formattedMessage);
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage(''); // Clear input after sending
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
            <p key={index}>{msg}</p>
          ))}
        </>
      </div>
    </div>
  );
};

export default ChatMessages;