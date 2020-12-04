var obj = {};
var razonSocial;
var periodo;
var tipoNomina;
var claveTipoCorrida = null;
var claveTipoNomina = null;
var claveRegPatronal = null;
var claveCtrCosto = null;
var claveDepto = null;
var claveEmpIni = null;
var claveEmpFin = null;
var claveCategoriasPuestos = null;
var clavePuesto = null;
var claveTurno = null;
var tipoSalario = null;
var claveFormaDePago = null;
var tipoContrato = null;
var status = null;
var razonSocialActual;
var parametrosGlobales = { "ejercicioActual": 2020 };
var clavePeriodo = "";
var idiomaSelecionadoCol;
var statusPer = true;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    var obj = JSON.parse($("#container").data("opener"));
    if (obj.valorIni) {
        setEditObject("editTipoCorrida", obj.valorIni);
        enabledEdit("editTipoCorrida", false);
    }
    startCustomTools();
    razonSocial = getRazonSocial();
    getRazonSocialActual();
    llenarRegistroPatronal();

});

function llenarRegistroPatronal() {
  

    var url = route + "/api/CalculoNomina/RegistrosPatronales";
    var dataToPost = JSON.stringify(razonSocialActual.clave);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        registrosPatronales = Mensaje.resultado;
        for (var i = 0; i < registrosPatronales.length; i++) {
            $('#selRegistroPatronal').append('<option value=' + registrosPatronales[i].clave + '>' + registrosPatronales[i].clave + "-" + registrosPatronales[i].nombreregtpatronal + '</option>');
        }
    }
}

function setEditTipoCorrida() {

    //Parameters
    nameCmp = "EditTipoCorrida";
    table = "TipoCorrida";
    nameCols = idiomaSelecionado.messageFormatter("TipoCorridaclave")() + "," + idiomaSelecionado.messageFormatter("TipoCorridadescripcion")();
    campos = "clave,descripcion";//Quit ID;
    camposObtener = "clave,descripcion";
    //var subEntities = "periodicidad"; //Unnecesary
    preFilters = setPreFilters(preFilters = null);
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelTipoCorrida")();
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
    campos = "clave,descripcion,periodicidad.descripcion";//Quit ID;
    camposObtener = "clave,descripcion,periodicidad.descripcion";
    var subEntities = "periodicidad"; //Unnecesary
    var preFilters = setPreFilters(preFilters = null);
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelTipoNomina")();
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
    campos = "clave,descripcion,Date:fechaInicial,Date:fechaFinal,Date:fechaCierre";
    camposObtener = "clave,descripcion,año,fechaInicial,fechaFinal,status";
    var subEntities = "tipoNomina,tipoCorrida";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelPeriodoNomina")();
    var tamañoSel = "size-8";
    

    var preFilters = { "tipoNomina.clave": claveTipoNomina, "año": parametrosGlobales.ejercicioActual, "tipoCorrida.clave": claveTipoCorrida };

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
        clavePeriodo = values[0].Clave;
        fechaInicial = formatDateddmmyyy(new Date(values[0].FechaInicial));
        fechaFinal = formatDateddmmyyy(new Date(values[0].FechaFinal));
        document.getElementById('txtFechaIni').value = formatDatemmddyyy(new Date(values[0].FechaInicial));
        document.getElementById('txtFechaFin').value = formatDatemmddyyy(new Date(values[0].FechaFinal));
        statusPer = values[0].Status;
    }
}

function setEditCentroCostos() {
    //Parameters
    nameCmp = "EditCentroCostos";
    table = "CentroDeCosto";
    nameCols = idiomaSelecionadoCol.messageFormatter("CentroDeCostoclave")() + "," + idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcion")() + "," +
        idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcionPrevia")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronal")();
    campos = "clave,descripcion,descripcionPrevia,registroPatronal.nombreregtpatronal";
    var subEntities = "registroPatronal,razonesSociales";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion";
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelCentroDeCosto")();
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
    }
}

function setEditInicioEmpleado() {

    nameCmp = "EditInicioEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "[]plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno";
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];
    //camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];

    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": razonSocialActual.id
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
    if (document.getElementById("editCentroDeCosto").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroDeCosto").getAttribute("value");
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
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelEmpleados")();
    var tamañoSel = "size-6";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);

}

