var fechaSistemasRegCred;
var razonSocialActual;
var listaConfigCreditos = new Array();
var modoDescuentoCredito = -1;
var manejarSubcuenta = false;
var generaNumCredito = true;
var asignacionConsecutiva = true;
var tipoCredito = null;
var deleteCreditos = new Array();
var listaCredEmplNewYMod = new Array();
var dataRegCred = new Array();
var tipoNomina = {};
var periodoNomina = {};
var ejercicio = 2020;
var fechaInicial;
var fechaFinal;
var empleados;
var start = 0;
var end = 10;
var valorInicialCred = null;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    startCustomTools();
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    fechaSistemasRegCred = getFechaSistema();
    var fecha = formatDate(fechaSistemasRegCred);
    document.getElementById("dpFecha").value = fecha;
    getRazonSocialActualRegCredito();
    var obj = JSON.parse($("#container").data("opener"));
    llenarSelPrinc();
    if (obj.valorIni) {
        
        document.getElementById("selTipoDecredito").value = obj.valorIni.toString();
        // var val = document.getElementById("selTipoDecredito");
        var text = $("#selTipoDecredito").find('option[value=' + document.getElementById("selTipoDecredito").value + ']').text();
        text = text.split("-");
        valorInicialCred = text[0];
        document.getElementById("selTipoDecredito").disabled = true;
        valorSelecionadoTipoCred(obj.valorIni.toString());
    }
});

function getRazonSocialActualRegCredito() {
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);

    var url = route + "/api/RegistrosCreditos/getRazonSocialPorID";
    var dataToPost = JSON.stringify(razon.id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        razonSocialActual = Mensaje.resultado;
    }
    // console.log(razonSocialActual);
    // return razonSocialActual;

}

function getConfigCreditos() {
    var obj = {};
    obj.claveRazon = razonSocialActual.clave;
    obj.tipoConfiguracion = "1";

    var url = route + "/api/RegistrosCreditos/getConfigCreditos";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
      return Mensaje.resultado;
        //for (var i = 0; i < listaConfigCreditos.length; i++) {
        //    $('#selTipoDecredito').append('<option value=' + listaConfigCreditos[i].id + '>' + listaConfigCreditos[i].clave + "-" + listaConfigCreditos[i].descripcion + '</option>');
        //}
    }

    // console.log(listaConfigCreditos);
}

function llenarSelPrinc() {
    listaConfigCreditos = getConfigCreditos();
    for (var i = 0; i < listaConfigCreditos.length; i++) {
        $('#selTipoDecredito').append('<option value=' + listaConfigCreditos[i].id + '>' + listaConfigCreditos[i].clave + "-" + listaConfigCreditos[i].descripcion + '</option>');
    }
}

function llenarSelFilter(addcomp) {
    var creditos = getConfigCreditos();
    var optionVacio = document.createElement('option');
    optionVacio.value = "";
    optionVacio.innerHTML = "";
    addcomp.add(optionVacio);
    for (var i = 0; i < creditos.length; i++) {
        var option = document.createElement('option');
        option.value = creditos[i].clave;
        option.innerHTML = creditos[i].clave + "-" + creditos[i].descripcion;
        /// $('#' + addcomp.id).append('<option value=' + creditos[i].clave + '>' + creditos[i].clave + "-" + creditos[i].descripcion + '</option>');
        addcomp.add(option);
    }

    if (valorInicialCred !== null) {
        //$(addcomp.id).val(valorInicialCred);
        addcomp.value = valorInicialCred;
        addcomp.disabled = true;

    }

    return addcomp;
}

function valorSelecionadoTipoCred(valor) {

    if (valor !== "") {
        BuscaPrestamos();
    } else {
        dataRegCred = new Array();
        var element = document.getElementById('contTable');
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        OpenTable(document.getElementById('contTable'));
        InitEventsTable();
    }


    //console.log(fecha);
    //console.log(tipoCredito);
}

function BuscaPrestamos() {
    if (document.getElementById('selTipoDecredito').value !== "" && typeof document.getElementById('dpFecha').value !== 'undefined') {
        var id = parseInt(document.getElementById('selTipoDecredito').value);
        for (var i = 0; i < listaConfigCreditos.length; i++) {
            if (id === listaConfigCreditos[i].id) {
                tipoCredito = listaConfigCreditos[i];
                break;
            }
        }
        if (tipoCredito !== null) {
            asignacionConsecutiva = tipoCredito.asignaAutoNumCredAho;
            var fecha = new Date(formantDdMmYyyy(document.getElementById("dpFecha").value));
            dataRegCred = new Array();
            addCreditos = new Array();
            deleteCreditos = new Array();
            var listaAux = getCredPorTipoCreditoYFecha(fecha, tipoCredito);
            for (var creditoEmpleado in dataRegCred) {//pendiente
                var plazaVigente = getPorEmpleYRazonSocialVigente(tipoCredito.empleados_ID);
            }

            
            if (listaAux.length > 0) {
                var element = document.getElementById('contTable');
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
                OpenTable(document.getElementById('contTable'));
                InitEventsTable();
                if (start === 0) {
                    createEditPagination(listaAux.length, "RegistroCreditos");
                }

                if (listaAux.length <= rowsByPage) {
                    end = listaAux.length;
                } else {
                    end = rowsByPage;
                }
                llenarTablaGen("RegistroCreditos", listaAux, start, end);

            } else {
                var element = document.getElementById('contTable');
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
                OpenTable(document.getElementById('contTable'));
                InitEventsTable();
                llenarTablaGen("RegistroCreditos", listaAux, 0, 0);
            }
      
           
        } else {
            var elemento = document.getElementById('contTable');
            while (elemento.firstChild) {
                elemento.removeChild(elemento.firstChild);
            }
            OpenTable(document.getElementById('contTable'));
            InitEventsTable();
        }
    } else {
        tipoCredito = null;
        dataRegCred = new Array();
        var elements = document.getElementById('contTable');
        while (elements.firstChild) {
            elements.removeChild(elements.firstChild);
        }
        OpenTable(document.getElementById('contTable'));
        InitEventsTable();

    }


}

