var excepcionArriba = false;
var excepcionAbajo = false;
var empleadoArriba = false;
var empleadoAbajo = false;
var centroCostoArriba = false;
var centroCostoAbajo = false;
var isFalta = false;
var isDescansoLaborado = false;
var isTiempoExtra = false;
var tbloriginal;
var MAXDOBLESEMORIGINAL = 9.0, MAXDOBLESEMX = 9.0;
var MAXDOBLEDIAORIGINAL = 3.0, MAXDOBLEDIAX = 3.0;
var descansoNumber = 0;
var automatico = false;
var consta = false;
var claveTipoNomina = "";
var razonSocialActual;
var parametros;
var campos;
var valorselEmpleado;
var statusPeriodo;
var falta = null, retardo = null, extraDoble = null, extraTriple = null, festivo = null, festivoLaboral = null,
    domingoLaboral = null, laborado = null, tiempoExtra = null, descanso = null, descansoLaboral = null;
var festividades;
var arregloDiasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
var subConsulta;
var query = "from Asistencias o where ";
var fechaInicial;
var fechaFinal;
var configuracionAsistencia;
var listaexcepcion = new Array();
var listaAsistenciaGlobales = new Array();
var listaAsistNuevosYMod = new Array();
var listaAsistDelete = new Array();
var listaDetallesAsistencia = new Array();
var detalleAsis = new Array();
var empleados;
var fechaSistemas;
var listaSemanas = new Array();
var ejercicio = 2020;
var start = 0;
var end = 10;
var clavePeriodo;
var idiomaSelecionadoCol;
var excepcion;
//var claveTipoNomina;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    var query = getParameterByName('screen');
    if (query !== "") {
        displayAsistencia(query);
    } else {
        var obj = JSON.parse($("#container").data("opener"));
        query = obj.tipoCaptura + "|" + obj.IdScreen + "|" + obj.config;
        value = query.split('|');
        displayAsistencia(value[2]);
    }
    startCustomTools();
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    fechaSistemas = getFechaSistema();
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

function displayAsistencia(id) {
    //showWait();
    configuracionAsistencia = getConfigAsistenciaId(id);
    //console.log(data);
    inicializarValoresAsist(configuracionAsistencia)
    inicializarcomponenesAsist();
    getRazonSocialActual();
    llenarSelExepcion(configuracionAsistencia.excepciones);
    getTablaDatosFestivos();
    //tbloriginal = document.getElementById('tblDetalle1').innerHTML;

    //removeWait();
}

function getRazonSocialActual() {
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);

    var url = route + "/api/Asistencias/getRazonSocialPorID";
    var dataToPost = JSON.stringify(razon.id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        razonSocialActual = Mensaje.resultado;
    }

    // return razonSocialActual;

}

function getConfigAsistenciaId(valor) {
    var configAsist;
    var url = route + "/api/Asistencias/buscaConfiguracionAsistenciasSistema";
    var dataToPost = JSON.stringify(valor);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        configAsist = Mensaje.resultado;
    }

    return configAsist;
}

function limpiar() {
    document.getElementById('con1').style.display = "block";
    document.getElementById('con3').style.display = "none";
    document.getElementById('btnAgregar').style.display = "block";
    var con2 = document.getElementById('con2');
    var cols = con2.querySelectorAll("th[id='editar'],th[id='eliminar'],td[id='editar'],td[id='eliminar']");
    for (var i = 0; i < cols.length; i++) {
        cols[i].style.display = "";
    }
    document.getElementById('btnSalir').style.display = "inline-block";
    document.getElementById('btnGuarda').style.display = "inline-block";
    document.getElementById('btnCancelar').style.display = "inline-block";
    document.getElementById('btnAgregarAsist').style.display = "none";
    document.getElementById('btnLimpiar').style.display = "none";
    limpiarCompontes();


}

function cancelar() {
    clearEdit("editTipoNomina");
    clearEdit("editPeriodoNomina");
    clearEdit("editCentroDeCostos");
    clearEdit("editEmpleados");
    document.getElementById("selExcepcion").value = "";
    document.getElementById('txtDelaFecha').value = "";
    document.getElementById('txtAlaFecha').value = "";

    var element = document.getElementById('contTable');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    //document.getElementById('txtTipoNomina').value = "";
    //document.getElementById('txtPeriodoNomina').value = "";
    //document.getElementById('txtFechaIni').value = "";
    //document.getElementById('txtFechaFin').value = "";
    //document.getElementById('txtCentroCosto').value = "";
    //document.getElementById('txtEmpleados').value = "";
    //$('#tblDetalle1').find("tr:gt(0)").remove();
    //listaexcepcion = new Array();
    listaAsistenciaGlobales = new Array();
    listaAsistNuevosYMod = new Array();
    listaAsistDelete = new Array();
    listaDetallesAsistencia = new Array();
    detalleAsis = new Array();
    empleados = undefined;
    listaSemanas = new Array();

}

function limpiarCompontes() {
    document.getElementById('dpkFecha').value = "";
    document.getElementById('txtDiaSemana').value = "";
    document.getElementById('txtJornada').value = "";
    document.getElementById('txtCantidad').value = "";
    document.getElementById('chkCantidad').value = "";
    document.getElementById('selExcepcionDetalle').value = "";
    document.getElementById('GruopCantidadSel').style.display = "none";
    document.getElementById('GruopCantidad').style.display = "block";
    //document.getElementById('txtCentroCosto2').value = "";
    //document.getElementById('txtEmpleado3').value = "";
    //document.getElementById('txtEmpleados2').value = "";
    //document.getElementById('txtPlazaEmp').style.display = "none";
    //document.getElementById('txtPlazaEmp').value = "";
    //document.getElementById('plaza').style.display = "none";

}

function getTablaDatosFestivos() {
    var valor = {};
    valor.claveTablaBase = "03";
    valor.fecha = getFechaSistema();

    var url = route + "/api/Asistencias/getfestividades";
    var dataToPost = JSON.stringify(valor);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        festividades = Mensaje.resultado;
        // console.log(festividades);
    }

    return festividades;
}

function inicializarValoresAsist(data) {
    var activarFiltros = data.activadosFiltro.split(',');
    var activadosAsistencia = data.activadosMovimientos.split(',');

    if (activarFiltros[0] === "1") {
        empleadoArriba = true;
    }

    if (activarFiltros[1] === "1") {
        excepcionArriba = true;
    }

    if (activarFiltros[2] === "1") {
        centroCostoArriba = true;
    }

    if (activadosAsistencia[0] === "1") {
        empleadoAbajo = true;
    }

    if (activadosAsistencia[1] === "1") {
        excepcionAbajo = true;
    }

    if (activadosAsistencia[2] === "1") {
        centroCostoAbajo = true;
    }

}

function inicializarcomponenesAsist() {

    if (centroCostoArriba) {
        document.getElementById('GruopCentroCosto').style.display = "block";
        document.getElementById('GruopCentroCostoDetalle1').style.display = "none";
        //document.getElementById('centroCosto').style.display = "none";
        //document.getElementById('nombreCentroCosto').style.display = "none";
    }

    if (empleadoArriba) {
        document.getElementById('GruopEmpleado').style.display = "block";
        document.getElementById('GruopEmpleadoDetalle').style.display = "none";
        //document.getElementById('empleado').style.display = "none";
        //document.getElementById('nombreEmpleado').style.display = "none";
    }

    if (excepcionArriba) {
        document.getElementById('GruopExcepcion').style.display = "block";
        //document.getElementById('excepcion').style.display = "none";
        document.getElementById('GruopExcepcionDetalle').style.display = "none";
    }

    if (empleadoAbajo) {
        //document.getElementById('empleado').style.display = "";
        //document.getElementById('nombreEmpleado').style.display = "";
        document.getElementById('GruopEmpleado').style.display = "none";
        document.getElementById('GruopEmpleadoDetalle2').style.display = "none";
    }

    if (excepcionAbajo) {
        document.getElementById('GruopExcepcion').style.display = "none";
        document.getElementById('GruopExcepcionDetalle1').style.display = "none";
    }

    if (centroCostoAbajo) {
        document.getElementById('GruopCentroCosto').style.display = "none";
        document.getElementById('GruopCentroCostoDetalle1').style.display = "block";
    }

    if (!centroCostoAbajo && !centroCostoArriba) {
        document.getElementById('GruopCentroCosto').style.display = "none";
        //document.getElementById('centroCosto').style.display = "none";
        //document.getElementById('nombreCentroCosto').style.display = "none";
        document.getElementById('GruopCentroCostoDetalle').style.display = "none";
        document.getElementById('GruopCentroCostoDetalle1').style.display = "none";
    }
}

