/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */

var route = "";
var getFiniquitos = null;
var dataPlazaFin = new Array();
var dataCncFin = new Array();
var deleteFiniqLiquidPlazas = new Array();
var deleteFiniqLiquidCncNom = new Array();
var idiomaSelecionadoCol;

jQuery(document).ready(function () {
    nombreTablaBDs = "FiniquitosLiquidaciones";
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    initFiniquitos();
    addListenersFiniquitos();
});


function initDefault() {
    var date = new Date();
    date.setDate(08);
    date.setMonth(09);
    date.setYear(2020);
    setEditObject("editFinEmpleados", "007");
    document.getElementById("txtFinFechaBaja").value = formatDate(date);
    document.getElementById("txtFinFechaCalculo").value = formatDate(date);
    $('#rbnFinSi').prop('checked', true);
    $('#cbxFiniCausasDeBaja :nth-child(2)').prop('selected', true);
    document.getElementById("txtFinDesripcionBaja").value = "Ok";
    $("textarea#txtFinObservaciones").val("Observaciones");
}

function initFiniquitos() {
    generateValueFiniquitos();

    /*---------------W:0 Init Table---------------*/
    OpenTable(document.getElementById('tblPlazasFin'));
    OpenTable(document.getElementById('tblConceptosFin'));
    InitEventsTable();
    /*---------------W:0 Init Table---------------*/
    fillCausasDeBaja();


    //initDefault();
}

function addListenersFiniquitos() {

    $('#txtFinFechaBaja').change(function () {
        var theSelectDate = new Date($(this).val())
        theSelectDate.setDate(theSelectDate.getDate() + 1);
        document.getElementById("txtFinFechaCalculo").value = formatDate(theSelectDate);
    });
}

/*Getters Information*/
function fillCausasDeBaja() {
    var cbxFinCausasBaja = document.getElementById('cbxFiniCausasDeBaja');
    cbxFinCausasBaja.appendChild(new Option("", ""));
    var url = route + "/api/CausasDeBaja/getAllCausaDebaja";
    var Mensaje = Common.sendRequestJson('POST', url, null, undefined, false, null);
    if (Mensaje.resultado !== null) {
        var typesCausas = Mensaje.resultado;
        typesCausas.forEach(function (val, index) {
            var opt = document.createElement('option');
            opt.innerHTML = val['clave'] + ".- " + val['descripcion'];
            opt.value = val['id'];
            cbxFinCausasBaja.appendChild(opt);
        });
    }
}

function getPlazasVigentes(claveEmpleado) {
    var plzas = undefined;
    var url = route + "/api/PlazasPorEmpleadosMov/getPorEmpleYRazonSocialVigente";
    var razon = localStorage.getItem("RazonSocial");
    var data = new Object();
    data['claveEmpleado'] = claveEmpleado;
    data['claveRazonSocial'] = getRazonSocial().clave;
    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {
        plzas = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }
    if (plzas === undefined) {
        var plzas = {};
    }
    return plzas;
}

function getCncPorCorridaFin(claveCorrida) {
    var conceptosFin = undefined;
    var url = route + "/api/ConceptosDeNomina/getPorTipoCorridaConcepNomDefi";
    var data = new Object();
    data['claveCorrida'] = claveCorrida;
    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {
        conceptosFin = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }
    if (conceptosFin === undefined) {
        var conceptosFin = {};
    }
    return conceptosFin;
}

function getFiniquito(idVal) {
    var finiquito = undefined;
    var valId = idVal;
    var url = route + "/api/Finiquitos/getPorIdFiniquito";
    var data = new Object();
    data['idFiniquito'] = valId;
    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {
        finiquito = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }
    if (finiquito === undefined) {
        var finiquito = {};
    }
    return finiquito;
}

/*Action Creators*/
function generateValueFiniquitos() {
    var obj = {};
    obj.fuentePrincipal = "FiniquitosLiquida";
    obj.campo = "referencia";
    var keyIngreRein = document.getElementById("txtFinReferencia").value;
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
        var clave = construyeMascara("Clave", key);
        document.getElementById("txtFinReferencia").value = clave;
    } else {
        console.log(Mensaje.error);
    }
}

