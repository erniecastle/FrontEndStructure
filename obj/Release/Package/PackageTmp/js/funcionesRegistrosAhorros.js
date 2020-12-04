var fechaSistemasRegAhorr;
var razonSocialActual;
var listaConfigAhorros = new Array();
var modoDescuentoAhorro = -1;///modoDescuentoCredito
var manejarSubcuenta = false;
var generaNumAhorro = true;
var asignacionConsecutiva = true;
var tipoAhorro = null;
var deleteAhorro = new Array();
var listaAhorrEmplNewYMod = new Array();
var dataRegAhorro = new Array();
var tipoNomina = {};
var periodoNomina = {};
var ejercicio = 2020;
var fechaInicial;
var fechaFinal;
var empleados;
var start = 0;
var end = 10;
var valorInicialAhorr;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    startCustomTools();
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    fechaSistemasRegAhorr = getFechaSistema();
    var fecha = formatDate(fechaSistemasRegAhorr);
    document.getElementById("dpFechaDeSolicitud").value = fecha;
    getRazonSocialActualRegAhorro();
    getConfigAhorro();
    var obj = JSON.parse($("#container").data("opener"));
    if (obj.valorIni) {

        document.getElementById("selAhorro").value = obj.valorIni.toString();
        // var val = document.getElementById("selTipoDecredito");
        var text = $("#selAhorro").find('option[value=' + document.getElementById("selAhorro").value + ']').text();
        text = text.split("-");
        valorInicialCred = text[0];
        document.getElementById("selAhorro").disabled = true;
        valorSelecionadoTipoAhorr(obj.valorIni.toString());
    }
});

function getRazonSocialActualRegAhorro() {
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);

    var url = route + "/api/RegistrosAhorros/getRazonSocialPorID";
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

function getConfigAhorro() {
    var obj = {};
    obj.claveRazon = razonSocialActual.clave;
    obj.tipoConfiguracion = "2";

    var url = route + "/api/RegistrosAhorros/getConfigAhorros";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        listaConfigAhorros = Mensaje.resultado;
        for (var i = 0; i < listaConfigAhorros.length; i++) {
            $('#selAhorro').append('<option value=' + listaConfigAhorros[i].id + '>' + listaConfigAhorros[i].clave + "-" + listaConfigAhorros[i].descripcion + '</option>');
        }
    }

    // console.log(listaConfigCreditos);
}

function valorSelecionadoTipoAhorr(valor) {
    if (valor !== "") {
        BuscaAhorros();
    } else {
        dataRegAhorro = new Array();
        var element = document.getElementById('contTable');
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        OpenTable(document.getElementById('contTable'));
        InitEventsTable();
    }
}

function BuscaAhorros() {
    if (document.getElementById("selAhorro").value !== "" && typeof document.getElementById("dpFechaDeSolicitud").value !== 'undefined') {
        var id = parseInt(document.getElementById("selAhorro").value);
        for (var i = 0; i < listaConfigAhorros.length; i++) {
            if (id === listaConfigAhorros[i].id) {
                tipoAhorro = listaConfigAhorros[i];
                break;
            }
        }
        if (tipoAhorro !== null) {
            asignacionConsecutiva = tipoAhorro.asignaAutoNumCredAho;
            var fecha = new Date(formantDdMmYyyy(document.getElementById("dpFechaDeSolicitud").value));
            dataRegAhorro = new Array();
            addAhorro = new Array();
            deleteAhorro = new Array();
            var listaAux = getCredPorTipoAhorroYFecha(fecha, tipoAhorro);
            for (var creditoEmpleado in dataRegAhorro) {//pendiente
                var plazaVigente = getPorEmpleYRazonSocialVigente(tipoAhorro.empleados_ID);
            }

            if (listaAux.length > 0) {
                var element = document.getElementById('contTable');
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
                OpenTable(document.getElementById('contTable'));
                InitEventsTable();
                if (start === 0) {
                    createEditPagination(listaAux.length, "RegistroAhorros");
                }

                if (listaAux.length <= rowsByPage) {
                    end = listaAux.length;
                } else {
                    end = rowsByPage;
                }
                llenarTablaGen("RegistroAhorros", listaAux, start, end);

            } else {
                var element = document.getElementById('contTable');
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
                OpenTable(document.getElementById('contTable'));
                InitEventsTable();
                llenarTablaGen("RegistroAhorros", listaAux, 0, 0);
            }
         


        } else {
            tipoAhorro = null;
            dataRegAhorro = new Array();
            var elements = document.getElementById('contTable');
            while (elements.firstChild) {
                elements.removeChild(elements.firstChild);
            }
            OpenTable(document.getElementById('contTable'));
            InitEventsTable();
        }
    } else {
        tipoAhorro = null;
        dataRegAhorro = new Array();
        var elemento = document.getElementById('contTable');
        while (elemento.firstChild) {
            elemento.removeChild(elemento.firstChild);
        }
        OpenTable(document.getElementById('contTable'));
        InitEventsTable();
    }
}

