var obj = {};
var serieRazonSocial = null;
var tipoCorrida = null;
var claveTipoNomina = null;
var tipoNomina = null;
var PeriodoNomina = null;
var Empleado = null;
var start = 0;
var end = 10;
var razonSocialActual;
var listaEmpleados = new Array();
var listaEmpleadosGenerados = new Array();
var dataEnvEmpleados = null;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
  
    
    var query = getParameterByName('screen');
    if (query !== "") {
        inicializaCfg(query);
    } else {
        var obj = JSON.parse($("#container").data("opener"));
        query = obj.tipoCaptura + "|" + obj.IdScreen + "|" + obj.config;
        value = query.split('|');
        inicializaCfg(value[2]);
    }

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
function inicializaCfg(id) {
    showWait();
    getRazonSocialActual();
    
    removeWait();
}
function getRazonSocialActual() {
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);

    var url = route + "/api/CFDIEmpleado/RazonSocialPorID";
    var dataToPost = JSON.stringify(razon.id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        razonSocialActual = Mensaje.resultado;
    }
}
function setEditDeTipoCorrida() {

    //Parameters
    nameCmp = "EditTipoDeCorrida";
    table = "TipoCorrida";
    nameCols = idiomaSelecionadoCol.messageFormatter("TipoCorridaclave")() + "," + idiomaSelecionadoCol.messageFormatter("TipoCorridadescripcion")();
    //nameCols = "Clave,Descripción";
    campos = "clave,descripcion";//Quit ID;
    camposObtener = "clave,descripcion";
    //var subEntities = "periodicidad"; //Unnecesary
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Tipo corrida";
    var tamañoSel = "size-2";

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);


}
function setEditDeTipoCorridaShow(value) {
    if (value !== null) {
        //    
    }
}
function setEditTipoNomina() {
    nameCmp = "EditTipoNomina";
    table = "TipoNomina";
    nameCols = idiomaSelecionadoCol.messageFormatter("TipoNominaclave")() + "," + idiomaSelecionadoCol.messageFormatter("TipoNominadescripcion")() + "," + idiomaSelecionadoCol.messageFormatter("Periodicidad")();
    //nameCols = "Clave,Descripcón,Periodicidad";
    campos = "clave,descripcion,periodicidad.descripcion";//Quit ID;
    camposObtener = "clave,descripcion,periodicidad.descripcion";
    var subEntities = "periodicidad"; //Unnecesary
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Tipo Nomina";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}
function setEditTipoNominaShow(value) {
    if (value !== null) {
        var obj = value[0];
        claveTipoNomina = obj.Clave;
    }
}
function setEditPeriodoNomina() {
    //Parameters
    nameCmp = "EditPeriodoNomina";
    table = "PeriodosNomina";
    nameCols = idiomaSelecionadoCol.messageFormatter("PeriodosNominaClave")() + "," + idiomaSelecionadoCol.messageFormatter("PeriodosNominaDescripcion")() + ","
        + idiomaSelecionadoCol.messageFormatter("PeriodosNominaFechaInicial")() + "," + idiomaSelecionadoCol.messageFormatter("PeriodosNominaFechaFinal")() + "," +
        idiomaSelecionadoCol.messageFormatter("PeriodosNominaFechaCierre")();
    //nameCols = "Clave,Descripción,Fecha inicial, Fecha final, Fecha cierre";
    campos = "clave,descripcion,Date:fechaInicial,Date:fechaFinal,Date:fechaCierre";
    camposObtener = "clave,descripcion,año,fechaInicial,fechaFinal,status";
    var subEntities = "tipoNomina";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Periodos Nomina";
    var tamañoSel = "size-8";

    var id = parseInt(document.getElementById('editTipoNomina').getAttribute("value"));
    var preFilters = { "tipoNomina.id": id, "status": true };

    

    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de plaza", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}
function setEditPeriodoNominaShow(value) {
    if (value !== null) {
        var obj = value[0];
        fechaInicial = formatDateddmmyyy(new Date(obj.FechaInicial));
        fechaFinal = formatDateddmmyyy(new Date(obj.FechaFinal));
        document.getElementById('txtFechaIni').value = formatDatemmddyyy(new Date(obj.FechaInicial));
        document.getElementById('txtFechaFin').value = formatDatemmddyyy(new Date(obj.FechaFinal));

    }
}
function setEditCentroCosto() {
    nameCmp = "EditCentroCosto";
    table = "CentroDeCosto";
    nameCols = idiomaSelecionadoCol.messageFormatter("CentroDeCostoclave")() + "," + idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcion")() + "," +
        idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcionPrevia")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronal")();
    //nameCols = "Clave,Descripción,Nombre abreviado, Registro patronal";
    campos = "clave,descripcion,descripcionPrevia,registroPatronal.nombreregtpatronal";
    var subEntities = "registroPatronal,razonesSociales";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion";
    var tituloSel = "Centro de costo";
    var tamañoSel = "size-2";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };

    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de Centro de costos", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre de Centro de costos", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}
