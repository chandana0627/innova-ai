"use client";

import { useState, useRef } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import styles from "./chatbot.module.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "incoming",
      message: "Hi! 👋 I'm your InnovaAI assistant. I can help you with:\n• Resume creation\n• Cover letter writing\n• Interview preparation\n\nHow can I assist you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const chatboxRef = useRef(null);

  const API_KEY = "AIzaSyAILHtql4yYk8pGf_ifJPqsjcjBHT8dlHk";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  const generateResponse = async (message) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ 
              text: `You are an AI assistant for Innova.ai, specializing in resume creation, cover letter writing, and interview preparation. 
              Your responses should be helpful, professional, and focused on career growth.
              
              Key guidelines:
              - Provide specific, actionable advice
              - Use professional language
              - Keep responses concise but informative
              - Focus on modern career best practices
              - If asked about resumes/CVs, emphasize ATS-friendly formats
              - For interview prep, suggest STAR method responses
              - For cover letters, emphasize personalization and relevance
              - ur response should be in a text avoid using markdown or (*)star.
              
              User question: "${message}"
              
              Respond in a helpful, conversational tone.`
            }]
          }]
        })
      });

      const data = await response.json();
      return data?.candidates[0]?.content?.parts[0]?.text || "I apologize, but I'm having trouble processing that request. Could you please rephrase your question?";
    } catch (error) {
      console.error('Error:', error);
      return "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.";
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: "outgoing", message: inputMessage }]);
    const userMsg = inputMessage;
    setInputMessage("");

    // Add thinking message
    setMessages(prev => [...prev, { type: "incoming", message: "Thinking..." }]);

    // Get response
    const response = await generateResponse(userMsg);

    // Replace thinking with response
    setMessages(prev => [...prev.slice(0, -1), { type: "incoming", message: response }]);

    // Scroll to bottom
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.chatbotToggler} ${isOpen ? styles.active : ""}`}
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>

      <div className={`${styles.chatbot} ${isOpen ? styles.show : ""}`}>
        <header className={styles.header}>
          <h2>Chat Assistant</h2>
          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </header>

        <ul className={styles.chatbox} ref={chatboxRef}>
          {messages.map((msg, index) => (
            <li key={index} className={`${styles.chat} ${styles[msg.type]}`}>
              {msg.type === "incoming" && (
                <span className="material-symbols-outlined">smart_toy</span>
              )}
              <p className={msg.type === "incoming" ? styles.text : ""}>
                {msg.message}
              </p>
            </li>
          ))}
        </ul>

        <div className={styles.chatInput}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Somthing..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button 
            onClick={handleSend} 
            disabled={!inputMessage.trim()}
            className={styles.sendBtn}
          >
            <Send />
          </button>
        </div>
      </div>
    </>
  );
}

