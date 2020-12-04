
var route = "";
var onVersion = false;
var getConceptoNom = null;
var getConcepto = null;
var listaClasi = new Array();
var listaUnidades = new Array();
var listaTipos = new Array();
var listaCorridas = new Array();
var dataParametros = new Array();
var deleteParametros = new Array();
var dataConceptoPorTipoCorrida = new Array();
var deleteConceptoPorTipoCorrida = new Array();
var dataBasesAfectasCnc = null;
var deleteBasesAfectasCnc = new Array();
var listBasesNoReservadas = new Array();
var dataOtrasBases = new Array();
var deleteOtrasBases = new Array();
var idiomaSelecionadoCol;
//Parameters
var fechaVersionInicial = new Date(1980, 0, 1);//<<A partir de esta fecha validar>>
var activarVersionCnc = true;

jQuery(document).ready(function () {
    nombreTablaBDs = "ConcepNomDefi";
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    initCn();
    addListenersCnc();
});

function createNewCnc() {
    getConceptoNom = getConcepto[0].conceptoDeNomina;
    getConcepto = construirCn(getConcepto, true);
    //onVersion = true;
}

function setVersionCnc() {
    document.getElementById("txtClaveCn").disabled = true;
    closeModalVersion();
    var getcncVersion = $("#cbxDates option:selected").val();
    if (getcncVersion === "") {
        document.getElementById("txtClaveCn").disabled = false;
        document.getElementById("txtVigenteCn").disabled = false;
    } else {
        var res = getcncVersion.split(",");
        if (res.length > 3) {
            document.getElementById('rowVersion').style.display = '';

        } else {
            document.getElementById('rowVersion').style.display = 'block';
        }

        var dataget = getValConcepto(res[0], null, res[2]);
        if (dataget === undefined) {
            console.log("Problems to select conceptos");
        } else {
            mostrarObjetoCn(dataget);
            getConcepto = dataget;
            changeDefaultModeButtons("M");
            document.getElementById("txtClaveCn").disabled = true;
            document.getElementById("txtVigenteCn").disabled = true;
        }
    }
}

function initCn() {
    //Set main default key
    generateValueCn();
    var vigencia = document.getElementById('rowVersion');
    if (activarVersionCnc) {
        document.getElementById("txtVigenteCn").value = formatDate(fechaVersionInicial);
        vigencia.style.display = '';
    } else {
        document.getElementById("txtVigenteCn").value = formatDate(fechaVersionInicial);
        vigencia.style.display = 'none';
    }
    createSelectedElementsForParametros();
    //Create Table Tipos Corida
    var url = route + "/api/TipoCorrida/getAllTipoCorrida";
    Common.sendRequestJsonWithFunction('POST', url, null, undefined, true, null, "createTableTipoCorrida");

    //Create Table Otras Bases
    var url = route + "/api/BaseNomina/getBasesReservadosONoReservados";
    var objBases = {};
    objBases.isReservada = false;
    var data = JSON.stringify(objBases);

    Common.sendRequestJsonWithFunction('POST', url, data, undefined, true, null, "createTableOtrasBases");

    createSelectedElementsPeriodoExcentaISR();

    //Create Table Parametros
    OpenTable(document.getElementById('tblParametros'));

    // InitEventsTable();
}

function doConfirm(msg, yesFn, noFn) {
    $("#contentCnc").addClass("disabledContainer");
    var confirmBox = $("#questionVersion");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".yes,.no").unbind().click(function () {
        $("#contentCnc").removeClass("disabledContainer");
        confirmBox.hide();
    });
    confirmBox.find(".yes").click(yesFn);
    confirmBox.find(".no").click(noFn);
    confirmBox.show();
}

function existeConcepto() {
    var existe = false;
    var url = route + "/api/ConceptosDeNomina/getPorClaveConcepto";
    var data = new Object();
    var keyCnc = document.getElementById("txtClaveCn").value.toString().trim();
    data['claveConcepto'] = keyCnc;
    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {
        existe = Mensaje.resultado;
    } else {
        console.log("Cannot load concepto");
    }
    return false;
}

function openerVersion(opc, idCnc) {
    var showObj = false;
    if (activarVersionCnc) {
        var isCnc = true;
        if (opc === 1) {
            isCnc = existeConcepto();
        }
        if (isCnc) {
            //Show Message
            doConfirm("¿Desea agregar una versión del concepto o modificar una versión?",
               function yes() {//Add version
                   showObj = false;
                   var keyCnc = null;
                   $("#txtVigenteCn").focus();
                   if (opc === 1) {
                       var url = route + "/api/ConceptosDeNomina/getLastVersion";
                       var data = new Object();
                       data['claveConcepto'] = document.getElementById("txtClaveCn").value;
                       data = JSON.stringify(data);// Consultar por la ultima version más reciente y añadir
                       var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
                       if (Mensaje.resultado !== null) {
                           keyCnc = Mensaje.resultado;
                       } else {
                           console.log("Can't load last version of concepto");
                       }
                   } else if (opc === 2) {
                       keyCnc = idCnc;// Consultar por la version seleccionada y añade
                   }
                   if (keyCnc != null) {
                       showCnc(keyCnc, true);
                       createNewCnc(getConcepto);
                       changeDefaultModeButtons("U");
                       document.getElementById("txtClaveCn").disabled = false;
                       document.getElementById("txtVigenteCn").disabled = false;
                       onVersion = true;
                   }

               }, function no() {//Update 
                   showObj = true;
                   onVersion = false;
                   if (opc === 1) {
                       //Fill Versiones
                       var url = route + "/api/ConceptosDeNomina/getVersion";
                       var data = new Object();
                       data['claveConcepto'] = document.getElementById("txtClaveCn").value;
                       data = JSON.stringify(data);
                       Common.sendRequestJsonWithFunction('POST', url, data, undefined, true, null, "fillVersiones");
                       openModalVersion();
                   } else if (opc === 2) {
                       showCnc(idCnc);
                   }
               });
        } else {
            onVersion = false;
            showObj = true;
        }

    } else {
        onVersion = false;
    }
}

function addListenersCnc() {
    $("#txtClaveCn").on('keyup', function (e) {
        if (e.keyCode === 13) {
            openerVersion(1);
        }
    });

    $("#txtClaveCn").on("keydown", function (event) {
        var valor = this.value;
        if (event.keyCode === 13 || event.keyCode === 9) {
            if (valor !== "") {
                valor = construyeMascara("Clave", valor);
                this.value = valor;
            }
        }
    });

    $("#txtVigenteCn").focusout(function () {
        var keyCnc = document.getElementById("txtClaveCn").value;
        var keyDate = document.getElementById("txtVigenteCn").value;
        var dataget = getValConcepto(null, keyCnc, keyDate);
        if (dataget === undefined) {
            console.log("Cnc does not exits");
        } else {
            var msg = confirm("El concepto ya existe ¿Desea modificarlo?");
            if (msg == true) {
                onVersion = false;
                mostrarObjetoCn(dataget);
                getConcepto = dataget;
                changeDefaultModeButtons("M");
                document.getElementById("txtClaveCn").disabled = true;
                document.getElementById("txtVigenteCn").disabled = true;
            } else {
                $("#txtVigenteCn").focus();
            }
        }
    });

    $('input[name=chks]').change(function (e) {
        var idCheck = e.target.id.toString();
        var idCheck = e.target.id.toString();
        if ($(this).is(':checked')) {
            if (idCheck === "chkAfectaISR") {
                $("#txtFormulaExcentaIsr").prop('disabled', false);
                $('#cbxExentaPeriodoISR').removeAttr('disabled');
            } else if (idCheck === "chkAfectaIMSS") {
                $("#txtFormulaExcIMSS").prop('disabled', false);
            }
        } else {
            if (idCheck === "chkAfectaISR") {
                $("#txtFormulaExcentaIsr").prop('disabled', true);
                $('#cbxExentaPeriodoISR').attr('disabled', 'disabled');
                $("#cbxExentaPeriodoISR option:first").prop('selected', 'selected');
                $("#txtFormulaExcentaIsr").val('');
            } else if (idCheck === "chkAfectaIMSS") {
                $("#txtFormulaExcIMSS").prop('disabled', true);
                $("#txtFormulaExcIMSS").val('');
            }
        }
    });

    $('#chkActivarPlaza').change(function () {
        if (this.checked) {
            $("#chkActivarDesgloPlaza").removeAttr("disabled");
        } else {
            $("#chkActivarDesgloPlaza").prop("checked", false);
            $("#chkActivarDesgloPlaza").attr("disabled", true);
        }
    });
}

