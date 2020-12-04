/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Brief: Clase estatica para el catalogo de Ingresos y Bajas
 */

var route = "";
var isPrm = false;
var getplazasPorEmpleadosMov = null;
var getSalarioDiario = null;
var salarioDiarioIntegrado = null;
var fechaInicialBase = null;
var idiomaSelecionadoCol;
//Parameters
var automaticoSDI = true;

var elementsIngreBajas = new Array("txtReferencia", "editEmpleado", "editRegistroPatronal", "editTipoContrato", "txtReferencia",
    "txtFechaInicial", "txtFechaFinal", "txtFechaPrestaciones", "editRegimenContratacion", "txtFechaIMSS", "editIngreReinTipoNom",
    "editIngreReinTurnos", "editIngreReinCentroCostos", "editJornada", /*"editIngreReinDepartamento",*/ "txtSalarioDiario",
    "editIngreReinPuestos", "cbxTipoSalario" /*"txtHoras"*/);

var elementsPromo = new Array("editTipoContrato", "txtFechaInicial",
    "editRegimenContratacion", "txtFechaIMSS", "editIngreReinTipoNom", "editIngreReinTurnos", "editIngreReinCentroCostos", "editJornada",
    /*"editIngreReinDepartamento",*/ "txtSalarioDiario", "editIngreReinPuestos", "cbxTipoSalario" /*"txtHoras"*/);


jQuery(document).ready(function () {
    nombreTablaBDs = "PlazasPorEmpleado";
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    var obj = JSON.parse($("#container").data("opener"));
    var typeWindow = obj.IdScreen;
    if (typeWindow === "promociones") {
        isPrm = true;
    }
    addListeners();
    initIngreReingre();
    validacionesParametrosIngreReingre();
    document.getElementById("txtFechaIMSS").disabled = true;
    // InitDefault();
});

function validacionesParametrosIngreReingre() {
    if (automaticoSDI) {
        document.getElementById("txtSalarioDiarioInt").disabled = true;
    }
    else {
        document.getElementById("txtSalarioDiarioInt").disabled = false;
    }
}

function InitDefault() {
    var date = new Date();
    date.setDate(31);
    date.setMonth(11);
    date.setYear(2100);
    if (!isPrm) {
        document.getElementById("txtFechaFinal").value = formatDate(date);
        document.getElementById("txtFechaFinal").disabled = true;
    }

    setEditObject("editEmpleado", "6");
    setEditObject("editRegistroPatronal", "001");
    //setEditObject("editPosOrganigrama", "01");
    $('#rbBase').prop('checked', true);
    $('#rbNo').prop('checked', true);
    setEditObject("editTipoContrato", "2");
    setEditObject("editRegimenContratacion", "02");
    setEditObject("editIngreReinTipoNom", "0005");
    setEditObject("editIngreReinCentroCostos", "001");
    setEditObject("editIngreReinDepartamento", "001");
    setEditObject("editIngreReinPuestos", "001");
    setEditObject("editIngreReinTurnos", "001");
    setEditObject("editJornada", "03");
    $('#txtSalarioDiario').val("15000");
    //$('#txtSalarioDiarioInt').val("500");
    $('#cbxTipoSalario :nth-child(2)').prop('selected', true);
    $('#txtHoras').val("8");
}

function setDates(e) {
    var valDate = e.value;
    var fechaAs = new Date(formantDdMmYyyy(valDate));
    if (!isPrm) {
        document.getElementById("txtFechaPrestaciones").value = formatDate(fechaAs);
    }
    document.getElementById("txtFechaIMSS").value = formatDate(fechaAs);

    if (isPrm) {
        mostrarObjetoIngresosBajas(getplazasPorEmpleadosMov, true);
    } else {
        if (salarioDiarioIntegrado !== null) {
            var getActualDate = formantDdMmYyyy(document.getElementById("txtFechaInicial").value);
            var fechaImssAc = new Date(getActualDate);
            fechaImssAc.setHours(0, 0, 0);
            var dateSalario = new Date(salarioDiarioIntegrado.fecha);
            if (dateSalario.getTime() !== fechaImssAc.getTime()) {
                var msg = confirm("La fecha Inicial es diferente, ¿Deseas recalcular el SDI?");
                if (msg == true) {
                    salarioDiarioIntegrado = calculateSDIIngreBajas();
                    document.getElementById("txtSalarioDiarioInt").value = salarioDiarioIntegrado.salarioDiarioIntegrado;
                } else {

                }
            }
        }
    }
}

function setDateImms(e) {
    if (salarioDiarioIntegrado !== null) {
        var getActualDate = formantDdMmYyyy(document.getElementById("txtFechaIMSS").value);
        var fechaImssAc = new Date(getActualDate);
        fechaImssAc.setHours(0, 0, 0);
        var dateSalario = new Date(salarioDiarioIntegrado.fecha);
        if (dateSalario.getTime() !== fechaImssAc.getTime()) {
            var msg = confirm("La fecha del IMSS es diferente, ¿Deseas recalcular el SDI?");
            if (msg == true) {
                salarioDiarioIntegrado = calculateSDIIngreBajas();
                document.getElementById("txtSalarioDiarioInt").value = salarioDiarioIntegrado.salarioDiarioIntegrado;
            } else {

            }
        }
    }
}

function makeCalculate() {
    var actualSalarioDiario = document.getElementById("txtSalarioDiario").value;
    if (actualSalarioDiario !== getSalarioDiario) {
        getSalarioDiario = null;
        salarioDiarioIntegrado = calculateSDIIngreBajas();
        if (salarioDiarioIntegrado == null) {
            console.log("No ha calculado SDI");
        } else {
            document.getElementById("txtSalarioDiarioInt").value = salarioDiarioIntegrado.salarioDiarioIntegrado;
        }
    }
}

function setTypeContract(e) {
    let arr = ['2', '3', '4', '5'];
    var valTypeContract = e.value;
    if (!isPrm) {
        if (arr.includes(valTypeContract)) {
            document.getElementById("txtFechaFinal").disabled = false;
        } else {
            document.getElementById("txtFechaFinal").disabled = true;
        }
    }
}

function generateValueIngreBajas() {
    var obj = {};
    obj.fuentePrincipal = "PlazasPorEmpleado";
    obj.campo = "referencia";
    var keyIngreRein = document.getElementById("txtReferencia").value;
    //obj.camposWhere = "empleados.id".split(",");
    //obj.valoresWhere = "1".split(",");
    var url = route + "/api/Generic/obtenerClaveStringMax";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.error === "") {
        var key = Mensaje.resultado;
        if (key === "") {
            key = 1;
        } else {
            key = generaClaveMax(key);
        }
        var valor = construyeMascara("Clave", key);
        document.getElementById("txtReferencia").value = valor;
    } else {
        console.log(Mensaje.error);
    }
}

function addListeners() {
    //$("#txtReferencia").on('keyup', function (e) {
    //    if (e.keyCode === 13) {
    //        var dataIngresosBajas = getIngresoBaja(document.getElementById("txtReferencia").value, true);
    //        mostrarObjetoIngresosBajas(dataIngresosBajas);
    //    }
    //});

    $("#txtReferencia").on("keydown", function (event) {
        var valor = this.value;
        if (event.keyCode === 13 || event.keyCode === 9) {
            if (valor !== "") {
                valor = construyeMascara("Clave", valor);
                this.value = valor;
            }
        }
    });

    $('input[name=checkboxPrm]').change(function (e) {
        var idCheck = e.target.id.toString();
        if ($(this).is(':checked')) {
            if (idCheck === "chkIngreReinRelacionLaboral") {
                $('#rbBase,#rbConfianza').prop('checked', false);
            } else if (idCheck === "chkIngreReinSindicalizado") {
                $('#rbSi,#rbNo').prop('checked', false);
            } else if (idCheck === "chkIngreReinTipoContrato") {
                clearEdit("editTipoContrato");
            } else if (idCheck === "chkIngreReinContratacion") {
                clearEdit("editRegimenContratacion");
            } else if (idCheck === "chkIngreReinTipoDeNomina") {
                clearEdit("editIngreReinTipoNom");
            } else if (idCheck === "chkIngreReinTurnos") {
                clearEdit("editIngreReinTurnos");
            } else if (idCheck === "chkIngreReinCentroCostos") {
                clearEdit("editIngreReinCentroCostos");
            } else if (idCheck === "chkIngreReinJornada") {
                clearEdit("editJornada");
            } else if (idCheck === "chkIngreReinDepartamento") {
                clearEdit("editIngreReinDepartamento");
            } else if (idCheck === "chkIngreReinSalarioDiario") {
                document.getElementById("txtSalarioDiario").value = "";
            } else if (idCheck === "chkIngreReinPuestos") {
                clearEdit("editIngreReinPuestos");
            } else if (idCheck === "chkIngreTipoSalario") {
                $("#cbxTipoSalario option:first").prop('selected', 'selected');
            } else if (idCheck === "chkIngreReinHoras") {
                document.getElementById("txtHoras").value = "";
            }
            /* ----- ----- */
        } else {
            var lasValue = null;
            if (idCheck === "chkIngreReinRelacionLaboral") {
                lasValue = document.getElementById("infoRelacionLaboral").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    if (lasValue === '1') {
                        $('#rbBase').prop('checked', true);
                    }
                    else if (lasValue === '2') {
                        $('#rbConfianza').prop('checked', true);
                    }
                }
            }
            else if (idCheck === "chkIngreReinSindicalizado") {
                lasValue = document.getElementById("infoSindicalizado").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    if (lasValue === 'true') {
                        $('#rbSi').prop('checked', true);
                    }
                    else if (lasValue === 'false') {
                        $('#rbNo').prop('checked', true);
                    }
                }
            } else if (idCheck === "chkIngreReinTipoContrato") {
                lasValue = document.getElementById("infoTipoContrato").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    setEditObjectByID("editTipoContrato", lasValue);
                }
            } else if (idCheck === "chkIngreReinContratacion") {
                lasValue = document.getElementById("infoRegimenContratacion").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    setEditObject("editRegimenContratacion", lasValue);
                }

            } else if (idCheck === "chkIngreReinTipoDeNomina") {
                lasValue = document.getElementById("infoTipoNom").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    setEditObject("editIngreReinTipoNom", lasValue);
                }
            } else if (idCheck === "chkIngreReinTurnos") {
                lasValue = document.getElementById("infoTurnos").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    setEditObject("editIngreReinTurnos", lasValue);
                }
            } else if (idCheck === "chkIngreReinCentroCostos") {
                lasValue = document.getElementById("infoCentroCosto").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    setEditObject("editIngreReinCentroCostos", lasValue);
                }
            } else if (idCheck === "chkIngreReinJornada") {
                lasValue = document.getElementById("infoJornada").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    setEditObjectByID("editJornada", lasValue);
                }
            } else if (idCheck === "chkIngreReinDepartamento") {
                lasValue = document.getElementById("infoDepartamento").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    setEditObject("editIngreReinDepartamento", lasValue);
                }
            } else if (idCheck === "chkIngreReinSalarioDiario") {
                lasValue = document.getElementById("infoSalarioDiario").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    document.getElementById("txtSalarioDiario").value = lasValue;
                }
            } else if (idCheck === "chkIngreReinPuestos") {
                lasValue = document.getElementById("infoPuestos").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    setEditObject("editIngreReinPuestos", lasValue);
                }
            } else if (idCheck === "chkIngreTipoSalario") {
                lasValue = document.getElementById("infoTipoSalario").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    $("#cbxTipoSalario").val(lasValue);
                }
            } else if (idCheck === "chkIngreReinHoras") {
                lasValue = document.getElementById("infoHoras").getAttribute("lastvalue");
                if (!isEmpty(lasValue)) {
                    document.getElementById("txtHoras").value = lasValue;
                }
            }
        }
    });
}

