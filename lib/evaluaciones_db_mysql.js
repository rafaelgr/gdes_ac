// asg_evaluaciones_db_mysql
// Manejo de la tabla evaluaciones en la base de datos
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

// comprobarEvaluacion
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarEvaluacion(evaluacion){
	// debe ser objeto del tipo que toca
	var comprobado = typeof evaluacion === "object";
	// en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && evaluacion.hasOwnProperty("evaluacionId"));
    comprobado = (comprobado && evaluacion.hasOwnProperty("asgProyecto"));
    if (comprobado) {
        comprobado = typeof evaluacion.asgProyecto === "object";
        comprobado = (comprobado && evaluacion.asgProyecto.hasOwnProperty("asgProyectoId"));
    }
    comprobado = (comprobado && evaluacion.hasOwnProperty("conocimiento"));
    if (comprobado) {
        comprobado = typeof evaluacion.conocimiento === "object";
        comprobado = (comprobado && evaluacion.conocimiento.hasOwnProperty("conocimientoId"));
    }
    comprobado = (comprobado && evaluacion.hasOwnProperty("dFecha"));
    //comprobado = (comprobado && evaluacion.hasOwnProperty("observaciones"));
	return comprobado;
}

// fromDbtoJsEvaluaciones
// transforma un array tal y como lo trae de la base la
// base de datos en el array de js correspondiente.
function fromDbtoJsEvaluaciones(evaluaciones){
    var evaluacionesJs = [];
    for (var i = 0; i < evaluaciones.length; i++) {
        evaluacionesJs.push(fromDbtoJsEvaluacion(evaluaciones[i]));
    }
    return evaluacionesJs;
}

// fromDbtoJsEvaluacion
// transforma un objeto tal y como lo trae de la base la
// base de datos en el js correspondiente.
function fromDbtoJsEvaluacion(evaluacionDb){
    var evaluacionJs = {
        evaluacionId: evaluacionDb.evaluacionId,
        asgProyecto: {
            asgProyectoId: evaluacionDb.asgProyectoId,
            nombre: evaluacionDb.nasgProyecto
        },
        conocimiento: {
            conocimientoId: evaluacionDb.conocimientoId,
            nombre: evaluacionDb.nconocimiento
        },
        dFecha: evaluacionDb.dFecha,
        hFecha: evaluacionDb.hFecha,
        observaciones: evaluacionDb.observaciones
    };
    return evaluacionJs;
}

// fromJstoDbEvaluacion
// trasforma un objeto js en otro db
// que puede ser usado en la base de datos
function fromJstoDbEvaluacion(evaluacionJs){
    var evaluacionDb = {
        evaluacionId: evaluacionJs.evaluacionId,
        asgProyectoId: evaluacionJs.asgProyecto.asgProyectoId,
        conocimientoId: evaluacionJs.conocimiento.conocimientoId,
        dFecha: evaluacionJs.dFecha,
        hFecha: evaluacionJs.hFecha,
        observaciones: evaluacionJs.observaciones
    };
    return evaluacionDb;
}


// getEvaluaciones
// lee todos los registros de la tabla evaluaciones y
// los devuelve como una lista de objetos
module.exports.getEvaluaciones = function(callback){
	var connection = getConnection();
    var evaluaciones = null;
    var sql = "SELECT";
    sql += " e.evaluacionId, e.dFecha, e.hFecha, e.observaciones,";
    sql += " asgp.asgProyectoId, asgp.nombre AS nasgProyecto,";
    sql += " t.trabajadorId, t.nombre AS ntrabajador,";
    sql += " p.proyectoId, p.nombre AS nproyecto,";
    sql += " r.rolId, r.nombre AS nrol,";
    sql += " c.conocimientoId, c.nombre AS nconocimiento";
    sql += " FROM evaluaciones AS e";
    sql += " LEFT JOIN asg_proyectos AS asgp ON asgp.asgProyectoId = e.asgProyectoId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		evaluaciones = fromDbtoJsEvaluaciones(result);
		callback(null, evaluaciones);
	});	
	closeConnectionCallback(connection, callback);
}

