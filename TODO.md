# TODO: Add Memory and Journal Storage Features to EchoAI

## Backend Changes
- [x] Modify `/api/reflect` endpoint in `backend/server.js` to store user and AI messages in a memory array.
- [x] Implement saving memory to `journal.json` using fs module.
- [x] Add a new endpoint `/api/messages` to fetch previous messages.

## Frontend Changes
- [ ] Update `frontend/src/App.js` to fetch messages on app load.
- [ ] Modify `handleSubmit` to call backend `/api/reflect` and update messages state with real responses.
- [ ] Implement auto-scroll to the latest message in the messages display.

## Testing
- [ ] Test backend endpoints for storing and retrieving messages.
- [ ] Test frontend for persistence and auto-scroll functionality.
