var tabla;
jQuery(document).ready(function () {
    //call origen datos
    var divSelect = document.getElementById('Selector');
    var divCapture = document.getElementById('capture');
    var divBuqueda = document.getElementById('Buscar');
    var divDetalles = document.getElementById('panelDetalle');
    var select = true;
    if (divSelect !== null) {
        divSelect.style.display = "block";
    } else {
        select = false;
    }
    if (divCapture !== null) {
        if (select) {
            divCapture.style.display = "none";
        } else {
            divCapture.style.display = "block";
        }

    }
    if (divBuqueda !== null) {
        divBuqueda.style.display = "none";
    }

    if (divDetalles) {
        divDetalles.style.display = "none";
    }

});

function ocultarformaSelect() {
    var divSelect = document.getElementById('Selector');
    var divCapture = document.getElementById('capture');
    divSelect.style.display = "none";
    divCapture.style.display = "block";
    activarMode();
    //Lerr aqui los detalles y generar los valores
}

function searchByFilters() {
    //    var filters = new Array();
    //    $('[kind="filter"]').each(function() {
    //        var cmpVal = $(this).attr("persist");
    //        if (cmpVal.includes("_ID")) {
    //            cmpVal = cmpVal.substring(0, cmpVal.indexOf('_'));
    //            cmpVal += ".id";
    //        }
    //        filters.push(new Array(cmpVal, $(this).val()));
    //
    //    });
    setFiltros();
}

function ocultarformacapture(capture, detalle, busqueda, captureDetalle) {
    var divSelect = document.getElementById('Selector');
    var divCapture = document.getElementById('capture');
    var divDetalles = document.getElementById('panelDetalle');
    var divcapturaDetalles = document.getElementById('CaptureDetalle');
    var divbuscar = document.getElementById('Buscar');
    if (detalle) {
        divCapture.style.display = "block";
        divDetalles.style.display = "none";
        while (divDetalles.firstChild) {
            divDetalles.removeChild(divDetalles.firstChild);
        }
    } else if (capture) {

        //clearObjetosgen();
        // divSelect.style.display = "block";
        if (divSelect !== null) {
            divSelect.style.display = "block";
            divCapture.style.display = "none";
            limpiar();
        } else if (divcapturaDetalles !== null) {

            divcapturaDetalles.style.display = "none";
            divCapture.style.display = "block";
            limpiarDetalleMasiva();
        }


    } else if (busqueda) {
        divbuscar.style.display = "none"
        divCapture.style.display = "block";
    } else if (captureDetalle) {
        var valoresglobales = getnamesGlobales();
        //  console.log(valoresglobales);
        divCapture.style.display = "none";
        divcapturaDetalles.style.display = "block";
        //var contenedor = document.getElementById('capture');
        var element = divcapturaDetalles.querySelectorAll("Input,select");

        for (var key in valoresglobales) {
            for (var i = 0; i < element.length; i++) {
                if (element[i].getAttribute('persist') === key) {
                    element[i].value = valoresglobales[key];
                    element[i].disabled = true;
                }
            }
            //$("select[persist='" + key + "']")[0].value = valoresglobales[key];

        }
        if (tabla === "MovNomConcep") {
            crearComponentesParametros();
        }

    }

}

function abrirFormaBusqueda() {
    var divSelect = document.getElementById('Buscar');
    var divCapture = document.getElementById('capture');

    var tbl = divSelect.querySelector("table");
    divSelect.style.display = "block";
    divCapture.style.display = "none";
    if (tipoComponentes === 1) {
        var tbl = divSelect.querySelector("table");
        buquedaRangos(0, tbl.getAttribute('persist'));
    } else if (tipoComponentes === 2) {

        var tbl = divSelect.querySelector('div[persistSearch]');
        buquedaRangos(0, tbl.getAttribute('persistSearch'));
    }
}
//function cerrarFromaBusqueda() {
//    var divSelect = document.getElementById('Buscar');
//    var divCapture = document.getElementById('capture');
//    divSelect.style.display = "none";
//    divCapture.style.display = "block";
//}
function asignartabla(name) {
    tabla = name;
}

