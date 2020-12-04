var conceptoArriba = false;
var conceptoAbajo = false;
var empleadoArriba = false;
var empleadoAbajo = false;
var centroCostoArriba = false;
var centroCostoAbajo = false;
var isfechaInicial = false;
var isfechaFinal = false;
var isMovexistente = false;
var tbloriginal;
var listaMovimientosGlobales = new Array();
var listaMovNuevosYMod = new Array();
var listaMovDelete = new Array();
//var movnomConcepAux = {};
var concepto;
var empleado;
var centroCosto;
var periodoNomina;
var plazaPorEmpleado = new Array();
var parametros;
var razonSocial = 1;
var numParticion = 1;
var uso = 0;
var maxNumero = [0];
var ordenid = 0;
var tipoPantalla = 100;
var id;
var actualizaMov = false;
var eliminarMov = false;
var route = "";
var columnasParam = new Array();
var claveTipoNomina = "";
var razonSocialActual;
var plazaPorEmpleadoMov = {};
var start = 0;
var end = 10;
var parametrosGlobales = { "ejercicioActual": 2020 };
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    var query = getParameterByName('screen');
    if (query !== "") {
        displayMovimientos(query);
    } else {
        var obj = JSON.parse($("#container").data("opener"));
        query = obj.tipoCaptura + "|" + obj.IdScreen + "|" + obj.config;
        value = query.split('|');
        displayMovimientos(value[2]);
    }
    startCustomTools();
    //$("input[class=editKey]").blur(function (e) {
    //    var componClick = e.originalEvent.explicitOriginalTarget;

    //    if (componClick.className === "editKey") {
    //        $(this)[0].focus();
    //        console.log(componClick);
    //    }
    //    //var parent = $(this)[0].parentNode;
    //    //var parent2 = parent.parentNode;
    //    //var divgrup = $(parent2).nextAll("div:first")[0];
    //    //var hijodivGrup = divgrup.firstElementChild;
    //    //var divedit = $(hijodivGrup).nextAll("div:first")[0];
    //    //divedit.firstElementChild.focus();

    //});
});
function getRazonSocialActual() {
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);

    var url = route + "/api/Asistencias/getRazonSocialPorID";
    var dataToPost = JSON.stringify(razon.id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        razonSocialActual = Mensaje.resultado;
    }

    // return razonSocialActual;

}

function displayMovimientos(id) {
   
    var data = getConfiguracioMovId(id);
    inicializarValores(data);
    inicializarcomponenes();
    getRazonSocialActual();
   
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
}

function getConfiguracioMovId(id) {
    var configMov;
    var url = route + "/api/MovimientosNomina/buscaConfiguracionMovimSistema";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        configMov = Mensaje.resultado;
    }

    return configMov;
}

function inicializarValores(data) {
    var activarFiltros = data.activadosFiltro.split(',');
    var activadosMovimientos = data.activadosMovimientos.split(',');
    if (activarFiltros[0] === "1") {
        empleadoArriba = true;
    }
    if (activadosMovimientos[0] === "1") {
        empleadoAbajo = true;
    }

    if (activarFiltros[1] === "1") {
        conceptoArriba = true;
    }
    if (activadosMovimientos[1] === "1") {
        conceptoAbajo = true;
    }

    if (activarFiltros[2] === "1") {
        centroCostoArriba = true;
    }
    if (activadosMovimientos[2] === "1") {
        centroCostoAbajo = true;
    }

    if (activadosMovimientos[3] === "1") {
        isfechaInicial = true;
    }

    if (activadosMovimientos[4] === "1") {
        isfechaFinal = true;
    }
}

function inicializarcomponenes() {

    if (empleadoArriba) {
        // document.getElementById('GruopEmpleadoDetalle').style.display = "none";
    }
    if (conceptoArriba) {
        //document.getElementById('GruopConcepNominaDetalle2').style.display = "none";
    }

    if (centroCostoArriba) {
        //document.getElementById('GruopCentroCostoDetalle').style.display = "none";
    }

    if (conceptoAbajo) {
        document.getElementById('GruopConcepNomina').style.display = "none";
        // document.getElementById('GruopConcepNominaDetalle').style.display = "none";

    }

    if (empleadoAbajo) {
        document.getElementById('GruopEmpleado').style.display = "none";
        // document.getElementById('GruopEmpleadoDetalle2').style.display = "none";

    }

    if (centroCostoAbajo) {
        document.getElementById('GruopCentroCosto').style.display = "none";
        //document.getElementById('GruopCentroCostoDetalle2').style.display = "none";

    }

    if (!centroCostoAbajo && !centroCostoArriba) {
        document.getElementById('GruopCentroCosto').style.display = "none";
        //document.getElementById('GruopCentroCostoDetalle2').style.display = "none";
        //document.getElementById('GruopCentroCostoDetalle').style.display = "none";
    }
}

function getParameterByName(name, url) {
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

function construirFormaDetalle() {
    document.getElementById('con1').style.display = "none";
    document.getElementById('con3').style.display = "block";
    document.getElementById('btnAgregar').style.display = "none";
    var con2 = document.getElementById('con2');
    var cols = con2.querySelectorAll("th[id='editar'],th[id='eliminar'],td[id='editar'],td[id='eliminar']");
    for (var i = 0; i < cols.length; i++) {
        cols[i].style.display = "none";
    }
    //document.getElementById('editar').style.display = "none";
    //document.getElementById('eliminar').style.display = "none";
    document.getElementById('btnSalir').style.display = "none";
    document.getElementById('btnGuarda').style.display = "none";
    document.getElementById('btnCancelar').style.display = "none";
    document.getElementById('btnAgregarMov').style.display = "inline-block";
    document.getElementById('btnLimpiar').style.display = "inline-block";

    var txtTipoCorrida = document.getElementById('txtTipoCorrida');
    document.getElementById('txtTipoCorrida2').value = txtTipoCorrida.options[txtTipoCorrida.selectedIndex].innerHTML;

    if (conceptoArriba) {
        var txtConcepNomina = document.getElementById('txtConcepNomina');
        document.getElementById('txtConcepNomina2').value = txtConcepNomina.options[txtConcepNomina.selectedIndex].innerHTML;
    }

    var txtTipoNomina = document.getElementById('txtTipoNomina');
    document.getElementById('txtTipoNomina2').value = txtTipoNomina.options[txtTipoNomina.selectedIndex].innerHTML;

    var txtPeriodoNomina = document.getElementById('txtPeriodoNomina');
    document.getElementById('txtPeriodoNomina2').value = txtPeriodoNomina.options[txtPeriodoNomina.selectedIndex].innerHTML;

    if (centroCostoArriba) {
        var txtCentroCosto = document.getElementById('txtCentroCosto');
        document.getElementById('txtCentroCosto3').value = txtCentroCosto.options[txtCentroCosto.selectedIndex].innerHTML;
    }
    if (empleadoArriba) {
        var txtEmpleados = document.getElementById('txtEmpleados');
        document.getElementById('txtEmpleado3').value = txtEmpleados.options[txtEmpleados.selectedIndex].innerHTML;
    }
}

function cancelar() {
    clearEdit("editTipoCorrida");
    clearEdit("editConcepNomina");
    clearEdit("editTipoNomina");
    clearEdit("editPeriodoNomina");
    clearEdit("editCentroCosto");
    clearEdit("editEmpleado");
    document.getElementById('txtFechaIni').value = "";
    document.getElementById('txtFechaFin').value = "";
    columnasParam = new Array();
    var element = document.getElementById('contTable');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();
    //document.getElementById('txtTipoNomina').value = "";
    //document.getElementById('txtPeriodoNomina').value = "";
    //document.getElementById('txtFechaIni').value = "";
    //document.getElementById('txtFechaFin').value = "";
    //document.getElementById('txtCentroCosto').value = "";
    //document.getElementById('txtEmpleados').value = "";
    //$('#tblDetalle1').find("tr:gt(0)").remove();
    listaMovimientosGlobales = new Array();
    listaMovNuevosYMod = new Array();
    listaMovDelete = new Array();

    eliminarMov = false;
    actualizaMov = false;
    concepto = undefined;
    empleado = undefined;
    centroCosto = undefined;
    periodoNomina = undefined;
    plazaPorEmpleado = new Array();
    parametros = undefined;
    id = undefined;
}

function limpiar() {
    document.getElementById('con1').style.display = "block";
    document.getElementById('con3').style.display = "none";
    document.getElementById('btnAgregar').style.display = "block";
    var con2 = document.getElementById('con2');
    var cols = con2.querySelectorAll("th[id='editar'],th[id='eliminar'],td[id='editar'],td[id='eliminar']");
    for (var i = 0; i < cols.length; i++) {
        cols[i].style.display = "";
    }
    document.getElementById('btnSalir').style.display = "inline-block";
    document.getElementById('btnGuarda').style.display = "inline-block";
    document.getElementById('btnCancelar').style.display = "inline-block";
    document.getElementById('btnAgregarMov').style.display = "none";
    document.getElementById('btnLimpiar').style.display = "none";
    limpiarCompontes();


}

function limpiarCompontes() {
    document.getElementById('txtTipoCorrida2').value = "";
    document.getElementById('txtConcepNomina2').value = "";
    document.getElementById('txtConcepNomina3').value = "";
    document.getElementById('txtTipoNomina2').value = "";
    document.getElementById('txtPeriodoNomina2').value = "";
    document.getElementById('txtCentroCosto3').value = "";
    document.getElementById('txtCentroCosto2').value = "";
    document.getElementById('txtEmpleado3').value = "";
    document.getElementById('txtEmpleados2').value = "";
    document.getElementById('txtPlazaEmp').style.display = "none";
    document.getElementById('txtPlazaEmp').value = "";
    document.getElementById('plaza').style.display = "none";
    if (conceptoArriba) {
        var con3 = document.getElementById('col1row1Fcon3');
        var divs = con3.querySelectorAll('div[parametro]');
        for (var i = 0; i < divs.length; i++) {
            var input = divs[i].querySelector('input');

            input.value = "";
        }
    } else if (conceptoAbajo) {
        removerComponentesParam();
    }
}

function salir() {
    cancelar();
    window.location = "modulo.html";
}

function searchAll(tabla) {
    var resultado;
    var url = route + "/api/SearchGenericAll";
    var dataToPost = JSON.stringify(tabla);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        resultado = Mensaje.resultado;
    }
    return resultado;
}

