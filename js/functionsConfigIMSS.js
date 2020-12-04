/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */

var route = "";
var getConfigIMSS = null;
var tipoCapturaIMSS = null;
var elementsConfigEmple = new Array("txtConfigIMSSFechaAplica", "txtConfigIMSSPrestamosEspecie", "txtConfigIMSSExcPresEspecie", "txtConfigIMSSInvalidezYVida", "txtConfigIMSSPrestEnDinero",
     "txtConfigIMSSCensatiaVejez", "txtConfigIMSSGastosPensio", "txtConfigIMSSEnfMat", "txtConfigIMSSInvaYVida", "txtConfigIMSSRtGuarderia", "txtConfigIMSSRetiro", "txtConfigIMSSCensatiaVejez", "txtConfigIMSSInfonavit");


jQuery(document).ready(function () {
    initConfigIMSS();
    //var obj = JSON.parse($("#container").data("opener"));
    //tipoCapturaIMSS = obj.config;
});

function initConfigIMSS() {
    var actualDate = new Date(getFechaSistema());
    document.getElementById("txtConfigIMSSFechaAplica").value = formatDate(actualDate);
    getActualConfigIMSS();
}

function addListenersConfigIMSS() {

}

function setDateIMSS(e) {

    var dateFechaCmp = e.target.value;
    var configExiIMSS = getexisteConfiguraIMSS(dateFechaCmp);
    if (configExiIMSS === undefined) {
        console.log("Problems to select Configuración IMSS");
    } else {
        if (configExiIMSS === null) {
            limpiarComponentesConfigIMSS(true);
            alert("No existe una configuración de Configuración IMSS en esta fecha");
        } else {
            mostrarObjetoConfigIMSS(configExiIMSS);
            changeModeButtons("M");
        }
    }
}

function getPorIdConfiguracionIMSS(valId) {
    var cnfExisteConfigIMSS = null;
    var url = route + "/api/ConfiguracionIMSS/getPorIdConfiguracionIMSS";
    var data = new Object();
    data['id'] = valId;
    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {
        cnfExisteConfigIMSS = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }
    if (cnfExisteConfigIMSS === undefined) {
        var cnfExisteConfigIMSS = {};
    }
    return cnfExisteConfigIMSS;
}


function getexisteConfiguraIMSS(valDate) {
    var cnfExisteConfigIMSS = null;
    var url = route + "/api/ConfiguracionIMSS/exiteConfiguracionIMSS";
    var data = new Object();
    data['fechaAplica'] = valDate;
    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado === null) {
        getConfigIMSS = null;
    } else if (Mensaje.resultado !== null) {
        getConfigIMSS = Mensaje.resultado;
        cnfExisteConfigIMSS = getConfigIMSS;
    } else {
        console.log(Mensaje.error);
    }

    return cnfExisteConfigIMSS;
}


function getActualConfigIMSS() {
    var dataget = getConfiguraIMSS();
    if (dataget === undefined) {
        console.log("Problems to select Configuración IMSS");
    } else {
        if (dataget !== null) {
            mostrarObjetoConfigIMSS(dataget);
        }
        getConfigIMSS = dataget;
    }
}

function getConfiguraIMSS() {
    var cnfConfigIMSS = null;
    var url = route + "/api/ConfiguracionIMSS/getUltimaConfiguracionIMSS";
    var data = new Object();
    data['fechaAplica'] = document.getElementById("txtConfigIMSSFechaAplica").value;
    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, 2, false);
    if (Mensaje.resultado !== null) {
        cnfConfigIMSS = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }
    if (cnfConfigIMSS === undefined) {
        var cnfConfigIMSS = {};
    }
    return cnfConfigIMSS;
}

