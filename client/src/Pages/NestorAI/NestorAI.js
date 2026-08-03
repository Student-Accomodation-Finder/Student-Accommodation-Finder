import React, { useState, useRef, useEffect } from "react";
import { IoSend, IoSparkles, IoPersonCircleOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import ReactMarkdown from 'react-markdown';

const QUICK_PROMPTS = [
  "Bedsitters near JKUAT Main Gate under 10k KES",
  "Which areas near KU are best for female students?",
  "What utilities should I look for in apartments near USIU?",
  "Average price for a 1-bedroom near UoN Chiromo?"
];

function NestorAI() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I'm your NestQuest Housing Assistant. Ask me anything about student accommodations, rent estimates, safety, or utilities near Kenyan university campuses!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSendMessage = async (customMessage = null) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customMessage) setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I am having trouble connecting right now. Please try again in a moment!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-page-container">

      <div className="ai-chat-header">
        <div className="ai-header-info">
          <div className="ai-avatar-badge">
            <RiRobot2Line />
          </div>
          <div>
            <h2>NestQuest Housing AI <IoSparkles className="sparkle-icon" /></h2>
            <p><MdVerified className="verified-icon" /> Kenya Campus Accommodation Guide</p>
          </div>
        </div>
      </div>

      <div className="ai-chat-box">
        <div className="messages-scroll-area">
          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.sender}`}>
              <div className="message-avatar">
                {msg.sender === "ai" ? <RiRobot2Line /> : <IoPersonCircleOutline />}
              </div>
              <div className="message-bubble-wrapper">
                <div className="message-bubble">
                  {msg.sender === "ai" ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row ai">
              <div className="message-avatar"><RiRobot2Line /></div>
              <div className="message-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="quick-prompts-container">
          <span className="quick-title">Suggested:</span>
          <div className="quick-prompts-scroll">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button key={idx} className="quick-prompt-pill" onClick={() => handleSendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form className="chat-input-form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
          <input
            type="text"
            placeholder="Ask about accommodation near JKUAT, KU, UoN, rent prices, safety..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input.trim() || loading} className="send-btn">
            <IoSend />
          </button>
        </form>
      </div>
    </div>
  );
}

export default NestorAI;
