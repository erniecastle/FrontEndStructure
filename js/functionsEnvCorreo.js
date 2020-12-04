/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */

var claveTipoNomina = "";
var idRegPtronal = null;
var dataEnvEmpleados = null;
var typesTipCorr = null;
//NEW
var start = 0;
var end = 2;

//PARAMETER
/*Parameters: By Razones Sociales = 0, Registro patronales = 1 Tipo de Nomina = 2*/
var obtenerSeriePor = 1;


var elementsEnvioCorreo = new Array("cbxEnvMailTipoCorrida", "editEnvMailTipoNom", "editEnvMailPeriodo");


jQuery(document).ready(function () {
    initEnvMail();
    addListenersEnvMail();
    InitDefault();
    //validacionesParametrosEnvMail();
    // alert(" Height: " + $(document).height() + " Width: " + $(document).width());
    // document.getElementById("container").style.maxWidth = "50%";
});

function InitDefault() {
    // $("#cbxEnvMailTipoArchivo").val('3');
    // setEditObject("editEnvMailSerie", "0001");
    //setEditObject("editEnvMailTipoNom", "0005");
    //setEditObject("editEnvMailPeriodo", "009");
    ////setEditObject("editEnvMailCentroCostos", "001");
    //setEditObject("editEnvMailDelEmpleados", "1");
    //setEditObject("editEnvMailAlEmpleados", "2");
}

function initEnvMail() {
    fillTypesFiles();
    fillStatus();
    fillTiposCorridas();
    enabledEdit('editEnvMailPeriodo', false);
    OpenTable(document.getElementById('tblFiltroEmpleados'));
    InitEventsTable();
}

//Get Parameters configs
function validacionesParametrosEnvMail() {
    if (obtenerSeriePor === 0) {
        var url = route + "/api/RazonesSociales/getSeriePorRazonesSociales";
        var data = getRazonSocial().clave;
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.error === "") {
            var result = Mensaje.resultado;
            if (result) {
                if (result.serie == null) {

                } else {
                    //setEditObject("editEnvMailSerie", result.serie);
                }
            }
            else {
                alert(Mensaje.error);
            }
        }

    }
    else if (obtenerSeriePor === 1) {
        var url = route + "/api/RegistroPatronal/getSeriePorRegistroPatronal";
        var data = getRazonSocial().clave;
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.error === "") {
            var result = Mensaje.resultado;
            if (result) {
                if (result.length > 1) {
                    $('#divRegistroPatronal').empty();
                    removeListenersEdit();
                    startCustomTools();
                    $('#divRegistroPatronal').append(createEditRegPatronal());
                } else {
                    var valueSerie = result[0]["serie"];
                    var valueReg = result[0]["id"];
                    if (valueReg == null || valueReg === "") {
                        idRegPtronal = null;
                    } else {
                        idRegPtronal = valueReg;
                    }
                    if (valueSerie == null || valueSerie === "") {

                    } else {
                        // setEditObject("editEnvMailSerie", valueSerie);
                    }
                }

            }
            else {
                alert(Mensaje.error);
            }
        }

    }
    else if (obtenerSeriePor === 2) {
    }
}

function addFileToData(data) {
    var getTypeFileSel = $('#cbxEnvMailTipoArchivo option:selected').val();
    for (var i = 0; i < data.length; i++) {
        if (getTypeFileSel === "4") {
            var generalSelector = document.getElementById("selectorFile");
            if (generalSelector) {
                data[i]["documento"] = generalSelector.getAttribute("namefile");
                data[i]["archivo"] = generalSelector.getAttribute("value");
                data[i]["seleccionado"] = true;
            }
        }
        else {
            if (data[i]["statusCorreo"] === 0) {
                data[i]["statusCorreo"] = "No enviado";
            } else {
                data[i]["statusCorreo"] = "Enviado";
            }
        }
    }
    return data;
}