function construirConfigIMSS(obj) {
    var cnfIMSS = null;
    if (obj === undefined || obj === null) {
        cnfIMSS = {};
    } else {
        cnfIMSS = {};
        if (obj.id !== undefined) {
            cnfIMSS.id = obj.id;
        }
    }
    cnfIMSS.fechaAplica = document.getElementById("txtConfigIMSSFechaAplica").value;
    /*Empleado*/
    cnfIMSS.tasaEspecieEnfermeMater = document.getElementById("txtConfigIMSSPrestamosEspecie").value;
    cnfIMSS.excedenteEspecie = document.getElementById("txtConfigIMSSExcPresEspecie").value;
    cnfIMSS.tasaInvalidezVida = document.getElementById("txtConfigIMSSInvalidezYVida").value;
    cnfIMSS.tasaDineEnfermeMater = document.getElementById("txtConfigIMSSPrestEnDinero").value;
    cnfIMSS.tasaCesantiaVejez = document.getElementById("txtConfigIMSSCensatiaVejez").value;
    cnfIMSS.tasaGastosPension = document.getElementById("txtConfigIMSSGastosPensio").value;

    /*Patron*/
    cnfIMSS.tasaFijaPatron = 0;
    cnfIMSS.tasaExcedentePatron = 0;
    cnfIMSS.tasaGastosPensPatron = 0;
    cnfIMSS.tasaInvaliVidaPatron = 0;
    cnfIMSS.tasaPrestDinePatron = 0;
    cnfIMSS.tasaCesanVejezPatron = 0;

    /*Tope*/
    cnfIMSS.topeEnfermedadMaternidad = document.getElementById("txtConfigIMSSEnfMat").value;
    cnfIMSS.topeInvaliVida = document.getElementById("txtConfigIMSSInvaYVida").value;
    cnfIMSS.topeRiesgoTrabajoGuarderias = document.getElementById("txtConfigIMSSRtGuarderia").value;
    cnfIMSS.topeRetiro = document.getElementById("txtConfigIMSSRetiro").value;
    cnfIMSS.topeCesanVejez = document.getElementById("txtConfigIMSSTopeCensatiaVejez").value;
    cnfIMSS.topeInfonavit = document.getElementById("txtConfigIMSSInfonavit").value;

    return cnfIMSS;
}

function mostrarObjetoConfigIMSS(obj) {
    var obj = obj;
    if (obj === undefined) {
        limpiarComponentesConfigIMSS();
    } else {
        document.getElementById("txtConfigIMSSFechaAplica").value = formatDate(new Date(obj.fechaAplica));
        /*Empleado*/
        document.getElementById("txtConfigIMSSPrestamosEspecie").value = obj.tasaEspecieEnfermeMater;
        document.getElementById("txtConfigIMSSExcPresEspecie").value = obj.excedenteEspecie;
        document.getElementById("txtConfigIMSSInvalidezYVida").value = obj.tasaInvalidezVida;
        document.getElementById("txtConfigIMSSPrestEnDinero").value = obj.tasaDineEnfermeMater;
        document.getElementById("txtConfigIMSSCensatiaVejez").value = obj.tasaCesantiaVejez;
        document.getElementById("txtConfigIMSSGastosPensio").value = obj.tasaGastosPension;

        /*Patron*/
        /* document.getElementById("").value = obj.tasaFijaPatron;
         document.getElementById("").value = obj.tasaExcedentePatron;
         document.getElementById("").value = obj.tasaGastosPensPatron;
         document.getElementById("").value = obj.tasaInvaliVidaPatron;
         document.getElementById("").value = obj.tasaPrestDinePatron;
         document.getElementById("").value = obj.tasaCesanVejezPatron;*/

        /*Tope*/
        document.getElementById("txtConfigIMSSEnfMat").value = obj.topeEnfermedadMaternidad;
        document.getElementById("txtConfigIMSSInvaYVida").value = obj.topeInvaliVida;
        document.getElementById("txtConfigIMSSRtGuarderia").value = obj.topeRiesgoTrabajoGuarderias;
        document.getElementById("txtConfigIMSSRetiro").value = obj.topeRetiro;
        document.getElementById("txtConfigIMSSTopeCensatiaVejez").value = obj.topeCesanVejez;
        document.getElementById("txtConfigIMSSInfonavit").value = obj.topeInfonavit;
    }
}

function makeActionCnfIMSS(action, obj) {
    var succes = false;
    var objCnfIMSS = {};
    objCnfIMSS = construirConfigIMSS(obj);
    if (action === "M") {
        var url = route + "/api/ConfiguracionIMSS/modificar";
        var data = JSON.stringify(objCnfIMSS);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado !== null) {
            var result = Mensaje.resultado;
            if (result) {
                succes = true;
            }
            else {
                alert(Mensaje.error);
            }
        }
    } else if (action === "E") {
        var url = route + "/api/ConfiguracionIMSS/eliminar";
        var objCnfIMSS = {};
        objCnfIMSS = construirConfigIMSS(obj);
        var data = JSON.stringify(objCnfIMSS);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado === null) {
            alert(Mensaje.error);
        } else {
            var result = Mensaje.resultado;
            if (result) {
                succes = true;
            }
        }
    }
    return succes;
}

function preValidateBeforeSaveConfigIMSS() {
    var goConfigIMSS = true;
    goConfigIMSS = validateComponents(elementsConfigEmple);
    return goConfigIMSS;
}

function saveConfigIMSS() {
    if (preValidateBeforeSaveConfigIMSS()) {
        var succes = false;
        succes = makeActionCnfIMSS("M", getConfigIMSS);
        if (succes) {
            alert("Configuración de IMSS guardada");
            limpiarComponentesConfigIMSS();
            //getActualConfigIMSS();
        }
    }
}

