var razonSocialActual;
var fechaSistemasBase;
var fechaInicial;
var fechaFinal;
var claveTipoCorrida = null;
var claveTipoNomina = null;
var claveRegPatronal = null;
var claveCtrCosto = null;
var claveDepto = null;
var claveEmpIni = null;
var claveEmpFin = null;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
   
    //llenarSelTipoCorrida();
    getRazonSocialActual();
    fechaSistemasBase = getFechaSistema();
    var fecha = formatDate(fechaSistemasBase);
    
    document.getElementById("txtFechaInicial").disabled = true;
    document.getElementById("txtFechaFinal").disabled = true;
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

//function llenarSelTipoCorrida() {
//    var url = route + "/api/ReporteMovNom/getAllTipoCorrida";
//    //var dataToPost = JSON.stringify(obj);
//    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
//    if (Mensaje.resultado === null) {
//        alert("No object");
//    } else {

//        for (var i = 0; i < Mensaje.resultado.length; i++) {
//            $('#selTipoCorrida').append('<option value=' + Mensaje.resultado[i]['clave'] + '>' + Mensaje.resultado[i]['clave'] + "-" + Mensaje.resultado[i]['descripcion'] + '</option>');
//        }
//    }
//}

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
    var tituloSel = "Tipo Nomina";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditTipoNominaShow(values) {
    if (values !== null) {
      //  console.log(values);
        claveTipoNomina = values[0].Clave;
    }
}

function setEditPeriodo() {
    nameCmp = "EditPeriodo";
    table = "PeriodosNomina";
    nameCols = idiomaSelecionado.messageFormatter("PeriodosNominaClave")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaDescripcion")() + "," +
        idiomaSelecionado.messageFormatter("PeriodosNominaFechaInicial")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaFechaFinal")() + "," +
        idiomaSelecionado.messageFormatter("PeriodosNominaFechaCierre")();
    //nameCols = "Clave,Descripción,Fecha inicial, Fecha final, Fecha cierre";
    campos = "clave,descripcion,Date:fechaInicial,Date:fechaFinal,Date:fechaCierre";
    camposObtener = "clave,descripcion,fechaInicial,fechaFinal,fechaCierre,año,status";
    var subEntities = "tipoNomina,tipoCorrida";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Periodos Nomina";
    var tamañoSel = "size-6";
    var id = parseInt(document.getElementById('editTipoNomina').getAttribute("value"));
    //var tipoCorrID = document.getElementById('selTipoCorrida').value;
    var preFilters = { "tipoNomina.id": id, "año": 2020, "tipoCorrida.clave": claveTipoCorrida };

    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de plaza", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditPeriodoShow(values) {
    if (values !== null) {
        fechaInicial = values[0].FechaInicial;
        fechaFinal = values[0].FechaFinal;
        document.getElementById("txtFechaInicial").value = formatDateddmmyyy(new Date(values[0].FechaInicial));
        document.getElementById("txtFechaFinal").value = formatDateddmmyyy(new Date(values[0].FechaFinal));
    }
}