function createSelectedElementsForParametros() {

    //Clasificacion
    var objClasi = {};
    objClasi.id = 0;
    objClasi.clave = "0";
    objClasi.descripcion = "Entrada";
    listaClasi[listaClasi.length] = objClasi;
    objClasi = {};
    objClasi.id = 1;
    objClasi.clave = ""
    objClasi.descripcion = "Especial";
    listaClasi[listaClasi.length] = objClasi;

    //Unidades
    var objUnidades = {};
    objUnidades.id = "HORAS";
    objUnidades.clave = "Horas";
    objUnidades.descripcion = "Horas";
    listaUnidades.push(objUnidades);
    var objUnidades = {};
    objUnidades.id = "DIAS";
    objUnidades.clave = "DIAS";
    objUnidades.descripcion = "Días";
    listaUnidades.push(objUnidades);
    var objUnidades = {};
    objUnidades.id = "PIEZAS";
    objUnidades.clave = "PIEZAS";
    objUnidades.descripcion = "Piezas";
    listaUnidades.push(objUnidades);
    var objUnidades = {};
    objUnidades.id = "IMPORTE";
    objUnidades.clave = "IMPORTE";
    objUnidades.descripcion = "Importe";
    listaUnidades.push(objUnidades);
    var objUnidades = {};
    objUnidades.id = "OTROS";
    objUnidades.clave = "OTROS";
    objUnidades.descripcion = "Otros";
    listaUnidades.push(objUnidades);

    //Tipos
    var objTipos = {};
    objTipos.id = "INTEGER";
    objTipos.clave = "INTEGER";
    objTipos.descripcion = "Numérico";
    listaTipos.push(objTipos);

    var objTipos = {};
    objTipos.id = "STRING";
    objTipos.clave = "STRING";
    objTipos.descripcion = "Alfanumérico";
    listaTipos.push(objTipos);




}

function createTableTipoCorrida(Mensaje) {
    if (Mensaje.resultado !== null) {
        var typesEs = Mensaje.resultado;
        typesEs.forEach(function (val, index) {
            var obj = {};
            obj.id = val['id'];
            obj.clave = val['descripcion'];
            obj.descripcion = val['clave'];
            listaCorridas[listaCorridas.length] = obj;
        });
    }
    OpenTable(document.getElementById('tblTiposCorrida'));
    InitEventsTable();
}

function fillVersiones(Mensaje) {
    $('#cbxDates').empty();
    if (Mensaje.resultado !== null) {
        var typesVer = Mensaje.resultado;
        var cbx = document.getElementById('cbxDates');
        cbx.appendChild(new Option("", ""));
        typesVer.forEach(function (val, index) {
            var opt = document.createElement('option');
            if (index === 0) {
                opt.innerHTML = "Inicial";
                opt.value = val['id'] + "," + val['clave'] + "," + val['fecha'] + "," + "default";
            } else {
                var fechaVer = new Date(val['fecha']);
                opt.innerHTML = formatDatemmddyyy(fechaVer);
                opt.value = val['id'] + "," + val['clave'] + "," + val['fecha'];
            }
            cbx.appendChild(opt);
        });
    }
}

function createSelectedElementsPeriodoExcentaISR() {

    var cbxExISR = document.getElementById("cbxExentaPeriodoISR");

    var opt = document.createElement('option');
    opt.value = "";
    opt.innerHTML = "";
    cbxExISR.appendChild(opt);

    opt = document.createElement('option');
    opt.value = "NOAPLICA";
    opt.innerHTML = "No Aplica";
    cbxExISR.appendChild(opt);

    opt = document.createElement('option');
    opt.value = "PERIODO";
    opt.innerHTML = "Periodo";
    cbxExISR.appendChild(opt);

    opt = document.createElement('option');
    opt.value = "SEMANAL";
    opt.innerHTML = "Semanal";
    cbxExISR.appendChild(opt);

    opt = document.createElement('option');
    opt.value = "ANUAL";
    opt.innerHTML = "Anual";
    cbxExISR.appendChild(opt);

}

function createTableOtrasBases(Mensaje) {
    if (Mensaje.resultado !== null) {
        var typesEs = Mensaje.resultado;
        typesEs.forEach(function (val, index) {
            var obj = {};
            obj.id = val['id'];
            obj.clave = val['clave'];
            obj.descripcion = val['descripcion'];
            listBasesNoReservadas[listBasesNoReservadas.length] = obj;
        });
    }
    OpenTable(document.getElementById('tblOtrasBases'));
    InitEventsTable();

}

function getValConcepto(idVal, keyVal, dateVal) {
    var concepto = undefined;
    var url = route + "/api/ConceptosDeNomina/getPorIdConcepto";
    var data = new Object();

    if (idVal !== undefined || idVal !== null) {
        data['idConcepto'] = idVal;
    }

    if (keyVal !== undefined || keyVal !== null) {
        data['claveCnc'] = keyVal;
    }

    if (dateVal !== undefined || dateVal !== null) {
        data['fechaCnc'] = dateVal;
    }

    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {
        concepto = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }

    return concepto;
}

function generateValueCn() {
    var obj = {};
    obj.fuentePrincipal = "ConcepNomDefi";
    obj.campo = "clave";
    var keyIngreRein = document.getElementById("txtClaveCn").value;
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
        document.getElementById("txtClaveCn").value = clave;
    } else {
        console.log(Mensaje.error);
    }
}

