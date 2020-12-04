/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Brief: Clase estatica para las configuraciones de apariencia
 */

var route = "";
var getConfigApa = null;

jQuery(document).ready(function () {
    addListenersApa();
    initApa();
});


function addListenersApa() {

}

function initApa() {
    getActualApa();
}

function setTheme(e) {
    var typeTheme = e.value;
    changeTheme(typeTheme);
}

function changeTheme(typeTheme) {
    //$("#container").attr('class', "Default");
    var nameTheme = getTheme(typeTheme);
    //$("#container").attr('class', nameTheme);
    $("#previewAp").attr('class', nameTheme);
    //var nameContainerTheme = getTheme(typeTheme);
}

function getTheme(typeTheme) {
    var nameTheme = "";
    if (typeTheme === "0") {
        nameTheme = "Default";

    } else if (typeTheme === "1") {
        nameTheme = "DevEx";
    } else if (typeTheme === "2") {
        nameTheme = "Aqua";
    } else if (typeTheme === "3") {
        nameTheme = "BlackGlass";
    }
    return nameTheme;
}

function setIcon(e) {
    var typeIcon = e.value;
    changeIcon(typeIcon);
}

function changeIcon(typeIcon) {
    $("#previewAp .imgBoton").each(function () {
        var sourceImage = $(this).attr('src');
        var n = sourceImage.lastIndexOf('/');
        var result = sourceImage.substring(n + 1);
        var createSource = "img/Iconos/";
        if (typeIcon === "1") {
            createSource += "azul";
        } else if (typeIcon === "2") {
            createSource += "azul-verde";
        } else if (typeIcon === "3") {
            createSource += "cobalto";
        } else if (typeIcon === "4") {
            createSource += "colores";
        } else if (typeIcon === "5") {
            createSource += "fiesta";
        } else if (typeIcon === "6") {
            createSource += "fiesta 2";
        } else if (typeIcon === "7") {
            createSource += "fiesta 3";
        } else if (typeIcon === "8") {
            createSource += "infantil";
        } else if (typeIcon === "9") {
            createSource += "limon";
        } else if (typeIcon === "10") {
            createSource += "marron";
        } else if (typeIcon === "11") {
            createSource += "metro";
        } else if (typeIcon === "12") {
            createSource += "morado";
        } else if (typeIcon === "13") {
            createSource += "naranja";
        } else if (typeIcon === "14") {
            createSource += "negocios";
        } else if (typeIcon === "15") {
            createSource += "negocios 2";
        } else if (typeIcon === "16") {
            createSource += "retro";
        } else if (typeIcon === "17") {
            createSource += "sepia";
        } else if (typeIcon === "18") {
            createSource += "verde";
        }
        createSource += "/" + result;
        $(this).attr("src", createSource);
    });
}


function setControlApa() {


}



function getActualApa() {
    var dataget = getConfiguraApariencia();
    if (dataget === undefined) {
        console.log("Problems to select Configuración Apariencia");
    } else {
        if (dataget !== null) {
            mostrarObjetoApa(dataget);
        }
        getConfigApa = dataget.Apariencia;
    }
}


function getConfiguraApariencia() {
    var cnfApariencia = {};
    var url = route + "/api/Apariencia/getAparienciaActual";
    var objCnfAp = {};
    objCnfAp.razonSocial = getRazonSocial().id;
    var data = JSON.stringify(objCnfAp);
    var Mensaje = Common.sendRequestJson('POST', url, data, 2, false);
    if (Mensaje.resultado !== null) {
        var cnfApa = Mensaje.resultado;
        cnfApariencia.Apariencia = cnfApa.Apariencia;
        cnfApariencia.Usuario = cnfApa.Usuario;
        cnfApariencia.RazonesSociales = cnfApa.RazonesSociales;
    } else {
        console.log(Mensaje.error);
    }
    if (cnfApariencia === undefined) {
        var cnfApariencia = {};
    }
    return cnfApariencia;
}