function getCredPorTipoCreditoYFecha(fecha, tipCredito) {
    var listaAux = new Array();
    var obj = {};
    obj.fecha = fecha;
    obj.claveTipo = tipCredito.clave;
    obj.claveRazon = razonSocialActual.clave;
    obj.tipoConfig = tipoCredito.tipoConfiguracion;
    var url = route + "/api/RegistrosCreditos/getCredPorTipoCreditoYFecha";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        //for (var i = 0; i < Mensaje.resultado.length; i++) {
        //    var obje = {};
        //    obje.id = Mensaje.resultado[i].id;
        //    obje.cuentaContable = Mensaje.resultado[i].cuentaContable;
        //    obje.nombreEmpleado = Mensaje.resultado[i].empleados.apellidoPaterno + " " + Mensaje.resultado[i].empleados.apellidoMaterno + " " + Mensaje.resultado[i].empleados.nombre;
        //    obje.empleados_ID = Mensaje.resultado[i].empleados.clave;
        //    obje.fechaAutorizacion = formatDateddmmyyy(new Date(Mensaje.resultado[i].fechaAutorizacion));
        //    obje.fechaCredito = formatDateddmmyyy(new Date(Mensaje.resultado[i].fechaCredito));
        //    obje.fechaVence = formatDateddmmyyy(new Date(Mensaje.resultado[i].fechaVence));
        //    obje.inicioDescuento = formatDateddmmyyy(new Date(Mensaje.resultado[i].inicioDescuento));
        //    if (Mensaje.resultado[i].modoDescuentoCredito === 0) {
        //        var row = {};
        //        row.id = Mensaje.resultado[i].modoDescuentoCredito;
        //        row.descripcion = "Cuota Fija";
        //        obje.modoDescuento = row;
        //    } else if (Mensaje.resultado[i].modoDescuentoCredito === 1) {
        //        var row1 = {};
        //        row1.id = Mensaje.resultado[i].modoDescuentoCredito;
        //        row1.descripcion = "VSGM";
        //        obje.modoDescuento = row1;
        //    } else if (Mensaje.resultado[i].modoDescuentoCredito === 2) {
        //        var rows = {};
        //        rows.id = Mensaje.resultado[i].modoDescuentoCredito;
        //        rows.descripcion = "Porcentaje";
        //        obje.modoDescuento = rows;
        //    }
        //    obje.modoDescuentoCredito = Mensaje.resultado[i].modoDescuentoCredito;
        //    obje.montoDescuento = Mensaje.resultado[i].montoDescuento;
        //    obje.numeroCredito = Mensaje.resultado[i].numeroCredito;
        //    obje.numeroEmpleadoExtra = Mensaje.resultado[i].numeroEmpleadoExtra;
        //    obje.numeroParcialidades = Mensaje.resultado[i].numeroParcialidades;
        //    obje.periodosNomina_ID = Mensaje.resultado[i].periodosNomina.clave;
        //    obje.descripcionPerNom = Mensaje.resultado[i].periodosNomina.descripcion;
        //    obje.ejercicio = Mensaje.resultado[i].periodosNomina.año;
        //    obje.totalCredito = Mensaje.resultado[i].totalCredito;
        //    obje.razonesSociales_ID = Mensaje.resultado[i].razonesSociales_ID;
        //    listaAux[i] = obje;
        //}
        dataRegCred = Mensaje.resultado;
        listaAux =construirDatosTbl();
    }
    return listaAux;
}

function construirDatosTbl() {
    var listaAux = new Array();
    for (var i = 0; i < dataRegCred.length; i++) {
        var obje = {};
        obje.id = dataRegCred[i].id;
        obje.cuentaContable = dataRegCred[i].cuentaContable;
        obje.nombreEmpleado = dataRegCred[i].empleados.apellidoPaterno + " " + dataRegCred[i].empleados.apellidoMaterno + " " + dataRegCred[i].empleados.nombre;
        obje.empleados_ID = dataRegCred[i].empleados.clave;
        obje.fechaAutorizacion = formatDateddmmyyy(new Date(dataRegCred[i].fechaAutorizacion));
        obje.fechaCredito = formatDateddmmyyy(new Date(dataRegCred[i].fechaCredito));
        obje.fechaVence = formatDateddmmyyy(new Date(dataRegCred[i].fechaVence));
        obje.inicioDescuento = formatDateddmmyyy(new Date(dataRegCred[i].inicioDescuento));
        if (dataRegCred[i].modoDescuentoCredito === 0) {
            var row = {};
            row.id = dataRegCred[i].modoDescuentoCredito;
            row.descripcion = "Cuota Fija";
            obje.modoDescuento = row;
        } else if (dataRegCred[i].modoDescuentoCredito === 1) {
            var row1 = {};
            row1.id = dataRegCred[i].modoDescuentoCredito;
            row1.descripcion = "VSGM";
            obje.modoDescuento = row1;
        } else if (dataRegCred[i].modoDescuentoCredito === 2) {
            var rows = {};
            rows.id = dataRegCred[i].modoDescuentoCredito;
            rows.descripcion = "Porcentaje";
            obje.modoDescuento = rows;
        }
        obje.modoDescuentoCredito = dataRegCred[i].modoDescuentoCredito;
        obje.montoDescuento = dataRegCred[i].montoDescuento;
        obje.numeroCredito = dataRegCred[i].numeroCredito;
        obje.numeroEmpleadoExtra = dataRegCred[i].numeroEmpleadoExtra;
        obje.numeroParcialidades = dataRegCred[i].numeroParcialidades;
        obje.periodosNomina_ID = dataRegCred[i].periodosNomina.clave;
        obje.descripcionPerNom = dataRegCred[i].periodosNomina.descripcion;
        obje.ejercicio = dataRegCred[i].periodosNomina.año;
        obje.totalCredito = dataRegCred[i].totalCredito;
        obje.razonesSociales_ID = dataRegCred[i].razonesSociales_ID;
        listaAux[i] = obje;
    }

    return listaAux;
}

