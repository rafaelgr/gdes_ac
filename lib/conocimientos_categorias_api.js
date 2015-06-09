// conocimientos_api
// manejo de los mensajes REST dirigidos a conocimientos
var conocimientosDb = require("./conocimientos_categorias_db_mysql");



// PostConocimientoCategorias
// permite dar de alta las categorias relacionadas con un conocimiento.

module.exports.postConocimientoCategorias = function(req, res){
	conocimientosDb.postConocimientoCategorias(req.body, function(err, conocimiento){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(conocimiento);
		}
	});
}


// GetConocimientoCategorias
// permite obtener las categorias relacionadas con un conocimiento

module.exports.getConocimientoCategorias = function (req, res) {
    conocimientosDb.getConocimientoCategorias(req.params.conocimientoId, function (err, categorias) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(categorias);
        }
    });
}