function addListenersEnvMail() {
    $(".inputFile").on('change', function (e) {
        var fileName = e.target.files[0].name.toString();
        var labelMainFile = e.target.parentNode;
        var extension = e.target.files[0].type;
        var spanFile = labelMainFile.querySelector('.file-custom');
        var textFileLink = spanFile.querySelector('.file-watch');
        if (fileName.length > 15) {
            var subCutNameFile = fileName.substring(0, 15);
            textFileLink.text = subCutNameFile.concat("...");
        } else {
            textFileLink.text = fileName;
        }
        var valFile = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(valFile);
        reader.onload = function () {
            var getFile = reader.result;
            labelMainFile.setAttribute("nameFile", fileName);
            labelMainFile.setAttribute("value", /base64,(.+)/.exec(getFile)[1]);
            textFileLink.href = "data:" + extension + ";base64," + labelMainFile.getAttribute("value");
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    });
}

function fillTiposCorridas() {
    var cbxMailTipCorr = document.getElementById('cbxEnvMailTipoCorrida');
    cbxMailTipCorr.appendChild(new Option("", ""));
    var url = route + "/api/TipoCorrida/getAllTipoCorrida";
    var Mensaje = Common.sendRequestJson('POST', url, null, undefined, false, null);
    if (Mensaje.resultado !== null) {
        typesTipCorr = Mensaje.resultado;

        typesTipCorr.forEach(function (val, index) {
            var opt = document.createElement('option');
            opt.innerHTML = val['clave'] + " " + val['descripcion'];
            opt.value = val['id'];
            cbxMailTipCorr.appendChild(opt);
        });
    }
}

function fillTypesFiles() {
    var cbxTipoArchivo = document.getElementById('cbxEnvMailTipoArchivo');
    cbxTipoArchivo.appendChild(new Option("", ""));
    cbxTipoArchivo.appendChild(new Option("Comprobante de nómina", "1"));
    cbxTipoArchivo.appendChild(new Option("Solo XML", "2"));
    cbxTipoArchivo.appendChild(new Option("Solo PDF", "3"));
    cbxTipoArchivo.appendChild(new Option("Otro", "4"));
    cbxTipoArchivo.appendChild(new Option("Acuse de cancelación", "5"));
}

function fillStatus() {
    var cbxTipoArchivo = document.getElementById('cbxEnvMailStatus');
    cbxTipoArchivo.appendChild(new Option("", ""));
    cbxTipoArchivo.appendChild(new Option("Todos", "1"));
    cbxTipoArchivo.appendChild(new Option("Pendientes de enviar", "0"));
}

function setTypeFile(e) {
    var valTypeFile = e.value;
    var cbxMailTipCorr = document.getElementById('cbxEnvMailTipoCorrida');
    $('#cbxEnvMailTipoCorrida option').remove();

    if (valTypeFile === "4") {
        $('#divTipNomOr').empty();
        $('#divTipNomOr').append(createEditTipNom());
        $('#divTipoNom').empty();
        removeListenersEdit();
        startCustomTools();
        OpenTable(document.getElementById('tblFiltroEmpleados'));
        InitEventsTable();
        document.getElementById("rowSerie").style.display = "none";
        document.getElementById("rowFile").style.display = "flex";
        document.getElementById("rowStatus").style.display = "none";
        cbxMailTipCorr.appendChild(new Option("Todas", "Todas"));
        clearEdit("editEnvMailSerie");

    } else {
        fillTiposCorridas();
        $('#divTipoNom').empty();
        $('#divTipoNom').append(createEditTipNom());
        $('#divTipNomOr').empty();
        removeListenersEdit();
        startCustomTools();
        OpenTable(document.getElementById('tblFiltroEmpleados'));
        InitEventsTable();
        document.getElementById("rowSerie").style.display = "flex";
        document.getElementById("rowFile").style.display = "none";
        document.getElementById("rowStatus").style.display = "flex";
    }

    clearTable('tblFiltroEmpleados');
    validacionesParametrosEnvMail();
}

function createEditTipNom() {
    var divRow = document.createElement("DIV");
    divRow.id = "rowEnvMailTipoNomina";
    divRow.className = "mainPanelRow";
    divRow.style.width = "100%";

    var divColEdit = document.createElement("DIV");
    divColEdit.id = "";
    divColEdit.className = "mainPanelCol borderCol col-12";
    divColEdit.style.visibility = 'visible';
    //divColEdit.style.width = "400px";

    var divGroupEdit = document.createElement("DIV");
    divGroupEdit.id = "";
    divGroupEdit.className = "mainPanelDivGroup";
    divGroupEdit.style.maxWidth = "100%";

    var labelEdit = document.createElement("LABEL");
    labelEdit.id = "lblTipoNomina";
    labelEdit.className = "mainPanelContentComponents";
    labelEdit.style.width = "100%";
    labelEdit.setAttribute("idetiqueta", "TipoNomina");
    labelEdit.innerHTML = "Tipo de nomina";

    var divEditContainer = document.createElement("DIV");
    divEditContainer.className = "editContainer";
    var divEdit = document.createElement("DIV");
    divEdit.id = "editEnvMailTipoNom";
    divEdit.className = "edit medium-large";
    divEdit.setAttribute("dataedit", "editEnvMailTipoNom");
    divEdit.setAttribute("functedit", "setEditEnvMailTipoNom");
    var inputEditKey = document.createElement("INPUT");
    inputEditKey.id = "txtEditMailTipoNom";
    inputEditKey.className = "editKey medium";
    inputEditKey.setAttribute("kind", "filterKey");
    inputEditKey.setAttribute("type", "text");
    var inputEditBrief = document.createElement("INPUT");
    inputEditBrief.id = "txtEditMailTipoNom";
    inputEditBrief.className = "editBrief large";
    inputEditBrief.setAttribute("type", "text");
    inputEditBrief.disabled = true;
    var inputEditBtn = document.createElement("BUTTON");
    inputEditBtn.id = "txtEditMailTipoNom";
    inputEditBtn.className = "editButton small";
    inputEditBtn.setAttribute("onclick", "OpenEditModal(this)");
    var imgCan = document.createElement("img");
    imgCan.className = "imgBoton";
    imgCan.src = "img/Iconos/puntos.png";
    imgCan.src = changeIconByCmp(imgCan.src);
    inputEditBtn.appendChild(imgCan);
    divEdit.appendChild(inputEditKey);
    divEdit.appendChild(inputEditBrief);
    divEdit.appendChild(inputEditBtn);

    divEditContainer.appendChild(labelEdit);
    divEditContainer.appendChild(divEdit);
    divGroupEdit.appendChild(divEditContainer);
    divColEdit.appendChild(divGroupEdit);
    divRow.appendChild(divColEdit);

    return divRow;
}

function createEditRegPatronal() {
    var divRow = document.createElement("DIV");
    divRow.id = "rowEnvMailRegistroPatronal";
    divRow.className = "mainPanelRow";
    divRow.style.width = "100%";

    var divColEdit = document.createElement("DIV");
    divColEdit.id = "";
    divColEdit.className = "mainPanelCol borderCol col-12";
    divColEdit.style.visibility = 'visible';
    //divColEdit.style.width = "400px";

    var divGroupEdit = document.createElement("DIV");
    divGroupEdit.id = "";
    divGroupEdit.className = "mainPanelDivGroup";
    divGroupEdit.style.maxWidth = "100%";
    divColEdit.appendChild(divGroupEdit);

    var labelEdit = document.createElement("LABEL");
    labelEdit.id = "lblRegistroPatronal";
    labelEdit.className = "mainPanelContentComponents";
    labelEdit.style.width = "100%";
    labelEdit.setAttribute("idetiqueta", "RegistroPatronal");
    labelEdit.innerHTML = "Registro Patronal";
    divGroupEdit.appendChild(labelEdit);


    var divEditContainer = document.createElement("DIV");
    divEditContainer.className = "editContainer";
    var divEdit = document.createElement("DIV");
    divEdit.id = "editEnvMailRegPatronal";
    divEdit.className = "edit small-medium";
    divEdit.setAttribute("dataedit", "editEnvMailRegPatronal");
    divEdit.setAttribute("functedit", "setEditEnvMailRegPatronal");
    var inputEditKey = document.createElement("INPUT");
    inputEditKey.id = "txtEditMailRegPatronal";
    inputEditKey.className = "editKey small";
    inputEditKey.setAttribute("kind", "filterKey");
    inputEditKey.setAttribute("type", "text");
    var inputEditBrief = document.createElement("INPUT");
    inputEditBrief.id = "txtEditMailRegPatronal";
    inputEditBrief.className = "editBrief medium";
    inputEditBrief.setAttribute("type", "text");
    inputEditBrief.disabled = true;
    var inputEditBtn = document.createElement("BUTTON");
    inputEditBtn.id = "txtEditMailRegPatronal";
    inputEditBtn.className = "editButton small";
    inputEditBtn.setAttribute("onclick", "OpenEditModal(this)");
    var imgEditBtn = document.createElement("IMG");
    imgEditBtn.className = "imgBoton";
    imgEditBtn.src = "img/Iconos/puntos.png";
    imgEditBtn.src = changeIconByCmp(imgEditBtn.src);
    inputEditBtn.appendChild(imgEditBtn);
    divEdit.appendChild(inputEditKey);
    divEdit.appendChild(inputEditBrief);
    divEdit.appendChild(inputEditBtn);


    divEditContainer.appendChild(labelEdit);
    divEditContainer.appendChild(divEdit);
    divGroupEdit.appendChild(divEditContainer);
    divColEdit.appendChild(divGroupEdit);
    divRow.appendChild(divColEdit);
    return divRow;
}

//Config Edit's *****
function setEditEnvMailSerie() {

    //Parameters
    nameCmp = "editEnvMailSerie";
    var subEntities = [];
    var filtroParametro = null;
    var preFilters = null;
    if (obtenerSeriePor === 0) {
        table = "RazonesSociales";
        subEntities.push("Right Join:series");
        filtroParametro = getRazonSocial().id;
        preFilters = { "id": filtroParametro };
    } else if (obtenerSeriePor === 1) {
        table = "RegistroPatronal";
        subEntities.push("Right Join:series");
        if (document.getElementById("editEnvMailRegPatronal")) {
            filtroParametro = document.getElementById("editEnvMailRegPatronal").getAttribute("value");
        } else {
            filtroParametro = idRegPtronal;
        }
        preFilters = { "id": filtroParametro };
    } else if (obtenerSeriePor === 2) {
        table = "TipoNomina";
        subEntities.push("Right Join:series");
        filtroParametro = document.getElementById("editEnvMailTipoNom").getAttribute("value");
        preFilters = { "id": filtroParametro };
    }
    nameCols = "Serie,Descripción,Longitud de Folio,Folio Inicial, Limite de advertencia";
    campos = "series.serie,series.descripcion,series.longitudFolio,series.folioInicial,series.limiteAdvertencia";
    //campos = "series.serie,series.descripcion,clave";
    camposMostrar = ["series.serie", "series.descripcion"];
    camposObtener = "[]series.serie";
    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Serie", "tipo": "string", "campo": "series.serie", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción", "tipo": "string", "campo": "series.descripcion", "medida": "m" };
    var tituloSel = "serie";
    var tamañoSel = "size-4";

    //var optionals = new Object();
    //optionals["camposGroup"] = campos;
    //optionals["camposOrden"] = ["series.serie"];

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);

}