function llenarSelExepcion(data) {
    var obj = {};
    for (var j = 0; j < data.length; j++) {
        if (data[j].concepNomDefi_ID !== null) {
             obj = {};
            obj.id = data[j].id;
            obj.clave = data[j].clave;
            obj.descripcion = data[j].excepcion;
            listaexcepcion[listaexcepcion.length] = obj;
            $('#selExcepcion').append('<option value=' + data[j].id + '>' + data[j].excepcion + '</option>');
            $('#selExcepcionDetalle').append('<option value=' + data[j].id + '>' + data[j].excepcion + '</option>');

        }

        if (data[j].clave === "0") {
            laborado = data[j];
            obj = {};
            obj.id = data[j].id;
            obj.clave = data[j].clave;
            obj.descripcion = data[j].excepcion;
            listaexcepcion[listaexcepcion.length] = obj;
        } else if (data[j].clave === "1") {
            retardo = data[j];
        } else if (data[j].clave === "2") {
            falta = data[j];
        } else if (data[j].clave === "10") {
            descansoLaboral = data[j];
        } else if (data[j].clave === "11") {
            festivoLaboral = data[j];
        } else if (data[j].clave === "12") {
            domingoLaboral = data[j];
        } else if (data[j].clave === "13") {
            tiempoExtra = data[j];
            automatico = true;
        } else if (data[j].clave === "14") {
            extraDoble = data[j];
        } else if (data[j].clave === "15") {
            extraTriple = data[j];
        } else if (data[j].clave === "16") {
            descanso = data[j];
             obj = {};
            obj.id = data[j].id;
            obj.clave = data[j].clave;
            obj.descripcion = data[j].excepcion;
            listaexcepcion[listaexcepcion.length] = obj;
        } else if (data[j].clave === "17") {
            festivo = data[j];
        }
    }
}

function construirFormaDetalle() {
    document.getElementById('con1').style.display = "none";
    document.getElementById('con3').style.display = "block";
    document.getElementById('btnAgregar').style.display = "none";
    var con2 = document.getElementById('con2');
    var cols = con2.querySelectorAll("th[id='editar'],th[id='eliminar'],td[id='editar'],td[id='eliminar']");
    for (var i = 0; i < cols.length; i++) {
        cols[i].style.display = "none";
    }

    document.getElementById('btnSalir').style.display = "none";
    document.getElementById('btnGuarda').style.display = "none";
    document.getElementById('btnCancelar').style.display = "none";
    document.getElementById('btnAgregarAsist').style.display = "inline-block";
    document.getElementById('btnLimpiar').style.display = "inline-block";

    if (excepcionArriba) {
        var selExcepcion = document.getElementById('selExcepcion');
        document.getElementById('txtExcepcionDetalle1').value = selExcepcion.options[selExcepcion.selectedIndex].innerHTML;
    }

}

function activarCantidad(value) {
    var excepcion = excepcionPorId(value);
    if (excepcion.clave === "2") {
        document.getElementById('GruopCantidadSel').style.display = "block";
        document.getElementById('GruopCantidad').style.display = "none";
        document.getElementById('chkCantidad').value = "";
        document.getElementById('txtCantidad').disabled = true;
        document.getElementById('txtCantidad').value = "";
    } else if (excepcion.clave === "13" || excepcion.clave === "14" || excepcion.clave === "15") {
        document.getElementById('GruopCantidadSel').style.display = "none";
        document.getElementById('GruopCantidad').style.display = "block";
        document.getElementById('txtCantidad').disabled = false;
        document.getElementById('chkCantidad').value = "";
        document.getElementById('txtCantidad').value = "";
    } else {
        document.getElementById('GruopCantidadSel').style.display = "none";
        document.getElementById('GruopCantidad').style.display = "none";
        document.getElementById('chkCantidad').value = "";
        document.getElementById('txtCantidad').disabled = true;
        document.getElementById('txtCantidad').value = "";
    }
}

function excepcionPorId(id) {
    var excepcion;
    var url = route + "/api/Asistencias/getExepcionPorID";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        excepcion = Mensaje.resultado;
    }

    return excepcion;
}

function editTableAsistencia() {

    var nameTable = "Asistencia";
    var nameCols = crearListaColumnas();
    var activaAdd= true;
    var activaDelete = true;
    if (excepcionAbajo) {
         activaAdd = false;
        activaDelete = false;
    }

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function crearListaColumnas() {
    var columnasTabla = new Array();
    if (excepcionAbajo) {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAsistenciasTblFecha")(), "nombreCompo": "Fecha", "editable": false, "tipoCompon": "date", "persist": "fechaAsistencia", "ancho": "150px", "funcion": "getFechas" });
    } else {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAsistenciasTblFecha")(), "nombreCompo": "Fecha", "editable": true, "tipoCompon": "date", "persist": "fechaAsistencia", "ancho": "150px", "funcion": "getFechas" });
    }
    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAsistenciasTblDiaSemana")(), "nombreCompo": "DiaSemana", "editable": false, "text": "", "persist": "diaSemana", "ancho": "150px" },
        { "tituloColumna": "Jornada", "nombreCompo": "Jornada", "editable": false, "tipoCompon": "text", "persist": "jornada", "ancho": "150px" });
    if (excepcionAbajo) {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAsistenciasTblExcepcion")(), "nombreCompo": "Excepcion", "editable": true, "tipoCompon": "select", "persist": "excepciones_ID", "ancho": "230px", "data": listaexcepcion, "funcion": "getExcepcion" });
    }

    if (empleadoAbajo) {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAsistenciasTblEmpleado")(), "nombreCompo": "Empleados", "editable": true, "tipoCompon": "editConsulta", "persist": "empleados_ID", "ancho": "130px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAsistenciasTblNombre")(), "nombreCompo": "Nombre", "editable": false, "tipoCompon": "editdesc", "persist": "nombreEmpleado", "ancho": "400px" });
    }

    if (centroCostoAbajo) {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("CentroDeCosto")(), "nombreCompo": "CentroDeCosto", "editable": true, "tipoCompon": "editConsulta", "persist": "centroCosto_ID", "ancho": "10px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcion")(), "nombreCompo": "Descripcion", "editable": false, "tipoCompon": "", "persist": "descripcioncen", "ancho": "300px" });
    }
    if (isFalta) {
        var valores = [{ "id": "1", "descripcion": "1" }, { "id": "0.50", "descripcion": "0.5" }];

        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAsistenciasTblCantidad")(), "nombreCompo": "Cantidad", "editable": true, "tipoCompon": "select", "persist": "cantidad", "ancho": "100px", "data": valores });
    } else if (isDescansoLaborado) {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAsistenciasTblCantidad")(), "nombreCompo": "Cantidad", "editable": true, "tipoCompon": "text", "persist": "cantidad", "ancho": "100px" });
    } else if (isTiempoExtra) {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAsistenciasTblCantidad")(), "nombreCompo": "Cantidad", "editable": true, "tipoCompon": "text", "persist": "cantidad", "ancho": "100px" });
    } else {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAsistenciasTblCantidad")(), "nombreCompo": "Cantidad", "editable": false, "tipoCompon": "text", "persist": "cantidad", "ancho": "100px" });
    }

    return columnasTabla;
}

function setEditTipoNomina() {

    //Parameters
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
    var preFilters = setPreFilters(preFilters = null);
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
        document.getElementById('txtTipoNominaDetalle').value = obj.Clave + "-" + obj.Descripcion;
        valorSeleccionado();
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
    camposObtener = "clave,descripcion,año,fechaAsistenciInicial,fechaAsistenciaFinal,status";
    var subEntities = "tipoNomina";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Periodos Nomina";
    var tamañoSel = "size-4";

    var id = parseInt(document.getElementById('editTipoNomina').getAttribute("value"));
    var preFilters = { "tipoNomina.id": id, "año": ejercicio };

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
        document.getElementById('txtPeriodoNominaDetalle').value = obj.Descripcion;
        fechaInicial = obj.FechaAsistenciInicial;
        fechaFinal = obj.FechaAsistenciaFinal;
        document.getElementById('txtDelaFecha').value = formatDatemmddyyy(new Date(obj.FechaAsistenciInicial));
        document.getElementById('txtAlaFecha').value = formatDatemmddyyy(new Date(obj.FechaAsistenciaFinal));
        document.getElementById('txtDelaFechaDetalle').value = formatDatemmddyyy(new Date(obj.FechaAsistenciInicial));
        document.getElementById('txtAlaFechaDetalle').value = formatDatemmddyyy(new Date(obj.FechaAsistenciaFinal));
        statusPeriodo = obj.Status;
        clavePeriodo = obj.Clave;
        valorSeleccionado();
    }
}

