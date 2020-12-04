/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */

var claveTipoNomina = null;
var elementsReporteResPercepDeduc = new Array("editRepPerDedTipoCorrida", "editRepPerDedTipoNomina");

jQuery(document).ready(function () {
    initRepResPerDeduc();
    InitDefault();

});

function InitDefault() {
    //setEditObject("editRepPerDedTipoCorrida", "PER");
    //setEditObjectByID("editRepPerDedTipoNomina", "5");
}

function initRepResPerDeduc() {

}

//Config Edit's *****
function setEditRepPerDedTipoCorrida() {
    //Parameters
    nameCmp = "editRepPerDedTipoCorrida";
    table = "TipoCorrida";
    nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposObtener = ["[]clave", "descripcion"];
    var tituloSel = "Tipo corrida";
    var tamSel = "size-2";
    camposMostrar = ["clave", "descripcion"];

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamSel);


}

function setEditRepPerDedTipoCorridaShow(value) {
    if (value !== null) {

    }
}

function setEditRepPerDedTipoNomina() {
    nameCmp = "editRepPerDedTipoNomina";
    table = "TipoNomina";
    nameCols = ["Clave", "Descripción", "Periodicidad"];
    campos = ["clave", "descripcion", "periodicidad.descripcion"];
    camposObtener = ["[]id", "[]clave", "[]descripcion"];
    camposMostrar = ["clave", "periodicidad.descripcion"];
    //camposMostrar = ["clave", "@periodicidad.descripcion,descripcion,clave"];
    preFilters = setPreFilters(preFilters = null);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de tipo de nomina", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre de tipo de nomina", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "Tipo Nomina";
    var tamSel = "size-2";

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamSel,
         typeof optionals === 'undefined' ? null : optionals
         );
}

function setEditRepPerDedTipoNominaShow(value) {
    clearEdit("editRepPerDedPeriodo");
    if (value === null) {
        enabledEdit('editRepPerDedPeriodo', false);
    } else {
        var obj = value[0];
        claveTipoNomina = obj.Clave;
        enabledEdit('editRepPerDedPeriodo', true);
    }
}

function setEditRepPerDedTipoNominaClear(value) {
    clearEdit("editRepPerDedPeriodo");
    $('#txtDeFecha').prop("disabled", false);
    $("#txtDeFecha").val("");
    $('#txtDeFecha').prop("disabled", true);

    $('#txtAFecha').prop("disabled", false);
    $("#txtAFecha").val("");
    $('#txtAFecha').prop("disabled", true);
}

function setEditRepPerDedPeriodo() {
    nameCmp = "editRepPerDedPeriodo";
    table = "PeriodosNomina";
    nameCols = "Clave,Descripción,Fecha inicial,Fecha final,Fecha cierre";
    campos = "clave,descripcion,Date:fechaInicial,Date:fechaFinal,Date:fechaCierre";
    var subEntities = "tipoNomina";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion,[]fechaInicial,[]fechaFinal";
    var preFilters = { "tipoNomina.id": getExtraValues("editRepPerDedTipoNomina")[0] };
    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de periodo", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción de periodo", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "Periodos Nomina";
    var tamañoSel = "size-4";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);

}

function setEditRepPerDedPeriodoShow(value) {
    if (value === null) {

    } else {
        var obj = value[0];
        document.getElementById("txtDeFecha").value = formatDate(new Date(obj.FechaInicial));
        document.getElementById("txtAFecha").value = formatDate(new Date(obj.FechaFinal));
    }
}

function setEditRepPerDedPeriodoClear() {
    $('#txtDeFecha').prop("disabled", false);
    $("#txtDeFecha").val("");
    $('#txtDeFecha').prop("disabled", true);

    $('#txtAFecha').prop("disabled", false);
    $("#txtAFecha").val("");
    $('#txtAFecha').prop("disabled", true);
}

