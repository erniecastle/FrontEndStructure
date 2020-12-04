var razonSocialActual;
var fechaInicial;
var fechaFinal;
var claveCentroCosto = null;
var claveDepartameto = null;
var claveEmpIni = null;
var claveEmpFin = null;
var fecha;
var meses = ["Enero-Febrero", "Marzo-Abril", "Mayo-Junio", "Julio-Agosto", "Septiembre-Octubre", "Noviembre-Diciembre"];
var fechaSistemasRegCred;
var claveTipoNomina = null;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    getRazonSocialActual();
    fechaSistemasRegCred = getFechaSistema();
     fecha = formatDate(fechaSistemasRegCred);
    document.getElementById("txtResumida").checked = true;
    document.getElementById("txtSoloMov").checked = true;
    document.getElementById("txtPorBimestre").checked = true;
    document.getElementById("txtMixtos").checked = true;
    document.getElementById("txtFechaIni").disabled = true;
    document.getElementById("txtFechaFin").disabled = true;
    document.getElementById("txtFechaFin").value = fecha;
    document.getElementById("txtEjercicio").value = 2020;
    Cargarmeses();
    bimestres();
    $("#txtEjercicio").on('keydown', function (e) {
        if (e.keyCode === 9 || e.keyCode === 13) {
            $('#selBimestre').find('option').remove();
            Cargarmeses();
            bimestres();
        }
    });
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

function Cargarmeses() {
    for (var i = 0; i < meses.length; i++) {
        $('#selBimestre').append('<option value=' + i + '>' + meses[i] + " " + document.getElementById("txtEjercicio").value + '</option>');
    }
}

function rbnSalarioAFechas() {
    document.getElementById("txtFechaIni").disabled = false;
    document.getElementById("txtFechaIni").value = "";
    document.getElementById("txtFechaIni").disabled = true;
    document.getElementById("txtPorBimestre").disabled = true;
    document.getElementById("txtPorBimestre").checked = false;
    document.getElementById("txtPorRangoFechas").disabled = true;
    document.getElementById("txtPorRangoFechas").checked = false;

    document.getElementById("selBimestre").disabled = true;
    document.getElementById("txtEjercicio").disabled = true;
    document.getElementById("txtFechaFin").disabled = false;
    document.getElementById("txtFechaFin").value = fecha;
   
}

function rbnSoloMovimientos() {
    document.getElementById("txtFechaFin").value = "";
    document.getElementById("txtPorBimestre").disabled = false;
    document.getElementById("txtPorBimestre").checked = true;
    document.getElementById("txtPorRangoFechas").disabled = false;
    document.getElementById("selBimestre").disabled = false;
    document.getElementById("txtEjercicio").disabled = false;
    document.getElementById("txtFechaIni").disabled = true;
    document.getElementById("txtFechaFin").disabled = true;
    bimestres();
}

function rbnRangoFechas() {
    document.getElementById("txtFechaIni").disabled = false;
    document.getElementById("txtFechaIni").value = "";
    document.getElementById("txtFechaFin").disabled = false;
    document.getElementById("txtFechaFin").value = "";
    document.getElementById("selBimestre").disabled = true;
    document.getElementById("txtEjercicio").disabled = true;
}

function rbnBimestre() {
    document.getElementById("selBimestre").disabled = false;
    document.getElementById("txtEjercicio").disabled = false;
    document.getElementById("txtFechaIni").disabled = true;
    document.getElementById("txtFechaFin").disabled = true;
    bimestres();
}

