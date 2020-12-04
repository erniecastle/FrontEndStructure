/*!
 * Copyright 2018 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */
//debugger;
var posicion = null;
var testing = false;
var activeimportscreen = false;
var numberCompInsideDiv = 0;
var numberCompInside = 0;
var route = "";
var contab = 0;
var contcompo = 0;
var camposOrigen;
var fuenteDatosPrincipal;
var idfuenteOrigenPrincipal;
var fuenteProcesoPrincipal;
var idfuenteProcesoPrincipal;
var dataOriginTables = [];
var cancelar = false;
var listaCamposTCMasiva2;
var listDetalle = [];
var listDeleteDetalle;
var tablaSelectorRegistro = [];
var tablaSelectorBusqueda = [];
var contadordetalle = 0;
var borderStyle = ["Default", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "dotted"];
var archivoEs;
var procesoOrigen;

jQuery(document).ready(function () {
    if (document.getElementById('widhtDivComp')) {
        document.getElementById('widhtDivComp').value = 100;
    }
    if (document.getElementById('heightDivComp')) {
        document.getElementById('heightDivComp').value = 'Vacio';
    }
    $('#compWay option:first').attr('selected', 'selected');
    $('#widhtCol option:last-child').attr('selected', 'selected');
    $('#getComponent option:first').attr('selected', 'selected');
    $(document).on('click', '.mainContent', function (e) {
        // console.log(e.target.className);
        $('.content').find('*').removeClass('Selected');
        $('#' + e.target.id).addClass('Selected');
        showPropertiesCom(e.target);
        elementSegmenter(e.target);
        //mainPanelDivGroup 
        if (e.target.className.includes("mainPanelDivGroup") || e.target.className.includes("mainPanelContentComponents")
                || e.target.className.includes("titlecontain") || e.target.className.includes("tablinks") || e.target.className.includes("mainPanelCol")) {
            updateProperties(e.target, true);
        }

    });
    //Escape go
    $(document).keyup(function (event) {
        if (event.key === "Escape") {
            backSelectToFather();
        }
        if (event.key === "Delete") {
            quitGlobalComponent();
        }
    });
    $(document).on('click', '.mainPanelCol', function () {
        var parentWidth = $(this).parent().width();
        var childWidth = (($(this).width() / parentWidth * 100)).toFixed();
        if (childWidth === '8') {
            childWidth = '8.33333';
        } else if (childWidth === '16') {
            childWidth = '16.66666';
        } else if (childWidth === '24') {
            childWidth = '25';
        } else if (childWidth === '33') {
            childWidth = '33.33333';
        } else if (childWidth === '41') {
            childWidth = '41.66666';
        } else if (childWidth === '49') {
            childWidth = '50';
        } else if (childWidth === '58') {
            childWidth = '58.33333';
        } else if (childWidth === '66') {
            childWidth = '66.66666';
        } else if (childWidth === '74') {
            childWidth = '75';
        } else if (childWidth === '83') {
            childWidth = '83.33333';
        } else if (childWidth === '91') {
            childWidth = '91.66666';
        } else if (childWidth === '99') {
            childWidth = '100';
        } else {
            // childWidth = "100";
        }
        var theWidht = document.getElementById('widhtCol');
        if (theWidht) {
            document.getElementById('widhtCol').value = childWidth;
        }
    });
    if (document.getElementById('moveIn')) {
        var elemento = $('#moveIn');
        posicion = elemento.position();
    }

    var fileName = location.href.split("/").slice(-1);
    if (fileName === "dynamic.html") {
        sessionStorage.clear();
        alert("Limpieza");
    }

    //Acces Modes
    var typeAcces = sessionStorage.getItem('mode'); //con arreglo de tipo captura
    if (typeAcces) {
        //alert("Value to put: " + sessionStorage.getItem(typeAcces[1]));
        //alert("Our type acces is: " + typeAcces);
        if (typeAcces !== null && typeAcces !== undefined) {
            typeAcces = JSON.parse(typeAcces);
            if (Array.isArray(typeAcces)) {
                if (typeAcces[0] === 1) {
                    var fileShowCaptureDetails = sessionStorage.getItem(typeAcces[1]);
                    turnConfigByMode(typeAcces);
                    if (fileShowCaptureDetails) {
                        importPreviewCapture(fileShowCaptureDetails);
                    }
                }
            }
            if (typeAcces[1] === 'fileCapture') {
                var leer1 = "";
                if (document.getElementById('designer')) {
                    leer1 = document.getElementById('designer').getElementsByTagName('table');
                }
                if (leer1) {
                    for (var i = 0; i < leer1.length; i++) {
                        if (leer1[i].tableidentifier) {
                            var datos = leer1[i].tableidentifier.split('|');
                            var detalle = { 'id': datos[0], 'origen': datos[1] };
                            listDetalle[i] = detalle;
                            contadordetalle++;
                        }
                    }
                }
            }
        }
    } else {
        turnConfigByMode('undefined');
    }
    // cargarArchivoParaTitulosIdioma();
});

function turnConfigByMode(mode) {
    var getBtns = document.getElementById('normalRules');
    var getBtns2 = document.getElementById('typeOfRules');
    // console.log(mode);
    if (mode[0] === 1) {
        if (getBtns) {
            document.getElementById('normalRules').style.display = "none";
        }
        var componente = document.getElementById("cbxOrigenDatos");
        if (componente && mode[1] !== "fileCapturaProceso") {
            var id = document.getElementById('cbxOrigenDatos').value;
            var nombreFuente = componente.options[componente.selectedIndex].text;
            var componente2 = document.getElementById("Fuente");
            if (componente2) {
                componente2.innerHTML = 'Campos de la Fuente Datos ' + nombreFuente;
            }
            if (mode[1] === 'fileCapture') {
                fuenteDatosPrincipal = nombreFuente;
                idfuenteOrigenPrincipal = id;
                if (mode[4] === "5") {
                    listaCamposTCMasiva2 = JSON.parse(mode[3]);
                    //console.log(listaCamposTCMasiva2);
                    getCamposOrigenDetalle(id, true);
                    var camposOrigenTabla = dataOriginTables[id];
                    // getCamposOrigen(id, true);Se quito
                    var resultado = camposOrigenTabla;
                    //  console.log(resultado);
                    for (var i = 0; i < resultado.length; i++) {
                        if (resultado[i]['activarCaptura'] === true) {
                            if (listaCamposTCMasiva2[resultado[i]['id']]['global'] === 1) {
                                var json = JSON.stringify(resultado[i]);
                                $('#getNameColumn').append($("<option></option>")
                                        .attr("value", json.toString())
                                        .text(resultado[i]['campo']));
                            } else {

                                console.log();
                            }
                        }
                    }
                    var panelDetalle = document.getElementById("AgregarDetalles");
                    panelDetalle.style.display = 'block';
                    var sele2 = panelDetalle.querySelectorAll('select');
                    //sele2.style
                    //console.log(sele2);
                    for (var k = 0; k < sele2.length; k++) {
                        sele2[k].style.display = "none";
                    }
                    var panelSelector = document.getElementById("SelectorRegistro");
                    panelSelector.style.display = 'none';
                    var panelbusqueda = document.getElementById("SelectorBusqueda");
                    panelbusqueda.style.display = 'none';
                } else {
                    getCamposOrigenDetalle(id);
                    //getCamposOrigen(id);
                    getDetalle();
                    var panelDetalle = document.getElementById("AgregarDetalles");
                    panelDetalle.style.display = 'block';
                    var panelSelector = document.getElementById("SelectorRegistro");
                    panelSelector.style.display = 'none';
                    var panelbusqueda = document.getElementById("SelectorBusqueda");
                    panelbusqueda.style.display = 'none';
                }
                // selectDetalle = true;
            } else if (mode[1] === 'fileCaptureSelect') {
                idfuenteOrigenPrincipal = id;
                getCamposOrigenDetalle(id, false);
                //getCamposOrigen(id);
                fuenteDatosPrincipal = nombreFuente;
                var panelDetalle = document.getElementById("AgregarDetalles");
                panelDetalle.style.display = 'none';
                var panelSelector = document.getElementById("SelectorRegistro");
                panelSelector.style.display = 'block';
                var panelbusqueda = document.getElementById("SelectorBusqueda");
                panelbusqueda.style.display = 'none';
                // selectRegistro = true;

            } else if (mode[1] === 'fileCaptureSearch') {
                getCamposOrigenDetalle(id, false);
                idfuenteOrigenPrincipal = id;
                var panelDetalle = document.getElementById("AgregarDetalles");
                panelDetalle.style.display = 'none';
                var panelSelector = document.getElementById("SelectorRegistro");
                panelSelector.style.display = 'none';
                var panelbusqueda = document.getElementById("SelectorBusqueda");
                panelbusqueda.style.display = 'block';
                fuenteDatosPrincipal = nombreFuente;
                // SelectBusqueda = true;
            } else if (mode[1] === 'fileCaptureDetalle') {
                fuenteDatosPrincipal = nombreFuente;
                idfuenteOrigenPrincipal = id;
                if (mode[4] === "5") {
                    listaCamposTCMasiva2 = JSON.parse(mode[3]);
                    //console.log(JSON.parse(listaCamposTCMasiva));
                    getCamposOrigenDetalle(id, false);
                    //getCamposOrigen(id, false);
                    //var resultado = camposOrigen;
                    // console.log(resultado);
                    //for (var i = 0; i < resultado.length; i++) {
                    //    if (listaCamposTCMasiva[resultado[i]['id']]['global'] === 1) {
                    //        var json = JSON.stringify(resultado[i]);
                    //        $('#getNameColumn').append($("<option></option>")
                    //                .attr("value", json.toString())
                    //                .text(resultado[i]['campo']));
                    //    } else {


                    //    }
                    //}
                    var panelDetalle = document.getElementById("AgregarDetalles");
                    panelDetalle.style.display = 'block';
                    var sele2 = panelDetalle.querySelectorAll('select');
                    //sele2.style
                    //console.log(sele2);
                    for (var i = 0; i < sele2.length; i++) {
                        sele2[i].style.display = "none";
                    }
                    var panelSelector = document.getElementById("SelectorRegistro");
                    panelSelector.style.display = 'none';
                    var panelbusqueda = document.getElementById("SelectorBusqueda");
                    panelbusqueda.style.display = 'none';
                }

            } else {
                var valor = mode[1].split('|');
                if (componente2) {
                    componente2.innerHTML = 'Campos de la Fuente Datos ' + valor[1];
                }
                //console.log(valor[0]);
                var idValor = valor[0]
                fuenteDatosPrincipal = valor[1];
                idfuenteOrigenPrincipal = idValor;
                getCamposOrigenDetalle(idValor, false);
                //getCamposOrigen(idValor[1]);
                var panelDetalle = document.getElementById("AgregarDetalles");
                panelDetalle.style.display = 'none';
                var panelSelector = document.getElementById("SelectorRegistro");
                panelSelector.style.display = 'none';
                var panelbusqueda = document.getElementById("SelectorBusqueda");
                panelbusqueda.style.display = 'none';
            }

        } else {
            var componente = document.getElementById("cbxProcesoOrigenDatos");
            if (componente) {
                var id = document.getElementById('cbxProcesoOrigenDatos').value;
                var nombreFuente = componente.options[componente.selectedIndex].text;

                //cambiar titulo de panel de los campos;
                var componente2 = document.getElementById("Fuente");
                componente2.innerHTML = 'Parametros para el Proceso' + nombreFuente;

                //cambiar titulo del panel de los detalles;
                var componente3 = document.getElementById("Detallesorigen");
                componente3.innerHTML = 'Acciones para el Proceso ' + nombreFuente;


                //ocultar panel de selector u busqueda
                var divSelector = document.getElementById('SelectorRegistro');
                divSelector.style.display = "none";
                var divSearch = document.getElementById('SelectorBusqueda');
                divSearch.style.display = "none";

                //ocultar componentes que son para el origen de datos 
                var detallesFuenteDatos = document.getElementById('detallesFuenteDatos');
                detallesFuenteDatos.style.display = "none";
                var camposFuentes = document.getElementById('camposFuentes');
                camposFuentes.style.display = "none";

                //mostrar componentes para los procesos
                var accionesProceso = document.getElementById('accionesProceso');
                accionesProceso.style.display = "block";
                var parametrosProceso = document.getElementById('parametrosProceso');
                parametrosProceso.style.display = "block"

                fuenteProcesoPrincipal = nombreFuente;
                idfuenteProcesoPrincipal = id;
                getCamposProceso(id);
            }
        }
        ///

    } else {
        if (getBtns) {
            document.getElementById('normalRules').style.display = "block";
        }
        if (getBtns2) {
            document.getElementById('typeOfRules').style.display = "none";
        }
    }
}

$(window).scroll(function () {//Does not work 

});

function getTablesColumnsName(fuente) {//Verificar si se usa
    var url = route + "/api/FormasCaptura/Namecolumns";
    var dataToPost = JSON.stringify(fuente);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost);
    if (Mensaje.resultado !== null) {
        console.log(Mensaje.resultado)
    }
}

/*Start of creation of screens*/
function clearGlobalSelect() {
    $('.content').find('*').removeClass('Selected');
}

function clearSelectedColumn() {
    var divSelected = $('#content').find('.Selected')[0];
    if (divSelected.id.toString().startsWith('col')) {
        while (divSelected.firstChild) {
            divSelected.removeChild(divSelected.firstChild);
        }
        if ($('#' + divSelected.id).children().length === 0) {
            divSelected.parentNode.style.height = '96px';
        }
    }
}

function clearSelectedPanelComponents() {
    var divSelected = $('#content').find('.Selected')[0];
    if (divSelected.id.toString().startsWith('col')) {
        while (divSelected.firstChild) {
            divSelected.removeChild(divSelected.firstChild);
        }
        if ($('#' + divSelected.id).children().length === 0) {
            divSelected.parentNode.style.height = '96px';
        }
    }
}

function addContainerTabs() {
    document.getElementById('widhtCol').value = 100;
    var divSelected = $('#content').find('.Selected')[0];
    var elelemeto = $('#mainContent').children();
    if (elelemeto.length > 0 && contab == 0) {//se agrego para los ids
        contab = ultimoID(elelemeto) + 1;
    } else {
        contab++; //nuevo
    }
    if (divSelected === undefined ||
            divSelected.className === 'mainContent Selected') {
        clearGlobalSelect();
        var mainContent = document.getElementById('mainContent');
        mainContent.className = 'mainContent';
        var numberMainDiv = contab;
        //var numberMainDiv = $('#mainContent').children().length;
        var containTab = createContainerTab(null, numberMainDiv);
        //var numberContainerTab = $('#' + containTab.id).children('.contain').length;
        var numberContainerTab = contab;
        var tab = createTab(containTab, numberMainDiv);
        var container = createContainer(containTab, numberContainerTab, false);
        var childTab = createChildTabs(tab, 0, container); // Buttons
        var row = createRow(container);
        var column = createColumn(row);
        row.appendChild(column);
        container.appendChild(row);
        containTab.appendChild(tab);
        tab.appendChild(childTab);
        containTab.appendChild(container);
        mainContent.appendChild(containTab); // --
        containTab.className = 'cTab';
        tab.className = 'tab';
        container.className = 'contain';
        row.className = 'mainPanelRow';
    } else if (divSelected.id.toString().startsWith('col')) {
        var contentCol = document.getElementById(divSelected.id);
        if (contentCol.parentNode.style.height !== '') {
            contentCol.parentNode.style.height = '';
        }
        //var numberTabInCol = $('#' + contentCol.id).children().length;
        var numberTabInCol = contab;
        var containTab = createContainerTab(contentCol, numberTabInCol);
        var tab = createTab(containTab, numberTabInCol);
        //var numberContainerTab = $('#' + containTab.id).children('.contain').length;
        var numberContainerTab = contab;
        var numberChildTab = contab;
        //var numberChildTab = divSelected.childNodes.length;
        var container = createContainer(containTab, numberContainerTab, false);
        var childTab = createChildTabs(tab, numberChildTab, container); // Buttons
        var row = createRow(container);
        var column = createColumn(row);
        row.appendChild(column);
        container.appendChild(row);
        containTab.appendChild(tab);
        tab.appendChild(childTab);
        containTab.appendChild(container);
        contentCol.appendChild(containTab);
    } else if (divSelected.id.toString().startsWith('tab')) {
        var containTab = divSelected.parentNode;
        var tab = document.getElementById(divSelected.id);
        //var numberContainerTab = $('#' + containTab.id).children('.contain').length;
        var numberContainerTab = contab;
        // var numberChildTab = divSelected.childNodes.length;
        var numberChildTab = contab;
        var container = createContainer(containTab, numberContainerTab, false);
        var childTab = createChildTabs(tab, numberChildTab, container); // Buttons
        var row = createRow(container);
        var column = createColumn(row);
        row.appendChild(column);
        container.appendChild(row);
        tab.appendChild(childTab);
        containTab.appendChild(container);
        containTab.className = 'cTab';
        tab.className = 'tab';
        container.className = 'contain';
        row.className = 'mainPanelRow';
        var tabcontent = $('#' + containTab.id).children('.contain');
        for (i = 0; i < tabcontent.length; i++) {
            if (container.id !== tabcontent[i].id) {
                tabcontent[i].style.display = 'none';
            }
        }
    } else {
        alert('Debes seleccionar una columna');
    }
}

function addContainer() {
    document.getElementById('widhtCol').value = 100;
    var divSelected = $('#content').find('.Selected')[0];
    if (divSelected === undefined ||
            divSelected.className === 'mainContent Selected' ||
            $('#' + divSelected.id).parent().attr('class').toString() === 'mainContent') {
        clearGlobalSelect();
        var mainContent = document.getElementById('mainContent');
        mainContent.className = 'mainContent';
        //var numberMainDiv = $('#mainContent').children().length;
        var numberMainDiv = contab
        var container = createContainer(null, numberMainDiv, true);
        var row = createRow(container);
        var column = createColumn(row, 0);
        row.appendChild(column);
        container.appendChild(row);
        mainContent.appendChild(container);
        container.className = 'contain';
        row.className = 'mainPanelRow';
        //mainContent.style.border = 'dashed black';
    } else if (divSelected.id.toString().startsWith('col')) {
        var contentCol = document.getElementById(divSelected.id);
        // var numberMainDiv = contentCol.childNodes.length;
        var numberMainDiv = contab
        // var newId = removeBefore(divSelected.id, "S");
        // var s = parseInt(newId) + 1;
        var container = createContainer(divSelected, numberMainDiv, true);
        if (contentCol.parentNode.style.height !== '') {
            contentCol.parentNode.style.height = '';
        }
        var row = createRow(container);
        var column = createColumn(row);
        row.appendChild(column);
        container.appendChild(row);
        contentCol.appendChild(container);
        contentCol.className = 'mainPanelCol borderCol col-12';
        container.className = 'contain';
        row.className = 'mainPanelRow';
    } else {
        alert('Debes seleccionar una columna');
    }
}

function quitGlobalComponent() {
    var divSelected = $('#content').find('.Selected')[0];

    if (divSelected) {
        if (divSelected.id === "mainContent") {
            while (divSelected.firstChild) {
                divSelected.removeChild(divSelected.firstChild);
            }
        } else {
            if ($("#" + divSelected.id).parent().attr('class') === "mainPanelRow") {
                quitComponent();
            }
            else if ($("#" + divSelected.id).parent().attr('class').includes("mainPanelCol")) {
                quitComponent();
            }
            else if ($("#" + divSelected.id).parent().attr('class') === "mainPanelDivGroup") {
                quitComponent();
            }

            else if ($("#" + divSelected.id).parents().hasClass("containerTable")) {
                quitComponent();
            } else if ($("#" + divSelected.id).parents().hasClass("select-style")) {
                quitComponent();
            } else if ($("#" + divSelected.id).parents().hasClass("editContainer")) {
                quitComponent();
            }
            else {
                if (divSelected.getAttribute("isoculto") === "true") {
                    divSelected.remove();
                    var conteComponetes = document.getElementById('compOcultos');
                    console.log(conteComponetes.childNodes.length);
                    if (conteComponetes.childNodes.length === 1 || conteComponetes.childNodes.length === 0) {
                        document.getElementById('ocultosConte').style.display = "none";
                    }

                } else {
                    divSelected.remove();
                }
            }
        }

        if ($('#mainContent ').children().length === 0) {
            $('#mainContent ').removeAttr("class");
        }
    }
}

function quitContainer() {
    var divSelected = $('#content').find('.Selected')[0];
    var fatherSelected = divSelected.parentNode;
    if (divSelected.id.toString().startsWith('con')) {
        divSelected.remove();
        //        $('#' + fatherSelected.id).children().each(function(i) {
        //            var newId = $(this).attr("id").toString();
        //            var res = removeAfter(newId, "F");
        //            if (res === "") {
        //                res = newId;
        //            }
        //            var numToRep = res.substring(res.indexOf("con"), res.length);
        //            numToRep = newId.toString().replace(numToRep, "con" + (i + 1));
        //            $(this).attr("id", numToRep);
        //        });
        if (fatherSelected.id.toString().startsWith('col')) {
            if ($('#' + fatherSelected.id).children().length === 0) {
                fatherSelected.parentNode.style.height = '96px';
            }
        }
    } else {
        alert('Debes de selccionar un contenedor');
    }
}

function quitContainerTabs() {
    var divSelected = $('#content').find('.Selected')[0];
    var fatherSelected = divSelected.parentNode;
    if (divSelected.id.toString().startsWith('cTab')) {
        divSelected.remove();
        //        $('#' + fatherSelected.id).children().each(function(i) {
        //            var newId = $(this).attr("id").toString();
        //            var res = removeAfter(newId, "F");
        //            if (res === "") {
        //                res = newId;
        //            }
        //            var numToRep = res.substring(res.indexOf("cTab"), res.length);
        //            numToRep = newId.toString().replace(numToRep, "cTab" + (i + 1));
        //            $(this).attr("id", numToRep);
        //        });

        if (fatherSelected.id.toString().startsWith('col')) {
            if ($('#' + fatherSelected.id).children().length === 0) {
                fatherSelected.parentNode.style.height = '96px';
            }
        }
    } else {
        alert('Debes de seleccionar un contenedor de pestaÃ±as');
    }

    if ($('#mainContent ').children().length === 0) {
        $('#mainContent ').removeAttr("class");
    }

}

function addRows() {
    var divSelected = $('#content').find('.Selected')[0];
    if (divSelected.id.toString().startsWith('con')) {
        // var fatherSelected = divSelected.parentNode;
        var row = createRow(divSelected);
        divSelected.appendChild(row);
        clearGlobalSelect();
        row.className = 'mainPanelRow Selected';
    }
    else if (divSelected.id.toString().startsWith('row')) {
        var row = createRow(divSelected);
        var parentDiv = divSelected.parentNode;
        parentDiv.insertBefore(row, divSelected);
        clearGlobalSelect();
        row.className = 'mainPanelRow Selected';
    }
    else {
        alert('Debes de selccionar un contenedor');
    }
    addColumn();
}

function quitRows() {
    var divSelected = $('#content').find('.Selected')[0];
    var fatherSelected = divSelected.parentNode;
    if (divSelected.id.toString().startsWith('row')) {
        divSelected.remove();
        if ($('#' + fatherSelected.id).children().length === 0) {
            fatherSelected.style.height = '96px';
        }
        $('#' + fatherSelected.id).children('div').each(function (i) {
            var newId = $(this).attr('id').toString();
            var res = removeAfter(newId, 'F');
            if (res === '') {
                res = newId;
            }
            var numToRep = res.substring(res.indexOf('row'), res.length);
            numToRep = newId.toString().replace(numToRep, 'row' + (i + 1));
            $(this).attr('id', numToRep);
        });
    } else {
        alert('Debes de selccionar un contenedor');
    }
}

function addColumn() { // AddColumns
    var divSelected = $('#content').find('.Selected')[0];
    if (divSelected === undefined || divSelected === null) {
        alert('Selecciona un renglon');
    } else {
        if (divSelected.id.toString().startsWith('row')) {
            var newId = removeBefore(divSelected.parentNode.id, 'S');
            var s = parseInt(newId);
            var column = createColumn(divSelected, s);
            column.style.visibility = 'hidden';
            var acumulateWidth = 0;
            $('#' + divSelected.id).children().each(function () {
                var parentWidth = $('#' + divSelected.id).width();
                var childWidth = ($(this).width() / parentWidth * 100).toFixed(4);
                acumulateWidth += parseFloat(childWidth);
            });
            if (acumulateWidth > 100) {
                document.getElementById(column.id).remove();
                alert('Este panel se desborda');
            } else {
                column.style.visibility = 'visible';
            }
        } else {
            alert('Debes de seleccionar un renglon');
        }
    }
}

