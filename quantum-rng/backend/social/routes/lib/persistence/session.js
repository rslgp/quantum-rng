
import session from 'express-session';
import {redisStore} from './redis/redis_core.js';

const persist_session = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET, // Replace with a strong secret key
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something is stored
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // Session expiration time (e.g., 1 day)
  },
});

// session({ // no persistence
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
// });


export default persist_session;
