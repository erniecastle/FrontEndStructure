/*!
 * Copyright 2018 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */

var route = "";
var inMode = "";
var id = null;
var nameScreens = new Object();
var totalByPage = 10;
var start = 0, end = totalByPage;
var listaCamposTCMasiva = new Object();
//var listaCamposDetalles;

jQuery(document).ready(function () {
    //call origen datos
    inMode = "a";
    document.getElementsByClassName("typeModes")[0].textContent = "Agregar";
    showDataTable("1");
    getMaxValue();
    addListeners();
    getOrigenesDatos();
    serachProcesoorigen();
    var procesoDiv = document.getElementById('PrcocesoDiv');
    procesoDiv.style.display = "none";
    //  pageMe({ pagerSelector: '#myPager', showPrevNext: true, hidePageNumbers: false, perPage: 3 });


});
function pageMe(opts) {
    var $this = $('#tableSelector'),
            defaults = {
                perPage: 7,
                showPrevNext: false,
                hidePageNumbers: false
            },
    settings = $.extend(defaults, opts);


    var listElement = $this.find('tbody');
    var perPage = settings.perPage;
    var children = listElement.children();
    var pager = $('.pager');

    if (typeof settings.childSelector !== "undefined") {
        children = listElement.find(settings.childSelector);
    }

    if (typeof settings.pagerSelector !== "undefined") {
        pager = $(settings.pagerSelector);
    }

    var numItems = children.length;
    var numPages = Math.ceil(numItems / perPage);

    pager.data("curr", 0);

    if (settings.showPrevNext) {
        $('<li style="display:inline"><a href="#" class="prev_link" style="display:inline-block;padding:8px;font-size:20px;text-decoration:none"><<</a></li>').appendTo(pager);
    }

    var curr = 0;
    while (numPages > curr && (settings.hidePageNumbers == false)) {
        if (curr === 0) {
            $('<li style="display:inline"><a href="#" class="page_link" style="display:inline-block;padding:8px;font-size:20px;text-decoration:none">' + (curr + 1) + '</a></li>').appendTo(pager);
        } else {
            $('<li style="display:inline"><a href="#" class="page_link" style="display:inline-block;padding:8px;font-size:20px">' + (curr + 1) + '</a></li>').appendTo(pager);

        }
        curr++;
    }

    if (settings.showPrevNext) {
        $('<li style="display:inline"><a href="#" class="next_link" style="display:inline-block;padding:8px;font-size:20px;text-decoration:none">>></a></li>').appendTo(pager);
    }

    pager.find('.page_link:first').addClass('active');
    pager.find('.prev_link').hide();
    if (numPages <= 1) {
        pager.find('.next_link').hide();
    }
    pager.children().eq(1).addClass("active");

    children.hide();
    children.slice(0, perPage).show();

    pager.find('li .page_link').click(function () {
        var clickedPage = $(this).html().valueOf() - 1;
        goTo(clickedPage, perPage);
        return false;
    });
    pager.find('li .prev_link').click(function () {
        //previous();
        return false;
    });
    pager.find('li .next_link').click(function () {
        // next();
        ////var compUL = document.getElementById('myPager');
        ////var listaLI = compUL.querySelectorAll('li');
        ////for (var i = 0; i < listaLI.length; i++) {
        ////    console.log(listaLI[i].className);
        ////    if (listaLI[i].className === 'active') {
        ////        var hiper = listaLI[i].querySelector('a');
        ////        hiper.getAttribute('style');
        ////        console.log(hiper);
        ////        break;
        ////    }
        ////}
        return false;
    });

    //function previous() {
    //    var goToPage = parseInt(pager.data("curr")) - 1;
    //    goTo(goToPage);
    //}

    //function next() {
    //    goToPage = parseInt(pager.data("curr")) + 1;
    //    goTo(goToPage);
    //}
    function goTo(page) {
        var startAt = page * perPage,
                endOn = startAt + perPage;

        children.css('display', 'none').slice(startAt, endOn).show();

        if (page >= 1) {
            pager.find('.prev_link').show();
        }
        else {
            pager.find('.prev_link').hide();
        }

        if (page < (numPages - 1)) {
            pager.find('.next_link').show();
        }
        else {
            pager.find('.next_link').hide();
        }

        pager.data("curr", page);
        pager.children().removeClass("active");
        pager.children().eq(page + 1).addClass("active");


    }
}

function addListeners() {
    $("#txtClave").keypress(function (e) {
        if (e.which === 13) {
            searchByKey();
            e.preventDefault();
        }
    });

    $('input[type="checkbox"]').on('change', function () {
        $('input[name="' + this.name + '"]').not(this).prop('checked', false);
    });

    $('#chkSeleccion').change(function () {
        if ($(this).is(':checked')) {
            document.getElementById('btnFormaSelect').disabled = false;
            document.getElementById('btnFormaBusqueda').disabled = true;
        } else {
            document.getElementById('btnFormaSelect').disabled = true;
        }
    });

    $('#chkBusqueda').change(function () {
        if ($(this).is(':checked')) {
            document.getElementById('btnFormaBusqueda').disabled = false;
            document.getElementById('btnFormaSelect').disabled = true;
        } else {
            document.getElementById('btnFormaBusqueda').disabled = true;
        }
    });

}

function getMaxValue() {
    var url = route + "/api/ConfiguracionCapturas/GetMaxValue";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado !== null) {
        var res = parseInt(Mensaje.resultado) + 1;
        document.getElementById("txtClave").value = res;
    }
}

function verifyRepeatDetail(info) {
    var numberOfRows = document.getElementById("mainBodyTable").rows.length;
    var orDat = "";
    var go = true;
    for (i = 0; i < numberOfRows; i++) {
        orDat = document.getElementById("mainBodyTable").rows[i].cells[0].innerHTML;
        if (info === orDat) {
            go = false;
            break;
        }
    }
    return go;
}

