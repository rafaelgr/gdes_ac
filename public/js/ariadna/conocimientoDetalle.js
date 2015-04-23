/*-------------------------------------------------------------------------- 
conocimientoDetalle.js
Funciones js par la página ConocimientoDetalle.html
---------------------------------------------------------------------------*/
var conocimientoId = 0; 
function initForm() {
    // comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new conocimientoData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmConocimiento").submit(function () {
        return false;
    });
    
    

    conocimientoId = gup('ConocimientoId');
    if (conocimientoId != 0) {
        var data = {
            conocimientoId: conocimientoId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/conocimientos/" + conocimientoId,
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
        vm.conocimientoId(0);
        loadCatConocimientos(-1);
    }
}

function conocimientoData() {
    var self = this;
    self.conocimientoId = ko.observable();
    self.nombre = ko.observable();
    self.catConocimiento = ko.observable();
    self.tipo = ko.observable();
    // soporte de combos
    self.posiblesCatConocimientos = ko.observableArray([]);
    // valores escogidos
    self.scatConocimientoId = ko.observable();
}

function loadData(data) {
    vm.conocimientoId(data.conocimientoId);
    vm.nombre(data.nombre);
    vm.catConocimiento(data.catConocimiento);
    vm.tipo(data.tipo);
    loadCatConocimientos(data.catConocimiento.catConocimientoId);
}

function loadCatConocimientos(catConocimientoId){
    $.ajax({
        type: "GET",
        url: "/api/catConocimientos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status){
            vm.posiblesCatConocimientos(data);
            vm.scatConocimientoId(catConocimientoId);
        },
        error: errorAjax
    });
}

function datosOK() {
    $('#frmConocimiento').validate({
        rules: {
            txtNombre: { required: true },
            cmbCatConocimientos: { required: true }
        },
        // Messages for form validation
        messages: {
            txtNombre: {required: 'Introduzca el nombre'},
            cmbCatConocimientos: {required: 'Seleccione una categoría'}
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    //// comprobamos que ha seleccionado al menos una categoría y un tipo
    //if (vm.scatConocimientoId() < 0 || vm.stipoId() < 0) {
    //    mostrarMensajeSmart("Debe seleccionar una categoría y un tipo");
    //    return false;
    //}
    return $('#frmConocimiento').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            conocimiento: {
                "conocimientoId": vm.conocimientoId(),
                "nombre": vm.nombre(),
                "catConocimiento": {
                    "catConocimientoId": vm.scatConocimientoId()
                }
            }
        };
        if (conocimientoId == 0) {
            $.ajax({
                type: "POST",
                url: "api/conocimientos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // Nos volvemos al general
                    var url = "ConocimientoGeneral.html?ConocimientoId=" + data.conocimientoId;
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/conocimientos/" + conocimientoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // Nos volvemos al general
                    var url = "ConocimientoGeneral.html?ConocimientoId=" + data.conocimientoId;
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
        var url = "ConocimientoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}