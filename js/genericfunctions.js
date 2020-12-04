var nametable = "";
var nametableDetalle = "";
var id = 0;
var idDetalle = 0;
var campos;
var CamposSelector;
var camposDetalles;
var route = "";
var inMode = "";
var inModeDetalle = "";
var activarSelect = false;
var totalDetalles = 0;
var totalByPage = 10;
var totalPaginasse = 0;
var start = 0, end = totalByPage;
var startDetalles = 0, endDetalles = totalByPage;
var totalPagDetalles = 0;
/*Start pagination*/ //Here
var items = 0, rowsByPage = 10, numbersByPage = 15,
    fromPage = 0, pagina = 0, totalPages;
var filterValues = null;
/*End pagination*/
var listaDetallesNuevos = {};
var listaDetallesEliminar = {};
//var listaDetalles = {};
var listaDetalles = new Object();
var listaDatosSelector = {};
//variables para la capturas masivas 
var listaDetalleMasiva = new Array();
var listaGlobalMasiva = new Array();
var listasNuevosXMasivas = new Array();
var listasEliminadosXMasivas = new Array();
var listasModificXMasivas = new Array();
var listaMovPartidos = new Array();
var camposglobales;
var camposcapturaDetalles;
var camposcaptDetParam = new Array();
var actActualizar = false;
var actEliminar = false;
//variables globales para los movimientos de nomina
var razonSocial = 1;
var numParticion = 1;
var uso = 1;
var maxNumero = [0];
var ordenid = 0;
var tipoPantalla = 100;
var movnomConcepAux = {};
var movNomConcepParamAux = new Array();
var conceptoAbajo = true;
var camposparamIsAbajo;
var idiomaSelecionadoCol;
var tabla;
var parametrosGlobales = { "ejercicioActual": 2020 };
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
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



    startCustomTools();
});
var parameter = parameter || (function () {
    var paramarray = {}; // private
    return {
        init: function (Args) {
            paramarray = Args;
            //console.log(paramarray);
            // some other initialising
        },
        /* helloWorld : function() {
         alert('Hello World! -' + paramarray[0]);
         }*/
        get: function () {
            nametable = paramarray[0];
        }
    };
}());

function activarMode() {
    inMode = "a";

}

function llenarColumnas(col) {
    columnasTabla = col;

}

function limpiar() {
    startDetalles = 0;
    endDetalles = totalByPage;
    listaDetalles = {};
    listaDetallesEliminar = {};
    listaDetallesNuevos = {};
    var conte = document.getElementById('capture');
    var element = conte.querySelectorAll("Input,select,table");
    for (var i = 0; i < element.length; i++) {
        if (element[i].getAttribute('persist') === campos[i]) {
            if (element[i].getAttribute("type") === "checkbox") {
                if (element[i].getAttribute('valordefault')) {
                    if (element[i].getAttribute('valordefault') === "on") {
                        element[i].checked = true;
                    } else {
                        element[i].checked = false;
                    }
                } else {
                    element[i].checked = false;
                }
            } else if (element[i].getAttribute('type') === "hidden") {
                var padre = element[i].parentNode;
                if (padre.getAttribute('role') !== 'checkbox') {
                    var abuelo = padre.parentNode;
                    if (abuelo.getAttribute('persist') === campos[i]) {
                        // console.log($('#' + abuelo.id).dxSelectBox("instance"));
                        $('#' + abuelo.id).dxSelectBox("instance").option("value", 0);
                    }
                } else {

                    $('#' + padre.id).dxCheckBox("instance").option("value", false);
                }
            } else if (element[i].tagName === "TABLE") {

                $('#' + element[i].id).find("tr:gt(0)").remove();
                createPagination(0, element[i].getAttribute('persist'), true);
            } else {
                element[i].value = "";
                element[i].disabled = false;
            }
            if (element[i].getAttribute('valordefault')) {
                element[i].value = element[i].getAttribute('valordefault');
            }
        }
    }
}

function activarModeDetalle() {
    inModeDetalle = "a";
    activarSelect = activarSelect;
}

function contardetalles(total) {
    totalDetalles = total;
}

function selecionarTabla(tabla) {
    nametable = tabla;
    asignartabla(nametable);
}

function tablaDetalle(tabla) {
    nametableDetalle = tabla;
}

function search(clave, detalle) {

    var nameelem;
    var i;
    if (detalle) {
        nameelem = getnamesDetalles(camposDetalles[0]);
    } else {
        nameelem = getnames();
        var obj = {};
        obj.Tabla = nameelem['Tabla'];
        obj.clave = clave;
        nameelem = obj;
    }
    var url = route + "/api/SearchGeneric";
    var dataToPost = JSON.stringify(nameelem);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado !== null) {
        var conte;
        if (detalle) {
            conte = document.getElementById('panelDetalle');
        } else {
            conte = document.getElementById('capture');
        }
        var element;
        if (tipoComponentes === 1) {
            element = conte.querySelectorAll("Input,select,table,div[functedit='setEditObjectGeneric']");
        } else if (tipoComponentes === 2) {

            element = conte.querySelectorAll("Input,select,div[persistSearch]");
        }

        if (detalle) {
            idDetalle = Mensaje.resultado['id'];
            for (i = 1; i < camposDetalles.length; i++) {
                if (element[i - 1].getAttribute('persist') === camposDetalles[i] && element[i - 1].tagName !== "TABLE") {

                    element[i - 1].value = Mensaje.resultado[camposDetalles[i]];
                } else if (element[i - 1].tagName === "TABLE" && camposDetalles[i] === element[i - 1].getAttribute('persist')) {

                    llenartablaDetalle(res, element[i - 1].id);
                }
            }
            if (inModeDetalle === "d") {
                var answer = confirm("¿Quieres eliminar esta configuración?");
                if (answer) {
                    deleteDetalles();
                    ocultarformacapture(false, true, false);
                    llenartablaDetalle(listaDetalles, nametableDetalle);
                }
                else {
                    console.log();
                }
            }
        } else {
            id = Mensaje.resultado['id'];
            var filters = new Array();
            var cmpWhere;
            var cmpVal;
            var typeDetail;
            for (i = 0; i < campos.length; i++) {
                var date;
                if ((element[i].className === "mainPanelContentComponents" && element[i].getAttribute('persist') === campos[i] && element[i].tagName !== "TABLE") || (element[i].getAttribute('type') === "hidden" || element[i].getAttribute('role') === "textbox") || (element[i].getAttribute("functedit") === "setEditObjectGeneric")) {
                    if (element[i].getAttribute("type") === "checkbox") {
                        if (Mensaje.resultado[campos[i]] === true) {
                            element[i].checked = true;
                        } else {
                            element[i].checked = false;
                        }
                    } else if (element[i].getAttribute('type') === "hidden") {
                        var padre = element[i].parentNode;
                        if (padre.getAttribute('role') !== 'checkbox') {
                            var abuelo = padre.parentNode;
                            if (abuelo.getAttribute('persist') === campos[i]) {
                                $('#' + abuelo.id).dxSelectBox("instance").option("value", Mensaje.resultado[campos[i]]);
                            }
                        } else {

                            $('#' + padre.id).dxCheckBox("instance").option("value", Mensaje.resultado[campos[i]]);
                        }
                    } else if (element[i].getAttribute('type') === "time") {
                        date = new Date(Mensaje.resultado[campos[i]]);
                        element[i].value = formatAMPM(date);
                    } else if (element[i].getAttribute('type') === "date") {
                        date = new Date(Mensaje.resultado[campos[i]]);

                        var fecha = formateDate(date);
                        element[i].value = fecha;
                    } else if (element[i].getAttribute("functedit") === "setEditObjectGeneric") {
                        if (Mensaje.resultado[campos[i]] !== null) {
                            element[i].setAttribute("value", Mensaje.resultado[campos[i]]);
                            setEditObjectByID(element[i].id, Mensaje.resultado[campos[i]]);
                        }
                    } else {
                        element[i].value = Mensaje.resultado[campos[i]];

                    }
                } else if (element[i].tagName === "TABLE" && campos[i] === element[i].getAttribute('persist')) {
                    //                            var aux = Mensaje.resultado[campos[i].charAt(0).toLowerCase() + campos[i].slice(1)];
                    //                            //var aux = listaDetalles[element[i].getAttribute('persist')];
                    //                            for (var k = 0; k < aux.length; k++) {
                    //                                aux[k]["Tabla"] = element[i].getAttribute('persist');
                    //
                    //                            }
                    //                            listaDetalles[element[i].getAttribute('persist')] = aux;
                    //                            totalPagDetalles = listaDetalles[element[i].getAttribute('persist')].length / totalByPage;
                    //                            if (totalPagDetalles - Math.floor(totalPagDetalles) == 0) {
                    //                                totalPagDetalles = totalPagDetalles;
                    //                            } else {
                    //                                //alert("Es un numero decimal");
                    //                                totalPagDetalles = Math.floor(totalPagDetalles) + 1;
                    //                                //     console.log(totalPaginas);
                    //                            }                     
                    //Get the main key of detail (Posible adaptaci�n para tabla detalles)
                    filters = new Array();
                    cmpWhere = nametable.toLowerCase() + ".id";
                    cmpVal = id;
                    filters.push(new Array(cmpWhere, cmpVal));
                    filterValues = filters;
                    // crearpaginasDetalles(element[i].getAttribute('persist'));
                    //busquedaFiltros(element[i].getAttribute('persist'), false, true);
                    typeDetail = element[i].getAttribute("id");
                    buquedaRangos(0, nametable, typeDetail);
                    filterValues = null;

                    // llenartablaDetalle(listaDetalles, element[i].getAttribute('persist'));
                } else if (element[i].tagName === "DIV" && campos[i] === element[i].getAttribute('persistSearch')) {
                    filters = new Array();
                    cmpWhere = nametable.toLowerCase() + ".id";
                    cmpVal = id;
                    filters.push(new Array(cmpWhere, cmpVal));
                    filterValues = filters;
                    typeDetail = element[i].getAttribute("id");
                    buquedaRangos(0, nametable, typeDetail);
                    filterValues = null;

                }

            }
        }
        if (inMode === "d") {
            var answer2 = confirm("¿Quieres eliminar esta configuración?");
            if (answer2) {
                for (var item in listaDetalles) {
                    var arreglo = [];
                    for (i = 0; i < listaDetalles[item].length; i++) {
                        var obj2 = {};
                        obj2["Tabla"] = item;
                        for (var subitem in listaDetalles[item][i]) {
                            if (!subitem.includes(nametable.toUpperCase()) && subitem !== "$id") {
                                obj2[subitem] = listaDetalles[item][i][subitem];
                            }
                        }

                        arreglo[i] = obj2;
                    }
                    if (arreglo.length > 0) {
                        listaDetallesEliminar[item] = arreglo;
                    }
                }
                deleteObject();
                clearObjetosgen();
            }
            else {
                clearObjetosgen();
            }
        }
    }
}

function editObjectgen(key, detalle, tabladetalle) {
    var conte;
    var i;
    var element;
    if (detalle) {
        var campo = "";
        getnamesDetalles(tabladetalle);
        if (tipoComponentes === 1) {
            var con = document.getElementById('capture');
            var boton = con.querySelectorAll('button');
            for (i = 0; i < boton.length; i++) {
                if (boton[i].id === "btnAgregar" + tabladetalle.toString()) {
                    boton[i].click();
                    break;
                }
            }
            conte = document.getElementById('panelDetalle');
            updateDetallesgen();
            element = conte.getElementsByTagName("Input");
            for (i = 0; i < element.length; i++) {
                if (element[i].getAttribute('persist') === camposDetalles[1]) {
                    element[i].value = key.toString();

                    break;
                }
            }
        } else if (tipoComponentes === 2) {
            //console.log(detallesDeLaForma[tabladetalle]);
            var datosDetalle = detallesDeLaForma[tabladetalle + 'Detail'];
            addValuetoDetail(datosDetalle['forma'], datosDetalle['origen']);
            // $('#buttonAgregarDetalleNorm').dxButton('instance');
            conte = document.getElementById('panelDetalle');
            updateDetallesgen();
            element = conte.getElementsByTagName("Input");
            for (i = 0; i < element.length; i++) {
                if (element[i].getAttribute('persist') === camposDetalles[1]) {
                    element[i].value = key.toString();

                    break;
                }
            }
        }
        // search(detalle);
        searchDeatalles(key, tabladetalle);
    } else {

        if (document.getElementById('Selector')) {
            ocultarformaSelect();
            if (document.getElementById('Buscar')) {
                ocultarformacapture(false, false, true);
                // selctSearch = true;
            }
        } else {
            ocultarformacapture(false, false, true);
        }

        conte = document.getElementById('capture');
        updategen();//Para deshabilitar primer caja de texto
        element = conte.getElementsByTagName("Input");
        for (i = 0; i < element.length; i++) {
            if (element[i].getAttribute('persist') === campos[0]) {
                element[i].value = key.toString();

                break;
            }
        }
        var btn;
        var btneli;
        var btngu;
        if (tipoComponentes === 1) {
            if (document.getElementById('btnActualizar')) {
                btn = document.getElementById('btnActualizar');
                btn.style.display = 'inline';
                btneli = document.getElementById('btnEliminar');
                btneli.style.display = 'inline';
                btngu = document.getElementById('btnGuardar');
                btngu.style.display = 'none';
            }
        } else if (tipoComponentes === 2) {
            if (document.getElementById('buttonActualizar')) {
                btn = document.getElementById('buttonActualizar');
                btn.style.display = '';
                btneli = document.getElementById('buttonEliminarNormal');
                btneli.style.display = '';
                btngu = document.getElementById('buttonGuardarSave');
                btngu.style.display = 'none';
            }
        }

        search(key);

    }
}

function saveOrUpdate() {
    if (inMode === "a") {
        save();
    } else if (inMode === "u") {
        update();
    }
}

function saveOrUpdateDetalles() {
    if (inModeDetalle === "a") {
        saveDetalles();
    } else if (inModeDetalle === "u") {
        updateDetalles();
    }
}

function updategen() {
    inMode = "u";
    var conte = document.getElementById('capture');
    var element = conte.getElementsByTagName("Input");
    for (var i = 0; i < element.length; i++) {
        if (element[i].getAttribute('persist') === campos[0]) {
            element[i].disabled = true;
            element[i].focus();
            break;
        }
    }
}

function deleteObjectInTablegen(key, detalle, tabladetalle) {
    var conte;
    var i;
    var element;
    if (detalle) {
        getnamesDetalles(tabladetalle);
        var con = document.getElementById('capture');
        var boton = con.querySelectorAll('button');
        for (i = 0; i < boton.length; i++) {
            if (boton[i].id === "btnAgregar" + tabladetalle.toString()) {
                boton[i].click();
                break;
            }
        }
        conte = document.getElementById('panelDetalle');
        toDeleteDetallegen();
        element = conte.getElementsByTagName("Input");
        for (i = 0; i < element.length; i++) {
            if (element[i].getAttribute('persist') === camposDetalles[1]) {
                element[i].value = key.toString();
                break;
            }
        }
        searchDeatalles(key, tabladetalle);
    } else {
        ocultarformaSelect();
        toDeletegen();
        conte = document.getElementById('capture');
        element = conte.getElementsByTagName("Input");
        for (i = 0; i < element.length; i++) {
            if (element[i].getAttribute('persist') === campos[0]) {
                element[i].value = key.toString();

                break;
            }
        }
        search(key);
    }
}

function toDeletegen() {
    inMode = "d";
    var conte = document.getElementById('capture');
    var element = conte.getElementsByTagName("Input");
    for (var i = 0; i < element.length; i++) {
        if (element[i].getAttribute('persist') === campos[0]) {
            element[i].disabled = true;
            element[i].focus();
            break;
        }
    }
}

