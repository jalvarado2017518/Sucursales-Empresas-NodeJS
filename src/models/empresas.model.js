
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpresasSchema = Schema({
    nombre: String,
    email: String,
    usuario: String,
    password: String,
    rol: String,
    tipoEmpresa: String
});

module.exports = mongoose.model('Empresa', EmpresasSchema);