function setEditRepPerDedCentroCostos() {
    nameCmp = "editRepPerDedCentroCostos";
    table = "CentroDeCosto";
    nameCols = "Clave,Descripción,Nombre abreviado, Registro patronal";
    campos = "clave,descripcion,descripcionPrevia,registroPatronal.nombreregtpatronal";
    var subEntities = "registroPatronal,razonesSociales";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion";

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };
    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de Centro de costos", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre de Centro de costos", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "centro de costo";
    var tamañoSel = "size-4";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditRepPerDedDelEmpleados() {
    nameCmp = "editRepPerDedDelEmpleados";
    table = "PlazasPorEmpleadosMov";
    nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.id,plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "[]plazasPorEmpleado.empleados.clave";

    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre"];

    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": getRazonSocial().id,
    };

    //Fechas en base al periodo
    if (document.getElementById("editRepPerDedPeriodo").getAttribute("value")) {


        var valDateFromFilter = document.getElementById("txtDeFecha").value;
        var fechaDeFilter = new Date(formantDdMmYyyy(valDateFromFilter));

        var valDateToFilter = document.getElementById("txtAFecha").value;
        var fechaAFilter = new Date(formantDdMmYyyy(valDateToFilter));

        preFilters["@BETWEEN:1"] = [
            "(( o.fechaInicial <= :PB1) OR ( o.fechaInicial BETWEEN :PB1 AND :PB2 ))",
            "PB1", fechaDeFilter, "PB2", fechaAFilter];

        preFilters["@BETWEEN:2"] = [
            "(( o.plazasPorEmpleado.fechaFinal >= :PB3  )  OR (o.plazasPorEmpleado.fechaFinal BETWEEN :PB4 AND :PB3))",
            "PB3", fechaAFilter, "PB4", fechaDeFilter];

    }

    //Centro de costo
    if (document.getElementById("editRepPerDedCentroCostos").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editRepPerDedCentroCostos").getAttribute("value");
    }

    //Tipo de nomina
    if (document.getElementById("editRepPerDedTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editRepPerDedTipoNomina").getAttribute("value");
    }

    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave del empleado", "tipo": "string", "campo": "plazasPorEmpleado.empleados.clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre del empleado", "tipo": "string", "campo": "plazasPorEmpleado.empleados.nombre", "medida": "m" };

    var optionals = new Object();

    //Group will be always acompanied of an order
    optionals["camposGroup"] = campos;
    optionals["camposOrden"] = ["plazasPorEmpleado.empleados.clave"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-6";

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
         typeof optionals === 'undefined' ? "" : optionals);
}

//function setEditRepPerDedDelEmpleadosShow(value) {
//    if (value != null) {
//        var obj = value[0];
//        //addDataEdit("editEnvMailDelEmpleados", "claveDelEmpleado", obj[1].clave);
//    }
//}

function setEditRepPerDedAlEmpleados() {
    nameCmp = "editRepPerDedAlEmpleados";
    table = "PlazasPorEmpleadosMov";
    nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.id,plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "[]plazasPorEmpleado.empleados.clave";

    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre"];

    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": getRazonSocial().id,
    };

    //Fechas en base al periodo
    if (document.getElementById("editRepPerDedPeriodo").getAttribute("value")) {
        var valDateFromFilter = document.getElementById("txtDeFecha").value;
        var fechaDeFilter = new Date(formantDdMmYyyy(valDateFromFilter));

        var valDateToFilter = document.getElementById("txtAFecha").value;
        var fechaAFilter = new Date(formantDdMmYyyy(valDateToFilter));

        preFilters["@BETWEEN:1"] = [
            "(( o.fechaInicial <= :PB1) OR ( o.fechaInicial BETWEEN :PB1 AND :PB2 ))",
            "PB1", fechaDeFilter, "PB2", fechaAFilter];

        preFilters["@BETWEEN:2"] = [
            "(( o.plazasPorEmpleado.fechaFinal >= :PB3  )  OR (o.plazasPorEmpleado.fechaFinal BETWEEN :PB4 AND :PB3))",
            "PB3", fechaAFilter, "PB4", fechaDeFilter];

    }

    //Centro de costo
    if (document.getElementById("editRepPerDedCentroCostos").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editRepPerDedCentroCostos").getAttribute("value");
    }

    //Tipo de nomina
    if (document.getElementById("editRepPerDedTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editRepPerDedTipoNomina").getAttribute("value");
    }

    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave del empleado", "tipo": "string", "campo": "plazasPorEmpleado.empleados.clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre del empleado", "tipo": "string", "campo": "plazasPorEmpleado.empleados.nombre", "medida": "m" };

    var optionals = new Object();
    //Group will be always acompanied of an Order
    optionals["camposGroup"] = campos;
    optionals["camposOrden"] = ["plazasPorEmpleado.empleados.clave"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-6";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
         typeof optionals === 'undefined' ? "" : optionals);

}

//function setEditRepPerDedAlEmpleadosShow(value) {
//    if (value != null) {
//        var obj = value[0];
//        // addDataEdit("editEnvMailAlEmpleados", "claveAlEmpleado", obj[1].clave);
//    }
//}

function genReportResPerDeduc() {
    callListener("G");
}

