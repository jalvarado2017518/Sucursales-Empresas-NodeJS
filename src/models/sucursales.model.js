const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SucursalesSchema = Schema({
    nombre: String,
    direccion: String, 
    idEmpresa: {type: Schema.Types.ObjectId, ref: 'Empresas'}
});

module.exports = mongoose.model('Sucursales', SucursalesSchema)