function llenarSelectsObli() {
    var contenedor = document.getElementById('con1');

    var selects = contenedor.querySelectorAll('select');
    for (var i = 0; i < selects.length; i++) {
        if (selects[i].getAttribute('obligatorio')) {
            var tabla = selects[i].getAttribute('name');
            var res = searchAll(tabla);
            for (var j = 0; j < res.length; j++) {
                $('#' + selects[i].id).append('<option value=' + res[j]['id'] + '>' + res[j]['clave'] + "-" + res[j]['descripcion'] + '</option>');
            }
        }
    }
}

function llenarSelectEmp() {
    // var res = searchAll("Empleados");

    if (empleadoArriba) {
        $('#txtEmpleados').find('option').not(':first').remove();
        var res = searchAll("Empleados");
        for (var i = 0; i < res.length; i++) {
            $('#txtEmpleados').append('<option value=' + res[i]['id'] + '>' + res[i]['clave'] + "-" + res[i]['apellidoPaterno'] + " " + res[i]['apellidoMaterno'] + " " + res[i]['nombre'] + '</option>');
        }
    } else if (empleadoAbajo) {
        $('#txtEmpleados2').find('option').not(':first').remove();
        var res2 = searchAll("Empleados");
        for (var j = 0; j < res2.length; j++) {
            $('#txtEmpleados2').append('<option value=' + res2[j]['id'] + '>' + res2[j]['clave'] + "-" + res2[j]['apellidoPaterno'] + " " + res2[j]['apellidoMaterno'] + " " + res2[j]['nombre'] + '</option>');
        }
    }

}

function llenarSelectCentroCos() {
    // var res = searchAll("Empleados");

    if (centroCostoArriba) {
        $('#txtCentroCosto').find('option').not(':first').remove();
        var res = searchAll("CentroDeCosto");
        for (var i = 0; i < res.length; i++) {
            $('#txtCentroCosto').append('<option value=' + res[i]['id'] + '>' + res[i]['clave'] + "-" + res[i]['descripcion'] + '</option>');
        }
    } else if (centroCostoAbajo) {
        $('#txtCentroCosto2').find('option').not(':first').remove();
        var res2 = searchAll("CentroDeCosto");
        for (var j = 0; j < res2.length; i++) {
            $('#txtCentroCosto2').append('<option value=' + res2[j]['id'] + '>' + res2[j]['clave'] + "-" + res2[j]['descripcion'] + '</option>');
        }
    }

}

//function showWait() {
//    var div = document.createElement('div');
//    div.setAttribute("id", "loadingWait");
//    var img = document.createElement('img');
//    img.src = 'img/loadingWait.gif';
//    div.style.cssText = 'position: fixed; top: 50%; left: 50%; z-index: 5000;\n\
//                    -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);';
//    div.appendChild(img);
//    document.body.appendChild(div);
//}

//function removeWait() {
//    document.getElementById("loadingWait").remove();
//}

function buscarConceptosPorCorrida(id) {
   

    var url = route + "/api/MovimientosNomina/getPorTipoCorridaIDConcepNomDefi";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        if (conceptoArriba) {
            $('#txtConcepNomina').find('option').not(':first').remove();
            for (var i = 0; i < Mensaje.resultado.length; i++) {
                $('#txtConcepNomina').append('<option value=' + Mensaje.resultado[i]['id'] + '>' + Mensaje.resultado[i]['clave'] + "-" + Mensaje.resultado[i]['descripcion'] + '</option>');
            }
        } else if (conceptoAbajo) {
            $('#txtConcepNomina3').find('option').not(':first').remove();
            for (var j = 0; j < Mensaje.resultado.length; j++) {
                $('#txtConcepNomina3').append('<option value=' + Mensaje.resultado[j]['id'] + '>' + Mensaje.resultado[j]['clave'] + "-" + Mensaje.resultado[j]['descripcion'] + '</option>');
            }
        }
    }
  
}

function buscarPeriodosNomina() {
   
    var obj = {};
    obj.anio = "2019";
    obj.TipoNomina = document.getElementById('txtTipoNomina').value;
    obj.TipoCorrida = document.getElementById('txtTipoCorrida').value;
    var getData = "";
    var url = route + "/api/MovimientosNomina/getPeriodosNomIdTnYIdTc";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        $('#txtPeriodoNomina').find('option').not(':first').remove();
        for (var i = 0; i < Mensaje.resultado.length; i++) {
            $('#txtPeriodoNomina').append('<option value=' + Mensaje.resultado[i]['id'] + '>' + Mensaje.resultado[i]['descripcion'] + '</option>');
        }
    }
  
}

function setFechasPer(id) {


    var url = route + "/api/MovimientosNomina/getPeriodosNominaPorID";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        periodoNomina = Mensaje.resultado;
        //document.getElementById('txtFechaIni').value = formatDate(new Date(Mensaje.resultado.fechaInicial.toString()));
        //document.getElementById('txtFechaFin').value = formatDate(new Date(Mensaje.resultado.fechaFinal.toString()));

        if (empleadoAbajo && concepto !== undefined) {

            consultaMov(start, end);
        }
    }
}

function formatDate(date) {

    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + '/' + meses[monthIndex] + '/' + year;
}

function concepNomiDefiPorClave(clave) {
    var resultado;
    //var clave;
    var claveCorrida = document.getElementById('editTipoCorrida').getAttribute('value');
    //if (conceptoArriba) {
    //    clave = document.getElementById('txtConcepNomina').value;
    //} else if (conceptoAbajo) {
    //    clave = document.getElementById('txtConcepNomina3').value;
    //}
    var obj = {};
    if (clave !== "" && typeof clave !== 'undefined') {
        obj['Clave'] = clave;
        obj['ClaveCorrida'] = claveCorrida;
        var url = route + "/api/MovimientosNomina/ConcepNomiDefiPorClave";
        var dataToPost = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
        if (Mensaje.resultado === null) {
            alert("No object");
        } else {
            resultado = Mensaje.resultado;
        }
    }
    return resultado;
}

function construirParamConcep() {
    
    //var rowCount = table.rows;
    //var cols = rowCount[0].cells;
    //var campostable = new Array();
    removerComponentesParam();
    //concepto = concepNomiDefiPorClave();
    columnasParam = new Array();
    parametros = concepto.paraConcepDeNom;
    if (conceptoArriba) {

        for (var i = 0; i < parametros.length; i++) {
            for (var j = 0; j < 3; j++) {
                if (j < parametros.length) {
                    var obj = {};
                    obj.tituloColumna = parametros[i]['descripcion'].replace(" ","");
                    obj.nombreCompo = parametros[i]['descripcion'];
                    obj.editable = true;
                    if (parametros[i]['tipo'] === "INTEGER") {
                        obj.tipoCompon = "importe";

                    } else if (parametros[i]['tipo'] === "STRING") {
                        obj.tipoCompon = "text";
                    }
                    // obj.tipoCompon = "";
                    obj.persist = parametros[i]['descripcion'];
                    obj.ancho = "150px";
                    obj.isParam = true;
                    columnasParam.push(obj);
                }
            }
        }
        var element = document.getElementById('contTable');
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        OpenTable(document.getElementById('contTable'));
        InitEventsTable();
    }


 

}

function getnumeroMaxMovNomConcep() {
    var numero;
    var claveNomina = document.getElementById('editTipoNomina').getAttribute("value");
    var claveperiodo = document.getElementById('editPeriodoNomina').getAttribute("value");
    var obj = {};
    //obj['Anio'] = "2017";
    obj['ClaveNomina'] = claveNomina;
    obj['claveperiodo'] = claveperiodo;
    var getData = "";
    var url = route + "/api/MovimientosNomina/getNumeroMaxMovNomConcep";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        numero = Mensaje.resultado;
    }
    return numero;
}

function getEmpleadoID(id) {

    var url = route + "/api/MovimientosNomina/getPorIdEmpleado";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        empleado = Mensaje.resultado;
        getPlaza();
        if (empleadoArriba) {
            consultaMov(start, end);
        }
    }

}

function getPorIdCentroDeCosto(id) {
    var getData = "";
    var url = route + "/api/MovimientosNomina/getPorIdCentroDeCosto";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        centroCosto = Mensaje.resultado;
    }
}

function crearComponentesParam(parametros) {
    var con3 = document.getElementById('col1row1Fcon3');

    for (var i = 0; i < parametros.length; i++) {
        var div = document.createElement("DIV");
        div.id = "GruopParametros" + parametros[i]['descripcion'];
        div.className = "mainPanelDivGroup";
        div.style.width = "100%";
        div.style.maxWidth = "30%";
        div.setAttribute("parametro", true);
        var label = document.createElement("LABEL");
        label.id = parametros[i]['id'] + parametros[i]['descripcion'];
        label.innerText = parametros[i]['descripcion'];
        div.appendChild(label);
        var cajaText = document.createElement("INPUT");
        cajaText.className = "mainPanelContentComponents";
        if (parametros[i]['tipo'] === "INTEGER") {
            cajaText.type = "text";

        } else if (parametros[i]['tipo'] === "STRING") {
            cajaText.type = "text";
        }
        cajaText.id = parametros[i]['descripcion'] + parametros[i]['id'];
        cajaText.style.width = "100%";
        cajaText.setAttribute('persist', parametros[i]['descripcion']);
        cajaText.setAttribute('isparam', 'true');
        cajaText.setAttribute('source', parametros[i]['id']);
        div.appendChild(cajaText);
        // divCont.appendChild(div);
        con3.appendChild(div);
    }

}

