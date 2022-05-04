const express = require('express');
const productosController = require('../controllers/productos.controller');
const md_autenticacion =  require('../middlewares/autenticacion');

const api = express.Router()



api.put('/editarProducto/:idProducto', productosController.editarProducto);
api.post('/agregarProducto', productosController.agregarProducto);
api.delete('/eliminarProducto/:idProducto',productosController.eliminarProducto);
api.get('/productos',md_autenticacion.Auth,productosController.obtenerProductos);
api.get('/productos/:idProducto', productosController.ObtenerProductosId);


module.exports = api;