function construirCn(obj, clearReference) {

    if (clearReference == undefined) {
        clearReference = false;
    }

    var concepNom = null;
    //Create Cnc base
    var conceptoDeNomina = {};
    if (obj === undefined || obj === null) {
        concepNom = {};
        //Create Cnc base
        conceptoDeNomina.clave = document.getElementById("txtClaveCn").value;
        concepNom.conceptoDeNomina = conceptoDeNomina;
    } else {
        concepNom = {};
        if (obj[0].id !== undefined) {
            concepNom.id = obj[0].id;
        }
    }

    var objCnc = null;
    if (obj !== null) {
        if (obj[0].conceptoDeNomina !== undefined) {
            objCnc = obj[0].conceptoDeNomina;
        }
    } else if (getConceptoNom !== undefined) {
        objCnc = getConceptoNom;
    }

    if (objCnc !== null) {
        concepNom.conceptoDeNomina = null;
        concepNom.conceptoDeNomina_ID = objCnc.id;
        //conceptoDeNomina.id = objCnc.id;
        //conceptoDeNomina.clave = objCnc.clave;
        // concepNom.conceptoDeNomina = concepNom;
    }

    if (clearReference) {
        concepNom.id = null;
    }

    concepNom.fecha = document.getElementById("txtVigenteCn").value;

    concepNom.clave = document.getElementById("txtClaveCn").value;
    concepNom.descripcion = document.getElementById("txtDescripcionCn").value;
    concepNom.descripcionAbreviada = document.getElementById("txtDescripcionBreveCn").value;
    //Naturaleza
    if (rbnPercepcion.checked) {
        concepNom.naturaleza = 0;
    } else if (rbnDeduccion.checked) {
        concepNom.naturaleza = 1;
    } else if (rbnCalculo.checked) {
        concepNom.naturaleza = 2;
    } else if (rbnDato.checked) {
        concepNom.naturaleza = 3;
    } else if (rbnInformativo.checked) {
        concepNom.naturaleza = 4;
    }
    //Tipo
    if (rbnRepetitivoCn.checked) {
        concepNom.tipo = 0;
    } else if (rbnSoloPeriodoCn.checked) {
        concepNom.tipo = 1;
    } else if (rbnAutomaticoCn.checked) {
        concepNom.tipo = 2;
    }

    concepNom.formulaConcepto = $('#formulaCn').val();
    concepNom.condicionConcepto = $('#formulaCondicionCn').val();

    dataBasesAfectasCnc = construirBasesAfectasCn(dataBasesAfectasCnc);

    if ($('#chkActivarPlaza').is(":checked")) {
        concepNom.activarPlaza = true;
    } else {
        concepNom.activarPlaza = false;
    }

    if ($('#chkActivarDesgloPlaza').is(":checked")) {
        concepNom.activarDesglose = true;
    } else {
        concepNom.activarDesglose = false;
    }

    concepNom.mascara = document.getElementById("txtMascara").value;
    // categoriaPuestos_ID (Pendiente)

    if ($('#chkActivarConcepto').is(":checked")) {
        concepNom.activado = true;
    } else {
        concepNom.activado = false;
    }

    if ($('#chkImprimirListadoNom').is(":checked")) {
        concepNom.imprimirEnListadoNomina = true;
    } else {
        concepNom.imprimirEnListadoNomina = false;
    } true

    if ($('#chkImprimirReciboNom').is(":checked")) {
        concepNom.imprimirEnReciboNomina = true;
    } else {
        concepNom.imprimirEnReciboNomina = false;
    }

    if ($('#rbnRedondearCn').is(":checked")) {
        concepNom.tipoAccionMascaras = true;
    } else if ($('#rbnTruncarCn').is(":checked")) {
        concepNom.tipoAccionMascaras = false;
    }

    concepNom.subCuenta = document.getElementById("txtSubcuenta").value;
    concepNom.comportamiento = document.getElementById("txtComportamiento").value;

    return concepNom;
}

function construirBasesAfectasCn(listObj) {
    var baseAfecCnc = null;
    if (listObj === undefined || listObj === null) {
        baseAfecCnc = new Array();
    } else {
        baseAfecCnc = listObj;
    }

    if (onVersion) {
        dataBasesAfectasCnc = null;
        baseAfecCnc = new Array();
    }

    //ISR(1)
    var baseISR = {};
    var afectaIsr = $.grep(baseAfecCnc, function (obj) { return obj.baseNomina_ID === 1; })[0];
    if ($('#chkAfectaISR').is(":checked")) {
        if (afectaIsr !== undefined) {
            baseISR.id = afectaIsr.id;
        }
        if (onVersion) {
            baseISR.id = 0;
        }
        baseISR.formulaExenta = $('#txtFormulaExcentaIsr').val();
        baseISR.periodoExentoISR = null;
        baseISR.tipoAfecta = 0;
        baseISR.baseNomina_ID = 1;
        baseISR.concepNomDefin_ID = null;
        baseAfecCnc.push(baseISR);
    } else {
        if (afectaIsr !== undefined) {
            baseAfecCnc = deleteBaseAfectada(baseAfecCnc, 1);
        }
    }

    //IMSS(2)
    var baseIMSS = {};
    var afectaIMSS = $.grep(baseAfecCnc, function (obj) { return obj.baseNomina_ID === 2; })[0];
    if ($('#chkAfectaIMSS').is(":checked")) {
        if (afectaIMSS !== undefined) {
            baseIMSS.id = afectaIMSS.id;
        }
        if (onVersion) {
            baseIMSS.id = 0;
        }
        baseIMSS.formulaExenta = $('#txtFormulaExcIMSS').val();
        baseIMSS.periodoExentoISR = $("#cbxExentaPeriodoISR option:selected").val();
        if ($('#rbnAfectaFijoCn').is(":checked")) {
            baseIMSS.tipoAfecta = 0;
        } else if ($('#rbnAfectaVariableCn').is(":checked")) {
            baseIMSS.tipoAfecta = 1;
        }
        baseIMSS.baseNomina_ID = 2;
        baseIMSS.concepNomDefin_ID = null;
        baseAfecCnc.push(baseIMSS);
    } else {
        if (afectaIMSS !== undefined) {
            baseAfecCnc = deleteBaseAfectada(baseAfecCnc, 2);
        }
    }

    //INFONAVIT(3)
    var baseINFO = {};
    var afectaINFO = $.grep(baseAfecCnc, function (obj) { return obj.baseNomina_ID === 3; })[0];
    if ($('#chkAfectaInfo').is(":checked")) {
        if (afectaINFO !== undefined) {
            baseINFO.id = afectaINFO.id;
        }
        if (onVersion) {
            baseINFO.id = 0;
        }
        baseINFO.formulaExenta = null;
        baseINFO.periodoExentoISR = null;
        baseINFO.tipoAfecta = -1;
        baseINFO.baseNomina_ID = 3;
        baseINFO.concepNomDefin_ID = null;
        baseAfecCnc.push(baseINFO);
    } else {
        if (afectaINFO !== undefined) {
            baseAfecCnc = deleteBaseAfectada(baseAfecCnc, 3);
        }
    }

    //PTU(4)
    var basePTU = {};
    var afectaPTU = $.grep(baseAfecCnc, function (obj) { return obj.baseNomina_ID === 4; })[0];
    if ($('#chkAfectaPTU').is(":checked")) {
        if (afectaPTU !== undefined) {
            basePTU.id = afectaPTU.id;
        }
        if (onVersion) {
            basePTU.id = 0;
        }
        basePTU.formulaExenta = null;
        basePTU.periodoExentoISR = null;
        basePTU.tipoAfecta = -1;
        basePTU.baseNomina_ID = 4;
        basePTU.concepNomDefin_ID = null;
        baseAfecCnc.push(basePTU);
    } else {
        if (afectaPTU !== undefined) {
            baseAfecCnc = deleteBaseAfectada(baseAfecCnc, 4);
        }
    }

    //IMPUESTO SOBRE NOMINA(5)
    var baseAFNOM = {};
    var afectaAFNOM = $.grep(baseAfecCnc, function (obj) { return obj.baseNomina_ID === 5; })[0];
    if ($('#chkAfectaImpSoNom').is(":checked")) {
        if (afectaAFNOM !== undefined) {
            baseAFNOM.id = afectaAFNOM.id;
        }
        if (onVersion) {
            baseAFNOM.id = 0;
        }
        baseAFNOM.formulaExenta = null;
        baseAFNOM.periodoExentoISR = null;
        baseAFNOM.tipoAfecta = -1;
        baseAFNOM.baseNomina_ID = 5;
        baseAFNOM.concepNomDefin_ID = null;
        baseAfecCnc.push(baseAFNOM);
    } else {
        if (afectaAFNOM !== undefined) {
            baseAfecCnc = deleteBaseAfectada(baseAfecCnc, 5);
        }
    }

    //DESPENSA(6)
    var baseDES = {};
    var afectaDES = $.grep(baseAfecCnc, function (obj) { return obj.baseNomina_ID === 6; })[0];
    if ($('#chkAfectaDespensa').is(":checked")) {
        if (afectaDES !== undefined) {
            baseDES.id = afectaDES.id;
        }
        if (onVersion) {
            baseDES.id = 0;
        }
        baseDES.formulaExenta = null;
        baseDES.periodoExentoISR = null;
        baseDES.tipoAfecta = -1;
        baseDES.baseNomina_ID = 6;
        baseDES.concepNomDefin_ID = null;
        baseAfecCnc.push(baseDES);
    } else {
        if (afectaDES !== undefined) {
            baseAfecCnc = deleteBaseAfectada(baseAfecCnc, 6);
        }
    }

    //FONDO AHORRO(7)
    var baseFondo = {};
    var afectaFondo = $.grep(baseAfecCnc, function (obj) { return obj.baseNomina_ID === 7; })[0];
    if ($('#chkAfectaFondoAhorro').is(":checked")) {
        if (afectaFondo !== undefined) {
            baseFondo.id = afectaFondo.id;
        }
        if (onVersion) {
            baseFondo.id = 0;
        }
        baseFondo.formulaExenta = null;
        baseFondo.periodoExentoISR = null;
        baseFondo.tipoAfecta = -1;
        baseFondo.baseNomina_ID = 7;
        baseFondo.concepNomDefin_ID = null;
        baseAfecCnc.push(baseFondo);
    } else {
        if (afectaFondo !== undefined) {
            baseAfecCnc = deleteBaseAfectada(baseAfecCnc, 7);
        }
    }

    //AGUINALDO(8)
    var baseAGUI = {};
    var afectaAGUI = $.grep(baseAfecCnc, function (obj) { return obj.baseNomina_ID === 8; })[0];
    if ($('#chkAfectaAguinaldo').is(":checked")) {
        if (afectaAGUI !== undefined) {
            baseAGUI.id = afectaAGUI.id;
        }
        if (onVersion) {
            baseAGUI.id = 0;
        }
        baseAGUI.formulaExenta = null;
        baseAGUI.periodoExentoISR = null;
        baseAGUI.tipoAfecta = -1;
        baseAGUI.baseNomina_ID = 8;
        baseAGUI.concepNomDefin_ID = null;
        baseAfecCnc.push(baseAGUI);
    } else {
        if (afectaAGUI !== undefined) {
            baseAfecCnc = deleteBaseAfectada(baseAfecCnc, 8);
        }
    }

    return baseAfecCnc;
}

