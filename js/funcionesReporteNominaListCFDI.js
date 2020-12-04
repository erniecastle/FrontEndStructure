var fechaSistemas;
var claveTipoCorrida = null;
var claveTipoNomina = null;
var fechaInicial = null;
var fechaFinal = null;
var claveDepartamentos = null;
var claveCentroCosto = null;
var claveEmpIni = null;
var claveEmpFin = null;
var razonSocialActual;
jQuery(document).ready(function () {
    fechaSistemas = getFechaSistema();
    var fecha = formatDate(fechaSistemas);
   // document.getElementById("txtFechaCalculo").value = fecha;
    document.getElementById("rbTodos").checked = true;
    getRazonSocialActual();
});


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

function setEditTipoCorrida() {

    //Parameters
    nameCmp = "EditTipoCorrida";
    table = "TipoCorrida";
    nameCols = idiomaSelecionado.messageFormatter("TipoCorridaclave")() + "," + idiomaSelecionado.messageFormatter("TipoCorridadescripcion")();
   // nameCols = "Clave,Descripción";
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

function setEditTipoCorridaShow(value) {
    if (value !== null) {
        var obj = value[0];
        claveTipoCorrida = obj.Clave;
    }
}


function setEditTipoNomina() {
    nameCmp = "EditTipoNomina";
    table = "TipoNomina";
    nameCols = idiomaSelecionado.messageFormatter("TipoNominaclave")() + "," + idiomaSelecionado.messageFormatter("TipoNominadescripcion")() + "," +
        idiomaSelecionado.messageFormatter("Periodicidaddescripcion")();
    // nameCols = "Clave,Descripcón,Periodicidad";
    campos = "clave,descripcion,periodicidad.descripcion";//Quit ID;
    camposObtener = "clave,descripcion,periodicidad.descripcion";
    var subEntities = "periodicidad"; //Unnecesary
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Tipo nomina";
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
        //document.getElementById('txtTipoNominaDetalle').value = obj.Clave + "-" + obj.Descripcion;
        //valorSeleccionado();
    }
}


function setEditPeriodoNomina() {
    //Parameters
    nameCmp = "EditPeriodoNomina";
    table = "PeriodosNomina";
    nameCols = idiomaSelecionado.messageFormatter("PeriodosNominaClave")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaDescripcion")() + "," +
        idiomaSelecionado.messageFormatter("PeriodosNominaFechaInicial")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaFechaFinal")() + "," +
        idiomaSelecionado.messageFormatter("PeriodosNominaFechaCierre")();
    //nameCols = "Clave,Descripción,Fecha inicial, Fecha final, Fecha cierre";
    campos = "clave,descripcion,Date:fechaInicial,Date:fechaFinal,Date:fechaCierre";
    camposObtener = "clave,descripcion,año,fechaInicial,fechaFinal,status";
    var subEntities = "tipoNomina,tipoCorrida";
    camposMostrar = ["clave", "descripcion"];

    var id = parseInt(document.getElementById('editTipoNomina').getAttribute("value"));
    var idCorrida = parseInt(document.getElementById('editTipoCorrida').getAttribute("value"));
    var preFilters = { "tipoNomina.id": id, "tipoCorrida.id": idCorrida };
    var tituloSel = "Periodos Nomina";
    var tamañoSel = "size-4";
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
        //fechaInicial = formatDatemmddyyy(new Date(obj.FechaInicial));
        //fechaFinal = formatDatemmddyyy(new Date(obj.FechaFinal));
        document.getElementById('txtFechaIni').value = formatDatemmddyyy(new Date(obj.FechaInicial));
        document.getElementById('txtFechaFin').value = formatDatemmddyyy(new Date(obj.FechaFinal));
       // statusPeriodo = obj.Status;

        //setFechasPer(obj.Id);


    }
}

function setEditDepartamento() {
    //Parameters
    nameCmp = "EditDepartamento";
    table = "Departamentos";
    nameCols = idiomaSelecionado.messageFormatter("Departamentosclave")() + "," + idiomaSelecionado.messageFormatter("Departamentosdescripcion")() + "," +
        idiomaSelecionado.messageFormatter("DepartamentossubCuenta")();
    // nameCols = "Clave,Descripción,Sub-Cuenta";
    campos = "clave,descripcion,subCuenta";
    var subEntities = "razonesSociales";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion,[]subCuenta";
    var tituloSel = "Departamento";
    var tamañoSel = "size-2";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };

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
        var obj = value[0];
        claveDepartamentos = obj.Clave;

    }
}

