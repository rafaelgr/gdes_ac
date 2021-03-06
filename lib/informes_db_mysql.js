// informes_db_mysql
// Manejo de los datos a usar en informes
// los informes se pueden obtener en dos formatos.
// Plano: se obtiene tal cual salen los registros de la nase de datos (Parámetro tipo = 'p')
// Jerárquico: se obtiene como colecciones anidadas (Parámetro tipo = 'j')
// ---------- Relacion de informes que se pueden obtener (mayúsculas indica colección en jerárquico)
// (informe = 'general') [todos los registros -> trabajador, categoria, conocimiento, proyecto, dfecha, hfecha, dias, observaciones, evaluador]
// (informe = 'ptrabajador' / id == trabajadorId [0==todos]) [trabajador, categoria, CONOCIMIENTOS (conocimiento, proyecto, dfecha, hfecha, dias, observaciones, evaluador)]

var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var sprintf = require('sprintf-js').sprintf; // librería para formatear strings 

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

// comprobarConocimiento
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarParametro(parametro){
	// debe ser objeto del tipo que toca
	var comprobado = typeof parametro === "object";
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && parametro.hasOwnProperty("informe"));
    comprobado = (comprobado && parametro.hasOwnProperty("tipo"));
    comprobado = (comprobado && parametro.hasOwnProperty("id"));
	return comprobado;
}

// fromDbtoJsConocimientos
// transforma un array tal y como lo trae de la base la
// base de datos en el array de js correspondiente.
function fromDbtoJsConocimientos(conocimientos){
    var conocimientosJs = [];
    for (var i = 0; i < conocimientos.length; i++) {
        conocimientosJs.push(fromDbtoJsConocimiento(conocimientos[i]));
    }
    return conocimientosJs;
}

// fromDbtoJsConocimiento
// transforma un objeto tal y como lo trae de la base la
// base de datos en el js correspondiente.
function fromDbtoJsConocimiento(conocimientoDb){
    var conocimientoJs = {
        conocimientoId: conocimientoDb.conocimientoId,
        nombre: conocimientoDb.nombre,
        catConocimiento: {
            catConocimientoId: conocimientoDb.catConocimientoId,
            nombre: conocimientoDb.ncatConocimiento
        }
    };
    return conocimientoJs;
}

// fromJstoDbConocimiento
// trasforma un objeto js en otro db
// que puede ser usado en la base de datos
function fromJstoDbConocimiento(conocimientoJs){
    var conocimientoDb = {
        conocimientoId: conocimientoJs.conocimientoId,
        nombre: conocimientoJs.nombre,
        catConocimientoId: conocimientoJs.catConocimiento.catConocimientoId,
    };
    return conocimientoDb;
}



// postInformes
// punto de entrada común de todas las solicitidudes de informes
// luego en función de los parámetros ya se monta la solicitud específica

module.exports.postInformes = function (parametro, callback) {
    // comprobamos que el parámetro es correcto
    if (!comprobarParametro(parametro)) {
        var err = new Error("El parámetro pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    // segun el informe llamamos a una funciín u otra
    switch (parametro.informe) {
        case "general":
            infGeneral(callback);
            break;
        case "ptrabajador":
            infTrabajador(parametro.tipo, parametro.id, callback);
            break;
        case "pproyectoconocimiento":
            infProyectoConocimiento(parametro.tipo, parametro.id, callback);
            break;
        case "phabilidadtrabajador":
            infHabilidadTrabajador(parametro.tipo, parametro.id, callback);
            break;
        default:
            var err = new Error(sprintf("El informe %s no se reconoce como un informe válido", parametro.informe));
            callback(err);
            break;
    }
}


// infGeneral
// sobre callback devuelve una lista con todos los registros
function infGeneral(callback){
    var connection = getConnection();
    var registros = null;
    var sql = "SELECT";
    sql += " t.nombre AS trabajador,";
    sql += " cat.nombre AS categoria,";
    sql += " c.nombre AS conocimiento,";
    sql += " p.nombre AS proyecto,";
    sql += " DATE_FORMAT(e.dFecha, '%d/%m/%Y') AS dfecha,";
    sql += " DATE_FORMAT(e.hFecha, '%d/%m/%Y') AS hfecha,";
    sql += " DATEDIFF(COALESCE(hFecha, CURDATE()), dFecha) AS dias,";
    sql += " e.observaciones,";
    sql += " t2.nombre AS evaluador";
    sql += " FROM evaluaciones AS e";
    sql += " LEFT JOIN asg_proyectos AS ap ON ap.asgProyectoId = e.asgProyectoId";
    sql += " LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId";
    sql += " LEFT JOIN conocimientos_categorias AS cc ON cc.conocimientoId = e.conocimientoId";
    sql += " LEFT JOIN catconocimientos AS cat ON cat.catConocimientoId = cc.CatConocimientoId";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = ap.trabajadorId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = ap.proyectoId";
    sql += " LEFT JOIN roles AS r ON r.rolId = ap.rolId";
    sql += " LEFT JOIN trabajadores AS t2 ON t2.trabajadorId = ap.evaluadorId";
    sql += " WHERE TRUE";
    sql += " ORDER BY 1, 2, 3, 4";
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        registros = result;
        callback(null, registros);
    });
    closeConnectionCallback(connection, callback);
}

