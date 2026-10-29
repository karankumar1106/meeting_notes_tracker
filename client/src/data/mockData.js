/**
 * Mock Data & Simulation Utility for Phase 1
 * 
 * NOTE: This is MOCK data for frontend testing.
 * In Phase 5, this will be replaced with real AI extraction using an LLM API.
 */

export const INITIAL_MEETINGS = [
  {
    id: 'meet-1',
    title: 'Sprint 14 Planning & Architecture',
    date: '2026-10-28',
    notes: 'Alice agreed to refactor auth endpoints by next Friday. Bob will take care of creating the Redis cluster for queue testing. Karan confirmed the Mongoose Job model fields match the spec.',
    decisions: [
      'Agreed to adopt Redis BullMQ for background job processing instead of synchronous HTTP calls.'
    ],
    unansweredQuestions: [
      'Do we need multi-region replication for Redis on day one?'
    ]
  }
];

export const INITIAL_ITEMS = [
  {
    id: 'item-1',
    meetingId: 'meet-1',
    meetingTitle: 'Sprint 14 Planning & Architecture',
    text: 'Refactor authentication routes to use HTTP-only cookies',
    owner: 'Alice Johnson',
    dueDate: '2026-11-05',
    status: 'in-progress',
    sourceSentence: 'Alice agreed to refactor auth endpoints by next Friday.'
  },
  {
    id: 'item-2',
    meetingId: 'meet-1',
    meetingTitle: 'Sprint 14 Planning & Architecture',
    text: 'Provision Redis instance on Upstash or Render',
    owner: 'Bob Smith',
    dueDate: '2026-11-02',
    status: 'pending',
    sourceSentence: 'Bob will take care of creating the Redis cluster for queue testing.'
  },
  {
    id: 'item-3',
    meetingId: 'meet-1',
    meetingTitle: 'Sprint 14 Planning & Architecture',
    text: 'Finalize database schema for Jobs collection',
    owner: 'Karan Kumar',
    dueDate: '2026-10-30',
    status: 'completed',
    sourceSentence: 'Karan confirmed the Mongoose Job model fields match the spec.'
  }
];

/**
 * Simulates AI extraction from raw notes.
 * Generates structured action items, decisions, and questions.
 */
export function simulateAIExtraction(title, notes) {
  const meetingId = `meet-${Date.now()}`;
  const now = new Date().toISOString().split('T')[0];

  // Split into sentences to simulate source attribution
  const sentences = notes
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const primarySentence = sentences[0] || notes;
  const secondarySentence = sentences[1] || 'Action item derived from discussion notes.';

  const newMeeting = {
    id: meetingId,
    title: title || 'Untitled Meeting',
    date: now,
    notes: notes,
    decisions: [
      `Approved approach outlined in "${title || 'Meeting'}" discussion.`
    ],
    unansweredQuestions: [
      `Review edge cases identified during: "${primarySentence.slice(0, 50)}..."`
    ]
  };

  const newItems = [
    {
      id: `item-${Date.now()}-1`,
      meetingId,
      meetingTitle: newMeeting.title,
      text: `Follow up on: ${primarySentence.slice(0, 60)}...`,
      owner: 'Team Lead',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      status: 'pending',
      sourceSentence: primarySentence
    },
    {
      id: `item-${Date.now()}-2`,
      meetingId,
      meetingTitle: newMeeting.title,
      text: `Implement technical spec for ${title}`,
      owner: 'Developer',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'in-progress',
      sourceSentence: secondarySentence
    }
  ];

  return { newMeeting, newItems };
}
