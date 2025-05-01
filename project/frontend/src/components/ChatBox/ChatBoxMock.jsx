import { useState } from 'react';

const ChatBoxMock = () => {
    // Mock message state
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, senderId: 1, receiverId: 2, content: 'Hello', createdAt: '2025-05-01T15:00:00Z' },
        { id: 2, senderId: 2, receiverId: 1, content: 'Hi there', createdAt: '2025-05-01T15:05:00Z' }
    ]);
    const [editingIndex, setEditingIndex] = useState(null);

    // Format timestamp to a more readable format
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC'
        });
    };

    const sendMessage = () => {
        if (!message.trim()) return;

        if (editingIndex === null) {
            const newMessage = {
                id: messages.length + 1, // Increment ID for new message
                senderId: 1, // Mocking senderId as 1
                receiverId: 2, // Mocking receiverId as 2
                content: message,
                createdAt: new Date().toISOString()
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
        } else {
            const updatedMessages = [...messages];
            updatedMessages[editingIndex] = { ...updatedMessages[editingIndex], content: message };
            setMessages(updatedMessages);
            setEditingIndex(null); // Reset edit state
        }

        setMessage(''); // Clear message input field
    };

    const editMessage = (index) => {
        setEditingIndex(index);
        setMessage(messages[index].content); // Populate text area with current message content
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setMessage(''); // Clear text area
    };

    const deleteMessage = (index) => {
        const updatedMessages = messages.filter((_, i) => i !== index);
        setMessages(updatedMessages); // Remove the message
    };

    return (
        <div>
            <h2>Chat</h2>
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
                            <strong>{msg.senderId === 1 ? 'User 1' : 'User 2'}:</strong> {msg.content}
                        </div>
                        <div style={{ fontSize: '0.8em', color: '#666' }}>
                            {formatTimestamp(msg.createdAt)}
                        </div>
                        <div>
                            <button onClick={() => editMessage(index)}>Edit</button>
                            <button onClick={() => deleteMessage(index)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatBoxMock;