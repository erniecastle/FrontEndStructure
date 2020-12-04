/*!
 * Copyright 2019 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 * Brief: Class for personalized components 
 */

var route = "";

jQuery(document).ready(function () {

    addListenersEdit();

});


function startCustomTools() {
    addListenersEdit();

}

/********************** Start Tabs functions **********************/
function openTab(evt, tabName) {

    var i, tabcontent, tablinks;
    tabcontent = $('#' + evt.target.parentElement.parentElement.id).children('.contain');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' Selected', '');
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' Selected';

}

/********************** End of Tabs functions **********************/


/********************** Start Edit's functions **********************/
var customSearchObject = {

    customFunction: function (nameFunction, args) {
        return executeFunctionByName(nameFunction, window, args);
    }
};

function buildParametersEditModal(nameCmp, table, nameCols, campostbl, subEntities,
    camposMostrar, preFilters, filtersSearch, camposObtener, tituloSel, tamanoSel, /* Parameters poco comunes:-----> */ optionals) {
    // queryEspecial, camposWhereEsp, valoreswhereEsp

    var queryEspecial;
    var camposWhereEsp;
    var valoreswhereEsp;
    var camposGroup;
    var camposOrden;
    var tipoOrden;
    var isWithAliasObtain = true;

    if (optionals !== undefined && optionals !== null) {
        queryEspecial = optionals["queryEspecial"] === null ? null : optionals["queryEspecial"];
        camposWhereEsp = optionals["camposWhereEsp"] === null ? null : optionals["camposWhereEsp"];
        valoreswhereEsp = optionals["valoreswhereEsp"] === null ? null : optionals["valoreswhereEsp"];
        camposGroup = optionals["camposGroup"] === null ? null : optionals["camposGroup"];
        camposOrden = optionals["camposOrden"] === null ? null : optionals["camposOrden"];
        tipoOrden = optionals["tipoOrden"] === null ? null : optionals["tipoOrden"];
        isWithAliasObtain = optionals["isWithAliasObtain"] === null ? null : optionals["isWithAliasObtain"];
    }

    var parameters = new Object();
    if (Array.isArray(nameCols)) {
        nameCols.push("Seleccionar");
    } else {
        nameCols = nameCols.split(',');
        nameCols.push("Seleccionar");
    }
    var modelEdit = new Object();
    //Fuente
    modelEdit.fuentePrincipal = table;

    var dataFields = null;
    //Campos a mostrar
    if (Array.isArray(campostbl)) {
        dataFields = campostbl;
    } else {
        dataFields = campostbl.split(',');
    }

    if (camposGroup === null || camposGroup === undefined) {
        dataFields.unshift("id");
    } else {
        /*Reserved word for query, Not neccesary use a main ID on aggruppations */
        dataFields.unshift("NOTID");

        //Campos group
        if (Array.isArray(camposGroup)) {
            camposGroup = camposGroup;
        } else {
            camposGroup = camposGroup.split(',');
        }
    }

    modelEdit.camposMostrar = dataFields;

    //Tablas relacionadas
    if (subEntities !== null) {
        if (Array.isArray(subEntities)) {
            modelEdit.tablasRelacionadas = subEntities;
        } else {
            var dataSub = new Array();
            dataSub = subEntities.split(",");
            modelEdit.tablasRelacionadas = dataSub;
        }
    }

    //Rangos
    modelEdit.startPaged = 0;
    modelEdit.endPaged = rowsByPage;//No problem is general
    //Campos where
    var cmpWhere = new Array();
    modelEdit.camposWhere = cmpWhere;
    //Valores where
    var valWhere = new Array();
    modelEdit.valoresWhere = valWhere;
    //Get total elements
    modelEdit.withCount = true;
    //Activación de alias
    modelEdit.activarAlias = false;
    //Activación de alias al obtener objeto
    modelEdit.activarAliasOngetEdit = isWithAliasObtain;

    /**********Filter by only one Key**********/
    var mainFilters = new Object();
    mainFilters.dataEdit = nameCmp;//Like UniqueIdentifier
    mainFilters.showKey = camposMostrar[0];
    mainFilters.showBrief = camposMostrar[1];
    /**********End Filter**********/

    //Filters
    //var filters = getFiltersEdit();
    var cmpWhereArr = [];
    var cmpvalWhere = [];

    if (preFilters !== null) {
        for (var key in preFilters) {
            cmpWhereArr.push(key);
            cmpvalWhere.push(preFilters[key]);
        }
    }

    modelEdit.camposWhere = cmpWhereArr;
    modelEdit.valoresWhere = cmpvalWhere;
    modelEdit.camposGroup = typeof camposGroup === 'undefined' ? null : camposGroup;
    modelEdit.camposOrden = typeof camposOrden === 'undefined' ? null : camposOrden;
    modelEdit.tipoOrden = typeof tipoOrden === 'undefined' ? null : tipoOrden;

    var dataFieldsShow = null;
    if (camposObtener !== null) {
        if (Array.isArray(camposObtener)) {
            dataFieldsShow = camposObtener;
        } else {
            dataFieldsShow = camposObtener.split(',');
        }

        if (camposGroup === null || camposGroup === undefined) {
            dataFieldsShow.unshift("id");
        } else {
            /*Reserved word for query, Not neccesary use a main ID on aggruppations */
            dataFieldsShow.unshift("NOTID");
        }
    }

    if (tituloSel) {
        parameters.tituloSel = tituloSel;
    }

    if (tamanoSel) {
        parameters.tamaSel = tamanoSel;
    }
    parameters.query = modelEdit;
    parameters.nameColumns = nameCols;
    parameters.mainFiltersEdit = mainFilters;
    parameters.buildFilters = filtersSearch;
    // parameters.filters = filters;
    parameters.showColumns = dataFieldsShow;

    parameters.identificador = typeof queryEspecial === 'undefined' ? "" : queryEspecial;
    parameters.camposWhereEsp = typeof camposWhereEsp === 'undefined' ? null : camposWhereEsp;
    parameters.valoresWhereEsp = typeof valoreswhereEsp === 'undefined' ? null : valoreswhereEsp;

    return parameters;
}

function OpenEditModal(cmp) {
    var getEdit = $(cmp).parent().attr("functEdit");
    var datos = new Array();
    var par;
    if (cmp.parentNode.getAttribute("table") && cmp.parentNode.getAttribute("camposamostrar")) {
        datos[0] = cmp.parentNode.getAttribute("table");
        datos[1] = JSON.parse(cmp.parentNode.getAttribute("camposamostrar"));
        datos[2] = $(cmp).parent().attr("dataedit");
        par = customSearchObject['customFunction'](getEdit, datos);
    } else {
        par = customSearchObject['customFunction'](getEdit);
    }
    createModalEditView(par);
    var go = searchRanges(0, par);
    if (go !== undefined && go != null) {
        if (go) {
            openModalEditor(par);
        } else {
            var span = document.getElementsByClassName("modalEdit-close")[0];
            span.parentNode.parentNode.remove();
        }
    }
}

function createModalEditView(par) {
    var imageByCompanieTools = localStorage.getItem('imageByCompanie');
    imageByCompanieTools = imageByCompanieTools.toString().split(",");
    var nameView = par.mainFiltersEdit.dataEdit;
    var content = document.getElementById("container");
    var mainmodal = document.createElement("DIV");
    mainmodal.id = "modal" + nameView;
    mainmodal.className = "modalEdit";

    var modalContent = document.createElement("DIV");
    if (par.tamaSel) {
        modalContent.className = "modalEdit-content " + par.tamaSel;
    } else {
        modalContent.className = "modalEdit-content";
    }

    var spanClose = document.createElement("SPAN");
    spanClose.className = "modalEdit-close";
    var imgClose = document.createElement("img");
    imgClose.src = "img/Iconos/cerrar.png";
    imgClose.style.height = "15px";
    //imgClose.src = changeIconByCmp(imgClose.src);
    spanClose.appendChild(imgClose);
    modalContent.appendChild(spanClose);

    var modalHeader = document.createElement("DIV");
    modalHeader.className = "modal-header";
    modalHeader.style.backgroundColor = imageByCompanieTools[3];
    var editH2 = document.createElement("H2");
    if (par.tituloSel) {
        var t = document.createTextNode(par.tituloSel);
        editH2.appendChild(t);
    } else {
        var t2 = document.createTextNode("Selector de datos");
        editH2.appendChild(t2);
    }
    modalHeader.appendChild(editH2);

    modalContent.appendChild(modalHeader);
    var modalBody = document.createElement("DIV");
    modalBody.className = "modalEdit-body";

    var navEdit = document.createElement("NAV");
    navEdit.id = "containerPag";

    var ulEdit = document.createElement("UL");
    ulEdit.id = "listPag" + nameView;
    ulEdit.className = "pagination";

    var liFirst = document.createElement("LI");
    var aFirst = document.createElement("a");
    aFirst.className = "first_link" + nameView;
    aFirst.href = "#";
    aFirst.innerHTML = "◀";
    liFirst.appendChild(aFirst);

    var liprev = document.createElement("LI");
    var aprev = document.createElement("a");
    aprev.className = "prev_link" + nameView;
    aprev.href = "#";
    aprev.style.display = "none";
    aprev.innerHTML = "«";
    liprev.appendChild(aprev);

    var liPage = document.createElement("LI");
    liPage.className = "active";
    var aPage = document.createElement("a");
    aPage.className = "page_link" + nameView + " active";
    aPage.href = "#";
    aPage.innerHTML = "1";
    liPage.appendChild(aPage);

    var liPage2 = document.createElement("LI");
    var aPage2 = document.createElement("a");
    aPage2.className = "page_link" + nameView;
    aPage2.href = "#";
    aPage2.innerHTML = "2";
    liPage2.appendChild(aPage2);

    var liNext = document.createElement("LI");
    var aNext = document.createElement("a");
    aNext.className = "next_link" + nameView;
    aNext.href = "#";
    aNext.innerHTML = "»";
    liNext.appendChild(aNext);

    var liLast = document.createElement("LI");
    var aLast = document.createElement("a");
    aLast.className = "last_link" + nameView;
    aLast.href = "#";
    aLast.innerHTML = "▶";
    liLast.appendChild(aLast);

    ulEdit.appendChild(liFirst);
    ulEdit.appendChild(liprev);
    ulEdit.appendChild(liPage);
    ulEdit.appendChild(liPage2);
    ulEdit.appendChild(liNext);
    ulEdit.appendChild(liLast);

    navEdit.appendChild(ulEdit);
    //modalBody.appendChild(navEdit);
    var containerEditTable = document.createElement("DIV");
    containerEditTable.className = "containerTable";
    //containerEditTable.style.width = "100%";
    containerEditTable.style.marginLeft = "15px";
    containerEditTable.style.marginTop = "15px";
    containerEditTable.style.marginBottom = "15px";
    //Filters
    if (par.buildFilters !== undefined) {
        var divEditSearch = document.createElement("DIV");
        divEditSearch.className = "modalEdit-search";
        var cmp = null;
        if (par.buildFilters !== null) {
            par.buildFilters.forEach(myFunction);
            function myFunction(item, index) {
                if (item['tipo'] === "string") {
                    cmp = createFilterEditTexbox(item, index);
                }
                divEditSearch.appendChild(cmp);
            }
        }

        var divEditButtonSearch = document.createElement("DIV");
        divEditButtonSearch.className = "modalEdit-filters";
        divEditButtonSearch.setAttribute("dataEditFilter", nameView);
        divEditButtonSearch.style.marginTop = "5px";
        divEditButtonSearch.style.marginBottom = "15px";

        var editBtnSearch = document.createElement("BUTTON");
        editBtnSearch.id = "";
        editBtnSearch.className = "mainPanelContentComponents defaultButton";
        editBtnSearch.setAttribute("idetiqueta", "btnEditBuscar");
        editBtnSearch.setAttribute("onclick", "searchEditByFilters(this)");
        var editImg = document.createElement("IMG");
        editImg.className = "imgBoton";
        editImg.src = "img/Iconos/buscar.png";
        editImg.src = changeIconByCmp(editImg.src);
        var editSpan = document.createElement("SPAN");
        editSpan.innerHTML = "Buscar";
        editBtnSearch.appendChild(editImg);
        editBtnSearch.appendChild(editSpan);
        divEditButtonSearch.appendChild(editBtnSearch);

        //modalBody.appendChild(divEditSearch);
        //modalBody.appendChild(divEditButtonSearch);
        containerEditTable.appendChild(divEditSearch);
        containerEditTable.appendChild(divEditButtonSearch);
    }

    //var containerEditTable = document.createElement("DIV");
    //containerEditTable.className = "containerTable";
    //containerEditTable.style.width = "100%";

    var scrollEditTable = document.createElement("DIV");
    scrollEditTable.id = "scrollEditSearch";
    scrollEditTable.className = "mainPanelContentComponents scrollit";

    var tableEdit = document.createElement("TABLE");
    tableEdit.id = "tableEdit";

    var tableHeadEdit = document.createElement("THEAD");
    tableHeadEdit.id = "headerEdit";

    var tableBodyEdit = document.createElement("TBODY");
    tableBodyEdit.id = "bodyEdit";




    tableEdit.appendChild(tableHeadEdit);
    tableEdit.appendChild(tableBodyEdit);
    scrollEditTable.appendChild(tableEdit);
    containerEditTable.appendChild(scrollEditTable);
    containerEditTable.appendChild(navEdit);
    modalBody.appendChild(containerEditTable);
    modalContent.appendChild(modalBody);
    mainmodal.appendChild(modalContent);
    content.appendChild(mainmodal);
}

/*****Types Filters Edit ****/
function createFilterEditTexbox(prop, index) {
    var divGroup = document.createElement('DIV');
    divGroup.className = "mainPanelDivGroup";

    var labelEdit = document.createElement('LABEL');
    // nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    //labelEdit.id = nameGlobal;
    labelEdit.className = "mainPanelContentComponents";
    labelEdit.innerHTML = prop.etiqueta;
    divGroup.appendChild(labelEdit);
    var addComp = document.createElement('INPUT');
    addComp.id = "filter-" + index;
    addComp.setAttribute('kind', 'filter');
    addComp.setAttribute('type', 'text');
    if (prop.etiqueta) {
        addComp.setAttribute('placeholder', prop.etiqueta);
    }
    if (prop.campo) {
        addComp.setAttribute('persist', prop.campo);
    }
    if (prop.operador) {
        addComp.setAttribute('operador', prop.operador);
    }
    addComp.className = 'mainPanelContentComponents';
    addComp.style.width = "100%";
    if (prop.medida) {
        var typeSize = prop.medida;
        if (typeSize === "s") {
            divGroup.style.width = "25%";
        } else if (typeSize === "m") {
            divGroup.style.width = "50%";
        } else if (typeSize === "l") {
            divGroup.style.width = "75%";
        }
    }
    divGroup.appendChild(addComp);
    return divGroup;
}

