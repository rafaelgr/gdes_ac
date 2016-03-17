/*-------------------------------------------------------------------------- 
asgTrabajadorProyectoDetalle.js
Funciones js par la página AsgTrabajadorProyectoDetalle.html
---------------------------------------------------------------------------*/
var asgProyectoId = 0;

function initForm() {
    // comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new asgProyectoData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#cmbProyectos").change(cambiaProyecto());
    $("#frmAsgProyecto").submit(function() {
        return false;
    });

    $("#cmbTrabajadores").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });
    $("#cmbProyectos").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });
    $("#cmbRoles").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });
    $("#cmbEvaluadores").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });
    asgProyectoId = gup('AsgProyectoId');
    if (asgProyectoId != 0) {
        var data = {
                asgProyectoId: asgProyectoId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/asg-proyectos/" + asgProyectoId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.asgProyectoId(0);
        loadTrabajadores(-1);
        loadProyectos(-1);
        loadRoles(-1);
        loadEvaluadores(-1);
    }
}

function asgProyectoData() {
    var self = this;
    self.asgProyectoId = ko.observable();
    self.trabajador = ko.observable();
    self.proyecto = ko.observable();
    self.nombre = ko.observable();
    self.rol = ko.observable();
    self.descripcion = ko.observable();
    // soporte de combos
    self.posiblesTrabajadores = ko.observableArray([]);
    self.elegidosTrabajadores = ko.observableArray([]);
    self.posiblesProyectos = ko.observableArray([]);
    self.elegidosProyectos = ko.observableArray([]);
    self.posiblesRoles = ko.observableArray([]);
    self.elegidosRoles = ko.observableArray([]);
    self.posiblesEvaluadores = ko.observableArray([]);
    self.elegidosEvaluadores = ko.observableArray([]);
    // valores escogidos
    self.strabajadorId = ko.observable();
    self.sproyectoId = ko.observable();
    self.srolId = ko.observable();
    self.sevaluadorId = ko.observable();

    self.fechaInicio = ko.observable();
    self.fechaFinal = ko.observable();

}

function loadData(data) {
    vm.asgProyectoId(data.asgProyectoId);
    vm.nombre(data.nombre);
    vm.trabajador(data.trabajador);
    vm.proyecto(data.proyecto);
    vm.rol(data.rol);
    vm.descripcion(data.descripcion);
    loadTrabajadores(data.trabajador.trabajadorId);
    loadProyectos(data.proyecto.proyectoId);
    loadRoles(data.rol.rolId);
    if (data.evaluador != null) {
        loadEvaluadores(data.evaluador.evaluadorId);
    } else {
        loadEvaluadores(-1);
    }
    if (data.fechaInicio != null) {
        vm.fechaInicio(moment(data.fechaInicio).format("DD/MM/YYYY"));
    } else {
        vm.fechaInicio(null);
    }
    if (data.fechaFinal != null) {
        vm.fechaFinal(moment(data.fechaFinal).format("DD/MM/YYYY"));
    } else {
        vm.fechaFinal(null);
    }
}

function loadTrabajadores(trabajadorId) {
    $.ajax({
        type: "GET",
        url: "/api/trabajadores",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var trabajadores = [{ trabajadorId: 0, nombre: "" }].concat(data);
            vm.posiblesTrabajadores(trabajadores);
            $("#cmbTrabajadores").val([trabajadorId]).trigger('change');
        },
        error: errorAjax
    });
}

function loadEvaluadores(evaluadorId) {
    $.ajax({
        type: "GET",
        url: "/api/evaluadores",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var evaluadores = [{ trabajadorId: 0, nombre: "" }].concat(data);
            vm.posiblesEvaluadores(evaluadores);
            $("#cmbEvaluadores").val([evaluadorId]).trigger('change');
        },
        error: errorAjax
    });
}

function loadProyectos(proyectoId) {
    $.ajax({
        type: "GET",
        url: "/api/proyectos",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var proyectos = [{ proyectoId: 0, nombre: "" }].concat(data);
            vm.posiblesProyectos(proyectos);
            $("#cmbProyectos").val([proyectoId]).trigger('change');
        },
        error: errorAjax
    });
}

function loadRoles(rolId) {
    $.ajax({
        type: "GET",
        url: "/api/roles",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var roles = [{ rolId: 0, nombre: "" }].concat(data);
            vm.posiblesRoles(roles);
            $("#cmbRoles").val([rolId]).trigger('change');
        },
        error: errorAjax
    });
}



function datosOK() {
    $('#frmAsgProyecto').validate({
        rules: {
            cmbTrabajadores: {
                required: true
            },
            cmbProyectos: {
                required: true
            },
            cmbRoles: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbTrabajadores: {
                required: 'Seleccione una categoría'
            },
            cmbProyectos: {
                required: 'Seleccione un proyecto'
            },
            cmbRoles: {
                required: 'Seleccione un rol'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    if ($("#txtAsgProyecto").val() == "") {
        // si no han rellenado el nombre le generamos uno
        vm.nombre($('#cmbTrabajadores option:selected').text() + " [" + $('#cmbProyectos option:selected').text() + "]");
    }

    return $('#frmAsgProyecto').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        // control de fechas 
        var fecha1, fecha2;
        if (moment(vm.fechaInicio(), "DD/MM/YYYY").isValid()) {
            fecha1 = moment(vm.fechaInicio(), "DD/MM/YYYY").format("YYYY-MM-DD");
        } else {
            fecha1 = null;
        }
        if (moment(vm.fechaFinal(), "DD/MM/YYYY").isValid()) {
            fecha2 = moment(vm.fechaFinal(), "DD/MM/YYYY").format("YYYY-MM-DD");
        } else {
            fecha2 = null;
        }
        var data = {
            asgProyecto: {
                "asgProyectoId": vm.asgProyectoId(),
                "nombre": vm.nombre(),
                "descripcion": vm.descripcion(),
                "fechaInicio": fecha1,
                "fechaFinal": fecha2,
                "trabajador": {
                    "trabajadorId": vm.elegidosTrabajadores()[0]
                },
                "proyecto": {
                    "proyectoId": vm.elegidosProyectos()[0]
                },
                "rol": {
                    "rolId":vm.elegidosRoles()[0]
                },
                "evaluador": {
                    "evaluadorId": vm.elegidosEvaluadores()[0]
                }
            }
        };
        if (vm.elegidosTrabajadores()[0] == -1) {
            data.asgProyecto.evaluador.evaluadorId = null;
        }
        if (asgProyectoId == 0) {
            $.ajax({
                type: "POST",
                url: "api/asg-proyectos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // Nos volvemos al general
                    var url = "AsgTrabajadorProyecto.html?AsgProyectoId=" + data.asgProyectoId;
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/asg-proyectos/" + asgProyectoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // Nos volvemos al general
                    var url = "AsgTrabajadorProyecto.html?AsgProyectoId=" + data.asgProyectoId;
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        }
    };
    return mf;
}

function salir() {
    var mf = function() {
        var url = "AsgTrabajadorProyecto.html";
        window.open(url, '_self');
    }
    return mf;
}

function cambiaProyecto() {
    var mf = function() {
        // solo en alta
        if (asgProyectoId == 0) {

        }
    }
    return mf;
}