function clearTable() {
    var rows = document.getElementById("mainTable").rows.length;
    var table = document.getElementById("mainTable");
    for (var i = rows - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    /* var emptyRow = '<td><a>--</a></td><td><a>--</a></td><td><a>--</a></td></tr>';
     var rows = document.getElementById("mainBodyTable").innerHTML = emptyRow;*/
}

function deleteScreenDesigner(origin) {
    deleteSessions(origin);
    $('#' + origin).remove();
}

function openDesigner(origin, nombreFuente) {//dos parametros
    unvisibleThisScreen();
    document.getElementById('stylesheet').href = 'css/style.css';
    // Param 1 = Forma de captura, param2 = nombre unico pantalla,nombrefuente= es el nombre de la fuente de datos 
    var typeDynamic = new Array();// [1, origin, nombreFuente];
    if (document.getElementById('cbxCaptura').value === "5") {
        var capturaTipo = document.getElementById('cbxCaptura').value;
        typeDynamic[0] = 1;
        typeDynamic[1] = origin;
        typeDynamic[2] = nombreFuente;
        typeDynamic[3] = JSON.stringify(listaCamposTCMasiva);
        typeDynamic[4] = capturaTipo;
        //typeDynamic = [1,origin, nombreFuente,JSON.stringify(listaCamposTCMasiva), capturaTipo];
    } else if (document.getElementById('cbxCaptura').value === "2") {
        typeDynamic = [1, origin, nombreFuente];
    } else {
        typeDynamic = [1, origin, nombreFuente];
    }
    sessionStorage.setItem('mode', JSON.stringify(typeDynamic));
    addSessions(origin);
    $("#designer").load("dynamic.html");
    //$("#designer").then("dynamic.html");
}

function addSessions(sessionToAdd) {
    if (sessionStorage.getItem(sessionToAdd)) {
    } else {
        sessionStorage.setItem(sessionToAdd, sessionToAdd);
    }
}

function deleteSessions(sessionToDelete) {
    if (sessionStorage.getItem(sessionToDelete)) {
        sessionStorage.removeItem(sessionToDelete);
    }
}

function addDetail(listDetalle, listDeleteDetalle) {


    var tbl = document.getElementById("mainBodyTable");

    var renglones = tbl.rows

    if (listDeleteDetalle !== undefined) {
        for (var j = 1; j < renglones.length; j++) {
            cells = renglones[j].cells;
            for (var i = 0; i < listDeleteDetalle.length; i++) {

                if (cells[0].id === listDeleteDetalle[i]) {
                    $('#' + renglones[j].id).remove();
                    deleteScreenDesigner(renglones[j].id);
                }

            }
        }
    }
    for (var i = 0; i < listDetalle.length; i++) {
        var value = listDetalle[i]['id'];
        var text = listDetalle[i]['origen'];
        /// if (value && e.selectedIndex > 0) {
        if (verifyRepeatDetail(text)) {
            if (document.getElementById("empty")) {
                $("#empty").remove();
            }
            var tbl = document.getElementById("mainBodyTable");
            //OD
            var tr = document.createElement('tr');
            tr.id = value.toString();
            var td = document.createElement('td');
            td.id = value;
            td.appendChild(document.createTextNode(text));
            tr.appendChild(td);
            //DC
            td = document.createElement('td');
            var a = document.createElement('a');
            var linkText = document.createTextNode("Agregar");
            a.appendChild(linkText);
            a.title = "Agregar Forma de captura de " + text;
            a.href = "javascript:openDesigner('" + value + ',' + value + "|" + text + "');";
            td.appendChild(a);
            tr.appendChild(td);
            //EC
            td = document.createElement('td');
            var a = document.createElement('a');
            var linkText = document.createTextNode("No Contiene Diseño");
            a.appendChild(linkText);
            a.title = "No Contiene Diseño de " + text;
            //a.href = "javascript:deleteScreenDesigner('" + value + "');";
            td.appendChild(a);
            tr.appendChild(td);
            tbl.appendChild(tr);
        }
        //else {
        //    alert("Este detalle ya existe");
        //}
    }

    //} else {
    //    alert("Seleccione un detalle de origen");
    //}
}

function createTableDetails(data) {
    var tbl = document.getElementById("mainBodyTable");
    for (var i = 0; i < data.length; i++) {
        var value = data[i]['id'];
        var info = data[i]['origenDeDatosNombre'];
        var idOrigen = data[i]['origenDatos'];
        var tr = document.createElement('tr');
        tr.id = value.toString();
        var dato = idOrigen + '|' + info;
        var typeAcces = [1, dato];
        sessionStorage.setItem(typeAcces[1], data[i]['fileFormaCaptura']);
        for (var j = 0; j < 3; j++) {//puedes quitar
            if (j === 0) {
                var td = document.createElement('td');
                td.id = idOrigen;
                td.appendChild(document.createTextNode(info));
            } else if (j === 1) {
                var td = document.createElement('td');
                var a = document.createElement('a');
                var linkText;
                if (data[i]['fileFormaCaptura'] !== "null" /*&& data[i]['fileFormaCaptura'].toString().length > 258*/) {
                    linkText = document.createTextNode("Editar");
                    a.title = "Editar Forma de captura de " + info;
                } else {
                    linkText = document.createTextNode("Agregar");
                    a.title = "Agregar Forma de captura de " + info;
                }
                // var linkText = document.createTextNode("Forma de captura");
                a.appendChild(linkText);
                //a.title = "Forma de captura de " + info;
                a.href = "javascript:openDesigner('" + idOrigen + "|" + info + "');";
                // a.href = "javascript:openDesigner('"+ idOrigen + "|" + info + "');";
                td.appendChild(a);
            } else if (j === 2) {
                td = document.createElement('td');
                var a = document.createElement('a');
                var linkText;
                if (data[i]['fileFormaCaptura'] !== "null" /*&& data[i]['fileFormaCaptura'].toString().length > 258*/) {
                    linkText = document.createTextNode("Contiene Diseño");
                    a.title = "Contiene Diseño de " + info;
                } else {
                    linkText = document.createTextNode("No Contiene Diseño");
                    a.title = "No Contiene Diseño de " + info;
                }

                a.appendChild(linkText);
                //a.title = "Eliminar diseño de captura de " + info;
                //a.href = "javascript:deleteScreenDesigner('" + value + "');";

                td.appendChild(a);
            }
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }
}

function unvisibleThisScreen() {
    document.getElementById("container").style.display = "none";
}

function formaCaptura(mode) {
    if (mode === 1) {
        var combo = document.getElementById('cbxOrigenDatos').value;
        if (combo === "") {
            alert('selecione un origen de datos');
        } else {
            openDesigner('fileCapture', null);
        }
    } else if (mode === 2) {
        var combo = document.getElementById('cbxOrigenDatos').value;
        if (combo === "") {
            alert('selecione un origen de datos');
        } else {
            openDesigner('fileCaptureSelect', null);
        }

    } else if (mode === 3) {
        var combo = document.getElementById('cbxOrigenDatos').value;
        if (combo === "") {
            alert('selecione un origen de datos');
        } else {
            openDesigner('fileCaptureSearch', null);
        }
    } else if (mode === 4) {
        var combo = document.getElementById('cbxOrigenDatos').value;
        if (combo === "") {
            alert('selecione un origen de datos');
        } else {
            openDesigner('fileCaptureDetalle', null);
        }
    } else if (mode === 5) {
        var combo = document.getElementById('cbxProcesoOrigenDatos').value;
        if (combo === "") {
            alert('selecione un proceso de origen');
        } else {
            openDesigner("fileCapturaProceso", null);
        }
    }
    //    //console.log("que onda  " + data[0][0]);
    //    //fuent= data[0][0];   
}

/*--------------------------------*/

function searchByKey() {
    var clave = document.getElementById("txtClave").value;
    var url
    if (document.getElementById('cbxCapturaSelect').value === "1") {
        url = route + "/api/ConfiguracionCapturas/SearchByKey";
    } else if (document.getElementById('cbxCapturaSelect').value === "2") {
        url = route + "/api/ConfiguracionCapturasProces/SearchByKey";
    }
    clearObjetos();
    //var url = route + "/api/ConfiguracionCapturas/SearchByKey";
    var dataToPost = JSON.stringify(clave);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("Este registro no existe");
    } else {
        id = Mensaje.resultado.id;
        document.getElementById("txtClave").value = Mensaje.resultado.clave;
        document.getElementById("txtNombre").value = Mensaje.resultado.nombre;
        document.getElementById('cbxCaptura').value = Mensaje.resultado.tipoDeCaptura;
        if (Mensaje.resultado.tipoDeCaptura === 1) {
            document.getElementById('cbxOrigenDatos').value = Mensaje.resultado.origenDeDatos.id;
            document.getElementById("chkSeleccion").checked = Mensaje.resultado.selectRegistros;
            document.getElementById("chkBusqueda").checked = Mensaje.resultado.busquedaRegistros;

            if (Mensaje.resultado.selectRegistros) {
                document.getElementById('btnFormaSelect').disabled = false;
            }
            if (Mensaje.resultado.busquedaRegistros) {
                document.getElementById('btnFormaBusqueda').disabled = false;
            }
        }
        if (Mensaje.resultado.tipoDeCaptura === 5) {
            var fileFormaCaptura = Mensaje.resultado.fileForma1;
            sessionStorage.setItem('fileCapture', fileFormaCaptura);
            var fileFormaSeleccion = Mensaje.resultado.fileForma2;
            sessionStorage.setItem('fileCaptureDetalle', fileFormaSeleccion);
            var contedorRegis = document.getElementById('contCapturaRegis');
            contedorRegis.style.display = "none";
            var contedorBusque = document.getElementById('contCapturaBusqueda');
            contedorBusque.style.display = "none";
            var divbtnSelect = document.getElementById('divbtnFormaSelect');
            divbtnSelect.style.display = "none";
            var divbtnBusque = document.getElementById('divbtnFormaBusqueda');
            divbtnBusque.style.display = "none";

            //componentes a mostrar
            var divbtndetalle = document.getElementById('divbtnFormaCapturaDetalle');
            divbtndetalle.style.display = "block";
            var divCampos = document.getElementById('contedorCampos');
            divCampos.style.display = "block";
            addCamposGlobalesexistente(Mensaje.resultado.configuracion);
        } else if (Mensaje.resultado.tipoDeCaptura === 2) {
            document.getElementById('cbxProcesoOrigenDatos').value = Mensaje.resultado.procesoOrigen.id;
            var fileFormaCaptura = Mensaje.resultado.fileForma1;
            sessionStorage.setItem('fileCapturaProceso', fileFormaCaptura);
            var procesoDiv = document.getElementById('PrcocesoDiv');
            procesoDiv.style.display = "block";
            var divbtnProceso = document.getElementById('divbtnFormaCapturaProceso');
            divbtnProceso.style.display = "block";

            var contedorRegis = document.getElementById('contCapturaRegis');
            contedorRegis.style.display = "none";
            var contedorBusque = document.getElementById('contCapturaBusqueda');
            contedorBusque.style.display = "none";
            var divbtnSelect = document.getElementById('divbtnFormaSelect');
            divbtnSelect.style.display = "none";
            var divbtnBusque = document.getElementById('divbtnFormaBusqueda');
            divbtnBusque.style.display = "none";
            var divNorm = document.getElementById('NormalDiv');
            divNorm.style.display = "none";
            var divbtnFormaCaptura = document.getElementById('divbtnFormaCaptura');
            divbtnFormaCaptura.style.display = "none";
            var panelDivDetalle = document.getElementById('panelDivDetalle');
            panelDivDetalle.style.display = "none";
        } else {
            document.getElementById('cbxOrigenDatos').value = Mensaje.resultado.origenDeDatos.id;
            document.getElementById("chkSeleccion").checked = Mensaje.resultado.selectRegistros;
            document.getElementById("chkBusqueda").checked = Mensaje.resultado.busquedaRegistros;
            if (Mensaje.resultado.selectRegistros) {
                document.getElementById('btnFormaSelect').disabled = false;
            }
            if (Mensaje.resultado.busquedaRegistros) {
                document.getElementById('btnFormaBusqueda').disabled = false;
            }
            var fileFormaCaptura = Mensaje.resultado.fileForma1;
            sessionStorage.setItem('fileCapture', fileFormaCaptura);
            var fileFormaSeleccion = Mensaje.resultado.fileForma2;
            sessionStorage.setItem('fileCaptureSelect', fileFormaSeleccion);
            var fileFormaBusqueda = Mensaje.resultado.fileForma3;
            sessionStorage.setItem('fileCaptureSearch', fileFormaBusqueda);
            var detailsCapturas = Mensaje.resultado.detalleConfigCapturas;

            createTableDetails(detailsCapturas);
            getDetalle();
        }

        if (inMode === "d") {
            var answer = confirm("¿Quieres eliminar esta configuración?")
            if (answer) {
                var object = crearObjeto(Mensaje.resultado);
                deleteObject(object);
            }
            else {
                clearObjetos();
            }
        }
    }
}

function crearObjeto(object) {
    var entity = new Object();
    entity.id = object.id;
    entity.clave = object.clave;
    return entity;
}

function clearObjetos() {
    id = null;
    document.getElementById("txtClave").value = "";
    document.getElementById("txtNombre").value = "";
    $('#cbxCaptura').get(0).selectedIndex = 0;
    $('#cbxOrigenDatos').get(0).selectedIndex = 0;
    document.getElementById("chkSeleccion").checked = false;
    document.getElementById("chkBusqueda").checked = false;
    $("#mainTable").find("tr:gt(0)").remove();
    sessionStorage.clear();
}

function toSave() {
    var entity = new Object();
    if (id) {
        entity.id = id;
    }
    entity.clave = document.getElementById("txtClave").value;
    entity.nombre = document.getElementById("txtNombre").value;
    var tipoCap = document.getElementById("cbxCaptura");
    var valueCaptura = tipoCap.options[tipoCap.selectedIndex].value;
    entity.tipoDeCaptura = valueCaptura;
    if (valueCaptura !== "2") {
        var origDat = document.getElementById("cbxOrigenDatos");
        var valueOrDat = origDat.options[origDat.selectedIndex].value;
        entity.origenDeDatos_ID = valueOrDat;
        if ($('#chkSeleccion').is(":checked")) {
            entity.selectRegistros = true;
        }
        else {
            entity.selectRegistros = false;
        }

        if ($('#chkBusqueda').is(":checked")) {
            entity.busquedaRegistros = true;
        }
        else {
            entity.busquedaRegistros = false;
        }
    } else {

    }
    if (valueCaptura === "5") {//en la forma 1 se guarda la captura global y en la 2 el detalle esto es pra captura masiva
        entity.fileForma1 = sessionStorage.getItem("fileCapture");
        entity.fileForma2 = sessionStorage.getItem("fileCaptureDetalle");
        entity.configuracion = JSON.stringify(listaCamposTCMasiva);
        //entity.fileFormaBusqueda = sessionStorage.getItem("fileCaptureSearch");
    } else if (valueCaptura === "2") {
        entity.fileForma1 = sessionStorage.getItem("fileCapturaProceso");
        entity.procesoOrigen_ID = document.getElementById("cbxProcesoOrigenDatos").value;
        var Listaccion = new Array();;
        var contAcciones = document.getElementById('selectorAcciones');
        var input = contAcciones.querySelectorAll('input');
        for (var i = 0; i < input.length; i++) {
            if (input[i].checked) {
                var accion = {};
                accion.id = input[i].value;
                accion.activar = true;
                Listaccion[i] = accion;
            }
        }
        var objAcciones = {};
        objAcciones.Acciones = Listaccion;
        entity.configuracion = JSON.stringify(objAcciones);
    } else {//en la forma 1 se guarda la forma de captura, en la 2 el selctor y en la 3 el de busqueda esto para captura normal 
        if (sessionStorage.getItem("fileCapture")) {
            if (sessionStorage.getItem("fileCapture").length > 400) {
                entity.fileForma1 = sessionStorage.getItem("fileCapture");
            } else {
                entity.fileForma1 = "";
            }
        }
        if (sessionStorage.getItem("fileCaptureSelect")) {
            if (sessionStorage.getItem("fileCaptureSelect").length > 400) {
                entity.fileForma2 = sessionStorage.getItem("fileCaptureSelect");
            } else {
                entity.fileForma2 = "";
            }
        }
        if (sessionStorage.getItem("fileCaptureSearch")) {
            if (sessionStorage.getItem("fileCaptureSearch").length > 400) {
                entity.fileForma3 = sessionStorage.getItem("fileCaptureSearch");
            } else {
                entity.fileForma3 = "";
            }
        }
    }
    //Create - Details
    if (valueCaptura !== "2") {
        var table = document.getElementById('mainTable'),
                rows = table.rows, rowcount = rows.length, r,
                cells, c, cell;

        var detailsConfig = [];

        for (r = 1; r < rowcount; r++) {
            cells = rows[r].cells;
            cell = cells[0];
            var key = cell.id + "|" + cells[0].innerText;
            detailsConfig.push({
                id: rows[r].id, origenDatos_ID: cell.id, fileFormaCaptura: sessionStorage.getItem(key),
                configuracionCapturas_ID: id
            });
        }

        entity.detalleConfigCapturas = detailsConfig;
        toMakes = "/api/ConfiguracionCapturas/Save";
        if (inMode === "a") {
            toMakes = "/api/ConfiguracionCapturas/Save";
        } else if (inMode === "u") {
            toMakes = "/api/ConfiguracionCapturas/Update";
        }
    } else {
        toMakes = "/api/ConfiguracionCapturasProces/Save";
        if (inMode === "a") {
            toMakes = "/api/ConfiguracionCapturasProces/Save";
        } else {
            toMakes = "/api/ConfiguracionCapturasProces/Update";
        }

    }
    if (entity.nombre !== "") {
        //contentType: "application/json; charset=utf-8",
        //method: 'POST',
        var url = route + toMakes;
        var dataToPost = JSON.stringify(entity);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, true, false);
        if (Mensaje.resultado !== null) {
            if (inMode === "a") {
                alert("Datos guardados exitosamente");
                add();
            } else if (inMode === "u") {
                alert("Datos modificados exitosamente");
                update();
            }
            location.reload(true);
        } else {
            alert(Mensaje.error);
        }
    } else {
        alert("Ingrese un nombre para guardar");
        $("#txtNombre").focus();
    }
}