// infTrabajador
// obtiene el informe de los conocimioentos relacionados con los trabajadores
function infTrabajador(tipo, id, callback){
    // primero obtener los registros pasando el id
    var connection = getConnection();
    var registros = null;
    var sql = "SELECT";
    sql += " t.nombre AS trabajador,";
    sql += " cat.nombre AS categoria,";
    sql += " c.nombre AS conocimiento,";
    sql += " p.nombre AS proyecto,";
    sql += " DATE_FORMAT(e.dFecha, '%d/%m/%Y') AS dfecha,";
    sql += " DATE_FORMAT(e.hFecha, '%d/%m/%Y') AS hfecha,";
    sql += " DATEDIFF(COALESCE(hFecha, CURDATE()), dFecha) AS dias,";
    sql += " e.observaciones,";
    sql += " t2.nombre AS evaluador";
    sql += " FROM evaluaciones AS e";
    sql += " LEFT JOIN asg_proyectos AS ap ON ap.asgProyectoId = e.asgProyectoId";
    sql += " LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId";
    sql += " LEFT JOIN conocimientos_categorias AS cc ON cc.conocimientoId = e.conocimientoId";
    sql += " LEFT JOIN catconocimientos AS cat ON cat.catConocimientoId = cc.CatConocimientoId";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = ap.trabajadorId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = ap.proyectoId";
    sql += " LEFT JOIN roles AS r ON r.rolId = ap.rolId";
    sql += " LEFT JOIN trabajadores AS t2 ON t2.trabajadorId = ap.evaluadorId";
    if (id == 0){
        sql += " WHERE TRUE";
    } else {
        sql += " WHERE t.trabajadorId = ?";
        sql = mysql.format(sql, id);
    }
    sql += " ORDER BY 1, 2, 3, 4";
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        registros = infTipoTrabajador(tipo, result);
        callback(null, registros);
    });
    closeConnectionCallback(connection, callback);
}

// infTipoTrabajador
function infTipoTrabajador(tipo, registros){
    switch (tipo) {
        case "p":
            return registros;
            break;
        case "j":
            return infJerarquicoTrabajador(registros);
            break;
        default:
            return registros;
            break;
    }
}

// infJerarquicoTrabajador
function infJerarquicoTrabajador(registros){
    var antTrabajador = "";
    var antCategoria = "";
    var rRegistro = {};
    var rCategoria = {};
    var rConocimiento = {};
    var vRegistros = [];

    for (var i=0; i < registros.length; i++) {
        var registro = registros[i];
        rConocimiento = {
            conocimiento: registro.conocimiento,
            proyecto: registro.proyecto,
            dfecha: registro.dfecha,
            hfecha: registro.hfecha,
            dias: registro.dias,
            observaciones: registro.observaciones,
            evaluador: registro.evaluador
        };
        if (registro.trabajador != antTrabajador) {
            if (antTrabajador != "") {
                vRegistros.push(rRegistro);
            }
            rRegistro = {
                trabajador: registro.trabajador,
                categorias: []
            };
            antTrabajador = registro.trabajador;
            antCategoria = "";
        }
        if (registro.categoria != antCategoria) {
            rCategoria = {
                nombre: registro.categoria,
                conocimientos: [] 
            };
            rRegistro.categorias.push(rCategoria);
            antCategoria = registro.categoria;
        }
        lCategorias = rRegistro.categorias.length - 1;
        rRegistro.categorias[lCategorias].conocimientos.push(rConocimiento);
    }
    if (registros.length > 0) {
        vRegistros.push(rRegistro);
    }

    return vRegistros;
}


