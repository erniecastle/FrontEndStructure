var fechaSistemasHisVac;
var plazaPorEmpleadoMov;
var empleado;
var razonSocialActual;
var tieneVacaciones = false;
var tablaFactorInt = null;
var modelVacaciones = new Array();
var deleteVacaciones = new Array();
var start = 0;
var end = 10;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    startCustomTools();
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    fechaSistemasHisVac = getFechaSistema();
    var fecha = formatDate(fechaSistemasHisVac);
    document.getElementById("dpkFechaIngreso").value = fecha;
    document.getElementById("dpkFechaDesde").value = fecha;

    getRazonSocialActual();
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

function getTablaDatosAntiguedad() {

    var controlador = "RazonesSociales" + razonSocialActual.clave;
    var url = route + "/api/HistorialVacaciones/getTablaDatosAntiguedad";
    var dataToPost = JSON.stringify(controlador);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        tablaFactorInt = Mensaje.resultado;
      //  console.log(tablaFactorInt);
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

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razon.id };//Unnecesary
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";

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
        fecha = getFechaIngreso(empleado.id);
        var nombreCompleto = empleado.apellidoPaterno + " " + empleado.apellidoMaterno + " " + empleado.nombre;
        var edit = document.getElementById("editEmpleado");
        var txtDescripcion = edit.children[1];
        // console.log(txtDescripcion);
        txtDescripcion.value = nombreCompleto;
       // console.log(plazaPorEmpleadoMov);
        document.getElementById("dpkFechaIngreso").value = formatDate(new Date(fecha));
        document.getElementById("dpkFechaDesde").value = formatDate(new Date(fecha));
        getVacacionesPorEmpleado(empleado.clave, razonSocialActual.clave);
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

function getVacacionesPorEmpleado(empleadoClave, razonSocialClave) {
    var obj = {};
    obj.claveEmpleado = empleadoClave;
    obj.claveRazonSocial = razonSocialClave;
    var url = route + "/api/HistorialVacaciones/getVacacionesPorEmpleado";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        modelVacaciones = new Array();
        if (Mensaje.resultado.length > 0) {
            tieneVacaciones = true;
            for (var i = 0; i < Mensaje.resultado.length; i++) {
                var dv = {};
                dv.id = Mensaje.resultado[i].id;
                dv.vacacionesAplicacion = Mensaje.resultado[i];
                var cal = new Date(getFechaIngreso(Mensaje.resultado[i].vacacionesDevengadas.empleados_ID));
                cal.setFullYear(cal.getFullYear() + Mensaje.resultado[i].vacacionesDevengadas.ejercicio);
                dv.fechaAniversario = formatDatemmddyyy(cal);
                if (i === 0) {
                    cal.setFullYear(cal.getFullYear()-1);
                    document.getElementById("dpkFechaDesde").value = formatDate(cal);
                }
               
                dv.diasPendientesVacaciones = Mensaje.resultado[i].vacacionesDevengadas.diasVacaciones - (Mensaje.resultado[i].diasVac === null ? 0 : Mensaje.resultado[i].diasVac);
                dv.diasPendientePrimas = Mensaje.resultado[i].vacacionesDevengadas.diasPrimaVaca - (Mensaje.resultado[i].diasPrima === null ? 0 : Mensaje.resultado[i].diasPrima);
                Mensaje.resultado[i].vacacionesDisfrutadas.salidaVacac = formatDatemmddyyy(new Date(Mensaje.resultado[i].vacacionesDisfrutadas.salidaVacac));
                modelVacaciones[modelVacaciones.length] = dv;
            }


        } else {
            tieneVacaciones = false;
        }

        if (modelVacaciones.length < rowsByPage) {
            end = modelVacaciones.length;
        }
           
        

        llenarTbl(start, end);
    }
}


