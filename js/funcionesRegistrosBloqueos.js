var fechaSistemasRegBloq;
var razonSocialActual;
var listaConfigCreditos = new Array();
var tipoCredito = null;
var dataRegBloq = new Array();
var deleteBloqueos = new Array();
var listaBloqEmplNewYMod = new Array();
var empleados;
var tipoNomina;
var ejercicio;
var fechaInicial;
var fechaFinal;
var tipoPantalla;
var start = 0;
var end = 10;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    var query = getParameterByName('screen');
    if (query !== "") {
       // displayAsistencia(query);
    } else {
        var obj = JSON.parse($("#container").data("opener"));
        query = obj.tipoCaptura + "|" + obj.IdScreen + "|" + obj.config;
        value = query.split('|');
        tipoPantalla = value[2];
        if (tipoPantalla === "2") {
            document.getElementById("lblTipoPrestamo").innerHTML = idiomaSelecionadoCol.messageFormatter("AhorroTipoAhorro")();;
        }
    }
   
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
   fechaSistemasRegBloq = getFechaSistema();
   ejercicio = new Date(fechaSistemasRegBloq).getFullYear();
    //console.log(ejercicio);
   var fecha = formatDate(fechaSistemasRegBloq);
   document.getElementById("dpkFecha").value = fecha;
    getRazonSocialActualRegBloq();
    getConfigCreditosBloq();
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

function getRazonSocialActualRegBloq() {
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);

    var url = route + "/api/RegistrosBloqueos/getRazonSocialPorID";
    var dataToPost = JSON.stringify(razon.clave);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        razonSocialActual = Mensaje.resultado;
    }
    // console.log(razonSocialActual);
    // return razonSocialActual;

}

function getConfigCreditosBloq() {
    var obj = {};
    obj.claveRazon = razonSocialActual.clave;
   
    obj.tipoConfiguracion = tipoPantalla;

    var url = route + "/api/RegistrosBloqueos/getConfigCreditos";
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

    // console.log(listaConfigCreditos);
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

    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razonSocialActual.id };
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    // //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecial";

    //var camposWhereEsp = "";
   /// var valoreswhereEsp = [razonSocialActual.clave, null, fechaSistemasRegBloq, fechaSistemasRegBloq];
    var fecha = formatDatemmddyyy(fechaSistemasRegBloq);
    var valoreswhereEsp = [razonSocialActual.clave, null, new Date(fecha), new Date(fecha)];
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
    tipoNomina = obj[0];
    idResult = empleados.id;
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

