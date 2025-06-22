// middleware/auth.js
const mockAuth = (req, res, next) => {
  // Simulate logged-in user
  req.user = { id: "mock-user-id-123" };
  next();
};

module.exports = mockAuth;
