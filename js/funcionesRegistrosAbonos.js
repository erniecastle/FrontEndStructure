var tipoPantalla;
var fechaSistemasRegAbono;
var razonSocial;
var listaConfigCreditos = new Array();
var tipoCredito = null;
var dataRegAbono = new Array();
var deleteAbono = new Array();
var listaAbonoEmplNewYMod = new Array();
var empleados;
var claveEmpleado = "";
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    var query = getParameterByName('screen');
    if (query !== "") {
        //displayAsistencia(query);
    } else {
        var obj = JSON.parse($("#container").data("opener"));
        query = obj.tipoCaptura + "|" + obj.IdScreen + "|" + obj.config;
        value = query.split('|');
        tipoPantalla = value[2];
        if (tipoPantalla === "2") {
            document.getElementById("lblTipoPrestamo").innerHTML = "Ahorro";
        }
    }
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    razonSocial = getRazonSocial();
    fechaSistemasRegAbono = getFechaSistema();
    var fecha = formatDate(fechaSistemasRegAbono);
    document.getElementById("dpkFechaSolicitud").value = fecha;
    getConfigCreditosAbono();

});

function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results)
        return '';
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getConfigCreditosAbono() {
    var obj = {};
    obj.claveRazon = razonSocial.clave;

    obj.tipoConfiguracion = tipoPantalla;

    var url = route + "/api/RegistrosAbonos/getConfigCreditos";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        listaConfigCreditos = Mensaje.resultado;
        for (var i = 0; i < listaConfigCreditos.length; i++) {
            $('#selTipoCredito').append('<option value=' + listaConfigCreditos[i].id + '>' + listaConfigCreditos[i].clave + "-" + listaConfigCreditos[i].descripcion + '</option>');
        }
    }

}

function setEditEmpleadosDetalle() {
    nameCmp = "EditEmpleadosDetalle";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionadoCol.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionadoCol.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionadoCol.messageFormatter("EmpleadosNombreAbre")();
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";

    camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];

    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razonSocial.id };
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    // //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecial";
    var fecha = formatDatemmddyyy(fechaSistemasRegAbono);
    //var camposWhereEsp = "";
    var valoreswhereEsp = [razonSocial.clave, null, new Date(fecha), new Date(fecha)];
    var optionals = { "queryEspecial": queryEspecial, "valoreswhereEsp": valoreswhereEsp };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}

function setEditEmpleadosDetalleShow(value) {
    var obj = value[0];
    empleados = obj[1];
    idResult = empleados.id;
    claveEmpleado = empleados.clave;
    nombreDatoSecu = "nombreEmpleado";
    datoSecundario = empleados.apellidoPaterno + " " + empleados.apellidoMaterno + " " + empleados.nombre;

    if (classNameBlur) {
        var tdClave = renglon.querySelector("td[persist=empleados_ID]");
        var txtclave = tdClave.firstElementChild.firstElementChild;
        tdClave.appendChild(document.createTextNode(txtclave.value));
        txtclave.value = "";
        tdClave.firstElementChild.style.display = "none";
        var tddescripcion = renglon.querySelector("td[persist=nombreEmpleado]");
        tddescripcion.appendChild(document.createTextNode(datoSecundario));


        if (prevalidacionAddRow(renglon)) {
            var nametable = renglon.parentNode.parentNode.id;
            var nameBody = renglon.parentNode.id;
            var rowTr = renglon;
            var obj2 = [nametable, nameBody, rowTr];
            tableAdd(obj2);
        }
        $(tdClave).nextAll('td[contenteditable=true]:first').focus();
    }
}