function removerComponentesParam() {
    //var con3 = document.getElementById('col1row1Fcon3');

    //var divs = con3.querySelectorAll('div');

    //for (var i = 0; i < divs.length; i++) {
    //    if (divs[i].getAttribute('parametro') === "true") {
    //        con3.removeChild(divs[i]);
    //    }
    //}

}

function agregarMov(valoresTabla) {


    var obj = {};
    obj.id = valoresTabla.id;
    obj.razonesSociales_ID = razonSocial;
    obj.numMovParticion = numParticion;
    obj.ordenId = ordenid;
    obj.tipoPantalla = tipoPantalla;
    obj.uso = uso;
    obj.ejercicio = new Date(periodoNomina.fechaInicial.toString()).getFullYear();
    obj.fechaCierr = formatDateddmmyyy(new Date(periodoNomina.fechaCierre));
    obj.fechaIni = formatDateddmmyyy(new Date(periodoNomina.fechaInicial));
    obj.plazasPorEmpleado_ID = plazaPorEmpleadoMov.plazasPorEmpleado_ID;
    obj.mes = new Date(periodoNomina.fechaInicial.toString()).getMonth() + 1;
    obj.tipoCorrida_ID = parseInt(document.getElementById('editTipoCorrida').getAttribute("value"));
    if (conceptoAbajo) {
        obj.concepNomDefi_ID = concepto.id;
        obj.concepNomDefi = {};
        obj.concepNomDefi.id = concepto.id;
        obj.concepNomDefi.clave = concepto.clave;
        obj.concepNomDefi.descripcion = concepto.descripcion;
    } else {
        obj.concepNomDefi_ID = concepto.id;
    }

    obj.tipoNomina_ID = parseInt(document.getElementById('editTipoNomina').getAttribute("value"));

    if (empleadoAbajo) {
        obj.empleado_ID = empleado.id;
        obj.empleados = {};
        obj.empleados.id = empleado.id;
        obj.empleados.clave = empleado.clave;
        obj.empleados.apellidoMaterno = empleado.apellidoMaterno;
        obj.empleados.apellidoPaterno = empleado.apellidoPaterno;
        obj.empleados.nombre = empleado.nombre;
    } else {
        obj.empleado_ID = empleado.id;
    }

    obj.periodosNomina_ID = parseInt(document.getElementById('editPeriodoNomina').getAttribute("value"));

    if (maxNumero.length === 1) {
        maxNumero[maxNumero.length] = getnumeroMaxMovNomConcep();
    }
    var maximo = Math.max.apply(null, maxNumero);
    maxNumero[maxNumero.length] = maximo + 1;
    obj.numero = maximo + 1;

    if (centroCostoAbajo) {
        obj.centroDeCosto_ID = valoresTabla.centroDeCosto_ID;
    } else if (centroCostoArriba) {
        obj.centroDeCosto_ID = parseInt(document.getElementById('editCentroCosto').getAttribute("value"));
    }

    var objParam = new Array();
    for (var j = 0; j < parametros.length; j++) {
        var objParamAUX = {};
        for (var param in valoresTabla.parametros) {
            if (param === parametros[j].descripcion) {
                objParamAUX.paraConcepDeNom_ID = parametros[j].id;
                objParamAUX.paraConcepDeNom = parametros[j];
                objParamAUX.valor = quitarFormatImporte(valoresTabla.parametros[param]);
                objParam[objParam.length] = objParamAUX;
                break;
            }
        }
    }
    obj.movNomConceParam = objParam;

    listaMovNuevosYMod[listaMovNuevosYMod.length] = obj;
    listaMovimientosGlobales[listaMovimientosGlobales.length] = obj;
    llenarTablaMov(start, end);

}

function getvaloresMov() {
    var i = 0;
    var k = 0;
    var j = 0;
    if (typeof valoresNuevos !== 'undefined') {
        for ( i = 0; i < valoresNuevos.length; i++) {
            var obj = {};
            obj.id = valoresNuevos[i].id;
            obj.razonesSociales_ID = razonSocial;
            obj.numMovParticion = numParticion;
            obj.ordenId = ordenid;
            obj.tipoPantalla = tipoPantalla;
            obj.uso = uso;
            obj.ejercicio = new Date(periodoNomina.fechaInicial.toString()).getFullYear();
            obj.tipoCorrida_ID = valoresNuevos[i].tipoCorrida_ID;
            obj.concepNomDefi_ID = valoresNuevos[i].concepNomDefi_ID;
            obj.tipoNomina_ID = valoresNuevos[i].tipoNomina_ID;
            obj.empleado_ID = valoresNuevos[i].empleado_ID;

            obj.periodosNomina_ID = parseInt(document.getElementById('editPeriodoNomina').getAttribute("value"));
            if (maxNumero.length === 1) {
                maxNumero[maxNumero.length] = getnumeroMaxMovNomConcep();
            }
            var maximo = Math.max.apply(null, maxNumero);
            maxNumero[maxNumero.length] = maximo + 1;
            obj.numero = maximo + 1;


            if (typeof valoresNuevos[i].centroDeCosto_ID !== 'undefined') {
                obj.centroDeCosto_ID = valoresTable[i].centroDeCosto_ID;
            }
            var objParam = new Array();
            for ( j = 0; j < parametros.length; j++) {
                var objParamAUX = {};
                for (var param in valoresNuevos[i].parametros) {
                    if (param === parametros[j].descripcion) {
                        objParamAUX.paraConcepDeNom_ID = parametros[j].id;
                        // objParamAUX.paraConcepDeNom = parametros[j];
                        objParamAUX.valor = valoresNuevos[i].parametros[param];
                        objParam[objParam.length] = objParamAUX;
                        break;
                    }
                }
                //if (valoresTable[i].parametros.includes(parametros[j].descripcion)) {
                //    //if (Number.isInteger(movnomConcepAux.id)) {
                //    //    objParamAUX.movNomConcep_ID = movnomConcepAux.id;
                //    //}
                //    objParamAUX.paraConcepDeNom_ID = parametros[j].id;
                //    objParamAUX.paraConcepDeNom = parametros[j];
                //    objParamAUX.valor = input[k].value;
                //    objParam[objParam.length] = objParamAUX;
                //    break;
                //}
            }
            obj.movNomConceParam = objParam;
            listaMovNuevosYMod[listaMovNuevosYMod.length] = obj;

        }

    }
    if (typeof valoresEditados !== 'undefined') {

        for ( i = 0; i < valoresEditados.length; i++) {

            for ( j = 0; j < listaMovimientosGlobales.length; j++) {
                if (listaMovimientosGlobales[j].id === parseInt(valoresEditados[i].id)) {
                    var objmof = {};
                    //objmof.id = listaMovimientosGlobales[j].id;
                    objmof.id = listaMovimientosGlobales[j].id;
                    objmof.razonesSociales_ID = listaMovimientosGlobales[j].razonesSociales_ID;
                    objmof.numMovParticion = listaMovimientosGlobales[j].numMovParticion;
                    objmof.ordenId = listaMovimientosGlobales[j].ordenId;
                    objmof.tipoPantalla = listaMovimientosGlobales[j].tipoPantalla;
                    objmof.uso = listaMovimientosGlobales[j].uso;
                    objmof.ejercicio = listaMovimientosGlobales[j].ejercicio;
                    objmof.tipoCorrida_ID = valoresEditados[i].tipoCorrida_ID;
                    objmof.concepNomDefi_ID = valoresEditados[i].concepNomDefi_ID;
                    objmof.tipoNomina_ID = valoresEditados[i].tipoNomina_ID;
                    if (valoresEditados[i].empleado_ID) {
                        objmof.empleado_ID = valoresEditados[i].empleado_ID;
                    } else {
                        objmof.empleado_ID = listaMovimientosGlobales[j].empleado_ID;
                    }

                    objmof.numero = listaMovimientosGlobales[j].numero;
                    objmof.periodosNomina_ID = listaMovimientosGlobales[j].periodosNomina_ID;
                    if (typeof listaMovimientosGlobales[j].centroDeCosto_ID !== 'undefined') {
                        objmof.centroDeCosto_ID = listaMovimientosGlobales[j].centroDeCosto_ID;
                    }
                    var objParams = new Array();
                    if (listaMovimientosGlobales[j].movNomConceParam.length) {
                        for ( k = 0; k < listaMovimientosGlobales[j].movNomConceParam.length; k++) {
                            for (var param2 in valoresEditados[i].parametros) {
                                if (param2=== listaMovimientosGlobales[j].movNomConceParam[k].paraConcepDeNom.descripcion) {
                                    listaMovimientosGlobales[j].movNomConceParam[k].valor = valoresEditados[i].parametros[param2];
                                    objParams[objParams.length] = listaMovimientosGlobales[j].movNomConceParam[k];
                                    // input[k].value = movParam[j].valor;
                                    break;
                                }
                            }
                        }
                    } else {
                        for ( k = 0; k < parametros.length; k++) {
                            var objParamAUX1 = {};
                            for (var param1 in valoresEditados[i].parametros) {
                                if (param1 === parametros[k].descripcion) {
                                    objParamAUX1.paraConcepDeNom_ID = parametros[k].id;
                                    if (Number.isInteger(listaMovimientosGlobales[j].id)) {
                                        objParamAUX1.movNomConcep_ID = listaMovimientosGlobales[j].id;
                                    }
                                    objParamAUX1.valor = valoresEditados[k].parametros[param1];
                                    objParams[objParams.length] = objParamAUX1;
                                    break;
                                }
                            }
                        }
                    }
                    objmof.movNomConceParam = objParam;
                    listaMovNuevosYMod[listaMovNuevosYMod.length] = objmof;
                }
            }
        }
    }
    if (typeof valoresEliminar !== 'undefined') {
        listaMovDelete = valoresEliminar;
    }
    //if (id == undefined) {
    //    var rString = "mov" + randomString(2, '0123456789');
    //    obj.id = rString;
    //} else {
    //    obj.id = id;
    //}
    //obj.tipoCorrida_ID = parseInt(document.getElementById('txtTipoCorrida').value);
    //if (conceptoArriba) {
    //    obj.concepNomDefi_ID = concepto.id;


    //} else if (conceptoAbajo) {
    //    obj.concepNomDefi_ID = concepto.id;
    //    var concep = {};
    //    concep.id = concepto.id;
    //    concep.clave = concepto.clave;
    //    concep.descripcion = concepto.descripcion;
    //    obj.concepNomDefi = concep;
    //}
    //if (concepto.activarPlaza) {
    //    obj.plazaReferencia = plazaPorEmpleado[0].referencia;
    //}
    //obj.tipoNomina_ID = parseInt(document.getElementById('txtTipoNomina').value);
    //obj.periodosNomina_ID = parseInt(document.getElementById('txtPeriodoNomina').value);
    //if (empleadoArriba) {
    //    obj.empleado_ID = empleado.id;
    //} else if (empleadoAbajo) {
    //    obj.empleado_ID = empleado.id;
    //    var emp = {};
    //    emp.clave = empleado.clave;
    //    emp.id = empleado.id;
    //    emp.apellidoMaterno = empleado.apellidoMaterno;
    //    emp.apellidoPaterno = empleado.apellidoPaterno;
    //    emp.nombre = empleado.nombre;
    //    obj.empleados = emp;
    //}
    //if (centroCostoArriba) {
    //    obj.centroDeCosto_ID = centroCosto.id;
    //} else if (centroCostoAbajo) {
    //    obj.centroDeCosto_ID = centroCosto.id;
    //    var centro = {};
    //    centro.clave = centroCosto.clave;
    //    centro.descripcion = centroCosto.descripcion;
    //    centro.id = centroCosto.id;
    //    obj.centroDeCosto = centro;

    //}
    //if (Object.keys(movnomConcepAux).length > 0) {
    //    obj.razonesSociales_ID = movnomConcepAux.razonesSociales_ID;
    //    obj.numMovParticion = movnomConcepAux.numMovParticion;
    //    obj.ordenId = movnomConcepAux.ordenId;
    //    obj.tipoPantalla = movnomConcepAux.tipoPantalla;
    //    obj.uso = movnomConcepAux.uso;
    //    obj.ejercicio = movnomConcepAux.ejercicio;
    //    obj.numero = movnomConcepAux.numero;

    //    var objParam = new Array();
    //    var conDetalle = document.getElementById('con3');
    //    var input = conDetalle.querySelectorAll("input[isparam='true']");
    //    for (var k = 0; k < input.length; k++) {
    //        var objParamAUX = {};
    //        if (movnomConcepAux.movNomConceParam.length > 0) {
    //            for (var j = 0; j < movnomConcepAux.movNomConceParam.length; j++) {
    //                if (input[k].getAttribute('persist') === movnomConcepAux.movNomConceParam[j].paraConcepDeNom.descripcion) {
    //                    movnomConcepAux.movNomConceParam[j].valor = input[k].value;
    //                    objParam[objParam.length] = movnomConcepAux.movNomConceParam[j];
    //                    // input[k].value = movParam[j].valor;
    //                    break;
    //                }
    //            }
    //        } else {
    //            for (var j = 0; j < parametros.length; j++) {
    //                if (input[k].getAttribute('persist') === parametros[j].descripcion) {
    //                    if (Number.isInteger(movnomConcepAux.id)) {
    //                        objParamAUX.movNomConcep_ID = movnomConcepAux.id;
    //                    }
    //                    objParamAUX.paraConcepDeNom_ID = parametros[j].id;
    //                    objParamAUX.paraConcepDeNom = parametros[j];
    //                    objParamAUX.valor = input[k].value;
    //                    objParam[objParam.length] = objParamAUX;
    //                    break;
    //                }
    //            }

    //        }
    //    }


    //    obj.movNomConceParam = objParam;

    //} else {
    //    obj.razonesSociales_ID = razonSocial;
    //    obj.numMovParticion = numParticion;
    //    obj.ordenId = ordenid;
    //    obj.tipoPantalla = tipoPantalla;
    //    obj.uso = uso;
    //    obj.ejercicio = new Date(periodoNomina.fechaInicial.toString()).getFullYear();

    //    //if (Object.keys(movnomConcepAux).length > 0) {
    //    if (maxNumero.length === 1) {
    //        maxNumero[maxNumero.length] = getnumeroMaxMovNomConcep();
    //    }
    //    var maximo = Math.max.apply(null, maxNumero);
    //    maxNumero[maxNumero.length] = maximo + 1;
    //    obj.numero = (maximo + 1);
    //    var objParam = new Array();

    //    var con3 = document.getElementById('con3');

    //    var elementos = con3.querySelectorAll('div[parametro]');
    //    for (var i = 0; i < elementos.length; i++) {
    //        var objParamAUX = {};
    //        var input = elementos[i].querySelector('input');
    //        for (var j = 0; j < parametros.length; j++) {
    //            if (input.getAttribute('persist') === parametros[j].descripcion) {
    //                objParamAUX.paraConcepDeNom_ID = parametros[j].id;
    //                objParamAUX.paraConcepDeNom = parametros[j];
    //                objParamAUX.valor = input.value;
    //                objParam[objParam.length] = objParamAUX;
    //                break;
    //            }
    //        }
    //    }
    //    obj.movNomConceParam = objParam;
    //}
    //// }


    //id = undefined;
    //movnomConcepAux = {};



    // console.log(obj);
    //return obj;
}

