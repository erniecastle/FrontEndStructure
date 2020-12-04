var obj = {};
var serieRazonSocial = null;
var tipoCorrida = null;
var claveTipoNomina = null;
var tipoNomina = null;
var PeriodoNomina = null;
var delEmpleado = null;
var AlEmpleado = null;
var centroCostos = null;
var registroPatronal = null;
var departamento = null;
var razonSocialActual;
var listaEmpleados = new Array();
var listaEmpleadosGenerados = new Array();
var dataEnvEmpleados = null;
var start = 0;
var end = 10;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    document.getElementById("btnCanTimbres").style.display = "none-block";
    startCustomTools();
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    addListenersTablaC();

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

function addListenersTablaC() {
    $("#seleccionado").on('change', function (e) {
        var checked = e.target.checked;
        if (listaEmpleadosGenerados !== null) {
            if (listaEmpleadosGenerados.length !== undefined) {
                for (var i = 0; i < listaEmpleadosGenerados.length; i++) {
                    listaEmpleadosGenerados[i].seleccionado = checked;
                }
            }
        }



    });
}
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
    listaEmpleados = null;
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
    nameCols = idiomaSelecionado.messageFormatter("TipoCorridaclave")() + "," + idiomaSelecionado.messageFormatter("TipoCorridadescripcion")();
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
    nameCols = idiomaSelecionado.messageFormatter("TipoNominaclave")() + "," + idiomaSelecionado.messageFormatter("TipoNominadescripcion")() + "," +
        idiomaSelecionado.messageFormatter("Periodicidaddescripcion")();
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
    nameCols = idiomaSelecionado.messageFormatter("PeriodosNominaClave")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaDescripcion")() + "," +
        idiomaSelecionado.messageFormatter("PeriodosNominaFechaInicial")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaFechaFinal")() + "," +
        idiomaSelecionado.messageFormatter("PeriodosNominaFechaCierre")();
   // nameCols = "Clave,Descripción,Fecha inicial, Fecha final, Fecha cierre";
    campos = "clave,descripcion,Date:fechaInicial,Date:fechaFinal,Date:fechaCierre";
    camposObtener = "clave,descripcion,año,fechaInicial,fechaFinal,status";
    var subEntities = "tipoNomina";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Periodos Nomina";
    var tamañoSel = "size-8";
    var id = parseInt(document.getElementById('editTipoNomina').getAttribute("value"));
    var preFilters = { "tipoNomina.id": id };

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
    nameCols = idiomaSelecionadoCol.messageFormatter("CentroDeCostoclave")() + "," + idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcion")() + "," + idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcionPrevia")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronal")();
   // nameCols = "Clave,Descripción,Nombre abreviado, Registro patronal";
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
function setEditRegPatronal() {
    //Parameters
    nameCmp = "EditRegPatronal";
    table = "RegistroPatronal";
    nameCols = idiomaSelecionadoCol.messageFormatter("RegistroPatronalclave")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronalnombreregtpatronal")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronalregistroPatronal")() + "," + idiomaSelecionadoCol.messageFormatter("RazonesSociales")();
    // nameCols = "Clave,Nombre,Registro patronal,Razón social";
    campos = "clave,nombreregtpatronal,registroPatronal,razonesSociales.razonsocial";
    var subEntities = "razonesSociales";
    camposMostrar = ["clave", "nombreregtpatronal"];
    camposObtener = "[]clave,[]delegacion,[]subdelegacion";
    var tituloSel = "Registro patronal";
    var tamañoSel = "size-6";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };

    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de registro patronal", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre del registro patronal", "tipo": "string", "campo": "nombreregtpatronal", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}
