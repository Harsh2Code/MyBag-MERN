require('dotenv').config();

const mongoURI = 'mongodb+srv://steepclaw:pA1gv2WVIwPEP54D@mybag.7chzyqm.mongodb.net/auth-app?retryWrites=true&w=majority&appName=MyBag';

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
