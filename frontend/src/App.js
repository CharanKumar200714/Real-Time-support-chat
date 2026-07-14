import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('Support-Main');
  const [isJoined, setIsJoined] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => socket.off('receive_message');
  }, []);

  const joinChatRoom = (e) => {
    e.preventDefault();
    if (username.trim() !== '') {
      socket.emit('join_room', room);
      setIsJoined(true);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage.trim() !== '' && username !== '') {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '24px', textAlign: 'center', width: '100%', maxWidth: '400px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#22d3ee', margin: '0' }}>CodTech Support Portal</h1>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', marginBottom: '0' }}>ID: CITS2897 | K. V. Charan Kumar</p>
      </header>

      {!isJoined ? (
        <form onSubmit={joinChatRoom} style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '8px', border: '1px solid #334155', width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', textAlign: 'center', marginTop: '0' }}>Join Support Channel</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '4px' }}>Your Name</label>
              <input
                type="text"
                placeholder="Enter screen name..."
                required
                style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #475569', borderRadius: '4px', padding: '8px', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '4px' }}>Support Room ID</label>
              <input
                type="text"
                style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #475569', borderRadius: '4px', padding: '8px', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            <button type="submit" style={{ width: '100%', backgroundColor: '#22d3ee', color: '#0f172a', fontWeight: 'bold', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
              Launch Chat
            </button>
          </div>
        </form>
      ) : (
        <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', height: '500px' }}>
          <div style={{ padding: '16px', backgroundColor: '#334155', borderBottom: '1px solid #475569', display: 'flex', justifyContent: 'between', alignItems: 'center', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
            <div style={{ flexGrow: 1 }}>
              <span style={{ fontWeight: '600', display: 'block', color: '#22d3ee' }}>Room: {room}</span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Connected as: {username}</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#020617' }}>
            {messageList.map((msg, index) => {
              const isMe = msg.author === username;
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '75%', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', backgroundColor: isMe ? '#0891b2' : '#334155', color: '#ffffff' }}>
                    <p style={{ margin: '0' }}>{msg.message}</p>
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', padding: '0 4px' }}>
                    {msg.author} • {msg.time}
                  </span>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={sendMessage} style={{ padding: '12px', backgroundColor: '#1e293b', borderTop: '1px solid #334155', display: 'flex', gap: '8px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
            <input
              type="text"
              placeholder="Type message here..."
              style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #475569', borderRadius: '4px', padding: '8px', fontSize: '14px', color: '#ffffff', outline: 'none' }}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <button type="submit" style={{ backgroundColor: '#22d3ee', color: '#0f172a', padding: '8px 16px', fontWeight: '600', fontSize: '14px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