function setEditNocreditoDetalle() {
    nameCmp = "EditNocreditoDetalle";
    table = "CreditoPorEmpleado";
    if (tipoPantalla === "1") {
        nameCols = idiomaSelecionadoCol.messageFormatter("CreditoNumCred")() + "," + idiomaSelecionadoCol.messageFormatter("CrediAhorrSaldoInicial")() + "," +
            idiomaSelecionadoCol.messageFormatter("CrediAhorrMontoDesc")();
    } else {
        nameCols = idiomaSelecionadoCol.messageFormatter("AhorroNumAhorr")() + "," + idiomaSelecionadoCol.messageFormatter("CrediAhorrSaldoInicial")() + "," +
            idiomaSelecionadoCol.messageFormatter("CrediAhorrMontoDesc")();
    }
    // nameCols = "No. de credito,Saldo inicial,Monto descuento"/*,Saldo actual"*/;
   /* var subCampo = "@(select CASE WHEN (cr.tipoConfiguracion = '1') then (totalCredito + (select CASE WHEN (COUNT(*) = 0 ) THEN 0.0 ELSE" +
    " (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END)) END FROM CreditoMovimientos c where c.creditoPorEmpleado.id = o.id" +
    " AND c.tiposMovimiento = 2)) - (select CASE WHEN (COUNT(*) = 0 ) THEN 0.0 ELSE (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END))"+
    " END FROM CreditoMovimientos c where c.creditoPorEmpleado.id = o.id AND (c.tiposMovimiento = 0 or c.tiposMovimiento = 4)) else ((select CASE WHEN " +
    " (COUNT(*) = 0 ) THEN 0.0 ELSE (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END)) END FROM CreditoMovimientos c where " + 
    " c.creditoPorEmpleado.id = o.id AND (c.tiposMovimiento = 0 or c.tiposMovimiento = 4))) - (select CASE WHEN (COUNT(*) = 0 ) THEN 0.0 ELSE" +
    " (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END)) END FROM CreditoMovimientos c where c.creditoPorEmpleado.id = o.id AND" +
    " c.tiposMovimiento = 2) end FROM CreditoPorEmpleado  c, CreditoAhorro cr where c.creditoAhorro.id=cr.id and c.id = o.id)";*/
    campos = "numeroCredito,totalCredito,montoDescuento"/* + subCampo*/;
    camposObtener = "numeroCredito,totalCredito,montoDescuento";
    var subEntities = "empleados,razonesSociales,creditoAhorro";
    camposMostrar = ["numeroCredito", "montoDescuento"];
    var fecha = new Date(formantDdMmYyyy(document.getElementById("dpkFecha").value));
    var preFilters = { "empleados.clave":empleados.clave, "razonesSociales.clave": razonSocialActual.clave , "creditoAhorro.clave":tipoCredito.clave ,
        "creditoAhorro.tipoConfiguracion": tipoCredito.tipoConfiguracion, "fechaAutorizacion#<=": fecha, "fechaVence#>=": fecha
    };
    var tituloSel = "";
    var tamañoSel = "size-4";
    if (tipoPantalla === "1") {
        tituloSel = "credito";
    } else {
        tituloSel = "Ahorro";
    }
    // //todo esto es para el query especiales
   // var queryEspecial = "QueryEmpleadoEspecial";

    //var camposWhereEsp = "";
    //var valoreswhereEsp = [razonSocialActual.clave, null, fechaSistemasRegBloq, fechaSistemasRegBloq];


    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditNocreditoDetalleShow(value) {
    if (classNameBlur) {
        var tdClave = renglon.querySelector("td[persist=creditoPorEmpleado_ID]");
        var txtclave = tdClave.firstElementChild.firstElementChild;
        tdClave.appendChild(document.createTextNode(txtclave.value));
        txtclave.value = "";
        tdClave.firstElementChild.style.display = "none";
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

function setEditBloquearDetalle() {

    //Parameters
    nameCmp = "EditBloquearDetalle";
    table = "PeriodosNomina";
    nameCols = "No. periodo ,Descripción,Año";
    campos = "clave,descripcion,año";
    camposObtener = "clave,descripcion,año,fechaAsistenciInicial,fechaAsistenciaFinal,status";
    var subEntities = "tipoNomina";
    camposMostrar = ["clave", "descripcion"];

    var id = tipoNomina.id;
    var preFilters = { "tipoNomina.id": id, "año": ejercicio };

    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de plaza", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
         typeof camposObtener === 'undefined' ? null : camposObtener);
}

function setEditBloquearDetalleShow(value) {
    if (value !== null) {
        var obj = value[0];
        periodoNomina = value[0];
        idResult = periodoNomina.Id;
        nombreDatoSecu = "descripcionPerNom";
        datoSecundario = periodoNomina.Descripcion;

        if (classNameBlur) {
            var tdClave = renglon.querySelector("td[persist=initPeriodNom_ID]");
            var txtclave = tdClave.firstElementChild.firstElementChild;
            tdClave.appendChild(document.createTextNode(txtclave.value));
            txtclave.value = "";
            tdClave.firstElementChild.style.display = "none";
            var tddescripcion = renglon.querySelector("td[persist=descripcionPerNom]");
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

        fechaInicial = periodoNomina.FechaAsistenciInicial;
        fechaFinal = periodoNomina.FechaAsistenciaFinal;

    }
}


/////metodos para la tabla
function editTableRegistroBloqueos() {

    var nameTable = "RegistroBloqueos";
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
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("AhorroNumAhorr")(), "nombreCompo": "Nocredito", "editable": true, "tipoCompon": "editConsulta", "persist": "creditoPorEmpleado_ID", "ancho": "130px", "funcion": "" });
    } else {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("CreditoNumCred")(), "nombreCompo": "Nocredito", "editable": true, "tipoCompon": "editConsulta", "persist": "creditoPorEmpleado_ID", "ancho": "130px", "funcion": "" });
    }
    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblEjercicio")(), "nombreCompo": "Ejercicio", "editable": true, "tipoCompon": "text", "persist": "ejercicio", "ancho": "100px", "funcion": "" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblBloquear")(), "nombreCompo": "Bloquear", "editable": true, "tipoCompon": "editConsulta", "persist": "initPeriodNom_ID", "ancho": "140px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblDescripcion")(), "nombreCompo": "Descripcion", "editable": false, "tipoCompon": "text", "persist": "descripcionPerNom", "ancho": "300px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblNumPer")(), "nombreCompo": "Noperiodo", "editable": true, "tipoCompon": "text", "persist": "numeroPeriodosBloquear", "ancho": "100px", "funcion": "" });
    return columnasTabla;
}

