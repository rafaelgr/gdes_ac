// conocimientos_api
// manejo de los mensajes REST dirigidos a conocimientos
var conocimientosDb = require("./conocimientos_db_mysql");


// GetConocimientos
// Devuelve una lista de objetos con todos los conocimientos de la 
// base de datos.
module.exports.getConocimientos = function(req, res){
	conocimientosDb.getConocimientos(function(err, conocimientos){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(conocimientos);
		}
	});
}

// GetConocimientosBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postConocimientosBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || (buscador.nombre == null && buscador.catConocimientoId == null)) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre','catConocimientoId' o 'evaluadorId'.");
    }
    if (buscador.nombre != null){
        conocimientosDb.postConocimientosBuscar(buscador, function (err, conocimientos) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(conocimientos);
            }
            });
    }
    if (buscador.catConocimientoId != null) {
        conocimientosDb.postConocimientosBuscarPorCategoria(buscador, function (err, conocimientos) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(conocimientos);
            }
        });
    }
}

// GetConocimiento
// devuelve el conocimiento con el id pasado
module.exports.getConocimiento = function(req, res){
	conocimientosDb.getConocimiento(req.params.conocimientoId, function(err, conocimiento){
		if (err){
			res.send(500, err.message);
		}else{
			if (conocimiento == null){
				res.send(404, "Conocimiento no encontrado");
			}else{
				res.json(conocimiento);
			}
		}
	});
}

// PostConocimiento
// permite dar de alta un conocimiento

module.exports.postConocimiento = function(req, res){
	conocimientosDb.postConocimiento(req.body.conocimiento, function(err, conocimiento){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(conocimiento);
		}
	});
}

// PutConocimiento
// modifica el conocimiento con el id pasado

module.exports.putConocimiento = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    conocimientosDb.getConocimiento(req.params.conocimientoId, function (err, conocimiento) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (conocimiento == null) {
                res.send(404, "Conocimiento no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                conocimientosDb.putConocimiento(req.params.conocimientoId, req.body.conocimiento, function (err, conocimiento) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(conocimiento);
                    }
                });
            }
        }
    });
}
// DeleteConocimiento
// elimina un conocimiento de la base de datos
module.exports.deleteConocimiento = function(req, res){
    var conocimiento = req.body;
    conocimientosDb.deleteConocimiento(req.params.conocimientoId, conocimiento, function(err, conocimiento){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}