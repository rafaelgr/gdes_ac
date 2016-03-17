// areas_db_mysql
// Manejo de la tabla areas en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

//  leer la configurción de MySQL
var config = require("./configMySQL.json");
var sql = "";

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback) {
    connection.end(function(err) {
        if (err) callback(err);
    });
}

// comprobarArea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarArea(area) {
    // debe ser objeto del tipo que toca
    var comprobado = typeof area === "object";
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && area.hasOwnProperty("areaId"));
    comprobado = (comprobado && area.hasOwnProperty("nombre"));
    return comprobado;
}

// fromDbtoJsAreas
// transforma un array tal y como lo trae de la base la
// base de datos en el array de js correspondiente.
function fromDbtoJsAreas(areas) {
    var areasJs = [];
    for (var i = 0; i < areas.length; i++) {
        areasJs.push(fromDbtoJsArea(areas[i]));
    }
    return areasJs;
}

// fromDbtoJsArea
// transforma un objeto tal y como lo trae de la base la
// base de datos en el js correspondiente.
function fromDbtoJsArea(areaDb) {
    var areaJs = {
        areaId: areaDb.areaId,
        nombre: areaDb.nombre
    };
    return areaJs;
}

// fromJstoDbArea
// trasforma un objeto js en otro db
// que puede ser usado en la base de datos
function fromJstoDbArea(areaJs) {
    var areaDb = {
        areaId: areaJs.areaId,
        nombre: areaJs.nombre,
    };
    return areaDb;
}


// getAreas
// lee todos los registros de la tabla areas y
// los devuelve como una lista de objetos
module.exports.getAreas = function(callback) {
    var connection = getConnection();
    var areas = null;
    var sql = "SELECT a.areaId, a.nombre";
    sql += " FROM areas AS a ";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        areas = fromDbtoJsAreas(result);
        callback(null, areas);
    });
}

// postAreasBuscar
// lee todos los registros de la tabla areas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postAreasBuscar = function(buscador, callback) {
    var connection = getConnection();
    var areas = null;
    var sql = "SELECT a.areaId, a.nombre";
    sql += " FROM areas AS a";
    if (buscador.nombre !== "*") {
        sql += " WHERE a.nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        areas = fromDbtoJsAreas(result);
        callback(null, areas);
    });
}

// getArea
// busca  el area con id pasado
module.exports.getArea = function(id, callback) {
    var connection = getConnection();
    var area = null;
    var sql = "SELECT a.areaId, a.nombre";
    sql += " FROM areas AS a";
    sql += " WHERE a.areaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        area = fromDbtoJsArea(result[0]);
        callback(null, area);
    });
}


// postArea
// crear en la base de datos el area pasado
module.exports.postArea = function(area, callback) {
    if (!comprobarArea(area)) {
        var err = new Error("El area pasada es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    var areaDb = fromJstoDbArea(area);
    areaDb.areaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO areas SET ?";
    sql = mysql.format(sql, areaDb);
    connection.query(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        sql = "SELECT a.areaId, a.nombre";
        sql += " FROM areas AS a";
        sql += " WHERE a.areaId = ?";
        sql = mysql.format(sql, result.insertId);
        connection.query(sql, function(err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err, null);
            }
            if (result.length == 0) {
                return callback(null, null);
            }
            area = fromDbtoJsArea(result[0]);
            callback(null, area);
        });
    });
}

// putArea
// Modifica el area según los datos del objeto pasao
module.exports.putArea = function(id, area, callback) {
    if (!comprobarArea(area)) {
        var err = new Error("El area pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != area.areaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    var areaDb = fromJstoDbArea(area);
    var sql = "UPDATE areas SET ? WHERE areaId = ?";
    sql = mysql.format(sql, [areaDb, areaDb.areaId]);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        var sql = "SELECT a.areaId, a.nombre";
        sql += " FROM areas AS a";
        sql += " WHERE a.areaId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function(err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err, null);
            }
            if (result.length == 0) {
                return callback(null, null);
            }
            area = fromDbtoJsArea(result[0]);
            callback(null, area);
        });
    });
}

// deleteArea
// Elimina el area con el id pasado
module.exports.deleteArea = function(id, area, callback) {
    var connection = getConnection();
    sql = "DELETE from areas WHERE areaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
