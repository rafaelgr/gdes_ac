// ejercicios_api
// manejo de los mensajes REST dirigidos a ejercicios
var ejerciciosDb = require("./ejercicios_db_mysql");


// GetEjercicios
// Devuelve una lista de objetos con todos los ejercicios de la 
// base de datos.
module.exports.getEjercicios = function(req, res){
	ejerciciosDb.getEjercicios(function(err, ejercicios){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(ejercicios);
		}
	});
}

// GetEjerciciosBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postEjerciciosBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    ejerciciosDb.postEjerciciosBuscar(buscador, function (err, ejercicios) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(ejercicios);
        }
    });
}

// GetEjercicio
// devuelve el ejercicio con el id pasado
module.exports.getEjercicio = function(req, res){
	ejerciciosDb.getEjercicio(req.params.ejercicioId, function(err, ejercicio){
		if (err){
			res.send(500, err.message);
		}else{
			if (ejercicio == null){
				res.send(404, "Ejercicio no encontrado");
			}else{
				res.json(ejercicio);
			}
		}
	});
}

// PostEjercicio
// permite dar de alta un ejercicio

module.exports.postEjercicio = function(req, res){
	ejerciciosDb.postEjercicio(req.body.ejercicio, function(err, ejercicio){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(ejercicio);
		}
	});
}

// PutEjercicio
// modifica el ejercicio con el id pasado

module.exports.putEjercicio = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    ejerciciosDb.getEjercicio(req.params.ejercicioId, function (err, ejercicio) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (ejercicio == null) {
                res.send(404, "Ejercicio no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                ejerciciosDb.putEjercicio(req.params.ejercicioId, req.body.ejercicio, function (err, ejercicio) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(ejercicio);
                    }
                });
            }
        }
    });
}
// DeleteEjercicio
// elimina un ejercicio de la base de datos
module.exports.deleteEjercicio = function(req, res){
    var ejercicio = req.body;
    ejerciciosDb.deleteEjercicio(req.params.ejercicioId, ejercicio, function(err, ejercicio){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}