function setEditRegistroPatronal() {
    //Parameters
    nameCmp = "EditRegistroPatronal";
    table = "RegistroPatronal";
    nameCols = idiomaSelecionadoCol.messageFormatter("RegistroPatronalclave")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronalnombreregtpatronal")() + "," +
        idiomaSelecionadoCol.messageFormatter("RegistroPatronalregistroPatronal")() + "," + idiomaSelecionadoCol.messageFormatter("RazonesSociales")();
    //nameCols = "Clave,Nombre,Registro patronal,Razón social";
    campos = "clave,nombreregtpatronal,registroPatronal,razonesSociales.razonsocial";
    var subEntities = "razonesSociales";
    camposMostrar = ["clave", "nombreregtpatronal"];
    camposObtener = "[]clave,[]delegacion,[]subdelegacion";

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };
    var tituloSel = "Registro patronal";
    var tamañoSel = "size-6";
    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de registro patronal", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre del registro patronal", "tipo": "string", "campo": "nombreregtpatronal", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditRegistroPatronalShow(values) {
    if (values !== null) {
        claveRegPatronal = values[0].Clave;
        //console.log(values);
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
        claveCtrCosto = values[0].Clave;
        //console.log(values);
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
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };
    var tituloSel = "Departamento";
    var tamañoSel = "size-2";
    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave Departamento", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre Departamento", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditDepartamentoShow(values) {
    if (values !== null) {
        claveDepto = values[0].Clave;
       // console.log(values);
    }
}

function setEditInicioEmpleado() {

    nameCmp = "EditInicioEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols =  idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";

    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": razon.id
        /* "id#IN@": "(Select MAX(m.id) from PlazasPorEmpleadosMov m  WHERE m.plazasPorEmpleado.referencia = o.plazasPorEmpleado.referencia)",
         "plazasPorEmpleado.ingresosBajas.fechaBaja#>=": getFechaSistema(),*/
    };

    //Fechas en base al periodo
    if (document.getElementById("editPeriodo").getAttribute("value")) {

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
    if (document.getElementById("editCentroCostos").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroCostos").getAttribute("value");
    }

    //Tipo de nomina
    if (document.getElementById("editTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editTipoNomina").getAttribute("value");
    }

    preFilters = setPreFilters(preFilters);

    // //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecial";

    //var camposWhereEsp = "";
    var valoreswhereEsp = [razonSocialActual.clave, null, new Date(fechaInicial), new Date(fechaFinal)];
    var optionals = { "queryEspecial": queryEspecial, "valoreswhereEsp": valoreswhereEsp };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);

}

function setEditInicioEmpleadoShow(values) {
    if (values !== null) {
        var empleado = values[0][1];
        claveEmpIni = empleado.clave;
        setEditObject("editFinEmpleado", claveEmpIni);
    }
}

function setEditFinEmpleado() {

    nameCmp = "EditFinEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";

    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre"];
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": razon.id
        /* "id#IN@": "(Select MAX(m.id) from PlazasPorEmpleadosMov m  WHERE m.plazasPorEmpleado.referencia = o.plazasPorEmpleado.referencia)",
         "plazasPorEmpleado.ingresosBajas.fechaBaja#>=": getFechaSistema(),*/
    };

    //Fechas en base al periodo
    if (document.getElementById("editPeriodo").getAttribute("value")) {

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
    if (document.getElementById("editCentroCostos").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroCostos").getAttribute("value");
    }

    //Tipo de nomina
    if (document.getElementById("editTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editTipoNomina").getAttribute("value");
    }

    preFilters = setPreFilters(preFilters);
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    // //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecial";

    //var camposWhereEsp = "";
    var valoreswhereEsp = [razonSocialActual.clave, null, new Date(fechaInicial), new Date(fechaFinal)];
    var optionals = { "queryEspecial": queryEspecial, "valoreswhereEsp": valoreswhereEsp };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);

}

function setEditFinEmpleadoShow(values) {
    if (values !== null) {
        var empleado = values[0][1];
        claveEmpFin = empleado.clave;

    }
}

function construirDatos() {
    var obj = {};
   

   
    var filtrosPersonalizados = "";
    var filtrosPersonalizados2 = "";
    var filtrosOrden = "ORDER BY  ";
    if (razonSocialActual !== null) {
        obj.claveRazonsocial = razonSocialActual.clave;
    }
    obj.claveRazonsocial = razonSocialActual.clave;
  

    if (claveTipoNomina !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND tipNom.clave = '" + claveTipoNomina + "' ";
        filtrosPersonalizados2 = filtrosPersonalizados2 + " AND tipNom1.clave = '" + claveTipoNomina + "' ";
    }

    fechaInicial = formatDateddmmyyy(new Date(fechaInicial));
    fechaFinal = formatDateddmmyyy(new Date(fechaFinal));
    obj.fechaInicial = formatDateddmmyyy(new Date(fechaInicial));
    obj.fechaFinal = formatDateddmmyyy(new Date(fechaFinal));
    if (claveTipoCorrida !== null) {
        // prioridadNaturaleza = prioridadNaturaleza + "AND tipcorr.clave = '" + claveTipoCorrida + "' ";
        //claveTipoCorrida = document.getElementById('selTipoCorrida').value;
        filtrosPersonalizados = filtrosPersonalizados + " AND tipcorr.clave = '" + claveTipoCorrida + "' ";
        filtrosPersonalizados2 = filtrosPersonalizados2 + " AND tipcorr1.clave = '" + claveTipoCorrida + "' ";
    }
   

    if (claveRegPatronal !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND reg.clave = '" + claveRegPatronal + "' ";
    }

    if (claveCtrCosto !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cent.clave = '" + claveCtrCosto + "' ";
    }

    if (claveDepto !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND dep.clave = '" + claveDepto + "' ";
    }

    if (claveEmpIni !== null && claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave BETWEEN '" + claveEmpIni + "' AND '" + claveEmpFin + "' ";
        filtrosPersonalizados2 = filtrosPersonalizados2 + " AND mov1.empleados.clave BETWEEN '" + claveEmpIni + "' AND '" + claveEmpFin + "' ";
    } else if (claveEmpIni !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave >= '" + claveEmpIni + "' ";
        filtrosPersonalizados2 = filtrosPersonalizados2 + " AND mov1.empleados.clave >= '" + claveEmpIni + "' ";
    } else if (claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave <= '" + claveEmpFin + "' ";
        filtrosPersonalizados2 = filtrosPersonalizados2 + " AND mov1.empleados.clave <= '" + claveEmpFin + "' ";
    }

    obj.filtrosPersonalizados = filtrosPersonalizados;
    obj.filtrosPersonalizados2 = filtrosPersonalizados2;
    obj.filtrosOrden = "";

    return obj;

}