function setEditInicioEmpleadoShow(values) {
    if (values !== null) {
        var obj = values[0];
       // console.log(obj);
        claveEmpIni = obj[1];
         var nombreCompleto = obj[3] + " " + obj[4] + " " + obj[2];
        var edit = document.getElementById("editInicioEmpleado");
        var txtDescripcion = edit.children[1];
       // console.log(txtDescripcion);
        txtDescripcion.value = nombreCompleto;
        setEditObject("editFinEmpleado", claveEmpIni);
    }
}

function setEditFinEmpleado() {

    nameCmp = "EditFinEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionado.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionado.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionado.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionado.messageFormatter("EmpleadosNombreAbre")();
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "[]plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno";
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];
    //camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];

    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": razonSocialActual.id
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
    if (document.getElementById("editCentroDeCosto").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroDeCosto").getAttribute("value");
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
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelEmpleados")();
    var tamañoSel = "size-6";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);

}

function setEditFinEmpleadoShow(values) {
    if (values !== null) {
        var obj = values[0];
        claveEmpFin = obj[1];
        var nombreCompleto = obj[3] + " " + obj[4] + " " + obj[2];
        var edit = document.getElementById("editFinEmpleado");
        var txtDescripcion = edit.children[1];
        // console.log(txtDescripcion);
        txtDescripcion.value = nombreCompleto;
    }
}

function setEditDepartamento() {
    //Parameters
    nameCmp = "EditDepartamento";
    table = "Departamentos";
    nameCols = idiomaSelecionado.messageFormatter("Departamentosclave")() + "," + idiomaSelecionado.messageFormatter("Departamentosdescripcion")() + "," +
        idiomaSelecionado.messageFormatter("DepartamentossubCuenta")();
    campos = "clave,descripcion,subCuenta";
    var subEntities = "razonesSociales";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion,[]subCuenta";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelDepartamentos")();
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
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelCategoriaPuestos")();
    var tamañoSel = "size-2";
    //var razon = localStorage.getItem("RazonSocial");
    //razon = JSON.parse(razon);
    //var preFilters = { "razonesSociales.id": razon.id };
    var preFilters = setPreFilters(preFilters = null);
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
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelPuestos")();
    var tamañoSel = "size-2";
    var optionals = new Object();
    optionals["isWithAliasObtain"] = false;

    var subEntities = "categoriasPuestos";
    var id = parseInt(document.getElementById('editCategoriaPuesto').getAttribute("value"));
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

        clavePuesto = values[0].Clave;
    }
}

function setEditTurno() {
    //Parameters
    nameCmp = "EditTurno";
    table = "Turnos";
    nameCols = idiomaSelecionado.messageFormatter("Turnosclave")() + "," + idiomaSelecionado.messageFormatter("Turnosdescripcion")();
    campos = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    // camposObtener = "[]clave,[]tipoDeTurno,[]horaJornada,[]diasJornada";
    camposObtener = ["[]clave", "[]descripcion", "[]tipoDeTurno", "[]horaJornada", "[]diasJornada"];
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };//Unnecesary
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelTurnos")();
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

        claveTurno = values[0].Clave;
    }
}

