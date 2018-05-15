"use strict";

const Usuario = require("../../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class LoginController {
  
  // POST a /authenticate
  async authenticate(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Usuario.findOne({ email: email });

    // Comprobar usuario encontrado y verificar la clave del usuario
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.json({ success: false, error: "Usuario o contraseña incorrectos" });
      return;
    }

    // el usuario está y coincide la password
    jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: 30 //El token caduca a los 30 segundos
      },
      (err, token) => {
        if (err) {
          next(err);
          return;
        }
        res.json({ success: true, token: token });
      }
    );
  }
}

module.exports = new LoginController();
