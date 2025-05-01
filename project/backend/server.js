// backend/server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { sequelize } = require('./db/models');
const app = require('./app');

const PORT = process.env.PORT || 3001; // HTTP server port
const WS_PORT = 8080;  // WebSocket server port

const server = http.createServer(app);
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
    console.log('WebSocket client connected.');

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'chat') {
                // Broadcast chat message to all clients
                broadcastMessage(parsedMessage);
            }
        } catch (error) {
            console.error('Invalid message format:', error);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected.');
    });
});

const broadcastMessage = (message) => {
    const messageString = JSON.stringify(message);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messageString);
        }
    });
};

sequelize.sync().then(() => {
    // Start HTTP server
    server.listen(PORT, () => {
        console.log(`HTTP server running on port ${PORT}`);
    });
    // Start WebSocket server
    wss.on('listening', () => {
        console.log(`WebSocket server running on port ${WS_PORT}`);
    });
});