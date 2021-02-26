/**
 * IMPORTS
 */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require("express-rate-limit");

// import routes
const articleRoutes = require('./routes/article');
const userRoutes = require('./routes/user');

// Lancement de Express
const app = express();

/**
 * CONNEXION BDD
 */
const dbPath = process.env.NODE_ENV === 'test' ? process.env.MONGODB_PATH_TEST : process.env.MONGODB_PATH_PROD;
mongoose.connect(dbPath, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/**
 * MIDDLEWARES
 */
// CORS: Configuration cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
// HELMET: Sécurisation des headers
app.use(helmet());
// Express Rate Limit
const limiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 60 // limit each IP to 60 requests per windowMs
});
app.use(limiter);
// MORGAN: Log toutes les requêtes passées au serveur (Désactivé lors des tests)
if (process.env.NODE_ENV !== 'test') {
  const accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), { flags: 'a' });
  app.use(morgan('combined', { stream: accessLogStream }));
}
// BODY-PARSER: Parse le body des requetes en json
app.use(bodyParser.json());

/**
 * ROUTES
 */
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/api/auth', userRoutes);
app.use('/api/article', articleRoutes);
// app.use('/api/pics', picsRoutes);

module.exports = app;
