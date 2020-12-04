var razonSocialActual;
var fechaInicial;
var fechaFinal;
var claveCredito = null;
var tipoConfiguracion = null;
var creditoDescripcion = null;
var claveEmpIni = null;
var claveEmpFin = null;
var capturaCredito = null;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    getRazonSocialActual();
    fechaSistemasRegCred = getFechaSistema();
    var fecha = formatDate(fechaSistemasRegCred);
    document.getElementById("txtFechaInicial").disabled = true;
    document.getElementById("txtFechaInicial").value = fecha;
    document.getElementById("txtFechaFinal").value = fecha;
    startCustomTools();
});

function getRazonSocialActual() {

    razonSocial = getRazonSocial();
    var url = route + "/api/CreditoAhorro/getRazonSocialPorID";
    var dataToPost = JSON.stringify(razonSocial.id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        razonSocialActual = Mensaje.resultado;
    }

    // return razonSocialActual;
    /// console.log(razonSocialActual);
}

function setEditTipoCredito() {
    nameCmp = "EditTipoCreditos";
    table = "CreditoAhorro";
    nameCols = nameCols = idiomaSelecionado.messageFormatter("ConfiguracionCredAhoClave")() + "," + idiomaSelecionado.messageFormatter("ConfiguracionCredAhoDescripcion")();
    // nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    var subEntities = "razonesSociales";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion,capturarCreditoTotal";
    var tituloSel = "";
    var tamañoSel = "size-2";
    if (document.getElementById("cbxTipoConfiguracion").value === "1") {
        tituloSel = "credito";
    } else {
        tituloSel = "ahorro";
    }

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id, "tipoConfiguracion": document.getElementById("cbxTipoConfiguracion").value };

    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de registro patronal", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre del registro patronal", "tipo": "string", "campo": "nombreregtpatronal", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditTipoCreditoShow(values) {
    if (values !== null) {
        console.log(values);
        claveCredito = values[0].Clave;
        //tipoConfiguracion = values[0].TipoConfiguracion;
        creditoDescripcion = values[0].Descripcion;
        capturaCredito = values[0].CapturarCreditoTotal;
    }
}

