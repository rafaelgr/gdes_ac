// servicios_api
// manejo de los mensajes REST dirigidos a servicios
var serviciosDb = require("./servicios_db_mysql");


// GetServicios
// Devuelve una lista de objetos con todos los servicios de la 
// base de datos.
module.exports.getServicios = function(req, res){
	serviciosDb.getServicios(function(err, servicios){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(servicios);
		}
	});
}

// GetServiciosBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postServiciosBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    serviciosDb.postServiciosBuscar(buscador, function (err, servicios) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(servicios);
        }
    });
}

// GetServicio
// devuelve el servicio con el id pasado
module.exports.getServicio = function(req, res){
	serviciosDb.getServicio(req.params.servicioId, function(err, servicio){
		if (err){
			res.send(500, err.message);
		}else{
			if (servicio == null){
				res.send(404, "Servicio no encontrado");
			}else{
				res.json(servicio);
			}
		}
	});
}

// PostServicio
// permite dar de alta un servicio

module.exports.postServicio = function(req, res){
	serviciosDb.postServicio(req.body.servicio, function(err, servicio){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(servicio);
		}
	});
}

// PutServicio
// modifica el servicio con el id pasado

module.exports.putServicio = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    serviciosDb.getServicio(req.params.servicioId, function (err, servicio) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (servicio == null) {
                res.send(404, "Servicio no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                serviciosDb.putServicio(req.params.servicioId, req.body.servicio, function (err, servicio) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(servicio);
                    }
                });
            }
        }
    });
}
// DeleteServicio
// elimina un servicio de la base de datos
module.exports.deleteServicio = function(req, res){
    var servicio = req.body;
    serviciosDb.deleteServicio(req.params.servicioId, servicio, function(err, servicio){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}