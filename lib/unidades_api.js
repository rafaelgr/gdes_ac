// unidades_api
// manejo de los mensajes REST dirigidos a unidades
var unidadesDb = require("./unidades_db_mysql");


// GetUnidades
// Devuelve una lista de objetos con todos los unidades de la 
// base de datos.
module.exports.getUnidades = function(req, res){
	unidadesDb.getUnidades(function(err, unidades){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(unidades);
		}
	});
}

// GetUnidadesBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postUnidadesBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    unidadesDb.postUnidadesBuscar(buscador, function (err, unidades) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(unidades);
        }
    });
}

// GetUnidad
// devuelve el unidad con el id pasado
module.exports.getUnidad = function(req, res){
	unidadesDb.getUnidad(req.params.unidadId, function(err, unidad){
		if (err){
			res.send(500, err.message);
		}else{
			if (unidad == null){
				res.send(404, "Unidad no encontrado");
			}else{
				res.json(unidad);
			}
		}
	});
}

// PostUnidad
// permite dar de alta un unidad

module.exports.postUnidad = function(req, res){
	unidadesDb.postUnidad(req.body.unidad, function(err, unidad){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(unidad);
		}
	});
}

// PutUnidad
// modifica el unidad con el id pasado

module.exports.putUnidad = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    unidadesDb.getUnidad(req.params.unidadId, function (err, unidad) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (unidad == null) {
                res.send(404, "Unidad no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                unidadesDb.putUnidad(req.params.unidadId, req.body.unidad, function (err, unidad) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(unidad);
                    }
                });
            }
        }
    });
}
// DeleteUnidad
// elimina un unidad de la base de datos
module.exports.deleteUnidad = function(req, res){
    var unidad = req.body;
    unidadesDb.deleteUnidad(req.params.unidadId, unidad, function(err, unidad){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}