function createFilterDatePicker(prop, index) {
    var divGroup = document.createElement('DIV');
    divGroup.className = "mainPanelDivGroup";
    var label = document.createElement('LABEL');
    label.className = "mainPanelContentComponents";
    if (prop.etiqueta) {
        label.innerText = prop.etiqueta;
    }
    divGroup.appendChild(label);
    var addComp = document.createElement('INPUT');
    addComp.id = prop.idcompo;
    addComp.setAttribute('kind', 'filter');
    addComp.setAttribute('type', 'date');
    if (prop.campo) {
        addComp.setAttribute('persist', prop.campo);
    }
    if (prop.operador) {
        addComp.setAttribute('operador', prop.operador);
    }
    addComp.className = 'mainPanelContentComponents';
    if (prop.medida) {
        var typeSize = prop.medida;
        if (typeSize === "s") {
            divGroup.style.width = "250px";
        } else if (typeSize === "m") {
            divGroup.style.width = "500px";
        } else if (typeSize === "l") {
            divGroup.style.width = "750px";
        }
    }
    divGroup.appendChild(addComp);
    return divGroup;
}

function createFilterSelect(prop, index) {
    var divGroup = document.createElement('DIV');
    divGroup.className = "mainPanelDivGroup";
    var label = document.createElement('LABEL');
    label.className = "mainPanelContentComponents";
    if (prop.etiqueta) {
        label.innerText = prop.etiqueta;
    }
    divGroup.appendChild(label);
    var selDiv = document.createElement("DIV");
    selDiv.className = "select-style";
    selDiv.style.width = "100%";
    var addComp = document.createElement("select");
    addComp.id = prop.idcompo;
    addComp.setAttribute('kind', 'filter');
    if (prop.campo) {
        addComp.setAttribute('persist', prop.campo);
    }
    if (prop.operador) {
        addComp.setAttribute('operador', prop.operador);
    }
    addComp.className = 'mainPanelContentComponents';
    if (prop.medida) {
        var typeSize = prop.medida;
        if (typeSize === "s") {
            divGroup.style.width = "250px";
        } else if (typeSize === "m") {
            divGroup.style.width = "500px";
        } else if (typeSize === "l") {
            divGroup.style.width = "750px";
        }
    }
    addComp = customSearchObject['customFunction'](prop.funcion, addComp);
    selDiv.appendChild(addComp);
    divGroup.appendChild(selDiv);
    return divGroup;
}

function createFilterEditConsulta(prop, index) {
    var divGroup = document.createElement('DIV');
    divGroup.className = "mainPanelDivGroup";
    var addComp = document.createElement('DIV');
    //addComp.id = prop.nameGlobal;
    addComp.className = 'editContainer';
    var labelEdit = document.createElement('LABEL');
    // nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    //labelEdit.id = nameGlobal;
    labelEdit.className = "mainPanelContentComponents";
    labelEdit.innerHTML = prop.etiqueta;
    var divEdit = document.createElement('DIV');
    // nameGlobal = 'E' + (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    divEdit.id = prop.idcompo;
    divEdit.className = 'edit';
    divEdit.setAttribute("dataedit", prop.dataedit);
    divEdit.setAttribute("functedit", prop.functedit);
    divEdit.setAttribute('kind', 'filter');
    if (prop.campo) {
        divEdit.setAttribute('persist', prop.campo);
    }
    if (prop.operador) {
        divEdit.setAttribute('operador', prop.operador);
    }
    var editInputSearch = document.createElement('INPUT');
    //nameGlobal = 'S' + (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    //editInputSearch.id = nameGlobal;
    editInputSearch.className = "mainPanelContentComponents";
    editInputSearch.type = 'text';
    editInputSearch.className = 'editKey';
    editInputSearch.setAttribute('kind', 'filterKey');

    // editInputSearch.placeholder = "Buscar";
    //editInputSearch.setAttribute("source", divSelected.getAttribute("source"));
    //editInputSearch.setAttribute("tipodato", tipoDato);
    //editInputSearch.setAttribute("tipocaptura", tipoCaptura);
    //editInputSearch.setAttribute("titulo", divSelected.getAttribute("titulo"));

    var editInputBrief = document.createElement('INPUT');
    // nameGlobal = 'B' + (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    // editInputBrief.id = nameGlobal;
    editInputBrief.className = "mainPanelContentComponents";
    editInputBrief.type = 'text';
    editInputBrief.className = 'editBrief';
    // editInputBrief.placeholder = "...";
    editInputBrief.disabled = true;


    var editButton = document.createElement('BUTTON');
    //nameGlobal = 'BU' + (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    //editButton.id = nameGlobal;
    editButton.className = 'editButton';
    editButton.setAttribute("onclick", "OpenEditModal(this)");
    var imgCan = document.createElement("img");
    imgCan.className = "imgBoton";
    imgCan.src = "img/Iconos/puntos.png";
    imgCan.src = changeIconByCmp(imgCan.src);
    editButton.appendChild(imgCan);
    addComp.appendChild(labelEdit);
    divEdit.appendChild(editInputSearch);
    divEdit.appendChild(editInputBrief);
    divEdit.appendChild(editButton);
    addComp.appendChild(divEdit);
    if (prop.medida) {
        var typeSize = prop.medida;
        if (typeSize === "s") {
            divGroup.style.width = "250px";
        } else if (typeSize === "m") {
            divGroup.style.width = "500px";
        } else if (typeSize === "l") {
            divGroup.style.width = "750px";
        }
    }
    divGroup.appendChild(addComp);

    return divGroup;
}
/***** End Types Filters Edit *****/

