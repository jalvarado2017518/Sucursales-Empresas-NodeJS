const express = require('express');
const productoSucursalesControlador = require('../controllers/productosSucursales.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();


api.get('/obtenerProductosSucursales/:idSucursal', md_autenticacion.Auth, productoSucursalesControlador.obtenerProductosSucursales);
api.put('/agregarProductos/:idProducto', md_autenticacion.Auth, productoSucursalesControlador.agregarProductoSucursal);
api.put('/modificarStock/:idProducto', md_autenticacion.Auth, productoSucursalesControlador.modificarStock);
api.delete('/eliminarProductosSucursales/:idProducto', md_autenticacion.Auth, productoSucursalesControlador.eliminarProductoSucursal);

module.exports = api;