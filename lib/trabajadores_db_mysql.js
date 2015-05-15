// trabajadores_db_mysql
// Manejo de la tabla trabajadores en la base de datos
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

// comprobarTrabajador
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTrabajador(trabajador){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof trabajador;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && trabajador.hasOwnProperty("trabajadorId"));
    comprobado = (comprobado && trabajador.hasOwnProperty("nombre"));
    comprobado = (comprobado && trabajador.hasOwnProperty("dni"));
	return comprobado;
}

// comprobarTrabajadorLogin
// comprueba que tiene la estructura de objeto mínima
// necesaria para gestionar el login
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTrabajadorLogin(trabajador) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof trabajador;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && trabajador.hasOwnProperty("login"));
    comprobado = (comprobado && trabajador.hasOwnProperty("password"));
    return comprobado;
}

// getTrabajadores
// lee todos los registros de la tabla trabajadores y
// los devuelve como una lista de objetos
module.exports.getTrabajadores = function(callback){
	var connection = getConnection();
	var trabajadores = null;
	sql = "SELECT * FROM trabajadores";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		trabajadores = result;
		callback(null, trabajadores);
	});	
	closeConnectionCallback(connection, callback);
}

// getEvaluadores
// lee todos los registros de la tabla trabajadores que corresponden
// a evaluadores y los devuelve como una lista de objetos
module.exports.getEvaluadores = function (callback) {
    var connection = getConnection();
    var trabajadores = null;
    sql = "SELECT * FROM trabajadores WHERE evaluador = 1";
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        trabajadores = result;
        callback(null, trabajadores);
    });
    closeConnectionCallback(connection, callback);
}

// postTrabajadoresBuscar
// lee todos los registros de la tabla trabajadores cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postTrabajadoresBuscar = function (buscador, callback) {
    var connection = getConnection();
    var trabajadores = null;
    var sql = "SELECT * FROM trabajadores";
    if (buscador.nombre !== "*") {
        sql = "SELECT * FROM trabajadores WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        trabajadores = result;
        callback(null, trabajadores);
    });
    closeConnectionCallback(connection, callback);
}


// postTrabajadoresBuscarEvaluador
// obtienen los trabajadores que son evaluados por el 
// trabbajador con el id pasado
module.exports.postTrabajadoresBuscarEvaluador = function (buscador, callback) {
    var connection = getConnection();
    var trabajadores = null;
    var sql = "SELECT DISTINCT t.trabajadorId, t.nombre";
    sql += " FROM asg_proyectos AS ap";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = ap.trabajadorId";
    sql += " WHERE ap.evaluadorId = ?";
    sql += " ORDER BY 2";
    sql = mysql.format(sql, buscador.evaluadorId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        trabajadores = result;
        callback(null, trabajadores);
    });
    closeConnectionCallback(connection, callback);
}



// getTrabajador
// busca  el trabajador con id pasado
module.exports.getTrabajador = function(id, callback){
	var connection = getConnection();
	var trabajadores = null;
	sql = "SELECT * FROM trabajadores WHERE trabajadorId = ?";
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


// postTrabajador
// crear en la base de datos el trabajador pasado
module.exports.postTrabajador = function (trabajador, callback){
	if (!comprobarTrabajador(trabajador)){
		var err = new Error("El trabajador pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	trabajador.trabajadorId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO trabajadores SET ?";
	sql = mysql.format(sql, trabajador);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		trabajador.trabajadorId = result.insertId;
		callback(null, trabajador);
	});
	closeConnectionCallback(connection, callback);
}

// putTrabajador
// Modifica el trabajador según los datos del objeto pasao
module.exports.putTrabajador = function(id, trabajador, callback){
	if (!comprobarTrabajador(trabajador)){
		var err = new Error("El trabajador pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != trabajador.trabajadorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE trabajadores SET ? WHERE trabajadorId = ?";
	sql = mysql.format(sql, [trabajador, trabajador.trabajadorId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, trabajador);
	});
	closeConnectionCallback(connection, callback);
}

// deleteTrabajador
// Elimina el trabajador con el id pasado
module.exports.deleteTrabajador = function(id, trabajador, callback){
	var connection = getConnection();
	sql = "DELETE from trabajadores WHERE trabajadorId = ?";
	sql = mysql.format(sql, trabajador.trabajadorId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}

// postTrabajador
// crear en la base de datos el trabajador pasado
module.exports.postTrabajadorLogin = function (trabajador, callback) {
    if (!comprobarTrabajadorLogin(trabajador)) {
        var err = new Error("El trabajador pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    var connection = getConnection();
    sql = "SELECT * FROM trabajadores WHERE login=? AND password=?";
    sql = mysql.format(sql, [trabajador.login, trabajador.password]);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err);
        }
        callback(null, result);
    });
    closeConnectionCallback(connection, callback);
}