function updateConfigIMSS() {
    var succes = false;
    if (preValidateBeforeSaveConfigIMSS()) {
        succes = makeActionCnfIMSS("M", getConfigIMSS);
        if (succes) {
            limpiarComponentesConfigIMSS();
            changeModeButtons("U");
            //generateValueEmpleado();
        }
    }
}

function deleteConfigIMSS() {
    var succes = false;
    var msg = confirm("¿Deseas realmente eliminar esta configuración de IMSS?");
    if (msg == true) {
        succes = makeActionCnfIMSS("E", getConfigIMSS);
        if (succes) {
            limpiarComponentesConfigIMSS();
            changeModeButtons("E");
            //generateValueEmpleado();
        }
    }

}

function cancelConfigIMSS() {
    limpiarComponentesConfigIMSS();
    changeModeButtons("U");
}


function changeModeButtons(type) {
    if (type === "M") {
        document.getElementById("btnActualizar").style.display = "inline";
        document.getElementById("btnEliminar").style.display = "inline";
        document.getElementById("btnBuscar").style.display = "inline";
        document.getElementById("btnCancelar").style.display = "inline";
        document.getElementById("btnGuardar").style.display = "inline";
        //  if (!isPrm) {
        document.getElementById("btnGuardar").style.display = "none";
        //  }
    }
    else if (type === "C" || type === "E" || type === "U") {
        document.getElementById("btnActualizar").style.display = "none";
        document.getElementById("btnEliminar").style.display = "none";
        document.getElementById("btnBuscar").style.display = "inline";
        document.getElementById("btnCancelar").style.display = "inline";
        if (type === "C") {
            document.getElementById("btnGuardar").style.display = "none";
        } else {
            document.getElementById("btnGuardar").style.display = "inline";
        }
    }
}


/*Default Functions*/
function limpiarComponentesConfigIMSS(notClearDate) {

    //var actualDate = new Date(getFechaSistema());
    //document.getElementById("txtConfigIMSSFechaAplica").value = formatDate(actualDate);

    if (notClearDate === undefined) {
        $('#' + 'txtConfigIMSSFechaAplica').val('');
    }

    /*Empleado*/
    document.getElementById("txtConfigIMSSPrestamosEspecie").value = "";
    document.getElementById("txtConfigIMSSExcPresEspecie").value = "";
    document.getElementById("txtConfigIMSSInvalidezYVida").value = "";
    document.getElementById("txtConfigIMSSPrestEnDinero").value = "";
    document.getElementById("txtConfigIMSSCensatiaVejez").value = "";
    document.getElementById("txtConfigIMSSGastosPensio").value = "";

    /*Patron*/
    /* document.getElementById("").value = obj.tasaFijaPatron;
     document.getElementById("").value = obj.tasaExcedentePatron;
     document.getElementById("").value = obj.tasaGastosPensPatron;
     document.getElementById("").value = obj.tasaInvaliVidaPatron;
     document.getElementById("").value = obj.tasaPrestDinePatron;
     document.getElementById("").value = obj.tasaCesanVejezPatron;*/

    /*Tope*/
    document.getElementById("txtConfigIMSSEnfMat").value = "";
    document.getElementById("txtConfigIMSSInvaYVida").value = "";
    document.getElementById("txtConfigIMSSRtGuarderia").value = "";
    document.getElementById("txtConfigIMSSRetiro").value = "";
    document.getElementById("txtConfigIMSSTopeCensatiaVejez").value = "";
    document.getElementById("txtConfigIMSSInfonavit").value = "";
}

/*Table selector*/
function selectorConfigIMSS() {
    //Parameters
    nameCmp = "selectorCnfIMSS";
    title = "Configuración IMSS";
    table = "ConfiguracionIMSS";
    nameCols = "Fecha aplica";
    campos = "Date:fechaAplica";

    return buildTableSearch(nameCmp, title, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch);
}

function selectorConfigIMSSShow(idVal) {
    var dataget = getPorIdConfiguracionIMSS(idVal[0]);
    if (dataget === undefined) {
        console.log("Problems to select Config IMSS");
    } else {
        mostrarObjetoConfigIMSS(dataget);
        getConfigIMSS = dataget;
        changeModeButtons("M");
    }
}

/*Other validate Functions*/
function isNumberKey(e, elem) {
    return e.charCode === 0 || ((e.charCode >= 48 && e.charCode <= 57) || (e.charCode == 46 && document.getElementById(elem.id).value.indexOf('.') < 0));
}