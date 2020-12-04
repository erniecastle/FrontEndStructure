var cont;
jQuery(document).ready(function () {
    cont = document.getElementById('capture');
    llenarTablas();
    addEventosComp();

    var txtdiasMes = cont.querySelector('input[persist="diasMes"]');
    txtdiasMes.disabled = true;
    var txtimporteHoras = cont.querySelector('input[persist="importeHoras"]');
    txtimporteHoras.disabled = true;
    var txtimporteDias = cont.querySelector('input[persist="importeDias"]');
    txtimporteDias.disabled = true;
    var fechaActual = hoyFecha();
    console.log(fechaActual);
    document.getElementById('txt_vigencia').value = fechaActual.toString();
});

function addEventosComp() {
   // var cont = document.getElementById('capture');
    var periodicidadPago = cont.querySelectorAll('input[persist="periodicidadPago"]');
    for (var i = 0; i < periodicidadPago.length; i++) {
        periodicidadPago[i].setAttribute('onclick', 'activartxtdiasMes(this)');
    }
    var pagoHoras = cont.querySelectorAll('input[persist="pagoHoras"]');
    for (var i = 0; i < pagoHoras.length; i++) {
        pagoHoras[i].setAttribute('onclick', 'activartxtimporteHoras(this)');
    }
    var pagoDias = cont.querySelectorAll('input[persist="pagoDias"]');
    for (var i = 0; i < pagoDias.length; i++) {
        pagoDias[i].setAttribute('onclick', 'activartxtimporteDias(this)');
    }
}

function activartxtdiasMes(comp) {
    var txtdias = cont.querySelector('input[persist="diasMes"]');
    if (comp.id === "periodicidadPagoEnelperiododenomina") {
        txtdias.value = "";
        txtdias.disabled = true;
    } else {
        txtdias.disabled = false;
    }
}

function activartxtimporteHoras(comp) {
    var txtimporteHoras = cont.querySelector('input[persist="importeHoras"]');
    if (comp.id === "pagoHorasImportehoras") {
        txtimporteHoras.value = "";
        txtimporteHoras.disabled = false;
    } else if (comp.id === "pagoHorasPorcentajehoras") {
        txtimporteHoras.value = "";
        txtimporteHoras.disabled = false;
    } else {
        txtimporteHoras.value = "";
        txtimporteHoras.disabled = false;
    }
}

function activartxtimporteDias(comp) {
    var txtimporteDias = cont.querySelector('input[persist="importeDias"]');
    if (comp.id === "pagoDiasImportediario") {
        txtimporteDias.value = "";
        txtimporteDias.disabled = false;
    } else if (comp.id === "pagoDiasPorcentajediario") {
        txtimporteDias.value = "";
        txtimporteDias.disabled = false;
    } else {
        txtimporteDias.value = "";
        txtimporteDias.disabled = false;
    }
}

function llenarTablas() {
 //   var cont = document.getElementById('capture');
    var tbl = cont.querySelectorAll('table');
    for (var i = 0; i < tbl.length; i++) {
        var values = tbl[i].getAttribute('tableidentifier').split('|');
        if (values[1] === "BaseNomina") {
            var data =searchAll(values[1]);
            llenarBaseNomina(data,0);
            createPaginationDespensa(data.length, "BaseNomina");
            listaDetalles["BaseNomina"] = data;
        } else if (values[1] === "Incidencias") {
            var data = searchAll(values[1]);
            llenarIncedncias(data,0);
            createPaginationDespensa(data.length, "Incidencias");
            listaDetalles["Incidencias"] = data;
           
        }
    }
    // console.log(tbl);
}

function llenarBaseNomina(data, start) {
    var tbl;
    tbl = document.getElementById("BaseNomina" + 'Detail');
    var tabla = "BaseNomina";
    $('#' + "BaseNomina" + 'Detail').find("tr:gt(0)").remove();
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

    for (var i = start; i < fin; i++) {
        var valueId = data[i]['id'];//The identifer Id of table
        var tr = document.createElement('tr');
        tr.id = valueId.toString();
        //var nColumnas = $('#' + tabla + 'Detail ' + 'tr:first th').length
        var sizeColumns = tbl.rows[0].cells;
        var columnsLength = sizeColumns.length;
        //var columnsLength = data[i].length;
        var td = null;
        for (var j = 0; j < columnsLength; j++) {
            if (sizeColumns[j].id !== "tbEditar" && sizeColumns[j].id !== "tbEliminar") {
                td = document.createElement('td');
                var texto = sizeColumns[j].getAttribute('fieldsource').charAt(0).toUpperCase() + sizeColumns[j].getAttribute('fieldsource').slice(1);
                texto = texto.replace(".", "");
                //console.log(texto);
                if (texto.toLowerCase() === "reservado") {
                    if (data[i][texto.toLowerCase()] === true) {
                        td.appendChild(document.createTextNode("SI"));
                    } else {
                        td.appendChild(document.createTextNode("NO"));
                    }
                } else {
                    td.appendChild(document.createTextNode(data[i][texto.toLowerCase()]));
                }
                tr.appendChild(td);
            } else if (sizeColumns[j].id === "tbEditar") {
                td = document.createElement('td');
                var a = document.createElement('a');
                var linkText = document.createTextNode("Editar");
                a.appendChild(linkText);
                a.href = "javascript:editObjectgen('" + valueId + "'" + "," + true + ",'" + tabla + "');";
                td.appendChild(a);
                tr.appendChild(td);
            } else if (sizeColumns[j].id === "tbEliminar") {
                td = document.createElement('td');
                var a = document.createElement('a');
                var linkText = document.createTextNode("Eliminar");
                a.appendChild(linkText);
                a.href = "javascript:deleteObjectInTablegen('" + valueId + "'" + "," + true + ",'" + tabla + "');";
                td.appendChild(a);
                tr.appendChild(td);
            }
        }
        tbl.appendChild(tr);
    }
}

