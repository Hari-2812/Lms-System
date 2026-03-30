import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;

  const message = Object.assign(new Message({
    sender: req.user._id,
    receiver: receiverId,
    content,
  }));

  const createdMessage = await message.save();

  // Emitting the event directly utilizing the socket.io instance
  // Note: we injected 'io' using middleware in server.js
  if (req.io) {
      req.io.emit(`receive_message_${receiverId}`, createdMessage);
  }

  res.status(201).json(createdMessage);
});

// @desc    Get conversation between two users
// @route   GET /api/messages/:userId
// @access  Private
const getConversation = asyncHandler(async (req, res) => {
  const otherUserId = req.params.userId;
  const currentUserId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: currentUserId },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});

export { sendMessage, getConversation };