function setEditNoCreditoDetalle() {
    nameCmp = "EditNoCreditoDetalle";
    table = "CreditoPorEmpleado";
    if (tipoPantalla === "1") {
        nameCols = idiomaSelecionadoCol.messageFormatter("CreditoNumCred")() + "," + idiomaSelecionadoCol.messageFormatter("CrediAhorrSaldoInicial")() + "," +
            idiomaSelecionadoCol.messageFormatter("CrediAhorrMontoDesc")() + "," + idiomaSelecionadoCol.messageFormatter("CrediAhorrSaldoActual")();
    } else {
        nameCols = idiomaSelecionadoCol.messageFormatter("AhorroNumAhorr")() + "," + idiomaSelecionadoCol.messageFormatter("CrediAhorrSaldoInicial")() + "," +
            idiomaSelecionadoCol.messageFormatter("CrediAhorrMontoDesc")() + "," + idiomaSelecionadoCol.messageFormatter("CrediAhorrSaldoActual")();
    }
    var subCampo = "@(select CASE WHEN (cr.tipoConfiguracion = '1') then (totalCredito + (select CASE WHEN (COUNT(*) = 0 ) THEN 0.0 ELSE" +
        " (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END)) END from CreditoMovimientos c where c.creditoPorEmpleado.id = o.id" +
        " AND c.tiposMovimiento = 3)) - (select CASE WHEN (COUNT(*) = 0 ) THEN 0.0 ELSE (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END))" +
        " END from CreditoMovimientos c where c.creditoPorEmpleado.id = o.id AND (c.tiposMovimiento = 1 or c.tiposMovimiento = 5)) else ((select CASE WHEN " +
        " (COUNT(*) = 0 ) THEN 0.0 ELSE (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END)) END from CreditoMovimientos c where " +
        " c.creditoPorEmpleado.id = o.id AND (c.tiposMovimiento = 1 or c.tiposMovimiento = 5))) - (select CASE WHEN (COUNT(*) = 0 ) THEN 0.0 ELSE" +
        " (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END)) END from CreditoMovimientos c where c.creditoPorEmpleado.id = o.id AND" +
        " c.tiposMovimiento = 3) end from CreditoPorEmpleado  c, CreditoAhorro cr where c.creditoAhorro.id=cr.id and c.id = o.id)";

    campos = ["numeroCredito", "totalCredito", "montoDescuento", subCampo];
    camposObtener = ["numeroCredito", "totalCredito", "montoDescuento", subCampo];
    var subEntities = "empleados,razonesSociales,creditoAhorro";
    camposMostrar = ["numeroCredito", "montoDescuento"];
    var tituloSel = "";
    var tamañoSel = "size-4";
    if (tipoPantalla === "1") {
        tituloSel = "credito";
    } else {
        tituloSel = "Ahorro";
    }
    var fecha = new Date(formantDdMmYyyy(document.getElementById("dpkFechaSolicitud").value));
    var preFilters = {
        "empleados.clave": claveEmpleado, "razonesSociales.clave": razonSocial.clave, "creditoAhorro.clave": tipoCredito.clave,
        "creditoAhorro.tipoConfiguracion": tipoCredito.tipoConfiguracion, "fechaAutorizacion#<=": fecha, "fechaVence#>=": fecha
    };

    var optionals = { "isWithAliasObtain": false };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? null : optionals);
}

function setEditNoCreditoDetalleShow(value) {
    var obj = value[0];
    nombreDatoSecu = "saldo";
    datoSecundario = obj[4];
    if (classNameBlur) {
        //setValueAt(renglon);
        var tdClave = renglon.querySelector("td[persist=creditoPorEmpleado_ID]");
        var txtclave = tdClave.firstElementChild.firstElementChild
        tdClave.appendChild(document.createTextNode(txtclave.value));
        txtclave.value = "";
        tdClave.firstElementChild.style.display = "none";

        var tddescripcion = renglon.querySelector("td[persist=saldo]");
        $(tddescripcion).contents().filter(function () {
            return this.nodeType === 3; //Node.TEXT_NODE
        }).remove();
        tddescripcion.appendChild(document.createTextNode(datoSecundario));
        if (prevalidacionAddRow(renglon)) {
            var nametable = renglon.parentNode.parentNode.id;
            var nameBody = renglon.parentNode.id;
            var rowTr = renglon;
            var obj2 = [nametable, nameBody, rowTr];
            tableAdd(obj2);
        }
        $(tdClave).nextAll('td[contenteditable=true]:first').focus();
    }
}