function tableAdd(valores) {
    var exito = true;
    if (valores.length === 3) {
        //var rString = "id" + randomString(2, '0123456789');
        //valores[2].id = rString;
        var trUltimo;
        if (typeof valores[2] !== 'undefined') {
            trUltimo = $(valores[2]).nextAll('tr:last')[0];
            for (var j = 0; j < valores[2].cells.length; j++) {
                if (valores[2].cells[j].getAttribute('contenteditable') === "true") {
                    if (valores[2].cells[j].innerText === "") {
                        exito = false;
                        break;
                    }
                }
            }
            if (exito) {
                construirObj(valores[2]);
            }
        }



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
        agregarCredMovimientoBloq(obj);
    } else {
        obj['id'] = tr.id;
        actualizarCredMovimientoBloq(obj);
    }

}

function tableRemove(registro) {

    var id = registro.id;
    if (parseInt(id)) {
        for (var i = 0; i < dataRegBloq.length; i++) {
            if (dataRegBloq[i].id === parseInt(id)) {
                dataRegBloq.splice(i, 1);
                break;
            }
        }
        //for (var i = 0; i < listaAsistNuevosYMod.length; i++) {
        //    if (listaAsistNuevosYMod[i].id === parseInt(id)) {
        //        listaAsistNuevosYMod.splice(i, 1);
        //        break;
        //    }
        //}
        deleteBloqueos[deleteBloqueos.length] = parseInt(id);

    } else {
        for (var j = 0; j < dataRegBloq.length; j++) {
            if (dataRegBloq[j].id === id) {
                dataRegBloq.splice(j, 1);
                break;
            }
        }
    }
    var listaAux = contruirDatosTabla(dataRegBloq);
    if (listaAux.length > 0) {
        start = 0;
        if (start === 0) {
            createEditPagination(listaAux.length, "RegistroBloqueos");
        }



        if (listaAux.length <= rowsByPage) {
            end = listaAux.length;
        } else {
            end = rowsByPage;
        }
        llenarTablaGen("RegistroBloqueos", listaAux, start, end);
    }

    //  alert("eliminado" + ".- " + name.id);
}

function cambiarPagina(valores) {
    //alert(valores);
    var tbl = valores['origen'];
    end = rowsByPage;
    start = valores['fromPage'];
    if (dataRegCred.length > rowsByPage) {
        var res = (rowsByPage + start) - dataRegCred.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = dataRegCred.length;
    }
    var listaAux = contruirDatosTabla(dataRegBloq);
    llenarTablaGen("RegistroBloqueos", listaAux, start, end);
}