function revertAllValues() {
    //

}

function initIngreReingre() {
    var date = new Date();
    date.setDate(31);
    date.setMonth(11);
    date.setYear(2100);
    if (!isPrm) {
        generateValueIngreBajas();
        document.getElementById("txtFechaFinal").value = formatDate(date);
        document.getElementById("txtFechaFinal").disabled = true;
    }

    ////Fill Tipo Jornada
    var url = route + "/api/TipoContrato/getJornadas";
    Common.sendRequestJsonWithFunction('POST', url, null, undefined, true, null, "fillTypesJornadas");
    fillTypesSalario();
    var date = new Date(getFechaSistema());
    document.getElementById("txtFechaInicial").value = formatDate(date);
    if (!isPrm) {
        document.getElementById("txtFechaPrestaciones").value = formatDate(date);
    }
    document.getElementById("txtFechaIMSS").value = formatDate(date);
    document.getElementById("btnActualizar").style.display = "none";

    $('#rbBase').prop('checked', true);
    $('#rbNo').prop('checked', true);
}

//Fillers
function fillTypesSalario(Mensaje) {
    var select = document.getElementById("cbxTipoSalario");
    select.appendChild(new Option("", ""));
    var option = document.createElement("option");
    option.text = "Fijo";
    option.value = "0";
    select.appendChild(option);
    option = document.createElement("option");
    option.text = "Variable";
    option.value = "1";
    select.appendChild(option);
    option = document.createElement("option");
    option.text = "Mixto";
    option.value = "2";
    select.appendChild(option);
}

function setEditPlazasEmpleados() {

    //Parameters
    nameCmp = "EditPlazasEmpleados";
    table = "Empleados";
    nameCols = idiomaSelecionadoCol.messageFormatter("EmpleadosClave")() + ","
+ idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + ","
+ idiomaSelecionadoCol.messageFormatter("EmpleadosApePaterno")() + ","
+ idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + ","
+ idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + ","
+ idiomaSelecionadoCol.messageFormatter("EmpleadosNombreRazonSocial")();
    //nameCols = "Clave, Nombre, Apellido Paterno, Apellido Materno,Nombre abreviado,Empresa";
    //campos = "clave,nombre,apellidoPaterno,apellidoMaterno,nombreAbreviado,razonesSociales.razonsocial";//Quit ID;
    campos = ["clave", "nombre", "apellidoPaterno", "apellidoMaterno", "nombreAbreviado", "razonesSociales.razonsocial"];
    camposObtener = "[]clave,[]status,apellidoPaterno,apellidoMaterno,nombre,lugarNacimiento,fechaNacimiento,genero.descripcion,nacionalidad";
    var subEntities = "razonesSociales,genero"; //Unnecesary
    camposMostrar = ["clave", "@apellidoPaterno,apellidoMaterno,nombre"];

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };//Unnecesary

    preFilters = setPreFilters(preFilters);

    var filtersSearch = [];//Unnecesary
    filtersSearch[0] = { "etiqueta": "Clave del empleado", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre del empleado", "tipo": "string", "campo": "nombre", "medida": "m" };
    var tituloSel = "Empleado";
    var tamañoSel = "size-6";
    //Use this
    //var optionals = new Object();
    // optionals["isWithAliasObtain"] = true;
    //Or this 
    //var optionals = { "isWithAliasObtain": true };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel/*,
         typeof optionals === 'undefined' ? null : optionals*/);
}

function setEditPlazasEmpleadosShow(value) {
    if (value === null) {
        document.getElementById("txtApellidoPat").value = "";
        document.getElementById("txtApellidoMat").value = "";
        document.getElementById("txtNombre").value = "";
        document.getElementById("txtLugarNac").value = "";
        document.getElementById("txtFechaNac").value = "";
        document.getElementById("txtEdad").value = "";
        document.getElementById("txtSexo").value = "";
        document.getElementById("txtNacionalidad").value = "";
    } else {
        var obj = value[0];
        document.getElementById("txtApellidoPat").value = obj.ApellidoPaterno;
        document.getElementById("txtApellidoMat").value = obj.ApellidoMaterno;
        document.getElementById("txtNombre").value = obj.Nombre;
        document.getElementById("txtLugarNac").value = obj.LugarNacimiento;
        var date = new Date(value[0].FechaNacimiento);
        document.getElementById("txtFechaNac").value = formatDate(date);
        var age = calculateAge(date);
        document.getElementById("txtEdad").value = age;
        document.getElementById("txtSexo").value = obj.Generodescripcion;
        document.getElementById("txtNacionalidad").value = obj.Nacionalidad;
    }
}

function setEditIngreReingistroPatronal() {

    //Parameters
    nameCmp = "EditIngreReingistroPatronal";
    table = "RegistroPatronal";
    nameCols = idiomaSelecionadoCol.messageFormatter("RegistroPatronalclave")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronalnombreregtpatronal")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronalregistroPatronal")() + "," + idiomaSelecionadoCol.messageFormatter("RazonesSociales")();
    // nameCols = "Clave,Nombre,Registro patronal,Razón social";
    campos = "clave,nombreregtpatronal,registroPatronal,razonesSociales.razonsocial";
    var subEntities = "razonesSociales";
    camposMostrar = ["clave", "nombreregtpatronal"];
    camposObtener = "[]clave,[]delegacion,[]subdelegacion";

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };

    preFilters = setPreFilters(preFilters);

    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de registro patronal", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre del registro patronal", "tipo": "string", "campo": "nombreregtpatronal", "medida": "m" };
    var tituloSel = "Rigistro Patronal";
    var tamañoSel = "size-6";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditPosOrganigrama() {

    //Parameters
    nameCmp = "EditPosOrganigrama";
    table = "Plazas";
    nameCols = "Clave,Nombre,Importe";
    campos = "clave,puestos.descripcion,importe";
    var subEntities = "razonesSociales,puestos";
    camposMostrar = ["clave", "puestos.descripcion"];

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };

    preFilters = setPreFilters(preFilters);

    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de plaza", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };
    var tituloSel = "Plaza";
    var tamanoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamanoSel);
}


function setEditRegimenContratacion() {

    //Parameters
    nameCmp = "EditRegimenContratacion";
    table = "RegimenContratacion";
    nameCols = idiomaSelecionadoCol.messageFormatter("RegimenDeContratacionClave")() + "," + idiomaSelecionadoCol.messageFormatter("RegimenDeContratacionDescripcion")();
    campos = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave";

    var preFilters = [];

    preFilters = setPreFilters(preFilters);

    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de regimen de contratación", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción del regimen de contratación", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "Regimen de contratación";
    var tamañoSel = "size-4";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditTipoContrato() {

    //Parameters
    nameCmp = "EditTipoContrato";
    table = "TipoContrato";
    nameCols = idiomaSelecionadoCol.messageFormatter("TipoContratoClave")() + "," + idiomaSelecionadoCol.messageFormatter("TipoContratoDescripcion")();
    campos = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion";

    var preFilters = [];
    preFilters = setPreFilters(preFilters);

    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de tipo de contrato", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción de tipo de contrato", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "Tipo de contrato";
    var tamanoSel = "size-4";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamanoSel);
}

