var fechaSistema = new Date();
var razonSocialActual;
var registroIncapacidad = {};
var empleados;
var CbxControl = ["0-Ninguno", "1-Única", "2-Inicial", "3-Subsecuente", "4-Alta médica o ST2", "5-Valuación o ST3", "6-Defunción o ST3", "7-Prenatal", "8-Enlace", "9-Postnatal"];
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    fechaSistema = new Date(getFechaSistema());
    document.getElementById("dpFechaInicio").value = formatDate(fechaSistema);
    document.getElementById("dpFechaFinal").value = formatDate(fechaSistema);
    document.getElementById("DivGroupPorcentaje").style.display = "none";
    document.getElementById("ckbPagar3PrimerDias").disabled = true;
    document.getElementById("selTipoRiesgo").disabled = true;
    document.getElementById("selSecuelaConsecuencia").disabled = true;
    document.getElementById("selControlIncapacidad").disabled = true;
    // enabledEdit("editIncapacidad", false);
    addListenersRegistroIncap();
    //generarClaveIncapacidad();
    getRazonSocialActualRegIncap();
    startCustomTools();
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    nombreTablaBDs = "RegistroIncapacidad";

    //$("#txtFolio").on("keydown", function (event) {
    //    var valor = this.value;
    //    if (event.keyCode === 13 || event.keyCode === 9) {
    //        if (valor !== "") {
    //            valor = construyeMascara("clave", valor);
    //            this.value = valor;
    //        }
    //    }
    //});

    

});

function getRazonSocialActualRegIncap() {
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);

    var url = route + "/api/RegistrosCreditos/getRazonSocialPorID";
    var dataToPost = JSON.stringify(razon.clave);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        razonSocialActual = Mensaje.resultado;
    }
    // console.log(razonSocialActual);
    // return razonSocialActual;

}

function generarClaveIncapacidad() {
    var obj = {};
    obj.fuentePrincipal = "RegistroIncapacidad";
    obj.campo = "clave";

   // obj.camposWhere = ["tipoConfiguracion"];
   // if (tipoConfiguracion === 1) {
     //   obj.valoresWhere = ["1"];
    //} else if (tipoConfiguracion === 2) {
      //  obj.valoresWhere = ["2"];
   // }

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
       // var clave = construyeMascara("clave", key);
        document.getElementById("txtFolio").value = key;
    } else {
        console.log(Mensaje.error);
    }
}