function setEditEmpleados() {

    //Parameters
    nameCmp = "EditEmpleados";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";//Quit ID;
    camposObtener = "plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";
    //var subEntities = "razonesSociales"; //Unnecesary
    //camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razon.id };//Unnecesary
    //var preFilters = {
    //    "plazasPorEmpleado.razonesSociales.id": razonSocialActual.id
    //    /* "id#IN@": "(Select MAX(m.id) from PlazasPorEmpleadosMov m  WHERE m.plazasPorEmpleado.referencia = o.plazasPorEmpleado.referencia)",
    //     "plazasPorEmpleado.ingresosBajas.fechaBaja#>=": getFechaSistema(),*/
    //};

    //Fechas en base al periodo
    if (document.getElementById("editPeriodoNomina").getAttribute("value")) {

        //var valDateFromFilter = document.getElementById("txtDeFecha").value;
        var fechaDeFilter = new Date(fechaInicial);
        var fechaDeFilter2 = new Date(fechaDeFilter.getFullYear(), fechaDeFilter.getMonth(), fechaDeFilter.getDate(), 0, 0, 0, 0);

        //var valDateToFilter = document.getElementById("txtDeFecha").value;
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
    //if (document.getElementById("editCentroDeCosto").getAttribute("value")) {
    //    preFilters["centroDeCosto.id"] = document.getElementById("editCentroDeCosto").getAttribute("value");
    //}

    //Tipo de nomina
    if (document.getElementById("editTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editTipoNomina").getAttribute("value");
    }

    preFilters = setPreFilters(preFilters);
    //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecialMovimientosNomina";
    var valoreswhereEsp; 
    if (claveTipoNomina !== "") {
        var camposWhereEsp = ["tipoNomina.clave"];
        valoreswhereEsp = [claveTipoNomina, razonSocialActual.clave, null, new Date(fechaInicial), new Date(fechaFinal)];
    } else {
        //var camposWhereEsp = "";
         valoreswhereEsp = [razonSocialActual.clave, null, new Date(), new Date()];
    }
    var optionals = { "queryEspecial": queryEspecial, "camposWhereEsp": camposWhereEsp, "valoreswhereEsp": valoreswhereEsp };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}

function setEditEmpleadosShow(value) {
    if (value !== null) {
        var obj = value[0];
        valorselEmpleado = value[0];
        empleados = obj[1];
        document.getElementById('txtEmpleado3').value = obj[1].apellidoPaterno + " " + obj[1].apellidoMaterno + " " + obj[1].nombre;
        var turnos = getTurnosPorID(obj[0].turnos_ID);
        if (turnos === null) {
            MAXDOBLEDIAX = MAXDOBLEDIAORIGINAL;
        } else if (turnos.turnosHorariosFijos !== null && turnos.turnosHorariosFijos.length > 0) {
            MAXDOBLEDIAX = MAXDOBLEDIAORIGINAL;
        } else {
            if (turnos.turnosHorariosFijos === null) {
                //pendiente
            } else {
                var horario = getHorarioPorID(turnos.turnosHorariosFijos[0].Horario_ID);
                MAXDOBLEDIAX = horario.topeDiarioHrsExtras;
            }
        }
        valorSeleccionado();
    }
}

function setEditEmpleadosDetalle() {

    //Parameters
    nameCmp = "EditEmpleadosDetalle";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";//Quit ID;
    camposObtener = "plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";
    //var subEntities = "razonesSociales"; //Unnecesary
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razon.id };//Unnecesary
    //Fechas en base al periodo
    if (document.getElementById("editPeriodoNomina").getAttribute("value")) {

        //var valDateFromFilter = document.getElementById("txtDeFecha").value;
        var fechaDeFilter = new Date(fechaInicial);
        var fechaDeFilter2 = new Date(fechaDeFilter.getFullYear(), fechaDeFilter.getMonth(), fechaDeFilter.getDate(), 0, 0, 0, 0);

        //var valDateToFilter = document.getElementById("txtDeFecha").value;
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
    //if (document.getElementById("editCentroDeCosto").getAttribute("value")) {
    //    preFilters["centroDeCosto.id"] = document.getElementById("editCentroDeCosto").getAttribute("value");
    //}

    //Tipo de nomina
    if (document.getElementById("editTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editTipoNomina").getAttribute("value");
    }

    preFilters = setPreFilters(preFilters);
    //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecialMovimientosNomina";
    var valoreswhereEsp;
    if (claveTipoNomina !== "") {
        var camposWhereEsp = ["tipoNomina.clave"];
        valoreswhereEsp = [claveTipoNomina, razonSocialActual.clave, null, new Date(fechaInicial), new Date(fechaFinal)];
    } else {
        //var camposWhereEsp = "";
         valoreswhereEsp = [razonSocialActual.clave, null, new Date(), new Date()];
    }
    //var filtersSearch = [];//Unnecesary
    //filtersSearch[0] = { "etiqueta": "Clave del empleado", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre del empleado", "tipo": "string", "campo": "nombre", "medida": "m" };
    var optionals = { "queryEspecial": queryEspecial, "camposWhereEsp": camposWhereEsp, "valoreswhereEsp": valoreswhereEsp };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}

function setEditEmpleadosDetalleShow(value) {
    if (value !== null) {
        var obj = value[0];
        empleados = obj[1];
        idempleado = empleados.id;
        nombreDatoSecu = "nombreEmpleado";
        datoSecundario = empleados.apellidoPaterno + " " + empleados.apellidoMaterno + " " + empleados.nombre;
        var tdFecha = renglon.querySelector("td[persist=fechaAsistencia]");
        var fecha = tdFecha.innerText;
        var asistenciaBD = validarAsistenciaBD(fecha, empleados.clave, clavePeriodo, claveTipoNomina, razonSocialActual.clave);
        if (asistenciaBD !== null) {
            renglon.id = asistenciaBD.id;
            asistenciaBD.statusFila = "BDS";
            listaAsistenciaGlobales[listaAsistenciaGlobales.length] = asistenciaBD;
        }
        
        if (classNameBlur) {
            var tdClave = renglon.querySelector("td[persist=empleados_ID]");
            var txtclave = tdClave.firstElementChild.firstElementChild;
            tdClave.appendChild(document.createTextNode(txtclave.value));
            txtclave.value = "";
            tdClave.firstElementChild.style.display = "none";
            var tddescripcion = renglon.querySelector("td[persist=nombreEmpleado]");
            tddescripcion.appendChild(document.createTextNode(datoSecundario));
            if (excepcion.clave === "2") {
                var tdCantidad = renglon.querySelector("td[persist=cantidad]");
                tdCantidad.appendChild(document.createTextNode("1"));
                tdCantidad.setAttribute("valor", "1");
            }
            if (prevalidacionAddRow(renglon)) {
                var nametable = renglon.parentNode.parentNode.id;
                var nameBody = renglon.parentNode.id;
                var rowTr = renglon;
                var obj2 = [nametable, nameBody, rowTr];
                tableAdd(obj2);
            }
            if (excepcion.clave !== "2") {
                $(tdClave).nextAll('td[contenteditable=true]:first').focus();
            }
        }
    }
}

function setEditCentroDeCostos() {
    //Parameters
    nameCmp = "EditCentroDeCostos";
    table = "CentroDeCosto";
    nameCols = idiomaSelecionadoCol.messageFormatter("CentroDeCostoclave")() + "," + idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcion")() + "," + idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcionPrevia")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronal")();
   // nameCols = "Clave,Descripción,Nombre abreviado, Registro patronal";
    campos = "clave,descripcion,descripcionPrevia,registroPatronal.nombreregtpatronal";
    var subEntities = "registroPatronal,razonesSociales";
    camposMostrar = ["clave", "descripcion"];
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

function setEditCentroDeCostos1() {
    //Parameters
    nameCmp = "EditCentroDeCostos1";
    table = "CentroDeCosto";
    nameCols = "Clave,Descripción,Nombre abreviado, Registro patronal";
    campos = "clave,descripcion,descripcionPrevia,registroPatronal.nombreregtpatronal";
    var subEntities = "registroPatronal,razonesSociales";
    camposMostrar = ["clave", "descripcion"];

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
        typeof camposObtener === 'undefined' ? null : camposObtener);
}

