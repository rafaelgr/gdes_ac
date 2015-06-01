// habilidades_db_mysql
// Manejo de la tabla habilidades en la base de datos
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

// comprobarHabilidad
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarHabilidad(habilidad){
	// debe ser objeto del tipo que toca
	var comprobado = typeof habilidad === "object";
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && habilidad.hasOwnProperty("habilidadId"));
    comprobado = (comprobado && habilidad.hasOwnProperty("nombre"));
    comprobado = (comprobado && habilidad.hasOwnProperty("servicio"));
    if (comprobado) {
        comprobado = typeof habilidad.servicio === "object";
        comprobado = (comprobado && habilidad.servicio.hasOwnProperty("servicioId"));
    }
	return comprobado;
}

// fromDbtoJsHabilidades
// transforma un array tal y como lo trae de la base la
// base de datos en el array de js correspondiente.
function fromDbtoJsHabilidades(habilidades){
    var habilidadesJs = [];
    for (var i = 0; i < habilidades.length; i++) {
        habilidadesJs.push(fromDbtoJsHabilidad(habilidades[i]));
    }
    return habilidadesJs;
}

// fromDbtoJsHabilidad
// transforma un objeto tal y como lo trae de la base la
// base de datos en el js correspondiente.
function fromDbtoJsHabilidad(habilidadDb){
    var habilidadJs = {
        habilidadId: habilidadDb.habilidadId,
        nombre: habilidadDb.nombre,
        servicio: {
            servicioId: habilidadDb.servicioId,
            nombre: habilidadDb.nservicio
        }
    };
    return habilidadJs;
}

// fromJstoDbHabilidad
// trasforma un objeto js en otro db
// que puede ser usado en la base de datos
function fromJstoDbHabilidad(habilidadJs){
    var habilidadDb = {
        habilidadId: habilidadJs.habilidadId,
        nombre: habilidadJs.nombre,
        servicioId: habilidadJs.servicio.servicioId,
    };
    return habilidadDb;
}


// getHabilidades
// lee todos los registros de la tabla habilidades y
// los devuelve como una lista de objetos
module.exports.getHabilidades = function(callback){
	var connection = getConnection();
	var habilidades = null;
    var sql = "SELECT c.habilidadId, c.nombre, c.servicioId, cc.nombre AS nservicio";
    sql += " FROM habilidades AS c LEFT JOIN servicios AS cc ON cc.servicioId = c.servicioId";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		habilidades = fromDbtoJsHabilidades(result);
		callback(null, habilidades);
	});	
	closeConnectionCallback(connection, callback);
}

// postHabilidadesBuscar
// lee todos los registros de la tabla habilidades cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postHabilidadesBuscar = function (buscador, callback) {
    var connection = getConnection();
    var habilidades = null;
    var sql = "SELECT c.habilidadId, c.nombre, c.servicioId, cc.nombre AS nservicio";
    sql += " FROM habilidades AS c LEFT JOIN servicios AS cc ON cc.servicioId = c.servicioId";
    if (buscador.nombre !== "*") {
        sql += " WHERE c.nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        habilidades = fromDbtoJsHabilidades(result);
        callback(null, habilidades);
    });
    closeConnectionCallback(connection, callback);
}

// postHabilidadesBuscarPorServicio
// lee todos los registros de la tabla habilidades cuyo
// servicioId es del Id pasado. Si la cadena es '*'
// devuelve todos los registros
module.exports.postHabilidadesBuscarPorServicio = function (buscador, callback) {
    var connection = getConnection();
    var habilidades = null;
    var sql = "SELECT c.habilidadId, c.nombre, c.servicioId, cc.nombre AS nservicio";
    sql += " FROM habilidades AS c LEFT JOIN servicios AS cc ON cc.servicioId = c.servicioId";
    if (buscador.nombre !== "*") {
        sql += " WHERE c.habilidadId = ?";
        sql = mysql.format(sql, buscador.servicioId);
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        habilidades = fromDbtoJsHabilidades(result);
        callback(null, habilidades);
    });
    closeConnectionCallback(connection, callback);
}

// getHabilidad
// busca  el habilidad con id pasado
module.exports.getHabilidad = function(id, callback){
	var connection = getConnection();
    var habilidad = null;
    var sql = "SELECT c.habilidadId, c.nombre, c.servicioId, cc.nombre AS nservicio";
    sql += " FROM habilidades AS c LEFT JOIN servicios AS cc ON cc.servicioId = c.servicioId";
	sql += " WHERE c.habilidadId = ?";
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
        habilidad = fromDbtoJsHabilidad(result[0]);
		callback(null, habilidad);
	});
	closeConnectionCallback(connection, callback);
}


// postHabilidad
// crear en la base de datos el habilidad pasado
module.exports.postHabilidad = function (habilidad, callback){
	if (!comprobarHabilidad(habilidad)){
		var err = new Error("El habilidad pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
    var connection = getConnection();
    var habilidadDb = fromJstoDbHabilidad(habilidad);
	habilidadDb.habilidadId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO habilidades SET ?";
	sql = mysql.format(sql, habilidadDb);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
        }
        sql = "SELECT c.habilidadId, c.nombre, c.servicioId, cc.nombre AS nservicio";
        sql += " FROM habilidades AS c LEFT JOIN servicios AS cc ON cc.servicioId = c.servicioId";
        sql += " WHERE c.habilidadId = ?";
        sql = mysql.format(sql, result.insertId);
        connection.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.length == 0) {
                callback(null, null);
                return;
            }
            habilidad = fromDbtoJsHabilidad(result[0]);
            callback(null, habilidad);
            closeConnectionCallback(connection, callback);
        });
	});
}

// putHabilidad
// Modifica el habilidad según los datos del objeto pasao
module.exports.putHabilidad = function(id, habilidad, callback){
	if (!comprobarHabilidad(habilidad)){
		var err = new Error("El habilidad pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != habilidad.habilidadId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var connection = getConnection();
    var habilidadDb = fromJstoDbHabilidad(habilidad);
	var sql = "UPDATE habilidades SET ? WHERE habilidadId = ?";
	sql = mysql.format(sql, [habilidadDb, habilidadDb.habilidadId]);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
		}
        var sql = "SELECT c.habilidadId, c.nombre, c.servicioId, cc.nombre AS nservicio";
        sql += " FROM habilidades AS c LEFT JOIN servicios AS cc ON cc.servicioId = c.servicioId";
        sql += " WHERE c.habilidadId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.length == 0) {
                callback(null, null);
                return;
            }
            habilidad = fromDbtoJsHabilidad(result[0]);
            callback(null, habilidad);
            closeConnectionCallback(connection, callback);
        });
	});
}

// deleteHabilidad
// Elimina el habilidad con el id pasado
module.exports.deleteHabilidad = function(id, habilidad, callback){
	var connection = getConnection();
	sql = "DELETE from habilidades WHERE habilidadId = ?";
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