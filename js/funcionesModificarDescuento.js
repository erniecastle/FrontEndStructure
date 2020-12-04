var tipoPantalla;
var fechaSistemasRegDesc;
var razonSocial;
var listaConfigCreditos = new Array();
var tipoCredito = null;
var dataRegDesc = new Array();
var deleteDesc = new Array();
var listaDescEmplNewYMod = new Array();
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
            document.getElementById("lblTipoPrestamo").innerHTML = idiomaSelecionadoCol.messageFormatter("AhorroTipoAhorro")();
        }
    }
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    razonSocial = getRazonSocial();
    fechaSistemasRegDesc = getFechaSistema();
    var fecha = formatDate(fechaSistemasRegDesc);
    document.getElementById("dpkFecha").value = fecha;
    getConfigCreditosDesc();

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

function getConfigCreditosDesc() {
    var obj = {};
    obj.claveRazon = razonSocial.clave;

    obj.tipoConfiguracion = tipoPantalla;

    var url = route + "/api/ModificarDescuento/getConfigCreditos";
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
    var fecha = formatDatemmddyyy(fechaSistemasRegDesc);
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
    //nameCols = "No. de credito,Saldo inicial,Monto descuento,Saldo actual";
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
    if (tipoPantalla === "1") {
         tituloSel = "Credito";
    } else {
         tituloSel = "Ahorro";
    }
    
    var tamañoSel = "size-4";
    var fecha = new Date(formantDdMmYyyy(document.getElementById("dpkFecha").value));
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
    nombreDatoSecu = "montoDescuento";
    datoSecundario = obj[3];
    if (classNameBlur) {
        //setValueAt(renglon);
        var tdClave = renglon.querySelector("td[persist=creditoPorEmpleado_ID]");
        var txtclave = tdClave.firstElementChild.firstElementChild;
        tdClave.appendChild(document.createTextNode(txtclave.value));
        txtclave.value = "";
        tdClave.firstElementChild.style.display = "none";

        var tddescripcion = renglon.querySelector("td[persist=montoDescuento]");
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

//metodos para la tablas
function editTableModificarDescuento() {
    var nameTable = "ModificarDescuento";
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

    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("CrediAhorrDescuentoActual")(), "nombreCompo": "DescuentoActual", "editable": false, "tipoCompon": "text", "persist": "montoDescuento", "ancho": "100px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CrediAhorrDescuento")(), "nombreCompo": "Descuento", "editable": true, "tipoCompon": "text", "persist": "importe", "ancho": "140px" });

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
        $('#' + valores[1]).append($clone);
        var edit = document.getElementById(valores[1]).querySelectorAll(".edit");
        if (edit) {
            for (var i = 0; i < edit.length; i++) {
                edit[i].removeAttribute("value");
                edit[i].querySelector(".editKey").value = "";
            }
        }
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
        } else if (tr.cells[i].getAttribute('persist') === "numeroCredito") {
            obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
        }
    }

    if (tr.id === "") {
        var rString = "id" + randomString(2, '0123456789');
        obj['id'] = rString;
        tr.id = obj.id;
        addCredMovDesc(obj);
    } else {
        obj['id'] = tr.id;
       actualizarCredMovDesc(obj);
    }

}

function tableRemove(registro) {

    var id = registro.id;
    if (parseInt(id)) {
        for (var i = 0; i < dataRegDesc.length; i++) {
            if (dataRegDesc[i].id === parseInt(id)) {
                dataRegDesc.splice(i, 1);
                break;
            }
        }
         deleteDesc[deleteDesc.length] = parseInt(id);

    } else {
        for (var j = 0; j < dataRegDesc.length; j++) {
            if (dataRegDesc[j].id === id) {
                dataRegDesc.splice(j, 1);
                break;
            }
        }
    }
    var listaAux = contruirDatosTablaDesc(dataRegDesc);
    if (listaAux.length > 0) {
        start = 0;
        if (start === 0) {
            createEditPagination(listaAux.length, "ModificarDescuento");
        }



        if (listaAux.length <= rowsByPage) {
            end = listaAux.length;
        } else {
            end = rowsByPage;
        }
        llenarTablaGen("ModificarDescuento", listaAux, start, end);
    }
}

function cambiarPagina(valores) {
    //alert(valores);
    var tbl = valores['origen'];
    end = rowsByPage;
    start = valores['fromPage'];
    if (dataRegDesc.length > rowsByPage) {
        var res = (rowsByPage + start) - dataRegCarg.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = dataRegDesc.length;
    }
    var listaAux = contruirDatosTablaDesc(dataRegDesc);
    llenarTablaGen("ModificarDescuento", listaAux, start, end);
}
//end metodos tabla

function valorSelecionadoDescu() {
    BuscarDescuentos();
}

