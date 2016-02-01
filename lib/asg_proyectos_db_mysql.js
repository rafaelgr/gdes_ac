// asg_proyectos_db_mysql
// Manejo de la tabla asgProyectos en la base de datos
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

// comprobarAsgProyecto
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarAsgProyecto(asgProyecto){
	// debe ser objeto del tipo que toca
	var comprobado = typeof asgProyecto === "object";
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && asgProyecto.hasOwnProperty("asgProyectoId"));
    comprobado = (comprobado && asgProyecto.hasOwnProperty("nombre"));
    comprobado = (comprobado && asgProyecto.hasOwnProperty("trabajador"));
    if (comprobado) {
        comprobado = typeof asgProyecto.trabajador === "object";
        comprobado = (comprobado && asgProyecto.trabajador.hasOwnProperty("trabajadorId"));
    }
    comprobado = (comprobado && asgProyecto.hasOwnProperty("proyecto"));
    if (comprobado) {
        comprobado = typeof asgProyecto.proyecto === "object";
        comprobado = (comprobado && asgProyecto.proyecto.hasOwnProperty("proyectoId"));
    }
    comprobado = (comprobado && asgProyecto.hasOwnProperty("rol"));
    if (comprobado) {
        comprobado = typeof asgProyecto.rol === "object";
        comprobado = (comprobado && asgProyecto.rol.hasOwnProperty("rolId"));
    }
	return comprobado;
}

// fromDbtoJsAsgProyectos
// transforma un array tal y como lo trae de la base la
// base de datos en el array de js correspondiente.
function fromDbtoJsAsgProyectos(asgProyectos){
    var asgProyectosJs = [];
    for (var i = 0; i < asgProyectos.length; i++) {
        asgProyectosJs.push(fromDbtoJsAsgProyecto(asgProyectos[i]));
    }
    return asgProyectosJs;
}

// fromDbtoJsAsgProyecto
// transforma un objeto tal y como lo trae de la base la
// base de datos en el js correspondiente.
function fromDbtoJsAsgProyecto(asgProyectoDb){
    var asgProyectoJs = {
        asgProyectoId: asgProyectoDb.asgProyectoId,
        nombre: asgProyectoDb.nombre,
        descripcion: asgProyectoDb.descripcion,
        trabajador: {
            trabajadorId: asgProyectoDb.trabajadorId,
            nombre: asgProyectoDb.ntrabajador
        },
        proyecto: {
            proyectoId: asgProyectoDb.proyectoId,
            nombre: asgProyectoDb.nproyecto,
            fechaInicio: asgProyectoDb.fechaInicio,
            fechaFinal: asgProyectoDb.fechaFinal
        },
        rol: {
            rolId: asgProyectoDb.rolId,
            nombre: asgProyectoDb.nrol
        },
        fechaInicio: asgProyectoDb.fInicio,
        fechaFinal: asgProyectoDb.fFinal
    };
    // atributos que pueden ser nulos
    if (asgProyectoDb.evaluadorId != null) {
        asgProyectoJs.evaluador = {
            evaluadorId: asgProyectoDb.evaluadorId,
            nombre: asgProyectoDb.nevaluador
        };
    }
    return asgProyectoJs;
}

// fromJstoDbAsgProyecto
// trasforma un objeto js en otro db
// que puede ser usado en la base de datos
function fromJstoDbAsgProyecto(asgProyectoJs){
    var asgProyectoDb = {
        asgProyectoId: asgProyectoJs.asgProyectoId,
        nombre: asgProyectoJs.nombre,
        descripcion: asgProyectoJs.descripcion,
        trabajadorId: asgProyectoJs.trabajador.trabajadorId,
        proyectoId: asgProyectoJs.proyecto.proyectoId,
        rolId: asgProyectoJs.rol.rolId
    };
    // valores que pueden ser nulos
    if (asgProyectoJs.evaluador != null) {
        asgProyectoDb.evaluadorId = asgProyectoJs.evaluador.evaluadorId;
    }
    if (asgProyectoJs.fechaInicio != null) {
        asgProyectoDb.fechaInicio = asgProyectoJs.fechaInicio;
    }
    if (asgProyectoJs.fechaFinal != null) {
        asgProyectoDb.fechaFinal = asgProyectoJs.fechaFinal;
    }
    return asgProyectoDb;
}


