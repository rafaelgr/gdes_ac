// catConocimientos_db_mysql
// Manejo de la tabla catConocimientos en la base de datos
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

// comprobarCatConocimiento
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarCatConocimiento(catConocimiento){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof catConocimiento;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && catConocimiento.hasOwnProperty("catConocimientoId"));
	comprobado = (comprobado && catConocimiento.hasOwnProperty("nombre"));
	return comprobado;
}


// getCatConocimientos
// lee todos los registros de la tabla catConocimientos y
// los devuelve como una lista de objetos
module.exports.getCatConocimientos = function(callback){
	var connection = getConnection();
	var catConocimientos = null;
	sql = "SELECT * FROM catConocimientos";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		catConocimientos = result;
		callback(null, catConocimientos);
	});	
	closeConnectionCallback(connection, callback);
}

// postCatConocimientosBuscar
// lee todos los registros de la tabla catConocimientos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postCatConocimientosBuscar = function (buscador, callback) {
    var connection = getConnection();
    var catConocimientos = null;
    var sql = "SELECT * FROM catConocimientos";
    if (buscador.nombre !== "*") {
        sql = "SELECT * FROM catConocimientos WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        catConocimientos = result;
        callback(null, catConocimientos);
    });
    closeConnectionCallback(connection, callback);
}

// getCatConocimiento
// busca  el catConocimiento con id pasado
module.exports.getCatConocimiento = function(id, callback){
	var connection = getConnection();
	var catConocimientos = null;
	sql = "SELECT * FROM catConocimientos WHERE catConocimientoId = ?";
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


// postCatConocimiento
// crear en la base de datos el catConocimiento pasado
module.exports.postCatConocimiento = function (catConocimiento, callback){
	if (!comprobarCatConocimiento(catConocimiento)){
		var err = new Error("El catConocimiento pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	catConocimiento.catConocimientoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO catConocimientos SET ?";
	sql = mysql.format(sql, catConocimiento);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		catConocimiento.catConocimientoId = result.insertId;
		callback(null, catConocimiento);
	});
	closeConnectionCallback(connection, callback);
}

// putCatConocimiento
// Modifica el catConocimiento según los datos del objeto pasao
module.exports.putCatConocimiento = function(id, catConocimiento, callback){
	if (!comprobarCatConocimiento(catConocimiento)){
		var err = new Error("El catConocimiento pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != catConocimiento.catConocimientoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE catConocimientos SET ? WHERE catConocimientoId = ?";
	sql = mysql.format(sql, [catConocimiento, catConocimiento.catConocimientoId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, catConocimiento);
	});
	closeConnectionCallback(connection, callback);
}

// deleteCatConocimiento
// Elimina el catConocimiento con el id pasado
module.exports.deleteCatConocimiento = function(id, catConocimiento, callback){
	var connection = getConnection();
	sql = "DELETE from catConocimientos WHERE catConocimientoId = ?";
	sql = mysql.format(sql, catConocimiento.catConocimientoId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}