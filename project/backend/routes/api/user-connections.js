// POST /api/connections
// Create a new connection (e.g., a match or meeting request)

// GET /api/connections
// Get all connections for the current user

// GET /api/connections/:userId
// Get specific connection between current user and another user

// PUT /api/connections/:connectionId/status
// Update connection status (e.g., "pending" → "accepted")

// PUT /api/connections/:connectionId/meeting
// Update meeting status (e.g., "pending" → "confirmed")

// PUT /api/connections/:connectionId/feedback
// Indicate whether the user wants to meet again

// DELETE /api/connections/:connectionId
// Remove/cancel a connection