function btnInicializaVac() {
    //if (!tieneVacaciones) {
    //  var opcion = confirm("Deseas inicializar la tabla vacaciones?");
    var fechaingreso = new Date(formantDdMmYyyy(document.getElementById("dpkFechaIngreso").value));
    var fechaDesde = new Date(formantDdMmYyyy(document.getElementById("dpkFechaDesde").value));
    if (fechaDesde >= fechaingreso) {
        if (fechaingreso !== null) {
            var opcion;
            if (tieneVacaciones) {
                opcion = confirm("El empleado ya cuenta con vacaciones desea eliminarlas para inicializar otra vez");
            }
            else {
                opcion = confirm("Deseas inicializar la tabla vacaciones?");
            }
            if (opcion) {
                inicializaVacaciones(fechaingreso, true);
            }
            if (modelVacaciones.length < rowsByPage) {
                end = modelVacaciones.length;
            } else {
                end = rowsByPage;
            }
            llenarTbl(start,end);
        } else {
            alert("Agrege fecha de desde");
        }
    } else {
        alert("la fecha desde no debe ser menor a la ingreso empleado");
    }
    //} else {
    //    alert("empleado ya cuenta con vacaciones"); 
    //}
}

function inicializaVacaciones(fechaingreso, infoCompleta) {
    if (tieneVacaciones) {
        for (var i = 0; i < modelVacaciones.length; i++) {
            if (Number.isInteger(modelVacaciones[i].id)) {
                deleteVacaciones[deleteVacaciones.length] = modelVacaciones[i].id;
            }

        }
        modelVacaciones = new Array();
    }
        if (fechaingreso !== null) {
            var añosTrabajados;
            añosTrabajados = calcularAntiguedadExacta(fechaingreso);
            var fecha = new Date(formantDdMmYyyy(document.getElementById("dpkFechaIngreso").value));
            var fechadesde = new Date(formantDdMmYyyy(document.getElementById("dpkFechaDesde").value));

         var  year = fechadesde.getFullYear() - fecha.getFullYear() + 1;
            // console.log(añosTrabajados);
            if (añosTrabajados > 0 && tablaFactorInt !== null) {
                modelVacaciones = new Array();
                var i, anio;
                var dv;
                for (anio = year; anio <= añosTrabajados; anio++) {
                    for (i = 0; i < tablaFactorInt[1].length; i++) {
                        if (anio === parseInt(tablaFactorInt[1][i])) {
                            dv = generaDatosVacaciones(fechaingreso, anio, tablaFactorInt[1][i], infoCompleta);
                            modelVacaciones[modelVacaciones.length] = dv;
                            break;
                        } else if (anio < parseInt(tablaFactorInt[1][i])) {
                            dv = generaDatosVacaciones(fechaingreso, anio, tablaFactorInt[1][i], infoCompleta);
                            modelVacaciones[modelVacaciones.length] = dv;
                            break;

                        } else if (i === tablaFactorInt[1].length - 1 && anio > parseInt(tablaFactorInt[1][i])   ) {
                            dv = generaDatosVacaciones(fechaingreso, anio, tablaFactorInt[1][i], infoCompleta);
                            modelVacaciones[modelVacaciones.length] = dv;
                            break;
                        }
                    }
                }
            } else {
                if (tablaFactorInt === null) {
                    alert("No encontro la tabla factor de integracion");
                }
            }

        } else {
            alert("Agrege fecha de ingreso");
        }
    //}
    //console.log(modelVacaciones);
}

