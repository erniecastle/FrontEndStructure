var tipoConfiguracion = 1;
var razonSocialActual = {};
var fechaSistema = new Date();
var creditoAhorroObj = {};
var contenedorCred = null;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    var query = getParameterByNameCredAhorr('screen');
    if (query !== "") {
        console.log();
    } else {
        var obj = JSON.parse($("#container").data("opener"));
        query = obj.tipoCaptura + "|" + obj.IdScreen + "|" + obj.config;
        value = query.split('|');
        tipoConfiguracion = parseInt(value[2]);
    }
    if (tipoConfiguracion === 1) {
        document.getElementById("tituloCreAhorr").innerHTML = "Configuracion Creditos";
        document.getElementById("tapParametrosAhorro").style.display = "none";
        document.getElementById("lblAsignaNumCreAuto").innerHTML = idiomaSelecionadoCol.messageFormatter("ConfiguracionCreditosAsignarNumAuto")();
        document.getElementById("lblLongNumCred").innerHTML = idiomaSelecionadoCol.messageFormatter("ConfiguracionCreditosLongNum")();
        document.getElementById("lblFormatoNumCred").innerHTML = idiomaSelecionadoCol.messageFormatter("ConfiguracionCreditosFormatoNum")();
        document.getElementById("lblDefinirNumEmpleado").innerHTML = idiomaSelecionadoCol.messageFormatter("ConfiguracionCreditosChkDefinirNumEmpleado")();
      
    } else {
        document.getElementById("tituloCreAhorr").innerHTML = "Configuracion Ahorros";
        document.getElementById("lblAsignaNumCreAuto").innerHTML = idiomaSelecionadoCol.messageFormatter("ConfiguracionAhorrosAsignarNumAuto")();
        document.getElementById("lblLongNumCred").innerHTML = idiomaSelecionadoCol.messageFormatter("ConfiguracionAhorrosLongNum")();
        document.getElementById("lblFormatoNumCred").innerHTML = idiomaSelecionadoCol.messageFormatter("ConfiguracionAhorrosFormatoNum")();
        document.getElementById("lblDefinirNumEmpleado").innerHTML = idiomaSelecionadoCol.messageFormatter("ConfiguracionAhorrosChkDefinirNumEmpleado")();
        document.getElementById("tapComisionXManejo").style.display = "none";
        document.getElementById("row7Fcon4FcTab3Fcol1Frow3Fcon1").style.display = "none";
        document.getElementById("col2Frow2Fcon3FcTab3Fcol1Frow3Fcon1").style.display = "none";
        document.getElementById("col3Frow2Fcon3FcTab3Fcol1Frow3Fcon1").style.display = "none";
        document.getElementById("row4Fcon3FcTab3Fcol1Frow3Fcon1").style.display = "none";
        document.getElementById("row5Fcon3FcTab3Fcol1Frow3Fcon1").style.display = "none";
        document.getElementById("row6Fcon3FcTab3Fcol1Frow3Fcon1").style.display = "none";
        document.getElementById("row2Frow7Fcon3FcTab3Fcol1Frow3Fcon1").style.display = "none";
        document.getElementById("row8Fcon3FcTab3Fcol1Frow3Fcon1").style.display = "none";
        document.getElementById("DivGroup53Fcol1Frow5FconOtrosDatos").style.display = "none";
    }
   
    inicializarValores();
    addListenersConfCredAhor();
    enabledEdit("editConceptoNomina", false);
    generateClaveCredAhorr();
    getRazonSocialActual();
    fechaSistema = new Date(getFechaSistema());

});

function getParameterByNameCredAhorr(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
    if (!results)
        return '';
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getRazonSocialActual() {
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);

    var url = route + "/api/CreditoAhorro/getRazonSocialPorID";
    var dataToPost = JSON.stringify(razon.id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        razonSocialActual = Mensaje.resultado;
    }

    // return razonSocialActual;

}

function generateClaveCredAhorr() {
    var obj = {};
    obj.fuentePrincipal = "CreditoAhorro";
    obj.campo = "clave";

    obj.camposWhere = ["tipoConfiguracion"];
    if (tipoConfiguracion === 1) {
        obj.valoresWhere = ["1"];
    } else if (tipoConfiguracion === 2) {
        obj.valoresWhere = ["2"];
    }

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
        var clave = textformateaValorAMascara(key, "###");
        document.getElementById("txtClave").value = clave;
    } else {
        console.log(Mensaje.error);
    }
}

//function openTab(evt, cityName) {

//    var i, tabcontent, tablinks;
//    tabcontent = $('#' + evt.target.parentElement.parentElement.id).children('.contain');
//    for (i = 0; i < tabcontent.length; i++) {
//        tabcontent[i].style.display = 'none';
//    }
//    tablinks = document.getElementsByClassName('tablinks');
//    for (i = 0; i < tablinks.length; i++) {
//        tablinks[i].className = tablinks[i].className.replace(' Selected', '');
//    }
//    document.getElementById(cityName).style.display = 'block';
//    evt.currentTarget.className += ' Selected';
//}

