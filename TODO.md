# TODO: Implement Mood and Insight Analysis for Journal Entries

## Backend Updates
- [x] Update Journal model (backend/models/Journal.js): Add "mood" field (String).
- [x] Modify /journal/create route (backend/routes/journalRoutes.js): Analyze text using AI API to assign mood category (happy, sad, stressed, calm, neutral).
- [x] Add new GET /journal/insights route (backend/routes/journalRoutes.js): Analyze all user entries, return mood frequency count and AI-generated summary.

## Frontend Updates
- [x] Install recharts library (frontend/package.json).
- [x] Create new InsightsPage.js (frontend/src/pages/InsightsPage.js): Fetch /insights, display pie chart for mood distribution, show AI summary.
- [x] Update App.js (frontend/src/App.js): Add route for InsightsPage.
- [x] Update DashboardPage.js (frontend/src/pages/DashboardPage.js): Add link or section to navigate to insights.

## Followup Steps
- [x] Install dependencies (run npm install in frontend).
- [ ] Test mood analysis and insights display.
