"use strict";

const mongoose = require("mongoose");
const conn = require("../lib/connectMongoose");
const Anuncio = require("../models/Anuncio");

conn.once("open", () => {
  (async () => {
    try {
      await Anuncio.deleteMany();
      conn.close();
      
    } catch (err1) {
      console.log("Error en Anuncio.deleteMany()", err1);
    }
  })().catch(err => console.log(err));
});
