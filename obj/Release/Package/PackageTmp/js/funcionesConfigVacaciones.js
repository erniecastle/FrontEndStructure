var razonSocialActual;
var plazaPorEmpleadoMov = null;
var empleado=null;
var fechaIngresoEmpleado;
var ejercicio = 2020;
var fechaSistemasConfigVac;
var plazasPorEmpleado;
var sumaImportes;
var vacacionesDisfrutadas = new Array();
var vacacionesDevengadas = new Array();
var listaVacAplicacion = new Array();
var diasVacDevengasdas = 0;
var diasVacPrimaDevengadas = 0.0;
var permitirPagarPrimaVac = true;
var tipoNomina = {};
var periodoNomina = {};
var vacDis = null;
var listaeliminar = new Array();
var tablaFactorInt = null;
var listaVacaApliGlobal = new Array();
var activarFechaPrestaciones = false;
var activarTipoVacaciones = false;
var start = 0;
var end = 10;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    startCustomTools();
    OpenTable(document.getElementById('HistorialVaca'));
    OpenTable(document.getElementById('contBuscar'));
    InitEventsTable();
    
    document.getElementById("txtEjercicio").value = ejercicio;
    fechaSistemasConfigVac = getFechaSistema();
    var fecha = formatDate(fechaSistemasConfigVac);
    document.getElementById("dpkFechaSalida").value = fecha;
    document.getElementById("dpkFechaRegreso").value = fecha;
    document.getElementById("dpkFechaPago").value = fecha;
    if (!activarTipoVacaciones) {
        document.getElementById("rowTipoVacaciones").style.display="none";
    }

    if (!activarFechaPrestaciones) {
        document.getElementById("DivFechaPrestaciones").style.display = "none";
    }
    getRazonSocialActual();
    getALLtipoVacaciones();
    getTablaDatosAntiguedad();

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

function getALLtipoVacaciones() {

    var url = route + "/api/ConfigVacaciones/getTipoVacaciones";
    // var dataToPost = JSON.stringify(razon.id);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        for (var i = 0; i < Mensaje.resultado.length; i++) {
            $('#selTipoVacaciones').append('<option value=' + Mensaje.resultado[i]['id'] + '>' + Mensaje.resultado[i]['clave'] + "-" + Mensaje.resultado[i]['nombre'] + '</option>');
        }
        //console.log(Mensaje.resultado);
    }

    // return razonSocialActual;

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

function setEditEmpleado() {

    //Parameters
    nameCmp = "EditEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionadoCol.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombreAbre")();
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

    var camposWhereEsp;
    valoreswhereEsp = [razonSocialActual.clave, null, new Date(), new Date()];
  
    var optionals = { "queryEspecial": queryEspecial, "camposWhereEsp": camposWhereEsp, "valoreswhereEsp": valoreswhereEsp };

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
        document.getElementById("ckbPagarVacaciones").checked = true;
        document.getElementById("ckbPagarPrima").checked = true;
        //  console.log(plazaPorEmpleadoMov);
        document.getElementById("txtFechaIngreso").value = formatDatemmddyyy(new Date(fechaIngresoEmpleado));
        document.getElementById("txtFechaPrestaciones").value = formatDatemmddyyy(fechaIngresoEmpleado);
        //setEditObjectByID("editTipoNomina", plazaPorEmpleadoMov.tipoNomina_ID);
        buscaIDPerActual(plazaPorEmpleadoMov.tipoNomina_ID, fechaSistemasConfigVac, "PER");
        //setEditObjectByID("editPeriodoNomina", periodoNomina.id);
        getPlazaPorID(plazaPorEmpleadoMov.plazasPorEmpleado_ID);
        getSalarioIDEmpleadoIDReg(empleado.id, plazasPorEmpleado.registroPatronal_ID, fechaSistemasConfigVac);
        document.getElementById("txtSalarioActual").value = sumaImportes;
        vacacionesDisfrutadas = new Array();
        vacacionesDevengadas = new Array();
        listaVacAplicacion = new Array();
        diasVacDevengasdas = 0;
        diasVacPrimaDevengadas = 0.0;
        buscarVacaciones(empleado.clave, razonSocialActual.clave);

    }
}

function buscarVacaciones(claveEmpleado, claveRazon) {
    var obj = {};
    obj.claveEmpleado = claveEmpleado;
    obj.claveRegistroPatronal = claveRazon;
    getVacacionesPorEmpleadoDis(obj);
    getVacacionesPorEmpleadoDev(obj);
    getVacacionesPorEmpleadoApli(obj);
    for (var i = 0; i < vacacionesDevengadas.length; i++) {
        diasVacDevengasdas = diasVacDevengasdas + parseInt(vacacionesDevengadas[i].diasVacaciones);
        diasVacPrimaDevengadas = diasVacPrimaDevengadas + parseFloat(vacacionesDevengadas[i].diasPrimaVaca);
    }

    if (listaVacAplicacion.length > 0) {
        var diasDis = 0;
        var diasDisPrima = 0.0;
        var DiasPenPrima = 0.0;
        var DiasPen = 0;
        var va = {};

        for (var j = 0; j < listaVacAplicacion.length; j++) {
            if (listaVacAplicacion[j].id > 0) {
                diasDis = diasDis + parseInt(listaVacAplicacion[j].diasVac === null ? 0 : listaVacAplicacion[j].diasVac);
                diasDisPrima = diasDisPrima + parseFloat(listaVacAplicacion[j].diasPrima === null ? 0 : listaVacAplicacion[j].diasPrima);
            }
            ///modelo.addRow(va);pendiente de checar
        }

        DiasPen = diasVacDevengasdas - diasDis;
        diasDisPrima = diasVacPrimaDevengadas - diasDisPrima;
        document.getElementById("txtDiasPendientes").value = DiasPen;
        document.getElementById("txtDiasPendientesPrima").value = diasDisPrima;

    } else if (vacacionesDevengadas.length > 0) {
        document.getElementById("txtDiasPendientes").value = diasVacDevengasdas;
        document.getElementById("txtDiasPendientesPrima").value = diasVacPrimaDevengadas;
    } else {
        document.getElementById("txtDiasPendientes").value = 0;
        document.getElementById("txtDiasPendientesPrima").value = 0.0;
    }

    document.getElementById("txtDiasDisfrutar").value = document.getElementById("txtDiasPendientes").value;
    document.getElementById("txtDiasDisfrutarPrima").value = document.getElementById("txtDiasPendientesPrima").value;
    var a = new Date();
    a = new Date(fechaSistemasConfigVac.getFullYear(), fechaSistemasConfigVac.getMonth(), fechaSistemasConfigVac.getDate());
    if (parseInt(document.getElementById("txtDiasDisfrutar").value) > 0) {
        var dias = parseInt(document.getElementById("txtDiasDisfrutar").value);
        a.setDate(a.getDate() + dias);

        document.getElementById("dpkFechaRegreso").value = formatDate(a);
    }

    llenarTbl(start, end);

}

