// roles_db_mysql
// Manejo de la tabla roles en la base de datos
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

// comprobarRol
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarRol(rol){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof rol;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && rol.hasOwnProperty("rolId"));
	comprobado = (comprobado && rol.hasOwnProperty("nombre"));
	return comprobado;
}


// getRoles
// lee todos los registros de la tabla roles y
// los devuelve como una lista de objetos
module.exports.getRoles = function(callback){
	var connection = getConnection();
	var roles = null;
	sql = "SELECT * FROM roles";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		roles = result;
		callback(null, roles);
	});	
	closeConnectionCallback(connection, callback);
}

// postRolesBuscar
// lee todos los registros de la tabla roles cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postRolesBuscar = function (buscador, callback) {
    var connection = getConnection();
    var roles = null;
    var sql = "SELECT * FROM roles";
    if (buscador.nombre !== "*") {
        sql = "SELECT * FROM roles WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        roles = result;
        callback(null, roles);
    });
    closeConnectionCallback(connection, callback);
}

// getRol
// busca  el rol con id pasado
module.exports.getRol = function(id, callback){
	var connection = getConnection();
	var roles = null;
	sql = "SELECT * FROM roles WHERE rolId = ?";
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


// postRol
// crear en la base de datos el rol pasado
module.exports.postRol = function (rol, callback){
	if (!comprobarRol(rol)){
		var err = new Error("El rol pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	rol.rolId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO roles SET ?";
	sql = mysql.format(sql, rol);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		rol.rolId = result.insertId;
		callback(null, rol);
	});
	closeConnectionCallback(connection, callback);
}

// putRol
// Modifica el rol según los datos del objeto pasao
module.exports.putRol = function(id, rol, callback){
	if (!comprobarRol(rol)){
		var err = new Error("El rol pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != rol.rolId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE roles SET ? WHERE rolId = ?";
	sql = mysql.format(sql, [rol, rol.rolId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, rol);
	});
	closeConnectionCallback(connection, callback);
}

// deleteRol
// Elimina el rol con el id pasado
module.exports.deleteRol = function(id, rol, callback){
	var connection = getConnection();
	sql = "DELETE from roles WHERE rolId = ?";
	sql = mysql.format(sql, rol.rolId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}