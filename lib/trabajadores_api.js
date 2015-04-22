// trabajadores_api
// manejo de los mensajes REST dirigidos a trabajadores
var trabajadoresDb = require("./trabajadores_db_mysql");


// GetTrabajadores
// Devuelve una lista de objetos con todos los trabajadores de la 
// base de datos.
module.exports.getTrabajadores = function(req, res){
	trabajadoresDb.getTrabajadores(function(err, trabajadores){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(trabajadores);
		}
	});
}

// GetEvaluadores
// Devuelve una lista de objetos con todos los evaluadores de la 
// base de datos.
module.exports.getEvaluadores = function (req, res) {
    trabajadoresDb.getEvaluadores(function (err, trabajadores) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(trabajadores);
        }
    });
}


// GetTrabajadoresBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postTrabajadoresBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    trabajadoresDb.postTrabajadoresBuscar(buscador, function (err, trabajadores) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(trabajadores);
        }
    });
}

// GetTrabajador
// devuelve el trabajador con el id pasado
module.exports.getTrabajador = function(req, res){
	trabajadoresDb.getTrabajador(req.params.trabajadorId, function(err, trabajador){
		if (err){
			res.send(500, err.message);
		}else{
			if (trabajador == null){
				res.send(404, "Trabajador no encontrado");
			}else{
				res.json(trabajador);
			}
		}
	});
}

// PostTrabajador
// permite dar de alta un trabajador

module.exports.postTrabajador = function(req, res){
	trabajadoresDb.postTrabajador(req.body.trabajador, function(err, trabajador){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(trabajador);
		}
	});
}

// PutTrabajador
// modifica el trabajador con el id pasado

module.exports.putTrabajador = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    trabajadoresDb.getTrabajador(req.params.trabajadorId, function (err, trabajador) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (trabajador == null) {
                res.send(404, "Trabajador no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                trabajadoresDb.putTrabajador(req.params.trabajadorId, req.body.trabajador, function (err, trabajador) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(trabajador);
                    }
                });
            }
        }
    });
}
// DeleteTrabajador
// elimina un trabajador de la base de datos
module.exports.deleteTrabajador = function(req, res){
    var trabajador = req.body;
    trabajadoresDb.deleteTrabajador(req.params.trabajadorId, trabajador, function(err, trabajador){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}

// PostTrabajadorLogin
// permite buscar un trabajador con login y password pasados

module.exports.postTrabajadorLogin = function (req, res) {
    trabajadoresDb.postTrabajadorLogin(req.body.trabajador, function (err, trabajador) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(trabajador);
        }
    });
}