function construirFiniquitos(obj) {
    var finiquitosLiqui = null;
    if (obj === undefined || obj === null) {
        finiquitosLiqui = {};
    } else {
        finiquitosLiqui = {};
        if (obj[0].id !== undefined) {
            finiquitosLiqui.id = obj[0].id;
        }
    }

    finiquitosLiqui.referencia = document.getElementById("txtFinReferencia").value;

    var empleados = {};
    empleados.id = getExtraValues("editFinEmpleados")[1];
    finiquitosLiqui.empleados_ID = empleados.id;

    const rbnFinSi = document.getElementById("rbnFinSi");
    if (rbnFinSi.checked) {
        finiquitosLiqui.bajaPorRiesgo = true;
    } else {
        finiquitosLiqui.bajaPorRiesgo = false;
    }
    finiquitosLiqui.calculado = false; //?????????????????????????????????????
    var cbxFiniCausasDeBaja = document.getElementById("cbxFiniCausasDeBaja");
    var valCausaBaja = cbxFiniCausasDeBaja.options[cbxFiniCausasDeBaja.selectedIndex].value;
    if (valCausaBaja !== undefined) {
        finiquitosLiqui.causaBaja = parseInt(valCausaBaja);
    }
    finiquitosLiqui.contImpreso = 0; //int ??????????????????????????????????????????????
    finiquitosLiqui.descripcionBaja = document.getElementById("txtFinDesripcionBaja").value;

    finiquitosLiqui.fechaBaja = document.getElementById("txtFinFechaBaja").value;
    finiquitosLiqui.fechaCalculo = document.getElementById("txtFinFechaCalculo").value;

    /* NINGUNO = 0, 
       NORMAL = 1,
       COMPLEMENTARIA = 2,
       PROYECCION = 3,*/
    finiquitosLiqui.modoBaja = 1; // ???????????????????
    finiquitosLiqui.observaciones = $('#txtFinObservaciones').val();

    finiquitosLiqui.status = 0; // ????????????????
    finiquitosLiqui.tipoBaja = 0; // ???????????????


    finiquitosLiqui.razonesSociales_ID = getRazonSocial().id;


    return finiquitosLiqui;
}

function mostrarObjetoFiniquitos(obj) {
    var finiquitosData = obj[0];
    var plazaFinData = obj[1];
    var cncFinData = obj[2];

    var obj = finiquitosData;
    if (obj === undefined) {
        limpiarComponentesFiniquitos();
    } else {
        document.getElementById("txtFinReferencia").value = obj.referencia;
        // setEditObjectByID("editFinEmpleados", obj.empleados_ID);
        setEditObject("editFinEmpleados", obj.claveEmpleado);
        if (obj.bajaPorRiesgo) {
            $('#rbnFinSi').prop('checked', true);
        } else {
            $('#rbnFinNo').prop('checked', true);
        }

        $("#cbxFiniCausasDeBaja").val(obj.causaBaja.toString());
        document.getElementById("txtFinDesripcionBaja").value = obj.descripcionBaja;
        document.getElementById("txtFinFechaBaja").value = formatDate(new Date(obj.fechaBaja));
        document.getElementById("txtFinFechaCalculo").value = formatDate(new Date(obj.fechaCalculo));

        $("textarea#txtFinObservaciones").val(obj.observaciones);

        //for (var a = 0; a < dataPlazaFin.length; a++) {
        //    for (var b = 0; b < plazaFinData.length; b++) {
        //        if (dataPlazaFin[a].idPlazaEmpleado ===
        //            plazaFinData[b].plazasPorEmpleado_ID) {
        //            dataPlazaFin[a]["id"] = plazaFinData[b].id;
        //            dataPlazaFin[a]["incluir"] = plazaFinData[b].incluir;
        //        }
        //    }
        //}

        dataPlazaFin = plazaFinData;
        llenarTablaGen("tblPlazasFin", dataPlazaFin, 0, dataPlazaFin.length);
        dataCncFin = cncFinData;
        llenarTablaGen("tblConceptosFin", dataCncFin, 0, dataCncFin.length);
    }
}

function addDataToPersistFiniPlazas(listData) {
    var getTR = $('#tableEdittblPlazasFin > tbody > tr.hidetd');
    for (var i = 0; i < getTR.length; i++) {
        var getTD = getTR[i].cells;
        for (var k = 0; k < getTD.length ; k++) {
            var sepTd = getTD[k];
            if (sepTd.getAttribute("persist") === "incluir") {
                var chkSelect = $(sepTd).children('label').children('input');
                listData[i][sepTd.getAttribute("persist")] = chkSelect.is(":checked");
            } else if (sepTd.getAttribute("persist") === "idPlazaEmpleado") {
                listData[i]["plazasPorEmpleado_ID"] = parseInt(sepTd.innerText);
            }
        }
    }

    return listData;
}