function getCredPorTipoAhorroYFecha(fecha, tipCredito) {
    var objo = {};
    var listaAux = new Array();
    objo.fecha = fecha;
    objo.claveTipo = tipCredito.clave;
    objo.claveRazon = razonSocialActual.clave;
    objo.tipoConfig = tipoAhorro.tipoConfiguracion;
    var url = route + "/api/RegistrosAhorros/getCredPortipoAhorroYFecha";
    var dataToPost = JSON.stringify(objo);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        //for (var i = 0; i < Mensaje.resultado.length; i++) {
        //    var obj = {};
        //    obj.id = Mensaje.resultado[i].id;
        //    obj.cuentaContable = Mensaje.resultado[i].cuentaContable;
        //    obj.nombreEmpleado = Mensaje.resultado[i].empleados.apellidoPaterno + " " + Mensaje.resultado[i].empleados.apellidoMaterno + " " + Mensaje.resultado[i].empleados.nombre;
        //    obj.empleados_ID = Mensaje.resultado[i].empleados.clave;
        //    obj.fechaAutorizacion = formatDateddmmyyy(new Date(Mensaje.resultado[i].fechaAutorizacion));
        //    obj.fechaCredito = formatDateddmmyyy(new Date(Mensaje.resultado[i].fechaCredito));
        //    obj.fechaVence = formatDateddmmyyy(new Date(Mensaje.resultado[i].fechaVence));
        //    obj.inicioDescuento = formatDateddmmyyy(new Date(Mensaje.resultado[i].inicioDescuento));
        //    if (Mensaje.resultado[i].modoDescuentoCredito === 0) {
        //        var row = {};
        //        row.id = Mensaje.resultado[i].modoDescuentoCredito;
        //        row.descripcion = "Cuota Fija";
        //        obj.modoDescuento = row;
        //    } else if (Mensaje.resultado[i].modoDescuentoCredito === 1) {
        //        var rows = {};
        //        rows.id = Mensaje.resultado[i].modoDescuentoCredito;
        //        rows.descripcion = "VSGM";
        //        obj.modoDescuento = row;
        //    } else if (Mensaje.resultado[i].modoDescuentoCredito === 2) {
        //        var row1 = {};
        //        row1.id = Mensaje.resultado[i].modoDescuentoCredito;
        //        row1.descripcion = "Porcentaje";
        //        obj.modoDescuento = row;
        //    }
        //    obj.modoDescuentoCredito = Mensaje.resultado[i].modoDescuentoCredito;
        //    obj.montoDescuento = Mensaje.resultado[i].montoDescuento;
        //    obj.numeroCredito = Mensaje.resultado[i].numeroCredito;
        //    obj.numeroEmpleadoExtra = Mensaje.resultado[i].numeroEmpleadoExtra;
        //    obj.numeroParcialidades = Mensaje.resultado[i].numeroParcialidades;
        //    obj.periodosNomina_ID = Mensaje.resultado[i].periodosNomina.clave;
        //    obj.descripcionPerNom = Mensaje.resultado[i].periodosNomina.descripcion;
        //    obj.ejercicio = Mensaje.resultado[i].periodosNomina.año;
        //    obj.totalCredito = Mensaje.resultado[i].totalCredito;
        //    obj.razonesSociales_ID = Mensaje.resultado[i].razonesSociales_ID;
        //    listaAux[i] = obj;
        //}
        dataRegAhorro = Mensaje.resultado;
        listaAux = construirDatosTblAho();

    }
    return listaAux;
}