function openModalEditor(par) {
    var nameView = par.mainFiltersEdit.dataEdit;
    var modal = document.getElementById("modal" + nameView);
    modal.style.display = "block";
    var span = document.getElementsByClassName("modalEdit-close")[0];
    span.onclick = function () {
        modal.style.display = "none";
        span.parentNode.parentNode.remove();
    }
    window.onclick = function (event) {
        getObjectEdit
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function searchRanges(startIn, paramsEdit, unique) {
    if (unique === undefined || unique === null) {
        unique = false;
    }
    var url = route + "/api/Generic/getConsultaPorFiltros";
    var dataToPost = JSON.stringify(paramsEdit.query);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.error !== "") {
        alert(Mensaje.error);
    } else {
        var values = Mensaje.resultado;
        /* Validator Data */
        var editCmp = $("[dataEdit=" + paramsEdit.mainFiltersEdit.dataEdit + "]");
        var getEdit = editCmp.attr("functedit") + "SearchAction";
        var par = customSearchObject['customFunction'](getEdit, values[0]);
        if (par == false) {
            return false;
        }
        if (unique) {
            return values;
        } else {
            if (startIn === 0) {
                createEditPagination(values[1], paramsEdit.mainFiltersEdit.dataEdit);

            } else {

            }
            if (values[0].length > 0) {
                setFullTable(values[0], paramsEdit);
            } else {
                alert("No hay informacion");
                return false;
            }
            return true;
        }
    }
}

function setFullTable(data, props) {
    var tabla;
    if (props.type === "selector") {
        tabla = "tableEditSelector";
    } else {
        tabla = 'tableEdit';
    }

    var tbl = document.getElementById(tabla);

    //var headerTbl = document.getElementById('headerEdit');
    //var bodyTbl = document.getElementById('bodyEdit');
    var headerTbl = tbl.querySelector("#headerEdit");
    var bodyTbl = tbl.querySelector("#bodyEdit");

    var trFirst = document.createElement('tr');
    var th = null;
    var hiddenCols = [];
    props.nameColumns.forEach(function (valor, indice) {
        th = document.createElement('th');
        th.id = valor;
        if (valor.startsWith("()")) {
            th.style.display = "none";
            hiddenCols.push(indice + 1);
        }
        th.appendChild(document.createTextNode(valor));
        trFirst.appendChild(th);
    });
    var foundBrief;
    var dataShow = props.query.camposMostrar;
    var foundKey = dataShow.findIndex(x => x === props.mainFiltersEdit.showKey);

    var foundDates = [];
    dataShow.filter(function (elem, index, array) {
        if (elem.startsWith("Date:")) {
            foundDates.push(index);
        }
    });

    if (props.mainFiltersEdit.showBrief) {
        if (props.mainFiltersEdit.showBrief.includes("@")) {
            var variable = props.mainFiltersEdit.showBrief.toString().replace("@", "");
            var camposConcat = variable.split(",");
            foundBrief = new Array();
            for (var i = 0; i < camposConcat.length; i++) {
                foundBrief[foundBrief.length] = dataShow.findIndex(x => x === camposConcat[i]);
            }
        } else {
            foundBrief = dataShow.findIndex(x => x === props.mainFiltersEdit.showBrief);
        }
    }

    headerTbl.appendChild(trFirst);

    $('#' + tabla).find("tr:gt(0)").remove();

    var dataLength = data.length;
    var propViews = new Object();
    propViews.idEdit = props.mainFiltersEdit.dataEdit;
    for (i = 0; i < dataLength; i++) {
        var valueId = data[i][0];//The identifer Id of table
        var valuesHidden = [];
        propViews.brief = undefined;
        var tr = document.createElement('tr');
        tr.id = valueId.toString();
        var columnsLength = data[i].length;
        var td = null;
        for (var j = 1; j < columnsLength; j++) {
            td = document.createElement('td');
            var isHidden = hiddenCols.indexOf(j);
            if (isHidden !== -1) {
                td.style.display = "none";
                valuesHidden.push(data[i][j]);
            }
            if (j === foundKey) {
                propViews.key = data[i][j];
            } else if (j === foundBrief) {
                propViews.brief = data[i][j];
            } else if (Array.isArray(foundBrief)) {
                if (foundBrief.includes(j)) {
                    var brief = "";
                    foundBrief.forEach(element => brief += data[i][element] + " ");
                    propViews.brief = brief;
                }
            } else if (foundDates.indexOf(j) >= 0) {
                var getDateCmp = new Date(data[i][j]);
                data[i][j] = formatDatemmddyyy(getDateCmp);
            }
            var fecha = new Date(data[i][j]);
            td.appendChild(document.createTextNode(data[i][j]));
            tr.appendChild(td);
        }
        //Default buttons for Select
        if (!props.desactivarSel) {
            td = document.createElement('td');
            var a = document.createElement('a');
            // var linkText = document.createTextNode(idioma.messageFormatter("Selecionar")());
            var linkText = document.createTextNode("Selecionar");
            a.appendChild(linkText);
            if (props.type === "selector") {
                var showData = propViews.idEdit + "," + valueId + "," + valuesHidden;
                a.href = "javascript:setObjectSelector('" + showData + "');";
            } else {
                var showData = propViews.idEdit + "," + valueId + "," + propViews.key + "," + propViews.brief;
                a.href = "javascript:getObjectEdit('" + showData + "');";
            }
            //var showData = propViews.idEdit + "," + valueId + "," + propViews.key + "," + propViews.brief;
            //a.href = "javascript:getObjectEdit('" + showData + "');";

            td.appendChild(a);
            tr.appendChild(td);
        }
        bodyTbl.appendChild(tr);
    }
    tbl.appendChild(bodyTbl);
}

function getObjectEdit(edit) {
    var keysEdit = edit.split(",");
    var editCmp = $("[dataEdit=" + keysEdit[0].toString() + "]");
    editCmp.attr("value", keysEdit[1]);
    //var t = $("[dataEdit=" + keysEdit[0].toString() + "]").children();
    var keyEdit = $("[dataEdit=" + keysEdit[0].toString() + "]").children(".editKey");
    var briefEdit = $("[dataEdit=" + keysEdit[0].toString() + "]").children(".editBrief");
    keyEdit.val(keysEdit[2]);
    briefEdit.val(keysEdit[3]);
    //mainFiltersEdit
    var par;
    if (editCmp.attr("table") && editCmp.attr("camposamostrar")) {
        var datos = new Array();
        datos[0] = editCmp.attr("table");
        datos[1] = editCmp.attr("camposamostrar");
        datos[2] = editCmp.attr("dataedit");
        par = customSearchObject['customFunction'](editCmp.attr("functedit"), datos);
    } else {
        par = customSearchObject['customFunction'](editCmp.attr("functedit"));
    }
    par.query.camposWhere.push(par.mainFiltersEdit.showKey);
    par.query.valoresWhere.push(keysEdit[2]);



    if (par.showColumns == null) {
        showObjectEdit(keysEdit[1], editCmp.attr("functedit"));
    } else if (par.identificador !== "") {
        if (par.camposWhereEsp != null && par.valoresWhereEsp != null) {
            par.camposWhereEsp.push(par.mainFiltersEdit.showKey);
            par.valoresWhereEsp.splice(par.camposWhereEsp.length - 1, 0, keysEdit[2]);
        } else {
            if (par.valoresWhereEsp != null) {
                par.camposWhereEsp = new Array();
                par.camposWhereEsp.push(par.mainFiltersEdit.showKey);
                par.valoresWhereEsp.unshift(keysEdit[2]);
            }
        }
        getEditObjectSelectedEsp(par, editCmp.attr("functedit"));
    } else {
        getEditObjectSelected(par, editCmp.attr("dataedit"));
    }
    var span = document.getElementsByClassName("modalEdit-close")[0];
    span.parentNode.parentNode.remove();

    var getEdit = editCmp.attr("functedit") + "AfterShow";
    var par = customSearchObject['customFunction'](getEdit);

}

function showObjectEdit(idObject, cmpName) {
    var getEdit = cmpName + "Show";
    var par = customSearchObject['customFunction'](getEdit, idObject);
}

/*------------Start pagination------------*/
//var items = 0, rowsByPage = 10, numbersByPage = 5,
//        fromPage = 0, pagina = 0, totalPages;

function createEditPagination(numberData, origen) {
    var paginador = $("#listPag" + origen);
    // paginador.attr("sourcePage", origen);
    paginador.attr("totaReg", numberData);
    paginador.html("");
    items = numberData;
    totalPages = Math.ceil(items / rowsByPage);

    $('<li><a href="#" class="first_link' + origen + '">&#9664;</a></li>').appendTo(paginador);
    $('<li><a href="#" class="prev_link' + origen + '">&laquo;</a></li>').appendTo(paginador);

    for (var b = 0; totalPages > b;)
        $('<li><a href="#" class="page_link' + origen + '">' + (b + 1) + "</a></li>").appendTo(paginador), b++;

    numbersByPage > 1 && ($(".page_link" + origen).hide(), $(".page_link" + origen).slice(0, numbersByPage).show());

    $('<li><a href="#" class="next_link' + origen + '">&raquo;</a></li>').appendTo(paginador);
    $('<li><a href="#" class="last_link' + origen + '">&#9654;</a></li>').appendTo(paginador);

    0 === pagina && (paginador.find(".page_link" + origen + ":first").addClass("active"),
            paginador.find(".page_link" + origen + ":first").parents("li").addClass("active"));

    paginador.find(".prev_link" + origen).hide(), paginador.find("li .page_link" + origen).click(function () {
        var a = $(this).html().valueOf() - 1;
        return loadPaginationEdit(a, paginador, origen), !1;
    }), paginador.find("li .first_link" + origen).click(function () {
        var a = 0;
        return loadPaginationEdit(a, paginador, origen), !1;
    }), paginador.find("li .prev_link" + origen).click(function () {
        var a = parseInt(paginador.data("pag")) - 1;
        return loadPaginationEdit(a, paginador, origen), !1;
    }), paginador.find("li .next_link" + origen).click(function () {
        if (paginador.data("pag") === undefined) {
            a = 1;
        } else {
            a = parseInt(paginador.data("pag")) + 1;
        }
        return loadPaginationEdit(a, paginador, origen), !1;
    }), paginador.find("li .last_link" + origen).click(function () {
        items = paginador.attr("totaReg");
        totalPages = Math.ceil(items / rowsByPage);
        var a = totalPages - 1;
        return loadPaginationEdit(a, paginador, origen), !1;
    });
}

function loadPaginationEdit(a, paginador, origen) {
    var isPaginado = false;
    pagina = a;
    fromPage = pagina * rowsByPage;
    pagina >= 1 ? paginador.find(".prev_link" + origen).show() : paginador.find(".prev_link" + origen).hide();
    totalPages - numbersByPage > pagina ? paginador.find(".next_link" + origen).show() : paginador.find(".next_link" + origen).hide(),
            paginador.data("pag", pagina), numbersByPage > 1 && ($(".page_link" + origen).hide(),
            totalPages - numbersByPage > pagina ? $(".page_link" + origen).slice(pagina, numbersByPage + pagina).show() :
            totalPages > numbersByPage ? $(".page_link" + origen).slice(totalPages - numbersByPage).show() :
            $(".page_link" + origen).slice(0).show()), paginador.children().removeClass("active"),
            paginador.children().eq(pagina + 2).addClass("active");
    var par;
    var getEdit = $("[dataEdit=" + origen + "]").attr("functEdit");
    var parent = $("[dataEdit=" + origen + "]");
    if ($("[dataEdit=" + origen + "]").attr("table") && $("[dataEdit=" + origen + "]").attr("camposamostrar")) {
        var datos = new Array();
        datos[0] = $("[dataEdit=" + origen + "]").attr("table");
        datos[1] = JSON.parse($("[dataEdit=" + origen + "]").attr("camposamostrar"));
        datos[2] = $("[dataEdit=" + origen + "]").attr("dataedit");
        par = customSearchObject['customFunction'](getEdit, datos);
    } else if ($("[dataTbl=" + origen + "]").attr("paginado")) {
        var valor = $("[dataTbl=" + origen + "]").attr("paginado");
        if (valor === "true") {
            isPaginado = true;
            var val = {};
            val['fromPage'] = fromPage;
            val['origen'] = origen;
            par = customSearchObject['customFunction']("cambiarPagina", val);
        }

    } else {
        par = customSearchObject['customFunction'](getEdit);
    }


    //par.query.startPaged = fromPage;
    //par.query.startPaged = fromPage;
    //console.log(par);
    /*if (par.modelEdit.type !== undefined) {
        alert(par.modelEdit.type);
    }*/
    if (!isPaginado) {
        par.query.startPaged = fromPage;
        par.query.startPaged = fromPage;
        searchRanges(fromPage, par);
    }
}
/*------------End on pagination------------*/

/*------------Managment Filters------------*/
function getFiltersEdit() {
    var setFilters = new Array();
    $('[kind="filter"]').each(function () {
        var insertToFilter = new Array();
        var cmpVal = $(this).attr("persist");
        insertToFilter.push(cmpVal);
        var operador = $(this).attr("operador") === undefined ? null : $(this).attr("operador");
        if (operador === null) {
            insertToFilter.push("");
        } else {
            insertToFilter.push(operador);
        }
        var valorCmp = null;
        if (this.tagName === "INPUT") {
            if ($(this).val() !== "") {
                if (this.getAttribute('type') === "text") {
                    valorCmp = $(this).val();
                } else if (this.getAttribute('type') === "date") {
                    var dato = formatDateddmmyyy(new Date(formantDdMmYyyy($(this).val())));
                    valorCmp = dato;
                }
            }
        } else if (this.tagName === "SELECT") {
            if ($(this).val() !== "") {
                valorCmp = $(this).val();
            }
        } else if (this.tagName === "DIV" && this.className === "edit") {
            var input = this.firstElementChild;
            if (input.value !== "") {
                valorCmp = input.value;
            }
        }

        if (valorCmp !== null) {
            if (operador === null) {
                insertToFilter.push("%" + valorCmp + "%");
            } else {
                insertToFilter.push(valorCmp);
            }
            setFilters.push(insertToFilter);
        }

        //var cmpVal = $(this).attr("persist");
        //if (cmpVal.includes("_ID")) {
        //    cmpVal = cmpVal.substring(0, cmpVal.indexOf('_'));
        //    cmpVal += ".id";
        //}
        //setFilters.push(new Array(cmpVal, $(this).val()));
    });
    return setFilters;
}

function setPreFilters(preFilters) {
    if (preFilters === null || preFilters === undefined) {
        preFilters = {};
    }
    var filters = getFiltersEdit();
    for (var i = 0; i < filters.length; i++) {
        var colFilter = filters[i][0], operatorFilter = filters[i][1], valueFilter = filters[i][2];
        preFilters[colFilter + operatorFilter] = valueFilter;
    }
    return preFilters;
}

function searchEditByFilters(cmp) {
    var getFinderEdit = $(cmp).parent().attr("dataEditFilter");
    var getEdit = $("div[dataEdit=" + getFinderEdit + "]").attr("functEdit");
    if (getEdit === undefined) {
        getEdit = $("button[dataEdit=" + getFinderEdit + "]").attr("functEdit");
    }
    var par = customSearchObject['customFunction'](getEdit);
    searchRanges(0, par);
}
/*------------End of Managment Filters------------*/

function searchEditKey(parKey) {
    var keyVal = parKey[0];
    var cmp = $("div[functEdit='" + parKey[1] + "']")[0];
    var datos = new Array();
    //var par = customSearchObject['customFunction'](parKey[1]);
    var par;
    if (cmp.getAttribute("table") && cmp.getAttribute("camposamostrar")) {
        datos[0] = cmp.getAttribute("table");
        datos[1] = JSON.parse(cmp.getAttribute("camposamostrar"));
        datos[2] = $(cmp).attr("dataedit");
        par = customSearchObject['customFunction'](parKey[1], datos);
    } else {
        par = customSearchObject['customFunction'](parKey[1]);
    }
    par.query.camposWhere.push(par.mainFiltersEdit.showKey);
    par.query.valoresWhere.push(keyVal);
    var getVal = searchRanges(-1, par, true);
    var editFather = $("div[functEdit='" + parKey[1] + "']");
    if (getVal === -1) {
        getVal = undefined;

    } else {
        getVal = getVal[0][0];
    }

    if (getVal === undefined) {
        editFather.children(".editKey").val("");
        editFather.children(".editBrief").val("");
        editFather.removeAttr("value");
        /*editFather.removeAttr("extravalues");*/
        showObjectEdit(null, parKey[1]);
        alert("Esta clave no existe");//99
    } else {
        var dataShow = par.query.camposMostrar;
        var foundID = dataShow.findIndex(x => x === "id");
        var foundKey = dataShow.findIndex(x => x === par.mainFiltersEdit.showKey);
        var foundBrief = null;
        if (par.mainFiltersEdit.showBrief) {
            if (par.mainFiltersEdit.showBrief.includes("@")) {
                var variable = par.mainFiltersEdit.showBrief.toString().replace("@", "");
                var camposConcat = variable.split(",");
                foundBrief = new Array();
                for (var i = 0; i < camposConcat.length; i++) {
                    foundBrief[foundBrief.length] = dataShow.findIndex(x => x === camposConcat[i]);
                }
            } else {
                foundBrief = dataShow.findIndex(x => x === par.mainFiltersEdit.showBrief);
            }
        }


        var idEl = null;

        getVal.forEach(function (item, index) {
            if (index === foundID) {
                $("[dataEdit=" + par.mainFiltersEdit.dataEdit + "]").attr("value", item);
                idEl = item;
            }
            if (index === foundKey) {
                editFather.children(".editKey").val(item);
            } else if (index === foundBrief) {
                editFather.children(".editBrief").val(item);
            } else if (Array.isArray(foundBrief)) {
                if (foundBrief.includes(index)) {
                    var brief = "";
                    foundBrief.forEach(element => brief += getVal[element] + " ");
                    editFather.children(".editBrief").val(brief);
                }
            }
        });

        //editFather.children(".editBrief").val(brief);

        if (par.showColumns == null) {
            showObjectEdit(idEl, parKey[1]);
        } else if (par.identificador !== "") {
            if (par.camposWhereEsp != null && par.valoresWhereEsp != null) {
                par.camposWhereEsp.push(par.mainFiltersEdit.showKey);
                par.valoresWhereEsp.splice(par.camposWhereEsp.length - 1, 0, keyVal);
            } else {
                if (par.valoresWhereEsp != null) {
                    par.camposWhereEsp = new Array();
                    par.camposWhereEsp.push(par.mainFiltersEdit.showKey);
                    par.valoresWhereEsp.unshift(keyVal);
                }
            }
            getEditObjectSelectedEsp(par, parKey[1]);
        } else {
            getEditObjectSelected(par, editFather.attr("dataedit"));
        }
    }
}

function searchEditKeyID(parKey) {
    var keyVal = parKey[0];
    var cmp = parKey[1];
    var datos = new Array();
    var getEdit = $(cmp).attr("functEdit");
    var editFather;
    var par;
    if (cmp.getAttribute("table") && cmp.getAttribute("camposamostrar")) {
        datos[0] = cmp.getAttribute("table");
        datos[1] = JSON.parse(cmp.getAttribute("camposamostrar"));
        datos[2] = $(cmp).attr("dataedit");
        par = customSearchObject['customFunction'](getEdit, datos);
        editFather = $("div[dataedit='" + cmp.getAttribute("dataedit") + "']");
    } else {
        par = customSearchObject['customFunction'](getEdit);
        editFather = $("div[functEdit='" + getEdit + "']");
    }
    par.query.camposWhere.push("id");
    par.query.valoresWhere.push(keyVal);
    var getVal = searchRanges(-1, par, true);
    //var editFather = $("div[functEdit='" + getEdit + "']");
    getVal = getVal[0][0];
    if (getVal === undefined) {
        editFather.children(".editKey").val("");
        editFather.children(".editBrief").val("");
        editFather.removeAttr("value");
        /*editFather.removeAttr("extravalues");*/
        showObjectEdit(null, parKey[1]);
        alert("Esta clave no existe");//99
    } else {
        var dataShow = par.query.camposMostrar;
        var foundID = dataShow.findIndex(x => x === "id");
        var foundKey = dataShow.findIndex(x => x === par.mainFiltersEdit.showKey);
        var foundBrief = null;
        if (par.mainFiltersEdit.showBrief) {
            if (par.mainFiltersEdit.showBrief.includes("@")) {
                var variable = par.mainFiltersEdit.showBrief.toString().replace("@", "");
                var camposConcat = variable.split(",");
                foundBrief = new Array();
                for (var i = 0; i < camposConcat.length; i++) {
                    foundBrief[foundBrief.length] = dataShow.findIndex(x => x === camposConcat[i]);
                }
            } else {
                foundBrief = dataShow.findIndex(x => x === par.mainFiltersEdit.showBrief);
            }
        }

        var idEl = null;
        var brief = null;
        getVal.forEach(function (item, index) {
            if (index === foundID) {
                $("[dataEdit=" + par.mainFiltersEdit.dataEdit + "]").attr("value", item);
                idEl = item;
            }
            if (index === foundKey) {
                editFather.children(".editKey").val(item);
            } else if (index === foundBrief) {
                editFather.children(".editBrief").val(item);
            } else if (Array.isArray(foundBrief)) {
                if (foundBrief.includes(index)) {
                    var brief = "";
                    foundBrief.forEach(element => brief += getVal[element] + " ");
                    editFather.children(".editBrief").val(brief);
                }
            }
        });

        if (par.showColumns === null) {
            showObjectEdit(idEl, parKey[1]);
        } else if (par.identificador !== "") {
            if (par.camposWhereEsp !== null && par.valoresWhereEsp !== null) {
                par.camposWhereEsp.push(par.mainFiltersEdit.showKey);
                par.valoresWhereEsp.splice(par.camposWhereEsp.length - 1, 0, keyVal);
            } else {
                if (par.valoresWhereEsp !== null) {
                    par.camposWhereEsp = new Array();
                    par.camposWhereEsp.push(par.mainFiltersEdit.showKey);
                    par.valoresWhereEsp.unshift(keyVal);
                }
            }
            getEditObjectSelectedEsp(par, parKey[1]);
        } else {
            getEditObjectSelected(par, editFather.attr("dataedit"));
        }
    }

}

function getEditObjectSelected(paramsEdit, nameCmp) {
    //paramsEdit.query.camposMostrar = paramsEdit.showColumns;
    var extraValues = [];
    var displayData = paramsEdit.showColumns;
    paramsEdit.query.activarAlias = paramsEdit.query.activarAliasOngetEdit;

    for (var i = 0; i < displayData.length; i++) {
        if (displayData[i].startsWith("[]")) {
            displayData[i] = displayData[i].toString().substr(2);
            if (paramsEdit.query.activarAlias) {
                extraValues.push(displayData[i]);
            } else {
                extraValues.push(i);
            }
        }
    }

    paramsEdit.query.camposMostrar = displayData;


    var url = route + "/api/Generic/getConsultaPorFiltros";
    var dataToPost = JSON.stringify(paramsEdit.query);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.error === "") {
        var resultData = Mensaje.resultado[0];
        var editCmp = $("[dataedit=" + nameCmp.toString() + "]");
        var extraData = [];
        for (var i = 0; i < extraValues.length; i++) {
            if (paramsEdit.query.activarAlias) {
                var getData = extraValues[i].charAt(0).toUpperCase() + extraValues[i].slice(1);
                if (getData.includes(".")) {
                    getData = getData.replace(/\./g, "");
                }
                extraData.push(resultData[0][getData]);
            } else {
                extraData.push(resultData[0][extraValues[i]]);
            }
        }
        editCmp.attr("extravalues", extraData);
        showObjectEdit(resultData, editCmp.attr("functEdit"));
    } else {
        console.log(Mensaje.error);

    }
}

function addDataEdit(nameCmp, nameKey, value) {
    var extraValues = [];
    var editCmp = $("[dataedit=" + nameCmp.toString() + "]");
    $(editCmp).data(nameKey, value);
}

function getDataEdit(nameCmp, nameKey) {
    var editCmp = $("[dataedit=" + nameCmp.toString() + "]");
    return $(editCmp).data(nameKey);
}

function getEditObjectSelectedEsp(paramsEdit, nameCmp) {
    var res = {};
    var url = route + "/api/Generic/getConsultaPorFiltrosEspecial";
    res.valoresWhere = paramsEdit.valoresWhereEsp;
    res.camposWhere = paramsEdit.camposWhereEsp;
    res.identificador = paramsEdit.identificador;

    var dataToPost = JSON.stringify(res);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        //res = Mensaje.resultado;
        showObjectEdit(JSON.parse(Mensaje.resultado), nameCmp);
        //console.log(JSON.parse(Mensaje.resultado));
    }

}

function removeListenersEdit() {
    $('[kind="filterKey"]').each(function () {
        $($(this)).off();
    });
}

function addListenersEdit() {
    $('[kind="filterKey"]').each(function () {
        $(this).on('keyup', function () {
            var key = event.keyCode || event.charCode;
            if (key === 8 || key === 46) {
                if ($(this).val() === "") {
                    var editKey = $(this).closest(".edit");
                    var nameEdit = $(editKey).attr("id");
                    clearEdit(nameEdit);
                    var nameFuncEdit = $(this).parent().attr("functEdit");
                    var getEdit = nameFuncEdit + "Clear";
                    var par = customSearchObject['customFunction'](getEdit);
                }
            }
            //if (key == 8 || key == 46)
            //    return false;
        });
    });

    $('[kind="filterKey"]').each(function () {
        $(this).keypress(function (event) {
            if (event.which === 13) {
                var keyEdit = $(this).val();
                var nameFuncEdit = $(this).parent().attr("functEdit");
                var params = [keyEdit, nameFuncEdit];
                searchEditKey(params);
                event.preventDefault();
            }
        });
    });

    $(".editButton").on("keyup", function (e) {
        // $('[id="txtEditKeyPosOrganigrama"]').focus();
        //$(this).nextAll('input').first().focus();
        $(this).next().focus();
    });
}