function updateColumn() {
    var divSelected = $('#content').find('.Selected')[0];
    if (divSelected === undefined || divSelected === null) {
        alert('Selecciona una columna');
    } else {
        if (divSelected.id.toString().startsWith('col')) {
            var getWidht = document.getElementById('widhtCol').value;
            if (getWidht === '') {
                alert('Debes asignar un valor para actualizar');
                document.getElementById('widhtCol').focus();
                return;
            }
            var parentWidth = $('#' + divSelected.id).parent().width();
            var thiswidth = $('#' + divSelected.id).width();
            var orginalWidth = (thiswidth / parentWidth * 100).toFixed();
            var acumulateWidth = 0;
            $('#' + divSelected.parentNode.id).children().each(function () {
                var parentWidth = $(this).parent().width();
                var childWidth = ($(this).width() / parentWidth * 100).toFixed();
                acumulateWidth += parseFloat(childWidth);
            });
            var acumWithinOrigin = (acumulateWidth - orginalWidth);
            var compare = (parseFloat(acumWithinOrigin) + parseFloat(getWidht));
            if (parseFloat(compare) > 100) {
                var available = ((100 - acumulateWidth));
                if (available === 0) {
                    alert('Ya no hay espacio disponible para este contenedor');
                } else {
                    available += parseFloat(orginalWidth);
                    alert('No puedes actualizar este panel se desborda: \n- El maximo disponible para este panel es de: ' + available + '%');
                }
            } else {
                document.getElementById(divSelected.id).style.width = getWidht + '%';
            }
        }
    }
}

function quitColumn() {
    var divSelected = $('#content').find('.Selected')[0];
    var father = divSelected.parentNode;
    if (father.className === "mainPanelRow") {
        divSelected.remove();
        $('#' + father.id).children().each(function (i) { // Re-Order-Numbers
            var newId = $(this).attr('id').toString();
            var idIn = removeAfter(newId, 'R');
            var numToRep = idIn.substring(idIn.indexOf('col'), newId.length);
            numToRep = newId.toString().replace(idIn, 'col' + (i + 1));
            $(this).attr('id', numToRep);
        });
    }
    else {
        alert("Seleccione una columna");
    }
}

function createTab(parent, identifier) {
    var tab = document.createElement('div');
    tab.className = 'tab Selected';
    tab.id = 'tab' + (identifier + 1) + (parent === null ? '' : 'F' + parent.id);
    return tab;
}

function createContainerTab(parent, identifier) {
    var addContainTab = document.createElement('div');
    addContainTab.className = 'cTab Selected';
    addContainTab.style.width = '100%';
    addContainTab.style.height = 'auto';
    addContainTab.id = 'cTab' + (identifier + 1) + (parent === null ? '' : 'F' + parent.id);
    return addContainTab;
}

function createChildTabs(parent, identifier, container) {
    var btn = document.createElement('BUTTON');
    btn.id = 'btnTab' + (identifier + 1) + (parent === null ? '' : 'F' + parent.id);
    btn.className = 'tablinks';
    btn.setAttribute('onclick', "openTab(event,'" + container.id + "')");
    var t = document.createTextNode('Tab ' + (identifier + 1));
    btn.appendChild(t);
    return btn;
}

function createContainer(parent, identifier, withTitle) {
    var addContain = addContain = document.createElement('div');
    addContain.className = 'contain Selected';
    addContain.style.width = '100%';
    addContain.style.height = '100px';
    addContain.id = 'con' + (identifier + 1) + (parent === null ? '' : 'F' + parent.id);
    if (withTitle) {
        var h1 = document.createElement('H1');
        var text = document.createTextNode('Contenedor');
        h1.appendChild(text);
        h1.id = 'titlecon' + (identifier + 1) + (parent === null ? '' : 'F' + addContain.id);
        h1.className = 'titlecontain';
        h1.setAttribute('cambiaridioma', true);
        addContain.appendChild(h1);
    }
    return addContain;
}

function createRow(parent) {
    var addRowToContainer = document.createElement('div');
    var numberRowsInside = parent.childNodes.length;
    var newId = removeAfter(parent.id.toString(), 'S');
    // console.log("Numero de filas: " + numberRowsInside);
    // addMainDiv.id = 'row' + (identifier + 1) + (parent === null ? "" : "F" + parent.id);
    addRowToContainer.id = 'row' + (numberRowsInside + 1) + (parent === null ? '' : 'F' + parent.id);
    // addRowToContainer.id = 'row' + (numberRowsInside) + newId.toString() + "S" + identifier;
    addRowToContainer.className = 'mainPanelRow Selected';
    addRowToContainer.style.width = '100%';
    addRowToContainer.style.height = '96px';
    if (parent.style.height !== '') {
        parent.style.height = '';
    }
    return addRowToContainer;
}

function createColumn(parent) {
    var cbxWidht = document.getElementById('widhtCol');
    var getWidht = cbxWidht.value;
    getWidht = getWidht === '' ? 100 : getWidht;
    if (!getWidht) {
        alert('Seleccione un ancho de columna');
        document.getElementById('widhtCol').focus();
        return;
    }

    var typeCol = getTypeColumn(cbxWidht.selectedIndex);

    var addColToRow = document.createElement('div');
    var numberColsInside = parent.childNodes.length;
    //var newId = removeAfter(parent.id.toString(), 'S');
    addColToRow.id = 'col' + (numberColsInside + 1) + (parent === null ? '' : 'F' + parent.id);
    // addColToRow.id = 'col' + (numberColsInside + 1) + 'R' + newId.toString().replace("row", "") + "S" + identifier;
    addColToRow.className = 'mainPanelCol borderCol ' + typeCol + ' Selected';
    //addColToRow.style.width = getWidht + '%';
    addColToRow.style.visibility = 'hidden';
    parent.appendChild(addColToRow);
    var acumulateWidth = 0;
    $('#mainContent').find('.Selected').children().each(function () { // here
        var parentWidth = $(this).parent().width();
        var childWidth = ($(this).width() / parentWidth * 100).toFixed(4);
        acumulateWidth += parseFloat(childWidth);
    });
    //    if (acumulateWidth > 100) {
    //        console.log(addColToRow.id);
    //        document.getElementById(addColToRow.id).remove();
    //        alert("Este panel se desborda");
    //    } else {
    //        addColToRow.style.visibility = "visible";
    //    }

    addColToRow.style.visibility = 'visible';
    return addColToRow;
}

function getTypeColumn(getIndexWidht) {
    var typeCol = "";
    if (getIndexWidht === 0) {
        typeCol = "col-1";
    } else if (getIndexWidht === 1) {
        typeCol = "col-2";
    } else if (getIndexWidht === 2) {
        typeCol = "col-3";
    } else if (getIndexWidht === 3) {
        typeCol = "col-4";
    } else if (getIndexWidht === 4) {
        typeCol = "col-5";
    } else if (getIndexWidht === 5) {
        typeCol = "col-6";
    } else if (getIndexWidht === 6) {
        typeCol = "col-7";
    } else if (getIndexWidht === 7) {
        typeCol = "col-8";
    } else if (getIndexWidht === 8) {
        typeCol = "col-9";
    } else if (getIndexWidht === 9) {
        typeCol = "col-10";
    } else if (getIndexWidht === 10) {
        typeCol = "col-11";
    } else if (getIndexWidht === 11) {
        typeCol = "col-12";
    }
    return typeCol;
}

function updateRows() {
    var tabid = $('.nav-tabs .active').closest('li').index() + 1;
    var divSelected = $('#mainTab' + tabid).children('.Selected')[0];
    var heightCont = document.getElementById('heighDiv').value;
    if (divSelected === undefined || divSelected === null) {
        alert('Selecciona un contenedor');
        return;
    }

    if (heightCont === '') {
        alert('Debes asignar un valor para actualizar');
        document.getElementById('heighDiv').focus();
        return;
    }
    document.getElementById(divSelected.id).style.height = heightCont + '%';
}

function addComponent() {
    var selCom = document.getElementById('getComponent');
    createComponent(selCom);
    //Select columns
}
//Pixelage
function charactersToPx(numberCharacters) {
    var charToPx = numberCharacters * 9;
    //var rounded = Math.round(charToPx);
    //var pixel = rounded * 100;
    //var percentage = (pixel / 1000) * 100;
    // return percentage + "%";
    return charToPx + "px";
    //return "100%";
}

function createComponent(selCom) {
    var divSelected = $('#content').find('.Selected')[0];
    var campoTabla = false;
    var eslista = false;
    var capturaRango = false;
    var idiv3;
    var selectComponent;
    var propsComponent = undefined;
    var configCaptura = undefined;
    if (divSelected === undefined || divSelected === null) {
        alert('Debes de seleccionar una columna');
    } else {
        if (divSelected.id.toString().startsWith('col')) {
            var elemen = $('#' + divSelected.id.toString()).children();
            if (elemen.length > 0 && contcompo === 0) {//nuevo para los ids
                contcompo = ultimoID(elemen) + 1;
            } else {
                contcompo++;
            }
            if (selCom.id === 'getComponent') {
                selectComponent = selCom.options[selCom.selectedIndex].value;
                campoTabla = false;
            } else if (selCom.id === 'getNameColumn') {
                selectComponent = selCom.options[selCom.selectedIndex].value;
                campoTabla = true;
            } else if (selCom.id === 'getNameParam') {
                selectComponent = selCom.options[selCom.selectedIndex].value;
                campoTabla = true;
            }
            var properties = new Object();
            var addtoPanel = false;
            properties.addtoPanel = addtoPanel;
            properties.parent = divSelected;
            var getWidht = "100%";
            // var getWidht = document.getElementById('widhtDivComp').value;
            getWidht = getWidht === '' ? 0 : getWidht;
            properties.width = getWidht;
            var getHeight = document.getElementById('heightDivComp').value;
            if (!campoTabla) {
                getHeight = getHeight === '' ? 0 : getHeight;
                properties.height = getHeight;
            }
            numberCompInside = contcompo;
            var nameGlobal = "";
            numberCompInsideDiv = $('.mainPanelDivGroup').length;
            if (numberCompInside === 0) {
                nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                numberCompInside = parseInt(numberCompInside) + 1;
            } else {
                var sumchildres = contcompo;
                numberCompInside = parseInt(sumchildres) + 1;
                nameGlobal = 'T' + numberCompInside + (divSelected === null ? '' : 'F' + divSelected.id);
            }
            properties.nameGlobal = nameGlobal;
            var addComp = '';
            var displayIn = $('#compWay').val();
            properties.displayIn = displayIn;
            if (selectComponent !== '0') {
                var typeAcces = sessionStorage.getItem('mode');
                typeAcces = JSON.parse(typeAcces);
                if (campoTabla) {
                    propsComponent = JSON.parse(selectComponent);
                    var searchSource = propsComponent.id;
                    if ($(".content [source=" + searchSource + "]").length > 0) {
                        alert("Este componente ya existe");
                        return;
                    }
                    configCaptura = JSON.parse(propsComponent['configuracionTipoCaptura']);
                    properties.source = propsComponent['id'];
                    if (typeAcces) {//fileCapture
                        if (typeAcces[1] === 'fileCaptureSelect') {
                            properties.kind = "filter";
                        } else if (typeAcces[1] === 'fileCaptureSearch') {
                            properties.kind = "filter";
                        }
                    }
                }

                /*Tipos de dato:
                 Relacion = 0,
                 Texto = 1,
                 Entero = 2,
                 Double = 3,
                 Fecha = 4,
                 Boleano = 5,
                 Lista = 6,
                 Equivalencias = 7,
                 OrigeDatos = 8,
                 */
                if (typeAcces) {
                    if (typeAcces[4] === "5" && propsComponent !== undefined) {
                        if (listaCamposTCMasiva2[propsComponent['id']]['global'] === 1) {
                            listaCamposTCMasiva2[propsComponent['id']]['existeCap'] = true;
                        } else {
                            listaCamposTCMasiva2[propsComponent['id']]['existeDet'] = true;
                        }
                    }
                }
                if (selectComponent === 'LABEL') {
                    addComp = createLabel(properties);
                    properties.maxWidth = "100%";// was "500px"
                    var idiv2 = createDiv(addComp, properties);
                    addComp = idiv2;
                } else if (selectComponent === 'TextBox' || ((configCaptura !== undefined && configCaptura['tipoCaptura'] === "1") && (propsComponent !== undefined && (propsComponent['tipoDeDato'] === 1 || propsComponent['tipoDeDato'] === 2 || propsComponent['tipoDeDato'] === 3)))) {
                    addComp = createLabel(properties);
                    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    if (campoTabla) {
                        addComp.innerHTML = propsComponent['campo'];
                        addComp.id = 'lbl_' + propsComponent['campo'];
                    }
                    var idiv2 = createDiv(addComp, properties);
                    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.width = getWidht;
                    properties.nameGlobal = nameGlobal;
                    addComp = createTexbox(properties, propsComponent === undefined ? undefined : propsComponent['tipoDeDato'], configCaptura === undefined ? undefined : configCaptura['tipoCaptura']);
                    if (configCaptura) {
                        if (configCaptura['isPassword'] === true) {
                            addComp.type = "password";
                        }
                    }

                    if (campoTabla) {
                        addComp.id = 'txt_' + propsComponent['campo'];
                        idiv2.style.maxWidth = charactersToPx(propsComponent['compAncho']);
                        //idiv2.style.maxWidth = propsComponent['compAncho'] + "%";
                        // idiv2.style.width = "100%";
                    }
                    addComp = addelementtodiv(idiv2, addComp);
                } else if (selectComponent === 'SpinEdit' || ((configCaptura !== undefined && configCaptura['tipoCaptura'] === "1") && (propsComponent !== undefined && (propsComponent['tipoDeDato'] === 2)))) {
                    addComp = createLabel(properties);
                    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    if (campoTabla) {
                        addComp.innerHTML = propsComponent['campo'];
                        addComp.id = 'lbl_' + propsComponent['campo'];
                    }
                    var idiv2 = createDiv(addComp, properties);
                    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.width = getWidht;
                    properties.nameGlobal = nameGlobal;
                    addComp = createSpinEdit(properties, propsComponent === undefined ? undefined : propsComponent['tipoDeDato'], configCaptura === undefined ? undefined : configCaptura['tipoCaptura']);
                    if (campoTabla) {
                        addComp.id = 'txt_' + propsComponent['campo'];
                        idiv2.style.maxWidth = charactersToPx(propsComponent['compAncho']);
                        // idiv2.style.maxWidth = propsComponent['compAncho'] + "%";
                        //idiv2.style.width = "100%";
                    }

                    addComp = addelementtodiv(idiv2, addComp);
                } else if (selectComponent === 'DateTimePicker' || ((configCaptura !== undefined && configCaptura['tipoCaptura'] === "1") && (propsComponent !== undefined && propsComponent['tipoDeDato'] === 4))) {
                    addComp = createLabel(properties);
                    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    if (campoTabla) {
                        addComp.innerHTML = propsComponent['campo'];
                        addComp.id = 'lbl_' + propsComponent['campo'];
                    }
                    var idiv2 = createDiv(addComp, properties);
                    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    properties.width = getWidht;
                    addComp = createDateTimePicker(properties, propsComponent === undefined ? undefined : propsComponent['tipoDeDato'], configCaptura === undefined ? undefined : configCaptura['tipoCaptura']);
                    if (campoTabla) {
                        addComp.id = 'txt_' + propsComponent['campo'];
                        idiv2.style.maxWidth = charactersToPx(propsComponent['compAncho']);
                        // idiv2.style.maxWidth = propsComponent['compAncho'] + "%";
                        // idiv2.style.width = "100%";
                    }
                    addComp = addelementtodiv(idiv2, addComp);
                } else if (selectComponent === 'Time' || ((configCaptura !== undefined && configCaptura['tipoCaptura'] === "1") && (propsComponent !== undefined && propsComponent['tipoDeDato'] === 6))) {
                    addComp = createLabel(properties);
                    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    if (campoTabla) {
                        addComp.innerHTML = propsComponent['campo'];
                        addComp.id = 'lbl_' + propsComponent['campo'];
                    }
                    var idiv2 = createDiv(addComp, properties);
                    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    properties.width = getWidht;
                    addComp = createTime(properties, propsComponent === undefined ? undefined : propsComponent['tipoDeDato'], configCaptura === undefined ? undefined : configCaptura['tipoCaptura']);
                    if (campoTabla) {
                        addComp.id = 'txt_' + propsComponent['campo'];
                        idiv2.style.maxWidth = charactersToPx(propsComponent['compAncho']);
                        // idiv2.style.maxWidth = propsComponent['compAncho'] + "%";
                        // idiv2.style.width = "100%";
                    }
                    addComp = addelementtodiv(idiv2, addComp);
                } else if (selectComponent === 'H1' || (propsComponent !== undefined && propsComponent['tipoCaptura'] === 'H1')) {//veryfy globals Name          
                    addComp = createH1(properties);
                    var idiv2 = createDiv(addComp, properties);
                    addComp = idiv2;
                } else if (selectComponent === 'H2' || (propsComponent !== undefined && propsComponent['tipoCaptura'] === 'H2')) {
                    addComp = createH2(properties);
                    var idiv2 = createDiv(addComp, properties);
                    addComp = idiv2;
                } else if (selectComponent === 'H3' || (propsComponent !== undefined && propsComponent['tipoCaptura'] === 'H3')) {
                    addComp = createH3(properties);
                    var idiv2 = createDiv(addComp, properties);
                    addComp = idiv2;
                } else if (selectComponent === 'H4' || (propsComponent !== undefined && propsComponent['tipoCaptura'] === 'H4')) {
                    addComp = createH4(properties);
                    var idiv2 = createDiv(addComp, properties);
                    addComp = idiv2;
                } else if (selectComponent === 'ComboBox' || ((configCaptura !== undefined && (configCaptura['tipoCaptura'] === "2" || configCaptura['tipoCaptura'] === "3" || configCaptura['tipoCaptura'] === "4")) && ((propsComponent !== undefined || (propsComponent['tipoDeDato'] === 0 || propsComponent['tipoDeDato'] === 6 || propsComponent['tipoDeDato'] === 7 || propsComponent['tipoDeDato'] === 1))))) {
                    addComp = createLabel(properties);
                    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    var titulo;
                    if (campoTabla) {
                        addComp.innerHTML = propsComponent['campo'];
                        addComp.id = 'lbl_' + propsComponent['campo'];
                        properties.width = propsComponent['compAncho'];
                        titulo = propsComponent['campo'];
                    }

                    var idiv2 = createDiv(addComp, properties);
                    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.width = getWidht;
                    properties.nameGlobal = nameGlobal;
                    var totalelemen;
                    if (configCaptura !== undefined && propsComponent !== undefined) {
                        if (configCaptura['tipoCaptura'] === "2") {
                            var listavalor = configCaptura['lista'];
                            totalelemen = listavalor.length;
                        } else if (configCaptura['tipoCaptura'] === "3") {
                            var listavalor = configCaptura['equivalencias'];
                            var cont = 0;
                            for (var key in listavalor) {
                                cont++;
                            }
                            totalelemen = cont;
                        }
                        tipoDato = propsComponent['tipoDeDato'];
                        tipoCaptura = configCaptura['tipoCaptura'];
                    }
                    addComp = createComboBox(properties, tipoDato, tipoCaptura, totalelemen, titulo);
                    if (campoTabla) {
                        if (sessionStorage.getItem(typeAcces[1]) === "fileCaptureDetalle") {
                            addComp.id = 'txt_' + propsComponent['campo'] + "_Detalle";
                            if (fuenteDatosPrincipal === "MovNomConcep" && propsComponent['campo'] === "concepNomDefi_ID") {
                                alert("Este es un campo global pero al selecionar un valor de este se van a mostrar campos extras en la captura");
                            }
                        } else {
                            addComp.id = 'txt_' + propsComponent['campo'];
                            if (fuenteDatosPrincipal === "MovNomConcep" && propsComponent['campo'] === "concepNomDefi_ID") {
                                alert("Con este campo la tabla para el detalle va mostrar ciertas columnas pero a la hora de ejecucion de la pantalla");
                            }
                        }
                        idiv2.style.maxWidth = charactersToPx(propsComponent['compAncho']);
                        //addComp.setAttribute('nombre',propsComponent['campo']);
                        // idiv2.style.maxWidth = propsComponent['compAncho'] + "%";
                        //idiv2.style.width = "100%";
                    }
                    if (propsComponent !== undefined && propsComponent['capturaRango']) {
                        if (propsComponent['capturaRango'] === true) {
                            var labelini = idiv2.querySelector('label');
                            labelini.id = "lbl_inicio" + propsComponent['campo'];
                            labelini.innerText = "Del " + propsComponent['campo'];
                            var selctini = addComp.querySelector('select');
                            selctini.id = "txt_inicio" + propsComponent['campo'];
                            selctini.setAttribute("rango", "inicio");
                            var proper = properties;
                            proper.width = "100%";
                            var label = createLabel(proper);
                            //var label = idiv2.querySelector("label");
                            label.innerText = "Al " + propsComponent['campo'];
                            label.id = "lbl_fin" + propsComponent['campo'];
                            properties.width = propsComponent['compAncho'];
                            titulo = propsComponent['campo'];
                            idiv3 = createDiv(label, properties);
                            nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                            properties.width = getWidht;
                            properties.nameGlobal = nameGlobal;
                            var totalelemen;
                            if (configCaptura !== undefined && propsComponent !== undefined) {
                                if (configCaptura['tipoCaptura'] === "2") {
                                    var listavalor = configCaptura['lista'];
                                    totalelemen = listavalor.length;
                                } else if (configCaptura['tipoCaptura'] === "3") {
                                    var listavalor = configCaptura['equivalencias'];
                                    var cont = 0;
                                    for (var key in listavalor) {
                                        cont++;
                                    }
                                    totalelemen = cont;
                                }
                                tipoDato = propsComponent['tipoDeDato'];
                                tipoCaptura = configCaptura['tipoCaptura'];
                            }
                            var divselfin = createComboBox(properties, tipoDato, tipoCaptura, totalelemen, titulo);
                            var selectfin = divselfin.querySelector('select');
                            selectfin.id = "txt_fin" + propsComponent['campo'];
                            selectfin.setAttribute("rango", "fin");
                            idiv3.style.maxWidth = charactersToPx(propsComponent['compAncho']);
                            idiv3.appendChild(divselfin);
                            capturaRango = true;
                        }
                    } else {
                        idiv2.appendChild(addComp);
                    }

                    //idiv2.appendChild(addComp);
                    addComp = addelementtodiv(idiv2, addComp);
                } else if (selectComponent === 'CheckBox' || ((propsComponent !== undefined && propsComponent['tipoDeDato'] === 5) && (configCaptura !== undefined && (configCaptura['tipoCaptura'] === "1")))) {
                    var titulo = undefined;
                    if (campoTabla) {
                        titulo = propsComponent['campo'];
                        //addComp.id = 'lbl_' + propsComponent['campo'];
                        //properties.width = propsComponent['compAncho'];
                    }
                    addComp = createCheckBox(properties, divSelected, propsComponent === undefined ? undefined : propsComponent['tipoDeDato'], configCaptura === undefined ? undefined : configCaptura['tipoCaptura'], titulo);
                    var idiv2 = createDiv(addComp, properties);
                    if (campoTabla) {
                        idiv2.style.maxWidth = charactersToPx(propsComponent['compAncho']);
                    }

                    addComp = idiv2;
                } else if (selectComponent === 'RadioButton' || ((propsComponent !== undefined && propsComponent['tipoDeDato'] === 6) && (configCaptura !== undefined && (configCaptura['tipoCaptura'] === "2")))) {
                    var tipoDato;
                    var tipoCaptura;
                    var total;
                    if (configCaptura !== undefined && propsComponent !== undefined) {
                        if (configCaptura['tipoCaptura'] === "2") {
                            var listavalor = configCaptura['lista'];
                            total = listavalor.length;
                        } else if (configCaptura['tipoCaptura'] === "3") {
                            var listavalor = configCaptura['equivalencias'];
                            var cont = 0;
                            for (var key in listavalor) {
                                cont++;
                            }
                            total = cont;
                        }
                        tipoDato = propsComponent['tipoDeDato'];
                        tipoCaptura = configCaptura['tipoCaptura'];
                        if (total > 0) {
                            var labelTitulo = document.createElement('LABEL');
                            labelTitulo.id = "idtitulo";
                            labelTitulo.className = "mainPanelContentComponents";
                            labelTitulo.style.maxWidth = "100%";
                            labelTitulo.style.width = "100%";
                            var div2 = document.createElement("DIV");
                            div2.id = "contRadio";
                            div2.className = "mainPanelDivGroup";
                            div2.style.maxWidth = "100%";
                            div2.style.width = propsComponent['compAncho'] + "%";
                            div2.appendChild(labelTitulo);
                            for (var i = 0; i < total; i++) {
                                //properties.nameGlobal = "valor" + (i + 1);
                                addComp = createRadioButton(properties, divSelected, tipoDato, tipoCaptura, total, propsComponent['campo']);
                                // addComp.setAttribute('titulo',propsComponent['campo']);
                                div2.appendChild(addComp);
                                // divSelected.appendChild(addComp);
                                // eslista = true;
                            }
                            divSelected.appendChild(div2);
                            eslista = true;
                        }
                    } else {
                        addComp = createRadioButton(properties, divSelected, tipoDato, tipoCaptura);
                        var idiv2 = createDiv(addComp, properties);
                        if (campoTabla) {
                            idiv2.style.maxWidth = charactersToPx(propsComponent['compAncho']);
                        }
                        addComp = idiv2;
                    }

                } else if (selectComponent === 'Edit') {

                    addComp = createEdit(properties, divSelected, tipoDato, tipoCaptura);

                    //var idiv2 = createDiv(addComp, properties);
                    //if (campoTabla) {
                    //    idiv2.style.maxWidth = charactersToPx(propsComponent['compAncho']);
                    //}
                    addComp = addComp;


                } else if (selectComponent === 'Table' || (propsComponent !== undefined && propsComponent['tipoCaptura'] === 'Table')) {
                    var namechecks = new Array();
                    namechecks = getChecksTree();
                    var count = 0;
                    for (var i = 0; i < namechecks.length; i++) {
                        if (namechecks[i].checked === true) {
                            count++;
                        }
                    }
                    if (count > 0) {
                        count += 2;
                        var numrec = document.getElementById("textNumRec").value;
                        addComp = createTable(properties, namechecks, numrec);
                    } else {
                        var concepArriba = false;
                        if (fuenteDatosPrincipal === 'MovNomConcep') {
                            var conte = document.getElementById('mainContent');
                            var element = conte.querySelectorAll('select');
                            for (var i = 0; i < element.length; i++) {
                                if (element[i].className === "mainPanelContentComponents") {
                                    if (element[i].tagName === "SELECT") {
                                        if (element[i].id.includes('concepNomDefi_ID')) {
                                            concepArriba = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (concepArriba) {
                                namechecks[0] = 'empleados';
                                namechecks[1] = 'nombre';
                            }
                        }
                        addComp = createTable(properties, namechecks);
                    }
                } else if (selectComponent === 'Button' || (propsComponent !== undefined && propsComponent['tipoCaptura'] === 'Button')) {
                    addComp = createButton(properties);
                    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    var idiv2 = createDiv(addComp, properties);
                    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    addComp = addelementtodiv(idiv2, addComp);
                } else if (selectComponent === 'BS' || (propsComponent !== undefined && propsComponent['tipoCaptura'] === 'BS')) {
                    addComp = createButtonSave(properties);
                    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    var idiv2 = createDiv(addComp, properties);
                    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    addComp = addelementtodiv(idiv2, addComp);
                } else if (selectComponent === 'BU' || (propsComponent !== undefined && propsComponent['tipoCaptura'] === 'BU')) {
                    addComp = createButtonUpdate(properties);
                    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    var idiv2 = createDiv(addComp, properties);
                    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    addComp = addelementtodiv(idiv2, addComp);
                } else if (selectComponent === 'BD' || (propsComponent !== undefined && propsComponent['tipoCaptura'] === 'BD')) {
                    addComp = createButtonDelete(properties);
                    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    var idiv2 = createDiv(addComp, properties);
                    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    addComp = addelementtodiv(idiv2, addComp);
                } else if (selectComponent === 'HR') {
                    properties.nameGlobal = "Linea";
                    properties.width = "100%";
                    addComp = createHr(properties);
                    nameGlobal = nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    var idiv2 = createDiv(addComp, properties);
                    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
                    properties.nameGlobal = nameGlobal;
                    addComp = addelementtodiv(idiv2, addComp);
                }
                var element = addComp;
                if (eslista === false) {
                    if (addComp === null) {
                        console.log("No existe componente en base a las propiedades adjuntadas");
                    } else {
                        divSelected.appendChild(addComp);
                        if (capturaRango) {
                            divSelected.appendChild(idiv3);
                        }
                    }
                }
                var father = divSelected.parentNode;
                showPropertiesCom(addComp);
                //console.log(divSelected.childNodes);
                if (divSelected.childNodes.length > 0) {
                    $('#' + father.id).css('height', '');
                } else {
                    // your element don't have overflow
                }
                // updateProperties(addComp, true);//Verify
                //if ((father.offsetHeight < father.scrollHeight) || (father.offsetWidth < father.scrollWidth)) {
                //    $('#' + father.id).css('height', '');
                //} else {
                //    // your element don't have overflow
                //}
            } else {
                if (campoTabla) {
                    alert('Debes de seleccionar un campo');
                } else {
                    alert('Debes de seleccionar un componente');
                }
            }
        } else {
            alert('Debes de seleccionar una columna');
        }
        if (selectComponent !== 'Table') {
            document.ready = document.getElementById("getComponent").value = '0';
        } else {
            document.getElementById('heightDivComp').value = 'Vacio';
        }
    }
    backSelectToFather();
}

function quitComponent() {
    var componentSelected = $('#content').find('.Selected')[0];
    if ($("#" + componentSelected.id).parent().attr('class') === "mainPanelRow") {
        var fatherRow = $(componentSelected).parents(".mainPanelRow");
        var totalCol = fatherRow[0].childNodes.length;
        var totalComp = 0;
        for (var i = 0; i < totalCol; i++) {
            if (componentSelected.id !== fatherRow[0].childNodes[i].id) {
                totalComp = totalComp + fatherRow[0].childNodes[i].childNodes.length;
            }

        }
        var childrenfatherRow = totalComp; //fatherRow[0].childNodes[0].childNodes.length;

        if (childrenfatherRow < 1) {
            fatherRow[0].style.height = "96px";
        }
        componentSelected.remove();
    } else if ($("#" + componentSelected.id).parent().attr('class').includes("mainPanelCol")) {
        var fatherRow = $(componentSelected).parents(".mainPanelRow");
        var totalCol = fatherRow[0].childNodes.length;
        var totalComp = 0;
        for (var i = 0; i < totalCol; i++) {
            totalComp = totalComp + fatherRow[0].childNodes[i].childNodes.length;
        }
        // alert(totalComp);
        var childrenfatherRow = totalComp;// fatherRow[0].childNodes[0].childNodes.length;

        if (childrenfatherRow <= 1) {
            fatherRow[0].style.height = "96px";
        }
        //        if (componentSelected.tagName === 'TABLE') {
        //            alert("ss");
        //            if (componentSelected.title) {
        //                var dato = componentSelected.title.split('-');
        //                removerDetalleTabla(dato[1]);//Verificar esto
        //            }
        //        }
        if (componentSelected.getAttribute('source')) {
            if (listaCamposTCMasiva2) {
                listaCamposTCMasiva2[componentSelected.getAttribute('source')]['existeCap'] = false;
                listaCamposTCMasiva2[componentSelected.getAttribute('source')]['existeDet'] = false;
            }

        }
        componentSelected.remove();
    } else if ($("#" + componentSelected.id).parent().attr('class') === "mainPanelDivGroup") {
        var deletecomponent = document.getElementById(componentSelected.id).parentNode;
        var fatherRow = $(componentSelected).parents(".mainPanelRow");
        var childrenfatherRow = fatherRow[0].childNodes[0].childNodes.length;
        if (childrenfatherRow <= 1) {
            fatherRow[0].style.height = "96px";
        }
        if (componentSelected.tagName === 'TABLE') {
            if (componentSelected.title) {
                removerDetalleTabla(componentSelected.title);
            }
        }
        deletecomponent.remove();
    } else if ($("#" + componentSelected.id).parents().hasClass("containerTable")) {
        var fatherRow = $(componentSelected).parents(".mainPanelCol");
        var totalCol = fatherRow[0].childNodes.length;
        var totalComp = 0;
        for (var i = 0; i < totalCol; i++) {
            totalComp = totalComp + fatherRow[0].childNodes[i].childNodes.length;
        }
        var childrenfatherRow = totalComp;

        if (childrenfatherRow <= 1) {
            fatherRow[0].style.height = "96px";
        }
        var deletecomponent = $("#" + componentSelected.id).closest('.containerTable');
        deletecomponent.remove();
    } else if ($("#" + componentSelected.id).parents().hasClass("select-style")) {

        var fatherRow1 = document.getElementById(componentSelected.id).parentNode;
        var deletecomponent = document.getElementById(fatherRow1.id).parentNode;
        var fatherRow = $(componentSelected).parents(".mainPanelRow");
        var childrenfatherRow = fatherRow[0].childNodes[0].childNodes.length;
        if (childrenfatherRow <= 1) {
            fatherRow[0].style.height = "96px";
        }
        if (componentSelected.tagName === 'TABLE') {
            if (componentSelected.title) {
                removerDetalleTabla(componentSelected.title);
            }
        }
        deletecomponent.remove();
    }
    else if ($("#" + componentSelected.id).parents().hasClass("editContainer")) {
        var fatherRow1 = document.getElementById(componentSelected.id).parentNode;
        var deletecomponent = document.getElementById(fatherRow1.id).parentNode.parentNode;
        var fatherRow = $(componentSelected).parents(".mainPanelRow");
        var childrenfatherRow = fatherRow[0].childNodes[0].childNodes.length;
        if (childrenfatherRow <= 1) {
            fatherRow[0].style.height = "96px";
        }

        deletecomponent.remove();
    }
    else {
        alert("Seleccione un componente");
    }
    document.ready = document.getElementById("getComponent").value = '0';
}

function clearSelect() {
    $('.mainPanelContentComponents').children('.Selected').removeClass('Selected');
    $('.mainPanelContent').children('.Selected').removeClass('Selected');
    $('.content').children('.Selected').removeClass('Selected');
    $('.mainPanelDivGroup').children('.Selected').removeClass('Selected');
}

function openTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = $('#' + evt.target.parentElement.parentElement.id).children('.contain');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' Selected', '');
    }
    document.getElementById(cityName).style.display = 'block';
    evt.currentTarget.className += ' Selected';
}

/*Start creators compents of screens html */
function createLabel(prop) {
    var addComp = document.createElement('LABEL');
    addComp.id = prop.nameGlobal;
    if (prop.source) {
        addComp.setAttribute('source', prop.source);
    }
    addComp.className = 'mainPanelContentComponents';
    //addComp.style.width = prop.width + prop.displayIn;
    addComp.style.width = prop.width;
    //addComp.style.width = "100%";
    addComp.innerHTML = 'Label';
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }
    return addComp;
}