// postEvaluacionesBuscarPorTrabajador
// lee todos los registros de la tabla evaluaciones que
// pertenecen al trabajador pasado
module.exports.postEvaluacionesBuscarPorTrabajador = function (buscador, callback) {
    var connection = getConnection();
    var evaluaciones = null;
    var sql = "SELECT";
    sql += " e.evaluacionId, e.dFecha, e.hFecha, e.observaciones,";
    sql += " asgp.asgProyectoId, asgp.nombre AS nasgProyecto,";
    sql += " t.trabajadorId, t.nombre AS ntrabajador,";
    sql += " p.proyectoId, p.nombre AS nproyecto,";
    sql += " r.rolId, r.nombre AS nrol,";
    sql += " c.conocimientoId, c.nombre AS nconocimiento";
    sql += " FROM evaluaciones AS e";
    sql += " LEFT JOIN asg_proyectos AS asgp ON asgp.asgProyectoId = e.asgProyectoId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " WHERE t.trabajadorId = ?";
    sql = mysql.format(sql, buscador.trabajadorId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        evaluaciones = fromDbtoJsEvaluaciones(result);
        callback(null, evaluaciones);
    });
    closeConnectionCallback(connection, callback);
}


// postEvaluacionesBuscarPorProyecto
// lee todos los registros de la tabla evaluaciones que
// pertenecen al proyecto indicado
module.exports.postEvaluacionesBuscarPorProyecto = function (buscador, callback) {
    var connection = getConnection();
    var evaluaciones = null;
    var sql = "SELECT";
    sql += " e.evaluacionId, e.dFecha, e.hFecha, e.observaciones,";
    sql += " asgp.asgProyectoId, asgp.nombre AS nasgProyecto,";
    sql += " t.trabajadorId, t.nombre AS ntrabajador,";
    sql += " p.proyectoId, p.nombre AS nproyecto,";
    sql += " r.rolId, r.nombre AS nrol,";
    sql += " c.conocimientoId, c.nombre AS nconocimiento";
    sql += " FROM evaluaciones AS e";
    sql += " LEFT JOIN asg_proyectos AS asgp ON asgp.asgProyectoId = e.asgProyectoId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " WHERE p.proyectoId = ?";
    sql = mysql.format(sql, buscador.proyectoId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        evaluaciones = fromDbtoJsEvaluaciones(result);
        callback(null, evaluaciones);
    });
    closeConnectionCallback(connection, callback);
}


// postEvaluacionesBuscarPorAsignacionProyecto
// lee todos los registros de la tabla evaluaciones que
// pertenecen a la asignación pasada
module.exports.postEvaluacionesBuscarPorAsignacionProyecto = function (buscador, callback) {
    var connection = getConnection();
    var evaluaciones = null;
    var sql = "SELECT";
    sql += " e.evaluacionId, e.dFecha, e.hFecha, e.observaciones,";
    sql += " asgp.asgProyectoId, asgp.nombre AS nasgProyecto,";
    sql += " t.trabajadorId, t.nombre AS ntrabajador,";
    sql += " p.proyectoId, p.nombre AS nproyecto,";
    sql += " r.rolId, r.nombre AS nrol,";
    sql += " c.conocimientoId, c.nombre AS nconocimiento";
    sql += " FROM evaluaciones AS e";
    sql += " LEFT JOIN asg_proyectos AS asgp ON asgp.asgProyectoId = e.asgProyectoId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " WHERE e.asgProyectoId = ?";
    sql = mysql.format(sql, buscador.asgProyectoId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        evaluaciones = fromDbtoJsEvaluaciones(result);
        callback(null, evaluaciones);
    });
    closeConnectionCallback(connection, callback);
}