function setEditRegPatronalShow(value) {
    if (value !== null) {
        //

    }
}
function setEditDepartamento() {
    //Parameters
    nameCmp = "EditDepartamento";
    table = "Departamentos";
    nameCols = idiomaSelecionado.messageFormatter("Departamentosclave")() + "," + idiomaSelecionado.messageFormatter("Departamentosdescripcion")() + "," + idiomaSelecionado.messageFormatter("DepartamentossubCuenta")();
    //nameCols = "Clave,Descripción,Sub-Cuenta";
    campos = "clave,descripcion,subCuenta";
    var subEntities = "razonesSociales";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion,[]subCuenta";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };
    var tituloSel = "Departamento";
    var tamañoSel = "size-2";
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave Departamento", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre Departamento", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}
function setEditDepartamentoShow(value) {
    if (value !== null) {
        //

    }
}
function setEditDelEmpleado() {

    //Parameters
    nameCmp = "EditDelEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols ="()idEmpleado,"+ idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
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
    nameCols = "()idEmpleado," + idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    // nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
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
        { "tituloColumna": idiomaSelecionado.messageFormatter("CancelarTimbradoTblSerie")(), "nombreCompo": "serieCFDI", "editable": false, "tipoCompon": "text", "persist": "serieCFDI", "ancho": "40px" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("CancelarTimbradoTblFolio")(), "nombreCompo": "folioCFDI", "editable": false, "tipoCompon": "text", "persist": "folioCFDI", "ancho": "85px" },
        { "tituloColumna": "idEmpleado", "nombreCompo": "idEmpleado", "editable": false, "tipoCompon": "text", "persist": "idEmpleado", "ancho": "150px", "hide": true },
        { "tituloColumna": idiomaSelecionado.messageFormatter("CancelarTimbradoTblClave")(), "nombreCompo": "claveEmpleado", "editable": false, "tipoCompon": "text", "persist": "claveEmpleado", "ancho": "65px" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("CancelarTimbradoTblNombre")(), "nombreCompo": "nombreEmp", "editable": false, "text": "edit", "persist": "nombreEmp", "ancho": "240px" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("CancelarTimbradoTblFecha")(), "nombreCompo": "fecha", "editable": false, "tipoCompon": "text", "persist": "fecha", "ancho": "85px" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("CancelarTimbradoTblUUID")(), "nombreCompo": "uuid", "editable": false, "tipoCompon": "text", "persist": "uuid", "ancho": "90px" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("CancelarTmbradoTblMensaje")(), "nombreCompo": "mensaje", "editable": false, "tipoCompon": "text", "persist": "mensaje", "ancho": "200px" },
        { "tituloColumna": "Seleccionar", "nombreCompo": "Seleccionar", "editable": true, "tipoCompon": "checkbox", "persist": "seleccionado", "ancho": "90px", "selectable": true, "funcion": "setActivarSeleccionado" }
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
    mostrarTabla(start, end, 1);
}
//
function limpiarComponentes() {
    clearEdit("editTipoDeCorrida");
    clearEdit("editTipoNomina");
    clearEdit("editPeriodo");
    clearEdit("editRegistro");
    clearEdit("editCentroCostos");
    clearEdit("editDepartamento");
    clearEdit("edDelEmpleado");
    clearEdit("editAlEmpleado");
    document.getElementById('txtFechaIni').value = "";
    document.getElementById('txtFechaFin').value = "";

    delEmpleado = undefined;
    AlEmpleado = undefined;
    listaEmpleados = new Array();
    
    listaEmpleadosGenerados = new Array();
    dataEnvEmpleados = new Array();

    createEditPagination(listaEmpleadosGenerados.length, "contTable");
    mostrarTabla(0, rowsByPage, 1);

    //document.getElementById("contTable").style.display = "none";
    document.getElementById("btnVisualizar").style.display = "inline-block";
    document.getElementById("btnCancelar").style.display = "inline-block";
    document.getElementById("btnCanTimbres").style.display = "none";


   
}
function cancelar() {

    limpiarComponentes();

}
function mostrarTabla(start, end, tipo) {
    
    var datos = new Array();
    if (listaEmpleadosGenerados.length !== undefined) {
        for (var i = 0; i < listaEmpleadosGenerados.length; i++) {
            var objEmpleado = {};

            var rString = randomString(2, '0123456789');
            listaEmpleadosGenerados[i].idTabla = rString;
            objEmpleado.id = listaEmpleadosGenerados[i].idTabla;
            objEmpleado.serieCFDI = listaEmpleadosGenerados[i].cfdiRecibo.serie;
            objEmpleado.folioCFDI = listaEmpleadosGenerados[i].cfdiRecibo.folioCFDI;
            objEmpleado.idEmpleado = listaEmpleadosGenerados[i].idEmpleadoTabla;
            objEmpleado.claveEmpleado = listaEmpleadosGenerados[i].clave;
            objEmpleado.nombreEmp = listaEmpleadosGenerados[i].apellidoPaterno + " " + listaEmpleadosGenerados[i].apellidoMaterno + " " + listaEmpleadosGenerados[i].nombre;
            objEmpleado.fecha = formatDatemmddyyy(new Date(listaEmpleadosGenerados[i].cfdiRecibo.fechaGeneraInfo));
            objEmpleado.uuid = listaEmpleadosGenerados[i].cfdiRecibo.UUID;
            objEmpleado.mensaje = "";
            if (listaEmpleadosGenerados[i].mensaje !== null) {
                if (listaEmpleadosGenerados[i].mensaje !== undefined) {
                    objEmpleado.mensaje = listaEmpleadosGenerados[i].mensaje;
                }

            }
            objEmpleado.seleccionado = false;
            listaEmpleadosGenerados[i].seleccionado = false;

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


        if (tipo === 1) {
            document.getElementById("btnVisualizar").style.display = "none";
            document.getElementById("btnCanTimbres").style.display = "inline-block";
            document.getElementById("btnCancelar").style.display = "inline-block";}
       
        else {
           
            document.getElementById("btnVisualizar").style.display = "inline-block";
            document.getElementById("btnCancelar").style.display = "inline-block";
            document.getElementById("btnCanTimbres").style.display = "none";

        }
    }
    else {
        clearTable("contTable");
        InitEventsTable();
    }

    
}

function setActivarSeleccionado(values) {
    var activa = values[0];
    var tr = values[1];
    var id = tr.id;
    for (var i = start; i < end; i++) {
        if (listaEmpleadosGenerados[i].idTabla === id) {
            listaEmpleadosGenerados[i].seleccionado = activa;

            break;
        }
    }

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

    registroPatronal = document.getElementById("editRegistro").getAttribute("value");
    if (registroPatronal === null) {
        registroPatronal = "";
    }
    obj['registroPatronal'] = registroPatronal;

    departamento = document.getElementById("editDepartamento").getAttribute("value");
    if (departamento === null) {
        departamento = "";
    }
    obj['departamento'] = departamento;

    obj['razonSocialActual'] = razonSocialActual.id;
    //obj['toSendMails'] 

    return obj;

}
function desplegarInfo() {
    var obj3 = parametros();
    listaEmpleadosGenerados = mostrarInformacion(obj3);

    if (listaEmpleadosGenerados !== null) {
        if (listaEmpleadosGenerados.length === 0) {
            alert("No hay información.");

        }
        else {
            mostrarTabla(start, end, 1);
        }

    }

}
function mostrarInformacion(valores) {
    var url = route + "/api/CFDIEmpleado/BuscarInformacionACancelar";
    var dataToPost = JSON.stringify(valores);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        if (Mensaje.noError === 6) {
            alert("El periodo de nómina está abierto");
        }
        else {

            if (Mensaje.noError === 50) {
                alert(Mensaje.error);
            }
            else {

                if (Mensaje.noError === 10) {
                    alert("No existe certificado vigente");
                } else {

                    alert("No object");
                }
            }


        }
        return null;

    } else {
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

function EjecutarCancelado() {

    var obj1 = {};
    obj1 = parametros2();
    if (obj1 !== null) {
        dataEnvEmpleados = new Array();
        listaEmpleadosGenerados = new Array();
        listaEmpleadosGenerados = ejecutaproceso();
        if (listaEmpleadosGenerados !== null) {
           
            //mostrarTablaCancelado
            mostrarTabla(start, end, 2);
        }
        else {
            createEditPagination(listaEmpleadosGenerados.length, "contTable");
            mostrarTabla(0, rowsByPage, 1);

        }


    }
  
}

function ejecutaproceso()
    {
        var url = route + "/api/CFDIEmpleado/CancelarTimbrado";
        //aqui filtrar listado solo los seleccionados


        var dataToPost = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
        if (Mensaje.resultado === null) {
            if (Mensaje.noError === 6) {
                alert("El periodo de nómina está abierto");
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
             return Mensaje.resultado;
        }
    }


function sendOnlySelected(dataClear) {
    var paraTimbrar = [];
    for (var i = 0; i < dataClear.length; i++) {
        if (dataClear[i]["seleccionado"] === true) {

            paraTimbrar.push(dataClear[i].idEmpleadoTabla);
        }
    }
    return paraTimbrar;
}
function parametros2() {
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

    delEmpleado = document.getElementById("edDelEmpleado").getAttribute("value");
    if (delEmpleado === null) {
        delEmpleado = "";
    }
    obj['delEmpleado'] = delEmpleado;

    AlEmpleado = document.getElementById("editAlEmpleado").getAttribute("value");
    if (AlEmpleado === null) {
        AlEmpleado = "";
    }
    obj['AlEmpleado'] = AlEmpleado;

    centroCostos = document.getElementById("editCentroCostos").getAttribute("value");
    if (centroCostos === null) {
        centroCostos = "";
    }
    obj['centroCostos'] = centroCostos;

    registroPatronal = document.getElementById("editRegistro").getAttribute("value");
    if (registroPatronal === null) {
        registroPatronal = "";
    }
    obj['registroPatronal'] = registroPatronal;

    departamento = document.getElementById("editDepartamento").getAttribute("value");
    if (departamento === null) {
        departamento = "";
    }
    obj['departamento'] = departamento;

    obj['razonSocialActual'] = razonSocialActual.id;

    

    obj['ParaCancelar'] = sendOnlySelected(listaEmpleadosGenerados);

    if (obj['ParaCancelar'].length === 0) {
        alert("Debe de seleccionar por lo menos un empleado para cancelar");
        return null;
    }
    else {
        return obj;
    }

}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