function setEditIngreReinTipoNom() {
    //Parameters
    nameCmp = "EditIngreReinTipoNom";
    table = "TipoNomina";
    nameCols = idiomaSelecionado.messageFormatter("TipoNominaclave")() + "," + idiomaSelecionado.messageFormatter("TipoNominadescripcion")() + "," + idiomaSelecionado.messageFormatter("Periodicidaddescripcion")();
    campos = "clave,descripcion,periodicidad.descripcion";
    var subEntities = "periodicidad";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion";
    var filtersSearch = [];
    var preFilters = null;
    preFilters = setPreFilters(preFilters);
    filtersSearch[0] = { "etiqueta": "Clave de tipo de nomina", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre de tipo de nomina", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "Tipo Nomina";
    var tamanoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamanoSel);

}

function setEditIngreReinCentroCostos() {
    //Parameters
    nameCmp = "EditIngreReinCentroCostos";
    table = "CentroDeCosto";
    nameCols = idiomaSelecionadoCol.messageFormatter("CentroDeCostoclave")() + "," + idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcion")() + "," + idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcionPrevia")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroPatronal")();
    campos = "clave,descripcion,descripcionPrevia,registroPatronal.nombreregtpatronal";
    var subEntities = "registroPatronal,razonesSociales";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion";

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };
    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de Centro de costos", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre de Centro de costos", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "Centro de costo";
    var tamanoSel = "size-4";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamanoSel);
}

function setEditIngreReinDepartamento() {
    //Parameters
    nameCmp = "EditIngreReinDepartamento";
    table = "Departamentos";
    nameCols = idiomaSelecionado.messageFormatter("Departamentosclave")() + "," + idiomaSelecionado.messageFormatter("Departamentosdescripcion")() + "," + idiomaSelecionado.messageFormatter("DepartamentossubCuenta")();
    campos = "clave,descripcion,subCuenta";
    var subEntities = "razonesSociales";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion,[]subCuenta";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "razonesSociales.id": razon.id };
    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave Departamento", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre Departamento", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "Departamento";
    var tamanoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamanoSel);
}

function setEditIngreReinPuestos() {
    //Parameters
    nameCmp = "EditIngreReinPuestos";
    table = "Puestos";
    nameCols = idiomaSelecionado.messageFormatter("Puestosclave")() + "," + idiomaSelecionado.messageFormatter("Puestosdescripcion")() + "," + idiomaSelecionado.messageFormatter("PuestossalarioTabular")();
    //nameCols = "Clave,Descripción,Salario";
    campos = "clave,descripcion,salarioTabular";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]salarioTabular,[]maximo,[]categoriasPuestos.clave,[]categoriasPuestos.descripcion,[]categoriasPuestos.pagarPorHoras,[]descripcion,[]descripcionPrevia,[]funciones";

    var optionals = new Object();
    optionals["isWithAliasObtain"] = false;

    var subEntities = "Left Join:categoriasPuestos";
    preFilters = setPreFilters(preFilters = null);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave Puesto", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre de puesto", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "Puesto";
    var tamanoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamanoSel,
         typeof optionals === 'undefined' ? null : optionals);

}

function setEditIngreReinTurnos() {
    //Parameters
    nameCmp = "EditIngreReinTurnos";
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
    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave Turnos", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre de Turno", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "Turno";
    var tamanoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamanoSel);
}

function setEditJornada() {
    nameCmp = "EditJornada";
    table = "Jornada";
    nameCols = idiomaSelecionadoCol.messageFormatter("Jornadaclave")() + "," + idiomaSelecionadoCol.messageFormatter("Jornadadescripcion")();
    campos = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = "[]clave,[]descripcion";

    var preFilters = [];
    preFilters = setPreFilters(preFilters);

    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de jornada", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción de jornada", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "Jornada";
    var tamanoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamanoSel);
}

function preValidateBeforeSave() {
    var isValid = true;

    if (isPrm) {
        isValid = validateComponents(elementsPromo);
    } else {
        isValid = validateComponents(elementsIngreBajas);
    }

    if (isValid) {
        if (isPrm) {
            var formatThisDateInit = formantDdMmYyyy(document.getElementById("txtFechaInicial").value);
            var fechaInicialCompare = new Date(formatThisDateInit);

            if (fechaInicialCompare <= fechaInicialBase) {

                alert("La fecha inicial debe ser superior a la fecha: " + formatThisDateInit);

                return false;
            }
        }

        var getObjPlazasPorEmpleadosMov = getPlazasPorEmpleadosMov();
        var fechaIMSSAnte = new Date(getObjPlazasPorEmpleadosMov.fechaIMSS);
        fechaIMSSAnte.setHours(0, 0, 0);
        var formatThisDate = formantDdMmYyyy(document.getElementById("txtFechaIMSS").value);
        var fechaImss = new Date(formatThisDate);
        // fechaImss.setHours(0, 0, 0);
        if (fechaImss <= fechaIMSSAnte) {
            isValid = false;
            alert("No se permiten insertar plazas con fecha de IMMS inferior a la del ingreso");
        }

        if (isPrm) {
            var isSomeoneCheck = false;
            var $boxes = $('input[name=checkboxPrm]:checked');
            $boxes.each(function (e) {
                isSomeoneCheck = true;
                return false;
            });
            if (!isSomeoneCheck) {
                alert("Debes tener al menos un cambio, para realizar una promoción");
                isValid = false;
            }
        }
    }
    //isValid = camposNecesariosIngresosBajas();
    return isValid
}

function construirSDI(plazasPorEmpleadosMov) {
    var salariosIntegrados = {};
    if (automaticoSDI) {
        var valSDI = {};
        valSDI['claveEmpIni'] = getTextEdit("editEmpleado");
        valSDI['claveEmpFin'] = getTextEdit("editEmpleado");
        valSDI['claveTipoNomina'] = getTextEdit("editIngreReinTipoNom");
        valSDI['claveTipoCorrida'] = "PER";
        valSDI['claveRazonSocial'] = getRazonSocial().clave;
        valSDI['claveRegPatronal'] = getTextEdit("editRegistroPatronal");
        valSDI['tipoContrato'] = getTextEdit("editTipoContrato");
        valSDI['controlador'] = "RazonesSociales" + getRazonSocial().clave;
        valSDI['soloCalculo'] = true;

        var parametrosExtra = {};
        parametrosExtra.fechaCalculoSDI = document.getElementById("txtFechaIMSS").value;
        var plazasEmpleMov = [plazasPorEmpleadosMov]
        valSDI['listaplazasEmpleMovs'] = plazasEmpleMov;
        parametrosExtra.valoresExtras = [];
        valSDI['parametrosExtra'] = parametrosExtra;

        //Calcula SDI
        var url = route + "/api/CalculoNomina/calculoSDI";
        var data = JSON.stringify(valSDI);//Calculate SDI
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado !== null) {
            var result = Mensaje.resultado;
            salariosIntegrados = result;
        } else {
            console.log(Mensaje.error);
            salariosIntegrados = null;
        }
    }
    else {
        var salarioIntegradoActual = (document.getElementById("txtSalarioDiarioInt").value == "" ? 0 : document.getElementById("txtSalarioDiarioInt").value);
        var diario = parseFloat(plazasPorEmpleadosMov.importe);
        var factorInte = salarioIntegradoActual / diario;
        salariosIntegrados.salarioDiarioIntegrado = salarioIntegradoActual;
        salariosIntegrados.factorIntegracion = factorInte;
        salariosIntegrados.salarioDiarioFijo = salarioIntegradoActual;
        salariosIntegrados.salarioDiarioVariable = 0;
        salariosIntegrados.registroPatronal_ID = document.getElementById("editRegistroPatronal").getAttribute("value");
        salariosIntegrados.empleados_ID = document.getElementById("editEmpleado").getAttribute("value");
        salariosIntegrados.fecha = document.getElementById("txtFechaIMSS").value;
        salariosIntegrados.tipoDeSalario = 0;

    }

    return salariosIntegrados;
}