// getAsgProyectos
// lee todos los registros de la tabla asgProyectos y
// los devuelve como una lista de objetos
module.exports.getAsgProyectos = function(callback){
	var connection = getConnection();
    var asgProyectos = null;
    var sql = "SELECT asgp.asgProyectoId, asgp.nombre, asgp.descripcion,";
    sql += " asgp.fechaInicio as fInicio, asgp.fechaFinal AS fFinal,";
    sql += " asgp.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgp.proyectoId, p.nombre AS nproyecto, p.fechaInicio, p.fechaFinal,";
    sql += " asgp.rolId, r.nombre AS nrol,";
    sql += " asgp.evaluadorId, e.nombre AS nevaluador";
    sql += " FROM asg_proyectos AS asgp";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " LEFT JOIN trabajadores AS e ON e.trabajadorId = asgp.evaluadorId";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		asgProyectos = fromDbtoJsAsgProyectos(result);
		callback(null, asgProyectos);
	});	
	closeConnectionCallback(connection, callback);
}

// postAsgProyectosBuscar
// lee todos los registros de la tabla asgProyectos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postAsgProyectosBuscar = function (buscador, callback) {
    var connection = getConnection();
    var asgProyectos = null;
    var sql = "SELECT asgp.asgProyectoId, asgp.nombre, asgp.descripcion,";
    sql += " asgp.fechaInicio as fInicio, asgp.fechaFinal AS fFinal,";
    sql += " asgp.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgp.proyectoId, p.nombre AS nproyecto, p.fechaInicio, p.fechaFinal,";
    sql += " asgp.rolId, r.nombre AS nrol,";
    sql += " asgp.evaluadorId, e.nombre AS nevaluador";
    sql += " FROM asg_proyectos AS asgp";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " LEFT JOIN trabajadores AS e ON e.trabajadorId = asgp.evaluadorId";;
    if (buscador.nombre !== "*") {
        sql += " WHERE asgp.nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        asgProyectos = fromDbtoJsAsgProyectos(result);
        callback(null, asgProyectos);
    });
    closeConnectionCallback(connection, callback);
}


// postAsgProyectosBuscarPorTrabajador
// lee todos los registros de la tabla asgProyectos
// del trabajador con el id pasado
module.exports.postAsgProyectosBuscarPorTrabajador = function (buscador, callback) {
    var connection = getConnection();
    var asgProyectos = null;
    var sql = "SELECT asgp.asgProyectoId, asgp.nombre, asgp.descripcion,";
    sql += " asgp.fechaInicio as fInicio, asgp.fechaFinal AS fFinal,";
    sql += " asgp.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgp.proyectoId, p.nombre AS nproyecto, p.fechaInicio, p.fechaFinal,";
    sql += " asgp.rolId, r.nombre AS nrol,";
    sql += " asgp.evaluadorId, e.nombre AS nevaluador";
    sql += " FROM asg_proyectos AS asgp";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " LEFT JOIN trabajadores AS e ON e.trabajadorId = asgp.evaluadorId";
    sql += " WHERE asgp.trabajadorId = ?";
    sql = mysql.format(sql, buscador.trabajadorId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        asgProyectos = fromDbtoJsAsgProyectos(result);
        callback(null, asgProyectos);
    });
    closeConnectionCallback(connection, callback);
}

// postAsgProyectosBuscarPorEvaluador
// lee todos los registros de la tabla asgProyectos
// en los que es evaluador el id pasado
module.exports.postAsgProyectosBuscarPorEvaluador = function (buscador, callback) {
    var connection = getConnection();
    var asgProyectos = null;
    var sql = "SELECT asgp.asgProyectoId, asgp.nombre, asgp.descripcion,";
    sql += " asgp.fechaInicio as fInicio, asgp.fechaFinal AS fFinal,";
    sql += " asgp.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgp.proyectoId, p.nombre AS nproyecto, p.fechaInicio, p.fechaFinal,";
    sql += " asgp.rolId, r.nombre AS nrol,";
    sql += " asgp.evaluadorId, e.nombre AS nevaluador";
    sql += " FROM asg_proyectos AS asgp";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " LEFT JOIN trabajadores AS e ON e.trabajadorId = asgp.evaluadorId";
    sql += " WHERE asgp.evaluadorId = ?";
    sql = mysql.format(sql, buscador.evaluadorId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        asgProyectos = fromDbtoJsAsgProyectos(result);
        callback(null, asgProyectos);
    });
    closeConnectionCallback(connection, callback);
}