function llenarTbl(start,end) {
    var datosTabla = new Array();
    var obj = {};
    /// if (listaVacAplicacion.length > 0) {
    for (var i = 0; i < listaVacAplicacion.length; i++) {
        obj = {};
        obj.id = listaVacAplicacion[i].id;
        if (i === 0) {
            obj.ejercicio = listaVacAplicacion[i].vacacionesDevengadas.ejercicio;
        } else {
            if (listaVacAplicacion[i].vacacionesDevengadas.ejercicio === listaVacAplicacion[i - 1].vacacionesDevengadas.ejercicio) {
                obj.ejercicio = "";
            } else {
                obj.ejercicio = listaVacAplicacion[i].vacacionesDevengadas.ejercicio;
            }

        }

        if (i === 0) {
            var a = new Date(fechaIngresoEmpleado.getFullYear(), fechaIngresoEmpleado.getMonth(), fechaIngresoEmpleado.getDate());
            a.setFullYear(a.getFullYear() + listaVacAplicacion[i].vacacionesDevengadas.ejercicio);
            obj.fechaAniversario = formatDateddmmyyy(a);
        } else {
            if (listaVacAplicacion[i].vacacionesDevengadas.ejercicio === listaVacAplicacion[i - 1].vacacionesDevengadas.ejercicio) {
                obj.fechaAniversario = "";
            } else {
                var as = new Date(fechaIngresoEmpleado.getFullYear(), fechaIngresoEmpleado.getMonth(), fechaIngresoEmpleado.getDate());
                as.setFullYear(a.getFullYear() + listaVacAplicacion[i].vacacionesDevengadas.ejercicio);
                obj.fechaAniversario = formatDateddmmyyy(as);
            }
        }

        if (i === 0) {
            obj.salarioAniversario = listaVacAplicacion[i].vacacionesDevengadas.salarioAniversario;
        } else {
            if (listaVacAplicacion[i].vacacionesDevengadas.ejercicio === listaVacAplicacion[i - 1].vacacionesDevengadas.ejercicio) {
                obj.salarioAniversario = "";
            } else {
                obj.salarioAniversario = listaVacAplicacion[i].vacacionesDevengadas.salarioAniversario;
            }
        }


        if (i === 0) {
            obj.diasVacaciones = listaVacAplicacion[i].vacacionesDevengadas.diasVacaciones;
        } else {
            if (listaVacAplicacion[i].vacacionesDevengadas.ejercicio === listaVacAplicacion[i - 1].vacacionesDevengadas.ejercicio) {
                obj.diasVacaciones = "";
            } else {
                obj.diasVacaciones = listaVacAplicacion[i].vacacionesDevengadas.diasVacaciones;
            }
        }
        obj.salidaVacac = formatDateddmmyyy(new Date(listaVacAplicacion[i].vacacionesDisfrutadas.salidaVacac));

        obj.diasVacDisfrutados = listaVacAplicacion[i].diasVac;
        var diasDis = 0;
        var diasPen = 0;
        if (i === 0) {
            diasDis = parseInt(listaVacAplicacion[i].diasVac);
            diasPen = parseInt(listaVacAplicacion[i].vacacionesDevengadas.diasVacaciones) - diasDis;
            obj.diasPendientesVacaciones = diasPen;
        } else {
            if (listaVacAplicacion[i].vacacionesDevengadas.ejercicio === listaVacAplicacion[i - 1].vacacionesDevengadas.ejercicio) {
                diasDis = 0;
                for (var j = 0; j < listaVacAplicacion.length; j++) {
                    if (j <= i) {
                        diasDis = diasDis + parseInt(listaVacAplicacion[j].diasVac);
                    } else {
                        break;
                    }
                }
                diasPen = praseInt(listaVacAplicacion[i].vacacionesDevengadas.diasVacaciones) - diasDis;
                obj.diasPendientesVacaciones = diasPen;

            } else {
                diasDis = parseInt(listaVacAplicacion[i].diasVac);
                diasPen = parseInt(listaVacAplicacion[i].vacacionesDevengadas.diasVacaciones) - diasDis;
                obj.diasPendientesVacaciones = diasPen;
            }
        }

        if (i === 0) {
            obj.factorPrima = listaVacAplicacion[i].vacacionesDevengadas.factorPrima;
        } else {
            if (listaVacAplicacion[i].vacacionesDevengadas.ejercicio === listaVacAplicacion[i - 1].vacacionesDevengadas.ejercicio) {
                obj.factorPrima = "";
            } else {
                obj.factorPrima = listaVacAplicacion[i].vacacionesDevengadas.factorPrima;
            }
        }

        if (i === 0) {
            obj.diasPrimaVaca = listaVacAplicacion[i].vacacionesDevengadas.diasPrimaVaca;
        } else {
            if (listaVacAplicacion[i].vacacionesDevengadas.ejercicio === listaVacAplicacion[i - 1].vacacionesDevengadas.ejercicio) {
                obj.diasPrimaVaca = "";
            } else {
                obj.diasPrimaVaca = listaVacAplicacion[i].vacacionesDevengadas.diasPrimaVaca;
            }
        }

        obj.diasPrimaDisfrutados = listaVacAplicacion[i].diasPrima;

        var diasDisPrima = 0;
        var diasPenPrima = 0;
        if (i === 0) {
            diasDisPrima = parseInt(listaVacAplicacion[i].diasPrima);
            diasPenPrima = parseInt(listaVacAplicacion[i].vacacionesDevengadas.diasPrimaVaca) - diasDisPrima;
            obj.diasPendientePrimas = diasPenPrima;
        } else {
            if (listaVacAplicacion[i].vacacionesDevengadas.ejercicio === listaVacAplicacion[i - 1].vacacionesDevengadas.ejercicio) {
                diasDisPrima = 0;
                for (var l = 0; l < listaVacAplicacion.length; l++) {
                    if (l <= i) {
                        diasDisPrima = diasDis + parseInt(listaVacAplicacion[l].diasPrima);
                    } else {
                        break;
                    }
                }
                diasPenPrima = praseInt(listaVacAplicacion[i].vacacionesDevengadas.diasPrimaVaca) - diasDisPrima;
                obj.diasPendientePrimas = diasPenPrima;

            } else {
                diasDisPrima = parseInt(listaVacAplicacion[i].diasPrima);
                diasPenPrima = parseInt(listaVacAplicacion[i].vacacionesDevengadas.diasPrimaVaca) - diasDisPrima;
                obj.diasPendientePrimas = diasPenPrima;
            }
        }

        obj.tipoNominaAplicacion_ID = listaVacAplicacion[i].vacacionesDisfrutadas.tipoNominaPago.clave === null ? "" : listaVacAplicacion[i].vacacionesDisfrutadas.tipoNominaPago.clave;
        obj.periodoAplicacion_ID = listaVacAplicacion[i].vacacionesDisfrutadas.periodoPago.clave === null ? "" : listaVacAplicacion[i].vacacionesDisfrutadas.periodoPago.clave;
        obj.ejercicioAplicacion = listaVacAplicacion[i].vacacionesDisfrutadas.ejercicioAplicacion === null ? "" : listaVacAplicacion[i].vacacionesDisfrutadas.ejercicioAplicacion;
        obj.statusVacaciones = listaVacAplicacion[i].vacacionesDisfrutadas.statusVacaciones === null ? "" : listaVacAplicacion[i].vacacionesDisfrutadas.statusVacaciones === 0 ? "" :
            listaVacAplicacion[i].vacacionesDisfrutadas.statusVacaciones === 1 ? "Por calcular" : listaVacAplicacion[i].vacacionesDisfrutadas.statusVacaciones === 2 ? "Calculadas" : 
                listaVacAplicacion[i].vacacionesDisfrutadas.statusVacaciones === 3 ? "Timbradas" : " ";

        datosTabla[datosTabla.length] = obj;
    }
    if (datosTabla.length > 0) {
        clearTable("HistorialVaca");
//        clearTable("contTable");
        if (start === 0) {
            createEditPagination(datosTabla.length, "tblHistVaca");
        }
        if (datosTabla.length < rowsByPage) {
            end = datosTabla.length;
        }

        llenarTablaGen("tblHistVaca", datosTabla, start, end);
        InitEventsTable();
    } else {
        clearTable("HistorialVaca");
        InitEventsTable();
    }
    // }
}

