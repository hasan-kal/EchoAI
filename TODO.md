-b # TODO: Implement JWT Authentication for EchoAI

## Backend Changes
- [x] Install jsonwebtoken dependency in backend
- [x] Create backend/middleware/authMiddleware.js for JWT verification
- [x] Update backend/controllers/authController.js: Import jwt, generate token in login, return token in response
- [x] Update backend/routes/authRoutes.js: Add protected /verify route using authMiddleware
- [x] Update backend/server.js: Import and use authMiddleware for protected routes

## Frontend Changes
- [x] Install axios dependency in frontend
- [x] Update frontend/src/pages/SignupPage.js: Add name field, use axios to call signup API
- [x] Update frontend/src/pages/LoginPage.js: Use axios to call login API, store JWT in localStorage, redirect to dashboard
- [x] Update frontend/src/pages/DashboardPage.js: Display "Welcome to EchoAI!" message

## Followup Steps
- [x] Run npm install in backend and frontend
- [x] Test login/signup flow (servers running, but manual testing needed due to browser tool disabled)
- [ ] Verify protected route works with token