function construirApa(obj) {
    var cnfApa = null;
    if (obj === undefined || obj === null) {
        cnfApa = {};
    } else {
        cnfApa = {};
        if (obj.id !== undefined) {
            cnfApa.id = obj.id;
            cnfApa.tema = obj.tema;
            cnfApa.iconos = obj.iconos;
        }
    }
    var ctrlApa = $("#cbxApaControl option:selected").val();
    cnfApa.controlApariencia = ctrlApa;

    if (ctrlApa === "1") {
        cnfApa.temaTransient = $("#cbxApTema option:selected").val();
        cnfApa.iconosTransient = $("#cbxApIconos option:selected").val();

    } else if (ctrlApa === "2") {
        cnfApa.temaTransient = $("#cbxApTema option:selected").val();
        cnfApa.iconosTransient = $("#cbxApIconos option:selected").val();

    } else if (ctrlApa === "3") {
        cnfApa.tema = $("#cbxApTema option:selected").val();
        cnfApa.iconos = $("#cbxApIconos option:selected").val();
    }

    cnfApa.permiteUsuarioTema = $('#chkUsPermitirTema').is(":checked");
    cnfApa.permiteUsuarioIconos = $('#chkUsPermitirIconos').is(":checked");
    return cnfApa;
}

function mostrarObjetoApa(obj) {
    var obj = obj;
    if (obj.Apariencia === undefined) {
        //limpiarComponentesConfigIMSS();
    } else {
        var ctrlApariencia = obj.Apariencia.controlApariencia;
        $("#cbxApaControl").val(ctrlApariencia);
        ////1 Usuario 2 empresa 3 Sistema
        var tema;
        var iconos;
        if (ctrlApariencia === 1) {
            var cnfApUsuario = JSON.parse(obj.Usuario);
            tema = cnfApUsuario.tema.toString();
            iconos = cnfApUsuario.iconos.toString();
            $("#cbxApTema").val(tema);
            $("#cbxApIconos").val(iconos);
        } else if (ctrlApariencia === 2) {
            var cnfApRazonSocial = JSON.parse(obj.RazonesSociales);
            tema = cnfApRazonSocial.tema.toString();
            iconos = cnfApRazonSocial.iconos.toString();
            $("#cbxApTema").val(tema);
            $("#cbxApIconos").val(iconos);
        } else if (ctrlApariencia === 3) {
            tema = obj.Apariencia.tema.toString();
            iconos = obj.Apariencia.iconos.toString();
            $("#cbxApTema").val(tema);
            $("#cbxApIconos").val(iconos);
        }
        $('#chkUsPermitirTema').prop('checked', obj.permiteUsuarioTema);
        $('#chkUsPermitirIconos').prop('checked', obj.permiteUsuarioIconos);
        changeTheme(tema);
        changeIcon(iconos);
    }
}

function makeActionCnfApa(action, obj) {
    var succes = false;
    var objApar = {};
    objApar.entity = construirApa(obj);
    objApar.razonSocial = getRazonSocial().id;
    if (action === "M") {
        var url = route + "/api/Apariencia/modificar";
        var data = JSON.stringify(objApar);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado !== null) {
            var result = Mensaje.resultado;
            if (result) {
                var configAp = [objApar.entity.tema, objApar.entity.iconos];
                sessionStorage.setItem('apariencia', configAp);
                setConfigIconTheme();
                succes = true;
            }
            else {
                alert(Mensaje.error);
            }
        }
    }
    return succes;
}

function preValidateBeforeSaveConfigApa() {
    //var goConfigApa = true;
    //goConfigApa = validateComponents(elementsConfigApa);
    //return goConfigApa;
    return true;
}

function saveApariencia() {
    if (preValidateBeforeSaveConfigApa()) {
        var succes = false;
        succes = makeActionCnfApa("M", getConfigApa);
        if (succes) {
            alert("Configuración de Apariencia guardada");
            limpiarComponentesConfigApa();
            location.reload();

        }
    }
}

function cancelApariencia() {
    getActualApa();
}

/*Default Functions*/
function limpiarComponentesConfigApa() {


}