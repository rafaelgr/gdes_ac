/*-------------------------------------------------------------------------- 
areaDetalle.js
Funciones js par la página AreaDetalle.html
---------------------------------------------------------------------------*/
var adminId = 0;

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
    $("#frmArea").submit(function() {
        return false;
    });

    adminId = gup('AreaId');
    if (adminId != 0) {
        var data = {
                areaId: adminId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/areas/" + adminId,
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
        vm.areaId(0);
    }
}

function admData() {
    var self = this;
    self.areaId = ko.observable();
    self.nombre = ko.observable();
}

function loadData(data) {
    vm.areaId(data.areaId);
    vm.nombre(data.nombre);
}

function datosOK() {
    $('#frmArea').validate({
        rules: {
            txtNombre: { required: true }
        },
        // Messages for form validation
        messages: {
            txtNombre: { required: 'Introduzca el nombre' }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmArea').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            area: {
                "areaId": vm.areaId(),
                "nombre": vm.nombre()
            }
        };
        if (adminId == 0) {
            $.ajax({
                type: "POST",
                url: "api/areas",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "AreaGeneral.html?AreaId=" + vm.areaId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/areas/" + adminId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "AreaGeneral.html?AreaId=" + vm.areaId();
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
        var url = "AreaGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}