function setEditFormasPago() {
    //Parameters
    nameCmp = "EditFormasDePago";
    table = "FormasDePago";
    nameCols = idiomaSelecionado.messageFormatter("FormasDePagoClave")() + "," + idiomaSelecionado.messageFormatter("FormasDePagoDescripcion")();
    campos = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    // camposObtener = "[]clave,[]tipoDeTurno,[]horaJornada,[]diasJornada";
    camposObtener = ["[]clave", "[]descripcion"];
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelFormasDePago")();
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


function setEditTipoContrato() {
    //Parameters
    nameCmp = "EditTipoContrato";
    table = "TipoContrato";
    nameCols = idiomaSelecionado.messageFormatter("TipoContratoClave")() + "," + idiomaSelecionado.messageFormatter("TipoContratoDescripcion")();
    campos = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    // camposObtener = "[]clave,[]tipoDeTurno,[]horaJornada,[]diasJornada";
    camposObtener = ["[]clave", "[]descripcion"];
    var tituloSel = idiomaSelecionado.messageFormatter("TituloSelTipoDeConttrato")();
    var tamañoSel = "size-2";
    //var razon = localStorage.getItem("RazonSocial");
    //razon = JSON.parse(razon);
    //var preFilters = { "razonesSociales.id": razon.id };//Unnecesary
    var preFilters = setPreFilters(preFilters = null);
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

function CalculoNomina() {
    //var contedor = document.getElementById('capture');
    //var elementos = contedor.querySelectorAll('select');

    if (statusPer) {

        //claveTipoCorrida = document.querySelector("[persist=TipoCorrida]").value;
        obj['claveTipoCorrida'] = claveTipoCorrida;
        obj['claveTipoNomina'] = claveTipoNomina;


        if (document.getElementById("selRegistroPatronal").value !== "") {
            claveRegPatronal = document.getElementById("selRegistroPatronal").value;
            obj['claveRegPatronal'] = claveRegPatronal;
        }


        if (claveCtrCosto !== null) {
            obj['claveCtrCosto'] = claveCtrCosto;
        }

        if (claveDepto !== null) {
            obj['claveDepto'] = claveDepto;
        }


        if (claveEmpIni !== null) {
            obj['claveEmpIni'] = claveEmpIni;
        }

        if (claveEmpFin !== null) {
            obj['claveEmpFin'] = claveEmpFin;
        }


        if (claveCategoriasPuestos !== null) {
            obj['claveCategoriasPuestos'] = claveCategoriasPuestos;
        }

        if (clavePuesto !== null) {
            obj['clavePuesto'] = clavePuesto;
        }

        if (claveTurno !== null) {
            obj['claveTurno'] = claveTurno;
        }



        tipoSalario = document.getElementById("selTipoSalario").value;
        obj['tipoSalario'] = tipoSalario;

        if (claveFormaDePago !== null) {
            obj['claveFormaDePago'] = claveFormaDePago;
        }


        if (tipoContrato !== null) {
            obj['tipoContrato'] = tipoContrato;
        }

        status = document.getElementById("selStatus").value;
        obj['status'] = status;
        //for (var i = 0; i < elementos.length; i++) {

        //    if (elementos[i].getAttribute('persist') === "TipoCorrida") {
        //        obj['claveTipoCorrida'] = elementos[i].value;
        //        claveTipoCorrida = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "TipoNomina") {
        //        obj['claveTipoNomina'] = elementos[i].value;
        //        claveTipoNomina = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "PeriodosNomina") {
        //        clavePeriodo = elementos[i].value;
        //        // claveTipoCorrida = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "RegistroPatronal") {
        //        obj['claveRegPatronal'] = elementos[i].value;
        //        claveRegPatronal = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "CentroDeCosto") {
        //        obj['claveCtrCosto'] = elementos[i].value;
        //        claveCtrCosto = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "Departamentos") {
        //        obj['claveDepto'] = elementos[i].value;
        //        claveDepto = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "Empleados" && elementos[i].getAttribute('rango') === "inicio") {
        //        obj['claveEmpIni'] = elementos[i].value;
        //        claveEmpIni = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "Empleados" && elementos[i].getAttribute('rango') === "fin") {
        //        obj['claveEmpFin'] = elementos[i].value;
        //        claveEmpFin = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "CategoriasPuestos") {
        //        obj['claveCategoriasPuestos'] = elementos[i].value;
        //        claveCategoriasPuestos = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "Puestos") {
        //        obj['clavePuesto'] = elementos[i].value;
        //        clavePuesto = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "Turnos") {
        //        obj['claveTurno'] = elementos[i].value;
        //        claveTurno = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "TipoSalario") {
        //        obj['tipoSalario'] = elementos[i].value;
        //        tipoSalario = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "FormasDePago") {
        //        obj['claveFormaDePago'] = elementos[i].value;
        //        claveFormaDePago = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "TipoContrato") {
        //        obj['tipoContrato'] = elementos[i].value;
        //        tipoContrato = elementos[i].value;
        //    } else if (elementos[i].getAttribute('persist') === "Estatus") {
        //        obj['status'] = elementos[i].value;
        //        status = elementos[i].value;
        //    }


        //}
        obj['claveRazonSocial'] = "0001";
        obj['ejercicioActivo'] = "2020";

        periodo = periodoNominaID(clavePeriodo, claveTipoNomina, claveTipoCorrida, 2020);
        obj['idPeriodoNomina'] = periodo.id;

        tipoNomina = getTipoNomina(obj['claveTipoNomina']);

        var extra = {};
        var parametrosExtras = [tipoNomina.periodicidad.clave];

        extra.valoresExtras = parametrosExtras;
        extra.fechaInicioPeriodo = periodo.fechaInicial;
        extra.fechaFinPeriodo = periodo.fechaFinal;
        extra.descontarAhorro = false;
        extra.descontarPrestamos = false;
        extra.soloPrestamo = false;
        extra.tipoAccionMascaras = "";
        extra.mascaraResultado = "";
        obj['parametrosExtra'] = extra;
        var controlador = "#RazonesSociales" + obj['claveRazonSocial'];
        if (claveRegPatronal !== null) {
            controlador = controlador + "#RegistroPatronal" + claveRegPatronal;
        }
        if (claveCtrCosto !== null) {
            controlador = controlador + "#CentroDeCostos" + claveCtrCosto;
        }

        if (claveDepto !== null) {
            controlador = controlador + "#Deparatamentos" + claveDepto;
        }

        if (claveEmpIni !== null && claveEmpFin === null) {
            controlador = controlador + "#Empleados" + claveEmpIni;
        } else if (claveEmpIni === null && claveEmpFin !== null) {
            controlador = controlador + "#Empleados" + claveEmpFin;
        } else if (claveEmpIni !== null && claveEmpFin !== null) {
            controlador = controlador + "#Empleados" + claveEmpFin;
        }
        controlador = controlador + "#TipoNomina" + obj['claveTipoNomina'];
        if (claveCategoriasPuestos !== null) {
            controlador = controlador + "#CategoriasPuestos" + claveCategoriasPuestos;
        }

        if (clavePuesto !== null) {
            controlador = controlador + "#Puestos" + clavePuesto;
        }

        controlador = controlador + "#TipoCorrida" + obj['claveTipoCorrida'];

        obj['controlador'] = controlador;
        obj['uso'] = 0;
        obj['ejercicioActivo'] = 2020;
        calcular(obj);
    } else {
        alert("El periodo esta cerrado");
    }

}

function periodoNominaID(id, claveNomina, claveCorrida, ejercicioActivo) {
    var getData = "";
    var obj = {};
    obj.clave = id;
    obj.claveNomina = claveNomina;
    obj.ejercicioActivo = ejercicioActivo;
    obj.claveCorrida = claveCorrida;
    var url = route + "/api/CalculoNomina/PeriodoNominaID";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        getData = Mensaje.resultado;
    }
    if (getData) {
        return getData;
    }
}

function getTipoNomina(clave) {
    var getData = "";
    var url = route + "/api/CalculoNomina/TipoNomina";
    var dataToPost = JSON.stringify(clave);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        getData = Mensaje.resultado;
    }
    if (getData) {
        return getData;
    }
}