function save() {
    var nameelem = getnames();
    if (validarRequeridos()) {
        var url = route + "/api/SaveGeneric";
        var dataToPost = JSON.stringify(nameelem);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
        if (Mensaje.resultado !== null) {
            alert("Datos guardados exitosamente");
            clearObjetosgen();
        } else {
            alert(Mensaje.error);
        }
    }
}

function clearObjetosgen() {
    var tabla;

    //  if (activarSelect) {
    tabla = nametable + 'Select';
    // } else {
    tabla = nametable + 'Search';
    // }


    $('#' + tabla).find("tr:gt(0)").remove();
    var conte = document.getElementById('capture');
    var element = conte.querySelectorAll("Input,select,div[functedit='setEditObjectGeneric']");
    for (var i = 0; i < element.length; i++) {
        if ((element[i].className === "mainPanelContentComponents" && element[i].getAttribute('persist') === campos[i] && element[i].tagName !== "TABLE") || (element[i].getAttribute('type') === "hidden" || element[i].getAttribute('role') === "textbox") || (element[i].getAttribute("functedit") === "setEditObjectGeneric")) {
            //if (element[i].getAttribute('persist') === campos[i]) {
            if (element[i].getAttribute("type") === "checkbox") {
                element[i].checked = false;
            } else if (element[i].getAttribute('type') === "hidden") {
                var padre = element[i].parentNode;
                if (padre.getAttribute('role') !== 'checkbox') {
                    var abuelo = padre.parentNode;
                    if (abuelo.getAttribute('persist') === campos[i]) {
                        // console.log($('#' + abuelo.id).dxSelectBox("instance"));
                        $('#' + abuelo.id).dxSelectBox("instance").option("value", 0);
                    }
                } else {

                    $('#' + padre.id).dxCheckBox("instance").option("value", false);
                }
            } else if (element[i].getAttribute("functedit") === "setEditObjectGeneric") {
                clearEdit(element[i].id);
            } else {
                element[i].value = "";
                element[i].disabled = false;
            }
        }
    }

    listaDetallesNuevos = {};
    listaDetallesEliminar = {};
    start = 0;
    startDetalles = 0;
    if (document.getElementById('Selector')) {
        ocultarformacapture(true, false, false);
        buquedaRangos(0, nametable);
    } else {
        ocultarformacapture(false, false, true);
    }
    var btn;
    var btneli;
    var btngu;
    if (tipoComponentes === 1) {
        if (document.getElementById('btnActualizar')) {
            btn = document.getElementById('btnActualizar');
            btn.style.display = 'none';
            btneli = document.getElementById('btnEliminar');
            btneli.style.display = 'none';
            btngu = document.getElementById('btnGuardar');
            btngu.style.display = 'inline';
        }
    } else if (tipoComponentes === 2) {
        if (document.getElementById('buttonActualizar')) {
            btn = document.getElementById('buttonActualizar');
            btn.style.display = 'none';
            btneli = document.getElementById('buttonEliminarNormal');
            btneli.style.display = 'none';
            btngu = document.getElementById('buttonGuardarSave');
            btngu.style.display = '';
        }
    }
    limpiar();
}

function update() {
    var nameelem = getnames();
    var url = route + "/api/UpdateGeneric";
    var dataToPost = JSON.stringify(nameelem);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado !== null) {
        alert("Datos modificados exitosamente");
        clearObjetosgen();
    } else {
        alert(Mensaje.error);
    }
}

function deleteObject() {
    var nameelem = getnames();

    var url = route + "/api/DeleteGeneric";
    var dataToPost = JSON.stringify(nameelem);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado !== null) {
        alert("Datos eliminados exitosamente");
        clearObjetosgen();
    } else {
        alert(Mensaje.error);
    }
}

function eliminarObject() {

    var answer = confirm("¿Quieres eliminar esta configuración?");
    if (answer) {
        if (listaDetalles !== undefined) {
            for (var item in listaDetalles) {
                var arreglo = [];
                for (var i = 0; i < listaDetalles[item].length; i++) {
                    var obj = {};
                    obj["Tabla"] = item;
                    for (var subitem in listaDetalles[item][i]) {
                        if (!subitem.includes(nametable.toUpperCase()) && subitem !== "$id") {
                            obj[subitem] = listaDetalles[item][i][subitem];
                        }
                    }

                    arreglo[i] = obj;
                }
                if (arreglo.length > 0) {
                    listaDetallesEliminar[item] = arreglo;
                }
            }
        }
        //listaDetallesEliminar = listaDetalles;
        deleteObject();
        clearObjetosgen();

    }
    else {
        clearObjetosgen();
    }

}

function getnames() {
    campos = undefined;
    var nameselements = new Array();
    var valueelement = new Array();
    var listaSaveDetalles = new Array();
    var listaDeleteDetalles = new Array();
    var listaglobal = {};
    var contenedor = document.getElementById('capture');
    var element = null;
    var count = null;
    if (contenedor) {

        if (tipoComponentes === 1) {
            element = contenedor.querySelectorAll("Input,select,table,div[functedit='setEditObjectGeneric']");
        } else if (tipoComponentes === 2) {
            element = contenedor.querySelectorAll("Input,select,div[persistSearch]");
        }
        count = element.length;
    }
    var j;
    for (var i = 0; i < count; i++) {
        if ((element[i].className === "mainPanelContentComponents" && element[i].tagName !== "TABLE") || ((element[i].getAttribute('persist') && (element[i].getAttribute('type') === "hidden" || element[i].getAttribute('role') === "textbox"))) || (element[i].getAttribute("functedit") === "setEditObjectGeneric")) {
            if (element[i].getAttribute("type") === "checkbox") {
                nameselements[i] = element[i].getAttribute('persist');
                valueelement[i] = element[i].checked === true ? true : false;
            } else if (element[i].getAttribute("functedit") === "setEditObjectGeneric") {
                nameselements[i] = element[i].firstElementChild.getAttribute("persist");
                valueelement[i] = element[i].getAttribute("value");

            } else {//Aqui se cargan todos las columnas 
                nameselements[i] = element[i].getAttribute('persist');
                valueelement[i] = element[i].value;
            }
        } else if (element[i].className === "mainPanelContentComponents" && element[i].tagName === "TABLE") {
            nameselements[i] = element[i].getAttribute('persist');
            if (listaDetallesEliminar !== undefined && listaDetallesEliminar[element[i].getAttribute('persist')] !== undefined) {
                tabla = element[i].getAttribute('persist');
                for (j = 0; j < listaDetallesEliminar[tabla].length; j++) {
                    listaDeleteDetalles[listaDeleteDetalles.length] = listaDetallesEliminar[tabla][j];
                }
            }
            if (listaDetallesNuevos !== undefined && listaDetallesNuevos[element[i].getAttribute('persist')] !== undefined) {
                tabla = element[i].getAttribute('persist');
                for (j = 0; j < listaDetallesNuevos[tabla].length; j++) {
                    listaSaveDetalles[listaSaveDetalles.length] = listaDetallesNuevos[tabla][j];
                }

            }
        } else if (element[i].tagName === "DIV" && element[i].getAttribute('persistSearch')) {
            nameselements[i] = element[i].getAttribute('persistSearch');
            if (listaDetallesEliminar !== undefined && listaDetallesEliminar[element[i].getAttribute('persistSearch')] !== undefined) {
                tabla = element[i].getAttribute('persistSearch');
                for (j = 0; j < listaDetallesEliminar[tabla].length; j++) {
                    listaDeleteDetalles[listaDeleteDetalles.length] = listaDetallesEliminar[tabla][j];
                }
            }
            if (listaDetallesNuevos !== undefined && listaDetallesNuevos[element[i].getAttribute('persistSearch')] !== undefined) {
                tabla = element[i].getAttribute('persistSearch');
                for (j = 0; j < listaDetallesNuevos[tabla].length; j++) {
                    listaSaveDetalles[listaSaveDetalles.length] = listaDetallesNuevos[tabla][j];
                }

            }
        }
    }
    if (listaDeleteDetalles.length > 0 && listaSaveDetalles.length > 0) {
        listaglobal['Delete'] = listaDeleteDetalles;
        listaglobal['SaveUpdate'] = listaSaveDetalles;
    } else if (listaDeleteDetalles.length > 0) {
        listaglobal['Delete'] = listaDeleteDetalles;
    } else if (listaSaveDetalles.length > 0) {
        listaglobal['SaveUpdate'] = listaSaveDetalles;
    } else {
        listaglobal = undefined;
    }
    campos = nameselements;
    var obj = {};
    obj["Tabla"] = nametable;
    if (id !== 0 && id !== undefined) {
        obj["id"] = id;
    }
    for (var h = 0; h < count; h++) {
        obj[nameselements[h]] = valueelement[h];
    }

    var obj2 = {};
    if (listaglobal !== undefined) {
        obj2['Master'] = obj;
        obj2['Detalles'] = listaglobal;
        return obj2;
    } else {
        return obj;
    }


}

function addListerner() {
    if (activarSelect) {
        var contenedor = document.getElementById('Selector');
        var element = contenedor.querySelectorAll("Input,select");
        for (var i = 0; i < CamposSelector.length; i++) {
            if (tipoComponentes === 1) {
                if (element[i].className === "mainPanelContentComponents" && element[i].getAttribute('persist') === CamposSelector[i]) {
                    if (element[i].tagName === "INPUT") {
                        $("input[persist='" + CamposSelector[i] + "']").keypress(function (e) {
                            if (e.which === 13) {
                                // busquedaFiltros(nametable, activarSelect)
                                e.preventDefault();
                            }
                        });
                    } else if (element[i].tagName === "SELECT") {
                        $("select[persist='" + CamposSelector[i] + "']")[0].setAttribute('onchange', "busquedaFiltros(nametable, activarSelect)");
                    }
                }
            } else if (tipoComponentes === 2) {
                if ((element[i].getAttribute('type') === "hidden" || element[i].getAttribute('role') === "textbox")) {
                    var padre = element[i].parentNode;
                    var abuelo = padre.parentNode;
                    if (abuelo.getAttribute('persist') === CamposSelector[i]) {
                        // console.log($('#' + abuelo.id).dxSelectBox("instance"));
                        $('#' + abuelo.id).dxSelectBox({
                            onValueChanged: function (e) {
                                // busquedaFiltros(nametable, activarSelect);
                            }
                        });//.option("value", Mensaje.resultado[campos[i]]);
                    }
                }
            }
        }
    } else if (document.getElementById('capture')) {
        var cont = document.getElementById('ContenedorPrincipal');

        if (cont.getAttribute('tipocaptura')) {
            var contenedor = document.getElementById('capture');
            var element = contenedor.querySelectorAll("Input,select");
            for (var i = 0; i < camposcapturaDetalles.length; i++) {
                if (i < element.length) {
                    if (tipoComponentes === 1) {
                        if (element[i].className === "mainPanelContentComponents" && element[i].getAttribute('persist') === camposcapturaDetalles[i + 1]) {
                            if (element[i].tagName === "SELECT") {
                                if (element[i].getAttribute('persist') === "tipoCorrida_ID") {
                                    $("select[persist='" + camposcapturaDetalles[i + 1] + "']")[0].setAttribute('onchange', "searchTipoCorrida()");
                                } else if (element[i].getAttribute('persist') === "tipoNomina_ID") {
                                    $("select[persist='" + camposcapturaDetalles[i + 1] + "']")[0].setAttribute('onchange', "SearchPerNominaXTnYTc()");
                                } else if (element[i].getAttribute('persist') === "concepNomDefi_ID") {
                                    $("select[persist='" + camposcapturaDetalles[i + 1] + "']")[0].setAttribute('onchange', "createTableMovNomConcep()");
                                }
                            }

                        }
                    } else if (tipoComponentes === 2) {
                        if ((element[i].getAttribute('type') === "hidden" || !element[i].getAttribute('role'))) {
                            var padre = element[i].parentNode;
                            var abuelo = padre.parentNode;
                            if (abuelo.getAttribute('persist') === camposcapturaDetalles[i + 1]) {
                                // console.log($('#' + abuelo.id).dxSelectBox("instance"));
                                if (abuelo.getAttribute('persist') === "tipoCorrida_ID") {
                                    $('#' + abuelo.id).dxSelectBox({
                                        onValueChanged: function (e) {
                                            searchTipoCorrida();
                                        }
                                    });
                                } else if (abuelo.getAttribute('persist') === "tipoNomina_ID") {
                                    $('#' + abuelo.id).dxSelectBox({
                                        onValueChanged: function (e) {
                                            SearchPerNominaXTnYTc();
                                        }
                                    });
                                } else if (abuelo.getAttribute('persist') === "concepNomDefi_ID") {
                                    $('#' + abuelo.id).dxSelectBox({
                                        onValueChanged: function (e) {
                                            createTableMovNomConcep();
                                        }
                                    });
                                }
                                //.option("value", Mensaje.resultado[campos[i]]);
                            }
                        }
                    }
                }
            }
        } else {
            var contenedor = document.getElementById('capture');
            var element = contenedor.querySelectorAll("Input,select");
            for (var i = 0; i < campos.length; i++) {
                if (i < element.length) {
                    if (tipoComponentes === 1) {
                        if (element[i].className === "mainPanelContentComponents" && element[i].getAttribute('persist') === campos[i]) {
                            if (element[i].tagName === "SELECT") {
                                if (element[i].getAttribute('persist') === "tipoCorrida_ID") {
                                    $("select[persist='" + campos[i] + "']")[0].setAttribute('onchange', "searchTipoCorrida()");
                                } else if (element[i].getAttribute('persist') === "tipoNomina_ID") {
                                    $("select[persist='" + campos[i] + "']")[0].setAttribute('onchange', "SearchPerNominaXTnYTc()");
                                } else if (element[i].getAttribute('persist') === "concepNomDefi_ID") {
                                    $("select[persist='" + campos[i] + "']")[0].setAttribute('onchange', "createTableMovNomConcep()");
                                }
                            }
                            //else if (element[i].tagName === "INPUT" && element[i].getAttribute('iskey') === "true") {

                            // element[i].setAttribute('onblur', 'exiteClave("' + nametable + '","' + element[i].getAttribute('persist') + '",this)');

                            //} 
                            else if (element[i].tagName === "INPUT") {

                                if (element[i].getAttribute("nombreevento")) {
                                    if (element[i].getAttribute("nombreevento") === "onkeypress") {
                                        //var tecla = parseInt(element[i].getAttribute("valortecla"));
                                        //var teclas = element[i].getAttribute("valortecla").split(',');
                                        $('#' + element[i].id).on("keydown", function (e) {
                                            var teclas = e.target.getAttribute("valortecla").split(',').map(Number);
                                            //console.log(teclas);
                                            if (teclas.includes(e.keyCode)) {
                                                // console.log(e.target.getAttribute("nombreevento"));
                                                var metodos = JSON.parse(e.target.getAttribute("metodos"));
                                                // console.log(metodos);
                                                for (var i = 0; i < metodos.length; i++) {
                                                    var obj = new Array();
                                                    obj[0] = e.target.value;
                                                    //var param = e.target.getAttribute("ParametrosMetodo").split(',');
                                                    var param = metodos[i].parametros.split(',');
                                                    for (var j = 0; j < param.length; j++) {
                                                        obj[obj.length] = param[j];
                                                    }
                                                    obj[obj.length] = e.target;
                                                    callCustomMethod['customFunction'](metodos[i].nombre, obj);
                                                    //callCustomMethod['customFunction'](e.target.getAttribute("nombremetodo"), obj);
                                                }

                                            }
                                        });
                                    }
                                }
                            }
                        }
                    } else if (tipoComponentes === 2) {
                        if ((element[i].getAttribute('type') === "hidden" || !element[i].getAttribute('role'))) {
                            var padre = element[i].parentNode;
                            var abuelo = padre.parentNode;
                            if (abuelo.getAttribute('persist') === campos[i]) {
                                // console.log($('#' + abuelo.id).dxSelectBox("instance"));
                                if (abuelo.getAttribute('persist') === "tipoCorrida_ID") {
                                    $('#' + abuelo.id).dxSelectBox({
                                        onValueChanged: function (e) {
                                            searchTipoCorrida();
                                        }
                                    });
                                } else if (abuelo.getAttribute('persist') === "tipoNomina_ID") {
                                    $('#' + abuelo.id).dxSelectBox({
                                        onValueChanged: function (e) {
                                            SearchPerNominaXTnYTc();
                                        }
                                    });
                                } else if (abuelo.getAttribute('persist') === "concepNomDefi_ID") {
                                    $('#' + abuelo.id).dxSelectBox({
                                        onValueChanged: function (e) {
                                            createTableMovNomConcep();
                                        }
                                    });
                                }
                                //.option("value", Mensaje.resultado[campos[i]]);
                            }
                        }
                    }
                }
            }
        }
    }
}

