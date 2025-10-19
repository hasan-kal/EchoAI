# TODO for Journaling System with AI Reflections

- [x] Create backend/models/Journal.js: Mongoose model with userId (ref User), content, aiResponse, date (default now)
- [x] Create backend/routes/journalRoutes.js: POST /journal/create (protected, generate AI response using HuggingFace, save entry) and GET /journal/all (protected, return user's entries)
- [x] Edit backend/server.js: Import and use journalRoutes under /api
- [x] Edit frontend/src/pages/DashboardPage.js: Add textarea, submit button (POST to /api/journal/create), display entries (GET /api/journal/all)