function generaDatosVacaciones(fechaPrestaciones, anio, factorIntegreacionXML, infoCompleta) {
    var dv = {};
    var vacacionesAplicacion = {};
    var vacacionesDevengadas = {};
    var vacacionesDisfrutadas = {};
   // console.log(fechaPrestaciones);
    dv.id = "id" + randomString(2, '0123456789');
    vacacionesDevengadas.factorPrima = parseFloat(factorIntegreacionXML[4]);
    vacacionesDevengadas.diasVacaciones = parseInt(factorIntegreacionXML[3]);
    vacacionesDevengadas.ejercicio = anio;
    vacacionesDevengadas.razonesSociales_ID = razonSocialActual.id;
    vacacionesDevengadas.registroInicial = true;
    vacacionesDevengadas.diasPrimaVaca = (vacacionesDevengadas.factorPrima / 100) * vacacionesDevengadas.diasVacaciones;
    vacacionesDevengadas.salarioAniversario = "";

    var cal = new Date(fechaPrestaciones.getFullYear(), fechaPrestaciones.getMonth(), fechaPrestaciones.getDate());
    cal.setFullYear(cal.getFullYear() + anio);
    dv.fechaAniversario = formatDatemmddyyy(cal);
    vacacionesDisfrutadas.ejercicioAplicacion = cal.getFullYear();
    vacacionesDisfrutadas.registroInicial = true;
    vacacionesDisfrutadas.razonesSociales_ID = razonSocialActual.id;
    vacacionesDisfrutadas.diasPrimaDisfrutados = 0.0;
    vacacionesDisfrutadas.diasVacDisfrutados = 0;
    vacacionesAplicacion.diasPrima = 0.0;
    vacacionesAplicacion.diasVac = 0;

    if (fechaSistemasHisVac.getFullYear() === cal.getFullYear() && !infoCompleta) {
        dv.diasPendientePrimas = vacacionesDevengadas.diasPrimaVaca;
        dv.diasPendientesVacaciones = vacacionesDevengadas.diasVacaciones;
    } else {
        vacacionesDisfrutadas.diasVacDisfrutados = vacacionesDevengadas.diasVacaciones;
        vacacionesDisfrutadas.diasPrimaDisfrutados = vacacionesDevengadas.diasPrimaVaca;
        vacacionesDisfrutadas.salidaVacac=dv.fechaAniversario;
        dv.diasPendientePrimas = 0;
        dv.diasPendientesVacaciones = 0;
    }
    vacacionesAplicacion.vacacionesDevengadas = {};
    vacacionesAplicacion.vacacionesDisfrutadas = {};
    vacacionesAplicacion.vacacionesDevengadas = vacacionesDevengadas;
    vacacionesAplicacion.vacacionesDisfrutadas=vacacionesDisfrutadas;
    dv.vacacionesAplicacion = {};
    dv.vacacionesAplicacion = vacacionesAplicacion;

    return dv;
    

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

function llenarTbl(start,end) {
    var datosTabla = new Array();
    var obj = {};
    for (var i = 0; i < modelVacaciones.length; i++) {
        obj = {};
        obj.id = modelVacaciones[i].id;
        obj.ejercicio = modelVacaciones[i].vacacionesAplicacion.vacacionesDevengadas.ejercicio;
        obj.fechaAniversario = modelVacaciones[i].fechaAniversario;
        obj.salarioAniversario = modelVacaciones[i].vacacionesAplicacion.vacacionesDevengadas.salarioAniversario;
        obj.diasVacaciones = modelVacaciones[i].vacacionesAplicacion.vacacionesDevengadas.diasVacaciones;
        obj.salidaVacac = modelVacaciones[i].vacacionesAplicacion.vacacionesDisfrutadas.salidaVacac;
        obj.diasVacDisfrutados = modelVacaciones[i].vacacionesAplicacion.vacacionesDisfrutadas.diasVacDisfrutados;
        obj.diasPendientesVacaciones = modelVacaciones[i].diasPendientesVacaciones;
        obj.factorPrima = modelVacaciones[i].vacacionesAplicacion.vacacionesDevengadas.factorPrima;
        obj.diasPrimaVaca = modelVacaciones[i].vacacionesAplicacion.vacacionesDevengadas.diasPrimaVaca;
        obj.diasPrimaDisfrutados = modelVacaciones[i].vacacionesAplicacion.vacacionesDisfrutadas.diasPrimaDisfrutados;
        obj.diasPendientePrimas = modelVacaciones[i].diasPendientePrimas;
        datosTabla[datosTabla.length] = obj;
    }
    if (datosTabla.length > 0) {

        clearTable("contTable");
        if (start === 0) {
            createEditPagination(datosTabla.length, "HistorialVacaciones");
        }

        llenarTablaGen("HistorialVacaciones", datosTabla, start, end);
        InitEventsTable();
    } else {
        clearTable("contTable");
        InitEventsTable();
    }
}

function AgregarVac() {
    var fechaValida = true;
    if (tablaFactorInt !== null) {
        var dv = {};
        var i, year = 1;
        var fecha = new Date(formantDdMmYyyy(document.getElementById("dpkFechaIngreso").value));
        var fechadesde = new Date(formantDdMmYyyy(document.getElementById("dpkFechaDesde").value));

        year = fechadesde.getFullYear() - fecha.getFullYear() + 1;
        //console.log(year);
        var datosVacaciones = modelVacaciones;
        if (datosVacaciones.length > 0) {
            year = datosVacaciones[datosVacaciones.length - 1].vacacionesAplicacion.vacacionesDevengadas.ejercicio+1;
        }
      //  var fecha = new Date(formantDdMmYyyy(document.getElementById("dpkFechaDesde").value));
        fecha.setFullYear(fecha.getFullYear() + year);
       
        if (fecha.getFullYear() === fechaSistemasHisVac.getFullYear()) {
            var añosTrabajados = calcularAntiguedadExacta(new Date(formantDdMmYyyy(document.getElementById("dpkFechaIngreso").value)));
            if (añosTrabajados === 0) {
                fechaValida = false;
            }
        }

        if (fecha.getFullYear() <= fechaSistemasHisVac.getFullYear() && fechaValida) {
            for (i = 0; i < tablaFactorInt[1].length; i++) {
                if (year === parseInt(tablaFactorInt[1][i])) {
                    dv = rowDatosVacaciones(new Date(formantDdMmYyyy(document.getElementById("dpkFechaIngreso").value)), year, tablaFactorInt[1][i]);
                    break;
                } else if (year < parseInt(tablaFactorInt[1][i])) {
                    dv = rowDatosVacaciones(new Date(formantDdMmYyyy(document.getElementById("dpkFechaIngreso").value)), year, tablaFactorInt[1][i]);
                    break;

                } else if (i === tablaFactorInt[1].length - 1 && year > parseInt(tablaFactorInt[1][i])) {
                    dv = rowDatosVacaciones(new Date(formantDdMmYyyy(document.getElementById("dpkFechaIngreso").value)), year, tablaFactorInt[1][i]);
                    break;
                }
            }
            modelVacaciones[modelVacaciones.length] = dv;
            if (modelVacaciones.length < rowsByPage) {
                end = modelVacaciones.length;
            } else {
                end = rowsByPage;
            }
            llenarTbl(start, end);
        }


    } else {
        alert("Agrege una tabla factor de integracion");
    }
    
}

function rowDatosVacaciones(fechaPrestaciones, anio, factorIntegreacionXML) {
    var dv = {};
    var vacacionesAplicacion = {};
    var vacacionesDevengadas = {};
    var vacacionesDisfrutadas = {};
    dv.id = "id" + randomString(2, '0123456789');
    vacacionesDevengadas.factorPrima = factorIntegreacionXML[4];
    vacacionesDevengadas.diasVacaciones = factorIntegreacionXML[3];
    vacacionesDevengadas.ejercicio = anio;
    vacacionesDevengadas.razonesSociales_ID = razonSocialActual.id;
    vacacionesDevengadas.registroInicial = true;
    vacacionesDevengadas.diasPrimaVaca = (vacacionesDevengadas.factorPrima / 100) * vacacionesDevengadas.diasVacaciones;
    vacacionesDevengadas.salarioAniversario = "";

    var cal = new Date(fechaPrestaciones.getFullYear(), fechaPrestaciones.getMonth(), fechaPrestaciones.getDate());
    if (cal.getMonth() === 2 && cal.getDate() === 29) {
        cal.setDate(cal.getDate() - 1);
    }
    cal.setFullYear(cal.getFullYear() + anio);
    dv.fechaAniversario = formatDatemmddyyy(cal);

    vacacionesDisfrutadas.registroInicial = true;
    vacacionesDisfrutadas.razonesSociales_ID = razonSocialActual.id;
    vacacionesDisfrutadas.ejercicioAplicacion = cal.getFullYear();
    vacacionesDisfrutadas.diasPrimaDisfrutados = 0.0;
    vacacionesDisfrutadas.salidaVacac = "";
    vacacionesDisfrutadas.diasVacDisfrutados = 0;
    vacacionesAplicacion.diasPrima = 0.0;
    vacacionesAplicacion.diasVac = 0;
    var vacPendientes = vacacionesDevengadas.diasVacaciones;
    var primasPendientes = vacacionesDevengadas.diasPrimaVaca;
    var i;
    for (i = 0; i < modelVacaciones.length; i++) {
        vacPendientes = parseInt(vacPendientes) + parseInt(modelVacaciones[i].diasPendientesVacaciones);
        primasPendientes = primasPendientes + modelVacaciones[i].diasPendientePrimas;
    }

    dv.diasPendientesVacaciones = vacPendientes;
    dv.diasPendientePrimas = primasPendientes;

    vacacionesAplicacion.vacacionesDevengadas = {};
    vacacionesAplicacion.vacacionesDisfrutadas = {};
    vacacionesAplicacion.vacacionesDevengadas = vacacionesDevengadas;
    vacacionesAplicacion.vacacionesDisfrutadas = vacacionesDisfrutadas;
    dv.vacacionesAplicacion = {};
    dv.vacacionesAplicacion = vacacionesAplicacion;

    return dv;
}

function validaFecha(values) {
    var fechaValida2 = true;
   
    var fechaSalida = new Date(formantDdMmYyyy(values[0].toString()));
    var fechaAni;
    var tr = values[1];
    var i = 0;
    for (i = 0; i < modelVacaciones.length; i++) {
        if (parseInt(tr.id)) {
            if (parseInt(tr.id) === modelVacaciones[i].id) {
                fechaAni = new Date(modelVacaciones[i].fechaAniversario);
                break;
            }
        } else {
            if (tr.id === modelVacaciones[i].id) {
                fechaAni = new Date(modelVacaciones[i].fechaAniversario);
                break;
            }
        }
    }

    if (fechaSalida < fechaAni) {
        fechaValida2 = false;
        alert("La fecha no debe ser menor a la fecha aniversario");
    }
   // console.log(fechaSalida);
    var rowIndex;
    var id = tr.id;
    for (i = 0; i < modelVacaciones.length; i++) {
        if (parseInt(id) === modelVacaciones[i].id) {
            rowIndex = i;
            break;
        } else if (id === modelVacaciones[i].id) {
            rowIndex = i;
            break;
        }
    }
    modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDisfrutadas.salidaVacac = formatDatemmddyyy(fechaSalida);
    //r/*eturn fechaValida2;*/
  //  var fechaPrestaciones = new Date(formantDdMmYyyy(document.getElementById("dpkFechaIngreso").value));
  
}

function diasPendiente(values) {
    var pendientes = 0;
    var diasDif = parseInt(values[0]);
    var tr = values[1];
   // var rowIndex = tr.rowIndex - 2;
    
    var rowIndex;
    var id = tr.id;
    var i = 0;
    for (i = 0; i < modelVacaciones.length; i++) {
        if (parseInt(id) === modelVacaciones[i].id) {
            rowIndex = i;
            break;
        } else if (id === modelVacaciones[i].id) {
            rowIndex = i;
            break;
        }
    }
    var rowDesp = rowIndex + 1;
    var diasDifrutadoDes = 0;
    if (rowDesp < modelVacaciones.length) {
        diasDifrutadoDes = parseInt(modelVacaciones[rowDesp].vacacionesAplicacion.vacacionesDisfrutadas.diasVacDisfrutados);
    }
    var respaldo = parseInt(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDisfrutadas.diasVacDisfrutados);
    if ((diasDif < parseInt(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDevengadas.diasVacaciones) && diasDifrutadoDes === 0) || diasDif === parseInt(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDevengadas.diasVacaciones)) {
        for ( i = 0; i < modelVacaciones.length; i++) {
            if (i < rowIndex) {
                pendientes = pendientes + parseInt(modelVacaciones[i].diasPendientesVacaciones);
            }
        }
      //  var respaldo = parseInt(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDisfrutadas.diasVacDisfrutados);
        if (diasDif <= parseInt(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDevengadas.diasVacaciones) + pendientes) {
            modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDisfrutadas.diasVacDisfrutados = diasDif;
            modelVacaciones[rowIndex].vacacionesAplicacion.diasVac = diasDif;
            var diasVac = parseInt(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDevengadas.diasVacaciones) + pendientes;
            if (diasDif === null ? false : diasDif > 0) {
                modelVacaciones[rowIndex].diasPendientesVacaciones = (diasVac === null ? 0 : diasVac) - (diasDif === null ? 0 : diasDif);
            } else {
                modelVacaciones[rowIndex].diasPendientesVacaciones = parseInt(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDevengadas.diasVacaciones);
            }
        } else {
            modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDisfrutadas.diasVacDisfrutados = respaldo;
            modelVacaciones[rowIndex].vacacionesAplicacion.diasVac = respaldo;
        }

        pendientes = 0;
        llenarTbl(start, end);
    } else {
        alert("el registro seguiente debe tener los dias disfrutado en 0");
        modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDisfrutadas.diasVacDisfrutados = respaldo;
        modelVacaciones[rowIndex].vacacionesAplicacion.diasVac = respaldo;
        pendientes = 0;
        llenarTbl(start,end);
    }
    
    //var td = tr.querySelector("td[persist='diasPrimaDisfrutados']");
    //console.log(td);
    //$(td).firstElementChild.focus();
   // console.log(pendientes);
}

function diasPendientePrima(values) {
    var pendientesPrim = 0.0;
    var diasPrimaDif = parseFloat(values[0]);
    var tr = values[1];
    var rowIndex;
    var id = tr.id;
    var i = 0;
    for (i = 0; i < modelVacaciones.length; i++) {
        if (parseInt(id) === modelVacaciones[i].id) {
            rowIndex = i;
            break;
        } else if (id === modelVacaciones[i].id) {
            rowIndex = i;
            break;
        }
    }
    var rowDesp = rowIndex + 1;
    var diasPrimaDifrutadoDes = 0;
    if (rowDesp < modelVacaciones.length) {
        diasPrimaDifrutadoDes = parseFloat(modelVacaciones[rowDesp].vacacionesAplicacion.vacacionesDisfrutadas.diasPrimaDisfrutados);
    }
    var respaldoPrim = parseFloat(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDisfrutadas.diasPrimaDisfrutados);
    if ((diasPrimaDif < parseFloat(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDevengadas.diasPrimaVaca) && diasPrimaDifrutadoDes === 0.0) || diasPrimaDif === parseFloat(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDevengadas.diasPrimaVaca)) {
        for ( i = 0; i < modelVacaciones.length; i++) {
            if (i < rowIndex) {
                pendientesPrim = pendientesPrim + parseFloat(modelVacaciones[i].diasPendientesVacaciones);
            }
        }

        if (diasPrimaDif <= parseFloat(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDevengadas.diasPrimaVaca) + pendientesPrim) {
            modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDisfrutadas.diasPrimaDisfrutados = diasPrimaDif;
            modelVacaciones[rowIndex].vacacionesAplicacion.diasPrima = diasPrimaDif;
            var diasPrima = parseFloat(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDevengadas.diasPrimaVaca) + pendientesPrim;
            if (diasPrimaDif === null ? false : diasPrimaDif > 0) {
                modelVacaciones[rowIndex].diasPendientePrimas = (diasPrima === null ? 0.0 : diasPrima) - (diasPrimaDif === null ? 0.0 : diasPrimaDif);
            } else {
                modelVacaciones[rowIndex].diasPendientePrimas = parseFloat(modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDevengadas.diasPrimaVaca);
            }
        } else {
            modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDisfrutadas.diasPrimaDisfrutados = respaldoPrim;
            modelVacaciones[rowIndex].vacacionesAplicacion.diasPrima = respaldoPrim;
        }

        pendientesPrim = 0.0;
        llenarTbl(start,end);
    } else {
        alert("el registro seguiente debe tener los dias primas disfrutado en 0");
        modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDisfrutadas.diasPrimaDisfrutados = respaldoPrim;
        modelVacaciones[rowIndex].vacacionesAplicacion.diasPrima = respaldoPrim;
        pendientesPrim = 0.0;
        llenarTbl(start, end);
    }
    //var parent = tr.paren
    
    // console.log(pendientes);
}


function sueldoAniver(values) {
    var sueldo = values[0];
    var tr = values[1];
    var rowIndex;
    var id = tr.id;
    var i = 0;
    for (i = 0; i < modelVacaciones.length; i++) {
        if (parseInt(id) === modelVacaciones[i].id) {
            rowIndex = i;
            break;
        } else if (id === modelVacaciones[i].id) {
            rowIndex = i;
            break;
        }
    }
    modelVacaciones[rowIndex].vacacionesAplicacion.vacacionesDevengadas.salarioAniversario = sueldo;
}

function saveVacaciones() {
    var agregarVac = new Array();
    var listaVacDevngada = new Array();
    for (var i = 0; i < modelVacaciones.length; i++) {
        if (parseInt(modelVacaciones[i].vacacionesAplicacion.vacacionesDisfrutadas.diasVacDisfrutados) === 0 && parseFloat(modelVacaciones[i].vacacionesAplicacion.vacacionesDisfrutadas.diasPrimaDisfrutados)===0) {
            listaVacDevngada[listaVacDevngada.length] = modelVacaciones[i].vacacionesAplicacion.vacacionesDevengadas;
            listaVacDevngada[listaVacDevngada.length - 1].empleados_ID = empleado.id;
            listaVacDevngada[listaVacDevngada.length - 1].salarioAniversario = empleado.id;
        } else {
            agregarVac[i] = modelVacaciones[i].vacacionesAplicacion;
            agregarVac[i].vacacionesDevengadas.empleados_ID = empleado.id;
            agregarVac[i].vacacionesDisfrutadas.empleados_ID = empleado.id;
        }

        
    }

    var obj = {};
    obj["saveOrUpdate"] = agregarVac;
    if (deleteVacaciones.length > 0) {
        obj["delete"] = deleteVacaciones;
    }

    if (listaVacDevngada.length > 0) {
        obj["addVacDevengada"] = listaVacDevngada;
    }

    var url = route + "/api/HistorialVacaciones/SaveOrUpdate";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado !== null) {
        alert("Guardado Exitosamente");
        cancelar();
    } else {
        alert(Mensaje.error);
    }
}

