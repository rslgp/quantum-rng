import 'dotenv/config'
import express from "express";
import cors from 'cors';
import { authRouter, initAuth, isAuthRoute } from "./routes/auth/auth_core.js";
import rateLimiter, { paySomeLimit } from './routes/middleware/rate_limit.js';
import consultQuantum from './routes/service/quantum.js';
import setupWebhook from './routes/payment/webhook.js';
import setupWebhookStripe from './routes/payment/stripe/webhook_stripe.js';
import paymentRouter from './routes/payment/paymentRouter.js';
import eventRouter from './routes/events/event_core.js';
import {getUserId} from './routes/lib/userId/userId_util.js';
import adaptChat from './routes/middleware/text_chat.js';

const app = express();
setupWebhookStripe(app, express);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true); // use req.ip


initAuth(app);

app.use(cors({
  origin: ['localhost:5173', 'https://dashing-swift-precious.ngrok-free.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent with requests
}));

// app.options('*', cors());

// Use authRouter for authentication routes
app.use("/auth", authRouter);
app.use("/payment", paymentRouter);
app.use("/event", eventRouter);

// Routes
app.get("/", (req, res) => {
  console.log(req.headers['x-forwarded-for'], req.socket.remoteAddress);
  res.send('<a href="/auth/google">Sign in with Google</a>');
});

// Protected dashboard route
app.get("/dashboard", isAuthRoute, (req, res) => {
  res.send(`Welcome, ${req.user.name}! <a href="/auth/logout">Logout</a>`);
});


app.get("/DEBUG/count", rateLimiter, (req, res) => {
  res.send(`Welcome, ${req.user?.name || 'anom'} ${req.usage}! <a href="/auth/logout">Logout</a>`);
});

app.get("/DEBUG/reduce/:amount", async (req, res) => {
  const { amount } = req.params;
  const id = getUserId(req);
  const requestCount = await paySomeLimit(id, amount);
  if (req.user) req.user.usage = requestCount;
  req.usage = requestCount;
  res.send(`Welcome, ${req.user?.name || 'anom'} ${req.usage}! <a href="/auth/logout">Logout</a>`);
});

app.get('/vacuumquantum', adaptChat, rateLimiter, consultQuantum);

setupWebhook(app);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


export { app };