// empresas_api
// manejo de los mensajes REST dirigidos a empresas
var empresasDb = require("./empresas_db_mysql");


// GetEmpresas
// Devuelve una lista de objetos con todos los empresas de la 
// base de datos.
module.exports.getEmpresas = function(req, res){
	empresasDb.getEmpresas(function(err, empresas){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(empresas);
		}
	});
}

// GetEmpresasBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postEmpresasBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    empresasDb.postEmpresasBuscar(buscador, function (err, empresas) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(empresas);
        }
    });
}

// GetEmpresa
// devuelve el empresa con el id pasado
module.exports.getEmpresa = function(req, res){
	empresasDb.getEmpresa(req.params.empresaId, function(err, empresa){
		if (err){
			res.send(500, err.message);
		}else{
			if (empresa == null){
				res.send(404, "Empresa no encontrado");
			}else{
				res.json(empresa);
			}
		}
	});
}

// PostEmpresa
// permite dar de alta un empresa

module.exports.postEmpresa = function(req, res){
	empresasDb.postEmpresa(req.body.empresa, function(err, empresa){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(empresa);
		}
	});
}

// PutEmpresa
// modifica el empresa con el id pasado

module.exports.putEmpresa = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    empresasDb.getEmpresa(req.params.empresaId, function (err, empresa) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (empresa == null) {
                res.send(404, "Empresa no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                empresasDb.putEmpresa(req.params.empresaId, req.body.empresa, function (err, empresa) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(empresa);
                    }
                });
            }
        }
    });
}
// DeleteEmpresa
// elimina un empresa de la base de datos
module.exports.deleteEmpresa = function(req, res){
    var empresa = req.body;
    empresasDb.deleteEmpresa(req.params.empresaId, empresa, function(err, empresa){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}