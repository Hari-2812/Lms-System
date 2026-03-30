import asyncHandler from 'express-async-handler';

// @desc    Simulate an AI chatbot response for a student
// @route   POST /api/ai/chat
// @access  Private
const askAI = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400);
    throw new Error('Please provide a prompt for the AI');
  }

  // Artificial delay to simulate processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  let reply = "I am an AI assistant. I've noted your question.";

  // Mock intelligence
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('react')) {
    reply = "React is a fantastic frontend library! If you are stuck with state, remember to check hooks like useState and useEffect.";
  } else if (lowerPrompt.includes('error')) {
    reply = "Errors are stepping stones. Could you paste the exact error stack trace so I can analyze it?";
  } else if (lowerPrompt.includes('course')) {
    reply = "I recommend finishing the Core Mongoose Module before tackling the Next.js section. Keep going!";
  } else {
    reply = "That's an interesting question regarding your coursework! Currently, my real intelligence API is disconnected, but I am designed to assist you with all syllabus-related issues.";
  }

  res.json({
    reply,
    timestamp: new Date().toISOString()
  });
});

export { askAI };
