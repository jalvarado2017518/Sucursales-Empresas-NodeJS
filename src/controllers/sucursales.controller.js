const Sucursales = require('../models/sucursales.model');
const Empresas = require('../models/empresas.model');

function obtenerSucursales (req, res) {
    Sucursales.find((err, sucursalesObtenidas) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ sucursales: sucursalesObtenidas })

    })
}

function agregarSucursal(req, res) {
    var parametros = req.body;
    var sucursalModelo = new Sucursales();

    if (parametros.nombre && parametros.direccion && parametros.idEmpresa) {
        sucursalModelo.nombre = parametros.nombre;
        sucursalModelo.direccion = parametros.direccion;
        sucursalModelo.idEmpresa = parametros.idEmpresa;

        Sucursales.find({ nombre: parametros.nombre }, (err, sucursalEncontrada) => {         
            if (sucursalEncontrada.length == 0) {
                
                    sucursalModelo.save((err, sucursalGuardada) => {
                        if (err) return res.status(500)
                            .send({ mensaje: "Error enn la peticion" });
                        if (!sucursalGuardada) return res.status(500)
                            .send({ mensaje: "Error al agregar" });

                        return res.status(200).send({ empresa: sucursalGuardada });
                    });
                
            } else {
                return res.status(500)
                    .send({ mensaje: "Este correo esta en uso" });
            }
        })
        
    }
}


function editarSucursal(req, res) {
    var idSucursal = req.params.idSucursal;
    var parametros = req.body;

    if (req.user.rol == 'Empresa') {
        return res.status(500).send({ mensaje: "No eres admin, no puedes editar" });
    } else {
        Sucursales.findByIdAndUpdate(idSucursal, parametros, { new: true }, (err, sucursalActualizada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!sucursalActualizada) return res.status(500).send({ mensaje: "Error al editar" });

            return res.status(200).send({ sucursal: sucursalActualizada });
        });

    }
}


function eliminarSucursal(req, res) {
    var idSuc = req.params.idSucursal;
    if(req.user.rol == 'Empresa'){
        return res.status(500).send({mensaje: 'No tienes permiso para realizar esta accion'});
    }else{
        Sucursales.findByIdAndDelete(idSuc, (err, sucursalEliminada) => {
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!sucursalEliminada) return res.status(404).send( { mensaje: 'Error no se a podido eliminar el producto'});
    
            return res.status(200).send({ sucursal: sucursalEliminada});
        });
    }
}

module.exports = {
    obtenerSucursales,
    agregarSucursal,
    eliminarSucursal,
    editarSucursal
    
}