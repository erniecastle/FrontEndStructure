var razonSocialActual;
var fechaSistemasReporNom;
var claveTipoCorrida = null;
var claveTipoNomina = null;
var ejercicioActual = 2020;
var claveCentroDeCosto = null;
var fechaInicial = null;
var fechaFinal = null;
var fechaInicial2 = null;
var fechaFinal2 = null;
var claveDepartamentos = null;
var claveEmpIni = null;
var claveEmpFin = null;
var claveRegPatronal = null;
var clavePuestos = null;
var claveTurnos = null;
var claveFormaDePago = null;
var claveBancos = null;
var claveCategoriasPuestos = null;
var tipoContrato = null;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
   // llenarSelTipoCorrida();
    getRazonSocialActual();
    //llenarSelTipoContrato();
    fechaSistemasReporNom = getFechaSistema();
    var fecha = formatDate(fechaSistemasReporNom);
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

function llenarSelTipoCorrida() {
    var url = route + "/api/ReporteMovNom/getAllTipoCorrida";
    //var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {

        for (var i = 0; i < Mensaje.resultado.length; i++) {
            $('#selTipoCorrida').append('<option value=' + Mensaje.resultado[i]['clave'] + '>' + Mensaje.resultado[i]['clave'] + "-" + Mensaje.resultado[i]['descripcion'] + '</option>');
        }
    }
}

function llenarSelTipoContrato() {
    var url = route + "/api/ReporteMovNom/getAllTipoContrato";
    //var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {

        for (var i = 0; i < Mensaje.resultado.length; i++) {
            $('#selTipoDeContrato').append('<option value=' + Mensaje.resultado[i]['clave'] + '>' + Mensaje.resultado[i]['clave'] + "-" + Mensaje.resultado[i]['descripcion'] + '</option>');
        }
    }
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
        //console.log(values);
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
    camposObtener = "clave,descripcion,año,fechaInicial,fechaFinal,status";
    var subEntities = "tipoNomina,tipoCorrida";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Periodos Nomina";
    var tamañoSel = "size-6";
    var id = parseInt(document.getElementById('editTipoNomina').getAttribute("value"));
    //var tipoCorrID = document.getElementById('selTipoCorrida').value;
    var preFilters = { "tipoNomina.id": id, "año": ejercicioActual, "tipoCorrida.clave": claveTipoCorrida };

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
        fechaInicial2 = formatDateddmmyyy(new Date(values[0].FechaInicial));
        fechaFinal2 = formatDateddmmyyy(new Date(values[0].FechaFinal));
        document.getElementById("txtDeLAFecha").value = formatDatemmddyyy(new Date(values[0].FechaInicial));
        document.getElementById("txtAlaFecha").value = formatDatemmddyyy(new Date(values[0].FechaFinal));
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
        
        claveCentroDeCosto = values[0].Clave;
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
       
        claveDepartamentos = values[0].Clave;
    }
}

