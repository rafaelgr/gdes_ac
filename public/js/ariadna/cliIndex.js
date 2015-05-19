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
    trabajador = comprobarLoginTrabajador();
    controlBotones(trabajador);
    $("#userName").text(trabajador.nombre);
    
    $("#btnPDF").click(launchPDF());

    // cargar la tabla con un único valor que es el que corresponde.
    var data = {
        informe: "ptrabajador",
        tipo: "j",
        id: trabajador.trabajadorId
    }
    // hay que buscar ese elemento en concreto
    $.ajax({
        type: "POST",
        url: myconfig.apiUrl + "/api/informes",
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


function informePDF(data){
    var data = {
        "template": { "shortid" : "Nknhlj67" },
        "data": data
    }
    //$.ajax({
    //    type: "POST",
    //    url: myconfig.reportUrl + "/api/report",
    //    dataType: "json",
    //    contentType: "application/json",
    //    data: JSON.stringify(data)
    //});
    //$.post(myconfig.reportUrl + "/api/report", data, function (d) {
    //    var blob = new Blob([d]);
    //    var link = document.createElement('a');
    //    link.href = window.URL.createObjectURL(blob);
    //    link.download = "Dossier_" + new Date() + ".pdf";
    //    link.click();
    //});
    f_open_post("POST", myconfig.reportUrl + "/api/report", data);
}

function launchPDF(){
    var mf = function () {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
            informe: "ptrabajador",
            tipo: "j",
            id: trabajador.trabajadorId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/informes",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                // vm.asignaciones(data);
                informePDF(data[0]);
            },
            error: errorAjax
        });
    };
    return mf;
}

// f_open_post("POST", myconfig.reportUrl + "/api/report", data);

var f_open_post = function (verb, url, data, target) {
    var form = document.createElement("form");
    form.action = url;
    form.method = verb;
    form.target = target || "_blank";
    //if (data) {
    //    for (var key in data) {
    //        var input = document.createElement("textarea");
    //        input.name = key;
    //        input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
    //        form.appendChild(input);
    //    }
    //}
    var input = document.createElement("textarea");
    input.name = "template[shortid]";
    input.value = data.template.shortid;
    form.appendChild(input);

    input = document.createElement("textarea");
    input.name = "data";
    input.value = JSON.stringify(data.data);
    form.appendChild(input);

    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
};