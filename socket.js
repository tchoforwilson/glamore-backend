import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';

// Define server
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', () => {
  console.log('Socket onnected');
});

export default io;
