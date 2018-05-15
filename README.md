# Nodepop AVANZADO (Práctica del módulo 5)

NodeJs, Express y MongoDB

Internacionalización, subida de imágen en background y auntenticación JWT.

### NOTA: Es necesario ejecutar en segundo plano el microservicio de generación de thumbnails.

```
node ./lib/thumbService
```

### NOTA2: Es necesario ejecutar el siguiente script para insertar en MongoDB datos de ejemplo iniciales.

```
node ./scripts/load
```

### Features de la API

El esquema del modelo Anuncios es:

    nombre: String  // Contiene el nombre del artículo
    venta: Boolean  // true indica que el articulo está en venta, mientras que false indica que está en compra
    precio: Number  // precio del artículo
    foto: String    // ruta del archivo de imagen thumbnail del artículo
    tag: [String]   // etiquetas de categorías del anuncio (work, lifestyle, motor y mobile)

TODAS las respuestas de la api son a través un JSON compuesto de:

```
{
"success": true, // > Un boleano que nos informa del exito de la consulta
"result": Resultado // > El resultado obtenido
}  
```

Acceso a las características del API

http://servidor:puerto/apiv1/anuncios/
en esta práctica localhost:3000

Si no especificamos ninguna query a la API, ésta lista todos los anuncios en la base de datos como resultado.

* Mostrar el total de anuncios en la base de datos como resultado.

```
http://localhost:3000/apiv1/anuncios/contar
```

* Mostrar todas las tags de los anuncios como resultado.

```
http://localhost:3000/apiv1/anuncios/tags
```

* Mostrar el anuncio con una determinada \_id.

```
http://localhost:3000/apiv1/anuncios/<id>
ejemplo: http://localhost:3000/apiv1/anuncios/5a89c6390774ae0f17e0b61b
```

* Insertar anuncios. (metodo POST)

```
http://localhost:3000/apiv1/anuncios/

Pasandole el documento
{nombre: 'Raqueta', venta: true, precio: 300, foto: <IMAGEN>, tag: ['lifestyle']}
```

* Borrar anuncios con una determinada \_id. (metodo DELETE)

```
http://localhost:3000/apiv1/anuncios/<id>
ejemplo: http://localhost:3000/apiv1/anuncios/5a89c6390774ae0f17e0b61b
```

* Actualizar anuncios con una determinada \_id. (metodo PUT)

```
http://localhost:3000/apiv1/anuncios/<id>
ejemplo: http://localhost:3000/apiv1/anuncios/5a89c6390774ae0f17e0b61b
```

* Mostrar solo los campos indicados en el resultado, además del \_id del documento.
  Admite indicar varios campos separados por espacios

```
http://servidor:puerto/apiv1/anuncios?fields=<campo1 campo2>
```

##### Filtros

```
http://servidor:puerto/apiv1/anuncios?<campo>=<valor>
```

    nombre=string                                   // (o subcadena inicial del nombre)
    venta=boolean                                   // true = anuncios enta, false = anuncios compra
    precio=[n] | [min-max] | [min-] | [-max]        // valor exacto o un rango de precios
    tag=string                                      // filtra por anuncios que contienen dicha tag

**sort**=_campo1 campo2_

admite indicar varios campos separados por espacios

**skip=n** _ignora los x primeros resultados_

**limit=n** _limita la salida a n resultados_

### Funciones especiales (Solamente para la práctica. En un entorno de producción sería peligroso)

Como indicabamos en las notas iniciales, es posible recargar la coleccion anuncios "predefinida"
en la base de datos a traves del siguiente script:

```
node ./scripts/load
```

Es posible borrar la colección anuncios a traves del siguiente script:

```
node ./scripts/clear
```

La API requiere una autentificación por JWT

```
http://servidor:puerto/apiv1/authenticate
```

### Autenticación de API con JWT

Se le deben pasar las credenciales por método POST

```
email: user@example.com
password: 1234
```

El token recibido tiene una caducidad de 30 segundos para facilitar sus pruebas.

La API tiene autenticación en la siguiente ruta:

```
http://servidor:puerto/apiv1/anuncios?token=<TOKEN RECIBIDO>
```

En caso de carecer de token válido (incorrecto o expirado) se nos devolverá un status 401 y un mensaje de error por JSON.

### Subida de imágenes en background

Hay implementado un microservicio de generación de thumbnails que se activa corriendo el script:

```
node ./lib/thumbService
```

La subida de imágenes debe realizarse insertando un anuncio en la aplicación a traves de un envío por método POST a la API (Podemos ayudarnos de la Postman para ello)

```
http://localhost:3000/apiv1/anuncios
```

Con los siguientes campos:

* nombre(texto)
* venta (boleano)
* precio (float)
* foto (fichero)
* tag (texto[work, lifestyle, mobile, motor])

El proceso se encarga de grabar el documento en la colección anuncios, sustituyendo el archivo de la imagen por la ruta donde se grabará su mininatura. Previamente, la imagen recibida se graba en /public/images. Posteriormente el requester de COTE envía un mensaje 'resize' al responder con la imagen a miniaturizar (con JIMP), la cual es grabada en /public/images/thumbnails.

Es importante no olvidar pasar un token válido junto con la petición.

Header
x-access-token: <TOKEN>

### Internacionalización

Traducción automática Español/Inglés de textos de la app pulsando en la bandera del idioma de la esquina superior derecha.