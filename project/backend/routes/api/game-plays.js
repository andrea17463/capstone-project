// POST /api/game-plays
// Start a new game round (requires active meeting)

// GET /api/game-plays/:gamePlayId
// Get specific game round (if meeting is active)

// GET /api/game-plays
// Get all game rounds involving the user (active meetings only)

// PUT /api/game-plays/:gamePlayId/guess
// Update a guess result (e.g., correct/incorrect)

// PUT /api/game-plays/:gamePlayId/prompt
// Update the "talk-about" or "roast" prompt post-guess

// DELETE /api/game-plays
// Automatically deletes all game rounds after the meeting ends (batch delete)