function setEditCentroCosto() {
    nameCmp = "EditCentroCosto";
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
        var obj = value[0];
        claveCentroCosto = obj.Clave;
    }
}

function setEditDelEmpleado() {

    //Parameters
    nameCmp = "EditDelEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols =  idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "[]plazasPorEmpleado.empleados.clave";
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno"];
    //camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];

    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": razonSocialActual.id
        /* "id#IN@": "(Select MAX(m.id) from PlazasPorEmpleadosMov m  WHERE m.plazasPorEmpleado.referencia = o.plazasPorEmpleado.referencia)",
         "plazasPorEmpleado.ingresosBajas.fechaBaja#>=": getFechaSistema(),*/
    };

    //Fechas en base al periodo
    if (document.getElementById("editPeriododNomina").getAttribute("value")) {

        //var valDateFromFilter = document.getElementById("txtDeFecha").value;
        var fechaDeFilter = new Date(fechaInicial);
        var fechaDeFilter2 = new Date(fechaDeFilter.getFullYear(), fechaDeFilter.getMonth(), fechaDeFilter.getDate(),0,0,0,0);
        
        //var valDateToFilter = document.getElementById("txtDeFecha").value;
        var fechaAFilter = new Date(fechaFinal);
        var fechaAFilter2 = new Date(fechaAFilter.getFullYear(), fechaAFilter.getMonth(), fechaAFilter.getDate(),0,0,0,0);
        


        preFilters["@BETWEEN1"] = [
            "(( o.fechaInicial <= :PB1) OR ( o.fechaInicial BETWEEN :PB1 AND :PB2 ))",
            "PB1", fechaDeFilter, "PB2", fechaAFilter];

        preFilters["@BETWEEN2"] = [
            "(( o.plazasPorEmpleado.fechaFinal >= :PB3  )  OR (o.plazasPorEmpleado.fechaFinal BETWEEN :PB4 AND :PB3))",
            "PB3", fechaAFilter, "PB4", fechaDeFilter];
        
    }

    //Centro de costo
    if (document.getElementById("editCentroDeCostos").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroDeCostos").getAttribute("value");
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
        claveEmpIni = obj[1];
        setEditObject("editEmpleadoFin", claveEmpIni);
        //
    }

}
function setEditAlEmpleado() {
    //Parameters
    nameCmp = "EditAlEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "[]plazasPorEmpleado.empleados.clave";
    //camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno"];
    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": razonSocialActual.id
        /* "id#IN@": "(Select MAX(m.id) from PlazasPorEmpleadosMov m  WHERE m.plazasPorEmpleado.referencia = o.plazasPorEmpleado.referencia)",
         "plazasPorEmpleado.ingresosBajas.fechaBaja#>=": getFechaSistema(),*/
    };

    //Fechas en base al periodo
    if (document.getElementById("editPeriododNomina").getAttribute("value")) {

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
    if (document.getElementById("editCentroDeCostos").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroDeCostos").getAttribute("value");
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
        claveEmpFin = obj[1];
      
        //

    }
}

