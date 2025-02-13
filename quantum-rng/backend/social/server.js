import 'dotenv/config'
import express from "express";
import cors from 'cors';
import { authRouter, initAuth, isAuthRoute } from "./routes/auth/core.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


initAuth(app);

app.use(cors({
  origin: ['localhost:5173','https://dashing-swift-precious.ngrok-free.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent with requests
}));

// app.options('*', cors());

// Use authRouter for authentication routes
app.use("/auth", authRouter);

// Routes
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Sign in with Google</a>');
});

// Protected dashboard route
app.get("/dashboard", isAuthRoute, (req, res) => {
  res.send(`Welcome, ${req.user.displayName}! <a href="/auth/logout">Logout</a>`);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
