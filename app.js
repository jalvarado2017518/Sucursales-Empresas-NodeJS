// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
const EmpresaRutas = require('./src/routes/empresas.routes');
const ProductosRutas = require('./src/routes/productos.routes');
const SucursalesRutas = require('./src/routes/sucursales.routes');
const ProductosSucursalesRutas = require('./src/routes/productosSucursales.routes');

// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', EmpresaRutas);
app.use('/api', ProductosRutas, SucursalesRutas, ProductosSucursalesRutas);


module.exports = app;
