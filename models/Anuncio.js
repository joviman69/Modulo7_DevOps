'use strict';

const mongoose = require('mongoose');

// Definición del Schema del modelo Anuncio
const anuncioSchema = mongoose.Schema({
    
    nombre: { type: String, index: true },
    venta: Boolean,
    precio: Number,
    foto: String,
    tag: [String]
     
});

// Creación de método estático listar en modelo Anuncio
anuncioSchema.statics.listar = function(filtro, skip, limit, sort, fields, callback) {
    
    const query = Anuncio.find(filtro);

    query.skip(skip); 
    query.limit(limit);
    query.sort(sort);
    query.select(fields);

    return query.exec(callback);  // Ejecución de la query
  };
// Creacción del modelo Anuncio
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

// Exportación del modelo Anuncio
module.exports = Anuncio;