function llenarSelects() {
    var selects = $("div[tipo=select]");

    for (var i = 0; i < selects.length; i++) {
        var source = selects[i].getAttribute('source');
        var datosCampos = getCampoOrigenPorID(source);
        var datos = new Array();
        if (datosCampos["campo"]) {
            var campo = datosCampos["campo"].toString();
            if (campo.includes("_ID")) {
                table = campo.replace("_ID", "");
                table = table.charAt(0).toUpperCase() + table.slice(1);
                if (table === "Empleado") {
                    table = table + "s";
                }
                $("#" + selects[i].id + " input").attr("Table", table);
                var resultado = undefined;
                if (datosCampos["campo"] !== "periodosNomina_ID" && datosCampos["campo"] !== "concepNomDefi_ID") {
                    resultado = searchAll(table);
                }

                if (resultado !== undefined && resultado.length > 0) {
                    var configCaptura = JSON.parse(datosCampos['configuracionTipoCaptura']);
                    var valores = configCaptura['origenes'];
                    for (var j = 0; j < resultado.length; j++) {
                        if (campo === 'tipoNomina_ID' || campo === 'tipoCorrida_ID') {
                            if (valores['campovalor1'] !== "" && valores['campovalor2'] !== "") {
                                var datos2 = {};
                                datos2['id'] = resultado[j]['id'];
                                datos2[valores['campovalor1'] + valores['campovalor2']] = resultado[j][valores['campovalor1']] + "-" + resultado[j][valores['campovalor2']];
                                datos[j] = datos2;
                                $('#' + selects[i].id).dxSelectBox({
                                    valueExpr: "id",
                                    displayExpr: valores['campovalor1'] + valores['campovalor2'],
                                    valueChangeEvent: 'id',
                                    searchEnabled: true

                                });
                            } else if (valores['campovalor1'] !== "") {
                                var datos2 = {};
                                datos2['id'] = resultado[j]['id'];
                                datos2[valores['campovalor1']] = resultado[j][valores['campovalor1']];

                                datos[i] = datos2;
                                $('#' + selects[i].id).dxSelectBox({
                                    valueExpr: "id",
                                    displayExpr: valores['campovalor1'],
                                    valueChangeEvent: 'id',
                                    searchEnabled: true

                                });
                            } else {
                                var datos2 = {};
                                datos2['id'] = resultado[j]['id'];
                                datos2['descripcion'] = resultado[j]['descripcion'];

                                datos[j] = datos2;
                                $('#' + selects[i].id).dxSelectBox({
                                    valueExpr: "id",
                                    displayExpr: "descripcion",
                                    valueChangeEvent: 'id',
                                    searchEnabled: true

                                });
                            }
                        } else {
                            if (tabla === 'Empleados') {
                                if (valores['campovalor1'] !== "" && valores['campovalor2'] !== "") {
                                    var datos2 = {};
                                    datos2['id'] = resultado[j]['id'];
                                    datos2[valores['campovalor1'] + valores['campovalor2']] = resultado[j][valores['campovalor1']] + "-" + resultado[j][valores['campovalor2']];
                                    datos[j] = datos2;
                                    $('#' + selects[i].id).dxSelectBox({
                                        valueExpr: "id",
                                        displayExpr: valores['campovalor1'] + valores['campovalor2'],
                                        valueChangeEvent: 'id',
                                        searchEnabled: true

                                    });
                                } else if (valores['campovalor1'] !== "") {
                                    var datos2 = {};
                                    datos2['id'] = resultado[i]['id'];
                                    datos2[valores['campovalor1']] = resultado[j][valores['campovalor1']];

                                    datos[j] = datos2;
                                    $('#' + selects[i].id).dxSelectBox({
                                        valueExpr: "id",
                                        displayExpr: valores['campovalor1'],
                                        valueChangeEvent: 'id',
                                        searchEnabled: true

                                    });
                                } else {
                                    var datos2 = {};
                                    datos2['id'] = resultado[j]['id'];
                                    datos2['nombre'] = resultado[j]['nombre'];

                                    datos[j] = datos2;
                                    $('#' + selects[i].id).dxSelectBox({
                                        valueExpr: "id",
                                        displayExpr: "nombre",
                                        valueChangeEvent: 'id',
                                        searchEnabled: true

                                    });
                                }

                            } else {

                                if (valores['campovalor1'] !== "" && valores['campovalor2'] !== "") {
                                    var datos2 = {};
                                    datos2['id'] = resultado[j]['id'];
                                    datos2[valores['campovalor1'] + valores['campovalor2']] = resultado[j][valores['campovalor1']] + "-" + resultado[j][valores['campovalor2']];
                                    datos[j] = datos2;
                                    $('#' + selects[i].id).dxSelectBox({
                                        valueExpr: "id",
                                        displayExpr: valores['campovalor1'] + valores['campovalor2'],
                                        valueChangeEvent: 'id',
                                        searchEnabled: true

                                    });
                                } else if (valores['campovalor1'] !== "") {
                                    var datos2 = {};
                                    datos2['id'] = resultado[j]['id'];
                                    datos2[valores['campovalor1']] = resultado[j][valores['campovalor1']];

                                    datos[j] = datos2;
                                    $('#' + selects[i].id).dxSelectBox({
                                        valueExpr: "id",
                                        displayExpr: valores['campovalor1'],
                                        valueChangeEvent: 'id',
                                        searchEnabled: true

                                    });
                                } else {
                                    var datos2 = {};
                                    datos2['id'] = resultado[j]['id'];
                                    datos2['descripcion'] = resultado[j]['descripcion'];

                                    datos[j] = datos2;
                                    $('#' + selects[i].id).dxSelectBox({
                                        valueExpr: "id",
                                        displayExpr: "descripcion",
                                        valueChangeEvent: 'id',
                                        searchEnabled: true

                                    });
                                }

                            }
                        }
                    }//end for resultado
                    if (selects[i].getAttribute('Selector') === "true") {
                        $('#' + selects[i].id).dxSelectBox({
                            dataSource: datos,
                            searchEnabled: true,
                            onValueChanged: function (e) {
                                // busquedaFiltros(table, activaSelect);
                            }

                        });
                    } else {
                        $('#' + selects[i].id).dxSelectBox({
                            dataSource: datos,
                            searchEnabled: true,
                            //onValueChanged: function (e) {
                            //    busquedaFiltros(table, activaSelect);
                            //}

                        });
                    }
                }//end if si resultado contiene datos
            }//end if includes
            else {
                var configu = JSON.parse(datosCampos['configuracionTipoCaptura']);
                if (configu['tipoCaptura'] === "2") {
                    var valores = configu['lista'];
                    for (var j = 0; j < valores.length; j++) {
                        var datos2 = {};
                        datos2['id'] = valores[j];
                        datos2[valores[j]] = valores[j];

                        datos[j] = datos2;
                        //  datos[i] = valores[i];
                    }
                    $('#' + selects[i].id).dxSelectBox({
                        dataSource: datos,
                        searchEnabled: true,
                        valueExpr: "id",
                        valueChangeEvent: 'id'
                        //onValueChanged: function (e) {
                        //    busquedaFiltros(table, activaSelect);
                        //}

                    });
                } else if (configu['tipoCaptura'] === "3") {
                    var valores = configu['equivalencias'];
                    for (var key in valores) {
                        var datos2 = {};
                        datos2['id'] = key;
                        datos2[valores[key]] = valores[key];

                        //datos[j] = datos2;
                        datos[datos.length] = datos2;
                    }
                }
                $('#' + selects[i].id).dxSelectBox({
                    dataSource: datos,
                    searchEnabled: true,
                    valueExpr: "id",
                    valueChangeEvent: 'id'
                    //onValueChanged: function (e) {
                    //    busquedaFiltros(table, activaSelect);
                    //}

                });

            }
        }//end if exite key Campo

    }//end for
}

function getCampoOrigenPorID(idCampo) {
    var resultado;
    var url = route + "/api/CamposOrigenDatos/getCampoPorID";
    var dataToPost = JSON.stringify(idCampo);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado != null) {
        resultado = Mensaje.resultado;
    }
    return resultado;
}

function searchAll(tabla, select) {
    var resultado;
    activarSelect = select;
    var url = route + "/api/SearchGenericAll";
    var dataToPost = JSON.stringify(tabla);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado != null) {
        resultado = Mensaje.resultado;
    }
    return resultado;
}

function createPagination(numberData, origen, typeDetail) {
    var typeDetail = typeof typeDetail !== 'undefined' ? typeDetail : false;
    // var paginador = $(".pagination");
    var paginador = $("#listPag" + origen);
    // alert(paginador.attr("id"));
    paginador.attr("sourcePage", origen);
    paginador.attr("isDetail", typeDetail);
    paginador.attr("totaReg", numberData);
    // alert(origen);
    paginador.html("");
    items = numberData;
    //  alert(rowsByPage);
    totalPages = Math.ceil(items / rowsByPage);

    //$('<li><a href="#" class="first_link">&#9664;</a></li>').appendTo(paginador);
    //$('<li><a href="#" class="prev_link">&laquo;</a></li>').appendTo(paginador);

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
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .first_link" + origen).click(function () {
        var a = 0;
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .prev_link" + origen).click(function () {
        var a = parseInt(paginador.data("pag")) - 1;
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .next_link" + origen).click(function () {
        if (paginador.data("pag") === undefined) {
            a = 1;
        } else {
            a = parseInt(paginador.data("pag")) + 1;

        }
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .last_link" + origen).click(function () {
        items = paginador.attr("totaReg");
        totalPages = Math.ceil(items / rowsByPage);
        var a = totalPages - 1;
        return cargaPagina(a, paginador), !1;
    });
}

function cargaPagina(a, paginador) {
    var origen = paginador.attr("sourcePage");
    var typeDetail = paginador.attr("isDetail");
    pagina = a;
    fromPage = pagina * rowsByPage;
    pagina >= 1 ? paginador.find(".prev_link" + origen).show() : paginador.find(".prev_link" + origen).hide();
    totalPages - numbersByPage > pagina ? paginador.find(".next_link" + origen).show() : paginador.find(".next_link" + origen).hide(),
        paginador.data("pag", pagina), numbersByPage > 1 && ($(".page_link" + origen).hide(),
            totalPages - numbersByPage > pagina ? $(".page_link" + origen).slice(pagina, numbersByPage + pagina).show() :
                totalPages > numbersByPage ? $(".page_link" + origen).slice(totalPages - numbersByPage).show() :
                    $(".page_link" + origen).slice(0).show()), paginador.children().removeClass("active"),
        paginador.children().eq(pagina + 2).addClass("active");
    /// alert("From Page: " + fromPage);

    if (typeDetail === "true") {
        llenartablaDetalle(listaDetalles[origen], origen, fromPage);
        //buquedaRangos(fromPage, origen);
    } else {
        buquedaRangos(fromPage, origen);
    }
}

function buquedaRangos(startIn, tabla, typeDetail) {
    typeDetail = typeof typeDetail !== 'undefined' ? typeDetail : false;
    if (tabla !== "") {
        nametable = tabla;
    }
    var typeContain = null;
    var typeTable = null;
    var tbl = null;
    var alias = false;
    if (typeDetail) {
        tbl = document.getElementById(typeDetail);
        var tblProp = tbl.getAttribute("tableidentifier").split('|');
        tabla = tblProp[1];
        alias = true;
    } else {
        typeContain = document.getElementById("containerTable");
        if (typeContain) {
            var typeTable = typeContain.getAttribute("mode");
            if (typeTable === "selector") {
                tbl = document.getElementById(tabla + 'Select');
            } else if (typeTable === "search") {
                tbl = document.getElementById(tabla + 'Search');
            }
            getFilters();
        }
    }
    var subEntities = tbl.getAttribute("subentities");
    //Read data from table
    var genModel = new Object();
    genModel.fuentePrincipal = tabla;
    if (subEntities) {
        var dataSub = new Array();
        dataSub = subEntities.split(",");
        genModel.tablasRelacionadas = dataSub;
    }
    var dataFields = new Array();
    if (tipoComponentes === 1) {
        $("#" + tbl.id + ' > thead > tr > th').each(function () {
            if ($(this).attr("fieldsource")) {
                dataFields.push($(this).attr("fieldsource"));
            }
        });
    } else if (tipoComponentes === 2) {
        var columnasTbl = columnasTablasobj[tbl.id];
        for (var i = 0; i < columnasTbl.length; i++) {
            if (columnasTbl[i]["fieldsource"]) {
                dataFields.push(columnasTbl[i]["fieldsource"]);
            }
        }
        alias = true;
    }
    if (dataFields.length > 0) {
        //By default add the id of table
        dataFields.unshift("id");
        genModel.camposMostrar = dataFields;
    }
    genModel.startPaged = (startIn);
    genModel.endPaged = rowsByPage;//No problem is general

    if (typeDetail) {//Si es detalle get all data
        genModel.startPaged = null;
        genModel.endPaged = null;
    }
    if (filterValues !== null) {
        var cmpWhereArr = [];
        var cmpvalWhere = [];
        filterValues.forEach(function (value, index) {
            var cmpWhere = value[0];
            var valWhere = value[1];
            if (valWhere !== '') {
                cmpWhereArr.push(cmpWhere);
                cmpvalWhere.push(valWhere);
            }
        });
        genModel.camposWhere = cmpWhereArr;
        genModel.valoresWhere = cmpvalWhere;
    }

    if (startIn === 0) {
        genModel.withCount = true;
    }
    genModel.activarAlias = alias;

    var url = route + "/api/Generic/getConsultaPorFiltros";
    var dataToPost = JSON.stringify(genModel);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.error !== "") {
        alert(Mensaje.error);
    } else {
        if (Mensaje.resultado === null) {
            alert("No hay información para esta tabla");
        } else {
            var values = Mensaje.resultado;
            $('#' + tbl.id).find("tr:gt(0)").remove();
            listaDatosSelector = Mensaje.resultado;
            if (typeDetail) {
                if (startIn === 0) {
                    createPagination(values[1], tabla, true);
                }
                listaDetalles[tabla] = values[0];
                llenartablaDetalle(listaDetalles[tabla], tabla, 0);
            } else {
                var typeTable = typeContain.getAttribute("mode");
                if (typeTable === "selector") {
                    if (startIn === 0) {
                        createPagination(values[1], tabla);
                    }
                    llenartablaSelector(values[0], tabla);
                } else if (typeTable === "search") {
                    if (startIn === 0) {
                        createPagination(values[1], tabla);
                    }
                    llenartablaSearch(values[0], tabla);
                }
            }
        }
    }
    filterValues = null;
}

function getFilters() {
    var filters = new Array();
    $('[kind="filter"]').each(function () {
        var cmpVal = $(this).attr("persist");
        if (cmpVal.includes("_ID")) {
            cmpVal = cmpVal.substring(0, cmpVal.indexOf('_'));
            cmpVal += ".id";
        }
        filters.push(new Array(cmpVal, $(this).val()));
    });
    filterValues = filters;
}

function setFiltros(table) {
    if (table) {
        var typeDetail = table + "Detail";
        buquedaRangos(0, table, typeDetail);
    } else {
        buquedaRangos(0, nametable);
    }
}