function getVacacionesPorEmpleadoDis(obj) {
    var url = route + "/api/ConfigVacaciones/getVacacionesPorEmpleadoDis";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        vacacionesDisfrutadas = Mensaje.resultado;
    }
}

function getVacacionesPorEmpleadoDev(obj) {
    var url = route + "/api/ConfigVacaciones/getVacacionesPorEmpleadoDev";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        vacacionesDevengadas = Mensaje.resultado;
    }
}

function getVacacionesPorEmpleadoApli(obj) {
    var url = route + "/api/ConfigVacaciones/getVacacionesPorEmpleadoApli";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        listaVacAplicacion = Mensaje.resultado;
    }
}

function determinaSalario(plazasPorEmpleadosMov2) {
    var sueldo;
    if (plazasPorEmpleadosMov2.salarioPor === 2) {
        sueldo = plazasPorEmpleadosMov2.importe;
    } else {
        sueldo = plazasPorEmpleadosMov2.puestos.salarioTabular;
    }


    return sueldo;
}

//function setEditTipoNomina() {

//    //Parameters
//    nameCmp = "EditTipoNomina";
//    table = "TipoNomina";
//    nameCols = "Clave,Descripción,Periodicidad";
//    campos = "clave,descripcion,periodicidad.descripcion";//Quit ID;
//    camposObtener = "clave,descripcion,periodicidad.descripcion";
//    var subEntities = "periodicidad"; //Unnecesary
//    camposMostrar = ["clave", "descripcion"];

//    return buildParametersEditModal(nameCmp, table, nameCols, campos,
//        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
//        typeof preFilters === 'undefined' ? null : preFilters,
//        typeof filtersSearch === 'undefined' ? null : filtersSearch,
//        typeof camposObtener === 'undefined' ? null : camposObtener);
//}

//function setEditTipoNominaShow(value) {
//    if (value !== null) {
//        var obj = value[0];
//        claveTiponomina = obj.Clave;
//    }
//}

//function setEditPeriodoNomina() {

//    //Parameters
//    nameCmp = "EditPeriodoNomina";
//    table = "PeriodosNomina";
//    nameCols = "No. periodo ,Descripción,Año";
//    campos = "clave,descripcion,año";
//    camposObtener = "clave,descripcion,año,fechaAsistenciInicial,fechaAsistenciaFinal,status";
//    var subEntities = "tipoNomina,tipoCorrida";
//    camposMostrar = ["clave", "descripcion"];


//    var preFilters = { "tipoNomina.clave": claveTiponomina, "año": parseInt(document.getElementById("txtEjercicio").value), "tipoCorrida.clave": "PER" };

//    //var filtersSearch = [];
//    //filtersSearch[0] = { "etiqueta": "Clave de plaza", "tipo": "string", "campo": "clave", "medida": "s" };
//    //filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };

//    return buildParametersEditModal(nameCmp, table, nameCols, campos,
//        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
//        typeof preFilters === 'undefined' ? null : preFilters,
//        typeof filtersSearch === 'undefined' ? null : filtersSearch,
//        typeof camposObtener === 'undefined' ? null : camposObtener);
//}

//function setEditPeriodoNominaShow(value) {
//    if (value !== null) {
//        var obj = value[0];

//    }
//}


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

function getSalarioIDEmpleadoIDReg(idempl, idreg, fecha) {
    var obj = {};
    obj.idEmpleado = idempl;
    obj.idRegistroPatronal = idreg;
    obj.fecha = fecha;
    var url = route + "/api/ConfigVacaciones/getSalarioIDEmpleadoIDReg";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        sumaImportes = Mensaje.resultado;
    }

}

function fechaSalidaSel(value) {
    if (value.toString().length > 0) {
        document.getElementById("dpkFechaPago").value = value;
        var a = new Date(formantDdMmYyyy(value.toString()));
        var dias = parseInt(document.getElementById("txtDiasDisfrutar").value);
        if (dias > 0) {
            a.setDate(a.getDate() + dias);
            
        }
        document.getElementById("txtEjercicio").value = a.getFullYear();
        document.getElementById("dpkFechaRegreso").value = formatDate(a);

        if (plazaPorEmpleadoMov !== null) {
            buscaIDPerActual(plazaPorEmpleadoMov.tipoNomina_ID, fechaSistemasConfigVac, "PER");
            // setEditObjectByID("editPeriodoNomina", periodoNomina.id);
        }

        

    }
}

function cambiarDiasDis(event) {

    if (event.keyCode === 13 || event.keyCode === 9) {
        if (document.getElementById("txtDiasDisfrutar").value.toString().length > 0) {
            var diasPen = parseInt(document.getElementById("txtDiasPendientes").value);
            var diasDis = parseInt(document.getElementById("txtDiasDisfrutar").value);
            if (!permitirPagarPrimaVac) {
                var primaVacpor = 25.0 / 100.00;
                var diasPrimaDis = diasDis * primaVacpor;
                document.getElementById("txtDiasDisfrutarPrima").value = diasPrimaDis;

            }

            if (diasDis <= diasPen) {
                var dias = parseInt(diasDis);
                var a = new Date(formantDdMmYyyy(document.getElementById("dpkFechaSalida").value.toString()));
                a.setDate(a.getDate() + dias);
                document.getElementById("txtEjercicio").value = a.getFullYear();
                document.getElementById("dpkFechaRegreso").value = formatDate(a);
            } else {
                alert("Los días a disfrutar no pueden ser mayor a los días pendientes ");
                document.getElementById("txtDiasDisfrutar").value = document.getElementById("txtDiasPendientes").value;
            }

        }
    }

}

