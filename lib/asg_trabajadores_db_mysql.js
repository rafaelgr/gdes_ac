// asgTrabajadores_db_mysql
// Manejo de la tabla asgTrabajadores en la base de datos
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

// comprobarAsgTrabajador
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarAsgTrabajador(asgTrabajador){
	// debe ser objeto del tipo que toca
	var comprobado = typeof asgTrabajador === "object";
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && asgTrabajador.hasOwnProperty("asgTrabajadorId"));
    comprobado = (comprobado && asgTrabajador.hasOwnProperty("nombre"));
    comprobado = (comprobado && asgTrabajador.hasOwnProperty("trabajador"));
    if (comprobado) {
        comprobado = typeof asgTrabajador.trabajador === "object";
        comprobado = (comprobado && asgTrabajador.trabajador.hasOwnProperty("trabajadorId"));
    }
    comprobado = (comprobado && asgTrabajador.hasOwnProperty("ejercicio"));
    if (comprobado) {
        comprobado = typeof asgTrabajador.ejercicio === "object";
        comprobado = (comprobado && asgTrabajador.ejercicio.hasOwnProperty("ejercicioId"));
    }
    comprobado = (comprobado && asgTrabajador.hasOwnProperty("pais"));
    if (comprobado) {
        comprobado = typeof asgTrabajador.pais === "object";
        comprobado = (comprobado && asgTrabajador.pais.hasOwnProperty("paisId"));
    }
    comprobado = (comprobado && asgTrabajador.hasOwnProperty("unidad"));
    if (comprobado) {
        comprobado = typeof asgTrabajador.unidad === "object";
        comprobado = (comprobado && asgTrabajador.unidad.hasOwnProperty("unidadId"));
    }
    comprobado = (comprobado && asgTrabajador.hasOwnProperty("area"));
    if (comprobado) {
        comprobado = typeof asgTrabajador.area === "object";
        comprobado = (comprobado && asgTrabajador.area.hasOwnProperty("areaId"));
    }
    comprobado = (comprobado && asgTrabajador.hasOwnProperty("puesto"));
    if (comprobado) {
        comprobado = typeof asgTrabajador.puesto === "object";
        comprobado = (comprobado && asgTrabajador.puesto.hasOwnProperty("puestoId"));
    }
    comprobado = (comprobado && asgTrabajador.hasOwnProperty("fijo"));
    comprobado = (comprobado && asgTrabajador.hasOwnProperty("variable"));
	return comprobado;
}

// fromDbtoJsAsgTrabajadores
// transforma un array tal y como lo trae de la base la
// base de datos en el array de js correspondiente.
function fromDbtoJsAsgTrabajadores(asgTrabajadores){
    var asgTrabajadoresJs = [];
    for (var i = 0; i < asgTrabajadores.length; i++) {
        asgTrabajadoresJs.push(fromDbtoJsAsgTrabajador(asgTrabajadores[i]));
    }
    return asgTrabajadoresJs;
}

// fromDbtoJsAsgTrabajador
// transforma un objeto tal y como lo trae de la base la
// base de datos en el js correspondiente.
function fromDbtoJsAsgTrabajador(asgTrabajadorDb){
    var asgTrabajadorJs = {
        asgTrabajadorId: asgTrabajadorDb.asgTrabajadorId,
        nombre: asgTrabajadorDb.nombre,
        trabajador: {
            trabajadorId: asgTrabajadorDb.trabajadorId,
            nombre: asgTrabajadorDb.ntrabajador
        },
        ejercicio: {
            ejercicioId: asgTrabajadorDb.ejercicioId,
            nombre: asgTrabajadorDb.nejercicio
        },
        pais: {
            paisId: asgTrabajadorDb.paisId,
            nombre: asgTrabajadorDb.npais
        },
        unidad: {
            unidadId: asgTrabajadorDb.unidadId,
            nombre: asgTrabajadorDb.nunidad
        },
        area: {
            areaId: asgTrabajadorDb.areaId,
            nombre: asgTrabajadorDb.narea
        },
        puesto: {
            puestoId: asgTrabajadorDb.puestoId,
            nombre: asgTrabajadorDb.npuesto
        },
        fijo: asgTrabajadorDb.fijo,
        variable: asgTrabajadorDb.variable,
    };
    return asgTrabajadorJs;
}