function getPorEmpleYRazonSocialVigente(claveEmpleado) {
    var plaza = {};
    var obj = {};
    obj.claveEmpleado = claveEmpleado;
    obj.claveRazonSocial = razonSocialActual.clave;
    var url = route + "/api/RegistrosCreditos/getPorEmpleYRazonSocialVigente";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        plaza = Mensaje.resultado;

    }
    return plaza;
}

function generateNumCreditoEmpelado() {
    var obj = {};
    var key;
    obj.fuentePrincipal = "CreditoPorEmpleado";
    obj.campo = "numeroCredito";

    obj.camposWhere = ["razonesSociales.id", "creditoAhorro.id"];
    obj.valoresWhere = [razonSocialActual.id, tipoCredito === null ? 0 : tipoCredito.id];


    var url = route + "/api/Generic/obtenerClaveStringMax";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.error === "") {
        key = Mensaje.resultado;
        if (key === "") {
            key = 1;
        } else {
            key = generaClaveMax(key);
        }

    } else {
        console.log(Mensaje.error);
    }

    return key;
}

function setEditEmpleadosDetalle() {

    nameCmp = "EditEmpleadosDetalle";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionadoCol.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "Clave, Nombre, Apellido Paterno, Apellido Materno,Nombre abreviado";
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";

    camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razonSocialActual.id };

    // //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecial";
    var fecha = formatDatemmddyyy(fechaSistemasRegCred);
    //var camposWhereEsp = "";
    var valoreswhereEsp = [razonSocialActual.clave, null, new Date(fecha), new Date(fecha)];
    var optionals = { "queryEspecial": queryEspecial, "valoreswhereEsp": valoreswhereEsp };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
         typeof optionals === 'undefined' ? "" : optionals);

}

function setEditEmpleadosDetalleShow(value) {
    if (value !== null) {
        var obj = value[0];
        empleados = obj[1];
        tipoNomina = obj[0];
        idResult = empleados.id;
        nombreDatoSecu = "nombreEmpleado";
        datoSecundario = empleados.apellidoPaterno + " " + empleados.apellidoMaterno + " " + empleados.nombre;
        //var plaza = getPorEmpleYRazonSocialVigente(idempleado);
        //plaza = plaza == null ? new Array() : plaza;
        //console.log(plaza);
        //if (plaza.length > 0) {
        //    var fecha = null;
        //    for (var i = 0; i < plaza.length; i++) {
        //        if (plaza[i].plazasPorEmpleado.plazaPrincipal) {
        //            fecha = new Date(plazasPorEmpleadosMov.fechaInicial);
        //            break;
        //        } else {
        //            fecha = new Date(plazasPorEmpleadosMov.fechaInicial);
        //        }
        //    }

        //    if (fecha == null) {
        //        alert("No puedes capturar crédito con fecha anterior a su fecha de ingreso");
        //    } else if (new Date(formantDdMmYyyy(document.getElementById("dpFecha").value.toString())) < fecha) {
        //        alert("No puedes capturar crédito con fecha anterior a su fecha de ingreso");
        //    }

        //} else {
        //    alert("No puedes capturar crédito con fecha anterior a su fecha de ingreso");
        //}

        ////if (!(emp.getClave().equals(cData.getEmpleados() == null ? "" : cData.getEmpleados().getClave()))) {
        ////    cData.setPeriodosNomina(null);
        ////}pendiente

        //var timbre = false;
        if (tipoCredito.inicioDescuento) {
            var fechaActual = new Date(formantDdMmYyyy(document.getElementById("dpFecha").value.toString()));
            ejercicio = fechaActual.getFullYear();
            periodoNomina = getPeriodoNominaActual(tipoNomina.clave, fechaActual);
            if (typeof periodoNomina !== 'undefined') {
                ejercicio = periodoNomina.año;
            }
        }

        if (classNameBlur) {
            var tdClave = renglon.querySelector("td[persist=empleados_ID]");
            var txtclave = tdClave.firstElementChild.firstElementChild;
            tdClave.appendChild(document.createTextNode(txtclave.value));
            txtclave.value = "";
            tdClave.firstElementChild.style.display = "none";
            var tddescripcion = renglon.querySelector("td[persist=nombreEmpleado]");
            tddescripcion.appendChild(document.createTextNode(datoSecundario));


            if (prevalidacionAddRow(renglon)) {
                var nametable = renglon.parentNode.parentNode.id;
                var nameBody = renglon.parentNode.id;
                var rowTr = renglon;
                var obj2 = [nametable, nameBody, rowTr];
                tableAdd(obj2);
            }
            $(tdClave).nextAll('td[contenteditable=true]:first').focus();
        }
    }
}