function cancelar() {

    plazaPorEmpleadoMov = null;
    empleado = null;
    fechaIngresoEmpleado = null;
    periodoNomina = {};
    plazasPorEmpleado = null;
    sumaImportes = null;
    vacacionesDisfrutadas = new Array();
    vacacionesDevengadas = new Array();
    listaVacAplicacion = new Array();
    diasVacDevengasdas = 0;
    diasVacPrimaDevengadas = 0.0;

    var fecha = formatDate(fechaSistemasConfigVac);
    document.getElementById("dpkFechaRegreso").value = fecha;
    document.getElementById("dpkFechaSalida").value = fecha;
    document.getElementById("dpkFechaPago").value = fecha;
    clearEdit("editEmpleado");
    document.getElementById("txtSalarioActual").value = "";
    document.getElementById("txtFechaIngreso").value = "";
    document.getElementById("txtFechaPrestaciones").value = "";
    document.getElementById("ckbPagarVacaciones").checked = false;
    document.getElementById("ckbPagarPrima").checked = false;
    document.getElementById("txtDiasPendientes").value = "";
    document.getElementById("txtDiasDisfrutar").value = "";
    document.getElementById("txtDiasPendientesPrima").value = "";
    document.getElementById("txtDiasDisfrutarPrima").value = "";
    document.getElementById("txtObservaciones").value = "";
    document.getElementById("txtEjercicio").value = ejercicio;
    document.getElementById("ckbCambiarFechaPago").checked = false;
    document.getElementById("selTipoVacaciones").value = "";

    start = 0;
    end = 10;
    llenarTbl();
    buscar(false);
}

function buscaIDPerActual(claveTipoNomina, fecha, claveTipoCorrida) {
    var obj = {};
    obj.claveTiponomina = claveTipoNomina;
    obj.claveTipoCorrida = claveTipoCorrida;
    obj.fecha = formatDateddmmyyy(fecha);
    var url = route + "/api/ConfigVacaciones/buscaPerActual";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        periodoNomina = Mensaje.resultado;
    }

}

function guardar() {
    if (validacionPersonalizada()) {
        var vac = construyeVacaciones();
        var listGuardar = new Array();
        //var vac2;

        if (listaVacAplicacion.length === 0) {
            listGuardar =  guardarVacacionesAplicacionDev(vac);
        } else {
            listGuardar=  guardarVacacionesAplicacion(vac);
        }
        for (var i = 0; i < listGuardar.length; i++) {
            if (!parseInt(listGuardar[i].id)) {
                listGuardar[i].id = 0;
            }
        }

        var obj = {};
        obj.saveOrUpdate = listGuardar;

        if (listaeliminar.length > 0) {
            obj.delete = listaeliminar;
        }
        var url = route + "/api/ConfigVacaciones/SaveOrUpdate";
        var dataToPost = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado !== null) {
            alert("Guardado Exitosamente");
            cancelar();
        } else {
            alert(Mensaje.error);
            cancelar();
        }

       
    }
}

function AddVacacionDevengada() {
    if (empleado !== null) {
        if (tablaFactorInt !== null) {
            var va = {};
            var opcion = confirm("desea a agregar una devengada antes de su aniversario");
            if (opcion) {
                var primaVacpor = 0.0;
                if (vacacionesDevengadas.length > 0) {
                    var ejercicio = vacacionesDevengadas[vacacionesDevengadas.length - 1].ejercicio + 1;
                    va.ejercicio = ejercicio;
                    for (var i = 0; i < tablaFactorInt[1].length; i++) {
                        var factorIntegreacionXML = tablaFactorInt[1][i];
                        if (ejercicio === parseInt(tablaFactorInt[1][i])) {
                            va.factorPrima = factorIntegreacionXML[4];
                            va.diasVacaciones = factorIntegreacionXML[3];
                            break;
                        } else if (ejercicio < parseInt(tablaFactorInt[1][i])) {
                            va.factorPrima = factorIntegreacionXML[4];
                            va.diasVacaciones = factorIntegreacionXML[3];
                            break;

                        } else if (i === tablaFactorInt[1].length - 1 && ejercicio > parseInt(tablaFactorInt[1][i])) {
                            va.factorPrima = factorIntegreacionXML[4];
                            va.diasVacaciones = factorIntegreacionXML[3];
                            break;
                        }
                    }
                    va.salarioAniversario = parseFloat(document.getElementById("txtSalarioActual").value);
                    primaVacpor = parseFloat(va.factorPrima) / 100.00;
                    va.diasPrimaVaca = primaVacpor * va.diasVacaciones;
                    va.registroInicial = false;
                    va.razonesSociales_ID = razonSocialActual.id;
                    va.empleados_ID = empleado.id;
                } else {
                    va.ejercicio = 1;
                    var factor = tablaFactorInt[1][0];
                    va.factorPrima = factor[4];
                    va.diasVacaciones = factor[3];
                    va.salarioAniversario = parseFloat(document.getElementById("txtSalarioActual").value);
                    primaVacpor = parseFloat(va.factorPrima) / 100.00;
                    va.diasPrimaVaca = primaVacpor * va.diasVacaciones;
                    va.registroInicial = false;
                    va.razonesSociales_ID = razonSocialActual.id;
                    va.empleados_ID = empleado.id;
                       
                    

                }
                var url = route + "/api/ConfigVacaciones/SaveDevengada";
                var dataToPost = JSON.stringify(va);
                var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
                if (Mensaje.resultado === null) {
                    alert("No object");
                } else {
                    alert("Guardado Exitosamente");
                }
            }

            

        } else {
            alert("No encontro la tabla factor de integracion");
        }
    } else {
        alert("selecione un empleado");
    }
}

