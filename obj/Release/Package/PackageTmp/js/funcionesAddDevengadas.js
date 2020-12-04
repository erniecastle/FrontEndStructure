var plazaPorEmpleadoMov = null;
var empleado = null;
var fechaIngresoEmpleado;
var razonSocialActual;
var tablaFactorInt = null;
var fechaSistemasVacDeven;
var plazasPorEmpleado;
var listaVacacionesDevengadas = new Array();
var vacDevenga = {};
var idiomaSelecionadoCol;
var arreglosAve = {
    1: "1er", 2: "2°", 3: "3er", 4: "4°", 5: "5°", 6: "6°", 7: "7°", 8: "8°", 9: "9°", 10: "10°", 11: "11°", 12: "12°", 13: "13er", 14: "14°", 15: "15°",
16:"16°",17:"17°",18:"18°",19:"19°",20:"20°",21:"21°",22:"22°",23:"23°",24:"24°",25:"25°",26:"26°",27:"27°",28:"28°",29:"29°",30:"30°"
};
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
   
    startCustomTools();
    OpenTable(document.getElementById('VacDeven'));
    OpenTable(document.getElementById('tblVacaAdd'));
    
    InitEventsTable();
    fechaSistemasVacDeven = getFechaSistema();
    getRazonSocialActual();
   
    getTablaDatosAntiguedad();

});

function setEditEmpleado() {

    //Parameters
    nameCmp = "EditEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionadoCol.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionadoCol.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionadoCol.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "Clave, Nombre, Apellido Paterno, Apellido Materno,Nombre abreviado";
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";//Quit ID;
    camposObtener = "plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";
    //var subEntities = "razonesSociales"; //Unnecesary
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razon.id };//Unnecesary

    preFilters["@BETWEEN1"] = [
        "(( o.fechaInicial <= :PB1) OR ( o.fechaInicial BETWEEN :PB1 AND :PB2 ))",
        "PB1", new Date(), "PB2", new Date()];

    preFilters["@BETWEEN2"] = [
        "(( o.plazasPorEmpleado.fechaFinal >= :PB3  )  OR (o.plazasPorEmpleado.fechaFinal BETWEEN :PB4 AND :PB3))",
        "PB3", new Date(), "PB4", new Date()];
    //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecialMovimientosNomina";
    var valoreswhereEsp;
    //if (claveTipoNomina !== "") {
    //    var camposWhereEsp = ["tipoNomina.clave"];
    //    valoreswhereEsp = [claveTipoNomina, razonSocialActual.clave, null, new Date(), new Date()];
    //    preFilters["tipoNomina.clave"] = claveTipoNomina;
    //} else {
    var camposWhereEsp;
    valoreswhereEsp = [razonSocialActual.clave, null, new Date(), new Date()];
    //}
    //var filtersSearch = [];//Unnecesary
    //filtersSearch[0] = { "etiqueta": "Clave del empleado", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre del empleado", "tipo": "string", "campo": "nombre", "medida": "m" };
    var optionals = { "queryEspecial": queryEspecial, "camposWhereEsp": camposWhereEsp, "valoreswhereEsp": valoreswhereEsp };
    optionals["camposGroup"] = campos;
    optionals["camposOrden"] = ["plazasPorEmpleado.empleados.clave"];
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}

function setEditEmpleadoShow(value) {
    if (value !== null) {
        var obj = value[0];
        plazaPorEmpleadoMov = obj[0];
        empleado = obj[1];
        var nombreCompleto = empleado.apellidoPaterno + " " + empleado.apellidoMaterno + " " + empleado.nombre;
        var edit = document.getElementById("editEmpleado");
        var txtDescripcion = edit.children[1];
        // console.log(txtDescripcion);
        txtDescripcion.value = nombreCompleto;
        fechaIngresoEmpleado = new Date(getFechaIngreso(empleado.id));
        document.getElementById("txtFechaIngreso").value = formatDatemmddyyy(new Date(fechaIngresoEmpleado));
        getPlazaPorID(plazaPorEmpleadoMov.plazasPorEmpleado_ID);
        document.getElementById("txtSalarioActual").value = getSalarioIDEmpleadoIDReg(empleado.id, plazasPorEmpleado.registroPatronal_ID, fechaSistemasVacDeven);
        getVacacionesDevengadas(empleado.clave, razonSocialActual.clave);
        
        construirDatosTable();
        construirVacacionDevengada();

    }
}

