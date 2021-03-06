﻿
var inMode;
var id;
var items = 0, rowsByPage = 5, numbersByPage = 10,
        fromPage = 0, pagina = 0, totalPages;
var totalByPage = 3;
var start = 0, end = rowsByPage;
var route = "";

jQuery(document).ready(function () {
    //call origen datos
    inMode = "a";
    searchRango(0);

});

function mostrarCaptura(mostrar) {
    if (mostrar) {
        document.getElementById('Captura').style.display = "block";
        document.getElementById('SelectCapturas').style.display = "none";
    } else {
        document.getElementById('Captura').style.display = "none";
        document.getElementById('SelectCapturas').style.display = "block";
    }
}

function limpiar() {
    inMode = "a";
    document.getElementById('txtNombreModulo').value = "";
    document.getElementById('txtGrupoMenu').value = "";
    document.getElementById('txtEmpleado').checked = false;
    document.getElementById('txtConcepto').checked = false;
    document.getElementById('txtCentroCosto').checked = false;
    document.getElementById('txtEmpleado1').checked = false;
    document.getElementById('txtConcepto1').checked = false;
    document.getElementById('txtCentroCosto1').checked = false;
    document.getElementById('txtFechaInicial').checked = false;
    document.getElementById('txtFechaFinal').checked = false;
    document.getElementById('txtMovExitentes').checked = false;
    mostrarCaptura(false);
}

function getAllConfig() {
    showWait();
    var getData = "";
    var url = route + "/api/MovimientosNomina/getAllConfiguracionMovimientos";
    //var dataToPost = JSON.stringify(clave);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        $('#tableSelector').find("tr:gt(0)").remove();
        llenarTabla(Mensaje.resultado);
    }
    removeWait();
}

function llenarTabla(data) {
    var tbl = document.getElementById("tableSelector");
    var tbody = document.getElementById("tbodyConfigMov");
    for (var i = 0; i < data.length; i++) {
        var valueId = data[i]['id'];
        var tr = document.createElement('tr');
        tr.id = valueId.toString();

        var sizeColumns = tbl.rows[0].cells;
        var columnsLength = sizeColumns.length - 2;

        var td = null;
        for (var j = 0; j < columnsLength; j++) {
            if (j === 0) {
                td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]["nombre"]));
                tr.appendChild(td);
            } else if (j === 1) {
                td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]["filtro"]));
                tr.appendChild(td);
            } else if (j === 2) {
                td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]["movimiento"]));
                tr.appendChild(td);
            }
        }
        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Editar");
        a.appendChild(linkText);
        a.href = "javascript:editObject('" + valueId + "');";
        td.appendChild(a);
        tr.appendChild(td);
        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Eliminar");
        a.appendChild(linkText);
        a.href = "javascript:deleteObject('" + valueId + "');";
        td.appendChild(a);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}

function searchXid(id) {
    var getData = "";
    var url = route + "/api/MovimientosNomina/buscaConfiguracionMovimSistema";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        setCampos(Mensaje.resultado);
        mostrarCaptura(true);
        if (inMode === "d") {
            var answer = confirm("¿Quieres eliminar esta configuración?")
            if (answer) {
                eliminar();
                limpiar();
                searchRango(0);

            }
            else {
                searchRango(0);
                limpiar();

            }
        }
    }
}

function editObject(id) {
    inMode = "u";
    searchXid(id);

}

function deleteObject(id) {
    inMode = "d";
    searchXid(id);

}

function setCampos(data) {
    id = data.id;
    document.getElementById('txtNombreModulo').value = data.nombre;

    if (data.movimientoExistente) {
        document.getElementById('txtMovExitentes').checked = data.movimientoExistente;
    } else {
        document.getElementById('txtMovExitentes').checked = data.movimientoExistente;
    }

    var activarFiltros = data.activadosFiltro.split(',');
    if (activarFiltros[0] === "1") {
        document.getElementById('txtEmpleado').checked = true;
    }

    if (activarFiltros[1] === "1") {
        document.getElementById('txtConcepto').checked = true;
    }
    if (activarFiltros[2] === "1") {
        document.getElementById('txtCentroCosto').checked = true;
    }

    var activarMovimientos = data.activadosMovimientos.split(',');
    if (activarMovimientos[0] === "1") {
        document.getElementById('txtEmpleado1').checked = true;
    }

    if (activarMovimientos[1] === "1") {
        document.getElementById('txtConcepto1').checked = true;
    }
    if (activarMovimientos[2] === "1") {
        document.getElementById('txtCentroCosto1').checked = true;
    }
    if (activarMovimientos[3] === "1") {
        document.getElementById('txtFechaInicial').checked = true;
    }
    if (activarMovimientos[4] === "1") {
        document.getElementById('txtFechaFinal').checked = true;
    }
}