function guardarVacacionesAplicacionDev(vac2) {
    var diasVac = 0;
    var diasVacPrima = 0.0;
    var diasTotalPrima = 0.0;
    var diasTotal = 0;
    var diasPrimaDis = vac2.diasPrimaDisfrutados;
    var vAplicacion = {};
    var i;
    var listaGuardarVac = new Array();
    var vacAplicacion = {};

    if (diasVacDevengasdas === vac2.diasVacDisfrutados && diasVacPrimaDevengadas === diasPrimaDis) {
        for (i = 0; i < vacacionesDevengadas.length; i++) {
            vacAplicacion = {};
            vacAplicacion.id = "id" + randomString(2, '0123456789');
            if (document.getElementById("ckbPagarVacaciones").checked || !permitirPagarPrimaVac) {
                vacAplicacion.diasVac = parseInt(vacacionesDevengadas[i].diasVacaciones);
            } else {
                vacAplicacion.diasVac = 0;
            }
            if (document.getElementById("ckbPagarPrima").checked || !permitirPagarPrimaVac) {
                vacAplicacion.diasPrima = parseFloat(vacacionesDevengadas[i].diasPrimaVaca);
            } else {
                vacAplicacion.diasPrima = 0.0;
            }

            vacAplicacion.vacacionesDevengadas_ID = vacacionesDevengadas[i].id;
            vacAplicacion.vacacionesDisfrutadas = vac2;

            listaGuardarVac[listaGuardarVac.length] = vacAplicacion;

        }
    } else if (diasVacDevengasdas !== vac2.diasVacDisfrutados && diasVacPrimaDevengadas === diasPrimaDis) {
        diasVac = diasVacDevengasdas - vac2.diasVacDisfrutados;
         diasTotal = 0;
        for (i = 0; i < vacacionesDevengadas.length; i++) {
            vacAplicacion = {};
            vacAplicacion.id = "id" + randomString(2, '0123456789');
            if (document.getElementById("ckbPagarVacaciones").checked || !permitirPagarPrimaVac) {
                if (diasTotal !== vac2.diasVacDisfrutados) {
                    if (vAplicacion.id !== "" && vAplicacion.id !== undefined) {
                        var dias1 = vac2.diasVacDisfrutados - parseInt(vAplicacion.diasVac);
                        diasTotal = diasTotal + dias1;
                        vacAplicacion.diasVac = dias1;
                    } else {
                        if (vac2.diasVacDisfrutados < parseInt(vacacionesDevengadas[i].diasVacaciones)) {

                            diasTotal = parseInt(vac2.diasVacDisfrutados);
                            vacAplicacion.diasVac = parseInt(vac2.diasVacDisfrutados);
                        } else {
                            diasTotal = parseInt(vacacionesDevengadas[i].diasVacaciones);
                            vacAplicacion.diasVac = parseInt(vacacionesDevengadas[i].diasVacaciones);
                        }
                    }
                }
            } else {
                vacAplicacion.diasVac = 0;
            }

            if (document.getElementById("ckbPagarPrima").checked || !permitirPagarPrimaVac) {
                vacAplicacion.diasPrima = parseFloat(vacacionesDevengadas[i].diasPrimaVaca);
            } else {
                vacAplicacion.diasPrima = 0.0;
            }


            vacAplicacion.vacacionesDevengadas_ID = vacacionesDevengadas[i].id;
            vacAplicacion.vacacionesDisfrutadas = vac2;
            vAplicacion = vacAplicacion;
            listaGuardarVac[listaGuardarVac.length] = vacAplicacion;

        }
    } else if (diasVacDevengasdas === vac2.diasVacDisfrutados && diasVacPrimaDevengadas > diasPrimaDis) {
        diasVacPrima = diasVacPrimaDevengadas - vac2.diasPrimaDisfrutados;
         diasTotalPrima = 0;
        for (i = 0; i < vacacionesDevengadas.length; i++) {
            vacAplicacion = {};
            vacAplicacion.id = "id" + randomString(2, '0123456789');
            if (document.getElementById("ckbPagarPrima").checked || !permitirPagarPrimaVac) {
                if (vAplicacion.id !== "" && vAplicacion.id !== undefined) {
                    var dias2 = vac2.diasPrimaDisfrutados - vAplicacion.diasPrima;
                    diasTotalPrima = diasTotalPrima + dias2;
                    vacAplicacion.diasPrima = dias2;
                } else {
                    if (vac2.diasPrimaDisfrutados < parseFloat(vacacionesDevengadas[i].diasPrimaVaca)) {
                        diasTotalPrima = vac2.diasPrimaDisfrutados;
                        vacAplicacion.diasPrima = vac2.diasPrimaDisfrutados;
                    } else {
                        diasTotalPrima = parseFloat(vacacionesDevengadas[i].diasPrimaVaca);
                        vacAplicacion.diasPrima = parseFloat(vacacionesDevengadas[i].diasPrimaVaca);
                    }
                }
            } else {
                vacAplicacion.diasPrima = 0.0;
            }

            if (document.getElementById("ckbPagarVacaciones").checked || !permitirPagarPrimaVac) {
                vacAplicacion.diasVac = parseInt(vacacionesDevengadas[i].diasVacaciones);
            } else {
                vacAplicacion.diasVac = 0;
            }


            vacAplicacion.vacacionesDevengadas_ID = vacacionesDevengadas[i].id;
            vacAplicacion.vacacionesDisfrutadas = vac2;
            vAplicacion = vacAplicacion;
            listaGuardarVac[listaGuardarVac.length] = vacAplicacion;

        }
    } else {
        diasVacPrima = diasVacPrimaDevengadas - vac2.diasPrimaDisfrutados;
         diasTotalPrima = 0.0;
        diasVac = diasVacDevengasdas - vac2.diasVacDisfrutados;
        diasTotal = 0;
        for (i = 0; i < vacacionesDevengadas.length; i++) {
            vacAplicacion = {};
            vacAplicacion.id = "id" + randomString(2, '0123456789');
            if (diasTotalPrima !== parseFloat(vac2.diasPrimaDisfrutados) || diasTotal !== parseInt(vac2.diasVacDisfrutados)) {
                if (document.getElementById("ckbPagarPrima").checked || !permitirPagarPrimaVac) {
                    if (vAplicacion.id !== "" && vAplicacion.id !== undefined) {
                        var dias3 = vac2.diasPrimaDisfrutados - vAplicacion.diasPrima;
                        diasTotalPrima = diasTotalPrima + dias3;
                        vacAplicacion.diasPrima = dias3;
                    } else {
                        if (vac2.diasPrimaDisfrutados < parseFloat(vacacionesDevengadas[i].diasPrimaVaca)) {
                            diasTotalPrima = vac2.diasPrimaDisfrutados;
                            vacAplicacion.diasPrima = vac2.diasPrimaDisfrutados;
                        } else {
                            diasTotalPrima = parseFloat(vacacionesDevengadas[i].diasPrimaVaca);
                            vacAplicacion.diasPrima = parseFloat(vacacionesDevengadas[i].diasPrimaVaca);
                        }
                    }
                } else {
                    vacAplicacion.diasPrima = 0.0;
                }


                if (document.getElementById("ckbPagarVacaciones").checked || !permitirPagarPrimaVac) {
                   // if (diasTotal !== vac2.diasVacDisfrutados) {
                    if (vAplicacion.id !== "" && vAplicacion.id !== undefined) {
                            var dias4 = vac2.diasVacDisfrutados - parseInt(vAplicacion.diasVac);
                            diasTotal = diasTotal + dias4;
                            vacAplicacion.diasVac = dias4;
                        } else {
                            if (vac2.diasVacDisfrutados < parseInt(vacacionesDevengadas[i].diasVacaciones)) {

                                diasTotal = parseInt(vac2.diasVacDisfrutados);
                                vacAplicacion.diasVac = parseInt(vac2.diasVacDisfrutados);
                            } else {
                                diasTotal = parseInt(vacacionesDevengadas[i].diasVacaciones);
                                vacAplicacion.diasVac = parseInt(vacacionesDevengadas[i].diasVacaciones);
                            }
                        }
                   // }
                } else {
                    vacAplicacion.diasVac = 0;
                }


                vacAplicacion.vacacionesDevengadas_ID = vacacionesDevengadas[i].id;
                vacAplicacion.vacacionesDisfrutadas = vac2;
                vAplicacion = vacAplicacion;
                listaGuardarVac[listaGuardarVac.length] = vacAplicacion;

            }
        }

    }

    return listaGuardarVac;

}