//Create Catalog
function construirPlazaPorEmpleadoMovIngresosBajas(obj) {
    if (obj === undefined || obj === null) {
        plazasPorEmpleadosMov = {};
        //if (plazasPorEmpleadosMov.id === undefined) {
        //}
    } else {
        plazasPorEmpleadosMov = {};
        if (obj.id !== undefined) {
            plazasPorEmpleadosMov.id = obj.id;
        }
        if (obj.plazasPorEmpleado !== undefined) {
            plazasPorEmpleadosMov.plazasPorEmpleado_ID = obj.plazasPorEmpleado.id;
        }
    }

    if (isPrm) {
        plazasPorEmpleadosMov.plazasPorEmpleado_ID = getplazasPorEmpleadosMov.plazasPorEmpleado.id;
        plazasPorEmpleadosMov.plazasPorEmpleado = {};
        plazasPorEmpleadosMov.plazasPorEmpleado.referencia = document.getElementById("txtReferencia").value;
        plazasPorEmpleadosMov.plazasPorEmpleado.razonesSociales_ID = getRazonSocial().id;
        plazasPorEmpleadosMov.plazasPorEmpleado.registroPatronal_ID = document.getElementById("editRegistroPatronal").getAttribute("value");
        plazasPorEmpleadosMov.plazasPorEmpleado.empleados_ID = document.getElementById("editEmpleado").getAttribute("value");

        if (obj !== null) {
            plazasPorEmpleadosMov.plazasPorEmpleado.fechaPrestaciones = obj.plazasPorEmpleado.fechaPrestaciones;
            if (obj.plazasPorEmpleado.claveRazonesSociales !== null) {
                plazasPorEmpleadosMov.plazasPorEmpleado.razonesSociales = {};
                plazasPorEmpleadosMov.plazasPorEmpleado.razonesSociales.clave = obj.plazasPorEmpleado.claveRazonesSociales;
            }
            //RegPatronal
            if (obj.plazasPorEmpleado.registroPatronal !== null) {
                plazasPorEmpleadosMov.plazasPorEmpleado.registroPatronal = {};
                plazasPorEmpleadosMov.plazasPorEmpleado.registroPatronal.clave = obj.plazasPorEmpleado.registroPatronal.clave;
                plazasPorEmpleadosMov.plazasPorEmpleado.registroPatronal.delegacion = obj.plazasPorEmpleado.registroPatronal.delegacion;
                plazasPorEmpleadosMov.plazasPorEmpleado.registroPatronal.subdelegacion = obj.plazasPorEmpleado.registroPatronal.subdelegacion;
            }

            //Employee
            plazasPorEmpleadosMov.plazasPorEmpleado.empleados_ID = obj.plazasPorEmpleado.empleados.id;
            if (obj.plazasPorEmpleado.empleados !== null) {
                plazasPorEmpleadosMov.plazasPorEmpleado.empleados = {};
                plazasPorEmpleadosMov.plazasPorEmpleado.empleados.clave = obj.plazasPorEmpleado.empleados.id;
                plazasPorEmpleadosMov.plazasPorEmpleado.empleados.status = obj.plazasPorEmpleado.empleados.status;
            }

        }

        plazasPorEmpleadosMov.plazasPorEmpleado.ingresosBajas_ID = getplazasPorEmpleadosMov.plazasPorEmpleado.ingresosBajas.id;
        plazasPorEmpleadosMov.isPrm = true;
    } else {
        plazasPorEmpleadosMov = valoresPorDefaultBooleanos(plazasPorEmpleadosMov);
        //PLAZAS POR EMPLEADO
        plazasPorEmpleadosMov.plazasPorEmpleado = construirPlazaPorEmpleadoIngresosBajas(obj);
        //END PLAZAS POR EMPLEADO
        plazasPorEmpleadosMov.isPrm = false;
    }

    //plazasPorEmpleadosMov.plazas_ID = document.getElementById("editIngreReinPuestos").getAttribute("value");
    plazasPorEmpleadosMov.fechaIMSS = document.getElementById("txtFechaIMSS").value;
    plazasPorEmpleadosMov.fechaInicial = document.getElementById("txtFechaInicial").value;

    if (rbBase.checked) {
        plazasPorEmpleadosMov.tipoRelacionLaboral = 1;
    } else if (rbConfianza.checked) {
        plazasPorEmpleadosMov.tipoRelacionLaboral = 2;
    }

    if (isPrm) {
        plazasPorEmpleadosMov.cambioTipoRelacionLaboral = $('#chkIngreReinRelacionLaboral').is(":checked");
    }

    if (rbSi.checked) {
        plazasPorEmpleadosMov.sindicalizado = true;
    } else if (rbNo.checked) {
        plazasPorEmpleadosMov.sindicalizado = false;
    }

    if (isPrm) {
        plazasPorEmpleadosMov.cambioSindicalizado = $('#chkIngreReinSindicalizado').is(":checked");
    }

    plazasPorEmpleadosMov.puestos_ID = document.getElementById("editIngreReinPuestos").getAttribute("value");

    var puestos = {};
    puestos.clave = getExtraValues("editIngreReinPuestos")[0];
    puestos.salarioTabular = getExtraValues("editIngreReinPuestos")[1];
    puestos.maximo = getExtraValues("editIngreReinPuestos")[2];
    puestos.descripcion = getExtraValues("editIngreReinPuestos")[6];
    puestos.descripcionPrevia = getExtraValues("editIngreReinPuestos")[7];
    puestos.funciones = getExtraValues("editIngreReinPuestos")[8];
    plazasPorEmpleadosMov.puestos = puestos;

    if (isPrm) {
        plazasPorEmpleadosMov.cambioPuestos = $('#chkIngreReinPuestos').is(":checked");
    }

    var categoriasPuestos = {};
    categoriasPuestos.clave = getExtraValues("editIngreReinPuestos")[3];
    categoriasPuestos.descripcion = getExtraValues("editIngreReinPuestos")[4];
    categoriasPuestos.pagarPorHoras = getExtraValues("editIngreReinPuestos")[5];
    puestos.categoriasPuestos = categoriasPuestos;
    plazasPorEmpleadosMov.puestos.categoriasPuestos = categoriasPuestos;

    plazasPorEmpleadosMov.tipoContrato_ID = document.getElementById("editTipoContrato").getAttribute("value");
    var tipoContrato = {};
    tipoContrato.clave = getExtraValues("editTipoContrato")[0];
    tipoContrato.descripcion = getExtraValues("editTipoContrato")[1];
    plazasPorEmpleadosMov.tipoContrato = tipoContrato;


    if (isPrm) {
        plazasPorEmpleadosMov.cambioTipoContrato = $('#chkIngreReinTipoContrato').is(":checked");
    }

    plazasPorEmpleadosMov.tipoNomina_ID = document.getElementById("editIngreReinTipoNom").getAttribute("value");

    var tipoNomina = {};
    tipoNomina.clave = getExtraValues("editIngreReinTipoNom")[0];
    tipoNomina.descripcion = getExtraValues("editIngreReinTipoNom")[1];
    plazasPorEmpleadosMov.tipoNomina = tipoNomina;

    if (isPrm) {
        plazasPorEmpleadosMov.cambioTipoDeNomina = $('#chkIngreReinTipoDeNomina').is(":checked");
    }

    plazasPorEmpleadosMov.centroDeCosto_ID = document.getElementById("editIngreReinCentroCostos").getAttribute("value");

    var centroDeCosto = {};
    centroDeCosto.clave = getExtraValues("editIngreReinCentroCostos")[0];
    centroDeCosto.descripcion = getExtraValues("editIngreReinCentroCostos")[1];
    plazasPorEmpleadosMov.centroDeCosto = centroDeCosto;

    if (isPrm) {
        plazasPorEmpleadosMov.cambioCentroDeCostos = $('#chkIngreReinCentroCostos').is(":checked");
    }

    plazasPorEmpleadosMov.departamentos_ID = document.getElementById("editIngreReinDepartamento").getAttribute("value");

    var departamentos = {};
    departamentos.clave = getExtraValues("editIngreReinDepartamento")[0];
    departamentos.subCuenta = getExtraValues("editIngreReinDepartamento")[1];
    departamentos.descripcion = getExtraValues("editIngreReinDepartamento")[2];
    plazasPorEmpleadosMov.departamentos = departamentos;

    if (isPrm) {
        plazasPorEmpleadosMov.cambioDepartamento = $('#chkIngreReinDepartamento').is(":checked");
    }

    plazasPorEmpleadosMov.turnos_ID = document.getElementById("editIngreReinTurnos").getAttribute("value");

    var turnos = {};
    turnos.clave = getExtraValues("editIngreReinTurnos")[0];
    turnos.descripcion = getExtraValues("editIngreReinTurnos")[1];
    turnos.tipoDeTurno = getExtraValues("editIngreReinTurnos")[2];
    turnos.horaJornada = getExtraValues("editIngreReinTurnos")[3];
    turnos.diasJornada = getExtraValues("editIngreReinTurnos")[4];

    if (isPrm) {
        plazasPorEmpleadosMov.cambioTurno = $('#chkIngreReinTurnos').is(":checked");
    }

    var razonesSociales = {};
    razonesSociales.id = getRazonSocial().id;
    razonesSociales.clave = getRazonSocial().clave;
    razonesSociales.descripcion = getRazonSocial().nombreRazon;
    turnos.razonesSociales = razonesSociales;

    plazasPorEmpleadosMov.turnos = turnos;


    plazasPorEmpleadosMov.jornada_ID = document.getElementById("editJornada").getAttribute("value");

    if (isPrm) {
        plazasPorEmpleadosMov.cambioJornada = $('#chkIngreReinJornada').is(":checked");
    }

    plazasPorEmpleadosMov.regimenContratacion = document.getElementById("editTipoContrato").getAttribute("value");

    if (isPrm) {
        plazasPorEmpleadosMov.cambioTipoContrato = $('#chkIngreReinTipoContrato').is(":checked");
    }

    var horasIngreRein = document.getElementById("txtHoras");
    if (horasIngreRein && horasIngreRein !== undefined) {
        plazasPorEmpleadosMov.horas = horasIngreRein.value;
    } else {
        plazasPorEmpleadosMov.horas = 0;
    }

    if (isPrm) {
        plazasPorEmpleadosMov.cambioHoras = $('#chkIngreReinHoras').is(":checked");
    }

    plazasPorEmpleadosMov.regimenContratacion = getExtraValues("editRegimenContratacion")[0];

    if (isPrm) {
        plazasPorEmpleadosMov.cambioRegimenContratacion = $('#chkIngreReinContratacion').is(":checked");
    }

    plazasPorEmpleadosMov.importe = document.getElementById("txtSalarioDiario").value;

    if (isPrm) {
        plazasPorEmpleadosMov.cambioSalario = $('#chkIngreReinSalarioDiario').is(":checked");
    }

    var cbxTipoSalario = document.getElementById("cbxTipoSalario");
    var valTipoSalario = cbxTipoSalario.options[cbxTipoSalario.selectedIndex].value;
    if (valTipoSalario !== undefined) {
        plazasPorEmpleadosMov.salarioPor = valTipoSalario;
    }

    if (isPrm) {
        plazasPorEmpleadosMov.cambioTipoSalario = $('#chkIngreTipoSalario').is(":checked");
    }

    if (obj != null) {
        plazasPorEmpleadosMov.plazasPorEmpleado.ingresosBajas = construirIngresoBaja(obj);
    }

    return plazasPorEmpleadosMov;
}