function actualizarMov(valoresTabla) {
    var movnomConcepAux = {};
    var i = 0;
    var k = 0;
    if (parseInt(valoresTabla.id)) {
        for ( i = 0; i < listaMovNuevosYMod.length; i++) {
            if (listaMovNuevosYMod[i].id === parseInt(valoresTabla.id)) {
                movnomConcepAux = listaMovNuevosYMod[i];
                listaMovNuevosYMod.splice(i, 1);
                break;
            }
        }
        if (Object.keys(movnomConcepAux).length === 0) {
            for ( i = 0; i < listaMovimientosGlobales.length; i++) {
                if (listaMovimientosGlobales[i].id === parseInt(valoresTabla.id)) {
                    movnomConcepAux = listaMovimientosGlobales[i];
                    if (valoresTabla.empleado_ID) {
                        movnomConcepAux.empleado_ID = empleado.id;
                    }

                    if (valoresTabla.concepNomDefi_ID) {
                        movnomConcepAux.concepNomDefi_ID = valoresTabla.concepNomDefi_ID;
                    }
                    if (valoresTabla.centroDeCosto_ID) {
                        movnomConcepAux.centroDeCosto_ID = valoresTabla.centroDeCosto_ID;
                    }
                    var objParam = new Array();
                    if (movnomConcepAux.movNomConceParam.length) {
                        for ( k = 0; k < movnomConcepAux.movNomConceParam.length; k++) {
                            for (var param in valoresTabla.parametros) {
                                if (param === movnomConcepAux.movNomConceParam[k].paraConcepDeNom.descripcion) {
                                    movnomConcepAux.movNomConceParam[k].valor = quitarFormatImporte(valoresTabla.parametros[param]);
                                    objParam[objParam.length] = movnomConcepAux.movNomConceParam[k];
                                    // input[k].value = movParam[j].valor;
                                    break;
                                }
                            }
                        }
                    } else {
                        for ( k = 0; k < parametros.length; k++) {
                            var objParamAUX = {};
                            for (var params in valoresTabla.parametros) {
                                if (params === parametros[k].descripcion) {
                                    objParamAUX.paraConcepDeNom_ID = parametros[k].id;
                                    if (Number.isInteger(movnomConcepAux.id)) {
                                        objParamAUX.movNomConcep_ID = movnomConcepAux.id;
                                    }
                                    objParamAUX.valor = quitarFormatImporte(valoresTabla.parametros[params]);
                                    objParam[objParam.length] = objParamAUX;
                                    break;
                                }
                            }
                        }
                    }
                    listaMovNuevosYMod[listaMovNuevosYMod.length] = movnomConcepAux;
                    break;
                }
            }
        } else {
            if (valoresTabla.empleado_ID) {
                movnomConcepAux.empleado_ID = empleado.id;
            }

            if (valoresTabla.concepNomDefi_ID) {
                movnomConcepAux.concepNomDefi_ID = valoresTabla.concepNomDefi_ID;
            }

            if (valoresTabla.centroDeCosto_ID) {
                movnomConcepAux.centroDeCosto_ID = valoresTabla.centroDeCosto_ID;
            }
            var objParam1 = new Array();
            if (movnomConcepAux.movNomConceParam.length) {
                for ( k = 0; k < movnomConcepAux.movNomConceParam.length; k++) {
                    for (var parama in valoresTabla.parametros) {
                        if (parama === movnomConcepAux.movNomConceParam[k].paraConcepDeNom.descripcion) {
                            movnomConcepAux.movNomConceParam[k].valor = quitarFormatImporte(valoresTabla.parametros[parama]);
                            objParam1[objParam1.length] = movnomConcepAux.movNomConceParam[k];
                            // input[k].value = movParam[j].valor;
                            break;
                        }
                    }
                }
            } else {
                for ( k = 0; k < parametros.length; k++) {
                    var objParamAUXI = {};
                    for (var paramas in valoresTabla.parametros) {
                        if (paramas === parametros[k].descripcion) {
                            objParamAUXI.paraConcepDeNom_ID = parametros[k].id;
                            if (Number.isInteger(movnomConcepAux.id)) {
                                objParamAUXI.movNomConcep_ID = movnomConcepAux.id;
                            }
                            objParamAUXI.valor = quitarFormatImporte(valoresTabla.parametros[paramas]);
                            objParam1[objParam1.length] = objParamAUXI;
                            break;
                        }
                    }
                }
            }
            listaMovNuevosYMod[listaMovNuevosYMod.length] = movnomConcepAux;
        }

    } else {

        for ( i = 0; i < listaMovNuevosYMod.length; i++) {
            if (valoresTabla.id === listaMovNuevosYMod[i].id) {
                movnomConcepAux = listaMovNuevosYMod[i];

                if (valoresTabla.empleado_ID) {
                    movnomConcepAux.empleado_ID = valoresTabla.empleado_ID;
                }

                if (valoresTabla.concepNomDefi_ID) {
                    movnomConcepAux.concepNomDefi_ID = valoresTabla.concepNomDefi_ID;
                }

                if (valoresTabla.centroDeCosto_ID) {
                    movnomConcepAux.centroDeCosto_ID = valoresTabla.centroDeCosto_ID;
                }
                var objParams = new Array();
                if (movnomConcepAux.movNomConceParam.length) {
                    for ( k = 0; k < movnomConcepAux.movNomConceParam.length; k++) {
                        for (var paramasm in valoresTabla.parametros) {
                            if (paramasm === movnomConcepAux.movNomConceParam[k].paraConcepDeNom.descripcion) {
                                movnomConcepAux.movNomConceParam[k].valor = quitarFormatImporte(valoresTabla.parametros[paramasm]);

                                objParams[objParams.length] = movnomConcepAux.movNomConceParam[k];
                                // input[k].value = movParam[j].valor;
                                break;
                            }
                        }
                    }
                } else {
                    for ( k = 0; k < parametros.length; k++) {
                        var objParamAUX1 = {};
                        for (var param1 in valoresTabla.parametros) {
                            if (param1 === parametros[k].descripcion) {
                                objParamAUX1.paraConcepDeNom_ID = parametros[k].id;
                                objParamAUX1.paraConcepDeNom = parametros[k];
                                if (Number.isInteger(movnomConcepAux.id)) {
                                    objParamAUX1.movNomConcep_ID = movnomConcepAux.id;
                                }
                                objParamAUX1.valor = quitarFormatImporte(valoresTabla.parametros[param1]);
                                objParams[objParams.length] = objParamAUX1;
                                break;
                            }
                        }
                    }
                }
                listaMovNuevosYMod[i] = movnomConcepAux;
                break;
            }
        }
    }

}