function deleteBaseAfectada(listBase, tipoBaseAfecta) {
    for (let i = 0; i < dataBasesAfectasCnc.length; i++) {
        if (dataBasesAfectasCnc[i].baseNomina_ID === tipoBaseAfecta) {
            deleteBasesAfectasCnc.push(dataBasesAfectasCnc[i].id);
            listBase.splice(i, 1);
            break;
        }
    }
    return listBase;
}

function mostrarObjetoCn(obj) {
    var conceptosData = obj[0];
    var parametrosData = obj[1];
    var cncPorCorridaData = obj[2];
    var cncBasesAfectas = obj[3];
    var cncOtrasBases = obj[4];
    document.getElementById("txtClaveCn").value = conceptosData.clave;
    document.getElementById("txtVigenteCn").value = formatDate(new Date(conceptosData.fecha));
    document.getElementById("txtDescripcionCn").value = conceptosData.descripcion;
    document.getElementById("txtDescripcionBreveCn").value = conceptosData.descripcionAbreviada;

    //Naturaleza
    if (conceptosData.naturaleza === 0) {
        $('#rbnPercepcion').prop('checked', true);
    } else if (conceptosData.naturaleza === 1) {
        $('#rbnDeduccion').prop('checked', true);
    } else if (conceptosData.naturaleza === 2) {
        $('#rbnCalculo').prop('checked', true);
    } else if (conceptosData.naturaleza === 3) {
        $('#rbnDato').prop('checked', true);
    } else if (conceptosData.naturaleza === 4) {
        $('#rbnInformativo').prop('checked', true);
    }

    //Tipo
    if (conceptosData.tipo === 0) {
        $('#rbnRepetitivoCn').prop('checked', true);
    } else if (conceptosData.tipo === 1) {
        $('#rbnSoloPeriodoCn').prop('checked', true);
    } else if (conceptosData.tipo === 2) {
        $('#rbnAutomaticoCn').prop('checked', true);
    }

    $("textarea#formulaCn").val(conceptosData.formulaConcepto);
    $("textarea#formulaCondicionCn").val(conceptosData.condicionConcepto);

    dataParametros = parametrosData;
    dataConceptoPorTipoCorrida = cncPorCorridaData;
    dataBasesAfectasCnc = cncBasesAfectas;
    dataOtrasBases = cncOtrasBases;

    /*W:7*/
    llenarTablaGen("tblParametros", parametrosData, 0, parametrosData.length);
    llenarTablaGen("tblTiposCorrida", cncPorCorridaData, 0, cncPorCorridaData.length);
    llenarTablaGen("tblOtrasBases", cncOtrasBases, 0, cncOtrasBases.length);


    //Bases afectas
    if (cncBasesAfectas !== undefined || cncBasesAfectas !== null) {
        dataBasesAfectasCnc = cncBasesAfectas;

        //ISR(1)
        var afectaIsr = $.grep(dataBasesAfectasCnc, function (obj) { return obj.baseNomina_ID === 1; })[0];
        if (afectaIsr === undefined || afectaIsr === null) {
            $('#chkAfectaISR').prop('checked', false);
        } else {
            $("#txtFormulaExcentaIsr").prop('disabled', false);
            $('#cbxExentaPeriodoISR').removeAttr('disabled');
            $("textarea#txtFormulaExcentaIsr").val(afectaIsr.formulaExenta);
            $('#chkAfectaISR').prop('checked', true);
        }

        //IMSS(2)
        var afectaIMSS = $.grep(dataBasesAfectasCnc, function (obj) { return obj.baseNomina_ID === 2; })[0];
        if (afectaIMSS === undefined || afectaIMSS === null) {
            $('#chkAfectaIMSS').prop('checked', false);
        } else {
            $("#txtFormulaExcIMSS").prop('disabled', false);
            $('#chkAfectaIMSS').prop('checked', true);
            $("textarea#txtFormulaExcIMSS").val(afectaIMSS.formulaExenta);
            if (afectaIMSS.tipoAfecta === 0) {
                $('#rbnAfectaFijoCn').prop('checked', true);
            } else if (afectaIMSS.tipoAfecta === 1) {
                $('#rbnAfectaVariableCn').prop('checked', true);
            }
        }


        //INFONAVIT(3)
        var afectaINFO = $.grep(dataBasesAfectasCnc, function (obj) { return obj.baseNomina_ID === 3; })[0];
        if (afectaINFO === undefined || afectaINFO === null) {
            $('#chkAfectaInfo').prop('checked', false);
        } else {
            $('#chkAfectaInfo').prop('checked', true);
        }

        //PTU(4)
        var afectaPTU = $.grep(dataBasesAfectasCnc, function (obj) { return obj.baseNomina_ID === 4; })[0];
        if (afectaPTU === undefined || afectaPTU === null) {
            $('#chkAfectaPTU').prop('checked', false);
        } else {
            $('#chkAfectaPTU').prop('checked', true);
        }

        //IMPUESTO SOBRE NOMINA(5)
        var afectaAFNOM = $.grep(dataBasesAfectasCnc, function (obj) { return obj.baseNomina_ID === 5; })[0];
        if (afectaAFNOM === undefined || afectaAFNOM === null) {
            $('#chkAfectaImpSoNom').prop('checked', false);
        } else {
            $('#chkAfectaImpSoNom').prop('checked', true);
        }

        //DESPENSA(6)
        var afectaDES = $.grep(dataBasesAfectasCnc, function (obj) { return obj.baseNomina_ID === 6; })[0];
        if (afectaDES === undefined || afectaDES === null) {
            $('#chkAfectaDespensa').prop('checked', false);
        } else {
            $('#chkAfectaDespensa').prop('checked', true);
        }

        //FONDO AHORRO(7)
        var afectaFondo = $.grep(dataBasesAfectasCnc, function (obj) { return obj.baseNomina_ID === 7; })[0];
        if (afectaFondo === undefined || afectaFondo === null) {
            $('#chkAfectaFondoAhorro').prop('checked', false);
        } else {
            $('#chkAfectaFondoAhorro').prop('checked', true);
        }

        //AGUINALDO(8)
        var afectaAGUI = $.grep(dataBasesAfectasCnc, function (obj) { return obj.baseNomina_ID === 8; })[0];
        if (afectaAGUI === undefined || afectaAGUI === null) {
            $('#chkAfectaAguinaldo').prop('checked', false);
        } else {
            $('#chkAfectaAguinaldo').prop('checked', true);
        }
    }

    if (conceptosData.activarPlaza) {
        $('#chkActivarPlaza').prop('checked', true);
    } else {
        $('#chkActivarPlaza').prop('checked', false);
    }

    if (conceptosData.activarDesglose) {
        $('#chkActivarDesgloPlaza').prop('checked', true);
    } else {
        $('#chkActivarDesgloPlaza').prop('checked', false);
    }

    document.getElementById("txtMascara").value = conceptosData.mascara;

    if (conceptosData.activado) {
        $('#chkActivarConcepto').prop('checked', true);
    } else {
        $('#chkActivarConcepto').prop('checked', false);
    }

    if (conceptosData.imprimirEnListadoNomina) {
        $('#chkImprimirListadoNom').prop('checked', true);
    } else {
        $('#chkImprimirListadoNom').prop('checked', false);
    }

    if (conceptosData.imprimirEnReciboNomina) {
        $('#chkImprimirReciboNom').prop('checked', true);
    } else {
        $('#chkImprimirReciboNom').prop('checked', false);
    }

    if (conceptosData.tipoAccionMascaras) {
        $('#rbnRedondearCn').prop('checked', true);
    } else if (!conceptosData.tipoAccionMascaras) {
        $('#rbnTruncarCn').prop('checked', true);
    }

    document.getElementById("txtSubcuenta").value = conceptosData.subCuenta;
    document.getElementById("txtComportamiento").value = conceptosData.comportamiento;
}

