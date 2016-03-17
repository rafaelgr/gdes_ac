// conocimientos_areas_db_mysql
// Manejo de la tabla conocimientos_areas en la base de datos
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

// comprobarConocimientoAreas
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarConocimientoAreas(conocimientoAreas){
	// debe ser objeto del tipo que toca
	var comprobado = typeof conocimientoAreas === "object";
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && conocimientoAreas.hasOwnProperty("conocimientoId"));
    comprobado = (comprobado && conocimientoAreas.hasOwnProperty("areas"));
	return comprobado;
}

// fromJstoDbConocimientoArea
// trasforma un objeto js en otro db
// que puede ser usado en la base de datos
function fromJstoDbConocimientoAreas(conocimientoAreasJs){
    // es un array porque vamos a montar una inserción
    // en bulk
    var registros = [];
    var conocimientoId = conocimientoAreasJs.conocimientoId;
    for (var i = 0; i < conocimientoAreasJs.areas.length; i++) {
        var record = [conocimientoId, conocimientoAreasJs.areas[i]];
        registros.push(record);
    }
    var conocimientoDb = {
        conocimientoId: conocimientoId,
        registros: registros
    };
    return conocimientoDb;
}

// postConocimientoAreas
// crear en la base de las relaciones entre el conocimiento y las areas pasadas
module.exports.postConocimientoAreas = function (conocimientoAreas, callback){
	if (!comprobarConocimientoAreas(conocimientoAreas)){
		var err = new Error("La relacion conocimiento-areas es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
    var connection = getConnection();
    var conocimientoDb = fromJstoDbConocimientoAreas(conocimientoAreas);
    // primero eliminamos todas las relaciones anteriores para dar de alta las nuevas
	sql = "DELETE FROM conocimientos_areas WHERE conocimientoId = ?";
	sql = mysql.format(sql, conocimientoDb.conocimientoId);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
        }
        if (conocimientoDb.registros.length == 0) {
            callback(null, null);
            return;
        }
        // el borrado ha ido bien e insertamos los registros correctos.
        sql = "INSERT INTO conocimientos_areas (conocimientoId, areaId) VALUES ?";
        sql = mysql.format(sql, [conocimientoDb.registros]);
        connection.query(sql, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, null);
            closeConnectionCallback(connection, callback);
        });
	});
}

// getConocimientoAreas
// obtener un array con las areas de las que depende un conocimiento
module.exports.getConocimientoAreas = function (conocimientoId, callback) {
    var connection = getConnection();
    // primero eliminamos todas las relaciones anteriores para dar de alta las nuevas
    sql = "SELECT * FROM conocimientos_areas WHERE conocimientoId = ?";
    sql = mysql.format(sql, conocimientoId);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err);
            return;
        }
        var areas = [];
        for (var i = 0; i < result.length; i++) {
            areas.push(result[i].areaId);
        }
        callback(null, areas);
        closeConnectionCallback(connection, callback);
    });
}

