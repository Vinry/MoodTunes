require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET;

if (!mongoUri || !/^mongodb(?:\+srv)?:\/\//.test(mongoUri)) {
  throw new Error(
    'Set MONGODB_URI to a development database connection string. See backend/.env.example.'
  );
}

if (!sessionSecret || sessionSecret === 'replace-with-a-random-development-secret') {
  throw new Error(
    'Set SESSION_SECRET to a new random development secret. See backend/.env.example.'
  );
}

module.exports = { mongoUri, sessionSecret };
