// asgProyectos_api
// manejo de los mensajes REST dirigidos a asgProyectos
var asgProyectosDb = require("./asg_proyectos_db_mysql");


// GetAsgProyectos
// Devuelve una lista de objetos con todos los asgProyectos de la 
// base de datos.
module.exports.getAsgProyectos = function(req, res){
	asgProyectosDb.getAsgProyectos(function(err, asgProyectos){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(asgProyectos);
		}
	});
}

// GetAsgProyectos2
// Devuelve una lista de objetos con todos los asgProyectos de la 
// base de datos.
module.exports.getAsgProyectos2 = function(req, res){
	asgProyectosDb.getAsgProyectos(function(err, asgProyectos){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(asgProyectos);
		}
	});
}

// GetAsgProyectosBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postAsgProyectosBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con el formato adecuado.");
    }
    else if (buscador.nombre != null) {
        asgProyectosDb.postAsgProyectosBuscar(buscador, function (err, asgProyectos) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(asgProyectos);
            }
        });
    }
    else if (buscador.trabajadorId != null) {
        asgProyectosDb.postAsgProyectosBuscarPorTrabajador(buscador, function (err, asgProyectos) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(asgProyectos);
            }
        });
    } else if (buscador.evaluadorId != null) {
        asgProyectosDb.postAsgProyectosBuscarPorEvaluador(buscador, function (err, asgProyectos) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(asgProyectos);
            }
        });
    }
    else if (buscador.proyectoId != null) {
        asgProyectosDb.postAsgProyectosBuscarPorProyecto(buscador, function (err, asgProyectos) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(asgProyectos);
            }
        });
    } else {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con el formato adecuado'.");
    }

}

// GetAsgProyectoBuscar
// Busca una lista de asignaciones para el trabajador pasado
module.exports.postAsgProyectoBuscar = function (req, res) {
    var buscador = req.body;
    if (buscador == null || buscador.trabajadorId == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'trabajadorId'.");
    }
    asgProyectosDb.postAsgProyectoBuscar(buscador, function (err, asgProyectos) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(asgProyectos);
        }
    });
}

// GetAsgProyectoBuscar
// Busca una lista de asignaciones para el trabajador pasado
module.exports.postAsgProyectoEvaluadorBuscar = function (req, res) {
    var buscador = req.body;
    if (buscador == null || buscador.trabajadorId == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'trabajadorId'.");
    }
    asgProyectosDb.postAsgProyectoEvaluadorBuscar(buscador, function (err, asgProyectos) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(asgProyectos);
        }
    });
}

// GetAsgProyecto
// devuelve el asgProyecto con el id pasado
module.exports.getAsgProyecto = function(req, res){
	asgProyectosDb.getAsgProyecto(req.params.asgProyectoId, function(err, asgProyecto){
		if (err){
			res.send(500, err.message);
		}else{
			if (asgProyecto == null){
				res.send(404, "AsgProyecto no encontrado");
			}else{
				res.json(asgProyecto);
			}
		}
	});
}

// PostAsgProyecto
// permite dar de alta un asgProyecto

module.exports.postAsgProyecto = function(req, res){
	asgProyectosDb.postAsgProyecto(req.body.asgProyecto, function(err, asgProyecto){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(asgProyecto);
		}
	});
}

// PutAsgProyecto
// modifica el asgProyecto con el id pasado

module.exports.putAsgProyecto = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    asgProyectosDb.getAsgProyecto(req.params.asgProyectoId, function (err, asgProyecto) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (asgProyecto == null) {
                res.send(404, "AsgProyecto no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                asgProyectosDb.putAsgProyecto(req.params.asgProyectoId, req.body.asgProyecto, function (err, asgProyecto) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(asgProyecto);
                    }
                });
            }
        }
    });
}
// DeleteAsgProyecto
// elimina un asgProyecto de la base de datos
module.exports.deleteAsgProyecto = function(req, res){
    var asgProyecto = req.body;
    asgProyectosDb.deleteAsgProyecto(req.params.asgProyectoId, asgProyecto, function(err, asgProyecto){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}