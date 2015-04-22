// asgObjetivos_db_mysql
// Manejo de la tabla asgObjetivos en la base de datos
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

// comprobarAsgObjetivo
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarAsgObjetivo(asgObjetivo){
	// debe ser objeto del tipo que toca
	var comprobado = typeof asgObjetivo === "object";
	// en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && asgObjetivo.hasOwnProperty("asgObjetivoId"));
    comprobado = (comprobado && asgObjetivo.hasOwnProperty("asgTrabajador"));
    if (comprobado) {
        comprobado = typeof asgObjetivo.asgTrabajador === "object";
        comprobado = (comprobado && asgObjetivo.asgTrabajador.hasOwnProperty("asgTrabajadorId"));
    }
    comprobado = (comprobado && asgObjetivo.hasOwnProperty("objetivo"));
    if (comprobado) {
        comprobado = typeof asgObjetivo.objetivo === "object";
        comprobado = (comprobado && asgObjetivo.objetivo.hasOwnProperty("objetivoId"));
    }
    comprobado = (comprobado && asgObjetivo.hasOwnProperty("asSn"));
    comprobado = (comprobado && asgObjetivo.hasOwnProperty("asPorObjetivo"));
    comprobado = (comprobado && asgObjetivo.hasOwnProperty("asMinNum"));
    comprobado = (comprobado && asgObjetivo.hasOwnProperty("asMaxNum"));
    comprobado = (comprobado && asgObjetivo.hasOwnProperty("asPesoVariable"));
	return comprobado;
}

// fromDbtoJsAsgObjetivos
// transforma un array tal y como lo trae de la base la
// base de datos en el array de js correspondiente.
function fromDbtoJsAsgObjetivos(asgObjetivos){
    var asgObjetivosJs = [];
    for (var i = 0; i < asgObjetivos.length; i++) {
        asgObjetivosJs.push(fromDbtoJsAsgObjetivo(asgObjetivos[i]));
    }
    return asgObjetivosJs;
}

// fromDbtoJsAsgObjetivo
// transforma un objeto tal y como lo trae de la base la
// base de datos en el js correspondiente.
function fromDbtoJsAsgObjetivo(asgObjetivoDb){
    var asgObjetivoJs = {
        asgObjetivoId: asgObjetivoDb.asgObjetivoId,
        asgTrabajador: {
            asgTrabajadorId: asgObjetivoDb.asgTrabajadorId,
            nombre: asgObjetivoDb.nasgTrabajador
        },
        objetivo: {
            objetivoId: asgObjetivoDb.objetivoId,
            nombre: asgObjetivoDb.nobjetivo
        },
        categoria: {
            categoriaId: asgObjetivoDb.categoriaId,
            nombre: asgObjetivoDb.ncategoria
        },
        tipo: {
            tipoId: asgObjetivoDb.tipoId,
            nombre: asgObjetivoDb.ntipo
        },
        ejercicio: {
            ejercicioId: asgObjetivoDb.ejercicioId,
            nombre: asgObjetivoDb.nejercicio,
            fechaInicio: asgObjetivoDb.fechaInicio,
            fechaFinal: asgObjetivoDb.fechaFinal,
            porPuertaAcceso: asgObjetivoDb.porPuertaAcceso,
            porOrganizacion: asgObjetivoDb.porOrganizacion,
            porIndividual: asgObjetivoDb.porIndividual
        },
        asSn: asgObjetivoDb.asSn,
        asPorObjetivo: asgObjetivoDb.asPorObjetivo,
        asMinNum: asgObjetivoDb.asMinNum,
        asMaxNum: asgObjetivoDb.asMaxNum,
        asPesoVariable: asgObjetivoDb.asPesoVariable,
        comentarios: asgObjetivoDb.comentarios
    };
    return asgObjetivoJs;
}

