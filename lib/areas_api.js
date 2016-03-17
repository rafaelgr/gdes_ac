// areas_api
// manejo de los mensajes REST dirigidos a areas
var areasDb = require("./areas_db_mysql");


// GetAreas
// Devuelve una lista de objetos con todos los areas de la 
// base de datos.
module.exports.getAreas = function(req, res) {
    areasDb.getAreas(function(err, areas) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(areas);
        }
    });
}

// GetAreasBuscar
// Busca una lista de objetos donde el nombre contiene un valor pasado
module.exports.postAreasBuscar = function(req, res) {
    var buscador = req.body;
    if (buscador == null || buscador.nombre == null) {
        return res.send(400, "Debe incluir en el cuerpo del mensaje un objeto 'buscador' con atributo 'nombre'");
    }
    if (buscador.nombre != null) {
        areasDb.postAreasBuscar(buscador, function(err, areas) {
            if (err) {
                return res.send(500, err.message);
            } else {
                return res.json(areas);
            }
        });
    }
}

// GetArea
// devuelve el area con el id pasado
module.exports.getArea = function(req, res) {
    areasDb.getArea(req.params.areaId, function(err, area) {
        if (err) {
            return res.send(500, err.message);
        } else {
            if (area == null) {
                return res.send(404, "Area no encontrado");
            } else {
                return res.json(area);
            }
        }
    });
}

// PostArea
// permite dar de alta un area

module.exports.postArea = function(req, res) {
    areasDb.postArea(req.body.area, function(err, area) {
        if (err) {
            return res.send(500, err.message);
        } else {
            return res.json(area);
        }
    });
}

// PutArea
// modifica el area con el id pasado

module.exports.putArea = function(req, res) {
        // antes de modificar comprobamos que el objeto existe
        areasDb.getArea(req.params.areaId, function(err, area) {
            if (err) {
                return res.send(500, err.message);
            } else {
                if (area == null) {
                    return res.send(404, "Area no encontrado");
                } else {
                    // ya sabemos que existe y lo intentamos modificar.
                    areasDb.putArea(req.params.areaId, req.body.area, function(err, area) {
                        if (err) {
                            return res.send(500, err.message);
                        } else {
                            return res.json(area);
                        }
                    });
                }
            }
        });
    }
    // DeleteArea
    // elimina un area de la base de datos
module.exports.deleteArea = function(req, res) {
    var area = req.body;
    areasDb.deleteArea(req.params.areaId, area, function(err, area) {
        if (err) {
            return res.send(500, err.message);
        } else {
            return res.json(null);
        }
    });
}
