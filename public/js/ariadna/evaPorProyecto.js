﻿/*-------------------------------------------------------------------------- 
evaPorProyecto.js
Funciones js par la página EvaPorProyecto.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataAsgProyectos;
var asgProyectoId;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    //comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    vm = new asgProyectoData();
    ko.applyBindings(vm);
    //
    $('#btnBuscar').click(buscarAsgProyectos());
    $('#frmBuscar').submit(function() {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarAsgProyectos();
    //});
    //
    initTablaAsgProyectos();
    // carga del desplegable.
    loadProyectos(-1);

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
}

function asgProyectoData() {
    var self = this;
    // soporte de combos
    self.posiblesProyectos = ko.observableArray([]);
    self.elegidosProyectos = ko.observableArray([]);
    // valores escogidos
    self.sproyectoId = ko.observable();
}

function loadProyectos(proyectoId) {
    $.ajax({
        type: "GET",
        url: "/api/proyectos",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var proyectos = [{ propyectoId: 0, nombre: "" }].concat(data);
            vm.posiblesProyectos(data);
        },
        error: errorAjax
    });
}

function initTablaAsgProyectos() {
    tablaCarro = $('#dt_asgProyecto').dataTable({
        autoWidth: true,
        preDrawCallback: function() {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_asgProyecto'), breakpointDefinition);
            }
        },
        rowCallback: function(nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function(oSettings) {
            responsiveHelper_dt_basic.respond();
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataAsgProyectos,
        columns: [{
            data: "nombre"
        }, {
            data: "trabajador.nombre"
        }, {
            data: "proyecto.nombre"
        }, {
            data: "rol.nombre"
        }, {
            data: "asgProyectoId",
            render: function(data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-success btn-lg' onclick='editAsgProyecto(" + data + ");' title='Evaluar asignacion'> <i class='fa fa-edit fa-gears'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + "</div>";
                return html;
            }
        }]
    });
}

function datosOK() {
    //TODO: Incluir en la validación si el certificado figura en el almacén de certificados.
    $('#frmBuscar').validate({
        rules: {
            cmbProyectos: { required: true },
        },
        // Messages for form validation
        messages: {
            cmbProyectos: {
                required: 'Seleccione un proyecto'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscar').valid();
}

function loadTablaAsgProyectos(data) {
    var dt = $('#dt_asgProyecto').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbAsgProyecto").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbAsgProyecto").show();
    }
}

function buscarAsgProyectos() {
    var mf = function() {
        if (!datosOK()) {
            return;
        }
        // enviar la consulta por la red (AJAX)
        var data = {
            "proyectoId": vm.elegidosProyectos()[0]
        };
        $.ajax({
            type: "POST",
            url: "api/asg-proyectos-buscar",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaAsgProyectos(data);
            },
            error: errorAjax
        });
    };
    return mf;
}


function editAsgProyecto(id) {
    // hay que abrir la página de detalle de asgProyecto
    // pasando en la url ese ID
    var url = "EvaAsgDetalle.html?AsgProyectoId=" + id;
    window.open(url, '_self');
}