// postAsgProyectosBuscarPorProyecto
// lee todos los registros de la tabla asgProyectos 
// del proyecto con el id pasado
module.exports.postAsgProyectosBuscarPorProyecto = function (buscador, callback) {
    var connection = getConnection();
    var asgProyectos = null;
    var sql = "SELECT asgp.asgProyectoId, asgp.nombre, asgp.descripcion,";
    sql += " asgp.fechaInicio as fInicio, asgp.fechaFinal AS fFinal,";
    sql += " asgp.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgp.proyectoId, p.nombre AS nproyecto, p.fechaInicio, p.fechaFinal,";
    sql += " asgp.rolId, r.nombre AS nrol,";
    sql += " asgp.evaluadorId, e.nombre AS nevaluador";
    sql += " FROM asg_proyectos AS asgp";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " LEFT JOIN trabajadores AS e ON e.trabajadorId = asgp.evaluadorId";
    sql += " WHERE asgp.proyectoId = ?";
    sql = mysql.format(sql, buscador.proyectoId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        asgProyectos = fromDbtoJsAsgProyectos(result);
        callback(null, asgProyectos);
    });
    closeConnectionCallback(connection, callback);
}


module.exports.postAsgProyectoBuscar = function (buscador, callback) {
    var connection = getConnection();
    var asgProyectos = null;
    var sql = "SELECT asgp.asgProyectoId, asgp.nombre, asgp.descripcion,";
    sql += " asgp.fechaInicio as fInicio, asgp.fechaFinal AS fFinal,";
    sql += " asgp.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgp.proyectoId, p.nombre AS nproyecto, p.fechaInicio, p.fechaFinal,";
    sql += " asgp.rolId, r.nombre AS nrol,";
    sql += " asgp.evaluadorId, e.nombre AS nevaluador";
    sql += " FROM asg_proyectos AS asgp";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " LEFT JOIN trabajadores AS e ON e.trabajadorId = asgp.evaluadorId";
    sql += " WHERE t.trabajadorId = ?";
    sql = mysql.format(sql, buscador.trabajadorId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        asgProyectos = fromDbtoJsAsgProyectos(result);
        callback(null, asgProyectos);
    });
    closeConnectionCallback(connection, callback);
}

module.exports.postAsgProyectoEvaluadorBuscar = function (buscador, callback) {
    var connection = getConnection();
    var asgProyectos = null;
    var sql = "SELECT asgp.asgProyectoId, asgp.nombre, asgp.descripcion,";
    sql += " asgp.fechaInicio as fInicio, asgp.fechaFinal AS fFinal,";
    sql += " asgp.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgp.proyectoId, p.nombre AS nproyecto, p.fechaInicio, p.fechaFinal,";
    sql += " asgp.rolId, r.nombre AS nrol,";
    sql += " asgp.evaluadorId, e.nombre AS nevaluador";
    sql += " FROM asg_proyectos AS asgp";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " LEFT JOIN trabajadores AS e ON e.trabajadorId = asgp.evaluadorId";
    sql += " WHERE t.trabajadorId IN (SELECT trabajadorId FROM evaluador_trabajador WHERE evaluadorId = ?)";
    sql = mysql.format(sql, buscador.trabajadorId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        asgProyectos = fromDbtoJsAsgProyectos(result);
        callback(null, asgProyectos);
    });
    closeConnectionCallback(connection, callback);
}


