"use strict";

const mongoose = require("mongoose");
const conn = require("../lib/connectMongoose");
const Usuario = require("../models/Usuario");

conn.once("open", async () => {
  try {
    await initUsuarios();
    conn.close();
  } catch (err) {
    console.log("Error cargando usuario a MongoDB:", err);
    process.exit(1);
  }
});

async function initUsuarios() {
  const deleted = await Usuario.deleteMany();

  console.log(`Eliminados ${deleted.n} usuarios.`);
  const inserted = await Usuario.insertMany([
    {
      name: "user",
      email: "user@example.com", // Usuario y password marcado por la práctica
      password: await Usuario.hashPassword("1234") // Lo recomendado es utilizar valores de .env
    }
  ]);
  console.log(`Usuario "user@example.com" creado.`);
}