// getEvaluacion
// busca la evaluacion con id pasado
module.exports.getEvaluacion = function(id, callback){
	var connection = getConnection();
    var evaluacion = null;
    var sql = "SELECT";
    sql += " e.evaluacionId, e.dFecha, e.hFecha, e.observaciones,";
    sql += " asgp.asgProyectoId, asgp.nombre AS nasgProyecto,";
    sql += " t.trabajadorId, t.nombre AS ntrabajador,";
    sql += " p.proyectoId, p.nombre AS nproyecto,";
    sql += " r.rolId, r.nombre AS nrol,";
    sql += " c.conocimientoId, c.nombre AS nconocimiento";
    sql += " FROM evaluaciones AS e";
    sql += " LEFT JOIN asg_proyectos AS asgp ON asgp.asgProyectoId = e.asgProyectoId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " WHERE e.evaluacionId = ?";
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
        evaluacion = fromDbtoJsEvaluacion(result[0]);
		callback(null, evaluacion);
	});
	closeConnectionCallback(connection, callback);
}


// postEvaluacion
// crear en la base de datos la evaluacion pasada
module.exports.postEvaluacion = function (evaluacion, callback){
	if (!comprobarEvaluacion(evaluacion)){
		var err = new Error("La evaluación pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
    var connection = getConnection();
    var evaluacionDb = fromJstoDbEvaluacion(evaluacion);
	evaluacionDb.evaluacionId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO evaluaciones SET ?";
	sql = mysql.format(sql, evaluacionDb);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
        }
        var sql = "SELECT";
        sql += " e.evaluacionId, e.dFecha, e.hFecha, e.observaciones,";
        sql += " asgp.asgProyectoId, asgp.nombre AS nasgProyecto,";
        sql += " t.trabajadorId, t.nombre AS ntrabajador,";
        sql += " p.proyectoId, p.nombre AS nproyecto,";
        sql += " r.rolId, r.nombre AS nrol,";
        sql += " c.conocimientoId, c.nombre AS nconocimiento";
        sql += " FROM evaluaciones AS e";
        sql += " LEFT JOIN asg_proyectos AS asgp ON asgp.asgProyectoId = e.asgProyectoId";
        sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
        sql += " LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId";
        sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
        sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
        sql += " WHERE e.evaluacionId = ?"
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
            evaluacion = fromDbtoJsEvaluacion(result[0]);
            callback(null, evaluacion);
            closeConnectionCallback(connection, callback);
        });
	});
}

// putEvaluacion
// Modifica la evaluación según los datos del objeto pasado
module.exports.putEvaluacion = function(id, evaluacion, callback){
	if (!comprobarEvaluacion(evaluacion)){
		var err = new Error("La evaluación pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != evaluacion.evaluacionId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var connection = getConnection();
    var evaluacionDb = fromJstoDbEvaluacion(evaluacion);
	var sql = "UPDATE evaluaciones SET ? WHERE evaluacionId = ?";
	sql = mysql.format(sql, [evaluacionDb, evaluacionDb.evaluacionId]);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
		}
        var sql = "SELECT";
        sql += " e.evaluacionId, e.dFecha, e.hFecha, e.observaciones,";
        sql += " asgp.asgProyectoId, asgp.nombre AS nasgProyecto,";
        sql += " t.trabajadorId, t.nombre AS ntrabajador,";
        sql += " p.proyectoId, p.nombre AS nproyecto,";
        sql += " r.rolId, r.nombre AS nrol,";
        sql += " c.conocimientoId, c.nombre AS nconocimiento";
        sql += " FROM evaluaciones AS e";
        sql += " LEFT JOIN asg_proyectos AS asgp ON asgp.asgProyectoId = e.asgProyectoId";
        sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
        sql += " LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId";
        sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
        sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
        sql += " WHERE e.evaluacionId = ?"
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
            evaluacion = fromDbtoJsEvaluacion(result[0]);
            callback(null, evaluacion);
            closeConnectionCallback(connection, callback);
        });
	});
}

// deleteEvaluacion
// Elimina la evaluación con el id pasado
module.exports.deleteEvaluacion = function(id, evaluacion, callback){
	var connection = getConnection();
	sql = "DELETE from evaluaciones WHERE evaluacionId = ?";
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