function setEditCentroCostoShow(value) {
    if (value !== null) {
        //
    }
}
function setEditDelEmpleado() {

    //Parameters
    nameCmp = "EditDelEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols = "()idEmpleado," + idiomaSelecionadoCol.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.id,plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "[]plazasPorEmpleado.empleados.id,[]plazasPorEmpleado.empleados.clave,[]plazasPorEmpleado.empleados.nombre,[]plazasPorEmpleado.empleados.apellidoPaterno,[]plazasPorEmpleado.empleados.apellidoMaterno";
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre"];

    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": getRazonSocial().id
        
    };

    //Fechas en base al periodo
    if (document.getElementById("editPeriodo").getAttribute("value")) {
        var fechaDeFilter = new Date(fechaInicial);
        var fechaDeFilter2 = new Date(fechaDeFilter.getFullYear(), fechaDeFilter.getMonth(), fechaDeFilter.getDate(), 0, 0, 0, 0);


        var fechaAFilter = new Date(fechaFinal);
        var fechaAFilter2 = new Date(fechaAFilter.getFullYear(), fechaAFilter.getMonth(), fechaAFilter.getDate(), 0, 0, 0, 0);



        preFilters["@BETWEEN1"] = [
            "(( o.fechaInicial <= :PB1) OR ( o.fechaInicial BETWEEN :PB1 AND :PB2 ))",
            "PB1", fechaDeFilter, "PB2", fechaAFilter];

        preFilters["@BETWEEN2"] = [
            "(( o.plazasPorEmpleado.fechaFinal >= :PB3  )  OR (o.plazasPorEmpleado.fechaFinal BETWEEN :PB4 AND :PB3))",
            "PB3", fechaAFilter, "PB4", fechaDeFilter];
    }

    //Centro de costo
    if (document.getElementById("editCentroCostos").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroCostos").getAttribute("value");
    }
    
    //Tipo de nomina
    if (document.getElementById("editTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editTipoNomina").getAttribute("value");
    }

    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave del empleado", "tipo": "string", "campo": "plazasPorEmpleado.empleados.clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre del empleado", "tipo": "string", "campo": "plazasPorEmpleado.empleados.nombre", "medida": "m" };

    var optionals = new Object();
    //Group will be always acompanied of an Order
    optionals["camposGroup"] = campos;
    optionals["camposOrden"] = ["plazasPorEmpleado.empleados.clave"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-6";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}
function setEditDelEmpleadoShow(value) {
    if (value !== null) {
        var obj = value[0];
        var nombreCompleto = obj[4] + " " + obj[5] + " " + obj[3];
        var edit = document.getElementById("edDelEmpleado");
        var txtDescripcion = edit.children[1];
        txtDescripcion.value = nombreCompleto;

    }

}
function setEditAlEmpleado() {
    //Parameters
    nameCmp = "EditAlEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols = "()idEmpleado," + idiomaSelecionadoCol.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.id,plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "[]plazasPorEmpleado.empleados.id,[]plazasPorEmpleado.empleados.clave,[]plazasPorEmpleado.empleados.nombre,[]plazasPorEmpleado.empleados.apellidoPaterno,[]plazasPorEmpleado.empleados.apellidoMaterno";
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre"];

    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": getRazonSocial().id

    };

    //Fechas en base al periodo
    if (document.getElementById("editPeriodo").getAttribute("value")) {
        var fechaDeFilter = new Date(fechaInicial);
        var fechaDeFilter2 = new Date(fechaDeFilter.getFullYear(), fechaDeFilter.getMonth(), fechaDeFilter.getDate(), 0, 0, 0, 0);


        var fechaAFilter = new Date(fechaFinal);
        var fechaAFilter2 = new Date(fechaAFilter.getFullYear(), fechaAFilter.getMonth(), fechaAFilter.getDate(), 0, 0, 0, 0);



        preFilters["@BETWEEN1"] = [
            "(( o.fechaInicial <= :PB1) OR ( o.fechaInicial BETWEEN :PB1 AND :PB2 ))",
            "PB1", fechaDeFilter, "PB2", fechaAFilter];

        preFilters["@BETWEEN2"] = [
            "(( o.plazasPorEmpleado.fechaFinal >= :PB3  )  OR (o.plazasPorEmpleado.fechaFinal BETWEEN :PB4 AND :PB3))",
            "PB3", fechaAFilter, "PB4", fechaDeFilter];
    }


    //Centro de costo
    if (document.getElementById("editCentroCostos").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroCostos").getAttribute("value");
    }

    //Tipo de nomina
    if (document.getElementById("editTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editTipoNomina").getAttribute("value");
    }

    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave del empleado", "tipo": "string", "campo": "plazasPorEmpleado.empleados.clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre del empleado", "tipo": "string", "campo": "plazasPorEmpleado.empleados.nombre", "medida": "m" };

    var optionals = new Object();
    //Group will be always acompanied of an Order
    optionals["camposGroup"] = campos;
    optionals["camposOrden"] = ["plazasPorEmpleado.empleados.clave"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-6";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);

}
function setEditAlEmpleadoShow(value) {
    if (value !== null) {

        var obj = value[0];
        var nombreCompleto = obj[4] + " " + obj[5] + " " + obj[3];
        var edit = document.getElementById("editAlEmpleado");
        var txtDescripcion = edit.children[1];
        txtDescripcion.value = nombreCompleto;

    }
}


// tabla
function editTableCanc() {

    var nameTable = "contTable";
    var nameCols = crearListaColumnas();
    var activaAdd = false;
    var activaDelete = false;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}
function crearListaColumnas() {
    var columnasTabla = new Array();

    columnasTabla.push(
        { "tituloColumna": "id", "nombreCompo": "id", "editable": false, "tipoCompon": "text", "persist": "id", "ancho": "40px", "hide": true },
        { "tituloColumna": "Concepto", "nombreCompo": "concepto", "editable": false, "tipoCompon": "text", "persist": "concepto", "ancho": "40px" },
        { "tituloColumna": "Descripcion", "nombreCompo": "descripcion", "editable": false, "tipoCompon": "text", "persist": "descripcion", "ancho": "85px" },

        { "tituloColumna": "Empleado", "nombreCompo": "nombreEmp", "editable": false, "tipoCompon": "text", "persist": "nombreEmp", "ancho": "65px" },
        { "tituloColumna": "Valor", "nombreCompo": "valor", "editable": false, "text": "edit", "persist": "valor", "ancho": "240px" },
        { "tituloColumna": "Accion", "nombreCompo": "accion", "editable": false, "tipoCompon": "text", "persist": "accion", "ancho": "85px" },
       
    );


    return columnasTabla;
}
function tableAdd(valores) {
    var exito = true;
    if (valores.length === 3) {

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
        var edit = $clone[0].querySelectorAll(".edit");
        if (edit) {
            for (var i = 0; i < edit.length; i++) {
                edit[i].removeAttribute("value");
                edit[i].querySelector(".editKey").value = "";
            }
        }

        if (asignacionConsecutiva) {
            //--
        }
    }

    $('#' + valores[1]).append($clone);
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

        }
    }

    if (tr.id === "") {
        var rString = "id" + randomString(2, '0123456789');
        obj['id'] = rString;
        tr.id = obj.id;
        agregarCreditoEmpleado(obj);
    } else {
        obj['id'] = tr.id;
        actualizarCreditoEmpleado(obj);
    }

}
function tableRemove(registro) {

    var id = registro.id;
    if (parseInt(id)) {
        for (var i = 0; i < dataRegCred.length; i++) {
            if (dataRegCred[i].id === parseInt(id)) {
                dataRegCred.splice(i, 1);
                break;
            }
        }



    } else {
        for (var j = 0; j < dataRegCred.length; j++) {
            if (dataRegCred[j].id === id) {
                dataRegCred.splice(j, 1);
                break;
            }
        }
    }

}
function cambiarPagina(valores) {
    //alert(valores);
    end = rowsByPage;
    start = valores;
    if (listaEmpleadosGenerados.length > rowsByPage) {
        var res = (rowsByPage + start) - listaEmpleadosGenerados.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = listaEmpleadosGenerados.length;
    }
    mostrarTabla(start, end);
}
//

