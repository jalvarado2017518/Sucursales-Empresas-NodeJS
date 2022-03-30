const express = require('express');
const usuarioControlador = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/registrar', usuarioControlador.Registrar);
api.post('/login', usuarioControlador.Login);
api.put('/editarUsuario/:idUsuario',md_autenticacion.Auth,  usuarioControlador.EditarUsuario);
api.delete('/eliminarUsuario/:idUsuario',md_autenticacion.Auth,  usuarioControlador.EliminarEmpresa);

module.exports = api;