function construirDatosTblAho() {
    var listaAux = new Array();
    for (var i = 0; i < dataRegAhorro.length; i++) {
        var obj = {};
        obj.id = dataRegAhorro[i].id;
        obj.cuentaContable = dataRegAhorro[i].cuentaContable;
        obj.nombreEmpleado = dataRegAhorro[i].empleados.apellidoPaterno + " " + dataRegAhorro[i].empleados.apellidoMaterno + " " + dataRegAhorro[i].empleados.nombre;
        obj.empleados_ID = dataRegAhorro[i].empleados.clave;
        obj.fechaAutorizacion = formatDateddmmyyy(new Date(dataRegAhorro[i].fechaAutorizacion));
        obj.fechaCredito = formatDateddmmyyy(new Date(dataRegAhorro[i].fechaCredito));
        obj.fechaVence = formatDateddmmyyy(new Date(dataRegAhorro[i].fechaVence));
        obj.inicioDescuento = formatDateddmmyyy(new Date(dataRegAhorro[i].inicioDescuento));
        if (dataRegAhorro[i].modoDescuentoCredito === 0) {
            var row = {};
            row.id = dataRegAhorro[i].modoDescuentoCredito;
            row.descripcion = "Cuota Fija";
            obj.modoDescuento = row;
        } else if (dataRegAhorro[i].modoDescuentoCredito === 1) {
            var rows = {};
            rows.id = dataRegAhorro[i].modoDescuentoCredito;
            rows.descripcion = "VSGM";
            obj.modoDescuento = row;
        } else if (dataRegAhorro[i].modoDescuentoCredito === 2) {
            var row1 = {};
            row1.id = dataRegAhorro[i].modoDescuentoCredito;
            row1.descripcion = "Porcentaje";
            obj.modoDescuento = row;
        }
        obj.modoDescuentoCredito = dataRegAhorro[i].modoDescuentoCredito;
        obj.montoDescuento = dataRegAhorro[i].montoDescuento;
        obj.numeroCredito = dataRegAhorro[i].numeroCredito;
        obj.numeroEmpleadoExtra = dataRegAhorro[i].numeroEmpleadoExtra;
        obj.numeroParcialidades = dataRegAhorro[i].numeroParcialidades;
        obj.periodosNomina_ID = dataRegAhorro[i].periodosNomina.clave;
        obj.descripcionPerNom = dataRegAhorro[i].periodosNomina.descripcion;
        obj.ejercicio = dataRegAhorro[i].periodosNomina.año;
        obj.totalCredito = dataRegAhorro[i].totalCredito;
        obj.razonesSociales_ID = dataRegAhorro[i].razonesSociales_ID;
        listaAux[i] = obj;
    }

    return listaAux;
}

function getPorEmpleYRazonSocialVigente(claveEmpleado) {
    var plaza = {};
    var obj = {};
    obj.claveEmpleado = claveEmpleado;
    obj.claveRazonSocial = razonSocialActual.clave;
    var url = route + "/api/RegistrosAhorros/getPorEmpleYRazonSocialVigente";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        plaza = Mensaje.resultado;

    }
    return plaza;
}