// fromJstoDbAsgObjetivo
// trasforma un objeto js en otro db
// que puede ser usado en la base de datos
function fromJstoDbAsgObjetivo(asgObjetivoJs){
    var asgObjetivoDb = {
        asgObjetivoId: asgObjetivoJs.asgObjetivoId,
        asgTrabajadorId: asgObjetivoJs.asgTrabajador.asgTrabajadorId,
        objetivoId: asgObjetivoJs.objetivo.objetivoId,
        asSn: asgObjetivoJs.asSn,
        asPorObjetivo: asgObjetivoJs.asPorObjetivo,
        asMinNum: asgObjetivoJs.asMinNum,
        asMaxNum: asgObjetivoJs.asMaxNum,
        asPesoVariable: asgObjetivoJs.asPesoVariable,
        comentarios: asgObjetivoJs.comentarios
    };
    return asgObjetivoDb;
}


// getAsgObjetivos
// lee todos los registros de la tabla asgObjetivos y
// los devuelve como una lista de objetos
module.exports.getAsgObjetivos = function(callback){
	var connection = getConnection();
	var asgObjetivos = null;
    var sql = "SELECT asgo.asgObjetivoId,";
    sql += " asgo.asgTrabajadorId AS asgTrabajadorId, asgt.nombre AS nasgTrabajador,";
    sql += " asgo.objetivoId, o.nombre AS nobjetivo, ";
    sql += " o.categoriaId, c.nombre AS ncategoria,";
    sql += " o.tipoId, t.nombre AS ntipo,";
    sql += " asgt.ejercicioId, e.fechaInicio, e.fechaFinal, e.porPuertaAcceso, e.porOrganizacion, e.porIndividual,";
    sql += " asgo.asSn, asgo.asPorObjetivo, asgo.asMinNum, asgo.asMaxNum, asgo.asPesoVariable, asgo.comentarios";
    sql += " FROM asg_objetivos AS asgo";
    sql += " LEFT JOIN asg_trabajadores AS asgt ON asgt.asgTrabajadorId = asgo.asgTrabajadorId";
    sql += " LEFT JOIN objetivos AS o ON o.objetivoId = asgo.objetivoId";
    sql += " LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId";
    sql += " LEFT JOIN tipos AS t ON t.tipoId = o.tipoId";
    sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		asgObjetivos = fromDbtoJsAsgObjetivos(result);
		callback(null, asgObjetivos);
	});	
	closeConnectionCallback(connection, callback);
}

// postAsgObjetivosBuscar
// lee todos los registros de la tabla asgObjetivos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postAsgObjetivosBuscar = function (buscador, callback) {
    var connection = getConnection();
    var asgObjetivos = null;
    var sql = "SELECT asgo.asgObjetivoId,";
    sql += " asgo.asgTrabajadorId AS asgTrabajadorId, asgt.nombre AS nasgTrabajador,";
    sql += " asgo.objetivoId, o.nombre AS nobjetivo, ";
    sql += " o.categoriaId, c.nombre AS ncategoria,";
    sql += " o.tipoId, t.nombre AS ntipo,";
    sql += " asgt.ejercicioId, e.fechaInicio, e.fechaFinal, e.porPuertaAcceso, e.porOrganizacion, e.porIndividual,";
    sql += " asgo.asSn, asgo.asPorObjetivo, asgo.asMinNum, asgo.asMaxNum, asgo.asPesoVariable, asgo.comentarios";
    sql += " FROM asg_objetivos AS asgo";
    sql += " LEFT JOIN asg_trabajadores AS asgt ON asgt.asgTrabajadorId = asgo.asgTrabajadorId";
    sql += " LEFT JOIN objetivos AS o ON o.objetivoId = asgo.objetivoId";
    sql += " LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId";
    sql += " LEFT JOIN tipos AS t ON t.tipoId = o.tipoId";
    sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
    if (buscador.nombre !== "*") {
        sql += " WHERE asgt.nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        asgObjetivos = fromDbtoJsAsgObjetivos(result);
        callback(null, asgObjetivos);
    });
    closeConnectionCallback(connection, callback);
}