function llenarIncedncias(data, start) {
    var tbl;
    tbl = document.getElementById("Incidencias" + 'Detail');
    var tabla = "Incidencias";
    $('#' + "Incidencias" + 'Detail').find("tr:gt(0)").remove();
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

    for (var i = start; i < fin; i++) {
        var valueId = data[i]['id'];//The identifer Id of table
        var tr = document.createElement('tr');
        tr.id = valueId.toString();
        //var nColumnas = $('#' + tabla + 'Detail ' + 'tr:first th').length
        var sizeColumns = tbl.rows[0].cells;
        var columnsLength = sizeColumns.length;
        //var columnsLength = data[i].length;
        var td = null;
        for (var j = 0; j < columnsLength; j++) {
            if (sizeColumns[j].id !== "tbEditar" && sizeColumns[j].id !== "tbEliminar") {
                td = document.createElement('td');
                var texto = sizeColumns[j].getAttribute('fieldsource').charAt(0).toUpperCase() + sizeColumns[j].getAttribute('fieldsource').slice(1);
                texto = texto.replace(".", "");
                //console.log(texto);
                if (texto.toLowerCase() === "descontar") {
                    if (data[i][texto.toLowerCase()] === true) {
                        td.appendChild(document.createTextNode("SI"));
                    } else {
                        td.appendChild(document.createTextNode("NO"));
                    }
                } else {
                    td.appendChild(document.createTextNode(data[i][texto.toLowerCase()]));
                }
                tr.appendChild(td);
            } else if (sizeColumns[j].id === "tbEditar") {
                td = document.createElement('td');
                var a = document.createElement('a');
                var linkText = document.createTextNode("Editar");
                a.appendChild(linkText);
                a.href = "javascript:editObjectgen('" + valueId + "'" + "," + true + ",'" + tabla + "');";
                td.appendChild(a);
                tr.appendChild(td);
            } else if (sizeColumns[j].id === "tbEliminar") {
                td = document.createElement('td');
                var a = document.createElement('a');
                var linkText = document.createTextNode("Eliminar");
                a.appendChild(linkText);
                a.href = "javascript:deleteObjectInTablegen('" + valueId + "'" + "," + true + ",'" + tabla + "');";
                td.appendChild(a);
                tr.appendChild(td);
            }
        }
        tbl.appendChild(tr);
    }
}

function deshabilitarComponentes() {
    var conte = document.getElementById('panelDetalle');
    var element = conte.querySelectorAll("Input,select");
    for (var i = 0; i < element.length; i++) {
        if (element[i].getAttribute('persist') !== "reservado" && element[i].getAttribute('persist') !== "descontar") {
            element[i].disabled = true;
        }
        
    }
}

function createPaginationDespensa(numberData, origen) {
  //  var typeDetail = typeof typeDetail !== 'undefined' ? typeDetail : false;
    // var paginador = $(".pagination");
    var paginador = $("#listPag" + origen);
    // alert(paginador.attr("id"));
    paginador.attr("sourcePage", origen);
   // paginador.attr("isDetail", typeDetail);
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
        return cargaPaginaDespensa(a, paginador), !1;
    }), paginador.find("li .first_link" + origen).click(function () {
        var a = 0;
        return cargaPaginaDespensa(a, paginador), !1;
    }), paginador.find("li .prev_link" + origen).click(function () {
        var a = parseInt(paginador.data("pag")) - 1;
        return cargaPaginaDespensa(a, paginador), !1;
    }), paginador.find("li .next_link" + origen).click(function () {
        if (paginador.data("pag") === undefined) {
            a = 1;
        } else {
            a = parseInt(paginador.data("pag")) + 1;

        }
        return cargaPaginaDespensa(a, paginador), !1;
    }), paginador.find("li .last_link" + origen).click(function () {
        items = paginador.attr("totaReg");
        totalPages = Math.ceil(items / rowsByPage);
        var a = totalPages - 1;
        return cargaPaginaDespensa(a, paginador), !1;
    });
}

function cargaPaginaDespensa(a, paginador) {
    var origen = paginador.attr("sourcePage");
    //var typeDetail = paginador.attr("isDetail");
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

    if (origen === "BaseNomina") {

        llenarBaseNomina(listaDetalles[origen],fromPage);
    } else if (origen === "Incidencias") {
        llenarIncedncias(listaDetalles[origen], fromPage);
    }
}

function hoyFecha() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();

    dd = addZero(dd);
    mm = addZero(mm);

    return yyyy + '-' + mm + '-' + dd;
}

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}