function generateNumAhorroEmpelado() {
    var obj = {};
    var key;
    obj.fuentePrincipal = "CreditoPorEmpleado";
    obj.campo = "numeroCredito";

    obj.camposWhere = ["razonesSociales.id", "creditoAhorro.id"];
    obj.valoresWhere = [razonSocialActual.id, tipoAhorro === null ? 0 : tipoAhorro.id];


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

    var preFilters = { "plazasPorEmpleado.razonesSociales.id": razonSocialActual.id };
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    // //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecial";
    var fecha = formatDatemmddyyy(fechaSistemasRegAhorr);
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
        //    } else if (new Date(formantDdMmYyyy(document.getElementById("dpFechaDeSolicitudDeSolicitud").value.toString())) < fecha) {
        //        alert("No puedes capturar crédito con fecha anterior a su fecha de ingreso");
        //    }

        //} else {
        //    alert("No puedes capturar crédito con fecha anterior a su fecha de ingreso");
        //}

        ////if (!(emp.getClave().equals(cData.getEmpleados() == null ? "" : cData.getEmpleados().getClave()))) {
        ////    cData.setPeriodosNomina(null);
        ////}pendiente

        //var timbre = false;
        if (tipoAhorro.inicioDescuento) {
            var fechaActual = new Date(formantDdMmYyyy(document.getElementById("dpFechaDeSolicitud").value.toString()));
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
        fechaInicial = new Date(periodoNomina.FechaAsistenciInicial);
        fechaFinal = new Date(periodoNomina.FechaAsistenciaFinal);
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
    var mascara = tipoAhorro.mascaraNumCredAho;
    valor = textformateaValorAMascara(parseInt(values[0]), mascara);
    var tdnum = values[1].querySelector("td[persist=numeroCredito]");
    $(tdnum).contents().filter(function () {
        return this.nodeType === 3; //Node.TEXT_NODE
    }).remove();

    tdnum.appendChild(document.createTextNode(valor));
    //console.log(values);
}

///metodos para la tabla
function editTableRegAhorro() {

    var nameTable = "RegistroAhorros";
    var nameCols = crearListaColumnas();
    var activaAdd = true;
    var activaDelete = true;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function crearListaColumnas() {
    var columnasTabla = new Array();
    if (tipoAhorro === null) {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroTblNumAhorro")(), "nombreCompo": "Nocrédito", "editable": false, "tipoCompon": "text", "persist": "numeroCredito", "ancho": "105px", "funcion": "" },
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

        if (tipoAhorro.asignaAutoNumCredAho) {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroTblNumAhorro")(), "nombreCompo": "Nocrédito", "editable": false, "tipoCompon": "text", "persist": "numeroCredito", "ancho": "105px", "funcion": "" });
        } else {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroTblNumAhorro")(), "nombreCompo": "Nocrédito", "editable": true, "tipoCompon": "text", "persist": "numeroCredito", "ancho": "105px", "funcion": "formatearNumCredito" });
        }
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblEmpleado")(), "nombreCompo": "Empleados", "editable": true, "tipoCompon": "editConsulta", "persist": "empleados_ID", "ancho": "medium-0" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblNombre")(), "nombreCompo": "Nombre", "editable": false, "tipoCompon": "text", "persist": "nombreEmpleado", "ancho": "260px" });
        if (tipoAhorro.longitudNumEmp !== "") {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblNumEmpleado")(), "nombreCompo": "Noempleado", "editable": false, "tipoCompon": "text", "persist": "numeroEmpleadoExtra", "ancho": "100px" });
        }

        if (!tipoAhorro.inicioDescuento) {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblIniciDesc")(), "nombreCompo": "InicioDesc", "editable": true, "tipoCompon": "date", "persist": "inicioDescuento", "ancho": "65px" });
        } else {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblEjercicio")(), "nombreCompo": "Ejercicio", "editable": true, "tipoCompon": "text", "persist": "ejercicio", "ancho": "65px", "funcion": "setEjercicio" },
                { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblPeriodoInicial")(), "nombreCompo": "Periodoinicial", "editable": true, "tipoCompon": "editConsulta", "persist": "periodosNomina_ID", "ancho": "small-0" },
                { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblDescripcion")(), "nombreCompo": "Descripcion", "editable": false, "tipoCompon": "text", "persist": "descripcionPerNom", "ancho": "300px" });
        }

        if (tipoAhorro.capturarCreditoTotal) {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroTblCreditoTotal")(), "nombreCompo": "Créditototal", "editable": true, "tipoCompon": "text", "persist": "totalCredito", "ancho": "65px" });
        }
        if (tipoAhorro.modoDescuento === 1) {
            var conactena = "";
            if (tipoAhorro.porcentaje) {
                conactena = "P";
            }
            if (tipoAhorro.vsmg) {
                if (conactena !== "") {
                    conactena = conactena + "V";
                } else {
                    conactena = "V";
                }
            }
            if (tipoAhorro.cuotaFija) {
                if (conactena !== "") {
                    conactena = conactena + "C";
                } else {
                    conactena = "C";
                }
            }

            if (conactena.length === 1) {

                if (conactena === "P") {
                    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblPorcentaje")(), "nombreCompo": "Porcentaje", "editable": false, "tipoCompon": "text", "persist": "montoDescuento", "ancho": "65px" });
                    modoDescuentoAhorro = 2;
                } else if (conactena === "V") {
                    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblVSM")(), "nombreCompo": "VSM", "editable": false, "tipoCompon": "text", "persist": "montoDescuento", "ancho": "65px" });
                    modoDescuentoAhorro = 1;
                } else if (conactena === "C") {
                    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblImporteFijo")(), "nombreCompo": "Importefijo", "editable": true, "tipoCompon": "text", "persist": "montoDescuento", "ancho": "65px" });
                    modoDescuentoAhorro = 0;
                }

            } else {
                var valores = new Array();
                if (tipoAhorro.porcentaje) {
                    valores.push({ "id": "2", "descripcion": "Porcentaje" });
                }
                if (tipoAhorro.vsmg) {
                    valores.push({ "id": "1", "descripcion": "VSMG" });
                }
                if (tipoAhorro.cuotaFija) {
                    valores.push({ "id": "0", "descripcion": "Cuota Fija" });
                }

                columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblModDesc")(), "nombreCompo": "ModoDesc", "editable": true, "tipoCompon": "select", "persist": "modoDescuento", "ancho": "100px", "data": valores },
                    { "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblImporte")(), "nombreCompo": "Importe", "editable": true, "tipoCompon": "text", "persist": "montoDescuento", "ancho": "65px" });
            }
            conactena = "";
        } else if (tipoAhorro.modoDescuento === 2) {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblNumParcial")(), "nombreCompo": "Noparcialidades", "editable": false, "tipoCompon": "text", "persist": "numeroParcialidades", "ancho": "80px" });
        }

        if (tipoAhorro.solicitarFecVen) {
            columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblFecVenc")(), "nombreCompo": "FechaVenc", "editable": true, "tipoCompon": "date", "persist": "fechaVence", "ancho": "100px" });
        }
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("RegistroAhorroCreditoTblFechaAut")(), "nombreCompo": "FechaAutorizacion", "editable": true, "tipoCompon": "date", "persist": "fechaAutorizacion", "ancho": "100px" });
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
            var mascara = tipoAhorro.mascaraNumCredAho;
            if (dataRegAhorro.length === 0) {
                var numCredito = generateNumCreditoEmpelado();
                valor = textformateaValorAMascara(numCredito, mascara);
            } else {
                var numCreditos = generaClaveMax(dataRegAhorro[dataRegAhorro.length - 1].numeroCredito);
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
        for (var i = 0; i < dataRegAhorro.length; i++) {
            if (dataRegAhorro[i].id === parseInt(id)) {
                dataRegAhorro.splice(i, 1);
                break;
            }
        }
        //for (var i = 0; i < listaAsistNuevosYMod.length; i++) {
        //    if (listaAsistNuevosYMod[i].id === parseInt(id)) {
        //        listaAsistNuevosYMod.splice(i, 1);
        //        break;
        //    }
        //}
        deleteAhorro[deleteAhorro.length] = parseInt(id);

    } else {
        for (var j = 0; j < dataRegAhorro.length; j++) {
            if (dataRegAhorro[j].id === id) {
                dataRegAhorro.splice(j, 1);
                break;
            }
        }
    }

    var listaAux = construirDatosTblAho();
    if (listaAux.length > 0) {
        start = 0;
        if (start === 0) {
            createEditPagination(listaAux.length, "RegistroAhorros");
        }



        if (listaAux.length <= rowsByPage) {
            end = listaAux.length;
        } else {
            end = rowsByPage;
        }
        llenarTablaGen("RegistroAhorros", listaAux, start, end);
    }
    //  alert("eliminado" + ".- " + name.id);
}