function llenarTablaMov(start, end) {
    var datos = new Array();
    var k = 0;
    for (var i = 0; i < listaMovimientosGlobales.length; i++) {
        //var objPrincipal = {};
        var objEmpleado = {};
        var objParam = new Array();


        var parametros = listaMovimientosGlobales[i].movNomConceParam;
        objEmpleado.id = listaMovimientosGlobales[i].id;
        if (empleadoAbajo) {
            var empleado = listaMovimientosGlobales[i].empleados;
            objEmpleado.nombreEmpleado = empleado.apellidoPaterno + " " + empleado.apellidoMaterno + " " + empleado.nombre;
            objEmpleado.empleado_ID = empleado.clave;
            for (k = 0; k < parametros.length; k++) {
                var obja = {};
                obja[parametros[k].paraConcepDeNom.descripcion] = importe_format(parametros[k].valor, 2, null); 
                objParam[objParam.length] = obja;
            }
            objEmpleado.parametros = objParam;
        }

        if (conceptoAbajo) {
            var conceptoNomina = listaMovimientosGlobales[i].concepNomDefi;
            objEmpleado.descripcionConcep = conceptoNomina.descripcion;
            objEmpleado.concepNomDefi_ID = conceptoNomina.clave;
            for (k = 0; k < parametros.length; k++) {
                var obje = {};
                obje.descripcion = parametros[k].paraConcepDeNom.descripcion;
                obje.valor = importe_format(parametros[k].valor, 2, null);  
                objParam[objParam.length] = obje;
            }
            objEmpleado.parametros = objParam;
        }
        // console.log(objEmpleado);


        //console.log(objParam);
        datos[i] = objEmpleado;
    }
    if (typeof llenarTablaGen === 'function') {
        if (start === 0) {
            createEditPagination(listaMovimientosGlobales.length, "MovNomConcep");
        }
        if (listaMovimientosGlobales.length <= end) {
            end = listaMovimientosGlobales.length;
        }
        if (datos.length>0) {
            llenarTablaGen("MovNomConcep", datos, start, end);
        }
    }
}

function saveMov() {
    var obj = {};

    //getvaloresMov();
    limpiarMovAntesDeSave();
    obj["SaveUpdate"] = listaMovNuevosYMod;
    if (listaMovDelete.length > 0) {
        obj["Delete"] = listaMovDelete;
    }
    var getData = "";
    var url = route + "/api/MovimientosNomina/saveMovimientosNomina";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        cancelar();
    } else {
        cancelar();
    }
}

function getPlaza() {
    var obj = {};
    obj.Empleado = empleado.id;
    obj.RazonSocial = razonSocial;
    obj.TipoNomina = document.getElementById('txtTipoNomina').value;
    obj.fechaInicial = document.getElementById('txtFechaIni').value;
    obj.fechaFinal = document.getElementById('txtFechaFin').value;
    var getData = "";
    var url = route + "/api/MovimientosNomina/getPlazasPorEmpleadosActivosIdList";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        plazaPorEmpleado = Mensaje.resultado;
    }

}

function crearcompoPlaza() {
    document.getElementById('txtPlazaEmp').style.display = "block";
    $('#txtPlazaEmp').find('option').not(':first').remove();
    for (var i = 0; i < plazaPorEmpleado.length; i++) {
        $('#txtPlazaEmp').append('<option value=' + Mensaje.resultado[i]['id'] + '>' + Mensaje.resultado[i]['referencia'] + '</option>');
    }
    document.getElementById('plaza').style.display = "";
}

function consultaMov(start, end) {
    var objcampos = getFiltrosMov();
    var obj = {};
    obj['campos'] = objcampos;
    //obj['operador'] = "=";
    obj['inicio'] = 0;
    obj['fin'] = 0;
    //console.log(obj);
    var getData = "";
    var url = route + "/api/MovimientosNomina/consultaPorFiltrosMovNomConcep";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false);
    //console.log(Mensaje);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
       
        listaMovimientosGlobales = Mensaje.resultado;
        llenarTablaMov(start, end);
        // llenarTablaMov();
    }

}

function getFiltrosMov() {
    var arreglosfiltros = new Array();
    var obj = {};
    var objfiltros = {};
    objfiltros['tipoCorrida_ID'] = parseInt(document.getElementById('editTipoCorrida').getAttribute('value'));
    obj.campo = "tipoCorrida_ID";
    obj.valor = parseInt(document.getElementById('editTipoCorrida').getAttribute('value'));
    obj.operador = "IGUAL";
    arreglosfiltros[arreglosfiltros.length] = obj;
    if (conceptoArriba) {
        obj = {};
        obj.campo = "concepNomDefi_ID";
        obj.valor = concepto.id;
        obj.operador = "IGUAL";
        arreglosfiltros[arreglosfiltros.length] = obj;
        objfiltros['concepNomDefi_ID'] = concepto.id;

    }
    obj = {};
    obj.campo = "tipoNomina_ID";
    obj.valor = parseInt(document.getElementById('editTipoNomina').getAttribute('value'));
    objfiltros['tipoNomina_ID'] = parseInt(document.getElementById('editTipoNomina').getAttribute('value'));
    obj.operador = "IGUAL";
    arreglosfiltros[arreglosfiltros.length] = obj;
    obj = {};
    obj.campo = "periodosNomina_ID";
    obj.valor = periodoNomina.id;
    obj.operador = "IGUAL";
    arreglosfiltros[arreglosfiltros.length] = obj;
    objfiltros['periodosNomina_ID'] = periodoNomina.id;

    if (empleadoArriba) {
        obj = {};
        obj.campo = "empleado_ID";
        obj.valor = empleado.id;
        obj.operador = "IGUAL";
        arreglosfiltros[arreglosfiltros.length] = obj;
        objfiltros['empleado_ID'] = empleado.id;

    }

    if (centroCostoArriba) {
        obj = {};
        obj.campo = "centroDeCosto_ID";
        obj.valor = centroCosto.id;
        obj.operador = "IGUAL";
        arreglosfiltros[arreglosfiltros.length] = obj;
        objfiltros['centroDeCosto_ID'] = centroCosto.id;

    }
    obj = {};
    obj.campo = "concepNomDefi.tipo";
    obj.valor = 0;
    obj.operador = "DIFERENTE";
    arreglosfiltros[arreglosfiltros.length] = obj;
    valoresfiltros = objfiltros;
    //console.log(objfiltros);
    return arreglosfiltros;

}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function searchMov(value) {
    var i = 0;
    for (i = 0; i < listaMovimientosGlobales.length; i++) {
        if (listaMovimientosGlobales[i].id === value) {
            //console.log(listaMovimientosGlobales[i]);
            movnomConcepAux = listaMovimientosGlobales[i];
            break;
        }
    }
    var conDetalle;
    var input;
    var movParam;
   
    if (!eliminarMov) {
        id = movnomConcepAux.id;
        construirFormaDetalle();
        if (empleadoAbajo) {
            document.getElementById('txtEmpleados2').value = movnomConcepAux.empleado_ID.toString();
            getEmpleadoID(document.getElementById('txtEmpleados2').value);
             conDetalle = document.getElementById('con3');
             input = conDetalle.querySelectorAll("input[isparam='true']");
             movParam = movnomConcepAux.movNomConceParam;
            for (var k = 0; k < input.length; k++) {

                for (var j = 0; j < movParam.length; j++) {
                    if (input[k].getAttribute('persist') === movParam[j].paraConcepDeNom.descripcion) {
                        input[k].value = movParam[j].valor;
                        break;
                    }
                }
            }
        }
        if (conceptoAbajo) {
            document.getElementById('txtConcepNomina3').value = movnomConcepAux.concepNomDefi_ID.toString();
            construirParamConcep();
             conDetalle = document.getElementById('con3');
             input = conDetalle.querySelectorAll("input[isparam='true']");
             movParam = movnomConcepAux.movNomConceParam;
            for (var l = 0; l < input.length; l++) {

                for (var h = 0; h < movParam.length; h++) {
                    if (input[l].getAttribute('persist') === movParam[h].paraConcepDeNom.descripcion) {
                        input[l].value = movParam[h].valor;
                        break;
                    }
                }
            }

        }
        if (concepto.activarPlaza) {
            document.getElementById('txtPlazaEmp').value = movnomConcepAux.plazasPorEmpleado_ID.toString();
        }
        if (centroCostoAbajo) {
            document.getElementById('txtCentroCosto2').value = movnomConcepAux.centroDeCosto_ID.toString();
        }
    } else {
        var answer = confirm("¿Quieres eliminar este movimiento?")
        if (answer) {

            for ( i = 0; i < listaMovimientosGlobales.length; i++) {
                if (listaMovimientosGlobales[i].id === movnomConcepAux.id) {
                    listaMovimientosGlobales.splice(i, 1);
                    break;
                }
            }
            for ( i = 0; i < listaMovNuevosYMod.length; i++) {
                if (listaMovNuevosYMod[i].id === movnomConcepAux.id) {
                    listaMovNuevosYMod.splice(i, 1);
                    break;
                }
            }

            if (Number.isInteger(movnomConcepAux.id)) {
                listaMovDelete[listaMovDelete.length] = movnomConcepAux.id;
            }
            eliminarMov = false;
            llenarTablaMov();
        }
        else {
            eliminarMov = false;
            //clearObjetosgen();
        }

    }
}

