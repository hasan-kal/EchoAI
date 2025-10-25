# EchoAI Day 7 Improvements - TODO

## Frontend (React)
- [x] Update App.js: Add route protection component to check JWT in localStorage and redirect to /login if absent.
- [x] Update DashboardPage.js: Restructure layout into sections (journal input, entries, insights). Add loading spinners during API calls. Implement error/success message states for submissions. Add logout button that clears localStorage and redirects to /.
- [x] Update LoginPage.js: Replace alert() with state-based error/success messages displayed in the UI.
- [x] Update SignupPage.js: Replace alert() with state-based error/success messages displayed in the UI.
- [x] Update AuthPages.css: Apply soft colors, better spacing, readable fonts for a modern feel.
- [x] Update DashboardPage.css: Apply soft colors, better spacing, readable fonts for a modern feel.

## Backend (Node.js)
- [x] Update journalRoutes.js: Implement in-memory caching for AI responses (with short TTL to limit duplicates). Enhance try/catch for all AI API interactions to handle errors gracefully.
- [x] Verify authMiddleware is on all protected routes (it is).

## Output
- [ ] Output all modified files separately with correct filenames.
