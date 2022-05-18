const Sucursales = require('../models/productosSucursales.model');
const ProductoSucursal = require('../models/productosSucursales.model');
const Producto = require('../models/productos.model');

function ObtenerProductoSucursalId(req, res){
    var idProd = req.params.idProducto;

    ProductoSucursal.findById(idProd, (err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEncontrado) return res.status(404).send( { mensaje: 'Error a la hora obtener los datos' });

        return res.status(200).send({ productos: productoEncontrado });
    })
}

function obtenerProductosSucursales(req, res) {
    var idSuc = req.params.idSucursal;
    if (req.user.rol == 'Empresa') {
        ProductoSucursal.find({ idSucursal: idSuc }, (err, productosSucursales) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!productosSucursales) return res.status(500).send({ mensaje: "Error a la hora de obtener los productos" });

            return res.status(200).send({ productos: productosSucursales });
        })
    }
}

function agregarProductoSucursal(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;
    var productoModel = new ProductoSucursal();
    if (req.user.rol == 'Empresa') {
        if (parametros.stock && parametros.nombreSucursal) {
            Producto.findById(idProd, (err, productoEncontrado) => {
                if (err) return res.status(500).send({ mensaje: "Error en  la Peticion" });
                if (!productoEncontrado) return res.status(404).send({ mensaje: "Error a la hora de buscar el producto" });

                productoModel.nombreProducto = productoEncontrado.nombreProducto;
                if (parametros.stock <= 0) return res.status(500).send({ mensaje: 'Debe ingresar un digito mayor a 0' })
                if (parametros.stock > productoEncontrado.stock) return res.status(500).send({ mensaje: 'Stock agotado, ingrese mas productos en la empresa' })
                productoModel.stock = parametros.stock;
                Sucursales.find({ nombreSucursal: parametros.nombreSucursal }, (err, sucursalEncontrada) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!sucursalEncontrada) return res.status(404).send({ mensaje: 'Error a la hora cargar las sucursales' });
                    productoModel.idSucursal = sucursalEncontrada[0]._id;
                    ProductoSucursal.find({ idSucursal: productoModel.idSucursal, nombreProducto: productoModel.nombreProducto }, (err, productoEncontrado) => {
                        if (productoEncontrado.length == 0) {
                            Producto.findByIdAndUpdate(idProd, { $inc: { stock: parametros.stock * -1 } }, { new: true }, (err, stockActualizado) => {
                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                if (!stockActualizado) return res.status(404).send({ mensaje: 'Error a la hora de modificar el stock' })
                                productoModel.save((err, productoGuardado) => {
                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                    if (!productoGuardado) return res.status(400).send({ mensaje: "Error a la hora de agregar el producto" });
                                    return res.status(200).send({ producto: productoGuardado });
                                })
                            })
                        } else {
                            Producto.findByIdAndUpdate(idProd, { $inc: { stock: parametros.stock * -1 } }, { new: true }, (err, stockActualizado) => {
                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                if (!stockActualizado) return res.status(404).send({ mensaje: 'Error en editar el stock' })
                                ProductoSucursal.findOneAndUpdate({ idSucursal: productoModel.idSucursal, nombreProducto: productoModel.nombreProducto }, 
                                    { $inc: { stock: parametros.stock } }, { new: true }, (err, stockSActualizado) => {
                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                    if (!stockSActualizado) return res.status(400).send({ mensaje: "Error a la hora de agregar el producto" });
                                    return res.status(200).send({ producto: stockSActualizado });
                                })
                            })
                        }
                    })
                })
            })
        } else {
            return res.status(500).send({ mensaje: "Llene todos los campos, por favor" })
        }
    }
}


function modificarStock(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;
    if (req.user.rol == 'Empresa') {
        if (parametros.stock) {
            if (parametros.stock <= 0) return res.status(500).send({ mensaje: 'Debe ingresar un digito mayor a 0' })
            ProductoSucursal.findById(idProd, (err, productoEncontrado)=>{
                if(parametros.stock>productoEncontrado.stock) return res.status(500).send({ mensaje: 'No cuenta con esa cantidad en stock, ingrese mas productos a la empresa'});
                ProductoSucursal.findByIdAndUpdate(idProd, { $inc: { stock: parametros.stock * -1 } }, { new: true }, (err, stockSActualizado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    if (!stockSActualizado) return res.status(400).send({ mensaje: "Error a la hora de modificar el stock" });
                    return res.status(200).send({ producto: stockSActualizado });
                })
            })
        }
    }
}

function eliminarProductoSucursal(req, res) {
    var idProd = req.params.idProducto;
    if (req.user.rol == 'Empresa') {
        ProductoSucursal.findByIdAndDelete(idProd, (err, productoEliminado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!productoEliminado) return res.status(404).send({ mensaje: 'Error a la hora de eliminar el producto' });

            return res.status(200).send({ producto: productoEliminado });
        })
    }
}




module.exports = {
    ObtenerProductoSucursalId,
    obtenerProductosSucursales,
    agregarProductoSucursal,
    modificarStock,
    eliminarProductoSucursal
}