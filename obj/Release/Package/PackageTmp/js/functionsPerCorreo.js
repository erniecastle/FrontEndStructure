/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */


var route = "";
var getPerEmail = null;
var editorPerText = null;
var elements = new Array("cbxPerMailTipoArchivo", "txtPerMailAsunto", "txtPerMailTexto");


jQuery(document).ready(function () {
    initPerMail();
    addListenersPerMail();
});


function initPerMail() {
    editorPerText = new nicEditor({ fullPanel: true }).panelInstance('txtPerMailTexto');
}

function addListenersPerMail() {
    new nicEditor({ fullPanel: true }).panelInstance('txtPerMailTexto');
}

function setTypeFilePer(e) {
    var valTypeFilePer = e.value;
    if (valTypeFilePer === "") {
         limpiarComponentesPerMail();
    } else {
        getActualConfigPer("select");
    }
}

function getActualConfigPer(mode) {
    var dataget = getPerCorreo();
    if (dataget === undefined) {
        console.log("Problems to select personalized mail");
    } else {
        if (dataget === null) {
            alert("No existe una personalización para este tipo de archivo");
        }
        mostrarObjetoPerMail(dataget);
        getPerEmail = dataget;
        //changeModeButtons("M");
    }
}

function getPerCorreo() {
    var perCorreo = null;
    var url = route + "/api/PersonalizacionCorreo/getPersonalizacionCorreo";
    var data = new Object();
    data['idRazonSocial'] = getRazonSocial().id;
    data['tipoArchivo'] = $('#cbxPerMailTipoArchivo option:selected').val();
    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {
        perCorreo = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }
    if (perCorreo === undefined) {
        var perCorreo = {};
    }
    return perCorreo;
}

function construirPerMail(obj) {
    var perCorreo = null;
    if (obj === undefined || obj === null) {
        perCorreo = {};
    } else {
        perCorreo = {};
        if (obj[0].id !== undefined) {
            perCorreo.id = obj[0].id;
        }
    }

    var cbxTypeFile = document.getElementById("cbxPerMailTipoArchivo");
    var valMailTypeFile = cbxTypeFile.options[cbxTypeFile.selectedIndex].value;
    if (valMailTypeFile !== undefined) {
        perCorreo.tipoArchivo = valMailTypeFile;
    }

    perCorreo.asunto = document.getElementById("txtPerMailAsunto").value;
    var content = editorPerText.instanceById('txtPerMailTexto').getContent();
    perCorreo.texto = content;

    return perCorreo;
}

function mostrarObjetoPerMail(obj) {
    var obj = obj == null ? undefined : obj[0];
    if (obj === undefined) {
        limpiarComponentesPerMail();
    } else {
        $("#cbxPerMailTipoArchivo").val(obj.tipoArchivo.toString());
        document.getElementById("txtPerMailAsunto").value = obj.asunto;
        editorPerText.instanceById('txtPerMailTexto').setContent(obj.texto);
    }
}

function makeActionEmp(action, obj) {
    var succes = false;
    var objPerMail = {};
    objPerMail.dataPerMail = construirPerMail(obj);
    objPerMail.idRazonSocial = getRazonSocial().id;
    if (action === "M") {
        var url = route + "/api/PersonalizacionCorreo/modificar";
        var data = JSON.stringify(objPerMail);
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
    }
    return succes;
}

function preValidateBeforeSavePerMail() {
    var goPerMail = true;
    goPerMail = validateComponents(elements);
    return goPerMail;
}


function savePerMail() {
    if (preValidateBeforeSavePerMail()) {
        var succes = false;
        succes = makeActionEmp("M", getPerEmail);
        if (succes) {
            alert("Configuración de personalización de mail guardada");
            limpiarComponentesPerMail();
            getActualConfigPer();
        }
    }
}

function cancelPerMail() {
    $("#cbxPerMailTipoArchivo option:first").prop('selected', 'selected');
    limpiarComponentesPerMail();
}

/*Default Functions*/
function limpiarComponentesPerMail() {
    document.getElementById("txtPerMailAsunto").value = "";
    editorPerText.instanceById('txtPerMailTexto').setContent("");
    //document.getElementById("txtPerMailTexto").value = "";
}