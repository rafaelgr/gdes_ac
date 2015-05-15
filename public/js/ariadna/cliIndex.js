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
    //comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    var trabajador = comprobarLoginTrabajador();
    $("#userName").text(trabajador.nombre);
    controlBotones(trabajador);
    // cargar la tabla con un único valor que es el que corresponde.
    var data = {
        informe: "ptrabajador",
        tipo: "j",
        id: trabajador.trabajadorId
    }
    // hay que buscar ese elemento en concreto
    $.ajax({
        type: "POST",
        url: "api/informes",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status) {
            // hay que mostrarlo en la zona de datos
            // vm.asignaciones(data);
            loadTemplate(data[0]);
        },
        error: errorAjax
    });

}

function loadTemplate(data){
    // Grab the template script
    var theTemplateScript = $("#ac-conocimientos").html();
    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);
    // Pass our data to the template
    var theCompiledHtml = theTemplate(data);
    // Add the compiled html to the page
    $('#hdbContent').html(theCompiledHtml);
}