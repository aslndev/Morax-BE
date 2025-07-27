import cors from 'cors';

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: (process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,PATCH,OPTIONS').split(','),
  allowedHeaders: (process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization,X-Requested-With,Accept,Origin').split(','),
  credentials: process.env.CORS_CREDENTIALS === 'true',
  optionsSuccessStatus: 200
};

export const corsMiddleware = cors(corsOptions);

export default corsMiddleware; 