function editObject(value) {
    actualizaMov = true;
    searchMov(value);
}

function deleteObject(value) {
    eliminarMov = true;
    searchMov(value);

}

function limpiarMovAntesDeSave() {

    for (var i = 0; i < listaMovNuevosYMod.length; i++) {
        listaMovNuevosYMod[i].empleados = undefined;
        listaMovNuevosYMod[i].concepNomDefi = undefined;
        listaMovNuevosYMod[i].centroDeCosto = undefined;
        for (var k = 0; k < listaMovNuevosYMod[i].movNomConceParam.length; k++) {
            listaMovNuevosYMod[i].movNomConceParam[k].paraConcepDeNom = undefined;
        }
        if (!Number.isInteger(listaMovNuevosYMod[i].id)) {
            listaMovNuevosYMod[i].id = 0;
        }
    }

}

function editTable() {

    var nameTable = "MovNomConcep";
    var nameCols = crearListaColumnas();
    var activaAdd = true;
    var activaDelete = true;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function crearListaColumnas() {
    var columnasTabla = new Array();
    if (conceptoAbajo) {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("MovimientosNominaTblConcepto")(), "nombreCompo": "ConceptoMov", "editable": true, "tipoCompon": "editConsulta", "persist": "concepNomDefi_ID", "ancho": "110px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("MovimentosNominaTblConcepDes")(), "nombreCompo": "Descripcion", "editable": false, "tipoCompon": "editdesc", "persist": "descripcionConcep", "ancho": "400px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("MovimentosNominaTblValor1")(), "id": "valor1", "nombreCompo": "Valor1", "editable": false, "tipoCompon": "importe", "persist": "", "ancho": "150px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("MovimentosNominaTblValor2")(), "id": "valor2", "nombreCompo": "Valor2", "editable": false, "tipoCompon": "importe", "persist": "", "ancho": "150px" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("MovimentosNominaTblValor3")(), "id": "valor3", "nombreCompo": "Valor3", "editable": false, "tipoCompon": "importe", "persist": "", "ancho": "150px" });
    }

    if (empleadoAbajo) {
        columnasTabla.push({
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Empleados")(), "nombreCompo": "EmpleadoMov", "editable": true, "tipoCompon": "editConsulta", "persist": "empleado_ID", "ancho": "130px", "funcion": "empleadoRep"  },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")(), "nombreCompo": "Nombre", "editable": false, "tipoCompon": "editdesc", "persist": "nombreEmpleado", "ancho": "400px" });
    }

    if (centroCostoAbajo) {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("CentroDeCosto")(), "nombreCompo": "CentroDeCosto", "editable": true, "tipoCompon": "editConsulta", "persist": "centroCosto_ID", "ancho": "10px", "funcion": "conceptoRep"  },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcion")(), "nombreCompo": "Descripcion", "editable": false, "tipoCompon": "", "persist": "descripcioncen", "ancho": "30px" });
    }
    if (columnasParam.length > 0) {
        for (var i = 0; i < columnasParam.length; i++) {
            columnasTabla.push(columnasParam[i]);
        }

    }
    return columnasTabla;
}

function setEditTipoCorrida() {

    //Parameters
    nameCmp = "EditTipoCorrida";
    table = "TipoCorrida";
    nameCols = idiomaSelecionado.messageFormatter("TipoCorridaclave")() + "," + idiomaSelecionado.messageFormatter("TipoCorridadescripcion")();
    campos = "clave,descripcion";//Quit ID;
    camposObtener = "clave,descripcion";
    //var subEntities = "periodicidad"; //Unnecesary
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Tipo corrida";
    var tamañoSel = "size-4";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);


}

function setEditTipoCorridaShow(value) {
    if (value !== null) {
        //
    }
}

function setEditConcepNomina() {

    //Parameters
    nameCmp = "EditConcepNomina";
    table = "ConceptoPorTipoCorrida";
    nameCols = idiomaSelecionadoCol.messageFormatter("ConceptosNominaClave")() + "," + idiomaSelecionadoCol.messageFormatter("ConceptosNominaDescripcion")() +
        "," + idiomaSelecionadoCol.messageFormatter("ConceptosNominaDescripcionAbre")();
    campos = "concepNomDefi.clave,concepNomDefi.descripcion,concepNomDefi.descripcionAbreviada";//Quit ID;
    camposObtener = "concepNomDefi.id,concepNomDefi.clave,concepNomDefi.descripcion";
    var subEntities = "concepNomDefi,tipoCorrida"; //Unnecesary
    camposMostrar = ["concepNomDefi.clave", "concepNomDefi.descripcion"];
    var idTipocorrida = document.getElementById('editTipoCorrida').getAttribute('value');
    var preFilters = { "tipoCorrida.id": idTipocorrida, "concepNomDefi.activado#=": true, "concepNomDefi.tipo#!=": 0 };//Unnecesary
    var tituloSel = "Concepto nomina";
    var tamañoSel = "size-4";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);


}

function setEditConcepNominaShow(value) {
    if (value !== null) {
        concepto = concepNomiDefiPorClave(value[0].ConcepNomDefiid);
        construirParamConcep();
        consultaMov(start, end);
    }
}