function guardarVacacionesAplicacion(vac2) {
    var listaGuardarVac = new Array();
    var diasVacDisApli = 0;
    var diasTotales = 0;
    var diasVacPrimAplic = 0.0;
    var diasTotalPrima = 0.0;
    var vacAplicacion = {};
    var vAplicacion = {};
    for (var i = 0; i < vacacionesDevengadas.length; i++) {
        vacAplicacion = {};
        vacAplicacion.id = "id" + randomString(2, '0123456789');
        for (var j = 0; j < listaVacAplicacion.length; j++) {
            if (parseInt(vacacionesDevengadas.ejercicio) === parseInt(listaVacAplicacion[j].vacacionesDevengadas.ejercicio)) {
                diasVacDisApli = diasVacDisApli + parseInt(listaVacAplicacion[j].diasVac);
                diasVacPrimAplic = diasVacPrimAplic + parseFloat(listaVacAplicacion[j].diasPrima);
            }
        }

        if (diasVacDisApli !== parseInt(vacacionesDevengadas[i].diasVacaciones) && diasVacPrimAplic !== parseFloat(vacacionesDevengadas[i].diasPrimaVaca)) {
            if (diasTotales !== parseInt(vac2.diasVacDisfrutados || diasTotalPrima !== parseFloat(vac2.diasPrimaDisfrutados))) {
                if (document.getElementById("ckbPagarVacaciones").checked || !permitirPagarPrimaVac) {
                    if (vAplicacion.id !== "" && vAplicacion.id !== undefined) {
                        var dias4 = vac2.diasVacDisfrutados - parseInt(vAplicacion.diasVac);
                        diasTotal = diasTotal + dias4;
                        vacAplicacion.diasVac = dias4;
                    } else {
                        if (diasVacDisApli < parseInt(vacacionesDevengadas[i].diasVacaciones)) {
                            var dias = 0;

                            if (diasVacDisApli === 0) {
                                dias = parseInt(vac2.diasVacDisfrutados);
                            } else {
                                dias = parseInt(vacacionesDevengadas[i].diasVacaciones) - diasVacDisApli;
                                if (dias !== parseInt(vac2.diasVacaciones)) {
                                    dias = parseInt(vacacionesDevengadas[i].diasVacaciones) - dias;
                                }
                            }

                            diasTotales = diasTotales + dias;
                            vacAplicacion.diasVac = dias;

                        } else {
                            diasVacDisApli = 0;
                        }
                    }
                } else {
                    vacAplicacion.diasVac = 0;
                }
            }

            if (document.getElementById("ckbPagarPrima").checked || !permitirPagarPrimaVac) {
                if (vAplicacion.id !== "" && vAplicacion.id !== undefined) {
                    var diasPrimal = parseFloat(vac2.diasPrimaDisfrutados) - parseFloat(vAplicacion.diasPrima);
                    diasTotalPrima = diasTotalPrima + diasPrimal;
                    vacAplicacion.diasPrima = diasPrimal;
                } else {
                    if (parseFloat(vacacionesDevengadas[i].diasPrimaVaca) > diasVacPrimAplic) {
                        var diasPrima = 0.0;
                        if (diasVacPrimAplic > parseFloat(0.5)) {
                            diasPrima = parseFloat(vacacionesDevengadas[i].diasPrimaVaca) - diasVacPrimAplic;
                            if (diasPrima !== parseFloat(0.0)) {
                                diasPrima = diasPrima - parseFloat(vac.diasPrimaDisfrutados);
                            }
                        } else if (diasVacPrimAplic === parseFloat(0.0)) {
                            diasPrima = parseFloat(vac2.diasPrimaDisfrutados);
                        } else {
                            diasPrima = diasVacPrimAplic;
                        }

                        diasTotalPrima = diasTotalPrima + diasPrima;
                        vacAplicacion.diasPrima=diasPrima;
                        diasVacPrimAplic = 0.0;
                    }
                }
                vacAplicacion.vacacionesDevengadas_ID(vacacionesDevengadas[i].id);
                vacAplicacion.vacacionesDisfrutadas(vac2);
            } else {
                vacAplicacion.vacacionesDevengadas_ID(vacacionesDevengadas[i].id);
                vacAplicacion.vacacionesDisfrutadas(vac2);
                vacAplicacion.diasPrima=0.0;
            }


        } else {
            diasVacDisApli = 0;
            diasVacPrimAplic = 0.0;
        }
        vAplicacion = vacAplicacion;
        listaGuardarVac[listaGuardarVac.length] = vacAplicacion;
    }
    return listaGuardarVac;
}

    function validacionPersonalizada() {
        var b = true;
        if (!document.getElementById("ckbPagarVacaciones").checked && !document.getElementById("ckbPagarPrima").checked) {
            alert("Seleccione vacaciones, prima vacacional o ambas");
            b = false;
        }

        if ((document.getElementById("txtDiasPendientes").value === "" || document.getElementById("txtDiasPendientes").value === "0") && (document.getElementById("txtDiasPendientesPrima").value === "" || document.getElementById("txtDiasPendientesPrima").value === "0")) {
            alert("El empleado no tiene días pendientes de vacaciones y prima vacacional");
            b = false;
        }

        return b;

    }

    function construyeVacaciones() {
        var rv = null;


        if (vacDis !== null) {
            for (var i = 0; i < listaVacAplicacion.length; i++) {
                if (listaVacAplicacion[i].vacacionesDisfrutadas.id === vacDis.id) {
                    listaeliminar[listaeliminar.length] = listaVacAplicacion[i];
                    listaVacAplicacion.splice(i, 1);
                }
            }
        }

        rv = {};
        rv.razonesSociales_ID = razonSocialActual.id;
        rv.empleados_ID = empleado.id;
        rv.pagarVacaciones = document.getElementById("ckbPagarVacaciones").checked;
        rv.pagarPrimaVacacional = document.getElementById("ckbPagarPrima").checked;
        if (document.getElementById("ckbPagarVacaciones").checked) {
            rv.salidaVacac = formatDateddmmyyy(new Date(formantDdMmYyyy(document.getElementById("dpkFechaSalida").value.toString())));
            rv.diasVacDisfrutados = parseInt(document.getElementById("txtDiasDisfrutar").value);
            rv.regresoVac = formatDateddmmyyy(new Date(formantDdMmYyyy(document.getElementById("dpkFechaRegreso").value.toString())));
            if (activarTipoVacaciones) {
                rv.tiposVacaciones_ID = document.getElementById("selTipoVacaciones").value;
            }
        } else {
            rv.diasVacDisfrutados = 0;
            rv.regresoVac = formatDateddmmyyy(new Date(formantDdMmYyyy(document.getElementById("dpkFechaRegreso").value.toString())));
            if (activarTipoVacaciones) {
                rv.tiposVacaciones_ID = document.getElementById("selTipoVacaciones").value;
            }
            rv.salidaVacac = formatDateddmmyyy(new Date(formantDdMmYyyy(document.getElementById("dpkFechaSalida").value.toString())));
        }
        rv.tipoNominaAplicacion_ID = plazaPorEmpleadoMov.tipoNomina_ID;
        rv.diasPrimaDisfrutados = parseFloat(document.getElementById("txtDiasDisfrutarPrima").value);
        rv.fechaPago = formatDateddmmyyy(new Date(formantDdMmYyyy(document.getElementById("dpkFechaPago").value.toString())));
        rv.observaciones = document.getElementById("txtObservaciones").value;
        rv.periodoAplicacion_ID = periodoNomina.id;
        rv.tipoCorridaAplicacion_ID = periodoNomina.tipoCorrida_ID;
        rv.ejercicioAplicacion = parseInt(document.getElementById("txtEjercicio").value);
        rv.statusVacaciones = 1;
        rv.registroInicial = false;

        return rv;
    }

    ///metodos para la tabla
    function editTableConfigVacaHist() {

        var nameTable = "tblHistVaca";
        var nameCols = crearListaColumnas();
        var activaAdd = false;
        var activaDelete = false;
        var activarEditar = false;

        return buildTableTools(nameTable, nameCols, activaAdd, activaDelete, activarEditar);
    }

    function crearListaColumnas() {
        var columnasTabla = new Array();
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblNumAnio")(), "nombreCompo": "NoAnio", "editable": false, "tipoCompon": "text", "persist": "ejercicio", "ancho": "35px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblAniversario")(), "nombreCompo": "fechaAniversario", "editable": false, "tipoCompon": "date", "persist": "fechaAniversario", "ancho": "60px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblSDAniv")(), "nombreCompo": "SDAniv", "editable": false, "tipoCompon": "text", "persist": "salarioAniversario", "ancho": "50px", "funcion": "sueldoAniver" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblDiasVac")(), "nombreCompo": "diasVac", "editable": false, "tipoCompon": "text", "persist": "diasVacaciones", "ancho": "50px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblSalidaVac")(), "nombreCompo": "Salidavac", "editable": false, "tipoCompon": "date", "persist": "salidaVacac", "ancho": "50px", "funcion": "validaFecha" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblDisfrutados")(), "nombreCompo": "DisfrutadosVac", "editable": false, "tipoCompon": "text", "persist": "diasVacDisfrutados", "ancho": "50px", "funcion": "diasPendiente" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblPendientes")(), "nombreCompo": "PendientesVac", "editable": false, "tipoCompon": "text", "persist": "diasPendientesVacaciones", "ancho": "50px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblPV")(), "nombreCompo": "PorcrtajePV", "editable": false, "tipoCompon": "text", "persist": "factorPrima", "ancho": "40px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblDiasPV")(), "nombreCompo": "DiasPV", "editable": false, "tipoCompon": "text", "persist": "diasPrimaVaca", "ancho": "50px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblDisfrutados")(), "nombreCompo": "DisfrutadosPV", "editable": false, "tipoCompon": "text", "persist": "diasPrimaDisfrutados", "ancho": "50px", "funcion": "diasPendientePrima" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblPendientes")(), "nombreCompo": "PendientesPV", "editable": false, "tipoCompon": "text", "persist": "diasPendientePrimas", "ancho": "50px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblNom")(), "nombreCompo": "tipoNom", "editable": false, "tipoCompon": "text", "persist": "tipoNominaAplicacion_ID", "ancho": "50px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblPer")(), "nombreCompo": "noPer", "editable": false, "tipoCompon": "text", "persist": "periodoAplicacion_ID", "ancho": "50px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblAnio")(), "nombreCompo": "anioNom", "editable": false, "tipoCompon": "text", "persist": "ejercicioAplicacion", "ancho": "50px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblStatus")(), "nombreCompo": "status", "editable": false, "tipoCompon": "text", "persist": "statusVacaciones", "ancho": "150px", "funcion": "" });

        return columnasTabla;
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




        } else {
            var tbl = document.getElementById(valores[1]);
            var totalReg = tbl.childNodes.length;
            trUltimo = tbl.lastElementChild;
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


            AgregarVac();


        }
        //if (exito) {

        //    var $clone = $('#' + valores[0]).find('tr.hide').clone(true).removeClass('hide table-line');
        //    $clone[0].setAttribute("class", "hidetd");
        //    $clone.className = "hidetd";
        //    // $clone.id = rString;
        //    var edit = $clone[0].querySelectorAll(".edit");
        //    if (edit) {
        //        for (var i = 0; i < edit.length; i++) {
        //            edit[i].removeAttribute("value");
        //            edit[i].querySelector(".editKey").value = "";
        //        }
        //    }


        //    $('#' + valores[1]).append($clone);
        //}
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
                // console.log(tr.cells[i].getAttribute('persist'), "-", tr.cells[i].innerText);
            } else if (tr.cells[i].getAttribute('persist') === "numeroCredito") {
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
            }
        }

        if (tr.id === "") {
            var rString = "id" + randomString(2, '0123456789');
            obj['id'] = rString;
            tr.id = obj.id;
            //agregarCreditoEmpleado(obj);
        } else {
            obj['id'] = tr.id;
            //actualizarCreditoEmpleado(obj);
        }

    }

    function tableRemove(registro) {

        //if (parseInt(id)) {
        //    for (var i = 0; i < dataRegAhorro.length; i++) {
        //        if (dataRegAhorro[i].id === parseInt(id)) {
        //            dataRegAhorro.splice(i, 1);
        //            break;
        //        }
        //    }
        //    //for (var i = 0; i < listaAsistNuevosYMod.length; i++) {
        //    //    if (listaAsistNuevosYMod[i].id === parseInt(id)) {
        //    //        listaAsistNuevosYMod.splice(i, 1);
        //    //        break;
        //    //    }
        //    //}
        //    deleteAhorro[deleteAhorro.length] = parseInt(id);

        //} else {
        //    for (var j = 0; j < dataRegAhorro.length; j++) {
        //        if (dataRegAhorro[j].id === id) {
        //            dataRegAhorro.splice(j, 1);
        //            break;
        //        }
        //    }
        //}


        //  alert("eliminado" + ".- " + name.id);
    }

    function editarTable(registro) {
        //idSelecionado = registro.id;
        //ConstruirModificarPer();
    }

    function prevalidacionColumna(valores) {

        //var columnas = valores[1];
        //var renglon = valores[0];
        //if (columnas.getAttribute("persist") === "creditoPorEmpleado_ID") {
        //    var clave = renglon.cells[0].innerText;
        //    if (clave !== "") {
        //        claveEmpleado = clave;
        //    } else {
        //        //renglon.cells[0].focus();
        //        // alert("selecione un empelado");
        //    }
        //}

}

