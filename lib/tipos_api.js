// tipos_api
// manejo de los mensajes REST dirigidos a tipos
var tiposDb = require("./tipos_db_mysql");


// GetTipos
// Devuelve una lista de objetos con todos los tipos de la 
// base de datos.
module.exports.getTipos = function(req, res){
	tiposDb.getTipos(function(err, tipos){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(tipos);
		}
	});
}

// GetTiposBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postTiposBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    tiposDb.postTiposBuscar(buscador, function (err, tipos) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(tipos);
        }
    });
}

// GetTipo
// devuelve el tipo con el id pasado
module.exports.getTipo = function(req, res){
	tiposDb.getTipo(req.params.tipoId, function(err, tipo){
		if (err){
			res.send(500, err.message);
		}else{
			if (tipo == null){
				res.send(404, "Tipo no encontrado");
			}else{
				res.json(tipo);
			}
		}
	});
}

// PostTipo
// permite dar de alta un tipo

module.exports.postTipo = function(req, res){
	tiposDb.postTipo(req.body.tipo, function(err, tipo){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(tipo);
		}
	});
}

// PutTipo
// modifica el tipo con el id pasado

module.exports.putTipo = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    tiposDb.getTipo(req.params.tipoId, function (err, tipo) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (tipo == null) {
                res.send(404, "Tipo no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                tiposDb.putTipo(req.params.tipoId, req.body.tipo, function (err, tipo) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(tipo);
                    }
                });
            }
        }
    });
}
// DeleteTipo
// elimina un tipo de la base de datos
module.exports.deleteTipo = function(req, res){
    var tipo = req.body;
    tiposDb.deleteTipo(req.params.tipoId, tipo, function(err, tipo){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}