import mongoose from 'mongoose';

/**
 * Chat Schema
 * Stores AI conversation history for each user
 */
const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    context: {
      symptoms: [String],
      suggestedSpecialists: [String],
      diagnosisHints: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user chat retrieval
chatSchema.index({ userId: 1, createdAt: -1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

