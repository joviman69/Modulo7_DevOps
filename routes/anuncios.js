"use strict";
const fs = require("fs");
const express = require("express");
const router = express.Router();

const Anuncio = require("../models/Anuncio.js");

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
      //filtro.nombre = nombre;
      filtro.nombre = new RegExp("^" + nombre, "i");
    }

    // if (venta !== 'undefined' && !(typeof venta !== 'undefined')) {
    if (typeof venta !== "undefined") {
      if (venta !== "") {
        filtro.venta = venta;
      }
    }

    if (typeof precio !== "undefined") {
      if (precio !== "") {
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
    }
    // if (typeof foto !== 'undefined') {
    //   filtro.foto = foto;
    // }

    if (typeof tag !== "undefined") {
      // console.log(tag);
      // const regex = tag.split(" ").join("|");
      // filtro.tag = { $regex: regex, $options: "i" };
      filtro.tag = tag;
    }
    const docs = await Anuncio.listar(filtro, skip, limit, sort, fields);

    res.render("front", { query: filtro, resultados: docs });
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
    res.render("datos", {
      datos: "Número total de registros",
      resultados: total
    });
  } catch (err) {
    next(err);
    return;
  }
});

// // controlador GET
// // drop a colección anuncios

// router.get('/clear', async (req, res, next) => {
//     try {
//         await Anuncio.collection.drop();
//         res.render('datos', {datos: "Funcion clear invocada",resultados: 'Collection anuncios borrada' });

//   } catch(err) {
//         next(err);
//         return;
//   }
// });

// // controlador GET
// // cargar la colección anuncios desde anuncios.json

// router.get('/load', async (req, res, next) => {
//     try {
//         const anuncios = JSON.parse(fs.readFileSync('public/anuncios.json', 'utf-8'));

//         await Anuncio.insertMany(anuncios);

//         console.log('anuncios.json importada a la base de datos');
//         res.render('datos', {datos: "Funcion load invocada", resultados: "Colección <anuncios> importada" });

//   } catch(err) {
//         next(err);
//         return;
//   }
// });

// controlador GET
// Mostrar tags

router.get("/tags", async (req, res, next) => {
  try {
    const tags = await Anuncio.distinct("tag").exec();
    res.render("tags", { datos: Etiquetas , resultados: tags });
  } catch (err) {
    next(err);
    return;
  }
});

// controlador GET
// Consultar anuncios por _id

// router.get("/:id", async (req, res, next) => {
//   try {
//     const _id = req.params.id;
//     const docs = await Anuncio.find({ _id: _id }).exec();
//     // res.json({ success: true, result: docs });
//     res.render("datos", { datos: "Datos anuncio", resultados: docs });
//   } catch (err) {
//     next(err);
//     return;
//   }
// });

// // controlador POST
// // Añadir un anuncio

// router.post('/', async (req, res, next) => {
//         try {
//             const data = req.body;
//             //console.log(req.body);
//             console.log('Nuevo documento creado: ', data);

//             // Creación de nuevo documento basado en el modelo Anuncio para mongoose
//             const anuncio = new Anuncio(data);

//             // Grabación en mongodb por mongoose
//             await anuncio.save((err, anuncioGuardado) => {
//                 res.json({ success: true, result: anuncioGuardado });
//                 });

//         } catch(err) {
//             next(err);
//             return;
//       }
//     });

//     // Controlador DELETE /
//     // Eliminación de un anuncio a traves de su _id

// router.delete('/:id', async (req, res, next) => {
//     try {
//         const _id = req.params.id;
//         await Anuncio.remove({_id: _id}).exec();
//         res.json({ success: true });
//     } catch(err) {
//         next(err);
//         return;
//     }
// });

//     // Controlador PUT
//     // Actualización de un anuncio

// router.put('/:id', async (req, res, next) => {
//     try {
//         const _id = req.params.id;
//         const data = req.body;
//         const anuncioActualizado = await Anuncio.findByIdAndUpdate(_id, data, {
//         new: true });
//         res.json({ success: true, result: anuncioActualizado });

//     } catch(err) {
//         next(err);
//         return;
//   }
// });

module.exports = router;