function setEditPeriodoinicialDetalle() {

    //Parameters
    nameCmp = "EditPeriodoinicialDetalle";
    table = "PeriodosNomina";
    nameCols = idiomaSelecionado.messageFormatter("PeriodosNominaClave")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaDescripcion")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaFechaInicial")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaFechaFinal")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaFechaCierre")();
    //nameCols = "Clave,Descripción,Fecha inicial, Fecha final, Fecha cierre";
    campos = "clave,descripcion,año";
    camposObtener = "clave,descripcion,año,fechaAsistenciInicial,fechaAsistenciaFinal,status";
    var subEntities = "tipoNomina";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Periodos Nomina";
    var tamañoSel = "size-4";
    var id = tipoNomina.id;
    var preFilters = { "tipoNomina.id": id, "año": ejercicio };

    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de plaza", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditPeriodoinicialDetalleShow(value) {
    if (value !== null) {
        var obj = value[0];
        periodoNomina = value[0];
        idResult = periodoNomina.Id;
        nombreDatoSecu = "descripcionPerNom";
        datoSecundario = periodoNomina.Descripcion;

        if (classNameBlur) {
            var tdClave = renglon.querySelector("td[persist=periodosNomina_ID]");
            var txtclave = tdClave.firstElementChild.firstElementChild;
            tdClave.appendChild(document.createTextNode(txtclave.value));
            txtclave.value = "";
            tdClave.firstElementChild.style.display = "none";
            var tddescripcion = renglon.querySelector("td[persist=descripcionPerNom]");
            tddescripcion.appendChild(document.createTextNode(datoSecundario));


            if (prevalidacionAddRow(renglon)) {
                var nametable = renglon.parentNode.parentNode.id;
                var nameBody = renglon.parentNode.id;
                var rowTr = renglon;
                var obj2 = [nametable, nameBody, rowTr];
                tableAdd(obj2);
            }
            $(tdClave).nextAll('td[contenteditable=true]:first').focus();
        }
        //document.getElementById('txtPeriodoNominaDetalle').value = obj.Descripcion;
        fechaInicial = periodoNomina.FechaAsistenciInicial;
        fechaFinal = periodoNomina.FechaAsistenciaFinal;
        //document.getElementById('txtDelaFecha').value = formatDatemmddyyy(new Date(obj.FechaAsistenciInicial));
        //document.getElementById('txtAlaFecha').value = formatDatemmddyyy(new Date(obj.FechaAsistenciaFinal));
        //document.getElementById('txtDelaFechaDetalle').value = formatDatemmddyyy(new Date(obj.FechaAsistenciInicial));
        //document.getElementById('txtAlaFechaDetalle').value = formatDatemmddyyy(new Date(obj.FechaAsistenciaFinal));
        //statusPeriodo = obj.Status;
        //valorSeleccionado();
    }
}

function setEjercicio(values) {

    ejercicio = parseInt(values[0]);
}

function formatearNumCredito(values) {
    var mascara = tipoCredito.mascaraNumCredAho;
    valor = textformateaValorAMascara(parseInt(values[0]), mascara);
    var tdnum = values[1].querySelector("td[persist=numeroCredito]");
    $(tdnum).contents().filter(function () {
        return this.nodeType === 3; //Node.TEXT_NODE
    }).remove();

    tdnum.appendChild(document.createTextNode(valor));
    //console.log(values);
}

