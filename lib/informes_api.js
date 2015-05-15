// informes_api
// manejo de los mensajes REST dirigidos a la gestión de informes
var informesDb = require("./informes_db_mysql");

// postInformes
// Entrada genral a la solicitud de informes
module.exports.postInformes = function (req, res) {
    var parametro = req.body;
    informesDb.postInformes(parametro, function (err, registros) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(registros);
        }
    });
}