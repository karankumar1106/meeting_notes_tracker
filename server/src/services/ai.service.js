import dns from 'node:dns';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { simulateAIExtraction } from '../utils/aiSimulator.js';

dns.setDefaultResultOrder('ipv4first');

/**
 * Strict JSON Schema definition for Gemini Structured Outputs
 */
const meetingExtractionSchema = {
  description: 'Extracted structured insights from meeting notes or transcripts',
  type: SchemaType.OBJECT,
  properties: {
    decisions: {
      type: SchemaType.ARRAY,
      description: 'Key decisions, approvals, or strategic consensus agreed upon in the meeting',
      items: { type: SchemaType.STRING },
    },
    unansweredQuestions: {
      type: SchemaType.ARRAY,
      description: 'Unresolved questions, blockers, or open topics requiring further investigation',
      items: { type: SchemaType.STRING },
    },
    actionItems: {
      type: SchemaType.ARRAY,
      description: 'Concrete follow-up commitments, tasks, and deliverables',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          text: {
            type: SchemaType.STRING,
            description: 'Actionable summary of the task to be performed',
          },
          owner: {
            type: SchemaType.STRING,
            description: 'Person, role, or team assigned to this commitment (e.g. "Alice", "DevOps", or "Unassigned")',
          },
          dueDate: {
            type: SchemaType.STRING,
            description: 'Due date in YYYY-MM-DD format if mentioned, or relative timeframe like "Next Friday"',
          },
          status: {
            type: SchemaType.STRING,
            description: 'Initial state of the commitment',
            enum: ['pending', 'in-progress', 'completed'],
          },
          sourceSentence: {
            type: SchemaType.STRING,
            description: 'Verbatim excerpt or sentence from the transcript that directly anchors this action item (for human verification)',
          },
        },
        required: ['text', 'owner', 'status', 'sourceSentence'],
      },
    },
  },
  required: ['decisions', 'unansweredQuestions', 'actionItems'],
};

/**
 * Extracts decisions, unanswered questions, and action items using Google Gemini API.
 * Includes graceful fallback to local simulation if API key is not configured.
 */
export async function extractMeetingInsights(title, notes) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('<your_')) {
    console.warn('[AI Service] GEMINI_API_KEY is not set. Falling back to local extraction simulation.');
    const simulated = simulateAIExtraction(title, notes);
    return {
      decisions: simulated.decisions,
      unansweredQuestions: simulated.unansweredQuestions,
      actionItems: simulated.rawItems,
      source: 'simulator (no API key)',
    };
  }

  const activeModels = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];
  let lastError = null;

  for (const modelName of activeModels) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: meetingExtractionSchema,
          temperature: 0.2, // Low temperature for deterministic, analytical extraction
        },
      });

      const prompt = `
You are an expert executive meeting assistant. Analyze the following meeting notes carefully.

Meeting Title: "${title || 'Untitled Meeting'}"
Transcript / Notes:
"""
${notes}
"""

Instructions:
1. Extract ALL definitive DECISIONS agreed upon.
2. Identify ALL UNANSWERED QUESTIONS, blockers, or topics left open.
3. Extract ALL concrete ACTION ITEMS and commitments. For each action item:
   - Identify the owner (assignee) or team.
   - Infer the due date if mentioned (otherwise set to a sensible default or relative date like "Next Friday").
   - Set status to 'pending' unless explicitly stated as already done or in progress.
   - CRITICAL: Copy the EXACT verbatim sentence from the notes into "sourceSentence" to anchor this task back to the transcript.
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsedData = JSON.parse(responseText);

      console.log(`[AI Service] Successfully extracted ${parsedData.actionItems?.length || 0} action items using ${modelName}!`);

      return {
        decisions: parsedData.decisions || [],
        unansweredQuestions: parsedData.unansweredQuestions || [],
        actionItems: parsedData.actionItems || [],
        source: modelName,
      };
    } catch (error) {
      lastError = error;
      console.warn(`[AI Service] Attempt with ${modelName} failed: ${error.message.split('\n')[0]}. Trying backup model...`);
    }
  }

  console.error('[AI Service] All Gemini model attempts failed:', lastError?.message);
  console.warn('[AI Service] Falling back to local simulation due to API error.');
  const simulated = simulateAIExtraction(title, notes);
  return {
    decisions: simulated.decisions,
    unansweredQuestions: simulated.unansweredQuestions,
    actionItems: simulated.rawItems,
    source: 'simulator (fallback after error)',
  };
}