function inicializarValores() {

    if (tipoConfiguracion === 1) {
        document.getElementById("txtLongNumCred").value = "8";
        document.getElementById("rbApartirPeriodo").checked = true;
        document.getElementById("rbFactorMensual").checked = true;
        document.getElementById("rbElegirModoRegCred").checked=true;
        document.getElementById("txtLongitud").disabled = true;

        document.getElementById("ckbImporteFijo").disabled = false;
        document.getElementById("ckbImporteFijo").checked = true;
        document.getElementById("selCapturaDescuento").disabled = false;
        document.getElementById("selCapturaDescuento").value = "0";
        document.getElementById("txtNumDecimales").disabled = false;
        document.getElementById("txtNumDecimales").value = "2";
        document.getElementById("ckbVSMG").disabled = false;
        document.getElementById("selCapturaDescuento1").disabled = true;
        document.getElementById("txtNumDecimales1").disabled = true;
        document.getElementById("txtNumDecimales1").value = "2";
        document.getElementById("ckbPorcentaje").disabled = false;
        document.getElementById("selCapturaDescuento2").disabled = true;
        document.getElementById("txtNumDecimales2").disabled = true;
        document.getElementById("txtNumDecimales2").value = "2";
        document.getElementById("selValorVSMG").disabled = true;

        document.getElementById("rbSaldarAutoFin").disabled = true;
        document.getElementById("rbAgregarSinPreguntarFin").disabled = true;
        document.getElementById("rbAgregarPreguntandoFin").disabled = true;

        document.getElementById("rbSaldarAutoLiq").disabled = true;
        document.getElementById("rbAgregarSinPreguntarLiq").disabled = true;
        document.getElementById("rbAgregarPreguntandoLiq").disabled = true;

        document.getElementById("txtConceptoDescuento").disabled = true;
        document.getElementById("selPeriodicidadDescto").disabled = true;
        document.getElementById("selCuantoDescontar").disabled = true;
        //document.getElementById("rbEnPorcentaje").disabled = true;
        //document.getElementById("txtPorcentajeDescto").disabled = true;
        //document.getElementById("rbImporteFijoDescto").disabled = true;
        //document.getElementById("txtImporteDescto").disabled = true;
        //document.getElementById("rbDefinirCapturaCredito").disabled = true;



        //document.getElementById('DivGroupIsFondoAhorro').style.display = "none";
       // document.getElementById('DivGroupCorteAnualAuto').style.display = "none";
       // document.getElementById('row7MesYDia').style.display = "none";
       // document.getElementById('row8TasaInterezMensual').style.display = "none";

    } else if (tipoConfiguracion === 2) {
        document.getElementById("txtLongNumCred").value = "8";
        document.getElementById("rbApartirPeriodo").checked = true;
        document.getElementById("rbFactorMensual").checked = true;

        document.getElementById("txtLongitud").disabled = true;
        document.getElementById("rbElegirModoRegCred").checked = true;
        document.getElementById("ckbImporteFijo").disabled = false;
        document.getElementById("ckbImporteFijo").checked = true;
        document.getElementById("selCapturaDescuento").disabled = false;
        document.getElementById("selCapturaDescuento").value = "0";
        document.getElementById("txtNumDecimales").disabled = false;
        document.getElementById("txtNumDecimales").value = "2";
        document.getElementById("ckbVSMG").disabled = true;
        document.getElementById("selCapturaDescuento1").disabled = true;
        document.getElementById("txtNumDecimales1").disabled = true;
        document.getElementById("txtNumDecimales1").value = "2";
        document.getElementById("ckbPorcentaje").disabled = true;
        document.getElementById("selCapturaDescuento2").disabled = true;
        document.getElementById("txtNumDecimales2").disabled = true;
        document.getElementById("txtNumDecimales2").value = "2";
        document.getElementById("selValorVSMG").disabled = true;


        document.getElementById("rbSaldarAutoFin").disabled = true;
        document.getElementById("rbAgregarSinPreguntarFin").disabled = true;
        document.getElementById("rbAgregarPreguntandoFin").disabled = true;

        document.getElementById("rbSaldarAutoLiq").disabled = true;
        document.getElementById("rbAgregarSinPreguntarLiq").disabled = true;
        document.getElementById("rbAgregarPreguntandoLiq").disabled = true;

        document.getElementById("txtConceptoDescuento").disabled = true;
        document.getElementById("selPeriodicidadDescto").disabled = true;
        document.getElementById("selCuantoDescontar").disabled = true;
        //document.getElementById("rbEnPorcentaje").disabled = true;
        //document.getElementById("txtPorcentajeDescto").disabled = true;
        //document.getElementById("rbImporteFijoDescto").disabled = true;
        //document.getElementById("txtImporteDescto").disabled = true;
        //document.getElementById("rbDefinirCapturaCredito").disabled = true;

        document.getElementById("selCorteMes").disabled = true;
        document.getElementById("selCorteDia").disabled = true;
        //document.getElementById('row8TasaInterezMensual').style.display = "none";
    }


}

function addListenersConfCredAhor() {

    $('#ckbDefinirNumEmpleado').change(function () {
        if (this.checked) {
            document.getElementById("txtLongitud").disabled = false;
        } else {
            document.getElementById("txtLongitud").disabled = true;
        }
    });

    $('#rbElegirModoRegCred').change(function () {
        if (this.checked) {
            document.getElementById("ckbImporteFijo").disabled = false;
            document.getElementById("ckbVSMG").disabled = false;
            document.getElementById("ckbPorcentaje").disabled = false;
        }
    });

    $('#rbEspecificarNumParcial').change(function () {
        if (document.getElementById("ckbCapturarCreditoTotal").checked) {
            if (this.checked) {
                document.getElementById("ckbImporteFijo").disabled = true;
                document.getElementById("ckbImporteFijo").checked = false;
                document.getElementById("selCapturaDescuento").disabled = true;
                document.getElementById("selCapturaDescuento").value = "";
                document.getElementById("txtNumDecimales").disabled = true;
                document.getElementById("ckbVSMG").disabled = true;
                document.getElementById("ckbVSMG").checked = false;
                document.getElementById("selCapturaDescuento1").disabled = true;
                document.getElementById("selCapturaDescuento1").value = "";
                document.getElementById("txtNumDecimales1").disabled = true;
                document.getElementById("ckbPorcentaje").disabled = true;
                document.getElementById("ckbPorcentaje").checked = false;
                document.getElementById("selCapturaDescuento2").disabled = true;
                document.getElementById("selCapturaDescuento2").value = "";
                document.getElementById("txtNumDecimales2").disabled = true;
                document.getElementById("selValorVSMG").value = "";
                document.getElementById("selValorVSMG").disabled = true;
            }
        } else {
            alert("Active el capturar credito total");
            this.checked = false;
        }
    });

    $('#ckbImporteFijo').change(function () {
        if (this.checked) {
            document.getElementById("selCapturaDescuento").disabled = false;
            document.getElementById("selCapturaDescuento").value = "0";
            document.getElementById("txtNumDecimales").disabled = false;

        } else {
            document.getElementById("selCapturaDescuento").disabled = true;
            document.getElementById("selCapturaDescuento").value = "";
            document.getElementById("txtNumDecimales").disabled = true;
        }
    });

    $('#ckbVSMG').change(function () {
        if (this.checked) {
            document.getElementById("selCapturaDescuento1").disabled = false;
            document.getElementById("selCapturaDescuento1").value = "0";
            document.getElementById("txtNumDecimales1").disabled = false;
            document.getElementById("selValorVSMG").value = "0";
            document.getElementById("selValorVSMG").disabled = false;

        } else {
            document.getElementById("selCapturaDescuento1").disabled = true;
            document.getElementById("selCapturaDescuento1").value = "";
            document.getElementById("txtNumDecimales1").disabled = true;
            document.getElementById("selValorVSMG").value = "";
            document.getElementById("selValorVSMG").disabled = true;
        }
    });

    $('#ckbPorcentaje').change(function () {
        if (this.checked) {
            document.getElementById("selCapturaDescuento2").disabled = false;
            document.getElementById("selCapturaDescuento2").value = "0";
            document.getElementById("txtNumDecimales2").disabled = false;

        } else {
            document.getElementById("selCapturaDescuento2").disabled = true;
            document.getElementById("selCapturaDescuento2").value = "";
            document.getElementById("txtNumDecimales2").disabled = true;
        }
    });

    $('#ckbDescontarFiniquito').change(function () {
        if (this.checked) {
            document.getElementById("rbSaldarAutoFin").disabled = false;
            document.getElementById("rbAgregarSinPreguntarFin").disabled = false;
            document.getElementById("rbAgregarPreguntandoFin").disabled = false;
        } else {
            document.getElementById("rbSaldarAutoFin").disabled = true;
            document.getElementById("rbSaldarAutoFin").checked = false;
            document.getElementById("rbAgregarSinPreguntarFin").disabled = true;
            document.getElementById("rbAgregarSinPreguntarFin").checked = false;
            document.getElementById("rbAgregarPreguntandoFin").disabled = true;
            document.getElementById("rbAgregarPreguntandoFin").checked = false;
        }
    });

    $('#ckbDescontarLiquidaciones').change(function () {

        if (this.checked) {
            document.getElementById("rbSaldarAutoLiq").disabled = false;
            document.getElementById("rbAgregarSinPreguntarLiq").disabled = false;
            document.getElementById("rbAgregarPreguntandoLiq").disabled = false;
        } else {
            document.getElementById("rbSaldarAutoLiq").disabled = true;
            document.getElementById("rbSaldarAutoLiq").checked = false;
            document.getElementById("rbAgregarSinPreguntarLiq").disabled = true;
            document.getElementById("rbAgregarSinPreguntarLiq").checked = false;
            document.getElementById("rbAgregarPreguntandoLiq").disabled = true;
            document.getElementById("rbAgregarPreguntandoLiq").checked = false;
        }
    });

    $('#ckbCorteAnualAuto').change(function () {
        if (this.checked) {
            document.getElementById("selCorteMes").disabled = false;
            document.getElementById("selCorteDia").disabled = false;
        } else {
            document.getElementById("selCorteMes").disabled = true;
            document.getElementById("selCorteMes").value = "";
            document.getElementById("selCorteDia").disabled = true;
            document.getElementById("selCorteDia").value = "";
        }
    });

    $('#ckbRealizarDescuentoXManejoCred').change(function () {
        if (this.checked) {
            document.getElementById("txtConceptoDescuento").disabled = false;
            document.getElementById("selPeriodicidadDescto").disabled = false;
            document.getElementById("selCuantoDescontar").disabled = false;
            document.getElementById("rbEnPorcentaje").disabled = false;
            //document.getElementById("txtPorcentajeDescto").disabled = true;
            document.getElementById("rbImporteFijoDescto").disabled = false;
            //document.getElementById("txtImporteDescto").disabled = true;
            document.getElementById("rbDefinirCapturaCredito").disabled = false;
            enabledEdit("editConceptoNomina", true);
        } else {
            document.getElementById("txtConceptoDescuento").disabled = true;
            document.getElementById("selPeriodicidadDescto").disabled = true;
            document.getElementById("selCuantoDescontar").disabled = true;
            document.getElementById("rbEnPorcentaje").disabled = true;
            document.getElementById("rbEnPorcentaje").checked = false;
            document.getElementById("txtPorcentajeDescto").disabled = true;
            document.getElementById("rbImporteFijoDescto").disabled = true;
            document.getElementById("rbImporteFijoDescto").checked = false;
            document.getElementById("txtImporteDescto").disabled = true;
            document.getElementById("rbDefinirCapturaCredito").disabled = true;
            document.getElementById("rbDefinirCapturaCredito").checked = false;
            enabledEdit("editConceptoNomina", false);
        }
    });

    $('#rbEnPorcentaje').change(function () {
        if (this.checked) {
            document.getElementById("txtPorcentajeDescto").disabled = false;
            document.getElementById("txtImporteDescto").disabled = true;
        }
    });

    $('#rbImporteFijoDescto').change(function () {
        if (this.checked) {
            document.getElementById("txtPorcentajeDescto").disabled = true;
            document.getElementById("txtImporteDescto").disabled = false;
        }
    });

    $('#rbDefinirCapturaCredito').change(function () {
        if (this.checked) {
            document.getElementById("txtPorcentajeDescto").disabled = true;
            document.getElementById("txtImporteDescto").disabled = true;
        }
    });

    $('#txtDescripcion').on("keydown", function (e) {
        if (e.keyCode === 13 || e.keyCode === 9) {
            document.getElementById('txtDescripcionAbre').value = this.value.substring(0, 27);
            if (e.keyCode === 13) {
                $('#txtDescripcionAbre').focus();
                $('#txtDescripcionAbre').select();
            }
        }
    });

    $('#txtLongNumCred').on("keydown", function (e) {
        if (e.keyCode === 13 || e.keyCode === 9) {
            var cadena = "";
            for (var i = 0; i < parseInt(this.value); i++) {
                cadena += "#";
            }
            document.getElementById('txtFormatoNumCred').value = cadena;
            document.getElementById('txtFormatoNumCred').setAttribute("maxlength", this.value);
            if (e.keyCode === 13) {
                $('#txtFormatoNumCred').focus();
                $('#txtFormatoNumCred').select();
            }
        }
    });

    $('#txtLongitud').on("keypress", function (e) {
        var key = window.event ? e.which : e.keyCode;
        if (key < 48 || key > 57) {
            e.preventDefault();
        }
    });

    $('#txtNumDecimales, #txtNumDecimales1 , #txtNumDecimales').on("keypress", function (e) {
        var key = window.event ? e.which : e.keyCode;
        if (key < 48 || key > 57) {
            e.preventDefault();
        }
    });
}