function addDataToPersist(listData) {
    var addOnthisList = new Array();
    for (var i = 0; i < listData.length; i++) {
        if (listData[i].statusFila === "NUEVO" ||
            listData[i].statusFila === "MODIFICADOBDS") {
            addOnthisList[addOnthisList.length] = listData[i];
        }
    }
    return addOnthisList;
}

function addDataToPersistParametros(listData) {
    var addOnthisList = new Array();
    for (var i = 0; i < listData.length; i++) {
        if (onVersion) {
            var obj = {};
            obj.id = 0;
            obj.clasificadorParametro = listData[i].clasificadorParametro.id;
            obj.descripcion = listData[i].descripcion;
            obj.mascara = listData[i].mascara;
            obj.numero = listData[i].numero;
            obj.tipo = listData[i].tipo.id;
            obj.unidad = listData[i].unidad.id;
            obj.concepNomDefi_ID = null;
            obj.statusFila = "NUEVO";
            addOnthisList.push(obj);
        }
        else if (listData[i].statusFila === "NUEVO" ||
             listData[i].statusFila === "MODIFICADOBDS") {
            addOnthisList[addOnthisList.length] = listData[i];
        }

    }
    return addOnthisList;
}

function addDataToPersistTipoCorridas(listData) {
    var addOnthisList = new Array();
    for (var i = 0; i < listData.length; i++) {
        if (onVersion) {
            var obj = {};
            obj.id = 0;
            obj.cantidad = listData[i].cantidad;
            obj.descuentoCreditos = listData[i].descuentoCreditos;
            obj.incluir = listData[i].incluir;
            obj.modificarCantidad = listData[i].modificarCantidad;
            obj.modificarImporte = listData[i].modificarImporte;
            obj.mostrar = listData[i].mostrar;
            obj.opcional = listData[i].opcional;
            obj.concepNomDefi_ID = null;
            obj.tipoCorrida_ID = listData[i].tipoCorrida_ID;
            obj.statusFila = "NUEVO";
            addOnthisList.push(obj);
        } else if (listData[i].statusFila === "NUEVO" ||
            listData[i].statusFila === "MODIFICADOBDS") {
            addOnthisList[addOnthisList.length] = listData[i];
        }
    }
    return addOnthisList;
}

function addDataToPersistOtrasBases(listData) {
    var addOnthisList = new Array();
    for (var i = 0; i < listData.length; i++) {
        if (onVersion) {
            var obj = {};
            obj.id = 0;
            obj.formulaExenta = listData[i].formulaExenta;
            obj.periodoExentoISR = listData[i].periodoExentoISR;
            obj.tipoAfecta = listData[i].tipoAfecta;
            obj.baseNomina_ID = listData[i].baseNomina_ID;
            obj.concepNomDefi_ID = null;
            obj.statusFila = "NUEVO";
            addOnthisList.push(obj);
        }
        else if (listData[i].statusFila === "NUEVO" ||
             listData[i].statusFila === "MODIFICADOBDS") {
            addOnthisList[addOnthisList.length] = listData[i];
        }

    }
    return addOnthisList;
}

function clearUnnesecaryReferencesParametros(listParametros) {
    for (var i = 0; i < listParametros.length; i++) {
        delete listParametros[i].statusFila;
        if (!Number.isInteger(listParametros[i].id)) {
            listParametros[i].id = 0;
        }
    }
    return listParametros;
}

function clearUnnesecaryReferencesCncCorrida(listCorridas) {
    for (var i = 0; i < listCorridas.length; i++) {
        delete listCorridas[i].statusFila;
        if (!Number.isInteger(listCorridas[i].id)) {
            listCorridas[i].id = 0;
        }
        if (onVersion) {
            listCorridas[i].id = 0;
        }
    }
    return listCorridas;
}

function clearUnnesecaryReferencesCncOtrasBases(listBases) {
    for (var i = 0; i < listBases.length; i++) {
        delete listBases[i].statusFila;
        if (!Number.isInteger(listBases[i].id)) {
            listBases[i].id = 0;
        }
        if (onVersion) {
            listBases[i].id = 0;
        }
    }
    return listBases;
}

function makeActionCn(action, obj) {
    var succes = false;
    var listParametrosAddMod = addDataToPersistParametros(dataParametros);
    listParametrosAddMod = clearUnnesecaryReferencesParametros(listParametrosAddMod);

    var listCncCorrAddMod = addDataToPersistTipoCorridas(dataConceptoPorTipoCorrida);
    listCncCorrAddMod = clearUnnesecaryReferencesCncCorrida(listCncCorrAddMod);

    var listCncOtrasBasesAddMod = addDataToPersistOtrasBases(dataOtrasBases);
    listCncOtrasBasesAddMod = clearUnnesecaryReferencesCncOtrasBases(listCncOtrasBasesAddMod);

    var objConceptos = {};
    objConceptos.entity = construirCn(obj);
    objConceptos.listParametrosAM = listParametrosAddMod;
    objConceptos.listParametrosDE = deleteParametros;
    objConceptos.listConCorridaAM = listCncCorrAddMod;
    objConceptos.listConCorridaDE = deleteConceptoPorTipoCorrida;
    objConceptos.listBasesAfectaAM = dataBasesAfectasCnc;
    objConceptos.listBasesAfectaDE = deleteBasesAfectasCnc;
    objConceptos.listOtrasBasesAfectaAM = listCncOtrasBasesAddMod;
    objConceptos.listOtrasBasesAfectaDE = deleteOtrasBases;

    if (action === "A") {
        var url = route + "/api/ConceptosDeNomina/saveConceptos";
        //ADD CONCEPTOS
        var data = JSON.stringify(objConceptos);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        var result = Mensaje.resultado
        if (result === true) {
            succes = true;
        } else if (result === -1) {
            $("#txtVigenteCn").focus();
            alert("No se puede agregar un concepto con la misma fecha de versión");
        } else if (result === -2) {
            $("#txtVigenteCn").focus();
            alert("No se puede agregar un concepto con una fecha inferior a la de su creación");
        }
        else {
            alert(Mensaje.error);
        }
    }
    else if (action === "M") {
        var url = route + "/api/ConceptosDeNomina/saveConceptos";
        //UPDATE CONCEPTOS
        var data = JSON.stringify(objConceptos);
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
    }
    else if (action === "E") {
        var url = route + "/api/ConceptosDeNomina/eliminarConceptos";
        //DELETE CONCEPTOS
        var data = JSON.stringify(objConceptos.entity);
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
    }
    return succes;
}

