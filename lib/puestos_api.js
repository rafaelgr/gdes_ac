// puestos_api
// manejo de los mensajes REST dirigidos a puestos
var puestosDb = require("./puestos_db_mysql");


// GetPuestos
// Devuelve una lista de objetos con todos los puestos de la 
// base de datos.
module.exports.getPuestos = function(req, res){
	puestosDb.getPuestos(function(err, puestos){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(puestos);
		}
	});
}

// GetPuestosBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postPuestosBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    puestosDb.postPuestosBuscar(buscador, function (err, puestos) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(puestos);
        }
    });
}

// GetPuesto
// devuelve el puesto con el id pasado
module.exports.getPuesto = function(req, res){
	puestosDb.getPuesto(req.params.puestoId, function(err, puesto){
		if (err){
			res.send(500, err.message);
		}else{
			if (puesto == null){
				res.send(404, "Puesto no encontrado");
			}else{
				res.json(puesto);
			}
		}
	});
}

// PostPuesto
// permite dar de alta un puesto

module.exports.postPuesto = function(req, res){
	puestosDb.postPuesto(req.body.puesto, function(err, puesto){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(puesto);
		}
	});
}

// PutPuesto
// modifica el puesto con el id pasado

module.exports.putPuesto = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    puestosDb.getPuesto(req.params.puestoId, function (err, puesto) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (puesto == null) {
                res.send(404, "Puesto no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                puestosDb.putPuesto(req.params.puestoId, req.body.puesto, function (err, puesto) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(puesto);
                    }
                });
            }
        }
    });
}
// DeletePuesto
// elimina un puesto de la base de datos
module.exports.deletePuesto = function(req, res){
    var puesto = req.body;
    puestosDb.deletePuesto(req.params.puestoId, puesto, function(err, puesto){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}