function deleteObject(entity) {
    var url;
    var tipoCap = document.getElementById("cbxCaptura");
    var valueCaptura = tipoCap.options[tipoCap.selectedIndex].value;
    if (valueCaptura === "1") {
        url = route + "/api/ConfiguracionCapturas/Delete";
    } else if (valueCaptura === "2") {
        url = route + "/api/ConfiguracionCapturasProces/Delete";
    }
    var dataToPost = JSON.stringify(entity);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, true, false);
    if (Mensaje.resultado !== null) {
        alert("Datos eliminados exitosamente");
        clearObjetos();
    } else {
        alert(Mensaje.error);
    }
}

function add() {
    inMode = "a";
    document.getElementsByClassName("typeModes")[0].textContent = "Agregar";
    document.getElementById('txtClave').disabled = true;
    clearObjetos();
    getMaxValue();
}

function update() {
    inMode = "u";
    document.getElementsByClassName("typeModes")[0].textContent = "Modificar";
    document.getElementById('txtClave').disabled = false;
    clearObjetos();
    document.getElementById("txtClave").focus();

}

function toDelete() {
    inMode = "d";
    document.getElementsByClassName("typeModes")[0].textContent = "Eliminar";
    document.getElementById('txtClave').disabled = false;
    clearObjetos();
    document.getElementById("txtClave").focus();
}