function createTexbox(prop, tipoDato, tipoCaptura) {
    var addComp = document.createElement('INPUT');
    addComp.id = prop.nameGlobal;
    if (prop.source) {
        addComp.setAttribute('source', prop.source);
    }
    if (prop.kind) {
        addComp.setAttribute('kind', prop.kind);
    }
    if (tipoDato !== undefined) {
        addComp.setAttribute('tipoDato', tipoDato);
    }
    if (tipoCaptura !== undefined) {
        addComp.setAttribute('tipoCaptura', tipoCaptura);
    }
    addComp.setAttribute('type', 'text');
    addComp.className = 'mainPanelContentComponents';
    addComp.style.width = prop.width;
    //    addComp.style.width = prop.width + prop.displayIn;
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }
    return addComp;
}

function createSpinEdit(prop, tipoDato, tipoCaptura) {
    var addComp = document.createElement('input');
    addComp.id = prop.nameGlobal;
    if (prop.source) {
        addComp.setAttribute('source', prop.source);
    }
    if (prop.kind) {
        addComp.setAttribute('kind', prop.kind);
    }
    if (tipoDato !== undefined) {
        addComp.setAttribute('tipoDato', tipoDato);
    }
    if (tipoCaptura !== undefined) {
        addComp.setAttribute('tipoCaptura', tipoCaptura);
    }
    addComp.setAttribute('type', 'number');
    addComp.className = 'mainPanelContentComponents';
    addComp.style.width = prop.width + prop.displayIn;
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }
    return addComp;
}

function createDateTimePicker(prop, tipoDato, tipoCaptura) {
    var addComp = document.createElement('INPUT');
    addComp.id = prop.nameGlobal;
    if (prop.source) {
        addComp.setAttribute('source', prop.source);
    }
    if (prop.kind) {
        addComp.setAttribute('kind', prop.kind);
    }
    if (tipoDato !== undefined) {
        addComp.setAttribute('tipoDato', tipoDato);
    }
    if (tipoCaptura !== undefined) {
        addComp.setAttribute('tipoCaptura', tipoCaptura);
    }
    addComp.setAttribute('type', 'date');
    addComp.className = 'mainPanelContentComponents';
    addComp.style.width = prop.width;
    //addComp.style.width = prop.width + prop.displayIn;
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }
    return addComp;
}

function createH1(prop) {
    var addComp = document.createElement('H1');
    addComp.id = prop.nameGlobal;
    addComp.className = 'mainPanelContentComponents';
    //addComp.style.width = prop.width + prop.displayIn;
    addComp.style.width = prop.width;
    addComp.innerHTML = 'Titulo(Muy Grande)';
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }
    return addComp;
}

function createH2(prop) {
    var addComp = document.createElement('H2');
    addComp.id = prop.nameGlobal;
    addComp.className = 'mainPanelContentComponents';
    addComp.style.width = prop.width;
    //addComp.style.width = prop.width + prop.displayIn;
    addComp.innerHTML = 'Titulo(Grande)';
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }
    return addComp;
}

function createH3(prop) {
    var addComp = document.createElement('H3');
    addComp.id = prop.nameGlobal;
    addComp.className = 'mainPanelContentComponents';
    addComp.style.width = prop.width;
    addComp.innerHTML = "Titulo(Mediano)";
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";

    }
    return addComp;
}

function createH4(prop) {
    var addComp = document.createElement('H4');
    addComp.id = prop.nameGlobal;
    addComp.className = "mainPanelContentComponents";
    addComp.style.width = prop.width;
    addComp.innerHTML = "Titulo(Pequeño)";
    if (prop.height !== "Vacio") {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }
    return addComp;
}

function createComboBox(prop, tipoDato, tipoCaptura, totalelemen, titulo) {
    var addComp = document.createElement('SELECT');
    var divSelect = document.createElement('DIV');
    divSelect.className = "select-style";
    addComp.id = prop.nameGlobal;
    addComp.className = 'mainPanelContentComponents';
    addComp.style.width = prop.width;
    divSelect.style.width = prop.width;
    //addComp.style.width = prop.width + prop.displayIn;
    if (prop.source) {
        addComp.setAttribute('source', prop.source);
    }
    if (prop.kind) {
        addComp.setAttribute('kind', prop.kind);
    }
    if (tipoDato !== undefined) {
        addComp.setAttribute('tipoDato', tipoDato);
    }
    if (tipoCaptura !== undefined) {
        addComp.setAttribute('tipoCaptura', tipoCaptura);
    }
    if (totalelemen !== undefined) {
        addComp.setAttribute('totalelemen', totalelemen);
    }
    if (titulo !== undefined) {
        addComp.setAttribute('titulo', titulo);
    }
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }
    divSelect.appendChild(addComp);

    return divSelect;
}

function createTable(prop, numcol, numren) {
    if (typeof (numren) === 'undefined') {
        numren = 1;
    }

    var typeAcces = sessionStorage.getItem('mode');
    if (typeAcces) {
        if (typeAcces !== null) {
            typeAcces = JSON.parse(typeAcces);
        }
    }

    $('.mainPanelCol').removeClass('Selected');
    var containerTable = document.createElement('DIV');
    containerTable.id = "containerTable";
    containerTable.className = "mainPanelDivGroup containerTable";
    containerTable.setAttribute("sourcecontainer", fuenteDatosPrincipal);
    var typeForm = (typeAcces[1] === 'fileCapture' ? "capture"
            : typeAcces[1] === 'fileCaptureSelect' ? "selector"
            : typeAcces[1] === 'fileCaptureSearch' ? "search" : "");
    containerTable.setAttribute("mode", typeForm);
    var scrollIt = document.createElement('DIV');
    scrollIt.className = "mainPanelContentComponents scrollit";
    var addComp = document.createElement('TABLE');
    if (document.getElementById("textID")) {
        if (document.getElementById("textID").value !== "") {
            prop.nameGlobal = document.getElementById("textID").value;
        }
    }
    if (typeAcces[1] === 'fileCapture') {
        addComp.id = prop.nameGlobal + 'Detail';
    } else if (typeAcces[1] === 'fileCaptureSelect') {
        addComp.id = prop.nameGlobal + 'Select';
    } else if (typeAcces[1] === 'fileCaptureSearch') {
        addComp.id = prop.nameGlobal + 'Search';
    } else if (typeAcces[1] === 'fileCaptureSearch') {
        addComp.id = prop.nameGlobal + 'CaptureDetalle';
    } else {
        addComp.id = prop.nameGlobal;
    }
    addComp.className = 'mainPanelContentComponents';
    addComp.style.width = prop.width + prop.displayIn;
    //addComp.setAttribute('border', '10');
    addComp.setAttribute('Agregar', true);
    addComp.setAttribute('Editar', true);
    addComp.setAttribute('Eliminar', true);
    scrollIt.id = "scroll" + addComp.id;
    scrollIt.appendChild(addComp);
    containerTable.appendChild(scrollIt);
    var existchecks = (numcol === undefined ? -1 : numcol.length);
    var camposOrigenTabla = dataOriginTables[idfuenteOrigenPrincipal];
    if (existchecks > 0 || camposOrigenTabla.length > 0) {
        var namescolumns = new Array();
        var resulsplit = new Array();
        var l = 0;
        if (existchecks > 0) {
            for (var j = 0; j < existchecks; j++) {
                if (numcol[j].id) {
                    if (numcol[j].id.indexOf("children") !== -1) {
                        resulsplit = numcol[j].id.split("children");
                        namescolumns[l] = resulsplit[1];
                        l++;
                    }
                } else {
                    namescolumns = numcol;
                    break;
                }
            }
        } else if (typeAcces[1] === 'fileCapture' || typeAcces[1] === 'fileCaptureSelect' ||
                typeAcces[1] === 'fileCaptureSearch' || typeAcces[1] === 'fileCaptureDetalle') {
            if (fuenteDatosPrincipal !== 'MovNomConcep') {
                if (typeAcces[4] === "5") {
                    for (var k = 0; k < camposOrigenTabla.length; k++) {
                        if (camposOrigenTabla[k]['activarCaptura'] === true) {
                            if (listaCamposTCMasiva2[camposOrigenTabla[k]['id']]['global'] === 0) {
                                listaCamposTCMasiva2[camposOrigenTabla[k]['id']]['existeDet'] = true;
                                namescolumns[namescolumns.length] = camposOrigenTabla[k]['campo'];
                            }
                        }
                    }
                } else {
                    for (var k = 0; k < camposOrigenTabla.length; k++) {
                        // namescolumns.push([camposOrigenTabla[k]['campo'], camposOrigenTabla[k]['subOrigen']]);
                        namescolumns[k] = camposOrigenTabla[k]['campo'];
                    }
                }
            } else {
                if (typeAcces[4] === "5") {
                    for (var k = 0; k < camposOrigenTabla.length; k++) {
                        if (camposOrigenTabla[k]['activarCaptura'] === true) {
                            if (listaCamposTCMasiva2[camposOrigenTabla[k]['id']]['global'] === 0) {
                                listaCamposTCMasiva2[camposOrigenTabla[k]['id']]['existeDet'] = true;
                                //console.log(listaCamposTCMasiva);
                                namescolumns[namescolumns.length] = camposOrigenTabla[k]['campo'];
                                if (camposOrigenTabla[k]['campo'] === "concepNomDefi_ID") {
                                    namescolumns[namescolumns.length] = "Valor 1";
                                    namescolumns[namescolumns.length] = "Valor 2";
                                    namescolumns[namescolumns.length] = "Valor 3";
                                } //else {
                            }
                        }
                    }
                } else {
                    for (var k = 0; k < camposOrigenTabla.length; k++) {
                        namescolumns[k] = camposOrigenTabla[k]['campo'];
                    }
                }
            }
        }
        //console.log(namescolumns);
        if (typeAcces[1] === 'fileCapture' || typeAcces[1] === 'fileCaptureSelect') {
            if (fuenteDatosPrincipal !== undefined) {
                //addComp.title = idfuenteOrigenPrincipal + '-' + fuenteDatosPrincipal;
                namescolumns[namescolumns.length] = 'Editar';
                namescolumns[namescolumns.length] = 'Eliminar';
            }
        } else if (typeAcces[1] === 'fileCaptureSearch') {
            // addComp.title = idfuenteOrigenPrincipal + '-' + fuenteDatosPrincipal;
            namescolumns[namescolumns.length] = 'Selecionar';
        } else if (typeAcces[1] === 'fileCaptureDetalle') {
            // addComp.title = idfuenteOrigenPrincipal + '-' + fuenteDatosPrincipal;
        }

        addComp.setAttribute('tableidentifier', idfuenteOrigenPrincipal + '|' + fuenteDatosPrincipal);
        // Crea las celdas
        for (var i = 0; i < numren; i++) {
            // Crea los encabezados de la tabla
            var encabezado = document.createElement("tr");
            encabezado.id = "header" + fuenteDatosPrincipal;
            if (i === 0) {
                for (var h = 0; h < namescolumns.length; h++) {
                    var th = document.createElement("TH");
                    var textoth = document.createTextNode(namescolumns[h]);
                    th.id = textoth.nodeValue;
                    if (namescolumns[h] === 'Editar' || namescolumns[h] === 'Eliminar'
                            || namescolumns[h] === 'Selecionar') {
                        th.id = "tb" + textoth.nodeValue;
                    } else {
                        for (var k = 0; k < camposOrigenTabla.length; k++) {
                            if (namescolumns[h] === camposOrigenTabla[k]['campo']) {
                                var subOrigin = camposOrigenTabla[k]['subOrigen'];
                                if (subOrigin) {
                                    textoth = document.createTextNode(subOrigin);
                                    if (namescolumns[h].includes("_ID")) {
                                        var fieldSub = subOrigin;
                                        fieldSub = fieldSub.charAt(0).toLowerCase() + fieldSub.slice(1) + ".id";
                                        th.setAttribute('fieldSource', fieldSub);
                                        th.setAttribute('idetiqueta', camposOrigenTabla[k]['idEtiqueta']);
                                    }
                                } else {
                                    th.setAttribute('fieldSource', namescolumns[h]);
                                    th.setAttribute('idetiqueta', camposOrigenTabla[k]['idEtiqueta']);

                                }
                            }
                        }
                    }
                    th.appendChild(textoth);
                    encabezado.appendChild(th);
                }
            } else {
                for (var j = 0; j < namescolumns.length; j++) {
                    var celda = document.createElement("td");
                    var textoCelda = document.createTextNode("celda en la fila " + i + ", columna " + j);
                    celda.appendChild(textoCelda);
                    encabezado.appendChild(celda);
                }
            }
            addComp.appendChild(encabezado);
        }
    }
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        //addComp.style.height = pixels + "px";
    }
    return containerTable;
}

function createCheckBox(prop, divSelected, tipoDato, tipoCaptura, titulo) {

    var addComp = document.createElement('INPUT');

    addComp.type = 'checkbox';
    addComp.className = 'mainPanelContentComponents';
    // addComp.style.display = 'inline';
    if (prop.source) {
        addComp.setAttribute('source', prop.source);
    }
    if (prop.kind) {
        addComp.setAttribute('kind', prop.kind);
    }
    if (tipoDato !== undefined) {
        addComp.setAttribute('tipoDato', tipoDato);
    }
    if (tipoCaptura !== undefined) {
        addComp.setAttribute('tipoCaptura', tipoCaptura);
    }
    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    prop.nameGlobal = nameGlobal;
    var idiv2 = createDiv(addComp, prop);
    idiv2.className = "containerSelectors";
    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    prop.nameGlobal = nameGlobal;
    var labelCheck = document.createElement('LABEL');
    labelCheck.id = prop.nameGlobal;
    labelCheck.className = ' containerCheck';
    labelCheck.setAttribute('for', prop.nameGlobal);
    addComp.id = prop.nameGlobal;

    if (titulo !== undefined) {
        labelCheck.innerHTML = titulo;
    } else {
        labelCheck.innerHTML = 'Mi componente';
    }
    //labelCheck.style.display = 'inline';
    if (prop.source) {
        labelCheck.setAttribute('source', prop.source);
    }
    var compcheck = addelementtodiv(idiv2, labelCheck);
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        compcheck.style.height = pixels + "px";
    }

    return compcheck;
}

function createRadioButton(prop, divSelected, tipoDato, tipoCaptura, totalelemen, titulo) {
    var addComp = document.createElement('INPUT');

    addComp.type = 'radio';
    addComp.className = 'mainPanelContentComponents';
    addComp.name = 'one';//verify after this
    // addComp.style.display = 'inline';
    if (prop.source) {
        addComp.setAttribute('source', prop.source);
    }
    if (prop.kind) {
        addComp.setAttribute('kind', prop.kind);
    }
    if (tipoDato !== undefined) {
        addComp.setAttribute('tipoDato', tipoDato);
    }
    if (tipoCaptura !== undefined) {
        addComp.setAttribute('tipoCaptura', tipoCaptura);
    }
    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    prop.nameGlobal = nameGlobal;
    var idiv2 = createDiv(addComp, prop);
    idiv2.className = "containerSelectors";
    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    prop.nameGlobal = nameGlobal;
    var labelCheck = document.createElement('LABEL');
    labelCheck.id = prop.nameGlobal;
    labelCheck.className = ' containerRadio';
    labelCheck.setAttribute('for', prop.nameGlobal);
    addComp.id = prop.nameGlobal;

    if (titulo !== undefined) {
        labelCheck.innerHTML = titulo;
    } else {
        labelCheck.innerHTML = 'Mi componente';
    }
    //labelCheck.style.display = 'inline';
    if (prop.source) {
        labelCheck.setAttribute('source', prop.source);
    }
    var compcheck = addelementtodiv(idiv2, labelCheck);
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        compcheck.style.height = pixels + "px";
    }

    return compcheck;
}

