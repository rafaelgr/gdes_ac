// asg_evaluaciones_api
// manejo de los mensajes REST dirigidos a asgObjetivos
var evaluacionesDb = require("./evaluaciones_db_mysql");


// GetEvaluaciones
// Devuelve una lista de objetos con todos las evaluaciones de la 
// base de datos.
module.exports.getEvaluaciones = function(req, res){
	evaluacionesDb.getEvaluaciones(function(err, evaluaciones){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(asgObjetivos);
		}
	});
}

// GetEvaluacionesBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postEvaluacionesBuscar = function (req, res) {
    var buscador = req.body;
    if (buscador == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con el formato adecuado'.");
    } else if (buscador.trabajadorId != null) {
        evaluacionesDb.postEvaluacionesBuscarPorTrabajador(buscador, function (err, evaluaciones) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(evaluaciones);
            }
        });
    } else if (buscador.proyectoId != null) {
        evaluacionesDb.postEvaluacionesBuscarPorProyecto(buscador, function (err, evaluaciones) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(evaluaciones);
            }
        });
    } else {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con el formato adecuado'.");
    }
}

// GetEvaluacion
// devuelve la evaluacion con el id pasado
module.exports.getEvaluacion = function(req, res){
	evaluacionesDb.getEvaluacion(req.params.evaluacionId, function(err, evaluacion){
		if (err){
			res.send(500, err.message);
		}else{
			if (evaluacion == null){
				res.send(404, "Evaluacion no encontrada");
			}else{
				res.json(evaluacion);
			}
		}
	});
}

// PostEvaluacion
// permite dar de alta una evaluacion

module.exports.postEvaluacion = function(req, res){
	evaluacionesDb.postEvaluacion(req.body.evaluacion, function(err, evaluacion){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(evaluacion);
		}
	});
}

// PutEvaluacion
// modifica la evaluacion con el id pasado

module.exports.putEvaluacion = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    evaluacionesDb.getEvaluacion(req.params.evaluacionId, function (err, evaluacion) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (evaluacion == null) {
                res.send(404, "Evaluacion no encontrada");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                evaluacionesDb.putEvaluacion(req.params.evaluacionId, req.body.evaluacion, function (err, evaluacion) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(evaluacion);
                    }
                });
            }
        }
    });
}
// DeleteEvaluacion
// elimina una evaluacion de la base de datos
module.exports.deleteEvaluacion = function(req, res){
    var evaluacion = req.body;
    evaluacionesDb.deleteEvaluacion(req.params.evaluacionId, evaluacion, function(err, evaluacion){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}