function clearUnnesecaryReferencesPlazaPorEmpleadoMov(plazasPorEmpleadosMov) {
    if (plazasPorEmpleadosMov.plazasPorEmpleado !== undefined && plazasPorEmpleadosMov.plazasPorEmpleado !== null) {
        if (!isPrm) {
            plazasPorEmpleadosMov.plazasPorEmpleado.razonesSociales = null;
            plazasPorEmpleadosMov.plazasPorEmpleado.empleados = null;
            plazasPorEmpleadosMov.plazasPorEmpleado.registroPatronal = null;
        }
    }
    plazasPorEmpleadosMov.puestos.categoriasPuestos = null;
    plazasPorEmpleadosMov.puestos = null;
    plazasPorEmpleadosMov.tipoContrato = null;
    plazasPorEmpleadosMov.tipoNomina = null;
    plazasPorEmpleadosMov.centroDeCosto = null;
    plazasPorEmpleadosMov.departamentos = null;
    plazasPorEmpleadosMov.turnos = null;
    return plazasPorEmpleadosMov;
}

function clearUnnesecaryReferencesSDI(salariosIntegrados) {
    if (salariosIntegrados !== undefined && salariosIntegrados !== null) {
        salariosIntegrados.registroPatronal = null;
        salariosIntegrados.empleados = null;
    }
    return salariosIntegrados;
}

//Ingresos y Bajas
function construirIngresoBaja(obj) {
    var ingresoBajas = undefined;
    if (obj.plazasPorEmpleado.ingresosBajas !== undefined && obj.plazasPorEmpleado.ingresosBajas !== null) {
        ingresoBajas = {};
        ingresoBajas.id = obj.plazasPorEmpleado.ingresosBajas.id;
        ingresoBajas.fechaBaja = obj.plazasPorEmpleado.ingresosBajas.fechaBaja;
        ingresoBajas.fechaIngreso = obj.plazasPorEmpleado.ingresosBajas.fechaIngreso;
        //NEW COlUMN
        ingresoBajas.fechaPrestaciones = obj.plazasPorEmpleado.ingresosBajas.fechaPrestaciones;
        //
        ingresoBajas.empleados_ID = obj.plazasPorEmpleado.ingresosBajas.idEmpleado;
        ingresoBajas.razonesSociales_ID = obj.plazasPorEmpleado.ingresosBajas.idRazonesSociales;
        ingresoBajas.registroPatronal_ID = obj.plazasPorEmpleado.ingresosBajas.idRegistroPatronal;
        ingresoBajas.aplicar = obj.plazasPorEmpleado.ingresosBajas.aplicar;
        ingresoBajas.causaBaja = obj.plazasPorEmpleado.ingresosBajas.causaBaja;
        ingresoBajas.tipoSeparacion = obj.plazasPorEmpleado.ingresosBajas.tipoSeparacion;
        ingresoBajas.fechaCalculo = obj.plazasPorEmpleado.ingresosBajas.fechaCalculo;
        ingresoBajas.calculado = obj.plazasPorEmpleado.ingresosBajas.calculado;
        ingresoBajas.complementaria = obj.plazasPorEmpleado.ingresosBajas.complementaria;
        ingresoBajas.fechaComplementaria = obj.plazasPorEmpleado.ingresosBajas.fechaComplementaria;
        ingresoBajas.previa = obj.plazasPorEmpleado.ingresosBajas.previa;
        ingresoBajas.procesado = obj.plazasPorEmpleado.ingresosBajas.procesado;
    }
    return ingresoBajas;
}

//Plazas por Empleado
function construirPlazaPorEmpleadoIngresosBajas(obj) {
    try {
        var plazasPorEmpleado = {};
        if (obj != null) {
            if (obj.plazasPorEmpleado !== undefined && obj.plazasPorEmpleado !== null) {
                plazasPorEmpleado.id = obj.plazasPorEmpleado.id;
                plazasPorEmpleado.referencia = obj.plazasPorEmpleado.referencia;
                var razonesSociales = {};
                razonesSociales.clave = obj.plazasPorEmpleado.claveRazonesSociales;
                plazasPorEmpleado.razonesSociales = razonesSociales;

                if (obj.plazasPorEmpleado.ingresosBajas !== undefined && obj.plazasPorEmpleado.ingresosBajas !== null) {
                    plazasPorEmpleado.ingresosBajas_ID = obj.plazasPorEmpleado.ingresosBajas.id;
                    plazasPorEmpleado.ingresosBajas = obj.plazasPorEmpleado.ingresosBajas;
                    if (!isPrm) {//Test
                        var dateFechaFinal = document.getElementById("txtFechaFinal").value;
                        obj.plazasPorEmpleado.ingresosBajas.fechaBaja = dateFechaFinal;
                    }
                }
            }
        }
        plazasPorEmpleado.referencia = document.getElementById("txtReferencia").value;
        plazasPorEmpleado.empleados_ID = document.getElementById("editEmpleado").getAttribute("value");
        var empleados = {};
        empleados.id = plazasPorEmpleado.empleados_ID;
        empleados.clave = getExtraValues("editEmpleado")[0];
        empleados.status = getExtraValues("editEmpleado")[1];
        plazasPorEmpleado.empleados = empleados;

        plazasPorEmpleado.registroPatronal_ID = document.getElementById("editRegistroPatronal").getAttribute("value");

        var registroPatronal = {};
        registroPatronal.clave = getExtraValues("editRegistroPatronal")[0];
        registroPatronal.delegacion = getExtraValues("editRegistroPatronal")[1];
        registroPatronal.subdelegacion = getExtraValues("editRegistroPatronal")[2];

        plazasPorEmpleado.registroPatronal = registroPatronal;

        plazasPorEmpleado.fechaFinal = document.getElementById("txtFechaFinal").value;
        plazasPorEmpleado.fechaPrestaciones = document.getElementById("txtFechaPrestaciones").value;
        plazasPorEmpleado.razonesSociales_ID = getRazonSocial().id;
        var razonesSociales = {};
        razonesSociales.clave = getRazonSocial().clave;
        plazasPorEmpleado.razonesSociales = razonesSociales;
        plazasPorEmpleado.plazaPrincipal = true;
        return plazasPorEmpleado;
    }
    catch (error) {
        console.error("construirPlazaPorEmpleadoIngresosBajas(): " + error);
    }
}

function valoresPorDefaultBooleanos(plazasPorEmpleadosMov) {
    plazasPorEmpleadosMov.cambioCentroDeCostos = false;
    plazasPorEmpleadosMov.cambioDepartamento = false;
    plazasPorEmpleadosMov.cambioTipoSalario = false;
    plazasPorEmpleadosMov.cambioSalario = false;
    plazasPorEmpleadosMov.cambioHoras = false;
    plazasPorEmpleadosMov.cambioPlazasPosOrganigrama = false;
    plazasPorEmpleadosMov.cambioPuestos = false;
    plazasPorEmpleadosMov.cambioTipoContrato = false;
    plazasPorEmpleadosMov.cambioSindicalizado = false;
    plazasPorEmpleadosMov.cambioJornada = false;
    plazasPorEmpleadosMov.cambioTipoDeNomina = false;
    plazasPorEmpleadosMov.cambioTurno = false;
    plazasPorEmpleadosMov.cambioTipoRelacionLaboral = false;
    plazasPorEmpleadosMov.cambioRegimenContratacion = false;
    return plazasPorEmpleadosMov;
}

/*Other functions catalog*/
function limpiarComponentesIngresosBajas() {
    document.getElementById("txtReferencia").value = "";
    clearEdit("editEmpleado");
    document.getElementById("txtApellidoPat").value = "";
    document.getElementById("txtApellidoMat").value = "";
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtLugarNac").value = "";
    document.getElementById("txtFechaNac").disabled = false;
    document.getElementById("txtFechaNac").value = "";
    document.getElementById("txtFechaNac").disabled = true;
    document.getElementById("txtEdad").value = "";
    document.getElementById("txtSexo").value = "";
    document.getElementById("txtNacionalidad").value = "";
    clearEdit("editRegistroPatronal");
    // clearEdit("editPosOrganigrama");

    //document.getElementById("rbBase").checked = false;
    //document.getElementById("rbConfianza").checked = false;
    //document.getElementById("rbSi").checked = false;
    //document.getElementById("rbNo").checked = false;

    $('#rbBase').prop('checked', true);
    $('#rbNo').prop('checked', true);

    clearEdit("editTipoContrato");
    clearEdit("editRegimenContratacion");
    clearEdit("editJornada");
    $("#cbxTipoSalario option:first").prop('selected', 'selected');
    clearEdit("editIngreReinTipoNom");
    clearEdit("editIngreReinCentroCostos");
    clearEdit("editIngreReinDepartamento");
    clearEdit("editIngreReinPuestos");
    document.getElementById("txtHoras").value = "";
    var date = new Date(getFechaSistema());
    document.getElementById("txtFechaInicial").value = formatDate(date);
    if (!isPrm) {
        document.getElementById("txtFechaFinal").value = formatDate(date);
        document.getElementById("txtFechaPrestaciones").value = formatDate(date);
    }
    document.getElementById("txtFechaIMSS").value = formatDate(date);
    clearEdit("editIngreReinTurnos");
    document.getElementById("txtSalarioDiario").value = "";
    getSalarioDiario = null;
    document.getElementById("txtSalarioDiarioInt").value = "";

    if (isPrm) {
        $('input[type=checkbox]').each(function () {
            this.checked = false;
        });

        validateComponents(elementsIngreBajas, true);
    } else {
        validateComponents(elementsPromo, true);
    }

    getplazasPorEmpleadosMov = null;
    getSalarioDiario = null;
    salarioDiarioIntegrado = null;

}