function toCancel() {

    location.reload(true);
}

function getOrigenesDatos() {
    var url = route + "/api/FormasCaptura/origenesDatos";
    var dataToPost = "{}";
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado !== null) {
        addorigenes(Mensaje.resultado);
    }
}

function addorigenes(data) {
    for (var i = 0; i < data.length; i++) {
        $('#cbxOrigenDatos').append('<option value=' + data[i]['id'] + '>' + data[i]['nombre'] + '</option>');
    }
}

function getDetalle() {
    var id = document.getElementById('cbxOrigenDatos').value;
    if (id) {
        var url = route + "/api/FormasCaptura/DetalleorigenesDatos";
        var dataToPost = JSON.stringify(id);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado === "") {
            $('#cbxDetalle').find('option').not(':first').remove();
        } else {
            addDetalle(Mensaje.resultado);
        }
    }
}

function addDetalle(data) {
    for (var i = 0; i < data.length; i++) {
        $('#cbxDetalle').append('<option value=' + data[i][0] + '>' + data[i][1] + '</option>');
    }
}

function showDataTable(value) {
    var nameselements = new Array();
    nameselements[0] = start;
    nameselements[1] = end;
    var url;
    if (value === "1") {
        url = route + "/api/ConfiguracionCapturas/GetPaging"
    } else {
        url = route + "/api/ConfiguracionCapturasProces/GetPaging";
    }
    var dataToPost = JSON.stringify(nameselements);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        start = 0;
        end = totalByPage;
    } else {
        $("#tableSelector").find("tr:gt(0)").remove();
        createTableRegisters(Mensaje.resultado);
    }
}

