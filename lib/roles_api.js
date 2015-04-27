// roles_api
// manejo de los mensajes REST dirigidos a roles
var rolesDb = require("./roles_db_mysql");


// GetRoles
// Devuelve una lista de objetos con todos los roles de la 
// base de datos.
module.exports.getRoles = function(req, res){
	rolesDb.getRoles(function(err, roles){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(roles);
		}
	});
}

// GetRolesBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postRolesBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    rolesDb.postRolesBuscar(buscador, function (err, roles) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(roles);
        }
    });
}

// GetRol
// devuelve el rol con el id pasado
module.exports.getRol = function(req, res){
	rolesDb.getRol(req.params.rolId, function(err, rol){
		if (err){
			res.send(500, err.message);
		}else{
			if (rol == null){
				res.send(404, "Rol no encontrado");
			}else{
				res.json(rol);
			}
		}
	});
}

// PostRol
// permite dar de alta un rol

module.exports.postRol = function(req, res){
	rolesDb.postRol(req.body.rol, function(err, rol){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(rol);
		}
	});
}

// PutRol
// modifica el rol con el id pasado

module.exports.putRol = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    rolesDb.getRol(req.params.rolId, function (err, rol) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (rol == null) {
                res.send(404, "Rol no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                rolesDb.putRol(req.params.rolId, req.body.rol, function (err, rol) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(rol);
                    }
                });
            }
        }
    });
}
// DeleteRol
// elimina un rol de la base de datos
module.exports.deleteRol = function(req, res){
    var rol = req.body;
    rolesDb.deleteRol(req.params.rolId, rol, function(err, rol){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}