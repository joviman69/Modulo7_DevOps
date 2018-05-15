'use strict';

const cote = require('cote');

// cliente del servicio de generación de thumbnails

const requester = new cote.Requester({ name: 'thumbnail generator client' });

module.exports.resizer = function(image) {
    requester.send({
    type: 'resize', 
    source: image,
  }, res => {
     console.log(`thumbnail ${image} generation requested.`);
  });
}