function construirVacacionDevengada() {
    var añosTrabajados;
    var factorIntegracion;
    var vacTbl = {};
    var arregletbl = new Array();
    var exito = true;
    añosTrabajados = calcularAntiguedadExacta(fechaIngresoEmpleado);
    var fechaAniversario = new Date(fechaIngresoEmpleado.getFullYear(), fechaIngresoEmpleado.getMonth(), fechaIngresoEmpleado.getDate());
    fechaAniversario.setFullYear(fechaAniversario.getFullYear() + (añosTrabajados + 1));
    for (var i = 0; i < listaVacacionesDevengadas.length; i++) {
        var fechaante = new Date(fechaIngresoEmpleado.getFullYear(), fechaIngresoEmpleado.getMonth(), fechaIngresoEmpleado.getDate());
        fechaante.setFullYear(fechaante.getFullYear() + listaVacacionesDevengadas[i].ejercicio);
        if (fechaante.getFullYear() === fechaAniversario.getFullYear()) {
            exito = false;
            break;
        }
    }

    if (exito) {
        if (tablaFactorInt !== null) {
            if (añosTrabajados > 0) {
                for (i = 0; i < tablaFactorInt[1].length; i++) {
                    if (añosTrabajados === parseInt(tablaFactorInt[1][i])) {
                        factorIntegracion = tablaFactorInt[1][i + 1];
                        break;
                    } else if (añosTrabajados < parseInt(tablaFactorInt[1][i])) {
                        factorIntegracion = tablaFactorInt[1][i + 1];
                        break;

                    } else if (i === tablaFactorInt[1].length - 1 && añosTrabajados > parseInt(tablaFactorInt[1][i])) {
                        factorIntegracion = tablaFactorInt[1][tablaFactorInt[i].length - 1];
                        break;
                    }
                }
            } else {
                factorIntegracion = tablaFactorInt[1][0];

            }
            // document.getElementById("lblAño").style.display="none";
            var mensaje = idiomaSelecionado.messageFormatter("DevengadasTblDiasAdd")();
            document.getElementById("lblAñoAgregar").innerText = mensaje.replace("N", arreglosAve[añosTrabajados + 1]);// "Dias a agregar correspondientes al " + arreglosAve[añosTrabajados + 1] + " año";
            document.getElementById("txtDiasVac").value = parseInt(factorIntegracion[3]);
            document.getElementById("txtDiasPrima").value = (parseFloat(factorIntegracion[4]) / 100) * parseInt(factorIntegracion[3]);
            vacDevenga.ejercicio = añosTrabajados + 1;
            vacTbl.ejercicio = vacDevenga.ejercicio;
            vacDevenga.registroInicial = false;
            vacDevenga.salarioAniversario = parseFloat(document.getElementById("txtSalarioActual").value);
            vacTbl.salarioAniversario = vacDevenga.salarioAniversario;
            vacDevenga.razonesSociales_ID = razonSocialActual.id;
            vacDevenga.empleados_ID = empleado.id;
            vacDevenga.factorPrima = parseFloat(factorIntegracion[4]);
            vacTbl.factorPrima = vacDevenga.factorPrima;
            vacDevenga.diasVacaciones = parseInt(document.getElementById("txtDiasVac").value);
            vacDevenga.diasPrimaVaca = parseFloat(document.getElementById("txtDiasPrima").value);
            vacTbl.diasVacaciones = vacDevenga.diasVacaciones;
            vacTbl.diasPrimaVaca = vacDevenga.diasPrimaVaca;

            vacTbl.fechaAniversario = formatDateddmmyyy(fechaAniversario);

            arregletbl[arregletbl.length] = vacTbl;
        }


        if (arregletbl.length > 0) {
            clearTable("tblVacaAdd");
            llenarTablaGen("tblVacaAdd", arregletbl, 0, arregletbl.length);
            InitEventsTable();
        } else {
            clearTable("tblVacaAdd");
            InitEventsTable();
        }
    }

   

}

