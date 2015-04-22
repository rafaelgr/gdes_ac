// paises_db_mysql
// Manejo de la tabla paises en la base de datos
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

// comprobarPais
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarPais(pais){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof pais;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && pais.hasOwnProperty("paisId"));
	comprobado = (comprobado && pais.hasOwnProperty("nombre"));
	return comprobado;
}


// getPaises
// lee todos los registros de la tabla paises y
// los devuelve como una lista de objetos
module.exports.getPaises = function(callback){
	var connection = getConnection();
	var paises = null;
	sql = "SELECT * FROM paises";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		paises = result;
		callback(null, paises);
	});	
	closeConnectionCallback(connection, callback);
}

// postPaisesBuscar
// lee todos los registros de la tabla paises cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postPaisesBuscar = function (buscador, callback) {
    var connection = getConnection();
    var paises = null;
    var sql = "SELECT * FROM paises";
    if (buscador.nombre !== "*") {
        sql = "SELECT * FROM paises WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        paises = result;
        callback(null, paises);
    });
    closeConnectionCallback(connection, callback);
}

// getPais
// busca  el pais con id pasado
module.exports.getPais = function(id, callback){
	var connection = getConnection();
	var paises = null;
	sql = "SELECT * FROM paises WHERE paisId = ?";
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


// postPais
// crear en la base de datos el pais pasado
module.exports.postPais = function (pais, callback){
	if (!comprobarPais(pais)){
		var err = new Error("El pais pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	pais.paisId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO paises SET ?";
	sql = mysql.format(sql, pais);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		pais.paisId = result.insertId;
		callback(null, pais);
	});
	closeConnectionCallback(connection, callback);
}

// putPais
// Modifica el pais según los datos del objeto pasao
module.exports.putPais = function(id, pais, callback){
	if (!comprobarPais(pais)){
		var err = new Error("El pais pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != pais.paisId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE paises SET ? WHERE paisId = ?";
	sql = mysql.format(sql, [pais, pais.paisId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, pais);
	});
	closeConnectionCallback(connection, callback);
}

// deletePais
// Elimina el pais con el id pasado
module.exports.deletePais = function(id, pais, callback){
	var connection = getConnection();
	sql = "DELETE from paises WHERE paisId = ?";
	sql = mysql.format(sql, pais.paisId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}