function llenarselDias(valor) {
    $("#selCorteDia").find('option').not(':first').remove();
    var year = fechaSistema.getFullYear();
    var mes = parseInt(valor);
    var dias = new Date(year, mes + 1, 0).getDate();
    for (var i = 0; i < dias; i++) {
        $("#selCorteDia").append('<option value=' + i + '>' + (i + 1) + '</option>');
    }

}

function activarCapturaFormaAplicar(valor) {

    if (valor !== "") {
        if (valor === "1") {
            document.getElementById("DivFormaAplicar").style.display="block";
        } else if (valor === "2") {
            document.getElementById("DivFormaAplicar").style.display = "block";
        } else {
            document.getElementById("DivFormaAplicar").style.display = "none";
        }
    } else {
        document.getElementById("DivFormaAplicar").style.display = "none";
    }
}

function setEditConceptoXDeduccion() {

    //Parameters
    nameCmp = "EditConceptoXDeduccion";
    table = "ConcepNomDefi";
    nameCols = idiomaSelecionadoCol.messageFormatter("ConceptosNominaClave")() + "," + idiomaSelecionadoCol.messageFormatter("ConceptosNominaDescripcion")();
   // nameCols = "Clave,Descripción";
    campos = "clave,descripcion";//Quit ID;
    camposObtener = "clave,descripcion";
    //var subEntities = "periodicidad"; //Unnecesary
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Concepto de nomina";
    var tamañoSel = "size-2";
    var preFilters = { "naturaleza": 2 };
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditConceptoXDeduccionShow(value) {
    if (value !== null) {
        //console.log();
    }
}

function setEditConceptoNomina() {

    //Parameters
    nameCmp = "EditConceptoNomina";
    table = "ConcepNomDefi";
    nameCols = idiomaSelecionadoCol.messageFormatter("ConceptosNominaClave")() + "," + idiomaSelecionadoCol.messageFormatter("ConceptosNominaDescripcion")();
    //nameCols = "Clave,Descripción";
    campos = "clave,descripcion";//Quit ID;
    camposObtener = "clave,descripcion";
    //var subEntities = "periodicidad"; //Unnecesary
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Concepto de nomina";
    var tamañoSel = "size-2";
    var preFilters = { "naturaleza": 2 };
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditConceptoNominaShow(value) {
    if (value !== null) {
        //console.log();
    }
}

function construirObjecto(object) {
    var creditoAhorro = null;
    if (typeof object === 'undefined') {
        creditoAhorro = {};
        creditoAhorro.razonesSociales_ID = razonSocialActual.id;
    } else {
        creditoAhorro = object;
    }

    /* seccion de clave y descripcion */
    creditoAhorro.clave = document.getElementById('txtClave').value;
    creditoAhorro.descripcion = document.getElementById('txtDescripcion').value;
    creditoAhorro.descripcionAbrev = document.getElementById('txtDescripcionAbre').value;
    creditoAhorro.tipoConfiguracion = tipoConfiguracion;

    /* seccion para tab principal de credito / ahorro */
    creditoAhorro = tabPrincipal(creditoAhorro);

    /* seccion para tab Otros Datos de credito / ahorro */
    creditoAhorro = tabOtrosDatos(creditoAhorro);

    return creditoAhorro;

}

function tabPrincipal(creditoAhorro) {

    /* seccion Configuración del Número de Crédito */
    creditoAhorro.asignaAutoNumCredAho = document.getElementById('ckbAsignaNumCreAuto').checked === true ? true : false;
    creditoAhorro.longitudNumCredAho = document.getElementById('txtLongNumCred').value;
    creditoAhorro.mascaraNumCredAho = document.getElementById('txtFormatoNumCred').value;
    creditoAhorro.capturarCreditoTotal = document.getElementById("ckbCapturarCreditoTotal").checked === true ? true : false;
    if (document.getElementById("selVersionCalculo").value === "") {
        creditoAhorro.versionCalculoPrestamoAhorro = 1;
    } else {
        creditoAhorro.versionCalculoPrestamoAhorro = parseInt(document.getElementById("selVersionCalculo").value);
    }

    /* seccion inicio descuento */
    creditoAhorro.inicioDescuento = document.getElementById('rbApartirPeriodo').checked === true ? true : false;

    /* seccion inicio Factor Mensual */
    if (document.getElementById('rbFactorMensual').checked) {
        creditoAhorro.factorProporcional = 1;
    } else {
        creditoAhorro.factorProporcional = 2;
    }


    /* seccion numero de empleado por parte de la institucion */
    creditoAhorro.definirNumEmp = document.getElementById('ckbDefinirNumEmpleado').checked === true ? true : false;
    if (document.getElementById('ckbDefinirNumEmpleado').checked) {
        creditoAhorro.longitudNumEmp = document.getElementById('txtLongitud').value;
    } else {
        creditoAhorro.longitudNumEmp = "";
    }

    /* seccion Modo de descuento */
    creditoAhorro = seccionModoDescuento(creditoAhorro);

    /* seccion Descontar proporcional a los dias del periodo */
    creditoAhorro = seccionDescProporDiasPeriodo(creditoAhorro);

    return creditoAhorro;

}

function tabOtrosDatos(creditoAhorro) {
    /* Seccion Descontar / Agregar Credito / Ahorro en Finiquitos */
    creditoAhorro = seccionDescAgrCredAhoFiniquitos(creditoAhorro);

    /* Seccion Descontar / Agregar Credito / Ahorro en Liquidaciones */
    creditoAhorro = seccionDescAgrCredAhoLiquidaciones(creditoAhorro);

    /* Seccion Descontar / Agregar Credito / Ahorro en Ingresos de empleado */
    creditoAhorro = seccionDescAgrCredAhoIngEmpleados(creditoAhorro);

    /* tasa de Interes Mensual */
    //creditoAhorro.tasaIntMens = document.getElementById('txtTasaInteresMen').value;

    /* Seccion Corte Automático Anual */
    creditoAhorro = seccionCorteAutoAnual(creditoAhorro);

    creditoAhorro = seccionRealizarDescuentos(creditoAhorro);

    return creditoAhorro;
}

function seccionModoDescuento(creditoAhorro) {

    if (document.getElementById('rbElegirModoRegCred').checked) {
        creditoAhorro.modoDescuento = 1;

    } else if (document.getElementById('rbEspecificarNumParcial').checked) {
        creditoAhorro.modoDescuento = 2;
    }
    creditoAhorro.porcentaje = document.getElementById('ckbPorcentaje').checked === true ? true : false;
    creditoAhorro.vsmg = document.getElementById('ckbVSMG').checked === true ? true : false;
    creditoAhorro.cuotaFija = document.getElementById('ckbImporteFijo').checked === true ? true : false;

    if (document.getElementById('ckbImporteFijo').checked) {
        creditoAhorro.modoCapturaDescuento = parseInt(document.getElementById('selCapturaDescuento').value);
        creditoAhorro.numDecimalesDescuento = parseInt(document.getElementById('txtNumDecimales').value.length === 0 ? 2 : document.getElementById('txtNumDecimales').value);

    } else {
        creditoAhorro.modoCapturaDescuento = null;
        creditoAhorro.numDecimalesDescuento = null;
    }

    if (document.getElementById('ckbVSMG').checked) {
        creditoAhorro.modoCapturaDescuentoVSMG = parseInt(document.getElementById('selCapturaDescuento1').value);
        creditoAhorro.numDecimalesDescuentoVSMG = parseInt(document.getElementById('txtNumDecimales1').value.length === 0 ? 2 : document.getElementById('txtNumDecimales1').value);
        creditoAhorro.valorVSMG = parseInt(document.getElementById('selValorVSMG').value);
    } else {
        creditoAhorro.modoCapturaDescuentoVSMG = null;
        creditoAhorro.numDecimalesDescuentoVSMG = null;
        creditoAhorro.valorVSMG = null;
    }

    if (document.getElementById('ckbPorcentaje').checked) {
        creditoAhorro.modoCapturaDescuentoPorc = parseInt(document.getElementById('selCapturaDescuento2').value);
        creditoAhorro.numDecimalesDescuentoPorc = parseInt(document.getElementById('txtNumDecimales2').value.length === 0 ? 2 : document.getElementById('txtNumDecimales2').value);
    } else {
        creditoAhorro.modoCapturaDescuentoPorc = null;
        creditoAhorro.numDecimalesDescuentoPorc = null;
    }

    return creditoAhorro;

}

function seccionDescProporDiasPeriodo(creditoAhorro) {
    creditoAhorro.descPropDiasPer = document.getElementById('ckbDescontarPropoDiasPer').checked === true ? true : false;
    creditoAhorro.solicitarFecVen = document.getElementById('ckbSolicitarFechaVenc').checked === true ? true : false;
    creditoAhorro.considerarIncap = document.getElementById("ckbConsiderarIncap").checked === true ? true : false;
    if (document.getElementById('editConceptoXDeduccion').getAttribute('value')) {
        creditoAhorro.concepNomiDefin_ID = document.getElementById('editConceptoXDeduccion').getAttribute('value');
    }
    //            if (JEditConceptoInteresMensual.getTxtClaveJcomboEditConsulta().getTextSinMascara().length() > 0) {
    //                creditoAhorro.setcNDInteresMensual((ConcepNomDefi) JEditConceptoInteresMensual.getValorSeleccionado());
    //            }
    creditoAhorro.fondoAhorro = document.getElementById('ckbFondoAhorro').checked === true ? true : false;

    return creditoAhorro;
}

function seccionDescAgrCredAhoFiniquitos(creditoAhorro) {
    if (document.getElementById("ckbDescontarFiniquito").checked) {
        console.log(document.getElementById("rbSaldarAutoFin").checked);
        if (document.getElementById("rbSaldarAutoFin").checked) {
            creditoAhorro.modoDescontarCredAhoFini = 1;
        } else if (document.getElementById('rbAgregarSinPreguntarFin').checked) {
            creditoAhorro.modoDescontarCredAhoFini = 2;
        } else if (document.getElementById('rbAgregarPreguntandoFin').checked) {
            creditoAhorro.modoDescontarCredAhoFini = 3;
        }
    } else {
        creditoAhorro.modoDescontarCredAhoFini = 0;
    }

    return creditoAhorro;
}

function seccionDescAgrCredAhoLiquidaciones(creditoAhorro) {
    if (document.getElementById('ckbDescontarLiquidaciones').checked) {
        if (document.getElementById('rbSaldarAutoLiq').checked) {
            creditoAhorro.setModoDescontarCredAhoLiqu = 1;
        } else if (document.getElementById('rbAgregarSinPreguntarLiq').checked) {
            creditoAhorro.setModoDescontarCredAhoLiqu = 2;
        } else if (document.getElementById('rbAgregarPreguntandoLiq').checked) {
            creditoAhorro.modoDescontarCredAhoLiqu = 3;
        }
    } else {
        creditoAhorro.modoDescontarCredAhoLiqu = 0;
    }

    return creditoAhorro;
}

function seccionDescAgrCredAhoIngEmpleados(creditoAhorro) {

    //if (document.getElementById('ckbAgregarCredIngEmpleados').checked) {//pendiente
    //    //                if (pJRBAgregarSinPreg.isSelected()) {
    //    //                    creditoAhorro.setModoAgregarCredAhoIngEmp((byte) 1);
    //    //                } else if (pJRBAgregarPreg.isSelected()) {
    //    //                    creditoAhorro.setModoAgregarCredAhoIngEmp((byte) 2);
    //    //                }
    //    creditoAhorro.modoAgregarCredAhoIngEmp = 0;
    //} else {
    //    creditoAhorro.modoAgregarCredAhoIngEmp = 0;
    //}
    creditoAhorro.modoAgregarCredAhoIngEmp = 0;
    return creditoAhorro;
}

function seccionCorteAutoAnual(creditoAhorro) {
    var calendario = new Date();
    calendario.setDate(fechaSistema.getDate());
    var mes = 0;
    var dia = 0;
    if (document.getElementById('ckbCorteAnualAuto').checked) {
        if (document.getElementById('selCorteMes').value !== "" && document.getElementById('selCorteDia').value !== "") {
            mes = parseInt(document.getElementById('selCorteMes').value);
            dia = parseInt(document.getElementById('selCorteDia').value) + 1;
            //calendario.setFullYear(1900);
            calendario.setMonth(mes);
            calendario.setDate(dia);

            creditoAhorro.corteMesDia = calendario;
        }
    } else {
        /* si no asigna corte automatico, se pone por default la fecha 1900 01 01 */
        calendario.setFullYear(1900);
        calendario.setMonth(0);
        calendario.setDate(1);
        creditoAhorro.corteMesDia = calendario;
    }

    return creditoAhorro;
}

function seccionRealizarDescuentos(creditoAhorro) {
    creditoAhorro.activarManejoDescuento = document.getElementById('ckbRealizarDescuentoXManejoCred').checked === true ? true : false;
    creditoAhorro.conceptoDcto = document.getElementById('txtConceptoDescuento').value;
    if (document.getElementById('selPeriodicidadDescto').value !== "") {
        creditoAhorro.periodicidadDescuento = parseInt(document.getElementById('selPeriodicidadDescto').value);
    }
    if (document.getElementById('selCuantoDescontar').disabled === false) {
        creditoAhorro.cuandoDescontar = parseInt(document.getElementById('selCuantoDescontar').value);
    } else {
        creditoAhorro.cuandoDescontar = -1;
    }
    if (document.getElementById('selFormaAplicar').value === "2" || document.getElementById('selFormaAplicar').value === "1") {
        if (document.getElementById('selFormaAplicar').value ==="1") {
            creditoAhorro.modoManejoDescuento = 1;
        } else {
            creditoAhorro.modoManejoDescuento = 2;
        }
        if (document.getElementById('txtFormaAplicar').value.length > 0) {
            var importe = parseFloat(document.getElementById('txtFormaAplicar').value);
            creditoAhorro.importeDescuento = importe;
        }
    } else if (document.getElementById('selFormaAplicar').value === "3") {
        creditoAhorro.modoManejoDescuento = 3;
    }
    if (document.getElementById('editConceptoNomina').getAttribute("value")) {
        creditoAhorro.cNDescuento_ID = document.getElementById('editConceptoNomina').getAttribute("value");
    }

    return creditoAhorro;
}

function limpiar() {

    generateClaveCredAhorr();
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtDescripcionAbre").value = "";

    document.getElementById("ckbAsignaNumCreAuto").checked = false;
    document.getElementById("txtLongNumCred").value = 8;
    document.getElementById("txtFormatoNumCred").value = "";

    document.getElementById("ckbDefinirNumEmpleado").checked = false;
    document.getElementById("txtLongitud").value = "";
    document.getElementById("txtLongitud").disabled = true;

    document.getElementById("rbApartirPeriodo").checked = false;
    document.getElementById("rbFactorMensual").checked = false;

    document.getElementById("rbElegirModoRegCred").checked = false;

    document.getElementById("ckbImporteFijo").checked = false;
    document.getElementById("ckbImporteFijo").disabled = true;
    document.getElementById("selCapturaDescuento").value = "";
    document.getElementById("selCapturaDescuento").disabled = true;
    document.getElementById("txtNumDecimales").value = "2";
    document.getElementById("txtNumDecimales").disabled = true;

    document.getElementById("ckbVSMG").checked = false;
    document.getElementById("ckbVSMG").disabled = true;
    document.getElementById("selCapturaDescuento1").value = "";
    document.getElementById("selCapturaDescuento1").disabled = true;
    document.getElementById("txtNumDecimales1").value = "2";
    document.getElementById("txtNumDecimales1").disabled = true;
    document.getElementById("selValorVSMG").value = "";
    document.getElementById("selValorVSMG").disabled = true;

    document.getElementById("ckbPorcentaje").checked = false;
    document.getElementById("ckbPorcentaje").disabled = true;
    document.getElementById("selCapturaDescuento2").value = "";
    document.getElementById("selCapturaDescuento2").disabled = true;
    document.getElementById("txtNumDecimales2").value = "2";
    document.getElementById("txtNumDecimales2").disabled = true;


    document.getElementById("rbEspecificarNumParcial").checked = false;

    document.getElementById("ckbDescontarPropoDiasPer").checked = false;
    document.getElementById("ckbSolicitarFechaVenc").checked = false;
    document.getElementById("ckbConsiderarIncap").checked = false;

    clearEdit("editConceptoXDeduccion");
    clearEdit("editConceptoNomina");
    //clearEdit("editConceptoInteresMen");

    document.getElementById("ckbDescontarFiniquito").checked = false;
    document.getElementById("rbSaldarAutoFin").checked = false;
    document.getElementById("rbSaldarAutoFin").disabled = true;
    document.getElementById("rbAgregarSinPreguntarFin").checked = false;
    document.getElementById("rbAgregarSinPreguntarFin").disabled = true;
    document.getElementById("rbAgregarPreguntandoFin").checked = false;
    document.getElementById("rbAgregarPreguntandoFin").disabled = true;

    document.getElementById("ckbDescontarLiquidaciones").checked = false;
    document.getElementById("rbSaldarAutoLiq").checked = false;
    document.getElementById("rbSaldarAutoLiq").disabled = true;
    document.getElementById("rbAgregarSinPreguntarLiq").checked = false;
    document.getElementById("rbAgregarSinPreguntarLiq").disabled = true;
    document.getElementById("rbAgregarPreguntandoLiq").checked = false;
    document.getElementById("rbAgregarPreguntandoLiq").disabled = true;

   // document.getElementById("ckbAgregarCredIngEmpleados").checked = false;
    //document.getElementById("rbEnPorcentaje").checked = false;
    //document.getElementById("rbEnPorcentaje").disabled = true;
    //document.getElementById("rbImporteFijoDescto").checked = false;
    //document.getElementById("rbImporteFijoDescto").disabled = true;
    //document.getElementById("rbDefinirCapturaCredito").checked = false;
    //document.getElementById("rbDefinirCapturaCredito").disabled = true;


    //document.getElementById("txtPorcentajeDescto").value = "";
    //document.getElementById("txtPorcentajeDescto").disabled = true;

    //document.getElementById("txtImporteDescto").value = "";
    //document.getElementById("txtImporteDescto").disabled = true;

    document.getElementById("ckbFondoAhorro").checked = false;

    document.getElementById("ckbCorteAnualAuto").checked = false;
    document.getElementById("selCorteMes").value = "";
    document.getElementById("selCorteMes").disabled = true;
    document.getElementById("selCorteDia").value = "";
    document.getElementById("selCorteDia").disabled = true;

    //document.getElementById("txtTasaInteresMen").value = "";

    document.getElementById("ckbRealizarDescuentoXManejoCred").checked = false;
    document.getElementById("txtConceptoDescuento").value = "";
    document.getElementById("txtConceptoDescuento").disabled = true;
    document.getElementById("selPeriodicidadDescto").value = "";
    document.getElementById("selPeriodicidadDescto").disabled = true;
    document.getElementById("selCuantoDescontar").value = "";
    document.getElementById("selCuantoDescontar").disabled = true;

    document.getElementById("selFormaAplicar").value = "";
    document.getElementById("txtFormaAplicar").value = "";
    document.getElementById("DivFormaAplicar").style.display = "none";
    //document.getElementById("rbDefinirCapturaCredito").disabled = true;

    document.getElementById("selVersionCalculo").value = "";
    document.getElementById("ckbCapturarCreditoTotal").checked = false;

    document.getElementById("btnActualizar").style.display = "none";
    document.getElementById("btnEliminar").style.display = "none";
    document.getElementById("btnGuarda").style.display = "inline-block";

    creditoAhorroObj = {};

}

function saveCredAhorr() {
    var obj = {};
    var creditoAhorro = construirObjecto();
    obj.creditosAhorros = creditoAhorro;

    if (document.getElementById("ckbIncluirEnMenu").checked) {
        var contenedor = crearContenedor();
        obj.contenedor = contenedor;
    }
    var url = route + "/api/CreditoAhorro/saveCreditoAhorro";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiar();
    } else {
        limpiar();
    }
    //console.log(creditoAhorro);
}

function actualizarAhorr() {
    var obj = {};
    var creditoAhorro = construirObjecto(creditoAhorroObj);
    obj.creditosAhorros = creditoAhorro;
    if (document.getElementById("ckbIncluirEnMenu").checked && contenedorCred === null) {
        var contenedor = crearContenedor();
        obj.contenedor = contenedor;
    } else if (document.getElementById("ckbIncluirEnMenu").checked && contenedorCred !== null) {
        contenedorCred.nombre = document.getElementById("txtDescripcionAbre").value;
        obj.contenedor = contenedorCred;
    }
   // var obj = {};
   //// var creditoAhorro = construirObjecto();
   // obj.creditosAhorros = creditoAhorro;

   // if (document.getElementById("ckbIncluirEnMenu").checked) {
   //     var contenedor = crearContenedor();
   //     obj.contenedor = contenedor;
   // }
    var url = route + "/api/CreditoAhorro/saveCreditoAhorro";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiar();
    } else {
        limpiar();
    }
}