///metodos para la tabla
function editTableRegCredito() {

    var nameTable = "RegistroCreditos";
    var nameCols = crearListaColumnas();
    var activaAdd = true;
    var activaDelete = true;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function crearListaColumnas() {
    var columnasTabla = new Array();
    if (tipoCredito === null) {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("CreditoNumCred")(), "nombreCompo": "Nocrédito", "editable": false, "tipoCompon": "text", "persist": "numeroCredito", "ancho": "105px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblEmpleado")(), "nombreCompo": "Empleados", "editable": false, "text": "edit", "persist": "empleados_ID", "ancho": "55px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblNombre")(), "nombreCompo": "Nombre", "editable": false, "tipoCompon": "text", "persist": "nombreEmpleado", "ancho": "260px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblNumEmpleado")(), "nombreCompo": "Noempleado", "editable": false, "tipoCompon": "text", "persist": "numEmpleado", "ancho": "150px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblEjercicio")(), "nombreCompo": "Ejercicio", "editable": false, "tipoCompon": "text", "persist": "ejercicio", "ancho": "100px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblPeriodoInicial")(), "nombreCompo": "Periodoinicial", "editable": false, "tipoCompon": "text", "persist": "periodosNomina_ID", "ancho": "140px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblDescripcion")(), "nombreCompo": "Descripcion", "editable": false, "tipoCompon": "text", "persist": "descripcionPerNom", "ancho": "300px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblIniciDesc")(), "nombreCompo": "InicioDesc", "editable": false, "tipoCompon": "text", "persist": "inicioDescuento", "ancho": "130px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroTblCreditoTotal")(), "nombreCompo": "Créditototal", "editable": false, "tipoCompon": "text", "persist": "creditoTotal", "ancho": "130px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblModDesc")(), "nombreCompo": "ModoDesc", "editable": false, "tipoCompon": "text", "persist": "modoDescuento", "ancho": "130px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblNumParcial")(), "nombreCompo": "Noparcialidades", "editable": false, "tipoCompon": "text", "persist": "numParcialidades", "ancho": "170px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblImporte")(), "nombreCompo": "Importe", "editable": false, "tipoCompon": "text", "persist": "importe", "ancho": "130px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblFecVenc")(), "nombreCompo": "FechaVenc", "editable": false, "tipoCompon": "text", "persist": "fechaVencimiento", "ancho": "150px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblFechaAut")(), "nombreCompo": "FechaAutorizacion", "editable": false, "tipoCompon": "text", "persist": "fechaAutorizacion", "ancho": "188px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblCtaContable")(), "nombreCompo": "Ctacontable", "editable": false, "tipoCompon": "text", "persist": "ctaContable", "ancho": "130px" });
    } else {

        if (tipoCredito.asignaAutoNumCredAho) {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("CreditoNumCred")(), "nombreCompo": "Nocrédito", "editable": false, "tipoCompon": "text", "persist": "numeroCredito", "ancho": "105px", "funcion": "" });
        } else {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("CreditoNumCred")(), "nombreCompo": "Nocrédito", "editable": true, "tipoCompon": "text", "persist": "numeroCredito", "ancho": "105px", "funcion": "formatearNumCredito" });
        }
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblEmpleado")(), "nombreCompo": "Empleados", "editable": true, "tipoCompon": "editConsulta", "persist": "empleados_ID", "ancho": "medium-0" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblNombre")(), "nombreCompo": "Nombre", "editable": false, "tipoCompon": "text", "persist": "nombreEmpleado", "ancho": "260px" });
        if (tipoCredito.longitudNumEmp !== "") {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblNumEmpleado")(), "nombreCompo": "Noempleado", "editable": true, "tipoCompon": "text", "persist": "numeroEmpleadoExtra", "ancho": "100px" });
        }

        if (!tipoCredito.inicioDescuento) {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblIniciDesc")(), "nombreCompo": "InicioDesc", "editable": true, "tipoCompon": "date", "persist": "inicioDescuento", "ancho": "65px" });
        } else {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblEjercicio")(), "nombreCompo": "Ejercicio", "editable": true, "tipoCompon": "text", "persist": "ejercicio", "ancho": "55px", "funcion": "setEjercicio" },
                { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblPeriodoInicial")(), "nombreCompo": "Periodoinicial", "editable": true, "tipoCompon": "editConsulta", "persist": "periodosNomina_ID", "ancho": "small-0" },
                { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblDescripcion")(), "nombreCompo": "Descripcion", "editable": false, "tipoCompon": "text", "persist": "descripcionPerNom", "ancho": "300px" });
        }
        if (tipoCredito.capturarCreditoTotal) {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroTblCreditoTotal")(), "nombreCompo": "Créditototal", "editable": true, "tipoCompon": "text", "persist": "totalCredito", "ancho": "65px" });
        }

        if (tipoCredito.modoDescuento === 1) {
            var conactena = "";
            if (tipoCredito.porcentaje) {
                conactena = "P";
            }
            if (tipoCredito.vsmg) {
                if (conactena !== "") {
                    conactena = conactena + "V";
                } else {
                    conactena = "V";
                }
            }
            if (tipoCredito.cuotaFija) {
                if (conactena !== "") {
                    conactena = conactena + "C";
                } else {
                    conactena = "C";
                }
            }

            if (conactena.length === 1) {

                if (conactena === "P") {
                    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblPorcentaje")(), "nombreCompo": "Porcentaje", "editable": true, "tipoCompon": "text", "persist": "montoDescuento", "ancho": "65px" });
                    modoDescuentoCredito = 2;
                } else if (conactena === "V") {
                    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblVSM")(), "nombreCompo": "VSM", "editable": true, "tipoCompon": "text", "persist": "montoDescuento", "ancho": "65px" });
                    modoDescuentoCredito = 1;
                } else if (conactena === "C") {
                    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblImporteFijo")(), "nombreCompo": "Importefijo", "editable": true, "tipoCompon": "text", "persist": "montoDescuento", "ancho": "65px" });
                    modoDescuentoCredito = 0;
                }

            } else {
                var valores = new Array();
                if (tipoCredito.porcentaje) {
                    valores.push({ "id": "2", "descripcion": "Porcentaje" });
                }
                if (tipoCredito.vsmg) {
                    valores.push({ "id": "1", "descripcion": "VSMG" });
                }
                if (tipoCredito.cuotaFija) {
                    valores.push({ "id": "0", "descripcion": "Cuota Fija" });
                }

                columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblModDesc")(), "nombreCompo": "ModoDesc", "editable": true, "tipoCompon": "select", "persist": "modoDescuento", "ancho": "65px", "data": valores },
                    { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblImporte")(), "nombreCompo": "Importe", "editable": true, "tipoCompon": "text", "persist": "montoDescuento", "ancho": "65px" });
            }
            conactena = "";
        } else if (tipoCredito.modoDescuento === 2) {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblNumParcial")(), "nombreCompo": "Noparcialidades", "editable": false, "tipoCompon": "text", "persist": "numeroParcialidades", "ancho": "80px" });
        }

        if (tipoCredito.solicitarFecVen) {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblFecVenc")(), "nombreCompo": "FechaVenc", "editable": true, "tipoCompon": "date", "persist": "fechaVence", "ancho": "65px" });
        }
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblFechaAut")(), "nombreCompo": "FechaAutorizacion", "editable": true, "tipoCompon": "date", "persist": "fechaAutorizacion", "ancho": "120px" });
        if (manejarSubcuenta) {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblCtaContable")(), "nombreCompo": "Ctacontable", "editable": false, "tipoCompon": "text", "persist": "cuentaContable", "ancho": "65px" });
        }
    }


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
    }
    if (exito) {

        var $clone = $('#' + valores[0]).find('tr.hide').clone(true).removeClass('hide table-line');
        $clone[0].setAttribute("class", "hidetd");
        $clone.className = "hidetd";
        // $clone.id = rString;
        var edit = $clone[0].querySelectorAll(".edit");
        if (edit) {
            for (var i = 0; i < edit.length; i++) {
                edit[i].removeAttribute("value");
                edit[i].querySelector(".editKey").value = "";
            }
        }
        if (asignacionConsecutiva) {
            var txtNoCredito = $clone[0].querySelector("td[persist=numeroCredito]");
            var valor;
            var mascara = tipoCredito.mascaraNumCredAho;
            if (dataRegCred.length === 0) {
                var numCredito = generateNumCreditoEmpelado();
                valor = textformateaValorAMascara(numCredito, mascara);
            } else {
                var numCreditos = generaClaveMax(dataRegCred[dataRegCred.length - 1].numeroCredito);
                valor = textformateaValorAMascara(numCreditos, mascara);
            }
            txtNoCredito.appendChild(document.createTextNode(valor));
        }

        $('#' + valores[1]).append($clone);
    }
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
        agregarCreditoEmpleado(obj);
    } else {
        obj['id'] = tr.id;
        actualizarCreditoEmpleado(obj);
    }

}

