/**
 * AI Extraction Simulator (Phase 1-4)
 * 
 * In Phase 5, this utility will be upgraded to call real LLM APIs (Gemini / OpenAI).
 */
export function simulateAIExtraction(title, notes) {
  const sentences = notes
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const primarySentence = sentences[0] || notes;
  const secondarySentence = sentences[1] || 'Action item derived from discussion notes.';

  const decisions = [
    `Approved approach outlined in "${title || 'Meeting'}" discussion.`
  ];

  const unansweredQuestions = [
    `Review edge cases identified during: "${primarySentence.slice(0, 50)}..."`
  ];

  const rawItems = [
    {
      text: `Follow up on: ${primarySentence.slice(0, 60)}...`,
      owner: 'Team Lead',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      status: 'pending',
      sourceSentence: primarySentence
    },
    {
      text: `Implement technical spec for ${title || 'Meeting'}`,
      owner: 'Developer',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'in-progress',
      sourceSentence: secondarySentence
    }
  ];

  return { decisions, unansweredQuestions, rawItems };
}

