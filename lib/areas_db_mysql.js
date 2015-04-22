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

function closeConnectionCallback(connection, callback){
	connection.end(function(err){
		if (err) callback(err);
	});
}

// comprobarArea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarArea(area){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof area;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && area.hasOwnProperty("areaId"));
	comprobado = (comprobado && area.hasOwnProperty("nombre"));
	return comprobado;
}


// getAreas
// lee todos los registros de la tabla areas y
// los devuelve como una lista de objetos
module.exports.getAreas = function(callback){
	var connection = getConnection();
	var areas = null;
	sql = "SELECT * FROM areas";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		areas = result;
		callback(null, areas);
	});	
	closeConnectionCallback(connection, callback);
}

// postAreasBuscar
// lee todos los registros de la tabla areas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postAreasBuscar = function (buscador, callback) {
    var connection = getConnection();
    var areas = null;
    var sql = "SELECT * FROM areas";
    if (buscador.nombre !== "*") {
        sql = "SELECT * FROM areas WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        areas = result;
        callback(null, areas);
    });
    closeConnectionCallback(connection, callback);
}

// getArea
// busca  el area con id pasado
module.exports.getArea = function(id, callback){
	var connection = getConnection();
	var areas = null;
	sql = "SELECT * FROM areas WHERE areaId = ?";
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
		callback(null, result[0]);
	});
	closeConnectionCallback(connection, callback);
}


// postArea
// crear en la base de datos el area pasado
module.exports.postArea = function (area, callback){
	if (!comprobarArea(area)){
		var err = new Error("El area pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	area.areaId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO areas SET ?";
	sql = mysql.format(sql, area);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		area.areaId = result.insertId;
		callback(null, area);
	});
	closeConnectionCallback(connection, callback);
}

// putArea
// Modifica el area según los datos del objeto pasao
module.exports.putArea = function(id, area, callback){
	if (!comprobarArea(area)){
		var err = new Error("El area pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != area.areaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE areas SET ? WHERE areaId = ?";
	sql = mysql.format(sql, [area, area.areaId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, area);
	});
	closeConnectionCallback(connection, callback);
}

// deleteArea
// Elimina el area con el id pasado
module.exports.deleteArea = function(id, area, callback){
	var connection = getConnection();
	sql = "DELETE from areas WHERE areaId = ?";
	sql = mysql.format(sql, area.areaId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}