function createEdit(prop, divSelected, tipoDato, tipoCaptura) {

    var addComp = document.createElement('DIV');
    addComp.id = prop.nameGlobal;
    addComp.className = 'editContainer';

    var labelEdit = document.createElement('LABEL');
    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    labelEdit.id = nameGlobal;
    labelEdit.className = "mainPanelContentComponents";
    labelEdit.innerHTML = 'Edit';

    var divEdit = document.createElement('DIV');
    nameGlobal = 'E' + (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    divEdit.id = nameGlobal;
    divEdit.className = 'edit';

    var editInputSearch = document.createElement('INPUT');
    nameGlobal = 'S' + (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    editInputSearch.id = nameGlobal;
    editInputSearch.className = "mainPanelContentComponents";
    editInputSearch.type = 'text';
    editInputSearch.className = 'editKey';
    editInputSearch.setAttribute('kind', 'filterKey');
    editInputSearch.placeholder = "Buscar";

    var editInputBrief = document.createElement('INPUT');
    nameGlobal = 'B' + (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    editInputBrief.id = nameGlobal;
    editInputBrief.className = "mainPanelContentComponents";
    editInputBrief.type = 'text';
    editInputBrief.className = 'editBrief';
    editInputBrief.placeholder = "...";
    editInputBrief.disabled = true;

    var editButton = document.createElement('BUTTON');
    nameGlobal = 'BU' + (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    editButton.id = nameGlobal;
    editButton.className = 'editButton';

    addComp.appendChild(labelEdit);
    divEdit.appendChild(editInputSearch);
    divEdit.appendChild(editInputBrief);
    divEdit.appendChild(editButton);
    addComp.appendChild(divEdit);

    var divGroup = createDiv(addComp, prop);



    return divGroup;
}

function createButton(prop) {
    var addComp = document.createElement('BUTTON');
    addComp.id = prop.nameGlobal;
    addComp.className = 'mainPanelContentComponents';
    addComp.innerHTML = "Boton";
    addComp.style.width = prop.width;
    // addComp.style.width = prop.width + prop.displayIn;
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }
    return addComp;
}

function createButtonSave(prop) {
    var addComp = document.createElement('BUTTON');
    addComp.id = prop.nameGlobal;
    addComp.setAttribute('onclick', "save()");
    addComp.className = 'mainPanelContentComponents';
    addComp.innerHTML = "Guardar";
    addComp.style.width = prop.width;
    // addComp.style.width = prop.width + prop.displayIn;
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }

    return addComp;
}

function createButtonUpdate(prop) {
    var addComp = document.createElement('BUTTON');
    addComp.id = prop.nameGlobal;
    addComp.setAttribute('onclick', "update()");
    addComp.className = 'mainPanelContentComponents';
    addComp.innerHTML = "Modificar";
    addComp.style.width = prop.width;
    // addComp.style.width = prop.width + prop.displayIn;
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }

    return addComp;
}

function createButtonDelete(prop) {
    var addComp = document.createElement('BUTTON');
    addComp.id = prop.nameGlobal;
    addComp.setAttribute('onclick', "deleteObject()");
    addComp.className = 'mainPanelContentComponents';
    addComp.innerHTML = "Eliminar";
    addComp.style.width = prop.width;
    //addComp.style.width = prop.width + prop.displayIn;
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }

    return addComp;
}

function createDiv(element, prop) {
    $('.mainPanelCol').removeClass('Selected');
    var idiv = document.createElement('DIV');
    idiv.id = 'DivGroup' + prop.nameGlobal;
    if (prop.source) {
        idiv.setAttribute('source', prop.source);
    }
    if (element.style.width !== "") {
        if (prop.maxWidth) {
            idiv.style.maxWidth = prop.maxWidth;
        } else {
            idiv.style.maxWidth = "100%";//was 500px
        }
    } else {
        if (element.type === "checkbox" || element.type === "radio") {
            idiv.style.maxWidth = "100%";//was 500px
            idiv.style.width = "100%";
        }
    }
    idiv.className = 'mainPanelDivGroup Selected';
    idiv.appendChild(element);
    return idiv;
}

function createHr(prop) {
    var addcomp = document.createElement('hr');
    if (prop.source) {
        addcomp.setAttribute('source', prop.source);
    }
    addcomp.size = "10";
    addcomp.setAttribute('noshade', true);
    addcomp.style.width = prop.width + prop.displayIn;
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addcomp.style.height = pixels + "px";
    }
    return addcomp;

}

function createTime(prop, tipoDato, tipoCaptura) {
    var addComp = document.createElement('INPUT');
    addComp.id = prop.nameGlobal;
    if (prop.source) {
        addComp.setAttribute('source', prop.source);
    }
    if (prop.kind) {
        //addComp.setAttribute('kind', prop.kind);
    }
    if (tipoDato !== undefined) {
        addComp.setAttribute('tipoDato', tipoDato);
    }
    if (tipoCaptura !== undefined) {
        addComp.setAttribute('tipoCaptura', tipoCaptura);
    }
    addComp.setAttribute('type', 'time');
    addComp.className = 'mainPanelContentComponents';
    addComp.style.width = prop.width;
    //addComp.style.width = prop.width + prop.displayIn;
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }
    return addComp;
}

/*Grow*/

/*Start properties components*/
function getPropertiesComponent() { //chk25
    var comp = document.getElementById('getComponent').value;
    var height = 0;
    var width = 0;
    //hacerlo un metodo... para extraer las propiedades de tamaÃ±os
    if (comp === 'LABEL') {
        height = 'Vacio';
        width = 100;
    }
    if (comp === 'TextBox') {
        height = 'Vacio';
        width = 100;
    }
    if (comp === 'DateTimePicker') {
        height = 'Vacio';
        width = 100;
    }
    if (comp === 'H1') {
        height = 'Vacio';
        width = 100;
    }
    if (comp === 'H2') {
        height = 'Vacio';
        width = 100;
    }
    if (comp === 'ComboBox') {
        height = 'Vacio';
        width = 100;
    }
    if (comp === 'CheckBox') {
        height = 'Vacio';
        width = 100;
    }
    if (comp === 'RadioButton') {
        height = 'Vacio';
        width = 100;
    }
    if (comp === 'Table') {
        height = 'Vacio';
        width = 100;
    }
    if (comp === 'Button') {
        height = 40;
        width = 100;
    }
    if (comp === 'BS') {
        height = 40;
        width = 100;
    }
    if (comp === 'BU') {
        height = 40;
        width = 100;
    }
    if (comp === 'BD') {
        height = 40;
        width = 100;
    }
    //document.getElementById('heightDivComp').value = height;
    if (document.getElementById('widhtDivComp')) {
        document.getElementById('widhtDivComp').value = width;
    }

}

function onlyValid(comp) {
    var x = comp.tagName;
    var validComp = ['LABEL',
        'INPUT', 'SELECT',
        'DIV', 'H1', 'H2', 'H3', 'H4', 'CHECKBOX',
        'RadioButton', 'TABLE',
        'BUTTON'];
    return (validComp.indexOf(x) > -1);
}

function setWidthAndHeigth(comp) {
    var componentSelected = null;
    if (comp === undefined || comp === null) {
        componentSelected = $('#content').find('.Selected')[0];
    } else {
        componentSelected = comp;
    }

    if (!$("#" + componentSelected.id).hasClass('mainPanelDivGroup')) {
        var heightComp = document.getElementById('heightDivComp').value;
    } else {
        if (componentSelected.style.height !== document.getElementById('heightDivComp').value) {
            var heightComp = document.getElementById('heightDivComp').value;
        }
    }

    var txtlong = document.getElementById('textLong');
    if (txtlong !== undefined && txtlong !== null) {
        var maxwidth1 = txtlong.value;
    }
    var widhtComp = document.getElementById('widhtDivComp');
    var father = componentSelected.parentNode;
    if (father.className === "mainPanelCol") {
        if (heightComp === '') {
            alert('Debes asignar un valor para actualizar');
            document.getElementById('heightDivComp').focus();
            return;
        }
        if (widhtComp) {
            if (widhtComp.value === '') {
                alert('Debes asignar un valor para actualizar');
                widhtComp.focus();
            }
            return;
        }
        var toDisplay = $('#compWay').val();
        if (heightComp !== 'Vacio') {
            var pixels = null;
            if (toDisplay === "%") {
                pixels = parseInt(heightComp);
            } else {
                pixels = parseInt(heightComp);
            }
            document.getElementById(componentSelected.id).style.height = pixels + "px";
        }
        if (widhtComp) {
            document.getElementById(componentSelected.id).style.width = widhtComp.value + toDisplay;
        }
    } else if (father.className === 'mainPanelDivGroup') {
        var typeewidth = typesizemaxWidth(componentSelected.style.width);
        var widthcompselect = componentSelected.style.width.replace(typeewidth, "");
        componentSelected.style.height = document.getElementById("heightDivComp").value + "px";
        if (widhtComp) {
            if (widthcompselect !== widhtComp.value) {
                componentSelected.style.width = widhtComp.value + document.getElementById("compWay").value;
            }
        }
        var typediv = typesizemaxWidth(father.style.maxWidth);
        var maxwidth2 = father.style.maxWidth.replace(typediv, "");
        if (maxwidth1) {
            if (maxwidth2 !== maxwidth1) {
                father.style.maxWidth = maxwidth1 + document.getElementById("cbsize").value;
            }
        }
    }
    //updateProperties(null, false);
}

function showPropertiesCom(comp) {
    if (onlyValid(comp)) {
        var tipoCompoData = null;
        // $("#panelProp").fadeOut('slow');
        var propComp = document.getElementById('propertiesComp');
        while (propComp.firstChild) {
            propComp.removeChild(propComp.firstChild);
        }
        if (comp.tagName === 'LABEL') {
            addID(propComp);
            addText(propComp);
            // addWidht(propComp);
            addLong(propComp);
            if (comp.getAttribute("isoculto")) {
                if (comp.getAttribute('isoculto') === "true") {
                    addValorInicial(propComp, comp.id);
                }
            }
        }
        else if (comp.tagName === "H1") {
            addID(propComp);
            addText(propComp);
            addWidht(propComp);
            addLong(propComp);
            //  addTemasH(propComp);
            if (comp.getAttribute('cambiaridioma')) {
                addTitulos(propComp);
            }

        }
        else if (comp.tagName === "H2") {
            addID(propComp);
            addText(propComp);
            addWidht(propComp);
            addLong(propComp);
            //addTemasH(propComp);
        } else if (comp.tagName === "H3") {
            addID(propComp);
            addText(propComp);
            addWidht(propComp);
            addLong(propComp);

        } else if (comp.tagName === "H4") {
            addID(propComp);
            addText(propComp);
            addWidht(propComp);
            addLong(propComp);

        }
        else if (comp.tagName === "HR") {
            //addButtonsMove(propComp);
        }
        else if (comp.tagName === "INPUT") {
            if (comp.type === "text" || comp.type === "date" || comp.type === "number" || comp.type === "time") {
                addID(propComp);
                //  addWidht(propComp); 
                addLong(propComp);
                addSelectComp(propComp);
                tipoCompoData = document.getElementById("tipoCompo");
                if (tipoCompoData) {
                    if (comp.getAttribute('tipoDato') === "1" || comp.getAttribute('tipoDato') === "3") {
                        var option = document.createElement("option");
                        option.text = "TextBox";
                        option.value = "text";
                        tipoCompoData.add(option);
                        tipoCompoData.disabled = true;
                    } else if (comp.getAttribute('tipoDato') === "2") {
                        var option = document.createElement("option");
                        option.text = "TextBox";
                        option.value = "text";
                        tipoCompoData.add(option);
                        var option2 = document.createElement("option");
                        option2.text = "SpinEdit";
                        option2.value = "number";
                        tipoCompoData.add(option2);
                        tipoCompoData.value = comp.type;
                    } else if (comp.getAttribute('tipoDato') === "4") {
                        var option = document.createElement("option");
                        option.text = "DateTimePicker";
                        option.value = "date";
                        tipoCompoData.add(option);
                        tipoCompoData.disabled = true;
                    } else if (comp.getAttribute('tipoDato') === "6") {
                        var option = document.createElement("option");
                        option.text = "Tiempo";
                        option.value = "time";
                        tipoCompoData.add(option);
                        tipoCompoData.disabled = true;
                    }
                }
            } else if (comp.type === "checkbox") {
                addSelectComp(propComp);
                tipoCompoData = document.getElementById("tipoCompo");
                if (tipoCompoData) {
                    if (comp.getAttribute('tipoDato') === "5") {
                        var option = document.createElement("option");
                        option.text = "checkbox";
                        option.value = "checkbox";
                        tipoCompoData.add(option);
                        tipoCompoData.disabled = true;
                    }
                }
            } else if (comp.type === "radio") {
                addID(propComp);
                addSelectComp(propComp);
                tipoCompoData = document.getElementById("tipoCompo");
                if (tipoCompoData) {
                    if ((comp.getAttribute('tipoDato') === "6" || comp.getAttribute('tipoDato') === "7" || comp.getAttribute('tipoDato') === "8") && (comp.getAttribute('tipocaptura') === "2" || comp.getAttribute('tipocaptura') === "3")) {
                        var option = document.createElement("option");
                        option.text = "ComboBox";
                        option.value = "select-one";
                        tipoCompoData.add(option);
                        var option2 = document.createElement("option");
                        option2.text = "RadioButton";
                        option2.value = "radio";
                        tipoCompoData.add(option2);
                        var option3 = document.createElement("option");
                        option3.text = "Lista";
                        option3.value = "Lista";
                        tipoCompoData.add(option3);
                        tipoCompoData.value = comp.type;
                    }

                }
            }
            addValorInicial(propComp, comp.id);
        }
        else if (comp.tagName === "SELECT") {

            addID(propComp);
            AddOnchange(propComp);
            addWidht(propComp);
            addLong(propComp);
            addSelectComp(propComp);

            tipoCompoData = document.getElementById("tipoCompo");

            if (tipoCompoData) {

                if (((comp.getAttribute('tipoDato') === "1" || comp.getAttribute('tipoDato') === "2" || comp.getAttribute('tipoDato') === "3" || comp.getAttribute('tipoDato') === "4"))) {
                    var option = document.createElement("option");
                    option.text = "ComboBox";
                    option.value = "select-one";
                    tipoCompoData.add(option);
                    var option2 = document.createElement("option");
                    option2.text = "RadioButton";
                    option2.value = "radio";
                    tipoCompoData.add(option2);
                    var option3 = document.createElement("option");
                    option3.text = "Lista";
                    option3.value = "Lista";
                    tipoCompoData.add(option3);

                } else if (comp.getAttribute('tipoDato') === "8") {

                    var option = document.createElement("option");
                    option.text = "ComboBox";
                    option.value = "select-one";
                    tipoCompoData.add(option);
                    var option3 = document.createElement("option");
                    option3.text = "Lista";
                    option3.value = "Lista";
                    tipoCompoData.add(option3);
                    var option4 = document.createElement("option");
                    option4.text = "Consulta";
                    option4.value = "Consulta";
                    tipoCompoData.add(option4);

                } else if (comp.getAttribute('tipoDato') === "0") {

                    var option = document.createElement("option");
                    option.text = "ComboBox";
                    option.value = "select-one";
                    tipoCompoData.add(option);
                    var option3 = document.createElement("option");
                    option3.text = "Lista";
                    option3.value = "Lista";
                    tipoCompoData.add(option3);
                    var option4 = document.createElement("option");
                    option4.text = "Consulta";
                    option4.value = "Consulta";
                    tipoCompoData.add(option4);

                }
                tipoCompoData.value = comp.type;

            }
            addValorInicial(propComp, comp.id);
        }
        else if (comp.tagName === "BUTTON") {

            addID(propComp);
            addText(propComp);
            AddOnclick(propComp);
            addSelectComp(propComp);
            if (comp.className.indexOf("tablinks") === -1) {
                addLong(propComp);
                tipoCompoData = document.getElementById("tipoCompo");
                if (tipoCompoData) {
                    var option = document.createElement("option");
                    option.text = "Boton";
                    option.value = "submit";
                    tipoCompoData.add(option);
                    tipoCompoData.disabled = true;
                }
            } else {

                tipoCompoData = document.getElementById("tipoCompo");
                if (tipoCompoData) {
                    var option = document.createElement("option");
                    option.text = "Tab";
                    option.value = "submit";
                    tipoCompoData.add(option);
                    tipoCompoData.disabled = true;

                }
            }
        }
        else if (comp.tagName === "DIV") {

            var divgroup = $("#" + comp.id).hasClass('mainPanelDivGroup');
            var divCol = $('#' + comp.id).hasClass('mainPanelCol');
            var selDivCmp = $('#' + comp.id).hasClass('editContainer');
            if (divgroup === true) {
                // addID(propComp);
                addLong(propComp);
            }

            if (divCol === true) {
                addStyleBorder(propComp);
                addStyleWidht(propComp);
                addBordeStyle(propComp);
            }
            if (selDivCmp === true) {
                addID(propComp);
                addLong(propComp);
            }

        }
        else if (comp.tagName === "TABLE") {
            addID(propComp);
            addNumColumns(propComp);
            addWidht(propComp);
            var camposOrigenTabla = null;
            var typeAcces = sessionStorage.getItem('mode');
            typeAcces = JSON.parse(typeAcces);
            var captura = typeAcces[4];
            var identifier = comp.attributes.tableidentifier.textContent;
            if (identifier.length > 0) {
                var dato = identifier.split('|');
                camposOrigenTabla = dataOriginTables[dato[0]];
                if (camposOrigenTabla === undefined) {
                    getCamposOrigenDetalle(dato[0]);
                    camposOrigenTabla = dataOriginTables[dato[0]];
                }
                var selectCombo = document.getElementById("cbxDetalle");
                if (selectCombo) {
                    selectCombo.value = dato[0];
                }
            }
            var namecolumns = [];
            if (captura === "5") {
                for (var i = 0; i < camposOrigenTabla.length; i++) {
                    if (listaCamposTCMasiva2[camposOrigenTabla[i]['id']]) {
                        if (listaCamposTCMasiva2[camposOrigenTabla[i]['id']]['global'] === 0) {
                            namecolumns[namecolumns.length] = camposOrigenTabla[i]['campo'];
                        }
                    }
                }
            } else {
                var divTree = document.createElement('DIV');
                divTree.id = "treeview";
                divTree.className = "treeview";
                buildTree(divTree, camposOrigenTabla);
                propComp.appendChild(divTree);
                activeselect();
                setSelectedColumns(comp);
            }
            addSelectComp(propComp);
            tipoCompoData = document.getElementById("tipoCompo");
            if (tipoCompoData) {
                var option = document.createElement("option");
                option.text = "Tabla";
                option.value = "TABLE";
                tipoCompoData.add(option);
                tipoCompoData.value = comp.tagName;
                tipoCompoData.disabled = true;
            }
            addChkTable(propComp)
            if (comp.getAttribute('Agregar') === "true") {
                document.getElementById('txtActivarAgregar').checked = true;
            }
            if (comp.getAttribute('Editar') === "true") {
                document.getElementById('txtActivarEditar').checked = true;
            }
            if (comp.getAttribute('Eliminar') === "true") {
                document.getElementById('txtActivarElimnar').checked = true;
            }
        }


        // $("#panelProp").fadeIn('slow');
    }
}


function setSelectedColumns(cmpTable) {
    var dataTh = [];
    $("#" + cmpTable.id + ' > tr > th').each(function () {
        if ($(this).attr("fieldsource")) {
            dataTh.push($(this).attr("fieldsource"));
        }
    });
    $(".treeview label input:checkbox").each(function () {
        var source = $(this).attr("fieldsource");
        if (source) {
            if (dataTh.includes(source)) {
                $(this).prop('checked', true);
            }
        }
    });
}

function couldChangeCmp(comp) {
    var go = false;
    if (comp.tagName === "LABEL") {
        go = true;
    }
    return go;
}