// fromJstoDbAsgTrabajador
// trasforma un objeto js en otro db
// que puede ser usado en la base de datos
function fromJstoDbAsgTrabajador(asgTrabajadorJs){
    var asgTrabajadorDb = {
        asgTrabajadorId: asgTrabajadorJs.asgTrabajadorId,
        nombre: asgTrabajadorJs.nombre,
        trabajadorId: asgTrabajadorJs.trabajador.trabajadorId,
        ejercicioId: asgTrabajadorJs.ejercicio.ejercicioId,
        paisId: asgTrabajadorJs.pais.paisId,
        unidadId: asgTrabajadorJs.unidad.unidadId,
        areaId: asgTrabajadorJs.area.areaId,
        puestoId: asgTrabajadorJs.puesto.puestoId,
        fijo: asgTrabajadorJs.fijo,
        variable: asgTrabajadorJs.variable
    };
    return asgTrabajadorDb;
}


// getAsgTrabajadores
// lee todos los registros de la tabla asgTrabajadores y
// los devuelve como una lista de objetos
module.exports.getAsgTrabajadores = function(callback){
	var connection = getConnection();
	var asgTrabajadores = null;
    var sql = "SELECT asgt.asgTrabajadorId, asgt.nombre,";
    sql += " asgt.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgt.ejercicioId, e.nombre AS nejercicio,";
    sql += " asgt.paisId, p.nombre AS npais,";
    sql += " asgt.unidadId, u.nombre AS nunidad,";
    sql += " asgt.areaId, a.nombre AS narea,";
    sql += " asgt.puestoId, pst.nombre AS npuesto,";
    sql += " asgt.fijo, asgt.variable";
    sql += " FROM asg_trabajadores AS asgt";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgt.trabajadorId";
    sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
    sql += " LEFT JOIN paises AS p ON p.paisId = asgt.paisId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = asgt.unidadId";
    sql += " LEFT JOIN areas AS a ON a.areaId = asgt.areaId";
    sql += " LEFT JOIN puestos AS pst ON pst.puestoId = asgt.puestoId";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		asgTrabajadores = fromDbtoJsAsgTrabajadores(result);
		callback(null, asgTrabajadores);
	});	
	closeConnectionCallback(connection, callback);
}

// postAsgTrabajadoresBuscar
// lee todos los registros de la tabla asgTrabajadores cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postAsgTrabajadoresBuscar = function (buscador, callback) {
    var connection = getConnection();
    var asgTrabajadores = null;
    var sql = "SELECT asgt.asgTrabajadorId, asgt.nombre,";
    sql += " asgt.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgt.ejercicioId, e.nombre AS nejercicio,";
    sql += " asgt.paisId, p.nombre AS npais,";
    sql += " asgt.unidadId, u.nombre AS nunidad,";
    sql += " asgt.areaId, a.nombre AS narea,";
    sql += " asgt.puestoId, pst.nombre AS npuesto,";
    sql += " asgt.fijo, asgt.variable";
    sql += " FROM asg_trabajadores AS asgt";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgt.trabajadorId";
    sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
    sql += " LEFT JOIN paises AS p ON p.paisId = asgt.paisId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = asgt.unidadId";
    sql += " LEFT JOIN areas AS a ON a.areaId = asgt.areaId";
    sql += " LEFT JOIN puestos AS pst ON pst.puestoId = asgt.puestoId";
    if (buscador.nombre !== "*") {
        sql += " WHERE asgt.nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        asgTrabajadores = fromDbtoJsAsgTrabajadores(result);
        callback(null, asgTrabajadores);
    });
    closeConnectionCallback(connection, callback);
}

