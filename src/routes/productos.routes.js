const express = require('express');
const productosController = require('../controllers/productos.controller');
const md_autenticacion =  require('../middlewares/autenticacion');

const api = express.Router()



api.put('/editarProducto/:idProducto',md_autenticacion.Auth, productosController.editarProducto);
api.post('/agregar', productosController.agregarProducto);
api.delete('/eliminarProducto/:idProducto', md_autenticacion.Auth,productosController.eliminarProducto);
api.get('/productos', productosController.obtenerProductos);

module.exports = api;