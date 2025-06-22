const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const clerkPublicKey = process.env.CLERK_JWT_KEY; // PEM format
const backendSecret = process.env.BACKEND_JWT_SECRET; // Your own secret

// POST /api/auth/session
router.post("/session", (req, res) => {
  const { clerkToken } = req.body;
  if (!clerkToken) return res.status(400).json({ error: "Missing Clerk token" });

  try {
    // Verify Clerk JWT
    const payload = jwt.verify(clerkToken, clerkPublicKey, { algorithms: ["RS256"] });
    const userId = payload.sub;

    // Issue your own JWT
    const myToken = jwt.sign({ userId }, backendSecret, { expiresIn: "7d" });
    res.json({ token: myToken });
  } catch (err) {
    res.status(401).json({ error: "Invalid Clerk token" });
  }
});

module.exports = router; 