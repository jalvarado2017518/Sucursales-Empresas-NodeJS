const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var productosSucursalSchema = Schema({
    nombreProducto: String,
    stock: Number,
    cantidadVendida: Number,
    idSucursal: { type: Schema.Types.ObjectId, ref: 'Sucursales'}

})

module.exports=mongoose.model('productosSucursal',productosSucursalSchema)