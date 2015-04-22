// tipos_db_mysql
// Manejo de la tabla tipos en la base de datos
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

// comprobarTipo
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTipo(tipo){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof tipo;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && tipo.hasOwnProperty("tipoId"));
	comprobado = (comprobado && tipo.hasOwnProperty("nombre"));
	return comprobado;
}


// getTipos
// lee todos los registros de la tabla tipos y
// los devuelve como una lista de objetos
module.exports.getTipos = function(callback){
	var connection = getConnection();
	var tipos = null;
	sql = "SELECT * FROM tipos";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		tipos = result;
		callback(null, tipos);
	});	
	closeConnectionCallback(connection, callback);
}

// postTiposBuscar
// lee todos los registros de la tabla tipos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postTiposBuscar = function (buscador, callback) {
    var connection = getConnection();
    var tipos = null;
    var sql = "SELECT * FROM tipos";
    if (buscador.nombre !== "*") {
        sql = "SELECT * FROM tipos WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        tipos = result;
        callback(null, tipos);
    });
    closeConnectionCallback(connection, callback);
}

// getTipo
// busca  el tipo con id pasado
module.exports.getTipo = function(id, callback){
	var connection = getConnection();
	var tipos = null;
	sql = "SELECT * FROM tipos WHERE tipoId = ?";
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


// postTipo
// crear en la base de datos el tipo pasado
module.exports.postTipo = function (tipo, callback){
	if (!comprobarTipo(tipo)){
		var err = new Error("El tipo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	tipo.tipoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO tipos SET ?";
	sql = mysql.format(sql, tipo);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		tipo.tipoId = result.insertId;
		callback(null, tipo);
	});
	closeConnectionCallback(connection, callback);
}

// putTipo
// Modifica el tipo según los datos del objeto pasao
module.exports.putTipo = function(id, tipo, callback){
	if (!comprobarTipo(tipo)){
		var err = new Error("El tipo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != tipo.tipoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE tipos SET ? WHERE tipoId = ?";
	sql = mysql.format(sql, [tipo, tipo.tipoId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, tipo);
	});
	closeConnectionCallback(connection, callback);
}

// deleteTipo
// Elimina el tipo con el id pasado
module.exports.deleteTipo = function(id, tipo, callback){
	var connection = getConnection();
	sql = "DELETE from tipos WHERE tipoId = ?";
	sql = mysql.format(sql, tipo.tipoId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}