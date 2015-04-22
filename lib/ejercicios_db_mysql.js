// ejercicios_db_mysql
// Manejo de la tabla ejercicios en la base de datos
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

// comprobarEjercicio
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarEjercicio(ejercicio){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof ejercicio;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && ejercicio.hasOwnProperty("ejercicioId"));
	comprobado = (comprobado && ejercicio.hasOwnProperty("nombre"));
	comprobado = (comprobado && ejercicio.hasOwnProperty("fechaInicio"));
	comprobado = (comprobado && ejercicio.hasOwnProperty("fechaFinal"));
    comprobado = (comprobado && ejercicio.hasOwnProperty("porPuertaAcceso"));
    comprobado = (comprobado && ejercicio.hasOwnProperty("porOrganizacion"));
    comprobado = (comprobado && ejercicio.hasOwnProperty("porIndividual"));
	return comprobado;
}


// getEjercicios
// lee todos los registros de la tabla ejercicios y
// los devuelve como una lista de objetos
module.exports.getEjercicios = function(callback){
	var connection = getConnection();
	var ejercicios = null;
	sql = "SELECT * FROM ejercicios";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		ejercicios = result;
		callback(null, ejercicios);
	});	
	closeConnectionCallback(connection, callback);
}

// postEjerciciosBuscar
// lee todos los registros de la tabla ejercicios cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postEjerciciosBuscar = function (buscador, callback) {
    var connection = getConnection();
    var ejercicios = null;
    var sql = "SELECT * FROM ejercicios";
    if (buscador.nombre !== "*") {
        sql = "SELECT * FROM ejercicios WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        ejercicios = result;
        callback(null, ejercicios);
    });
    closeConnectionCallback(connection, callback);
}

// getEjercicio
// busca  el ejercicio con id pasado
module.exports.getEjercicio = function(id, callback){
	var connection = getConnection();
	var ejercicios = null;
	sql = "SELECT * FROM ejercicios WHERE ejercicioId = ?";
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


// postEjercicio
// crear en la base de datos el ejercicio pasado
module.exports.postEjercicio = function (ejercicio, callback){
	if (!comprobarEjercicio(ejercicio)){
		var err = new Error("El ejercicio pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	ejercicio.ejercicioId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO ejercicios SET ?";
	sql = mysql.format(sql, ejercicio);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		ejercicio.ejercicioId = result.insertId;
		callback(null, ejercicio);
	});
	closeConnectionCallback(connection, callback);
}

// putEjercicio
// Modifica el ejercicio según los datos del objeto pasao
module.exports.putEjercicio = function(id, ejercicio, callback){
	if (!comprobarEjercicio(ejercicio)){
		var err = new Error("El ejercicio pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != ejercicio.ejercicioId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE ejercicios SET ? WHERE ejercicioId = ?";
	sql = mysql.format(sql, [ejercicio, ejercicio.ejercicioId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, ejercicio);
	});
	closeConnectionCallback(connection, callback);
}

// deleteEjercicio
// Elimina el ejercicio con el id pasado
module.exports.deleteEjercicio = function(id, ejercicio, callback){
	var connection = getConnection();
	sql = "DELETE from ejercicios WHERE ejercicioId = ?";
	sql = mysql.format(sql, ejercicio.ejercicioId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}