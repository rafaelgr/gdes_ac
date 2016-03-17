// conocimientos_api
// manejo de los mensajes REST dirigidos a conocimientos
var conocimientosDb = require("./conocimientos_areas_db_mysql");



// PostConocimientoAreas
// permite dar de alta las areas relacionadas con un conocimiento.

module.exports.postConocimientoAreas = function(req, res){
	conocimientosDb.postConocimientoAreas(req.body, function(err, conocimiento){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(conocimiento);
		}
	});
}


// GetConocimientoAreas
// permite obtener las areas relacionadas con un conocimiento

module.exports.getConocimientoAreas = function (req, res) {
    conocimientosDb.getConocimientoAreas(req.params.conocimientoId, function (err, areas) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(areas);
        }
    });
}