function setEditEnvMailSerieSearchAction(data) {
    if (obtenerSeriePor === 0) {
        if (data.length === 0) {
            alert("Esta Razon Social no contiene una Serie");
            return false;
        }
    } else if (obtenerSeriePor === 1) {
        if (data.length === 0 && idRegPtronal !== null) {
            alert("Este Registro Patronal no contiene una Serie");
            return false;
        }
    } else if (obtenerSeriePor === 2) {
        if (data.length === 0) {
            alert("Este Tipo de nomina no contiene una Serie");
            return false;
        }
    }
}


function setEditEnvMailTipoCorrida() {
    //Parameters
    nameCmp = "editEnvMailTipoCorrida";
    table = "TipoCorrida";
    nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposObtener = "clave,descripcion";
    var tituloSel = "Tipo corrida";
    var tamSel = "size-2";
    camposMostrar = ["clave", "descripcion"];

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamSel);
}

function setEditEnvMailTipoCorridaShow(value) {
    if (value !== null) {

    }
}


function setEditEnvMailTipoNom() {
    //Parameters
    nameCmp = "editEnvMailTipoNom";
    table = "TipoNomina";
    nameCols = ["Clave", "Descripción", "Periodicidad"];
    campos = ["clave", "descripcion", "periodicidad.descripcion"];
    camposObtener = ["[]id", "[]clave", "[]descripcion", "[]tipoReporte"];
    var subEntities = ["periodicidad"];
    if (obtenerSeriePor === 2) {
        nameCols.push("Serie");
        campos.push("series.descripcion");
        subEntities.push("Left Join:series");
        camposObtener.push("[]series.serie");
    }

    camposMostrar = ["clave", "descripcion"];
    preFilters = setPreFilters(preFilters = null);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de tipo de nomina", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre de tipo de nomina", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "Tipo Nomina";
    var tamañoSel = "size-2";
    //var optionals = new Object();
    //optionals["camposOrden"] = ["descripcion"];

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
         typeof optionals === 'undefined' ? null : optionals
         );

}