function getFechas(values) {
    var fechaIni = new Date(fechaInicial);
    var fechaFin = new Date(fechaFinal);
    var activarChange = values[2];
    var exito = true;
    //var fechavalidar = new Date(formantDdMmYyyy(values[0]));
    if (activarChange && excepcionArriba) {
       var fecha = new Date(formantDdMmYyyy(values[0]));
        if (fecha < fechaIni || fecha > fechaFin) {
            alert("la fecha esta fuera del rango del periodo");
            exito = false;
        }
    }
    if (excepcionArriba  && exito) {

        var fecha = new Date(values[0]);
        var nombreDia = arregloDiasSemana[fecha.getDay()];
        var tr = values[1];
        var tdDiaSemana = tr.querySelector('td[persist=diaSemana]');
        $(tdDiaSemana).contents().filter(function () {
            return this.nodeType === 3; //Node.TEXT_NODE
        }).remove();
        tdDiaSemana.appendChild(document.createTextNode(nombreDia));
        var idsel = parseInt(document.getElementById("selExcepcion").value);
        if (idsel === descanso.id || idsel === festivo.id) {
            var tdJornada = tr.querySelector('td[persist=jornada]');
            $(tdJornada).contents().filter(function () {
                return this.nodeType === 3; //Node.TEXT_NODE
            }).remove();

            tdDiaSemana.appendChild(document.createTextNode("0.0"));
        } else {
            var tdJornada2 = tr.querySelector('td[persist=jornada]');
            $(tdJornada2).contents().filter(function () {
                return this.nodeType === 3; //Node.TEXT_NODE
            }).remove();
            tdJornada2.appendChild(document.createTextNode("8.0"));
        }
    }

    return exito;
    //console.log(values);
}

function getTurnosPorID(id) {
    var turnos;
    var url = route + "/api/Asistencias/getTurnosPorID";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        turnos = Mensaje.resultado;
    }

    return turnos;
}

function getHorarioPorID(id) {
    var horario;
    var url = route + "/api/Asistencias/getHorarioPorID";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        horario = Mensaje.resultado;
    }

    return horario;
}

function valorSeleccionado() {
    listaSemanas = new Array();
    if (document.getElementById("editTipoNomina").getAttribute("value") && document.getElementById("editPeriodoNomina").getAttribute("value")) {
        var continuar = true;
        if (empleadoArriba) {
            if (!document.getElementById("editEmpleados").getAttribute("value")) {
                continuar = false;
            }
        }

        if (centroCostoArriba) {
            if (!document.getElementById("editCentroDeCostos").getAttribute("value")) {
                continuar = false;
            }
        }
        if (excepcionArriba) {
            if (document.getElementById("selExcepcion").value === "") {
                continuar = false;
            }
        }

        if (continuar) {

            ejecutarActivaGrid();
        }
    }
}

function ejecutarActivaGrid() {
    campos = new Array();
    parametros = new Array();
    $('#tblDetalle1').find("tr:gt(0)").remove();
    ObjetosPrincipales();
    if (centroCostoArriba) {
        if (document.getElementById("editCentroDeCostos").getAttribute("value")) {
            campos[campos.length] = "centroDeCosto";
            parametros[parametros.length] = document.getElementById("editCentroDeCostos").getAttribute("value");
        }
    }

    if (excepcionArriba) {
        if (document.getElementById("selExcepcion").value !== "") {
            campos[campos.length] = "excepciones";
            parametros[parametros.length] = document.getElementById("selExcepcion").value;
        }
    }
    ActivaGrid();
}

function ObjetosPrincipales() {
    campos[campos.length] = "tipoNomina.id";
    campos[campos.length] = "periodosNomina.id";
    if (empleadoArriba) {
        campos[campos.length] = "empleados.id";
    }
    campos[campos.length] = "razonesSociales.id";

    parametros[parametros.length] = document.getElementById("editTipoNomina").getAttribute("value");
    parametros[parametros.length] = document.getElementById("editPeriodoNomina").getAttribute("value");
    if (empleadoArriba) {
        parametros[parametros.length] = valorselEmpleado[1].id;
    }
    parametros[parametros.length] = razonSocialActual.id;
}

function ActivaGrid() {
    if (statusPeriodo) {
        var employeeStamp;
        if (empleadoArriba) {
            var claveEmpleado = valorselEmpleado[1].clave;
            employeeStamp = buscarTimbreEnEmpleado(claveEmpleado);
        }

        if (typeof employeeStamp === 'undefined') {
            generaAsistensia();
        } else {
            //console.log();
        }
    } else {
        alert("Este Periodo esta cerrado");
    }


    // alert("entro: Activar grid");
}

function buscarTimbreEnEmpleado(claveEmpleado) {
    var valores = {};
    var resultado;
    valores.claveRazonSocial = razonSocialActual.clave;
    valores.claveTipoNomina = claveTipoNomina;
    valores.claveTipoDeCorrida = "PER";
    valores.idperiodoNomina = document.getElementById("editPeriodoNomina").getAttribute("value");
    var tipotimbres = [1];
    valores.tipoTimbres = tipotimbres;
    var empleados = [claveEmpleado];
    valores.empleados = empleados;
    var url = route + "/api/Asistencias/getCFDIEmpleadoStatusPorFiltro";
    var dataToPost = JSON.stringify(valores);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        resultado = Mensaje.resultado;
        // console.log(Mensaje.resultado);
    }

}

function generaAsistensia() {
    var subquery = construyeConsulta(0);
    subConsulta = "";
    subConsulta = subConsulta + query;
    subConsulta = subConsulta + subquery;
    subConsulta = subConsulta + " order by fecha,ordenid asc";
    //console.log(subConsulta);
    var obj = {};
    obj.clavetipoNomina = parseInt(document.getElementById("editTipoNomina").getAttribute("value"));
    obj.idPeriodoNomina = parseInt(document.getElementById("editPeriodoNomina").getAttribute("value"));
    if (empleadoArriba) {
        obj.claveEmpleado = empleados.id;
    }
    obj.claveRazonSocial = razonSocialActual.id;
    if (centroCostoArriba) {
        obj.claveCentroCosto = parseInt(document.getElementById("editCentroDeCostos").getAttribute("value"));
    }

    if (excepcionArriba) {
        obj.claveExepcion = parseInt(document.getElementById("selExcepcion").value);
    }
    var listAsistencias;
    var url = route + "/api/Asistencias/getAsistenciaPorFiltros";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        listAsistencias = Mensaje.resultado;
    }


    if (listAsistencias.length === 0) {
        if (!excepcionArriba) {
            enlazaFecha(fechaInicial, fechaFinal);
            semanas(fechaInicial, fechaFinal);
        }
    } else {
        if (!excepcionArriba) {
            enlazaFechaAsist(listAsistencias);
            semanas(fechaInicial, fechaFinal);

        } else {
            enlazaFechaAsist(listAsistencias);
            semanas(fechaInicial, fechaFinal);
        }
        delete obj.claveExepcion;
        var url2 = route + "/api/Asistencias/getDetalleAsistenciaPorFiltros";
        var dataToPost2 = JSON.stringify(obj);
        var Mensaje2 = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje2.resultado === null) {
            alert("No object");
        } else {
            detalleAsis = Mensaje2.resultado;
        }

    }
    //console.log(listAsistencias);
}

