// evaluados_api
// manejo de los mensajes REST dirigidos a a la relación evaluador / trabajador
var evaluadosDb = require("./evaluados_db_mysql");


// GetEvaluadosBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postEvaluadosBuscar = function (req, res){
    var buscador = req.body;
    if (buscador == null || buscador.evaluadorId == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'evaluadorId'.");
    }
    evaluadosDb.postEvaluadosBuscar(buscador, function (err, evaluados) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(evaluados);
        }
    });
}

// PostTrabajadorEvaluado
// permite dar de alta un trabajador

module.exports.postTrabajadorEvaluado = function(req, res){
	evaluadosDb.postTrabajadorEvaluado(req.params.id, req.body.trabajador, function(err, evaluadorTrabajador){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(evaluadorTrabajador);
		}
	});
}
// DeleteTrabajadorEvaluado
// elimina un trabajador de la base de datos
module.exports.deleteTrabajadorEvaluado = function(req, res){
    var evaluadorTrabajador = req.body;
    evaluadosDb.deleteTrabajadorEvaluado(req.params.id, evaluadorTrabajador, function(err, evaluadorTrabajador){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}