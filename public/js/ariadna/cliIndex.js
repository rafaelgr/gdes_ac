// de blank_ (pruebas)
var chart = null;

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataAsgTrabajadores;
var asgTrabajadorId;
var trabajador;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    // comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    vm = new modelData();
    ko.applyBindings(vm);
    //
    var trabajador = comprobarLoginTrabajador();
    $("#userName").text(trabajador.nombre);
    controlBotones(trabajador);
    // cargar la tabla con un único valor que es el que corresponde.
    var data = {
        trabajadorId: trabajador.trabajadorId
    }
    // hay que buscar ese elemento en concreto
    $.ajax({
        type: "POST",
        url: "api/asg-trabajador-buscar",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            vm.asignaciones(data);
        },
        error: errorAjax
    });

}

function modelData() {
    var self = this;
    self.asignaciones = ko.observableArray();
    self.viewAsg = function (asg){
        viewAsgTrabajadorId(asg.asgTrabajadorId);
    }
}



function viewAsgTrabajador(asg) {
    var mf = function (asg) {
        // hay que abrir la página de detalle de asgTrabajador
        // pasando en la url ese ID
        var url = "CliAsgObjetivoDetalle.html?AsgTrabajadorId=" + asg.asgTrabajadorId;
        window.open(url, '_self');
    };
    return mf;
}


