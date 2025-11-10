import axios from 'axios';
import Chat from '../models/Chat.js';

/**
 * @desc    Send message to AI assistant (Cerebras)
 * @route   POST /api/ai/chat
 * @access  Private
 */
export const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    // Get or create chat session for user
    let chat = await Chat.findOne({ userId }).sort({ createdAt: -1 });
    
    if (!chat) {
      chat = await Chat.create({
        userId,
        messages: [],
        context: {
          symptoms: [],
          suggestedSpecialists: [],
          diagnosisHints: [],
        },
      });
    }

    // Add user message to chat
    chat.messages.push({
      role: 'user',
      content: message,
    });

    // Prepare conversation history for Cerebras API
    const conversationHistory = chat.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call Cerebras API
    const cerebrasResponse = await axios.post(
      `${process.env.CEREBRAS_API_URL}/chat/completions`,
      {
        model: 'llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are a medical AI assistant. Help users with symptom analysis, provide general health information, and suggest appropriate medical specialists. Always remind users that you are not a replacement for professional medical advice and they should consult a doctor for serious symptoms. Be empathetic, clear, and helpful.`,
          },
          ...conversationHistory,
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = cerebrasResponse.data.choices[0].message.content;

    // Extract context (symptoms, specialists) from AI response
    const symptoms = extractSymptoms(message);
    const suggestedSpecialists = extractSpecialists(aiResponse);

    // Update chat context
    if (symptoms.length > 0) {
      chat.context.symptoms = [...new Set([...chat.context.symptoms, ...symptoms])];
    }
    if (suggestedSpecialists.length > 0) {
      chat.context.suggestedSpecialists = [...new Set([...chat.context.suggestedSpecialists, ...suggestedSpecialists])];
    }

    // Add AI response to chat
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
    });

    // Save chat
    await chat.save();

    res.status(200).json({
      success: true,
      response: aiResponse,
      context: chat.context,
      chatId: chat._id,
    });
  } catch (error) {
    console.error('Cerebras API Error:', error.response?.data || error.message);
    
    // Fallback response if API fails
    const fallbackResponse = "I'm having trouble connecting right now. Please try again or consult with a healthcare professional for immediate concerns.";
    
    res.status(200).json({
      success: true,
      response: fallbackResponse,
      context: {
        symptoms: [],
        suggestedSpecialists: [],
        diagnosisHints: [],
      },
    });
  }
};

/**
 * @desc    Get chat history for user
 * @route   GET /api/ai/chat/history
 * @access  Private
 */
export const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const chat = await Chat.findOne({ userId }).sort({ createdAt: -1 });

    if (!chat) {
      return res.status(200).json({
        success: true,
        messages: [],
        context: {
          symptoms: [],
          suggestedSpecialists: [],
          diagnosisHints: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      messages: chat.messages,
      context: chat.context,
      chatId: chat._id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear chat history
 * @route   DELETE /api/ai/chat/history
 * @access  Private
 */
export const clearChatHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Chat.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to extract symptoms from user message
 */
const extractSymptoms = (message) => {
  const commonSymptoms = [
    'fever', 'headache', 'cough', 'pain', 'nausea', 'vomiting', 'diarrhea',
    'fatigue', 'dizziness', 'chest pain', 'shortness of breath', 'rash',
    'sore throat', 'stomach ache', 'back pain', 'joint pain', 'insomnia',
  ];
  
  const lowerMessage = message.toLowerCase();
  return commonSymptoms.filter((symptom) => lowerMessage.includes(symptom));
};

/**
 * Helper function to extract specialist suggestions from AI response
 */
const extractSpecialists = (response) => {
  const specialists = [
    'cardiologist', 'dermatologist', 'neurologist', 'orthopedic', 'pediatrician',
    'psychiatrist', 'gastroenterologist', 'pulmonologist', 'endocrinologist',
    'ophthalmologist', 'urologist', 'gynecologist', 'general physician',
  ];
  
  const lowerResponse = response.toLowerCase();
  return specialists.filter((specialist) => lowerResponse.includes(specialist));
};