function eliminarAhorr() {
    var answer = confirm("¿Quieres eliminar este registro?");
    if (answer) {
        creditoAhorroObj.cNDescuento = null;
        creditoAhorroObj.concepNomiDefin = null;
        creditoAhorroObj.cNDInteresMensual = null;
        var url = route + "/api/CreditoAhorro/deleteCreditoAhorro";
        var dataToPost = JSON.stringify(creditoAhorroObj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado === null) {
            alert("No object");
            limpiar();
        } else {
            limpiar();
        }
    }

}

function searchCredAhorr(id) {
    limpiar();
    var url = route + "/api/CreditoAhorro/getCreditoAhorroPorID";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");

    } else {
        creditoAhorroObj = Mensaje.resultado;
        MostrarCreditoAhorro(creditoAhorroObj);
        var controlCred = "CreditoAhorro" + creditoAhorroObj.id;
        getContenedorPorControl(controlCred);
        document.getElementById("btnActualizar").style.display = "inline-block";
        document.getElementById("btnEliminar").style.display = "inline-block";
        document.getElementById("btnGuarda").style.display = "none";

    }
}

function MostrarCreditoAhorro(creditoAhorro) {

    var modoConsulta = true;
    /* seccion de clave y descripcion */
    document.getElementById("txtClave").value = creditoAhorro.clave;
    tipoConfiguracion = parseInt(creditoAhorro.tipoConfiguracion);
    document.getElementById("txtDescripcion").value = creditoAhorro.descripcion;
    document.getElementById("txtDescripcionAbre").value = creditoAhorro.descripcionAbrev;
    document.getElementById("ckbCapturarCreditoTotal").checked = creditoAhorro.capturarCreditoTotal;
    document.getElementById("selVersionCalculo").value = creditoAhorro.versionCalculoPrestamoAhorro.toString();
    //pendiente esto 
    //if (getModo() == Modo.Consulta) {
    //    pJTPCreditoAhorro.setEnabled(true);
    //    modoConsulta = true;
    //}
    if (creditoAhorro.fondoAhorro) {
        document.getElementById("ckbFondoAhorro").checked = true;
    }
    /* seccion para tab principal de credito / ahorro */
    mostrarTabPrincipal(creditoAhorro, modoConsulta);

    /* seccion para tab Otros Datos de credito / ahorro */
    mostrarTabOtrosDatos(creditoAhorro, modoConsulta);

}