function tableRemove(registro) {

    var id = registro.id;
    if (parseInt(id)) {
        for (var i = 0; i < dataRegCred.length; i++) {
            if (dataRegCred[i].id === parseInt(id)) {
                dataRegCred.splice(i, 1);
                break;
            }
        }
        //for (var i = 0; i < listaAsistNuevosYMod.length; i++) {
        //    if (listaAsistNuevosYMod[i].id === parseInt(id)) {
        //        listaAsistNuevosYMod.splice(i, 1);
        //        break;
        //    }
        //}
        deleteCreditos[deleteCreditos.length] = parseInt(id);

    } else {
        for (var j = 0; j < dataRegCred.length; j++) {
            if (dataRegCred[j].id === id) {
                dataRegCred.splice(j, 1);
                break;
            }
        }
    }

    var element = document.getElementById('contTable');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    var listaAux = construirDatosTbl();
    if (listaAux.length > 0) {
        start = 0;
        if (start === 0) {
            createEditPagination(listaAux.length, "RegistroCreditos");
        }



        if (listaAux.length <= rowsByPage) {
            end = listaAux.length;
        } else {
            end = rowsByPage;
        }
        llenarTablaGen("RegistroCreditos", listaAux, start, end);
    }
    //  alert("eliminado" + ".- " + name.id);
}

function cambiarPagina(valores) {
    //alert(valores);
    var tbl = valores['origen'];
    end = rowsByPage;
    start = valores['fromPage'];
    if (dataRegCred.length > rowsByPage) {
        var res = (rowsByPage + start) - dataRegCred.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = dataRegCred.length;
    }
    var listaAux = construirDatosTbl();
    llenarTablaGen("RegistroCreditos", listaAux,start, end);
}


//end metodos

function getPeriodoNominaActual(claveTipoNomina, fecha) {
    var periodosNomina;
    var obj = {};
    obj.claveNomina = claveTipoNomina;
    obj.claveTipoCorrida = "PER";
    obj.fecha = fecha;

    var url = route + "/api/RegistrosCreditos/getPeriodosNominaPorFechaTipoNominaCorridaEnti";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert();
    } else {
        periodoNomina = Mensaje.resultado;
        fechaInicial = periodoNomina.fechaInicial;
        fechaFinal = periodoNomina.fechaFinal;
    }

    return periodoNomina;
}

function textformateaValorAMascara(valor, mascara) {
    var dato = "";
    var obj = {};
    obj.valor = valor;
    var sub = mascara.substring(0, mascara.length - valor.toString().length);
    sub = sub.replace(/#/g, '0');
    //console.log(sub);
    mascara = sub + mascara.substring(mascara.length - valor.toString().length, mascara.length);
    // console.log(mascara);

    obj.mascara = mascara;
    var url = route + "/api/RegistrosCreditos/txtFormatearMask";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);

    if (Mensaje !== "") {
        dato = Mensaje;
        //    key = Mensaje.resultado;
        //    if (key === "") {
        //        key = 1;
        //    } else {
        //        key = generaClaveMax(key);
        //    }

    } else {
        console.log("no hay datos");
    }

    return dato;
}

function agregarCreditoEmpleado(valoresTabla) {
    var obj = {};
    obj.id = valoresTabla.id;
    obj.fechaCredito = document.getElementById("dpFecha").value;
    obj.creditoAhorro_ID = tipoCredito.id;
    obj.numeroCredito = valoresTabla.numeroCredito;
    obj.empleados_ID = empleados.id;
    obj.razonesSociales_ID = razonSocialActual.id;


    if (tipoCredito.inicioDescuento) {
        if (valoresTabla.periodosNomina_ID) {
            obj.periodosNomina_ID = valoresTabla.periodosNomina_ID;
        } else {
            obj.periodosNomina_ID = null;
        }
    }

    if (valoresTabla.inicioDescuento) {
        obj.inicioDescuento = valoresTabla.inicioDescuento;

        getPeriodoNominaActual(tipoNomina.clave, valoresTabla.inicioDescuento);
        obj.periodosNomina_ID = periodoNomina.id;

    } else {
        obj.inicioDescuento = fechaFinal;
    }

    if (valoresTabla.totalCredito) {
        obj.totalCredito = valoresTabla.totalCredito;
    }

    if (valoresTabla.numeroEmpleadoExtra) {
        obj.numeroEmpleadoExtra = valoresTabla.numeroEmpleadoExtra;
    }

    if (valoresTabla.modoDescuento) {
        obj.modoDescuentoCredito = valoresTabla.modoDescuento;
    } else {
        obj.modoDescuentoCredito = modoDescuentoCredito;
    }

    if (valoresTabla.montoDescuento) {
        obj.montoDescuento = valoresTabla.montoDescuento;
    }

    if (valoresTabla.numeroParcialidades) {
        obj.numeroParcialidades = valoresTabla.numeroParcialidades;
    }

    if (valoresTabla.fechaVence) {
        obj.fechaVence = valoresTabla.fechaVence;
    } else {
        var fecha = new Date();
        fecha.setDate(fechaFinal);
        fecha.setFullYear(2120);
        obj.fechaVence = formatDatemmddyyy(fecha);
    }

    obj.fechaAutorizacion = valoresTabla.fechaAutorizacion;

    if (valoresTabla.cuentaContable) {
        obj.cuentaContable = valoresTabla.cuentaContable;
    }

    obj.statusFila = "NUEVO";
    dataRegCred[dataRegCred.length] = obj;
       var listaAux = construirDatosTbl();
    
        //var element = document.getElementById('contTable');
        //while (element.firstChild) {
        //    element.removeChild(element.firstChild);
        //}
        //OpenTable(document.getElementById('contTable'));
        //InitEventsTable();
        //if (start === 0) {
        //    createEditPagination(listaAux.length, "RegistroCreditos");
        //}

        if (listaAux.length <= rowsByPage) {
            end = listaAux.length;
        } else {
            end = rowsByPage;
        }
        llenarTablaGen("RegistroCreditos", listaAux, start, end);


}

