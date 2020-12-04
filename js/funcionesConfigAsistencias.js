
var inMode;
var id;
var items = 0, rowsByPage = 5, numbersByPage = 10,
        fromPage = 0, pagina = 0, totalPages;
var totalByPage = 3;
var start = 0, end = rowsByPage;
var route = "";
var listaExepciones = new Array();
var listaExepcionesPor = new Array();
jQuery(document).ready(function () {
    inMode = "a";
    searchRango(0);
    getExepcionesAll();

    $("#selExepciones").on('change', function () {
        var selected = $("#selExepciones").val().toString(); //here I get all options and convert to string
        //  var document_style = document.documentElement.style;
        if (selected !== "") {
            listaElemtosPorParam = new Array();
            var valores = selected.split(',');
            var texto = "";
            for (var k = 0; k < valores.length; k++) {
                for (var i = 0; i < listaExepciones.length; i++) {
                    if (listaExepciones[i].id === parseInt(valores[k])) {

                        listaExepcionesPor[listaExepcionesPor.length] = listaExepciones[i];

                        break;
                    }
                }
            }
            //document.getElementById('txtElementoCap').value = texto;
            // document_style.setProperty('--text', "'" + selected + "'");
        }
    });




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
    document.getElementById('txtExcepcion').checked = false;
    document.getElementById('txtCentroCosto').checked = false;
    document.getElementById('txtEmpleado1').checked = false;
    document.getElementById('txtExcepcion1').checked = false;
    document.getElementById('txtCentroCosto1').checked = false;
    listaExepcionesPor = new Array();

    $("#selExepciones").prop('selectedIndex', -1);
    mostrarCaptura(false);
}

function actionchecked(compo) {

    if (compo.id === "txtEmpleado" && document.getElementById('txtEmpleado1').checked) {
        document.getElementById('txtEmpleado1').checked = false;
        document.getElementById('txtExcepcion1').checked = true;
    } else if (compo.id === "txtEmpleado1" && document.getElementById('txtEmpleado').checked) {
        document.getElementById('txtEmpleado').checked = false;
        document.getElementById('txtExcepcion').checked = true;
    } else if (compo.id === "txtExcepcion" && document.getElementById('txtExcepcion1').checked) {
        document.getElementById('txtExcepcion1').checked = false;
        document.getElementById('txtEmpleado1').checked = true;
    } else if (compo.id === "txtExcepcion1" && document.getElementById('txtExcepcion').checked) {
        document.getElementById('txtExcepcion').checked = false;
        document.getElementById('txtEmpleado').checked = true;
    } else if (compo.id === "txtCentroCosto" && document.getElementById('txtCentroCosto1').checked) {
        document.getElementById('txtCentroCosto1').checked = false;
    } else if (compo.id === "txtCentroCosto1" && document.getElementById('txtCentroCosto').checked) {
        document.getElementById('txtCentroCosto').checked = false;
    } else if (compo.id === "txtEmpleado") {
        document.getElementById('txtExcepcion1').checked = true;
    } else if (compo.id === "txtExcepcion") {
        document.getElementById('txtEmpleado1').checked = true;
    } else if (compo.id === "txtEmpleado1") {
        document.getElementById('txtExcepcion').checked = true;
    } else if (compo.id === "txtExcepcion1") {
        document.getElementById('txtEmpleado').checked = true;
    }
}

function searchRango(startin) {
    var nameselements = new Array();
    nameselements[0] = startin;
    nameselements[1] = rowsByPage;
    showWait();
    var getData = "";
    var url = route + "/api/Asistencias/SearchRangosConfigAsis";
    var dataToPost = JSON.stringify(nameselements);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        $('#tableSelector').find("tr:gt(0)").remove();
        if (startin === 0) {
            createPaginationAsist(Mensaje.resultado[1]);
        }
        //console.log(Mensaje.resultado[0]);
        llenarTabla(Mensaje.resultado[0]);
    }
    // removeWait();

}

function llenarTabla(data) {
    var tbl = document.getElementById("tableSelector");
    var tbody = document.getElementById("tbodyConfigAsis");
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
        a.href = "javascript:editObjectAsist('" + valueId + "');";
        td.appendChild(a);
        tr.appendChild(td);
        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Eliminar");
        a.appendChild(linkText);
        a.href = "javascript:deleteObjectAsist('" + valueId + "');";
        td.appendChild(a);
        tr.appendChild(td);
        //tbl.appendChild(tr);
        tbody.appendChild(tr);
    }
}