/////metodos para la tabla
function editTableRegistroAbonos() {

    var nameTable = "RegistroAbonos";
    var nameCols = crearListaColumnas();
    var activaAdd = true;
    var activaDelete = true;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function crearListaColumnas() {
    var columnasTabla = new Array();

    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("Empleados")(), "nombreCompo": "Empleados", "editable": true, "tipoCompon": "editConsulta", "persist": "empleados_ID", "ancho": "110px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblNombre")(), "nombreCompo": "Nombre", "editable": false, "tipoCompon": "text", "persist": "nombreEmpleado", "ancho": "260px" });

    if (tipoPantalla === "2") {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("AhorroNumAhorr")(), "nombreCompo": "NoCredito", "editable": true, "tipoCompon": "editConsulta", "persist": "creditoPorEmpleado_ID", "ancho": "130px", "funcion": "" });
    } else {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("CreditoNumCred")(), "nombreCompo": "NoCredito", "editable": true, "tipoCompon": "editConsulta", "persist": "creditoPorEmpleado_ID", "ancho": "130px", "funcion": "" });
    }
    columnasTabla.push(
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CrediAhorrSaldoActual")(), "nombreCompo": "Saldoactual", "editable": false, "tipoCompon": "text", "persist": "saldo", "ancho": "100px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CrediAhorrAbono")(), "nombreCompo": "Abono", "editable": true, "tipoCompon": "text", "persist": "importe", "ancho": "140px" });
    return columnasTabla;
}

function tableAdd(valores) {
    var exito = true;
    if (valores.length === 3) {
       
        var trUltimo;
        
        trUltimo = $(valores[2]).nextAll('tr:last')[0];
     
        construirObj(valores[2]);
        



        if (typeof trUltimo !== 'undefined') {
            for (var k = 0; k < trUltimo.cells.length; k++) {
                if (trUltimo.cells[k].getAttribute('contenteditable') === "true") {
                    if (trUltimo.cells[k].innerText === "") {
                        exito = false;
                        break;
                    }
                }
            }
        }
    }
    if (exito) {

        var $clone = $('#' + valores[0]).find('tr.hide').clone(true).removeClass('hide table-line');
        $clone[0].setAttribute("class", "hidetd");
        $clone.className = "hidetd";
        // $clone.id = rString;
        //console.log($clone[0].parent);
        $('#' + valores[1]).append($clone);
        var edit = document.getElementById(valores[1]).querySelectorAll(".edit");
        if (edit) {
            for (var i = 0; i < edit.length; i++) {
                edit[i].removeAttribute("value");
                edit[i].querySelector(".editKey").value = "";
            }
        }


        //  $('#' + valores[1]).append($clone);
    }
}

function prevalidacionColumna(valores) {

    var columnas = valores[1];
    var renglon = valores[0];
    if (columnas.getAttribute("persist") === "creditoPorEmpleado_ID") {
        var clave = renglon.cells[0].innerText;
        if (clave !== "") {
            claveEmpleado = clave;
        } else {
            //renglon.cells[0].focus();
            // alert("selecione un empelado");
        }
    }

}

function prevalidacionAddRow(tr) {
    var tds = tr.cells;
    var exito = true;
    for (var i = 0; i < tds.length; i++) {
        if (tds[i].getAttribute("contenteditable") === "true") {
            if (tds[i].innerText === "") {
                exito = false;
                break;
            }
        }

    }
    return exito;
}

function construirObj(tr) {
    var obj = {};

    for (var i = 0; i < tr.cells.length; i++) {

        if (tr.cells[i].getAttribute('persist') !== "eliminar" && tr.cells[i].getAttribute("contenteditable") === "true") {
            if (tr.cells[i].getAttribute('tipocompon') === "editConsulta") {
                obj[tr.cells[i].getAttribute('persist')] = parseInt(tr.cells[i].firstElementChild.getAttribute('value'));
            } else if (tr.cells[i].getAttribute('tipocompon') === "select") {
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].getAttribute('valor');
            } else {
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
            }
            // console.log(tr.cells[i].getAttribute('persist'), "-", tr.cells[i].innerText);
        } else if (tr.cells[i].getAttribute('persist') === "numeroCredito") {
            obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
        }
    }

    if (tr.id === "") {
        var rString = "id" + randomString(2, '0123456789');
        obj['id'] = rString;
        tr.id = obj.id;
        addCredMovAbono(obj);
    } else {
        obj['id'] = tr.id;
        actualizarCredMovAbono(obj);
    }

}