function mostrarTabPrincipal(creditoAhorro, modoConsulta) {
    /* seccion Configuración del Número de Crédito */
    document.getElementById("ckbAsignaNumCreAuto").checked = creditoAhorro.asignaAutoNumCredAho;
    document.getElementById("txtLongNumCred").value = creditoAhorro.longitudNumCredAho;
    document.getElementById("txtFormatoNumCred").value = creditoAhorro.mascaraNumCredAho;
    document.getElementById("selVersionCalculo").value = creditoAhorro.versionCalculoPrestamoAhorro;

    /* seccion Inicio del descuento */
    if (creditoAhorro.inicioDescuento) {
        document.getElementById("rbApartirPeriodo").checked = creditoAhorro.inicioDescuento;
    } else {
        document.getElementById("rbApartirFecha").checked = true;
    }

    if (creditoAhorro.factorProporcional !== null) {
        if (creditoAhorro.factorProporcional === 1) {
            document.getElementById("rbFactorMensual").checked = true;
        } else {
            document.getElementById("rbDiasNaturales").checked = true;
        }
    }

    /* seccion numero de empleado por parte de la institucion */
    document.getElementById('ckbDefinirNumEmpleado').checked = creditoAhorro.definirNumEmp;
    if (creditoAhorro.definirNumEmp) {
        document.getElementById('txtLongitud').disabled = false;
    }
    document.getElementById('txtLongitud').value = creditoAhorro.longitudNumEmp;

    /* seccion Modo de descuento */
    mostrarSeccionModoDescuento(creditoAhorro, modoConsulta);

    /* seccion Descontar proporcional a los dias del periodo */
    mostrarSeccionDescProporDiasPeriodo(creditoAhorro);
}

