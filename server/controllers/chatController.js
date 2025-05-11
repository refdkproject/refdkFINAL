import mongoose from 'mongoose';
import Chat from "../models/chatModel.js";

export function chatController(io, socket) {
  console.log('User connected:', socket.id);

  socket.on('joinEvent', (eventName) => {
    socket.join(eventName);
    console.log(`Socket ${socket.id} joined event: ${eventName}`);
  });

  socket.on('broadcastMessage', async ({ event, user, senderId, message }) => {
    const existingChat = await Chat.findOne({ eventId: event });
    const newMessageObject = {
      _id: new mongoose.Types.ObjectId(),
      user,
      senderId,
      message,
      timestamp: new Date().toISOString(),
    }
    if(existingChat) {
      existingChat.messages.push(newMessageObject);
      await existingChat.save();      
    } else {
      await Chat.create({
        eventId: event,
        messages: [newMessageObject]
      });
    }

    io.to(event).emit('receiveMessage', {
      eventId: event,
      message: newMessageObject
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
};


export async function getChatHistory(req, res) {
  try {
    const { eventId } = req.params;
    const chat = await Chat.findOne({ eventId });

    if (!chat) {
      return res.status(404).json({ message: "Chat history not found for this event." });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