function actionchecked(compo) {

    if (compo.id === "txtEmpleado" && document.getElementById('txtEmpleado1').checked) {
        document.getElementById('txtEmpleado1').checked = false;
        document.getElementById('txtConcepto1').checked = true;
    } else if (compo.id === "txtEmpleado1" && document.getElementById('txtEmpleado').checked) {
        document.getElementById('txtEmpleado').checked = false;
        document.getElementById('txtConcepto').checked = true;
    } else if (compo.id === "txtConcepto" && document.getElementById('txtConcepto1').checked) {
        document.getElementById('txtConcepto1').checked = false;
        document.getElementById('txtEmpleado1').checked = true;
    } else if (compo.id === "txtConcepto1" && document.getElementById('txtConcepto').checked) {
        document.getElementById('txtConcepto').checked = false;
        document.getElementById('txtEmpleado').checked = true;
    } else if (compo.id === "txtCentroCosto" && document.getElementById('txtCentroCosto1').checked) {
        document.getElementById('txtCentroCosto1').checked = false;
    } else if (compo.id === "txtCentroCosto1" && document.getElementById('txtCentroCosto').checked) {
        document.getElementById('txtCentroCosto').checked = false;
    } else if (compo.id === "txtEmpleado") {
        document.getElementById('txtConcepto1').checked = true;
    } else if (compo.id === "txtConcepto") {
        document.getElementById('txtEmpleado1').checked = true;
    } else if (compo.id === "txtEmpleado1") {
        document.getElementById('txtConcepto').checked = true;
    } else if (compo.id === "txtConcepto1") {
        document.getElementById('txtEmpleado').checked = true;
    }
}

function construirObjetec() {
    var obj = {};
    var activadosFiltros = "";
    var filtros = "";
    var activadosMovimientos = "";
    var movimientos = "";
    if (id !== undefined) {
        obj.id = id;
    }
    if (document.getElementById('txtNombreModulo').value !== "") {
        obj.nombre = document.getElementById('txtNombreModulo').value;
    } else {
        alert("llene el campo nombre de modulo");
        return "";
    }

    obj.movimientoExistente = document.getElementById('txtMovExitentes').checked == true ? true : false;
    if (document.getElementById('txtEmpleado').checked) {
        activadosFiltros = "1";
        filtros = "Empleados";
    } else {
        activadosFiltros = "0";
    }

    if (document.getElementById('txtConcepto').checked) {
        activadosFiltros = activadosFiltros == "" ? "1" : activadosFiltros + "," + "1";
        filtros = filtros == "" ? "Conceptos" : filtros + "," + "Conceptos";
    } else {
        activadosFiltros = activadosFiltros == "" ? "0" : activadosFiltros + "," + "0";
    }

    if (document.getElementById('txtCentroCosto').checked) {
        activadosFiltros = activadosFiltros == "" ? "1" : activadosFiltros + "," + "1";
        filtros = filtros == "" ? "Centro de Costo" : filtros + "," + "Centro de Costo";
    } else {
        activadosFiltros = activadosFiltros == "" ? "0" : activadosFiltros + "," + "0";
    }

    if (document.getElementById('txtEmpleado1').checked) {
        activadosMovimientos = "1";
        movimientos = "Empleados";
    } else {
        activadosMovimientos = "0";
    }

    if (document.getElementById('txtConcepto1').checked) {
        activadosMovimientos = activadosMovimientos == "" ? "1" : activadosMovimientos + "," + "1";
        movimientos = movimientos == "" ? "Conceptos" : movimientos + "," + "Conceptos";
    } else {
        activadosMovimientos = activadosMovimientos + "," + "0";
    }

    if (document.getElementById('txtCentroCosto1').checked) {
        activadosMovimientos = activadosMovimientos == "" ? "1" : activadosMovimientos + "," + "1";
        movimientos = movimientos == "" ? "Centro de costo" : movimientos + "," + "Centro de costo";
    } else {
        activadosMovimientos = activadosMovimientos == "" ? "0" : activadosMovimientos + "," + "0";
    }

    if (document.getElementById('txtFechaInicial').checked) {
        activadosMovimientos = activadosMovimientos == "" ? "1" : activadosMovimientos + "," + "1";
        movimientos = movimientos == "" ? "Fecha inicial" : movimientos + "," + "Fecha inicial";
    } else {
        activadosMovimientos = activadosMovimientos == "" ? "0" : activadosMovimientos + "," + "0";
    }

    if (document.getElementById('txtFechaFinal').checked) {
        activadosMovimientos = activadosMovimientos == "" ? "1" : activadosMovimientos + "," + "1";
        movimientos = movimientos == "" ? "Fecha final" : movimientos + "," + "Fecha final";
    } else {
        activadosMovimientos = activadosMovimientos == "" ? "0" : activadosMovimientos + "," + "0";
    }
    if (activadosFiltros.split(',')[0] === "1" || activadosFiltros.split(',')[1] === "1") {
        obj.activadosFiltro = activadosFiltros;
        obj.filtro = filtros;
    } else {
        alert("selecion empleado o conceptos en filtrar por");
        return "";
    }

    if (activadosMovimientos.split(',')[0] === "1" || activadosMovimientos.split(',')[1] === "1") {
        obj.activadosMovimientos = activadosMovimientos;
        obj.movimiento = movimientos;
    } else {
        alert("selecion empleado o conceptos en movimientos por");
        return "";
    }




    return obj;
}