function visualizar() {
    //console.log(construirDatos());
    var dataToPost1 = JSON.stringify(construirDatos());
    var url1 = route + "/api/Generic/getReporteBaseGravables";
    var Mensaje1 = Common.sendRequestJson('POST', url1, dataToPost1, undefined, false);
    if (Mensaje1 === null) {
        console.log("error");
    } else {
        var datos = new Array();
        datos[0] = JSON.stringify(Mensaje1);
        var domicilio = "";
        if (razonSocialActual !== null) {
            domicilio = razonSocialActual.calle;
            domicilio = domicilio + " " + razonSocialActual.numeroex;
            domicilio = domicilio + " " + razonSocialActual.colonia;
            if (razonSocialActual.ciudades !== null) {
                domicilio = domicilio + " " + razonSocialActual.ciudades.descripcion;
            }

            if (razonSocialActual.estados !== null) {
                domicilio = domicilio + " " + razonSocialActual.estados.descripcion;
            }
        }
        var tituloPeriodo = "Del " + fechaInicial + " Al " + fechaFinal;
        var objDatos = {};
        objDatos.tituloEmpresa = razonSocial.nombreRazon;
        objDatos.tituloDomicilio = domicilio;
        objDatos.tituloNombreReporte = "Reporte de base gravables";
        objDatos.tituloPeriodo = tituloPeriodo;
        if (document.getElementById("ckbIncluirISR").checked) {
            objDatos.columnasISR = false;
        } else {
            objDatos.columnasISR = true;
        }

        if (document.getElementById("ckbIncluirIMSS").checked) {
            objDatos.columnasIMSS = false;
        } else {
            objDatos.columnasIMSS = true;
        }
       // objDatos.tituloConcepto = tituloConcepto;
        objDatos.reporte = "Content/ReporteBasesGravables.mrt";
        datos[1] = JSON.stringify(objDatos);

        window.localStorage.setItem("DataReporte", JSON.stringify(datos));
        window.open(route + "/VisualizarReporte.html", '_blank');

    }
}

function limpiarBase() {
     fechaInicial=null;
     fechaFinal=null;
     claveTipoCorrida = null;
     claveTipoNomina = null;
     claveRegPatronal = null;
     claveCtrCosto = null;
     claveDepto = null;
     claveEmpIni = null;
    claveEmpFin = null;
    clearEdit("editTipoNomina");
    clearEdit("editPeriodo");
    clearEdit("editRegistroPatronal");
    clearEdit("editCentroCostos");
    clearEdit("editDepartamento");
    clearEdit("editInicioEmpleado");
    clearEdit("editFinEmpleado");
    document.getElementById("txtFechaInicial").disabled = false;
    document.getElementById("txtFechaFinal").disabled = false;
    document.getElementById("txtFechaInicial").value = "";
    document.getElementById("txtFechaFinal").value = "";
    document.getElementById("txtFechaInicial").disabled = true;
    document.getElementById("txtFechaFinal").disabled = true;
    document.getElementById("ckbIncluirISR").checked = false;
    document.getElementById("ckbIncluirIMSS").checked = false;
    
}