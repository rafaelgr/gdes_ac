// objetivos_api
// manejo de los mensajes REST dirigidos a objetivos
var objetivosDb = require("./objetivos_db_mysql");


// GetObjetivos
// Devuelve una lista de objetos con todos los objetivos de la 
// base de datos.
module.exports.getObjetivos = function(req, res){
	objetivosDb.getObjetivos(function(err, objetivos){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(objetivos);
		}
	});
}

// GetObjetivosBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postObjetivosBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || ((buscador.nombre == null && buscador.categoriaId == null) && (buscador.nombre == null && buscador.evaluadorId == null))) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre','categoriaId' o 'evaluadorId'.");
    }
    if (buscador.nombre != null){
        objetivosDb.postObjetivosBuscar(buscador, function (err, objetivos) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(objetivos);
            }
            });
    }
    if (buscador.categoriaId != null) {
        objetivosDb.postObjetivosBuscarPorCategoria(buscador, function (err, objetivos) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(objetivos);
            }
        });
    }
    if (buscador.evaluadorId != null) {
        objetivosDb.postObjetivosEvaluadorBuscar(buscador, function (err, objetivos) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(objetivos);
            }
        });
    }
}

// GetObjetivo
// devuelve el objetivo con el id pasado
module.exports.getObjetivo = function(req, res){
	objetivosDb.getObjetivo(req.params.objetivoId, function(err, objetivo){
		if (err){
			res.send(500, err.message);
		}else{
			if (objetivo == null){
				res.send(404, "Objetivo no encontrado");
			}else{
				res.json(objetivo);
			}
		}
	});
}

// PostObjetivo
// permite dar de alta un objetivo

module.exports.postObjetivo = function(req, res){
	objetivosDb.postObjetivo(req.body.objetivo, function(err, objetivo){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(objetivo);
		}
	});
}

// PutObjetivo
// modifica el objetivo con el id pasado

module.exports.putObjetivo = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    objetivosDb.getObjetivo(req.params.objetivoId, function (err, objetivo) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (objetivo == null) {
                res.send(404, "Objetivo no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                objetivosDb.putObjetivo(req.params.objetivoId, req.body.objetivo, function (err, objetivo) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(objetivo);
                    }
                });
            }
        }
    });
}
// DeleteObjetivo
// elimina un objetivo de la base de datos
module.exports.deleteObjetivo = function(req, res){
    var objetivo = req.body;
    objetivosDb.deleteObjetivo(req.params.objetivoId, objetivo, function(err, objetivo){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}