function previous() {
    start = start - totalByPage;
    end = totalByPage;
    var inside = false;
    var typeCapture = document.getElementById("cbxCapturaSelect").value;
    if (start < 0) {
        start = 0;
        inside = true;
    }
    if (end < 0) {
        end = totalByPage;
        inside = true;
    }

    if (!inside) {
        showDataTable(typeCapture);
    }

}

function next() {
    start = start + totalByPage;
    end = totalByPage;
    var typeCapture = document.getElementById("cbxCapturaSelect").value;
    showDataTable(typeCapture);
}


function crearPaginacion() {//Verificar si este metodo se usa
    var url = route + "/api/ConfiguracionCapturas/TotalRegistros";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        //start = (start - totalByPage);
        //end = (end - totalByPage);
    } else {
        //$("#tableSelector").find("tr:gt(0)").remove();
        //createTableRegisters(Mensaje.resultado);
    }
}

function createTableRegisters(data) {
    var tbl = document.getElementById("bodyTableSelector");
    // var body = document.createElement("tbody");
    var cont = 1;
    for (var i = 0; i < data.length; i++) {
        var value = data[i]['clave'];
        var tr = document.createElement('tr');
        //if (cont === 3) {
        //    tr.className = "success";
        //    cont = 1;
        //} else {
        //    cont++;
        //}

        tr.id = value.toString();
        var sizeColumns = 4;
        for (var j = 0; j < sizeColumns; j++) {// Value of columns
            if (j === 0) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]['clave']));
            } else if (j === 1) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]['nombre']));
            } else if (j === 2) {
                td = document.createElement('td');
                var a = document.createElement('a');
                var linkText = document.createTextNode("Editar");
                a.appendChild(linkText);
                a.href = "javascript:editObject('" + value + "');";
                td.appendChild(a);
            }
            else if (j === 3) {
                td = document.createElement('td');
                var a = document.createElement('a');
                var linkText = document.createTextNode("Eliminar");
                a.appendChild(linkText);
                a.href = "javascript:deleteObjectInTable('" + value + "');";
                td.appendChild(a);
            }
            tr.appendChild(td);
            // body.appendChild(tr);
        }
        tbl.appendChild(tr);
    }
}

function editObject(key) {
    update();
    document.getElementById('catalog').style.display = "block";
    document.getElementById('viewer').style.display = "none";
    document.getElementById("txtClave").value = key.toString();
    document.getElementById('txtClave').disabled = true;
    searchByKey();

}

function deleteObjectInTable(key) {
    toDelete();
    document.getElementById('catalog').style.display = "block";
    document.getElementById('viewer').style.display = "none";
    document.getElementById("txtClave").value = key.toString();
    searchByKey();
}

/*Things for testing*/
function toAddInTable() {
    add();
    document.getElementById('catalog').style.display = "block";
    document.getElementById('viewer').style.display = "none";
}

function cambiarstatus(origen, forma) {
    var table = document.getElementById('mainTable');
    var renglones = table.rows, rowcount = renglones.length, r,
            cells, c, cell, cell2;
    for (var r = 1; r < rowcount; r++) {
        cells = renglones[r].cells;
        if (cells[0].id === origen['id']) {

            cell = cells[2];
            cell2 = cells[1];
            cell2.getElementsByTagName('a');


            var a = cell2.getElementsByTagName('a');
            if (forma !== null /*&& forma.toString().length > 258*/) {
                a[0].title = "Editar Forma de captura de " + origen['origen'];
                a[0].innerText = "Editar";
                // console.log(cell2.getElementsByTagName('a'));
                cell.innerText = "Contiene diseño";
                cell.title = "Contiene diseño " + origen['origen'];
            } else {

                a[0].title = "Agregar Forma de captura de " + origen['origen'];
                a[0].innerText = "Agregar";
                // console.log(cell2.getElementsByTagName('a'));
                cell.innerText = "No Contiene diseño";
                cell.title = "Contiene diseño " + origen['origen'];
            }
        }
    }

}