function tableRemove(registro) {

    var id = registro.id;
    if (parseInt(id)) {
        for (var i = 0; i < dataRegAbono.length; i++) {
            if (dataRegAbono[i].id === parseInt(id)) {
                dataRegAbono.splice(i, 1);
                break;
            }
        }
        //for (var i = 0; i < listaAsistNuevosYMod.length; i++) {
        //    if (listaAsistNuevosYMod[i].id === parseInt(id)) {
        //        listaAsistNuevosYMod.splice(i, 1);
        //        break;
        //    }
        //}
        deleteAbono[deleteAbono.length] = parseInt(id);

    } else {
        for (var j = 0; j < dataRegAbono.length; j++) {
            if (dataRegAbono[j].id === id) {
                dataRegAbono.splice(j, 1);
                break;
            }
        }
    }

    var listaAux = contruirDatosTablaAbono(dataRegAbono);
    if (listaAux.length > 0) {
        start = 0;
        if (start === 0) {
            createEditPagination(listaAux.length, "RegistroAbonos");
        }



        if (listaAux.length <= rowsByPage) {
            end = listaAux.length;
        } else {
            end = rowsByPage;
        }
        llenarTablaGen("RegistroAbonos", listaAux, start, end);
    }
    //  alert("eliminado" + ".- " + name.id);
}

function cambiarPagina(valores) {
    //alert(valores);
    var tbl = valores['origen'];
    end = rowsByPage;
    start = valores['fromPage'];
    if (dataRegAbono.length > rowsByPage) {
        var res = (rowsByPage + start) - dataRegAbono.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = dataRegAbono.length;
    }
    var listaAux = contruirDatosTablaAbono(dataRegAbono);
    llenarTablaGen("RegistroAbonos", listaAux, start, end);
}

//end metodos

function valorSelecionadoAbono() {
    BuscaAbonos();
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function BuscaAbonos() {
    if (document.getElementById("selTipoCredito").value !== "" && document.getElementById("dpkFechaSolicitud").value !== "") {
        for (var i = 0; i < listaConfigCreditos.length; i++) {
            if (parseInt(document.getElementById("selTipoCredito").value) === listaConfigCreditos[i].id) {
                tipoCredito = listaConfigCreditos[i];
                break;
            }
        }
        dataRegAbono = new Array();
        deleteAbono = new Array();
        listaAbonoEmplNewYMod = new Array();
        // dataRegCred = new Array();
        var element = document.getElementById('contTable');
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        dataRegAbono = getCreditosMovimientos(tipoCredito, document.getElementById('dpkFechaSolicitud').value);
        OpenTable(document.getElementById('contTable'));
        var dataAux = contruirDatosTablaAbono(dataRegAbono);
        if (dataAux.length) {
            if (start === 0) {
                createEditPagination(dataAux.length, "RegistroAbonos");
            }

            if (listaAux.length <= rowsByPage) {
                end = listaAux.length;
            } else {
                end = rowsByPage;
            }
            llenarTablaGen("RegistroAbonos", dataAux, start, end);
        }
        InitEventsTable();

    } else {
        var elements = document.getElementById('contTable');
        while (elements.firstChild) {
            elements.removeChild(elements.firstChild);
        }
        OpenTable(document.getElementById('contTable'));
        InitEventsTable();
    }
}

function getCreditosMovimientos(tipoCred, fecha) {
    var obj = {};
    obj.fecha = new Date(formantDdMmYyyy(fecha));
    obj.tipoConfiguracion = tipoCred.tipoConfiguracion;
    obj.idTipoCredito = tipoCred.id;
    obj.tiposMovimiento = 1;
    obj.idRazon = razonSocial.id;

    var url = route + "/api/RegistrosAbonos/getCreditoMovimientos";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        return Mensaje.resultado;

    }
}

function contruirDatosTablaAbono(datos) {
    console.log(datos);
    var datosTabla = new Array();
    for (var i = 0; i < datos.length; i++) {
        var obj = {};
        obj.id = datos[i].id;
        obj.empleados_ID = datos[i].empleados.clave;
        obj.nombreEmpleado = datos[i].empleados.nombre + " " + datos[i].empleados.apellidoPaterno + " " + datos[i].empleados.apellidoMaterno;
        obj.creditoPorEmpleado_ID = datos[i].creditoPorEmpleado.numeroCredito;
        obj.importe = datos[i].importe === null ? "" : datos[i].importe;
        // obj.observaciones = datos[i].observaciones === null ? "" : datos[i].observaciones;
        obj.saldo = datos[i].creditoPorEmpleado.saldo;
        //obj.numeroPeriodosBloquear = datos[i].numeroPeriodosBloquear;

        datosTabla[i] = obj;
    }
    return datosTabla;
}