function mostrarSeccionModoDescuento(creditoAhorro, modoConsulta) {

    if (creditoAhorro.modoDescuento === 1) {
        document.getElementById("rbElegirModoRegCred").checked = true;
        document.getElementById("ckbImporteFijo").disabled = false;
        document.getElementById("ckbVSMG").disabled = false;
        document.getElementById("ckbPorcentaje").disabled = false;
    } else if (creditoAhorro.modoDescuento === 2) {
        document.getElementById("rbEspecificarNumParcial").checked = true;
    }

    /* habilita / deshabilita componentes */
    //pJRBElegirModoRegItemState(modoConsulta);pendiente

    /* asigna valores a checks de "Elegir Modo al regismostrarTabOtrosDatostrar el Credito/Ahorro" */
    document.getElementById("ckbImporteFijo").checked = creditoAhorro.cuotaFija;
    document.getElementById("ckbVSMG").checked = creditoAhorro.vsmg;
    document.getElementById("ckbPorcentaje").checked = creditoAhorro.porcentaje;

    if (document.getElementById("ckbImporteFijo").checked) {
        // disabled
        document.getElementById("selCapturaDescuento").disabled = false;
        document.getElementById("txtNumDecimales").disabled = false;
    }

    if (document.getElementById("ckbVSMG").checked) {
        document.getElementById("selCapturaDescuento1").disabled = false;
        document.getElementById("txtNumDecimales1").disabled = false;
        document.getElementById("selValorVSMG").disabled = false;
    }

    if (document.getElementById("ckbPorcentaje").checked) {
        document.getElementById("selCapturaDescuento2").disabled = false;
        document.getElementById("txtNumDecimales2").disabled = false;
    }

    if (creditoAhorro.modoCapturaDescuento !== null) {//Por periodo, Mensual, Bimestral
        document.getElementById("selCapturaDescuento").value = creditoAhorro.modoCapturaDescuento.toString();
    }
    if (creditoAhorro.numDecimalesDescuento !== null) {
        document.getElementById("txtNumDecimales").value = creditoAhorro.numDecimalesDescuento;
    }

    if (creditoAhorro.modoCapturaDescuentoVSMG !== null) {//Por periodo, Mensual, Bimestral
        document.getElementById("selCapturaDescuento1").value = creditoAhorro.modoCapturaDescuentoVSMG.toString();
    }
    if (creditoAhorro.numDecimalesDescuentoVSMG !== null) {
        document.getElementById("txtNumDecimales1").value = creditoAhorro.numDecimalesDescuentoVSMG;
    }
    if (creditoAhorro.valorVSMG !== null) {
        document.getElementById("selValorVSMG").value = creditoAhorro.valorVSMG;
    }
    if (creditoAhorro.modoCapturaDescuentoPorc !== null) {//Por periodo, Mensual, Bimestral
        document.getElementById("selCapturaDescuento2").value = creditoAhorro.modoCapturaDescuentoPorc;
    }
    if (creditoAhorro.numDecimalesDescuentoPorc !== null) {
        document.getElementById("txtNumDecimales1").value = creditoAhorro.numDecimalesDescuentoPorc;
    }

}

