// conocimientos_db_mysql
// Manejo de la tabla conocimientos en la base de datos
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

function closeConnectionCallback(connection, callback){
	connection.end(function(err){
		if (err) callback(err);
	});
}

// comprobarConocimiento
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarConocimiento(conocimiento){
	// debe ser objeto del tipo que toca
	var comprobado = typeof conocimiento === "object";
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && conocimiento.hasOwnProperty("conocimientoId"));
    comprobado = (comprobado && conocimiento.hasOwnProperty("nombre"));
    comprobado = (comprobado && conocimiento.hasOwnProperty("catConocimiento"));
    if (comprobado) {
        comprobado = typeof conocimiento.catConocimiento === "object";
        comprobado = (comprobado && conocimiento.catConocimiento.hasOwnProperty("catConocimientoId"));
    }
	return comprobado;
}

// fromDbtoJsConocimientos
// transforma un array tal y como lo trae de la base la
// base de datos en el array de js correspondiente.
function fromDbtoJsConocimientos(conocimientos){
    var conocimientosJs = [];
    for (var i = 0; i < conocimientos.length; i++) {
        conocimientosJs.push(fromDbtoJsConocimiento(conocimientos[i]));
    }
    return conocimientosJs;
}

// fromDbtoJsConocimiento
// transforma un objeto tal y como lo trae de la base la
// base de datos en el js correspondiente.
function fromDbtoJsConocimiento(conocimientoDb){
    var conocimientoJs = {
        conocimientoId: conocimientoDb.conocimientoId,
        nombre: conocimientoDb.nombre,
        catConocimiento: {
            catConocimientoId: conocimientoDb.catConocimientoId,
            nombre: conocimientoDb.ncatConocimiento
        }
    };
    return conocimientoJs;
}

// fromJstoDbConocimiento
// trasforma un objeto js en otro db
// que puede ser usado en la base de datos
function fromJstoDbConocimiento(conocimientoJs){
    var conocimientoDb = {
        conocimientoId: conocimientoJs.conocimientoId,
        nombre: conocimientoJs.nombre,
        catConocimientoId: conocimientoJs.catConocimiento.catConocimientoId,
    };
    return conocimientoDb;
}


// getConocimientos
// lee todos los registros de la tabla conocimientos y
// los devuelve como una lista de objetos
module.exports.getConocimientos = function(callback){
	var connection = getConnection();
	var conocimientos = null;
    var sql = "SELECT c.conocimientoId, c.nombre, c.catConocimientoId, cc.nombre AS ncatConocimiento";
    sql += " FROM conocimientos AS c LEFT JOIN catConocimientos AS cc ON cc.catConocimientoId = c.catConocimientoId";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		conocimientos = fromDbtoJsConocimientos(result);
		callback(null, conocimientos);
	});	
	closeConnectionCallback(connection, callback);
}

// postConocimientosBuscar
// lee todos los registros de la tabla conocimientos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postConocimientosBuscar = function (buscador, callback) {
    var connection = getConnection();
    var conocimientos = null;
    var sql = "SELECT c.conocimientoId, c.nombre, c.catConocimientoId, cc.nombre AS ncatConocimiento";
    sql += " FROM conocimientos AS c LEFT JOIN catConocimientos AS cc ON cc.catConocimientoId = c.catConocimientoId";
    if (buscador.nombre !== "*") {
        sql += " WHERE c.nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        conocimientos = fromDbtoJsConocimientos(result);
        callback(null, conocimientos);
    });
    closeConnectionCallback(connection, callback);
}

// postConocimientosBuscarPorCategoria
// lee todos los registros de la tabla conocimientos cuyo
// catConocimiento es del Id pasado. Si la cadena es '*'
// devuelve todos los registros
module.exports.postConocimientosBuscarPorCategoria = function (buscador, callback) {
    var connection = getConnection();
    var conocimientos = null;
    var sql = "SELECT c.conocimientoId, c.nombre, c.catConocimientoId, cc.nombre AS ncatConocimiento";
    sql += " FROM conocimientos AS c LEFT JOIN catConocimientos AS cc ON cc.catConocimientoId = c.catConocimientoId";
    if (buscador.nombre !== "*") {
        sql += " WHERE c.catConocimientoId = ?";
        sql = mysql.format(sql, buscador.catConocimientoId);
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        conocimientos = fromDbtoJsConocimientos(result);
        callback(null, conocimientos);
    });
    closeConnectionCallback(connection, callback);
}

// getConocimiento
// busca  el conocimiento con id pasado
module.exports.getConocimiento = function(id, callback){
	var connection = getConnection();
    var conocimiento = null;
    var sql = "SELECT c.conocimientoId, c.nombre, c.catConocimientoId, cc.nombre AS ncatConocimiento";
    sql += " FROM conocimientos AS c LEFT JOIN catConocimientos AS cc ON cc.catConocimientoId = c.catConocimientoId";
	sql += " WHERE c.conocimientoId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		if (result.length == 0){
			callback(null, null);
			return;
        }
        conocimiento = fromDbtoJsConocimiento(result[0]);
		callback(null, conocimiento);
	});
	closeConnectionCallback(connection, callback);
}


// postConocimiento
// crear en la base de datos el conocimiento pasado
module.exports.postConocimiento = function (conocimiento, callback){
	if (!comprobarConocimiento(conocimiento)){
		var err = new Error("El conocimiento pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
    var connection = getConnection();
    var conocimientoDb = fromJstoDbConocimiento(conocimiento);
	conocimientoDb.conocimientoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO conocimientos SET ?";
	sql = mysql.format(sql, conocimientoDb);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
        }
        sql = "SELECT c.conocimientoId, c.nombre, c.catConocimientoId, cc.nombre AS ncatConocimiento";
        sql += " FROM conocimientos AS c LEFT JOIN catConocimientos AS cc ON cc.catConocimientoId = c.catConocimientoId";
        sql += " WHERE c.conocimientoId = ?";
        sql = mysql.format(sql, result.insertId);
        connection.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.length == 0) {
                callback(null, null);
                return;
            }
            conocimiento = fromDbtoJsConocimiento(result[0]);
            callback(null, conocimiento);
            closeConnectionCallback(connection, callback);
        });
	});
}

// putConocimiento
// Modifica el conocimiento según los datos del objeto pasao
module.exports.putConocimiento = function(id, conocimiento, callback){
	if (!comprobarConocimiento(conocimiento)){
		var err = new Error("El conocimiento pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != conocimiento.conocimientoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var connection = getConnection();
    var conocimientoDb = fromJstoDbConocimiento(conocimiento);
	var sql = "UPDATE conocimientos SET ? WHERE conocimientoId = ?";
	sql = mysql.format(sql, [conocimientoDb, conocimientoDb.conocimientoId]);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
		}
        var sql = "SELECT c.conocimientoId, c.nombre, c.catConocimientoId, cc.nombre AS ncatConocimiento";
        sql += " FROM conocimientos AS c LEFT JOIN catConocimientos AS cc ON cc.catConocimientoId = c.catConocimientoId";
        sql += " WHERE c.conocimientoId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.length == 0) {
                callback(null, null);
                return;
            }
            conocimiento = fromDbtoJsConocimiento(result[0]);
            callback(null, conocimiento);
            closeConnectionCallback(connection, callback);
        });
	});
}

// deleteConocimiento
// Elimina el conocimiento con el id pasado
module.exports.deleteConocimiento = function(id, conocimiento, callback){
	var connection = getConnection();
	sql = "DELETE from conocimientos WHERE conocimientoId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}