function addCredMovAbono(valoresTabla) {
    var obj = {};
    obj.id = valoresTabla.id;
    obj.fecha = document.getElementById("dpkFechaSolicitud").value;
    obj.importe = valoresTabla.importe;
    obj.numeroPeriodosBloquear = null;
    obj.observaciones = null;
    obj.tiposMovimiento = 1;
    obj.creditoPorEmpleado_ID = valoresTabla.creditoPorEmpleado_ID;
    obj.initPeriodNom_ID = null;

    obj.statusFila = "NUEVO";

    dataRegAbono[dataRegAbono.length] = obj;
    var listaAux = contruirDatosTablaAbono(dataRegAbono);
    if (listaAux.length <= rowsByPage) {
        end = listaAux.length;
    } else {
        end = rowsByPage;
    }
    llenarTablaGen("RegistroAbonos", listaAux, start, end);
}

function actualizarCredMovAbono(valoresTabla) {
    var creditoMovimientoAux = {};
    if (parseInt(valoresTabla.id)) {
        for (var i = 0; i < dataRegAbono.length; i++) {
            if (dataRegAbono[i].id === parseInt(valoresTabla.id)) {
                creditoMovimientoAux = dataRegAbono[i];
                if (valoresTabla.creditoPorEmpleado_ID) {
                    creditoMovimientoAux.creditoPorEmpleado_ID = valoresTabla.creditoPorEmpleado_ID;
                }

                if (valoresTabla.importe) {
                    creditoMovimientoAux.importe = valoresTabla.importe;
                }

                creditoMovimientoAux.statusFila = "MODIFICADOBDS";
                dataRegAbono[i] = creditoMovimientoAux;
                break;
            }
        }
    } else {
        for (var j = 0; j < dataRegAbono.length; j++) {
            if (dataRegAbono[j].id === valoresTabla.id) {
                creditoMovimientoAux = dataRegAbono[j];
                if (valoresTabla.creditoPorEmpleado_ID) {
                    creditoMovimientoAux.creditoPorEmpleado_ID = valoresTabla.creditoPorEmpleado_ID;
                }

                if (valoresTabla.importe) {
                    creditoMovimientoAux.importe = valoresTabla.importe;
                }

                creditoMovimientoAux.statusFila = "MODIFICADOBDS";
                dataRegAbono[j] = creditoMovimientoAux;
                break;
            }
        }
    }
    var listaAux = contruirDatosTablaAbono(dataRegAbono);
    if (listaAux.length <= rowsByPage) {
        end = listaAux.length;
    } else {
        end = rowsByPage;
    }
    llenarTablaGen("RegistroAbonos", listaAux, start, end);
}

function saveCredMovAbonCred() {
    var obj = {};

    for (var i = 0; i < dataRegAbono.length; i++) {
        if (dataRegAbono[i].statusFila === "NUEVO" || dataRegAbono[i].statusFila === "MODIFICADOBDS") {
            listaAbonoEmplNewYMod[listaAbonoEmplNewYMod.length] = dataRegAbono[i];
        }
    }
    limpiarCredMovAbonAntesDeSave();
    obj["SaveUpdate"] = listaAbonoEmplNewYMod;

    if (deleteAbono.length > 0) {
        obj["Delete"] = deleteAbono;
    }

    var url = route + "/api/RegistrosAbonos/saveCreditoMovimiento";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiarCredMovAbonCred();
    } else {
        limpiarCredMovAbonCred();
    }
}

function limpiarCredMovAbonAntesDeSave() {

    for (var i = 0; i < listaAbonoEmplNewYMod.length; i++) {
        // console.log(new Date(listaAsistNuevosYMod[i].fecha));
        listaAbonoEmplNewYMod[i].empleados = undefined;
        listaAbonoEmplNewYMod[i].creditoPorEmpleado = undefined;
        listaAbonoEmplNewYMod[i].initPeriodNom = undefined;
        //listaAsistNuevosYMod[i].fecha = new Date(listaAsistNuevosYMod[i].fecha);
        delete listaAbonoEmplNewYMod[i].statusFila;
        if (!Number.isInteger(listaAbonoEmplNewYMod[i].id)) {
            listaAbonoEmplNewYMod[i].id = 0;
        }
    }

}

function limpiarCredMovAbonCred() {
    tipoCredito = null;
    deleteAbono = [];
    listaAbonoEmplNewYMod = [];
    dataRegAbono = [];
    document.getElementById("selTipoCredito").value = "";
    var element = document.getElementById('contTable');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();

}