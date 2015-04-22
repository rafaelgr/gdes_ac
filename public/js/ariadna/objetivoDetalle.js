/*-------------------------------------------------------------------------- 
objetivoDetalle.js
Funciones js par la página ObjetivoDetalle.html
---------------------------------------------------------------------------*/
var objetivoId = 0; 
function initForm() {
    // comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new objetivoData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmObjetivo").submit(function () {
        return false;
    });
    
    

    objetivoId = gup('ObjetivoId');
    if (objetivoId != 0) {
        var data = {
            objetivoId: objetivoId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: "/api/objetivos/" + objetivoId,
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
        vm.objetivoId(0);
        loadCategorias(-1);
        loadTipos(-1);
        loadEvaluadores(null);
    }
}

function objetivoData() {
    var self = this;
    self.objetivoId = ko.observable();
    self.nombre = ko.observable();
    self.categoria = ko.observable();
    self.tipo = ko.observable();
    // soporte de combos
    self.posiblesCategorias = ko.observableArray([]);
    self.posiblesTipos = ko.observableArray([]);
    self.posiblesEvaluadores = ko.observableArray([]);
    // valores escogidos
    self.scategoriaId = ko.observable();
    self.stipoId = ko.observable();
    self.sevaluadorId = ko.observable();
}

function loadData(data) {
    vm.objetivoId(data.objetivoId);
    vm.nombre(data.nombre);
    vm.categoria(data.categoria);
    vm.tipo(data.tipo);
    loadCategorias(data.categoria.categoriaId);
    loadTipos(data.tipo.tipoId);
    if (data.evaluador == null) {
        loadEvaluadores(null);
    }else{
        loadEvaluadores(data.evaluador.evaluadorId);
    }
}

function loadCategorias(categoriaId){
    $.ajax({
        type: "GET",
        url: "/api/categorias",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status){
            vm.posiblesCategorias(data);
            vm.scategoriaId(categoriaId);
        },
        error: errorAjax
    });
}

function loadTipos(tipoId) {
    $.ajax({
        type: "GET",
        url: "/api/tipos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            vm.posiblesTipos(data);
            vm.stipoId(tipoId);
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
        success: function (data, status) {
            // añadimos un valor nulo para que se pueda elegir
            trabajador = {
                "trabajadorId": null,
                "nombre": ""
            };
            data.push(trabajador);
            vm.posiblesEvaluadores(data);
            vm.sevaluadorId(evaluadorId);
        },
        error: errorAjax
    });
}

function datosOK() {
    $('#frmObjetivo').validate({
        rules: {
            txtNombre: { required: true },
            cmbCategorias: { required: true },
            cmbTipos: { required: true }
        },
        // Messages for form validation
        messages: {
            txtNombre: {required: 'Introduzca el nombre'},
            cmbCategorias: {required: 'Seleccione una categoría'},
            cmbTipos: {required: 'Seleccione un tipo'}
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    //// comprobamos que ha seleccionado al menos una categoría y un tipo
    //if (vm.scategoriaId() < 0 || vm.stipoId() < 0) {
    //    mostrarMensajeSmart("Debe seleccionar una categoría y un tipo");
    //    return false;
    //}
    return $('#frmObjetivo').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            objetivo: {
                "objetivoId": vm.objetivoId(),
                "nombre": vm.nombre(),
                "categoria": {
                    "categoriaId": vm.scategoriaId()
                },
                "tipo": {
                    "tipoId": vm.stipoId()
                },
                "evaluador": {
                    "evaluadorId": vm.sevaluadorId()
                }
            }
        };
        if (objetivoId == 0) {
            $.ajax({
                type: "POST",
                url: "api/objetivos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // Nos volvemos al general
                    var url = "ObjetivoGeneral.html?ObjetivoId=" + data.objetivoId;
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: "api/objetivos/" + objetivoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // Nos volvemos al general
                    var url = "ObjetivoGeneral.html?ObjetivoId=" + data.objetivoId;
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
        var url = "ObjetivoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}