function calcularAntiguedadExacta(fechaInicial) {
    var fechaFinal = new Date();
    var fechaInicialMs, fechaFinalMs, diferencia;
    //  console.log(fechaInicial);
    fechaInicialMs = fechaInicial.getTime();
    fechaFinalMs = fechaFinal.getTime();
    diferencia = fechaFinalMs - fechaInicialMs;
    var dias, antiguedad;
    dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    antiguedad = dias / 365;

    return parseInt(antiguedad);
}

function construirDatosTable() {
  
    var obj = {};
    var lista = new Array();
    for (var i = 0; i < listaVacacionesDevengadas.length; i++) {
        var fechaAniversario = new Date(fechaIngresoEmpleado.getFullYear(), fechaIngresoEmpleado.getMonth(), fechaIngresoEmpleado.getDate());
        obj = {};
        obj.id = listaVacacionesDevengadas[i].id;
        obj.ejercicio = listaVacacionesDevengadas[i].ejercicio;
        fechaAniversario.setFullYear(fechaAniversario.getFullYear()+listaVacacionesDevengadas[i].ejercicio);
        obj.fechaAniversario = formatDateddmmyyy(fechaAniversario);
        obj.salarioAniversario = listaVacacionesDevengadas[i].salarioAniversario;
        obj.diasVacaciones = listaVacacionesDevengadas[i].diasVacaciones;
        obj.factorPrima = listaVacacionesDevengadas[i].factorPrima;
        obj.diasPrimaVaca = listaVacacionesDevengadas[i].diasPrimaVaca;

        lista[lista.length] = obj;
    }

    if (lista.length > 0) {
        clearTable("VacDeven");
        if (start === 0) {
            createEditPagination(lista.length, "tblVacDeven");
        }
        if (lista.length < rowsByPage) {
            end = lista.length;
        }

        llenarTablaGen("tblVacDeven", lista, start, end);
        InitEventsTable();
       
    } else {
        clearTable("VacDeven");
        InitEventsTable();
    }
}

function getFechaIngreso(empleadoID) {

    var url = route + "/api/HistorialVacaciones/getfechaIngreso";
    var dataToPost = JSON.stringify(empleadoID);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        return Mensaje.resultado;
    }
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

function getTablaDatosAntiguedad() {

    var controlador = "RazonesSociales" + razonSocialActual.clave;
    var url = route + "/api/HistorialVacaciones/getTablaDatosAntiguedad";
    var dataToPost = JSON.stringify(controlador);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        tablaFactorInt = Mensaje.resultado;
       
    }
}

function getSalarioIDEmpleadoIDReg(idempl, idreg, fecha) {
    var obj = {};
    obj.idEmpleado = idempl;
    obj.idRegistroPatronal = idreg;
    obj.fecha = fecha;
    var sueldo = 0.0;
    var url = route + "/api/ConfigVacaciones/getSalarioIDEmpleadoIDReg";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        sueldo = parseFloat(Mensaje.resultado);
    }
    return sueldo;
}

function getPlazaPorID(idPlaza) {

    var url = route + "/api/ConfigVacaciones/getPlazaPorID";
    var dataToPost = JSON.stringify(idPlaza);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        plazasPorEmpleado = Mensaje.resultado;
    }

}

function getVacacionesDevengadas(claveEmpleado, claveRazon) {
    var obj = {};
    obj.claveEmpleado = claveEmpleado;
    obj.claveRegistroPatronal = claveRazon;
    var url = route + "/api/ConfigVacaciones/getVacacionesPorEmpleadoDev";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        listaVacacionesDevengadas = Mensaje.resultado;
    }
}