function clearEdit(nameEdit) {
    var keyEdit = document.getElementById(nameEdit);
    var keyFuncEdit = document.getElementById(nameEdit).getAttribute("dataedit");
    var keyEdit = $("[dataEdit=" + keyFuncEdit.toString() + "]").children(".editKey");
    var briefEdit = $("[dataEdit=" + keyFuncEdit.toString() + "]").children(".editBrief");
    document.getElementById(nameEdit).setAttribute("value", "");
    if (document.getElementById(nameEdit).getAttribute("extravalues")) {
        document.getElementById(nameEdit).setAttribute("extravalues", "");
    }

    $("#" + nameEdit).removeData();
    // jQuery.removeData(keyEdit);
    keyEdit.val("");
    briefEdit.val("");
}

/*********** Most Used Functions on Edit's ************/
function setEditObject(keyEdit, valOnEdit) {
    var getEdit = $("[id=" + keyEdit.toString() + "]");
    var nameFuncEdit = getEdit.attr("functEdit");

    var params = [valOnEdit, nameFuncEdit];
    searchEditKey(params);
}

function setEditObjectByID(keyEdit, valOnEdit) {
    var getEdit = $("[id=" + keyEdit.toString() + "]");
    // var nameFuncEdit = getEdit.attr("functEdit");

    var params = [valOnEdit, getEdit[0]];
    searchEditKeyID(params);
}

function getTextEdit(nameEdit) {
    var keyEdit = document.getElementById(nameEdit);
    var keyFuncEdit = document.getElementById(nameEdit).getAttribute("dataedit");
    var keyText = $("[dataEdit=" + keyFuncEdit.toString() + "]").children(".editKey");
    return keyText.val();
}

function getBriefEdit(nameEdit) {
    var keyEdit = document.getElementById(nameEdit);
    var keyFuncEdit = document.getElementById(nameEdit).getAttribute("dataedit");
    var keyBrief = $("[dataEdit=" + keyFuncEdit.toString() + "]").children(".editBrief");
    return keyBrief.val();
}

function getExtraValues(nameEdit) {
    try {
        var keyEdit = document.getElementById(nameEdit);
        var keyExtraValues = document.getElementById(nameEdit).getAttribute("extravalues");
        if (keyExtraValues !== null && keyExtraValues !== "") {
            keyExtraValues = keyExtraValues.split(",");
        }
    }
    catch (error) {
        console.error("Error: " + " " + nameEdit + " " + error);

    }
    return keyExtraValues;
}

function enabledEdit(nameEdit, isActiva) {
    if (isActiva) {
        var keyEdit = document.getElementById(nameEdit);
        var keyFuncEdit = document.getElementById(nameEdit).getAttribute("dataedit");
        var keyEdit = $("[dataEdit=" + keyFuncEdit.toString() + "]").children(".editKey");
        var briefEdit = $("[dataEdit=" + keyFuncEdit.toString() + "]").children(".editBrief");
        var button = $("[dataEdit=" + keyFuncEdit.toString() + "]").children(".editButton");
        keyEdit[0].disabled = false;
        if (briefEdit[0] !== undefined) {
            briefEdit[0].disabled = false;
        }
        button[0].disabled = false;
    } else {
        var keyEdit = document.getElementById(nameEdit);
        var keyFuncEdit = document.getElementById(nameEdit).getAttribute("dataedit");
        var keyEdit = $("[dataEdit=" + keyFuncEdit.toString() + "]").children(".editKey");
        var briefEdit = $("[dataEdit=" + keyFuncEdit.toString() + "]").children(".editBrief");
        var button = $("[dataEdit=" + keyFuncEdit.toString() + "]").children(".editButton");
        keyEdit[0].disabled = true;
        briefEdit[0].disabled = true;
        button[0].disabled = true;
    }
}

/*********** End of Most Used Functions on Edit's ***********/

/********************** End of Edit's functions **********************/

/********************** Star of Table display for Search data **********************/
function OpenSelector(cmp) {
    var getBtnSelect = $(cmp).attr("functEdit");
    var parSel = customSearchObject['customFunction'](getBtnSelect);
    createTableSelector(parSel);
    var exito = searchRanges(0, parSel);
    if (exito) {
        openSelectorTable(parSel);
    }
}

function closeSelector() {
    $("#selectorSearchTool").remove();
    document.getElementById("mainContent").style.display = "block";

}

function buildTableSearch(nameCmp, title, table, nameCols, campostbl, subEntities,
    preFilters, filtersSearch, camposObtener, desactivarSel, /* Parameters poco comunes:-----> */ optionals) {

    //camposObtener: ¿Por que se quito campos a obtener?
    var camposGroup;
    var camposOrden;
    camposObtener = typeof camposObtener === 'undefined' ? null : camposObtener;

    var tipoOrden;
    if (optionals !== undefined && optionals !== null) {
        camposGroup = optionals["camposGroup"] === null ? null : optionals["camposGroup"];
        camposOrden = optionals["camposOrden"] === null ? null : optionals["camposOrden"];
        tipoOrden = optionals["tipoOrden"] === null ? null : optionals["tipoOrden"];
    }

    var parameters = new Object();
    parameters.title = title;
    nameCols = nameCols.split(',');
    if (!desactivarSel) {
        nameCols.push("Seleccionar");
    }
    var modelEdit = new Object();
    //Fuente
    modelEdit.fuentePrincipal = table;

    var dataFields = null;
    //Campos a mostrar
    if (Array.isArray(campostbl)) {
        dataFields = campostbl;
    } else {
        dataFields = campostbl.split(',');
    }

    if (camposGroup === null || camposGroup === undefined) {
        //Este id no se debe de quitar si no se requiere parametrizar
        dataFields.unshift("id");
    } else {
        /*Reserved word for query, Not neccesary use a main ID on aggruppations */
        dataFields.unshift("NOTID");
        //Campos group
        if (Array.isArray(camposGroup)) {
            camposGroup = camposGroup;
        } else {
            camposGroup = camposGroup.split(',');
        }
    }

    modelEdit.camposMostrar = dataFields;
    //Tablas relacionadas
    if (subEntities !== null) {
        var dataSub = new Array();
        dataSub = subEntities.split(",");
        modelEdit.tablasRelacionadas = dataSub;
    }

    //Rangos
    modelEdit.startPaged = 0;
    modelEdit.endPaged = rowsByPage;//No problem is general
    //Campos where
    var cmpWhere = new Array();
    modelEdit.camposWhere = cmpWhere;
    //Valores where
    var valWhere = new Array();
    modelEdit.valoresWhere = valWhere;
    //Get total elements
    modelEdit.withCount = true;
    //Activación de alias
    modelEdit.activarAlias = false;

    //Tipo de despliegue (Para comportamientos)
    var typeDeploy = "selector";

    /**********Filter by only one Key**********/
    var mainFilters = new Object();
    mainFilters.dataEdit = nameCmp;//Like UniqueIdentifier
    // mainFilters.showKey = camposMostrar[0];
    //mainFilters.showBrief = camposMostrar[1];
    /**********End Filter**********/

    //Filters
    //var filters = getFiltersEdit();
    var cmpWhereArr = [];
    var cmpvalWhere = [];

    if (preFilters !== null) {
        for (var key in preFilters) {
            cmpWhereArr.push(key);
            cmpvalWhere.push(preFilters[key]);
        }
    }

    modelEdit.camposWhere = cmpWhereArr;
    modelEdit.valoresWhere = cmpvalWhere;
    modelEdit.camposGroup = typeof camposGroup === 'undefined' ? null : camposGroup;
    modelEdit.camposOrden = typeof camposOrden === 'undefined' ? null : camposOrden;
    modelEdit.tipoOrden = typeof tipoOrden === 'undefined' ? null : tipoOrden;

    var dataFieldsShow = null;
    if (camposObtener !== null) {
        if (Array.isArray(camposObtener)) {
            dataFieldsShow = camposObtener;
        } else {
            dataFieldsShow = camposObtener.split(',');
        }
        if (camposGroup === null || camposGroup === undefined) {
            //Este id no se debe de quitar si no se requiere parametrizar
            dataFieldsShow.unshift("id");
        } else {
            /*Reserved word for query, Not neccesary use a main ID on aggruppations */
            dataFieldsShow.unshift("NOTID");
        }
    }

    parameters.query = modelEdit;
    parameters.nameColumns = nameCols;
    parameters.type = typeDeploy;
    parameters.mainFiltersEdit = mainFilters;
    parameters.buildFilters = filtersSearch;
    //parameters.filters = filters;
    parameters.showColumns = dataFieldsShow;
    parameters.desactivarSel = desactivarSel;

    return parameters;
}

function createTableSelector(parSel) {

    var nameView = parSel.mainFiltersEdit.dataEdit;
    var content = document.getElementById("container");
    var containerTable = document.createElement("DIV");
    containerTable.id = "selectorSearchTool";
    containerTable.className = "contenedor";

    var contain = document.createElement("DIV");
    contain.id = "con1";
    contain.className = "contain";
    contain.style.with = "100%";

    var titleSelector = document.createElement("H1");
    var titleSelectorText = document.createTextNode(parSel.title);
    titleSelector.appendChild(titleSelectorText);

    var rowSelector = document.createElement("DIV");
    rowSelector.id = "rowSelector";
    rowSelector.className = "mainPanelRow";
    rowSelector.style.with = "100%";

    var colSelector = document.createElement("DIV");
    colSelector.id = "colSelector";
    colSelector.className = "mainPanelCol borderCol col-12";

    var containTable = document.createElement("DIV");
    containTable.id = "containerTable";
    containTable.className = "containerTable";

    var navSel = document.createElement("NAV");
    navSel.id = "containerPag";

    var ulSel = document.createElement("UL");
    ulSel.id = "listPag" + nameView;
    ulSel.className = "pagination";

    var scrollcontainTable = document.createElement("DIV");
    scrollcontainTable.id = "scrollSelect";
    scrollcontainTable.className = "mainPanelContentComponents scrollit";

    var tableSelect = document.createElement("TABLE");
    tableSelect.id = "tableEditSelector";

    var tableHeadSelect = document.createElement("THEAD");
    tableHeadSelect.id = "headerEdit";

    var tableBodySelect = document.createElement("TBODY");
    tableBodySelect.id = "bodyEdit";

    tableSelect.appendChild(tableHeadSelect);
    tableSelect.appendChild(tableBodySelect);
    scrollcontainTable.appendChild(tableSelect);
    var cancelButton = document.createElement("BUTTON");
    cancelButton.className = "mainPanelContentComponents defaultButton";
    //cancelButton.innerHTML = "Cancelar";
    cancelButton.setAttribute("idetiqueta", "btnCancelar");
    cancelButton.setAttribute("onclick", "closeSelector()");
    cancelButton.style.display = "inline";
    //cancelButton.style.cssFloat = "";
    var imgCan = document.createElement("img");
    imgCan.className = "imgBoton";
    imgCan.src = "img/Iconos/cancelar.png";
    imgCan.src = changeIconByCmp(imgCan.src);
    cancelButton.appendChild(imgCan);
    var spanCan = document.createElement("span");
    spanCan.innerHTML = "Cancelar";
    cancelButton.appendChild(spanCan);
    navSel.appendChild(ulSel);


    //Filters
    if (parSel.buildFilters !== undefined && parSel.buildFilters !== null) {
        if (parSel.buildFilters.length > 0) {
            var divEditSearch = document.createElement("DIV");
            divEditSearch.className = "modalEdit-search";
            divEditSearch.id = "modalEditsearchSel";
            var cmp = null;
            if (parSel.buildFilters !== null) {
                parSel.buildFilters.forEach(myFunction);
                function myFunction(item, index) {
                    if (item['tipo'] === "string") {
                        cmp = createFilterEditTexbox(item, index);
                    } else if (item['tipo'] === "date") {
                        cmp = createFilterDatePicker(item, index);
                    } else if (item['tipo'] === "editConsulta") {
                        cmp = createFilterEditConsulta(item, index);
                    } else if (item['tipo'] === "select") {
                        cmp = createFilterSelect(item, index);
                    }
                    divEditSearch.appendChild(cmp);
                }
            }
            //Selector
            var divEditButtonSearch = document.createElement("DIV");
            divEditButtonSearch.className = "modalEdit-filters";
            divEditButtonSearch.setAttribute("dataEditFilter", nameView);
            divEditButtonSearch.style.marginTop = "5px";
            divEditButtonSearch.style.marginBottom = "15px";

            var editBtnSearch = document.createElement("BUTTON");
            editBtnSearch.id = "btnEditBuscar";
            editBtnSearch.className = "mainPanelContentComponents defaultButton";
            editBtnSearch.setAttribute("onclick", "searchEditByFilters(this)");
            var editImg = document.createElement("IMG");
            editImg.className = "imgBoton";
            editImg.src = "img/Iconos/buscar.png";
            editImg.src = changeIconByCmp(editImg.src);
            var editSpan = document.createElement("SPAN");
            editSpan.innerHTML = "Buscar";
            editBtnSearch.appendChild(editImg);
            editBtnSearch.appendChild(editSpan);
            divEditButtonSearch.appendChild(editBtnSearch);
            containTable.appendChild(divEditSearch);
            containTable.appendChild(divEditButtonSearch);
        }
    }


    containTable.appendChild(scrollcontainTable);
    containTable.appendChild(navSel);
    colSelector.appendChild(containTable);
    rowSelector.appendChild(colSelector);
    contain.appendChild(titleSelector);
    contain.appendChild(rowSelector);
    containerTable.appendChild(contain);
    containerTable.appendChild(cancelButton);
    content.appendChild(containerTable);
}

function openSelectorTable(parSel) {
    document.getElementById("mainContent").style.display = "none";
}

function setObjectSelector(val) {
    var keysSelect = val.split(",");
    var editCmp = $("[dataEdit=" + keysSelect[0].toString() + "]");
    var nameSelecFunc = editCmp.attr("functEdit") + "Show";
    document.getElementById("mainContent").style.display = "block";
    document.getElementById("selectorSearchTool").remove();
    var varKeys = keysSelect.slice(1, keysSelect.lenght);
    var par = customSearchObject['customFunction'](nameSelecFunc, varKeys);

}

/********************** End of Edit's functions ********************/

/********************** Start Table Editable **********************/
var textaux;
var tamanotd;
var renglon;
var classNameBlur = false;
var teclasFlechas = false;

function InitEventsTable() {
    addEventos();
}

function OpenTable(cmp) {
    var getBtnSelect = $(cmp).attr("functEdit");
    var parSel = customSearchObject['customFunction'](getBtnSelect);
    createTable(parSel);

}