function enlazaFechaAsist(listaAsistencia) {
    var asistenciasAux = new Array();

    for (var i = 0; i < listaAsistencia.length; i++) {
        var row = {};
        row.id = listaAsistencia[i].id;
        //console.log(formatDateddmmyyy(calendarDesde));
        row.fechaAsistencia = formatDateddmmyyy(new Date(listaAsistencia[i].fecha));
        row.diaSemana = arregloDiasSemana[new Date(listaAsistencia[i].fecha).getDay()];
        row.jornada = listaAsistencia[i].jornada;
        if (excepcionAbajo) {
            var exp = {};
            exp.id = listaAsistencia[i].excepciones_ID;
            exp.descripcion = listaAsistencia[i].excepciones.excepcion;
            row.excepciones_ID = exp;
        } else if (empleadoAbajo) {

            var empleado = listaAsistencia[i].empleados;
            row.nombreEmpleado = empleado.apellidoPaterno + " " + empleado.apellidoMaterno + " " + empleado.nombre;
            row.empleados_ID = empleado.clave;

        }

        if (listaAsistencia[i].cantidad === null) {
            row.cantidad = "";
        } else {
            if (listaAsistencia[i].excepciones.clave === "2") {
                if (listaAsistencia[i].cantidad === 1) {
                    if (excepcionArriba) {
                        var obj = {};
                        obj.id = listaAsistencia[i].cantidad;
                        obj.descripcion = "1";
                        row.cantidad = obj;
                    } else {
                        row.cantidad = "1";
                    }
                } else {
                    if (excepcionArriba) {
                        var obj2 = {};
                        obj2.id = listaAsistencia[i].cantidad;
                        obj2.descripcion = "0.5";
                        row.cantidad = obj2;
                    } else {
                        row.cantidad = "0.5";
                    }
                }
            } else {
                row.cantidad = listaAsistencia[i].cantidad;
            }
        }

        asistenciasAux[i] = row;
        
        listaAsistencia[i].statusFila = "BDS";
    }
   // console.log(asistenciasAux);
    listaAsistenciaGlobales = listaAsistencia;
    if (start === 0) {
        createEditPagination(asistenciasAux.length, "Asistencia");
    }
    if (listaAsistenciaGlobales.length < rowsByPage) {
        end = listaAsistenciaGlobales.length;
    } else {
        end = rowsByPage;
    }
    
    llenartablaAsis(start, end, asistenciasAux);
   // llenarTablaGen("Asistencia", asistenciasAux);
}

function enlazaFecha(desdeFecha, hastaFecha) {
    var jornada = "0.0";
    var asistenciasAux = new Array();
    var calendarDesde = new Date(desdeFecha);
    calendarDesde = new Date(calendarDesde.getFullYear(), calendarDesde.getMonth(), calendarDesde.getDate());
    //console.log(calendarDesde);
    var calendarHasta = new Date(hastaFecha);
    calendarHasta = new Date(calendarHasta.getFullYear(), calendarHasta.getMonth(), calendarHasta.getDate());
    //console.log(calendarHasta);
    // console.log(festividades);
    var i = 0;
    var consta = true;

    while (consta) {
        //console.log(calendarDesde);
        var object = null;
        if (excepcionAbajo) {
            if (calendarDesde.getDay() === descansoNumber) {
                object = descanso;
            } else if (festividades.includes(calendarDesde.getDate())) {
                object = festivo;
            } else {

                object = laborado;
            }

        } else {
            ///aqui va programacion para el select exepcion arriba
        }

        if (object.clave === descanso.clave) {
            jornada = "0.0";
        } else if (object.clave === festivo.clave) {
            object = festivo;
            jornada = "0.0";
        } else {
            jornada = "8.0";
        }
        var rString = "id" + i;

        var row = {};
        row.id = rString;
        //console.log(formatDateddmmyyy(calendarDesde));
        row.fechaAsistencia = formatDateddmmyyy(calendarDesde);
        row.diaSemana = arregloDiasSemana[calendarDesde.getDay()];
        row.jornada = jornada;
        var exp = {};
        exp.id = object.id;
        exp.descripcion = object.excepcion;
        row.excepciones_ID = exp;
        row.cantidad = "";
        asistenciasAux[i] = row;
        if (calendarDesde.getTime() === calendarHasta.getTime()) {
            break;
        }
        i++;
        calendarDesde.setDate(calendarDesde.getDate() + 1);

        //console.log(jornada);
        //console.log(object);
    }
    //para ordenar la lista 
    // console.log(asistenciasAux.sort((a, b) => a.fechaAsistencia < b.fechaAsistencia));
    // console.log(asistenciasAux);
    if (start === 0) {
        createEditPagination(asistenciasAux.length, "Asistencia");
    }
    if (asistenciasAux.length < rowsByPage) {
        end = asistenciasAux.length;
    } else {
        end = rowsByPage;
    }
    llenartablaAsis(start, end, asistenciasAux);
    //llenarTablaGen("Asistencia", asistenciasAux);
    construirAsist(asistenciasAux);
    consta = false;


}

function construyeConsulta(modo) {
    var subQuery = "";
    var alias = null;

    if (modo === 0) {
        alias = "o.";
    }

    for (var i = 0; i < campos.length; i++) {
        if (campos[i] === "tipoPantalla") {
            subQuery = "(" + alias + campos[i] + " =:parametro" + i;
            subQuery = subQuery + " or " + alias + campos[i] + " =100" + ")";
        } else {
            subQuery = subQuery + alias + campos[i] + " =:parametro" + i;

        }
        if (i !== campos.length - 1) {
            subQuery = subQuery + " and ";

        }
    }
    return subQuery;
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
    if (exito && excepcionArriba) {

        var $clone = $('#' + valores[0]).find('tr.hide').clone(true).removeClass('hide table-line');
        $clone[0].setAttribute("class", "hidetd");
        $clone.className = "hidetd";
        // $clone.id = rString;
        var edit = $clone[0].querySelector(".edit");
        if (edit) {
            edit.removeAttribute("value");
            edit.querySelector(".editKey").value = "";

        }
        $('#' + valores[1]).append($clone);
    }
}

function tableRemove(registro) {
    var i = 0;
    var id = registro.id;
    if (parseInt(id)) {
        for ( i = 0; i < listaAsistenciaGlobales.length; i++) {
            if (listaAsistenciaGlobales[i].id === parseInt(id)) {
                listaAsistenciaGlobales.splice(i, 1);
                break;
            }
        }
        //for (var i = 0; i < listaAsistNuevosYMod.length; i++) {
        //    if (listaAsistNuevosYMod[i].id === parseInt(id)) {
        //        listaAsistNuevosYMod.splice(i, 1);
        //        break;
        //    }
        //}
        listaAsistDelete[listaAsistDelete.length] = parseInt(id);

    } else {
        for ( i = 0; i < listaAsistenciaGlobales.length; i++) {
            if (listaAsistenciaGlobales[i].id === id) {
                listaAsistenciaGlobales.splice(i, 1);
                break;
            }
        }
    }

    llenartablaAsis(start, end, construirDatosTBL(start, end));
    //  alert("eliminado" + ".- " + name.id);
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
        } else if (tr.cells[i].getAttribute('persist') === "jornada") {
            obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
        }
    }

    if (tr.id === "") {
        var rString = "id" + randomString(2, '0123456789');
        obj['id'] = rString;
        tr.id = obj.id;
        agregarAsist(obj);
    } else {
        obj['id'] = tr.id;
        actualizarAsist(obj);
    }

}

function cambiarPagina(valores) {
    //alert(valores);
    end = rowsByPage;
    start = valores['fromPage'];
    if (listaAsistenciaGlobales.length > rowsByPage) {
        var res = (rowsByPage + start) - listaAsistenciaGlobales.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = listaAsistenciaGlobales.length;
    }
    var listaAux = construirDatosTBL(start, end);
    llenartablaAsis(start, end, listaAux);
}

function construirAsist(data) {
    //console.log(data);
    for (var i = 0; i < data.length; i++) {
        // var datosAsistencia = {};
        var asistencias = {};
        asistencias.id = data[i].id;
        asistencias.periodosNomina_ID = parseInt(document.getElementById("editPeriodoNomina").getAttribute("value"));
        asistencias.tipoNomina_ID = parseInt(document.getElementById("editTipoNomina").getAttribute("value"));
        asistencias.razonesSociales_ID = razonSocialActual.id;
        asistencias.tipoPantalla = configuracionAsistencia.id;
        asistencias.empleados_ID = empleados.id;
        if (centroCostoArriba) {
            asistencias.centroDeCosto_ID = parseInt(document.getElementById("editCentroDeCostos").getAttribute("value"));
        } else if (centroCostoAbajo) {
            asistencias.centroDeCosto_ID = data[i].centroDeCosto_ID;
        }
        asistencias.excepciones = {};
        asistencias.excepciones.clave = data[i].excepciones_ID.clave;
        asistencias.excepciones.excepcion = data[i].excepciones_ID.descripcion;

        asistencias.excepciones.id = data[i].excepciones_ID.id;
        asistencias.excepciones_ID = data[i].excepciones_ID.id;
        asistencias.fecha = data[i].fechaAsistencia;
        asistencias.jornada = parseFloat(data[i].jornada);
        asistencias.ordenId = i + 1;
        asistencias.cantidad = null;
        asistencias.statusFila = "NUEVO";
        // datosAsistencia.asistencia = asistencias;
        // datosAsistencia.statusFila = "Nuevo";
        listaAsistenciaGlobales[listaAsistenciaGlobales.length] = asistencias;
        // listaAsistNuevosYMod[listaAsistNuevosYMod.length] = asistencias;
    }


}