function preValidateBeforeSaveCn() {
    var goCn = true;
    // goEmployee = validateComponents(elements);
    return goCn;
}

/*Function Buttons*/
function saveCn() {
    if (preValidateBeforeSaveCn()) {
        var succes = false;
        succes = makeActionCn("A", null);
        if (succes) {
            limpiarComponentesCn();
            generateValueCn();
        }
    }
}

function updateCn() {
    var succes = false;
    if (preValidateBeforeSaveCn()) {
        succes = makeActionCn("M", getConcepto);
        if (succes) {
            limpiarComponentesCn();
            changeDefaultModeButtons("U");
            document.getElementById("txtClaveCn").disabled = false;
            document.getElementById("txtVigenteCn").disabled = false;
            generateValueCn();
        }
    }
}

function deleteCn() {
    var succes = false;
    var msg = confirm("¿Deseas realmente eliminar este concepto?");
    if (msg == true) {
        succes = makeActionCn("E", getConcepto);
        if (succes) {
            limpiarComponentesCn();
            changeDefaultModeButtons("E");
            generateValueCn();
        }
    }
}

function cancelCn() {
    limpiarComponentesCn();
    generateValueCn();
    changeDefaultModeButtons("U");
    document.getElementById("txtClaveCn").disabled = false;
    document.getElementById("txtVigenteCn").disabled = false;
    // enabledCatalogEmp(true);
}

/*Default Functions*/
function limpiarComponentesCn() {
    document.getElementById("txtClaveCn").value = "";
    document.getElementById("txtDescripcionCn").value = "";
    document.getElementById("txtVigenteCn").value = formatDate(fechaVersionInicial);
    document.getElementById("txtDescripcionBreveCn").value = "";
    document.getElementById("rbnPercepcion").checked = false;
    document.getElementById("rbnDeduccion").checked = false;
    document.getElementById("rbnCalculo").checked = false;
    document.getElementById("rbnDato").checked = false;
    document.getElementById("rbnInformativo").checked = false;
    document.getElementById("rbnRepetitivoCn").checked = false;
    document.getElementById("rbnSoloPeriodoCn").checked = false;
    document.getElementById("rbnAutomaticoCn").checked = false;
    $('#formulaCn').val('');
    $('#formulaCondicionCn').val('');

    //Clear Global Variables
    getConcepto = null;
    onVersion = false;
    //listaClasi = new Array();
    //listaUnidades = new Array();
    //listaTipos = new Array();

    /*W:8*/
    dataParametros = new Array();
    deleteParametros = new Array();
    clearTable("tblParametros");

    dataConceptoPorTipoCorrida = new Array();
    deleteConceptoPorTipoCorrida = new Array();
    clearTable("tblTiposCorrida");

    dataBasesAfectasCnc = null;
    deleteBasesAfectasCnc = new Array();

    dataOtrasBases = new Array();
    deleteOtrasBases = new Array();
    clearTable("tblOtrasBases");

    document.getElementById("chkAfectaISR").checked = false;
    document.getElementById("chkAfectaIMSS").checked = false;
    document.getElementById("chkAfectaInfo").checked = false;
    document.getElementById("chkAfectaPTU").checked = false;
    document.getElementById("chkAfectaImpSoNom").checked = false;
    document.getElementById("chkAfectaDespensa").checked = false;
    document.getElementById("chkAfectaFondoAhorro").checked = false;
    document.getElementById("chkAfectaAguinaldo").checked = false;



    $('#txtFormulaExcentaIsr').val('');
    $('#txtFormulaExcIMSS').val('');
    $("#cbxExentaPeriodoISR option:first").prop('selected', 'selected');
    $("#rbnAfectaFijoCn").prop("checked", true);

    document.getElementById("chkActivarPlaza").checked = false;
    document.getElementById("chkActivarDesgloPlaza").checked = false;
    $("#cbxCategoriaPuesto option:first").prop('selected', 'selected');
    document.getElementById("chkActivarConcepto").checked = false;
    document.getElementById("chkImprimirListadoNom").checked = false;
    document.getElementById("chkImprimirReciboNom").checked = false;
    document.getElementById("txtMascara").value = "";
    document.getElementById("rbnRedondearCn").checked = false;
    document.getElementById("rbnTruncarCn").checked = false;
    document.getElementById("txtSubcuenta").value = "";
    document.getElementById("txtComportamiento").value = "";


    //validateComponents(elements, true);
    InitEventsTable();
}

function enabledCatalogCn(change) {
    if (change) {
        document.getElementById("txtClaveEmp").disabled = false;
        document.getElementById("txtApellPatEmp").disabled = false;
        document.getElementById("txtApellMatEmp").disabled = false;
        document.getElementById("txtNombreEmp").disabled = false;
        document.getElementById("txtNombreAbrevEmp").disabled = false;
        document.getElementById("txtFechaNacEmp").disabled = false;
        document.getElementById("cbxEstadoNacEm").disabled = false;
        document.getElementById("txtLugarNacEmp").disabled = false;
        document.getElementById("imageUpload").disabled = false;
        document.getElementById("cbxPaisesOrEm").disabled = false;
        document.getElementById("txtNacionEmp").disabled = false;
        document.getElementById("cbxGeneroEm").disabled = false;
        document.getElementById("cbxEstadoCivEm").disabled = false;
        document.getElementById("txtRFCEmp").disabled = false;
        document.getElementById("txtCurpEmp").disabled = false;
        document.getElementById("txtNoSegSocialEmp").disabled = false;
        document.getElementById("txtClinicaEmp").disabled = false;
        document.getElementById("txtCorreoElEmp").disabled = false;
        document.getElementById("txtTelefonoEmp").disabled = false;
        document.getElementById("txtCalleEmp").disabled = false;
        document.getElementById("txtNumExtEmp").disabled = false;
        document.getElementById("txtNumIntEmp").disabled = false;
        document.getElementById("txtColoniaEmp").disabled = false;
        document.getElementById("cbxCpEm").disabled = false;
        document.getElementById("cbxCiudadesEm").disabled = false;
        document.getElementById("cbxMunicipiosEm").disabled = false;
        document.getElementById("cbxEstadosEm").disabled = false;
        document.getElementById("cbxPaisesEm").disabled = false;
    } else {
        document.getElementById("txtClaveEmp").disabled = true;
        document.getElementById("txtApellPatEmp").disabled = true;
        document.getElementById("txtApellMatEmp").disabled = true;
        document.getElementById("txtNombreEmp").disabled = true;
        document.getElementById("txtNombreAbrevEmp").disabled = true;
        document.getElementById("txtFechaNacEmp").disabled = true;
        document.getElementById("cbxEstadoNacEm").disabled = true;
        document.getElementById("txtLugarNacEmp").disabled = true;
        document.getElementById("imageUpload").disabled = true;
        document.getElementById("cbxPaisesOrEm").disabled = true;
        document.getElementById("txtNacionEmp").disabled = true;
        document.getElementById("cbxGeneroEm").disabled = true;
        document.getElementById("cbxEstadoCivEm").disabled = true;
        document.getElementById("txtRFCEmp").disabled = true;
        document.getElementById("txtCurpEmp").disabled = true;
        document.getElementById("txtNoSegSocialEmp").disabled = true;
        document.getElementById("txtClinicaEmp").disabled = true;
        document.getElementById("txtCorreoElEmp").disabled = true;
        document.getElementById("txtTelefonoEmp").disabled = true;
        document.getElementById("txtCalleEmp").disabled = true;
        document.getElementById("txtNumExtEmp").disabled = true;
        document.getElementById("txtNumIntEmp").disabled = true;
        document.getElementById("txtColoniaEmp").disabled = true;
        document.getElementById("cbxCpEm").disabled = true;
        document.getElementById("cbxCiudadesEm").disabled = true;
        document.getElementById("cbxMunicipiosEm").disabled = true;
        document.getElementById("cbxEstadosEm").disabled = true;
        document.getElementById("cbxPaisesEm").disabled = true;
    }
}