function addEventos() {


    $('.accionEliminar').click(function () {
        var answer = confirm("¿Quieres eliminar este registro?");
        if (answer) {
            var tr = $(this).parents('tr')[0];
            var tbdy = $(this).closest('tbody');
            var par = customSearchObject['customFunction'](tr.getAttribute("functRemoveRow"), tr);
            if (par || par === undefined) {
                $(this).parents('tr').detach();
                var getRowsCount = tbdy.find("td[tipocompon='rowCount']");
                if (getRowsCount.length > 0) {
                    for (var i = 1; i < getRowsCount.length; i++) {
                        getRowsCount[i].innerHTML = i.toString();
                    }
                }
            }
        }
    });

    $(".accionSelecionar").click(function () {
        var tr = $(this).parents('tr')[0];
        var tbdy = $(this).closest('tbody');
        var par = customSearchObject['customFunction'](tr.getAttribute("functSelect"), tr);
    });

    //$('#eliminarTbl').click(function () {
    //    var answer = confirm("¿Quieres eliminar este registro?");
    //    if (answer) {
    //        var tr = $(this).parents('tr')[0];
    //        var tbdy = $(this).closest('tbody');
    //        var par = customSearchObject['customFunction'](tr.getAttribute("functRemoveRow"), tr);
    //        $(this).parents('tr').detach();
    //        var getRowsCount = tbdy.find("td[tipocompon='rowCount']");
    //        if (getRowsCount.length > 0) {
    //            for (var i = 1; i < getRowsCount.length; i++) {
    //                getRowsCount[i].innerHTML = i.toString();
    //            }
    //        }
    //    }
    //});

    $('.accionEditar').click(function () {

        var tr = $(this).parents('tr')[0];
        var par = customSearchObject['customFunction']("editarTable", tr);

    });

    $('.tdTable').focus(function (e) {
        if ($(this)[0].firstElementChild) {

            $(this)[0].firstElementChild.style.display = "";
            if ($(this)[0].firstElementChild.getAttribute("tipo") === "importe") {
                textaux = quitarFormatImporte($(this)[0].innerText);
                 } else {
                textaux = $(this)[0].innerText;
            }
            

            $(this).contents().filter(function () {
                return this.nodeType == 3; //Node.TEXT_NODE
            }).remove();
            if ($(this)[0].firstElementChild.className.includes("edit")) {
                var parent = $(this)[0].firstElementChild;
                parent.firstElementChild.value = textaux;
                parent.firstElementChild.focus();
                var tr = parent.parentNode.parentNode;
                var obj = new Array();
                obj[0] = tr;
                obj[1] = parent.parentNode;
                var par = customSearchObject['customFunction'](tr.getAttribute("functColumna"), obj);
            } else if ($(this)[0].firstElementChild.className === "tdInputText") {
                //if ($(this)[0].firstElementChild.getAttribute('type') === "date") {
                //    var fecha = formatDate(new Date(textaux));
                //    $(this)[0].firstElementChild.value = fecha;
                //} else {
                $(this)[0].firstElementChild.focus();
                if (textaux !== "") {
                    $(this)[0].firstElementChild.value = textaux;
                    //console.log($(':focus'));

                    var tr = $(this)[0].parentNode;
                    var obj = new Array();
                    obj[0] = tr;
                    obj[1] = $(this)[0];
                    var par = customSearchObject['customFunction'](tr.getAttribute("functColumna"), obj);
                }
            } else if ($(this)[0].firstElementChild.className === "tdInputDate") {
                var fecha = formatDate(new Date(formantMmDDYyyy(textaux)));
                $(this)[0].firstElementChild.value = fecha;
                $(this)[0].firstElementChild.focus();
                var tr = $(this)[0].parentNode;
                var obj = new Array();
                obj[0] = tr;
                obj[1] = $(this)[0];
                var par = customSearchObject['customFunction'](tr.getAttribute("functColumna"), obj);
            } else if ($(this)[0].firstElementChild.className === "select-style") {

                var parent = $(this)[0].firstElementChild;
                //console.log(parent.firstElementChild.id);
                ////parent.firstElementChild.value = textaux;

                if (parent.parentNode.getAttribute("valor")) {
                    var valor = parent.parentNode.getAttribute("valor");
                    parent.firstElementChild.value = valor;
                }
                parent.parentNode.setAttribute("contenteditable", false);
                parent.firstElementChild.focus();
                var tr = parent.parentNode.parentNode;
                var obj = new Array();
                obj[0] = tr;
                obj[1] = parent.parentNode
                var par = customSearchObject['customFunction'](tr.getAttribute("functColumna"), obj);
                // console.log($(':focus'));
            } else if ($(this)[0].firstElementChild.className === "file") {
                var parent = $(this)[0].firstElementChild;
                $(this)[0].setAttribute("contenteditable", false);
                // parent.firstElementChild.value = textaux;
                $(this).children('.file-watch').remove();
                parent.firstElementChild.focus();
            }
            else {
                $(this)[0].firstElementChild.focus();
            }
            //console.log($(':focus'));
        }
    });
    $(".tdInputText").on('keydown', function (e) {

        if (e.keyCode === 9 || e.keyCode === 13) {
            e.preventDefault();
            var parent = $(this)[0].parentNode;
            //if ($(this)[0].getAttribute('type') === "date") {
            //    var fecha = formantDdMmYyyy($(this).val());
            //    parent.appendChild(document.createTextNode(fecha));

            //} else {
            if ($(this)[0].getAttribute("tipo") === "importe") {
                var valor = importe_format($(this)[0].value, 2, null);
                parent.appendChild(document.createTextNode(valor));
            } else {
                parent.appendChild(document.createTextNode($(this)[0].value));
            }
            //}
            $(this)[0].value = "";
            if (parent.innerText !== "") {
                var obj = Array();
                obj[0] = parent.innerText;
                obj[1] = parent.parentNode;
                var par = customSearchObject['customFunction']($(this)[0].getAttribute("funcion"), obj);
                $(this)[0].style.display = "none";

            } else {
                $(this)[0].value = textaux;
                $(this)[0].focus();

            }
            var tr = parent.parentNode;
            var par = customSearchObject['customFunction'](tr.getAttribute("functvalidate"), tr);
            if (par) {
                var nametable = parent.parentNode.parentNode.parentNode.id;
                var nameBody = parent.parentNode.parentNode.id;
                var rowTr = tr;
                var obj = [nametable, nameBody, rowTr];
                var par2 = customSearchObject['customFunction'](parent.parentNode.parentNode.parentNode.getAttribute("functAddRow"), obj);
            }
            $(parent).nextAll('td[contenteditable=true]:first').focus();
            $(this)[0].style.display = "none";
        }

    });
    ////seltd
    $(".seltd").on('keydown', function (e) {

        if (e.keyCode === 9 || e.keyCode === 13) {
            e.preventDefault();
            //e.stopImmediatePropagation();
            var parent = $(this)[0].parentNode;
            var parent2 = parent.parentNode;
            //if (typeof datoSecundario !== 'undefined' && typeof nombreDatoSecu !== 'undefined') {
            //    var next = $(parent2).nextAll('td[persist=' + nombreDatoSecu + ']:first');
            //    $(next).contents().filter(function () {
            //        return this.nodeType == 3; //Node.TEXT_NODE
            //    }).remove();
            //    next[0].appendChild(document.createTextNode(datoSecundario));
            //    datoSecundario = undefined;
            //    nombreDatoSecu = undefined;

            //}
            //console.log($(this)[0][0]);
            var par2;
            if ($(this)[0].getAttribute("funcion")) {
                var obj = Array();
                obj[0] = $(this)[0][$(this)[0].selectedIndex].text;
                obj[1] = $(this)[0].value;
                obj[2] = parent2.parentNode;
                // obj[2] = parent.parentNode;

                par2 = customSearchObject['customFunction']($(this)[0].getAttribute("funcion"), obj);
            }
            parent2.setAttribute("valor", $(this)[0].value);
            parent2.appendChild(document.createTextNode($(this)[0][$(this)[0].selectedIndex].text));

            $(this)[0].value = "";
            if (parent2.innerText !== "") {
                parent.parentNode.setAttribute("contenteditable", true);
                // parent.parentNode.setAttribute("value", $(this)[0].value);

                //parent.parentNode.id = $(this)[0].value
                parent.style.display = "none";
                //  $(parent2).nextAll('td[contenteditable=true]:first').focus();
            } else {
                parent.parentNode.setAttribute("contenteditable", true);
                $(this)[0].value = textaux;
                $(this)[0].focus();


            }
            var tr = parent2.parentNode;
            var par = customSearchObject['customFunction'](tr.getAttribute("functvalidate"), tr);
            if (par) {
                var nametable = parent2.parentNode.parentNode.parentNode.id;
                var nameBody = parent2.parentNode.parentNode.id;
                var rowTr = tr;
                var obj = [nametable, nameBody, rowTr];
                var par = customSearchObject['customFunction'](parent2.parentNode.parentNode.parentNode.getAttribute("functAddRow"), obj);
            }
            if (par2 || par2 === null || par2 === undefined) {
                $(parent2).nextAll('td[contenteditable=true]:first').focus();
            }
            //if (prevalidacionAddrow(parent2.parentNode)) {
            //    tableAdd(parent2.parentNode.parentNode.parentNode.id, parent2.parentNode.parentNode.id, parent2.parentNode);
            //}
        } else if (e.keyCode === 38 || e.keyCode === 40) {
            teclasFlechas = true;
        }

    });
    $(".seltd").on('change', function (e) {

        if (!teclasFlechas) {
            e.preventDefault();
            var parent = $(this)[0].parentNode;
            var parent2 = parent.parentNode;
            if (typeof datoSecundario !== 'undefined' && typeof nombreDatoSecu !== 'undefined') {
                var next = $(parent2).nextAll('td[persist=' + nombreDatoSecu + ']:first');
                $(next).contents().filter(function () {
                    return this.nodeType == 3; //Node.TEXT_NODE
                }).remove();
                next[0].appendChild(document.createTextNode(datoSecundario));
                datoSecundario = undefined;
                nombreDatoSecu = undefined;

            }
            //console.log($(this)[0][0]);
            var par2;
            if ($(this)[0].getAttribute("funcion")) {
                var obj = Array();
                obj[0] = $(this)[0][$(this)[0].selectedIndex].text;
                obj[1] = $(this)[0].value;
                obj[2] = parent2.parentNode;
                // obj[2] = parent.parentNode;

                par2 = customSearchObject['customFunction']($(this)[0].getAttribute("funcion"), obj);
            }
            parent.parentNode.setAttribute("valor", $(this)[0].value);
            parent2.appendChild(document.createTextNode($(this)[0][$(this)[0].selectedIndex].text));

            $(this)[0].value = "";
            if (parent2.innerText !== "") {
                parent.parentNode.setAttribute("contenteditable", true);


                //parent.parentNode.id = $(this)[0].value
                parent.style.display = "none";
                //$(parent2).nextAll('td[contenteditable=true]:first').focus();
            } else {
                parent.parentNode.setAttribute("contenteditable", true);
                $(this)[0].value = textaux;
                $(this)[0].focus();


            }

            var tr = parent2.parentNode
            var par = customSearchObject['customFunction'](tr.getAttribute("functvalidate"), tr);
            if (par) {

                var nametable = parent2.parentNode.parentNode.parentNode.id;
                var nameBody = parent2.parentNode.parentNode.id;
                var rowTr = tr;
                var obj = [nametable, nameBody, rowTr];
                var par = customSearchObject['customFunction'](parent2.parentNode.parentNode.parentNode.getAttribute("functAddRow"), obj);
            }
            if (par2 || par2 === null || par2 === undefined) {
                $(parent2).nextAll('td[contenteditable=true]:first').focus();
            }
            //if (prevalidacionAddrow(parent2.parentNode)) {
            //    tableAdd(parent2.parentNode.parentNode.parentNode.id, parent2.parentNode.parentNode.id, parent2.parentNode);
            //}
        } else {
            teclasFlechas = false;
        }

    });
    $(".tdedit").on('keydown', function (e) {
        if (e.keyCode === 9 || e.keyCode === 13) {
            e.preventDefault();
            var parent = $(this)[0].parentNode;
            var parent2 = parent.parentNode;
            renglon = parent2.parentNode;
            var keyEdit = $(this).val();
            var nameFuncEdit = $(this).parent().attr("functEdit");
            var params = [keyEdit, nameFuncEdit];
            searchEditKey(params);
            var obj = {};
            obj[0] = keyEdit;
            obj[1] = renglon;
            obj[2] = true;
            var par = customSearchObject['customFunction']($(this)[0].getAttribute("funcion"), obj);
            if (par || par === undefined || par === null) {
                if (typeof idResult !== 'undefined') {
                    parent.setAttribute("value", idResult);
                }

                if (typeof datoSecundario !== 'undefined' && typeof nombreDatoSecu !== 'undefined') {
                    var next = $(parent2).nextAll('td[persist=' + nombreDatoSecu + ']:first');
                    $(next).contents().filter(function () {
                        return this.nodeType == 3; //Node.TEXT_NODE
                    }).remove();
                    next[0].appendChild(document.createTextNode(datoSecundario));
                    datoSecundario = undefined;
                    nombreDatoSecu = undefined;
                }

                parent2.appendChild(document.createTextNode($(this)[0].value));
                $(this)[0].value = "";

                if (parent2.innerText !== "") {
                    parent.style.display = "none";

                } else {
                    $(this)[0].value = textaux;
                    $(this)[0].focus();


                }
                var tr = parent2.parentNode;
                var par = customSearchObject['customFunction'](tr.getAttribute("functvalidate"), tr);
                if (par) {
                    var nametable = parent2.parentNode.parentNode.parentNode.id;
                    var nameBody = parent2.parentNode.parentNode.id;
                    var rowTr = tr;
                    var obj = [nametable, nameBody, rowTr];
                    var par2 = customSearchObject['customFunction'](parent2.parentNode.parentNode.parentNode.getAttribute("functAddRow"), obj);
                }
                $(parent2).nextAll('td[contenteditable=true]:first').focus();
            }
        }

    });
    $(".tdInputDate").on('keydown', function (e) {
        if (e.keyCode === 9 || e.keyCode === 13) {
            e.preventDefault();
            var parent = $(this)[0].parentNode;
            var obj = Array();
            obj[0] = $(this)[0].value;
            obj[1] = parent.parentNode;
            obj[2] = true;
            var par = customSearchObject['customFunction']($(this)[0].getAttribute("funcion"), obj);
            if (par || par === undefined || par === null) {
                if ($(this)[0].value) {
                    var fecha = formantDdMmYyyy($(this)[0].value);
                    parent.appendChild(document.createTextNode(fecha));
                }
                $(this)[0].value = "";
                if (parent.innerText !== "") {

                    $(this)[0].style.display = "none";

                } else {
                    $(this)[0].value = textaux;
                    $(this)[0].focus();
                }
                var tr = parent.parentNode;
                var par = customSearchObject['customFunction'](tr.getAttribute("functvalidate"), tr);
                if (par) {
                    var nametable = parent.parentNode.parentNode.parentNode.id;
                    var nameBody = parent.parentNode.parentNode.id;
                    var rowTr = tr;
                    var obj = [nametable, nameBody, rowTr];
                    var par2 = customSearchObject['customFunction'](parent.parentNode.parentNode.parentNode.getAttribute("functAddRow"), obj);
                }
                $(parent).nextAll('td[contenteditable=true]:first').focus();
                $(this)[0].style.display = "none";
            }
            //$(parent).nextAll('td[contenteditable=true]:first').focus();
        }

    });
    //$(".tdInputDate").change(function () {


    //    var parent = $(this)[0].parentNode;
    //    var obj = Array();
    //    obj[0] = $(this)[0].value;
    //    obj[1] = parent.parentNode;
    //    obj[2] = true;
    //    var par = customSearchObject['customFunction']($(this)[0].getAttribute("funcion"), obj);
    //    if (par || par === undefined || par === null) {
    //        if ($(this)[0].value) {
    //            var fecha = formantDdMmYyyy($(this)[0].value);
    //            parent.appendChild(document.createTextNode(fecha));
    //        }
    //        $(this)[0].value = "";
    //        if (parent.innerText !== "") {

    //            $(this)[0].style.display = "none";

    //        } else {
    //            $(this)[0].value = textaux;
    //            $(this)[0].focus();
    //        }
    //        var tr = parent.parentNode;
    //        var par = customSearchObject['customFunction'](tr.getAttribute("functvalidate"), tr);
    //        if (par) {
    //            var nametable = parent.parentNode.parentNode.parentNode.id;
    //            var nameBody = parent.parentNode.parentNode.id;
    //            var rowTr = tr;
    //            var obj = [nametable, nameBody, rowTr];
    //            var par2 = customSearchObject['customFunction'](parent.parentNode.parentNode.parentNode.getAttribute("functAddRow"), obj);
    //        }

    //    }
    //    //  $(parent).nextAll('td[contenteditable=true]:first').focus();

    //});
    $(".tdInputText").blur(function (e) {
        var componClick = e.originalEvent.explicitOriginalTarget;
        if (typeof componClick.className !== 'undefined') {
            if (componClick.className === "tdTable" && componClick.getAttribute("contenteditable") == "true") {
                var parent = $(this)[0].parentNode;
                //if ($(this)[0].getAttribute('type') === "date") {
                //    var fecha = formantDdMmYyyy($(this).val());
                //    parent.appendChild(document.createTextNode(fecha));

                //} else {
                if ($(this)[0].getAttribute("tipo") === "importe") {
                    var valor = importe_format($(this)[0].value, 2, null);
                    parent.appendChild(document.createTextNode(valor));
                } else {
                    parent.appendChild(document.createTextNode($(this)[0].value));
                }
                // }
                $(this)[0].value = "";
                if (parent.innerText !== "") {

                    $(this)[0].style.display = "none";
                    //$(parent).nextAll('td[contenteditable=true]:first').focus();
                } else {
                    $(this)[0].style.display = "none";
                    $(this)[0].focus();

                }

            } else if (componClick.className === "editButton") {
                $(this)[0].focus();
            } else if (componClick.className.includes("editKey")) {
                $(componClick).focus();
            } else {
                var parent = $(this)[0].parentNode;

                //if ($(this)[0].getAttribute('type') === "date") {
                //    var fecha = formantDdMmYyyy($(this).val());
                //    parent.appendChild(document.createTextNode(fecha));
                //    if ($(this)[0].value !== "") {
                //        $(this)[0].value = "";
                //        $(this)[0].style.display = "none";
                //    }

                //} else {
                if ($(this)[0].value !== "") {
                    if ($(this)[0].getAttribute("tipo") === "importe") {
                        var valor = importe_format($(this)[0].value, 2, null);
                        parent.appendChild(document.createTextNode(valor));
                    } else {
                        parent.appendChild(document.createTextNode($(this)[0].value));
                    }

                    var obj = Array();
                    obj[0] = parent.innerText;
                    obj[1] = parent.parentNode;
                    var par = customSearchObject['customFunction']($(this)[0].getAttribute("funcion"), obj);
                }
                // parent.appendChild(document.createTextNode($(this)[0].value));
                $(this)[0].value = "";
                $(this)[0].style.display = "none";
                // }

            }
        } else {
            var parent = $(this)[0].parentNode;
            //if ($(this)[0].getAttribute('type') === "date") {
            //    var fecha = formantDdMmYyyy($(this).val());
            //    parent.appendChild(document.createTextNode(fecha));

            //} else {

            // }
            if ($(this)[0].value !== "") {
                if ($(this)[0].getAttribute("tipo") === "importe") {
                    var valor = importe_format($(this)[0].value, 2,null);
                    parent.appendChild(document.createTextNode(valor));
                } else {
                    parent.appendChild(document.createTextNode($(this)[0].value));
                }

                var obj = Array();
                obj[0] = parent.innerText;
                obj[1] = parent.parentNode;
                var par = customSearchObject['customFunction']($(this)[0].getAttribute("funcion"), obj);
            }
            $(this)[0].value = "";
            $(this)[0].style.display = "none";
            //$(this)[0].value = "";
            //if (parent.innerText !== "") {

            //    $(this)[0].style.display = "none";
            //    // $(parent).nextAll('td[contenteditable=true]:first').focus();
            //} else {
            //    $(this)[0].style.display = "none";
            //    $(this)[0].focus();

            //}
        }
    });
    $(".tdInputDate").blur(function (e) {
        var componClick = e.originalEvent.explicitOriginalTarget;
        if (componClick.className !== undefined) {
            if (componClick.className === "tdTable" && componClick.getAttribute("contenteditable") === "true") {
                var parent = $(this)[0].parentNode;
                //if ($(this)[0].getAttribute('type') === "date") {
                if ($(this)[0].value != "") {
                    var fecha = formantDdMmYyyy($(this)[0].value);
                    //    parent.appendChild(document.createTextNode(fecha));

                    //} else {

                    parent.appendChild(document.createTextNode(fecha));
                }
                // }
                $(this)[0].value = "";
                if (parent.innerText !== "") {
                    $(this)[0].style.display = "none";
                    // $(parent).nextAll('td[contenteditable=true]:first').focus();
                } else {
                    $(this)[0].style.display = "none";
                    $(this)[0].focus();

                }

            } else if (componClick.className === "editButton") {
                $(this)[0].focus();
            } else if (componClick.className.includes("editKey")) {
                $(componClick).focus();
            } else if (componClick.className.includes("tdInputDate")) {
                if (textaux === "") {
                    $(this)[0].value = "";
                    $(this)[0].style.display = "none";
                }

            } else {
                var parent = $(this)[0].parentNode;
                var obj = Array();
                obj[0] = $(this)[0].value;
                obj[1] = parent.parentNode;
                obj[2] = true;
                var par = customSearchObject['customFunction']($(this)[0].getAttribute("funcion"), obj);
                if (par || par === undefined || par === null) {
                    if ($(this)[0].value) {
                        var fecha = formantDdMmYyyy($(this)[0].value);
                        parent.appendChild(document.createTextNode(fecha));
                    }
                    $(this)[0].value = "";
                    if (parent.innerText !== "") {

                        $(this)[0].style.display = "none";

                    } else {
                        $(this)[0].value = textaux;
                       // $(this)[0].focus();
                        $(this)[0].style.display = "none";
                    }
                    var tr = parent.parentNode;
                    var par = customSearchObject['customFunction'](tr.getAttribute("functvalidate"), tr);
                    if (par) {
                        var nametable = parent.parentNode.parentNode.parentNode.id;
                        var nameBody = parent.parentNode.parentNode.id;
                        var rowTr = tr;
                        var obj = [nametable, nameBody, rowTr];
                        var par2 = customSearchObject['customFunction'](parent.parentNode.parentNode.parentNode.getAttribute("functAddRow"), obj);
                    }
                  //  $(parent).nextAll('td[contenteditable=true]:first').focus();
                }
                //var parent = $(this)[0].parentNode;

                ////if ($(this)[0].getAttribute('type') === "date") {
                //var fecha = formantDdMmYyyy($(this)[0].value);
                ////    parent.appendChild(document.createTextNode(fecha));
                //if ($(this)[0].value !== "") {
                //    //        $(this)[0].value = "";
                //    //        $(this)[0].style.display = "none";
                //    //    }

                //    //} else {
                //    parent.appendChild(document.createTextNode(fecha));
                //    var obj = Array();
                //    obj[0] = parent.innerText;
                //    obj[1] = parent.parentNode;
                //    var par = customSearchObject['customFunction']($(this)[0].getAttribute("funcion"), obj);

                //}
                //$(this)[0].value = "";
                //$(this)[0].style.display = "none";

                // }

            }
        }

    });
    $(".seltd").blur(function (e) {
        var componClick = e.originalEvent.explicitOriginalTarget;
        if (typeof componClick.className !== 'undefined') {
            if (componClick.className === "tdTable" && componClick.getAttribute("contenteditable") == "true") {
                var parent = $(this)[0].parentNode;
                var parent2 = parent.parentNode;
                //parent2.appendChild(document.createTextNode($(this)[0].value));
                if ($(this)[0].value !== "") {
                    parent2.setAttribute("valor", $(this)[0].value);
                    parent2.appendChild(document.createTextNode($(this)[0][$(this)[0].selectedIndex].text));
                }
                $(this)[0].value = "";
                parent.style.display = "none";
                parent.parentNode.setAttribute("contenteditable", true);
                //var parent = $(this)[0].parentNode;
                //var parent2 = parent.parentNode;

                //parent2.appendChild(document.createTextNode($(this)[0].value));
                //$(this)[0].value = "";
                //if (parent2.innerText !== "") {
                //    parent.style.display = "none";
                //    $(parent2).nextAll('td[contenteditable=true]:first').focus();
                //} else {
                //    parent.style.display = "none";
                //    $(this)[0].focus();

                //}

            } else if (componClick.className === "editButton") {
                $(this)[0].focus();
            } else if (componClick.className.includes("editKey")) {
                $(componClick).focus();
            } else {
                var parent = $(this)[0].parentNode;
                var parent2 = parent.parentNode;
                //parent2.appendChild(document.createTextNode($(this)[0].value));
                if ($(this)[0].value !== "") {
                    parent2.setAttribute("valor", $(this)[0].value);
                    parent2.appendChild(document.createTextNode($(this)[0][$(this)[0].selectedIndex].text));
                }
                $(this)[0].value = "";
                parent.style.display = "none";
                parent.parentNode.setAttribute("contenteditable", true);
            }
        } else {
            var parent = $(this)[0].parentNode;
            var parent2 = parent.parentNode;
            //parent2.appendChild(document.createTextNode($(this)[0].value));
            if ($(this)[0].value !== "") {
                parent2.setAttribute("valor", $(this)[0].value);
                parent2.appendChild(document.createTextNode($(this)[0][$(this)[0].selectedIndex].text));
            }
            $(this)[0].value = "";
            parent.style.display = "none";
            parent.parentNode.setAttribute("contenteditable", true);
        }
    });
    $(".tdedit").blur(function (e) {
        var componClick = e.originalEvent.explicitOriginalTarget;
        if (typeof componClick.className !== 'undefined') {
            if (componClick.className === "tdTable" && componClick.getAttribute("contenteditable") == "true") {
                var parent = $(this)[0].parentNode;
                var parent2 = parent.parentNode;

                parent2.appendChild(document.createTextNode($(this)[0].value));
                $(this)[0].value = "";
                if (parent2.innerText !== "") {
                    parent.style.display = "none";
                    $(parent2).nextAll('td[contenteditable=true]:first').focus();
                } else {
                    parent.style.display = "none";
                    $(this)[0].focus();

                }

            } else if (componClick.className === "editButton") {
                var parentDiv = $(this)[0].parentNode;
                renglon = parentDiv.parentNode.parentNode;
                classNameBlur = true;
                $(this).focus();
            } else if (componClick.className.includes("editKey")) {
                $(componClick).focus();
            } else if (componClick.className.includes("imgBoton")) {
                var parentDiv = $(this)[0].parentNode;
                $(componClick).focus();
                renglon = parentDiv.parentNode.parentNode;
                classNameBlur = true;
            } else {
                var parent = $(this)[0].parentNode;
                var parent2 = parent.parentNode;
                parent2.appendChild(document.createTextNode($(this)[0].value));
                $(this)[0].value = "";
                parent.style.display = "none";
            }
        }
    });
    $(".tdInputCheckbox").on('change', function (e) {
        var td = $(this)[0].parentNode.parentNode;
        var obj = Array();
        obj[0] = $(this)[0].checked;
        obj[1] = td.parentNode;
        var par3 = customSearchObject['customFunction']($(this)[0].getAttribute("funcion"), obj);
        if (td.getAttribute("contenteditable") === "true") {
            var tr = $(this)[0].parentNode.parentNode.parentNode;
            var par = customSearchObject['customFunction'](tr.getAttribute("functvalidate"), tr);

            if (par) {
                var nametable = $(this)[0].parentNode.parentNode.parentNode.parentNode.parentNode.id;
                var nameBody = $(this)[0].parentNode.parentNode.parentNode.parentNode.id;
                var rowTr = tr;
                var obj = [nametable, nameBody, rowTr];
                var par2 = customSearchObject['customFunction']($(this)[0].parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("functAddRow"), obj);
            }
        }
    });
    $(".tdInputFile").on('change', function (e) {
        var fileName = e.target.files[0].name.toString();
        var labelMainFile = e.target.parentNode;
        var td = labelMainFile.parentNode;
        //var myCol = $(this).index();
        var $tr = $(this).closest('tr');
        var myRow = $tr.index();
        $(td).remove("linkTextPreview" + myRow);
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
        td.setAttribute("contenteditable", true);
        $('.file').not(":eq(.file-watch)").hide();
        $(td).children('.file-watch').remove();
        var cln = textFileLink.cloneNode(true);
        cln.setAttribute("id", "linkTextPreview" + myRow);
        td.appendChild(cln);

        $("#linkTextPreview" + myRow)
            .mouseover(function () {
                var getHref = textFileLink.getAttribute("href");
                cln.setAttribute("href", getHref);
                td.setAttribute("contenteditable", false);
            })
            .mouseout(function () {
                td.setAttribute("contenteditable", true);
            });

        $(td).nextAll('td[contenteditable=true]:first').focus();

    });


    var tabPressed = false, enterPressed = false;
    $(".file input")
    .keydown(function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 13) {
            enterPressed = true;
            var td = $(this).closest(".tdTable");
            var file = td.children('.file');
            file.not(":eq(.file-watch)").hide();
            var $tr = td.closest('tr');
            var myRow = $tr.index();
            td.attr("contenteditable", true);
            $(td).children('.file-watch').remove();

            var previewLink = td.find(".file-watch").clone();
            previewLink.attr("id", "linkTextPreview" + myRow);
            previewLink.appendTo(td);
            $(previewLink).on('mouseover mouseout', function (event) {
                var parentD = $(this).parent();
                if (event.type == 'mouseover') {
                    parentD.attr("contenteditable", false);
                } else if (event.type == 'mouseout') {
                    parentD.attr("contenteditable", true);
                }
            });
            $(td).nextAll('td[contenteditable=true]:first').focus();

            event.preventDefault();
        }
        tabPressed = (keyCode == 9) ? true : false;


    }).focus(function () {

    })
        .focusout(function (e) {
            var componClick = e.originalEvent.explicitOriginalTarget;
            if (tabPressed) {
                var td = $(this).closest(".tdTable");
                var file = td.children('.file');
                file.not(":eq(.file-watch)").hide();
                var $tr = td.closest('tr');
                var myRow = $tr.index();
                td.attr("contenteditable", true);
                $(td).children('.file-watch').remove();
                var previewLink = td.find(".file-watch").clone();
                previewLink.attr("id", "linkTextPreview" + myRow);
                previewLink.appendTo(td);
                $(previewLink).on('mouseover mouseout', function (event) {
                    var parentD = $(this).parent();
                    if (event.type == 'mouseover') {
                        parentD.attr("contenteditable", false);
                    } else if (event.type == 'mouseout') {
                        parentD.attr("contenteditable", true);
                    }
                });
                $(td).nextAll('td[contenteditable=true]:first').focus();
            } else {
                if (componClick) {
                    if (componClick.className === "tdTable"
                        || componClick.className === "tdInputFile"
                        || componClick.className === "") {
                        var td = $(this).closest(".tdTable");
                        var file = td.children('.file');
                        file.not(":eq(.file-watch)").hide();
                        var $tr = td.closest('tr');
                        var myRow = $tr.index();
                        td.attr("contenteditable", true);
                        $(td).children('.file-watch').remove();
                        var previewLink = td.find(".file-watch").clone();
                        previewLink.attr("id", "linkTextPreview" + myRow);
                        previewLink.appendTo(td);
                        $(previewLink).on('mouseover mouseout', function (event) {
                            var parentD = $(this).parent();
                            if (event.type == 'mouseover') {
                                parentD.attr("contenteditable", false);
                            } else if (event.type == 'mouseout') {
                                parentD.attr("contenteditable", true);
                            }
                        });
                    }
                }
            }
            tabPressed = false;
            enterPressed = false;
        });
}

