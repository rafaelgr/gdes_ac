// objetivos_db_mysql
// Manejo de la tabla objetivos en la base de datos
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

// comprobarObjetivo
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarObjetivo(objetivo){
	// debe ser objeto del tipo que toca
	var comprobado = typeof objetivo === "object";
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && objetivo.hasOwnProperty("objetivoId"));
    comprobado = (comprobado && objetivo.hasOwnProperty("nombre"));
    comprobado = (comprobado && objetivo.hasOwnProperty("categoria"));
    if (comprobado) {
        comprobado = typeof objetivo.categoria === "object";
        comprobado = (comprobado && objetivo.categoria.hasOwnProperty("categoriaId"));
    }
    comprobado = (comprobado && objetivo.hasOwnProperty("tipo"));
    if (comprobado) {
        comprobado = typeof objetivo.tipo === "object";
        comprobado = (comprobado && objetivo.tipo.hasOwnProperty("tipoId"));
    }
	return comprobado;
}

// fromDbtoJsObjetivos
// transforma un array tal y como lo trae de la base la
// base de datos en el array de js correspondiente.
function fromDbtoJsObjetivos(objetivos){
    var objetivosJs = [];
    for (var i = 0; i < objetivos.length; i++) {
        objetivosJs.push(fromDbtoJsObjetivo(objetivos[i]));
    }
    return objetivosJs;
}

// fromDbtoJsObjetivo
// transforma un objeto tal y como lo trae de la base la
// base de datos en el js correspondiente.
function fromDbtoJsObjetivo(objetivoDb){
    var objetivoJs = {
        objetivoId: objetivoDb.objetivoId,
        nombre: objetivoDb.nombre,
        categoria: {
            categoriaId: objetivoDb.categoriaId,
            nombre: objetivoDb.ncategoria
        },
        tipo: {
            tipoId: objetivoDb.tipoId,
            nombre: objetivoDb.ntipo
        }
    };
    if (objetivoDb.evaluadorId == null) {
        objetivoJs.evaluador = null;
    } else {
        objetivoJs.evaluador = {};
        objetivoJs.evaluador.evaluadorId = objetivoDb.evaluadorId;
        objetivoJs.evaluador.nombre = objetivoDb.nevaluador;
    }
    return objetivoJs;
}

// fromJstoDbObjetivo
// trasforma un objeto js en otro db
// que puede ser usado en la base de datos
function fromJstoDbObjetivo(objetivoJs){
    var objetivoDb = {
        objetivoId: objetivoJs.objetivoId,
        nombre: objetivoJs.nombre,
        categoriaId: objetivoJs.categoria.categoriaId,
        tipoId: objetivoJs.tipo.tipoId,
    };
    if (objetivoJs.evaluador == null) {
        objetivoDb.evaluadorId = null
    } else {
        objetivoDb.evaluadorId = objetivoJs.evaluador.evaluadorId;
    }
    return objetivoDb;
}


// getObjetivos
// lee todos los registros de la tabla objetivos y
// los devuelve como una lista de objetos
module.exports.getObjetivos = function(callback){
	var connection = getConnection();
	var objetivos = null;
    var sql = "SELECT o.objetivoId, o.nombre, o.categoriaId, o.tipoId, c.nombre AS ncategoria, t.nombre AS ntipo, o.evaluadorId, tr.nombre AS nevaluador";
    sql += " FROM objetivos AS o LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId LEFT JOIN tipos AS t ON t.tipoId = o.tipoId LEFT JOIN trabajadores AS tr ON tr.trabajadorId = o.evaluadorId";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		objetivos = fromDbtoJsObjetivos(result);
		callback(null, objetivos);
	});	
	closeConnectionCallback(connection, callback);
}

// postObjetivosBuscar
// lee todos los registros de la tabla objetivos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postObjetivosBuscar = function (buscador, callback) {
    var connection = getConnection();
    var objetivos = null;
    var sql = "SELECT o.objetivoId, o.nombre, o.categoriaId, o.tipoId, c.nombre AS ncategoria, t.nombre AS ntipo, o.evaluadorId, tr.nombre AS nevaluador";
    sql += " FROM objetivos AS o LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId LEFT JOIN tipos AS t ON t.tipoId = o.tipoId LEFT JOIN trabajadores AS tr ON tr.trabajadorId = o.evaluadorId";
    if (buscador.nombre !== "*") {
        sql += " WHERE o.nombre LIKE ?";
        sql = mysql.format(sql, '%' + buscador.nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        objetivos = fromDbtoJsObjetivos(result);
        callback(null, objetivos);
    });
    closeConnectionCallback(connection, callback);
}