function mostrarSeccionDescProporDiasPeriodo(creditoAhorro) {
    document.getElementById('ckbDescontarPropoDiasPer').checked = creditoAhorro.descPropDiasPer;
    document.getElementById('ckbSolicitarFechaVenc').checked = creditoAhorro.solicitarFecVen;
    document.getElementById("ckbConsiderarIncap").checked = creditoAhorro.considerarIncap;
    if (creditoAhorro.concepNomiDefin !== null) {
        setEditObject("editConceptoXDeduccion", creditoAhorro.concepNomiDefin.clave);
    }

}

function mostrarTabOtrosDatos(creditoAhorro, modoConsulta) {
    /* Mostrar Seccion Descontar / Agregar Credito / Ahorro en Finiquitos */
    mostrarSeccionDescAgrCredAhoFiniquitos(creditoAhorro, modoConsulta);

    /* Mostrar Seccion Descontar / Agregar Credito / Ahorro en Liquidaciones */
    mostrarSeccionDescAgrCredAhoLiquidaciones(creditoAhorro, modoConsulta);

    /* Mostrar Seccion Descontar / Agregar Credito / Ahorro en Ingresos de empleado */
    //mostrarSeccionDescAgrCredAhoIngEmpleados(creditoAhorro, modoConsulta);
    //if (creditoAhorro.modoAgregarCredAhoIngEmp === 0) {
    //    document.getElementById("ckbAgregarCredIngEmpleados").checked = false;
    //} else {
    //    document.getElementById("ckbAgregarCredIngEmpleados").checked = true;
    //}

    /* tasa de Interes Mensual */
    //document.getElementById("txtTasaInteresMen").value = creditoAhorro.tasaIntMens;


    /* Mostrar Seccion Corte Automático Anual */
    mostrarSeccionCorteAutoAnual(creditoAhorro, modoConsulta);

    mostrarSeccionRealizarDescuentos(creditoAhorro, modoConsulta);
}

function mostrarSeccionDescAgrCredAhoFiniquitos(creditoAhorro, modoConsulta) {
    if (creditoAhorro.modoDescontarCredAhoFini === 0) {
        document.getElementById("ckbDescontarFiniquito").checked = false;
    } else {
        document.getElementById("ckbDescontarFiniquito").checked = true;
        document.getElementById("rbSaldarAutoFin").disabled = false;
        document.getElementById("rbAgregarSinPreguntarFin").disabled = false;
        document.getElementById("rbAgregarPreguntandoFin").disabled = false;
        if (creditoAhorro.modoDescontarCredAhoFini === 1) {
            document.getElementById("rbSaldarAutoFin").checked = true;
        } else if (creditoAhorro.modoDescontarCredAhoFini === 2) {
            document.getElementById("rbAgregarSinPreguntarFin").checked = true;
        } else if (creditoAhorro.modoDescontarCredAhoFini === 3) {
            document.getElementById("rbAgregarPreguntandoFin").checked = true;
        }
    }
}

function mostrarSeccionDescAgrCredAhoLiquidaciones(creditoAhorro, modoConsulta) {
    if (creditoAhorro.modoDescontarCredAhoLiqu === 0) {
        document.getElementById("ckbDescontarLiquidaciones").checked = false;
    } else {
        document.getElementById("ckbDescontarLiquidaciones").checked = true;
        document.getElementById("rbSaldarAutoLiq").disabled = false;
        document.getElementById("rbAgregarSinPreguntarLiq").disabled = false;
        document.getElementById("rbAgregarPreguntandoFin").disabled = false;
        if (creditoAhorro.modoDescontarCredAhoLiqu === 1) {
            document.getElementById("rbSaldarAutoLiq").checked = true;
        } else if (creditoAhorro.modoDescontarCredAhoLiqu === 2) {
            document.getElementById("rbAgregarSinPreguntarLiq").checked = true;
        } else if (creditoAhorro.modoDescontarCredAhoLiqu === 3) {
            document.getElementById("rbAgregarPreguntandoLiq").checked = true;
        }
    }
}