function agregarAsist(valoresTabla) {
    var obj = {};
    obj.id = valoresTabla.id;
    obj.periodosNomina_ID = parseInt(document.getElementById("editPeriodoNomina").getAttribute("value"));
    obj.tipoNomina_ID = parseInt(document.getElementById("editTipoNomina").getAttribute("value"));
    obj.razonesSociales_ID = razonSocialActual.id;
    obj.tipoPantalla = configuracionAsistencia.id;
    if (empleadoArriba) {
        obj.empleados_ID = empleados.id;
    }

    if (excepcionArriba) {
        obj.excepciones_ID = parseInt(document.getElementById("selExcepcion").value);
        obj.excepciones = excepcion;
    }

    if (centroCostoArriba) {
        obj.centroDeCosto_ID = parseInt(document.getElementById("editCentroDeCostos").getAttribute("value"));
    } else if (centroCostoAbajo) {
        obj.centroDeCosto_ID = valoresTabla[i].centroDeCosto_ID;
    }

    if (valoresTabla.excepciones_ID) {
        obj.excepciones_ID = valoresTabla.excepciones_ID;
    }

    if (valoresTabla.empleados_ID) {
        obj.empleados_ID = valoresTabla.empleados_ID;
        obj.empleados = empleados;
    }
    if (valoresTabla.fechaAsistencia) {
        obj.fecha = valoresTabla.fechaAsistencia;
    }

    if (valoresTabla.jornada) {
        obj.jornada = parseFloat(valoresTabla.jornada);
    }
    //obj.jornada = parseFloat(valoresTabla.jornada);
    if (listaAsistenciaGlobales.length > 0) {
        obj.ordenId = listaAsistenciaGlobales[listaAsistenciaGlobales.length - 1].ordenId + 1;
    } else {
        obj.ordenId = 1;
    }
    if (valoresTabla.cantidad) {
        obj.cantidad = valoresTabla.cantidad;
    } else {
        obj.cantidad = undefined;
    }
    obj.statusFila = "NUEVO";
    // datosAsistencia.asistencia = asistencias;
    // datosAsistencia.statusFila = "Nuevo";
    //listaAsistenciaGlobales[listaAsistenciaGlobales.length] = asistencias;
    listaAsistenciaGlobales[listaAsistenciaGlobales.length] = obj;
    if (listaAsistenciaGlobales.length > rowsByPage) {
        end = rowsByPage; 
    } else {
        end = listaAsistenciaGlobales.length;
    }

    llenartablaAsis(start, end, construirDatosTBL(start, end));
}

function actualizarAsist(valoresTabla) {
    var asistenciaAux = {};
    var i = 0;
    if (parseInt(valoresTabla.id)) {

        for ( i = 0; i < listaAsistenciaGlobales.length; i++) {
            if (listaAsistenciaGlobales[i].id === parseInt(valoresTabla.id)) {
                asistenciaAux = listaAsistenciaGlobales[i];
                if (valoresTabla.empleados_ID) {
                    asistenciaAux.empleados_ID = empleados.id;
                }

                if (valoresTabla.excepciones_ID) {
                    var objeto = buscarExcepcion(valoresTabla.excepciones_ID);
                    asistenciaAux.excepciones_ID = valoresTabla.excepciones_ID;
                    asistenciaAux.excepciones.id = valoresTabla.excepciones_ID;
                    asistenciaAux.excepciones.clave = objeto.clave;
                    asistenciaAux.excepciones.excepcion = objeto.excepcion;
                }
                if (excepcionArriba) {
                    asistenciaAux.excepciones_ID= parseInt(document.getElementById("selExcepcion").value);
                }
                if (valoresTabla.fechaAsistencia) {
                    asistenciaAux.fecha = valoresTabla.fechaAsistencia;
                }

                if (valoresTabla.jornada) {
                    asistenciaAux.jornada = valoresTabla.jornada;
                }

                
                if (valoresTabla.cantidad) {
                    asistenciaAux.cantidad = valoresTabla.cantidad;
                } else {
                    asistenciaAux.cantidad = valoresTabla.cantidad;
                }
                asistenciaAux.statusFila = "MODIFICADOBDS";
                listaAsistenciaGlobales[i] = asistenciaAux;
                break;
            }
        }

    } else {
        for ( i = 0; i < listaAsistenciaGlobales.length; i++) {
            if (listaAsistenciaGlobales[i].id === valoresTabla.id) {
                asistenciaAux = listaAsistenciaGlobales[i];
                if (valoresTabla.empleados_ID) {
                    asistenciaAux.empleados_ID = valoresTabla.empleados_ID;
                }

                if (valoresTabla.excepciones_ID) {
                    asistenciaAux.excepciones_ID = valoresTabla.excepciones_ID;
                }
                if (excepcionArriba) {
                    asistenciaAux.excepciones_ID = parseInt(document.getElementById("selExcepcion").value);
                }
                if (valoresTabla.fechaAsistencia) {
                    asistenciaAux.fecha = valoresTabla.fechaAsistencia;
                }
                if (valoresTabla.jornada) {
                    asistenciaAux.jornada = valoresTabla.jornada;
                }
                if (valoresTabla.cantidad) {
                    asistenciaAux.cantidad = valoresTabla.cantidad;
                }
                listaAsistenciaGlobales[i] = asistenciaAux;
                break;
            }
        }
    }
}

function buscarExcepcion(idex) {
    idex= parseInt(idex);
    if (idex === falta.id) {
        return falta;
    } else if (idex === descanso.id) {
        return descanso;
    } else if (idex === laborado.id) {
        return laborado;
    } else if (idex === retardo.id) {
        return retardo;
    } else if (idex === extraDoble.id) {
        return extraDoble;
    } else if (idex === extraTriple.id) {
        return extraTriple;
    } else if (idex === festivo.id) {
        return festivo;
    } else if (idex === festivoLaboral.id) {
        return festivoLaboral;
    } else if (idex === domingoLaboral.id) {
        return domingoLaboral;
    } else if (idex === tiempoExtra.id) {
        return tiempoExtra;
    } else if (idex === descansoLaboral.id) {
        return descansoLaboral;
    }

    
}

function getExcepcion(values) {
    
    for (var i = 0; i < listaexcepcion.length; i++) {
        if (parseInt(values[1]) === listaexcepcion[i].id) {
            excepcion = listaexcepcion[i];
            break;
        }
    }
    $(".imgDelete").off();
    $(".tdTable").off();
    $(".tdInputText").off();
    $(".seltd").off();
    $(".tdedit").off();
    $(".tdInputDate").off();
    var tdCantidad = values[2].querySelector("td[persist=cantidad]");


    if (excepcion.clave === "2") {
        tdCantidad.setAttribute("contenteditable", true);
        tdCantidad.setAttribute("tipocompon", "select");
        while (tdCantidad.firstChild) {
            tdCantidad.removeChild(tdCantidad.firstChild);
        }
        var div = document.createElement('div');
        div.className = "select-style";
        div.id = "divCantidad";
        div.style.width = "100%";
        div.style.display = "none";
        var select = document.createElement('select');
        select.id = "ckbCantidad";
        select.className = "seltd";
        select.style.width = "100%";
        var option = document.createElement("option");
        option.value = "1";
        option.text = "1";
        select.add(option);
        var option2 = document.createElement("option");
        option2.value = "0.50";
        option2.text = "0.5";
        select.add(option2);
        // select.setAttribute("funcion", parsel.nameColumns[i].funcion);

        div.appendChild(select);
        tdCantidad.appendChild(div);
        tdCantidad.appendChild(document.createTextNode("1"));
        tdCantidad.setAttribute("valor", "1");
        addEventos();
        return false;
    } else if (excepcion.clave === "10") {
        tdCantidad.setAttribute("contenteditable", true);
        tdCantidad.setAttribute("tipocompon", "text");
        while (tdCantidad.firstChild) {
            tdCantidad.removeChild(tdCantidad.firstChild);
        }
        var input = document.createElement("input");
        input.className = "mainPanelContentComponents";
        input.id = "txt_Cantidad";
        input.type = "text";
        input.className = "tdInputText";
        input.style.width = "100%";
        input.style.display = "none";
        //td.setAttribute("tipoCompon", parsel.nameColumns[i].tipoCompon);
        tdCantidad.appendChild(input);
        addEventos();
    } else if (excepcion.clave === "13" || excepcion.clave === "14" || excepcion.clave === "15") {
        tdCantidad.setAttribute("contenteditable", true);
        tdCantidad.setAttribute("tipocompon", "text");
        while (tdCantidad.firstChild) {
            tdCantidad.removeChild(tdCantidad.firstChild);
        }
        var input2 = document.createElement("input");
        input2.className = "mainPanelContentComponents";
        input2.id = "txt_Cantidad";
        input2.type = "text";
        input2.className = "tdInputText";
        input2.style.width = "100%";
        input2.style.display = "none";
        //td.setAttribute("tipoCompon", parsel.nameColumns[i].tipoCompon);
        tdCantidad.appendChild(input2);
        addEventos();
    } else {
        tdCantidad.setAttribute("contenteditable", false);
        while (tdCantidad.firstChild) {
            tdCantidad.removeChild(tdCantidad.firstChild);
        }
        addEventos();
    }
    
}