function addListenersRegistroIncap() {
    $("#selRamoSeguro").on("change", function () {
        if (this.value === "1") {
            document.getElementById("ckbPagar3PrimerDias").disabled = true;
            document.getElementById("ckbPagar3PrimerDias").checked = false;
            document.getElementById("selTipoRiesgo").disabled = false;
            document.getElementById("selSecuelaConsecuencia").disabled = true;
            document.getElementById("selControlIncapacidad").disabled = true;
            document.getElementById("selTipoRiesgo").value = "";
            document.getElementById("selSecuelaConsecuencia").value = "";
            document.getElementById("selControlIncapacidad").value = "";
        } else if (this.value === "2") {
            document.getElementById("ckbPagar3PrimerDias").disabled = false
            document.getElementById("selTipoRiesgo").disabled = true;
            document.getElementById("selSecuelaConsecuencia").disabled = true;
            document.getElementById("selControlIncapacidad").disabled = false;
            document.getElementById("selTipoRiesgo").value = "";
            document.getElementById("selSecuelaConsecuencia").value = "";
            document.getElementById("selControlIncapacidad").value = "";
            llenarselControlIncapacidad(1, 5);

        } else if (this.value === "3") {
            document.getElementById("ckbPagar3PrimerDias").disabled = true;
            document.getElementById("ckbPagar3PrimerDias").checked = false;
            document.getElementById("selTipoRiesgo").disabled = true;
            document.getElementById("selSecuelaConsecuencia").disabled = true;
            document.getElementById("selControlIncapacidad").disabled = false;
            document.getElementById("selTipoRiesgo").value = "";
            document.getElementById("selSecuelaConsecuencia").value = "";
            document.getElementById("selControlIncapacidad").value = "";
            llenarselControlIncapacidad(CbxControl.length - 3, CbxControl.length);
        }

    });

    $("#selTipoRiesgo").on("change", function () {
        document.getElementById("selSecuelaConsecuencia").disabled = false;
    });

    $("#selSecuelaConsecuencia").on("change", function () {
        document.getElementById("selControlIncapacidad").disabled = false;
        var ranMin = 0, ranMax = 1;
        if (document.getElementById("selTipoRiesgo").value === "1") {///Accidente de Trabajo
            switch (parseInt(document.getElementById("selSecuelaConsecuencia").value)) {
                case 0://0-Ninguno
                case 1://1-Incapacidad Temporal   
                case 2://2-Valuacion Inicial Provisional
                case 3:// 3-Valuacion Inicial Definitiva
                    ranMin = 0;
                    ranMax = 1;
                    break;
                case 4://4-Defuncion
                    ranMin = 6;
                    ranMax = 7;
                    break;
                case 5://5-Recaida
                    ranMin = 1;
                    ranMax = 5;
                    break;
                case 6://6-Valuacion post a la fecha de alta
                case 7://7-Revaluacion Provisional.
                case 8://8-Recaida sin alta medica
                case 9://9-Revaluacion Definitiva.
                    ranMin = 5;
                    ranMax = 6;
                    break;
            }

        } else if (document.getElementById("selTipoRiesgo").value === "2") {///Accidente de Trayecto
            switch (parseInt(document.getElementById("selSecuelaConsecuencia").value)) {
                case 0: //0-Ninguno
                case 1://1-Incapacidad Temporal   
                case 2://2-Valuacion Inicial Provisional
                case 3:// 3-Valuacion Inicial Definitiva 
                case 4://4-Defuncion
                case 5://5-Recaida
                case 6://6-Valuacion post a la fecha de alta
                case 7://7-Revaluacion Provisional.
                    ranMin = 0;
                    ranMax = 1;
                    break;
                case 8://8-Recaida sin alta medica
                    ranMin = 1;
                    ranMax = 5;
                    break;
                case 9://9-Revaluacion Definitiva.
                    ranMin = 5;
                    ranMax = 6;
                    break;
            }

        } else {///Enfermedad Profesional
            switch (parseInt(document.getElementById("selSecuelaConsecuencia").value)) {
                case 0: //0-Ninguno
                    ranMin = 0;
                    ranMax = 1;
                    break;
                case 1://1-Incapacidad Temporal   
                    ranMin = 1;
                    ranMax = 5;
                    break;
                case 2://2-Valuacion Inicial Provisional
                case 3:// 3-Valuacion Inicial Definitiva 
                    ranMin = 5;
                    ranMax = 6;
                    break;
                case 4://4-Defuncion
                    ranMin = 6;
                    ranMax = 7;
                    break;
                case 5://5-Recaida
                    ranMin = 1;
                    ranMax = 5;
                    break;
                case 6://6-Valuacion post a la fecha de alta
                case 7://7-Revaluacion Provisional.
                    ranMin = 5;
                    ranMax = 6;
                    break;
                case 8://8-Recaida sin alta medica
                    ranMin = 1;
                    ranMax = 5;
                    break;
                case 9://9-Revaluacion Definitiva.
                    ranMin = 5;
                    ranMax = 6;
                    break;

            }
        }
        llenarselControlIncapacidad(ranMin, ranMax);
    });

    $("#txtDiasIncapacidad").on("keydown", function (e) {
        if (e.keyCode === 13 || e.keyCode === 9) {
            if (this.value !== "" && this.value!=="0") {
                var fechaIni = document.getElementById("dpFechaInicio").value;
                fechaIni = formantDdMmYyyy(fechaIni);
                if (fechaIni !== "") {
                    var fecha = new Date(fechaIni);
                    var dias = parseInt(this.value);

                    fecha.setDate(fecha.getDate() + (dias - 1));
                    // console.log(formatDate(fecha));
                    document.getElementById("dpFechaFinal").value = formatDate(fecha);
                }
            }

        }
    });

    $("#dpFechaInicio").on("change", function () {
        if (this.value.toString().length>0) {
            var fechaIni = document.getElementById("dpFechaInicio").value;
            fechaIni = formantDdMmYyyy(fechaIni);
            if (fechaIni !== "") {
                var fecha = new Date(fechaIni);
                var dias = parseInt(document.getElementById("txtDiasIncapacidad").value);
                if (dias > 0) {
                    fecha.setDate(fecha.getDate() + (dias - 1));
                    // console.log(formatDate(fecha));
                    document.getElementById("dpFechaFinal").value = formatDate(fecha);
                }
            }
        }

    });
}

function llenarselControlIncapacidad(ranMin, ranMax) {
    $("#selControlIncapacidad").find('option').remove();
    //.not(':first')
    for (var i = ranMin; i < ranMax; i++) {
        $("#selControlIncapacidad").append('<option value=' + i + '>' + CbxControl[i] + '</option>');
    }
}