function setEditInicioEmpleado() {

    nameCmp = "EditInicioEmpleado";
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
    //var preFilters = { "plazasPorEmpleado.razonesSociales.id": razon.id };
    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": razon.id
        /* "id#IN@": "(Select MAX(m.id) from PlazasPorEmpleadosMov m  WHERE m.plazasPorEmpleado.referencia = o.plazasPorEmpleado.referencia)",
         "plazasPorEmpleado.ingresosBajas.fechaBaja#>=": getFechaSistema(),*/
    };
    //Fechas en base al periodo
    if (document.getElementById("editPeriododNomina").getAttribute("value")) {

        //var valDateFromFilter = document.getElementById("txtDeFecha").value;
        var fechaDeFilter = new Date(fechaInicial2);
        var fechaDeFilter2 = new Date(fechaDeFilter.getFullYear(), fechaDeFilter.getMonth(), fechaDeFilter.getDate(), 0, 0, 0, 0);

        //var valDateToFilter = document.getElementById("txtDeFecha").value;
        var fechaAFilter = new Date(fechaFinal2);
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
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroDeCosto").getAttribute("value");
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
    var valoreswhereEsp = [razonSocialActual.clave, null, new Date(fechaInicial2), new Date(fechaFinal2)];
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
        setEditObject("editEmpleadoFin", claveEmpIni);
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
    if (document.getElementById("editPeriododNomina").getAttribute("value")) {

        //var valDateFromFilter = document.getElementById("txtDeFecha").value;
        var fechaDeFilter = new Date(fechaInicial2);
        var fechaDeFilter2 = new Date(fechaDeFilter.getFullYear(), fechaDeFilter.getMonth(), fechaDeFilter.getDate(), 0, 0, 0, 0);

        //var valDateToFilter = document.getElementById("txtDeFecha").value;
        var fechaAFilter = new Date(fechaFinal2);
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
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroDeCosto").getAttribute("value");
    }

    //Tipo de nomina
    if (document.getElementById("editTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editTipoNomina").getAttribute("value");
    }

    preFilters = setPreFilters(preFilters);

    // //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecial";

    //var camposWhereEsp = "";
    var valoreswhereEsp = [razonSocialActual.clave, null, new Date(fechaInicial2), new Date(fechaFinal2)];
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
        var nombreCompleto = empleado.apellidoPaterno + " " + empleado.apellidoMaterno + " " + empleado.nombre;
        var edit = document.getElementById("editEmpleadoFin");
        var txtDescripcion = edit.children[1];
        txtDescripcion.value = nombreCompleto;
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
    var tituloSel = "Registro patronal";
    var tamañoSel = "size-6";
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

function setEditRegistroPatronalShow(values) {
    if (values !== null) {
     
        claveRegPatronal = values[0].Clave;
    }
}

function setEditCategoriaPuesto() {
    //Parameters
    nameCmp = "EditCategoriaPuesto";
    table = "CategoriasPuestos";
    nameCols = idiomaSelecionado.messageFormatter("CategoriasPuestosclave")() + "," + idiomaSelecionado.messageFormatter("CategoriasPuestosdescripcion")();
    campos = "clave,descripcion";
    //var subEntities = "razonesSociales";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion";
    var tituloSel = "categoria puesto";
    var tamañoSel = "size-2";
    //var razon = localStorage.getItem("RazonSocial");
    //razon = JSON.parse(razon);
    //var preFilters = { "razonesSociales.id": razon.id };

    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave Departamento", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre Departamento", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditCategoriaPuestoShow(values) {
    if (values !== null) {
       
        claveCategoriasPuestos = values[0].Clave;
    }
}

function setEditPuesto() {
    //Parameters
    nameCmp = "EditPuesto";
    table = "Puestos";
    nameCols = idiomaSelecionado.messageFormatter("Puestosclave")() + "," + idiomaSelecionado.messageFormatter("Puestosdescripcion")() + "," +
        idiomaSelecionado.messageFormatter("PuestossalarioTabular")();
    campos = "clave,descripcion,salarioTabular";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]salarioTabular,[]maximo,[]categoriasPuestos.clave,[]categoriasPuestos.descripcion,[]categoriasPuestos.pagarPorHoras,[]descripcion,[]descripcionPrevia,[]funciones";
    var tituloSel = "puesto";
    var tamañoSel = "size-2";
    var optionals = new Object();
    optionals["isWithAliasObtain"] = false;

    var subEntities = "categoriasPuestos";
    var id = parseInt(document.getElementById('editCategoriaPuestos').getAttribute("value"));
    var preFilters = { "categoriasPuestos.id": id };
    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave Puesto", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de puesto", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);

}

function setEditPuestoShow(values) {
    if (values !== null) {

        clavePuestos = values[0].Clave;
    }
}

function setEditTurno() {
    //Parameters
    nameCmp = "EditTurno";
    table = "Turnos";
    nameCols = idiomaSelecionado.messageFormatter("Turnosclave")() + "," + idiomaSelecionado.messageFormatter("Turnosdescripcion")();
    // nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    // camposObtener = "[]clave,[]tipoDeTurno,[]horaJornada,[]diasJornada";
    camposObtener = ["[]clave", "[]descripcion", "[]tipoDeTurno", "[]horaJornada", "[]diasJornada"];
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };//Unnecesary
    var tituloSel = "turno";
    var tamañoSel = "size-2";
    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave Turnos", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de Turno", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditTurnoShow(values) {
    if (values !== null) {

        claveTurnos = values[0].Clave;
    }
}