/*Table selector*/
function selectorConceptos() {
    //Parameters
    nameCmp = "selectorCn";
    title = "Conceptos de nómina";
    table = "ConcepNomDefi";
    var subNaturaleza = "@(Select CASE WHEN o.naturaleza = 0 THEN 'Percepción' ELSE CASE WHEN o.naturaleza = 1 ";
    subNaturaleza += "THEN 'Deducción' ELSE CASE WHEN o.naturaleza = 2 THEN 'Cálculo' ELSE CASE WHEN o.naturaleza = 3 ";
    subNaturaleza += "THEN 'Dato' ELSE 'Informativo' END END END END from ConcepNomDefi con where con.id = o.id)";

    var subTipo = "@(Select CASE WHEN o.tipo = 0 THEN 'Repetitivo' ELSE CASE WHEN o.tipo = 1 ";
    subTipo += "THEN 'Solo en el periodo' ELSE 'Automático' END END from ConcepNomDefi con where con.id = o.id)";
    nameCols = idiomaSelecionadoCol.messageFormatter("ConceptosNominaClave")() + "," + idiomaSelecionadoCol.messageFormatter("ConceptosNominaVersion")() + "," +
        idiomaSelecionadoCol.messageFormatter("ConceptosNominaDescripcion")() + "," + idiomaSelecionadoCol.messageFormatter("ConceptosNominaDescripcionAbre")() + "," +
        idiomaSelecionadoCol.messageFormatter("ConceptosNominaNaturaleza")() + "," + idiomaSelecionadoCol.messageFormatter("ConceptosNominaTipo")();
   // nameCols = "Concepto,Versión,Descripción,Descripción abreviada,Naturaleza,Tipo";
    campos = "clave,Date:fecha,descripcion,descripcionAbreviada," + subNaturaleza + "," + subTipo;

    // If contains filters
    preFilters = setPreFilters();
    var filtersSearch = [];

    //With operador
    // filtersSearch[0] = { "etiqueta": "Clave", "tipo": "string", "campo": "clave", "medida": "s", "operador": "#=" }; 
    filtersSearch[0] = { "etiqueta": "Clave", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripcion", "tipo": "string", "campo": "descripcion", "medida": "m" };

    var optionals = new Object();
    optionals["camposOrden"] = ["clave"];


    //Cast to interger if column string send this integer:column
    //optionals["camposOrden"] = ["integer:clave"]; Ya no se usa así
    // optionals["camposOrden"] = ["clave", "descripcion"];
    //Other Examples
    //optionals["camposOrden"] = ["descripcion"];

    //optionals["tipoOrden"] = "DESC";

    return buildTableSearch(nameCmp, title, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
         typeof camposObtener === 'undefined' ? null : camposObtener,
         false,
         typeof optionals === 'undefined' ? null : optionals);
}

function selectorConceptosShow(idVal) {
    openerVersion(2, idVal[0]);
}

function showCnc(idCnc, setActualDate) {
    var dataget = getValConcepto(idCnc);// Obtener por versión o agregar nueva
    if (dataget === undefined) {
        console.log("Problems to select conceptos");
    } else {
        if (setActualDate) {
            var date = new Date(getFechaSistema());
            dataget[0].fecha = date;
            //Set actual date on version

            //document.getElementById("txtVigenteCn").value = formatDate(date);
        }
        mostrarObjetoCn(dataget);
        getConcepto = dataget;
        changeDefaultModeButtons("M");
        document.getElementById("txtClaveCn").disabled = true;
        document.getElementById("txtVigenteCn").disabled = true;
    }
}

/*---------------W:1 Config Table---------------*/
function editTableParametros() {
    var nameTable = "tblParametros";
    var nameCols = crearListaColumnas(1);
    var activaAdd = true;
    var activaDelete = true;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function editTableTiposCorrida() {
    var nameTable = "tblTiposCorrida";
    var nameCols = crearListaColumnas(2);
    var activaAdd = true;
    var activaDelete = true;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function editTableOtrasBasesAfecta() {
    var nameTable = "tblOtrasBases";
    var nameCols = crearListaColumnas(3);
    var activaAdd = true;
    var activaDelete = true;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

/*---------------END Config Table---------------*/

/*---------------W:2---------------*/
function crearListaColumnas(typeTbl) {
    var columnasTabla = new Array();

    if (typeTbl === 1) {//Parametros
        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("ParaConcepDeNomNumero")(), "nombreCompo": "numero", "editable": false,
            "tipoCompon": "rowCount", "persist": "numero", "ancho": "80px"
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("ParaConcepDeNomClasificadorParametro")(), "nombreCompo": "clasificacion", "editable": true,
            "tipoCompon": "select", "persist": "clasificadorParametro", "ancho": "130px", "data": listaClasi
        };
        columnasTabla.push(col);

        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("ParaConcepDeNomDescripcion")(), "nombreCompo": "descripcion", "editable": true,
            "tipoCompon": "text", "persist": "descripcion", "ancho": "150px"
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("ParaConcepDeNomUnidad")(), "nombreCompo": "unidad", "editable": true,
            "tipoCompon": "select", "persist": "unidad", "ancho": "130px", "data": listaUnidades
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("ParaConcepDeNomMascara")(), "nombreCompo": "mascara", "editable": true,
            "tipoCompon": "text", "persist": "mascara", "ancho": "200px",
            "data": listaClasi
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("ParaConcepDeNomTipo")(), "nombreCompo": "FechaNacimiento", "editable": true,
            "tipoCompon": "select", "persist": "tipo", "ancho": "150px", "data": listaTipos
        };
        columnasTabla.push(col);
    } else if (typeTbl === 2) {//Tipo Corrida
        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("TipoCorridaclave")(), "nombreCompo": "clave", "editable": true,
            "tipoCompon": "select", "persist": "tipoCorrida", "ancho": "190px", "data": listaCorridas, "funcion": "getTipoCorrida"
        };
        columnasTabla.push(col);
        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("TipoCorrida")(), "nombreCompo": "tipocorrida", "editable": false,
            "tipoCompon": "text", "persist": "nombreTipocorrida", "ancho": "300px"
        };
        columnasTabla.push(col);
    } else if (typeTbl === 3) {//Otras bases
        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptosNominaTblOtrasBases")(), "nombreCompo": "otrasBases", "editable": true,
            "tipoCompon": "select", "persist": "otrasBases", "ancho": "190px", "data": listBasesNoReservadas
        };
        columnasTabla.push(col);
    }

    return columnasTabla;
}

function getTipoCorrida(values) {
    var tr = values[2];
    var setTdNombreCorrida = tr.querySelector('td[persist=nombreTipocorrida]');
    var briefCorri = null;
    for (let i = 0; i < listaCorridas.length; i++) {
        if (listaCorridas[i].id.toString() === values[1]) {
            briefCorri = listaCorridas[i];
            break;
        }
    }
    setTdNombreCorrida.innerHTML = briefCorri.clave;
}

