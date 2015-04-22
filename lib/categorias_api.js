// categorias_api
// manejo de los mensajes REST dirigidos a categorias
var categoriasDb = require("./categorias_db_mysql");


// GetCategorias
// Devuelve una lista de objetos con todos los categorias de la 
// base de datos.
module.exports.getCategorias = function(req, res){
	categoriasDb.getCategorias(function(err, categorias){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(categorias);
		}
	});
}

// GetCategoriasBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postCategoriasBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    categoriasDb.postCategoriasBuscar(buscador, function (err, categorias) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(categorias);
        }
    });
}

// GetCategoria
// devuelve el categoria con el id pasado
module.exports.getCategoria = function(req, res){
	categoriasDb.getCategoria(req.params.categoriaId, function(err, categoria){
		if (err){
			res.send(500, err.message);
		}else{
			if (categoria == null){
				res.send(404, "Categoria no encontrado");
			}else{
				res.json(categoria);
			}
		}
	});
}

// PostCategoria
// permite dar de alta un categoria

module.exports.postCategoria = function(req, res){
	categoriasDb.postCategoria(req.body.categoria, function(err, categoria){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(categoria);
		}
	});
}

// PutCategoria
// modifica el categoria con el id pasado

module.exports.putCategoria = function(req, res){
    // antes de modificar comprobamos que el objeto existe
    categoriasDb.getCategoria(req.params.categoriaId, function (err, categoria) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (categoria == null) {
                res.send(404, "Categoria no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                categoriasDb.putCategoria(req.params.categoriaId, req.body.categoria, function (err, categoria) {
                    if (err) {
                        res.send(500, err.message);
                    } else {
                        res.json(categoria);
                    }
                });
            }
        }
    });
}
// DeleteCategoria
// elimina un categoria de la base de datos
module.exports.deleteCategoria = function(req, res){
    var categoria = req.body;
    categoriasDb.deleteCategoria(req.params.categoriaId, categoria, function(err, categoria){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}