function callListener(mode) {
    if (preValidateBeforeConsult()) {
        var objCallerSender = {};

        //Dictionary
        filterRepResPerDedu = new Object();

        filterRepResPerDedu['claveRazonSocial'] = getRazonSocial().clave;

        if (document.getElementById("editRepPerDedTipoCorrida").getAttribute("value")) {
            var valueTipCorrida = getExtraValues("editRepPerDedTipoCorrida");
            if (valueTipCorrida != null) {
                if (valueTipCorrida[0] !== "") {
                    filterRepResPerDedu['claveTipoCorrida'] = valueTipCorrida[0];
                }
            }
        }

        if (document.getElementById("editRepPerDedTipoNomina").getAttribute("value")) {
            var valueTipoNomina = getExtraValues("editRepPerDedTipoNomina");
            if (valueTipoNomina != null) {
                if (valueTipoNomina[0] !== "") {
                    filterRepResPerDedu['claveTipoNomina'] = valueTipoNomina[1];
                }
            }
        }

        if (document.getElementById("editRepPerDedPeriodo").getAttribute("value")) {
            filterRepResPerDedu['idPeriodoNomina'] = document.getElementById("editRepPerDedPeriodo").getAttribute("value");
            var fechaIni = new Date(getExtraValues("editRepPerDedPeriodo")[2]);
            var fechaFin = new Date(getExtraValues("editRepPerDedPeriodo")[3]);

            filterRepResPerDedu['DescripcionPeriodo'] = "Resumen de Percepciones y Deducciones del " + formatDateddmmyyy(fechaIni) + " al " + formatDateddmmyyy(fechaFin);
        }

        if (document.getElementById("editRepPerDedCentroCostos").getAttribute("value")) {
            var valueCentroCostos = getExtraValues("editRepPerDedCentroCostos");
            if (valueCentroCostos != null) {
                if (valueCentroCostos[0] !== "") {
                    filterRepResPerDedu['claveCentroDeCostos'] = valueCentroCostos[0];
                }
            }
        }

        if (document.getElementById("editRepPerDedDelEmpleados").getAttribute("value")) {
            var valueDelEmpleado = getExtraValues("editRepPerDedDelEmpleados");
            if (valueDelEmpleado != null) {
                if (valueDelEmpleado[0] !== "") {
                    filterRepResPerDedu['claveDelEmpleado'] = valueDelEmpleado[0];
                }
            }
        }

        if (document.getElementById("editRepPerDedAlEmpleados").getAttribute("value")) {
            var valueAlEmpleado = getExtraValues("editRepPerDedAlEmpleados");
            if (valueAlEmpleado != null) {
                if (valueAlEmpleado[0] !== "") {
                    filterRepResPerDedu['claveAlEmpleado'] = valueAlEmpleado[0];
                }
            }
        }

        filterRepResPerDedu['withTotals'] = $('#chkRepPerDedTotales').is(":checked");

        filterRepResPerDedu['NombreEmpresa'] = getRazonSocial().nombreRazon;





        //Nombre de la empresa (NombreEmpresa)<<<<<<<
        //Domicilio empresa (DomicilioEmpresa)

        //"Resumen de Percepciones y Deducciones del 01/03/2020 al 15/03/2020"
        //Descripcion del periodo (DescripcionPeriodo)<<<<<<

        objCallerSender.filtros = filterRepResPerDedu;

        if (mode == "G") {
            makeActionRepResPerDeduc("G", objCallerSender);
        }
    }
}

function preValidateBeforeConsult() {
    var isValid = true;
    isValid = validateComponents(elementsReporteResPercepDeduc);
    return isValid;
}

function makeActionRepResPerDeduc(action, obj) {
    var succes = false;
    if (action === "G") {
        var url = route + "/api/ReportesController/getResumenPercepDeducc";
        var data = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, data, 2, false);
        if (Mensaje.error === "") {
            var result = Mensaje.resultado;
            if (result === null) {
                alert("No existen datos");
            } else {
                succes = downloadFile(result, "ReporteResPerDeduc", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                //succes = downloadFile(result, "ReporteResPerDeduc", "application/vnd.ms-excel");
            }
        } else {
            alert(Mensaje.error);
        }
    }
    return succes;
}

function downloadFile(strData, strFileName, strMimeType) {
    var D = document, A = arguments, a = D.createElement("a"),
         d = A[0], n = A[1], t = A[2];
    var newdata = "data:" + t + ";base64," + escape(strData);
    a.href = newdata;
    if ('download' in a) {
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function () {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
        );
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    };
}

