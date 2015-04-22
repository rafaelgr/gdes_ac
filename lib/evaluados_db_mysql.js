// evaluados_db_mysql
// Manejo de la la relación entre evaluadores y evaluados
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


// postTrabajadoresBuscar
// lee todos los registros de la tabla trabajadores cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postEvaluadosBuscar = function (buscador, callback) {
    var connection = getConnection();
    var trabajadores = null;
    var sql = "SELECT et.evaluadorTrabajadorId, t.*";
    sql += " FROM evaluador_trabajador AS et";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = et.trabajadorId";
    sql += " WHERE evaluadorId = ?";
    sql = mysql.format(sql, buscador.evaluadorId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result);
    });
    closeConnectionCallback(connection, callback);
}

// postTrabajadorEvaluado
// crear en la base de datos el trabajador pasado
module.exports.postTrabajadorEvaluado = function (id, trabajador, callback){
	if (!comprobarTrabajador(trabajador)){
		var err = new Error("El trabajador pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    // montamos un objeto temporal para poder dar de alta en la base de datos
    evaluadorTrabajador = {
        evaluadorTrabajadorId: 0,
        evaluadorId: id,
        trabajadorId: trabajador.trabajadorId 
    };
	var connection = getConnection();
	trabajador.trabajadorId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO evaluador_trabajador SET ?";
	sql = mysql.format(sql, evaluadorTrabajador);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
        }else{
            evaluadorTrabajador.evaluadorTrabajadorId = result.insertId;
            callback(null, evaluadorTrabajador);
        }
	});
	closeConnectionCallback(connection, callback);
}

// deleteTrabajadorEvaluado
// Elimina el trabajador con el id pasado
module.exports.deleteTrabajadorEvaluado = function(id, evaluadorTrabajador, callback){
	var connection = getConnection();
	sql = "DELETE from evaluador_trabajador WHERE evaluadorTrabajadorId = ?";
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