function mostrarSeccionCorteAutoAnual(creditoAhorro, modoConsulta) {
    var calendario = new Date();
    var corteMes;
    /* si no asigna corte automatico, se pone por default la fecha 1900 01 01 */
    calendario.setFullYear(1900);
    calendario.setMonth(0);
    calendario.setDate(1);
    corteMes = new Date(creditoAhorro.corteMesDia);
    if (corteMes.getTime() === calendario.getTime()) {
        document.getElementById("selCorteMes").value = "";
        document.getElementById("selCorteDia").value = "";
        document.getElementById("ckbCorteAnualAuto").checked = false;
        document.getElementById("selCorteMes").disabled = true;
        document.getElementById("selCorteDia").disabled = true;
    } else {
        document.getElementById("selCorteMes").value = (corteMes.getMonth()).toString();
        llenarselDias(corteMes.getMonth());
        document.getElementById("selCorteDia").value = (corteMes.getDate() - 1).toString();
        document.getElementById("ckbCorteAnualAuto").checked = true;
        document.getElementById("selCorteMes").disabled = false;
        document.getElementById("selCorteDia").disabled = false;
    }

}

function mostrarSeccionRealizarDescuentos(creditoAhorro, modoConsulta) {

    if (creditoAhorro.activarManejoDescuento !== null) {
        document.getElementById("ckbRealizarDescuentoXManejoCred").checked = creditoAhorro.activarManejoDescuento;
        document.getElementById("txtConceptoDescuento").disabled = false;
        document.getElementById("selPeriodicidadDescto").disabled = false;

    } else {
        document.getElementById("ckbRealizarDescuentoXManejoCred").checked = false;
    }

    document.getElementById("txtConceptoDescuento").value = creditoAhorro.conceptoDcto;
    document.getElementById("selPeriodicidadDescto").value = creditoAhorro.periodicidadDescuento === null ? "" : creditoAhorro.periodicidadDescuento.toString();
    if (document.getElementById("selPeriodicidadDescto").value === "1" || document.getElementById("selPeriodicidadDescto").value === "2") {
        document.getElementById("selCuantoDescontar").value = creditoAhorro.cuandoDescontar.toString();
        document.getElementById("selCuantoDescontar").disabled = false;
    } else {
        document.getElementById("selCuantoDescontar").value = "";
    }

    if (creditoAhorro.modoManejoDescuento !== null) {
        if (creditoAhorro.modoManejoDescuento === 1) {
            document.getElementById("selFormaAplicar").value="1";
            //document.getElementById("rbEnPorcentaje").checked = true;
            //document.getElementById("txtPorcentajeDescto").disabled = false;
            document.getElementById("DivFormaAplicar").style.display="block";
            if (creditoAhorro.importeDescuento !== null) {
                document.getElementById("txtFormaAplicar").value = creditoAhorro.importeDescuento;
            }
        } else if (creditoAhorro.modoManejoDescuento === 2) {
            document.getElementById("selFormaAplicar").value = "2";
            //document.getElementById("rbImporteFijoDescto").checked = true;
            //document.getElementById("txtImporteDescto").disabled = false;
            document.getElementById("DivFormaAplicar").style.display = "block";
            if (creditoAhorro.importeDescuento !== null) {
                document.getElementById("txtFormaAplicar").value = creditoAhorro.importeDescuento;
            }
        } else if (creditoAhorro.modoManejoDescuento === 3) {
            document.getElementById("selFormaAplicar").value = "3";
            //document.getElementById("rbDefinirCapturaCredito").checked = true;
        }
    }
    if (creditoAhorro.cNDescuento !== null) {
        setEditObject("editConceptoNomina", creditoAhorro.cNDescuento.clave);
    }
}

/*Table selector*/
function selectorCredAhorr() {

    //Parameters
    nameCmp = "selectorCatalogoCredAhorr";
    if (tipoConfiguracion === 1) {
        title = "Configurar credito";
    } else if (tipoConfiguracion === 2) {
        title = "Configurar Ahorros";
    }
    table = "CreditoAhorro";
    nameCols = idiomaSelecionadoCol.messageFormatter("ConfiguracionCredAhoClave")() + "," + idiomaSelecionadoCol.messageFormatter("ConfiguracionCredAhoDescripcion")() + "," + idiomaSelecionadoCol.messageFormatter("ConfiguracionCredAhoDescripcionAbre")();
    // nameCols = "Clave,Descripción,Descripción Abreviada";
    campos = "clave,descripcion,descripcionAbrev";
    //o0,01,02,03
    //var subEntities = "puestos,plazasPorEmpleado";

    //camposMostrar = ["clave", "puestos.descripcion"];

    /*var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);*/
    var preFilters = { "tipoConfiguracion": tipoConfiguracion.toString(), "razonesSociales.id": razonSocialActual.id };


    var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de plaza", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };

    return buildTableSearch(nameCmp, title, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener,
        typeof desactivarSel === 'undefined' ? false : desactivarSel,
        typeof optionals === 'undefined' ? null : optionals);
}

function selectorCredAhorrShow(val) {
    searchCredAhorr(val[0]);
    //alert(val);
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
    var url = route + "/api/CreditoAhorro/txtFormatearMask";
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

function crearContenedor() {
    var contenedor = {};
    contenedor.id = getContenedorIDMax() + 1;
    contenedor.habilitado = true;
    contenedor.nombre = document.getElementById("txtDescripcionAbre").value;
    //if (tipoConfiguracion === 1) {
    //    contenedor.accion = JSON.stringify({ "tipoCaptura": "1010", "IdScreen": "registrosCreditos", "size": "8", "valorIni": document.getElementById("txtClave").value.toString() });
    //} else {
    //    contenedor.accion = JSON.stringify({ "tipoCaptura": "1010", "IdScreen": "registroAhorros", "size": "8", "valorIni": document.getElementById("txtClave").value.toString() });
    //}
    contenedor.ordenId = contenedor.id;
    contenedor.tipoAcciones = 2;
    contenedor.tipoIcono = 0;
    contenedor.visible = true;
    contenedor.razonSocial_ID = razonSocialActual.id;
    contenedor.tipoHerramienta_ID = 5;
    contenedor.descripcion = "";
    contenedor.nombreIcono = "";
    contenedor.accesoMenu = true;
   
    return contenedor;
}

function getContenedorIDMax() {
    var idContedor;
    var url = route + "/api/CreditoAhorro/getContenedorIDMAx";
    //var dataToPost = JSON.stringify(creditoAhorro);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        
    } else {
        idContedor = parseInt(Mensaje.resultado);
    }

    return idContedor;
}

function getContenedorPorControl(claveControl) {
    var idContedor;
    var url = route + "/api/CreditoAhorro/getContenedorPorControl";
    var dataToPost = JSON.stringify(claveControl);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        contenedorCred = null;

    } else {
        contenedorCred = Mensaje.resultado;
    }

}