function buildTableTools(nameTable, nameCols, activaAdd, activaDelete, activarEditar, selecionar) {
    var parameters = new Object();
    valoresNuevos = new Array();
    valoresEliminar = new Array();
    valoresEditados = new Array();
    valoresfiltros = {};
    parameters.nameTable = nameTable;
    if (typeof activaAdd !== 'undefined') {
        parameters.Agregar = activaAdd;
    }

    if (typeof activarEditar !== 'undefined') {
        parameters.Editar = activarEditar;
    }
    if (typeof activaDelete !== 'undefined') {
        parameters.Eliminar = activaDelete;
    }
    if (typeof selecionar !== 'undefined') {
        parameters.selecionar = selecionar;
    }

    var obj = {};

    if ((typeof activaDelete !== 'undefined' && activaDelete) || (typeof activarEditar !== 'undefined' && activarEditar)) {


        obj.tituloColumna = "Acciones";
        obj.nombreCompo = "Acciones";
        obj.editable = false;
        obj.tipoCompon = "";
        obj.persist = "acciones";
        obj.ancho = "20px";


    } else if ((typeof selecionar !== 'undefined' && selecionar)) {
        obj.tituloColumna = "Selecionar";
        obj.nombreCompo = "Acciones";
        obj.editable = false;
        obj.tipoCompon = "";
        obj.persist = "acciones";
        obj.ancho = "20px";
    }



    if (typeof nameCols !== 'undefined') {
        if (Object.keys(obj).length > 0) {
            nameCols.push(obj);
        }
        parameters.nameColumns = nameCols;
    }

    return parameters;
}