function updateProperties(comp, getProp) {

    var componentSelected = null;
    var componentIsChange = true;
    if (comp === undefined || comp === null) {
        componentSelected = $('#content').find('.Selected')[0];
    } else {
        componentSelected = comp;
    }
    if (document.getElementById('tipoCompo')) {
        var typeOfElem = null;
        if (componentSelected.getAttribute('type') !== null) {
            typeOfElem = componentSelected.getAttribute('type');
        }
        if ((typeOfElem === null || typeOfElem === undefined)) {
            typeOfElem = componentSelected.type;
            if ((typeOfElem === null || typeOfElem === undefined)) {
                typeOfElem = componentSelected.tagName;
            }
        }
        var typeSelecElem = document.getElementById('tipoCompo').value;
        if (typeOfElem !== typeSelecElem) {
            componentIsChange = false;
        }
    }
    if (componentIsChange) {
        if (onlyValid(componentSelected)) {
            if (getProp) {
                //Get general Widht andheight
                if (widthSetAsPixel(componentSelected)) {
                    if (document.getElementById("compWay")) {
                        document.getElementById("compWay").value = 'px';
                    }
                } else {
                    if (document.getElementById("compWay")) {
                        document.getElementById("compWay").value = '%';
                    }
                }
                if (document.getElementById('widhtDivComp')) {
                    document.getElementById('widhtDivComp').value = getRealWidth(componentSelected);
                }
            }
            //Set of other properties width and heigth
            setWidthAndHeigth();
            //Set of other properties
            if (document.getElementById("textID")) {
                if (getProp) {
                    document.getElementById("textID").value = componentSelected.id;
                } else {
                    document.getElementById("textID").value = componentSelected.id;
                    //                    document.getElementById(componentSelected.id).id = document.getElementById("textID").value;
                }
            }

            if (document.getElementById("textValue")) {
                document.getElementById("textValue").visible = true;
                if (getProp) {
                    if (componentSelected.tagName === "LABEL") {
                        document.getElementById("getComponent").value = 'LABEL';
                        document.getElementById("textValue").value = document.getElementById(componentSelected.id).innerHTML;
                    } else if (componentSelected.tagName === "H1") {
                        document.getElementById("textValue").value = document.getElementById(componentSelected.id).innerHTML;
                        if (document.getElementById(componentSelected.id).getAttribute('cambiaridioma')) {
                            if (document.getElementById(componentSelected.id).getAttribute('idetiqueta')) {
                                var titulo = document.getElementById(componentSelected.id).getAttribute('idetiqueta').split('/');
                                document.getElementById('cmbTitulosRecom').value = titulo[1];
                            }

                        }
                    } else if (componentSelected.tagName === "H2") {
                        document.getElementById("textValue").value = document.getElementById(componentSelected.id).innerHTML;
                        //if (document.getElementById(componentSelected.id).className.includes("primarytitle")) {
                        //    var valor = document.getElementById(componentSelected.id).className.replace('titlecontain ', '');
                        //    document.getElementById("cmbTipoTitulos").value = valor.replace(' Selected', '');
                        //} else if (document.getElementById(componentSelected.id).className.includes("secondarytitle")) {
                        //    var valor = document.getElementById(componentSelected.id).className.replace('titlecontain ', '');
                        //    document.getElementById("cmbTipoTitulos").value = valor.replace(' Selected', '');
                        //} else {
                        //    document.getElementById("cmbTipoTitulos").value = "Default";
                        //}
                    } else if (componentSelected.tagName === "H3") {
                        document.getElementById("textValue").value = document.getElementById(componentSelected.id).innerHTML;

                    } else if (componentSelected.tagName === "H4") {

                        document.getElementById("textValue").value = document.getElementById(componentSelected.id).innerHTML;
                    } else if (componentSelected.tagName === "INPUT") {

                        if (componentSelected.type === "text") {
                            document.getElementById("getComponent").value = 'TextBox';
                            if (componentSelected.type === "date") {
                                document.getElementById("getComponent").value = 'DateTimePicker';
                            }
                        }
                        document.getElementById("textValue").value = componentSelected.value;
                    } else if (componentSelected.tagName === "BUTTON") {

                        document.getElementById("textValue").value = componentSelected.innerText;
                    } else if (componentSelected.tagName === "TABLE") {
                        document.getElementById("getComponent").value = 'Table';
                    }
                    if (componentSelected.tagName === "DIV") {
                        if ($('#' + comp.id + ' :checkbox').length) {
                            document.getElementById("textValue").visible = false;
                        }
                    }
                } else {
                    if (componentSelected.tagName === "LABEL") {
                        document.getElementById(componentSelected.id).innerHTML = document.getElementById("textValue").value;
                        if (document.getElementById("cmbTipoTitulos")) {
                            if (document.getElementById("cmbTipoTitulos").value !== "Default") {
                                document.getElementById(componentSelected.id).className = document.getElementById(componentSelected.id).className + " " + document.getElementById("cmbTipoTitulos").value
                            }
                        }
                    } else if (componentSelected.tagName === "H1") {
                        document.getElementById(componentSelected.id).innerHTML = document.getElementById("textValue").value;
                        if (document.getElementById(componentSelected.id).getAttribute('cambiaridioma')) {
                            var id = fuenteDatosPrincipal + "Titulos/" + document.getElementById("cmbTitulosRecom").value;
                            document.getElementById(componentSelected.id).setAttribute('idetiqueta', id);
                        }
                    }
                    else if (componentSelected.tagName === "H2") {
                        document.getElementById(componentSelected.id).innerHTML = document.getElementById("textValue").value;
                        //if (document.getElementById("cmbTipoTitulos").value !== "Default") {
                        //    document.getElementById(componentSelected.id).className = "";
                        //    document.getElementById(componentSelected.id).className = "titlecontain " + document.getElementById(componentSelected.id).className + " " + document.getElementById("cmbTipoTitulos").value
                        //} else {
                        //    document.getElementById(componentSelected.id).className = "";
                        //    document.getElementById(componentSelected.id).className = "titlecontain";
                        //}
                    } else if (componentSelected.tagName === "H3") {
                        document.getElementById(componentSelected.id).innerHTML = document.getElementById("textValue").value;

                    } else if (componentSelected.tagName === "H4") {
                        document.getElementById(componentSelected.id).innerHTML = document.getElementById("textValue").value;
                    }
                    else if (componentSelected.tagName === "INPUT") {
                        if (componentSelected.type === "text") {
                            document.getElementById("getComponent").value = 'TextBox';
                            document.getElementById(componentSelected.id).value = document.getElementById("textValue").value;
                        }
                    } else if (componentSelected.tagName === "BUTTON") {

                        document.getElementById(componentSelected.id).innerText = document.getElementById("textValue").value;
                    }
                }
            }
            if (document.getElementById("textOnclik")) {
                if (getProp) {
                    document.getElementById("textOnclik").value = componentSelected.getAttribute("onclick");
                } else {
                    document.getElementById(componentSelected.id).setAttribute('onclick', document.getElementById("textOnclik").value);
                }
            }
            if (document.getElementById("textOnchange")) {
                if (getProp) {
                    document.getElementById("textOnchange").value = componentSelected.getAttribute("onchange");
                } else {
                    if (document.getElementById("textOnchange").value !== "") {
                        document.getElementById(componentSelected.id).setAttribute('onchange', document.getElementById("textOnchange").value);
                    }
                }
            }

            if (document.getElementById("textLong")) {

                var btntab = componentSelected.className.indexOf("tablinks");
                if (componentSelected.tagName === "INPUT") {
                    if (componentSelected.type === "text") {
                        document.getElementById("getComponent").value = 'TextBox';
                        //document.getElementById(componentSelected.id).value = document.getElementById("textValue").value;
                    }
                }

                if (btntab === -1) {

                    if (getProp) {

                        var typemaxwidth = typesizemaxWidth(componentSelected.style.maxWidth);
                        if (typemaxwidth !== "") {
                            document.getElementById("textLong").value = componentSelected.style.maxWidth.replace(typemaxwidth, "");
                            document.getElementById("cbsize").value = typemaxwidth;
                        } else {

                            var fatherComponSelect = $("#" + componentSelected.id).closest(".mainPanelDivGroup");
                            fatherComponSelect = document.getElementById(fatherComponSelect.attr("id"));
                            if (fatherComponSelect) {
                                var size = typesizemaxWidth(fatherComponSelect.style.maxWidth);
                                document.getElementById("textLong").value = fatherComponSelect.style.maxWidth.replace(size, "");
                                if (document.getElementById("cbsize")) {
                                    document.getElementById("cbsize").value = size;
                                }
                            }
                        }
                    } else {

                        var namecomponent = $("#" + componentSelected.id).closest(".mainPanelDivGroup");
                        if (namecomponent) {

                            var valor = document.getElementById("textLong").value + document.getElementById("cbsize").value;
                            var component = document.getElementById(namecomponent.attr("id"));
                            if (component) {
                                component.style.maxWidth = valor;
                            }
                        }
                    }
                }
            }
            if (document.getElementById("textNumRec")) {
                if (getProp) {
                    if (componentSelected.rows.length !== 0) {
                        document.getElementById("textNumRec").value = componentSelected.rows.length;
                    } else {
                        document.getElementById("textNumRec").value = 0;
                    }
                } else {
                    var fathercomp = document.getElementById(componentSelected.id).parentNode;
                    var tabladetalle = false;
                    if (componentSelected.title) {
                        removerDetalleTabla(componentSelected.title);
                        tabladetalle = true;
                    }
                    quitComponent();
                    document.getElementById("getComponent").value = 'Table';
                    fathercomp.className = fathercomp.className + " Selected";
                    if (tabladetalle) {
                        addTable();
                    } else {
                        addComponent();
                    }
                    document.ready = document.getElementById("getComponent").value = '0';
                }
            }
            if (document.getElementById("treeview")) {
                if (componentSelected.tagName === "TABLE") {
                    if (getProp) {
                        //document.getElementById("textID").value = componentSelected.id;
                    } else {

                        if (document.getElementById('txtActivarAgregar').checked) {
                            componentSelected.setAttribute('Agregar', true);
                        } else {
                            componentSelected.setAttribute('Agregar', false);
                        }

                        $("#" + componentSelected.id + " th").remove();
                        var setRelTables = [];
                        $(".treeview label input:checkbox").each(function () {
                            if ($(this).is(":checked")) {
                                var subEnt = $(this).attr("subEntity");
                                if (subEnt) {
                                    if (!setRelTables.includes(subEnt)) {
                                        setRelTables.push(subEnt);
                                    }
                                }
                                var column = "<th id='" + $(this).attr("uniqueId").toString().replace(" ", "-")
                                        + "' idetiqueta='" + $(this).attr("id")
                                        + "' fieldSource='" + ($(this).attr("subEntity") === undefined ? "" : $(this).attr("subEntity") + ".")


                                        + ($(this).attr("field") === undefined ? "" : $(this).attr("field")) + "'>"
                                        + $(this).attr("uniqueId") + "</th>";
                                $("#" + componentSelected.id + " tr").append(column);
                            }
                        });
                        $("#" + componentSelected.id).attr("subentities", setRelTables);
                        var typeAcces = sessionStorage.getItem('mode');
                        if (typeAcces) {
                            if (typeAcces !== null) {
                                typeAcces = JSON.parse(typeAcces);
                            }
                        }
                        if (typeAcces[1] === 'fileCapture' || typeAcces[1] === 'fileCaptureSelect') {
                            if (fuenteDatosPrincipal !== undefined) {
                                if (document.getElementById('txtActivarEditar').checked && document.getElementById('txtActivarElimnar').checked) {
                                    componentSelected.setAttribute('Editar', true);
                                    componentSelected.setAttribute('Eliminar', true);
                                    var columns = "<th id='tbEditar'>Editar</th><th id='tbEliminar'>Eliminar</th>";
                                    $("#" + componentSelected.id + " tr").append(columns);
                                } else if (document.getElementById('txtActivarEditar').checked) {
                                    componentSelected.setAttribute('Editar', true);
                                    componentSelected.setAttribute('Eliminar', false);
                                    var columns = "<th id='tbEditar'>Editar</th>";
                                    $("#" + componentSelected.id + " tr").append(columns);
                                } else if (document.getElementById('txtActivarElimnar').checked) {
                                    componentSelected.setAttribute('Editar', false);
                                    componentSelected.setAttribute('Eliminar', true);
                                    var columns = "<th id='tbEliminar'>Eliminar</th>";
                                    $("#" + componentSelected.id + " tr").append(columns);
                                } else {
                                    componentSelected.setAttribute('Editar', false);
                                    componentSelected.setAttribute('Eliminar', false);
                                }

                            }
                        } else if (typeAcces[1] === 'fileCaptureSearch') {
                            var columns = "<th id='tbSelecionar'>Selecionar</th>";
                            $("#" + componentSelected.id + " tr").append(columns);
                            //namescolumns[namescolumns.length] = 'Selecionar';
                        } else if (typeAcces[1] === 'fileCaptureDetalle') {

                        }

                    }
                }
            }
            if (document.getElementById('cbxStyleBorder')) {
                if (componentSelected.tagName === 'DIV') {

                    if (getProp) {
                        var estilo = componentSelected.style.borderStyle;
                        if (estilo === "") {
                            var bandera = true;
                            if (componentSelected.style.borderBottomStyle) {
                                var valor = componentSelected.style.borderBottomStyle.replace(/[12345]px/g, '');
                                document.getElementById('cbxStyleBorder').value = valor.replace(' ', '');
                                document.getElementById('chkbottom').disabled = false;
                                document.getElementById('chkbottom').checked = true;
                                document.getElementById('cbxGrosorBorde').value = componentSelected.style.borderWidth;
                                document.getElementById('cbxGrosorBorde').disabled = false;
                                bandera = false;
                            }
                            if (componentSelected.style.borderLeftStyle) {
                                var valor = componentSelected.style.borderLeftStyle.replace(/[12345]px/g, '');
                                document.getElementById('cbxStyleBorder').value = valor.replace(' ', '');
                                document.getElementById('chkleft').disabled = false;
                                document.getElementById('chkleft').checked = true;
                                document.getElementById('cbxGrosorBorde').value = componentSelected.style.borderWidth;
                                document.getElementById('cbxGrosorBorde').disabled = false;
                                bandera = false;

                            }
                            if (componentSelected.style.borderRightStyle) {
                                var valor = componentSelected.style.borderRightStyle.replace(/[12345]px/g, '');
                                document.getElementById('cbxStyleBorder').value = valor.replace(' ', '');
                                document.getElementById('chkright').disabled = false;
                                document.getElementById('chkright').checked = true;
                                document.getElementById('cbxGrosorBorde').value = componentSelected.style.borderWidth;
                                document.getElementById('cbxGrosorBorde').disabled = false;
                                bandera = false;

                            }
                            if (componentSelected.style.borderTopStyle) {
                                var valor = componentSelected.style.borderTopStyle.replace(/[12345]px/g, '');
                                document.getElementById('cbxStyleBorder').value = valor.replace(' ', '');
                                document.getElementById('chktop').disabled = false;
                                document.getElementById('chktop').checked = true;
                                document.getElementById('cbxGrosorBorde').value = componentSelected.style.borderWidth;
                                document.getElementById('cbxGrosorBorde').disabled = false;
                                bandera = false;
                            }
                            if (bandera) {
                                document.getElementById('cbxStyleBorder').value = "Default";
                                document.getElementById('cbxGrosorBorde').disabled = true;
                                document.getElementById('chkTodos').disabled = true;
                                document.getElementById('chkbottom').disabled = true;
                                document.getElementById('chkleft').disabled = true;
                                document.getElementById('chkright').disabled = true;
                                document.getElementById('chktop').disabled = true;
                            }


                        } else {
                            document.getElementById('cbxStyleBorder').value = estilo;
                            document.getElementById('cbxGrosorBorde').value = componentSelected.style.borderWidth;
                            document.getElementById('cbxGrosorBorde').disabled = false;
                            document.getElementById('chkTodos').disabled = false;
                            document.getElementById('chkTodos').checked = true
                            document.getElementById('chkbottom').disabled = false;
                            document.getElementById('chkleft').disabled = false;
                            document.getElementById('chkright').disabled = false;
                            document.getElementById('chktop').disabled = false;
                        }
                    } else {
                        if (document.getElementById('cbxStyleBorder').value === "Default") {
                            var cbxWidht = document.getElementById('widhtCol');
                            var typeCol = getTypeColumn(cbxWidht.selectedIndex);
                            componentSelected.className = 'mainPanelCol borderCol ' + typeCol + ' Selected';
                            componentSelected.style.borderStyle = '';
                            componentSelected.style.borderWidth = '';
                            componentSelected.style.borderBottom = '';
                            componentSelected.style.borderLeft = '';
                            componentSelected.style.borderRight = '';
                            componentSelected.style.borderTop = '';
                        } else {
                            $('#' + componentSelected.id).removeClass('borderCol');
                            if (document.getElementById('chkTodos').checked === true) {
                                componentSelected.style.borderStyle = document.getElementById('cbxStyleBorder').value;

                            } else {
                                componentSelected.style.borderStyle = '';
                            }
                            if (document.getElementById('chkbottom').checked === true) {
                                componentSelected.style.borderBottomStyle = document.getElementById('cbxStyleBorder').value;

                                //border-bottom-style
                            } else {
                                if (document.getElementById('chkTodos').checked !== true) {
                                    componentSelected.style.borderBottomStyle = '';
                                }

                            }
                            if (document.getElementById('chkleft').checked === true) {
                                componentSelected.style.borderLeftStyle = document.getElementById('cbxStyleBorder').value;

                            } else {
                                if (document.getElementById('chkTodos').checked !== true) {
                                    componentSelected.style.borderLeftStyle = '';
                                }

                            }
                            if (document.getElementById('chkright').checked === true) {
                                componentSelected.style.borderRightStyle = document.getElementById('cbxStyleBorder').value;
                            } else {
                                if (document.getElementById('chkTodos').checked !== true) {
                                    componentSelected.style.borderRightStyle = '';
                                }

                            }

                            if (document.getElementById('chktop').checked === true) {
                                componentSelected.style.borderTopStyle = document.getElementById('cbxStyleBorder').value;
                            } else {
                                if (document.getElementById('chkTodos').checked !== true) {
                                    componentSelected.style.borderTopStyle = '';
                                }
                            }
                            // componentSelected.style.borderStyle = document.getElementById('cbxStyleBorder').value;
                            componentSelected.style.borderWidth = document.getElementById('cbxGrosorBorde').value;
                        }
                    }
                }
            }
            if (getProp) {

                if (document.getElementById('cmbValorInicial')) {
                    if (componentSelected.getAttribute('tipoValor')) {
                        document.getElementById('cmbValorInicial').value = componentSelected.getAttribute('tipoValor');
                        validarValorInicial(document.getElementById('cmbValorInicial').value, componentSelected.id);
                        if (document.getElementById('txtvalorinicial')) {
                            if (componentSelected.tagName === "INPUT" && componentSelected.getAttribute('type') === "checkbox") {
                                if (componentSelected.getAttribute('valorDefault') === "on") {
                                    document.getElementById('txtvalorinicial').checked = true;
                                }

                            } else {
                                document.getElementById('txtvalorinicial').value = componentSelected.getAttribute('valorDefault');

                            }
                        }
                    }
                }

            } else {
                if (document.getElementById('cmbValorInicial')) {
                    componentSelected.setAttribute('tipoValor', document.getElementById('cmbValorInicial').value);
                    if (document.getElementById('txtvalorinicial')) {
                        if (document.getElementById('txtvalorinicial').getAttribute('type') !== "checkbox") {
                            componentSelected.setAttribute('valorDefault', document.getElementById('txtvalorinicial').value);
                        } else {
                            if (document.getElementById('txtvalorinicial').checked) {
                                componentSelected.setAttribute('valorDefault', document.getElementById('txtvalorinicial').value);
                            } else {
                                componentSelected.setAttribute('valorDefault', "off");
                            }
                        }

                    }
                }
            }

            if (document.getElementById('widhtDivComp')) {
                //document.getElementById('widhtDivComp').value = "100";
            }
        } else {//Assign a parameter
            //        alert("Seleccione un componente vÃ¡lido");
        }

    } else {
        createNuevoComponente(document.getElementById('tipoCompo').value);
    }

}

function getChecksTree() {
    var namechecks = new Array();
    var element = document.getElementsByTagName("Input");
    var j = 0;
    for (var i = 0; i < element.length; i++) {
        if (element[i].type === "checkbox") {
            if (element[i].checked === true) {
                if (element[i].id.indexOf("father") !== -1) {
                    namechecks[j] = element[i];
                    j++;
                } else if (element[i].id.indexOf("children") !== -1) {
                    namechecks[j] = element[i];
                    j++;
                }
            }
        }
    }
    return namechecks;
}

/*Grow*/

/*Start of creation of implicate properties components*/
function addID(propComp) {
    var labelID = document.createElement('LABEL');
    labelID.id = "labelID";
    labelID.className = 'optionCFG';
    labelID.innerHTML = 'ID';
    propComp.appendChild(labelID);
    var inputID = document.createElement('INPUT');
    inputID.id = "textID";
    inputID.className = 'form-input';
    inputID.setAttribute('type', 'text');
    propComp.appendChild(inputID);
}

function addSelectComp(propComp) {
    var labelID = document.createElement('LABEL');
    labelID.id = "labelID";
    labelID.className = 'optionCFG';
    labelID.innerHTML = 'Selecione Componente';
    labelID.setAttribute('style', 'display: block')
    propComp.appendChild(labelID);
    var selectCompo = document.createElement('SELECT');
    selectCompo.id = "tipoCompo";
    selectCompo.className = 'mainPanelContentComponents';
    selectCompo.style.width = "170px";
    selectCompo.style.maxWidth = "300px";
    selectCompo.style.height = "30px"
    propComp.appendChild(selectCompo);
}

function addText(propComp) {
    var labelText = document.createElement('LABEL');
    labelText.id = "labelText";
    labelText.className = 'optionCFG';
    labelText.innerHTML = 'Texto';
    propComp.appendChild(labelText);
    var inputText = document.createElement('INPUT');
    inputText.id = "textValue";
    inputText.className = 'form-input';
    inputText.setAttribute('type', 'text');
    propComp.appendChild(inputText);
}

function AddOnclick(propComp) {
    var labelText = document.createElement('LABEL');
    labelText.id = "labelOnclik";
    labelText.className = 'optionCFG';
    labelText.innerHTML = 'Evento click';
    propComp.appendChild(labelText);
    var inputText = document.createElement('INPUT');
    inputText.id = "textOnclik";
    inputText.className = 'form-input';
    inputText.setAttribute('type', 'text');
    propComp.appendChild(inputText);
}

function AddOnchange(propComp) {
    var labelText = document.createElement('LABEL');
    labelText.id = "labelOnchange";
    labelText.className = 'optionCFG';
    labelText.innerHTML = 'Evento Change';
    propComp.appendChild(labelText);
    var inputText = document.createElement('INPUT');
    inputText.id = "textOnchange";
    inputText.className = 'form-input';
    inputText.setAttribute('type', 'text');
    propComp.appendChild(inputText);
}

function addButtonsMove(propComp) {
    var labelText = document.createElement('LABEL');
    labelText.id = "labelBtnMove";
    labelText.className = 'optionCFG';
    labelText.innerHTML = 'Mover componentes';
    propComp.appendChild(labelText);
    var divBtnMove = document.createElement('DIV');
    divBtnMove.id = "divBtnMove";
    divBtnMove.display = "block";
    var btnUp = document.createElement('BUTTON');
    btnUp.id = "btnUp";
    btnUp.className = "defaultButton";
    btnUp.innerHTML = "\u2BC5";
    btnUp.setAttribute("onClick", "moveUP()");

    var a = '&nbsp';
    divBtnMove.innerHTML = a;
    divBtnMove.appendChild(btnUp);

    var btnDown = document.createElement('BUTTON');
    btnDown.id = "btnDown";
    btnDown.innerHTML = "\u2BC6";
    btnDown.className = "defaultButton";
    btnDown.setAttribute("onClick", "moveDown()");

    divBtnMove.appendChild(btnDown);
    propComp.appendChild(divBtnMove);
}

function moveUP() {
    var before = null;
    var cmpSelect = null;
    cmpSelect = $('#content').find('.Selected').closest('.mainPanelDivGroup')[0];
    if (cmpSelect === undefined) {
        alert("Solo se permite mover componentes");
    } else {
        before = $("#" + cmpSelect.id).prev();
        if (before !== undefined) {
            $(cmpSelect).insertBefore(before);
        }
    }
}

function moveDown() {
    var after = null;
    var cmpSelect = null;
    cmpSelect = $('#content').find('.Selected').closest('.mainPanelDivGroup')[0];
    if (cmpSelect === undefined) {
        alert("Solo se permite mover componentes");
    } else {
        after = $("#" + cmpSelect.id).next();
        if (after !== undefined) {
            $(cmpSelect).insertAfter(after);
        }
    }
}


function addWidht(propComp) {
    var labelWidht = document.createElement('LABEL');
    labelWidht.className = 'optionCFG';
    labelWidht.innerHTML = 'Ancho';
    labelWidht.setAttribute('style', 'display: block');
    propComp.appendChild(labelWidht);
    var inputWidht = document.createElement('INPUT');
    inputWidht.id = "widhtDivComp";
    inputWidht.className = 'form-input small';
    inputWidht.setAttribute('type', 'text');
    propComp.appendChild(inputWidht);
    var cbDisplay = document.createElement('SELECT');
    cbDisplay.id = "compWay";
    cbDisplay.className = 'form-input miniSmall';
    propComp.appendChild(cbDisplay);
    var option = document.createElement("option");
    option.value = "%";
    option.text = "%";
    cbDisplay.add(option);
    var option2 = document.createElement("option");
    option2.value = "px";
    option2.text = "px";
    cbDisplay.add(option2);
}

function addStyleWidht(propComp) {
    var div = document.createElement('div');
    div.style.width = "50%";
    var label = document.createElement('LABEL');
    label.id = "labelStyleWidht";
    label.className = "optionCFG";
    label.innerHTML = "Grosor del Borde";
    div.appendChild(label);
    var select = document.createElement('SELECT');
    select.id = "cbxGrosorBorde";
    select.className = "form-input";
    select.style.width = "100px";
    select.disabled = true;
    for (var i = 1; i < 6; i++) {
        var option = document.createElement('option');
        option.text = i + " px";
        option.value = i + "px";
        select.add(option);
    }
    div.appendChild(select);
    propComp.appendChild(div);
}

function addStyleBorder(propComp) {
    var div = document.createElement('div');
    div.style.width = "50%";
    var label = document.createElement('LABEL');
    label.id = "labelStyleBorder";
    label.className = "optionCFG";
    label.innerHTML = "Estilo del borde";
    div.appendChild(label);
    var select = document.createElement('SELECT');
    select.id = "cbxStyleBorder";
    select.className = "form-input";
    select.style.width = "100px";
    select.setAttribute('onChange', 'habilitarStyleBorder()');
    for (var i = 0; i < borderStyle.length; i++) {
        var option = document.createElement('option');
        option.text = borderStyle[i];
        option.value = borderStyle[i];
        select.add(option);
    }
    div.appendChild(select);
    propComp.appendChild(div);
}

function addBordeStyle(propComp) {
    var divprincipal = document.createElement('div');
    divprincipal.style.width = "50%";
    divprincipal.style.display = "flex";
    var divsecu1 = document.createElement('div');
    divsecu1.style.marginRight = "10px";
    divsecu1.style.display = "grid";
    var img1 = document.createElement('img');
    //img1.style.marginRight = "10px";
    img1.style.marginLeft = "3px";
    img1.src = "img/border_outline.png";
    var input = document.createElement('input');
    input.id = "chkTodos"
    input.type = "checkbox";
    input.setAttribute("onClick", "desactivarCkboxBorde()");
    divsecu1.appendChild(img1);
    divsecu1.appendChild(input);
    divprincipal.appendChild(divsecu1);
    var divsecu2 = document.createElement('div');
    divsecu2.style.marginRight = "10px";
    divsecu2.style.display = "grid";
    var img2 = document.createElement('img');
    //img1.style.marginRight = "10px";
    img2.style.marginLeft = "3px";
    img2.src = "img/border_bottom.png";
    var input2 = document.createElement('input');
    input2.id = "chkbottom"
    input2.type = "checkbox";
    input2.setAttribute("onClick", "desactivarCkboxBordetodos()");
    divsecu2.appendChild(img2);
    divsecu2.appendChild(input2);
    divprincipal.appendChild(divsecu2);
    var divsecu3 = document.createElement('div');
    divsecu3.style.marginRight = "10px";
    divsecu3.style.display = "grid";
    var img3 = document.createElement('img');
    //img1.style.marginRight = "10px";
    img3.style.marginLeft = "3px";
    img3.src = "img/border_left.png";
    var input3 = document.createElement('input');
    input3.id = "chkleft"
    input3.type = "checkbox";
    input3.setAttribute("onClick", "desactivarCkboxBordetodos()");
    divsecu3.appendChild(img3);
    divsecu3.appendChild(input3);
    divprincipal.appendChild(divsecu3);
    var divsecu4 = document.createElement('div');
    divsecu4.style.marginRight = "10px";
    divsecu4.style.display = "grid";
    var img4 = document.createElement('img');
    // img4.style.marginRight = "10px";
    img4.style.marginLeft = "3px";
    img4.src = "img/border_right.png";
    var input4 = document.createElement('input');
    input4.id = "chkright"
    input4.type = "checkbox";
    input4.setAttribute("onClick", "desactivarCkboxBordetodos()");
    divsecu4.appendChild(img4);
    divsecu4.appendChild(input4);
    divprincipal.appendChild(divsecu4);
    var divsecu5 = document.createElement('div');
    divsecu5.style.marginRight = "10px";
    divsecu5.style.display = "grid";
    var img5 = document.createElement('img');
    // img5.style.marginRight = "10px";
    img5.style.marginLeft = "3px";
    img5.src = "img/border_top.png";
    var input5 = document.createElement('input');
    input5.id = "chktop"
    input5.type = "checkbox";
    input5.setAttribute("onClick", "desactivarCkboxBordetodos()");
    divsecu5.appendChild(img5);
    divsecu5.appendChild(input5);
    divprincipal.appendChild(divsecu5);
    propComp.appendChild(divprincipal);
}

function addLong(propComp) {
    var labelLong = document.createElement('LABEL');
    labelLong.id = "labelLong";
    labelLong.className = 'optionCFG';
    labelLong.innerHTML = 'Tamaño (max-width)';
    labelLong.setAttribute('style', 'display: block');
    propComp.appendChild(labelLong);
    var inputLong = document.createElement('INPUT');
    inputLong.id = "textLong";
    inputLong.className = 'form-input small';
    inputLong.setAttribute('type', 'text');
    propComp.appendChild(inputLong);
    var cbsize = document.createElement('SELECT');
    cbsize.id = "cbsize";
    cbsize.className = 'form-input miniSmall';
    propComp.appendChild(cbsize);
    var option = document.createElement("option");
    option.value = "%";
    option.text = "%";
    cbsize.add(option);
    var option2 = document.createElement("option");
    option2.value = "px";
    option2.text = "px";
    cbsize.add(option2);
}

