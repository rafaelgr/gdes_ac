/*-------------------------------------------------------------------------- 
puestoDetalle.js
Funciones js par la página PuestoTrabajoDetalle.html
---------------------------------------------------------------------------*/
var puestoId = 0; 
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
    $("#frmPuesto").submit(function () {
        return false;
    });

    puestoId = gup('PuestoId');
    if (puestoId != 0) {
        var data = {
            puestoId: puestoId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/puestos/" + puestoId,
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
        vm.puestoId(0);
    }
}

function admData() {
    var self = this;
    self.puestoId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.puestoId(data.puestoId);
    vm.nombre(data.nombre);
}

function datosOK() {
    $('#frmPuesto').validate({
        rules: {
            txtNombre: { required: true },
            txtLogin: { required: true },
            txtEmail: { required: true, email:true }
        },
        // Messages for form validation
        messages: {
            txtNombre: {required: 'Introduzca el nombre'},
            txtLogin: {required: 'Introduzca el login'},
            txtEmail: {required: 'Introduzca el correo', email: 'Debe usar un correo válido'}
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmPuesto').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            puesto: {
                "puestoId": vm.puestoId(),
                "nombre": vm.nombre()
            }
        };
        if (puestoId == 0) {
            $.ajax({
                type: "POST",
                url: "api/puestos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "PuestoTrabajoGeneral.html?PuestoId=" + vm.puestoId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/puestos/" + puestoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "PuestoTrabajoGeneral.html?PuestoId=" + vm.puestoId();
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
        var url = "PuestoTrabajoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}