function mostrarTabla(start, end)
{
  //--
    var datos = new Array();
    if (listaEmpleadosGenerados.length !== undefined) {
        for (var i = 0; i < listaEmpleadosGenerados.length; i++) {
            var objEmpleado = {};

            var rString = randomString(2, '0123456789');
            listaEmpleadosGenerados[i].idTabla = rString;
            objEmpleado.id = listaEmpleadosGenerados[i].idTabla;

            objEmpleado.concepto = listaEmpleadosGenerados[i].concepNomDefi.clave;
            objEmpleado.descripcion = listaEmpleadosGenerados[i].concepNomDefi.descripcion;
            objEmpleado.nombreEmp = listaEmpleadosGenerados[i].empleados.apellidoPaterno + " " + listaEmpleadosGenerados[i].empleados.apellidoMaterno  + " " + listaEmpleadosGenerados[i].empleados.nombre;

            objEmpleado.valor = listaEmpleadosGenerados[i].calculado;
            objEmpleado.accion = 'eliminar';
            

            datos[datos.length] = objEmpleado;

            dataEnvEmpleados = datos;

        }


        if (start === 0) {
            if (dataEnvEmpleados.length !== undefined)
                createEditPagination(dataEnvEmpleados.length, "contTable");
            else
                createEditPagination(0, "contTable");
        }
        if (dataEnvEmpleados.length < end)
            llenarTablaGen("contTable", dataEnvEmpleados, start, dataEnvEmpleados.length);
        else
            llenarTablaGen("contTable", dataEnvEmpleados, start, end);
        InitEventsTable();


    }
    else {
        clearTable("contTable");
        InitEventsTable();
    }
}