function cancelar() {
    modelVacaciones = new Array();
    plazaPorEmpleadoMov = null;
    empleado = null;
    tieneVacaciones = false;
    
    var fecha = formatDate(fechaSistemasHisVac);
    document.getElementById("dpkFechaIngreso").value = fecha;
    document.getElementById("dpkFechaDesde").value = fecha;
    clearEdit("editEmpleado");
    start = 0;
    end = 10;
    llenarTbl();

}

///metodos para la tabla
function editVacaciones() {

    var nameTable = "HistorialVacaciones";
    var nameCols = crearListaColumnas();
    var activaAdd = true;
    var activaDelete = true;
    var activarEditar = false;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete, activarEditar);
}

function crearListaColumnas() {
    var columnasTabla = new Array();
    columnasTabla.push({ "tituloColumna": idiomaSelecionado.messageFormatter("ProgramacionVacacionesTblNumAnio")(), "nombreCompo": "NoAnio", "editable": false, "tipoCompon": "text", "persist": "ejercicio", "ancho": "35px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("ProgramacionVacacionesTblAniversario")(), "nombreCompo": "fechaAniversario", "editable": false, "tipoCompon": "date", "persist": "fechaAniversario", "ancho": "70px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("ProgramacionVacacionesTblSDAniv")(), "nombreCompo": "SDAniv", "editable": true, "tipoCompon": "text", "persist": "salarioAniversario", "ancho": "100px", "funcion": "sueldoAniver" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("ProgramacionVacacionesTblDiasVac")(), "nombreCompo": "diasVac", "editable": false, "tipoCompon": "text", "persist": "diasVacaciones", "ancho": "70px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("ProgramacionVacacionesTblSalidaVac")(), "nombreCompo": "Salidavac", "editable": true, "tipoCompon": "date", "persist": "salidaVacac", "ancho": "70px", "funcion": "validaFecha" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("ProgramacionVacacionesTblDisfrutados")(), "nombreCompo": "DisfrutadosVac", "editable": true, "tipoCompon": "text", "persist": "diasVacDisfrutados", "ancho": "70px", "funcion": "diasPendiente" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("ProgramacionVacacionesTblPendientes")(), "nombreCompo": "PendientesVac", "editable": false, "tipoCompon": "text", "persist": "diasPendientesVacaciones", "ancho": "70px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("ProgramacionVacacionesTblPV")(), "nombreCompo": "PorcrtajePV", "editable": false, "tipoCompon": "text", "persist": "factorPrima", "ancho": "40px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("ProgramacionVacacionesTblDiasPV")(), "nombreCompo": "DiasPV", "editable": false, "tipoCompon": "text", "persist": "diasPrimaVaca", "ancho": "50px", "funcion": "" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("ProgramacionVacacionesTblDisfrutados")(), "nombreCompo": "DisfrutadosPV", "editable": true, "tipoCompon": "text", "persist": "diasPrimaDisfrutados", "ancho": "60px", "funcion": "diasPendientePrima" },
        { "tituloColumna": idiomaSelecionado.messageFormatter("ProgramacionVacacionesTblPendientes")(), "nombreCompo": "PendientesPV", "editable": false, "tipoCompon": "text", "persist": "diasPendientePrimas", "ancho": "60px", "funcion": "" });

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

    var exito = false;
    var id = registro.id;
    var rowIndex;

    for (var i = 0; i < modelVacaciones.length; i++) {
        if (parseInt(id) === modelVacaciones[i].id) {
            rowIndex = i;
            break;
        } else if (id === modelVacaciones[i].id) {
            rowIndex = i;
            break;
        }
    }
    if (rowIndex === 0 || rowIndex + 1 === modelVacaciones.length) {
        exito = true;
        if (parseInt(modelVacaciones[rowIndex].id)) {
            deleteVacaciones[deleteVacaciones.length] = modelVacaciones[rowIndex].id;
        }
        modelVacaciones.splice(rowIndex, 1);
        clearTable("contTable");
        if (modelVacaciones.length > 0) {
            start = 0;
            if (start === 0) {
                createEditPagination(modelVacaciones.length, "HistorialVacaciones");
            }



            if (modelVacaciones.length <= rowsByPage) {
                end = modelVacaciones.length;
            } else {
                end = rowsByPage;
            }
            llenarTbl(start, end);
        }

    } else {
        alert("solo puede eliminar el primer registro o el ultimo");
    }
   

    return exito;
    
   
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

    var columnas = valores[1];
    var renglon = valores[0];
    if (columnas.getAttribute("persist") === "creditoPorEmpleado_ID") {
        var clave = renglon.cells[0].innerText;
        if (clave !== "") {
            claveEmpleado = clave;
        } else {
            //renglon.cells[0].focus();
            // alert("selecione un empelado");
        }
    }

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
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}