function backSelectToFather() {
    var divSelecOnEsc = $('#content').find('.Selected')[0];
    if (divSelecOnEsc) {
        var fatherEsc = divSelecOnEsc.parentNode;
        if (fatherEsc.id !== "content") {
            $('.content').find('*').removeClass('Selected');
            $('#' + fatherEsc.id).addClass('Selected');
            showPropertiesCom(fatherEsc);
            elementSegmenter(fatherEsc);
            updateProperties(fatherEsc, true);
            fatherEsc.focus();
        }
    }
}

function habilitarStyleBorder() {
    if (document.getElementById('cbxGrosorBorde')) {

        if (document.getElementById('cbxStyleBorder').value === "Default") {

            document.getElementById('cbxGrosorBorde').disabled = true;
            document.getElementById('chkTodos').disabled = true;
            document.getElementById('chkTodos').checked = false;
            document.getElementById('chkbottom').disabled = true;
            document.getElementById('chkbottom').checked = false;
            document.getElementById('chkleft').disabled = true;
            document.getElementById('chkleft').checked = false;
            document.getElementById('chkright').disabled = true;
            document.getElementById('chkright').checked = false;
            document.getElementById('chktop').disabled = true;
            document.getElementById('chktop').checked = false;
        } else {

            document.getElementById('cbxGrosorBorde').disabled = false;
            document.getElementById('chkTodos').disabled = false;
            document.getElementById('chkTodos').checked = true;
            document.getElementById('chkbottom').disabled = false;
            document.getElementById('chkbottom').checked = false;
            document.getElementById('chkleft').disabled = false;
            document.getElementById('chkleft').checked = false;
            document.getElementById('chkright').disabled = false;
            document.getElementById('chkright').checked = false;
            document.getElementById('chktop').disabled = false;
            document.getElementById('chktop').checked = false;
        }
    }

}

function desactivarCkboxBorde() {
    document.getElementById('chkbottom').checked = false;
    document.getElementById('chkleft').checked = false;
    document.getElementById('chkright').checked = false;
    document.getElementById('chktop').checked = false;
}

function desactivarCkboxBordetodos() {
    document.getElementById('chkTodos').checked = false;
}

function addTemasH(propComp) {
    //var div = document.createElement('div');
    //div.style.width = "50%";

    var label = document.createElement('label');
    label.id = "lblTipoTitulos";
    label.innerHTML = "Tipo de titulos";
    label.className = 'optionCFG';
    label.setAttribute('style', 'display: block');
    propComp.appendChild(label);
    var select = document.createElement('select');
    select.id = "cmbTipoTitulos";
    select.className = 'form-input small';
    propComp.appendChild(select);
    var option = document.createElement("option");
    option.value = "Default";
    option.text = "Default";
    select.add(option);
    var option2 = document.createElement("option");
    option2.value = "primarytitle";
    option2.text = "Titulo primario";
    select.add(option2);
    var option3 = document.createElement("option");
    option3.value = "secondarytitle";
    option3.text = "Titulo secundario";
    select.add(option3);


    // propComp.appendChild(div);

}

function addTitulos(propComp) {
    var label = document.createElement('label');
    label.id = "lblTituloRecomendados";
    label.innerHTML = "Titulos Recomendados";
    label.className = "optionCFG";
    label.setAttribute('style', 'display:block');
    propComp.appendChild(label);
    var select = document.createElement('select');
    select.id = "cmbTitulosRecom";
    select.className = "form-input small";
    select.setAttribute('onchange', 'cambiarTextoTitle(this.value)');
    var titulos = archivoEs['es'][fuenteDatosPrincipal + "Titulos"];
    for (var item in titulos) {

        var option = document.createElement('option');
        option.innerHTML = titulos[item];
        option.value = item;
        select.add(option);
    }
    propComp.appendChild(select);
}

function cambiarTextoTitle(value) {
    if (document.getElementById('textValue')) {
        var titulos = archivoEs['es'][fuenteDatosPrincipal + "Titulos"];
        document.getElementById('textValue').value = titulos[value];
    }

}

function addValorInicial(propComp, idcomp) {
    var label = document.createElement('label');
    label.id = "lblValorInicial";
    label.innerHTML = "Asignar Valor inicial";
    label.className = "optionCFG";
    label.setAttribute('style', 'display: block');
    propComp.appendChild(label);
    var select = document.createElement('select');
    select.id = "cmbValorInicial";
    select.className = "form-input small";
    select.setAttribute('onchange', 'validarValorInicial(this.value,"' + idcomp + '")');
    var option = document.createElement('option');
    option.value = "sindefinir";
    option.innerHTML = "Sin definir";
    select.add(option);
    var option2 = document.createElement('option');
    option2.value = "valordirecto";
    option2.innerHTML = "Valor directo";
    select.add(option2);
    var option3 = document.createElement('option');
    option3.value = "Variablessistema";
    option3.innerHTML = "Variables del sistema";
    select.add(option3);
    propComp.appendChild(select);
}

function validarValorInicial(valor, idcomp) {
    var typeAcces = sessionStorage.getItem('mode');
    typeAcces = JSON.parse(typeAcces);
    var compSource;
    var compSelect = document.getElementById(idcomp);
    var propComp = document.getElementById('propertiesComp');
    if (document.getElementById('contenedorValor')) {
        var element = document.getElementById("contenedorValor");
        element.parentNode.removeChild(element);
    }
    if (valor === "sindefinir") {

    } else if (valor === "valordirecto") {

        if (compSelect.getAttribute('source')) {

            if (typeAcces[1] !== "fileCapturaProceso") {
                compSource = getCampoOrigenPorID(compSelect.getAttribute('source'));

            } else {

                compSource = getParametrosProcesoPorID(compSelect.getAttribute('source'));

            }
        }

        if (compSource) {

            var config = JSON.parse(compSource["configuracionTipoCaptura"]);
            if (config["tipoCaptura"] === "1") {
                if (compSource.tipoDeDato === 1 || compSource.tipoDeDato === 2 || compSource.tipoDeDato === 3) {

                    var div = document.createElement('div');
                    div.id = "contenedorValor";
                    var label = document.createElement('label');
                    label.id = "lblValor";
                    label.innerHTML = "Valor Inicial";
                    label.className = "optionCFG";
                    label.setAttribute('style', 'display: block');
                    //propComp.appendChild(label);
                    div.appendChild(label);
                    var txtvalor = document.createElement('input');
                    txtvalor.id = "txtvalorinicial";
                    txtvalor.className = 'form-input small';
                    txtvalor.setAttribute('type', 'text');
                    if (config["expresion"]) {
                        txtvalor.setAttribute('pattern', config["expresion"].toString());
                    }
                    div.appendChild(txtvalor);
                    propComp.appendChild(div);
                } else if (compSource.tipoDeDato === 4) {
                    var div = document.createElement('div');
                    div.id = "contenedorValor";
                    var label = document.createElement('label');
                    label.id = "lblValor";
                    label.innerHTML = "Valor Inicial";
                    label.className = "optionCFG";
                    label.setAttribute('style', 'display: block');
                    div.appendChild(label);
                    var dpkValorInicial = document.createElement('input');
                    dpkValorInicial.id = "txtvalorinicial";
                    dpkValorInicial.className = "form-input small";
                    dpkValorInicial.setAttribute('type', 'date');
                    div.appendChild(dpkValorInicial);
                    propComp.appendChild(div);

                } else if (compSource.tipoDeDato === 5) {
                    var div = document.createElement('div');
                    div.id = "contenedorValor";
                    var label = document.createElement('label');
                    label.id = "lblValor";
                    label.innerHTML = "Valor Inicial";
                    label.className = "optionCFG";
                    label.setAttribute('style', 'display:block');
                    div.appendChild(label);
                    var divcont = document.createElement('div');
                    var ckbValorInicial = document.createElement('input');
                    ckbValorInicial.id = "txtvalorinicial";
                    ckbValorInicial.className = "";
                    ckbValorInicial.setAttribute('type', 'checkbox');
                    ckbValorInicial.setAttribute('style', 'display:inline-block');
                    divcont.appendChild(ckbValorInicial);
                    var label2 = document.createElement('label');
                    label2.id = "lblActivar";
                    label2.innerHTML = "Activar selección";
                    label2.className = "optionCFG";
                    label2.setAttribute('style', 'display:inline-block');
                    divcont.appendChild(label2);
                    div.appendChild(divcont);
                    propComp.appendChild(div);

                }
            } else if (config["tipoCaptura"] === "2") {

                if (compSource.tipoDeDato === 1 || compSource.tipoDeDato === 2 || compSource.tipoDeDato === 3 || compSource.tipoDeDato === 4) {

                    if (config["lista"]) {
                        var div = document.createElement('div');
                        div.id = "contenedorValor";
                        var label = document.createElement('label');
                        label.id = "lblValor";
                        label.innerHTML = "Valor Inicial";
                        label.className = "optionCFG";
                        label.setAttribute('style', 'display: block');
                        div.appendChild(label);
                        var valores = config["lista"];
                        var select = document.createElement('select');
                        select.id = "txtvalorinicial";
                        select.className = "form-input small";
                        for (var i = 0; i < valores.length; i++) {
                            var option = document.createElement('option');
                            option.value = valores[i];
                            option.innerHTML = valores[i];
                            select.add(option);
                        }
                        div.appendChild(select);
                        propComp.appendChild(div);
                    } else {
                        alert("No hay datos en la configuracion");
                    }


                }
            } else if (config["tipoCaptura"] === "3") {
                if (compSource.tipoDeDato === 1 || compSource.tipoDeDato === 2 || compSource.tipoDeDato === 3) {
                    if (config["equivalencias"]) {
                        var div = document.createElement('div');
                        div.id = "contenedorValor";
                        var label = document.createElement('label');
                        label.id = "lblValor";
                        label.innerHTML = "Valor Inicial";
                        label.className = "optionCFG";
                        label.setAttribute('style', 'display:block');
                        div.appendChild(label);
                        var valores = config["equivalencias"];
                        var select = document.createElement('Select');
                        select.id = "txtvalorinicial";
                        select.className = "form-input small";
                        for (var item in valores) {
                            var option = document.createElement('option');
                            option.value = item;
                            option.innerHTML = valores[item];
                            select.add(option);
                        }
                        div.appendChild(select);
                        propComp.appendChild(div);
                    } else {
                        alert("No hay datos en la configuracion");
                    }
                }
            } else if (config["tipoCaptura"] === "4") {

                if (config["origenes"]) {
                    var div = document.createElement('div');
                    div.id = "contenedorValor";
                    var label = document.createElement('label');
                    label.id = "lblValor";
                    label.innerHTML = "Valor Inicial";
                    label.className = "optionCFG";
                    label.setAttribute('style', 'display:block');
                    div.appendChild(label);
                    var confiOrigen = config["origenes"];
                    var nameTable = confiOrigen["origen"];

                    var res = searchAll(nameTable);

                    if (res) {

                        var select = document.createElement('Select');
                        select.id = "txtvalorinicial";
                        select.className = "form-input small";
                        for (var i = 0; i < res.length; i++) {
                            var option = document.createElement('option');
                            option.value = res[i]['id'];
                            if (confiOrigen["campovalor1"] !== "" && confiOrigen["campovalor2"] !== "") {
                                option.innerHTML = res[i][confiOrigen["campovalor1"]] + "-" + res[i][confiOrigen["campovalor2"]]
                            } else if (confiOrigen["campovalor1"] !== "") {
                                option.innerHTML = res[i][confiOrigen["campovalor1"]];
                            } else if (confiOrigen["campovalor2"] !== "") {
                                option.innerHTML = res[i][confiOrigen["campovalor2"]];
                            } else {
                                option.innerHTML = res[i]["descripcion"];

                            }
                            select.add(option);
                        }
                        div.appendChild(select);
                        propComp.appendChild(div);
                    }
                } else {
                    alert("No hay datos en la configuracion");
                }
            }
        }
    } else if (valor === "Variablessistema") {


    }
}

function searchAll(tabla, select) {
    var resultado;
    activarSelect = select;
    var url = route + "/api/SearchGenericAll";
    var dataToPost = JSON.stringify(tabla);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        resultado = Mensaje.resultado;
    }
    return resultado;
}

function addCamposOcultos() {
    var campo = document.getElementById('getNameColumn').value;
    if (campo !== "0") {

        propsComponent = JSON.parse(campo);
        var searchSource = propsComponent.id
        if ($(".content [source=" + searchSource + "]").length > 0) {
            alert("Este componente ya existe en la forma de captura");
            return;
        }
        if ($("#compOcultos [source=" + searchSource + "]").length > 0) {
            alert("Este componente ya existe en los ocultos");
            return;
        }
        var divocultos = document.getElementById('ocultosConte');
        divocultos.style.display = 'block';
        var divPrincipal = document.getElementById('compOcultos');
        var label = document.createElement('label');
        label.innerHTML = propsComponent['campo'];
        label.className = "mainPanelContentComponents ";
        label.id = 'lblocultos_' + propsComponent['campo'];
        label.setAttribute('source', propsComponent['id']);
        label.setAttribute('persist', propsComponent['campo']);
        label.setAttribute('tipodato', propsComponent.tipoDeDato);
        var config = propsComponent.configuracionTipoCaptura;
        config = JSON.parse(config);
        label.setAttribute('tipocaptura', config['tipoCaptura']);
        label.setAttribute("isOculto", true);
        divPrincipal.appendChild(label);
    } else {
        alert('Selecione un Campo');
    }
}

function addChkTable(propComp) {

    var label = document.createElement('label');
    label.innerHTML = "Permitir";
    propComp.appendChild(label);
    var div = document.createElement('div');
    div.id = "divGroupAgregar";
    var inputAgregar = document.createElement('input');
    inputAgregar.id = "txtActivarAgregar";
    inputAgregar.type = "checkbox";
    div.appendChild(inputAgregar);
    var labelActAgregar = document.createElement("label");
    labelActAgregar.setAttribute('for', "txtActivarAgregar");
    labelActAgregar.className = "containerCheck";
    labelActAgregar.innerHTML = "Agregar";
    div.appendChild(labelActAgregar);
    propComp.appendChild(div);
    var div2 = document.createElement('div');
    div2.id = "divGroupEditar";
    var inputEditar = document.createElement("input");
    inputEditar.id = "txtActivarEditar";
    inputEditar.type = "checkbox";
    div2.appendChild(inputEditar);
    var labelEditar = document.createElement("label");
    labelEditar.setAttribute('for', "txtActivarEditar");
    labelEditar.className = "containerCheck";
    labelEditar.innerHTML = "Editar";
    div2.appendChild(labelEditar);
    propComp.appendChild(div2);

    var div3 = document.createElement('div');
    div3.id = "divGroupEliminar";

    var inputElimnar = document.createElement('input');
    inputElimnar.id = "txtActivarElimnar";
    inputElimnar.type = "checkbox";
    div3.appendChild(inputElimnar);
    var labelElimnar = document.createElement('label');
    labelElimnar.setAttribute('for', "txtActivarElimnar");
    labelElimnar.className = "containerCheck";
    labelElimnar.innerHTML = "Eliminar";
    div3.appendChild(labelElimnar);
    propComp.append(div3);
}
/**
 * @param {string} char1 the first chart to search
 * @param {string} char2 the second chart to search
 * @param {string} theText the original text to extract
 */

function getBetweenText(char1, char2, theText) {
    var originalStr = theText;
    var startPos = originalStr.indexOf(char1) + 1;
    var endPos = originalStr.indexOf(char2, startPos);
    var textToGet = originalStr.substring(startPos, endPos);
    return textToGet;
}

var level = 0;
var maxLevel = 2;
function buildTree(dad, campos) {
    var isFather = false;
    for (var i = 0; i < campos.length; i++) {
        var camp = campos[i]['tipoDeDato'];
        if (camp === 0) {
            level++;
            isFather = true;
        }
        if (level > (maxLevel - 1)) {
            return;
        }
        var limain = document.createElement('LI');
        var input = document.createElement('INPUT');
        var idEtiqueta = campos[i]['idEtiqueta'].toString();
        var campo = campos[i]['campo'].toString();
        var cnfCap = campos[i]['configuracionTipoCaptura'];
        input.id = idEtiqueta;
        input.checked = true;
        input.setAttribute('type', 'checkbox');
        limain.appendChild(input);
        var label1 = document.createElement('LABEL');
        var input2 = document.createElement('INPUT');
        input2.id = idEtiqueta;
        input2.setAttribute('type', 'checkbox');
        // input2.setAttribute('source', campos[i]['id']);

        var entity = undefined;
        if (isFather) {
            if (campos[i]['subOrigen']) {
                entity = campos[i]['subOrigen'].toString().toLowerCase();
                input2.setAttribute('subEntity', entity);
            }
        } else {
            if (level > 0) {
                if (campos[i]['origenNombre']) {
                    entity = campos[i]['origenNombre'].toString().toLowerCase();
                    input2.setAttribute('subEntity', entity);
                }
            }
        }
        input2.setAttribute('uniqueID', campos[i]['origenNombre'] + " " + campo);

        var field = undefined;
        if (campo.includes("_ID")) {
            field = "id";
            input2.setAttribute('field', field);
        } else {
            field = campo;
            input2.setAttribute('field', field);
        }

        if (campos[i]['subOrigen']) {
            campo = campos[i]['subOrigen'];
        }

        var fieldSource = (entity === undefined ? "" : entity + ".") + (field === undefined ? "" : field);
        if (fieldSource) {
            input2.setAttribute('fieldSource', fieldSource);
        }
        label1.appendChild(input2);

        var span = document.createElement('SPAN');
        label1.appendChild(span);
        limain.appendChild(label1);
        var labelname = document.createElement('LABEL');
        labelname.htmlFor = idEtiqueta;
        labelname.innerHTML = campo;
        if (isFather) {
            labelname.className = "father";
        }
        limain.appendChild(labelname);
        var ulmain = null;
        if (dad.tagName === "DIV") {
            ulmain = document.createElement('UL');
            // ulmain.id = "AKA";
            ulmain.appendChild(limain);
            dad.appendChild(ulmain);
        }
        else {
            dad.appendChild(limain);
        }
        if (cnfCap) {
            var getMiniJsonByData = JSON.parse(cnfCap);
            if (getMiniJsonByData.origenes) {
                if (getMiniJsonByData.origenes.camposAdicionales) {
                    var origen = getMiniJsonByData['origenes']['origen'];
                    var camAdic = getMiniJsonByData.origenes.camposAdicionales;
                    var addUl = null;
                    addUl = document.createElement('UL');
                    //addUl.id = "OKAS";
                    limain.appendChild(addUl);
                    for (j = 0; j < camAdic.length; j++) {
                        var theSubOrigin = camAdic[j]['nombreTabla'];
                        var campi = camAdic[j];
                        var setDat = new Object();
                        setDat.idEtiqueta = origen + campi.nombre;
                        setDat.campo = campi.nombre;
                        var cnfCap = new Object();
                        if (theSubOrigin) {
                            camAdic[j]['idEtiqueta'] = theSubOrigin;
                            camAdic[j]['campo'] = theSubOrigin;
                            camAdic[j]['origen'] = origen;
                            camAdic[j]['origenNombre'] = theSubOrigin;
                            camAdic[j]['tipoDeDato'] = 0;
                            var cnfCapt = {
                                "origenes": {
                                    "origen": theSubOrigin,
                                    "camposAdicionales": camAdic[j]['camposAdicionales']
                                }

                            };
                            camAdic[j]['configuracionTipoCaptura'] = JSON.stringify(cnfCapt);
                        } else {
                            camAdic[j]['idEtiqueta'] = origen.toString() + campi.nombre;
                            camAdic[j]['campo'] = campi.nombre;
                            camAdic[j]['origenNombre'] = origen;
                            camAdic[j]['tipoDeDato'] = 1;
                        }
                    }
                    if (level < maxLevel) {
                        buildTree(addUl, camAdic);
                    }
                }
                level = 0;
            }
        }
    }
}

function updateStatusCheck(namechecks, check) {
    for (var i = 0; i < namechecks.length; i++) {
        if (namechecks[i].id === check.id) {
            check.checked = namechecks[i].checked;
            break;
        }
    }
}

/* Active select of check head*/
function activeselect() {
    $(".treeview label input:checkbox").on("click", function () {
        var checkbox = $(this),
                nestedList = checkbox.parent().next().next(),
                selectNestedListCheckbox = nestedList.find("label:not([for]) input:checkbox");
        // console.log(checkbox.attr("id"));
        if (checkbox.is(":checked")) {
            return selectNestedListCheckbox.prop("checked", true);
        }
        selectNestedListCheckbox.prop("checked", false);
    });
    //    $(".treeview").on("label input:checkbox", "change", function() {
    //
    //    });
}

function addNumColumns(propComp) {
    var labelNumcol = document.createElement('LABEL');
    labelNumcol.id = "labelNumCol";
    labelNumcol.className = 'optionCFG';
    labelNumcol.innerHTML = 'Seleccionar Columnas';
    propComp.appendChild(labelNumcol);
    /*var inputNumcol = document.createElement('INPUT');
     inputNumcol.id = "textNumCol";
     inputNumcol.className = 'form-input';
     inputNumcol.setAttribute('type', 'text');
     propComp.appendChild(inputNumcol);*/
}

/***** Create Form *****/

function createForm() {
    var form = document.createElement("form");
    form.setAttribute('id', "idCatalog");
    form.setAttribute('name', "idCatalog");
    form.setAttribute('method', "post");
    form.setAttribute('mainorigen', idfuenteOrigenPrincipal);
    form.setAttribute('action', "submit.php");
    form.setAttribute('onsubmit', "return verifyData()");
    return form;
}

/**********************  PREVIEW    **********************/

function redirect() {
    //clearstyle("cbfile");
    modalActive(document.getElementById("button-import"));
}

function showScreen() {
    var fileInput = document.getElementById('cbfile').value;
    if (fileInput) {
        location.href = "preview.html?screen=" + fileInput;
    }
}

function showPreview() {
    var form = createForm();
    var initElement = document.getElementById("mainContent");
    var clone = initElement.cloneNode(true);
    form.appendChild(clone);
    var json = mapDOM(form, true);
    json = json.replace("Selected", "");
    sessionStorage.setItem('preview', json);
    var openCapture = "preview.html?capture=" + "preview";
    window.open(openCapture);
    sessionStorage.removeItem('preview');
}

/*Importpreview PARA ABRIR EL PREVIEW*/
function importpreview(data, isFile) {
    if (isFile) {
        $.getJSON("pantallas/" + data + ".json", function (data) {
            buildScreen(data);
        })
                .fail(function (ex) {
                    console.log(ex);
                });
    } else {
        buildScreen(data);
    }
}

function buildScreen(data) {
    var container_json = document.getElementById('container');
    var info = data.content[0];
    // container_json.style.backgroundColor = "#9999ff";
    //container_json.style = data.attributes.style;
    for (var i = 0; i < info.content.length; i++) {
        if (info.content[i].elemento === "IDIV") {
            var iDiv = createJsDiv(info.content[i]);
            container_json.appendChild(iDiv);
        }
    }
}

function importPreviewCapture(source) {

    var infoSource = source.toString().length;
    if (infoSource > 258) {
        var data = JSON.parse(source);
        var mainContent = document.getElementById('mainContent');
        if (mainContent) {
            var info = data.content;
            mainContent.className = info[0].attributes.class;
            mainContent.style = data.attributes.style;
            for (var k = 0; k < info.length; k++) {

                for (var i = 0; i < info[k].content.length; i++) {
                    console.log(info[k].attributes.id);
                    if (info[k].content[i].elemento === "IDIV" && info[k].attributes.id !== "contOcultos") {
                        var iDiv = createJsDiv(info[k].content[i]);
                        mainContent.appendChild(iDiv);
                    } else {
                        var iDiv = createJsDiv(info[k].content[i]);
                        document.getElementById('ocultosConte').style.display = "block";
                        var contOculto = document.getElementById('contOcultos');
                        var element = document.getElementById("compOcultos");
                        element.parentNode.removeChild(element);
                        contOculto.appendChild(iDiv);
                    }
                }
            }
        }
    }
}

