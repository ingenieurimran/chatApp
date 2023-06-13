const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const chatRoomSchema = new mongoose.Schema({
  name: String,
});

const messageSchema = new mongoose.Schema({
  chatRoomId: mongoose.Types.ObjectId,
  text: String,
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
const Message = mongoose.model('Message', messageSchema);

// Define your backend API routes here
app.get('/api/chat-rooms', async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find();
    res.json(chatRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chat-rooms/:id/messages', async (req, res) => {
  try {
    const chatRoomId = req.params.id;
    const messages = await Message.find({ chatRoomId });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chat-rooms/:id/messages', async (req, res) => {
  try {
    const chatRoomId = req.params.id;
    const { text } = req.body;

    const message = new Message({ chatRoomId, text });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
