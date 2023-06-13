import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, TextField, Button } from '@mui/material';

const App = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch chat rooms from the backend API
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('/api/chat-rooms');
        setChatRooms(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChatRooms();
  }, []);

  useEffect(() => {
    // Fetch messages for the selected chat room from the backend API
    const fetchMessages = async () => {
      try {
        if (selectedChatRoom) {
          const response = await axios.get(`/api/chat-rooms/${selectedChatRoom}/messages`);
          setMessages(response.data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [selectedChatRoom]);

  const handleChatRoomSelect = (chatRoomId) => {
    setSelectedChatRoom(chatRoomId);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        await axios.post(`/api/chat-rooms/${selectedChatRoom}/messages`, { text: newMessage });
        setNewMessage('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Router>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Chat App
        </Typography>

        <Switch>
          <Route exact path="/">
            <List>
              {chatRooms.map((chatRoom) => (
                <ListItem
                  key={chatRoom.id}
                  button
                  component={Link}
                  to={`/chat-rooms/${chatRoom.id}`}
                  onClick={() => handleChatRoomSelect(chatRoom.id)}
                >
                  <ListItemText primary={chatRoom.name} />
                </ListItem>
              ))}
            </List>
          </Route>
          <Route path="/chat-rooms/:id">
            <List>
              {messages.map((message) => (
                <ListItem key={message.id}>
                  <ListItemText primary={message.text} />
                </ListItem>
              ))}
            </List>

            <TextField
              label="New Message"
              variant="outlined"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="contained" onClick={handleSendMessage}>
              Send
            </Button>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
