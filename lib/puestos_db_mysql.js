// puestos_db_mysql
// Manejo de la tabla puestos en la base de datos
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

// comprobarPuesto
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarPuesto(puesto){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof puesto;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && puesto.hasOwnProperty("puestoId"));
	comprobado = (comprobado && puesto.hasOwnProperty("nombre"));
	return comprobado;
}


// getPuestos
// lee todos los registros de la tabla puestos y
// los devuelve como una lista de objetos
module.exports.getPuestos = function(callback){
	var connection = getConnection();
	var puestos = null;
	sql = "SELECT * FROM puestos";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		puestos = result;
		callback(null, puestos);
	});	
	closeConnectionCallback(connection, callback);
}

// postPuestosBuscar
// lee todos los registros de la tabla puestos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postPuestosBuscar = function (buscador, callback) {
    var connection = getConnection();
    var puestos = null;
    var sql = "SELECT * FROM puestos";
    if (buscador.nombre !== "*") {
        sql = "SELECT * FROM puestos WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        puestos = result;
        callback(null, puestos);
    });
    closeConnectionCallback(connection, callback);
}

// getPuesto
// busca  el puesto con id pasado
module.exports.getPuesto = function(id, callback){
	var connection = getConnection();
	var puestos = null;
	sql = "SELECT * FROM puestos WHERE puestoId = ?";
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


// postPuesto
// crear en la base de datos el puesto pasado
module.exports.postPuesto = function (puesto, callback){
	if (!comprobarPuesto(puesto)){
		var err = new Error("El puesto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	puesto.puestoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO puestos SET ?";
	sql = mysql.format(sql, puesto);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		puesto.puestoId = result.insertId;
		callback(null, puesto);
	});
	closeConnectionCallback(connection, callback);
}

// putPuesto
// Modifica el puesto según los datos del objeto pasao
module.exports.putPuesto = function(id, puesto, callback){
	if (!comprobarPuesto(puesto)){
		var err = new Error("El puesto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != puesto.puestoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE puestos SET ? WHERE puestoId = ?";
	sql = mysql.format(sql, [puesto, puesto.puestoId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, puesto);
	});
	closeConnectionCallback(connection, callback);
}

// deletePuesto
// Elimina el puesto con el id pasado
module.exports.deletePuesto = function(id, puesto, callback){
	var connection = getConnection();
	sql = "DELETE from puestos WHERE puestoId = ?";
	sql = mysql.format(sql, puesto.puestoId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}