// conocimientos_api
// manejo de los mensajes REST dirigidos a conocimientos
var conocimientosDb = require("./conocimientos_habilidades_db_mysql");



// PostConocimientoHabilidades
// permite dar de alta las habilidades relacionadas con un conocimiento.

module.exports.postConocimientoHabilidades = function(req, res){
	conocimientosDb.postConocimientoHabilidades(req.body, function(err, conocimiento){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(conocimiento);
		}
	});
}


// GetConocimientoHabilidades
// permite obtener las habilidades relacionadas con un conocimiento

module.exports.getConocimientoHabilidades = function (req, res) {
    conocimientosDb.getConocimientoHabilidades(req.params.conocimientoId, function (err, habilidades) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(habilidades);
        }
    });
}
