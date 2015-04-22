// categorias_db_mysql
// Manejo de la tabla categorias en la base de datos
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

// comprobarCategoria
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarCategoria(categoria){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof categoria;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && categoria.hasOwnProperty("categoriaId"));
	comprobado = (comprobado && categoria.hasOwnProperty("nombre"));
	return comprobado;
}


// getCategorias
// lee todos los registros de la tabla categorias y
// los devuelve como una lista de objetos
module.exports.getCategorias = function(callback){
	var connection = getConnection();
	var categorias = null;
	sql = "SELECT * FROM categorias";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		categorias = result;
		callback(null, categorias);
	});	
	closeConnectionCallback(connection, callback);
}

// postCategoriasBuscar
// lee todos los registros de la tabla categorias cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postCategoriasBuscar = function (buscador, callback) {
    var connection = getConnection();
    var categorias = null;
    var sql = "SELECT * FROM categorias";
    if (buscador.nombre !== "*") {
        sql = "SELECT * FROM categorias WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        categorias = result;
        callback(null, categorias);
    });
    closeConnectionCallback(connection, callback);
}

// getCategoria
// busca  el categoria con id pasado
module.exports.getCategoria = function(id, callback){
	var connection = getConnection();
	var categorias = null;
	sql = "SELECT * FROM categorias WHERE categoriaId = ?";
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


// postCategoria
// crear en la base de datos el categoria pasado
module.exports.postCategoria = function (categoria, callback){
	if (!comprobarCategoria(categoria)){
		var err = new Error("El categoria pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	categoria.categoriaId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO categorias SET ?";
	sql = mysql.format(sql, categoria);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		categoria.categoriaId = result.insertId;
		callback(null, categoria);
	});
	closeConnectionCallback(connection, callback);
}

// putCategoria
// Modifica el categoria según los datos del objeto pasao
module.exports.putCategoria = function(id, categoria, callback){
	if (!comprobarCategoria(categoria)){
		var err = new Error("El categoria pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != categoria.categoriaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE categorias SET ? WHERE categoriaId = ?";
	sql = mysql.format(sql, [categoria, categoria.categoriaId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, categoria);
	});
	closeConnectionCallback(connection, callback);
}

// deleteCategoria
// Elimina el categoria con el id pasado
module.exports.deleteCategoria = function(id, categoria, callback){
	var connection = getConnection();
	sql = "DELETE from categorias WHERE categoriaId = ?";
	sql = mysql.format(sql, categoria.categoriaId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}