function calcular(valores) {
    var url = route + "/api/CalculoNomina/calculoNomina";
    var dataToPost = JSON.stringify(valores);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert(Mensaje.error);
    } else {
        console.log(Mensaje.resultado);
        alert(Mensaje.resultado);
        var continuar = confirm("¿Desea imprimir el reporte nomina?");
        if (continuar) {

            var dataToPost1 = JSON.stringify(contruirValoresReporte());
            var url1 = route + "/api/Generic/getReporte";
            var Mensaje1 = Common.sendRequestJson('POST', url1, dataToPost1, 1, false);
            if (Mensaje1 === null) {
                console.log("error");
            } else {
                // console.log(JSON.stringify(Mensaje1));
                var datos = new Array();
                datos[0] = JSON.stringify(Mensaje1);
                //// Create a new report instance
                //var report = new Stimulsoft.Report.StiReport();
                //// Load report from url
                //report.loadFile("Content/ReporteNomina.mrt");

                //// Create new DataSet object
                //var dataSet = new Stimulsoft.System.Data.DataSet("Datos");
                //// Load JSON data file from specified URL to the DataSet object readJsonFile
                //dataSet.readJson(Mensaje1);
                //// Remove all connections from the report template
                //report.dictionary.databases.clear();
                //// Register DataSet object
                var domicilio = razonSocialActual.calle;
                domicilio = domicilio + " " + razonSocialActual.numeroex;
                domicilio = domicilio + " " + razonSocialActual.colonia;

                if (razonSocialActual.ciudades !== null) {
                    domicilio = domicilio + " " + razonSocialActual.ciudades.descripcion;
                }

                if (razonSocialActual.estados !== null) {
                    domicilio = domicilio + " " + razonSocialActual.estados.descripcion;
                }
                var rfcRegpat = "RFC: " + razonSocialActual.rfc;
                var tituloPeriodo = "Del " + formatDateddmmyyy(new Date(periodo.fechaInicial)) + " Al " + formatDateddmmyyy(new Date(periodo.fechaFinal));
                var objDatos = {};
                objDatos.tituloEmpresa = razonSocial.nombreRazon;
                objDatos.tituloDomicilio = domicilio;
                objDatos.tituloNombreReporte = "Reporte de Nómina";
                objDatos.tituloPeriodo = tituloPeriodo;
                objDatos.tituloDatosEmpresa = rfcRegpat;
                objDatos.reporte = "Content/ReporteNomina.mrt";
                datos[1] = JSON.stringify(objDatos);
                //report.regData("Datos", "Datos", dataSet);
                //report.dictionary.synchronize();
                //report.dictionary.variables.getByName("tituloEmpresa").valueObject = razonSocial.nombreRazon;
                //report.dictionary.variables.getByName("tituloDomicilio").valueObject = domicilio;
                //report.dictionary.variables.getByName("tituloNombreReporte").valueObject = "Reporte de Nómina";
                //report.dictionary.variables.getByName("tituloPeriodo").valueObject = tituloPeriodo;
                //report.dictionary.variables.getByName("tituloDatosEmpresa").valueObject = rfcRegpat;
                //// Render report with registered data

                //report.render();
                ////var options = new Stimulsoft.Viewer.StiViewerOptions();
                //////options.appearance.scrollbarsMode = true;
                ////options.appearance.pageBorderColor = Stimulsoft.System.Drawing.Color.navy;
                //////options.toolbar.borderColor = Stimulsoft.System.Drawing.Color.navy;
                ////options.toolbar.showPrintButton = false;
                ////options.appearance.openLinksWindow = '_blank';
                ////options.toolbar.showViewModeButton = false;
                ////options.toolbar.viewMode = Stimulsoft.Viewer.StiWebViewMode.WholeReport;
                ////options.toolbar.zoom = 50;
                ////options.width = "1000px";
                ////options.height = "500px";

                //var viewer = new Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);
                //viewer.report = report;
                //viewer.renderHtml();
                window.localStorage.setItem("DataReporte", JSON.stringify(datos));
                window.open(route+"/VisualizarReporte.html", '_blank');
                //pdf exportar
                //// Create an PDF settings instance. You can change export settings.
                //var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                //// Create an PDF service instance.
                //var service = new Stimulsoft.Report.Export.StiPdfExportService();

                //// Create a MemoryStream object.
                //var stream = new Stimulsoft.System.IO.MemoryStream();
                //// Export PDF using MemoryStream.
                //service.exportTo(report, stream, settings);

                //// Get PDF data from MemoryStream object
                //var data = stream.toArray();
                //// Get report file name
                //var fileName = String.isNullOrEmpty(report.reportAlias) ? report.reportName : report.reportAlias;
                //// Save data to file
                //Object.saveAs(data, fileName + ".pdf", "application/pdf");


                //// Create an HTML settings instance. You can change export settings.
                //var settings = new Stimulsoft.Report.Export.StiHtmlExportSettings();
                //// Create an HTML service instance.
                //var service = new Stimulsoft.Report.Export.StiHtmlExportService();

                //// Create a text writer objects.
                //var textWriter = new Stimulsoft.System.IO.TextWriter();
                //var htmlTextWriter = new Stimulsoft.Report.Export.StiHtmlTextWriter(textWriter);
                //// Export HTML using text writer.
                //service.exportTo(report, htmlTextWriter, settings);

                //// Write HTML text to DIV element.
                //console.log(textWriter);
                ////var container = document.getElementById("container");
                ////container.appendChild(textWriter);


            }


        }

        // getData = Mensaje.resultado;

    }
}

