const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')

function UsuarioInicial() {
    Usuarios.find({ rol: "SuperAdmin", usuario: "SuperAdmin" }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
          Usuarios.create({
            usuario: "SuperAdmin",
            password: passwordEncriptada,
            rol: "SuperAdmin",
          });
        });
      }
    });
  }
  
  function Login(req, res) {
    var parametros = req.body;
    Usuarios.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
                    if ( verificacionPassword ) {
                        // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    })
}
//MODIFICAR
function Registrar(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuarios();

    if(parametros.nombre && parametros.email &&  parametros.password) {
            usuarioModel.nombre = parametros.nombre;
            usuarioModel.email = parametros.email;
            usuarioModel.password = parametros.password;
            usuarioModel.rol = 'USUARIO';
            usuarioModel.productos = parametros.productos
            usuarioModel.cantidad = parametros.cantidad

            Usuarios.find({ email : parametros.email }, (err, usuarioEncontrado) => {
                if ( usuarioEncontrado.length == 0 ) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el Usuario'});
                            
                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })
    }
}
//MODIFICAR
function EditarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    var parametros = req.body;

   if(req.user.rol == 'USUARIO'){
    if(parametros.rol){
        return res.status(500).send({message: 'No puedes modificar el rol'})
    }else{
    Usuarios.findByIdAndUpdate({_id: req.user.sub}, parametros, {new: true}, (err, usuarioActualizado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioActualizado) return res.status(404).send({message: 'No se han encontrado los usuarios'});

        return res.status(200).send({usuario: usuarioActualizado});
    });
}
   }else{
       Usuarios.findById(idUsuario, (err, usuarioEcontrado)=>{
           if (err) return res.status(500).send({message: 'Ocurrio un error en la peticion de usuario'});
           if(!usuarioEcontrado) return res.status(500).send({message: 'Este usuaio no existe'});

           if(usuarioEcontrado.rol == 'USUARIO'){
            Usuarios.findByIdAndUpdate({_id: idUsuario}, parametros, {new: true}, (err, usuarioActualizado) => {
                if(err) return res.status(500).send({message: 'Error en la peticion'});
                if(!usuarioActualizado) return res.status(404).send({message: 'No puedes modificar a otro admnistrador'});
        
                return res.status(200).send({usuarios: usuarioActualizado});
            });
           }else{
               if(idUsuario == req.user.sub){
                   if(!parametros.rol){
                    Usuarios.findByIdAndUpdate({_id: idUsuario}, parametros, {new: true}, (err, usuarioActualizado) => {
                        if(err) return res.status(500).send({message: 'Error en la peticion'});
                        if(!usuarioActualizado) return res.status(404).send({message: 'No puedes modificar a otro admnistrador'});
                
                        return res.status(200).send({usuarios: usuarioActualizado});
                    });
                   }else{
                       return res.status(500).send({mensaje: 'No puedes modificar tu rol'})
                   }
               }else{
                   return res.status(500).send({mensaje: 'No puedes modificar a otro admnistrador'});
               }
           }
       })
        
       }
  
}
//Insertar EL DE ELMINAR DEREK
function EliminarEmpresa(req, res) {
    var idUser = req.params.idUsuario;  

    Usuarios.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!usuarioEliminado) return res.status(404).send( { mensaje: 'Error al Eliminar el Usuario'});

        return res.status(200).send({ usuario: usuarioEliminado});
    });
}

module.exports = {
    UsuarioInicial,
    Registrar,
    Login,
    EditarUsuario,
    EliminarEmpresa
}