function setEditTipoNomina() {
    nameCmp = "EditTipoNomina";
    table = "TipoNomina";
    nameCols = idiomaSelecionado.messageFormatter("TipoNominaclave")() + "," + idiomaSelecionado.messageFormatter("TipoNominadescripcion")() + "," + idiomaSelecionado.messageFormatter("Periodicidaddescripcion")();
    campos = "clave,descripcion,periodicidad.descripcion";//Quit ID;
    camposObtener = "clave,descripcion,periodicidad.descripcion";
    var subEntities = "periodicidad"; //Unnecesary
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Tipo nomina";
    var tamañoSel = "size-4";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditTipoNominaShow(value) {
    if (value !== null) {
        var obj = value[0];
        claveTipoNomina = obj.Clave;
        //document.getElementById('txtTipoNominaDetalle').value = obj.Clave + "-" + obj.Descripcion;
        //valorSeleccionado();
    }
}

function setEditPeriodoNomina() {
    //Parameters
    nameCmp = "EditPeriodoNomina";
    table = "PeriodosNomina";
    nameCols = idiomaSelecionado.messageFormatter("PeriodosNominaClave")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaDescripcion")() + "," +
        idiomaSelecionado.messageFormatter("PeriodosNominaFechaInicial")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaFechaFinal")() + "," +
        idiomaSelecionado.messageFormatter("PeriodosNominaFechaCierre")() + "," + idiomaSelecionado.messageFormatter("PeriodosNominaAnio")();
   // nameCols = "Clave,Descripción,Fecha inicial, Fecha final, Fecha cierre";
    campos = "clave,descripcion,Date:fechaInicial,Date:fechaFinal,Date:fechaCierre,año";
    camposObtener = "clave,descripcion,año,fechaInicial,fechaFinal,status";
    var subEntities = "tipoNomina,tipoCorrida";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Periodos Nomina";
    var tamañoSel = "size-8";

    var id = parseInt(document.getElementById('editTipoNomina').getAttribute("value"));
    var idcorrida = parseInt(document.getElementById('editTipoCorrida').getAttribute("value"));
    var preFilters = { "tipoNomina.id": id, "año": parametrosGlobales.ejercicioActual, "tipoCorrida.id": idcorrida, "status": true };
   
    //var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de plaza", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditPeriodoNominaShow(value) {
    if (value !== null) {
        var obj = value[0];
        fechaInicial = formatDateddmmyyy(new Date(obj.FechaInicial));
        fechaFinal = formatDateddmmyyy(new Date(obj.FechaFinal));
        document.getElementById('txtFechaIni').value = formatDatemmddyyy(new Date(obj.FechaInicial));
        document.getElementById('txtFechaFin').value = formatDatemmddyyy(new Date(obj.FechaFinal));
        statusPeriodo = obj.Status;
        
            setFechasPer(obj.Id);


    }
}

function setEditEmpleado() {

    //Parameters
    nameCmp = "EditEmpleado";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionadoCol.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombreAbre")();
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";//Quit ID;
    camposObtener = "plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";
    //var subEntities = "razonesSociales"; //Unnecesary
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];

    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    
    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": razon.id
        /* "id#IN@": "(Select MAX(m.id) from PlazasPorEmpleadosMov m  WHERE m.plazasPorEmpleado.referencia = o.plazasPorEmpleado.referencia)",
         "plazasPorEmpleado.ingresosBajas.fechaBaja#>=": getFechaSistema(),*/
    };

    //Fechas en base al periodo
    if (document.getElementById("editPeriodoNomina").getAttribute("value")) {

        //var valDateFromFilter = document.getElementById("txtDeFecha").value;
        var fechaDeFilter = new Date(fechaInicial);
        var fechaDeFilter2 = new Date(fechaDeFilter.getFullYear(), fechaDeFilter.getMonth(), fechaDeFilter.getDate(), 0, 0, 0, 0);

        //var valDateToFilter = document.getElementById("txtDeFecha").value;
        var fechaAFilter = new Date(fechaFinal);
        var fechaAFilter2 = new Date(fechaAFilter.getFullYear(), fechaAFilter.getMonth(), fechaAFilter.getDate(), 0, 0, 0, 0);



        preFilters["@BETWEEN1"] = [
            "(( o.fechaInicial <= :PB1) OR ( o.fechaInicial BETWEEN :PB1 AND :PB2 ))",
            "PB1", fechaDeFilter, "PB2", fechaAFilter];

        preFilters["@BETWEEN2"] = [
            "(( o.plazasPorEmpleado.fechaFinal >= :PB3  )  OR (o.plazasPorEmpleado.fechaFinal BETWEEN :PB4 AND :PB3))",
            "PB3", fechaAFilter, "PB4", fechaDeFilter];

    }

    //Centro de costo
    if (document.getElementById("editCentroCosto").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroCosto").getAttribute("value");
    }

    //Tipo de nomina
    if (document.getElementById("editTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editTipoNomina").getAttribute("value");
    }
    //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecialMovimientosNomina";
    var valoreswhereEsp;
    if (claveTipoNomina !== "") {
        var camposWhereEsp = ["tipoNomina.clave"];
        valoreswhereEsp = [claveTipoNomina, razonSocialActual.clave, null, new Date(fechaInicial), new Date(fechaFinal)];
       // preFilters["tipoNomina.clave"] = claveTipoNomina;
    } else {
        //var camposWhereEsp = "";
         valoreswhereEsp = [razonSocialActual.clave, null, new Date(), new Date()];
    }
    //var filtersSearch = [];//Unnecesary
    //filtersSearch[0] = { "etiqueta": "Clave del empleado", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre del empleado", "tipo": "string", "campo": "nombre", "medida": "m" };
    var optionals = { "queryEspecial": queryEspecial, "camposWhereEsp": camposWhereEsp, "valoreswhereEsp": valoreswhereEsp };
    var tituloSel = "Empleados";
    var tamañoSel = "size-4";
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
        if (conceptoAbajo) {

            consultaMov(start, end);
        }
        //var obj = value[0]
        //valorselEmpleado = value[0];
        //document.getElementById('txtEmpleado3').value = obj[1].apellidoPaterno + " " + obj[1].apellidoMaterno + " " + obj[1].nombre;
        //var turnos = getTurnosPorID(obj[0].turnos_ID);
        //if (turnos === null) {
        //    MAXDOBLEDIAX = MAXDOBLEDIAORIGINAL;
        //} else if (turnos.turnosHorariosFijos !== null && turnos.turnosHorariosFijos.length > 0) {
        //    MAXDOBLEDIAX = MAXDOBLEDIAORIGINAL;
        //} else {
        //    if (turnos.turnosHorariosFijos == null) {
        //        //pendiente
        //    } else {
        //        var horario = getHorarioPorID(turnos.turnosHorariosFijos[0].Horario_ID);
        //        MAXDOBLEDIAX = horario.topeDiarioHrsExtras;
        //    }
        //}
        //valorSeleccionado();
    }
}

function setEditEmpleadoMovDetalle() {

    //Parameters
    nameCmp = "EditEmpleadoMovDetalle";
    table = "PlazasPorEmpleadosMov";
    nameCols = idiomaSelecionadoCol.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombreAbre")();
    campos = "plazasPorEmpleado.empleados.clave,plazasPorEmpleado.empleados.nombre,plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombreAbreviado";//Quit ID;
    camposObtener = "plazasPorEmpleado.empleados.apellidoPaterno,plazasPorEmpleado.empleados.apellidoMaterno,plazasPorEmpleado.empleados.nombre";
    //var subEntities = "razonesSociales"; //Unnecesary
    camposMostrar = ["plazasPorEmpleado.empleados.clave", "plazasPorEmpleado.empleados.nombre"];
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    var preFilters = {
        "plazasPorEmpleado.razonesSociales.id": razon.id
        /* "id#IN@": "(Select MAX(m.id) from PlazasPorEmpleadosMov m  WHERE m.plazasPorEmpleado.referencia = o.plazasPorEmpleado.referencia)",
         "plazasPorEmpleado.ingresosBajas.fechaBaja#>=": getFechaSistema(),*/
    };

    //Fechas en base al periodo
    if (document.getElementById("editPeriodoNomina").getAttribute("value")) {

        //var valDateFromFilter = document.getElementById("txtDeFecha").value;
        var fechaDeFilter = new Date(fechaInicial);
        var fechaDeFilter2 = new Date(fechaDeFilter.getFullYear(), fechaDeFilter.getMonth(), fechaDeFilter.getDate(), 0, 0, 0, 0);

        //var valDateToFilter = document.getElementById("txtDeFecha").value;
        var fechaAFilter = new Date(fechaFinal);
        var fechaAFilter2 = new Date(fechaAFilter.getFullYear(), fechaAFilter.getMonth(), fechaAFilter.getDate(), 0, 0, 0, 0);



        preFilters["@BETWEEN1"] = [
            "(( o.fechaInicial <= :PB1) OR ( o.fechaInicial BETWEEN :PB1 AND :PB2 ))",
            "PB1", fechaDeFilter, "PB2", fechaAFilter];

        preFilters["@BETWEEN2"] = [
            "(( o.plazasPorEmpleado.fechaFinal >= :PB3  )  OR (o.plazasPorEmpleado.fechaFinal BETWEEN :PB4 AND :PB3))",
            "PB3", fechaAFilter, "PB4", fechaDeFilter];

    }

    //Centro de costo
    if (document.getElementById("editCentroCosto").getAttribute("value")) {
        preFilters["centroDeCosto.id"] = document.getElementById("editCentroCosto").getAttribute("value");
    }

    //Tipo de nomina
    if (document.getElementById("editTipoNomina").getAttribute("value")) {
        preFilters["tipoNomina.id"] = document.getElementById("editTipoNomina").getAttribute("value");
    }

    //todo esto es para el query especiales
    var queryEspecial = "QueryEmpleadoEspecialMovimientosNomina";
    var valoreswhereEsp;
    if (claveTipoNomina !== "") {
        var camposWhereEsp = ["tipoNomina.clave"];
        valoreswhereEsp = [claveTipoNomina, razonSocialActual.clave, null, new Date(fechaInicial), new Date(fechaFinal)];
       // preFilters["tipoNomina.clave"] = claveTipoNomina;
    } else {
        //var camposWhereEsp = "";
         valoreswhereEsp = [razonSocialActual.clave, null, new Date(), new Date()];
    }
    //var filtersSearch = [];//Unnecesary
    //filtersSearch[0] = { "etiqueta": "Clave del empleado", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre del empleado", "tipo": "string", "campo": "nombre", "medida": "m" };
    var optionals = { "queryEspecial": queryEspecial, "camposWhereEsp": camposWhereEsp, "valoreswhereEsp": valoreswhereEsp }
    var tituloSel = "Empleado";
    var tamañoSel = "size-4";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
         typeof optionals === 'undefined' ? "" : optionals);
}

function setEditEmpleadoMovDetalleShow(value) {
    if (value !== null) {


        var obj = value[0];
        plazaPorEmpleadoMov = obj[0];
        empleado = obj[1];
        idempleado = empleado.id;
        nombreDatoSecu = "nombreEmpleado";
        datoSecundario = empleado.apellidoPaterno + " " + empleado.apellidoMaterno + " " + empleado.nombre;
        if (classNameBlur) {
         
            var tdClave = renglon.querySelector("td[persist=empleado_ID]");
            var txtclave = tdClave.firstElementChild.firstElementChild;
            var obj2 = {};
            obj2[0] = txtclave.value;
            obj2[1] = renglon;
            obj2[2] = true;
            var par = empleadoRep(obj2);
            if (par || par === undefined || par === null) {
                tdClave.appendChild(document.createTextNode(txtclave.value));
                txtclave.value = "";
                tdClave.firstElementChild.style.display = "none";
                var tddescripcion = renglon.querySelector("td[persist=nombreEmpleado]");
                $(tddescripcion).contents().filter(function () {
                    return this.nodeType === 3; //Node.TEXT_NODE
                }).remove();
                tddescripcion.appendChild(document.createTextNode(datoSecundario));


                if (prevalidacionAddRow(renglon)) {
                    var nametable = renglon.parentNode.parentNode.id;
                    var nameBody = renglon.parentNode.id;
                    var rowTr = renglon;
                    var objt = [nametable, nameBody, rowTr];
                    tableAdd(objt);
                }
                $(tdClave).nextAll('td[contenteditable=true]:first').focus();
            }
        }

    }
}

