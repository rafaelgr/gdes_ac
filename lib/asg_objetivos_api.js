// asgObjetivos_api
// manejo de los mensajes REST dirigidos a asgObjetivos
var asgObjetivosDb = require("./asg_objetivos_db_mysql");


// GetAsgObjetivos
// Devuelve una lista de objetos con todos los asgObjetivos de la 
// base de datos.
module.exports.getAsgObjetivos = function(req, res){
	asgObjetivosDb.getAsgObjetivos(function(err, asgObjetivos){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(asgObjetivos);
		}
	});
}

// GetAsgObjetivosBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postAsgObjetivosBuscar = function (req, res) {
    var buscador = req.body;
    if (buscador == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con el formato adecuado'.");
    } else if (buscador.nombre != null) {
        asgObjetivosDb.postAsgObjetivosBuscar(buscador, function (err, asgObjetivos) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(asgObjetivos);
            }
        });
    } else if (buscador.asgTrabajadorId != null && buscador.categoriaId) {
        asgObjetivosDb.postAsgObjetivosBuscarPorAsignacionCategoria(buscador, function (err, asgObjetivos) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(asgObjetivos);
            }
        });
    } else {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con el formato adecuado'.");
    }
}

// GetAsgObjetivo
// devuelve el asgObjetivo con el id pasado
module.exports.getAsgObjetivo = function(req, res){
	asgObjetivosDb.getAsgObjetivo(req.params.asgObjetivoId, function(err, asgObjetivo){
		if (err){
			res.send(500, err.message);
		}else{
			if (asgObjetivo == null){
				res.send(404, "AsgObjetivo no encontrado");
			}else{
				res.json(asgObjetivo);
			}
		}
	});
}

// PostAsgObjetivo
// permite dar de alta un asgObjetivo

module.exports.postAsgObjetivo = function(req, res){
	asgObjetivosDb.postAsgObjetivo(req.body.asgObjetivo, function(err, asgObjetivo){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(asgObjetivo);
		}
	});
}

// PutAsgObjetivo
// modifica el asgObjetivo con el id pasado

module.exports.putAsgObjetivo = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    asgObjetivosDb.getAsgObjetivo(req.params.asgObjetivoId, function (err, asgObjetivo) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (asgObjetivo == null) {
                res.send(404, "AsgObjetivo no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                asgObjetivosDb.putAsgObjetivo(req.params.asgObjetivoId, req.body.asgObjetivo, function (err, asgObjetivo) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(asgObjetivo);
                    }
                });
            }
        }
    });
}
// DeleteAsgObjetivo
// elimina un asgObjetivo de la base de datos
module.exports.deleteAsgObjetivo = function(req, res){
    var asgObjetivo = req.body;
    asgObjetivosDb.deleteAsgObjetivo(req.params.asgObjetivoId, asgObjetivo, function(err, asgObjetivo){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}