//end metodos
function valorSelecionado() {
    BuscaBloqueo();
}

function BuscaBloqueo() {
    if (document.getElementById("selTipoCredito").value !== "" && document.getElementById("dpkFecha").value !== "") {
        for (var i = 0; i < listaConfigCreditos.length; i++) {
            if (parseInt(document.getElementById("selTipoCredito").value) === listaConfigCreditos[i].id) {
                tipoCredito = listaConfigCreditos[i];
                break;
            }
        }
        dataRegBloq = new Array();
        deleteBloqueos = new Array();
        listaBloqEmplNewYMod = new Array();
        dataRegCred = new Array();
        var element = document.getElementById('contTable');
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        dataRegBloq = getCreditosMovimientos(tipoCredito, document.getElementById('dpkFecha').value);
        OpenTable(document.getElementById('contTable'));
        var dataAux = contruirDatosTabla(dataRegBloq);
        if (dataAux.length) {
            if (start === 0) {
                createEditPagination(dataAux.length, "RegistroBloqueos");
            }

            if (listaAux.length <= rowsByPage) {
                end = listaAux.length;
            } else {
                end = rowsByPage;
            }
            llenarTablaGen("RegistroBloqueos", dataAux, start, end);
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

function getCreditosMovimientos(tipoCred,fecha) {
    var obj = {};
    obj.fecha = new Date(formantDdMmYyyy(fecha));
    obj.tipoConfiguracion = tipoCred.tipoConfiguracion;
    obj.idTipoCredito = tipoCred.id;
    obj.tiposMovimiento = 4;
    obj.idRazon = razonSocialActual.id;

    var url = route + "/api/RegistrosBloqueos/getCreditoMovimientos";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        return Mensaje.resultado;
        
    }
}

function contruirDatosTabla(datos) {
    console.log(datos);
    var datosTabla = new Array();
    for (var i = 0; i < datos.length; i++) {
        var obj = {};
        obj.id = datos[i].id;
        obj.empleados_ID = datos[i].empleados.clave;
        obj.nombreEmpleado = datos[i].empleados.nombre + " " + datos[i].empleados.apellidoPaterno + " " + datos[i].empleados.apellidoMaterno;
        obj.creditoPorEmpleado_ID = datos[i].creditoPorEmpleado.numeroCredito;
        obj.ejercicio = datos[i].initPeriodNom.año;
        obj.initPeriodNom_ID = datos[i].initPeriodNom.clave;
        obj.descripcionPerNom = datos[i].initPeriodNom.descripcion;
        obj.numeroPeriodosBloquear = datos[i].numeroPeriodosBloquear;

        datosTabla[i] = obj;
    }
    return datosTabla;
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function agregarCredMovimientoBloq(valoresTabla) {
    var obj = {};
    obj.id = valoresTabla.id;
    obj.fecha = document.getElementById("dpkFecha").value;
    obj.importe = null;
    obj.numeroPeriodosBloquear = valoresTabla.numeroPeriodosBloquear;
    obj.observaciones = null;
    obj.tiposMovimiento = 4;
    obj.creditoPorEmpleado_ID = valoresTabla.creditoPorEmpleado_ID;
    obj.initPeriodNom_ID = valoresTabla.initPeriodNom_ID;

    obj.statusFila = "NUEVO";

    dataRegBloq[dataRegBloq.length] = obj;
    var listaAux = contruirDatosTabla(dataRegBloq);
    if (listaAux.length <= rowsByPage) {
        end = listaAux.length;
    } else {
        end = rowsByPage;
    }
    llenarTablaGen("RegistroBloqueos", listaAux, start, end);
  //  console.log(obj);
}

function actualizarCredMovimientoBloq(valoresTabla) {

    var creditomovimientoAux = {};
    if (parseInt(valoresTabla.id)) {
        for (var i = 0; i < dataRegBloq.length; i++) {
            if (dataRegBloq[i].id === parseInt(valoresTabla.id)) {
                creditomovimientoAux = dataRegBloq[i];
                if(valoresTabla.numeroPeriodosBloquear){
                    creditomovimientoAux.numeroPeriodosBloquear = valoresTabla.numeroPeriodosBloquear;
                }

                if (valoresTabla.creditoPorEmpleado_ID) {
                    creditomovimientoAux.creditoPorEmpleado_ID = valoresTabla.creditoPorEmpleado_ID;
                }

                if(valoresTabla.initPeriodNom_ID){
                    creditomovimientoAux.initPeriodNom_ID = valoresTabla.initPeriodNom_ID;
                }
                creditomovimientoAux.statusFila = "MODIFICADOBDS";
                dataRegBloq[i] = creditomovimientoAux;
              //  console.log(creditomovimientoAux);
                break;
            }
        }
    } else {
        for (var j = 0; j < dataRegBloq.length; j++) {
            if (dataRegBloq[j].id === valoresTabla.id) {
                creditomovimientoAux = dataRegBloq[j];
                if (valoresTabla.numeroPeriodosBloquear) {
                    creditomovimientoAux.numeroPeriodosBloquear = valoresTabla.numeroPeriodosBloquear;
                }

                if (valoresTabla.creditoPorEmpleado_ID) {
                    creditomovimientoAux.creditoPorEmpleado_ID = valoresTabla.creditoPorEmpleado_ID;
                }

                if (valoresTabla.initPeriodNom_ID) {
                    creditomovimientoAux.initPeriodNom_ID = valoresTabla.initPeriodNom_ID;
                }
                creditomovimientoAux.statusFila = "MODIFICADOBDS";
                dataRegBloq[j] = creditomovimientoAux;
               // console.log(creditomovimientoAux);
                break;
            }
        }
    }

    var listaAux = contruirDatosTabla(dataRegBloq);
    if (listaAux.length <= rowsByPage) {
        end = listaAux.length;
    } else {
        end = rowsByPage;
    }
    llenarTablaGen("RegistroBloqueos", listaAux, start, end);
}

function saveCredMovBloq() {
    var obj = {};

    for (var i = 0; i < dataRegBloq.length; i++) {
        if (dataRegBloq[i].statusFila === "NUEVO" || dataRegBloq[i].statusFila === "MODIFICADOBDS") {
            listaBloqEmplNewYMod[listaBloqEmplNewYMod.length] = dataRegBloq[i];
        }
    }
    limpiarCredMovAntesDeSave();
    obj["SaveUpdate"] = listaBloqEmplNewYMod;

    if (deleteBloqueos.length > 0) {
        obj["Delete"] = deleteBloqueos;
    }

    var url = route + "/api/RegistrosBloqueos/saveCreditoMovimiento";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiarCredMov();
    } else {
        limpiarCredMov();
    }
}

function limpiarCredMovAntesDeSave() {

    for (var i = 0; i < listaBloqEmplNewYMod.length; i++) {
        // console.log(new Date(listaAsistNuevosYMod[i].fecha));
        listaBloqEmplNewYMod[i].empleados = undefined;
        listaBloqEmplNewYMod[i].creditoPorEmpleado = undefined;
        listaBloqEmplNewYMod[i].initPeriodNom = undefined;
        //listaAsistNuevosYMod[i].fecha = new Date(listaAsistNuevosYMod[i].fecha);
        delete listaBloqEmplNewYMod[i].statusFila;
        if (!Number.isInteger(listaBloqEmplNewYMod[i].id)) {
            listaBloqEmplNewYMod[i].id = 0;
        }
    }

}

function limpiarCredMov() {
    tipoCredito = null;
    deleteBloqueos = [];
    listaBloqEmplNewYMod = [];
    dataRegBloq = [];
    tipoNomina = {};
    periodoNomina = {};
    document.getElementById("selTipoCredito").value = "";
    var element = document.getElementById('contTable');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();

}