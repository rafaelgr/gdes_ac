// administradores_api
// manejo de los mensajes REST dirigidos a administradores
var administradoresDb = require("./administradores_db_mysql");


// GetAdministradores
// Devuelve una lista de objetos con todos los administradores de la 
// base de datos.
module.exports.getAdministradores = function(req, res){
	administradoresDb.getAdministradores(function(err, administradores){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(administradores);
		}
	});
}

// GetAdministradoresBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postAdministradoresBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    administradoresDb.postAdministradoresBuscar(buscador, function (err, administradores) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(administradores);
        }
    });
}

// GetAdministrador
// devuelve el administrador con el id pasado
module.exports.getAdministrador = function(req, res){
	administradoresDb.getAdministrador(req.params.administradorId, function(err, administrador){
		if (err){
			res.send(500, err.message);
		}else{
			if (administrador == null){
				res.send(404, "Administrador no encontrado");
			}else{
				res.json(administrador);
			}
		}
	});
}

// PostAdministrador
// permite dar de alta un administrador

module.exports.postAdministrador = function(req, res){
	administradoresDb.postAdministrador(req.body.administrador, function(err, administrador){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(administrador);
		}
	});
}

// PutAdministrador
// modifica el administrador con el id pasado

module.exports.putAdministrador = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    administradoresDb.getAdministrador(req.params.administradorId, function (err, administrador) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (administrador == null) {
                res.send(404, "Administrador no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                administradoresDb.putAdministrador(req.params.administradorId, req.body.administrador, function (err, administrador) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(administrador);
                    }
                });
            }
        }
    });
}
// DeleteAdministrador
// elimina un administrador de la base de datos
module.exports.deleteAdministrador = function(req, res){
    var administrador = req.body;
    administradoresDb.deleteAdministrador(req.params.administradorId, administrador, function(err, administrador){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}