// postAsgObjetivosBuscar
// lee todos los registros de la tabla asgObjetivos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postAsgObjetivosBuscarPorAsignacionCategoria = function (buscador, callback) {
    var connection = getConnection();
    var asgObjetivos = null;
    var sql = "SELECT asgo.asgObjetivoId,";
    sql += " asgo.asgTrabajadorId AS asgTrabajadorId, asgt.nombre AS nasgTrabajador,";
    sql += " asgo.objetivoId, o.nombre AS nobjetivo, ";
    sql += " o.categoriaId, c.nombre AS ncategoria,";
    sql += " o.tipoId, t.nombre AS ntipo,";
    sql += " asgt.ejercicioId, e.fechaInicio, e.fechaFinal, e.porPuertaAcceso, e.porOrganizacion, e.porIndividual,";
    sql += " asgo.asSn, asgo.asPorObjetivo, asgo.asMinNum, asgo.asMaxNum, asgo.asPesoVariable, asgo.comentarios";
    sql += " FROM asg_objetivos AS asgo";
    sql += " LEFT JOIN asg_trabajadores AS asgt ON asgt.asgTrabajadorId = asgo.asgTrabajadorId";
    sql += " LEFT JOIN objetivos AS o ON o.objetivoId = asgo.objetivoId";
    sql += " LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId";
    sql += " LEFT JOIN tipos AS t ON t.tipoId = o.tipoId";
    sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
    sql += " WHERE asgt.asgTrabajadorId = ? AND o.categoriaId = ?";
    sql = mysql.format(sql, [buscador.asgTrabajadorId, buscador.categoriaId]);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        asgObjetivos = fromDbtoJsAsgObjetivos(result);
        callback(null, asgObjetivos);
    });
    closeConnectionCallback(connection, callback);
}

// getAsgObjetivo
// busca  el asgObjetivo con id pasado
module.exports.getAsgObjetivo = function(id, callback){
	var connection = getConnection();
    var asgObjetivo = null;
    var sql = "SELECT asgo.asgObjetivoId,";
    sql += " asgo.asgTrabajadorId AS asgTrabajadorId, asgt.nombre AS nasgTrabajador,";
    sql += " asgo.objetivoId, o.nombre AS nobjetivo, ";
    sql += " o.categoriaId, c.nombre AS ncategoria,";
    sql += " o.tipoId, t.nombre AS ntipo,";
    sql += " asgt.ejercicioId, e.fechaInicio, e.fechaFinal, e.porPuertaAcceso, e.porOrganizacion, e.porIndividual,";
    sql += " asgo.asSn, asgo.asPorObjetivo, asgo.asMinNum, asgo.asMaxNum, asgo.asPesoVariable, asgo.comentarios";
    sql += " FROM asg_objetivos AS asgo";
    sql += " LEFT JOIN asg_trabajadores AS asgt ON asgt.asgTrabajadorId = asgo.asgTrabajadorId";
    sql += " LEFT JOIN objetivos AS o ON o.objetivoId = asgo.objetivoId";
    sql += " LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId";
    sql += " LEFT JOIN tipos AS t ON t.tipoId = o.tipoId";
    sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
	sql += " WHERE asgo.asgObjetivoId = ?";
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
        asgObjetivo = fromDbtoJsAsgObjetivo(result[0]);
		callback(null, asgObjetivo);
	});
	closeConnectionCallback(connection, callback);
}