module.exports.postAsgTrabajadorBuscar = function (buscador, callback) {
    var connection = getConnection();
    var asgTrabajadores = null;
    var sql = "SELECT asgt.asgTrabajadorId, asgt.nombre,";
    sql += " asgt.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgt.ejercicioId, e.nombre AS nejercicio,";
    sql += " asgt.paisId, p.nombre AS npais,";
    sql += " asgt.unidadId, u.nombre AS nunidad,";
    sql += " asgt.areaId, a.nombre AS narea,";
    sql += " asgt.puestoId, pst.nombre AS npuesto,";
    sql += " asgt.fijo, asgt.variable";
    sql += " FROM asg_trabajadores AS asgt";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgt.trabajadorId";
    sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
    sql += " LEFT JOIN paises AS p ON p.paisId = asgt.paisId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = asgt.unidadId";
    sql += " LEFT JOIN areas AS a ON a.areaId = asgt.areaId";
    sql += " LEFT JOIN puestos AS pst ON pst.puestoId = asgt.puestoId";
    sql += " WHERE t.trabajadorId = ?";
    sql = mysql.format(sql, buscador.trabajadorId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        asgTrabajadores = fromDbtoJsAsgTrabajadores(result);
        callback(null, asgTrabajadores);
    });
    closeConnectionCallback(connection, callback);
}

module.exports.postAsgTrabajadorEvaluadorBuscar = function (buscador, callback) {
    var connection = getConnection();
    var asgTrabajadores = null;
    var sql = "SELECT asgt.asgTrabajadorId, asgt.nombre,";
    sql += " asgt.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgt.ejercicioId, e.nombre AS nejercicio,";
    sql += " asgt.paisId, p.nombre AS npais,";
    sql += " asgt.unidadId, u.nombre AS nunidad,";
    sql += " asgt.areaId, a.nombre AS narea,";
    sql += " asgt.puestoId, pst.nombre AS npuesto,";
    sql += " asgt.fijo, asgt.variable";
    sql += " FROM asg_trabajadores AS asgt";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgt.trabajadorId";
    sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
    sql += " LEFT JOIN paises AS p ON p.paisId = asgt.paisId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = asgt.unidadId";
    sql += " LEFT JOIN areas AS a ON a.areaId = asgt.areaId";
    sql += " LEFT JOIN puestos AS pst ON pst.puestoId = asgt.puestoId";
    sql += " WHERE t.trabajadorId IN (SELECT trabajadorId FROM evaluador_trabajador WHERE evaluadorId = ?)";
    sql = mysql.format(sql, buscador.trabajadorId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        asgTrabajadores = fromDbtoJsAsgTrabajadores(result);
        callback(null, asgTrabajadores);
    });
    closeConnectionCallback(connection, callback);
}


// getAsgTrabajador
// busca  el asgTrabajador con id pasado
module.exports.getAsgTrabajador = function(id, callback){
	var connection = getConnection();
    var asgTrabajador = null;
    var sql = "SELECT asgt.asgTrabajadorId, asgt.nombre,";
    sql += " asgt.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgt.ejercicioId, e.nombre AS nejercicio,";
    sql += " asgt.paisId, p.nombre AS npais,";
    sql += " asgt.unidadId, u.nombre AS nunidad,";
    sql += " asgt.areaId, a.nombre AS narea,";
    sql += " asgt.puestoId, pst.nombre AS npuesto,";
    sql += " asgt.fijo, asgt.variable";
    sql += " FROM asg_trabajadores AS asgt";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgt.trabajadorId";
    sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
    sql += " LEFT JOIN paises AS p ON p.paisId = asgt.paisId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = asgt.unidadId";
    sql += " LEFT JOIN areas AS a ON a.areaId = asgt.areaId";
    sql += " LEFT JOIN puestos AS pst ON pst.puestoId = asgt.puestoId";
	sql += " WHERE asgt.asgTrabajadorId = ?";
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
        asgTrabajador = fromDbtoJsAsgTrabajador(result[0]);
		callback(null, asgTrabajador);
	});
	closeConnectionCallback(connection, callback);
}