function calculateSDIIngreBajas() {
    var objPlazasPorEmpleadosMov = construirPlazaPorEmpleadoMovIngresosBajas(getplazasPorEmpleadosMov);
    var salariosIntegrados = null;
    salariosIntegrados = construirSDI(objPlazasPorEmpleadosMov);
    salarioDiarioIntegrado = salariosIntegrados;
    return salariosIntegrados;
}

function makeActionIngreBajas(action, obj) {
    var succes = false;
    var objPlazasPorEmpleadosMov = construirPlazaPorEmpleadoMovIngresosBajas(obj);
    if (salarioDiarioIntegrado !== undefined && salarioDiarioIntegrado !== null) {
        salarioDiarioIntegrado = clearUnnesecaryReferencesSDI(salarioDiarioIntegrado);
    }

    objPlazasPorEmpleadosMov = clearUnnesecaryReferencesPlazaPorEmpleadoMov(objPlazasPorEmpleadosMov);


    if (action === "A") {
        var url = route + "/api/PlazasPorEmpleadosMov/agregar";
        //ADD PLAZA X EMPLE MOV
        var object = {};
        object.entity = objPlazasPorEmpleadosMov;

        if (isPrm) {
            //var txtSalDiar = document.getElementById("txtSalarioDiarioInt").value;
            var txtSalarioOr = document.getElementById("infoSalarioDiario").getAttribute("lastvalue").toString();
            //if (txtSalarioOr === salarioDiarioIntegrado.salarioDiarioIntegrado.toString()) {
            if (txtSalarioOr === salarioDiarioIntegrado.salarioDiarioFijo.toString()) {
                salarioDiarioIntegrado = null;
            }
        }

        object.salariosIntegrados = salarioDiarioIntegrado;
        var data = JSON.stringify(object);

        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado !== null) {
            var result = Mensaje.resultado
            succes = true;
            if (!isPrm) {
                objPlazasPorEmpleadosMov.id = result.id;
                plazasPorEmpleadosMov.plazasPorEmpleado.id = result.plazasPorEmpleado_ID;
            }
        } else {
            alert(Mensaje.error);
        }
    }
    else if (action === "M") {
        var url = route + "/api/PlazasPorEmpleadosMov/actualizar";
        //UPDATE PLAZA X EMPLE MOV
        var object = {};
        object.entity = objPlazasPorEmpleadosMov;
        object.salariosIntegrados = salarioDiarioIntegrado;
        var data = JSON.stringify(object);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado !== null) {
            var result = Mensaje.resultado;
            if (result === 0) {
                alert("La fecha de Imss no debe ser inferior a la fecha final de la plaza inmediata anterior");
                document.getElementById("txtFechaIMSS").focus();
            }
            else if (result === 1) {
                //El empleado tiene una baja anterior a la fecha Immms capturada. Para realziar esta acción debera de agregarlos desde ingresos
                alert("La fecha de baja del Ingreso es menor a la del IMSS, Deberias de agregar una plaza nueva");
                document.getElementById("txtFechaIMSS").focus();
            }
            else {
                succes = true;
                objPlazasPorEmpleadosMov = null;
            }
        }
    }
    else if (action === "E") {
        var url = route + "/api/PlazasPorEmpleadosMov/eliminar";
        var data = JSON.stringify(objPlazasPorEmpleadosMov); //DELETE PLAZA X EMPLE MOV
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado !== null) {
            var result = Mensaje.resultado;
            if (result === 0) {
                if (isPrm) {
                    alert("Debes de eliminar esta alta desde el catalogo de Ingresos y Bajas ");
                } else {
                    alert("La plaza que deseas eliminar no es la ultima plaza");
                }
            }
            else {
                succes = true;
                objPlazasPorEmpleadosMov = null;
            }
        }
    }
    return succes;
}

/*Function Buttons*/
function saveIngreBajas() {
    if (preValidateBeforeSave()) {
        var succes = false;
        succes = makeActionIngreBajas("A", null);
        if (succes) {
            limpiarComponentesIngresosBajas();
            if (!isPrm) {
                generateValueIngreBajas();
            }
        }
    }
}

function updateIngreBajas() {
    var isValid = true;
    if (isPrm) {
        isValid = validateComponents(elementsPromo);
    } else {
        isValid = validateComponents(elementsIngreBajas);
    }
    if (isValid) {
        var succes = false;
        succes = makeActionIngreBajas("M", getplazasPorEmpleadosMov);
        if (succes) {
            limpiarComponentesIngresosBajas();
            changeModeButtons("U");
            generateValueIngreBajas();
        }
    }
}

function deleteIngreBajas() {
    var succes = false;
    succes = makeActionIngreBajas("E", getplazasPorEmpleadosMov);
    if (succes) {
        limpiarComponentesIngresosBajas();
        changeModeButtons("E");
        if (!isPrm) {
            generateValueIngreBajas();
        }
    }
}

function cancelIngreBajas() {
    limpiarComponentesIngresosBajas();
    if (!isPrm) {
        generateValueIngreBajas();
    }
    changeModeButtons("U");
    enabledCatalogIngresosBajas(true);
    if (isPrm) {
        document.getElementById("btnGuardar").disabled = false;
        document.getElementById("btnActualizar").disabled = false;
        document.getElementById("btnEliminar").disabled = false;
    }
}

function changeModeButtons(type) {
    if (type === "M") {
        //document.getElementById("txtReferencia").disabled = true;
        document.getElementById("btnActualizar").style.display = "inline";
        document.getElementById("btnEliminar").style.display = "inline";
        document.getElementById("btnBuscar").style.display = "inline";
        document.getElementById("btnCancelar").style.display = "inline";
        document.getElementById("btnGuardar").style.display = "inline";
        //  if (!isPrm) {
        document.getElementById("btnGuardar").style.display = "none";
        //  }
    }
    else if (type === "C" || type === "E" || type === "U") {
        //document.getElementById("txtReferencia").disabled = false;
        document.getElementById("btnActualizar").style.display = "none";
        document.getElementById("btnEliminar").style.display = "none";
        document.getElementById("btnBuscar").style.display = "inline";
        document.getElementById("btnCancelar").style.display = "inline";
        if (type === "C") {
            document.getElementById("btnGuardar").style.display = "none";
        } else {
            document.getElementById("btnGuardar").style.display = "inline";
        }
    }
}

/*Table selector*/
function selectorIngreBajas() {
    //Parameters
    nameCmp = "selectorAltasBajas";
    title = "Ingresos y Reingresos";
    table = "PlazasPorEmpleadosMov";
    var subCampo = "@(Select CASE WHEN Count(pm) = 1 THEN 'M' ELSE 'C' END from PlazasPorEmpleadosMov pm where pm.plazasPorEmpleado.referencia = o1.referencia)";
    var subCampo2 = null;
    if (isPrm) {
        subCampo2 = "@(Select CASE WHEN Count(pm) = 1 THEN 'M' ELSE CASE WHEN o.id = Max(pm.id)  THEN 'M' ELSE 'M' END END from PlazasPorEmpleadosMov pm where pm.plazasPorEmpleado.referencia = o1.referencia)";
    } else {
        subCampo2 = "@(Select CASE WHEN Count(pm) = 1 THEN 'M' ELSE CASE WHEN o.id = Max(pm.id)  THEN 'M' ELSE 'C' END END from PlazasPorEmpleadosMov pm where pm.plazasPorEmpleado.referencia = o1.referencia)";
    }

    var subCampo3 = "@(Select CASE WHEN o.id = Min(pm.id)  THEN 'Alta' ELSE 'Mod.' END from PlazasPorEmpleadosMov pm where pm.plazasPorEmpleado.referencia = o1.referencia)";
    nameCols = "()isModifica,()isModificaPromo,Tipo Movimiento,Referencia,Clave Empleado,Nombre Empleado,Fecha Inicial,Fecha Final,Salario,Clave Puesto, Descripción Puesto,Horas";
    campos = subCampo + "," + subCampo2 + "," + subCampo3 + ",plazasPorEmpleado.referencia,plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,Date:fechaInicial,Date:plazasPorEmpleado.fechaFinal,importe,puestos.clave,puestos.descripcion,horas";
    //plazasPorEmpleado.status <<< Example of formula for hibernate see model Entity
    var subEntities = "puestos,plazasPorEmpleado";

    var preFilters = null;
    if (isPrm) {
        preFilters = {
            "plazasPorEmpleado.razonesSociales.id#=": getRazonSocial().id,
            "@id": "(Select CASE WHEN o.id = Min(pm.id) THEN 0 ELSE o.id  END from PlazasPorEmpleadosMov pm where pm.plazasPorEmpleado.referencia = o1.referencia)"
        };
    } else {
        preFilters = {
            "plazasPorEmpleado.razonesSociales.id#=": getRazonSocial().id
        };
    }

    preFilters = setPreFilters(preFilters);

    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Referencia", "tipo": "string", "campo": "plazasPorEmpleado.referencia", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };

    return buildTableSearch(nameCmp, title, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch);
}