function setEditConceptoMovDetalle() {

    //Parameters
    nameCmp = "EditConceptoMovDetalle";
    table = "ConceptoPorTipoCorrida";
    nameCols = idiomaSelecionadoCol.messageFormatter("ConceptosNominaClave")() + "," + idiomaSelecionadoCol.messageFormatter("ConceptosNominaDescripcion")() +
        "," + idiomaSelecionadoCol.messageFormatter("ConceptosNominaDescripcionAbre")();
    campos = "concepNomDefi.clave,concepNomDefi.descripcion,concepNomDefi.descripcionAbreviada";//Quit ID;
    camposObtener = "concepNomDefi.id,concepNomDefi.clave,concepNomDefi.descripcion";
    var subEntities = "concepNomDefi,tipoCorrida"; //Unnecesary
    camposMostrar = ["concepNomDefi.clave", "concepNomDefi.descripcion"];
    var idTipocorrida = document.getElementById('editTipoCorrida').getAttribute('value');
    var preFilters = { "tipoCorrida.id": idTipocorrida, "concepNomDefi.activado#=": true, "concepNomDefi.tipo#!=": 0 };//Unnecesary
    var tituloSel = "Concepto de nomina";
    var tamañoSel = "size-4";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);


}

function setEditConceptoMovDetalleShow(value) {
    if (value !== null) {
        //var obj = value[0];
        //empleado = obj[1];
        idempleado = value[0].ConcepNomDefiid;
        nombreDatoSecu = "descripcionConcep";
        datoSecundario = value[0].ConcepNomDefidescripcion;
        concepto = concepNomiDefiPorClave(value[0].ConcepNomDefiid);
        construirParamConcep();
        var contTable = document.getElementById("contTable");
        var i = 0;
        // console.log(renglon.childNodes);
        var columnas = renglon.childNodes;
        if (parametros.length === 1) {
            for ( i = 0; i < columnas.length; i++) {
                if (columnas[i].id === "valor1") {
                    columnas[i].setAttribute("contenteditable", true);
                    columnas[i].setAttribute("persist", parametros[0].descripcion);
                    columnas[i].setAttribute("isParam", true);
                    break;
                }
            }
        } else if (parametros.length === 2) {
            for ( i = 0; i < columnas.length; i++) {
                if (columnas[i].id === "valor1") {
                    columnas[i].setAttribute("contenteditable", true);
                    columnas[i].setAttribute("persist", parametros[0].descripcion);
                    columnas[i].setAttribute("isParam", true);

                } else if (columnas[i].id === "valor2") {
                    columnas[i].setAttribute("contenteditable", true);
                    columnas[i].setAttribute("persist", parametros[1].descripcion);
                    columnas[i].setAttribute("isParam", true);
                }
            }
        } else if (parametros.length === 3) {
            for ( i = 0; i < columnas.length; i++) {
                if (columnas[i].id === "valor1") {
                    columnas[i].setAttribute("contenteditable", true);
                    columnas[i].setAttribute("persist", parametros[0].descripcion);
                    columnas[i].setAttribute("isParam", true);
                } else if (columnas[i].id === "valor2") {
                    columnas[i].setAttribute("contenteditable", true);
                    columnas[i].setAttribute("persist", parametros[1].descripcion);
                    columnas[i].setAttribute("isParam", true);
                } else if (columnas[i].id === "valor3") {
                    columnas[i].setAttribute("contenteditable", true);
                    columnas[i].setAttribute("persist", parametros[2].descripcion);
                    columnas[i].setAttribute("isParam", true);
                }
            }
        } else if (parametros.length === 0) {
            for ( i = 0; i < columnas.length; i++) {
                if (columnas[i].id === "valor1") {
                    columnas[i].setAttribute("contenteditable", false);
                    $(columnas[i]).contents().filter(function () {
                        return this.nodeType === 3; //Node.TEXT_NODE
                    }).remove();
                    columnas[i].appendChild(document.createTextNode(""));

                } else if (columnas[i].id === "valor2") {
                    columnas[i].setAttribute("contenteditable", false);
                    $(columnas[i]).contents().filter(function () {
                        return this.nodeType === 3; //Node.TEXT_NODE
                    }).remove();
                    columnas[i].appendChild(document.createTextNode(""));

                } else if (columnas[i].id === "valor3") {
                    columnas[i].setAttribute("contenteditable", false);
                    $(columnas[i]).contents().filter(function () {
                        return this.nodeType === 3; //Node.TEXT_NODE
                    }).remove();
                    columnas[i].appendChild(document.createTextNode(""));
                }
            }
        }
        if (classNameBlur) {
            var tdClave = renglon.querySelector("td[persist=concepNomDefi_ID]");
            var txtclave = tdClave.firstElementChild.firstElementChild;
            var obj2 = {};
            obj2[0] = txtclave.value;
            obj2[1] = renglon;
            obj2[2] = true;
            var par = conceptoRep(obj2);
            if (par || par === undefined || par === null) {
                tdClave.appendChild(document.createTextNode(txtclave.value));
                txtclave.value = "";
                tdClave.firstElementChild.style.display = "none";
                var tddescripcion = renglon.querySelector("td[persist=descripcionConcep]");
                $(tddescripcion).contents().filter(function () {
                    return this.nodeType === 3; //Node.TEXT_NODE
                }).remove();
                tddescripcion.appendChild(document.createTextNode(datoSecundario));


                if (prevalidacionAddRow(renglon)) {
                    var nametable = renglon.parentNode.parentNode.id;
                    var nameBody = renglon.parentNode.id;
                    var rowTr = renglon;
                    var obj = [nametable, nameBody, rowTr];
                    tableAdd(obj);
                }
                $(tdClave).nextAll('td[contenteditable=true]:first').focus();
                renglon = undefined;
                classNameBlur = false;
            } 
        }
        //var div = renglon.firstElementChild;
        //var inputkey = div.firstElementChild;
        //$(inputkey).focus();
        
       
    }
}


function prevalidacionAddRow(tr) {
    var tds = tr.cells;
    var exito = true
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

function tableAdd(valores) {
    // console.log(valores);
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
        var edit = $clone[0].querySelector(".edit");
        if (edit) {
            edit.removeAttribute("value");
            edit.querySelector(".editKey").value = "";

        }
        $('#' + valores[1]).append($clone);
    }

}

function construirObj(tr) {
    var obj = {};
    var objparam = {};

    for (var i = 0; i < tr.cells.length; i++) {

        if (tr.cells[i].getAttribute('persist') !== "eliminar" && tr.cells[i].getAttribute("contenteditable") === "true") {
            if (tr.cells[i].getAttribute('tipocompon') === "editConsulta") {
                obj[tr.cells[i].getAttribute('persist')] = parseInt(tr.cells[i].firstElementChild.getAttribute('value'));
            } else {
                if (tr.cells[i].getAttribute('isparam') === "true") {

                    objparam[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
                } else {
                    obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
                }
            }
            // console.log(tr.cells[i].getAttribute('persist'), "-", tr.cells[i].innerText);
        }
    }
    if (typeof objparam !== 'undefined') {
        obj["parametros"] = objparam;
    }
    if (tr.id === "") {
        var rString = "id" + randomString(2, '0123456789');
        obj['id'] = rString;
        tr.id = obj.id;
        agregarMov(obj);
    } else {
        obj['id'] = tr.id;
        actualizarMov(obj);
    }


    //obj = Object.assign(obj, valoresfiltros);
    //if (parseInt(obj.id)) {
    //    valoresEditados[valoresEditados.length] = obj;
    //} else {
    //    valoresNuevos[valoresNuevos.length] = obj;
    //}
    // console.log(obj);

}

function tableRemove(registro) {

    var id = registro.id;
    var i;
    if (parseInt(id)) {
        for (i = 0; i < listaMovimientosGlobales.length; i++) {
            if (listaMovimientosGlobales[i].id === parseInt(id)) {
                listaMovimientosGlobales.splice(i, 1);
                break;
            }
        }
        for (i = 0; i < listaMovNuevosYMod.length; i++) {
            if (listaMovNuevosYMod[i].id === parseInt(id)) {
                listaMovNuevosYMod.splice(i, 1);
                break;
            }
        }
        listaMovDelete[listaMovDelete.length] = parseInt(id);

    } else {
        for (i = 0; i < listaMovNuevosYMod.length; i++) {
            if (listaMovNuevosYMod[i].id === id) {
                listaMovNuevosYMod.splice(i, 1);
                break;
            }
        }
        for (i = 0; i < listaMovimientosGlobales.length; i++) {
            if (listaMovimientosGlobales[i].id === id) {
                listaMovimientosGlobales.splice(i, 1);
                break;
            }
        }
    }
    llenarTablaMov(start, end);

    //  alert("eliminado" + ".- " + name.id);
}

function cambiarPagina(valores) {
    //alert(valores);
    var tbl = valores['origen'];
    end = rowsByPage;
    start = valores['fromPage'];
    if (listaMovimientosGlobales.length > rowsByPage) {
        var res = (rowsByPage + start) - listaMovimientosGlobales.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = listaMovimientosGlobales.length;
    }
    llenarTablaMov(start, end);
}

function empleadoRep(valores) {
    //console.log(valores);
    var exito = true;
    for (var i = 0; i < listaMovimientosGlobales.length; i++) {
        if (listaMovimientosGlobales[i].empleados.clave === valores[0]) {
            exito = false;
            alert("Ya existe un empleado con esa clave");
        }
    }

    return exito;
}

function conceptoRep(valores) {
    var exito = true;
    for (var i = 0; i < listaMovimientosGlobales.length; i++) {
        if (listaMovimientosGlobales[i].concepNomDefi.clave === valores[0]) {
            exito = false;
            alert("Ya existe un concepto con esa clave");
        }
    }

    return exito;
}