var route = "";
var periodoNomina;
var parametrosGlobales = { "ejercicioActual": 2020 };
function getPeriodosNomina() {
    var obj = {};
    var cont = document.getElementById('capture');
    var select = cont.querySelectorAll("div[functedit='setEditObjectGeneric']");
    for (var i = 0; i < select.length; i++) {
        if (select[i].getAttribute('persist') === "TipoNomina" || select[i].getAttribute('persist') === "TipoCorrida") {
            obj[select[i].getAttribute('persist')] = select[i].value;
        }
    }
    obj['Anio'] = parametrosGlobales.ejercicioActual;
    var getData = "";
    var url = route + "/api/AbrirCerrarPerNom/getPeriodosNomina";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        getData = Mensaje.resultado;
        $('select[persist=PeriodosNomina] option:not(:first)').remove();
        for (var i = 0; i < getData.length; i++) {
            $('select[persist=PeriodosNomina]').append($("<option></option>")
                                .attr("value", getData[i].id)
                                .text(getData[i].descripcion));
        }
    }
    if (getData) {
        return getData;
    }

}

function getPeriodoNominaID(id) {
    var url = route + "/api/AbrirCerrarPerNom/getPeriodoNominaID";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        periodoNomina = Mensaje.resultado;

    }
    console.log(periodoNomina);
}

function CerrarPeriodo() {
    if (document.querySelector("[dataedit=EditPeriodosNomina]")) {
        var id = document.querySelector("[dataedit=EditPeriodosNomina]").getAttribute("value");
        getPeriodoNominaID(id);
    }
    if (periodoNomina.status) {
        periodoNomina.status = false;
        var obj = {};
        obj['periodoNomina'] = periodoNomina;
        var url = route + "/api/AbrirCerrarPerNom/actualizarPer";
        var dataToPost = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado === null) {
            alert("No object");
        } else {
            alert("Actualizado Correctamente");
            limpiar();

        }
    } else {
        alert("Este Periodo ya esta cerrado");
    }
}

function AbrirPeriodo() {
    if (document.querySelector("[dataedit=EditPeriodosNomina]")) {
        var id = document.querySelector("[dataedit=EditPeriodosNomina]").getAttribute("value");
        getPeriodoNominaID(id);
    }
    if (!periodoNomina.status) {
        periodoNomina.status = true;
        var obj = {};
        obj['periodoNomina'] = periodoNomina;
        var url = route + "/api/AbrirCerrarPerNom/actualizarPer";
        var dataToPost = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado === null) {
            alert("No object");
        } else {
            alert("Actualizado Correctamente");
            limpiar();

        }
    } else {
        alert("Este Periodo No esta cerrado");
    }
}

function limpiar() {
    if (document.querySelector("[dataedit=EditTipoCorrida]")) {
        var id = document.querySelector("[dataedit=EditTipoCorrida]").id;
        clearEdit(id);
    }
    if (document.querySelector("[dataedit=EditTipoNomina]")) {
        var id2 = document.querySelector("[dataedit=EditTipoNomina]").id;
        clearEdit(id2);
    }
    if (document.querySelector("[dataedit=EditPeriodosNomina]")) {
        var id3 = document.querySelector("[dataedit=EditPeriodosNomina]").id;
        clearEdit(id3);
    }
}