function addValuetoDetail(diseno, origenDatos) {
    var divDetalles = document.getElementById('panelDetalle');
    var panel;
    var dataCapturedetalle;
    var tbl;
    if (document.getElementById('Buscar')) {
        if (tipoComponentes === 1) {
            var busqueda = document.getElementById('Buscar');
            tbl = busqueda.querySelector('table');
        } else if (tipoComponentes === 2) {
            var busqueda = document.getElementById('Buscar');
            tbl = busqueda.querySelector('div[persistSearch]');
        }
    } else if (document.getElementById('Selector')) {
        if (tipoComponentes === 1) {
            var selector = document.getElementById('Selector');
            tbl = selector.querySelector('table');
        } else if (tipoComponentes === 2) {
            var selector = document.getElementById('Selector');
            tbl = selector.querySelector('div[persistSearch]');
        }
    }

    var divCaptura = document.getElementById('capture');
    // var txtclave = divCaptura.querySelector("input[iskey='true']");
    // if (txtclave.value !== "") {
    var panel;
    if (tipoComponentes === 1) {
        panel = JSON.stringify(diseno);
        dataCapturedetalle = JSON.parse(panel);
    } else if (tipoComponentes === 2) {
        if (typeof (diseno) === 'string') {
            dataCapturedetalle = JSON.parse(diseno);
        } else {
            panel = JSON.stringify(diseño);
            dataCapturedetalle = diseno;
        }
        if (typeof (origenDatos) === 'string') {
            origenDatos = JSON.parse(origenDatos);
        }
        //dataCapturedetalle = JSON.parse(diseno);
        //origenDatos = JSON.parse(origenDatos);
    }
    //var panel = JSON.stringify(diseño);
    // var dataCapturedetalle = JSON.parse(diseño);
    if (panel !== null && panel.toString().length > 258) {
        var infoOrigin = new Object();
        infoOrigin.id = origenDatos["id"];
        infoOrigin.toDict = true;
        cragarpropdetalle(infoOrigin);

        var infoCapturedetalle = dataCapturedetalle.content[0];
        for (var i = 0; i < infoCapturedetalle.content.length; i++) {
            if (infoCapturedetalle.content[i].elemento === "IDIV") {
                var iDiv = createJsDivGlobal(infoCapturedetalle.content[i], undefined);
                var btnAceptar;
                var btnCancelar;
                if (tipoComponentes === 1) {
                    btnAceptar = createButtonAceptar();
                    btnAceptar.setAttribute('onclick', "saveOrUpdateDetalles()");
                    btnCancelar = createButtonCancelar(false, true, false);
                } else if (tipoComponentes === 2) {
                    btnAceptar = document.createElement('div');
                    btnAceptar.id = "buttonAceptarDetalleNor";
                    btnAceptar.style.marginRight = "15px";
                    btnCancelar = document.createElement('div');
                    btnCancelar.id = "buttonCancelarDetalleNor";
                }
                //var btnAceptar = createButtonAceptar();
                //btnAceptar.setAttribute('onclick', "saveDetalles()");
                iDiv.appendChild(btnAceptar);
                // var btnCancelar = createButtonCancelar(false,true,false);
                iDiv.appendChild(btnCancelar);
                divDetalles.appendChild(iDiv);
            }
        }
        if (tipoComponentes === 2) {
            crearCajatexto(divDetalles);
            crearSelectBox(false);
            crearBotonAceptar();
            crearBotonCancelar();
            var select = divDetalles.querySelectorAll('div[tipo="select"]');

            for (var i = 0; i < select.length; i++) {
                var table = select[i].getAttribute('persist').charAt(0).toUpperCase() + select[i].getAttribute('persist').slice(1);
                if (table.replace("_ID", "") === tbl.getAttribute('persistsearch')) {
                    $('#' + select[i].id).dxSelectBox({
                        disabled: true
                    });
                    break;
                }
            }
        } else {
            var select = divDetalles.querySelectorAll('select');
            for (var i = 0; i < select.length; i++) {
                if (select[i].getAttribute('table') === tbl.getAttribute('persist')) {
                    select[i].disabled = true;
                }
            }
        }

        activarModeDetalle();
        tablaDetalle(origenDatos["nombre"]);
        getnamesDetalles(origenDatos["nombre"]);
        divDetalles.style.display = "block";
        var divCapture = document.getElementById('capture');
        divCapture.style.display = "none";
    } else {

        alert("No hay forma revise su configuracion de captura");
    }
    // } else {
    //   alert("llene el campo clave");
    //}
}

//funciones para la tabla del selector 
function getnamesSelector() {//checar lo checkbox
    var nameselements = new Array();
    var valueelement = new Array();
    var contenedor = document.getElementById('Selector');
    var element = contenedor.querySelectorAll("Input,select");
    var count = element.length;
    for (var i = 0; i < count; i++) {
        if (element[i].className === "mainPanelContentComponents" || ((element[i].getAttribute('persist') && (element[i].getAttribute('type') === "hidden" || element[i].getAttribute('role') === "textbox")))) {
            nameselements[i] = element[i].getAttribute('persist');
            valueelement[i] = element[i].value;
        }
    }
    CamposSelector = nameselements;
    var obj = {};
    obj["Tabla"] = nametable;
    for (var h = 0; h < count; h++) {
        obj[nameselements[h]] = valueelement[h];
    }
    return obj;
}

function llenartablaSelector(data, tabla) {//Saber si quitar parametro select
    if (tipoComponentes === 1) {
        var tbl;
        // if (select) {
        tbl = document.getElementById(tabla + 'Select');
        $('#' + tabla).find("tr:gt(0)").remove();
        // }
        var dataLength = data.length;
        for (i = 0; i < dataLength; i++) {
            var valueId = data[i][0];//The identifer Id of table
            var tr = document.createElement('tr');
            tr.id = valueId.toString();

            var columnsLength = data[i].length;
            // var columnsLength = sizeColumns.length - 2;
            var td = null;
            for (var j = 1; j < columnsLength; j++) {
                td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i][j]));
                tr.appendChild(td);
            }
            //Default buttons for Select
            td = document.createElement('td');
            var a = document.createElement('a');
            var linkText = document.createTextNode(idioma.messageFormatter("Editar")());
            a.appendChild(linkText);
            a.href = "javascript:editObjectgen('" + valueId + "');";
            td.appendChild(a);
            tr.appendChild(td);
            td = document.createElement('td');
            var a = document.createElement('a');
            var linkText = document.createTextNode(idioma.messageFormatter("Eliminar")());
            a.appendChild(linkText);
            a.href = "javascript:deleteObjectInTablegen('" + valueId + "');";
            td.appendChild(a);
            tr.appendChild(td);
            tbl.appendChild(tr);
        }

    } else if (tipoComponentes === 2) {
        var datos = new Array();
        if (data !== null) {


            for (var i = 0; i < data.length; i++) {
                datos[i] = data[i];
            }
        }
        //var tbl;
        //        if (select) {
        //
        //            tabla = nametable + 'Select';
        //            //  $('#' + tabla).find("tr:gt(0)").remove();
        //        } else {
        //            // tbl = document.getElementById(tabla + 'Search');
        //            tabla = nametable + 'Search';
        //        }
        if (document.getElementById(tabla + 'Select')) {


            var grid = $('#' + tabla + 'Select').dxDataGrid({
                dataSource: datos,
                //keyExpr: "clave",
                showBorders: true,
                noDataText: "No Hay Datos",
                paging: {
                    pageSize: 10

                },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [5, 10, 20],
                    showNavigationButtons: true,
                    showInfo: true,
                    infoText: "Pagina {0}. Total: {1} ({2} datos)"
                },
                columns: [
                    {
                        dataField: idioma.messageFormatter('Editar')(),
                        cellTemplate: function (container, options) {
                            var data = options.data;
                            //alert(data.clave);
                            $('<a/>').addClass('dx-link')
                                .text(idioma.messageFormatter('Editar')())
                                .on('dxclick', function () {
                                    editObjectgen(data.Id);
                                })
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: idioma.messageFormatter('Eliminar')(),
                        cellTemplate: function (container, options) {
                            var data = options.data;
                            $('<a/>').addClass('dx-link')
                                .text(idioma.messageFormatter('Eliminar')())
                                .on('dxclick', function () {
                                    deleteObjectInTablegen(data.Id);
                                })
                                .appendTo(container);
                        }
                    }]

            }).dxDataGrid("instance");
            var hijo = document.getElementById(tabla + 'Select');
            var columnasadd = columnasTablasobj[hijo.id];
            var columns = grid.option("columns");
            for (var i = 0; i < columnasadd.length; i++) {
                if (columnasadd[i]['valor'] !== "tbEditar" && columnasadd[i]['valor'] !== "tbEliminar" && columnasadd[i]['valor'] !== "tbSelecionar") {
                    var valor = columnasadd[i]["fieldsource"].charAt(0).toUpperCase() + columnasadd[i]["fieldsource"].slice(1);
                    grid.addColumn({ caption: columnasadd[i]['texto'], dataField: valor.replace('.', ''), visibleIndex: i });
                }

            }
        }


    }
}

//Funcion para el llenado de la tabla de busqueda
function llenartablaSearch(data, tabla) {
    var tableBodyEdit = document.createElement("TBODY");
    tableBodyEdit.id = "bodyEdit";
    if (tipoComponentes === 1) {
        var tbl = document.getElementById(tabla + 'Search');
        tabla = nametable + 'Search';
        var foundDates = [];
        var dataFields = new Array();
        $('#' + tabla).find("tr:gt(0)").remove();
        $("#" + tabla + ' > thead > tr > th').each(function () {
            if ($(this).attr("fieldsource")) {
                dataFields.push($(this).attr("fieldsource"));
            }
        });
        for (var index = 0; index < dataFields.length; index++) {
            if (dataFields[index].startsWith("Date:")) {
                foundDates.push(index);
            }
        }

        var dataLength = data.length;
        for (i = 0; i < dataLength; i++) {
            var valueId = data[i][0];//The identifer Id of table
            var tr = document.createElement('tr');
            tr.id = valueId.toString();
            var columnsLength = data[i].length;
            var td = null;
            for (var j = 1; j < columnsLength; j++) {
                td = document.createElement('td');
                if (foundDates.indexOf(j-1) >= 0) {
                    var getDateCmp = new Date(data[i][j]);
                    data[i][j] = formatDatemmddyyy(getDateCmp);
                }

                td.appendChild(document.createTextNode(data[i][j]));
                tr.appendChild(td);

            }

            //Default buttons for Select
            td = document.createElement('td');
            var a = document.createElement('a');
            var linkText = document.createTextNode(idioma.messageFormatter("Selecionar")());
            a.appendChild(linkText);
            a.href = "javascript:editObjectgen('" + valueId + "');";
            td.appendChild(a);
            tr.appendChild(td);

            //            td = document.createElement('td');
            //            var a = document.createElement('a');
            //            var linkText = document.createTextNode(idioma.messageFormatter("Eliminar")());
            //            a.appendChild(linkText);
            //            a.href = "javascript:deleteObjectInTablegen('" + valueId + "');";
            //            td.appendChild(a);
            //            tr.appendChild(td);

            tableBodyEdit.appendChild(tr);

        }
        tbl.appendChild(tableBodyEdit);

        //        for (var i = start; i < end; i++) {
        //
        //            var value = listaDatosSelector[i][0]['clave'];
        //            var tr = document.createElement('tr');
        //            tr.id = value.toString();
        //            var sizeColumns = tbl.rows[0].cells;
        //            for (var j = 0; j < sizeColumns.length; j++) {
        //                if (sizeColumns[j].id !== "tbSelecionar") {
        //                    var td = document.createElement('td');
        //                    td.appendChild(document.createTextNode(listaDatosSelector[i][0][sizeColumns[j].getAttribute('persist')]));
        //                } else if (sizeColumns[j].id === "tbSelecionar") {
        //                    td = document.createElement('td');
        //                    var a = document.createElement('a');
        //                    var linkText = document.createTextNode(idioma.messageFormatter("Selecionar")());
        //                    a.appendChild(linkText);
        //                    a.href = "javascript:editObjectgen('" + value + "');";
        //                    td.appendChild(a);
        //                }
        //
        //                tr.appendChild(td);
        //            }
        //            tbl.appendChild(tr);
        //        }

    } else if (tipoComponentes === 2) {
        var datos = new Array();
        for (var i = 0; i < data.length; i++) {
            datos[i] = data[i];
        }
        tabla = tabla + "Search";
        var grid = $('#' + tabla).dxDataGrid({
            dataSource: datos,
            //keyExpr: "clave",
            showBorders: true,
            paging: {
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [5, 10, 20],
                // showInfo: true
            },
            columns: [
                {
                    dataField: idioma.messageFormatter('Selecionar')(),
                    cellTemplate: function (container, options) {
                        var data = options.data;
                        //alert(data.clave);
                        $('<a/>').addClass('dx-link')
                            .text(idioma.messageFormatter('Selecionar')())
                            .on('dxclick', function () {
                                editObjectgen(data.Id);
                            })
                            .appendTo(container);
                    }
                }]

        }).dxDataGrid("instance");
        var hijo = document.getElementById(tabla);
        var columnasadd = columnasTablasobj[hijo.id];
        var columns = grid.option("columns");
        for (var i = 0; i < columnasadd.length; i++) {
            if (columnasadd[i]['valor'] !== "tbEditar" && columnasadd[i]['valor'] !== "tbEliminar" && columnasadd[i]['valor'] !== "tbSelecionar") {
                var valor = columnasadd[i]["fieldsource"].charAt(0).toUpperCase() + columnasadd[i]["fieldsource"].slice(1);
                grid.addColumn({ caption: columnasadd[i]['texto'], dataField: valor.replace('.', ''), visibleIndex: i });
            }

        }
    }


}

//funciones para los detalles de los catalogos
var cont = 0;
function getnamesDetalles(tabla) {
    var nameselements = new Array();
    var valueelement = new Array();
    var contenedor = document.getElementById('panelDetalle');
    var element = contenedor.querySelectorAll("Input,select");
    var count = element.length;
    for (var i = 1; i <= count; i++) {
        if (element[i - 1].className === "mainPanelContentComponents" || ((element[i - 1].getAttribute('persist') && (element[i - 1].getAttribute('type') === "hidden" || element[i - 1].getAttribute('role') === "textbox")))) {
            if (element[i - 1].getAttribute("type") === "checkbox") {
                nameselements[i] = element[i - 1].getAttribute('persist');
                valueelement[i] = element[i - 1].checked === true ? true : false;
            } else {
                nameselements[i] = element[i - 1].getAttribute('persist');
                valueelement[i] = element[i - 1].value;
            }

        }
    }
    nameselements[0] = tabla;
    camposDetalles = nameselements;
    var obj = {};
    obj["Tabla"] = tabla;
    //if (idDetalle !== 0 && idDetalle !== undefined) {
    //    obj["id"] = idDetalle;

    //}
    for (var h = 1; h <= nameselements.length - 1; h++) {
        obj[nameselements[h]] = valueelement[h];
    }
    if (idDetalle !== 0 && idDetalle !== undefined) {
        obj["id"] = idDetalle;
        // nameselements.splice(1, 0, 'id');
    }

    return obj;
}

