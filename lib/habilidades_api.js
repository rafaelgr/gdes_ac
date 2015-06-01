// habilidades_api
// manejo de los mensajes REST dirigidos a habilidades
var habilidadesDb = require("./habilidades_db_mysql");


// GetHabilidades
// Devuelve una lista de objetos con todos los habilidades de la 
// base de datos.
module.exports.getHabilidades = function(req, res){
	habilidadesDb.getHabilidades(function(err, habilidades){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(habilidades);
		}
	});
}

// GetHabilidadesBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postHabilidadesBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || (buscador.nombre == null && buscador.servicioId == null)) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre' o'servicioId'.");
    }
    if (buscador.nombre != null){
        habilidadesDb.postHabilidadesBuscar(buscador, function (err, habilidades) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(habilidades);
            }
            });
    }
    if (buscador.servicioId != null) {
        habilidadesDb.postHabilidadesBuscarPorCategoria(buscador, function (err, habilidades) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(habilidades);
            }
        });
    }
}

// GetHabilidad
// devuelve el habilidad con el id pasado
module.exports.getHabilidad = function(req, res){
	habilidadesDb.getHabilidad(req.params.habilidadId, function(err, habilidad){
		if (err){
			res.send(500, err.message);
		}else{
			if (habilidad == null){
				res.send(404, "Habilidad no encontrado");
			}else{
				res.json(habilidad);
			}
		}
	});
}

// PostHabilidad
// permite dar de alta un habilidad

module.exports.postHabilidad = function(req, res){
	habilidadesDb.postHabilidad(req.body.habilidad, function(err, habilidad){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(habilidad);
		}
	});
}

// PutHabilidad
// modifica el habilidad con el id pasado

module.exports.putHabilidad = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    habilidadesDb.getHabilidad(req.params.habilidadId, function (err, habilidad) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (habilidad == null) {
                res.send(404, "Habilidad no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                habilidadesDb.putHabilidad(req.params.habilidadId, req.body.habilidad, function (err, habilidad) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(habilidad);
                    }
                });
            }
        }
    });
}
// DeleteHabilidad
// elimina un habilidad de la base de datos
module.exports.deleteHabilidad = function(req, res){
    var habilidad = req.body;
    habilidadesDb.deleteHabilidad(req.params.habilidadId, habilidad, function(err, habilidad){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}