function construirDatosCFDI() {
    var obj = {};
  

    obj.claveRazonsocial = razonSocialActual.clave;
    obj.fechaInicial = fechaInicial;
    obj.fechaFinal = fechaFinal;
    var filtrosPersonalizados = "";
    var filtrosOrden = "ORDER BY  ";
    // var prioridadNaturaleza = "AND (cnc.naturaleza = 1 or   cnc.naturaleza = 2 or cnc.naturaleza = 3 ) ";
    if (claveTipoNomina !== null) {
        filtrosPersonalizados = "AND tipNom.clave = '" + claveTipoNomina + "' AND pm.tipoNomina.clave = '" + claveTipoNomina + "' ";
    }

    if (claveTipoCorrida !==null) {
        // prioridadNaturaleza = prioridadNaturaleza + "AND tipcorr.clave = '" + claveTipoCorrida + "' ";
       
        filtrosPersonalizados = filtrosPersonalizados + " AND tipcorr.clave = '" + claveTipoCorrida + "' ";
    }


    if (claveCentroCosto !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cent.clave = '" + claveCentroCosto + "' ";
    }

    if (claveDepartamentos !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND dep.clave = '" + claveDepartamentos + "' ";
    }

    if (claveEmpIni !== null && claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave BETWEEN '" + claveEmpIni + "' AND '" + claveEmpFin + "' ";
    } else if (claveEmpIni !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave >= '" + claveEmpIni + "' ";
    } else if (claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave <= '" + claveEmpFin + "' ";
    }
    filtrosOrden = filtrosOrden + " CASE WHEN (emp IS NULL) THEN '' ELSE CASE WHEN (emp.clave IS NULL) THEN '' ELSE emp.clave END END";
    if (document.getElementById("rbPendientesTimbrar").checked) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cfdiRec.statusTimbrado = 4";
    } else if (document.getElementById("rbTimbrados").checked) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cfdiRec.statusTimbrado = 1";
    } else if (document.getElementById("rbCancelados").checked) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cfdiRec.statusTimbrado = 2";
    } else if (document.getElementById("rbPendienteCancelados").checked) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cfdiRec.statusTimbrado = 5";
    } else if (document.getElementById("rbUltimoCompEmpleado").checked) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cfdiRec.statusTimbrado = 1";
        //var filtros = filtrosPersonalizados;
        //filtrosPersonalizados = filtrosPersonalizados + " AND cfdiRec.fechaHoraTimbrado = (SELECT MAX(cfdiRec.fechaHoraTimbrado) FROM CFDIEmpleado cfdiEmp INNER JOIN cfdiEmp.cfdiRecibo cfdiRec INNER JOIN cfdiEmp.tipoNomina tipNom ";
        //filtrosPersonalizados = filtrosPersonalizados + " INNER JOIN  cfdiEmp.tipoCorrida tipcorr INNER JOIN cfdiEmp.razonesSociales rs INNER JOIN cfdiEmp.periodosNomina per  ";
        //filtrosPersonalizados = filtrosPersonalizados + " INNER JOIN cfdiEmp.plazasPorEmpleadosMov pm RIGHT OUTER JOIN pm.plazasPorEmpleado pl LEFT OUTER JOIN pl.empleados emp  ";
        //filtrosPersonalizados = filtrosPersonalizados + " LEFT OUTER JOIN pm.departamentos dep LEFT OUTER JOIN pm.centroDeCosto cent ";
        //filtrosPersonalizados = filtrosPersonalizados + " where rs.clave=:claveRazonsocial  AND ((per.fechaInicial BETWEEN :fechaInicial AND :fechaFinal) OR (per.fechaFinal BETWEEN :fechaInicial AND  :fechaFinal)) ";
        //filtrosPersonalizados = filtrosPersonalizados + filtros + ")  ";
    } else if (document.getElementById("rbTodos").checked) {
        filtrosOrden = filtrosOrden + ", CASE WHEN (cfdiRec IS NULL) THEN '' ELSE CASE WHEN (cfdiRec.fechaEmision IS NULL) THEN '' ELSE cfdiRec.fechaEmision END END";
    }

    //filtrosOrden = filtrosOrden + " CASE WHEN (emp IS NULL) THEN '' ELSE CASE WHEN (emp.clave IS NULL) THEN '' ELSE emp.clave END END";


    obj.filtrosPersonalizados = filtrosPersonalizados;
    obj.filtrosOrden = filtrosOrden;
    console.log(obj);

    return obj;
}

function visualizarRepNomCFDI() {
    //construirDatos();

    var dataToPost1 = JSON.stringify(construirDatosCFDI());
    var url1 = route + "/api/Generic/getReporteListadoCFDI";
    var Mensaje1 = Common.sendRequestJson('POST', url1, dataToPost1, undefined, false);
    if (Mensaje1 === null) {
        console.log("error");
    } else {
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


        
        var tituloPeriodo = "Del " + FechaInicial + " Al " + FechaFinal;
        var rfcRegpat = "RFC: " + razonSocialActual.rfc;
        var objDatos = {};
        objDatos.tituloEmpresa = razonSocialActual.razonsocial;
        objDatos.tituloDomicilio = domicilio;
        objDatos.tituloNombreReporte = "Reporte de nóminas CFDI";
        objDatos.tituloPeriodo = tituloPeriodo;
        objDatos.tituloDatosEmpresa = rfcRegpat;
        objDatos.reporte = "Content/ReporteListadoCFDI.mrt";
        datos[1] = JSON.stringify(objDatos);

        window.localStorage.setItem("DataReporte", JSON.stringify(datos));
        window.open(route + "/VisualizarReporte.html", '_blank');

    }
}

function limpiarRepNomCFDI() {
    document.getElementById("txtFechaIni").value = "";
    document.getElementById("txtFechaFin").value = "";
    clearEdit("editTipoCorrida");
    clearEdit("editTipoNomina");
    clearEdit("editPeriododNomina");
    clearEdit("editCentroDeCostos");
    clearEdit("editoDepartamento");    
    clearEdit("editEmpeladoInicio");
    clearEdit("editEmpleadoFin");  
    

}