function showPreviewGnral() {
    var idiv = document.createElement('DIV');
    idiv.id = 'ContenedorPrincipal';
    idiv.className = 'contenedor';
    idiv.style.maxWidth = "100%";
    idiv.style.width = "100%";
    var formaSelect = sessionStorage.getItem("fileCaptureSelect");

    var formaCapture = sessionStorage.getItem("fileCapture");

    var formaCaptureSearch = sessionStorage.getItem("fileCaptureSearch");

    if (formaSelect !== null && formaSelect.toString().length > 100) {
        var dataselect = JSON.parse(formaSelect);
        var infoSelect = dataselect.content[0];
        var idivSelct = document.createElement('DIV');
        idivSelct.id = 'Selector';
        idivSelct.className = 'contenedor';
        idivSelct.style.maxWidth = "100%";
        idivSelct.style.width = "100%";

        for (var i = 0; i < infoSelect.content.length; i++) {
            if (infoSelect.content[i].elemento === "IDIV") {
                // var buscar1 = true;
                var iDiv = createJsDivGlobal(infoSelect.content[i], undefined);
                idivSelct.appendChild(iDiv);
            }
        }
        idiv.appendChild(idivSelct);
    }

    if (formaCapture !== null && formaCapture.toString().length > 100) {
        var dataCapture = JSON.parse(formaCapture);
        var infoCapture = dataCapture.content[0];
        var idivcap = document.createElement('DIV');
        idivcap.id = 'capture';
        idivcap.className = 'contenedor';
        idivcap.style.maxWidth = "100%";
        idivcap.style.width = "100%";
        for (var i = 0; i < infoCapture.content.length; i++) {
            if (infoCapture.content[i].elemento === "IDIV") {
                //var buscar1 = true;
                var iDiv = createJsDivGlobal(infoCapture.content[i], undefined);
                var btnCancelar = createButtonCancelar(true, false, false);
                var btnBuscar = createButtonBuscar();
                iDiv.appendChild(btnBuscar);
                iDiv.appendChild(btnCancelar);
                idivcap.appendChild(iDiv);
            }
        }
        //var detalles = idivcap.getElementsByTagName('table');
        //var table = detalles[0];
        checarDetalles(idivcap);
        idiv.appendChild(idivcap);
    }
    //var formaCaptureSearch = sessionStorage.getItem("fileCaptureSearch");

    if (formaCaptureSearch !== null && formaCaptureSearch.toString().length > 100) {
        var dataCaptureSearch = JSON.parse(formaCaptureSearch);
        var infoCaptureSearch = dataCaptureSearch.content[0];
        var idivbuscar = document.createElement('DIV');
        idivbuscar.id = 'Buscar';
        idivbuscar.className = 'contenedor';
        idivbuscar.style.maxWidth = "100%";
        idivbuscar.style.width = "100%";
        for (var i = 0; i < infoCaptureSearch.content.length; i++) {
            if (infoCaptureSearch.content[i].elemento === "IDIV") {
                var buscar1 = 'Buscar';
                var iDiv = createJsDivGlobal(infoCaptureSearch.content[i], 'Buscar');
                var btnCancelar = createButtonCancelar(false, false, true);
                iDiv.appendChild(btnCancelar);
                idivbuscar.appendChild(iDiv);
            }
        }
        idiv.appendChild(idivbuscar);
    }
    var panelDetalle = document.createElement('DIV');
    panelDetalle.id = 'panelDetalle';
    panelDetalle.className = 'contenedor';
    panelDetalle.style.maxWidth = "100%";
    panelDetalle.style.width = "100%";
    idiv.appendChild(panelDetalle);
    var form = createFormGlobal(document.getElementById('cbxOrigenDatos').value);
    var initElement = idiv
    var clone = initElement.cloneNode(true);
    form.appendChild(clone);
    var json = mapDOM2(form, true);
    json = json.replace("Selected", "");
    sessionStorage.setItem('preview', json);
    var openCapture = "preview.html?capture=" + "preview";
    window.open(openCapture);
    sessionStorage.removeItem('preview');
}