function selectorIngreBajasShow(idVal) {
    var dataIngresosBajas = getIngresoBaja(idVal[0], false);
    mostrarObjetoIngresosBajas(dataIngresosBajas);
    getplazasPorEmpleadosMov = dataIngresosBajas;
    var canModify = null;
    if (isPrm) {
        canModify = idVal[2];
    } else {
        canModify = idVal[1];
    }
    if (canModify === 'M') {
        enabledCatalogIngresosBajas(true);
        changeModeButtons("M");

        //if (isPrm) {
        //   /* document.getElementById("btnGuardar").style.display = "none";
        //    document.getElementById("btnActualizar").disabled = false;
        //    document.getElementById("btnEliminar").disabled = false;*/
        //    changeModeButtons("M");
        //} else {
        //    changeModeButtons("M");
        //}
    } else if (canModify === 'C') {
        enabledCatalogIngresosBajas(false);
        changeModeButtons("C");
    }

}

/*Table selector prom*/
function selectorPromociones() {
    //Parameters
    nameCmp = "selectorAltasProm";
    title = "Ingresos y Reingresos";
    table = "PlazasPorEmpleadosMov";
    var subCampo = "@(Select CASE WHEN Count(pm) = 1 THEN 'M' ELSE 'C' END from PlazasPorEmpleadosMov pm where pm.plazasPorEmpleado.referencia = o1.referencia)";
    var subCampo2 = null;
    subCampo2 = "@(Select CASE WHEN Count(pm) = 1 THEN 'M' ELSE CASE WHEN o.id = Max(pm.id)  THEN 'M' ELSE 'M' END END from PlazasPorEmpleadosMov pm where pm.plazasPorEmpleado.referencia = o1.referencia)";
    var subCampo3 = "@(Select CASE WHEN o.id = Min(pm.id)  THEN 'Alta' ELSE 'Mod.' END from PlazasPorEmpleadosMov pm where pm.plazasPorEmpleado.referencia = o1.referencia)";
    nameCols = "()isModifica,()isModificaPromo,()Tipo Movimiento," + idiomaSelecionadoCol.messageFormatter("IngresosBajasReferencia")() + "," + idiomaSelecionadoCol.messageFormatter("Empleados")() + "," +
        idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," + idiomaSelecionadoCol.messageFormatter("IngresosBajasFechasInicial")() + "," +
        idiomaSelecionadoCol.messageFormatter("IngresosBajasFechaFinal")() + "," + idiomaSelecionadoCol.messageFormatter("IngresosBajasSalarioDiario")() + "," +
        idiomaSelecionadoCol.messageFormatter("Puestos")() + "," + idiomaSelecionadoCol.messageFormatter("Puestosdescripcion")() + "," +
        idiomaSelecionadoCol.messageFormatter("IngresosBajasHoras")();
    // nameCols = "()isModifica,()isModificaPromo,()Tipo Movimiento,Referencia,Clave Empleado,Nombre Empleado,Fecha Inicial,Fecha Final,Salario,Clave Puesto, Descripción Puesto,Horas";
    campos = subCampo + "," + subCampo2 + "," + subCampo3 + ",plazasPorEmpleado.referencia,plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,Date:fechaInicial,Date:plazasPorEmpleado.fechaFinal,importe,puestos.clave,puestos.descripcion,horas";
    //plazasPorEmpleado.status <<< Example of formula for hibernate see model Entity
    var subEntities = "puestos,plazasPorEmpleado";

    var preFilters = null;
    preFilters = {
        "plazasPorEmpleado.razonesSociales.id#=": getRazonSocial().id,
        "@id": "(Select  MAX(pm.id)  from PlazasPorEmpleadosMov pm where pm.plazasPorEmpleado.referencia = o1.referencia)",
        "plazasPorEmpleado.ingresosBajas.fechaBaja#>=": getFechaSistema(),
        /*"@id": "(Select CASE WHEN o.id = Min(pm.id) THEN o.id ELSE 0 END from PlazasPorEmpleadosMov pm where pm.plazasPorEmpleado.referencia = o1.referencia)"*/
    };
    var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Referencia", "tipo": "string", "campo": "plazasPorEmpleado.referencia", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };

    return buildTableSearch(nameCmp, title, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
         typeof camposObtener === 'undefined' ? null : camposObtener
         );
}

function selectorPromocionesShow(idVal) {
    changeModeButtons("U");
    var dataIngresosBajas = getIngresoBaja(idVal[0], false);
    mostrarObjetoIngresosBajas(dataIngresosBajas);
    getplazasPorEmpleadosMov = dataIngresosBajas;
}

function enabledCatalogIngresosBajas(change) {
    if (change) {
        if (!isPrm) {
            enabledEdit('editEmpleado', true);
            enabledEdit('editRegistroPatronal', true);
        }
        //enabledEdit('editPosOrganigrama', true);
        document.getElementById("rbBase").disabled = false;
        document.getElementById("rbConfianza").disabled = false;
        document.getElementById("rbSi").disabled = false;
        document.getElementById("rbNo").disabled = false;
        enabledEdit('editTipoContrato', true);
        document.getElementById("txtFechaInicial").disabled = false;
        if (!isPrm) {
            document.getElementById("txtFechaFinal").disabled = false;
            document.getElementById("txtFechaPrestaciones").disabled = false;
        }
        //document.getElementById("txtFechaIMSS").disabled = false;
        enabledEdit('editRegimenContratacion', true);
        document.getElementById("editIngreReinTipoNom").disabled = false;
        enabledEdit('editIngreReinTipoNom', true);
        enabledEdit('editIngreReinCentroCostos', true);
        enabledEdit('editIngreReinDepartamento', true);
        enabledEdit('editIngreReinPuestos', true);
        enabledEdit('editIngreReinTurnos', true);
        enabledEdit('editJornada', true);
        document.getElementById("txtSalarioDiario").disabled = false;
        if (automaticoSDI) {
            document.getElementById("txtSalarioDiarioInt").disabled = true;
        } else {
            document.getElementById("txtSalarioDiarioInt").disabled = false;
        }
        document.getElementById("cbxTipoSalario").disabled = false;
        document.getElementById("txtHoras").disabled = false;

        if (isPrm) {
            $("input[name=checkboxPrm]").prop("disabled", false);
        }

        /*   document.getElementById("btnActualizar").disabled = false;
           document.getElementById("btnEliminar").disabled = false;*/

    } else {
        enabledEdit('editEmpleado', false);
        enabledEdit('editRegistroPatronal', false);
        // enabledEdit('editPosOrganigrama', false);
        document.getElementById("rbBase").disabled = true;
        document.getElementById("rbConfianza").disabled = true;
        document.getElementById("rbSi").disabled = true;
        document.getElementById("rbNo").disabled = true;
        enabledEdit('editTipoContrato', false);
        document.getElementById("txtFechaInicial").disabled = true;
        if (!isPrm) {
            document.getElementById("txtFechaFinal").disabled = true;
            document.getElementById("txtFechaPrestaciones").disabled = true;
        }
        // document.getElementById("txtFechaIMSS").disabled = true;
        enabledEdit('editRegimenContratacion', false);
        enabledEdit('editIngreReinTipoNom', false);
        enabledEdit('editIngreReinTipoNom', false);
        enabledEdit('editIngreReinCentroCostos', false);
        enabledEdit('editIngreReinDepartamento', false);
        enabledEdit('editIngreReinPuestos', false);
        enabledEdit('editIngreReinTurnos', false);
        enabledEdit('editJornada', false);
        document.getElementById("txtSalarioDiario").disabled = true;
        document.getElementById("txtSalarioDiarioInt").disabled = true;
        document.getElementById("cbxTipoSalario").disabled = true;
        document.getElementById("txtHoras").disabled = true;

        if (isPrm) {
            $("input[name=checkboxPrm]").prop("disabled", true);
        }
    }
}

function camposNecesariosIngresosBajas() {
    if (document.getElementById("editEmpleado").getAttribute("value") == null) {
        return false;
    }
}

