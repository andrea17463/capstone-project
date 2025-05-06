// import { useEffect, useRef, useState } from 'react';

// const WebSocketChat = ({ currentUserId, selectedUserId }) => {
//     const [messages, setMessages] = useState([]);
//     const [typing, setTyping] = useState(null);
//     const [inputValue, setInputValue] = useState('');
//     const socketRef = useRef(null);
//     const typingTimeoutRef = useRef(null);

//     // Connect to WebSocket
//     const connectSocket = () => {
//         if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
//             // const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080';
//             const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3001';

//             socketRef.current = new WebSocket(WS_BASE_URL);

//             socketRef.current.onopen = () => {
//                 console.log('Connected to WebSocket');
//                 socketRef.current.send(JSON.stringify({ type: 'ping', userId: currentUserId }));
//             };

//             socketRef.current.onmessage = (event) => {
//                 const parsed = JSON.parse(event.data);
//                 if (parsed.type === 'chat') {
//                     setMessages((prev) => [...prev, parsed]);
//                 } else if (parsed.type === 'typing') {
//                     setTyping(parsed.userId);
//                     setTimeout(() => setTyping(null), 1000); // remove typing after 1s
//                 }
//             };

//             socketRef.current.onerror = (error) => {
//                 console.error('WebSocket Error: ', error);
//             };

//             socketRef.current.onclose = (event) => {
//                 console.warn('WebSocket closed:', event.code, event.reason);
//             };
//         }
//     };

//     // Send message to server
//     const sendMessage = (messageContent) => {
//         if (socketRef.current?.readyState === WebSocket.OPEN) {
//             socketRef.current.send(
//                 JSON.stringify({
//                     type: 'chat',
//                     content: messageContent,
//                     userId: currentUserId,
//                     receiverId: selectedUserId,
//                 })
//             );
//         }
//     };

//     // Send typing notification
//     const sendTypingNotification = () => {
//         if (socketRef.current?.readyState === WebSocket.OPEN) {
//             socketRef.current.send(
//                 JSON.stringify({
//                     type: 'typing',
//                     userId: currentUserId,
//                     receiverId: selectedUserId,
//                 })
//             );
//         }
//     };

//     // Disconnect WebSocket
//     const disconnectSocket = () => {
//         socketRef.current?.close();
//     };

//     useEffect(() => {
//         connectSocket();
//         return () => {
//             disconnectSocket();
//             clearTimeout(typingTimeoutRef.current);
//         };
//     }, []);

//     const handleInputChange = (e) => {
//         const value = e.target.value;
//         setInputValue(value);

//         if (typingTimeoutRef.current) {
//             clearTimeout(typingTimeoutRef.current);
//         }

//         typingTimeoutRef.current = setTimeout(() => {
//             sendTypingNotification();
//         }, 300);
//     };

//     const handleSendClick = () => {
//         if (inputValue.trim()) {
//             sendMessage(inputValue);
//             setInputValue('');
//         }
//     };

//     return (
//         <div>
//             <h2>WebSocket Messages</h2>
//             <button onClick={connectSocket}>Connect</button>
//             <button
//                 onClick={handleSendClick}
//                 disabled={socketRef.current?.readyState !== WebSocket.OPEN}
//             >
//                 Send
//             </button>
//             <button onClick={disconnectSocket}>Disconnect</button>

//             {typing && <p style={{ color: 'gray' }}>Other user is typing...</p>}

//             <ul>
//                 {messages.map((msg, i) => (
//                     <li key={i}>{msg.content}</li>
//                 ))}
//             </ul>

//             <textarea
//                 value={inputValue}
//                 onChange={handleInputChange}
//                 placeholder="Type a message..."
//             />
//         </div>
//     );
// };

// export default WebSocketChat;