require('dotenv').config();

const mongoURI = 'mongodb+srv://<USERNAME>:<PASSWORD>@mybag.7chzyqm.mongodb.net/DATABASE?retryWrites=true&w=majority&appName=APPNAME';

// Mask password in connection string for logging
let maskedMongoURI = mongoURI;
if (mongoURI.startsWith('mongodb+srv://')) {
  maskedMongoURI = mongoURI.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/, '$1*****$3');
}

// console.log('Using MongoDB URI:', maskedMongoURI);

module.exports = {
  mongoURI,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-here'
};
