import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({
    symptoms: [],
    suggestedSpecialists: [],
    diagnosisHints: [],
  });
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/ai/chat/history');
      if (response.data.messages && response.data.messages.length > 0) {
        setMessages(response.data.messages);
        setContext(response.data.context || context);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to UI immediately
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await api.post('/ai/chat', { message: userMessage });
      
      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setContext(response.data.context || context);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      try {
        await api.delete('/ai/chat/history');
        setMessages([]);
        setContext({
          symptoms: [],
          suggestedSpecialists: [],
          diagnosisHints: [],
        });
        toast.success('Chat history cleared');
      } catch (error) {
        console.error('Error clearing chat:', error);
        toast.error('Failed to clear chat history');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Medical Assistant</h1>
              <p className="text-gray-600">
                Ask about symptoms, get health advice, and find the right specialist
              </p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                <span>Clear Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Context Display */}
        {(context.symptoms.length > 0 || context.suggestedSpecialists.length > 0) && (
          <div className="card mb-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Session Summary</h3>
            {context.symptoms.length > 0 && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-700">Symptoms: </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {context.symptoms.map((symptom, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {context.suggestedSpecialists.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Suggested Specialists: </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {context.suggestedSpecialists.map((specialist, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {specialist}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="card mb-6 h-[500px] overflow-y-auto bg-white"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-500 max-w-md">
                Ask me about your symptoms, health concerns, or get recommendations for specialists.
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Bot className="h-5 w-5" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-gray-700" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="card">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;