function llenartablaDetalle(data, tabla, start) {
    if (data === undefined || data == '') {
        alert("No existen detalles para este registro");
    } else {
        if (tipoComponentes === 1) {
            var tbl;
            tbl = document.getElementById(tabla + 'Detail');
            $('#' + tabla + 'Detail').find("tr:gt(0)").remove();
            var dataLength = data.length;
            var fin;
            if (dataLength > rowsByPage) {
                var res = (rowsByPage + start) - dataLength;
                if (res > 0) {
                    fin = (rowsByPage + start) - res;
                } else {
                    fin = rowsByPage + start;
                }

            } else {
                fin = dataLength;
            }
            for (i = start; i < fin; i++) {
                var valueId = data[i]['Id'];//The identifer Id of table
                var tr = document.createElement('tr');
                tr.id = valueId.toString();
                //var nColumnas = $('#' + tabla + 'Detail ' + 'tr:first th').length
                var sizeColumns = tbl.rows[0].cells;
                var columnsLength = sizeColumns.length - 2;
                //var columnsLength = data[i].length;
                var td = null;
                for (var j = 0; j < columnsLength; j++) {
                    td = document.createElement('td');
                    var texto = sizeColumns[j].getAttribute('fieldsource').charAt(0).toUpperCase() + sizeColumns[j].getAttribute('fieldsource').slice(1);
                    texto = texto.replace(".", "");
                    //console.log(texto);
                    td.appendChild(document.createTextNode(data[i][texto]));
                    tr.appendChild(td);
                }
                //Default buttons for Details
                td = document.createElement('td');
                var a = document.createElement('a');
                var linkText = document.createTextNode(idioma.messageFormatter("Editar")());
                a.appendChild(linkText);
                a.href = "javascript:editObjectgen('" + valueId + "'" + "," + true + ",'" + tabla + "');";
                td.appendChild(a);
                tr.appendChild(td);
                td = document.createElement('td');
                var a = document.createElement('a');
                var linkText = document.createTextNode(idioma.messageFormatter("Eliminar")());
                a.appendChild(linkText);
                a.href = "javascript:deleteObjectInTablegen('" + valueId + "'" + "," + true + ",'" + tabla + "');";
                td.appendChild(a);
                tr.appendChild(td);
                tbl.appendChild(tr);
            }



            //        data = data[tabla];
            //        tabla = tabla + 'Detail';
            //        if (startDetalles <= data.length) {
            //            var fin = 0;
            //            //var inicio = 0;
            //            $('#' + tabla).find("tr:gt(0)").remove();
            //            var tbl = document.getElementById(tabla);
            //            for (i = startDetalles; i < fin; i++) {
            //
            //                var value = data[i]['clave'].toString();
            //                var tr = document.createElement('tr');
            //                tr.id = value.toString();
            //                var sizeColumns = tbl.rows[0].cells;
            //                for (var j = 0; j < sizeColumns.length; j++) {
            //                    if (sizeColumns[j].innerText !== "Editar" && sizeColumns[j].innerText !== "Eliminar") {
            //                        var td = document.createElement('td');
            //                        td.appendChild(document.createTextNode(data[i][sizeColumns[j].innerText.toString()]));
            //                    } else if (sizeColumns[j].innerText === "Editar") {
            //                        td = document.createElement('td');
            //                        var a = document.createElement('a');
            //                        var linkText = document.createTextNode("Editar");
            //                        a.appendChild(linkText);
            //                        a.href = "javascript:editObjectgen('" + value + "'" + "," + true + "," + tabla + ");";
            //                        td.appendChild(a);
            //                    }
            //                    else if (sizeColumns[j].innerText === "Eliminar") {
            //                        td = document.createElement('td');
            //                        var a = document.createElement('a');
            //                        var linkText = document.createTextNode("Eliminar");
            //                        a.appendChild(linkText);
            //                        a.href = "javascript:deleteObjectInTablegen('" + value + "'" + "," + true + ");";
            //                        td.appendChild(a);
            //                    }
            //                    tr.appendChild(td);
            //                }
            //                tbl.appendChild(tr);
            //            }
            //        }   
        } else if (tipoComponentes === 2) {
            // data = data[tabla];
            var datos = new Array();
            var dataLength = data.length;
            var fin;
            if (dataLength > rowsByPage) {
                var res = (rowsByPage + start) - dataLength;
                if (res > 0) {
                    fin = (rowsByPage + start) - res;
                } else {
                    fin = rowsByPage + start;
                }

            } else {
                fin = dataLength;
            }
            var k = 0;
            for (var i = start; i < fin; i++) {
                datos[k] = data[i];
                k++;
            }
            var tableaux = tabla;
            tabla = tabla + 'Detail';
            var grid = $('#' + tabla).dxDataGrid({
                dataSource: datos,
                //keyExpr: "clave",
                showBorders: true,
                noDataText: "No Hay Datos",
                //paging: {
                //    pageSize: 10

                //},
                //pager: {
                //    showPageSizeSelector: true,
                //    allowedPageSizes: [5, 10, 20],
                //    showNavigationButtons: true,
                //    showInfo: true,
                //    infoText: "Pagina {0}. Total: {1} ({2} datos)"
                //},
                columns: [
                    {
                        dataField: idioma.messageFormatter('Editar')(),
                        cellTemplate: function (container, options) {
                            var data = options.data;
                            //alert(data.clave);
                            $('<a/>').addClass('dx-link')
                                .text(idioma.messageFormatter('Editar')())
                                .on('dxclick', function () {
                                    editObjectgen(data.Id, true, tableaux);
                                })
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: idioma.messageFormatter('Eliminar')(),
                        cellTemplate: function (container, options) {
                            var data = options.data;
                            $('<a/>').addClass('dx-link')
                                .text(idioma.messageFormatter('Eliminar')())
                                .on('dxclick', function () {
                                    deleteObjectInTablegen(data.Id, true);
                                })
                                .appendTo(container);
                        }
                    }]

            }).dxDataGrid("instance");
            var hijo = document.getElementById(tabla);
            var columnasadd = columnasTablasobj[hijo.id];
            var columns = grid.option("columns");
            for (var i = 0; i < columnasadd.length; i++) {
                if (columnasadd[i]['valor'] !== "tbEditar" && columnasadd[i]['valor'] !== "tbEliminar" && columnasadd[i]['valor'] !== "tbSelecionar") {
                    var valor = columnasadd[i]["fieldsource"].charAt(0).toUpperCase() + columnasadd[i]["fieldsource"].slice(1);
                    grid.addColumn({ caption: columnasadd[i]['texto'], dataField: valor.replace('.', ''), visibleIndex: i });

                    // grid.addColumn({ dataField: columnasadd[i], visibleIndex: i });

                }

            }
        }
    }
}

function saveDetalles() {//verify
    var contenedor = document.getElementById('capture');
    var element = null;
    var count = null;
    var valueelement = new Array();
    var nameselements = new Array();
    var subTable = "";
    if (contenedor) {
        element = contenedor.querySelectorAll("Input,select");
        count = element.length;
    }
    for (var i = 0; i < count; i++) {
        if ((element[i].className === "mainPanelContentComponents" && element[i].tagName !== "TABLE") || ((element[i].getAttribute('persist') && (element[i].getAttribute('type') === "hidden" || element[i].getAttribute('role') === "textbox")))) {
            if (element[i].getAttribute("type") === "checkbox") {
                nameselements[i] = element[i].getAttribute('persist');
                valueelement[i] = element[i].checked === true ? true : false;
            } else {//Aqui se cargan todos las columnas 
                nameselements[i] = element[i].getAttribute('persist');
                valueelement[i] = element[i].value;
            }
        }
    }
    if (document.getElementById('Buscar')) {
        if (tipoComponentes === 1) {
            var busqueda = document.getElementById('Buscar');
            tbl = busqueda.querySelector('table');
            subTable = tbl.getAttribute('persist');
            subTable = subTable.charAt(0).toUpperCase() + subTable.slice(1);
        } else if (tipoComponentes === 2) {
            var busqueda = document.getElementById('Buscar');
            tbl = busqueda.querySelector('div[persistSearch]');
            subTable = tbl.getAttribute('persistSearch');
            subTable = subTable.charAt(0).toUpperCase() + subTable.slice(1);
        }

    } else if (document.getElementById('Selector')) {
        if (tipoComponentes === 1) {
            var selector = document.getElementById('Selector');
            tbl = selector.querySelector('table');
            subTable = tbl.getAttribute('persist');
            subTable = subTable.charAt(0).toUpperCase() + subTable.slice(1);
        } else if (tipoComponentes === 2) {
            var selector = document.getElementById('Selector');
            tbl = selector.querySelector('div[persistSearch]');
            subTable = tbl.getAttribute('persistSearch');
            subTable = subTable.charAt(0).toUpperCase() + subTable.slice(1);
        }

    }
    var arrayDetalles = [];
    var nameelementsDetalle = getnamesDetalles(nametableDetalle);
    if (listaDetallesNuevos[nametableDetalle] !== undefined) {
        arrayDetalles[arrayDetalles.length] = nameelementsDetalle;
        for (var i = 0; i < arrayDetalles.length; i++) {
            var aux = [];
            var obj = {}
            var conta1 = 1;
            for (var item in arrayDetalles[i]) {
                if (item !== "Tabla" && !item.includes("_ID")) {
                    if (conta1 === 1) {
                        obj['Id'] = arrayDetalles[i][item];
                        conta1 = 2;
                    }
                    obj[item.charAt(0).toUpperCase() + item.slice(1)] = arrayDetalles[i][item];
                }
            }
            for (var k = 0; k < count; k++) {
                obj[subTable + nameselements[k]] = valueelement[k];
            }
            listaDetalles[nametableDetalle].unshift(obj);
        }
        listaDetallesNuevos[nametableDetalle][listaDetallesNuevos[nametableDetalle].length] = nameelementsDetalle;

    } else {

        arrayDetalles[arrayDetalles.length] = nameelementsDetalle;
        if (listaDetalles[nametableDetalle] !== undefined) {
            for (var i = 0; i < arrayDetalles.length; i++) {
                var aux = [];
                var obj = {}
                var conta1 = 1;
                for (var item in arrayDetalles[i]) {
                    if (item !== "Tabla" && !item.includes("_ID")) {
                        if (conta1 === 1) {
                            obj['Id'] = arrayDetalles[i][item];
                            conta1 = 2;
                        }
                        obj[item.charAt(0).toUpperCase() + item.slice(1)] = arrayDetalles[i][item];
                    }
                }
                for (var k = 0; k < count; k++) {
                    obj[subTable + nameselements[k]] = valueelement[k];
                }
                listaDetalles[nametableDetalle].unshift(obj);
            }
            listaDetallesNuevos[nametableDetalle] = arrayDetalles;
        } else {
            for (var i = 0; i < arrayDetalles.length; i++) {
                var aux = [];
                var obj = {}
                var conta1 = 1;
                for (var item in arrayDetalles[i]) {
                    if (item !== "Tabla" && !item.includes("_ID")) {
                        if (conta1 === 1) {
                            obj['Id'] = arrayDetalles[i][item];
                            conta1 = 2;
                        }
                        obj[item.charAt(0).toUpperCase() + item.slice(1)] = arrayDetalles[i][item];
                    }
                }
                for (var k = 0; k < count; k++) {
                    obj[subTable + nameselements[k]] = valueelement[k];
                }
                console.log(obj);
                var aux2 = [];
                aux2[aux2.length] = obj;
                listaDetalles[nametableDetalle] = aux2;
                listaDetallesNuevos[nametableDetalle] = arrayDetalles;
            }

            //listaDetalles[nametableDetalle] = arrayDetalles;
        }

    }
    // listaDetallesNuevos[nametableDetalle][listaDetallesNuevos]] = arrayDetalles;
    ocultarformacapture(false, true, false);
    createPagination(listaDetalles[nametableDetalle].length, nametableDetalle, true);
    llenartablaDetalle(listaDetalles[nametableDetalle], nametableDetalle, 0);
    activarSelect = true;
    cont++;
}

function updateDetalles() {
    var arrayDetalles2 = [];
    var entro = false;
    var subTable = "";
    var nameelements = getnamesDetalles(nametableDetalle);
    var data = listaDetalles[nametableDetalle];
    if (document.getElementById('Buscar')) {
        var busqueda = document.getElementById('Buscar');
        tbl = busqueda.querySelector('table');
        subTable = tbl.getAttribute('persist');
        subTable = subTable.charAt(0).toUpperCase() + subTable.slice(1);
    } else if (document.getElementById('Selector')) {
        var selector = document.getElementById('Selector');
        tbl = selector.querySelector('table');
        subTable = tbl.getAttribute('persist');
        subTable = subTable.charAt(0).toUpperCase() + subTable.slice(1);
    }
    for (var i = 0; i < data.length; i++) {
        if (data[i]['Id'] === nameelements[camposDetalles[1]]) {
            for (var k = 1; k < camposDetalles.length; k++) {
                if (camposDetalles[k] !== "Tabla" && !camposDetalles[k].includes("_ID")) {
                    listaDetalles[nametableDetalle][i][camposDetalles[k].charAt(0).toUpperCase() + camposDetalles[k].slice(1)] = nameelements[camposDetalles[k]];
                }
            }
            //        listaDetalles[nametableDetalle][i] = nameelements;
            if (listaDetallesNuevos[nametableDetalle] !== undefined) {
                for (var j = 0; j < listaDetallesNuevos[nametableDetalle].length; j++) {
                    var valor = listaDetallesNuevos[nametableDetalle][j];
                    if (data[i]['Id'] === valor[camposDetalles[1]]) {
                        valor = nameelements;
                        listaDetallesNuevos[nametableDetalle][j] = valor;
                        entro = true;
                        break;
                    }
                }
                if (!entro) {
                    listaDetallesNuevos[nametableDetalle][listaDetallesNuevos[nametableDetalle].length] = nameelements;
                }
            } else {
                arrayDetalles2[arrayDetalles2.length] = nameelements;
                listaDetallesNuevos[nametableDetalle] = arrayDetalles2;
            }
            // listaDetallesNuevos[nametableDetalle] = arrayDetalles2;


            break;
        }
    }
    idDetalle = undefined;
    ocultarformacapture(false, true, false);
    createPagination(listaDetalles[nametableDetalle].length, nametableDetalle, true);
    llenartablaDetalle(listaDetalles[nametableDetalle], nametableDetalle, 0);
    activarSelect = true;
}

function deleteDetalles() {
    var arreglo = [];
    var nameelements = getnamesDetalles(nametableDetalle);
    if (listaDetallesEliminar[nametableDetalle] !== undefined) {

        arreglo[arreglo.length] = nameelements;
    } else {

        arreglo[arreglo.length] = nameelements;
    }


    if (typeof (arreglo[0]['id']) === 'number') {
        listaDetallesEliminar[nametableDetalle] = arreglo;
    }

    for (var i = 0; i < listaDetalles[nametableDetalle].length; i++) {
        if (listaDetalles[nametableDetalle][i][camposDetalles[1].charAt(0).toUpperCase() + camposDetalles[1].slice(1)] === nameelements[camposDetalles[1]]) {
            listaDetalles[nametableDetalle].splice(i, 1);
            break;
        }
    }
    idDetalle = undefined;
    // llenartablaDetalle(listaDetalles[nametableDetalle], nametableDetalle, 0);
}

function updateDetallesgen() {
    inModeDetalle = "u";
    var conte = document.getElementById('panelDetalle');
    var element = conte.getElementsByTagName("Input");
    for (var i = 0; i < element.length; i++) {
        if (element[i].getAttribute('persist') === camposDetalles[1]) {
            element[i].disabled = true;
            element[i].focus();
            break;
        }
    }
}

function toDeleteDetallegen() {
    inModeDetalle = "d";
    var conte = document.getElementById('panelDetalle');
    var element = conte.getElementsByTagName("Input");
    for (var i = 0; i < element.length; i++) {
        if (element[i].getAttribute('persist') === camposDetalles[1]) {
            element[i].disabled = true;
            element[i].focus();
            break;
        }
    }

}

function searchDeatalles(clave, tabla) {
    var data = listaDetalles[tabla];
    var conte = document.getElementById('panelDetalle');
    var element = conte.querySelectorAll("Input,select");
    for (var i = 0; i < data.length; i++) {
        var valueID = data[i]['Id'] === undefined ? data[i]['id'] : data[i]['Id'];
        if (valueID === clave || valueID === parseInt(clave)) {
            idDetalle = valueID;
            for (var k = 1; k < camposDetalles.length; k++) {
                if (element[k - 1].getAttribute('persist') === camposDetalles[k] && element[k - 1].tagName !== "TABLE") {
                    var texto = element[k - 1].getAttribute('persist').charAt(0).toUpperCase() + element[k - 1].getAttribute('persist').slice(1);
                    if (data[i][texto]) {
                        element[k - 1].value = data[i][texto];
                    } else if (data[i][texto.toLowerCase()]) {
                        element[k - 1].value = data[i][texto.toLowerCase()];
                    }



                }

            }

            if (inModeDetalle === "d") {
                var answer = confirm("¿Quieres eliminar este Registro?")
                if (answer) {
                    deleteDetalles();
                    ocultarformacapture(false, true, false);
                    createPagination(listaDetalles[nametableDetalle].length, nametableDetalle, true);
                    llenartablaDetalle(listaDetalles[tabla], tabla, 0);
                }
                else {
                    //clearObjetosgen();
                }
            }

            if (typeof deshabilitarComponentes === 'function') {
                deshabilitarComponentes()
            }

        }
    }

}

function selcionPaginaDetalles(inicial, table) {
    var divant = document.getElementById(startDetalles + table);
    divant.style.background = "";
    if (inicial === 0) {
        startDetalles = parseInt(inicial);
        endDetalles = totalByPage;
    } else {
        startDetalles = parseInt(inicial);
        endDetalles = startDetalles + totalByPage;
    }
    var divsig = document.getElementById(startDetalles + table);
    divsig.style.background = "#ccc";
    // var  tabla = nametable + 'Select';
    //$('#' + tabla).find("tr:gt(0)").remove();
    llenartablaDetalle(listaDetalles, table);
}

//Funciones para el catalogo de movimientos nomina
function searchTipoCorrida() {
    var tabla;
    var id
    var contenedor = document.getElementById('capture');
    if (tipoComponentes === 1) {
        var element = contenedor.querySelectorAll("select");
        for (var i = 0; i < campos.length - 1; i++) {
            if (element[i].className === "mainPanelContentComponents" && element[i].getAttribute('persist') === campos[i]) {
                if (element[i].tagName === "SELECT") {
                    if (element[i].getAttribute('persist') === "concepNomDefi_ID") {
                        tabla = element[i].getAttribute('table');
                        conceptoAbajo = false;
                        break;
                    }
                }
            }
        }
        if (conceptoAbajo) {
            var contenedor = document.getElementById('CaptureDetalle');
            var element = contenedor.querySelectorAll("select");
            for (var i = 0; i < camposcapturaDetalles.length; i++) {
                if (element[i].className === "mainPanelContentComponents" && element[i].getAttribute('persist') === camposcapturaDetalles[i + 1]) {
                    if (element[i].tagName === "SELECT") {
                        if (element[i].getAttribute('persist') === "concepNomDefi_ID") {
                            tabla = element[i].getAttribute('table');
                            element[i].setAttribute('onchange', "crearComponentesParametrosconcepabajo()");
                            break;
                        }
                    }
                }
            }
        }
        id = $("select[persist='" + "tipoCorrida_ID" + "']")[0].value;
    } else if (tipoComponentes === 2) {
        var element = contenedor.querySelectorAll("input");
        for (var i = 0; i < campos.length; i++) {
            if ((element[i].getAttribute('persist') && (element[i].getAttribute('type') === "hidden" && !element[i].getAttribute('role')))) {
                if (element[i].getAttribute('persist') === "concepNomDefi_ID") {
                    tabla = element[i].getAttribute('table');
                    conceptoAbajo = false;
                    break;
                }
            }
        }
        id = $("input[persist='" + "tipoCorrida_ID" + "']")[0].value;
    }

    if (id !== "") {
        var obj = {};
        obj['Tabla'] = tabla;
        obj['id'] = id;
        var url = route + "/api/SearchTipoCorrida";
        var dataToPost = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
        if (Mensaje.resultado != null) {
            resultado = Mensaje.resultado;
            if (tipoComponentes === 1) {
                var elemen = $("select[persist='" + "concepNomDefi_ID" + "']");
                if (resultado.length > 0) {
                    for (var k = 0; k < elemen.length; k++) {
                        removeOptions(elemen[k]);
                        $(elemen[k]).append($("<option></option>")
                            .attr("value", "")
                            .text(""));
                        for (var i = 0; i < resultado.length; i++) {
                            $(elemen[k]).append($("<option></option>")
                                .attr("value", resultado[i]['id'])
                                .text(resultado[i]['descripcion']));
                        }
                    }
                } else {
                    for (var k = 0; k < elemen.length; k++) {
                        removeOptions(elemen[k]);
                    }
                }
            } else if (tipoComponentes === 2) {
                var elemen = $("input[persist='" + "concepNomDefi_ID" + "']");
                for (var i = 0; i < elemen.length; i++) {
                    var padre = elemen[i].parentNode;
                    var abuelo = padre.parentNode;
                    $('#' + abuelo.id).dxSelectBox({
                        dataSource: resultado,
                        valueExpr: "id",
                        displayExpr: "descripcion",
                        valueChangeEvent: 'id',
                        searchEnabled: true
                    });
                }
            }
        }
    }
}

function SearchPerNominaXTnYTc() {
    var claveNomina;
    var claveCorrida;
    if (tipoComponentes === 1) {
        claveNomina = $("select[persist='" + "tipoNomina_ID" + "']")[0].value;
        claveCorrida = $("select[persist='" + "tipoCorrida_ID" + "']")[0].value;
    } else if (tipoComponentes === 2) {
        claveNomina = $("input[persist='" + "tipoNomina_ID" + "']")[0].value;
        claveCorrida = $("input[persist='" + "tipoCorrida_ID" + "']")[0].value;
    }

    if (id !== "") {
        var obj = {};
        obj['Anio'] = "2019";
        obj['ClaveNomina'] = claveNomina;
        obj['ClaveCorrida'] = claveCorrida;

        var url = route + "/api/SearchPerNominaXTnYTc";
        var dataToPost = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
        if (Mensaje.resultado != null) {
            resultado = Mensaje.resultado;
            if (tipoComponentes === 1) {
                var elemen = $("select[persist='" + "periodosNomina_ID" + "']");
                if (resultado.length > 0) {
                    for (var k = 0; k < elemen.length; k++) {
                        removeOptions(elemen[k]);
                        $(elemen[k]).append($("<option></option>")
                            .attr("value", "")
                            .text(""));
                        for (var i = 0; i < resultado.length; i++) {
                            $(elemen[k]).append($("<option></option>")
                                .attr("value", resultado[i]['id'])
                                .text(resultado[i]['descripcion']));
                        }
                    }
                } else {
                    for (var k = 0; k < elemen.length; k++) {
                        removeOptions(elemen[k]);
                    }
                }
            } else if (tipoComponentes === 2) {
                var elemen = $("input[persist='" + "periodosNomina_ID" + "']");
                for (var i = 0; i < elemen.length; i++) {
                    var padre = elemen[i].parentNode;
                    var abuelo = padre.parentNode;
                    $('#' + abuelo.id).dxSelectBox({
                        dataSource: resultado,
                        valueExpr: "id",
                        displayExpr: "descripcion",
                        valueChangeEvent: 'id',
                        searchEnabled: true
                    });
                }
            }
        }
    }
}

function removeOptions(selectbox) {
    for (var i = selectbox.options.length - 1; i >= 0; i--) {
        selectbox.options.remove(i)
    }
}

function ConcepNomiDefiPorClave() {
    var resultado;
    var clave = $("select[persist='" + "concepNomDefi_ID" + "']")[0].value;
    var claveCorrida = $("select[persist='" + "tipoCorrida_ID" + "']")[0].value;
    var obj = {};
    if (clave !== "") {
        obj['Clave'] = clave;
        obj['ClaveCorrida'] = claveCorrida;
        var url = route + "/api/ConcepNomiDefiPorClave";
        var dataToPost = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
        if (Mensaje.resultado != null) {
            resultado = Mensaje.resultado;
        }
        return resultado;
    }
}

function createTableMovNomConcep() {
    if (!conceptoAbajo) {
        var table = $("table[persist='" + "MovNomConcep" + "']")[0]
        var rowCount = table.rows;
        var cols = rowCount[0].cells;
        var campostable = new Array();
        var parametros = ConcepNomiDefiPorClave();

        //var parametros = resultado['paraConcepDeNom'];
        addparametrosConcep(parametros);
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].innerText !== "Eliminar" && cols[i].innerText !== "Editar") {
                //    if (cols[i].innerText === "empleado_ID") {
                //      campostable[campostable.length] = "empleado";
                //    campostable[campostable.length] = "nombre";
                // } else if (cols[i].innerText === "empleado" || cols[i].innerText === "nombre") {
                if (cols[i].getAttribute('fieldsource')) {
                    campostable[campostable.length] = cols[i].innerText;
                }

                //}

            }
        }
        if (parametros.length > 0) {
            for (var i = 0; i < 3; i++) {
                if (i < parametros.length) {
                    campostable[campostable.length] = parametros[i]['descripcion'];
                }

            }
        }
        campostable[campostable.length] = 'Editar';
        campostable[campostable.length] = 'Eliminar';
        var hilera = document.createElement("tr");
        var hilera2 = document.createElement("tr");
        for (var j = 0; j < campostable.length; j++) {
            var th = document.createElement("th");
            var th2 = document.createElement("th");
            var textoth = document.createTextNode(campostable[j]);
            for (var i = 0; i < cols.length; i++) {
                if (cols[i].innerText === campostable[j]) {
                    if (cols[i].getAttribute('persist')) {
                        th.setAttribute('persist', cols[i].getAttribute('persist'));
                    }
                }
            }
            var textoth2 = document.createTextNode("");
            th.appendChild(textoth);
            th2.appendChild(textoth2);
            hilera.appendChild(th);
            // hilera2.appendChild(th2);
        }

        table.deleteRow(0);
        table.appendChild(hilera);
        // table.appendChild(hilera2);

        console.log(campostable);
    }

}