function setEditEmpleados() {

    nameCmp = "EditEmpleados";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionadoCol.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionadoCol.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionadoCol.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "Clave, Nombre, Apellido Paterno, Apellido Materno,Nombre abreviado";
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";

    camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razonSocialActual.id };

    // //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecial";

    //var camposWhereEsp = "";
    var valoreswhereEsp = [razonSocialActual.clave, null, fechaSistema, fechaSistema];

    var optionals = { "queryEspecial": queryEspecial, "valoreswhereEsp": valoreswhereEsp }

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
         typeof optionals === 'undefined' ? "" : optionals);

}

function setEditEmpleadosShow(value) {
    if (value !== null) {
        var obj = value[0];
        empleados = obj[1];
        mostrarHistIncap(empleados.id);

    }
}

function setEditIncapacidad() {

    nameCmp = "EditIncapacidad";
    table = "RegistroIncapacidad";
    nameCols = idiomaSelecionadoCol.messageFormatter("RegistroIncapacidadesFolio")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionadoCol.messageFormatter("RegistroIncapacidadesCtrlIncap")();
   
   // nameCols = "Folio,Empleado,Ramo de seguro , Control de incapacidad";
    var subCampo = "@(Select CASE WHEN reg.ramoSeguro = 0 THEN 'Riesgo de trabajo' WHEN reg.ramoSeguro=1 THEN 'Enfermedad general'  ELSE 'Maternidad' END from RegistroIncapacidad reg where reg.id = o.id)";
    var subCampo2 = "@(Select CASE WHEN reg.controlIncapacidad = 0 THEN 'Ninguno' WHEN reg.controlIncapacidad=1 THEN 'Única' WHEN reg.controlIncapacidad=2 THEN 'Inicial' WHEN reg.controlIncapacidad=3 THEN 'Subsecuente'" +
   "  WHEN reg.controlIncapacidad = 4 THEN 'Alta médica o ST2' WHEN reg.controlIncapacidad = 5 THEN 'Valuación o ST3' WHEN reg.controlIncapacidad = 6 THEN 'Defunción o ST3' WHEN reg.controlIncapacidad = 7 THEN 'Prenatal'" +
   " WHEN reg.controlIncapacidad = 8 THEN 'Enlace' ELSE 'Postnatal' END from RegistroIncapacidad reg where reg.id = o.id)";
    campos = "clave,empleados.nombre," + subCampo + "," + subCampo2;
    camposObtener = "clave,empleados.nombre,ramoSeguro,controlIncapacidad";
   
    camposMostrar = ["clave", subCampo];
    var tituloSel = "Incapacida";
    var tamañoSel = "size-4";
    var subEntities = "empleados";
    if (empleados) {
        var preFilters = { "empleados.clave": empleados.clave, "empleados.razonesSociales.clave": razonSocialActual.clave };

    }
    // //todo esto es para el query especiales
    // var queryEspecial = "QueryEmpleadoEspecial";

    //var camposWhereEsp = "";
    //var valoreswhereEsp = [razonSocialActual.clave, null, fechaSistema, fechaSistema];


    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);


}

function setEditIncapacidadShow(value) {
    if (value !== null) {
        var obj = value[0];
        empleados = obj[1];

    }
}

