const { OpenAI } = require('openai');
const WeeklyReport = require('../models/WeeklyReport');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Helper: get current ISO week string e.g. "2024-W42"
const getCurrentWeek = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

// @desc    Process AI query
// @route   POST /api/ai/query
// @access  Manager
exports.processQuery = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return sendError(res, 400, 'Prompt is required.');

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai_api_key')) {
      return sendError(res, 400, 'AI Assistant is currently offline. Please add a valid OPENAI_API_KEY to your backend .env file and restart the server.');
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Fetch recent reports (last 2 weeks) for context
    const currentWeek = getCurrentWeek();
    // basic week math (very simplified just to get recent context)
    const reports = await WeeklyReport.find()
      .populate('createdBy', 'name')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50 to avoid token limits

    // Format context for LLM
    const contextStr = reports.map(r => `
      Report by: ${r.createdBy?.name || 'Unknown'}
      Week: ${r.week}
      Project: ${r.project?.name || 'General'}
      Status: ${r.status}
      Tasks Completed: ${r.tasksCompleted || 'None'}
      Tasks Planned: ${r.tasksPlanned || 'None'}
      Blockers: ${r.blockers || 'None'}
      Hours: ${r.hoursWorked || 0}
    `).join('\n\n');

    const systemMessage = `You are TeamCore AI, an intelligent assistant for a company manager. 
You are analyzing recent weekly reports from the team. 
Be concise, professional, and use the provided report context to answer the user's prompt. 
If the information is not in the context, say you don't know based on the recent reports.
Context data:
${contextStr}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
    });

    sendSuccess(res, 200, { answer: response.choices[0].message.content });
  } catch (err) {
    console.error('OpenAI Error:', err.message || err);
    
    // If it's an OpenAI API error, extract the message so it shows on the UI
    if (err.response && err.response.data && err.response.data.error) {
      return sendError(res, 400, `OpenAI API Error: ${err.response.data.error.message}`);
    } else if (err.status === 429) {
       return sendError(res, 429, 'OpenAI Quota Exceeded or Rate Limited. Please check your billing dashboard.');
    }
    
    // Pass other generic errors to the global error handler
    return sendError(res, 500, err.message || 'An unexpected error occurred while communicating with OpenAI.');
  }
};