function crearComponentesParametrosconcepabajo() {
    var con = document.getElementById('ContenedorBtnTableDetalle');
    var parametros = ConcepNomiDefiPorClave();
    //con.parentNode.insertBefore(createButtonContinuar(configCap.origenDeDatos.nombre), con);
    var divCont;
    if (document.getElementById("ContPara")) {
        divCont = document.getElementById("ContPara");
        while (divCont.firstChild) {
            divCont.removeChild(divCont.firstChild);
        }
    } else {
        divCont = document.getElementById("ContPara");
        divCont.id = "ContPara";
        divCont.style.width = "100%";
        divCont.style.maxWidth = "100%";
        divCont.className = "mainPanelDivGroup";
    }

    for (var i = 0; i < parametros.length; i++) {
        var div = document.createElement("DIV");
        div.className = "mainPanelDivGroup";
        div.style.width = "100%";
        div.style.maxWidth = "30%";
        var label = document.createElement("LABEL");
        label.id = parametros[i]['id'] + parametros[i]['descripcion'];
        label.innerText = parametros[i]['descripcion'];
        div.appendChild(label);
        var cajaText = document.createElement("INPUT");
        cajaText.className = "mainPanelContentComponents";
        if (parametros[i]['tipo'] === "INTEGER") {
            cajaText.type = "text";

        } else if (parametros[i]['tipo'] === "STRING") {
            cajaText.type = "text";
        }
        cajaText.id = parametros[i]['descripcion'] + parametros[i]['id'];
        cajaText.style.width = "100%";
        cajaText.setAttribute('persist', parametros[i]['descripcion']);
        cajaText.setAttribute('isparam', 'true');
        cajaText.setAttribute('source', parametros[i]['id']);
        div.appendChild(cajaText);
        divCont.appendChild(div);
        // con.parentNode.insertBefore(div, con);
    }
    con.parentNode.insertBefore(divCont, con);
    // createTableMovNomConcepDeta(parametrosconcep);


}

//--------Metodos para las pantallas masivas --------//
var inicio = 0;
var totalreg = 5;
var final = totalreg;
var totalPaginas = 0;
function getnamecaptureDetalle(tabla) {
    var nameselements = new Array();
    var valueelement = new Array();
    var nameselementsParam = new Array();
    var valueelementParam = new Array();
    camposparamIsAbajo = new Array();
    var contenedor = document.getElementById('CaptureDetalle');
    var element = contenedor.querySelectorAll("Input,select");
    var count = element.length;
    var cont = 0;
    for (var i = 1; i <= count; i++) {
        if (element[i - 1].className === "mainPanelContentComponents" || ((element[i - 1].getAttribute('persist') && (element[i - 1].getAttribute('type') === "hidden" || element[i - 1].getAttribute('role') === "textbox")))) {

            if (element[i - 1].getAttribute('isparam') === "true") {
                if (movNomConcepParamAux.length > 0) {
                    if (movNomConcepParamAux[cont]['paraConcepDeNom_ID'] && movNomConcepParamAux[cont]['movNomConcep_ID']) {
                        movNomConcepParamAux[cont]['valor'] = valueelementParam[valueelementParam.length] = element[i - 1].value;
                    } else {
                        nameselementsParam[nameselementsParam.length] = 'id';
                        nameselementsParam[nameselementsParam.length] = element[i - 1].getAttribute('persist');
                        valueelementParam[valueelementParam.length] = element[i - 1].getAttribute('source');
                        valueelementParam[valueelementParam.length] = element[i - 1].value;
                        if (conceptoAbajo) {
                            camposparamIsAbajo[camposparamIsAbajo.length] = element[i - 1].getAttribute('persist');
                        }
                    }
                    cont++;
                } else {
                    nameselementsParam[nameselementsParam.length] = 'id';
                    nameselementsParam[nameselementsParam.length] = element[i - 1].getAttribute('persist');
                    valueelementParam[valueelementParam.length] = element[i - 1].getAttribute('source');
                    valueelementParam[valueelementParam.length] = element[i - 1].value;
                    if (conceptoAbajo) {
                        camposparamIsAbajo[camposparamIsAbajo.length] = element[i - 1].getAttribute('persist');
                    }
                }
            } else {
                nameselements[i] = element[i - 1].getAttribute('persist');
                valueelement[i] = element[i - 1].value;
            }

        }
    }
    if (tabla !== undefined) {
        nameselements[0] = tabla;
        if (tabla === "MovNomConcep") {
            if (Object.keys(movnomConcepAux).length > 0) {
                nameselements[nameselements.length] = "razonesSociales_ID";
                valueelement[valueelement.length] = movnomConcepAux["razonesSociales_ID"];
                nameselements[nameselements.length] = "numMovParticion";
                valueelement[valueelement.length] = movnomConcepAux["numMovParticion"];
                nameselements[nameselements.length] = "ordenId";
                valueelement[valueelement.length] = movnomConcepAux["ordenId"];
                nameselements[nameselements.length] = "tipoPantalla";
                valueelement[valueelement.length] = movnomConcepAux["tipoPantalla"];
                nameselements[nameselements.length] = "uso";
                valueelement[valueelement.length] = movnomConcepAux["uso"];
                nameselements[nameselements.length] = "numero";
                valueelement[valueelement.length] = movnomConcepAux["numero"];

            } else {
                nameselements[nameselements.length] = "razonesSociales_ID";
                valueelement[valueelement.length] = razonSocial.toString();
                nameselements[nameselements.length] = "numMovParticion";
                valueelement[valueelement.length] = numParticion.toString();
                nameselements[nameselements.length] = "ordenId";
                valueelement[valueelement.length] = ordenid.toString();
                nameselements[nameselements.length] = "tipoPantalla";
                valueelement[valueelement.length] = tipoPantalla.toString();
                nameselements[nameselements.length] = "uso";
                valueelement[valueelement.length] = uso.toString();
                if (maxNumero.length === 1) {
                    maxNumero[maxNumero.length] = getnumeroMaxMovNomConcep();
                }
                var maximo = Math.max.apply(null, maxNumero);
                maxNumero[maxNumero.length] = maximo + 1;
                nameselements[nameselements.length] = "numero";
                valueelement[valueelement.length] = (maximo + 1).toString();
            }
        }
    }
    camposcapturaDetalles = nameselements;
    var cont2 = 0;
    for (var h = 0; h < nameselementsParam.length; h++) {
        if (nameselementsParam[h] !== 'id') {
            camposcaptDetParam[cont2] = nameselementsParam[h];
            cont2++;
        }
    }
    var obj = {};
    var objParam = new Array();
    var objparm = {};
    var cont = 0;
    if (nameselementsParam.length > 0) {
        count = count - nameselementsParam.length;
    }
    for (var g = 0; g < nameselementsParam.length; g++) {
        cont++;

        objparm[nameselementsParam[g]] = valueelementParam[g];

        if ((cont / 2) === 1) {
            objParam[objParam.length] = objparm;
            objparm = {};
            cont = 0;
        }

    }
    if (tabla !== undefined) {
        obj["Tabla"] = tabla;
    }
    if (idDetalle != 0 && idDetalle !== undefined) {
        obj["id"] = idDetalle;
    }
    for (var h = 1; h < nameselements.length; h++) {

        obj[nameselements[h]] = valueelement[h];
    }
    if (objParam.length > 0) {
        obj['movNomConceParam'] = objParam;
    } else if (movNomConcepParamAux.length > 0) {
        obj['movNomConceParam'] = movNomConcepParamAux;
    }

    return obj;

}