// getAsgProyecto
// busca  el asgProyecto con id pasado
module.exports.getAsgProyecto = function(id, callback){
	var connection = getConnection();
    var asgProyecto = null;
    var sql = "SELECT asgp.asgProyectoId, asgp.nombre, asgp.descripcion,";
    sql += " asgp.fechaInicio as fInicio, asgp.fechaFinal AS fFinal,";
    sql += " asgp.trabajadorId, t.nombre AS ntrabajador,";
    sql += " asgp.proyectoId, p.nombre AS nproyecto, p.fechaInicio, p.fechaFinal,";
    sql += " asgp.rolId, r.nombre AS nrol,";
    sql += " asgp.evaluadorId, e.nombre AS nevaluador";
    sql += " FROM asg_proyectos AS asgp";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
    sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
    sql += " LEFT JOIN trabajadores AS e ON e.trabajadorId = asgp.evaluadorId";
	sql += " WHERE asgp.asgProyectoId = ?";
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
        asgProyecto = fromDbtoJsAsgProyecto(result[0]);
		callback(null, asgProyecto);
	});
	closeConnectionCallback(connection, callback);
}


// postAsgProyecto
// crear en la base de datos el asgProyecto pasado
module.exports.postAsgProyecto = function (asgProyecto, callback){
	if (!comprobarAsgProyecto(asgProyecto)){
		var err = new Error("El asgProyecto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
    var connection = getConnection();
    var asgProyectoDb = fromJstoDbAsgProyecto(asgProyecto);
	asgProyectoDb.asgProyectoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO asg_proyectos SET ?";
	sql = mysql.format(sql, asgProyectoDb);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
        }
        var sql = "SELECT asgp.asgProyectoId, asgp.nombre, asgp.descripcion,";
        sql += " asgp.fechaInicio as fInicio, asgp.fechaFinal AS fFinal,";
        sql += " asgp.trabajadorId, t.nombre AS ntrabajador,";
        sql += " asgp.proyectoId, p.nombre AS nproyecto, p.fechaInicio, p.fechaFinal,";
        sql += " asgp.rolId, r.nombre AS nrol,";
        sql += " asgp.evaluadorId, e.nombre AS nevaluador";
        sql += " FROM asg_proyectos AS asgp";
        sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
        sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
        sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
        sql += " LEFT JOIN trabajadores AS e ON e.trabajadorId = asgp.evaluadorId";
        sql += " WHERE asgp.asgProyectoId = ?";
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
            asgProyecto = fromDbtoJsAsgProyecto(result[0]);
            callback(null, asgProyecto);
            closeConnectionCallback(connection, callback);
        });
	});
}



// putAsgProyecto
// Modifica el asgProyecto según los datos del objeto pasao
module.exports.putAsgProyecto = function(id, asgProyecto, callback){
	if (!comprobarAsgProyecto(asgProyecto)){
		var err = new Error("El asgProyecto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != asgProyecto.asgProyectoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var connection = getConnection();
    var asgProyectoDb = fromJstoDbAsgProyecto(asgProyecto);
	var sql = "UPDATE asg_proyectos SET ? WHERE asgProyectoId = ?";
	sql = mysql.format(sql, [asgProyectoDb, asgProyectoDb.asgProyectoId]);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
		}
        var sql = "SELECT asgp.asgProyectoId, asgp.nombre, asgp.descripcion,";
        sql += " asgp.fechaInicio as fInicio, asgp.fechaFinal AS fFinal,";
        sql += " asgp.trabajadorId, t.nombre AS ntrabajador,";
        sql += " asgp.proyectoId, p.nombre AS nproyecto, p.fechaInicio, p.fechaFinal,";
        sql += " asgp.rolId, r.nombre AS nrol,";
        sql += " asgp.evaluadorId, e.nombre AS nevaluador";
        sql += " FROM asg_proyectos AS asgp";
        sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId";
        sql += " LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId";
        sql += " LEFT JOIN roles AS r ON r.rolId = asgp.rolId";
        sql += " LEFT JOIN trabajadores AS e ON e.trabajadorId = asgp.evaluadorId";
        sql += " WHERE asgp.asgProyectoId = ?";
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
            asgProyecto = fromDbtoJsAsgProyecto(result[0]);
            callback(null, asgProyecto);
            closeConnectionCallback(connection, callback);
        });
	});
}

// deleteAsgProyecto
// Elimina el asgProyecto con el id pasado
module.exports.deleteAsgProyecto = function(id, asgProyecto, callback){
	var connection = getConnection();
	sql = "DELETE from asg_proyectos WHERE asgProyectoId = ?";
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