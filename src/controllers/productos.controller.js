const Productos = require('../models/productos.model');

function agregarProducto (req, res){
    var parametros = req.body;
    var productoModelo = new Productos();

    if( parametros.nombre && parametros.nombreProveedor && parametros.stock ) {
        productoModelo.nombre = parametros.nombre;
        productoModelo.nombreProveedor = parametros.nombreProveedor;
        productoModelo.stock = parametros.stock;
        productoModelo.save((err, productoGuardado) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!productoGuardado) return res.status(404).send( { mensaje: "Error, no se agrego ningun producto"});

            return res.status(200).send({ producto: productoGuardado });
        })
    }
}

function editarProducto (req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;

    if(req.user.rol == 'Empresa'){
        return res.status(500).send({mensaje: 'No tienes permiso para realizar esta accion'});
    }else{
        Productos.findByIdAndUpdate(idProd, parametros, { new: true } ,(err, productoActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!productoActualizado) return res.status(404).send( { mensaje: 'Error, no a podido editar el producto'});
        
            return res.status(200).send({ producto: productoActualizado});
        });
        
    }
}

function eliminarProducto(req, res) {
    var idProd = req.params.idProducto;
    if(req.user.rol == 'Empresa'){
        return res.status(500).send({mensaje: 'No tienes permiso para realizar esta accion'});
    }else{
        Productos.findByIdAndDelete(idProd, (err, productoEliminado) => {
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!productoEliminado) return res.status(404).send( { mensaje: 'Error no se a podido eliminar el producto'});
    
            return res.status(200).send({ producto: productoEliminado});
        });
    }
}

function obtenerProductos (req, res) {
    Productos.find((err, productosObtenidos) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ productos: productosObtenidos })

    })
}

module.exports = {
    obtenerProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto
}
