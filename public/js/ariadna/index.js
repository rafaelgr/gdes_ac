// de blank_ (pruebas)
var chart = null;

function initForm() {
    // comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    // cargar la tabla con un único valor que es el que corresponde.
    var data = {
        informe: "general",
        tipo: "p",
        id: 0
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
            loadPivot(data);
            //loadPivot2(data);
        },
        error: errorAjax
    });

}

function loadPivot(data){
    
    $("#output").pivotUI(data, {
        cols: ["categoria"], 
        rows: ["proyecto"]
    });
}

function loadPivot2(data2){
    var derivers = $.pivotUtilities.derivers;
    var renderers = $.extend($.pivotUtilities.renderers, 
                    $.pivotUtilities.c3_renderers);
    $("#output2").pivotUI(data2, {
        renderers: renderers,
        cols: ["categoria"], rows: ["proyecto"],
        rendererName: "Gráfico área"
    });    

}