/*---------------W:3---------------*/
function construirObj(tr, nameTable) {
    var obj = {};

    for (var i = 0; i < tr.cells.length; i++) {
        var tipoCmp = tr.cells[i].getAttribute('tipocompon');
        if (tr.cells[i].getAttribute('persist') !== "eliminar" && tr.cells[i].getAttribute("contenteditable") === "true") {
            if (tr.cells[i].getAttribute('tipocompon') === "editConsulta") {
                obj[tr.cells[i].getAttribute('persist')] = parseInt(tr.cells[i].firstElementChild.getAttribute('value'));
            } else if (tr.cells[i].getAttribute('tipocompon') === "select") {
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].getAttribute('valor');
            }
                //else if (tr.cells[i].getAttribute('tipocompon') === "rowCount") {
                //    obj[tr.cells[i].getAttribute('persist')] = "";

                //}
            else {
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
            }
        }
    }

    if (tr.id === "") {
        var rString = "id" + randomString(2, '0123456789');
        obj['id'] = rString;
        tr.id = obj.id;
        if (nameTable === "tableEdittblParametros") {
            agregarParametros(obj);
        } else if (nameTable === "tableEdittblTiposCorrida") {
            agregarConceptoPorTipoCorrida(obj);
        } else if (nameTable === "tableEdittblOtrasBases") {
            agregarOtrasBases(obj);
        }
    } else {
        obj['id'] = tr.id;
        if (nameTable === "tableEdittblParametros") {
            actualizarParametros(obj);
        } else if (nameTable === "tableEdittblTiposCorrida") {
            actualizarConceptoPorTipoCorrida(obj);
        } else if (nameTable === "tableEdittblOtrasBases") {
            actualizarOtrasBases(obj);
        }
    }
}

/*---------------W:4---------------*/
function agregarParametros(value) {
    var obj = {};
    obj.id = value.id;
    obj.clasificadorParametro = value.clasificadorParametro;
    obj.descripcion = value.descripcion;
    obj.mascara = value.mascara;
    obj.numero = value.numero;
    obj.tipo = value.tipo;
    obj.unidad = value.unidad;
    obj.concepNomDefi_ID = null;
    obj.statusFila = "NUEVO";
    dataParametros.push(obj);
}

function agregarConceptoPorTipoCorrida(value) {
    var obj = {};
    obj.id = value.id;
    obj.cantidad = 0;
    obj.descuentoCreditos = 3;
    obj.incluir = false;
    obj.modificarCantidad = false;
    obj.modificarImporte = false;
    obj.mostrar = false;
    obj.opcional = false;
    obj.concepNomDefi_ID = null;
    obj.tipoCorrida_ID = value.tipoCorrida;
    obj.statusFila = "NUEVO";
    dataConceptoPorTipoCorrida.push(obj);
}

function agregarOtrasBases(value) {
    var obj = {};
    obj.id = value.id;
    obj.formulaExenta = null;
    obj.periodoExentoISR = null;
    obj.tipoAfecta = -1;
    obj.baseNomina_ID = value.otrasBases;
    obj.concepNomDefin_ID = null;
    obj.statusFila = "NUEVO";
    dataOtrasBases.push(obj);
}

/*---------------END TABLE W:4---------------*/

/*---------------W:5---------------*/
function actualizarParametros(valTable) {
    var getAuxPar = {};
    for (var i = 0; i < dataParametros.length; i++) {
        if (dataParametros[i].id === parseInt(valTable.id)
            || dataParametros[i].id === valTable.id) {
            getAuxPar = dataParametros[i];
            if (valTable.clasificadorParametro) {
                getAuxPar.clasificadorParametro = valTable.clasificadorParametro;
            }

            if (valTable.descripcion) {
                getAuxPar.descripcion = valTable.descripcion;
            }
            if (valTable.mascara) {
                getAuxPar.mascara = valTable.mascara;
            }

            if (valTable.numero) {
                getAuxPar.numero = valTable.numero;
            }

            if (valTable.tipo) {
                getAuxPar.tipo = valTable.tipo;
            }

            if (valTable.unidad) {
                getAuxPar.unidad = valTable.unidad;
            }

            getAuxPar.statusFila = "MODIFICADOBDS";
            dataParametros[i] = getAuxPar;
            break;
        }
    }
}

function actualizarConceptoPorTipoCorrida(valTable) {
    var getAuxCnc = {};
    for (var i = 0; i < dataConceptoPorTipoCorrida.length; i++) {
        if (dataConceptoPorTipoCorrida[i].id === parseInt(valTable.id)
            || dataConceptoPorTipoCorrida[i].id === valTable.id) {
            getAuxCnc = dataConceptoPorTipoCorrida[i];
            if (valTable.clasificadorParametro) {
                getAuxCnc.clasificadorParametro = valTable.clasificadorParametro;
            }
            if (valTable.tipoCorrida) {
                getAuxCnc.tipoCorrida_ID = valTable.tipoCorrida;
            }
            getAuxCnc.statusFila = "MODIFICADOBDS";
            dataConceptoPorTipoCorrida[i] = getAuxCnc;
            break;
        }
    }
}

function actualizarOtrasBases(valTable) {
    var getAuxOtrasBases = {};
    for (var i = 0; i < dataOtrasBases.length; i++) {
        if (dataOtrasBases[i].id === parseInt(valTable.id)
            || dataOtrasBases[i].id === valTable.id) {
            getAuxOtrasBases = dataOtrasBases[i];
            if (valTable.otrasBases) {
                getAuxOtrasBases.baseNomina_ID = valTable.otrasBases;
            }

            getAuxOtrasBases.statusFila = "MODIFICADOBDS";
            dataOtrasBases[i] = getAuxOtrasBases;
            break;
        }
    }
}
/*---------------END TABLE W:5---------------*/

/*---------------W:6---------------*/
function tableRemove(registro) {
    var id = registro.id;
    var getTable = registro.closest("table");
    if (getTable !== undefined) {
        var nameTable = getTable.id;

        var listToDelete = null;
        if (nameTable === "tableEdittblParametros") {
            listToDelete = dataParametros;
        } else if (nameTable === "tableEdittblTiposCorrida") {
            listToDelete = dataConceptoPorTipoCorrida;
        } else if (nameTable === "tableEdittblOtrasBases") {
            listToDelete = dataOtrasBases;
        }
        if (parseInt(id)) {
            for (var i = 0; i < listToDelete.length; i++) {
                if (listToDelete[i].id === parseInt(id)) {
                    listToDelete.splice(i, 1);
                    break;
                }
            }
            if (!onVersion) {
                if (nameTable === "tableEdittblParametros") {
                    deleteParametros[deleteParametros.length] = parseInt(id);
                } else if (nameTable === "tableEdittblTiposCorrida") {
                    deleteConceptoPorTipoCorrida[deleteConceptoPorTipoCorrida.length] = parseInt(id);
                } else if (nameTable === "tableEdittblOtrasBases") {
                    deleteOtrasBases[deleteOtrasBases.length] = parseInt(id);
                }
            }
        } else {
            for (var j = 0; j < listToDelete.length; j++) {
                if (listToDelete[j].id === id) {
                    listToDelete.splice(j, 1);
                    break;
                }
            }
        }

    }
}
/*---------------END TABLE W:6---------------*/

/*W:7= llenarTablaGen & Opentable*/

/*W:8= Clear Variables Table*/

/*---------------Default Method Table (Before W)-------------*/
function tableAdd(valores) {
    var nameTable = valores[0];
    var exito = true;

    if (valores.length === 3) {
        var trUltimo;
        trUltimo = $(valores[2]).nextAll('tr:last')[0];
        var nameTable = valores[0];
        construirObj(valores[2], nameTable);
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
        $('#' + valores[1]).append($clone);
        if (nameTable === "tableEdittblParametros") {
            //RowCount
            var rowCount = $('#' + valores[1] + ' tr').length - 1;
            $clone.children(":first").html(rowCount);
        }
        var edit = document.getElementById(valores[1]).querySelectorAll(".edit");
        if (edit) {
            for (var i = 0; i < edit.length; i++) {
                edit[i].removeAttribute("value");
                edit[i].querySelector(".editKey").value = "";
            }
        }
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

/*---------------END Default Method's Table---------------*/


function openModalVersion() {
    var modal = document.getElementById("myModalVersion");
    modal.style.display = "block";
    window.onclick = function (event) {
        if (event.target == modal) {
            //modal.style.display = "none";
        }
    }
    $("#contentCnc").addClass("disabledContainer");
}

function closeModalVersion() {
    var modal = document.getElementById("myModalVersion");
    modal.style.display = "none";
    $("#contentCnc").removeClass("disabledContainer");
}