function actualizarCreditoEmpleado(valoresTabla) {
    var creditoEmpleadoAux = {};
    if (parseInt(valoresTabla.id)) {
        for (var i = 0; i < dataRegCred.length; i++) {
            if (dataRegCred[i].id === parseInt(valoresTabla.id)) {
                creditoEmpleadoAux = dataRegCred[i];
                creditoEmpleadoAux.fechaCredito = document.getElementById("dpFecha").value;

                if (valoresTabla.empleados_ID) {
                    creditoEmpleadoAux.empleados_ID = empleados.id;
                }

                // creditoEmpleadoAux.modoDescuentoCredito = modoDescuentoCredito;

                if (tipoCredito.inicioDescuento) {
                    if (valoresTabla.periodosNomina_ID) {
                        creditoEmpleadoAux.periodosNomina_ID = valoresTabla.periodosNomina_ID;
                        //creditoEmpleadoAux.inicioDescuento = periodoNomina.fechaFinal;
                    }
                } else {
                    if (periodoNomina) {
                        creditoEmpleadoAux.periodosNomina_ID = periodoNomina.id;
                    }

                }

                if (valoresTabla.inicioDescuento) {
                    creditoEmpleadoAux.inicioDescuento = valoresTabla.inicioDescuento;
                } else {
                    if (fechaFinal) {
                        creditoEmpleadoAux.inicioDescuento = fechaFinal;
                    }
                }

                if (valoresTabla.totalCredito) {
                    creditoEmpleadoAux.totalCredito = valoresTabla.totalCredito;
                }

                if (valoresTabla.numeroEmpleadoExtra) {
                    creditoEmpleadoAux.numeroEmpleadoExtra = valoresTabla.numeroEmpleadoExtra;
                }

                if (valoresTabla.modoDescuento) {
                    creditoEmpleadoAux.modoDescuentoCredito = valoresTabla.modoDescuento;
                } else {
                    creditoEmpleadoAux.modoDescuentoCredito = modoDescuentoCredito;
                }

                if (valoresTabla.montoDescuento) {
                    creditoEmpleadoAux.montoDescuento = valoresTabla.montoDescuento;
                }

                if (valoresTabla.numeroParcialidades) {
                    creditoEmpleadoAux.numeroParcialidades = valoresTabla.numeroParcialidades;
                }

                if (valoresTabla.fechaVence) {
                    creditoEmpleadoAux.fechaVence = valoresTabla.fechaVence;
                } else {
                    if (fechaFinal) {
                        var fecha = new Date();
                        fecha.setDate(fechaFinal);
                        fecha.setFullYear(2120);
                        creditoEmpleadoAux.fechaVence = formatDatemmddyyy(fecha);
                    }
                }

                creditoEmpleadoAux.fechaAutorizacion = valoresTabla.fechaAutorizacion;

                if (valoresTabla.cuentaContable) {
                    creditoEmpleadoAux.cuentaContable = valoresTabla.cuentaContable;
                }
                creditoEmpleadoAux.statusFila = "MODIFICADOBDS";
                dataRegCred[i] = creditoEmpleadoAux;
                break;
            }
        }
    } else {
        for (var j = 0; j < dataRegCred.length; j++) {
            if (dataRegCred[j].id === valoresTabla.id) {
                creditoEmpleadoAux = dataRegCred[j];
                creditoEmpleadoAux.fechaCredito = document.getElementById("dpFecha").value;

                creditoEmpleadoAux.empleados_ID = valoresTabla.empleados_ID;

                // creditoEmpleadoAux.modoDescuentoCredito = modoDescuentoCredito;

                if (tipoCredito.inicioDescuento) {
                    if (valoresTabla.periodosNomina_ID) {
                        creditoEmpleadoAux.periodosNomina_ID = valoresTabla.periodosNomina_ID;
                    }
                } else {
                    creditoEmpleadoAux.periodosNomina_ID = periodoNomina.id;
                }

                if (valoresTabla.inicioDescuento) {
                    creditoEmpleadoAux.inicioDescuento = valoresTabla.inicioDescuento;
                }

                if (valoresTabla.totalCredito) {
                    creditoEmpleadoAux.totalCredito = valoresTabla.totalCredito;
                }

                if (valoresTabla.numeroEmpleadoExtra) {
                    creditoEmpleadoAux.numeroEmpleadoExtra = valoresTabla.numeroEmpleadoExtra;
                }

                if (valoresTabla.modoDescuento) {
                    creditoEmpleadoAux.modoDescuentoCredito = valoresTabla.modoDescuento;
                } else {
                    creditoEmpleadoAux.modoDescuentoCredito = modoDescuentoCredito;
                }

                if (valoresTabla.montoDescuento) {
                    creditoEmpleadoAux.montoDescuento = valoresTabla.montoDescuento;
                }

                if (valoresTabla.numeroParcialidades) {
                    creditoEmpleadoAux.numeroParcialidades = valoresTabla.numeroParcialidades;
                }

                if (valoresTabla.fechaVence) {
                    creditoEmpleadoAux.fechaVence = valoresTabla.fechaVence;
                }

                creditoEmpleadoAux.fechaAutorizacion = valoresTabla.fechaAutorizacion;

                if (valoresTabla.cuentaContable) {
                    creditoEmpleadoAux.cuentaContable = valoresTabla.cuentaContable;
                }
                creditoEmpleadoAux.statusFila = "MODIFICADOBDS";
                dataRegCred[j] = creditoEmpleadoAux;
                break;
            }
        }
    }
    var listaAux = construirDatosTbl();

    if (listaAux.length <= rowsByPage) {
        end = listaAux.length;
    } else {
        end = rowsByPage;
    }
    llenarTablaGen("RegistroCreditos", listaAux, start, end);
    //console.log(dataRegCred);
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function saveCreditoPorEmpleado() {
    var obj = {};

    for (var i = 0; i < dataRegCred.length; i++) {
        if (dataRegCred[i].statusFila === "NUEVO" || dataRegCred[i].statusFila === "MODIFICADOBDS") {
            listaCredEmplNewYMod[listaCredEmplNewYMod.length] = dataRegCred[i];
        }
    }
    limpiarAhorroAntesDeSave();
    obj["SaveUpdate"] = listaCredEmplNewYMod;

    if (deleteCreditos.length > 0) {
        obj["Delete"] = deleteCreditos;
    }

    var url = route + "/api/RegistrosCreditos/saveCreditoEmpleado";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiarAhorro();
    } else {
        limpiarAhorro();
    }
}

