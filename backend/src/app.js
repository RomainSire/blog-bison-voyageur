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

// import routes
const articleRoutes = require('./routes/article');

// Lancement de Express
const app = express();

/**
 * CONNEXION BDD
 */
  mongoose.connect(process.env.MONGODB_PATH_PROD,
    { useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true})
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
// BODY-PARSER: Parse le body des requetes en json
app.use(bodyParser.json());
// HELMET: Sécurisation des headers
app.use(helmet());
// MORGAN: Log toutes les requêtes passées au serveur
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

/**
 * ROUTES
 */
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/api/article', articleRoutes);

module.exports = app;