function bimestres() {
    if (document.getElementById("txtPorBimestre").checked) {
        if (document.getElementById("txtEjercicio").value.toString().length > 0) {
            var aniio = parseInt(document.getElementById("txtEjercicio").value);
            if (document.getElementById("selBimestre").value === "0") {
                var a = new Date(aniio,0,1);
                var a2;
                if (((aniio % 100 === 0) && (aniio % 400 === 0)) || ((aniio % 100 !== 0) && (aniio % 4 === 0))) {
                    a2 = new Date(aniio, 1, 29);
                } else {
                    a2 = new Date(aniio,1,28);
                }
                document.getElementById("txtFechaIni").value = formatDate(a);
                document.getElementById("txtFechaFin").value = formatDate(a2);
            } else if (document.getElementById("selBimestre").value === "1") {
                var fec = new Date(aniio, 2, 1);
                var fec2 = new Date(aniio,3,30);
                document.getElementById("txtFechaIni").value = formatDate(fec);
                document.getElementById("txtFechaFin").value = formatDate(fec2);
            } else if (document.getElementById("selBimestre").value === "2") {
                var fech = new Date(aniio, 4, 1);
                var fech2 = new Date(aniio, 5, 30);
                document.getElementById("txtFechaIni").value = formatDate(fech);
                document.getElementById("txtFechaFin").value = formatDate(fech2);
            } else if (document.getElementById("selBimestre").value === "3") {
                var fecha = new Date(aniio, 6, 1);
                var fecha2 = new Date(aniio, 7, 31);
                document.getElementById("txtFechaIni").value = formatDate(fecha);
                document.getElementById("txtFechaFin").value = formatDate(fecha2);
            } else if (document.getElementById("selBimestre").value === "4") {
                var fechas = new Date(aniio, 8, 1);
                var fechas2 = new Date(aniio, 9, 31);
                document.getElementById("txtFechaIni").value = formatDate(fechas);
                document.getElementById("txtFechaFin").value = formatDate(fechas2);
            } else if (document.getElementById("selBimestre").value === "5") {
                var fechas1 = new Date(aniio, 10, 1);
                var fechas21 = new Date(aniio, 11, 31);
                document.getElementById("txtFechaIni").value = formatDate(fechas1);
                document.getElementById("txtFechaFin").value = formatDate(fechas21);
            }
        }
    }
}

function setEditTipoNomina() {

    //Parameters
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

function setEditTipoNominaShow(value) {
    if (value !== null) {
        var obj = value[0];
        claveTipoNomina = obj.Clave;
       
    }
}


function setEditInicioEmpleados() {
    //Parameters
    nameCmp = "EditInicioEmpleados";
    table = "PlazasPorEmpleadosMov";
    nameCols =idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";//Quit ID;
    camposObtener = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";
    //var subEntities = "razonesSociales"; //Unnecesary
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razon.id };//Unnecesary
    if (document.getElementById("editTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editTipoNomina").getAttribute("value");
    }
    //var valoreswhereEsp;
    ////todo esto es para el query especiales
    //var queryEspecial = "QueryEmpleadoEspecial";
    //if (claveTipoNomina !== "") {
    //    var camposWhereEsp = ["tipoNomina.clave"];
    //    var fechas = new Date(fechaSistemasRegCred);
    //    valoreswhereEsp = [claveTipoNomina, razonSocialActual.clave, null, fechas, fechas];
    //} else {
    //    //var camposWhereEsp = "";
    //    var fechas = new Date(fechaSistemasRegCred);
    //    valoreswhereEsp = [razonSocialActual.clave, null, fechas, fechas];
    //}
    //var optionals = { "queryEspecial": queryEspecial, "camposWhereEsp": camposWhereEsp, "valoreswhereEsp": valoreswhereEsp };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}

function setEditInicioEmpleadosShow(values) {
    if (values !== null) {
        //var empl = values[0];
        claveEmpIni = values[0][1];
        setEditObject("editFinEmpleados", claveEmpIni);
    }
}

function setEditFinEmpleados() {
    //Parameters
    nameCmp = "EditFinEmpleados";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";//Quit ID;
    camposObtener = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";
    //var subEntities = "razonesSociales"; //Unnecesary
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razon.id };//Unnecesary
    if (document.getElementById("editTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editTipoNomina").getAttribute("value");
    }
    //todo esto es para el query especiales
    //var valoreswhereEsp;
    //var queryEspecial = "QueryEmpleadoEspecial";
    //if (claveTipoNomina !== "") {
    //    var camposWhereEsp = ["tipoNomina.clave"];
    //    var fechas = new Date(fechaSistemasRegCred);
    //    valoreswhereEsp = [claveTipoNomina, razonSocialActual.clave, "PER", fechas, fechas];
    //} else {
    //    var fechas = new Date(fechaSistemasRegCred);
    //    //var camposWhereEsp = "";
    //    valoreswhereEsp = [razonSocialActual.clave, "PER", fechas, fechas];
    //}
    //var optionals = { "queryEspecial": queryEspecial, "camposWhereEsp": camposWhereEsp, "valoreswhereEsp": valoreswhereEsp };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}

function setEditFinEmpleadosShow(values) {
    if (values !== null) {
       // var empl = values[0];
        claveEmpFin = values[0][1];
    }
}

function setEditCentroCosto() {
    //Parameters
    nameCmp = "EditCentroCosto";
    table = "CentroDeCosto";
    nameCols = idiomaSelecionadoCol.messageFormatter("CentroDeCostoclave")() + "," + idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcion")() + "," +
        idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcionPrevia")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronal")();
    // nameCols = "Clave,Descripción,Nombre abreviado, Registro patronal";
    campos = "clave,descripcion,descripcionPrevia,registroPatronal.nombreregtpatronal";
    var subEntities = "registroPatronal,razonesSociales";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };
    var tituloSel = "Centro de costo";
    var tamañoSel = "size-2";
    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de Centro de costos", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de Centro de costos", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditCentroCostoShow(values) {
    if (values !== null) {
        claveCentroCosto = values[0].Clave;
    }
}