function createTable(parSel) {
    var tblContent = document.getElementById("contTable");
    if (tblContent === undefined || tblContent === null) {
        tblContent = $("[dataTbl=" + parSel.nameTable + "]");
        tblContent = document.getElementById(tblContent.attr("id"));
    }
    var btnAgregar = document.createElement("button");
    btnAgregar.id = "btnAgregar" + parSel.nameTable;
    //btnAgregar.innerHTML = "Agregar";
    btnAgregar.className = "mainPanelContentComponents defaultButton";
    btnAgregar.setAttribute("onclick", "tableAdd()");
    // btnAgregar.setAttribute("style", "float: right;margin-top: 20px;");
    var imgagre = document.createElement("img");
    imgagre.className = "imgBoton";
    imgagre.src = "img/Iconos/nuevo.png";
    imgagre.src = changeIconByCmp(imgagre.src);
    btnAgregar.appendChild(imgagre);
    var spanAgregar = document.createElement("span");
    spanAgregar.innerHTML = "Agregar";
    btnAgregar.appendChild(spanAgregar);
    var navSel = document.createElement("NAV");
    navSel.id = "containerPag" + parSel.nameTable;

    var ulSel = document.createElement("UL");
    ulSel.id = "listPag" + parSel.nameTable;
    ulSel.className = "pagination";

    var scrollcontainTable = document.createElement("DIV");
    scrollcontainTable.id = "scrollSelect" + parSel.nameTable;
    scrollcontainTable.className = "mainPanelContentComponents scrollit";
    scrollcontainTable.style.overflowX = "auto";
    //scrollcontainTable.style.width = "100%";
    var tamanoTabla = 0;
    parSel.nameColumns.forEach(function (valor, indice) {
        tamanoTabla = tamanoTabla + parseInt(valor.ancho.substring(0, valor.ancho.indexOf("p")));
    });

    var tableSelect = document.createElement("TABLE");
    tableSelect.id = "tableEdit" + parSel.nameTable;
    //tableSelect.style.width = tamanoTabla + "px";
    //tableSelect.border = "1";
    tableSelect.className = "mainPanelContentComponents";
    tableSelect.setAttribute("functAddRow", "tableAdd");
    //tableSelect.setAttribute("functColumna", "setValueAt");

    var tableHeadSelect = document.createElement("THEAD");
    tableHeadSelect.id = "headerEdit" + parSel.nameTable;

    var tableBodySelect = document.createElement("TBODY");
    tableBodySelect.id = "bodyEdit" + parSel.nameTable;
    tableBodySelect.className = "bodytr";
    btnAgregar.setAttribute("onclick", 'tableAddRow("' + tableSelect.id + '","' + tableBodySelect.id + '")');
    btnAgregar.setAttribute("idTable", tableSelect.id);
    btnAgregar.setAttribute("nameBodyTable", tableBodySelect.id);

    tableSelect.appendChild(tableHeadSelect);
    tableSelect.appendChild(tableBodySelect);
    scrollcontainTable.appendChild(tableSelect);


    navSel.appendChild(ulSel);
    var divEditButtonSearch = document.createElement("DIV");
    divEditButtonSearch.className = "modalEdit-filters";

    if (parSel.Agregar) {
        divEditButtonSearch.appendChild(btnAgregar);
        tblContent.appendChild(divEditButtonSearch);
    }
    //tblContent.appendChild(navSel);
    tblContent.appendChild(scrollcontainTable);
    tblContent.appendChild(navSel);
    createColumnas(tableSelect.id, tableHeadSelect.id, tableBodySelect.id, parSel);
}

function prevalidateBeforeAddRow(nameTable) {
    var couldAdd = true;
    var isBeforeAddRow = customSearchObject['customFunction']("beforeAddRow" + nameTable);

    if (isBeforeAddRow == null) {
        couldAdd = true;
    } else {
        couldAdd = isBeforeAddRow;
    }
    return couldAdd;
}

function tableAddRow(nameTable, nameTbody) {
    if (prevalidateBeforeAddRow(nameTable)) {
        var obj = [nameTable, nameTbody];
        var par = customSearchObject['customFunction'](document.getElementById(nameTable).getAttribute("functAddRow"), obj);
    }
}

function createColumnas(nameTable, nameHead, nameBody, parsel) {
    var headerTbl = document.getElementById("headerEdit" + parsel.nameTable);
    var bodyTbl = document.getElementById("bodyEdit" + parsel.nameTable);
    var trFirst = document.createElement('tr');
    var th = null;
    parsel.nameColumns.forEach(function (valor, indice) {
        th = document.createElement('th');
        th.id = valor.persist;
        // th.style.width = valor.ancho;
        if (valor.selectable) {
            var chkColumn = document.createElement("INPUT");
            chkColumn.setAttribute("type", "checkbox");
            th.style.textAlign = "center";
            th.appendChild(chkColumn);
            $(chkColumn).click(function () {
                var tblChk = $(this).closest('table');
                var indexChk = indice + 1;
                $('#' + tblChk.attr("id") + " td:nth-child(" + indexChk + ")").each(function () {
                    var chkTd = $(this).find("input");
                    $(chkTd).prop('checked', chkColumn.checked);
                });
            });
        } else {
            th.appendChild(document.createTextNode(valor.tituloColumna));
        }
        if (valor.hide) {
            th.style.display = "none";
        }
        trFirst.appendChild(th);
    });

    headerTbl.appendChild(trFirst);

    var columnaslength = parsel.nameColumns.length;

    var tr = document.createElement('tr');
    tr.className = "hide";
    tr.setAttribute("functvalidate", "prevalidacionAddRow");
    tr.setAttribute("functRemoveRow", "tableRemove");
    tr.setAttribute("functColumna", "prevalidacionColumna");
    tr.setAttribute("functSelect", "selecionarRegistro");

    for (var i = 0; i < columnaslength; i++) {
        var td = document.createElement('td');
        td.className = "tdTable";
        td.appendChild(document.createTextNode(""));
        //td.style.width = parsel.nameColumns[i].ancho;
        td.setAttribute("contenteditable", parsel.nameColumns[i].editable);
        if (parsel.nameColumns[i].persist) {
            td.setAttribute("persist", parsel.nameColumns[i].persist);
        }
        if (parsel.nameColumns[i].persistEx) {
            td.setAttribute("persistEx", parsel.nameColumns[i].persistEx);
        }
        if (parsel.nameColumns[i].id) {
            td.id = parsel.nameColumns[i].id;
        }
        if (parsel.nameColumns[i].hide) {
            td.setAttribute("hide", parsel.nameColumns[i].hide);
            td.style.display = "none";
        }
        if (parsel.nameColumns[i].required) {
            td.setAttribute("required", parsel.nameColumns[i].required)
        }
        if (parsel.nameColumns[i].selectable) {
            td.setAttribute("selectable", parsel.nameColumns[i].selectable);
        }
        if (parsel.nameColumns[i].nombreCompo == "Acciones") {

            var div = document.createElement("div");
            div.className = "accionesTable";
            div.style.display = "contents";
            if (parsel.Editar) {
                var div2 = document.createElement("div");
                div2.className = "accionEditar";
                div2.style.display = "inline-block";
                div2.style.marginRight = "5px";
                //var img2 = document.createElement("img");
                //img2.id = "imgEliminar";
                //img2.className = "imgEditar";
                //img2.src = "img/Iconos/editar.png";
                //img2.src = changeIconByCmp(img2.src);
                //div2.appendChild(img2);
                var a2 = document.createElement("a");
                a2.id = "editarTbl";
                a2.innerHTML = "Editar";
                a2.href = "#";
                div2.appendChild(a2);
                div.appendChild(div2);
                td.appendChild(div);
            }
            if (parsel.Eliminar) {
                var divEli = document.createElement("div");
                divEli.className = "accionEliminar";
                divEli.style.display = "inline-block";
                //var img = document.createElement("img");
                //img.id = "imgEliminar";
                //img.className = "imgDelete";
                //img.src = "img/Iconos/eliminar.png";
                //img.src = changeIconByCmp(img.src);
                //divEli.appendChild(img);
                var a = document.createElement("a");
                a.id = "eliminarTbl";
                a.className = "imgEliminar";
                a.innerHTML = "Eliminar";
                a.href = "#";
                divEli.appendChild(a);
                div.appendChild(divEli);
                td.appendChild(div);
            }

            if (parsel.selecionar) {
                var divSel = document.createElement("div");
                divSel.className = "accionSelecionar";
                divSel.style.display = "inline-block";
                divSel.style.marginLeft = "5px";
                var imgSel = document.createElement("img");
                imgSel.id = "imgSelecionar";
                imgSel.className = "imgSelect";
                //imgSel.src = "img/Iconos/eliminar.png";
                //divSel.appendChild(img);
                var asel = document.createElement("a");
                asel.id = "selecionarTbl";
                asel.className = "imgSelecionar";
                asel.innerHTML = "Selecionar";
                asel.href = "#";
                divSel.appendChild(asel);
                div.appendChild(divSel);
                td.appendChild(div);
            }
            //img.setAttribute("onClick", 'tableRemove("'+span.id+'")');


        } else {
            if (parsel.nameColumns[i].tipoCompon === "rowCount") {
                td.append("1");
                td.setAttribute("tipoCompon", parsel.nameColumns[i].tipoCompon);
            }
            else if (parsel.nameColumns[i].tipoCompon === "text") {
                var input = document.createElement("input");
                input.className = "mainPanelContentComponents";
                input.id = "txt_" + parsel.nameColumns[i].nombreCompo;
                input.type = "text";
                input.className = "tdInputText";
                input.style.width = parsel.nameColumns[i].ancho;
                input.style.display = "none";
                if (parsel.nameColumns[i].isParam) {
                    td.setAttribute("isParam", parsel.nameColumns[i].isParam);
                }
                td.setAttribute("tipoCompon", parsel.nameColumns[i].tipoCompon);
                input.setAttribute("funcion", parsel.nameColumns[i].funcion);
                td.appendChild(input);
            } else if (parsel.nameColumns[i].tipoCompon === "importe") {
                var input = document.createElement("input");
                input.className = "mainPanelContentComponents";
                input.id = "txt_" + parsel.nameColumns[i].nombreCompo;
                input.type = "text";
                input.className = "tdInputText";
                input.style.width = parsel.nameColumns[i].ancho;
                input.style.display = "none";
                input.setAttribute("tipo","importe");
                if (parsel.nameColumns[i].isParam) {
                    td.setAttribute("isParam", parsel.nameColumns[i].isParam);
                }
                td.setAttribute("tipoCompon", parsel.nameColumns[i].tipoCompon);
                td.style.width = "70px";
                td.style.textAlign = "end";
                input.setAttribute("funcion", parsel.nameColumns[i].funcion);
                td.appendChild(input);
            } else if (parsel.nameColumns[i].tipoCompon === "select") {
                var div = document.createElement('div');
                div.className = "select-style";
                div.id = "div" + parsel.nameColumns[i].nombreCompo;
                div.style.width = parsel.nameColumns[i].ancho;;
                div.style.display = "none";
                var select = document.createElement('select');
                select.id = "ckb" + parsel.nameColumns[i].nombreCompo;
                select.className = "seltd";
                select.style.width = "100%";
                select.setAttribute("funcion", parsel.nameColumns[i].funcion);

                div.appendChild(select);
                if (parsel.nameColumns[i].data) {
                    for (var j = 0; j < parsel.nameColumns[i].data.length; j++) {
                        $(select).append('<option value=' + parsel.nameColumns[i].data[j].id + '>' + parsel.nameColumns[i].data[j].descripcion + '</option>');
                    }
                }
                td.setAttribute("tipoCompon", parsel.nameColumns[i].tipoCompon);

                td.appendChild(div);
            } else if (parsel.nameColumns[i].tipoCompon === "editConsulta") {
                var div = document.createElement('DIV');
                div.id = "edit" + parsel.nameColumns[i].nombreCompo + "Detalle";
                div.className = "edit " + parsel.nameColumns[i].ancho;
                div.setAttribute("dataedit", "Edit" + parsel.nameColumns[i].nombreCompo + "Detalle");
                div.setAttribute("functedit", "setEdit" + parsel.nameColumns[i].nombreCompo + "Detalle");
                div.style.display = "none";
                var inputclave = document.createElement('input');
                inputclave.id = "search-text-input";
                var ancho = tamanoEditConculTaTBL(parsel.nameColumns[i].ancho);
                inputclave.className = "editKey " + ancho + "  tdedit";
                inputclave.type = "text";
                inputclave.setAttribute("kind", "");
                inputclave.setAttribute("placeholder", "Buscar");
                // inputclave.style.width = "70%";
                div.appendChild(inputclave);
                var boton = document.createElement('button');
                boton.className = "editButton small";
                boton.setAttribute("onclick", "OpenEditModal(this)");
                //boton.style.width = "30%";
                var img3 = document.createElement("img");
                img3.className = "imgBoton";
                img3.src = "img/Iconos/puntos.png";
                img3.src = changeIconByCmp(img3.src);
                boton.appendChild(img3);
                div.appendChild(boton);
                td.setAttribute("tipoCompon", parsel.nameColumns[i].tipoCompon);
                td.appendChild(div);
            } else if (parsel.nameColumns[i].tipoCompon === "date") {
                var input = document.createElement("input");
                input.className = "mainPanelContentComponents";
                input.id = "txt_" + parsel.nameColumns[i].nombreCompo;
                input.type = "date";
                input.className = "tdInputDate";
                input.style.width = parsel.nameColumns[i].ancho;;
                input.style.display = "none";
                input.setAttribute("funcion", parsel.nameColumns[i].funcion);
                // input.setAttribute("data-date-format", "dd/mm/yyyy");
                td.setAttribute("tipoCompon", parsel.nameColumns[i].tipoCompon);
                td.appendChild(input);
            } else if (parsel.nameColumns[i].tipoCompon === "checkbox") {
                var labelChk = document.createElement("label");
                labelChk.className = "checkContainer";
                var input = document.createElement("input");
                if (parsel.nameColumns[i].editable === false) {
                    input.disabled = true;
                }
                input.className = "tdInputCheckbox";
                input.setAttribute("type", "checkbox");
                // input.setAttribute("checked", "checked");
                input.setAttribute("funcion", parsel.nameColumns[i].funcion);
                td.setAttribute("contenteditable", false);
                var spanChk = document.createElement("span");
                spanChk.className = "checkmark";
                labelChk.appendChild(input);
                labelChk.appendChild(spanChk);
                td.setAttribute("tipoCompon", parsel.nameColumns[i].tipoCompon);
                td.appendChild(labelChk);
            } else if (parsel.nameColumns[i].tipoCompon === "file") {
                var labelFile = document.createElement("label");
                labelFile.className = "file";
                var input = document.createElement("input");
                input.setAttribute("id", "fileTable");
                input.setAttribute("type", "file");
                input.className = "tdInputFile";
                td.setAttribute("contenteditable", true);
                var spanFile = document.createElement("span");
                spanFile.className = "file-custom";
                spanFile.setAttribute("fileTitle", "Buscar");
                var linkSpan = document.createElement("a");
                linkSpan.className = "file-watch";
                /*linkSpan.innerHTML = "Ver";*/
                //linkSpan.setAttribute("contenteditable", false);
                linkSpan.setAttribute("href", "");
                linkSpan.setAttribute("target", "_blank");
                spanFile.appendChild(linkSpan);
                labelFile.appendChild(input);
                labelFile.appendChild(spanFile);
                labelFile.style.display = "none";
                td.setAttribute("tipoCompon", parsel.nameColumns[i].tipoCompon);
                td.appendChild(labelFile);
            }
        }
        tr.appendChild(td);
    }
    bodyTbl.appendChild(tr);
    var $clone = $('#' + nameTable).find('tr.hide').clone(true).removeClass('hide table-line');
    $clone[0].setAttribute("class", "hidetd");
    // if (parsel.Agregar && parsel.Eliminar) {
    $('#bodyEdit' + parsel.nameTable).append($clone[0]);
    //}
}