function agregar() {
    var obj = getnamecaptureDetalle(nametable);
    listaDetalleMasiva[listaDetalleMasiva.length] = obj;
    listasNuevosXMasivas[listasNuevosXMasivas.length] = obj;
    var tbl = document.getElementById(nametable);
    var tr = document.createElement('tr');
    var sizeColumns = tbl.rows[0].cells;
    var conta = 0;
    for (var i = 0; i < sizeColumns.length; i++) {
        var td = document.createElement('td');
        if (obj[sizeColumns[i].innerText.toString()]) {
            td.appendChild(document.createTextNode(obj[sizeColumns[i].innerText.toString()]));
        } else if (obj['movNomConceParam']) {
            var para = obj['movNomConceParam']

            var campotabla = sizeColumns[i].innerText.toString();
            if (campotabla.includes("Valor")) {
                if (conta < para.length) {
                    td.appendChild(document.createTextNode(para[i - 1][camposparamIsAbajo[conta]]));
                    conta++;
                }
            } else {
                td.appendChild(document.createTextNode(para[i - 1][sizeColumns[i].innerText.toString()]));
            }

        }
        tr.appendChild(td);
    }

    tbl.appendChild(tr);
}

function getnamesGlobales() {
    var nameselements = new Array();
    var valueelement = new Array();
    var contenedor = document.getElementById('capture');
    var element = contenedor.querySelectorAll("Input,select");
    var count = element.length;
    for (var i = 1; i <= count; i++) {
        if (element[i - 1].className === "mainPanelContentComponents") {
            nameselements[i] = element[i - 1].getAttribute('persist');
            valueelement[i] = element[i - 1].value;
        }
    }
    camposglobales = nameselements;
    var obj = {};
    if (idDetalle != 0 && idDetalle !== undefined) {
        obj["id"] = idDetalle;
    }
    for (var h = 1; h <= count; h++) {

        obj[nameselements[h]] = valueelement[h];
    }
    return obj;
}

function agregarTablaGlobal() {
    if (actActualizar === false) {
        if (listaDetalleMasiva !== undefined) {
            if (listaGlobalMasiva.length === 0) {
                listaGlobalMasiva = listaDetalleMasiva;
            } else {
                for (var i = 0; i < listaDetalleMasiva.length; i++) {
                    listaGlobalMasiva[listaGlobalMasiva.length] = listaDetalleMasiva[i];
                }

            }
        }
    } else {
        var obj = getnamecaptureDetalle(nametable);
        for (var i = 0; i < listaGlobalMasiva.length; i++) {
            if (listaGlobalMasiva[i]['clave'] === obj['clave']) {
                actActualizar = false;
                listasModificXMasivas[listasModificXMasivas.length] = obj;
                listaGlobalMasiva[i] = obj;
                break;
            }
        }

    }
    if (inicio <= listaGlobalMasiva.length) {
        if (final > listaGlobalMasiva.length) {
            final = listaGlobalMasiva.length;
        } else {
            if (final === 0) {
                final = totalreg;
            }
        }
        var table = nametable + "Detalle";
        $('#' + table).find("tr:gt(0)").remove();
        var tbl = document.getElementById(table);

        for (var j = inicio; j < final; j++) {
            var value;
            var campo;
            var tr = document.createElement('tr');
            var sizeColumns = tbl.rows[0].cells;
            var conta = 0;
            var campospara = new Array();
            for (var k = 0; k < sizeColumns.length; k++) {
                if (sizeColumns[k].innerText !== "Editar" && sizeColumns[k].innerText !== "Eliminar") {
                    if (k === 0) {
                        campo = sizeColumns[k].innerText.toString();
                        value = listaGlobalMasiva[j][sizeColumns[k].innerText.toString()];
                        tr.id = value.toString();
                    }
                    var td = document.createElement('td');
                    if (listaGlobalMasiva[j][sizeColumns[k].innerText.toString()]) {
                        td.appendChild(document.createTextNode(listaGlobalMasiva[j][sizeColumns[k].innerText.toString()]));
                    } else if (listaGlobalMasiva[j]['movNomConceParam']) {
                        if (listaGlobalMasiva[j]['id']) {
                            var param = listaGlobalMasiva[j]['movNomConceParam'];
                            if (param.length > 0) {
                                if (param[k - 1]['valor']) {
                                    td.appendChild(document.createTextNode(param[k - 1]['valor']));
                                } else {
                                    var campotabla = sizeColumns[k].innerText.toString();
                                    if (campotabla.includes("valor")) {
                                        if (conta < param.length) {
                                            if (conta === 0) {
                                                for (var h = 0; h < param.length; h++) {
                                                    for (var key in param[h]) {
                                                        if (key.toString() !== "id") {
                                                            campospara[campospara.length] = key;
                                                        }
                                                    }
                                                }

                                            }
                                            td.appendChild(document.createTextNode(param[k - 1][campospara[conta]]));
                                            conta++;
                                        }
                                    } else {
                                        td.appendChild(document.createTextNode(param[k - 1][sizeColumns[k].innerText.toString()]));
                                    }
                                }
                            }
                        } else {
                            var param = listaGlobalMasiva[j]['movNomConceParam'];
                            if (param.length > 0) {
                                var campotabla = sizeColumns[k].innerText.toString();
                                if (campotabla.includes("Valor")) {
                                    if (conta < param.length) {
                                        if (conta === 0) {
                                            for (var h = 0; h < param.length; h++) {
                                                for (var key in param[h]) {
                                                    if (key.toString() !== "id") {
                                                        campospara[campospara.length] = key;
                                                    }
                                                }
                                            }

                                        }
                                        td.appendChild(document.createTextNode(param[k - 1][campospara[conta]]));
                                        conta++;
                                    }
                                } else {
                                    td.appendChild(document.createTextNode(param[k - 1][sizeColumns[k].innerText.toString()]));
                                }
                            }
                        }
                    }
                } else if (sizeColumns[k].innerText !== "Editar") {
                    td = document.createElement('td');
                    var a = document.createElement('a');
                    var linkText = document.createTextNode("Editar");
                    a.appendChild(linkText);
                    a.href = "javascript:UpdateMasiva('" + value + "'" + ",'" + campo.toString() + "');";
                    td.appendChild(a);
                } else if (sizeColumns[k].innerText !== "Eliminar") {

                    td = document.createElement('td');
                    var a = document.createElement('a');
                    var linkText = document.createTextNode("Eliminar");
                    a.appendChild(linkText);
                    a.href = "javascript:DeleteMasiva('" + value + "'" + ",'" + campo.toString() + "');";
                    td.appendChild(a);
                }
                tr.appendChild(td);
            }
            tbl.appendChild(tr);
        }
    }
    listaDetalleMasiva = new Array();
    limpiarDetalleMasiva();
    ocultarformacapture(true, false, false, false);
}

function limpiarDetalleMasiva() {
    var camposg = getnamecaptureDetalle(nametable);
    var conte = document.getElementById('CaptureDetalle');
    var element = conte.querySelectorAll("Input,select,table");
    for (var i = 0; i < element.length; i++) {
        if (element[i].tagName !== "TABLE") {
            if (element[i].getAttribute('persist') === camposcapturaDetalles[i + 1]) {
                element[i].value = "";
                element[i].disabled = false;
            }
        } else {
            $('#' + camposcapturaDetalles[0]).find("tr:gt(0)").remove();

        }
    }
    if (document.getElementById('ContPara')) {
        var conte = document.getElementById('ContPara');
        while (conte.firstChild) {
            conte.removeChild(conte.firstChild);
        }
    }
    actActualizar = false;
    idDetalle = undefined;
}

function SaveMasiva() {
    if (listaMovPartidos.length > 0) {
        for (var i = 0; i < listaMovPartidos.length; i++) {
            for (var j = 0; j < listasModificXMasivas.length; j++) {
                if (listasModificXMasivas[j]['id']) {
                    if (listaMovPartidos[i]['IdMovPartido'] === listasModificXMasivas[j]['id']) {
                        var obj = {};
                        obj['id'] = listaMovPartidos[i]['id'];
                        obj['razonesSociales_ID'] = listaMovPartidos[i]['razonesSociales_ID'];
                        obj['numMovParticion'] = listaMovPartidos[i]['numMovParticion'];
                        obj['ordenId'] = listaMovPartidos[i]['ordenId'];
                        obj['tipoPantalla'] = listaMovPartidos[i]['tipoPantalla'];
                        obj['uso'] = listaMovPartidos[i]['uso'];
                        obj['numero'] = listaMovPartidos[i]['numero'];
                        obj['movNomConceParam'] = listaMovPartidos[i]['movNomConceParam'];
                        obj['tipoCorrida_ID'] = listaMovPartidos[i]['tipoCorrida_ID'];
                        obj['concepNomDefi_ID'] = listaMovPartidos[i]['concepNomDefi_ID'];
                        obj['tipoNomina_ID'] = listaMovPartidos[i]['tipoNomina_ID'];
                        obj['periodosNomina_ID'] = listaMovPartidos[i]['periodosNomina_ID'];
                        obj['centroDeCosto_ID'] = listaMovPartidos[i]['centroDeCosto_ID'];
                        obj['empleado_ID'] = listaMovPartidos[i]['empleado_ID'];
                        listasEliminadosXMasivas[listasEliminadosXMasivas.length] = obj;
                        break;
                    }
                }
            }
            for (var k = 0; k < listasEliminadosXMasivas.length; k++) {
                if (listasEliminadosXMasivas[k]['id']) {
                    if (listaMovPartidos[i]['IdMovPartido'] === listasEliminadosXMasivas[k]['id']) {
                        var obj = {};
                        obj['id'] = listaMovPartidos[i]['id'];
                        obj['razonesSociales_ID'] = listaMovPartidos[i]['razonesSociales_ID'];
                        obj['numMovParticion'] = listaMovPartidos[i]['numMovParticion'];
                        obj['ordenId'] = listaMovPartidos[i]['ordenId'];
                        obj['tipoPantalla'] = listaMovPartidos[i]['tipoPantalla'];
                        obj['uso'] = listaMovPartidos[i]['uso'];
                        obj['numero'] = listaMovPartidos[i]['numero'];
                        obj['movNomConceParam'] = listaMovPartidos[i]['movNomConceParam'];
                        obj['tipoCorrida_ID'] = listaMovPartidos[i]['tipoCorrida_ID'];
                        obj['concepNomDefi_ID'] = listaMovPartidos[i]['concepNomDefi_ID'];
                        obj['tipoNomina_ID'] = listaMovPartidos[i]['tipoNomina_ID'];
                        obj['periodosNomina_ID'] = listaMovPartidos[i]['periodosNomina_ID'];
                        obj['centroDeCosto_ID'] = listaMovPartidos[i]['centroDeCosto_ID'];
                        obj['empleado_ID'] = listaMovPartidos[i]['empleado_ID'];
                        listasEliminadosXMasivas[listasEliminadosXMasivas.length] = obj;
                        //listasEliminadosXMasivas[listasEliminadosXMasivas.length] = listaMovPartidos[i];
                        break;
                    }
                }
            }
        }
    }
    var obj = {};
    obj['Tabla'] = nametable;
    obj['agregar'] = listasNuevosXMasivas;
    obj['eliminar'] = listasEliminadosXMasivas;
    obj['modificar'] = listasModificXMasivas;

    var url = route + "/api/SaveMasiva";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado !== null) {
        alert("Datos guardados exitosamente");
        limpiar();
        var table = nametable + "Detalle";
        $('#' + table).find("tr:gt(0)").remove();
    }
}

function UpdateMasiva(clave, campo) {
    // ocultarformacapture(false, false, false, true);
    var divcapturaDetalles = document.getElementById('CaptureDetalle');
    //var element = divcapturaDetalles.querySelectorAll("Input,select");
    //console.log(listaGlobalMasiva[0]);
    //console.log(listaGlobalMasiva[0][campo]);
    // $("#ddlViewBy").val('value1');
    //   var obj = getnamecaptureDetalle();
    //alert($("#ddlViewBy [value='ggg']").text());
    var cont = 0;
    for (var i = 0; i < listaGlobalMasiva.length; i++) {
        if (listaGlobalMasiva[i][campo].toString() === clave) {
            if (nametable === "MovNomConcep") {
                if (conceptoAbajo) {
                    addparametrosConcep(listaGlobalMasiva[i]['movNomConceParam']);
                }
                movnomConcepAux = listaGlobalMasiva[i];

            }
            ocultarformacapture(false, false, false, true);
            var obj = getnamecaptureDetalle();
            var element = divcapturaDetalles.querySelectorAll("Input,select");
            if (listaGlobalMasiva[i]['id']) {
                idDetalle = listaGlobalMasiva[i]['id'];
                for (var j = 0; j < element.length; j++) {
                    if (element[j].getAttribute('persist') === camposcapturaDetalles[j + 1]) {
                        element[j].value = listaGlobalMasiva[i][camposcapturaDetalles[j + 1]];
                        if (element[j].getAttribute('iskey')) {
                            element[j].disabled = true;
                        }

                    } else if (element[j].getAttribute('persist') == camposcaptDetParam[cont]) {
                        var param = listaGlobalMasiva[i]['movNomConceParam'];
                        //  if (cont == 1) {
                        movNomConcepParamAux = param;
                        element[j].value = param[cont]['valor'];
                        //} else {
                        //  element[j].value = param[cont - 2][camposcaptDetParam[cont]];
                        //}
                        cont++;
                    }
                }
            } else {
                for (var j = 0; j < element.length; j++) {
                    if (element[j].getAttribute('persist') === camposcapturaDetalles[j + 1]) {
                        // if (camposcapturaDetalles[j + 1] === "empleado_ID") {
                        //   element[j].value = listaGlobalMasiva[i][camposcapturaDetalles[j + 1]] + "-" +
                        //     listaGlobalMasiva[i]['empleado'] + "-" + listaGlobalMasiva[i]['nombre'];
                        //} else {
                        //  if (listaGlobalMasiva[i]['movNomConceParam']) {
                        //    var param = 
                        // } else {
                        element[j].value = listaGlobalMasiva[i][camposcapturaDetalles[j + 1]];
                        // }
                        //}
                        if (element[j].getAttribute('iskey')) {
                            element[j].disabled = true;
                        }

                    } else if (element[j].getAttribute('persist') == camposcaptDetParam[cont]) {

                        var param = listaGlobalMasiva[i]['movNomConceParam'];
                        //  if (cont == 1) {
                        movNomConcepParamAux = param;
                        element[j].value = param[cont][camposcaptDetParam[cont]];
                        //} else {
                        //  element[j].value = param[cont - 2][camposcaptDetParam[cont]];
                        //}
                        cont++;
                    }
                }

            }
            actActualizar = true;
            break;
        }

    }
}