function setEditEnvMailTipoNomShow(value) {
    clearEdit("editEnvMailPeriodo");
    if (obtenerSeriePor === 2) {
        clearEdit("editEnvMailSerie");
    }
    if (value === null) {
        enabledEdit('editEnvMailPeriodo', false);
    } else {
        var obj = value[0];
        claveTipoNomina = obj.Clave;
        enabledEdit('editEnvMailPeriodo', true);
    }
}

function setEditEnvMailTipoNomAfterShow(value) {
    if (obtenerSeriePor === 2) {
        var getTypeFileSel = $('#cbxEnvMailTipoArchivo option:selected').val();
        if (getTypeFileSel !== 4) {
            var valuesTipoNom = getExtraValues("editEnvMailTipoNom");
            if (valuesTipoNom != null) {
                if (valuesTipoNom[3] == "") {
                    // alert("Este tipo de nomina no pertenece a una Serie");
                }
                else if (valuesTipoNom[3] !== "") {
                    //  setEditObject("editEnvMailSerie", valuesTipoNom[4]);
                } else {
                    clearEdit("editEnvMailSerie");
                }
            }
        }
    }
}

function setEditEnvMailTipoNomClear(value) {
    clearEdit("editEnvMailPeriodo");
    $('#txtDeFecha').prop("disabled", false);
    $("#txtDeFecha").val("");
    $('#txtDeFecha').prop("disabled", true);

    $('#txtAFecha').prop("disabled", false);
    $("#txtAFecha").val("");
    $('#txtAFecha').prop("disabled", true);
}

function setEditEnvMailRegPatronal() {
    //Parameters
    nameCmp = "editEnvMailRegPatronal";
    table = "RegistroPatronal";
    nameCols = ["Clave", "Nombre", "Registro patronal", "Razón social"];
    campos = ["clave", "nombreregtpatronal", "registroPatronal", "razonesSociales.razonsocial"];
    camposMostrar = ["clave", "nombreregtpatronal"];
    var subEntities = ["razonesSociales"];
    camposObtener = ["[]clave"];
    if (obtenerSeriePor === 1) {
        nameCols.push("Serie");
        campos.push("series.descripcion");
        subEntities.push("Left Join:series");
        camposObtener.push("[]series.serie");
    }

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };
    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de registro patronal", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre del registro patronal", "tipo": "string", "campo": "nombreregtpatronal", "medida": "m" };
    var tituloSel = "Registro Patronal";
    var tamañoSel = "size-4";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);

}