function llenarTablaGen(nameTable, datos, start, end) {
    var tbl = document.getElementById("tableEdit" + nameTable);
    var tbody = tbl.querySelector("#bodyEdit" + nameTable);
    $("#" + tbody.id).find("tr:gt(0)").remove();
    for (var i = start; i < end; i++) {
        var $clone = $('#tableEdit' + nameTable).find('tr.hide').clone(true).removeClass('hide table-line');
        $clone[0].className = "hidetd";
        $clone[0].setAttribute('id', datos[i].id);
        for (var k = 0; k < $clone[0].cells.length ; k++) {
            if ($clone[0].cells[k].getAttribute('persist') != "acciones") {
                if ($clone[0].cells[k].getAttribute('isparam') === "true") {
                    for (var j = 0; j < datos[i].parametros.length; j++) {
                        if (datos[i].parametros[j][$clone[0].cells[k].getAttribute('persist')]) {
                            $clone[0].cells[k].appendChild(document.createTextNode(datos[i].parametros[j][$clone[0].cells[k].getAttribute('persist')]));
                            break;
                        }
                    }
                } else if ($clone[0].cells[k].id === "valor1") {
                    if (datos[i].parametros.length == 1) {
                        $clone[0].cells[k].appendChild(document.createTextNode(datos[i].parametros[0].valor));
                        $clone[0].cells[k].setAttribute("contenteditable", true);
                        $clone[0].cells[k].setAttribute("persist", datos[i].parametros[0].descripcion);
                        $clone[0].cells[k].setAttribute("isParam", true);
                    }
                } else if ($clone[0].cells[k].id === "valor2") {
                    if (datos[i].parametros.length > 1) {
                        $clone[0].cells[k].appendChild(document.createTextNode(datos[i].parametros[1].valor));
                        $clone[0].cells[k].setAttribute("contenteditable", true);
                        $clone[0].cells[k].setAttribute("persist", datos[i].parametros[1].descripcion);
                        $clone[0].cells[k].setAttribute("isParam", true);
                    }
                } else if ($clone[0].cells[k].id === "valor3") {
                    if (datos[i].parametros.length > 2) {
                        $clone[0].cells[k].appendChild(document.createTextNode(datos[i].parametros[2].valor));
                        $clone[0].cells[k].setAttribute("contenteditable", true);
                        $clone[0].cells[k].setAttribute("persist", datos[i].parametros[2].descripcion);
                        $clone[0].cells[k].setAttribute("isParam", true);
                    }
                }
                else if ($clone[0].cells[k].getAttribute("tipocompon") === "rowCount") {
                    $clone[0].cells[k].innerHTML = i + 1;
                }
                else if ($clone[0].cells[k].getAttribute("hide")) {
                    var getTd = $clone[0].cells[k];
                    getTd.style.display = "none";
                    getTd.appendChild(document.createTextNode(datos[i][getTd.getAttribute('persist')]));
                }
                else if ($clone[0].cells[k].getAttribute("tipocompon") === "date") {
                    var getTd = $clone[0].cells[k];
                    if (datos[i][getTd.getAttribute('persist')] !== null) {
                        var getvalueDate = new Date(datos[i][getTd.getAttribute('persist')]);
                        getTd.appendChild(document.createTextNode(formatDatemmddyyy(getvalueDate)));
                    } 
                }
                else if ($clone[0].cells[k].getAttribute("tipocompon") === "select") {
                    var exp = datos[i][$clone[0].cells[k].getAttribute('persist')];
                    if (exp.id === undefined && exp.descripcion === undefined) {
                        $clone[0].cells[k].setAttribute("valor", exp);
                        //$clone[0].cells[k].appendChild(document.createTextNode(exp.descripcion));
                    } else {
                        $clone[0].cells[k].setAttribute("valor", exp.id);
                        $clone[0].cells[k].appendChild(document.createTextNode(exp.descripcion));
                    }
                } else if ($clone[0].cells[k].getAttribute("tipocompon") === "checkbox") {
                    var getDatVal = $clone[0].cells[k].getAttribute('persist');
                    var exp = datos[i][getDatVal];
                    var inputChk = $clone[0].cells[k].firstElementChild.firstElementChild;
                    if (exp) {
                        inputChk.setAttribute("checked", "checked");
                    }
                } else if ($clone[0].cells[k].getAttribute("tipocompon") === "file") {
                    var getDatVal = $clone[0].cells[k].getAttribute('persist');
                    var fileBase64 = datos[i][getDatVal]; //This could change
                    var getTypeDataDoc = $clone[0].cells[k].getAttribute('persistEx');
                    var nameFile = null;
                    if (getTypeDataDoc === undefined || getTypeDataDoc === null) {
                        nameFile = datos[i]["documento"];//Default: Documento if not: persistEx
                    } else {
                        nameFile = datos[i][getTypeDataDoc];
                    }

                    var getTd = $clone[0].cells[k];
                    var $tr = $(getTd).closest('tr');
                    var assigTr = $tr.attr("id");
                    var inputFile = getTd.firstElementChild;
                    var textLinkCmp = $(inputFile).find(".file-watch");
                    var previewLink = document.createElement("a");
                    previewLink.setAttribute("id", "linkTextPreview" + assigTr);
                    previewLink.setAttribute("target", "_blank");
                    previewLink.className = "file-watch";
                    var getTypeFile = nameFile.split('.').pop();
                    var extension = null;
                    var buildFile = null;

                    //List of type MIME that will be accepted
                    if (getTypeFile === "txt") {
                        extension = "text/plain";
                        buildFile = "data:" + extension + ";base64," + fileBase64;
                    } else if (getTypeFile === "doc") {
                        extension = "application/msword";
                        buildFile = "data:" + extension + ";base64," + fileBase64;
                    } else if (getTypeFile === "pdf") {
                        extension = "application/pdf";
                        buildFile = "data:" + extension + ";base64," + fileBase64;
                    } else if (getTypeFile === "xls") {
                        extension = "application/vnd.ms-excel";
                        buildFile = "data:" + extension + ";base64," + fileBase64;
                    } else if (getTypeFile === "xlsx") {
                        extension = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        buildFile = "data:" + extension + ";base64," + fileBase64;
                    } else if (getTypeFile === "jpeg") {
                        extension = "image/jpeg";
                        buildFile = "data:" + extension + ";base64," + fileBase64;
                    } else if (getTypeFile === "jpg") {
                        extension = "image/jpeg";
                        buildFile = "data:" + extension + ";base64," + fileBase64;
                    } else if (getTypeFile === " gif") {
                        extension = "image/gif";
                        buildFile = "data:" + extension + ";base64," + fileBase64;
                    } else if (getTypeFile === "png") {
                        extension = "image/png";
                        buildFile = "data:" + extension + ";base64," + fileBase64;
                    } else if (getTypeFile === "rar") {
                        extension = "application/vnd.rar";
                        buildFile = "data:" + extension + ";base64," + fileBase64;
                    } else if (getTypeFile === "xml") {
                        extension = "text/plain";
                        buildFile = "data:" + extension + ";base64," + fileBase64;
                    }

                    if (buildFile !== null) {
                        textLinkCmp.attr("href", buildFile);
                        if (nameFile.length > 15) {
                            var subCutNameFile = nameFile.substring(0, 15);
                            subCutNameFile = subCutNameFile.concat("...");
                            textLinkCmp.text(subCutNameFile);
                            previewLink.innerHTML = subCutNameFile;
                        } else {
                            textLinkCmp.text(nameFile);
                            previewLink.innerHTML = nameFile;
                        }
                        getTd.setAttribute("contenteditable", true);
                        previewLink.setAttribute("href", buildFile);
                        previewLink.setAttribute("title", nameFile);

                        $(previewLink).on('mouseover mouseout', function (event) {
                            var parentD = $(this).parent();
                            if (event.type == 'mouseover') {
                                parentD.attr("contenteditable", false);
                            } else if (event.type == 'mouseout') {
                                parentD.attr("contenteditable", true);
                            }
                        });
                        getTd.appendChild(previewLink);
                    }
                }
                else {
                    var d0 = $clone[0].cells[k];
                    var d1 = datos[i][$clone[0].cells[k]];
                    $clone[0].cells[k].appendChild(document.createTextNode(datos[i][$clone[0].cells[k].getAttribute('persist')]));
                }
            }
        }
        $("#" + tbody.id).append($clone[0]);
    }
}

function tamanoEditConculTaTBL(valor) {
    var tamano;
    if (valor === "mini-0") {
        tamano = "mini";
    } else if (valor === "small-0") {
        tamano = "small";
    } else if (valor === "medium-0") {
        tamano = "medium";
    } else if (valor === "large-0") {
        tamano = "large";
    } else if (valor === "extralarge-0") {
        tamano = "extralarge";
    }


    return tamano;
}

/****** Most Used Functions on Table Edit ******/
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function clearTable(nameTable) {
    var element = document.getElementById(nameTable);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    OpenTable(document.getElementById(nameTable));
}

function setTdKeyForEdit(namePersist) {
    var tdClave = renglon.querySelector("td[persist=" + namePersist + "]");
    var txtclave = tdClave.firstElementChild.firstElementChild;
    tdClave.appendChild(document.createTextNode(txtclave.value));
    txtclave.value = "";
    tdClave.firstElementChild.style.display = "none";
    return tdClave;
}

function setTdExtraForEdit(namePersist, dataToView) {
    var tddescripcion = renglon.querySelector("td[persist=" + namePersist + "]");
    $(tddescripcion).contents().filter(function () {
        return this.nodeType === 3; //Node.TEXT_NODE
    }).remove();
    tddescripcion.appendChild(document.createTextNode(dataToView));
    return tddescripcion;
}

function nextFocus(nextCmp) {
    $(nextCmp).nextAll('td[contenteditable=true]:first').focus();
}

/****** End of Most Used Functions on Table Edit  ******/

/********************** End Tabla Editable **********************/

/**********************Start validators Input's data **********************/

function validateComponents(listComponentsName, clear) {
    var listCmp = listComponentsName;
    for (var i = 0; i < listCmp.length; i++) {
        var idCmp = listCmp[i].toString();
        var element = $("#" + idCmp);
        var tagName = element.prop('tagName');
        var isOk = true;
        var defaultOptions = new Object();
        defaultOptions["elementPaint"] = element;
        defaultOptions["focus"] = element;
        if (tagName === "INPUT") {
            var type = element.prop('type');
            var notification = false;
            if (type === "text") {
                if (element.val() === '') {
                    notification = true;
                }
            } else if (type === "date") {
                var valueDate = $(element).val();
                if (!Date.parse(valueDate)) {
                    notification = true;
                }
            }
        } else if (tagName === "SELECT") {
            defaultOptions["elementPaint"] = element.parent();
            defaultOptions["focus"] = element;
            var valueSelect = $(element).val();
            if (!valueSelect) {
                notification = true;
            }
        } else if (tagName === "DIV") {
            if ($(element).hasClass("edit")) {
                var getTextKey = $(element).children(".editKey");
                defaultOptions["elementPaint"] = element;
                defaultOptions["focus"] = getTextKey;
                if (element.attr("value") === undefined || element.attr("value") === "") {
                    notification = true;
                }
            }
        }
        if (clear === undefined) {
            if (notification) {
                $(defaultOptions["elementPaint"]).css('box-shadow', '0 0 0 .075rem #fff, 0 0 0 .2rem #0074d9');
                defaultOptions["focus"].focus();
                isOk = false;
                alert("Este componente esta vacio");
                break;
            } else {
                $(defaultOptions["elementPaint"]).css("box-shadow", "none");
            }
        }
        else {
            $(defaultOptions["elementPaint"]).css("box-shadow", "none");
        }
    }
    //Start validation
    return isOk;
}


/**********************End validators Input's data **********************/

/**********************Others most used funtctions **********************/

function changeDefaultModeButtons(type) {
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

/**********************End Others most used funtctions **********************/