function limpiarAhorroAntesDeSave() {

    for (var i = 0; i < listaCredEmplNewYMod.length; i++) {
        // console.log(new Date(listaAsistNuevosYMod[i].fecha));
        //listaAsistNuevosYMod[i].empleados = undefined;
        //listaAsistNuevosYMod[i].excepciones = undefined;
        //listaAsistNuevosYMod[i].centroDeCosto = undefined;
        //listaAsistNuevosYMod[i].fecha = new Date(listaAsistNuevosYMod[i].fecha);
        delete listaCredEmplNewYMod[i].statusFila;
        if (!Number.isInteger(listaCredEmplNewYMod[i].id)) {
            listaCredEmplNewYMod[i].id = 0;
        }
    }

}

function limpiarAhorro() {
     tipoCredito = null;
     deleteCreditos = [];
     listaCredEmplNewYMod = [];
     dataRegCred = [];
     tipoNomina = {};
     periodoNomina = {};
    document.getElementById("selTipoDecredito").value = "";
    var element = document.getElementById('contTable');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();


}

/*Table selector*/
function selectorRegistroCreditos() {

    //Parameters
    nameCmp = "selectorCatalogoRegistroCreditos";
    //if (tipoConfiguracion === 1) {
    //    title = "Configurar credito";
    //} else if (tipoConfiguracion === 2) {
    //    title = "Configurar Ahorros";
    //}
    title = "Creditos Por empleado";
    table = "CreditoPorEmpleado";
    nameCols = idiomaSelecionadoCol.messageFormatter("Empleadose")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionadoCol.messageFormatter("CreditoNumCred")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroAhorroFechaAhorro")() + "," +
        idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoImporte")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoDescuento")() + "," +
        idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoSaldo")();
   // nameCols = "Empleado,Nombre,No. Ahorro ,Fecha de Ahorro,Importe,Descuento,Saldo ";
    var subCampo = "@(select CASE WHEN (cr.tipoConfiguracion = '1') then (totalCredito + (select CASE WHEN (COUNT(*) = 0 ) THEN 0.0 ELSE" +
        " (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END)) END from CreditoMovimientos c where c.creditoPorEmpleado.id = o.id" +
        " AND c.tiposMovimiento = 3)) - (select CASE WHEN (COUNT(*) = 0 ) THEN 0.0 ELSE (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END))" +
        " END from CreditoMovimientos c where c.creditoPorEmpleado.id = o.id AND (c.tiposMovimiento = 1 or c.tiposMovimiento = 5)) else ((select CASE WHEN " +
        " (COUNT(*) = 0 ) THEN 0.0 ELSE (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END)) END from CreditoMovimientos c where " +
        " c.creditoPorEmpleado.id = o.id AND (c.tiposMovimiento = 1 or c.tiposMovimiento = 5))) - (select CASE WHEN (COUNT(*) = 0 ) THEN 0.0 ELSE" +
        " (SUM(CASE WHEN (c.importe is null) then 0.0 ELSE c.importe END)) END from CreditoMovimientos c where c.creditoPorEmpleado.id = o.id AND" +
        " c.tiposMovimiento = 3) end from CreditoPorEmpleado  c, CreditoAhorro cr where c.creditoAhorro.id=cr.id and c.id = o.id)";
    campos = ["empleados.clave","empleados.nombre","numeroCredito","fechaCredito","totalCredito","montoDescuento", subCampo];
    //o0,01,02,03
    var subEntities = "empleados,creditoAhorro";
    var preFilters= { };
    preFilters = setPreFilters();
    if (valorInicialAhorr !== null) {
        preFilters["creditoAhorro.clave#="] = valorInicialCred;
    }
    preFilters["creditoAhorro.tipoConfiguracion#="] = "1";
    /*var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);*/
    


    var filtersSearch = [];
    filtersSearch[0] = { "idcompo": "selTipoCreditoFilter", "etiqueta": "Tipo de credito", "tipo": "select", "campo": "creditoAhorro.clave", "medida": "s", "funcion": "llenarSelFilter", "operador": "#="  };
    filtersSearch[2] = { "idcompo": "editEmpleadosFilter", "etiqueta": "Empleado", "tipo": "editConsulta", "campo": "empleados.clave", "medida": "s", "dataedit": "EditEmpleadosFilter", "functedit": "setEditEmpleadosFilter", "operador": "#="  };
    //filtersSearch[3] = { "idcompo": "dpkFechaCred", "etiqueta": "Fecha de credito", "tipo": "date", "campo": "fechaCredito", "medida": "s" };

    var desactivarSel = true;

    return buildTableSearch(nameCmp, title, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof desactivarSel === 'undefined' ? false : desactivarSel);
}

function selectorRegistrarIncapShow(val) {
    searchRegIncap(val[0]);


    //alert(val);
}

function setEditEmpleadosFilter() {

    nameCmp = "EditEmpleadosFilter";
    table = "PlazasPorEmpleadosMov";
    nameCols = "Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    camposObtener = "[]plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";

    camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];

    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razonSocialActual.id };

    // //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecial";

    //var camposWhereEsp = "";
    var valoreswhereEsp = [razonSocialActual.clave, null, fechaSistemasRegCred, fechaSistemasRegCred];
    var optionals = { "queryEspecial": queryEspecial, "valoreswhereEsp": valoreswhereEsp };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener,
        typeof optionals === 'undefined' ? "" : optionals);

}

function setEditEmpleadosFilterShow(value) {
    if (value !== null) {
        var obj = value[0];
        empleados = obj[1];
      
    }
}