function setEditDepartametos() {
    //Parameters
    nameCmp = "EditDepartametos";
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

function setEditDepartametosShow(values) {
    if (values !== null) {
        
        claveDepartameto = values[0].Clave;
    }
}

function construirDatos() {
    var obj = {};
   var orden = "ORDER BY  ";
    var excepciones = ["2", "3", "7", "6", "8"]; 
    var filtrosPersonalizados = "";
    obj["claveRazonsocial"] = razonSocialActual.clave;
    obj["claveExcepcion"]= excepciones;
    //*valores parametros conceptos imss variables y fijos*//
    obj["claveBaseNomina"] = "02";
    obj["tipoAfectaFijo"] =0;
    obj["tipoAfectaVariable"]=1;
   

    fechaInicial = formantDdMmYyyy(document.getElementById("txtFechaIni").value);
    fechaFinal = formantDdMmYyyy(document.getElementById("txtFechaFin").value);
    obj["fechaInicial"] = fechaInicial;
    obj["fechaFinal"] = fechaFinal;
    if (document.getElementById("txtSalarioAFecha").checked) {
        filtrosPersonalizados = filtrosPersonalizados + "AND sdi.fecha = (SELECT MAX (s.fecha) FROM SalariosIntegrados s INNER JOIN s.empleados se WHERE s.fecha <= :fechaFinal AND se.id = emp.id) AND ing.fechaBaja >= :fechaFinal ";
        var ini = new Date(1990, 0, 1);
        obj["fechaInicial"] = formatDateddmmyyy(ini);
    } else {
        filtrosPersonalizados = filtrosPersonalizados + "AND (sdi.fecha BETWEEN :fechaInicial} AND :fechaFinal) ";
    }

    if (document.getElementById("txtFijos").checked) {
        filtrosPersonalizados = filtrosPersonalizados + "AND sdi.tipoDeSalario=0 ";
      
    } else if (document.getElementById("txtSoloVariables").checked) {
        filtrosPersonalizados = filtrosPersonalizados + "AND sdi.tipoDeSalario=1 ";
       
    }
    //else if (document.getElementById("txtMixtos").checked) {
    //    filtrosPersonalizados = filtrosPersonalizados + "AND sdi.tipoDeSalario=2 ";
    //}

    if (claveTipoNomina !== null) {
        filtrosPersonalizados = filtrosPersonalizados + "AND tipNom.clave ='" + claveTipoNomina + "' ";
        obj["claveTipoNomina"] = claveTipoNomina;
    }

    if (claveEmpIni !== null && claveEmpFin === null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave >= '" + claveEmpIni + "' ";
    } else if (claveEmpIni === null && claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave >= '" + claveEmpFin + "' ";
    } else if (claveEmpIni !== null && claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave BETWEEN ' " + claveEmpIni + "' AND '" + claveEmpFin + "' "; 
    }

    if (claveCentroCosto !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cent.clave = '" + claveCentroCosto + "' ";
    }

    if (claveDepartameto !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND dep.clave = '" + claveDepartameto + "' ";
    }

    obj["filtrosPersonalizados"] = filtrosPersonalizados;
    obj["filtrosOrden"] = orden + " CASE WHEN (emp IS NULL) THEN '' ELSE CASE WHEN (emp.clave IS NULL) THEN '' ELSE emp.clave END END ";
    if (document.getElementById("txtDetalla").checked) {
        obj["tipoReporte"]="Detalle";
    } else {
        obj["tipoReporte"] = "Resumen";
    }
    
    return obj;
} 

function visualizar() {
    var dataToPost1 = JSON.stringify(construirDatos());
    var url1 = route + "/api/Generic/getReporteIntegrados";
    var Mensaje1 = Common.sendRequestJson('POST', url1, dataToPost1, undefined, false);
    if (Mensaje1 === null) {
       // console.log(Mensaje1);
    } else {
        //console.log(Mensaje1);
        var datos = new Array();
        datos[0] = JSON.stringify(Mensaje1);
        //datos[0] = Mensaje1;
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
        //if (document.getElementById("txtImprimirFechas").checked) {
        //    tituloPeriodo = "Del " + fechaInicial + " Al " + fechaFinal;
        //} else {
        //    tituloPeriodo = "Al " + fechaFinal;
        //}
         tituloPeriodo = "Del " + fechaInicial + " Al " + fechaFinal;
         var rfcRegpat = "RFC: " + razonSocialActual.rfc;
        var objDatos = {};
        objDatos.tituloEmpresa = razonSocial.nombreRazon;
        objDatos.tituloDomicilio = domicilio;
        objDatos.tituloDatosEmpresa = rfcRegpat;
        objDatos.tituloNombreReporte = "Reporte Intengrados";
        objDatos.tituloPeriodo = tituloPeriodo;
        ////objDatos.tituloConcepto = tituloConcepto;
        if (document.getElementById("txtDetalla").checked) {
            objDatos.reporte = "Content/ReporteIntegrados.mrt";
        } else {
            objDatos.reporte = "Content/ReporteIntegradosResumen.mrt";
        }
        datos[1] = JSON.stringify(objDatos);

        window.localStorage.setItem("DataReporte", JSON.stringify(datos));
        window.open(route + "/VisualizarReporte.html", '_blank');
    }
}

function limpiar() {
    document.getElementById("txtResumida").checked = true;
    document.getElementById("txtSoloMov").checked = true;
    document.getElementById("txtPorBimestre").checked = true;
    document.getElementById("txtMixtos").checked = true;
    document.getElementById("txtFechaIni").disabled = true;
    document.getElementById("txtFechaFin").disabled = true;
    document.getElementById("txtFechaFin").value = fecha;
    document.getElementById("txtEjercicio").value = 2020;
    clearEdit("editTipoNomina");
    clearEdit("editInicioEmpleados");
    clearEdit("editFinEmpleados");
    clearEdit("editCentroCosto");
    clearEdit("editDepartametos");
}