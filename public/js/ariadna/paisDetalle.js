/*-------------------------------------------------------------------------- 
paisDetalle.js
Funciones js par la página PaisDetalle.html
---------------------------------------------------------------------------*/
var paisId = 0; 
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
    $("#frmPais").submit(function () {
        return false;
    });

    paisId = gup('PaisId');
    if (paisId != 0) {
        var data = {
            paisId: paisId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/paises/" + paisId,
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
        vm.paisId(0);
    }
}

function admData() {
    var self = this;
    self.paisId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.paisId(data.paisId);
    vm.nombre(data.nombre);
}

function datosOK() {
    $('#frmPais').validate({
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
    return $('#frmPais').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            pais: {
                "paisId": vm.paisId(),
                "nombre": vm.nombre()
            }
        };
        if (paisId == 0) {
            $.ajax({
                type: "POST",
                url: "api/paises",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "PaisGeneral.html?PaisId=" + vm.paisId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/paises/" + paisId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "PaisGeneral.html?PaisId=" + vm.paisId();
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
        var url = "PaisGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}