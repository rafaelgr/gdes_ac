// paises_api
// manejo de los mensajes REST dirigidos a paises
var paisesDb = require("./paises_db_mysql");


// GetPaises
// Devuelve una lista de objetos con todos los paises de la 
// base de datos.
module.exports.getPaises = function(req, res){
	paisesDb.getPaises(function(err, paises){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(paises);
		}
	});
}

// GetPaisesBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postPaisesBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    paisesDb.postPaisesBuscar(buscador, function (err, paises) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(paises);
        }
    });
}

// GetPais
// devuelve el pais con el id pasado
module.exports.getPais = function(req, res){
	paisesDb.getPais(req.params.paisId, function(err, pais){
		if (err){
			res.send(500, err.message);
		}else{
			if (pais == null){
				res.send(404, "Pais no encontrado");
			}else{
				res.json(pais);
			}
		}
	});
}

// PostPais
// permite dar de alta un pais

module.exports.postPais = function(req, res){
	paisesDb.postPais(req.body.pais, function(err, pais){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(pais);
		}
	});
}

// PutPais
// modifica el pais con el id pasado

module.exports.putPais = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    paisesDb.getPais(req.params.paisId, function (err, pais) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (pais == null) {
                res.send(404, "Pais no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                paisesDb.putPais(req.params.paisId, req.body.pais, function (err, pais) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(pais);
                    }
                });
            }
        }
    });
}
// DeletePais
// elimina un pais de la base de datos
module.exports.deletePais = function(req, res){
    var pais = req.body;
    paisesDb.deletePais(req.params.paisId, pais, function(err, pais){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}