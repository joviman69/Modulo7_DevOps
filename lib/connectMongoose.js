'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

conn.on('error', (err) => {
  console.log('Error de conexión', err);
  process.exit(1);
});

conn.once('open', () => {
//  console.log('Conectado a MongoDB vía Mongoose en', mongoose.connection.name);
  console.log('Conectado a MongoDB vía Mongoose en', conn.name);
});

mongoose.connect('mongodb://localhost/nodepop');

module.exports = conn;