var propSource = "";
function pageload() {
    var isScreen = getParameterByName('screen');
    var isCapture = getParameterByName('capture');
    var infoOrigin = new Object();
    if (isScreen) {
        $.when(importpreview(isScreen, true)).then(function () {
            $("#clave").attr('onchange', 'search()');
        });
    } else if (isCapture) {
        var fileShowCapture = sessionStorage.getItem(isCapture);
        if (fileShowCapture) {
            var data = JSON.parse(fileShowCapture);
            if (data.attributes.mainorigen !== 'undefined') {
                infoOrigin.id = data.attributes.mainorigen;
                infoOrigin.toDict = true;
                propSource = getCamposOrigen(infoOrigin);
            }
            importpreview(data, false);
        }
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


/**********************  END PREVIEW    **********************/

/*------------------Creator from Js------------------*/

function createJsDiv(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iDiv = document.createElement('div');
    if (typeof (text) !== 'undefined') {
        iDiv.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iDiv.id = attributes.id;
    }
    if (typeof (attributes.mode) !== 'undefined') {
        iDiv.setAttribute('mode', attributes.mode);
    }
    if (typeof (attributes.sourcecontainer) !== 'undefined') {
        iDiv.setAttribute('sourcecontainer', attributes.sourcecontainer);
    }
    if (typeof (attributes.class) !== 'undefined') {
        iDiv.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iDiv.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iDiv.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iDiv.style.width = attributes.ancho;
    }
    if (typeof (attributes.maxAlto) !== 'undefined') {
        iDiv.style.maxWidth = attributes.maxAlto;
    }
    if (typeof (attributes.display) !== 'undefined') {
        iDiv.style.display = attributes.display;
    }
    if (typeof (attributes.bordeEstilo) !== 'undefined') {//se agrego esto
        iDiv.style.borderStyle = attributes.bordeEstilo;
    }
    if (typeof (attributes.bordeGrosor) !== 'undefined') {//se agrego esto
        iDiv.style.borderWidth = attributes.bordeGrosor;
    }
    if (typeof (attributes.bordeAbajo) !== 'undefined') {//se agrego esto
        iDiv.style.borderBottomStyle = attributes.bordeAbajo;
    }
    if (typeof (attributes.bordeIzquierda) !== 'undefined') {//se agrego esto
        iDiv.style.borderLeftStyle = attributes.bordeIzquierda;
    }
    if (typeof (attributes.bordeDerecha) !== 'undefined') {//se agrego esto
        iDiv.style.borderRightStyle = attributes.bordeDerecha;
    }
    if (typeof (attributes.bordeArriba) !== 'undefined') {//se agrego esto
        iDiv.style.borderTopStyle = attributes.bordeArriba;
    }
    if (typeof (attributes.source) !== 'undefined') {
        iDiv.setAttribute('source', attributes.source);
        if (propSource) {
            setDataSource(attributes.source, iDiv);
        }
    }
    if (typeof (attributes.titulo) !== 'undefined') {
        iDiv.setAttribute('titulo', attributes.titulo);
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            if (content[i].elemento === "IDIV") {
                var subDiv = createJsDiv(content[i]);
                iDiv.appendChild(subDiv);
            }
            else if (content[i].elemento === "IH1") {
                var h1 = createJsH1(content[i]);
                iDiv.appendChild(h1);
            }
            else if (content[i].elemento === "IH2") {
                var h2 = createJsH2(content[i]);
                iDiv.appendChild(h2);
            } else if (content[i].elemento === "IH3") {
                var h3 = createJsH3(content[i]);
                iDiv.appendChild(h3);
            } else if (content[i].elemento === "IH4") {
                var h4 = createJsH4(content[i]);
                iDiv.appendChild(h4);
            }
            else if (content[i].elemento === "ILABEL") {
                var label = createJsLabel(content[i]);
                iDiv.appendChild(label);
            }
            else if (content[i].elemento === "IBUTTON") {
                var button = createJsButton(content[i]);
                iDiv.appendChild(button);
            }
            else if (content[i].elemento === "IINPUT") {
                var text = createJsInputText(content[i]);
                iDiv.appendChild(text);
            }
            else if (content[i].elemento === "ISELECT") {
                var select = createJsSelect(content[i]);
                iDiv.appendChild(select);
            } else if (content[i].elemento === "IHR") {
                var hr = createJsHr(content[i]);
                iDiv.appendChild(hr);
            }
            else if (content[i].elemento === "ITABLE") {

                var tablee = createJsTable(content[i]);
                iDiv.appendChild(tablee);
            }
            else {
                iDiv.innerHTML = content[i].content;
            }
        }
    } else {
        if (propSource) {
            var keyDataSource = JSON.stringify(propSource[iDiv.getAttribute('source')]);
            if (keyDataSource) {
                var keySrc = JSON.parse(keyDataSource);
                var configcaptura = JSON.parse(keySrc['configuracionTipoCaptura']);
                var properties = new Object();
                properties.source = iDiv.getAttribute('source');
                var titulo = iDiv.getAttribute('titulo');
                var label = createLabel(properties, titulo);
                iDiv.appendChild(label);
                if (configcaptura['tipoCaptura'] === "2") {
                    var valores = configcaptura['lista'];
                    for (var i = 0; i < valores.length; i++) {
                        var addcomp = createRadioButton(properties, iDiv, undefined, undefined, valores.length, titulo);
                        iDiv.appendChild(addcomp);
                    }
                } else if (configcaptura['equivalencias'] === "3") {
                    var valores = configcaptura['lista'];
                    for (var key in valores) {
                        var addcomp = createRadioButton(properties, iDiv, undefined, undefined, valores.length, titulo);
                        iDiv.appendChild(addcomp);
                    }
                }
            }
        }
    }
    return iDiv;
}

function createJsLabel(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iLabel = document.createElement('LABEL');
    if (typeof (text) !== 'undefined') {
        iLabel.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iLabel.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iLabel.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iLabel.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iLabel.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iLabel.style.width = attributes.ancho;
    }
    if (typeof (attributes.display) !== 'undefined') {
        iLabel.style.display = attributes.display;
    }
    if (typeof (attributes.for) !== 'undefined') {
        iLabel.setAttribute('for', attributes.for);
    }
    if (typeof (attributes.source) !== 'undefined') {
        iLabel.setAttribute('source', attributes.source);
        if (propSource) {
            setDataSource(attributes.source, iLabel);
        }
    }
    if (typeof (attributes.isoculto) !== 'undefined') {
        iLabel.setAttribute('isoculto', attributes.isoculto);
    }
    if (typeof (attributes.tipovalor) !== 'undefined') {
        iLabel.setAttribute('tipovalor', attributes.tipovalor);
    }
    if (typeof (attributes.valordefault) !== 'undefined') {
        iLabel.setAttribute('valordefault', attributes.valordefault);
    }
    if (typeof (attributes.persist) !== 'undefined') {
        iLabel.setAttribute('persist', attributes.persist);
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iLabel.innerHTML = content[i];
        }
    }
    return iLabel;
}

function createJsButton(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iButton = document.createElement('BUTTON');
    if (typeof (text) !== 'undefined') {
        iButton.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iButton.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iButton.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iButton.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iButton.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iButton.style.width = attributes.ancho;
    }

    if (typeof (attributes.onclick) !== 'undefined' !== undefined) {
        iButton.setAttribute("onclick", attributes.onclick);
    }

    if (typeof (attributes.source) !== 'undefined') {
        iButton.setAttribute('source', attributes.source);
        if (propSource) {
            setDataSource(attributes.source, iButton);
        }
    }

    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iButton.innerHTML = content[i];
        }
    }
    return iButton;
}

function createJsInputText(data) {
    var attributes = data.attributes;
    var content = data.content;

    var iText = document.createElement('INPUT');
    if (typeof (attributes.id) !== 'undefined') {
        iText.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iText.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iText.style = attributes.style;
    }
    if (typeof (attributes.name) !== 'undefined') {
        iText.setAttribute("name", attributes.name);
    }

    if (typeof (attributes.alto) !== 'undefined') {
        iText.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iText.style.width = attributes.ancho;
    }
    if (typeof (attributes.display) !== 'undefined') {
        iText.style.display = attributes.display;
    }
    if (typeof (attributes.type) !== 'undefined' !== undefined) {
        iText.setAttribute("type", attributes.type);
        if (attributes.type === 'checkbox') {
            // iText.style.display = "none";
        }
    }
    if (typeof (attributes.valor) !== 'undefined') {
        iText.value = attributes.valor;
    }
    if (typeof (attributes.tipocaptura) !== 'undefined') {
        iText.setAttribute("tipocaptura", attributes.tipocaptura);
    }
    if (typeof (attributes.tipodato) !== 'undefined') {
        iText.setAttribute("tipodato", attributes.tipodato);
    }
    if (typeof (attributes.totalelemen) !== 'undefined') {
        iText.setAttribute("totalelemen", attributes.totalelemen);
    }
    if (typeof (attributes.titulo) !== 'undefined') {
        iText.setAttribute("titulo", attributes.titulo);
    }
    if (typeof (attributes.tipovalor) !== 'undefined') {
        iText.setAttribute('tipovalor', attributes.tipovalor);
    }
    if (typeof (attributes.valordefault) !== 'undefined') {
        iText.setAttribute('valordefault', attributes.valordefault);
    }
    if (typeof (attributes.source) !== 'undefined') {
        iText.setAttribute('source', attributes.source);
        if (propSource) {
            setDataSource(attributes.source, iText);
        }
    }
    if (typeof (attributes.kind) !== 'undefined') {
        iText.setAttribute("kind", attributes.kind);
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iText.innerHTML = content[i];
        }
    }
    return iText;
}

function createJsSelect(data) {

    var attributes = data.attributes;
    var content = data.content;
    var iSelect = document.createElement('SELECT');


    if (typeof (attributes.id) !== 'undefined') {
        iSelect.id = attributes.id;
    }

    if (typeof (attributes.class) !== 'undefined') {
        iSelect.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iSelect.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iSelect.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iSelect.style.width = attributes.ancho;

    }
    if (typeof (attributes.tipocaptura) !== 'undefined') {
        iSelect.setAttribute("tipocaptura", attributes.tipocaptura);
    }
    if (typeof (attributes.tipodato) !== 'undefined') {
        iSelect.setAttribute("tipodato", attributes.tipodato);
    }
    if (typeof (attributes.totalelemen) !== 'undefined') {
        iSelect.setAttribute("totalelemen", attributes.totalelemen);
    }
    if (typeof (attributes.titulo) !== 'undefined') {
        iSelect.setAttribute("titulo", attributes.titulo);
    }
    if (typeof (attributes.onchange) !== "undefined") {
        iSelect.setAttribute("onchange", attributes.onchange);
    }
    if (typeof (attributes.tipovalor) !== 'undefined') {
        iSelect.setAttribute('tipovalor', attributes.tipovalor);
    }
    if (typeof (attributes.valordefault)) {
        iSelect.setAttribute('valordefault', attributes.valordefault);
    }

    if (typeof (attributes.source) !== 'undefined') {
        iSelect.setAttribute('source', attributes.source);
        if (propSource) {
            setDataSource(attributes.source, iSelect);
        }
    }

    if (typeof (attributes.kind) !== 'undefined') {
        iSelect.setAttribute("kind", attributes.kind);
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iSelect.innerHTML = content[i];
        }
    }


    return iSelect;
}

function createJsTable(data) {
    var attributes = data.attributes;
    var content = data.content;
    var iTable = document.createElement('TABLE');
    if (typeof (attributes.id) !== 'undefined') {
        iTable.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iTable.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iTable.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        if (activeimportscreen !== true) {
            iTable.style.height = attributes.alto;
        }
    }
    if (typeof (attributes.tableidentifier) !== 'undefined') {
        iTable.setAttribute('tableidentifier', attributes.tableidentifier);
    }
    if (typeof (attributes.subentities) !== 'undefined') {
        iTable.setAttribute('subentities', attributes.subentities);
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iTable.style.width = attributes.ancho;
    }
    if (typeof (attributes.agregar) !== 'undefined') {
        iTable.setAttribute('Agregar', attributes.agregar);
    }
    if (typeof (attributes.editar) !== 'undefined') {
        iTable.setAttribute('Editar', attributes.editar);
    }
    if (typeof (attributes.eliminar) !== 'undefined') {
        iTable.setAttribute('Eliminar', attributes.eliminar);
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            if (content[i].elemento === "ITR") {
                var row = document.createElement('TR');
                if (typeof (content[i].attributes.id) !== 'undefined') {
                    row.setAttribute("id", content[i].attributes.id);
                }
                var count = content[i].content.length;
                for (var j = 0; j < count; j++) {
                    if (content[i].content[j].elemento === "ITH") {
                        var th = document.createElement("TH");
                        if (typeof (content[i].content[j].attributes.id) !== 'undefined') {
                            th.setAttribute("id", content[i].content[j].attributes.id);
                        }
                        if (typeof (content[i].content[j].attributes.fieldsource) !== 'undefined') {
                            th.setAttribute("fieldsource", content[i].content[j].attributes.fieldsource);
                        }
                        if (typeof (content[i].content[j].attributes.idetiqueta) !== 'undefined') {
                            th.setAttribute("idetiqueta", content[i].content[j].attributes.idetiqueta);
                        }
                        var datath = document.createTextNode(content[i].content[j].texto);
                        th.appendChild(datath);
                        row.appendChild(th);
                    } else {
                        var cell = document.createElement("TD");
                        var datacell = document.createTextNode(content[i].content[j].texto);
                        cell.appendChild(datacell);
                        row.appendChild(cell);
                    }
                }
                iTable.appendChild(row);
            }
        }
    }
    return iTable;
}

function createJsH1(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iH1 = document.createElement('H1');
    if (typeof (text) !== 'undefined') {
        iH1.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iH1.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iH1.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iH1.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iH1.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iH1.style.width = attributes.ancho;
    }
    if (typeof (attributes.cambiaridioma) !== 'undefined') {
        iH1.setAttribute('cambiaridioma', attributes.cambiaridioma);
    }
    if (typeof (attributes.idetiqueta) !== 'undefined') {
        iH1.setAttribute('idetiqueta', attributes.idetiqueta);
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iH1.innerHTML = content[i];
        }
    }
    return iH1;
}

function createJsHr(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;

    var iHr = document.createElement('HR');

    //if (typeof (text) !== 'undefined') {
    //    iH1.innerHTML = text;
    //}
    if (typeof (attributes.id) !== 'undefined') {
        iHr.id = attributes.id;
    }
    if (typeof (attributes.size) !== 'undefined') {
        iHr.size = attributes.size;
    }
    if (typeof (attributes.noshade) !== 'undefined') {
        iHr.setAttribute('noshade', attributes.noshade);
        // iHr.style = attributes.noshade;
    }
    //if (typeof (attributes.alto) !== 'undefined') {
    //    iH1.style.height = attributes.alto;
    //}
    //if (typeof (attributes.ancho) !== 'undefined') {
    //    iH1.style.width = attributes.ancho;
    //}
    //if (content !== null && content !== undefined) {
    //    for (var i = 0; i < content.length; i++) {
    //        iH1.innerHTML = content[i];
    //    }
    //}
    return iHr;
}

function createJsH2(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iH1 = document.createElement('H2');
    if (typeof (text) !== 'undefined') {
        iH1.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iH1.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iH1.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iH1.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iH1.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iH1.style.width = attributes.ancho;
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iH1.innerHTML = content[i];
        }
    }
    return iH1;
}

function createJsH3(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iH3 = document.createElement('H3');
    if (typeof (text) !== 'undefined') {
        iH3.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iH3.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iH3.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iH3.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iH3.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iH3.style.width = attributes.ancho;
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iH3.innerHTML = content[i];
        }
    }
    return iH3;
}

function createJsH4(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iH4 = document.createElement('H4');
    if (typeof (text) !== 'undefined') {
        iH4.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iH4.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iH4.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iH4.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iH4.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iH4.style.width = attributes.ancho;
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iH4.innerHTML = content[i];
        }
    }
    return iH4;
}

function setDataSource(src, element) {
    var keyDataSource = JSON.stringify(propSource[src]);
    var keySrc = JSON.parse(keyDataSource);
    if (keySrc) {
        if (element.tagName === "LABEL") {
            if (keySrc["idEtiqueta"]) {
                element.setAttribute("idetiqueta", keySrc["idEtiqueta"]);
            }
        }
        else if (element.tagName === "INPUT") {
            if (keySrc["llave"]) {
                element.setAttribute("isKey", keySrc["llave"]);
            }
            if (keySrc["requerido"]) {
                element.setAttribute("required", keySrc["requerido"]);
            }

            if (keySrc["campo"]) {
                element.setAttribute("persist", keySrc["campo"]);
            }
        }
        else if (element.tagName === "DIV") {
            //            if (keySrc["compAncho"]) {
            //                element.style.width = keySrc["compAncho"] + "%";
            //                element.style.maxWidth = keySrc["compAncho"] + "%";
            //            }
        }
    }
}

function elementSegmenter(cmp) {
    var kindElement = "";
    var idEle = cmp.id.toString();
    if (idEle.startsWith("mainContent")) {
        kindElement = "Contenedor principal";
    }
    else if (idEle.startsWith("cTab")) {
        kindElement = "Contenedor con pestañas";
    } else if (idEle.startsWith("tab")) {
        kindElement = "Pestaña";
    } else if (idEle.startsWith("con")) {
        kindElement = "Contenedor";
    } else if (idEle.startsWith("row")) {
        kindElement = "Renglon";
    } else if (idEle.startsWith("col")) {
        kindElement = "Columna";
    } else if (idEle.startsWith("title")) {
        kindElement = "Titulo de contenedor";
    } else if (idEle.startsWith("DivGroup")) {
        kindElement = "Contenedor de componente";
    }
    else if (cmp.tagName === "LABEL") {
        kindElement = "Etiqueta";
    } else if (cmp.tagName === "SELECT") {
        kindElement = "Lista de selección";
    } else if (cmp.tagName === "INPUT") {
        var nameCapitalized = cmp.type.charAt(0).toUpperCase() + cmp.type.slice(1);
        kindElement = nameCapitalized;
    } else if (idEle.startsWith("scroll")) {
        kindElement = "Scroll";
    }
    else if (cmp.tagName === "H1") {
        kindElement = "H1";
    }
    else if (cmp.tagName === "H2") {
        kindElement = "H2";
    }
    else if (cmp.tagName === "TABLE") {
        kindElement = "Tabla de datos";
    }
    else if (cmp.tagName === "TH") {
        kindElement = "Columna";
    } else if (cmp.tagName === "TR") {
        kindElement = "Encabezado de tabla";
    }
    else if (cmp.tagName === "BUTTON") {
        if (cmp.className.startsWith("tablinks")) {
            kindElement = "Pestañas";
        } else {
            kindElement = "Boton";
        }

    }
    document.getElementById('selecter').innerHTML = kindElement;
}

function saveFileToCapture() {
    var form = createForm();
    var json;
    var initElement = document.getElementById("mainContent");
    var initElementoculto = document.getElementById("contOcultos");
    var divocultos = document.getElementById('compOcultos');
    if (initElement.childNodes.length > 0) {
        form.appendChild(initElement);
        if (divocultos.children.length > 0) {
            form.appendChild(initElementoculto);
            console.log(divocultos);
        }
        json = mapDOM(form, true);

        json = json.replace(" Selected", "");
    }

    //json = json.replace(" ", "");
    //console.log(listaCamposTCMasiva);
    var typeAcces = sessionStorage.getItem('mode');
    if (typeAcces) {
        if (typeAcces !== null) {
            typeAcces = JSON.parse(typeAcces);
            if (Array.isArray(typeAcces)) {
                if (typeAcces[0] === 1) {

                    var valor = typeAcces[1].split('|');
                    //console.log(valor);
                    if (valor.length > 1) {
                        //console.log(json);
                        var id = valor[0].split(',');
                        sessionStorage.setItem(typeAcces[1], json === undefined ? null : json);
                        typeAcces[2] = json;
                    } else {
                        sessionStorage.setItem(typeAcces[1], json);
                    }


                    actualizarCampostcMasiva(listaCamposTCMasiva2);
                    //typeAcces[3] = listaCamposTCMasiva;
                    //sessionStorage.setItem('mode',JSON.stringify(typeAcces));
                    //sessionStorage

                    if (typeAcces[1] === 'fileCapture' && typeAcces[4] !== "5") {
                        if (listDetalle.length > 0 || listDeleteDetalle !== undefined) {
                            addDetail(listDetalle, listDeleteDetalle);
                        }

                    }
                    if (typeAcces[1] !== 'fileCapture' && typeAcces[1] !== 'fileCaptureSelect' && typeAcces[1] !== 'fileCapturaProceso' && typeAcces[1] !== 'fileCaptureSearch') {

                        var origen = { 'id': idfuenteOrigenPrincipal, 'origen': fuenteDatosPrincipal };
                        cambiarstatus(origen, typeAcces[2] === undefined ? null : typeAcces[2]);
                    }
                }
            }
        }
    }

    //listDetalle = undefined;
    //contadordetalle = 0;
    listDeleteDetalle = undefined;
    clearDesigner();
}

function clearDesigner() {
    sessionStorage.setItem('mode', null);
    if (cancelar === true) {
        if (listaCamposTCMasiva2) {
            for (var key in listaCamposTCMasiva2) {
                listaCamposTCMasiva2[key]['existeCap'] = false;
                listaCamposTCMasiva2[key]['existeDet'] = false;
            }
            actualizarCampostcMasiva(listaCamposTCMasiva2);
        }
    }
    document.getElementById("container").style.display = "block";
    document.getElementById('stylesheet').href = 'css/stylepreview.css';
    var myNode = document.getElementById("designer");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    dataOriginTables = [];
}

function cancelToCapture() {
    cancelar = true;
    clearDesigner();
}

/*Start of Import/Update/Save of screen preview*/
function saveFile() {
    clearTabspSelecion();
    if (testing) {
        var form = createForm();
        var initElement = document.getElementById("mainContent");
        var initElementoculto = document.getElementById("contOcultos");
        form.appendChild(initElement);
        form.appendChild(initElementoculto);
        var json = mapDOM(form, true);
        json = json.replace("Selected", ""); //quitar la class selected
        saveJson(json);
    } else {
        var name = window.prompt("Nombre del archivo");
        var copyname = name;
        $.getJSON("pantallas/" + name + ".json", function (data) {
            var resul = confirm("Â¿Desea sobreescribir el archivo?");
            if (resul === true) {
                copyname = copyname.toLowerCase();
                var letter = copyname.substr(0, 1);
                var newnamejson = lowercaseletter(copyname, letter);
                callcreatejson(newnamejson);
            } else {
                var name = window.prompt("Nombre del archivo");
                name = name.toLowerCase();
                var letter = name.substr(0, 1);
                var newnamejson = lowercaseletter(name, letter);
                callcreatejson(newnamejson);
            }
            clearclass("mainContent");
        })
                .fail(function () {
                    copyname = copyname.toLowerCase();
                    var letter = copyname.substr(0, 1);
                    var newnamejson = lowercaseletter(copyname, letter);
                    callcreatejson(newnamejson);
                    clearclass("mainContent");
                });
    }
    contab = 0;
    contcompo = 0;
}
/*Create file .json of screen*/
function mapDOM(element, json) {
    var treeObject = {};
    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser) {
            parser = new DOMParser();
            docNode = parser.parseFromString(element, "text/xml");
        } else { // Microsoft strikes again
            docNode = new ActiveXObject("Microsoft.XMLDOM");
            docNode.async = false;
            docNode.loadXML(element);
        }
        element = docNode.firstChild;
    }

    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {

        var typeName = element.nodeName;
        //Personalized converter types
        typeName = "I" + typeName;
        object["elemento"] = typeName;
        var nodeList = element.childNodes;
        if (nodeList !== null) {

            if (nodeList.length) {
                object["content"] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType === 3) {// 1 Element 2 Attr 3 Text
                        if (!nodeList[i].nodeValue.startsWith('\n')) {
                            object["texto"] = nodeList[i].nodeValue;
                        }
                    } else {
                        object["content"].push({});
                        treeHTML(nodeList[i], object["content"][object["content"].length - 1]);
                    }
                }
            }
        }
        if (element.attributes !== null) {
            if (element.attributes.length) {
                object["attributes"] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    if (element.value) {
                        object["attributes"]["valor"] = element.value;
                    }
                    if (element.attributes[i].nodeName === "style") {
                        //Get style an remove spaces to separated after
                        // console.log(element.attributes[i].nodeValue.toString());
                        var styles = element.attributes[i].nodeValue.toString().replace(/ /g, '');

                        var arrayStyle = styles.split(";");

                        for (var p = 0; p < arrayStyle.length; p++) {

                            if (arrayStyle[p] !== "") {//Add another estilos

                                var getPropertie = arrayStyle[p].split(":");

                                if (getPropertie[0] === "width") {
                                    object["attributes"]["ancho"] = getPropertie[1];
                                } else if (getPropertie[0] === "height") {
                                    object["attributes"]["alto"] = getPropertie[1];
                                } else if (getPropertie[0] === "display") {
                                    object["attributes"]["display"] = getPropertie[1];
                                } else if (getPropertie[0] === "max-width") {
                                    object["attributes"]["maxAlto"] = getPropertie[1];
                                } else if (getPropertie[0] === "border-style") {
                                    //console.log(getPropertie[1]);

                                    object["attributes"]["bordeEstilo"] = getPropertie[1];

                                } else if (getPropertie[0] === "border-width") {
                                    //console.log(getPropertie[1]);

                                    object["attributes"]["bordeGrosor"] = getPropertie[1];

                                } else if (getPropertie[0] === "border-bottom-style") {
                                    var valor = getPropertie[1].replace(/[12345]px/g, '');
                                    //console.log(valor);
                                    object["attributes"]["bordeAbajo"] = valor;
                                } else if (getPropertie[0] === "border-left-style") {
                                    var valor = getPropertie[1].replace(/[12345]px/g, '');
                                    //console.log(valor);
                                    object["attributes"]["bordeIzquierda"] = valor;
                                } else if (getPropertie[0] === "border-right-style") {
                                    var valor = getPropertie[1].replace(/[12345]px/g, '');
                                    //console.log(valor);
                                    object["attributes"]["bordeDerecha"] = valor;
                                } else if (getPropertie[0] === "border-top-style") {
                                    var valor = getPropertie[1].replace(/[12345]px/g, '');
                                    //console.log(valor);
                                    object["attributes"]["bordeArriba"] = valor;
                                }
                            }
                        }
                    }
                    else {
                        object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                    }
                }
            }
        }
    }
    treeHTML(element, treeObject);
    return (json) ? JSON.stringify(treeObject) : treeObject;
}