function cambiarPagina(valores) {
    //alert(valores);
      var tbl = valores['origen'];
    end = rowsByPage;
    start = valores['fromPage'];
    if (listaVacAplicacion.length > rowsByPage) {
        var res = (rowsByPage + start) - listaVacAplicacion.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = listaVacAplicacion.length;
    }
    llenarTbl(start, end);
}

function selecionarRegistro(registro) {
    console.log(registro);
    var id = parseInt(registro.id);
    var VacApl = {};
    for (var i = 0; i < listaVacaApliGlobal.length; i++) {
        if (id === parseInt(listaVacaApliGlobal[i].id)) {
            VacApl = listaVacaApliGlobal[i];
            ObtenerVacacionesDisfruradasMaximaJS(listaVacaApliGlobal[i].vacacionesDisfrutadas.empleados_ID, razonSocialActual.clave);
        
            break;
        }
    }

    if (vacDis !== null) {
        if (parseInt(vacDis.id) === VacApl.vacacionesDisfrutadas_ID) {
            MostrarObjecto(VacApl);
            buscar(false);
        } else {
            alert("Solo se puede modificar la última salida de vacaciones");
        }
    }
}

function MostrarObjecto(VacApl) {
    var dias = 0;
    var diasPrima = 0.0;
    var diasVacDev = 0;
    var diasPrimaDev = 0.0;
    setEditObject("editEmpleado", VacApl.vacacionesDisfrutadas.empleados.clave);
    document.getElementById("txtDiasDisfrutar").value = VacApl.vacacionesDisfrutadas.diasVacDisfrutados;
    document.getElementById("txtDiasDisfrutarPrima").value = VacApl.vacacionesDisfrutadas.diasPrimaDisfrutados;
    document.getElementById("selTipoVacaciones").value = VacApl.vacacionesDisfrutadas.tiposVacaciones_ID;
    document.getElementById("txtObservaciones").value = VacApl.vacacionesDisfrutadas.observaciones;
    document.getElementById("ckbPagarVacaciones").checked = VacApl.vacacionesDisfrutadas.pagarVacaciones;
    document.getElementById("ckbPagarPrima").checked = VacApl.vacacionesDisfrutadas.pagarPrimaVacacional;

    document.getElementById("dpkFechaPago").value = formatDate(new Date(VacApl.vacacionesDisfrutadas.fechaPago));
    document.getElementById("dpkFechaRegreso").value = formatDate(new Date(VacApl.vacacionesDisfrutadas.regresoVac));
    document.getElementById("dpkFechaSalida").value = formatDate(new Date(VacApl.vacacionesDisfrutadas.salidaVacac));

    for (var i = 0; i < listaVacAplicacion.length; i++) {
        if (parseInt(listaVacAplicacion[i].vacacionesDisfrutadas.id) !== VacApl.vacacionesDisfrutadas.id) {
            dias = dias + parseInt(listaVacAplicacion[i].diasVac);
            diasPrima = diasPrima + parseFloat(listaVacAplicacion[i].diasPrima);
        } else {
            break;
        }
    }

    for (var j = 0; j < vacacionesDevengadas.length; j++) {
        diasVacDev = diasVacDev + parseInt(vacacionesDevengadas[i].diasVacaciones);
        diasPrimaDev = diasPrimaDev + parseFloat(vacacionesDevengadas[i].diasPrimaVaca);
    }
    document.getElementById("txtDiasPendientes").value = diasVacDev - dias;
    document.getElementById("txtDiasPendientesPrima").value = diasPrimaDev - diasPrima;
}