function contruirValoresReporte() {
    var obj = {};
    obj.claveRazonsocial = razonSocial.clave;
    obj.fechaInicial = formatDateddmmyyy(new Date(periodo.fechaInicial));
    obj.fechaFinal = formatDateddmmyyy(new Date(periodo.fechaFinal));
    var filtrosPersonalizados = "";
    var filtrosOrden = "ORDER BY  ";
    var prioridadNaturaleza = "AND (cnc.naturaleza = 1 or   cnc.naturaleza = 2 or cnc.naturaleza = 3 ) ";
    if (claveTipoNomina !== "") {
        filtrosPersonalizados = "tipNom.clave = '" + claveTipoNomina + "' AND pm.tipoNomina.clave = '" + claveTipoNomina + "' ";
    }

    if (claveTipoCorrida !== "") {
        prioridadNaturaleza = prioridadNaturaleza + "AND tipcorr.clave = '" + claveTipoCorrida + "' ";
        filtrosPersonalizados = filtrosPersonalizados + " AND tipcorr.clave = '" + claveTipoCorrida + "' ";
    }

    if (claveRegPatronal !== "" && claveRegPatronal !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND reg.clave = '" + claveRegPatronal + "' ";
    }

    if (claveCtrCosto !== "" && claveCtrCosto !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cent.clave = '" + claveCtrCosto + "' ";
    }

    if (claveDepto !== "" && claveDepto !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND dep.clave = '" + claveDepto + "' ";
    }

    if (claveEmpIni !== null && claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave BETWEEN '" + claveEmpIni + "' AND '" + claveEmpFin + "' ";
    } else if (claveEmpIni !==null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave >= '" + claveEmpIni + "' ";
    } else if (claveEmpFin !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND emp.clave <= '" + claveEmpFin + "' ";
    }

    if (claveCategoriasPuestos !== "" && claveCategoriasPuestos !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND cat.clave = '" + claveCategoriasPuestos + "' ";
    }
    if (clavePuesto !== "" && clavePuesto !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND pue.clave = '" + clavePuesto + "' ";
    }

    if (claveTurno !== "" && claveTurno !== null) {
        filtrosPersonalizados = filtrosPersonalizados + " AND tur.clave = '" + claveTurno + "' ";
    }

    if (tipoSalario !== "") {
        filtrosPersonalizados = filtrosPersonalizados + " sdi.tipoDeSalario =" + tipoSalario + " ";
    }

    if (status !== "") {
        if (status === "0") {
            filtrosPersonalizados = filtrosPersonalizados + " AND (emp.status = 1  or  emp.status = 0) ";
        } else {
            filtrosPersonalizados = filtrosPersonalizados + "  AND emp.status = " + status === true ? 1 : 0 + " ";
        }
    }
    filtrosPersonalizados = filtrosPersonalizados + " AND mov.uso =" + 0 + " ";

    filtrosOrden = filtrosOrden + " CASE WHEN (emp IS NULL) THEN '' ELSE CASE WHEN (emp.clave IS NULL) THEN '' ELSE emp.clave END END";

    obj.prioridadNaturaleza = prioridadNaturaleza;
    var meses = new Array();
    meses = getMeses(periodo.fechaInicial, periodo.fechaFinal);
    obj.meses = meses;
    obj.filtrosPersonalizados = filtrosPersonalizados;
    obj.filtrosOrden = filtrosOrden;

    return obj;



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

function getRazonSocialActual() {


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