function construirRegIncap(objeto) {
    if (typeof objeto === 'undefined') {
        registroIncapacidad = {};
    } else {
        registroIncapacidad = objeto;
    }

    registroIncapacidad.clave = document.getElementById("txtFolio").value;
    registroIncapacidad.empleados_ID = empleados.id

    if (document.getElementById("selRamoSeguro").value !== "") {
        var valor = parseInt(document.getElementById("selRamoSeguro").value);
        registroIncapacidad.ramoSeguro = valor - 1;
    } else {
        registroIncapacidad.ramoSeguro = null;
    }

    if (document.getElementById("selTipoRiesgo").value !== "") {
        var valor1 = parseInt(document.getElementById("selTipoRiesgo").value);
        registroIncapacidad.tipoRiesgo = valor - 1;
    } else {
        registroIncapacidad.tipoRiesgo = null;
    }

    if (document.getElementById("selSecuelaConsecuencia").value !== "") {
        var valor2 = parseInt(document.getElementById("selSecuelaConsecuencia").value);
        registroIncapacidad.secuelaConsecuencia = valor;
    } else {
        registroIncapacidad.secuelaConsecuencia = null;
    }

    if (document.getElementById("selControlIncapacidad").value !== "") {
        var valor3 = parseInt(document.getElementById("selControlIncapacidad").value);
        registroIncapacidad.controlIncapacidad = valor;
    } else {
        registroIncapacidad.controlIncapacidad = null;
    }

    if (document.getElementById("editIncapacidad").getAttribute("value")) {
        registroIncapacidad.incapacidadAnterior_ID = document.getElementById("editIncapacidad").getAttribute("value");
    } else {
        registroIncapacidad.incapacidadAnterior_ID = null;
    }

    registroIncapacidad.fechaInicial = document.getElementById("dpFechaInicio").value;
    registroIncapacidad.fechaFinal = document.getElementById("dpFechaFinal").value;
    registroIncapacidad.diasIncapacidad = document.getElementById("txtDiasIncapacidad").value === "" ? null : parseInt(document.getElementById("txtDiasIncapacidad").value);
    registroIncapacidad.porcentaje = document.getElementById("txtPorcentaje").value === "" ? null : parseInt(document.getElementById("txtPorcentaje").value);
    registroIncapacidad.pagarTresPrimeroDias = document.getElementById("ckbPagar3PrimerDias").checked;

    return registroIncapacidad;

}

function saveRegIncap() {
    var obj = construirRegIncap();
    console.log(obj);
    var url = route + "/api/RegistrarIncapacidades/saveIncapacidades";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiarIcapacidades();
    } else {
        limpiarIcapacidades();
      
    }
}

function updateRegIncap() {
    var obj = construirRegIncap(registroIncapacidad);
    console.log(obj);
    var url = route + "/api/RegistrarIncapacidades/updateIncapacidad";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiarIcapacidades();
    } else {
        limpiarIcapacidades();
    }
}

function deleteRegIncap() {
    var opcion = confirm("¿Seguro que desea eliminar el registro?");
    if (opcion) {
        registroIncapacidad.empleados = null;
        registroIncapacidad.incapacidadAnterior = null;
        var url = route + "/api/RegistrarIncapacidades/deleteIncapacidad";
        var dataToPost = JSON.stringify(registroIncapacidad);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado === null) {
            alert("No object");
            limpiarIcapacidades();
        } else {
            limpiarIcapacidades();
        }
    }
}

function mostrarRegIncap(object) {
    limpiarIcapacidades();
    registroIncapacidad = object;
    if (registroIncapacidad.empleados.claveRazon === razonSocialActual.clave) {
        document.getElementById("txtFolio").value = registroIncapacidad.clave;
        if (registroIncapacidad.empleados_ID !== null) {
            setEditObject("editEmpleados", registroIncapacidad.empleados.clave);
        } else {
            clearEdit("editEmpleados");
        }
        if (registroIncapacidad.ramoSeguro !== null) {
            if (registroIncapacidad.ramoSeguro === 1) {
                document.getElementById("ckbPagar3PrimerDias").checked = registroIncapacidad.pagarTresPrimeroDias;
            }
            document.getElementById("selRamoSeguro").value = (registroIncapacidad.ramoSeguro + 1).toString();
        }


        if (registroIncapacidad.tipoRiesgo !== null) {
            document.getElementById("selTipoRiesgo").value = (registroIncapacidad.tipoRiesgo + 1).toString();
        }

        if (registroIncapacidad.secuelaConsecuencia !== null) {
            document.getElementById("selSecuelaConsecuencia").value = registroIncapacidad.secuelaConsecuencia.toString();
        }

        if (registroIncapacidad.controlIncapacidad !== null) {
            document.getElementById("selControlIncapacidad").value = registroIncapacidad.controlIncapacidad.toString();
        }

        if (registroIncapacidad.incapacidadAnterior_ID !== null) {
            setEditObject("editIncapacidad", registroIncapacidad.incapacidadAnterior.clave);
        } else {
            clearEdit("editIncapacidad");
        }

        document.getElementById("dpFechaInicio").value = formatDate(new Date(registroIncapacidad.fechaInicial));
        document.getElementById("txtDiasIncapacidad").value = registroIncapacidad.diasIncapacidad;
        document.getElementById("dpFechaFinal").value = formatDate(new Date(registroIncapacidad.fechaFinal));
        document.getElementById("txtPorcentaje").value = registroIncapacidad.porcentaje;

    } else {
        alert("Esta Incapacidad pertenece a otra RazonesSociales");
    }
}

