// catConocimientos_api
// manejo de los mensajes REST dirigidos a catConocimientos
var catConocimientosDb = require("./catConocimientos_db_mysql");


// GetCatConocimientos
// Devuelve una lista de objetos con todos los catConocimientos de la 
// base de datos.
module.exports.getCatConocimientos = function(req, res){
	catConocimientosDb.getCatConocimientos(function(err, catConocimientos){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(catConocimientos);
		}
	});
}

// GetCatConocimientosBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postCatConocimientosBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    catConocimientosDb.postCatConocimientosBuscar(buscador, function (err, catConocimientos) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(catConocimientos);
        }
    });
}

// GetCatConocimiento
// devuelve el catConocimiento con el id pasado
module.exports.getCatConocimiento = function(req, res){
	catConocimientosDb.getCatConocimiento(req.params.catConocimientoId, function(err, catConocimiento){
		if (err){
			res.send(500, err.message);
		}else{
			if (catConocimiento == null){
				res.send(404, "CatConocimiento no encontrado");
			}else{
				res.json(catConocimiento);
			}
		}
	});
}

// PostCatConocimiento
// permite dar de alta un catConocimiento

module.exports.postCatConocimiento = function(req, res){
	catConocimientosDb.postCatConocimiento(req.body.catConocimiento, function(err, catConocimiento){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(catConocimiento);
		}
	});
}

// PutCatConocimiento
// modifica el catConocimiento con el id pasado

module.exports.putCatConocimiento = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    catConocimientosDb.getCatConocimiento(req.params.catConocimientoId, function (err, catConocimiento) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (catConocimiento == null) {
                res.send(404, "CatConocimiento no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                catConocimientosDb.putCatConocimiento(req.params.catConocimientoId, req.body.catConocimiento, function (err, catConocimiento) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(catConocimiento);
                    }
                });
            }
        }
    });
}
// DeleteCatConocimiento
// elimina un catConocimiento de la base de datos
module.exports.deleteCatConocimiento = function(req, res){
    var catConocimiento = req.body;
    catConocimientosDb.deleteCatConocimiento(req.params.catConocimientoId, catConocimiento, function(err, catConocimiento){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}