function mostrarObjetoIngresosBajas(Obj, revert) {
    revert = typeof revert !== 'undefined' ? revert : null;
    if (revert === null) {
        document.getElementById("txtReferencia").value = Obj.plazasPorEmpleado.referencia;
        setEditObject("editEmpleado", Obj.plazasPorEmpleado.empleados.clave);
        setEditObject("editRegistroPatronal", Obj.plazasPorEmpleado.claveRegistroPatronal);
    }
    // setEditObject("editPosOrganigrama", Obj.clavePlazas);

    if (Obj.tipoRelacionLaboral === 1) {
        $('#rbBase').prop('checked', true);
        if (isPrm) {
            document.getElementById("infoRelacionLaboral").setAttribute("lastValue", Obj.tipoRelacionLaboral);
            document.getElementById("infoRelacionLaboral").setAttribute("title", "Base");
        }
    } else if (Obj.tipoRelacionLaboral === 2) {
        $('#rbConfianza').prop('checked', true);
        if (isPrm) {
            document.getElementById("infoRelacionLaboral").setAttribute("lastValue", Obj.tipoRelacionLaboral);
            document.getElementById("infoRelacionLaboral").setAttribute("title", "Confianza");
        }
    }
    if (isPrm) {
        if (Obj.cambioTipoRelacionLaboral) {
            $('#chkIngreReinRelacionLaboral').prop('checked', true);
        } else {
            $('#chkIngreReinRelacionLaboral').prop('checked', false);
        }
    }

    if (Obj.sindicalizado === true) {
        $('#rbSi').prop('checked', true);
        if (isPrm) {
            document.getElementById("infoRelacionLaboral").setAttribute("lastValue", Obj.sindicalizado);
            document.getElementById("infoRelacionLaboral").setAttribute("title", "Sí");
        }
    } else if (Obj.sindicalizado === false) {
        $('#rbNo').prop('checked', true);
        if (isPrm) {
            document.getElementById("infoSindicalizado").setAttribute("lastValue", Obj.sindicalizado);
            document.getElementById("infoSindicalizado").setAttribute("title", "No");
        }
    }
    if (isPrm) {
        if (Obj.cambioSindicalizado) {
            $('#chkIngreReinSindicalizado').prop('checked', true);
        } else {
            $('#chkIngreReinSindicalizado').prop('checked', false);
        }
    }

    setEditObjectByID("editTipoContrato", Obj.idTipoContrato);
    if (isPrm) {
        document.getElementById("infoTipoContrato").setAttribute("lastValue", Obj.idTipoContrato);
        document.getElementById("infoTipoContrato").setAttribute("title", getBriefEdit("editTipoContrato"));
        if (Obj.cambioTipoContrato) {
            $('#chkIngreReinTipoContrato').prop('checked', true);
        } else {
            $('#chkIngreReinTipoContrato').prop('checked', false);
        }
    }
    setEditObject("editRegimenContratacion", Obj.idRegimenContratacion);
    if (isPrm) {
        document.getElementById("infoRegimenContratacion").setAttribute("lastValue", Obj.idRegimenContratacion);
        document.getElementById("infoRegimenContratacion").setAttribute("title", getBriefEdit("editRegimenContratacion"));
        if (Obj.cambioRegimenContratacion) {
            $('#chkIngreReinContratacion').prop('checked', true);
        } else {
            $('#chkIngreReinContratacion').prop('checked', false);
        }
    }

    if (revert === null) {
        document.getElementById("txtFechaInicial").value = formatDate(new Date(Obj.fechaInicial));
        fechaInicialBase = new Date(Obj.fechaInicial);
        document.getElementById("txtFechaIMSS").value = formatDate(new Date(Obj.fechaIMSS));
    }

    if (!isPrm) {
        document.getElementById("txtFechaFinal").value = formatDate(new Date(Obj.plazasPorEmpleado.fechaFinal));
        document.getElementById("txtFechaPrestaciones").value = formatDate(new Date(Obj.plazasPorEmpleado.fechaPrestaciones));
    }
    setEditObject("editIngreReinTipoNom", Obj.claveTipoNomina);
    if (isPrm) {
        document.getElementById("infoTipoNom").setAttribute("lastValue", Obj.claveTipoNomina);
        document.getElementById("infoTipoNom").setAttribute("title", getBriefEdit("editIngreReinTipoNom"));
        if (Obj.cambioTipoDeNomina) {
            $('#chkIngreReinTipoDeNomina').prop('checked', true);
        } else {
            $('#chkIngreReinTipoDeNomina').prop('checked', false);
        }
    }
    setEditObject("editIngreReinCentroCostos", Obj.claveCentroDeCosto);
    if (isPrm) {
        document.getElementById("infoCentroCosto").setAttribute("lastValue", Obj.claveCentroDeCosto);
        document.getElementById("infoCentroCosto").setAttribute("title", getBriefEdit("editIngreReinCentroCostos"));
        if (Obj.cambioCentroDeCostos) {
            $('#chkIngreReinCentroCostos').prop('checked', true);
        } else {
            $('#chkIngreReinCentroCostos').prop('checked', false);
        }
    }
    setEditObject("editIngreReinDepartamento", Obj.claveDepartamentos);
    if (isPrm) {
        document.getElementById("infoDepartamento").setAttribute("lastValue", Obj.claveDepartamentos);
        document.getElementById("infoDepartamento").setAttribute("title", getBriefEdit("editIngreReinDepartamento"));
        if (Obj.cambioDepartamento) {
            $('#chkIngreReinDepartamento').prop('checked', true);
        } else {
            $('#chkIngreReinDepartamento').prop('checked', false);
        }
    }
    setEditObject("editIngreReinPuestos", Obj.clavePuestos);
    if (isPrm) {
        document.getElementById("infoPuestos").setAttribute("lastValue", Obj.clavePuestos);
        document.getElementById("infoPuestos").setAttribute("title", getBriefEdit("editIngreReinPuestos"));
        if (Obj.cambioDepartamento) {
            $('#chkIngreReinPuestos').prop('checked', true);
        } else {
            $('#chkIngreReinPuestos').prop('checked', false);
        }
    }
    setEditObject("editIngreReinTurnos", Obj.claveTurnos);
    if (isPrm) {
        document.getElementById("infoTurnos").setAttribute("lastValue", Obj.claveTurnos);
        document.getElementById("infoTurnos").setAttribute("title", getBriefEdit("editIngreReinTurnos"));
        if (Obj.cambioTurno) {
            $('#chkIngreReinTurnos').prop('checked', true);
        } else {
            $('#chkIngreReinTurnos').prop('checked', false);
        }
    }
    setEditObjectByID("editJornada", Obj.jornada_ID);
    if (isPrm) {
        document.getElementById("infoJornada").setAttribute("lastValue", Obj.jornada_ID);
        document.getElementById("infoJornada").setAttribute("title", getBriefEdit("editJornada"));
        if (Obj.cambioJornada) {
            $('#chkIngreReinJornada').prop('checked', true);
        } else {
            $('#chkIngreReinJornada').prop('checked', false);
        }
    }
    $('#txtHoras').val(Obj.horas);
    if (isPrm) {
        document.getElementById("infoHoras").setAttribute("lastValue", Obj.horas);
        document.getElementById("infoHoras").setAttribute("title", document.getElementById("txtHoras").value);
        if (Obj.cambioHoras) {
            $('#chkIngreReinHoras').prop('checked', true);
        } else {
            $('#chkIngreReinHoras').prop('checked', false);
        }
    }
    $('#txtSalarioDiario').val(Obj.importe);
    getSalarioDiario = Obj.importe.toString();
    if (isPrm) {
        document.getElementById("infoSalarioDiario").setAttribute("lastValue", Obj.importe);
        document.getElementById("infoSalarioDiario").setAttribute("title", document.getElementById("txtSalarioDiario").value);
        if (Obj.cambioSalario) {
            $('#chkIngreReinSalarioDiario').prop('checked', true);
        } else {
            $('#chkIngreReinSalarioDiario').prop('checked', false);
        }
    }
    $("#cbxTipoSalario").val(Obj.salarioPor);
    if (isPrm) {
        document.getElementById("infoTipoSalario").setAttribute("lastValue", Obj.salarioPor);
        document.getElementById("infoTipoSalario").setAttribute("title", $("#cbxTipoSalario option:selected").text());
        if (Obj.cambioTipoSalario) {
            $('#chkIngreTipoSalario').prop('checked', true);
        } else {
            $('#chkIngreTipoSalario').prop('checked', false);
        }
    }

    //GET SDI
    var getSalDiInte = getSDIByEmpleadoyRegPat(Obj.plazasPorEmpleado.empleados.id, Obj.plazasPorEmpleado.idRegistroPatronal, new Date(Obj.fechaIMSS));

    if (getSalDiInte == null) {
        $('#txtSalarioDiarioInt').val("");
        console.log("Empty SDI");
    } else {
        salarioDiarioIntegrado = getSalDiInte;
        if (salarioDiarioIntegrado.salarioDiarioIntegrado != null) {
            $('#txtSalarioDiarioInt').val(salarioDiarioIntegrado.salarioDiarioIntegrado);
        }
    }
}

function getSDIByEmpleadoyRegPat(empleado, regPat, fecha) {
    var getSalIntegrado = undefined;
    var url = route + "/api/SalariosIntegrados/getSalariosIntegradosPorEmpleadoyRegPat";
    var data = new Object();
    data['idEmpleado'] = empleado;
    data['idRegPat'] = regPat;
    data['fecha'] = fecha;

    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {
        getSalIntegrado = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }
    return getSalIntegrado;
}

function getIngresoBaja(idVal, withKeyReference) {
    var ingresoBaja = undefined;
    var valReference = idVal;
    var url = route + "/api/PlazasPorEmpleadosMov/getPlazasPorEmpleadosMovPorReferenciaYRazonsocial";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var valIdRazonSocial = razon.id;
    var data = new Object();
    if (withKeyReference) {
        data['claveReferencia'] = valReference;
    } else {
        data['clavePlazaMov'] = valReference;
    }
    data['claveRazonSocial'] = valIdRazonSocial;

    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {
        ingresoBaja = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }
    if (ingresoBaja === undefined) {
        var ingresoBaja = {};
    }

    return ingresoBaja;
}

/*validations*/
function getPlazasPorEmpleadosMov() {
    var getplazasEmpleMov = undefined;
    var valIdEmpleado = document.getElementById("editEmpleado").getAttribute("value");
    var valIdRegPat = document.getElementById("editRegistroPatronal").getAttribute("value");
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var valIdRazonSocial = razon.id;
    var url = route + "/api/PlazasPorEmpleadosMov/getPlazasPorEmpleadosMovMaxPorEmpleadoYRegPatronal";
    var data = new Object();
    data['idEmpleado'] = valIdEmpleado;
    data['idRegPat'] = valIdRegPat;
    data['idRazonSocial'] = valIdRazonSocial;
    data = JSON.stringify(data);

    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);

    if (Mensaje.resultado !== null) {
        getplazasEmpleMov = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }
    if (getplazasEmpleMov === undefined) {
        getplazasEmpleMov = {};
    }
    return getplazasEmpleMov;
}