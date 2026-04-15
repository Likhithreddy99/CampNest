import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hi! I am your CampNest assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/api/chatbot', { message: userMsg }, { withCredentials: true });
      setMessages(prev => [...prev, { role: 'bot', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {isOpen ? (
        <div className="card" style={styles.window}>
          <div style={styles.header}>
            <div style={styles.headerTitle}>
              <MessageCircle size={18} />
              <span>CampNest AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}><X size={18} /></button>
          </div>
          
          <div style={styles.body} ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} style={{...styles.msg, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'}}>
                <div style={{...styles.bubble, background: msg.role === 'user' ? 'var(--primary)' : '#f0f0f0', color: msg.role === 'user' ? '#fff' : 'var(--text)'}}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={styles.msg}>
                <div style={{...styles.bubble, background: '#f0f0f0', color: 'var(--text-muted)'}}>...</div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} style={styles.footer}>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask me anything..." 
              style={styles.input}
            />
            <button type="submit" style={styles.sendBtn} disabled={loading}><Send size={18} /></button>
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} style={styles.fab}>
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 1000
  },
  fab: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 12px rgba(211, 35, 35, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  window: {
    width: '320px',
    height: '420px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    border: '1px solid var(--border)'
  },
  header: {
    padding: '1rem',
    background: 'var(--primary)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 600
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '0.2rem'
  },
  body: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: '#fff'
  },
  msg: {
    display: 'flex'
  },
  bubble: {
    padding: '0.6rem 0.8rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    maxWidth: '85%',
    lineHeight: 1.4
  },
  footer: {
    padding: '0.75rem',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    gap: '0.5rem',
    background: '#fff'
  },
  input: {
    flex: 1,
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '0 1rem',
    fontSize: '0.85rem',
    outline: 'none'
  },
  sendBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Chatbot;