function addDataToPersistFiniCnc(listData) {
    var getTR = $('#tableEdittblConceptosFin > tbody > tr.hidetd');
    for (var i = 0; i < getTR.length; i++) {
        var getTD = getTR[i].cells;
        for (var k = 0; k < getTD.length ; k++) {
            var sepTd = getTD[k];
            if (sepTd.getAttribute("persist") === "importe") {
                listData[i][sepTd.getAttribute("persist")] = parseFloat(sepTd.innerText);
            } else if (sepTd.getAttribute("persist") === "cantidad") {
                listData[i][sepTd.getAttribute("persist")] = parseFloat(sepTd.innerText);
            } else if (sepTd.getAttribute("persist") === "aplicar") {
                var chkSelect = $(sepTd).children('label').children('input');
                listData[i][sepTd.getAttribute("persist")] = chkSelect.is(":checked");
            }
        }
    }
    return listData;
}

function makeActionFiniquitos(action, obj) {
    var succes = false;
    var objFiniquitos = {};
    objFiniquitos.entity = construirFiniquitos(obj);

    var listFinPlazasAddMod = addDataToPersistFiniPlazas(dataPlazaFin);
    var listFinConceptosAddMod = addDataToPersistFiniCnc(dataCncFin);

    objFiniquitos.listFiniqLiquidPlazasAM = listFinPlazasAddMod;
    objFiniquitos.listFiniqLiquidPlazasDE = deleteFiniqLiquidPlazas;

    objFiniquitos.listFiniqLiquidCncNomAM = listFinConceptosAddMod;
    objFiniquitos.listFinLiquidCncDE = deleteFiniqLiquidCncNom;

    if (action === "A") {
        var url = route + "/api/Finiquitos/saveFiniquitos";
        var data = JSON.stringify(objFiniquitos);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        var result = Mensaje.resultado
        if (result === true) {
            succes = true;
        } else {
            alert(Mensaje.error);
        }
    }
    else if (action === "M") {
        var url = route + "/api/Finiquitos/saveFiniquitos";
        var data = JSON.stringify(objFiniquitos);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado !== null) {
            var result = Mensaje.resultado;
            if (result) {
                succes = true;
            }
            else {
                alert(Mensaje.error);
            }
        }
    } else if (action === "E") {
        var url = route + "/api/Finiquitos/eliminarFiniquito";
        var objFiniquitos = {};
        objFiniquitos = construirFiniquitos(obj);
        var data = JSON.stringify(objFiniquitos);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado === null) {
            alert(Mensaje.error);
        } else {
            var result = Mensaje.resultado;
            if (result) {
                succes = true;
            }
        }
    }
    return succes;
}

function preValidateBeforeSaveFiniquitos() {
    return true;
    //var goConfigIMSS = true;
    //goConfigIMSS = validateComponents(elementsConfigEmple);
    //return goConfigIMSS;
}

function saveFiniquitos() {
    if (preValidateBeforeSaveFiniquitos()) {
        var succes = false;
        succes = makeActionFiniquitos("A", getFiniquitos);
        if (succes) {
            alert("Finiquito guardado");
            limpiarComponentesFiniquitos();
            generateValueFiniquitos();
        }
    }
}

function updateFiniquitos() {
    var succes = false;
    if (preValidateBeforeSaveFiniquitos()) {
        succes = makeActionFiniquitos("M", getFiniquitos);
        if (succes) {
            limpiarComponentesFiniquitos();
            changeModeButtons("U");
            generateValueFiniquitos();
        }
    }
}

function deleteFiniquitos() {
    var succes = false;
    var msg = confirm("¿Deseas realmente eliminar este Finiquito?");
    if (msg == true) {
        succes = makeActionFiniquitos("E", getFiniquitos);
        if (succes) {
            limpiarComponentesFiniquitos();
            changeModeButtons("E");
            generateValueFiniquitos();
        }
    }

}

function cancelFiniquitos() {
    limpiarComponentesFiniquitos();
    generateValueFiniquitos();
    changeModeButtons("U");
}

/*END Action Creators*/