// infProyectoConocimiento
// obtiene el informe de los conocimientos en un proyecto (jeraquizado por categorias)
function infProyectoConocimiento(tipo, id, callback) {
    // primero obtener los registros pasando el id
    var connection = getConnection();
    var registros = null;
    var sql = "SELECT";
    sql += " p.nombre AS proyecto,";
    sql += " cat.nombre AS ncategoria,";
    sql += " c.nombre AS nconocimiento,";
    sql += " t.nombre AS ntrabajador,";
    sql += " DATE_FORMAT(e.dFecha, '%d/%m/%Y') AS dFecha,";
    sql += " DATE_FORMAT(e.hFecha, '%d/%m/%Y') AS hFecha,";
    sql += " e.observaciones AS observaciones";
    sql += " FROM";
    sql += " evaluaciones AS e";
    sql += " LEFT JOIN asg_proyectos AS ap ON ap.asgProyectoId = e.asgProyectoId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = ap.proyectoId";
    sql += " LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = ap.trabajadorId";
    sql += " LEFT JOIN conocimientos_categorias AS cc ON cc.conocimientoId = c.conocimientoId";
    sql += " LEFT JOIN catconocimientos AS cat ON cat.catConocimientoId = cc.catConocimientoId";
    if (id == 0) {
        sql += " WHERE TRUE";
    } else {
        sql += " WHERE p.proyectoId = ?";
        sql = mysql.format(sql, id);
    }
    sql += " ORDER BY 1, 2, 3";
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        registros = infTipoProyectoConocimiento(tipo, result);
        callback(null, registros);
    });
    closeConnectionCallback(connection, callback);
}

// infTipoProyectoConocimiento
function infTipoProyectoConocimiento(tipo, registros) {
    switch (tipo) {
        case "p":
            return registros;
            break;
        case "j":
            return infJerarquicoProyectoConocimiento(registros);
            break;
        default:
            return registros;
            break;
    }
}

// infJerarquicoTrabajador
function infJerarquicoProyectoConocimiento(registros) {
    var antProyecto = "";
    var antCategoria = "";
    var antConocimiento = "";
    var antTrabajador = "";

    var rRegistro = {};
    var rProyecto = {};
    var rCategoria = {};
    var rConocimiento = {};
    var rTrabajador = {};
    var vRegistros = [];
    
    var lCategorias = 0;
    var lConocimientos = 0;
    
    for (var i = 0; i < registros.length; i++) {
        var registro = registros[i];
        rTrabajador = {
            ntrabajador: registro.ntrabajador,
            dFecha: registro.dFecha,
            hFecha: registro.hFecha,
            observaciones: registro.observaciones
        };
        if (registro.proyecto != antProyecto) {
            if (antProyecto != "") {
                vRegistros.push(rRegistro);
            }
            rRegistro = {
                proyecto: registro.proyecto,
                categorias: []
            };
            antProyecto = registro.proyecto;
            antCategoria = "";
        }
        if (registro.ncategoria != antCategoria) {
            rCategoria = {
                ncategoria: registro.ncategoria,
                conocimientos: []
            };
            rRegistro.categorias.push(rCategoria);
            antCategoria = registro.ncategoria;
            antConocimiento = "";
        }
        if (registro.nconocimiento != antConocimiento) {
            rConocimiento = {
                nconocimiento: registro.nconocimiento,
                trabajadores: []
            };
            lCategorias = rRegistro.categorias.length - 1;
            rRegistro.categorias[lCategorias].conocimientos.push(rConocimiento);
            antConocimiento = registro.nconocimiento;
        }
        lCategorias = rRegistro.categorias.length - 1;
        lConocimientos = rRegistro.categorias[lCategorias].conocimientos.length - 1;
        rRegistro.categorias[lCategorias].conocimientos[lConocimientos].trabajadores.push(rTrabajador);
    }
    if (registros.length > 0) {
        vRegistros.push(rRegistro);
    }
    
    return vRegistros;
}


