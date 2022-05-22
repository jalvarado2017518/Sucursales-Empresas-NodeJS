const Sucursales = require('../models/productosSucursales.model');
const ProductoSucursal = require('../models/productosSucursales.model');
const Producto = require('../models/productos.model')

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
    var parametros = req.body;//empresa aqui abajo
    if (req.user.rol != 'SuperAdmin') return res.status(500).send({ message: 'Solo las empresas pueden acceder a esta información' })
    if (parametros.cantidadVendida) return res.status(500).send({ message: "Este campo no se puede agregar" });
    if (parametros.stock <= 0) return res.status(500).send({ message: "Debe ingresar un digito mayor a 0" })
    if (parametros.nombreProducto && parametros.stock && parametros.nombreSucursal
        && parametros.nombreProducto != "" && parametros.stock != "" && parametros.nombreSucursal != "") {
        Sucursales.findOne({ nombreSucursal: parametros.nombreSucursal, idEmpresa: req.user.sub }, (err, sucursalEncontrada) => {
            if (err) return res.status(400).send({ message: 'Sucursal no encontrada, intente de nuevo' });
            if (!sucursalEncontrada) return res.status(400).send({ message: 'Esta sucursal no existe' })
            ProductoSucursal.findOne({ nombreProducto: parametros.nombreProducto, idSucursal: sucursalEncontrada._id }, (err, productoEncontradoSucursal) => {
                if (err) return res.status(404).send({ message: 'Error en la petición' })
                if (productoEncontradoSucursal == null) {
                    Producto.findOne({ NombreProducto: parametros.nombreProducto, idEmpresa: req.user.sub }, (err, productoEmpresaStock) => {
                        if (err) return res.status(400).send({ message: 'Esta sucursal no existe' });
                        if (!productoEmpresaStock) return res.status(400).send({ message: 'El producto no existe en la empresa' })
                        if (parametros.stock <= 0) return res.status(500).send({ message: 'Debe ingresar un digito mayor a 0' });
                        if (productoEmpresaStock.Stock == 0) return res.status(500).send({ message: 'Stock agotado, ingrese mas productos en la empresa' })
                        if (parametros.stock > productoEmpresaStock.Stock) {
                            return res.status(500).send({ message: 'No hay suficiente stock' });
                        }
                        var ProductosSucursalModelo = new ProductoSucursal();
                        ProductosSucursalModelo.nombreProducto = parametros.nombreProducto;
                        ProductosSucursalModelo.stock = parametros.stock;
                        ProductosSucursalModelo.idSucursal = sucursalEncontrada._id;
                        ProductosSucursalModelo.idEmpresa = req.user.sub;
                        ProductosSucursalModelo.cantidadVendida = 0;

                        var restarStock = (parametros.stock * -1)
                        ProductosEmpresa.findOneAndUpdate({ _id: productoEmpresaStock._id, idEmpresa: req.user.sub }, { $inc: { Stock: restarStock } }, { new: true }, (err, productoEmpresaEditado) => {
                            if (err) return res.status(500).send({ message: 'No se pudo editar el producto de la empresa' });
                            if (!productoEmpresaEditado) return res.status(404).send({ message: 'No se ha podido encontrar el producto para editar' });
                            ProductosSucursalModelo.save((err, ProductoGuardado) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                                if (!ProductoGuardado) return res.status(404).send({ message: 'No hay productos' });
                                return res.status(200).send({ ProductosSucursal: ProductoGuardado });
                            });
                        })

                    })
                } else {
                    var restarStock = (parametros.stock * -1)
                    Producto.findOne({ NombreProducto: parametros.nombreProducto, idEmpresa: req.user.sub }, (err, productoEmpresaStock) => {
                        if (err) return res.status(400).send({ message: 'Sucursal no encontrada, intente de nuevo' });
                        if (!productoEmpresaStock) return res.status(400).send({ message: 'El producto no existe en la empresa' })
                        if (parametros.stock <= 0) return res.status(500).send({ message: 'Debe ingresar un digito mayor a 0' });
                        if (productoEmpresaStock.Stock == 0) return res.status(500).send({ message: 'Stock agotado, ingrese mas productos en la empresa' })
                        if (parametros.stock > productoEmpresaStock.Stock) {
                            return res.status(500).send({ message: 'No hay suficiente stock' });
                        }
                        Producto.findOneAndUpdate({ _id: productoEmpresaStock._id, idEmpresa: req.user.sub }, { $inc: { Stock: restarStock } }, { new: true }, (err, productoEmpresaEditado) => {
                            if (err) return res.status(500).send({ message: 'No se pudo editar el producto de la empresa' });
                            if (!productoEmpresaEditado) return res.status(404).send({ message: 'El producto no existe en la empresa' });

                            ProductoSucursal.findOneAndUpdate({ _id: productoEncontradoSucursal._id }, { $inc: { stock: parametros.stock } }, { new: true }, (err, productoSucursalEditado) => {
                                if (err) return res.status(500).send({ message: 'No se pudo editar el producto de la empresa' });
                                if (!productoSucursalEditado) return res.status(404).send({ message: 'No se encontraron productos para editar' });
                                return res.status(200).send({ ProductosSucursal: productoSucursalEditado });
                            });
                        })
                    });

                }
            })
        })
    } else {
        return res.status(500).send({ message: 'Ingrese todos los datos necesarios' });
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