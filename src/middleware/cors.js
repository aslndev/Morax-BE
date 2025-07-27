import cors from 'cors';

const getCorsOptions = () => {
  const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*'];
  const useCredentials = process.env.CORS_CREDENTIALS === 'true';
  
  if (allowedOrigins.includes('*') && useCredentials) {
    return {
      origin: false,
      methods: (process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,PATCH,OPTIONS').split(','),
      allowedHeaders: (process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization,X-Requested-With,Accept,Origin').split(','),
      credentials: false,
      preflightContinue: false,
      optionsSuccessStatus: 204
    };
  }
  
  return {
    origin: function (origin, callback) {
      if (allowedOrigins.includes('*')) {
        callback(null, true);
      } else if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: (process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,PATCH,OPTIONS').split(','),
    allowedHeaders: (process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization,X-Requested-With,Accept,Origin').split(','),
    credentials: useCredentials,
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
};

export const corsMiddleware = cors(getCorsOptions());

export default corsMiddleware; 