import React, { useEffect, useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const room = "global"; // you can make dynamic

  useEffect(() => {
    socket.emit('join_room', room);

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off('receive_message');
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msgData = {
      room,
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    socket.emit('send_message', msgData);
    setMessages((prev) => [...prev, msgData]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">

      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b">
        <Bot /> <h3>Live Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className="px-4 py-2 bg-gray-200 rounded-lg">
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button className="bg-blue-500 text-white px-4 rounded">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;