function ObtenerVacacionesDisfruradasMaximaJS(idEmpleado, claveRazon) {
    var obj = {};
    obj.idEmpleado = idEmpleado;
    obj.claveRazon = claveRazon;
    var url = route + "/api/ConfigVacaciones/ObtenerVacacionesDisfruradasMaximaJS";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {

        vacDis = Mensaje.resultado;
    }

}
    //end metodos

/*Table selector*/

function editTableConfigVacaHistBuscar() {

    var nameTable = "tblbuscar";
    var nameCols = crearListaColumnasbuscar();
    var activaAdd = false;
    var activaDelete = false;
    var activarEditar = false;
    var selecionar = true;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete, activarEditar, selecionar);
}

function crearListaColumnasbuscar() {
    var columnasTabla = new Array();
    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("EmpleadosClave")(), "nombreCompo": "clave", "editable": false, "tipoCompon": "text", "persist": "clave", "ancho": "35px", "funcion": "" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")(), "nombreCompo": "nombreEmpleado", "editable": false, "tipoCompon": "date", "persist": "nombreEmpleado", "ancho": "60px", "funcion": "" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesFechaSalida")(), "nombreCompo": "salida", "editable": false, "tipoCompon": "text", "persist": "salida", "ancho": "50px", "funcion": "" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesFechaRegreso")(), "nombreCompo": "regreso", "editable": false, "tipoCompon": "text", "persist": "regreso", "ancho": "50px", "funcion": "" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblDiasVac")(), "nombreCompo": "diasVac", "editable": false, "tipoCompon": "date", "persist": "diasVac", "ancho": "50px", "funcion": "" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ProgramacionVacacionesTblDiasPrima")(), "nombreCompo": "diasPrima", "editable": false, "tipoCompon": "text", "persist": "diasPrima", "ancho": "50px", "funcion": "" });

    return columnasTabla;
}

function buscar(mostrar) {
    if (mostrar) {
        var res = getAllVacacionesAplicacion();
       
        llenarTablaGen("tblbuscar", res);
        document.getElementById("contenedorBuscar").style.display = "block";
        document.getElementById("contedorPrincipal").style.display = "none";
        InitEventsTable();
        document.getElementById("btnGuarda").style.display = "none";
        document.getElementById("ContenedoraBuscar").style.display = "none";
    
    } else {
        document.getElementById("contenedorBuscar").style.display = "none";
        document.getElementById("contedorPrincipal").style.display = "block";
        document.getElementById("btnGuarda").style.display = " inline-block";
        document.getElementById("ContenedoraBuscar").style.display = "inline";
        //document.getElementById().style.display = "block";
        //document.getElementById().style.display = "block";
        clearTable("contBuscar");
    }

}

function getAllVacacionesAplicacion() {
    var listaTable = new Array();
    var url = route + "/api/ConfigVacaciones/getAllVacacionesAplicacion";
    // var dataToPost = JSON.stringify(idPlaza);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        listaVacaApliGlobal = Mensaje.resultado;
        var obj = {};
        for (var i = 0; i < listaVacaApliGlobal.length; i++) {
            obj = {};
            obj.id = listaVacaApliGlobal[i].id;
            obj.clave = listaVacaApliGlobal[i].vacacionesDisfrutadas.empleados.clave;
            obj.nombreEmpleado = listaVacaApliGlobal[i].vacacionesDisfrutadas.empleados.apellidoPaterno + " " + listaVacaApliGlobal[i].vacacionesDisfrutadas.empleados.apellidoMaterno + " " + listaVacaApliGlobal[i].vacacionesDisfrutadas.empleados.nombre;
            obj.salida = formatDateddmmyyy(new Date(listaVacaApliGlobal[i].vacacionesDisfrutadas.salidaVacac));
            obj.regreso = listaVacaApliGlobal[i].vacacionesDisfrutadas.regresoVac === null ? "" : formatDateddmmyyy(new Date(listaVacaApliGlobal[i].vacacionesDisfrutadas.regresoVac));
            obj.diasVac = listaVacaApliGlobal[i].diasVac;
            obj.diasPrima = listaVacaApliGlobal[i].diasPrima;

            listaTable[listaTable.length] = obj;
        }
        //console.log(listaVacaApli);
        return listaTable;
    }
}

function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }