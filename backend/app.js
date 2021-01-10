const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const helmet = require('helmet');

// Lancement de Express
const app = express();

/**
 * MIDDLEWARES
 */
// Configuration cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
// Parse le body des requetes en json
app.use(bodyParser.json());
// Sécurisation des headers
app.use(helmet());
// Log toutes les requêtes passées au serveur
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

/**
 * ROUTES
 */
app.use('/images', express.static(path.join(__dirname, 'images')));

// test si tout fonctionne
app.use('/api/toto', (req, res, next) => {
  res.status(200).json({ 'hello': 'hello World' });
});

module.exports = app;