// postObjetivosEvaludorBuscar
// lee todos los registros de la tabla objetivos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.postObjetivosEvaluadorBuscar = function (buscador, callback) {
    var connection = getConnection();
    var objetivos = null;
    var sql = "SELECT o.objetivoId, o.nombre, o.categoriaId, o.tipoId, c.nombre AS ncategoria, t.nombre AS ntipo, o.evaluadorId, tr.nombre AS nevaluador";
    sql += " FROM objetivos AS o LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId LEFT JOIN tipos AS t ON t.tipoId = o.tipoId LEFT JOIN trabajadores AS tr ON tr.trabajadorId = o.evaluadorId";
    sql += " WHERE o.categoriaId = 2 AND (o.evaluadorId = ?  OR o.evaluadorId IS NULL)";
    sql = mysql.format(sql, buscador.evaluadorId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        objetivos = fromDbtoJsObjetivos(result);
        callback(null, objetivos);
    });
    closeConnectionCallback(connection, callback);
}

// postObjetivosBuscarPorCategoria
// lee todos los registros de la tabla objetivos cuyo
// categoria es del Id pasado. Si la cadena es '*'
// devuelve todos los registros
module.exports.postObjetivosBuscarPorCategoria = function (buscador, callback) {
    var connection = getConnection();
    var objetivos = null;
    var sql = "SELECT o.objetivoId, o.nombre, o.categoriaId, o.tipoId, c.nombre AS ncategoria, t.nombre AS ntipo, o.evaluadorId, tr.nombre AS nevaluador";
    sql += " FROM objetivos AS o LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId LEFT JOIN tipos AS t ON t.tipoId = o.tipoId LEFT JOIN trabajadores AS tr ON tr.trabajadorId = o.evaluadorId";
    if (buscador.nombre !== "*") {
        sql += " WHERE o.categoriaId = ?";
        sql = mysql.format(sql, buscador.categoriaId);
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        objetivos = fromDbtoJsObjetivos(result);
        callback(null, objetivos);
    });
    closeConnectionCallback(connection, callback);
}

// getObjetivo
// busca  el objetivo con id pasado
module.exports.getObjetivo = function(id, callback){
	var connection = getConnection();
    var objetivo = null;
    var sql = "SELECT o.objetivoId, o.nombre, o.categoriaId, o.tipoId, c.nombre AS ncategoria, t.nombre AS ntipo, o.evaluadorId, tr.nombre AS nevaluador";
    sql += " FROM objetivos AS o LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId LEFT JOIN tipos AS t ON t.tipoId = o.tipoId LEFT JOIN trabajadores AS tr ON tr.trabajadorId = o.evaluadorId";
	sql += " WHERE o.objetivoId = ?";
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
        objetivo = fromDbtoJsObjetivo(result[0]);
		callback(null, objetivo);
	});
	closeConnectionCallback(connection, callback);
}


// postObjetivo
// crear en la base de datos el objetivo pasado
module.exports.postObjetivo = function (objetivo, callback){
	if (!comprobarObjetivo(objetivo)){
		var err = new Error("El objetivo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
    var connection = getConnection();
    var objetivoDb = fromJstoDbObjetivo(objetivo);
	objetivoDb.objetivoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO objetivos SET ?";
	sql = mysql.format(sql, objetivoDb);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
        }
        sql = "SELECT o.objetivoId, o.nombre, o.categoriaId, o.tipoId, c.nombre AS ncategoria, t.nombre AS ntipo, o.evaluadorId, tr.nombre AS nevaluador";
        sql += " FROM objetivos AS o LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId LEFT JOIN tipos AS t ON t.tipoId = o.tipoId LEFT JOIN trabajadores AS tr ON tr.trabajadorId = o.evaluadorId";
        sql += " WHERE o.objetivoId = ?";
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
            objetivo = fromDbtoJsObjetivo(result[0]);
            callback(null, objetivo);
            closeConnectionCallback(connection, callback);
        });
	});
}

// putObjetivo
// Modifica el objetivo según los datos del objeto pasao
module.exports.putObjetivo = function(id, objetivo, callback){
	if (!comprobarObjetivo(objetivo)){
		var err = new Error("El objetivo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != objetivo.objetivoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var connection = getConnection();
    var objetivoDb = fromJstoDbObjetivo(objetivo);
	var sql = "UPDATE objetivos SET ? WHERE objetivoId = ?";
	sql = mysql.format(sql, [objetivoDb, objetivoDb.objetivoId]);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
		}
        sql = "SELECT o.objetivoId, o.nombre, o.categoriaId, o.tipoId, c.nombre AS ncategoria, t.nombre AS ntipo, o.evaluadorId, tr.nombre AS nevaluador";
        sql += " FROM objetivos AS o LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId LEFT JOIN tipos AS t ON t.tipoId = o.tipoId LEFT JOIN trabajadores AS tr ON tr.trabajadorId = o.evaluadorId";
        sql += " WHERE o.objetivoId = ?";
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
            objetivo = fromDbtoJsObjetivo(result[0]);
            callback(null, objetivo);
            closeConnectionCallback(connection, callback);
        });
	});
}

// deleteObjetivo
// Elimina el objetivo con el id pasado
module.exports.deleteObjetivo = function(id, objetivo, callback){
	var connection = getConnection();
	sql = "DELETE from objetivos WHERE objetivoId = ?";
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