function setEditFormasPago() {
    //Parameters
    nameCmp = "EditTurno";
    table = "FormasDePago";
    nameCols = idiomaSelecionado.messageFormatter("FormasDePagoClave")() + "," + idiomaSelecionado.messageFormatter("FormasDePagoDescripcion")();
    // nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    // camposObtener = "[]clave,[]tipoDeTurno,[]horaJornada,[]diasJornada";
    camposObtener = ["[]clave", "[]descripcion"];
    var tituloSel = "Forma de pago";
    var tamañoSel = "size-2";
    //var razon = localStorage.getItem("RazonSocial");
    //razon = JSON.parse(razon);
    //var preFilters = { "razonesSociales.id": razon.id };//Unnecesary

    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave Turnos", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de Turno", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditFormasPagoShow(values) {
    if (values !== null) {

        claveFormaDePago = values[0].Clave;
    }
}

function setEditBancos() {
    //Parameters
    nameCmp = "EditBancos";
    table = "Bancos";
    nameCols = idiomaSelecionado.messageFormatter("BancosClave")() + "," + idiomaSelecionado.messageFormatter("BancosDescripcion")();
    // nameCols = "Clave,Descripción";
    // nameCols = "Clave,Descripción,Notas";
    campos = "clave,descripcion,notas";
    camposMostrar = ["clave", "descripcion"];
    // camposObtener = "[]clave,[]tipoDeTurno,[]horaJornada,[]diasJornada";
    camposObtener = ["[]clave", "[]descripcion"];
    //var razon = localStorage.getItem("RazonSocial");
    //razon = JSON.parse(razon);
    //var preFilters = { "razonesSociales.id": razon.id };//Unnecesary
    var tituloSel = "Forma de pago";
    var tamañoSel = "size-2";
    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave Turnos", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de Turno", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditBancosShow(values) {
    if (values !== null) {

        claveBancos = values[0].Clave;
    }
}

function setEditTipoContrato() {
    //Parameters
    nameCmp = "EditTipoContrato";
    table = "TipoContrato";
    nameCols = idiomaSelecionado.messageFormatter("TipoContratoClave")() + "," + idiomaSelecionado.messageFormatter("TipoContratoDescripcion")();
    // nameCols = "Clave,Descripción";
    //nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    // camposObtener = "[]clave,[]tipoDeTurno,[]horaJornada,[]diasJornada";
    camposObtener = ["[]clave", "[]descripcion"];
    var tituloSel = "Tipo Contrato";
    var tamañoSel = "size-2";
    //var razon = localStorage.getItem("RazonSocial");
    //razon = JSON.parse(razon);
    //var preFilters = { "razonesSociales.id": razon.id };//Unnecesary

    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave Turnos", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de Turno", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditTipoContratoShow(values) {
    if (values !== null) {

        tipoContrato = values[0].Clave;
    }
}

function construirDatosRepNomina() {
    var obj = {};
    var status = null;
    var tipoSueldo = null;
    var filtrosPersonalizados = "";
    var filtrosOrden = "ORDER BY ";
    if (document.getElementById("selStatus").value === "1") {
        status = true;
    } else if (document.getElementById("selStatus").value === "2") {
        status = false;
    } else {
        status = "";
    }



    obj.fechaInicial = formatDateddmmyyy(new Date(fechaInicial));
    obj.fechaFinal = formatDateddmmyyy(new Date(fechaFinal));
    obj.claveRazonsocial = razonSocialActual.clave;
    var prioridadNaturaleza = "AND (cnc.naturaleza = 1 or   cnc.naturaleza = 2 or cnc.naturaleza = 3 ) ";
    if (document.getElementById("selTipoSalario").value === "0") {
        tipoSueldo = 0;
    } else if (document.getElementById("selTipoSalario").value === "1") {
        tipoSueldo = 1;
    } else if (document.getElementById("selTipoSalario").value === "2") {
        tipoSueldo = 2;
    } else {
        tipoSueldo = "";
    }

    if (claveTipoNomina !== "") {
        filtrosPersonalizados = "tipNom.clave = '" + claveTipoNomina + "' AND pm.tipoNomina.clave = '" + claveTipoNomina + "' ";
    }

    if (claveTipoCorrida !== null) {
        //claveTipoCorrida = document.getElementById('selTipoCorrida').value;
        prioridadNaturaleza = prioridadNaturaleza + "AND tipcorr.clave = '" + claveTipoCorrida + "' ";
        filtrosPersonalizados = filtrosPersonalizados + " AND tipcorr.clave = '" + claveTipoCorrida + "' ";
    }

    if (claveRegPatronal !== "" && claveRegPatronal !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND reg.clave = '" + claveRegPatronal + "' ";
    }

    if (claveCentroDeCosto !== "" && claveCentroDeCosto !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cent.clave = '" + claveCentroDeCosto + "' ";
    }

    if (claveDepartamentos !== "" && claveDepartamentos !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND dep.clave = '" + claveDepartamentos + "' ";
    }

    if (claveEmpIni !== null && claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave BETWEEN '" + claveEmpIni + "' AND '" + claveEmpFin + "' ";
    } else if (claveEmpIni !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave >= '" + claveEmpIni + "' ";
    } else if (claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave <= '" + claveEmpFin + "' ";
    }

    if (claveCategoriasPuestos !== "" && claveCategoriasPuestos !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cat.clave = '" + claveCategoriasPuestos + "' ";
    }

    if (clavePuestos !== "" && clavePuestos !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND pue.clave = '" + clavePuestos + "' ";
    }

    if (claveTurnos !== "" && claveTurnos !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND tur.clave = '" + claveTurnos + "' ";
    }

    if (tipoSueldo !== "") {
        filtrosPersonalizados = filtrosPersonalizados + " sdi.tipoDeSalario =" + tipoSalario + " ";
    }

    if (status !== "") {
        if (status === "0") {
            filtrosPersonalizados = filtrosPersonalizados + " AND (emp.status = 1  or  emp.status = 0) ";
        } else {
            filtrosPersonalizados = filtrosPersonalizados + "  AND emp.status = " + status === true ? 1 : 0 + " ";
        }
    }

    if (claveBancos !== "" && claveBancos !==null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND ban.clave = '" + claveBancos + "' ";
    }

    if (claveFormaDePago !== "" && claveFormaDePago !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND form.clave  = '" + claveFormaDePago + "' ";
    }

    if (tipoContrato !== null) {
       // var clavetipoContrato = document.getElementById("selTipoDeContrato").value;
        filtrosPersonalizados = filtrosPersonalizados + " AND tipCon.clave  = '" + tipoContrato + "' ";

    }
    filtrosOrden = filtrosOrden + " CASE WHEN (emp IS NULL) THEN '' ELSE CASE WHEN (emp.clave IS NULL) THEN '' ELSE emp.clave END END";
    obj.prioridadNaturaleza = prioridadNaturaleza;
    var meses = new Array();
    meses = getMeses(fechaInicial, fechaFinal);
    obj.meses = meses;
    obj.filtrosPersonalizados = filtrosPersonalizados;
    obj.filtrosOrden = filtrosOrden;

    return obj;
}

function visualizarRepNom() {
    var dataToPost1 = JSON.stringify(construirDatosRepNomina());
    var url1 = route + "/api/Generic/getReporte";
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

        var tituloPeriodo = "Del " + document.getElementById("txtDeLAFecha").value + " Al " + document.getElementById("txtAlaFecha").value;
        var rfcRegpat = "RFC: " + razonSocialActual.rfc;

        var objDatos = {};
        objDatos.tituloEmpresa = razonSocial.nombreRazon;
        objDatos.tituloDomicilio = domicilio;
        objDatos.tituloNombreReporte = "Reporte de Nómina";
        objDatos.tituloPeriodo = tituloPeriodo;
        objDatos.tituloDatosEmpresa = rfcRegpat;
        objDatos.reporte = "Content/ReporteNomina.mrt";
        datos[1] = JSON.stringify(objDatos);

        window.localStorage.setItem("DataReporte", JSON.stringify(datos));
        window.open(route+"/VisualizarReporte.html", '_blank');

    }
}

function getMeses(fechaIni, fechaFin) {
    var obj = new Array();
    var ini = new Date(fechaIni).getMonth(), fin = new Date(fechaFin).getMonth();
    if (new Date(fechaIni).getFullYear() === new Date(fechaFin).getFullYear()) {
        obj = getInvolvedMonths(ini, fin);
    } else if (new Date(fechaFin).getFullYear() - new Date(fechaIni).getFullYear() === 1) {
        var mesesIni = getInvolvedMonths(ini, 11);
        var mesesFin = getInvolvedMonths(0, fin);
        // var meses = new Array();
        if (mesesIni.length > 0) {
            for (var i = 0; i < mesesIni.length; i++) {
                obj.push(mesesIni[i]);
            }
        }
        if (mesesFin.length > 0) {
            for (var j = 0; j < mesesFin.length; j++) {
                obj.push(mesesFin[j]);
            }
        }

    } else if (new Date(fechaFin).getFullYear() - new Date(fechaIni).getFullYear() > 1) {
        ini = 0;
        fin = 11;
        obj = getInvolvedMonths(ini, fin);
    }

    return obj;
}

function getInvolvedMonths(inicio, final) {
    var meses = new Array();
    if (inicio > final) {
        meses.push(inicio + 1);
        meses.push(final + 1);
    } else {
        for (var i = inicio; i <= final; i++) {
            meses.push(i + 1);
        }
    }

    return meses;
}

function limpiarRepNom() {
    clearEdit("editTipoCorrida");
    clearEdit("editTipoNomina");
    clearEdit("editPeriododNomina");
    document.getElementById("txtDeLAFecha").value = "";
    document.getElementById("txtAlaFecha").value = "";
    clearEdit("editCentroDeCostos");
    clearEdit("editoDepartamento");
    clearEdit("editEmpeladoInicio");
    clearEdit("editEmpleadoFin");
    clearEdit("editRegistroPatronal");
    clearEdit("editCategoriaPuestos");
    clearEdit("editPuestos");
    clearEdit("editTurnos");
    clearEdit("editFormasPago");
    clearEdit("editBancos");
    clearEdit("editTipoContrato");
   
}