/*Default Functions*/
function limpiarComponentesFiniquitos() {
    document.getElementById("txtFinReferencia").value = "";
    clearEdit("editFinEmpleados");
    document.getElementById("rbnFinSi").checked = false;
    document.getElementById("rbnFinNo").checked = false;
    $("#cbxFiniCausasDeBaja option:first").prop('selected', 'selected');
    document.getElementById("txtFinDesripcionBaja").value = "";
    document.getElementById("txtFinFechaBaja").value = "";
    document.getElementById("txtFinFechaCalculo").value = "";
    document.getElementById("txtFinDesripcionBaja").value = "";
    $('#txtFinObservaciones').val('');
    //Clear Global Variables
    getFiniquitos = null;
    /*W:8*/
    dataPlazaFin = new Array();
    clearTable("tblPlazasFin");
    dataCncFin = new Array();
    clearTable("tblConceptosFin");
    InitEventsTable();
}

function changeModeButtons(type) {
    if (type === "M") {
        document.getElementById("btnActualizar").style.display = "inline";
        document.getElementById("btnEliminar").style.display = "inline";
        document.getElementById("btnBuscar").style.display = "inline";
        document.getElementById("btnCancelar").style.display = "inline";
        document.getElementById("btnGuardar").style.display = "inline";
        document.getElementById("btnGuardar").style.display = "none";
    }
    else if (type === "C" || type === "E" || type === "U") {
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


/*END Default Functions*/

/*Other Functions*/
function loadConceptos() {
    dataCncFin = getCncPorCorridaFin("FIN");
    /*W:7*/
    llenarTablaGen("tblConceptosFin", dataCncFin, 0, dataCncFin.length);
}
/*END Other Functions*/

/*---------------W:1 Config Table---------------*/
function editTablePlazasFin() {
    var nameTable = "tblPlazasFin";
    var nameCols = crearListaColumnas(1);
    var activaAdd = false;
    var activaDelete = false;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function editTableCncFin() {
    var nameTable = "tblConceptosFin";
    var nameCols = crearListaColumnas(2);
    var activaAdd = false;
    var activaDelete = false;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}
/*---------------W:1 END Config Table---------------*/

/*W:2*/
function crearListaColumnas(typeTbl) {
    var columnasTabla = new Array();

    if (typeTbl === 1) {//Plazas

        var col = {
            "tituloColumna": "idPlazaEmpleado", "nombreCompo": "idPlazaEmpleado", "editable": false,
            "tipoCompon": "text", "persist": "idPlazaEmpleado", "ancho": "110px", "hide": true
        };
        columnasTabla.push(col);


        var col = {
            "tituloColumna": "fechaFinal", "nombreCompo": "fechaFinal", "editable": false,
            "tipoCompon": "text", "persist": "fechaFinal", "ancho": "50px", "hide": true,
        };

        columnasTabla.push(col);

        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FinLiqTblPlReferencia")(), "nombreCompo": "Referencia", "editable": false,
            "tipoCompon": "text", "persist": "referencia", "ancho": "110px"
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FinLiqTblPlPuesto")(), "nombreCompo": "Puesto", "editable": false,
            "tipoCompon": "text", "persist": "descripcionPuesto", "ancho": "150px"
        }
        columnasTabla.push(col);

        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FinLiqTblPlHSM")(), "nombreCompo": "HSM", "editable": false,
            "tipoCompon": "text", "persist": "horas", "ancho": "110px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FinLiqTblPlCostoSD")(), "nombreCompo": "Costo/SD", "editable": false,
            "tipoCompon": "text", "persist": "importe", "ancho": "260px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FinLiqTblPlFechaInicial")(), "nombreCompo": "FechaInicial", "editable": false,
            "tipoCompon": "date", "persist": "fechaInicial", "ancho": "150px"
        }
        columnasTabla.push(col);

        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FinLiqTblPlAplicar")(), "nombreCompo": "incluir", "editable": true,
            "tipoCompon": "checkbox", "persist": "incluir", "ancho": "100px"
        }
        columnasTabla.push(col);
    }

    if (typeTbl === 2) {//Conceptos
        var col = {
            "tituloColumna": "idConceptoCorrida", "nombreCompo": "idConceptoCorrida", "editable": false,
            "tipoCompon": "text", "persist": "idConceptoCorrida", "ancho": "110px", hide: true
        };
        columnasTabla.push(col);

        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FinLiqConceptoNegoTblConcepto")(), "nombreCompo": "clave", "editable": false,
            "tipoCompon": "text", "persist": "clave", "ancho": "110px"
        };
        columnasTabla.push(col);

        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FinLiqConceptoNegoTblDescripcion")(), "nombreCompo": "Descripción", "editable": false,
            "tipoCompon": "text", "persist": "descripcion", "ancho": "150px"
        }
        columnasTabla.push(col);

        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FinLiqConceptoNegoTblCatidad")(), "nombreCompo": "cantidad", "editable": true,
            "tipoCompon": "text", "persist": "cantidad", "ancho": "110px"
        }
        columnasTabla.push(col);

        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FinLiqConceptoNegoTblImporte")(), "nombreCompo": "importe", "editable": true,
            "tipoCompon": "text", "persist": "importe", "ancho": "110px"
        }
        columnasTabla.push(col);

        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FinLiqConceptoNegoTblAplicar")(), "nombreCompo": "aplicar", "editable": true,
            "tipoCompon": "checkbox", "persist": "aplicar", "ancho": "100px", "funcion": "setAplicaConcepto"
        }
        columnasTabla.push(col);
    }

    return columnasTabla;
}

