import { useEffect, useRef, useState } from 'react';

const WebSocketChat = () => {
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    const connectSocket = () => {
        socketRef.current = new WebSocket('ws://localhost:8080'); // update if deployed

        socketRef.current.onopen = () => {
            console.log('Connected to WebSocket');
            socketRef.current.send('Hello server!');
        };

        socketRef.current.onmessage = (event) => {
            setMessages(prev => [...prev, event.data]);
        };

        socketRef.current.onerror = () => {
            console.error('WebSocket error');
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket closed');
        };
    };

    const sendMessage = () => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send('Message from React');
        }
    };

    const disconnectSocket = () => {
        socketRef.current?.close();
    };

    useEffect(() => {
        return () => {
            socketRef.current?.close();
        };
    }, []);

    return (
        <div>
            <h2>WebSocket Messages</h2>
            <button onClick={connectSocket}>Connect</button>
            <button onClick={sendMessage}>Send</button>
            <button onClick={disconnectSocket}>Disconnect</button>
            <ul>
                {messages.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
        </div>
    );
};

export default WebSocketChat;