function selecionarExcepcion(valor) {
    //var excepcion;
    for (var i = 0; i < listaexcepcion.length; i++) {
        if (parseInt(valor) === listaexcepcion[i].id) {
            excepcion = listaexcepcion[i];
            break;
        }
    }
    if (excepcion.clave === "2") {
        isFalta = true;
    } else if (excepcion.clave === "10") {
        isDescansoLaborado = true;
    } else if (excepcion.clave === "13" || excepcion.clave === "14" || excepcion.clave === "15") {
        isTiempoExtra = true;
    } else {
        isFalta = false;
        isDescansoLaborado = false;
        isTiempoExtra = false;
    }
    var element = document.getElementById('contTable');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    valorSeleccionado();
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function limpiarAsistAntesDeSave() {

    for (var i = 0; i < listaAsistNuevosYMod.length; i++) {
        // console.log(new Date(listaAsistNuevosYMod[i].fecha));
        listaAsistNuevosYMod[i].empleados = undefined;
        listaAsistNuevosYMod[i].excepciones = undefined;
        listaAsistNuevosYMod[i].centroDeCosto = undefined;
        // var fecha = new Date(listaAsistNuevosYMod[i].fecha);
        //listaAsistNuevosYMod[i].fecha = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

        delete listaAsistNuevosYMod[i].statusFila;
        if (!Number.isInteger(listaAsistNuevosYMod[i].id)) {
            listaAsistNuevosYMod[i].id = 0;
        }
    }

}

function saveAsistencia() {
    var obj = {};
    for (var i = 0; i < listaAsistenciaGlobales.length; i++) {
        if (listaAsistenciaGlobales[i].statusFila === "NUEVO" || listaAsistenciaGlobales[i].statusFila === "MODIFICADOBDS") {
            listaAsistNuevosYMod[listaAsistNuevosYMod.length] = listaAsistenciaGlobales[i];
        }
    }

    limpiarAsistAntesDeSave();
    obj["SaveUpdate"] = listaAsistNuevosYMod;

    if (listaAsistDelete.length > 0) {
        obj["Delete"] = listaAsistDelete;
    }
    if (detalleAsis.length > 0) {
        var listaDetalleDele = new Array();
        for (var j = 0; j < detalleAsis.length; j++) {
            listaDetalleDele[j] = detalleAsis[j].id;
        }
        if (listaDetalleDele.length > 0) {
            obj["DeleteDetalleAsist"] = listaDetalleDele;
        }
    }
    horas();
    obj["SaveUpdateDetalleAsist"] = listaDetallesAsistencia;
    var url = route + "/api/Asistencias/saveAsistencias";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        cancelar();
    } else {
        cancelar();
    }
}

function horas() {
    var semanaAsis = new Array();
    var noWeeks = false;
    var descomprime = listaAsistenciaGlobales;
    /// console.log(descomprime.sort((a, b) =>a.fecha < b.fecha));
    descomprime.sort((a, b) => a.fecha > b.fecha);
    var semanaActual = 1;
    var diviSem = new Array();
    var diasSem = new Array();
    var listOfDays = new Array();

    for (var i = 0; i < descomprime.length; i++) {
        if (descomprime[i].fecha !== null && descomprime[i].excepciones_ID !== null) {
            if ((tiempoExtra !== null && parseInt(descomprime[i].excepciones_ID) === tiempoExtra.id)
                || (extraDoble !== null && parseInt(descomprime[i].excepciones_ID) === extraDoble.id)
                || (extraTriple !== null && parseInt(descomprime[i].excepciones_ID) === extraTriple.id)) {
                var numSema = identificaSemana(descomprime[i]);
                diviSem[diviSem.length] = descomprime[i];
                if (numSema > semanaActual) {
                    semanaAsis[semanaAsis.length] = diviSem.slice(0, diviSem.length - 1);
                    diviSem = new Array();
                    diviSem[diviSem.length] = descomprime[i];
                    semanaActual++;
                    //console.log(numSema);
                }
                noWeeks = true;
            }
        }
    }

    semanaAsis[semanaAsis.length] = diviSem.slice(0, diviSem.length);
    //console.log(semanaAsis);

    if (noWeeks) {
        var i = 0;
        for (i = 0; i < semanaAsis.length; i++) {
            var diasAsis = semanaAsis[i];
            if (diasAsis !== null) {
                var next = true;
                var posV = 0, segmento = 0;
                if (diasAsis.length === 1) {
                    diasSem[diasSem.length] = diasAsis[0];
                    var rangoDay = [segmento, posV];
                    listOfDays[listOfDays.length] = rangoDay;
                } else {
                    while (next) {
                        if (new Date(diasAsis[posV + 1].fecha) > new Date(diasAsis[posV].fecha)) {
                            var rangoDay = [segmento, posV];
                            listOfDays[listOfDays.length] = rangoDay;
                            while (segmento <= posV) {
                                //Al separar agregamos las horas Dobles y Triples
                                diasSem[diasSem.length] = diasAsis[segmento];
                                segmento++;

                            }
                            segmento = posV + 1;
                        }

                        posV++;
                        if (diasAsis.length - 1 === posV) {
                            var rangoDay = [segmento, posV];
                            listOfDays[listOfDays.length] = rangoDay;
                            while (segmento <= posV) {
                                //Al separar agregamos las horas Dobles y Triples
                                diasSem[diasSem.length] = diasAsis[segmento];
                                segmento++;
                                //  System.out.println(formato.format(diaAsis.get(posV).getFecha()));
                            }
                            next = false;
                        }
                    }
                }

                agregadoDetalles(diasSem, listOfDays);
                diasSem = new Array();
                listOfDays = new Array();
                MAXDOBLESEMX = 9.0;
            }
        }
    }
}