function setEditInicioEmpleados() {
    nameCmp = "EditInicioEmpleados";
    table = "Empleados";
    nameCols = idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    campos = "clave,nombre,apellidoPaterno,apellidoMaterno,nombreAbreviado";
    camposObtener = "clave,apellidoPaterno,apellidoMaterno,nombre";

    camposMostrar = ["clave", "nombre"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };

    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de registro patronal", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre del registro patronal", "tipo": "string", "campo": "nombreregtpatronal", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditInicioEmpleadosShow(values) {
    if (values !== null) {
        
        claveEmpIni = values[0].Clave;
    }
}

function setEditFinEmpleado() {
    nameCmp = "EditFinEmpleado";
    table = "Empleados";
    nameCols = idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    campos = "clave,nombre,apellidoPaterno,apellidoMaterno,nombreAbreviado";
    camposObtener = "clave,apellidoPaterno,apellidoMaterno,nombre";

    camposMostrar = ["clave", "nombre"];

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de registro patronal", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre del registro patronal", "tipo": "string", "campo": "nombreregtpatronal", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditFinEmpleadoShow(values) {
    if (values !== null) {
       
        claveEmpFin = values[0].Clave;
    }
}

function setEditCentroCostos() {
    //Parameters
    nameCmp = "EditCentroCostos";
    table = "CentroDeCosto";
    nameCols = idiomaSelecionadoCol.messageFormatter("CentroDeCostoclave")() + "," + idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcion")() + "," +
        idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcionPrevia")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronal")();
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

    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de Centro de costos", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de Centro de costos", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditCentroCostosShow(values) {
    if (values !== null) {
        console.log(values);
    }
}

function activarRangoFecha(cmp) {
    if (cmp.checked) {
        document.getElementById("txtFechaInicial").disabled = false;
    } else {
        document.getElementById("txtFechaInicial").disabled = true;
    }
}

function construirDatos() {
    var obj = {};
    if (document.getElementById("txtImprimirFechas").checked) {
        fechaInicial = formantDdMmYyyy(document.getElementById("txtFechaInicial").value);
        fechaFinal = formantDdMmYyyy(document.getElementById("txtFechaFinal").value);
        obj.fechaInicial = fechaInicial;
        obj.fechaFinal = fechaFinal;
    } else {
       //( fechaInicial = formatDateddmmyyy(new Date(fechaInicial));
        fechaFinal = formantDdMmYyyy(document.getElementById("txtFechaFinal").value);
       // obj.fechaInicial = formatDateddmmyyy(new Date(fechaInicial));
        obj.fechaFinal = fechaFinal;
    }
    if (document.getElementById("txtIncluirSinSaldo").checked) {
        obj.IncluirSinSaldo = true;
    } else {
        obj.IncluirSinSaldo = false;
    }
    obj.claveRazonsocial = razonSocialActual.clave;
    obj.claveCredito = claveCredito;
    obj.tipoConfiguracion = document.getElementById("cbxTipoConfiguracion").value;
    var filtrosPersonalizados = "";
    if (capturaCredito !== null) {
        obj.capturaCredito = capturaCredito;
    }
    //if (tipoConfiguracion !== null) {
    //    filtrosPersonalizados = filtrosPersonalizados + " AND credAho.tipoConfiguracion  = '" + document.getElementById("cbxTipoConfiguracion").value + "' ";
    //}

    if (claveEmpIni !== null && claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave BETWEEN '" + claveEmpIni + "' AND '" + claveEmpFin + "' ";
    } else if (claveEmpIni !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave >= '" + claveEmpIni + "' ";
    } else if (claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave <= '" + claveEmpFin + "' ";
    }

    obj.filtrosPersonalizados = filtrosPersonalizados;
    //obj.filtrosOrden = filtrosOrden;
    //(console.log(obj);

    return obj;
}

function visualizar() {
    var dataToPost1 = JSON.stringify(construirDatos());
    var url1 = route + "/api/Generic/getReporteCreditoAhorro";
    var Mensaje1 = Common.sendRequestJson('POST', url1, dataToPost1, undefined, false);
    if (Mensaje1 === null) {
        console.log(Mensaje1);
    } else {
        console.log(Mensaje1);
        var datos = new Array();
        datos[0] = JSON.stringify(Mensaje1);
        var domicilio = razonSocialActual.calle;
        domicilio = domicilio + " " + razonSocialActual.numeroex;
        domicilio = domicilio + " " + razonSocialActual.colonia;

        if (razonSocialActual.ciudades !== null) {
            domicilio = domicilio + " " + razonSocialActual.ciudades.descripcion;
        }

        if (razonSocialActual.estados !== null) {
            domicilio = domicilio + " " + razonSocialActual.estados.descripcion;
        }
        var tituloPeriodo = "";
        if (document.getElementById("txtImprimirFechas").checked) {
            tituloPeriodo = "Del " + fechaInicial + " Al " + fechaFinal;
        } else {
            tituloPeriodo ="Al " + fechaFinal;
        }
        //var tituloPeriodo = "Del " + fechaInicial + " Al " + fechaFinal;
        var rfcRegpat = "RFC: " + razonSocialActual.rfc;
        var objDatos = {};
        objDatos.tituloEmpresa = razonSocial.nombreRazon;
        objDatos.tituloDomicilio = domicilio;
        objDatos.tituloDatosEmpresa = rfcRegpat;
        objDatos.tituloNombreReporte = "Estado de cuenta " + creditoDescripcion;
        objDatos.tituloPeriodo = tituloPeriodo;
        //objDatos.tituloConcepto = tituloConcepto;
        objDatos.reporte = "Content/ReporteCreditoAhorro.mrt";
        datos[1] = JSON.stringify(objDatos);

        window.localStorage.setItem("DataReporte", JSON.stringify(datos));
        window.open(route + "/VisualizarReporte.html", '_blank');
    }
}