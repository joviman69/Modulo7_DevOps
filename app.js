var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var index = require("./routes/index");
var users = require("./routes/users");

const jwtAuth = require("./lib/jwtAuth");

// Conexión a base de datos 'mongodb://localhost/nodepop'
require("./lib/connectMongoose");

// Carga del modelo Anuncio y de Usuario para mongoose
require("./models/Anuncio");
require("./models/Usuario");

// Reseteo de la base de datos
// require('./lib/load');

const loginController = require("./routes/apiv1/loginController");

var app = express();

// locals
app.locals.title = "Nodepop App";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").__express);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configuración del modulo de internacionalización
const i18n = require("./lib/i18nConfigure")();
app.use(i18n.init);

console.log();

/** Middlewares de app */

app.use("/", index); // ruta raiz
app.use("/users", users); // ruta /users
app.use("/lang" ,require('./routes/lang')); // ruta /users

/** Middlewares de apiv1 */
app.use("/apiv1/anuncios", jwtAuth(), require("./routes/apiv1/anuncios"));
app.use("/apiv1/authenticate", loginController.authenticate);

/** Middlewares de la web */
app.use("/anuncios", require("./routes/anuncios"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (err.array) {
    // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  res.status(err.status || 500);

  // Si es una petición de API, el error lo responde con JSON
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // Respondo con una página de error

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.render("error");
});

function isAPI(req) {
  return req.originalUrl.indexOf("/apiv") === 0;
}

module.exports = app;