function eliminar() {
    var obj3 = parametros();
     mostrarInformacion(obj3);

   /* if (listaEmpleadosGenerados !== null) {
        if (listaEmpleadosGenerados.length === 0) {
            alert("No hay información.");

        }
        else {
            mostrarTabla(start, end);
        }

    }*/
}
function parametros() {
    obj = {};
    tipoCorrida = document.getElementById("editTipoDeCorrida").getAttribute("value");
    if (tipoCorrida === null) {
        tipoCorrida = "";
    }
    obj['claveTipoCorrida'] = tipoCorrida;

    tipoNomina = document.getElementById('editTipoNomina').getAttribute("value");
    if (tipoNomina === null) {
        tipoNomina = "";
    }
    obj['claveTipoNomina'] = tipoNomina;

    PeriodoNomina = document.getElementById("editPeriodo").getAttribute("value");
    if (PeriodoNomina === null) {
        PeriodoNomina = "";
    }
    obj['PeriodoNomina'] = PeriodoNomina;

    if (document.getElementById("edDelEmpleado").getAttribute("value") === null ||
        document.getElementById("edDelEmpleado").getAttribute("value") === "") {
        delEmpleado = "";
    }
    else {
        delEmpleado = getExtraValues("edDelEmpleado")[0];
        if (delEmpleado === null) {
            delEmpleado = "";
        }

    }
    obj['delEmpleado'] = delEmpleado;


    if (document.getElementById("editAlEmpleado").getAttribute("value") === null ||
        document.getElementById("editAlEmpleado").getAttribute("value") === "") {
        AlEmpleado = "";
    }
    else {
        AlEmpleado = getExtraValues("editAlEmpleado")[0];
        if (AlEmpleado === null) {
            AlEmpleado = "";
        }
    }
    obj['AlEmpleado'] = AlEmpleado;

    centroCostos = document.getElementById("editCentroCostos").getAttribute("value");
    if (centroCostos === null) {
        centroCostos = "";
    }
    obj['centroCostos'] = centroCostos;

    
    

    obj['razonSocialActual'] = razonSocialActual.id;
    

    return obj;

}


function mostrarInformacion(valores) {
    var url = route + "/api/MovimientosNomina/consultaMovNom";
    var dataToPost = JSON.stringify(valores);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        if (Mensaje.noError === 5) {
            alert("No existen calculos a eliminar");
        }
        else {

            if (Mensaje.noError === 50) {
                alert(Mensaje.error);
            }
            else {

                alert("No object");
            }


        }
        return null;

    } else {

        if (Mensaje.noError === 0) {
            alert("Proceso realizado satisfactoriamente.");
        }

        /*
        var arreglo1 = new Array();
        arreglo1 = [];
        for (var i = 0; i < Mensaje.resultado.length; i++) {
            var ultimo = arreglo1.push(Mensaje.resultado[i].id);

        }
        */


        return Mensaje.resultado;
    }
}

function limpiarComponentes() {
    clearEdit("editTipoDeCorrida");
    clearEdit("editTipoNomina");
    clearEdit("editPeriodo");
    
    clearEdit("editEmpleado");
    
    document.getElementById('txtFechaIni').value = "";
    document.getElementById('txtFechaFin').value = "";

    
    Empleado = undefined;
    listaEmpleados = new Array();

    listaEmpleadosGenerados = new Array();
    dataEnvEmpleados = new Array();
    /*
    createEditPagination(listaEmpleadosGenerados.length, "contTable");
    mostrarTabla(0, rowsByPage, 1);*/

    



}
function cancelar() {

    limpiarComponentes();

}

