/*-------------------------------------------------------------------------- 
unidadDetalle.js
Funciones js par la página UnidadDetalle.html
---------------------------------------------------------------------------*/
var unidadId = 0; 
function initForm() {
    // comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmUnidad").submit(function () {
        return false;
    });

    unidadId = gup('UnidadId');
    if (unidadId != 0) {
        var data = {
            unidadId: unidadId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/unidades/" + unidadId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.unidadId(0);
    }
}

function admData() {
    var self = this;
    self.unidadId = ko.observable();
    self.nombre = ko.observable();
    self.login = ko.observable();
    self.password = ko.observable();
    self.email = ko.observable();
}

function loadData(data) {
    vm.unidadId(data.unidadId);
    vm.nombre(data.nombre);
    vm.login(data.login);
    vm.password(data.password);
    vm.email(data.email);
}

function datosOK() {
    $('#frmUnidad').validate({
        rules: {
            txtNombre: { required: true }
        },
        // Messages for form validation
        messages: {
            txtNombre: {required: 'Introduzca el nombre'}
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmUnidad').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            unidad: {
                "unidadId": vm.unidadId(),
                "nombre": vm.nombre()
            }
        };
        if (unidadId == 0) {
            $.ajax({
                type: "POST",
                url: "api/unidades",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "UnidadNegocioGeneral.html?UnidadId=" + vm.unidadId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/unidades/" + unidadId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "UnidadNegocioGeneral.html?UnidadId=" + vm.unidadId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        }
    };
    return mf;
}

function salir() {
    var mf = function () {
        var url = "UnidadNegocioGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}