function BuscarDescuentos() {
    if (document.getElementById("selTipoCredito").value !== "" && document.getElementById("dpkFecha").value !== "") {
        for (var i = 0; i < listaConfigCreditos.length; i++) {
            if (parseInt(document.getElementById("selTipoCredito").value) === listaConfigCreditos[i].id) {
                tipoCredito = listaConfigCreditos[i];
                break;
            }
        }
        dataRegDesc = new Array();
        deleteDesc = new Array();
        listaDescEmplNewYMod = new Array();
        // dataRegCred = new Array();
        var element = document.getElementById('contTable');
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        dataRegDesc = getCreditosMovimientos(tipoCredito, document.getElementById('dpkFecha').value);
        OpenTable(document.getElementById('contTable'));
        var dataAux = contruirDatosTablaDesc(dataRegDesc);
        if (dataAux.length) {
            if (start === 0) {
                createEditPagination(dataAux.length, "ModificarDescuento");
            }

            if (listaAux.length <= rowsByPage) {
                end = listaAux.length;
            } else {
                end = rowsByPage;
            }
            llenarTablaGen("ModificarDescuento", dataAux, start, end);
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
    obj.tiposMovimiento = 2;
    obj.idRazon = razonSocial.id;

    var url = route + "/api/ModificarDescuento/getCreditoMovimientos";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        return Mensaje.resultado;

    }
}

function contruirDatosTablaDesc(datos) {
    var datosTabla = new Array();
    for (var i = 0; i < datos.length; i++) {
        var obj = {};
        obj.id = datos[i].id;
        obj.empleados_ID = datos[i].empleados.clave;
        obj.nombreEmpleado = datos[i].empleados.nombre + " " + datos[i].empleados.apellidoPaterno + " " + datos[i].empleados.apellidoMaterno;
        obj.creditoPorEmpleado_ID = datos[i].creditoPorEmpleado.numeroCredito;
        obj.importe = datos[i].importe === null ? "" : datos[i].importe;
        // obj.observaciones = datos[i].observaciones === null ? "" : datos[i].observaciones;
        obj.montoDescuento = datos[i].creditoPorEmpleado.montoDescuento;
        //obj.numeroPeriodosBloquear = datos[i].numeroPeriodosBloquear;

        datosTabla[i] = obj;
    }
    return datosTabla;
}

function addCredMovDesc(valoresTabla) {
    var obj = {};
    obj.id = valoresTabla.id;
    obj.fecha = document.getElementById("dpkFecha").value;
    obj.importe = valoresTabla.importe;
    obj.numeroPeriodosBloquear = null;
    obj.observaciones = null;
    obj.tiposMovimiento = 2;
    obj.creditoPorEmpleado_ID = valoresTabla.creditoPorEmpleado_ID;
    obj.initPeriodNom_ID = null;

    obj.statusFila = "NUEVO";

    dataRegDesc[dataRegDesc.length] = obj;
    var listaAux = contruirDatosTablaDesc(dataRegDesc);
    if (listaAux.length <= rowsByPage) {
        end = listaAux.length;
    } else {
        end = rowsByPage;
    }
    llenarTablaGen("ModificarDescuento", listaAux, start, end);
}

function actualizarCredMovDesc(valoresTabla) {
    var creditoMovimientoAux = {};
    if (parseInt(valoresTabla.id)) {
        for (var i = 0; i < dataRegDesc.length; i++) {
            if (dataRegDesc[i].id === parseInt(valoresTabla.id)) {
                creditoMovimientoAux = dataRegDesc[i];
                if (valoresTabla.creditoPorEmpleado_ID) {
                    creditoMovimientoAux.creditoPorEmpleado_ID = valoresTabla.creditoPorEmpleado_ID;
                }

                if (valoresTabla.importe) {
                    creditoMovimientoAux.importe = valoresTabla.importe;
                }

                creditoMovimientoAux.statusFila = "MODIFICADOBDS";
                dataRegDesc[i] = creditoMovimientoAux;
                break;
            }
        }
    } else {
        for (var j = 0; j < dataRegDesc.length; j++) {
            if (dataRegDesc[j].id === valoresTabla.id) {
                creditoMovimientoAux = dataRegDesc[j];
                if (valoresTabla.creditoPorEmpleado_ID) {
                    creditoMovimientoAux.creditoPorEmpleado_ID = valoresTabla.creditoPorEmpleado_ID;
                }

                if (valoresTabla.importe) {
                    creditoMovimientoAux.importe = valoresTabla.importe;
                }

                creditoMovimientoAux.statusFila = "MODIFICADOBDS";
                dataRegDesc[j] = creditoMovimientoAux;
                break;
            }
        }
    }
    var listaAux = contruirDatosTablaDesc(dataRegDesc);
    if (listaAux.length <= rowsByPage) {
        end = listaAux.length;
    } else {
        end = rowsByPage;
    }
    llenarTablaGen("ModificarDescuento", listaAux, start, end);
}

function saveCredMovDescCred() {
    var obj = {};

    for (var i = 0; i < dataRegDesc.length; i++) {
        if (dataRegDesc[i].statusFila === "NUEVO" || dataRegDesc[i].statusFila === "MODIFICADOBDS") {
            listaDescEmplNewYMod[listaDescEmplNewYMod.length] = dataRegDesc[i];
        }
    }
    limpiarCredMovDescAntesDeSave();
    obj["SaveUpdate"] = listaDescEmplNewYMod;

    if (deleteDesc.length > 0) {
        obj["Delete"] = deleteDesc;
    }

    var url = route + "/api/ModificarDescuento/saveCreditoMovimiento";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiarCredMovDescCred();
    } else {
        limpiarCredMovDescCred();
    }
}

function limpiarCredMovDescAntesDeSave() {

    for (var i = 0; i < listaDescEmplNewYMod.length; i++) {
        // console.log(new Date(listaAsistNuevosYMod[i].fecha));
        listaDescEmplNewYMod[i].empleados = undefined;
        listaDescEmplNewYMod[i].creditoPorEmpleado = undefined;
        listaDescEmplNewYMod[i].initPeriodNom = undefined;
        //listaAsistNuevosYMod[i].fecha = new Date(listaAsistNuevosYMod[i].fecha);
        delete listaDescEmplNewYMod[i].statusFila;
        if (!Number.isInteger(listaDescEmplNewYMod[i].id)) {
            listaDescEmplNewYMod[i].id = 0;
        }
    }

}

function limpiarCredMovDescCred() {
    tipoCredito = null;
    deleteDesc = [];
    listaDescEmplNewYMod = [];
    dataRegDesc = [];
    document.getElementById("selTipoCredito").value = "";
    var element = document.getElementById('contTable');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();


}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}