# Meeting Notes to Action Items Tracker

An AI-powered full-stack meeting follow-up application built with React, Node.js/Express, MongoDB Atlas, Redis/BullMQ, and an LLM API.

## Project Architecture Overview

```
[ React SPA (Vite) ]
       │
       ▼ (HTTP REST / JWT)
[ Express API Server ] ── (Enqueue Job) ──► [ Redis Queue (BullMQ) ]
       │                                            │
       ▼                                            ▼ (Pulls Job)
[ MongoDB Atlas ] ◄── (Save Items / Status) ── [ Background Worker ]
       ▲                                            │
       │                                            ▼ (Extracts via LLM)
       │                                       [ LLM Provider API ]
       │                                            │
       └──────── (Stream Progress via SSE) ─────────┘
```

## Learning & Development Roadmap

- [x] **Phase 0: Planning and Setup** (Tool verification, architecture overview, Git init)
- [ ] **Phase 1: React Fundamentals & Frontend** (Vite, JSX, Components, State, Props, Mock Data UI)
- [ ] **Phase 2: Frontend State & Data Flow** (Lifting state, persistence, localStorage vs Database)
- [ ] **Phase 3: Node.js & Express Backend** (REST API, Express routes, controllers, middleware)
- [ ] **Phase 4: MongoDB & Persistence** (Mongoose schemas, Atlas connection, CRUD, Zod validation)
- [ ] **Phase 5: Real AI Extraction** (LLM API integration, structured prompts, attribution, error handling)
- [ ] **Phase 6: Authentication & Authorization** (Password hashing, JWT, route protection)
- [ ] **Phase 7: Asynchronous Background Processing** (Redis, BullMQ, worker process, idempotency)
- [ ] **Phase 8: Server-Sent Events (SSE)** (Real-time progress streaming to the client)
- [ ] **Phase 9: Reliability & Testing** (Unit/integration tests, evaluation suite, edge cases)
- [ ] **Phase 10: Deployment & Production** (Vercel, Render, Atlas, Redis, production configuration)