function setEditEnvMailRegPatronalAfterShow(value) {
    if (obtenerSeriePor === 1) {
        var valuesRegPatronal = getExtraValues("editEnvMailRegPatronal");
        if (valuesRegPatronal != null) {
            if (valuesRegPatronal[1] === "") {
                //alert("Este Registro Patronal no pertenece a una Serie");
                clearEdit("editEnvMailSerie");
            }
            else if (valuesRegPatronal[1] !== "") {
                //setEditObject("editEnvMailSerie", valuesRegPatronal[1]);
            } else {
                clearEdit("editEnvMailSerie");
            }
        }
    }
}

function setEditEnvMailPeriodos() {
    //Parameters
    nameCmp = "editEnvMailPeriodo";
    table = "PeriodosNomina";
    nameCols = "Clave,Descripción,Fecha inicial,Fecha final,Fecha cierre";
    campos = "clave,descripcion,Date:fechaInicial,Date:fechaFinal,Date:fechaCierre";
    var subEntities = "tipoNomina";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion,fechaInicial,fechaFinal";
    var preFilters = { "tipoNomina.id": getExtraValues("editEnvMailTipoNom")[0] };
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

function setEditEnvMailPeriodosShow(value) {

    if (value === null) {

    } else {
        var obj = value[0];
        document.getElementById("txtDeFecha").value = formatDate(new Date(obj.FechaInicial));
        document.getElementById("txtAFecha").value = formatDate(new Date(obj.FechaFinal));
    }
}

function setEditEnvMailPeriodosClear() {
    $('#txtDeFecha').prop("disabled", false);
    $("#txtDeFecha").val("");
    $('#txtDeFecha').prop("disabled", true);

    $('#txtAFecha').prop("disabled", false);
    $("#txtAFecha").val("");
    $('#txtAFecha').prop("disabled", true);
}

function setEditEnvMailCentroCostos() {
    //Parameters
    nameCmp = "editEnvMailCentroCostos";
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

function setEditEnvMailDelEmpleados() {
    nameCmp = "editEnvMailDelEmpleados";
    table = "PlazasPorEmpleadosMov";
    nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.id,plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "[]plazasPorEmpleado.empleados.clave";

    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre"];

    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": getRazonSocial().id,
        /*Options filter for no repeat Empleados both are functionals*/
        //This option 1:
        //"@id": "(Select MAX(m.id) from PlazasPorEmpleadosMov m  WHERE m.plazasPorEmpleado.referencia = o.plazasPorEmpleado.referencia)",
        //This option 2:
        /* "id#IN@": "(Select MAX(m.id) from PlazasPorEmpleadosMov m  WHERE m.plazasPorEmpleado.referencia = o.plazasPorEmpleado.referencia)",
         "plazasPorEmpleado.ingresosBajas.fechaBaja#>=": getFechaSistema(),
         */

        //"@BETWEEN": [
        //    "(( o.fechaInicial <= :PB1) OR ( o.fechaInicial BETWEEN :PB1 AND :PB2 ))",
        //    "PB1", getFechaSistema(), "PB2", getFechaSistema()],

        //"@BETWEEN": [
        //    "(( o.plazasPorEmpleado.fechaFinal >= :PB3  )  OR (o.plazasPorEmpleado.fechaFinal BETWEEN :PB4 AND :PB3))",
        //    "PB3", getFechaSistema(), "PB4", getFechaSistema()]
    };

    //Fechas en base al periodo
    if (document.getElementById("editEnvMailPeriodo").getAttribute("value")) {


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
    if (document.getElementById("editEnvMailCentroCostos").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editEnvMailCentroCostos").getAttribute("value");
    }

    //Tipo de nomina
    if (document.getElementById("editEnvMailTipoNom").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editEnvMailTipoNom").getAttribute("value");
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

function setEditEnvMailDelEmpleadosShow(value) {
    if (value != null) {
        console.log(value)
        var obj = value[0];
        addDataEdit("editEnvMailDelEmpleados", "claveDelEmpleado", obj[1].clave);
    }
}

function setEditEnvMailAlEmpleados() {
    nameCmp = "editEnvMailAlEmpleados";
    table = "PlazasPorEmpleadosMov";
    nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.id,plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "[]plazasPorEmpleado.empleados.clave";
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre"];

    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": getRazonSocial().id,
    };

    //Fechas en base al periodo
    if (document.getElementById("editEnvMailPeriodo").getAttribute("value")) {


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
    if (document.getElementById("editEnvMailCentroCostos").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editEnvMailCentroCostos").getAttribute("value");
    }

    //Tipo de nomina
    if (document.getElementById("editEnvMailTipoNom").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editEnvMailTipoNom").getAttribute("value");
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

function setEditEnvMailAlEmpleadosShow(value) {
    if (value != null) {
        var obj = value[0];
        addDataEdit("editEnvMailAlEmpleados", "claveAlEmpleado", obj[1].clave);
    }
}

function sendMasive() {
    var rows = $("#bodyEdittblFiltroEmpleados").children('tr:not(.hide)');
    for (var i = 0; i < rows.length; i++) {
        var tdSelect = $(rows[i]).children('td[persist^=seleccionado]');
        var chkSelect = $(tdSelect).children('label').children('input');
        dataEnvEmpleados[i]["seleccionado"] = chkSelect.is(":checked");
    }
    callListener("S");
    ///makeActionEnvCor("S");
}

function sendOnlySelected(dataClear) {
    var toSendMails = [];
    for (var i = 0; i < dataClear.length; i++) {
        if (dataEnvEmpleados[i]["seleccionado"]) {
            //Anexed information
            var valuesPeriodo = getExtraValues("editEnvMailPeriodo");
            if (valuesPeriodo != null) {
                dataEnvEmpleados[i]["periodoNomina"] = valuesPeriodo[1];
                var valDateFrom = document.getElementById("txtDeFecha").value;
                var fechaDe = new Date(formantDdMmYyyy(valDateFrom));
                dataEnvEmpleados[i]["deLaFecha"] = formatDatemmddyyy(fechaDe);
                var valDateTo = document.getElementById("txtAFecha").value;
                var fechaTo = new Date(formantDdMmYyyy(valDateTo));
                dataEnvEmpleados[i]["aLaFecha"] = formatDatemmddyyy(fechaTo);
            }
            dataEnvEmpleados[i]["nombreEmpresa"] = getRazonSocial().nombreRazon;

            var valuesTipoNomina = getExtraValues("editEnvMailTipoNom");
            if (valuesTipoNomina != null) {
                dataEnvEmpleados[i]["tipoNomina"] = valuesTipoNomina[2];
            }

            var valuesCentroCosto = getExtraValues("editEnvMailCentroCostos");
            if (valuesCentroCosto != null) {
                dataEnvEmpleados[i]["centroCostos"] = valuesCentroCosto[1];
            }

            toSendMails.push(dataEnvEmpleados[i]);
        }
    }
    return toSendMails;
}

function callListener(mode) {
    if (preValidateBeforeConsult()) {
        var objCallerSender = {};
        //Dictionary
        filterEnvMail = new Object();
        var getTypeFileSel = $('#cbxEnvMailTipoArchivo option:selected').val();
        filterEnvMail['tipoArchivo'] = getTypeFileSel;
        filterEnvMail['action'] = "C";
        filterEnvMail['claveRazonSocial'] = getRazonSocial().clave;
        if (getTypeFileSel !== "4") {
            if ($("#cbxEnvMailTipoCorrida").val()) {
                filterEnvMail['idTipoCorrida'] = $("#cbxEnvMailTipoCorrida").val();
            }
            if (document.getElementById("editEnvMailTipoNom").getAttribute("value")) {
                filterEnvMail['idTipoNomina'] = document.getElementById("editEnvMailTipoNom").getAttribute("value");
                var valueTypeReport = getExtraValues("editEnvMailTipoNom");
                if (valueTypeReport != null) {
                    if (valueTypeReport[0] !== "") {
                        filterEnvMail['tipoReporte'] = valueTypeReport[3];
                    }
                }
            }
            if (document.getElementById("editEnvMailSerie").getAttribute("value")) {

                var valueSerie = getExtraValues("editEnvMailSerie");
                if (valueSerie != null) {
                    if (valueSerie[0] !== "") {
                        filterEnvMail['keySerie'] = valueSerie[0];
                    }
                }
            }
            if (document.getElementById("editEnvMailPeriodo").getAttribute("value")) {
                filterEnvMail['idPeriodosNomina'] = document.getElementById("editEnvMailPeriodo").getAttribute("value");
            }
            if (obtenerSeriePor === 1) {
                if (document.getElementById("editEnvMailRegPatronal")) {
                    if (document.getElementById("editEnvMailRegPatronal").getAttribute("value")) {
                        filterEnvMail['idRegistroPatronal'] = document.getElementById("editEnvMailRegPatronal").getAttribute("value");
                    }
                }
            }
            if (document.getElementById("editEnvMailCentroCostos").getAttribute("value")) {
                filterEnvMail['idCentroDeCostos'] = document.getElementById("editEnvMailCentroCostos").getAttribute("value");
            }
            if (document.getElementById("editEnvMailDelEmpleados").getAttribute("value")) {//cambio
                //If NOTID get key
                filterEnvMail['iniClaveEmpleCf'] = getExtraValues("editEnvMailDelEmpleados")[0];
                //document.getElementById("editEnvMailDelEmpleados").getAttribute("value");
            }
            if (document.getElementById("editEnvMailAlEmpleados").getAttribute("value")) {
                filterEnvMail['finClaveEmpleCf'] = getExtraValues("editEnvMailAlEmpleados")[0];
                //filterEnvMail['finPlazaEmpleMov'] = document.getElementById("editEnvMailAlEmpleados").getAttribute("value");
            }
            if ($("#cbxEnvMailStatus").val()) {
                var valueStatusmail = $("#cbxEnvMailStatus").val();
                if (valueStatusmail !== "" && valueStatusmail !== "1") {
                    filterEnvMail['statusCorreo'] = valueStatusmail;
                }
            }
        } else {
            var extrasTipoNom = getExtraValues("editEnvMailTipoNom");
            if (extrasTipoNom !== null) {
                filterEnvMail['claveTipoNomina'] = getExtraValues("editEnvMailTipoNom")[1];
            }
            if (obtenerSeriePor === 1) {
                var extrasRegPat = getExtraValues("editEnvMailRegPatronal");
                if (extrasRegPat !== null) {
                    filterEnvMail['claveRegistroPatronal'] = getExtraValues("editEnvMailRegPatronal")[0];
                }
            }
            var extrasCentCos = getExtraValues("editEnvMailCentroCostos");
            if (extrasCentCos !== null) {
                filterEnvMail['claveCentroDeCostos'] = getExtraValues("editEnvMailCentroCostos")[0];
            }

            var extrasPeriodos = getExtraValues("editEnvMailPeriodo");
            if (extrasPeriodos !== null && extrasPeriodos !== "") {
                filterEnvMail['fechaInicialPeriodo'] = new Date(document.getElementById("txtDeFecha").value);
                filterEnvMail['fechaFinalPeriodo'] = new Date(document.getElementById("txtAFecha").value);
            }
            if (getDataEdit("editEnvMailDelEmpleados", "claveDelEmpleado") !== null) {
                filterEnvMail['claveDelEmpleado'] = getDataEdit("editEnvMailDelEmpleados", "claveDelEmpleado");
            }

            if (getDataEdit("editEnvMailAlEmpleados", "claveAlEmpleado") !== null) {
                filterEnvMail['claveAlEmpleado'] = getDataEdit("editEnvMailAlEmpleados", "claveAlEmpleado");
            }
        }

        if (mode == "S") {
            filterEnvMail['toSendMails'] = sendOnlySelected(dataEnvEmpleados);
        }

        objCallerSender.filtros = filterEnvMail;

        if (mode == undefined) {
            makeActionEnvCor("C", objCallerSender)
        } else if (mode == "S") {
            makeActionEnvCor("S", objCallerSender);
        }
    }
}

function changeStatusMail() {
    var rows = $("#bodyEdittblFiltroEmpleados").children('tr:not(.hide)');
    for (var i = 0; i < rows.length; i++) {
        var tdSelect = $(rows[i]).children('td[persist^=seleccionado]');
        var chkSelect = $(tdSelect).children('label').children('input');
        if (chkSelect.is(":checked")) {
            var tdStatusMail = $(rows[i]).children('td[persist^=statusCorreo]');
            tdStatusMail.html("Enviado");
        }
    }
}

function preValidateBeforeConsult() {
    var isValid = true;
    isValid = validateComponents(elementsEnvioCorreo);
    return isValid;
}

function makeActionEnvCor(action, obj) {
    var succes = false;
    if (action === "S") {
        var url = route + "/api/EnvioCorreo/EnviarCorreoMasivo";
        var data = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, data, 2, false);
        if (Mensaje.error === "") {
            var result = Mensaje.resultado;
            if (result) {
                succes = true;
                changeStatusMail();
            }
            else {
                alert(Mensaje.error);
            }
        }
    } else if (action === "C") {
        var url = route + "/api/EnvioCorreo/ConsultaCorreosEmpleados";
        var data = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, data, 2, false);
        if (Mensaje.error === "") {
            var result = Mensaje.resultado;
            dataEnvEmpleados = result;
            dataEnvEmpleados = addFileToData(dataEnvEmpleados);

            /*W:7*/
            llenartabla(start, end);
            /// llenarTablaGen("tblFiltroEmpleados", dataEnvEmpleados);
        }
        else {
            alert(Mensaje.error);
        }
    }
    return succes;
}


/*---------------W:1 Config Table---------------*/
function editTableFiltroEmpleados() {
    var nameTable = "tblFiltroEmpleados";
    var nameCols = crearListaColumnas(1);
    var activaAdd = false;
    var activaDelete = false;
    var activaEditar = false;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete, activaEditar);
}

/*---------------W:2---------------*/
function crearListaColumnas(typeTbl) {
    var columnasTabla = new Array();

    if (typeTbl === 1) {//Filtros
        var col = {
            "tituloColumna": "Empleado", "nombreCompo": "empleadoClave", "editable": false,
            "tipoCompon": "text", "persist": "clave", "ancho": "150px"
        };
        columnasTabla.push(col);

        col = {
            "tituloColumna": "Nombre", "nombreCompo": "empleadoNombre", "editable": false,
            "tipoCompon": "text", "persist": "nombre", "ancho": "150px"
        }
        columnasTabla.push(col);

        col = {
            "tituloColumna": "Correo", "nombreCompo": "empleadoCorreo", "editable": false,
            "tipoCompon": "text", "persist": "correo", "ancho": "150px", "hide": true
        }
        columnasTabla.push(col);

        var getTypeFileSel = $('#cbxEnvMailTipoArchivo option:selected').val();

        if (getTypeFileSel === "1" || getTypeFileSel === "2" || getTypeFileSel === "3") {
            col = {
                "tituloColumna": "IDCFDIRecibo", "nombreCompo": "IDCFDIRecibo", "editable": false,
                "tipoCompon": "text", "persist": "idCFDIRecibo", "ancho": "150px", "hide": true
            }
            columnasTabla.push(col);

            col = {
                "tituloColumna": "Status", "nombreCompo": "statusCorreo", "editable": false,
                "tipoCompon": "text", "persist": "statusCorreo", "ancho": "150px"
            }
            columnasTabla.push(col);

            if (getTypeFileSel === "1" || getTypeFileSel === "2") {
                col = {
                    "tituloColumna": "Visualizar XML", "nombreCompo": "visualizar", "editable": true,
                    "tipoCompon": "file", "persist": "archivoXML", "persistEx": "documentoXML", "ancho": "80px"
                }
                columnasTabla.push(col);
            }
            if (getTypeFileSel === "1" || getTypeFileSel === "3") {
                col = {
                    "tituloColumna": "Visualizar PDF", "nombreCompo": "visualizar", "editable": true,
                    "tipoCompon": "file", "persist": "archivo", "ancho": "80px"
                }
                columnasTabla.push(col);
            }
        } else {
            col = {
                "tituloColumna": "Visualizar", "nombreCompo": "visualizar", "editable": true,
                "tipoCompon": "file", "persist": "archivo", "ancho": "80px"
            }
            columnasTabla.push(col);

        }

        col = {
            "tituloColumna": "Seleccionar", "nombreCompo": "Seleccionar", "editable": true,
            "tipoCompon": "checkbox", "persist": "seleccionado", "ancho": "100px", "selectable": true
        }
        columnasTabla.push(col);
    }

    return columnasTabla;
}

/*---------------W:3---------------*/
function construirObj(tr, nameTable) {
    var obj = {};

    for (var i = 0; i < tr.cells.length; i++) {
        var tipoCmp = tr.cells[i].getAttribute('tipocompon');
        if (tr.cells[i].getAttribute('persist') !== "eliminar" && tr.cells[i].getAttribute("contenteditable") === "true") {
            if (tr.cells[i].getAttribute('tipocompon') === "select") {
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].getAttribute('valor');
            } else {
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
            }
        } else if (tr.cells[i].getAttribute('tipocompon') === "checkbox") {
            obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].firstElementChild.firstElementChild.checked;
        }
    }

    if (tr.id === "") {
        var rString = "id" + randomString(2, '0123456789');
        obj['id'] = rString;
        tr.id = obj.id;
        if (nameTable === "tblFiltroEmpleados") {
            // agregarEnvEmpleados(obj);
        }
    } else {
        obj['id'] = tr.id;
        if (nameTable === "tblFiltroEmpleados") {
            alert("update");
            actualizarEnvEmpleados(obj);
        }
    }
}

/*---------------W:4---------------*/
function agregarEnvEmpleados(value) {
    var obj = {};
    obj.id = value.id;
    obj.clave = value.clave;
    obj.nombre = value.nombre;
    obj.correo = value.correo;
    var getTypeFileSel = $('#cbxEnvMailTipoArchivo option:selected').val();
    //if (getTypeFileSel === "4") {
    var generalSelector = document.getElementById("selectorFile");
    if (generalSelector) {
        obj.documento = generalSelector.getAttribute("namefile");
        obj.archivo = generalSelector.getAttribute("value");
    }
    //}
    obj.seleccionado = value.seleccionado;
    obj.statusFila = "NUEVO";
    dataEnvEmpleados.push(obj);
}

function actualizarEnvEmpleados(valTable) {
    var getEnvEmple = {};
    for (var i = 0; i < dataEnvEmpleados.length; i++) {
        if (dataEnvEmpleados[i].id === parseInt(valTable.id)
            || dataEnvEmpleados[i].id === valTable.id) {
            getEnvEmple = dataEnvEmpleados[i];
            if (valTable.seleccionado) {
                getEnvEmple.seleccionado = valTable.seleccionado;
            }
            dataEnvEmpleados[i] = getEnvEmple;
            break;
        }
    }
}

//NEW (Execute paginado)
function cambiarPagina(valores) {
    rowsByPage = 2;
    end = rowsByPage;
    start = valores;
    if (dataEnvEmpleados.length > rowsByPage) {
        var res = (rowsByPage + start) - dataEnvEmpleados.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = dataEnvEmpleados.length;
    }
    llenartabla(start, end);
}

function llenartabla(start, end) {
    if (dataEnvEmpleados.length > 0) {
        if (start === 0) {
            createEditPagination(dataEnvEmpleados.length, "tblFiltroEmpleados");
        }
        llenarTablaGen("tblFiltroEmpleados", dataEnvEmpleados, start, end);
        InitEventsTable();

    } else {
        clearTable("tblFiltroEmpleados");
        InitEventsTable();
    }
}