const express = require('express');
const sucursalesController = require('../controllers/sucursales.controller');
const md_autenticacion =  require('../middlewares/autenticacion');

const api = express.Router()

api.put('/editarSucursal/:idSucursal',md_autenticacion.Auth, sucursalesController.editarSucursal);
api.post('/agregarSucursal', sucursalesController.agregarSucursal);
api.delete('/eliminarSucursal/:idSucursal', md_autenticacion.Auth, sucursalesController.eliminarSucursal);
api.get('/productos', sucursalesController.obtenerSucursales);

module.exports = api;