function DeleteMasiva(clave, campo) {
    ocultarformacapture(false, false, false, true);
    var divcapturaDetalles = document.getElementById('CaptureDetalle');
    var element = divcapturaDetalles.querySelectorAll("Input,select");
    var obj = getnamecaptureDetalle();
    var cont = 0;
    for (var i = 0; i < listaGlobalMasiva.length; i++) {
        if (listaGlobalMasiva[i][campo].toString() === clave) {
            if (listaGlobalMasiva[i]['id']) {
                idDetalle = listaGlobalMasiva[i]['id'];
                for (var j = 0; j < element.length; j++) {
                    if (element[j].getAttribute('persist') === camposcapturaDetalles[j + 1]) {
                        element[j].value = listaGlobalMasiva[i][camposcapturaDetalles[j + 1]];
                        if (element[j].getAttribute('iskey')) {
                            element[j].disabled = true;
                        }

                    } else if (element[j].getAttribute('persist') == camposcaptDetParam[cont]) {
                        var param = listaGlobalMasiva[i]['movNomConceParam'];
                        element[j].value = param[cont]['valor'];
                        cont++;
                    }
                }
                var answer = confirm("¿Quieres eliminar esta configuración?")
                if (answer) {
                    var obj = getnamecaptureDetalle();

                    for (var i = 0; i < listaGlobalMasiva.length; i++) {
                        if (listaGlobalMasiva[i][campo].toString() === obj[campo]) {

                            listasEliminadosXMasivas[listasEliminadosXMasivas.length] = obj;
                            listaGlobalMasiva.splice(i, 1);
                            actEliminar = true;
                            break;
                        }
                    }
                    ocultarformacapture(true, false, false, false);
                    agregarTablaGlobal();
                }
                else {
                    ocultarformacapture(true, false, false, false);
                }
            } else {
                for (var j = 0; j < element.length; j++) {
                    if (element[j].getAttribute('persist') === camposcapturaDetalles[j + 1]) {
                        element[j].value = listaGlobalMasiva[i][camposcapturaDetalles[j + 1]];
                        if (element[j].getAttribute('iskey')) {
                            element[j].disabled = true;
                        }

                    } else if (element[j].getAttribute('persist') == camposcaptDetParam[cont]) {
                        var param = listaGlobalMasiva[i]['movNomConceParam'];
                        element[j].value = param[cont][camposcaptDetParam[cont]];
                        cont++;
                    }
                }
                var answer = confirm("¿Quieres eliminar esta configuración?")
                if (answer) {
                    var obj = getnamecaptureDetalle();

                    for (var i = 0; i < listaGlobalMasiva.length; i++) {
                        if (listaGlobalMasiva[i][campo] === obj[campo]) {
                            listaGlobalMasiva.splice(i, 1);
                            actEliminar = true;
                            break;
                        }
                    }
                    ocultarformacapture(true, false, false, false);
                    agregarTablaGlobal();
                }
                else {
                    ocultarformacapture(true, false, false, false);
                }
            }
            break;
        }
    }
}

function buscaPorFiltrosMasiva(tabla) {
    listaGlobalMasiva = new Array();
    var camposVacios = false;
    var obj = getnamesGlobales();
    for (var key in obj) {
        if (obj[key] === "") {
            camposVacios = true;
            break;
        }
    }
    var res;
    if (camposVacios === false) {
        obj['Tabla'] = tabla;
        obj['operador'] = "=";
        obj['inicio'] = 0;
        obj['fin'] = 0;

        var url = route + "api/SearchGenericFiltros";
        var dataToPost = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
        if (Mensaje.resultado !== null) {
            for (var i = 0; i < Mensaje.resultado.length; i++) {
                if (nametable === "MovNomConcep") {
                    listaGlobalMasiva[listaGlobalMasiva.length] = Mensaje.resultado[i];
                } else {

                    listaGlobalMasiva[listaGlobalMasiva.length] = Mensaje.resultado[i][0];
                }
            }
            if (nametable === "MovNomConcep") {
                listaGlobalMasiva = sumarMovPartidos(listaGlobalMasiva);
            }
            totalPaginas = listaGlobalMasiva.length / totalreg;
            if (totalPaginas - Math.floor(totalPaginas) == 0) {
                totalPaginas = totalPaginas;
            } else {
                totalPaginas = Math.floor(totalPaginas) + 1;
            }
            crearpaginasMasiva();
            agregarTablaGlobal();
        }
    } else {
        alert("LLene todos los campos");
        var table = tabla + "Detalle";
        $('#' + table).find("tr:gt(0)").remove();
    }
    return res;
}

function getnumeroMaxMovNomConcep() {
    var numero;
    var claveNomina = $("select[persist='" + "tipoNomina_ID" + "']")[0].value;
    var claveperiodo = $("select[persist='" + "periodosNomina_ID" + "']")[0].value;
    var obj = {};
    //obj['Anio'] = "2017";
    obj['ClaveNomina'] = claveNomina;
    obj['claveperiodo'] = claveperiodo;
    var url = route + "/api/getNumeroMaxMovNomConcep";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado != null) {
        numero = Mensaje.resultado;
    }
    return numero;
}

function sumarMovPartidos(data) {
    var suma;
    var dataMov = new Array();
    for (var i = 0; i < data.length; i++) {
        if (data[i]['numMovParticion'] === 2) {
            var movParamPrin = data[i - 1]['movNomConceParam'];
            var movParamSec = data[i]['movNomConceParam'];
            if (movParamPrin !== undefined) {
                for (var j = 0; j < movParamPrin.length; j++) {
                    suma = parseFloat(movParamPrin[j]['valor']) + parseFloat(movParamSec[j]['valor']);
                    movParamPrin[j]['valor'] = suma.toString();
                    ;
                    movParamSec[j]['valor'] = undefined;
                }
            }
            data[i]['IdMovPartido'] = data[i - 1]['id'];
            listaMovPartidos[listaMovPartidos.length] = data[i];
            data.splice(i, 1);
        }
    }
    return dataMov = data;
}

function nextPag() {
    var divant = document.getElementById(inicio);
    divant.style.background = "";
    inicio = inicio + totalreg;


    if (inicio >= listaGlobalMasiva.length) {
        var divant = document.getElementById(inicio - totalreg);
        divant.style.background = "#ccc";
        inicio = inicio - totalreg;


    } else {
        var divsig = document.getElementById(inicio);
        divsig.style.background = "#ccc";
        final = inicio + totalreg;
        agregarTablaGlobal();
    }

}

function previousPag() {
    var divant = document.getElementById(inicio);
    divant.style.background = "";
    inicio = inicio - totalreg;
    var inside = false;
    if (inicio < 0) {
        inicio = 0;
        var divant = document.getElementById(inicio);
        divant.style.background = "#ccc";
        inside = true;
    } else {
        var divsig = document.getElementById(inicio);
        divsig.style.background = "#ccc";
        final = inicio + totalreg;
    }
    if (final < 0) {
        final = totalreg;
        inside = true;
    }

    if (!inside) {
        agregarTablaGlobal();
    }
}

function crearpaginasMasiva() {
    var inicioPagina = 0;
    inicio = 0;
    final = totalreg;
    if (document.getElementById('contenedorPaginas')) {
        document.getElementById('contenedorPaginas').remove();
    }
    var divContedor = document.getElementById('Contenedoraseg');
    var div = document.createElement('DIV');
    div.id = "contenedorPaginas";
    div.style.display = "inline-block";
    for (var i = 0; i < totalPaginas; i++) {
        var div2 = document.createElement('DIV');
        div2.id = inicioPagina;
        div2.style.display = "inline-block";
        if (i == 0) {
            div2.style.background = "#ccc";
        }
        var aher = document.createElement('a');
        aher.innerHTML = i + 1;
        aher.style.display = "inline-block";
        aher.style.marginLeft = "10px";
        aher.style.marginRight = "10px";
        aher.href = "javascript:selcionPagina(" + inicioPagina + ");";
        div2.appendChild(aher);
        div.appendChild(div2);
        inicioPagina = inicioPagina + totalreg;
    }
    divContedor.parentNode.insertBefore(div, divContedor);
}

function selcionPagina(inicial) {
    var divant = document.getElementById(inicio);
    divant.style.background = "";
    if (inicial === 0) {
        inicio = inicial;
        final = totalreg;
    } else {
        inicio = inicial;
        final = inicial + totalreg;
    }
    var divsig = document.getElementById(inicio);
    divsig.style.background = "#ccc";
    agregarTablaGlobal();
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    // var ampm = hours >= 12 ? 'pm' : 'am';
    //hours = hours % 12;
    //hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes;
    return strTime;
}

function formateDate(date) {
    var hoy = date;
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();

    dd = addZero(dd);
    mm = addZero(mm);
    //console.log(yyyy + '-' + mm + '-' + dd);
    return yyyy + '-' + mm + '-' + dd;
}

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

function exiteClave(tabla) {
    var obj = {};
    obj["Tabla"] = tabla[1];
    obj["Campo"] = tabla[2];
    obj["Valor"] = tabla[0];
    var url = route + "/api/existeClave";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado !== null) {
        if (Mensaje.resultado === true) {
            var answer = confirm("¿Ya exite un registro con esa clave quieres editar?");
            if (answer) {
                searchPorClave(obj);
            } else {
                txtvalor.select();
                setTimeout(function () { txtvalor.focus(); txtvalor.select(); }, 1);
            }
        } else {
            setTimeout(function () { txtvalor.nextElementSibling.focus(); }, 1);
        }
    }
}

function searchPorClave(obj) {
    var detalle = false;
    var url = route + "/api/SearchGenericClave";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);

    if (Mensaje.resultado !== null) {
        var conte;
        if (detalle) {
            conte = document.getElementById('panelDetalle');
        } else {
            conte = document.getElementById('capture');
        }
        var element;
        if (tipoComponentes === 1) {
            element = conte.querySelectorAll("Input,select,table");
        } else if (tipoComponentes === 2) {

            element = conte.querySelectorAll("Input,select,div[persistSearch]");;
        }

        if (detalle) {
            idDetalle = Mensaje.resultado['id'];


        } else {
            id = Mensaje.resultado['id'];
            for (var i = 0; i < campos.length; i++) {
                if ((element[i].getAttribute('persist') === campos[i] && element[i].tagName !== "TABLE") || (element[i].getAttribute('type') === "hidden" || element[i].getAttribute('role') === "textbox")) {
                    if (element[i].getAttribute("type") === "checkbox") {
                        if (Mensaje.resultado[campos[i]] === true) {
                            element[i].checked = true;
                        } else {
                            element[i].checked = false;
                        }
                    } else if (element[i].getAttribute('type') === "hidden") {
                        var padre = element[i].parentNode;
                        if (padre.getAttribute('role') !== 'checkbox') {
                            var abuelo = padre.parentNode;
                            if (abuelo.getAttribute('persist') === campos[i]) {
                                $('#' + abuelo.id).dxSelectBox("instance").option("value", Mensaje.resultado[campos[i]]);
                            }
                        } else {

                            $('#' + padre.id).dxCheckBox("instance").option("value", Mensaje.resultado[campos[i]]);
                        }
                    } else if (element[i].getAttribute('type') === "time") {
                        var date = new Date(Mensaje.resultado[campos[i]]);
                        console.log(date.getHours() + ":" + date.getMinutes());
                        element[i].value = formatAMPM(date);
                    } else {
                        element[i].value = Mensaje.resultado[campos[i]];
                    }
                } else if (element[i].tagName === "TABLE" && campos[i] === element[i].getAttribute('persist')) {

                    var filters = new Array();
                    var cmpWhere = nametable.toLowerCase() + ".id";
                    var cmpVal = id;
                    filters.push(new Array(cmpWhere, cmpVal));
                    filterValues = filters;
                    var typeDetail = element[i].getAttribute("id");
                    buquedaRangos(0, nametable, typeDetail);
                    filterValues = null;


                } else if (element[i].tagName === "DIV" && campos[i] === element[i].getAttribute('persistSearch')) {
                    var filters = new Array();
                    var cmpWhere = nametable.toLowerCase() + ".id";
                    var cmpVal = id;
                    filters.push(new Array(cmpWhere, cmpVal));
                    filterValues = filters;
                    var typeDetail = element[i].getAttribute("id");
                    buquedaRangos(0, nametable, typeDetail);
                    filterValues = null;
                }
            }
        }
    }
}
///BP

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

function validarRequeridos() {
    var exito = true;
    var componentes = document.querySelectorAll('select,input');
    for (var i = 0; i < componentes.length; i++) {

        if (componentes[i].getAttribute('required')) {
            if (componentes[i].value == "") {
                exito = false;
                alert('El campo ' + componentes[i].getAttribute('persist') + ' es obligatorio');
                break;
            }
        }
    }

    return exito;
}

function acortarDescripcion(obj) {

    var compo = $('input[persist=' + obj[1] + ']')[0];
    var valor = obj[0].substring(0, parseInt(compo.getAttribute('maxlength')));
    compo.value = valor;

}

function hola(obj) {
    alert("Tiene dos metodos este componente en el mismo evento");
}
function setEditObjectGeneric(data) {

    var origenSel = cargarArchivoProCol(data[0]);
    nameCmp = data[2];
    var table;
    if (data[0] !== "Empleados") {
        table = data[0];
    } else if (data[0] === "Empleados") {
        table = "PlazasPorEmpleadosMov";
    }

    nameCols = origenSel.nameColsObl;
    campostbl = origenSel.camposObl;//Quit ID;
    camposObtener = origenSel.camposObtenerObl;
    var subEntities = origenSel.subEntitiesObl; //Unnecesary
    camposMostrar = origenSel.camposMostrar;
    var tituloSel = idiomaSelecionado.messageFormatter(origenSel.tituloSel)();
    var tamañoSel = origenSel.tamSel;
    var preFilters = {};
    if (origenSel.camposWhere.length > 0) {
        for (var i = 0; i < origenSel.camposWhere.length; i++) {
            var valor;
            var datos = origenSel.camposWhere[i];
            if (datos.valorCampo !== "") {
                if (datos.valorCampo === "RazonSocial") {
                    var razon = JSON.parse(localStorage.getItem("RazonSocial"));
                    valor = razon.id;
                    preFilters[datos.campo] = valor;
                } else {
                    if (document.querySelector("[table=" + datos.valorCampo + "]")) {
                        valor = document.querySelector("[table=" + datos.valorCampo + "]").getAttribute("value");
                        if (typeof valor === "undefined") {
                            valor = document.querySelector("[persist=" + dato + "]").value;
                        }
                        if (typeof valor !== "undefined" && valor !== "" && valor !== null) {
                            preFilters[datos.campo] = valor;
                        }
                    }
                }
            } else if (datos.valorVariable !== "") {
                valor = parametrosGlobales[datos.valorVariable];
                preFilters[datos.campo] = valor;
            } else if (datos.valorDefault !== "") {
                preFilters[datos.campo] = datos.valorDefault;
            }

        }
    }

    return buildParametersEditModal(nameCmp, table, nameCols, campostbl,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? null : optionals);
}

function cargarArchivoProCol(origen) {

    var origenSel;
    var url = '/Resources/PropiedadesColumnas.json';
    var Mensaje = new Object();
    Mensaje.error = "";
    Mensaje.noError = "";
    Mensaje.resultado = Common.sendLocalFileRequestJson('GET', url, undefined, undefined, false);
    if (Mensaje.resultado !== null) {
        var archivo = Mensaje.resultado;
        origenSel = archivo[origen];

        //archivo = unescape(encodeURIComponent(archivo));
        //console.log(origenSel);
    }

    return origenSel;
}

function generarMascara(valores) {
    var cmp = valores[valores.length - 1];
    nombreTablaBDs = cmp.getAttribute("origendedatos");
    var valor = construyeMascara(cmp.getAttribute("persist"), cmp.value);
    cmp.value = valor;
    console.log(valor);
}