// postAsgObjetivo
// crear en la base de datos el asgObjetivo pasado
module.exports.postAsgObjetivo = function (asgObjetivo, callback){
	if (!comprobarAsgObjetivo(asgObjetivo)){
		var err = new Error("El asgObjetivo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
    var connection = getConnection();
    var asgObjetivoDb = fromJstoDbAsgObjetivo(asgObjetivo);
	asgObjetivoDb.asgObjetivoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO asg_objetivos SET ?";
	sql = mysql.format(sql, asgObjetivoDb);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
        }
        var sql = "SELECT asgo.asgObjetivoId,";
        sql += " asgo.asgTrabajadorId AS asgTrabajadorId, asgt.nombre AS nasgTrabajador,";
        sql += " asgo.objetivoId, o.nombre AS nobjetivo, ";
        sql += " o.categoriaId, c.nombre AS ncategoria,";
        sql += " o.tipoId, t.nombre AS ntipo,";
        sql += " asgt.ejercicioId, e.fechaInicio, e.fechaFinal, e.porPuertaAcceso, e.porOrganizacion, e.porIndividual,";
        sql += " asgo.asSn, asgo.asPorObjetivo, asgo.asMinNum, asgo.asMaxNum, asgo.asPesoVariable, asgo.comentarios";
        sql += " FROM asg_objetivos AS asgo";
        sql += " LEFT JOIN asg_trabajadores AS asgt ON asgt.asgTrabajadorId = asgo.asgTrabajadorId";
        sql += " LEFT JOIN objetivos AS o ON o.objetivoId = asgo.objetivoId";
        sql += " LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId";
        sql += " LEFT JOIN tipos AS t ON t.tipoId = o.tipoId";
        sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
        sql += " WHERE asgo.asgObjetivoId = ?";
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
            asgObjetivo = fromDbtoJsAsgObjetivo(result[0]);
            callback(null, asgObjetivo);
            closeConnectionCallback(connection, callback);
        });
	});
}

// putAsgObjetivo
// Modifica el asgObjetivo según los datos del objeto pasao
module.exports.putAsgObjetivo = function(id, asgObjetivo, callback){
	if (!comprobarAsgObjetivo(asgObjetivo)){
		var err = new Error("El asgObjetivo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != asgObjetivo.asgObjetivoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var connection = getConnection();
    var asgObjetivoDb = fromJstoDbAsgObjetivo(asgObjetivo);
	var sql = "UPDATE asg_objetivos SET ? WHERE asgObjetivoId = ?";
	sql = mysql.format(sql, [asgObjetivoDb, asgObjetivoDb.asgObjetivoId]);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
		}
        var sql = "SELECT asgo.asgObjetivoId,";
        sql += " asgo.asgTrabajadorId AS asgTrabajadorId, asgt.nombre AS nasgTrabajador,";
        sql += " asgo.objetivoId, o.nombre AS nobjetivo, ";
        sql += " o.categoriaId, c.nombre AS ncategoria,";
        sql += " o.tipoId, t.nombre AS ntipo,";
        sql += " asgt.ejercicioId, e.fechaInicio, e.fechaFinal, e.porPuertaAcceso, e.porOrganizacion, e.porIndividual,";
        sql += " asgo.asSn, asgo.asPorObjetivo, asgo.asMinNum, asgo.asMaxNum, asgo.asPesoVariable, asgo.comentarios";
        sql += " FROM asg_objetivos AS asgo";
        sql += " LEFT JOIN asg_trabajadores AS asgt ON asgt.asgTrabajadorId = asgo.asgTrabajadorId";
        sql += " LEFT JOIN objetivos AS o ON o.objetivoId = asgo.objetivoId";
        sql += " LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId";
        sql += " LEFT JOIN tipos AS t ON t.tipoId = o.tipoId";
        sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
        sql += " WHERE asgo.asgObjetivoId = ?";
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
            asgObjetivo = fromDbtoJsAsgObjetivo(result[0]);
            callback(null, asgObjetivo);
            closeConnectionCallback(connection, callback);
        });
	});
}

// deleteAsgObjetivo
// Elimina el asgObjetivo con el id pasado
module.exports.deleteAsgObjetivo = function(id, asgObjetivo, callback){
	var connection = getConnection();
	sql = "DELETE from asg_objetivos WHERE asgObjetivoId = ?";
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