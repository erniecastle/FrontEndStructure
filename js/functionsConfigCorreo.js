/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */

var route = "";
var getConfigEmail = null;
var editorText = null;
var elements = new Array("txtMailSMTP", "txtMailPuerto", "txtMailUsuario", "txtMailPass",
      "cbxSSL", "txtMailRemitente", "txtMailPrueba", "txtMailTexto");


jQuery(document).ready(function () {
    initConfigMail();
    addListenersConfigMail();
});


function initConfigMail() {
    editorText = new nicEditor({ fullPanel: true }).panelInstance('txtMailTexto');
    getActualConfig();
}

function addListenersConfigMail() {

}

function getActualConfig() {
    var dataget = getConfigCorreo();
    if (dataget === undefined) {
        console.log("Problems to select Config mail");
    } else {
        if (dataget !== null) {
            mostrarObjetoConfigMail(dataget);
        }
        getConfigEmail = dataget;
    }
}

function getConfigCorreo() {
    var cnfCorreo = null;
    var url = route + "/api/ConfiguracionCorreo/getConfiguracionCorreo";
    var data = new Object();
    data['idRazonSocial'] = getRazonSocial().id;
    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {
        cnfCorreo = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }
    if (cnfCorreo === undefined) {
        var cnfCorreo = {};
    }
    return cnfCorreo;
}

function construirConfigMail(obj) {
    var cnfCorreo = null;
    if (obj === undefined || obj === null) {
        cnfCorreo = {};
    } else {
        cnfCorreo = {};
        if (obj[0].id !== undefined) {
            cnfCorreo.id = obj[0].id;
        }
    }

    cnfCorreo.SMTP = document.getElementById("txtMailSMTP").value;
    var portConfig = parseInt(document.getElementById("txtMailPuerto").value)
    cnfCorreo.puerto = portConfig;
    cnfCorreo.usuario = document.getElementById("txtMailUsuario").value;
    cnfCorreo.password = document.getElementById("txtMailPass").value;
    var cbxSSL = document.getElementById("cbxSSL");
    var valMailSSL = cbxSSL.options[cbxSSL.selectedIndex].value;
    if (valMailSSL !== undefined) {
        cnfCorreo.SSL = valMailSSL;
    }
    cnfCorreo.correoRemitente = document.getElementById("txtMailRemitente").value;
    cnfCorreo.correoPrueba = document.getElementById("txtMailPrueba").value;

    var content = editorText.instanceById('txtMailTexto').getContent();
    cnfCorreo.texto = content;
    cnfCorreo.razonesSociales_ID = getRazonSocial().id;
    return cnfCorreo;
}

function mostrarObjetoConfigMail(obj) {
    var obj = obj[0];
    if (obj === undefined) {
        limpiarComponentesConfigMail();
    } else {
        document.getElementById("txtMailSMTP").value = obj.SMTP;
        document.getElementById("txtMailPuerto").value = obj.puerto;
        document.getElementById("txtMailUsuario").value = obj.usuario;
        document.getElementById("txtMailPass").value = obj.password;
        $("#cbxSSL").val(obj.SSL.toString());
        document.getElementById("txtMailRemitente").value = obj.correoRemitente;
        document.getElementById("txtMailPrueba").value = obj.correoPrueba;
        editorText.instanceById('txtMailTexto').setContent(obj.texto);
        //document.getElementById("txtMailTexto").value = obj.texto;
    }
}

function makeActionEmp(action, obj) {
    var succes = false;
    var objCnfMail = {};
    objCnfMail = construirConfigMail(obj);
    if (action === "M") {
        var url = route + "/api/ConfiguracionCorreo/modificar";
        var data = JSON.stringify(objCnfMail);
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
    } else if (action === "Send") {
        var url = route + "/api/ConfiguracionCorreo/probarCorreo";
        var data = JSON.stringify(objCnfMail);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.noError === null) {
            alert(Mensaje.error);
        } else {
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

function preValidateBeforeSaveConfigMail() {
    var goConfigMail = true;
    goConfigMail = validateComponents(elements);
    return goConfigMail;
}

function saveConfigMail() {
    if (preValidateBeforeSaveConfigMail()) {
        var succes = false;
        succes = makeActionEmp("M", getConfigEmail);
        if (succes) {
            alert("Configuración de mail guardada");
            limpiarComponentesConfigMail();
            getActualConfig();
        }
    }
}

function cancelConfigMail() {
    limpiarComponentesConfigMail();
}

function testEmail() {
    if (preValidateBeforeSaveConfigMail()) {
        var succes = false;
        succes = makeActionEmp("Send", getConfigEmail);
        if (succes) {
            alert("Envío de correo enviado");
        }
    }
}

/*Default Functions*/
function limpiarComponentesConfigMail() {
    document.getElementById("txtMailSMTP").value = "";
    document.getElementById("txtMailPuerto").value = "";
    document.getElementById("txtMailUsuario").value = "";
    document.getElementById("txtMailPass").value = "";
    $("#cbxSSL option:first").prop('selected', 'selected');
    document.getElementById("txtMailRemitente").value = "";
    document.getElementById("txtMailPrueba").value = "";
    document.getElementById("txtMailTexto").value = "";
}