function save(obj) {
    var getData = "";
    var url = route + "/api/MovimientosNomina/Save";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        alert("Datos guardados exitosamente");
        limpiar();
        searchRango(0);
    }
    
}

function update(obj) {
    var getData = "";
    var url = route + "/api/MovimientosNomina/Update";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        alert("Datos actualizados exitosamente");
        limpiar();
        searchRango(0);
    }
    
}

function eliminar() {
    var obj = construirObjetec();
    var getData = "";
    var url = route + "/api/MovimientosNomina/Delete";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
       alert("Dato eliminado exitosamente");
    }
  
}

function saveOrUpdate() {
    var obj = construirObjetec();
    
    if (inMode === "a") {
        if (obj !== "") {
            save(obj);
        }
    } else if (inMode === "u") {
        update(obj);
    }
}

function showWait() {
    var div = document.createElement('div');
    div.setAttribute("id", "loadingWait");
    var img = document.createElement('img');
    img.src = 'img/loadingWait.gif';
    div.style.cssText = 'position: fixed; top: 50%; left: 50%; z-index: 5000;\n\
                    -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);';
    div.appendChild(img);
    document.body.appendChild(div);
}

function removeWait() {
    document.getElementById("loadingWait").remove();
}

function searchRango(startin) {
    var nameselements = new Array();
    nameselements[0] = startin;
    nameselements[1] = rowsByPage;
    showWait();
    var getData = "";
    var url = route + "/api/MovimientosNomina/SearchRangos";
    var dataToPost = JSON.stringify(nameselements);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        $('#tableSelector').find("tr:gt(0)").remove();
        if (startin === 0) {
            createPaginationMov(Mensaje.resultado[1]);
        }
        llenarTabla(Mensaje.resultado[0]);
    }
    removeWait();

}

function createPaginationMov(numberData) {
    var paginador = $("#listPag");

    paginador.attr("totaReg", numberData);

    paginador.html("");
    items = numberData;
    totalPages = Math.ceil(items / rowsByPage);

    $('<li><a href="#" class="first_link">&#9664;</a></li>').appendTo(paginador);
    $('<li><a href="#" class="prev_link">&laquo;</a></li>').appendTo(paginador);

    for (var b = 0; totalPages > b;)
        $('<li><a href="#" class="page_link">' + (b + 1) + "</a></li>").appendTo(paginador), b++;

    numbersByPage > 1 && ($(".page_link").hide(), $(".page_link").slice(0, numberData).show());

    $('<li><a href="#" class="next_link">&raquo;</a></li>').appendTo(paginador);
    $('<li><a href="#" class="last_link">&#9654;</a></li>').appendTo(paginador);

    0 == pagina && (paginador.find(".page_link:first").addClass("active"),
           paginador.find(".page_link:first").parents("li").addClass("active"));

    paginador.find(".prev_link").hide(),
    paginador.find("li .page_link").click(function () {
        var a = $(this).html().valueOf() - 1;
        return cargaPaginaMov(a, paginador), !1;
    }), paginador.find("li .first_link").click(function () {
        var a = 0;
        return cargaPaginaMov(a, paginador), !1;
    }), paginador.find("li .prev_link").click(function () {
        var a = parseInt(paginador.data("pag")) - 1;
        return cargaPaginaMov(a, paginador), !1;
    }), paginador.find("li .next_link").click(function () {
        if (paginador.data("pag") === undefined) {
            a = 1;
        } else {
            a = parseInt(paginador.data("pag")) + 1;
        }
        return cargaPaginaMov(a, paginador), !1;
    }), paginador.find("li .last_link").click(function () {
        items = paginador.attr("totaReg");
        totalPages = Math.ceil(items / rowsByPage);
        var a = totalPages - 1;
        return cargaPaginaMov(a, paginador), !1;
    });
}

function cargaPaginaMov(a, paginador) {

    pagina = a;
    fromPage = pagina * rowsByPage;

    pagina >= 1 ? paginador.find(".prev_link").show() : paginador.find(".prev_link").hide();

    totalPages - 1 == pagina ? paginador.find(".next_link").hide() : paginador.find(".next_link").show(),
            paginador.data("pag", pagina), numbersByPage > 1 && ($(".page_link").hide(),
            totalPages - numbersByPage > pagina ? $(".page_link").slice(pagina, numbersByPage + pagina).show() :
            totalPages > numbersByPage ? $(".page_link").slice(totalPages - numbersByPage).show() :
            $(".page_link").slice(0).show()), paginador.children().removeClass("active"),
            paginador.children().eq(pagina + 2).addClass("active");

    searchRango(fromPage);

}