function agregadoDetalles(diasSem, listOfDays) {
    /*
       * Una vez obtenido el horario se hara la repartición de horas dobles y
       * triples a la tabla de detalles de asistencias por la semana
       */
    var cantidad = 0.0, doble = 0.0, triple = 0.0, cantDoble = 0.0, cantTriple = 0.0;
    var detalle;

    // Descomprimimos nuestra lista por los dias de esa semana
    for (var i = 0; i < listOfDays.length; i++) {
        var strat = parseInt(listOfDays[i][0]);
        var end = parseInt(listOfDays[i][1]);
        if (automatico) {
            cantidad = sumaHoras(diasSem, strat, end);
            if (MAXDOBLESEMX > 0) {
                if (MAXDOBLESEMX - MAXDOBLEDIAX > 0) {
                    doble = MAXDOBLESEMX - (MAXDOBLESEMX - MAXDOBLEDIAX);
                } else if (MAXDOBLESEMX - MAXDOBLEDIAX <= 0) {
                    doble = MAXDOBLEDIAX + (MAXDOBLESEMX - MAXDOBLEDIAX);
                }
                if (cantidad < 3) {
                    if (MAXDOBLESEMX - cantidad > 0) {
                        doble = MAXDOBLESEMX - (MAXDOBLESEMX - cantidad);
                    } else if (MAXDOBLESEMX - cantidad < 0) {
                        doble = MAXDOBLESEMX;
                        triple = cantidad - MAXDOBLESEMX;
                    }
                } else if (cantidad > 3) {
                    if (doble - cantidad < 0) {
                        triple = (cantidad - doble);
                        doble = ((doble - cantidad) + cantidad);
                    } else if (doble - cantidad > 0) {
                        triple = (cantidad - doble);
                        doble = ((doble - cantidad));
                    }
                }
                MAXDOBLESEMX = (MAXDOBLESEMX - doble);
                cantDoble = doble;
                cantTriple = triple;

            } else {
                cantDoble = doble;
                cantTriple = cantidad;

            }


        } else {
            //para agregados de horas manuales separamos las triples y dobles de ese dia
            var dobles = new Array();
            var triples = new Array();
            for (var i = start; i < end + 1; i++) {
                if (extraDoble !== null && diasSem[i].excepciones_ID === extraDoble.id) {
                    dobles.add(diasSem.get(i));
                }
                if (extraTriple !== null && diasSem[i].excepciones_ID === extraTriple.id) {
                    triples[triples.length] = diasSem[i];
                }
            }
            if (dobles.length > 0) {
                cantDoble = cantidad = sumaHoras(dobles, 0, dobles.length - 1);
                dobles = new Array();
            }
            if (triples.length > 0) {
                cantTriple = cantidad = sumaHoras(triples, 0, triples.length - 1);
                triples = new Array();
            }
        }

        detalle = {};
        detalle.tipoNomina_ID = diasSem[strat].tipoNomina_ID;
        detalle.periodosNomina_ID = diasSem[strat].periodosNomina_ID;
        detalle.centroDeCosto_ID = diasSem[strat].centroDeCosto_ID;
        detalle.empleados_ID = diasSem[strat].empleados_ID;
        detalle.razonesSociales_ID = diasSem[strat].razonesSociales_ID;
        detalle.tipoPantalla = diasSem[strat].tipoPantalla;
        detalle.dia = diasSem[strat].fecha;
        detalle.horaDoble = cantDoble;
        detalle.horaTriple = cantTriple;
        listaDetallesAsistencia[listaDetallesAsistencia.length] = detalle;
        cantidad = 0.00;
        doble = 0.00;
        triple = 0.00;
    }
    //console.log(listaDetallesAsistencia);
}

function sumaHoras(a, start, end) {
    //Aqui se realizan la sumatoria de los dias para el desglose de horas dobles y triples
    var sum = 0.00;
    var mRal = 0;
    var sRal;
    for (var i = start; i < end + 1; i++) {
        sRal = a[i].cantidad.toString();
        mRal += parseInt(sRal.substring(sRal.indexOf(".") + 1, sRal.length));
        sum += parseFloat(sRal.toString());


    }

    sRal = "." + mRal;
    //Aplicación de la formula para la extracción de las horas reales
    var valor = parseFloat(sum).toFixed(2);
    var minutos = parseInt(valor.substring(valor.indexOf(".") + 1, valor.length)), hora = 0;
    var d = parseInt(sum);
    var horario;
    hora = parseInt(minutos / 60);
    minutos = minutos - (hora * 60);
    horario = (hora + d) + (minutos / 100);
    console.log(horario);
    return horario;

}

function semanas(desdeFecha, hastaFecha) {
    var defecha = new Date(desdeFecha);
    var afecha = new Date(hastaFecha);
    var milisafecha = defecha.getTime();
    var milisdefecha = afecha.getTime();
    var dif = milisdefecha - milisafecha;
    var difDias = dif / (24 * 60 * 60 * 1000);
    var dias = parseInt(difDias + 1);
    var semana = 0;
    var aumFecha = defecha;
    var dimFecha = new Date();
    dimFecha.setDate(afecha.getDate());
    dimFecha.setFullYear(afecha.getFullYear());
    dimFecha.setMonth(afecha.getMonth());

    for (var i = 1; i < dias + 1; i++) {
        if (dias < 7) {
            semana++;
            var obj = {};
            obj.semana = semana;
            obj.deFecha = formatDateddmmyyy(desdeFecha);
            obj.hastaFecha = hastaFecha;
            listaSemanas[listaSemanas.length] = obj;
            break;
        }
        if (i % 7 === 0 && i !== 0) {
            semana++;
            aumFecha.setDate(aumFecha.getDate() + 6);

            dimFecha.setDate(aumFecha.getDate());
            dimFecha.setDate(dimFecha.getDate() - 6);

            var obj = {};
            obj.semana = semana;
            obj.deFecha = formatDateddmmyyy(dimFecha);
            obj.hastaFecha = formatDateddmmyyy(aumFecha);
            listaSemanas[listaSemanas.length] = obj;
            aumFecha.setDate(aumFecha.getDate() + 1);
            if (dias - i < 7 && dias - i !== 0) {
                semana++;
                aumFecha.setDate(aumFecha.getDate() + (dias - i));
                dimFecha.setDate(aumFecha.getDate());
                dimFecha.setDate(dimFecha.getDate() - (dias - i));
                var obj = {};
                obj.semana = semana;
                obj.deFecha = formatDateddmmyyy(dimFecha);
                obj.hastaFecha = formatDateddmmyyy(afecha);
                listaSemanas[listaSemanas.length] = obj;
                break;
            }

        }
    }

}

function identificaSemana(asist) {
    var numSemana = 0;
    for (var i = 0; i < listaSemanas.length; i++) {
        if (operacionRangoFecha(listaSemanas[i].deFecha, listaSemanas[i].hastaFecha, asist.fecha)) {
            numSemana = listaSemanas[i].semana;
            break;
        }
    }

    return numSemana;
}

function operacionRangoFecha(fechaInic, Fechafinal, comparaFecha) {
    var fechaIni = new Date(fechaInic);
    var fechaFin = new Date(Fechafinal);
    var fechaCompa = new Date(comparaFecha);
    var a = false;

    if ((fechaCompa > fechaIni || fechaCompa.getTime() === fechaIni.getTime())
        && (fechaCompa < fechaFin || fechaCompa.getTime() === fechaFin.getTime())) {
        a = true;
    }
    return a;
}

function llenartablaAsis(start, end, asistencia) {
   
    llenarTablaGen("Asistencia", asistencia, start, end);
}

function construirDatosTBL(start,end) {
    var asistenciasAux = new Array();
    for (var i = start; i < end; i++) {
        var row = {};
        row.id = listaAsistenciaGlobales[i].id;
        //console.log(formatDateddmmyyy(calendarDesde));
        row.fechaAsistencia = formatDateddmmyyy(new Date(listaAsistenciaGlobales[i].fecha));
        row.diaSemana = arregloDiasSemana[new Date(listaAsistenciaGlobales[i].fecha).getDay()];
        row.jornada = listaAsistenciaGlobales[i].jornada;
        if (excepcionAbajo) {
            var exp = {};
            exp.id = listaAsistenciaGlobales[i].excepciones_ID;
            exp.descripcion = listaAsistenciaGlobales[i].excepciones.excepcion;
            row.excepciones_ID = exp;
        } else if (empleadoAbajo) {

            var empleado = listaAsistenciaGlobales[i].empleados;
            row.nombreEmpleado = empleado.apellidoPaterno + " " + empleado.apellidoMaterno + " " + empleado.nombre;
            row.empleados_ID = empleado.clave;

        }

        if (listaAsistenciaGlobales[i].cantidad === null) {
            row.cantidad = "";
        } else {
            if (listaAsistenciaGlobales[i].excepciones.clave === "2") {
                if (parseInt(listaAsistenciaGlobales[i].cantidad) === 1) {
                    if (excepcionArriba) {
                        var obj = {};
                        obj.id = listaAsistenciaGlobales[i].cantidad;
                        obj.descripcion = "1";
                        row.cantidad = obj;
                    } else {
                        row.cantidad = "1";
                    }
                } else {
                    if (excepcionArriba) {
                        var obj2 = {};
                        obj2.id = listaAsistenciaGlobales[i].cantidad;
                        obj2.descripcion = "0.5";
                        row.cantidad = obj2;
                    } else {
                        row.cantidad = "0.5";
                    }
                }
            } else {
                row.cantidad = listaAsistenciaGlobales[i].cantidad;
            }
        }

        asistenciasAux[i] = row;

       
    }

    return asistenciasAux;
}

function validarAsistenciaBD(fecha,claveEmpleado,clavePeriodo,claveTipoNomina,claveRazon){
    var obj = {};
    obj.fecha = fecha;
    obj.claveEmpleado = claveEmpleado;
    obj.clavePeriodo = clavePeriodo;
    obj.claveTipoNomina = claveTipoNomina;
    
    obj.claveRazon = claveRazon;
    var resultado;
    var url = route + "/api/Asistencias/buscaAsistenciaExitente";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        resultado = null;
    } else {
        resultado = Mensaje.resultado;
    }

    return resultado;
}