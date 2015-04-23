// proyectos_api
// manejo de los mensajes REST dirigidos a proyectos
var proyectosDb = require("./proyectos_db_mysql");


// GetProyectos
// Devuelve una lista de objetos con todos los proyectos de la 
// base de datos.

module.exports.getProyectos = function(req, res){
	proyectosDb.getProyectos(function(err, proyectos){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(proyectos);
		}
	});
}

// GetProyectosBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postProyectosBuscar = function (req, res) {
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'.");
    }
    proyectosDb.postProyectosBuscar(buscador, function (err, proyectos) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(proyectos);
        }
    });
}




// GetProyecto
// devuelve el proyecto con el id pasado

module.exports.getProyecto = function(req, res){
	proyectosDb.getProyecto(req.params.proyectoId, function(err, proyecto){
		if (err){
			res.send(500, err.message);
		}else{
			if (proyecto == null){
				res.send(404, "Proyecto no encontrado");
			}else{
				res.json(proyecto);
			}
		}
	});
}

// PostProyecto
// permite dar de alta un proyecto

module.exports.postProyecto = function(req, res){
	var proyecto = req.body.proyecto;
	proyectosDb.postProyecto(proyecto, function(err, proyecto){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(proyecto);
		}
	});
}

// PutProyecto
// modifica el proyecto con el id pasado

module.exports.putProyecto = function(req, res){
	var proyecto = req.body.proyecto;
	proyectosDb.putProyecto(proyecto, function(err, proyecto){
		if (err){
			res.send(500, err.message);
		}else{
			res.json(proyecto);
		}
	});
}
// DeleteProyecto
// elimina un proyecto de la base de datos
module.exports.deleteProyecto = function(req, res){
    var proyecto = req.body.proyecto;
    proyectosDb.deleteProyecto(proyecto, function(err, proyecto){
        if (err){
            res.send(500, err.message);
        }else{
            res.json(null);
        }
    });
}