/*Create file .json of screen*/
function mapDOM2(element, json) {
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
        element = docNode;//.firstChild;
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
                                }
                                //display
                                // console.log("NameProp: " + getPropertie[0] + " Valueprop: " + getPropertie[1]);
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
function checarDetalles(divContenedor) {
    var table = document.getElementById('mainTable');
    var renglones = table.rows, rowcount = renglones.length, r,
            cells, c, cell, cell2;
    var tabladetalle = divContenedor.getElementsByTagName('table');
    var i = 0;
    for (var r = 1; r < rowcount; r++) {
        cells = renglones[r].cells;
        while (i < tabladetalle.length) {
            if (tabladetalle[i].id === cells[0].innerHTML) {
                var contedorBtn = divContenedor.getElementsByClassName('btnTable' + tabladetalle[i].id);
                var btnAgregar = contedorBtn[0].getElementsByClassName('buttonAddUpTable');
                btnAgregar[0].setAttribute('onclick', "creardetalles(" + sessionStorage.getItem(renglones[r].id) + ")");
                i++;
                break;
            }
        }


    }
}
//estos metodos para los tipos de forma capturas(masiva)
function tipocaptura() {
    var tipocaptura = document.getElementById('cbxCaptura').value;
    if (tipocaptura === "1") {
        //componentes a mostrar
        var contedorRegis = document.getElementById('contCapturaRegis');
        contedorRegis.style.display = "block";
        var contedorBusque = document.getElementById('contCapturaBusqueda');
        contedorBusque.style.display = "block";
        var divbtnSelect = document.getElementById('divbtnFormaSelect');
        divbtnSelect.style.display = "block";
        var divbtnBusque = document.getElementById('divbtnFormaBusqueda');
        divbtnBusque.style.display = "block";
        var divNorm = document.getElementById('NormalDiv');
        divNorm.style.display = "block";
        var divbtnFormaCaptura = document.getElementById('divbtnFormaCaptura');
        divbtnFormaCaptura.style.display = "block";
        var panelDivDetalle = document.getElementById('panelDivDetalle');
        panelDivDetalle.style.display = "block";
        //componentes a ocultar

        var divbtndetalle = document.getElementById('divbtnFormaCapturaDetalle');
        divbtndetalle.style.display = "none";
        var divbtnProceso = document.getElementById('divbtnFormaCapturaProceso');
        divbtnProceso.style.display = "none";
        var divCampos = document.getElementById('contedorCampos');
        divCampos.style.display = "none";
        var procesoDiv = document.getElementById('PrcocesoDiv');
        procesoDiv.style.display = "none";
        var divAcciones = document.getElementById('contedorAcciones');
        divAcciones.style.display = "none";
        getMaxValue();
        removerAcciones();
    } else if (tipocaptura === "2") {
        var procesoDiv = document.getElementById('PrcocesoDiv');
        procesoDiv.style.display = "block";
        var divbtnProceso = document.getElementById('divbtnFormaCapturaProceso');
        divbtnProceso.style.display = "block";

        var contedorRegis = document.getElementById('contCapturaRegis');
        contedorRegis.style.display = "none";
        var contedorBusque = document.getElementById('contCapturaBusqueda');
        contedorBusque.style.display = "none";
        var divbtnSelect = document.getElementById('divbtnFormaSelect');
        divbtnSelect.style.display = "none";
        var divbtnBusque = document.getElementById('divbtnFormaBusqueda');
        divbtnBusque.style.display = "none";
        var divNorm = document.getElementById('NormalDiv');
        divNorm.style.display = "none";
        var divbtnFormaCaptura = document.getElementById('divbtnFormaCaptura');
        divbtnFormaCaptura.style.display = "none";
        var panelDivDetalle = document.getElementById('panelDivDetalle');
        panelDivDetalle.style.display = "none";
        var divAcciones = document.getElementById('contedorAcciones');
        divAcciones.style.display = "block";
        serachProcesoorigen();
        getMaxValueConfigProceso();
    } else if (tipocaptura === "3") {

        var divAcciones = document.getElementById('contedorAcciones');
        divAcciones.style.display = "none";
        var divCampos = document.getElementById('contedorCampos');
        divCampos.style.display = "none";
    } else if (tipocaptura === "4") {

        var divAcciones = document.getElementById('contedorAcciones');
        divAcciones.style.display = "none";
        var divCampos = document.getElementById('contedorCampos');
        divCampos.style.display = "none";
    } else if (tipocaptura === "5") {
        //componentes a ocultar
        var contedorRegis = document.getElementById('contCapturaRegis');
        contedorRegis.style.display = "none";
        var contedorBusque = document.getElementById('contCapturaBusqueda');
        contedorBusque.style.display = "none";
        var divbtnSelect = document.getElementById('divbtnFormaSelect');
        divbtnSelect.style.display = "none";
        var divbtnBusque = document.getElementById('divbtnFormaBusqueda');
        divbtnBusque.style.display = "none";
        var panelDetalle = document.getElementById('panelDivDetalle');
        panelDetalle.style.display = "none";
        //componentes a mostrar
        var divAcciones = document.getElementById('contedorAcciones');
        divAcciones.style.display = "none";
        var divbtndetalle = document.getElementById('divbtnFormaCapturaDetalle');
        divbtndetalle.style.display = "block";
        var divCampos = document.getElementById('contedorCampos');
        divCampos.style.display = "block";


    }
}
function addCamposGlobales(resultado) {
    var cont = document.getElementById('selectorCampos');
    var addcomp;
    for (var i = 0; i < resultado.length; i++) {
        if (resultado[i]['activarCaptura'] === true) {
            var obj = new Object();
            obj['idCampo'] = resultado[i]['id'];
            obj['campo'] = resultado[i]['campo'];
            obj['global'] = 0;
            obj['existeCap'] = false;
            obj['existeDet'] = false;
            listaCamposTCMasiva[resultado[i]['id']] = obj;
            addcomp = document.createElement('INPUT');
            addcomp.id = resultado[i]['id'];
            addcomp.type = "checkbox";
            addcomp.className = 'mainPanelContentComponents';
            addcomp.style.display = 'inline';
            addcomp.setAttribute('activarGlobal', resultado[i]['activarGlobal']);
            //addcomp.onchange = "addListaGlobales(this)";
            addcomp.setAttribute('onchange', "addListaGlobales(this)");
            addcomp.setAttribute('value', JSON.stringify(resultado[i]));
            var idiv2 = document.createElement('DIV');
            idiv2.style.width = "100%";
            idiv2.style.maxWidth = "100%";
            idiv2.appendChild(addcomp);
            var label = document.createElement('LABEL');
            label.id = 'LB' + resultado[i]['campo'];
            label.className = 'contentComp';
            label.style.display = 'inline';
            label.innerHTML = resultado[i]['campo'];
            idiv2.appendChild(label);
            cont.appendChild(idiv2);

        }
    }
    // cont.appendChild(addcomp);
}
function addCamposGlobalesexistente(resultado) {
    listaCamposTCMasiva = JSON.parse(resultado);
    var cont = document.getElementById('selectorCampos');
    var addcomp
    for (var key in listaCamposTCMasiva) {
        addcomp = document.createElement('INPUT');
        addcomp.id = key;
        addcomp.type = "checkbox";
        addcomp.className = 'mainPanelContentComponents';
        addcomp.style.display = 'inline';
        if (listaCamposTCMasiva[key]['global'] === 1) {
            addcomp.checked = true;
        }
        addcomp.setAttribute('activarGlobal', resultado[key]['activarGlobal']);
        //addcomp.onchange = "addListaGlobales(this)";
        addcomp.setAttribute('onchange', "addListaGlobales(this)");
        // addcomp.setAttribute('value', JSON.stringify(resultado[i]));
        var idiv2 = document.createElement('DIV');
        idiv2.style.width = "100%";
        idiv2.style.maxWidth = "100%";
        idiv2.appendChild(addcomp);
        var label = document.createElement('LABEL');
        label.id = 'LB' + listaCamposTCMasiva[key]['campo'];
        label.className = 'contentComp';
        label.style.display = 'inline';
        label.innerHTML = listaCamposTCMasiva[key]['campo'];
        idiv2.appendChild(label);
        cont.appendChild(idiv2);
    }
    // cont.appendChild(addcomp);
}
function searchcampoorigen() {
    var infoOrigin = new Object();
    var originData = document.getElementById('cbxOrigenDatos').value;
    infoOrigin.id = originData;
    if (document.getElementById('cbxCaptura').value === "5" && document.getElementById('cbxOrigenDatos').value !== "") {
        var url = route + "/api/FormasCaptura/CamposOrigenDatos";
        var dataToPost = JSON.stringify(infoOrigin);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado !== null) {
            var cont = document.getElementById('selectorCampos');
            while (cont.firstChild) {
                cont.removeChild(cont.firstChild);
            }
            addCamposGlobales(Mensaje.resultado);
        }
    } else {
        var cont = document.getElementById('selectorCampos');
        while (cont.firstChild) {
            cont.removeChild(cont.firstChild);
        }
    }
}
function addListaGlobales(checkbox) {
    if (checkbox.getAttribute('activarGlobal') === "true") {
        if (checkbox.checked) {
            if (listaCamposTCMasiva[checkbox.id]['existeCap'] === true && listaCamposTCMasiva[checkbox.id]['global'] === 1) {
                alert("Este Campo ya se esta usando en  la forma captura, elimine el campo de la forma para poder modificar esta opcion");

            } else if (listaCamposTCMasiva[checkbox.id]['existeCap'] === true && listaCamposTCMasiva[checkbox.id]['global'] === 0) {
                alert("Este Campo ya se esta usando en la forma de captura como detalle,elimine el campo de la forma para poder modificar esta opcion");
            } else if (listaCamposTCMasiva[checkbox.id]['existeDet'] === true && listaCamposTCMasiva[checkbox.id]['global'] === 1) {
                alert("Este Campo ya se esta usando en la forma de captura de detalle como global,elimine el campo de la forma para poder modificar esta opcion");
            } else if (listaCamposTCMasiva[checkbox.id]['existeDet'] === true && listaCamposTCMasiva[checkbox.id]['global'] === 0) {
                alert("Este Campo ya se esta usando en la forma de captura de detalle  como detalle,elimine el campo de la forma para poder modificar esta opcion");
            }
            listaCamposTCMasiva[checkbox.id]['global'] = 1;
            // console.log(JSON.stringify(listaCamposTCMasiva));

        } else {
            if (listaCamposTCMasiva[checkbox.id]['existeDet'] === true && listaCamposTCMasiva[checkbox.id]['global'] === 1) {
                checkbox.checked = true;
                alert("Este Campo ya se esta usando en la forma de captura de detalle como global,elimine el campo de la forma para poder modificar esta opcion");
            } else if (listaCamposTCMasiva[checkbox.id]['existeDet'] === true && listaCamposTCMasiva[checkbox.id]['global'] === 0) {
                alert("Este Campo ya se esta usando en la forma de captura de detalle  como detalle,elimine el campo de la forma para poder modificar esta opcion");
            } else if (listaCamposTCMasiva[checkbox.id]['existeCap'] === true && listaCamposTCMasiva[checkbox.id]['global'] === 1) {
                alert("Este Campo ya se esta usando en la forma de captura como global,elimine el campo de la forma para poder modificar esta opcion");
                checkbox.checked = true;
            } else if (listaCamposTCMasiva[checkbox.id]['existeCap'] === true && listaCamposTCMasiva[checkbox.id]['global'] === 0) {
                alert("Este Campo ya se esta usando en la forma de captura como detalle,elimine el campo de la forma para poder modificar esta opcion");
                checkbox.checked = true;
            }
            listaCamposTCMasiva[checkbox.id]['global'] = 0;
        }
    } else {

        alert("Este campo no puede usarse como global");
        checkbox.checked = false;
    }
    //console.log();
}
function actualizarCampostcMasiva(data) {
    listaCamposTCMasiva = undefined;
    listaCamposTCMasiva = data;
    // console.log(listaCamposTCMasiva);
}