// postAsgTrabajador
// crear en la base de datos el asgTrabajador pasado
module.exports.postAsgTrabajador = function (asgTrabajador, callback){
	if (!comprobarAsgTrabajador(asgTrabajador)){
		var err = new Error("El asgTrabajador pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
    var connection = getConnection();
    var asgTrabajadorDb = fromJstoDbAsgTrabajador(asgTrabajador);
	asgTrabajadorDb.asgTrabajadorId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO asg_trabajadores SET ?";
	sql = mysql.format(sql, asgTrabajadorDb);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
        }
        var sql = "SELECT asgt.asgTrabajadorId, asgt.nombre,";
        sql += " asgt.trabajadorId, t.nombre AS ntrabajador,";
        sql += " asgt.ejercicioId, e.nombre AS nejercicio,";
        sql += " asgt.paisId, p.nombre AS npais,";
        sql += " asgt.unidadId, u.nombre AS nunidad,";
        sql += " asgt.areaId, a.nombre AS narea,";
        sql += " asgt.puestoId, pst.nombre AS npuesto,";
        sql += " asgt.fijo, asgt.variable";
        sql += " FROM asg_trabajadores AS asgt";
        sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgt.trabajadorId";
        sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
        sql += " LEFT JOIN paises AS p ON p.paisId = asgt.paisId";
        sql += " LEFT JOIN unidades AS u ON u.unidadId = asgt.unidadId";
        sql += " LEFT JOIN areas AS a ON a.areaId = asgt.areaId";
        sql += " LEFT JOIN puestos AS pst ON pst.puestoId = asgt.puestoId";
        sql += " WHERE asgt.asgTrabajadorId = ?";
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
            asgTrabajador = fromDbtoJsAsgTrabajador(result[0]);
            callback(null, asgTrabajador);
            closeConnectionCallback(connection, callback);
        });
	});
}

// putAsgTrabajador
// Modifica el asgTrabajador según los datos del objeto pasao
module.exports.putAsgTrabajador = function(id, asgTrabajador, callback){
	if (!comprobarAsgTrabajador(asgTrabajador)){
		var err = new Error("El asgTrabajador pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != asgTrabajador.asgTrabajadorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var connection = getConnection();
    var asgTrabajadorDb = fromJstoDbAsgTrabajador(asgTrabajador);
	var sql = "UPDATE asg_trabajadores SET ? WHERE asgTrabajadorId = ?";
	sql = mysql.format(sql, [asgTrabajadorDb, asgTrabajadorDb.asgTrabajadorId]);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
		}
        var sql = "SELECT asgt.asgTrabajadorId, asgt.nombre,";
        sql += " asgt.trabajadorId, t.nombre AS ntrabajador,";
        sql += " asgt.ejercicioId, e.nombre AS nejercicio,";
        sql += " asgt.paisId, p.nombre AS npais,";
        sql += " asgt.unidadId, u.nombre AS nunidad,";
        sql += " asgt.areaId, a.nombre AS narea,";
        sql += " asgt.puestoId, pst.nombre AS npuesto,";
        sql += " asgt.fijo, asgt.variable";
        sql += " FROM asg_trabajadores AS asgt";
        sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgt.trabajadorId";
        sql += " LEFT JOIN ejercicios AS e ON e.ejercicioId = asgt.ejercicioId";
        sql += " LEFT JOIN paises AS p ON p.paisId = asgt.paisId";
        sql += " LEFT JOIN unidades AS u ON u.unidadId = asgt.unidadId";
        sql += " LEFT JOIN areas AS a ON a.areaId = asgt.areaId";
        sql += " LEFT JOIN puestos AS pst ON pst.puestoId = asgt.puestoId";
        sql += " WHERE asgt.asgTrabajadorId = ?";
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
            asgTrabajador = fromDbtoJsAsgTrabajador(result[0]);
            callback(null, asgTrabajador);
            closeConnectionCallback(connection, callback);
        });
	});
}

// deleteAsgTrabajador
// Elimina el asgTrabajador con el id pasado
module.exports.deleteAsgTrabajador = function(id, asgTrabajador, callback){
	var connection = getConnection();
	sql = "DELETE from asg_trabajadores WHERE asgTrabajadorId = ?";
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