function searchRegIncap(id) {
    //var obj = construirRegIncap();
    // console.log(obj);
    var url = route + "/api/RegistrarIncapacidades/getRegistroIncap";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiarIcapacidades();
    } else {
        //limpiarIcapacidades();
        registroIncapacidad = Mensaje.resultado;
        mostrarRegIncap(registroIncapacidad);
        document.getElementById("btnGuarda").style.display = "none";
        document.getElementById("btnActualizar").style.display = "inline-block";
        document.getElementById("btnEliminar").style.display = "inline-block";
        

        //console.log(Mensaje.resultado);
    }
}

function mostrarHistIncap(id) {
    var obj = {};
    obj.idEmpleados = id;
    obj.idRazon = razonSocialActual.id;
    var url = route + "/api/RegistrarIncapacidades/getIncapcidadesPorEmpleadoID";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiarIcapacidades();
    } else {
        
        //registroIncapacidad = Mensaje.resultado;
        var listaIncapacidades = new Array();
        for (var i = 0; i < Mensaje.resultado.length; i++) {
            var obj2 = {};
            obj2.clave = Mensaje.resultado[i].clave;
            obj2.fechaInicial =formatDatemmddyyy(new Date(Mensaje.resultado[i].fechaInicial));
            obj2.fechaFinal = formatDatemmddyyy(new Date(Mensaje.resultado[i].fechaFinal));
            obj2.diasIncapacidad = Mensaje.resultado[i].diasIncapacidad;
            var ramo = Mensaje.resultado[i].ramoSeguro;
            var secuelaCons = Mensaje.resultado[i].secuelaConsecuencia;
            if (ramo === 0) {
                obj2.ramoSeguro = "Riesgo de trabajo";
            } else if (ramo === 1) {
                obj2.ramoSeguro = "Enfermedad general";
            } else if (ramo === 2) {
                obj2.ramoSeguro = "Maternidad";
            }

            if(secuelaCons===0){
                obj2.secuelaConsecuencia = "Ninguno";
            }else if(secuelaCons===1){
                obj2.secuelaConsecuencia = "Incapacidad temporal";
            } else if (secuelaCons === 2) {
                obj2.secuelaConsecuencia = "Valuacion inicial provisional";
            } else if (secuelaCons === 3) {
                obj2.secuelaConsecuencia = "Valuacion inicial definitiva";
            } else if (secuelaCons === 4) {
                obj2.secuelaConsecuencia = "Defunción";
            } else if (secuelaCons === 5) {
                obj2.secuelaConsecuencia = "Recaida";
            } else if (secuelaCons === 6) {
                obj2.secuelaConsecuencia = "Valuacion post a la fecha de alta";
            } else if (secuelaCons === 7) {
                obj2.secuelaConsecuencia = "Revaluacion provisional";
            } else if (secuelaCons === 8) {
                obj2.secuelaConsecuencia = "Recaída sin alta medica";
            } else if (secuelaCons === 9) {
                obj2.secuelaConsecuencia = "Revaluación definitiva";
            } else {
                obj2.secuelaConsecuencia = "";
            }

            listaIncapacidades[listaIncapacidades.length] = obj2;
        }
        clearTable("contTable");
        //OpenTable(document.getElementById('contTable'));
        llenarTablaGen("HistorialIncapacidad", listaIncapacidades, 0, listaIncapacidades.length);
        InitEventsTable();
        console.log(listaIncapacidades);
    }
}

