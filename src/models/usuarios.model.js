
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    nombre: String,
    email: String,
    password: String,
    rol: String,
    productos: String,
    cantidad: String,
    tipoEmpresa: String
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);