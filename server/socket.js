import { Server as socketIo } from 'socket.io';
import { chatController } from './controllers/chatController.js'; // Import the socket controller

let ioInstance = null;

function initSocket(server) {
  if (!ioInstance) {
    ioInstance = new socketIo(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // Delegate logic to controller
    ioInstance.on('connection', (socket) => {
      chatController(ioInstance, socket);
    });

    console.log('Socket.IO initialized');
  }

  return ioInstance;
}

function getSocket() {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized. Call initSocket(server) first.');
  }
  return ioInstance;
}

export {
  initSocket,
  getSocket
};