function cambiarPagina(valores) {
    //alert(valores);
    var tbl = valores['origen'];
    end = rowsByPage;
    start = valores['fromPage'];
    if (dataRegAhorro.length > rowsByPage) {
        var res = (rowsByPage + start) - dataRegAhorro.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = dataRegAhorro.length;
    }
    var listaAux = construirDatosTblAho();
    llenarTablaGen("RegistroAhorros", listaAux, start, end);
}

//end metodos

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
    var url = route + "/api/RegistrosAhorros/txtFormatearMask";
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

function getPeriodoNominaActual(claveTipoNomina, fecha) {
    var periodosNomina;
    var obj = {};
    obj.claveNomina = claveTipoNomina;
    obj.claveTipoCorrida = "PER";
    obj.fecha = fecha;

    var url = route + "/api/RegistrosAhorros/getPeriodosNominaPorFechaTipoNominaCorridaEnti";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        console.log();
    } else {
        periodoNomina = Mensaje.resultado;
    }

    return periodoNomina;
}

function textformateaValorAMascara1(valor, mascara) {
    var dato = "";
    var obj = {};
    obj.valor = valor;
    var sub = mascara.substring(0, mascara.length - valor.toString().length);
    sub = sub.replace(/#/g, '0');
    //console.log(sub);
    mascara = sub + mascara.substring(mascara.length - valor.toString().length, mascara.length);
    // console.log(mascara);

    obj.mascara = mascara;
    var url = route + "/api/RegistrosAhorros/txtFormatearMask";
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
    obj.fechaCredito = document.getElementById("dpFechaDeSolicitud").value;
    obj.creditoAhorro_ID = tipoAhorro.id;
    obj.numeroCredito = valoresTabla.numeroCredito;
    obj.empleados_ID = empleados.id;
    obj.razonesSociales_ID = razonSocialActual.id;


    if (tipoAhorro.inicioDescuento) {
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
        obj.modoDescuentoCredito = modoDescuentoAhorro;
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
    dataRegAhorro[dataRegAhorro.length] = obj;
    var listaAux = construirDatosTblAho();
    if (listaAux.length <= rowsByPage) {
        end = listaAux.length;
    } else {
        end = rowsByPage;
    }
    llenarTablaGen("RegistroAhorros", listaAux, start, end);

}

function actualizarCreditoEmpleado(valoresTabla) {
    var creditoEmpleadoAux = {};
    if (parseInt(valoresTabla.id)) {
        for (var i = 0; i < dataRegAhorro.length; i++) {
            if (dataRegAhorro[i].id === parseInt(valoresTabla.id)) {
                creditoEmpleadoAux = dataRegAhorro[i];
                creditoEmpleadoAux.fechaCredito = document.getElementById("dpFechaDeSolicitud").value;
                if (empleados) {
                    creditoEmpleadoAux.empleados_ID = empleados.id;
                }

                // creditoEmpleadoAux.modoDescuentoCredito = modoDescuentoCredito;

                if (tipoAhorro.inicioDescuento) {
                    if (valoresTabla.periodosNomina_ID) {
                        creditoEmpleadoAux.periodosNomina_ID = valoresTabla.periodosNomina_ID;
                    }
                } else {
                    creditoEmpleadoAux.periodosNomina_ID = periodoNomina.id;
                }

                if (valoresTabla.inicioDescuento) {
                    creditoEmpleadoAux.inicioDescuento = valoresTabla.inicioDescuento;
                } else {
                    creditoEmpleadoAux.inicioDescuento = fechaFinal;
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
                    creditoEmpleadoAux.modoDescuentoCredito = modoDescuentoAhorro;
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
                    var fecha = new Date();
                     fecha.setDate(fechaFinal);
                     fecha.setFullYear(2120);
                     creditoEmpleadoAux.fechaVence =formatDatemmddyyy (fecha);
                }

                creditoEmpleadoAux.fechaAutorizacion = valoresTabla.fechaAutorizacion;

                if (valoresTabla.cuentaContable) {
                    creditoEmpleadoAux.cuentaContable = valoresTabla.cuentaContable;
                }
                creditoEmpleadoAux.statusFila = "MODIFICADOBDS";
                dataRegAhorro[i] = creditoEmpleadoAux;
                break;
            }
        }
    } else {
        for (var j = 0; j < dataRegAhorro.length; j++) {
            if (dataRegAhorro[j].id === valoresTabla.id) {
                creditoEmpleadoAux = dataRegAhorro[j];
                creditoEmpleadoAux.fechaCredito = document.getElementById("dpFechaDeSolicitud").value;

                if (empleados) {
                    creditoEmpleadoAux.empleados_ID = empleados.id;
                }

                // creditoEmpleadoAux.modoDescuentoCredito = modoDescuentoCredito;

                if (tipoAhorro.inicioDescuento) {
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
                    creditoEmpleadoAux.modoDescuentoCredito = modoDescuentoAhorro;
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
                dataRegAhorro[j] = creditoEmpleadoAux;
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
    llenarTablaGen("RegistroAhorros", listaAux, start, end);

}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function saveCreditoPorEmpleadoAhorro() {
    var obj = {};

    for (var i = 0; i < dataRegAhorro.length; i++) {
        if (dataRegAhorro[i].statusFila === "NUEVO" || dataRegAhorro[i].statusFila === "MODIFICADOBDS") {
            listaAhorrEmplNewYMod[listaAhorrEmplNewYMod.length] = dataRegAhorro[i];
        }
    }
    limpiarAhorroAntesDeSave();
    obj["SaveUpdate"] = listaAhorrEmplNewYMod;

    if (deleteAhorro.length > 0) {
        obj["Delete"] = deleteAhorro;
    }

    var url = route + "/api/RegistrosAhorros/saveCreditoEmpleado";
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

    for (var i = 0; i < listaAhorrEmplNewYMod.length; i++) {
        // console.log(new Date(listaAsistNuevosYMod[i].fecha));
        listaAhorrEmplNewYMod[i].empleados = undefined;
        listaAhorrEmplNewYMod[i].periodosNomina = undefined;
        //listaAsistNuevosYMod[i].excepciones = undefined;
        //listaAsistNuevosYMod[i].centroDeCosto = undefined;
        //listaAsistNuevosYMod[i].fecha = new Date(listaAsistNuevosYMod[i].fecha);
        delete listaAhorrEmplNewYMod[i].statusFila;
        delete listaAhorrEmplNewYMod[i].ejercicio;
        if (!Number.isInteger(listaAhorrEmplNewYMod[i].id)) {
            listaAhorrEmplNewYMod[i].id = 0;
        }
    }

}

function limpiarAhorro() {
     tipoAhorro = null;
     deleteAhorro = new Array();
     listaAhorrEmplNewYMod = new Array();
     dataRegAhorro = new Array();
     tipoNomina = {};
     periodoNomina = {};
    document.getElementById("selAhorro").value = "";
    var element = document.getElementById('contTable');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();

}

function llenarSelAhorrFilter(addcomp) {
    var creditos = listaConfigAhorros;
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

/*Table selector*/
function selectorRegistroAhorros() {

    //Parameters
    nameCmp = "selectorCatalogoRegistroAhorros";
    //if (tipoConfiguracion === 1) {
    //    title = "Configurar credito";
    //} else if (tipoConfiguracion === 2) {
    //    title = "Configurar Ahorros";
    //}
    title = "Creditos Por empleado";
    table = "CreditoPorEmpleado";
    nameCols = idiomaSelecionadoCol.messageFormatter("Empleadose")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionadoCol.messageFormatter("RegistroAhorroTblNumAhorro")() + "," + idiomaSelecionadoCol.messageFormatter("RegistroAhorroFechaAhorro")() + "," +
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
    campos = ["empleados.clave", "empleados.nombre", "numeroCredito", "fechaCredito", "totalCredito", "montoDescuento", subCampo];
    //o0,01,02,03
    var subEntities = "empleados,creditoAhorro";
    var preFilters = {};
    preFilters = setPreFilters();
    if (valorInicialAhorr !== null) {
        preFilters["creditoAhorro.clave#="] = valorInicialAhorr;
    }
    preFilters["creditoAhorro.tipoConfiguracion#="] = "2";
    //camposMostrar = ["clave", "puestos.descripcion"];
    //if (document.getElementById("modalEditsearchSel")) {
    //    var filters = getFiltersEdit();
    //    for (var i = 0; i < filters.length; i++) {

    //        preFilters[filters[i][0] + "#="] = filters[i][1];
    //    }
    //    console.log(preFilters);
    //}
    //if (valorInicialAhorr !== null) {
    //    preFilters["creditoAhorro.clave#="] = valorInicialCred;
    //}
    //preFilters["creditoAhorro.tipoConfiguracion#="] = "2";
    /*var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);*/



    var filtersSearch = [];
    filtersSearch[0] = { "idcompo": "selTipoAhorroFilter", "etiqueta": "Tipo de Ahorro", "tipo": "select", "campo": "creditoAhorro.clave", "medida": "s", "funcion": "llenarSelAhorrFilter","operador": "#=" };
    filtersSearch[2] = { "idcompo": "editEmpleadosFilter", "etiqueta": "Empleado", "tipo": "editConsulta", "campo": "empleados.clave", "medida": "s", "dataedit": "EditEmpleadosFilter", "functedit": "setEditEmpleadosFilter", "operador": "#=" };
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