"use strict";

const express = require("express");
const router = express.Router();
const Anuncio = require("../../models/Anuncio.js");

const thumbClient = require("../../lib/thumbClient");

// cargamos objeto de upload
const upload = require("../../lib/uploadConfig");

// controlador GET
// Consultar anuncios

router.get("/", async (req, res, next) => {
  try {
    // Extracción a variables de los parámetros de entrada
    const nombre = req.query.nombre;
    const venta = req.query.venta;
    const precio = req.query.precio;
    const foto = req.query.foto;
    const tag = req.query.tag;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const sort = req.query.sort;
    //const fields = req.query.fields + " -_id"; // Eliminamos el _id de la respuesta
    const fields = req.query.fields;

    console.log(req.query);

    const filtro = {};

    if (typeof nombre !== "undefined") {
      filtro.nombre = new RegExp("^" + nombre, "i");
    }

    if (typeof venta !== "undefined") {
      filtro.venta = venta;
    }

    if (typeof precio !== "undefined") {
      if (precio.includes("-")) {
        const p_min = precio.split("-")[0];
        const p_max = precio.split("-")[1];
        console.log("p_min :" + p_min + " p_max: " + p_max);
        filtro.precio = { $gte: p_min, $lte: p_max };

        if (p_min === "") {
          console.log("pmin vacio");
          filtro.precio = { $lte: p_max };
        }
        if (p_max === "") {
          console.log("pmax vacio");
          filtro.precio = { $gte: p_min };
        }
      } else {
        filtro.precio = precio;
      }
    }

    if (typeof foto !== "undefined") {
      filtro.foto = foto;
    }

    if (typeof tag !== "undefined") {
      console.log(tag);
      const regex = tag.split(" ").join("|");
      filtro.tag = { $regex: regex, $options: "i" };
    }

    const docs = await Anuncio.listar(filtro, skip, limit, sort, fields);

    res.json({ success: true, result: docs });
    //res.json({ docs });
  } catch (err) {
    next(err);
    return;
  }
});

// controlador GET
// Contar anuncios

router.get("/contar", async (req, res, next) => {
  try {
    const total = await Anuncio.find()
      .count()
      .exec();
    res.json({ success: true, result: total });
  } catch (err) {
    next(err);
    return;
  }
});

// controlador GET
// Mostrar tags

router.get("/tags", async (req, res, next) => {
  try {
    const total = await Anuncio.distinct("tag").exec();
    res.json({ success: true, result: total });
  } catch (err) {
    next(err);
    return;
  }
});

// controlador GET
// Consultar anuncios por _id

router.get("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const docs = await Anuncio.find({ _id: _id }).exec();
    res.json({ success: true, result: docs });
  } catch (err) {
    next(err);
    return;
  }
});

// controlador POST
// Añadir un anuncio

// upload graba la imagen indicada en la ruta en  /public/images
// Grabamos los datos del form junto con la ruta de la imagen en MongoDB
// posteriormente el microservicio generará un thumbnail en la carpeta /public/images/thumbnails

router.post("/", upload.single("foto"), async (req, res, next) => {
  try {
    const data = req.body;
    const fotoSource = req.file.path;
    console.log("fotoSource:", fotoSource);

    data.foto = "/images/thumbnails/" + req.file.filename;
    // console.log('file:' , req.file);

    // Creación de nuevo documento basado en el modelo Anuncio para mongoose
    const anuncio = new Anuncio(data);
    console.log("Nuevo documento creado: ", data);

    // Grabación en mongodb por mongoose
    await anuncio.save((err, anuncioGuardado) => {
      res.json({ success: true, result: anuncioGuardado });
    });

    // Llamada al cliente del microservicio de generación Thumbnail
    console.log("llamada a microservicio", fotoSource);
    await thumbClient.resizer(fotoSource);
  } catch (err) {
    next(err);
    return;
  }
});

// Controlador DELETE /
// Eliminación de un anuncio a traves de su _id

router.delete("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    await Anuncio.remove({ _id: _id }).exec();
    res.json({ success: true });
  } catch (err) {
    next(err);
    return;
  }
});

// Controlador PUT
// Actualización de un anuncio

router.put("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const data = req.body;
    const anuncioActualizado = await Anuncio.findByIdAndUpdate(_id, data, {
      new: true
    });
    res.json({ success: true, result: anuncioActualizado });
  } catch (err) {
    next(err);
    return;
  }
});

module.exports = router;
