// asgTrabajadores_api
// manejo de los mensajes REST dirigidos a asgTrabajadores
var asgTrabajadoresDb = require("./asg_trabajadores_db_mysql");


// GetAsgTrabajadores
// Devuelve una lista de objetos con todos los asgTrabajadores de la 
// base de datos.
module.exports.getAsgTrabajadores = function(req, res){
	asgTrabajadoresDb.getAsgTrabajadores(function(err, asgTrabajadores){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(asgTrabajadores);
		}
	});
}

// GetAsgTrabajadoresBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postAsgTrabajadoresBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    asgTrabajadoresDb.postAsgTrabajadoresBuscar(buscador, function (err, asgTrabajadores) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(asgTrabajadores);
        }
    });
}

// GetAsgTrabajadorBuscar
// Busca una lista de asignaciones para el trabajador pasado
module.exports.postAsgTrabajadorBuscar = function (req, res) {
    var buscador = req.body;
    if (buscador == null || buscador.trabajadorId == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'trabajadorId'.");
    }
    asgTrabajadoresDb.postAsgTrabajadorBuscar(buscador, function (err, asgTrabajadores) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(asgTrabajadores);
        }
    });
}

// GetAsgTrabajadorBuscar
// Busca una lista de asignaciones para el trabajador pasado
module.exports.postAsgTrabajadorEvaluadorBuscar = function (req, res) {
    var buscador = req.body;
    if (buscador == null || buscador.trabajadorId == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'trabajadorId'.");
    }
    asgTrabajadoresDb.postAsgTrabajadorEvaluadorBuscar(buscador, function (err, asgTrabajadores) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(asgTrabajadores);
        }
    });
}

// GetAsgTrabajador
// devuelve el asgTrabajador con el id pasado
module.exports.getAsgTrabajador = function(req, res){
	asgTrabajadoresDb.getAsgTrabajador(req.params.asgTrabajadorId, function(err, asgTrabajador){
		if (err){
			res.send(500, err.message);
		}else{
			if (asgTrabajador == null){
				res.send(404, "AsgTrabajador no encontrado");
			}else{
				res.json(asgTrabajador);
			}
		}
	});
}

// PostAsgTrabajador
// permite dar de alta un asgTrabajador

module.exports.postAsgTrabajador = function(req, res){
	asgTrabajadoresDb.postAsgTrabajador(req.body.asgTrabajador, function(err, asgTrabajador){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(asgTrabajador);
		}
	});
}

// PutAsgTrabajador
// modifica el asgTrabajador con el id pasado

module.exports.putAsgTrabajador = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    asgTrabajadoresDb.getAsgTrabajador(req.params.asgTrabajadorId, function (err, asgTrabajador) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (asgTrabajador == null) {
                res.send(404, "AsgTrabajador no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                asgTrabajadoresDb.putAsgTrabajador(req.params.asgTrabajadorId, req.body.asgTrabajador, function (err, asgTrabajador) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(asgTrabajador);
                    }
                });
            }
        }
    });
}
// DeleteAsgTrabajador
// elimina un asgTrabajador de la base de datos
module.exports.deleteAsgTrabajador = function(req, res){
    var asgTrabajador = req.body;
    asgTrabajadoresDb.deleteAsgTrabajador(req.params.asgTrabajadorId, asgTrabajador, function(err, asgTrabajador){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}