/*Tabla Historial*/
function editTableHistorialIncapacidad() {

    var nameTable = "HistorialIncapacidad";
    var nameCols = crearListaColumnas();
    var activaAdd = false;
    var activaDelete = false;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function crearListaColumnas() {
    var columnasTabla = new Array();
    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroIncapacidadesFolio")(), "nombreCompo": "folio", "editable": false, "tipoCompon": "date", "persist": "clave", "ancho": "35px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroIncapacidadesFechaInical")(), "nombreCompo": "FechaInicial", "editable": false, "text": "", "persist": "fechaInicial", "ancho": "150px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroIncapacidadesFechaTermino")(), "nombreCompo": "FechaFinal", "editable": false, "tipoCompon": "text", "persist": "fechaFinal", "ancho": "150px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroIncapacidadesDiasIncap")(), "nombreCompo": "DiasIncapacidad", "editable": false, "tipoCompon": "text", "persist": "diasIncapacidad", "ancho": "150px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroIncapacidadesRamoSeguro")(), "nombreCompo": "RamoSeguro", "editable": false, "tipoCompon": "text", "persist": "ramoSeguro", "ancho": "150px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroIncapacidadesSecuelConse")(), "nombreCompo": "SecuelaConsecuencia", "editable": false, "tipoCompon": "text", "persist": "secuelaConsecuencia", "ancho": "150px" });


    return columnasTabla;
}

/*Table selector*/
function selectorRegistrarIncap() {

    //Parameters
    nameCmp = "selectorCatalogoRegistrarIncap";
    //if (tipoConfiguracion === 1) {
    //    title = "Configurar credito";
    //} else if (tipoConfiguracion === 2) {
    //    title = "Configurar Ahorros";
    //}
    title = "Incapacidades";
    table = "RegistroIncapacidad";
    nameCols = idiomaSelecionadoCol.messageFormatter("RegistroIncapacidadesFolio")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionadoCol.messageFormatter("RegistroIncapacidadesCtrlIncap")();
    //nameCols = "Folio,Empleado,Ramo de seguro , Control de incapacidad";
    var subCampo = "@(Select CASE WHEN reg.ramoSeguro = 0 THEN 'Riesgo de trabajo' WHEN reg.ramoSeguro=1 THEN 'Enfermedad general'  ELSE 'Maternidad' END from RegistroIncapacidad reg where reg.id = o.id)";
    var subCampo2 = "@(Select CASE WHEN reg.controlIncapacidad = 0 THEN 'Ninguno' WHEN reg.controlIncapacidad=1 THEN 'Única' WHEN reg.controlIncapacidad=2 THEN 'Inicial' WHEN reg.controlIncapacidad=3 THEN 'Subsecuente'"+
    "  WHEN reg.controlIncapacidad = 4 THEN 'Alta médica o ST2' WHEN reg.controlIncapacidad = 5 THEN 'Valuación o ST3' WHEN reg.controlIncapacidad = 6 THEN 'Defunción o ST3' WHEN reg.controlIncapacidad = 7 THEN 'Prenatal'" +
    " WHEN reg.controlIncapacidad = 8 THEN 'Enlace' ELSE 'Postnatal' END from RegistroIncapacidad reg where reg.id = o.id)";
    campos = "clave,empleados.nombre," + subCampo + "," + subCampo2;
    //o0,01,02,03
    var subEntities = "empleados";

    //camposMostrar = ["clave", "puestos.descripcion"];

    /*var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);*/
    //var preFilters = { "razonesSociales.id": razonSocialActual.id }; 

    var preFilters = {};
    var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de plaza", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };

    return buildTableSearch(nameCmp, title, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch);
}

function selectorRegistrarIncapShow(val) {
    searchRegIncap(val[0]);


    //alert(val);
}

function limpiarIcapacidades() {
    document.getElementById("txtFolio").value = "";
    document.getElementById("selRamoSeguro").value = "";
    document.getElementById("selTipoRiesgo").value = "";
    document.getElementById("selSecuelaConsecuencia").value = "";
    document.getElementById("selControlIncapacidad").value = "";
    document.getElementById("dpFechaInicio").value = "";
    document.getElementById("txtDiasIncapacidad").value = "";
    document.getElementById("dpFechaFinal").value = "";
    document.getElementById("ckbPagar3PrimerDias").checked = false;
    clearEdit("editEmpleados");
    clearEdit("editIncapacidad");
    clearTable("contTable");
    InitEventsTable();
    document.getElementById("btnGuarda").style.display = "inline-block";
    document.getElementById("btnActualizar").style.display = "none";
    document.getElementById("btnEliminar").style.display = "none";
    //generarClaveIncapacidad();
}

//function textformateaValorAMascara(valor, mascara) {
//    var dato = "";
//    var obj = {};
//    obj.valor = valor;
//    var sub = mascara.substring(0, mascara.length - valor.toString().length);
//    sub = sub.replace(/#/g, '0');
//    //console.log(sub);
//    mascara = sub + mascara.substring(mascara.length - valor.toString().length, mascara.length);
//    // console.log(mascara);

//    obj.mascara = mascara;
//    var url = route + "/api/RegistrarIncapacidades/txtFormatearMask";
//    var dataToPost = JSON.stringify(obj);
//    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);

//    if (Mensaje !== "") {
//        dato = Mensaje;
//        //    key = Mensaje.resultado;
//        //    if (key === "") {
//        //        key = 1;
//        //    } else {
//        //        key = generaClaveMax(key);
//        //    }

//    } else {
//        console.log("no hay datos");
//    }

//    return dato;
//}