// infHabilidadTrabajador
// obtiene el informe de los conocimientos por habilidad (jeraquizado por trabajador)
function infHabilidadTrabajador(tipo, id, callback) {
    // primero obtener los registros pasando el id
    var connection = getConnection();
    var registros = null;
    var sql = "SELECT";
    sql += " h.nombre AS nhabilidad,";
    sql += " t.nombre AS ntrabajador,";
    sql += " c.nombre AS nconocimiento,";
    sql += " p.nombre AS proyecto,";
    sql += " DATE_FORMAT(e.dFecha, '%d/%m/%Y') AS dFecha,";
    sql += " DATE_FORMAT(e.hFecha, '%d/%m/%Y') AS hFecha,";
    sql += " e.observaciones AS observaciones";
    sql += " FROM";
    sql += " evaluaciones AS e";
    sql += " LEFT JOIN asg_proyectos AS ap ON ap.asgProyectoId = e.asgProyectoId";
    sql += " LEFT JOIN proyectos AS p ON p.proyectoId = ap.proyectoId";
    sql += " LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId";
    sql += " LEFT JOIN trabajadores AS t ON t.trabajadorId = ap.trabajadorId";
    sql += " LEFT JOIN conocimientos_habilidades AS ch ON ch.conocimientoId = c.conocimientoId";
    sql += " LEFT JOIN habilidades AS h ON h.habilidadId = ch.habilidadId";
    if (id == 0) {
        sql += " WHERE TRUE";
    } else {
        sql += " WHERE h.habilidadId = ?";
        sql = mysql.format(sql, id);
    }
    sql += " ORDER BY 1, 2, 3";
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        registros = infTipoHabilidadTrabajador(tipo, result);
        callback(null, registros);
    });
    closeConnectionCallback(connection, callback);
}

// infTipoHabilidadTrabajador
function infTipoHabilidadTrabajador(tipo, registros) {
    switch (tipo) {
        case "p":
            return registros;
            break;
        case "j":
            return infJerarquicoHabilidadTrabajador(registros);
            break;
        default:
            return registros;
            break;
    }
}

// infJerarquicoHabilidadTrabajador
function infJerarquicoHabilidadTrabajador(registros) {
    var antHabilidad = "";
    var antTrabajador = "";
    var antConocimiento = "";
    
    var rRegistro = {};
    var rHabilidad = {};
    var rTrabajador = {};
    var rConocimiento = {};
    var vRegistros = [];
    
    var lTrabajadores = 0;

    
    for (var i = 0; i < registros.length; i++) {
        var registro = registros[i];
        rConocimiento = {
            nconocimiento: registro.nconocimiento,
            proyecto: registro.proyecto,
            dFecha: registro.dFecha,
            hFecha: registro.hFecha,
            observaciones: registro.observaciones
        };
        if (registro.nhabilidad != antHabilidad) {
            if (antHabilidad != "") {
                vRegistros.push(rRegistro);
            }
            rRegistro = {
                nhabilidad: registro.nhabilidad,
                trabajadores: []
            };
            antHabilidad = registro.nhabilidad;
            antTrabajador = "";
        }
        if (registro.ntrabajador != antTrabajador) {
            rTrabajador = {
                ntrabajador: registro.ntrabajador,
                conocimientos: []
            };
            rRegistro.trabajadores.push(rTrabajador);
            antTrabajador = registro.ntrabajador;
        }
        lTrabajadores = rRegistro.trabajadores.length - 1;
        rRegistro.trabajadores[lTrabajadores].conocimientos.push(rConocimiento);
    }
    if (registros.length > 0) {
        vRegistros.push(rRegistro);
    }
    
    return vRegistros;
}