function setAplicaConcepto(values) {
    //var tr = values[1];
    //var id = parseInt(tr.id);
    //var cells = tr.cells;
    //var isAplica = values[0];
    //var dataImporte = "";
    //var dataCantidad = "";

    //for (var i = 0; i < cells.length; i++) {
    //    var td = cells[i];
    //    if (td.getAttribute("persist") === "importe") {
    //        dataImporte = td.innerText;
    //    }
    //    if (td.getAttribute("persist") === "cantidad") {
    //        dataCantidad = td.innerText;
    //    }
    //}

    //for (var f = 0; f < dataCncFin.length; f++) {
    //    if (dataCncFin[f].id === id) {
    //        dataCncFin[f].cantidad = activa;
    //        dataCncFin[f].importe = activa;
    //        dataCncFin[f].seleccionado = isAplica;
    //        break;
    //    }
    //}

    //console.log(dataCncFin);

}


/*W:3*/
function construirObj(tr, nameTable) {
    var obj = {};

    for (var i = 0; i < tr.cells.length; i++) {
        var tipoCmp = tr.cells[i].getAttribute('tipocompon');
        if (tr.cells[i].getAttribute('persist') !== "eliminar" && tr.cells[i].getAttribute("contenteditable") === "true") {
            obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
        }
    }

    if (tr.id === "") {
        var rString = "id" + randomString(2, '0123456789');
        obj['id'] = rString;
        tr.id = obj.id;
        if (nameTable === "tblPlazasFin") {
            // agregarPlazasFin(obj);
        }
        else if (nameTable === "tblConceptosFin") {
            //agregarCncFin(obj);
        }
    } else {
        obj['id'] = tr.id;
        if (nameTable === "tblPlazasFin") {
            actualizarPlazasFin(obj);
        }
        else if (nameTable === "tblConceptosFin") {
            actualizarCncFin(obj);
        }
    }
}

/*---------------W:4---------------*/
function agregarPlazasFin(value) {
    var obj = {};
    obj.id = value.id;
    obj.plazasPorEmpleado.referencia = value.referencia;
    obj.descripcionPuesto = value.descripcionPuesto;
    //obj.fechaNacimiento = value.fechaNacimiento;
    //obj.finado = value.isFinado;
    //obj.empleados_ID = null;
    //obj.nombre = value.nombre;
    //obj.sexo = value.isSexo;
    //obj.parentesco_ID = value.parentesco_Clave;
    obj.statusFila = "NUEVO";
    dataPlazaFin.push(obj);
}

function agregarCncFin(value) {
    var obj = {};
    obj.id = value.id;
    obj.importe.referencia = value.importe;
    obj.cantidad = value.cantidad;
    obj.statusFila = "NUEVO";
    dataCncFin.push(obj);
}

/*---------------END TABLE W:4---------------*/

/*---------------W:5---------------*/
function actualizarPlazasFin(valTable) {
    var getAuxFinPlz = {};
    for (var i = 0; i < dataPlazaFin.length; i++) {

        if (dataPlazaFin[i].id === parseInt(valTable.id)
            || dataPlazaFin[i].id === valTable.id) {
            getAuxFinPlz = dataPlazaFin[i];

            getAuxFinPlz.statusFila = "MODIFICADOBDS";
            dataPlazaFin[i] = getAuxFinPlz;
            break;
        }
    }
}