function createPaginationAsist(numberData) {
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
        return cargaPaginaAsist(a, paginador), !1;
    }), paginador.find("li .first_link").click(function () {
        var a = 0;
        return cargaPaginaAsist(a, paginador), !1;
    }), paginador.find("li .prev_link").click(function () {
        var a = parseInt(paginador.data("pag")) - 1;
        return cargaPaginaAsist(a, paginador), !1;
    }), paginador.find("li .next_link").click(function () {
        if (paginador.data("pag") === undefined) {
            a = 1;
        } else {
            a = parseInt(paginador.data("pag")) + 1;
        }
        return cargaPaginaAsist(a, paginador), !1;
    }), paginador.find("li .last_link").click(function () {
        items = paginador.attr("totaReg");
        totalPages = Math.ceil(items / rowsByPage);
        var a = totalPages - 1;
        return cargaPaginaAsist(a, paginador), !1;
    });
}

function cargaPaginaAsist(a, paginador) {

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

function getExepcionesAll() {
    var url = route + "/api/Asistencias/getExcepcioneALL";
    // var dataToPost = JSON.stringify(nameselements);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        listaExepciones = Mensaje.resultado;
        $('#myFilter option').remove();
        // resultado = Mensaje.resultado;
        //  listaElemetosAplicacion = resultado;
        for (var i = 0; i < listaExepciones.length; i++) {
            $('#selExepciones').append('<option value=' + listaExepciones[i].id + '>' + listaExepciones[i].excepcion + '</option>');
        }
        $('#selExepciones option').mousedown(function (e) { //no ctrl to select multiple
            e.preventDefault();
            $(this).prop('selected', $(this).prop('selected') ? false : true); //set selected options on click
            $(this).parent().change(); //trigger change event
        });
    }
}

function editObjectAsist(id) {
    inMode = "u";
    searchXidAsist(id);

}

function deleteObjectAsist(id) {
    inMode = "d";
    searchXidAsist(id);

}

function searchXidAsist(id) {
    var getData = "";
    var url = route + "/api/Asistencias/buscaConfiguracionAsistenciasSistema";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        console.log(Mensaje.resultado);
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

function setCampos(data) {
    id = data.id;
    document.getElementById('txtNombreModulo').value = data.nombre;

    var activarFiltros = data.activadosFiltro.split(',');
    if (activarFiltros[0] === "1") {
        document.getElementById('txtEmpleado').checked = true;
    }

    if (activarFiltros[1] === "1") {
        document.getElementById('txtExcepcion').checked = true;
    }
    if (activarFiltros[2] === "1") {
        document.getElementById('txtCentroCosto').checked = true;
    }

    var activarMovimientos = data.activadosMovimientos.split(',');
    if (activarMovimientos[0] === "1") {
        document.getElementById('txtEmpleado1').checked = true;
    }

    if (activarMovimientos[1] === "1") {
        document.getElementById('txtExcepcion1').checked = true;
    }
    if (activarMovimientos[2] === "1") {
        document.getElementById('txtCentroCosto1').checked = true;
    }

    for (var i = 0; i < data.excepciones.length; i++) {

        $("#selExepciones option[value='" + data.excepciones[i].id.toString() + "']").prop("selected", true);
        // document.getElementById('myFilter').value = data.elementosAplicacion[i].id;
    }

}

function construirObjetecAsist() {
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
    if (document.getElementById('txtEmpleado').checked) {
        activadosFiltros = "1";
        filtros = "Empleados";
    } else {
        activadosFiltros = "0";
    }



    if (document.getElementById('txtExcepcion').checked) {
        activadosFiltros = activadosFiltros == "" ? "1" : activadosFiltros + "," + "1";
        filtros = filtros == "" ? "Excepción" : filtros + "," + "Excepción";
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

    if (document.getElementById('txtExcepcion1').checked) {
        activadosMovimientos = activadosMovimientos == "" ? "1" : activadosMovimientos + "," + "1";
        movimientos = movimientos == "" ? "Excepción" : movimientos + "," + "Excepción";
    } else {
        activadosMovimientos = activadosMovimientos + "," + "0";
    }

    if (document.getElementById('txtCentroCosto1').checked) {
        activadosMovimientos = activadosMovimientos == "" ? "1" : activadosMovimientos + "," + "1";
        movimientos = movimientos == "" ? "Centro de costo" : movimientos + "," + "Centro de costo";
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
    obj.excepciones = listaExepcionesPor;
    obj.sistema = true;
    return obj
}

function saveOrUpdate() {
    var obj = construirObjetecAsist();
    //console.log(obj);
    if (inMode === "a") {
        if (obj !== "") {
            save(obj);
        }
    } else if (inMode === "u") {
        update(obj);
    }
}

function save(obj) {
    var getData = "";
    var url = route + "/api/Asistencias/Save";
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
    var url = route + "/api/Asistencias/Update";
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
    var obj = construirObjetecAsist();
    var getData = "";
    var url = route + "/api/Asistencias/Delete";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        alert("Dato eliminado exitosamente");
    }

}