function saveVacDeven() {
    var url = route + "/api/ConfigVacaciones/SaveDevengada";
    var dataToPost = JSON.stringify(vacDevenga);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        cancelar();
    } else {
        alert("Guardado Exitosamente");
        cancelar();
    }
}

function cancelar() {
    clearTable("tblVacaAdd");
    clearTable("VacDeven");
     plazaPorEmpleadoMov = null;
     empleado = null;
     fechaIngresoEmpleado;
     plazasPorEmpleado;
     listaVacacionesDevengadas = new Array();
    vacDevenga = {};
    document.getElementById("txtFechaIngreso").value = "";
    document.getElementById("txtSalarioActual").value = "";
   // document.getElementById("lblAño").style.display = "block";
    document.getElementById("lblAñoAgregar").innerText = idiomaSelecionado.messageFormatter("DevengadasTblDiasAdd")();
    document.getElementById("txtDiasVac").value = "";
    document.getElementById("txtDiasPrima").value = "";
    clearEdit("editEmpleado");
}

///metodos para la tabla
function editTableVacDeven() {

    var nameTable = "tblVacDeven";
    var nameCols = crearListaColumnas();
    var activaAdd = false;
    var activaDelete = false;
    var activarEditar = false;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete, activarEditar);
}

function crearListaColumnas() {
    var columnasTabla = new Array();
    columnasTabla.push({ "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblNoAnio")(), "nombreCompo": "NoAnio", "editable": false, "tipoCompon": "text", "persist": "ejercicio", "ancho": "35px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblAniversario")(), "nombreCompo": "fechaAniversario", "editable": false, "tipoCompon": "date", "persist": "fechaAniversario", "ancho": "60px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblSDAni")(), "nombreCompo": "SDAniv", "editable": false, "tipoCompon": "text", "persist": "salarioAniversario", "ancho": "50px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblDiaVac")(), "nombreCompo": "diasVac", "editable": false, "tipoCompon": "text", "persist": "diasVacaciones", "ancho": "50px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblPorPrimaVac")(), "nombreCompo": "PorcrtajePV", "editable": false, "tipoCompon": "text", "persist": "factorPrima", "ancho": "40px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblDiasPV")(), "nombreCompo": "DiasPV", "editable": false, "tipoCompon": "text", "persist": "diasPrimaVaca", "ancho": "50px", "funcion": "" }
        );

    return columnasTabla;
}

function editTabletblVacaAdd() {

    var nameTable = "tblVacaAdd";
    var nameCols = crearListaColumnas2();
    var activaAdd = false;
    var activaDelete = false;
    var activarEditar = false;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete, activarEditar);
}

function crearListaColumnas2() {
    var columnasTabla = new Array();
    columnasTabla.push({ "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblNoAnio")(), "nombreCompo": "NoAnio", "editable": false, "tipoCompon": "text", "persist": "ejercicio", "ancho": "35px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblAniversario")(), "nombreCompo": "fechaAniversario", "editable": false, "tipoCompon": "date", "persist": "fechaAniversario", "ancho": "60px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblSDAni")(), "nombreCompo": "SDAniv", "editable": false, "tipoCompon": "text", "persist": "salarioAniversario", "ancho": "50px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblDiaVac")(), "nombreCompo": "diasVac", "editable": false, "tipoCompon": "text", "persist": "diasVacaciones", "ancho": "50px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblPorPrimaVac")(), "nombreCompo": "PorcrtajePV", "editable": false, "tipoCompon": "text", "persist": "factorPrima", "ancho": "40px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("DevengadasTblDiasPV")(), "nombreCompo": "DiasPV", "editable": false, "tipoCompon": "text", "persist": "diasPrimaVaca", "ancho": "50px", "funcion": "" }
    );

    return columnasTabla;
}

function cambiarPagina(valores) {
    //alert(valores);
    var tbl = valores['origen'];
    end = rowsByPage;
    start = valores['fromPage'];
    if (modelVacaciones.length > rowsByPage) {
        var res = (rowsByPage + start) - modelVacaciones.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = modelVacaciones.length;
    }
    llenarTbl(start, end);
}

//end metodos