function actualizarCncFin(valTable) {
    var getAuxFinCnc = {};
    for (var i = 0; i < dataCncFin.length; i++) {
        if (dataCncFin[i].id === parseInt(valTable.id)
            || dataCncFin[i].id === valTable.id) {
            getAuxFinCnc = dataCncFin[i];
            if (valTable.importe) {
                getAuxFinCnc.importe = valTable.importe;
            } else if (valTable.cantidad) {
                getAuxFinCnc.cantidad = valTable.cantidad;
            }
            //conceptoPorTipoCorrida_ID

            getAuxFinCnc.statusFila = "MODIFICADOBDS";
            dataCncFin[i] = getAuxFinCnc;
            break;
        }
    }
}
/*---------------END TABLE W:5---------------*/

/*Set Edit For Tables*/

/*Table selector*/
function selectorFiniquitos() {
    //Parameters
    nameCmp = "selectorFin";
    title = "Finiquitos";
    table = "FiniquitosLiquida";
    var completeName = "@(empleados.nombre + ' ' + empleados.nombre + ' ' + empleados.apellidoPaterno + ' ' + empleados.apellidoMaterno)";
    //plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno
    nameCols = "Referencia,Clave,Nombre empleado,Fecha de baja";
    campos = "referencia,empleados.clave,@(empleados.nombre + ' ' + empleados.apellidoPaterno + ' ' + empleados.apellidoMaterno),fechaBaja";

    var preFilters = {
        "razonesSociales.id": getRazonSocial().id,
    };

    preFilters = setPreFilters();
    var filtersSearch = [];

    filtersSearch[0] = { "etiqueta": "Referencia", "tipo": "string", "campo": "clave", "medida": "s" };

    return buildTableSearch(nameCmp, title, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
         typeof camposObtener === 'undefined' ? null : camposObtener,
         false,
         typeof optionals === 'undefined' ? null : optionals);
}

function selectorFiniquitosShow(idVal) {
    var dataget = getFiniquito(idVal[0]);
    if (dataget === undefined) {
        console.log("Problems to select Finiquito");
    } else {
        mostrarObjetoFiniquitos(dataget);
        getFiniquitos = dataget;
        changeModeButtons("M");
    }
}

function setEditFinEmpleados() {
    tituloSel = "Empleado";
    tamañoSel = "size-6";
    nameCmp = "editFinEmpleados";
    table = "PlazasPorEmpleadosMov";
    nameCols = "()idEmpleado,Clave,Nombre,Apellido Paterno,Apellido Materno,Nombre Abreviado";
    campos = "plazasPorEmpleado.empleados.id,plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";
    // campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre";
    camposObtener = "[]plazasPorEmpleado.empleados.clave,[]plazasPorEmpleado.empleados.id";

    camposMostrar = ["plazasPorEmpleado.empleados.clave", "@plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre"];

    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": getRazonSocial().id,
        "id#IN@": "(Select MAX(m.id) from PlazasPorEmpleadosMov m  WHERE m.plazasPorEmpleado.referencia = o.plazasPorEmpleado.referencia)",
        //"plazasPorEmpleado.ingresosBajas.fechaBaja#>=": getFechaSistema(),
    };

    preFilters = setPreFilters(preFilters);
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave del empleado", "tipo": "string", "campo": "plazasPorEmpleado.empleados.clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre del empleado", "tipo": "string", "campo": "plazasPorEmpleado.empleados.nombre", "medida": "m" };

    var optionals = new Object();
    //Group will be alwys acompanied of an Order
    optionals["camposGroup"] = campos;
    optionals["camposOrden"] = ["plazasPorEmpleado.empleados.clave"];

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
         typeof camposObtener === 'undefined' ? null : camposObtener,
         typeof tituloSel === 'undefined' ? null : tituloSel,
         typeof tamañoSel === 'undefined' ? null : tamañoSel,
         typeof optionals === 'undefined' ? "" : optionals);

}

//setEditFinEmpleadosAfterShow
function setEditFinEmpleadosShow(value) {
    if (value != null) {
        var obj = value[0];
        dataPlazaFin = getPlazasVigentes(obj[1]);
        llenarTablaGen("tblPlazasFin", dataPlazaFin, 0, dataPlazaFin.length);
    }
}