var encode = function (s) {
    var out = [];
    for (var i = 0; i < s.length; i++) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array(out);
};
var saveJson = function (obj) {
    var data = encode(obj);
    var blob = new Blob([data], {
        type: 'application/octet-stream'
    });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.json');
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(event);
};
function callcreatejson(newnamejson) {
    var form = createForm();
    var initElement = document.getElementById("mainContent");
    form.appendChild(initElement);
    var json = mapDOM(form, true);
    json = json.replace("Selected", "");
    var url = route + "/api/GuardarArchivo";
    var dataToPost = { paramOne: newnamejson, paramTwo: json };
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost);
    if (Mensaje.resultado === "ok") {
        alert("Archivo guardado exitosamente");
    } else if (Mensaje.resultado === "undefined") {
        alert(Mensaje.error);
    }
}

function importFile() {
    clearclass("mainContent");
    modalActive(document.getElementById("button-preview"));
}

function importScreen() {
    activeimportscreen = true;
    var fileInput = document.getElementById('cbfile').value;
    if (fileInput) {
        $.getJSON("pantallas/" + fileInput + ".json", function (data) {
            var mainContent = document.getElementById('mainContent');
            var info = data.content[0];
            mainContent.className = info.attributes.class;
            mainContent.style = data.attributes.style;
            for (var i = 0; i < info.content.length; i++) {
                if (info.content[i].elemento === "IDIV") {
                    var iDiv = createJsDiv(info.content[i]);
                    mainContent.appendChild(iDiv);
                }
            }
            /*Close modal as soon has been imported file is loaded */
            var modal = document.getElementById('myModal');
            modal.style.display = "none";
        })
                .fail(function (ex) {
                    console.log(ex);
                });
    }
}

/* MODAL */
function modalActive(element) {
    var modal = document.getElementById('myModal');
    // Get the button that opens the modal
    var btn = element;
    var btnAccept = document.getElementById('button-aceppt');
    if (btn.id === "button-import") {
        btnAccept.setAttribute('onclick', "showScreen()");
    } else if (btn.id === "button-preview") {
        btnAccept.setAttribute('onclick', "importScreen()");
    }
    modal.style.display = "block";
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    var files = document.getElementById('cbfile');
    while (files.firstChild) {
        files.removeChild(files.firstChild);
    }

    if (files !== undefined) {
        var url = route + "/api/Loadfiles";
        var Mensaje = Common.sendRequestJson('POST', url);
        if (Mensaje.resultado !== null) {
            addOptions("cbfile", msg.resultado);
        }
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

//Add the fields to the modal combobox
function addOptions(id, array) {
    var select = document.getElementById(id);
    for (value in array) {
        var option = document.createElement("option");
        option.text = array[value];
        select.add(option);
    }
}

/*Start of globals methods */
function isEmpty(str) {
    return (!str || str.length === 0);
}

function getRealWidth(element) {
    /* var parentWidth = $('#' + element.id).parent().width();
     var childWidth = ($('#' + element.id).width() / parentWidth * 100);
     var realWidth = Math.round(childWidth);*/
    var realWidth = document.getElementById(element.id).style.width; //pending
    var find = ["%", "px"];
    var replace = ['', ' '];
    realWidth = replaceStr(realWidth, find, replace);
    return realWidth;
}

function getRealHeight(element) {
    var realHeight = document.getElementById(element.id).offsetHeight;
    return realHeight;
}

function widthSetAsPixel(element) {
    var width = document.getElementById(element.id).style.width;
    var isPx = width.toString().endsWith("px");
    return isPx;
}

function removeAfter(myId, character) {
    return myId.substring(0, myId.indexOf(character) + character.length - 1);
}

function removeBefore(myId, character) {
    return myId.substring(myId.indexOf(character) + 1, myId.length);
}

//Clear section <div> inside content
function clearclass(nameelement) {
    var element = document.getElementById(nameelement);
    $(element).removeClass(nameelement);
    document.getElementById(nameelement).innerHTML = "";
}

/*Convertir la primer letra en miniscula*/
function lowercaseletter(copyname, letter) {
    var cadena = copyname,
            patron = letter,
            nuevoValor = function (texto) {
                return texto.toLowerCase()
            },
            nuevaCadena = cadena.replace(patron, nuevoValor);
    return nuevaCadena;
}

/*Replace multiple strings*/
function replaceStr(str, find, replace) {
    for (var i = 0; i < find.length; i++) {
        str = str.replace(new RegExp(find[i], 'gi'), replace[i]);
    }
    return str;
}

function addelementtodiv(idivadj, addComp) {
    idivadj.appendChild(addComp);
    return idivadj;
}

function typesizemaxWidth(valor) {
    var searchsize = valor.indexOf("%");
    var typesize = "";
    if (searchsize !== -1) {
        typesize = "%";
    } else {
        searchsize = valor.indexOf("px");
        if (searchsize !== -1) {
            typesize = "px";
        }
    }
    return typesize;
}

function clearTabspSelecion() {//este es el bueno cambiar a cleartabsp
    var disponibleTabs = $('#content').find('.cTab');
    var cont = 0;
    for (var i = 0; i < disponibleTabs.length; i++) {
        var nodohijo = $('#' + disponibleTabs[i].id.toString()).children();
        for (var k = 0; k < nodohijo.length; k++) {
            var padre = $('#' + nodohijo[k].id.toString()).parent();
            var abuelo = padre.parent();
            if ($(abuelo).attr('class').toString().startsWith("mainContent")) {
                if (nodohijo[k].className.toString().startsWith('tab')) {
                    for (var l = 0; l < nodohijo[k].childNodes.length; l++) {
                        cont++;
                        if (l === 0 && cont === 1) {
                            $(nodohijo[k].childNodes[l]).attr('class', "tablinks active Selected");
                        } else {
                            $(nodohijo[k].childNodes[l]).attr('class', "tablinks");
                        }
                    }
                } else if (nodohijo[k].className.toString().startsWith('contain')) {
                    if (k === 1) {
                        var element = document.getElementById($(nodohijo[k]).attr('id'));
                        element.style.display = "block";
                    } else {
                        var element = document.getElementById($(nodohijo[k]).attr('id'));
                        element.style.display = "none";
                    }
                }
            } else {

                if (nodohijo[k].className.toString().startsWith('tab')) {
                    for (var l = 0; l < nodohijo[k].childNodes.length; l++) {
                        $(nodohijo[k].childNodes[l]).attr('class', "tablinks");
                    }
                }
            }
        }
    }
}

function ultimoID(elemen) {//metodos para los a ids
    var idstring = [];
    for (var i = 0; i < elemen.length; i++) {
        idstring[i] = parseInt(elemen[i].id.toString().replace(/[^\d]/g, ''));
    }
    return Math.max.apply(null, idstring);
}

function addCamposTabla() {
    var selCom = document.getElementById('getNameColumn');
    createComponent(selCom);
}

function addParamProceso() {
    var selCom = document.getElementById('getNameParam');
    createComponent(selCom);
}

function getCamposOrigen(originData) {
    var infoOrigin = new Object();
    var isObj = isObject(originData);
    if (isObj) {
        infoOrigin = originData;
    } else {
        infoOrigin.id = originData;
    }

    var getData = "";
    var url = route + "/api/FormasCaptura/CamposOrigenDatos";
    var dataToPost = JSON.stringify(infoOrigin);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado !== null) {
        if (isObj) {
            getData = Mensaje.resultado;
        } else {
            for (var i = 0; i < Mensaje.resultado.length; i++) {
                getData = Mensaje.resultado;
                var json = JSON.stringify(Mensaje.resultado[i]);
                $('#getNameColumn').append($("<option></option>")
                        .attr("value", json.toString())
                        .text(Mensaje.resultado[i]['campo']));
            }
        }
    }
    if (getData) {
        return getData;
    }
}

function getCamposOrigenDetalle(valId, behavior) {
    var id = null;
    if (valId) {
        id = valId;
    } else {
        id = document.getElementById('cbxDetalle').value;
        var combo = document.getElementById('cbxDetalle');
        fuenteDatosPrincipal = combo.options[combo.selectedIndex].text;
    }

    var infoOrigin = null;
    if (behavior === true) {
        infoOrigin = new Object();
        infoOrigin.id = id;
    } else {
        infoOrigin = id;
    }

    if (!(id in dataOriginTables)) {
        dataOriginTables[id.toString()] = getCamposOrigen(infoOrigin);
    }
    if (valId) {
        fuenteDatosPrincipal = dataOriginTables[id.toString()][0]['origenNombre'];
    }
}

function addTable() {
    var value;
    var text;
    var cbxDetail;
    var tabla;
    var divSelected = $('#content').find('.Selected')[0];
    if (divSelected === undefined || divSelected === null) {
        alert('Debes de seleccionar una columna');
    } else {
        if (divSelected.id.toString().startsWith('col')) {
            var typeAcces = sessionStorage.getItem('mode');
            if (typeAcces) {
                if (typeAcces !== null) {
                    typeAcces = JSON.parse(typeAcces);
                }
            }
            /* selectCapture || selectRegistro || SelectBusqueda*/
            if (typeAcces[1] === 'fileCaptureSelect' ||
                    typeAcces[1] === 'fileCaptureSearch' ||
                    typeAcces[4] === "5") {
                value = idfuenteOrigenPrincipal;
                text = fuenteDatosPrincipal;
                tabla = { 'id': value, 'origen': text };
            } else {
                cbxDetail = document.getElementById("cbxDetalle");
                value = cbxDetail.options[cbxDetail.selectedIndex].value;
                text = cbxDetail.options[cbxDetail.selectedIndex].text;
                idfuenteOrigenPrincipal = value;
                tabla = { 'id': value, 'origen': text };
            }
            if ($(".content [tableidentifier='" + tabla.id + "|" + tabla.origen + "']").length > 0) {
                alert("Este tabla ya existe");
                return;
            }


            if (value !== '0' || typeAcces[1] === 'fileCaptureSelect' ||
                    typeAcces[1] === 'fileCaptureSearch' ||
                    typeAcces[4] === "5"/*selectRegistro || SelectBusqueda*/) {
                if (!existeTabla(tabla)) {
                    if (typeAcces[1] === 'fileCapture') {
                        listDetalle[contadordetalle] = tabla;
                    } else if (typeAcces[1] === 'fileCaptureSelect') {
                        tablaSelectorRegistro[0] = tabla;
                    } else if (typeAcces[1] === 'fileCaptureSearch') {
                        tablaSelectorBusqueda = tabla;
                    }
                    var elemen = $('#' + divSelected.id.toString()).children();
                    if (elemen.length > 0 && contcompo === 0) {
                        contcompo = ultimoID(elemen) + 1;
                    } else {
                        contcompo++;
                    }
                    var properties = new Object();
                    var addtoPanel = false;
                    properties.addtoPanel = addtoPanel;
                    properties.parent = divSelected;
                    var getWidht = "100%";
                    getWidht = getWidht === '' ? 0 : getWidht;
                    properties.width = getWidht;
                    var getHeight = document.getElementById('heightDivComp').value;
                    getHeight = getHeight === '' ? 0 : getHeight;
                    properties.height = getHeight;
                    numberCompInside = contcompo;
                    numberCompInsideDiv = $('.mainPanelDivGroup').length;
                    if (numberCompInside === 0) {
                        numberCompInside = parseInt(numberCompInside) + 1;
                    } else {
                        var sumchildres = contcompo;
                        numberCompInside = parseInt(sumchildres) + 1;
                        nameGlobal = 'T' + numberCompInside + (divSelected === null ? '' : 'F' + divSelected.id);
                    }
                    properties.nameGlobal = fuenteDatosPrincipal.replace(' ', '');
                    var addComp = '';
                    var displayIn = $('#compWay').val();
                    properties.displayIn = displayIn;
                    var namechecks = new Array();
                    namechecks = getChecksTree();
                    var count = 0;
                    for (var i = 0; i < namechecks.length; i++) {
                        if (namechecks[i].checked === true) {
                            count++;
                        }
                    }
                    addComp = createTable(properties);
                    divSelected.appendChild(addComp);
                    var father = divSelected.parentNode;
                    $('#' + father.id).css('height', '');
                    if (typeAcces[1] === 'fileCapture') {
                        contadordetalle++;
                    }
                } else {
                    alert('Ya Exixte');
                }
            } else {
                alert('Selecione un detalle');
            }
        } else {
            alert('Debes de seleccionar una columna');
        }
    }
}

function existeTabla(tabla) {
    var typeAcces = sessionStorage.getItem('mode');
    if (typeAcces) {
        if (typeAcces !== null) {
            typeAcces = typeAcces.split(",");
        }
    }
    var exite = false;
    if (typeAcces[1] === 'fileCaptureSelect') {
        if (tablaSelectorRegistro[0] !== undefined) {
            if (tablaSelectorRegistro[0]['origen'] === tabla['origen']) {
                exite = true;
            }
        }
    } else if (typeAcces[1] === 'fileCaptureSearch') {
        if (tablaSelectorBusqueda[0] !== undefined) {
            if (tablaSelectorBusqueda[0]['origen'] === tabla['origen']) {
                exite = true;
            }
        }
    } else if (typeAcces[1] === 'fileCapture') {
        for (var i = 0; i < listDetalle.length; i++) {
            if (listDetalle[i]['origen'] === tabla['origen']) {
                exite = true;
                break;
            }
        }
    }

    return exite;
}

function removerDetalleTabla(detalledelete) {
    var typeAcces = sessionStorage.getItem('mode');
    if (typeAcces) {
        if (typeAcces !== null) {
            typeAcces = typeAcces.split(",");
        }
    }
    if (typeAcces[1] === 'fileCaptureSelect') {
        if (tablaSelectorRegistro[0] !== undefined) {
            if (tablaSelectorRegistro[0]['origen'] === detalledelete) {

                tablaSelectorRegistro.splice(0, 1);
            }
        }
    } else if (typeAcces[1] === 'fileCaptureSearch') {
        if (tablaSelectorBusqueda[0] !== undefined) {
            if (tablaSelectorBusqueda[0]['origen'] === detalledelete) {
                tablaSelectorBusqueda.splice(0, 1);
            }
        }
    } else if (typeAcces[1] === 'fileCapture') {
        for (var i = 0; i < listDetalle.length; i++) {
            if (listDetalle[i]['origen'] === detalledelete) {
                // console.log(listDetalle[i]);
                listDeleteDetalle = listDetalle[i]['id'];
                //deleteScreenDesigner(listDetalle[i]['id']);
                listDetalle.splice(i, 1);
            }
        }
        contadordetalle = listDetalle.length;
    }

}

function isObject(val) {
    return val instanceof Object;
}

function createNuevoComponente(selcomp) {
    var addComp;

    var divSelected = $('#content').find('.Selected')[0];

    var res = getCampoOrigenPorID(divSelected.getAttribute("source"));

    var config = [];//JSON.parse(res['configuracionTipoCaptura']);
    var valores = config['equivalencias'];
    console.log(valores);
    //parent.removeChild(divSelected);
    if (divSelected.getAttribute('tipocaptura') === "1") {
        divSelected.type = selcomp;
    } else if (divSelected.getAttribute('tipocaptura') === "2" || divSelected.getAttribute('tipocaptura') === "3") {
        var properties = new Object();
        var tipocaptura = divSelected.getAttribute('tipocaptura');
        var tipodato = divSelected.getAttribute('tipodato');
        var totalelemen = divSelected.getAttribute('totalelemen');
        properties.source = divSelected.getAttribute('source');
        properties.class = divSelected.getAttribute('class');
        properties.nameGlobal = divSelected.getAttribute('id');
        properties.displayIn = 0;
        if (selcomp === "SELECT") {
            if (document.getElementById('contRadio')) {
                var hijos = document.getElementById('contRadio');
                var titulo = divSelected.getAttribute('titulo');
                while (hijos.firstChild) {
                    hijos.removeChild(hijos.firstChild);
                }

                var label = document.createElement('label');
                label.id = "labelid";
                label.innerText = titulo;
                label.style.maxWidth = "100%";
                label.style.width = "100%";
                label.className = "mainPanelContentComponents";
                hijos.appendChild(label);
                addComp = createComboBox(properties, tipodato, tipocaptura, totalelemen, titulo);
                addComp.setAttribute('titulo', titulo);
                addComp.style.maxWidth = "100%";
                addComp.style.width = "100%";
                hijos.appendChild(addComp);
                if (typeof (hijos.getAttribute('titulo') !== 'undefined')) {
                    hijos.removeAttribute('titulo');
                }
                // console.log(hijos);
            } else {
                if (divSelected.getAttribute('type') === 'radio') {
                    var parent = divSelected.parentNode;
                    var parent1 = parent.parentNode;
                    var titulo = divSelected.getAttribute('titulo');
                    while (parent1.firstChild) {
                        parent1.removeChild(parent1.firstChild);
                    }
                    var label = document.createElement('label');
                    label.id = "labelid";
                    label.innerText = titulo;
                    label.style.maxWidth = "100%";
                    label.style.width = "100%";
                    label.className = "mainPanelContentComponents";
                    parent1.appendChild(label);
                    addComp = createComboBox(properties, tipodato, tipocaptura, totalelemen, titulo);
                    // addComp.setAttribute('titulo', titulo);
                    addComp.style.maxWidth = "100%";
                    addComp.style.width = "100%";
                    parent1.appendChild(addComp);
                    if (typeof (parent1.getAttribute('titulo') !== 'undefined')) {
                        parent1.removeAttribute('titulo');
                    }
                } else {

                    var parent = divSelected.parentNode;
                    var titulo = divSelected.getAttribute('titulo');
                    parent.removeChild(divSelected);
                    addComp = createComboBox(properties, tipodato, tipocaptura, totalelemen, titulo);
                    //addComp.setAttribute('titulo', titulo);
                    parent.appendChild(addComp);
                    if (typeof (parent.getAttribute('titulo') !== 'undefined')) {
                        parent.removeAttribute('titulo');
                    }
                }
            }

        } else if (selcomp === "radio") {
            if (document.getElementById('contRadio')) {
                var hijos = document.getElementById('contRadio');
                var titulo = divSelected.getAttribute('titulo');
                properties.style = hijos.style;
                while (hijos.firstChild) {
                    hijos.removeChild(hijos.firstChild);
                }
                var labelTitulo = document.createElement('LABEL');
                labelTitulo.id = "idtitulo";
                labelTitulo.className = "mainPanelContentComponents";
                labelTitulo.style.maxWidth = "100%";
                labelTitulo.style.width = "100%";
                labelTitulo.innerText = titulo;
                hijos.appendChild(labelTitulo);
                for (var i = 0; i < totalelemen; i++) {
                    addComp = createRadioButton(properties, null, tipodato, tipocaptura, totalelemen, titulo);
                    // addComp.setAttribute('titulo', titulo);
                    hijos.appendChild(addComp);
                }
                hijos.setAttribute('titulo', titulo);
            } else {
                var parent = divSelected.parentNode;
                debugger;
                if (parent.className === "select-style") {
                    parent = parent.parentNode;
                }
                debugger;
                var titulo = divSelected.getAttribute('titulo');
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
                var labelTitulo = document.createElement('LABEL');
                labelTitulo.id = "idtitulo" + titulo;
                labelTitulo.className = "mainPanelContentComponents";
                labelTitulo.style.maxWidth = "100%";
                labelTitulo.style.width = "100%";
                labelTitulo.innerText = titulo;
                parent.appendChild(labelTitulo);
                for (var item in valores) {
                    console.log(item);
                    addComp = createRadioButton(properties, null, tipodato, tipocaptura, totalelemen, valores[item], item);
                    parent.appendChild(addComp);
                }
                //for (var i = 0; i < totalelemen; i++) {
                //    addComp = createRadioButton(properties, null, tipodato, tipocaptura, totalelemen, titulo);
                //    // addComp.setAttribute('titulo', titulo);
                //    parent.appendChild(addComp);
                //}
                parent.setAttribute('titulo', titulo);
            }
        } else if (selcomp === "Lista") {
            if (document.getElementById('contRadio')) {
                var hijos = document.getElementById('contRadio');
                var titulo = divSelected.getAttribute('titulo');
                while (hijos.firstChild) {
                    hijos.removeChild(hijos.firstChild);
                }

                var label = document.createElement('label');
                label.id = "labelid";
                label.innerText = titulo;
                label.style.maxWidth = "100%";
                label.style.width = "100%";
                label.className = "mainPanelContentComponents";
                hijos.appendChild(label);
                addComp = createComboBox(properties, tipodato, tipocaptura, totalelemen, titulo);
                addComp.setAttribute('titulo', titulo);
                addComp.style.maxWidth = "100%";
                addComp.style.width = "100%";
                addComp.setAttribute('size', totalelemen);
                hijos.appendChild(addComp);
                if (typeof (hijos.getAttribute('titulo') !== 'undefined')) {
                    hijos.removeAttribute('titulo');
                }
                // console.log(hijos);
            } else {
                if (divSelected.getAttribute('type') === 'radio') {
                    var parent = divSelected.parentNode;
                    var parent1 = parent.parentNode;
                    var titulo = divSelected.getAttribute('titulo');
                    while (parent1.firstChild) {
                        parent1.removeChild(parent1.firstChild);
                    }
                    var label = document.createElement('label');
                    label.id = "labelid";
                    label.innerText = titulo;
                    label.style.maxWidth = "100%";
                    label.style.width = "100%";
                    label.className = "mainPanelContentComponents";
                    parent1.appendChild(label);
                    addComp = createComboBox(properties, tipodato, tipocaptura, totalelemen, titulo);
                    // addComp.setAttribute('titulo', titulo);
                    addComp.style.maxWidth = "100%";
                    addComp.style.width = "100%";
                    addComp.setAttribute('size', totalelemen);
                    parent1.appendChild(addComp);
                    if (typeof (parent1.getAttribute('titulo') !== 'undefined')) {
                        parent1.removeAttribute('titulo');
                    }
                } else {
                    var parent = divSelected.parentNode;
                    var titulo = undefined;
                    if (divSelected.getAttribute('titulo') !== null) {
                        titulo = divSelected.getAttribute('titulo');
                    }
                    // var titulo = divSelected.getAttribute('titulo');
                    parent.removeChild(divSelected);
                    addComp = createComboBox(properties, tipodato, tipocaptura, totalelemen, titulo);
                    addComp.style.maxWidth = "100%";
                    addComp.style.width = "100%";
                    addComp.setAttribute('size', totalelemen);
                    //addComp.setAttribute('titulo', titulo);
                    parent.appendChild(addComp);
                    if (typeof (parent.getAttribute('titulo') !== 'undefined')) {
                        parent.removeAttribute('titulo');
                    }
                }
            }
        }
    }
}

function cargarArchivoParaTitulosIdioma() {

    //var url = route + '/Resources/Idioma-es.json';
    //var Mensaje = new Object();
    //Mensaje.error = "";
    //Mensaje.noError = "";
    //Mensaje.resultado = Common.sendRequestJson('GET', url, undefined, undefined, false);
    //if (Mensaje.resultado !== null) {
    //    archivoEs = Mensaje.resultado;
    //}
}

function getCampoOrigenPorID(idCampo) {
    //var resultado;
    //var url = route + '/api/CamposOrigenDatos/getCampoPorID';
    //var dataToPost = JSON.stringify(idCampo);
    //var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    //if (Mensaje.resultado === null) {
    //    alert("No object");
    //} else {
    //    resultado = Mensaje.resultado;
    //}
    //return resultado;
}

function getCamposProceso(id) {
    var url = route + '/api/ProcesoOrigen/SearchPorIdProceso';
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        procesoOrigen = Mensaje.resultado;
        if (procesoOrigen.parametrosProcesoOrigen.length > 0) {
            for (var i = 0; i < procesoOrigen['parametrosProcesoOrigen'].length; i++) {
                var parametro = procesoOrigen.parametrosProcesoOrigen[i];
                var json = JSON.stringify(parametro);
                $('#getNameParam').append($("<option></option>")
                            .attr("value", json.toString())
                            .text(parametro['campo']));
            }
        }
        if (procesoOrigen.accionesProcesoOrigen.length > 0) {
            for (var i = 0; i < procesoOrigen.accionesProcesoOrigen.length; i++) {
                var acciones = procesoOrigen.accionesProcesoOrigen[i];
                var json = JSON.stringify(acciones);
                $('#cbxAcciones').append($("<option></option>")
                            .attr("value", json.toString())
                            .text(acciones['descripcion']));
            }
        }
    }

}

function getParametrosProcesoPorID(idCampo) {

    var getData = "";
    var url = route + 'api/ProcesoOrigen/ParametrosProcesoOrigenID';
    var dataToPost = JSON.stringify(idCampo);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        getData = Mensaje.resultado;
    }
    if (getData) {
        return getData;
    }
}


function getHml() {
    openModal();
    var getHml = document.getElementById("mainContent");
    var texAreaOuter = $("#codeHtml").val(getHml.outerHTML);
}

function setterHtml() {
    var getHml = document.getElementById("content");
    var texArea = $("#getterHtml").val();
    getHml.innerHTML = texArea;
    $('#getterHtml').val('');
}


function acceptHtml() {
    copiarAlPortapapeles("codeHtml");

}

function openModal() {
    var modal = document.getElementById("modalBuilder");
    modal.style.display = "block";
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        alert("ss");
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}



function copiarAlPortapapeles(id_elemento) {
    var aux = document.createElement("input");
    aux.setAttribute("value", document.getElementById(id_elemento).value);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    document.getElementById("modalBuilder").style.display = "none";;
}