//metodos para la forma de proceso
function serachProcesoorigen() {
    var getData = "";
    var url = route + "/api/ProcesoOrigen/SearchAll";
    //var dataToPost = JSON.stringify(clave);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        addProcesoOrigen(Mensaje.resultado);
    }

}

function addProcesoOrigen(data) {
    $('#cbxProcesoOrigenDatos option:not(:first)').remove();
    for (var i = 0; i < data.length; i++) {
        $('#cbxProcesoOrigenDatos').append('<option value=' + data[i]['id'] + '>' + data[i]['nombre'] + '</option>');
    }

}

function getMaxValueConfigProceso() {

    var url = route + "/api/ConfiguracionCapturasProces/GetMaxValue";
    //var dataToPost = JSON.stringify(clave);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        var res = parseInt(Mensaje.resultado) + 1;
        document.getElementById("txtClave").value = res;
    }
}
function getProcesoID(value) {
    var res;
    var url = route + "/api/ProcesoOrigen/SearchPorIdProceso";
    var dataToPost = JSON.stringify(value);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        if (Mensaje.resultado.accionesProcesoOrigen.length > 0) {
            res = Mensaje.resultado.accionesProcesoOrigen;
            // construirAccionesPermitir(Mensaje.resultado.accionesProcesoOrigen);
            var divCampos = document.getElementById('contedorAcciones');
            divCampos.style.display = "block";
        }
    }

    return res;
}
function getAcciones(value) {
    var res = getProcesoID(value);
    construirAccionesPermitir(res);
}

function construirAccionesPermitir(acciones, configuracion) {
    var cont = document.getElementById('selectorAcciones');
    removerAcciones();
    var addcomp;
    for (var i = 0; i < acciones.length; i++) {
        addcomp = document.createElement('INPUT');
        addcomp.id = acciones[i]['id'] + replaceAll(acciones[i]['descripcion'], " ", "");
        addcomp.type = "checkbox";
        addcomp.className = 'mainPanelContentComponents';
        addcomp.style.display = 'none';
        if (configuracion === undefined) {
            if (acciones[i].requerido) {
                addcomp.checked = true;
            }
        } else {

            for (var k = 0; k < configuracion.length; k++) {
                if (acciones[i].id === parseInt(configuracion[k].id)) {
                    addcomp.checked = true;
                    break;
                }
            }
        }
        //  addcomp.setAttribute('activarGlobal', resultado[i]['activarGlobal']);
        //addcomp.onchange = "addListaGlobales(this)";
        // addcomp.setAttribute('onchange', "addListaGlobales(this)");
        addcomp.setAttribute('value', acciones[i]['id']);
        var idiv2 = document.createElement('DIV');
        idiv2.style.width = "100%";
        idiv2.style.maxWidth = "100%";
        idiv2.style.margin = "3px";
        idiv2.appendChild(addcomp);
        var label = document.createElement('LABEL');
        label.id = 'LB' + replaceAll(acciones[i]['descripcion'], " ", "");
        label.setAttribute("for", acciones[i]['id'] + replaceAll(acciones[i]['descripcion'], " ", ""));
        label.className = 'containerCheck';
        label.style.display = 'inline';
        label.innerHTML = acciones[i]['descripcion'];
        idiv2.appendChild(label);
        cont.appendChild(idiv2);
    }
}

function removerAcciones() {
    var cont = document.getElementById('selectorAcciones');
    while (cont.firstChild) {
        cont.removeChild(cont.firstChild);
    }
}
function replaceAll(text, busca, reemplaza) {
    while (text.toString().indexOf(busca) != -1)
        text = text.toString().replace(busca, reemplaza);
    return text;
}
