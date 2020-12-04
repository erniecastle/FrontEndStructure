var route = "";
var deleteDetails = [];
var datosFields = {};
var ArchivoVal;
var listaTeclas = new Array();
var listaMetodos = new Array();
var listaEventos = new Array();
var expReg = {
    "Solo numeros enteros": "[0-9]+", "Solo Letras": "[A-Za-z]+", "Solo mayusculas": "[A-Z]+", "Solo minusculas": "[a-z]+",
    "Numeros decimales enteros": "^[0-9]{1,5}(\.[0-9]{0,2})?$", "Miles con decimales": "^\d{1,3}(,\d{3})*(\.\d+)?$",
    "Telefono movil 10 digitos": "[0-9]{10}", "Valida email": "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$",
    "Número de teléfono internacional": "^\(\+\d{2,3}\)\d{10}$", "Validar una página web": "^http[s]?:\/\/[\w]+([\.]+[\w]+)+$", "Numeros positivos y negativos enteros": "^-?[0-9]+",
    "Numeros positivos y negativos decimales": "^-?[0-9]+(\.\d{1,2})?$"
}
var nombreTeclas = { "9": "Tab", "13": "enter" };
jQuery(document).ready(function () {

    //alert(document.cookie.indexOf('eochair'));
    //call origen datos
    clearProperties();
    var data = getOrigenesDatosTabla();
    addOrigenesTabla(data);

    var dataDet = getOrigenesDatos();
    addOrigenesTablaCapturaDetalles(dataDet);


    $(document).keydown(function (event) {
        if (event.keyCode === 119) {
            toSaveFont();
        }
    });

});

function addListenerEnter() {
    var input = document.getElementById("txtTexto");
    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            var type = document.getElementById('tipoCaptura').value;
            if (type === "2") {
                addValue(false);
            } else if (type === "3") {
                addValue(true);
            }
        }
    });
}

function addListenersFont() {

    var toggler = document.getElementsByClassName("box");
    var i;

    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            $('li > ul > li .box').removeClass("check-box");
            $('li > ul > li .nested').removeClass("active");
            this.classList.toggle("check-box");
            this.parentElement.querySelector(".nested").classList.toggle("active");

            if (this.classList.contains("check-box")) {
                clearProperties()
                setPropertie(this.getAttribute('value'));
            } else {
                clearProperties();
            }
        });
    }

    var toggler = document.getElementsByClassName("boxTable");
    var i;

    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("check-boxTable");
        });
    }

}

function setPropertie(data) {
    var getProperties = JSON.parse(data);
    document.getElementById("campo").value = getProperties.campo;
    if (getProperties.estado === true) {
        document.getElementById('estado').value = 'true';
    } else {
        document.getElementById('estado').value = 'false';
    }
    if (getProperties.llave === true) {
        document.getElementById("llave").checked = true;
    } else {
        document.getElementById('llave').checked = false;
    }
    if (getProperties.requerido === true) {
        document.getElementById("requerido").checked = true;
    } else {
        document.getElementById('requerido').checked = false;
    }
    if (getProperties.activarGlobal === true) {
        document.getElementById("chkGlobal").checked = true;
    } else {
        document.getElementById('chkGlobal').checked = false;
    }
    if (getProperties.activarCaptura === true) {
        document.getElementById("chkCaptura").checked = true;
    } else {
        document.getElementById('chkCaptura').checked = false;
    }
    if (getProperties.llavePrincipal === true) {
        document.getElementById("llave").checked = true;
    } else {
        document.getElementById('llave').checked = false;
    }
    if (getProperties.isPassword === true) {
        document.getElementById('ispassword').style.display = "block";
        document.getElementById("chkpassword").checked = true;
    } else {
        document.getElementById('ispassword').style.display = "none";
        document.getElementById("chkpassword").checked = false;
    }
    document.getElementById("idEtiqueta").value = getProperties.idEtiqueta;
    var tipoDato = document.getElementById('tipoDeDato');
    if (getProperties.referencia) {
        tipoDato.value = "0";
    } else {
        tipoDato.value = getProperties.tipoDeDato;
    }
    changeDataType(tipoDato.value);
    document.getElementById('compAncho').value = getProperties.compAncho;
    if (getProperties.configuracionTipoCaptura) {
        var infoCnfCap = JSON.parse(getProperties.configuracionTipoCaptura);
        var type = document.getElementById('tipoCaptura').value = infoCnfCap.tipoCaptura;
        createType(type);
        if (type === "1") {
            document.getElementById("txtLibre").value = infoCnfCap.maxcar;
            document.getElementById("txtRegular").value = infoCnfCap.expresion;
        }
        else if (type === "2") {
            var lista = infoCnfCap.lista;
            var value = new Object();
            lista.forEach(function (item) {
                value.texto = item;
                addValue(false, value);
            });
        } else if (type === "3") {
            var lista = infoCnfCap.equivalencias;
            for (var key in lista) {
                var value = new Object();
                value.texto = lista[key];
                value.valor = key;
                addValue(true, value);
            }
        }
        else if (type === "4") {
            var origenes = infoCnfCap.origenes;
            var fontTipCap = document.getElementById("cbxOrigenDatosTipoCaptura").value = origenes.origen;
            addCamposByFuente(fontTipCap);
            if (origenes.campovalor1) {
                addValueOrigen(origenes.campovalor1);
            }
            if (origenes.campovalor2) {
                addValueOrigen(origenes.campovalor2);
            }
            if (origenes.camposAdicionales) {
                var valuesAdic = origenes.camposAdicionales;
                var arrayLength = origenes.camposAdicionales.length;
                for (var i = 0; i < arrayLength; i++) {
                    addValueOrigenAdic(valuesAdic[i]);
                }
            }
        }
        if (infoCnfCap.eventos) {
            var datos = infoCnfCap.eventos;
            for (var i = 0; i < datos.length; i++) {
                //for (var j = 0; j < datos[i].teclas.length; j++) {
                //    addTeclas(datos[i].teclas[j]);
                //}
                addValueEvento(datos[i]);
            }
        }
    } else {
        // $("#tipoCaptura").val("");
        //$('#adapterType').empty();
        // $('#adapterType').attr('style', '');
    }
    document.getElementById('contEventos').style.display = "block";
}

function changeProperties() {
    var properties = new Object();
    properties.campo = document.getElementById("campo").value.toString();
    properties.estado = document.getElementById('estado').value === 'true' ? 'true' : 'false';
    properties.llave = document.getElementById('llave').checked === true ? true : false;
    properties.requerido = document.getElementById('requerido').checked === true ? true : false;
    properties.idEtiqueta = document.getElementById("idEtiqueta").value.toString();
    properties.tipoDeDato = document.getElementById("tipoDeDato").value.toString();
    properties.compAncho = document.getElementById("compAncho").value.toString();
    properties.configuracionTipoCaptura = document.getElementById("tipoCaptura").value.toString();
    $('#myTree li > ul > li .check-box').attr("value", JSON.stringify(properties));
}


function clearProperties() {
    document.getElementById("campo").value = "";
    document.getElementById('estado').value = 'null';
    document.getElementById('llave').checked = false;
    document.getElementById('requerido').checked = false;
    document.getElementById("idEtiqueta").value = "";
    document.getElementById('tipoDeDato').value = "";
    document.getElementById('compAncho').value = "";
    document.getElementById('ispassword').style.display = "none";
    document.getElementById("chkpassword").checked = false;
    $('#adapterType').empty();
    $('#adapterType').attr('style', '');
    $("#tipoCaptura").val("");
    document.getElementById('chkGlobal').checked = false;
    document.getElementById('chkCaptura').checked = false;
    datosFields = {};
    listaEventos = new Array();
    if (document.getElementById('listEventos')) {
        $('#valuerEventos').empty();
        document.getElementById('contEventosFull').style.display="none";
    }
}

function validateData() {
    var go = true;
    var getCheckFields = $('#myTree li > span.check-box');
    if (getCheckFields.length > 0) {
        if ($("#tipoDeDato").val() === "") {
            go = false;
            alert("Seleccione un tipo de dato");
            $("#cbxOrigenDatosTipoCaptura").focus();
        }
        if ($("#cbxOrigenDatosTipoCaptura")) {
            if ($("#cbxOrigenDatosTipoCaptura").val() === "") {
                go = false;
                alert("Seleccione un origen de datos");
                $("#cbxOrigenDatosTipoCaptura").focus();
            }
        }
        if (document.getElementById('valuer')) {
            if ($('ul#valuer li').length < 1) {
                go = false;
                alert("Debes seleccionar al menos un campo para el origen de datos");
                $("#cbxValor").focus();
            }
        }
    }
    return go;
}

function cargarArchivoVali(fuente) {
    var url = route + "/Resources/Validaciones.json";
    var Mensaje = new Object();
    Mensaje.error = "";
    Mensaje.noError = "";
    Mensaje.resultado = Common.sendLocalFileRequestJson('GET', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        ArchivoVal = Mensaje.resultado;
    }
    if (ArchivoVal[fuente]) {
        var val = ArchivoVal[fuente];
        var select = document.getElementById('selMetodos');
        $('#selMetodos option:not(:first)').remove();
        // document.getElementById('descripcion').innerHTML = "";
        document.getElementById('txtMetodo').value = "";

        for (var item in val["Metodos"]) {

            var option = document.createElement('option');
            option.value = item;
            option.innerText = item;

            select.add(option);
        }
    } else {

        $('#selMetodos option:not(:first)').remove();
        //document.getElementById('descripcion').innerHTML = "";
        document.getElementById('txtMetodo').value = "";
        //select.find('option').not(':first').remove;
    }
}

function crearStringMetodo(valor) {
    var txtMetodo = document.getElementById('txtMetodo');
    var span = document.getElementById('myPopup');
    var datos = ArchivoVal[document.getElementById('cbxOrigenDatosTabla').value]['Metodos'][valor];
    if (datos["parametros"]) {
        var cadena = valor + "(";
        for (var i = 0; i < datos["parametros"].length; i++) {
            if (i == 0) {
                cadena = cadena + datos["parametros"][i];
            } else {
                cadena = cadena + "," + datos["parametros"][i];
            }
        }
        cadena = cadena + ")";
        txtMetodo.value = cadena;
        if (datos["descripcion"]) {
            span.innerHTML = datos["descripcion"];
        } else {
            span.innerHTML = "";
        }
    } else {
        txtMetodo.value = valor + "()";
        if (datos["descripcion"]) {
            span.innerHTML = datos["descripcion"];
        } else {
            span.innerHTML = "";
        }

    }

}

function setFuentes(fuente) {
    //Here will be the code inside the setter
    clearObjetos();
    var builderTree = getDatosTabla(fuente);
    buildTreeByFuente(builderTree);
    cargarArchivoVali(fuente);
    var dataDet = getOrigenesDatos();
    addOrigenesTablaCapturaDetalles(dataDet);
    getCampoOrigen(fuente);
    getDetallesOrigen(fuente);
    $("#tipoCaptura").val("");
    $('#adapterType').empty();
    $('#adapterType').attr('style', '');
}


function addCamposByFuente(fuente) {
    var data = getCampoOrigen(fuente, true);
    var key = "";
    var count = 0;
    $('#cbxValor').children().remove();
    $('#cbxValor2').children().remove();
    if (data !== undefined) {
        for (var i = 0; i < data.length; i++) {
            var getJson = JSON.stringify(data[i]);
            var getDataJson = JSON.parse(getJson);
            count++;
            if (data[i].tipoDeDato === 0) {//Is Table
                var getMiniJsonByData = JSON.parse(data[i].configuracionTipoCaptura);
                if (getMiniJsonByData.origenes) {
                    if (getMiniJsonByData.origenes.camposAdicionales) {
                        var adic = {
                            id: getDataJson.id, nombre: getDataJson.campo,
                            "nombreTabla": getMiniJsonByData.origenes.origen,
                            "camposAdicionales": getMiniJsonByData.origenes.camposAdicionales
                        };
                        datosFields[getDataJson.campo] = adic;
                        $('#cbxValor2').append('<option fieldId="' + getDataJson.id + '" value=' + getDataJson.campo + '>' + (count) + ".- " + getDataJson.campo + '</option>');
                    }
                }
            } else {
                datosFields[getDataJson.campo] = { id: getDataJson.id, nombre: getDataJson.campo };
                $('#cbxValor').append('<option tipoDato="' + getDataJson.tipoDeDato + '" value=' + getDataJson.campo + '>' + (count) + ".- " + getDataJson.campo + '</option>');
                $('#cbxValor2').append('<option fieldId="' + getDataJson.id + '" value=' + getDataJson.campo + '>' + (count) + ".- " + getDataJson.campo + '</option>');
            }
            //$('#cbxValor2').append('<option fieldId="' + getDataJson.id + '" value=' + getDataJson.campo + '>' + (count) + ".- " + getDataJson.campo + '</option>');
        }
        $('#cbxValor').attr("campollave", key.toString());
        $('#cbxValor2').attr("campollave", key.toString());
    }
}

function buildTreeByFuente(data) {
    var getOrigenFont = document.getElementById("cbxOrigenDatosTabla");
    var valueFont = getOrigenFont.options[getOrigenFont.selectedIndex].value;
    var theTree = document.getElementById("myTree");
    clearDiv(theTree.id);
    var nameFont = document.createElement('li');
    var spanName = document.createElement('span');
    spanName.className = "boxTable check-boxTable";
    spanName.innerHTML = valueFont;
    nameFont.appendChild(spanName);
    var ulNameFont = document.createElement("ul");
    ulNameFont.className = "nested active";
    nameFont.appendChild(ulNameFont);

    for (i = 0; i < data.length; i++) {
        var getJson = JSON.stringify(data[i]);
        var getDataJson = JSON.parse(getJson);
        //if (getDataJson.llavePrincipal !== true) {
        var nameField = document.createElement('li');
        var img = document.createElement("img");
        img.id = "indicator";
        img.className = "indicator";
        img.src = "img/noExists.png";
        nameField.appendChild(img);
        var spanField = document.createElement('span');
        spanField.className = "box";
        spanField.innerHTML = data[i]['campo'];
        spanField.setAttribute('value', getJson);
        nameField.appendChild(spanField);
        var ulNameField = document.createElement("ul");
        ulNameField.className = "nested";
        nameField.appendChild(ulNameField);
        ulNameFont.appendChild(nameField);
        // }
    }
    theTree.appendChild(nameFont);
    addListenersFont();
}


function clearDiv(idDiv) {
    var theDiv = document.getElementById(idDiv);
    while (theDiv.firstChild) {
        theDiv.removeChild(theDiv.firstChild);
    }
}

function addOrigenesTabla(data) {
    for (var i = 0; i < data.length; i++) {
        $('#cbxOrigenDatosTabla').append('<option value=' + data[i] + '>' + (i + 1) + ".- " + data[i] + '</option>');

    }
}

function addOrigenesTablaCaptura(data) {
    $('#cbxOrigenDatosTipoCaptura').append($('<option>',
            {
                value: "",
                text: ""
            }));
    for (var i = 0; i < data.length; i++) {
        $('#cbxOrigenDatosTipoCaptura').append('<option value=' + data[i]['nombre'] + '>' + (i + 1) + ".- " + data[i]['nombre'] + '</option>');
    }
}


function addOrigenesTablaCapturaDetalles(data) {
    var cbxOrPrin = $('#cbxOrigenDatosTabla option:selected').val();
    var c = 1;
    for (var i = 0; i < data.length; i++) {
        if (cbxOrPrin != data[i]['nombre']) {
            $('#cbxOrigenDetallesDatosTabla').append('<option value=' + data[i]['nombre'] + '>' + (c) + ".- " + data[i]['nombre'] + '</option>');
            c++;
        }

    }
}

function getDatosTabla(fuente) {
    var getData = "";
    var url = route + "/api/FuenteDatos/getDatosTabla";
    var dataToPost = JSON.stringify(fuente);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false, false);
    if (Mensaje.resultado !== null) {
        getData = Mensaje.resultado;
    }
    if (getData) {
        return getData;
    }
}


function getDetallesOrigen(fuente) {
    var url = route + "/api/CamposOrigenDatos/GetDetallesOrigen";
    var dataToPost = JSON.stringify(fuente);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado !== null) {
        buildTableDetails(Mensaje.resultado);
    }
}


function getCampoOrigen(fuente, withGetData) {
    var getData = "";
    withGetData = (withGetData === undefined) ? false : withGetData;
    var url = route + "/api/CamposOrigenDatos/CamposPorOrigen";
    var dataToPost = JSON.stringify(fuente);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado !== null) {
        //Este construira la fuente del lado izquierdo con -° °- °°
        if (withGetData) {
            getData = Mensaje.resultado;
        } else {
            setPropFields(Mensaje.resultado);
        }
    }
    if (getData) {
        return getData;
    }
}

function getOrigenesDatosTabla() {
    var getData = "";
    var url = route + "/api/FuenteDatos/OrigenDatosTablas";
    var dataToPost = "{}";
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado !== null) {
        if (Mensaje.resultado !== null) {
            getData = Mensaje.resultado;
        }
    }
    if (getData) {
        return getData;
    }
}

function getOrigenesDatos() {
    var getData = "";
    var url = route + "/api/FuenteDatos/getOrigenDatos";
    var dataToPost = "{}";
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado !== null) {
        getData = Mensaje.resultado;
    }
    if (getData) {
        return getData;
    }
}

function getOrigen(fuente) {
    var getData = "";
    var url = route + "/api/CamposOrigenDatos/GetOrigen";
    var dataToPost = JSON.stringify(fuente);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado !== null) {
        getData = Mensaje.resultado;
    }
    if (getData) {
        return getData;
    }
}

function setPropFields(data) {
    //Recorrer arbolito
    var getFields = $('#myTree li > ul > li .box');
    var verify = false;
    //console.log("Tamano campos: " + getFields.length + " TamaÃ±o base de datos: " + data.length);
    if (data.length > getFields.length) {
        verify = true;
    }
    getFields.each(function () {
        var fieldData = JSON.parse($(this).attr("value"));
        //searching field fisical

        for (i = 0; i < data.length; i++) {
            if (data[i]) {
                if (fieldData.campo === data[i].campo) {
                    $(this).parent("li").find('img').attr('src', "img/tick.png");
                    fieldData.id = data[i].id;
                    fieldData.campo = data[i].campo;
                    fieldData.estado = data[i].estado;
                    fieldData.llave = data[i].llave;
                    fieldData.requerido = data[i].requerido;
                    fieldData.idEtiqueta = data[i].idEtiqueta;
                    fieldData.tipoDeDato = data[i].tipoDeDato;
                    fieldData.compAncho = data[i].compAncho;
                    fieldData.activarGlobal = data[i].activarGlobal;
                    fieldData.activarCaptura = data[i].activarCaptura;
                    fieldData.configuracionTipoCaptura = data[i].configuracionTipoCaptura;
                    $(this).attr("value", JSON.stringify(fieldData));
                    break;
                } else {
                    $(this).parent("li").find('img').attr('src', "img/noExists.png");
                }
            }
        }
    });

    if (verify) {

        for (i = 0; i < data.length; i++) {
            var founded = false;
            if (data[i]) {
                getFields.each(function () {
                    var fieldData = JSON.parse($(this).attr("value"));
                    if (fieldData.campo === data[i].campo) {
                        founded = true;
                    }
                });
                if (!founded) {
                    var compUl = $('#myTree li ul').eq(0);
                    var nameField = document.createElement('li');
                    var img = document.createElement("img");
                    img.id = "indicator";
                    img.className = "indicator";
                    img.src = "img/warning.png";
                    nameField.appendChild(img);
                    var spanField = document.createElement('span');
                    spanField.className = "box";
                    spanField.innerHTML = data[i]['campo'];
                    spanField.setAttribute('value', JSON.stringify(data[i]));
                    nameField.appendChild(spanField);
                    var ulNameField = document.createElement("ul");
                    ulNameField.className = "nested";
                    nameField.appendChild(ulNameField);
                    compUl.append(nameField);
                    addListenersFont();
                }
            }
        }
    }

}

function saveCampoOrigenes(data, details) {
    var infoData = new Object();
    infoData.campos = data;
    infoData.detalles = details;
    if (deleteDetails.length) {
        infoData.deleteDetails = deleteDetails;
    }
    var url = route + "/api/CamposOrigenDatos/Save";
    var dataToPost = JSON.stringify(infoData);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === true) {
        var getOrigenFont = document.getElementById("cbxOrigenDatosTabla");
        var valueFont = getOrigenFont.options[getOrigenFont.selectedIndex].value;
        clearObjetos();
        setFuentes(valueFont);
        clearProperties();
        alert("Guardado exitosamente");
    }
}

function clearObjetos() {
    $("#mainTableDetails").find("tr:gt(0)").remove();
    deleteDetails = [];
    document.getElementById('contEventos').style.display = "none";
    //document.getElementById('divTeclas').style.display = "none";
    document.getElementById('myPopup').innerHTML = "No hay descripcion";
    document.getElementById('txtMetodo').value = "";
    document.getElementById('selEventos').value = "";
    document.getElementById('selEventos').value = "";
    $('#cbxOrigenDetallesDatosTabla').find('option').not(':first').remove();
    $('#selMetodos option:not(:first)').remove();
    if (document.getElementById('listEvento')) {
        $('#valuerEventos').empty();
    }
}

function deleteCampoOrigenes(data) {
    var url = route + "/api/CamposOrigenDatos/Delete";
    var dataToPost = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === true) {
        var getOrigenFont = document.getElementById("cbxOrigenDatosTabla");
        var valueFont = getOrigenFont.options[getOrigenFont.selectedIndex].value;
        setFuentes(valueFont);
        clearProperties();
        alert("Eliminado exitosamente");
    }
}

function toUpdateFont() {
    changeProperties();
    clearProperties();
    $('#myTree li > ul > li .box').removeClass("check-box");
    $('#myTree li > ul > li .nested').removeClass("check-box");
}

function toSaveFont() {

    if (validateData()) {
        var boxes = $('#myTree li > ul > li .check-box');
        var getOrigenFont = document.getElementById("cbxOrigenDatosTabla");
        var valueFont = getOrigenFont.options[getOrigenFont.selectedIndex].value;
        var oDJson = {};
        oDJson.id = -1;
        oDJson.clave = "";
        oDJson.nombre = valueFont;
        oDJson.origen = "BD";
        oDJson.recurso = valueFont;
        oDJson.estado = true;
        if (boxes.attr("value")) {
            var valProp = JSON.parse(boxes.attr("value"));
            valProp.id = valProp.id === "" ? -1 : valProp.id;
            valProp.campo = document.getElementById("campo").value;
            valProp.estado = document.getElementById('estado').value;
            valProp.llave = document.getElementById('llave').checked === true ? true : false;
            valProp.requerido = document.getElementById('requerido').checked === true ? true : false;
            valProp.idEtiqueta = document.getElementById("idEtiqueta").value.toString();
            valProp.tipoDeDato = document.getElementById("tipoDeDato").value.toString();
            valProp.compAncho = document.getElementById("compAncho").value.toString();
            valProp.activarGlobal = document.getElementById('chkGlobal').checked === true ? true : false;
            valProp.activarCaptura = document.getElementById('chkCaptura').checked === true ? true : false;
            var tipoCap = document.getElementById("tipoCaptura").value.toString();
            var isPassword = document.getElementById('chkpassword').checked === true ? true : false;
            var configTipCap = createConfigTipoCap(tipoCap, isPassword);
            valProp.configuracionTipoCaptura = JSON.stringify(configTipCap);
            valProp.origenDatos = oDJson;
        } else {
            var valProp = new Object();
            valProp.origenDatos = oDJson;
        }
        var detalles = [];
        $('#mainTableDetails tr:not(:first-child)').each(function () {
            var id = $(this).attr('id');
            var detallesOr = new Object();
            if (id === undefined) {
                detallesOr.id = -1;
            } else {
                detallesOr.id = parseInt(id);
            }
            detallesOr.origenDatos_ID = -1;
            var idFuente = $(this).children('td:first').attr('id');
            detallesOr.origenDatosFuente_ID = parseInt(idFuente);
            detalles.push(detallesOr);
        });
        saveCampoOrigenes(valProp, detalles);
    }
}


function createConfigTipoCap(tipoCap, isPassword) {
    var configTipCap = {};
    configTipCap.tipoCaptura = tipoCap;
    if (isPassword) {
        configTipCap.isPassword = isPassword;
    }
    if (tipoCap === "1") {
        configTipCap.maxcar = document.getElementById("txtLibre").value.toString();
        configTipCap.expresion = document.getElementById("txtRegular").value.toString();
    } else if (tipoCap === "2") {
        var arrayList = [];
        $("ul#valuer li").each(function (index) {
            arrayList.push($(this).text());
        });
        configTipCap.lista = arrayList;
    } else if (tipoCap === "3") {
        var assocArray = {};
        $("ul#valuer li").each(function () {
            assocArray[$(this).children('#getValue').attr("value")] = $(this).children('#get').text();
        });
        configTipCap.equivalencias = assocArray;
    }
    else if (tipoCap === "4") {
        var getOrigenTipCap = document.getElementById("cbxOrigenDatosTipoCaptura");
        var valueTipCap = getOrigenTipCap.options[getOrigenTipCap.selectedIndex].value;
        var fieldKey = $("#cbxValor").attr("campollave");
        var fieldValOne = $("ul#valuer li").eq(0).text();
        var fieldValTwo = $("ul#valuer li").eq(1).text();
        var fieldsAdic = [];
        $("ul#valuerAdic li").each(function () {
            fieldsAdic.push(datosFields[$(this).attr('id')]);
        });

        var assocArray = {
            "origen": valueTipCap,
            "campollave": fieldKey,
            "campovalor1": fieldValOne,
            "campovalor2": fieldValTwo
        };

        if (fieldsAdic.length > 0) {
            assocArray['camposAdicionales'] = fieldsAdic;
            // or assocArray.camposAdicionales = fieldsAdic;
        }
        configTipCap.origenes = assocArray;
    }

    //var eventosArreglo = [];
    //$("ul#valuerEventos li").each(function () {
    //    var eventosArray = {};
    //    //  eventosArray['nombreMetodo'] = $(this).children('#get').attr("value");
    //    eventosArray['nombreEvento'] = $(this).children('#getValue').attr("value");
    //    eventosArray['nombreMetodo'] = $(this).children('#get').attr("value");
    //    var listaTeclas = new Array();
    //    $("ul#valuerTeclas li").each(function () {
    //        var teclas = {};
    //        teclas['nombre'] = $(this).children('#get').attr("value");
    //        teclas['valor'] = $(this).children('#getValue').attr("value");
    //        listaTeclas[listaTeclas.length] = teclas;
    //    });
    //    if (listaTeclas.length > 0) {
    //        eventosArray['teclas'] = listaTeclas;
    //        console.log(listaTeclas);
    //    }
    //    eventosArreglo[eventosArreglo.length] = eventosArray;
    //});

    if (listaEventos.length > 0) {
        configTipCap.eventos = listaEventos;
        console.log(configTipCap);
    }

    return configTipCap;
}


function toDeleteFont() {
    var answer = confirm("¿Quieres eliminar este campo?");
    if (answer) {
        var boxes = $('#myTree li > ul > li .check-box');
        var valProp = JSON.parse(boxes.attr("value"));
        deleteCampoOrigenes(valProp);
    }
    else {

    }
}


function toCancelFont() {
    clearProperties();
    location.reload();
}


function addDetailTable() {
    var getOrigenFont = document.getElementById("cbxOrigenDetallesDatosTabla");
    var valueFont = getOrigenFont.options[getOrigenFont.selectedIndex].value;
    //Get data from origin
    var origen = getOrigen(valueFont);
    if (origen === undefined) {
        alert("Este origen de datos aún no ha sido guardado");
    } else {
        addTableDetails(origen);
    }
}

function addTableDetails(origen) {
    var tbl = document.getElementById("mainTableDetails");
    if (verifyRepeatDetail(origen.id.toString())) {
        var tr = document.createElement('tr');
        //tr.id = origen.id.toString();
        var td = document.createElement('td');
        td.id = origen.id.toString();
        td.appendChild(document.createTextNode(origen.clave));
        tr.appendChild(td);

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(origen.nombre));
        tr.appendChild(td);

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(origen.recurso));
        tr.appendChild(td);

        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Eliminar");
        a.appendChild(linkText);
        a.href = "javascript:deleteObjectInTable('" + origen.id + "');";
        td.appendChild(a);
        tr.appendChild(td);

        tbl.appendChild(tr);

    }
    else {
        alert("Este detalle ya existe");
    }
}

function buildTableDetails(data) {
    var tbl = document.getElementById("mainTableDetails");
    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        tr.id = data[i]['id'].toString();
        var sizeColumns = 4;//4
        for (var j = 0; j < sizeColumns; j++) {
            if (j === 0) {
                var td = document.createElement('td');
                td.id = data[i]['idOrigenFuente'].toString();
                td.appendChild(document.createTextNode(data[i]['clave']));
            }
            else if (j === 1) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]['nombre']));
            }
            else if (j === 2) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]['recurso']));
            }
            else if (j === 3) {
                var td = document.createElement('td');
                var a = document.createElement('a');
                var linkText = document.createTextNode("Eliminar");
                a.appendChild(linkText);
                a.href = "javascript:deleteObjectInTable('" + data[i]['id'] + "');";
                td.appendChild(a);
            }
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }
}

function deleteObjectInTable(key) {
    var answer = confirm("¿Quieres eliminar este detalle?");
    if (answer) {
        deleteDetails.push(key);
        $("#mainTableDetails #" + key.toString()).remove();
    }
    else {

    }
}

function verifyRepeatDetail(info) {
    var numberOfRows = document.getElementById("mainTableDetails").rows.length;
    var orDat = "";
    var go = true;
    var table = document.getElementById("mainTableDetails");
    for (i = 0; i < numberOfRows; i++) {
        var orDat = table.rows[i].cells[0].id;
        if (info === orDat) {
            go = false;
            break;
        }
    }
    return go;
}


function changeDataType(type) {
    var typeCap = document.getElementById('tipoCaptura');
    if (type === "0") {//Relacion
        typeCap.value = "4";
        typeCap.disabled = true;
    } else if (type === "1") {//Texto
        typeCap.value = "1";
        typeCap.disabled = false;
    }
    else if (type === "2") {//Entero
        typeCap.value = "1";
        typeCap.disabled = false;
    } else if (type === "3") {//Double
        typeCap.value = "1";
        typeCap.disabled = false;

    } else if (type === "4") {//Fecha
        typeCap.value = "1";
        typeCap.disabled = false;
    } else if (type === "5") {//Boleano
        typeCap.value = "1";
        typeCap.disabled = false;
    } else if (type = "6") {//Tiempo
        typeCap.value = "1";
        typeCap.disabled = false;
    }

    if (typeCap) {
        createType(typeCap.value);
    }
}

function createType(type) {
    var adapter = document.getElementById("adapterType");
    adapter.style.border = "dotted gray";
    $("#adapterType").empty();
    if (document.getElementById('listEvento')) {
        $('#valuerEventos').empty();
    }
    document.getElementById('txtMetodo').value = "";
    document.getElementById('selEventos').value = "";
    document.getElementById('selMetodos').value = "";
    var br = document.createElement("br");
    if (type === "1") {
        var divGroup = document.createElement('DIV');
        divGroup.className = "mainPanelDivGroup";
        var label = document.createElement('LABEL');
        label.innerHTML = "Máximo de caracteres:";
        divGroup.appendChild(label);
        var textBox = document.createElement('INPUT');
        textBox.id = "txtLibre";
        textBox.type = 'text';
        textBox.name = "txtLibre";
        textBox.value = "255";
        textBox.style.display = "block";
        adapter.appendChild(textBox);
        divGroup.appendChild(textBox);
        var label2 = document.createElement('LABEL');
        label2.innerHTML = "Expresión regular:";
        divGroup.appendChild(label2);
        var divSelect = document.createElement('div');
        divSelect.className = "select-style";
        divSelect.style.margin = "5px";
        divSelect.style.marginLeft = "0px";
        divSelect.style.width = "70%";
        var selctExp = document.createElement('select');
        selctExp.id = "selExpre";
        selctExp.className = "inpSmall";
        selctExp.setAttribute('onchange', "setExpre()");
        divSelect.appendChild(selctExp);
        divGroup.appendChild(divSelect);
        var textBox2 = document.createElement('INPUT');
        textBox2.id = "txtRegular";
        textBox2.type = 'text';
        textBox2.name = "txtRegular";
        textBox2.style.display = "block";
        textBox2.style.width = "100%";
        textBox2.disabled = true;
        divGroup.appendChild(textBox2);
        adapter.appendChild(divGroup);
        llenarExpre();
    } else if (type === "2") {
        var divGroup = document.createElement('DIV');
        divGroup.className = "mainPanelDivGroup";
        var label = document.createElement('LABEL');
        label.innerHTML = "Valores:";
        divGroup.appendChild(label);
        divGroup.appendChild(br);
        var tipoDato = document.getElementById('tipoDeDato').value;
        if (tipoDato !== "4") {
            var textBox = document.createElement('INPUT');
            textBox.id = "txtTexto";
            textBox.type = 'text';
            textBox.name = "txtTexto";
            textBox.innerHTML += '&nbsp;';
            textBox.style.marginRight = "1px";
            textBox.setAttribute('onkeypress', 'return validarTipoDato(event,this)');
            divGroup.appendChild(textBox);
        } else {
            var textBox = document.createElement('INPUT');
            textBox.id = "txtTexto";
            textBox.type = "date";
            textBox.name = "txtTexto";
            textBox.innerHTML += '&nbsp;';
            textBox.style.marginRight = "1px";
            divGroup.appendChild(textBox);
        }
        var btn = document.createElement('BUTTON');
        btn.id = 'btnAddValues';
        btn.className = 'btnAddValues defaultButton';
        btn.setAttribute('onclick', "addValue(false)");
        var t = document.createTextNode('+');
        btn.appendChild(t);
        divGroup.appendChild(btn);
        var listWrap = document.createElement('DIV');
        listWrap.className = 'listWrapper';
        listWrap.style.width = "50%";
        var ul = document.createElement('UL');
        ul.id = "valuer";
        listWrap.appendChild(ul);

        divGroup.appendChild(listWrap);
        adapter.appendChild(divGroup);
        addListenerEnter();
    } else if (type === "3") {
        var divGroup = document.createElement('DIV');
        divGroup.className = "mainPanelDivGroup";
        var label = document.createElement('LABEL');
        label.innerHTML = "Valor:";
        label.style.display = "block";
        divGroup.appendChild(label);
        var textBox = document.createElement('INPUT');
        textBox.id = "cbxValor";
        textBox.type = 'text';
        textBox.name = "cbxValor";
        textBox.innerHTML += '&nbsp;';
        textBox.style.marginRight = "1px";
        textBox.style.display = "block";
        textBox.setAttribute('onkeypress', 'return validarTipoDato(event,this)');
        divGroup.appendChild(textBox);
        var label2 = document.createElement('LABEL');
        label2.innerHTML = "Texto:";
        label2.style.display = "block";
        divGroup.appendChild(label2);
        var textBox2 = document.createElement('INPUT');
        textBox2.id = "txtTexto";
        textBox2.type = 'text';
        textBox2.name = "txtTexto";
        textBox2.innerHTML += '&nbsp;';
        textBox2.style.marginRight = "1px";
        divGroup.appendChild(textBox2);
        var btn = document.createElement('BUTTON');
        btn.id = 'btnAddValues';
        btn.className = 'btnAddValues defaultButton';
        btn.setAttribute('onclick', "addValue(true)");
        var t = document.createTextNode('+');
        btn.appendChild(t);
        divGroup.appendChild(btn);
        var listWrap = document.createElement('DIV');
        listWrap.className = 'listWrapper';
        listWrap.style.width = "50%";
        var ul = document.createElement('UL');
        ul.id = "valuer";
        listWrap.appendChild(ul);
        divGroup.appendChild(listWrap);
        adapter.appendChild(divGroup);
        addListenerEnter();

    } else if (type === "4") {
        var divGroup = document.createElement('DIV');
        divGroup.className = "mainPanelDivGroup";
        var label = document.createElement('LABEL');
        label.innerHTML = "Origen de datos:";
        divGroup.appendChild(label);
        var divSelect = document.createElement('DIV');
        divSelect.className = "select-style";
        divSelect.style.width = "250px";
        var selectList = document.createElement("SELECT");
        selectList.id = "cbxOrigenDatosTipoCaptura";
        selectList.setAttribute("onchange", "addCamposByFuente(this.value)");
        divSelect.appendChild(selectList);
        divGroup.appendChild(divSelect);
        var label2 = document.createElement('LABEL');
        label2.innerHTML = "Campos:";
        label2.style.display = "block";
        divGroup.appendChild(label2);
        var divSelect2 = document.createElement('DIV');
        divSelect2.className = "select-style";
        divSelect2.style.width = "220px";
        divSelect2.style.cssFloat = "left";
        var selectField = document.createElement("SELECT");
        selectField.id = "cbxValor";
        divSelect2.appendChild(selectField);
        divGroup.appendChild(divSelect2);
        divSelect2.style.cssFloat = "left";
        var btn = document.createElement('BUTTON');
        btn.id = 'btnAddValues';
        btn.className = 'btnAddValues defaultButton';
        btn.setAttribute('onclick', "addValueOrigen()");
        var t = document.createTextNode('+');
        btn.appendChild(t);
        btn.style.cssFloat = "left";
        btn.style.padding = "1.5% 2%";
        btn.style.marginLeft = "0.5%";
        divGroup.appendChild(btn);
        var listWrap = document.createElement('DIV');
        listWrap.className = 'listWrapper';
        listWrap.style.width = "50%";
        //listWrap.style.border = "thin dotted";
        var ul = document.createElement('UL');
        ul.id = "valuer";
        listWrap.appendChild(ul);
        divGroup.appendChild(listWrap);
        var divSelect3 = document.createElement('DIV');
        divSelect3.className = "select-style";
        divSelect3.style.width = "220px";
        divSelect3.style.cssFloat = "left";
        var label3 = document.createElement('LABEL');
        label3.innerHTML = "Campos adicionales:";
        divGroup.appendChild(label3);
        divGroup.appendChild(document.createElement("br"));
        var selectField2 = document.createElement("SELECT");
        selectField2.id = "cbxValor2";
        divSelect3.appendChild(selectField2);
        divGroup.appendChild(divSelect3);
        var btn = document.createElement('BUTTON');
        btn.id = 'btnAddValuesAdic';
        btn.className = 'btnAddValues defaultButton';
        btn.setAttribute('onclick', "addValueOrigenAdic()");
        var t = document.createTextNode('+');
        btn.appendChild(t);
        btn.style.cssFloat = "left";
        btn.style.padding = "1.5% 2%";
        btn.style.marginLeft = "0.5%";
        divGroup.appendChild(btn);
        var btn2 = document.createElement('BUTTON');
        btn2.id = 'btnAddAllValuesAdic';
        btn2.className = 'btnAddAllValuesAdic defaultButton';
        btn2.setAttribute('onclick', "addValuesAllOrigenAdic()");
        btn2.style.cssFloat = "left";
        btn2.style.padding = "1.5% 2%";
        btn2.style.marginLeft = "0.5%";
        var t = document.createTextNode('+ Todos');
        btn2.appendChild(t);
        divGroup.appendChild(btn2);
        var listWrap2 = document.createElement('DIV');
        listWrap2.className = 'listWrapper';
        listWrap2.style.width = "50%";
        //listWrap2.style.border = "thin dotted";
        var ul2 = document.createElement('UL');
        ul2.id = "valuerAdic";
        listWrap2.appendChild(ul2);
        divGroup.appendChild(listWrap2);
        adapter.appendChild(divGroup);
        var data = getOrigenesDatos();
        addOrigenesTablaCaptura(data);
        var boxes = $('#myTree li > ul > li .check-box');
        if (boxes.attr("value")) {
            var valProp = JSON.parse(boxes.attr("value"));
            var referencia = valProp.referencia;
            if (referencia) {
                // $("#cbxOrigenDatosTipoCaptura").val("val2").change();
                $("#cbxOrigenDatosTipoCaptura").val(referencia);
                addCamposByFuente(referencia);
            }
        }
    }
    else {
        adapter.style.border = "";
    }
}


function addValueOrigen(data) {
    if ($('ul#valuer li').length < 2) {
        var theValuer = document.getElementById('valuer');
        if (data) {
            var valueField = data;
        } else {
            var getOrigenFields = document.getElementById("cbxValor");
            //  if (getOrigenFields.options.length === 0) {
            var valueField = getOrigenFields.options[getOrigenFields.selectedIndex].value;
            var tipodato = $('option:selected', getOrigenFields).attr('tipodato');
            //  }
        }
        var tipodatoPrin = document.getElementById('tipoDeDato').value;
        if (tipodato === tipodatoPrin || tipodatoPrin === "0") {
            if (validateValueAdd(valueField, true)) {
                var li = document.createElement('LI');
                li.id = valueField.toString();
                var img = document.createElement('IMG');
                img.src = "img/noExists.png";
                img.className = 'indicator';
                img.setAttribute('onclick', "deleteValue('" + theValuer.id + "','" + valueField.toString() + "')");
                li.appendChild(img);
                var label = document.createElement('LABEL');
                label.id = "get";
                label.textContent = valueField.toString();
                li.appendChild(label);
                theValuer.appendChild(li);
            } else {
                alert("Este elemento esta repetido");
            }
        } else {
            alert("El tipo de dato no son iguales");
        }
    } else {
        alert("Solo puedes agregar dos elementos");
    }
}

function addValuesAllOrigenAdic() {
    $('#valuerAdic').empty()
    $("#cbxValor2 > option").each(function () {
        addValueOrigenAdic(this.value);
    });

}

function addValueOrigenAdic(data) {
    var theValuer = document.getElementById('valuerAdic');
    if (data) {
        var valueField = null;
        if (data.nombre) {
            valueField = data.nombre;
        } else {
            valueField = data;
        }

        // var valueFieldId = data.getAttribute("fieldId");
    } else {
        var getOrigenFields = document.getElementById("cbxValor2");
        var optionSelected = getOrigenFields.options[getOrigenFields.selectedIndex];
        var valueField = optionSelected.value.toString();
        //var valueFieldId = optionSelected.getAttribute("fieldId");
    }
    if (validateValueAdic(valueField)) {
        var li = document.createElement('LI');
        if (valueField.indexOf('(') > -1) {
            valueField = valueField.substring(0, valueField.indexOf('('));
        }
        li.id = valueField;
        //li.setAttribute("fieldId", valueFieldId.toString());
        var img = document.createElement('IMG');
        img.src = "img/noExists.png";
        img.className = 'indicator';
        img.setAttribute('onclick', "deleteValue('" + theValuer.id + "','" + valueField + "')");
        li.appendChild(img);
        var label = document.createElement('LABEL');
        label.id = "getAdic";
        label.textContent = valueField;
        li.appendChild(label);
        theValuer.appendChild(li);
    } else {
        alert("Este elemento esta repetido");
    }

}

function validateNumberOrigin() {
    alert($('ul#valuer li').length);

}

function addValue(withValue, data) {
    var theValuer = document.getElementById('valuer');
    if (data) {
        var text = data.texto;
    } else {
        var text = document.getElementById('txtTexto').value;
    }
    if (withValue) {
        if (data) {
            var theValue = data.valor;
        } else {
            var theValue = document.getElementById('cbxValor').value;
        }
    }
    if (text && (withValue === false ? true : theValue ? true : false)) {
        if (validateValueAdd(text, withValue)) {
            var li = document.createElement('LI');
            if (withValue) {
                if (data) {
                    var theValue = data.valor;
                } else {
                    var theValue = document.getElementById('cbxValor').value;
                }

                if (theValue) {
                    li.id = theValue.toString();
                } else {
                    document.getElementById('cbxValor').focus();
                    alert("Necesitas agregar un valor");
                    return;
                }
            } else {
                li.id = text.toString();
            }
            var img = document.createElement('IMG');
            img.src = "img/noExists.png";
            img.className = 'indicator';
            if (withValue) {
                img.setAttribute('onclick', "deleteValue('" + theValuer.id + "','" + theValue.toString() + "')");
            } else {
                img.setAttribute('onclick', "deleteValue('" + theValuer.id + "','" + text.toString() + "')");
            }
            li.appendChild(img);
            var label = document.createElement('LABEL');
            label.id = "get";
            var labelValor = document.createElement('LABEL');
            labelValor.id = "getValue";
            if (withValue) {
                labelValor.setAttribute("value", theValue.toString());
                label.textContent = text.toString();
                labelValor.textContent = " (" + theValue.toString() + ")";
                li.appendChild(label);
                li.appendChild(labelValor);
            } else {
                label.textContent = text.toString();
                li.appendChild(label);
            }
            theValuer.appendChild(li);
            document.getElementById('txtTexto').value = "";
            if (withValue) {
                document.getElementById('cbxValor').value = "";
            }
        } else {
            alert("Este elemento esta repetido");
        }
    } else {
        alert("Agregue un valor");
    }
}

function addValueMetodos(data) {
    var divgrup = document.getElementById('contMetodos');
    var listWrap2;
    var ul2;
    if (document.getElementById('listMetodos')) {
        listWrap2 = document.getElementById('listMetodos');
        ul2 = document.createElement('valuerMetodos');
    } else {
        listWrap2 = document.createElement('DIV');
        listWrap2.id = "listMetodos";
        listWrap2.className = 'listWrapper';
        listWrap2.style.width = "100%";
        ul2 = document.createElement('UL');
        ul2.id = "valuerMetodos";
        listWrap2.appendChild(ul2);
    }

    //listWrap2.style.border = "thin dotted";

    divgrup.appendChild(listWrap2);
    var theValuer = document.getElementById('valuerMetodos');
    var textMetodo = document.getElementById('txtMetodo').value;
    var textEvento = document.getElementById('selEventos').value;

    var idMetodo;
    // var textTecla = document.getElementById('selTeclas').value;
    if ((textMetodo && textEvento) || data) {
        if (validateValueMetodos()) {
            var li = document.createElement('LI');
            var metodo = {};


        if (data) {
            idMetodo = data.nombreMetodo;
            li.id = data.nombreMetodo;
            metodo.nombreMetodo = data.nombreMetodo;
            metodo.nombreMetodoFull = data.nombreMetodoFull;
            metodo.parametrosMetodo = data.parametrosMetodo;
        } else {
            idMetodo = textMetodo.substring(0, textMetodo.indexOf("("));
            li.id = idMetodo.toString();
            metodo.nombreMetodo = idMetodo;
            metodo.nombreMetodoFull = textMetodo.toString();
            parametros = textMetodo.substring(textMetodo.indexOf('(') + 1, textMetodo.indexOf(')'))
            metodo.parametrosMetodo = parametros;
        }
        var img = document.createElement('IMG');
        img.src = "img/noExists.png";
        img.className = 'indicator';
        if (data) {
           
            img.setAttribute('onclick', "deleteValueMetedos('" + theValuer.id + "','" + idMetodo + "')");
        } else {
          
            img.setAttribute('onclick', "deleteValueMetedos('" + theValuer.id + "','" + idMetodo + "')");
        }

        li.appendChild(img);
        var label = document.createElement('LABEL');
        label.id = "get";
        var labelValor = document.createElement('LABEL');
        labelValor.id = "getValue";
        var labelTecla = document.createElement('LABEL');
        labelTecla.id = "getValueTecla";
        if (data) {
            labelValor.setAttribute("value", idMetodo);
        } else {
            labelValor.setAttribute("value", idMetodo);
        }

        if (data) {
            label.textContent = data.nombreMetodoFull;
            label.setAttribute("value", data.nombreMetodoFull);
        } else {
            label.textContent = textMetodo.toString();
            label.setAttribute("value", textMetodo.toString());
        }

        li.appendChild(label);
        li.appendChild(labelValor);

        theValuer.appendChild(li);
        listaMetodos[listaMetodos.length] = metodo;
        document.getElementById('txtMetodo').value = "";
        document.getElementById('selMetodos').value = "";
        document.getElementById('selTeclas').disabled = true;
        document.getElementById('btnAddTeclas').disabled = true;
        } else {
            alert("Este elemento esta repetido");
        }
    } else {

        alert("Llene los campos evento y metodo");
    }
}

function validateValueAdd(texto, withValue) {
    var go = true;
    $("#adapterType li").each(function () {
        if ($(this).children('label').attr('id') === "get") {
            var compareAdded = $(this).children('#get').text();
            if (texto === compareAdded) {
                go = false;
            }
            if (withValue) {
                var value = document.getElementById('cbxValor').value;
                var compareValAdded = $(this).children('#getValue').attr("value");
                if (value === compareValAdded) {
                    go = false;
                }
            }
        }
    });
    return go;
}

function validateValueAdic(texto) {
    var go = true;
    $("#adapterType li").each(function () {
        if ($(this).children('label').attr('id') === "getAdic") {
            var compareAdded = $(this).children('#getAdic').text();
            if (texto === compareAdded) {
                go = false;
            }
            var value = document.getElementById('cbxValor2').value;
            var compareValAdded = $(this).children('#getAdic').attr("value");
            if (value === compareValAdded) {
                go = false;
            }
        }
    });
    return go;
}

function validateValueEvent() {
    var go = true;
    $("#contEventosFull li").each(function () {
        if ($(this).children('label').attr('id') === "get") {
            var value = document.getElementById('selEventos').value;
            var compareValAdded = $(this).children('#getValue').attr("value");
            if (value === compareValAdded) {
                go = false;
            }
        }

    });

    return go;
}

function validateValueMetodos() {
    var go = true;
    $("#contMetodos li").each(function () {
        if ($(this).children('label').attr('id') === "get") {
            var selMetodos = document.getElementById('txtMetodo').value;
            var value = selMetodos.substring(0, selMetodos.indexOf('('));
            var compareValAdded = $(this).children('#getValue').attr("value");
            if (value === compareValAdded) {
                go = false;
            }
        }

    });
    return go;
}

function deleteValue(element, value) {
    $('#' + element.toString()).children("#" + value.toString()).remove();
}

function deleteValueTeclas(element, value) {
    if (listaTeclas.length > 0) {
        for (var i = 0; i < listaTeclas.length; i++) {
            if(listaTeclas[i].nombre === value){
                listaTeclas.splice(i, 1);
                $('#' + element.toString()).children("#" + value.toString()).remove();
                break;
            }
        }
        //if (listaTeclas.length == 0) {
        //   // $('#listTeclas').children('#valuerTeclas').remove();
        //    document.getElementById('valuerTeclas').innerHTML = "";
        //}
    } else {
        $('#' + element.toString()).children("#" + value.toString()).remove();
    }
}

function deleteValueMetedos(element, value) {
    if (listaMetodos.length > 0) {
        for (var i = 0; i < listaMetodos.length; i++) {
            if (listaMetodos[i].nombreMetodo === value) {
                listaMetodos.splice(i, 1);
                $('#' + element.toString()).children("#" + value.toString()).remove();
                break;
            }
        }
        //if (listaTeclas.length == 0) {
        //   // $('#listTeclas').children('#valuerTeclas').remove();
        //    document.getElementById('valuerTeclas').innerHTML = "";
        //}
    } else {
        $('#' + element.toString()).children("#" + value.toString()).remove();
    }
}
function deleteValueEvento(element, value) {
    if (listaEventos.length > 0) {
        for (var i = 0; i < listaEventos.length; i++) {
            if (listaEventos[i].nombreEvento === value) {
                listaEventos.splice(i, 1);
                $('#' + element.toString()).children("#" + value.toString()).remove();
                break;
            }
        }
        if (listaEventos.length == 0) {
            document.getElementById('contEventosFull').style.display = "none";
        }
    } else {
        $('#' + element.toString()).children("#" + value.toString()).remove();
        if (document.getElementById('contEventosFull').childNodes.length>1) {
            document.getElementById('contEventosFull').style.display = "none";
        }
    }
}

function validarTipoDato(e, input) {
    var key = e.keyCode || e.which;

    // var teclado = String.fromCharCode(key);
    var tipoDato = document.getElementById('tipoDeDato').value;
    if (tipoDato === "2") {
        if (key < 48 || key > 57) {
            return false;
        }
    } else if (tipoDato === "3") {
        var caracter = String.fromCharCode(key);
        var valor = input.value + caracter;

        if (key >= 48 && key <= 57) {
            if (validarDecimal(valor) === false) {
                return false;
            } else {
                return true;
            }
        } else {
            if (key === 8 || key === 13 || key === 0) {
                return true;
            } else if (key === 46) {
                if (validarDecimal(valor) === false) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
    }
}

function validarDecimal(valor) {
    var preg = /^([0-9]+\.?[0-9]{0,2})$/;
    if (preg.test(valor) === true) {
        return true;
    } else {
        return false;
    }

}

function llenarExpre() {

    var selExpr = document.getElementById('selExpre');
    var optionva = document.createElement('option');
    optionva.value = "";
    optionva.innerHTML = "";
    selExpr.add(optionva);
    var option = document.createElement('option');
    option.value = "Personalizar";
    option.innerHTML = "Personalizar...";
    selExpr.add(option);
    for (var item in expReg) {
        var option2 = document.createElement('option');
        option2.value = expReg[item];
        option2.innerHTML = item;
        selExpr.add(option2);
    }
}

function setExpre() {

    if (document.getElementById('selExpre').value === "Personalizar") {
        document.getElementById('txtRegular').disabled = false;
        document.getElementById('txtRegular').value = "";
    } else {
        document.getElementById('txtRegular').disabled = true;
        document.getElementById('txtRegular').value = document.getElementById('selExpre').value;

    }
}

function validacionEvento(valor) {
    if (valor === "onkeypress" || valor === "onKeyDown") {
        document.getElementById('selTeclas').disabled = false;
        document.getElementById('btnAddTeclas').disabled = false;
    } else {
        if (document.getElementById('contTeclas').childNodes.length > 0) {
            var answer = confirm("¿Seguro que quiere cambiar hay teclas selecionadas?");
            if (answer) {
                document.getElementById('selTeclas').disabled = true;
                document.getElementById('btnAddTeclas').disabled = true;
                $('#contTeclas').empty();
            }
        }
    }
}

function addTeclas(data) {
    var divgrup = document.getElementById('contTeclas');
    var listWrap2;
    var ul2;
    if (document.getElementById('listTeclas')) {
        listWrap2 = document.getElementById('listTeclas');
       // document.getElementById('valuerTeclas').innerHTML = "Teclas";
        ul2 = document.createElement('valuerTeclas');
        //ul2.innerHTML = "Teclas";
    } else {
        listWrap2 = document.createElement('DIV');
        listWrap2.id = "listTeclas";
        listWrap2.className = 'listWrapper';
        listWrap2.style.width = "100%";
        ul2 = document.createElement('UL');
        ul2.id = "valuerTeclas";
       // ul2.innerHTML = "Teclas";
        listWrap2.appendChild(ul2);
    }

    //listWrap2.style.border = "thin dotted";

    divgrup.appendChild(listWrap2);
    var theValuer = document.getElementById('valuerTeclas');
    var textvalor = document.getElementById('selTeclas').value;
    var selExcepcion = document.getElementById('selTeclas');
    var textTecla = selExcepcion.options[selExcepcion.selectedIndex].innerHTML;
    if (textTecla !== "" || data) {
        if (validateValueTecla()) {

            var tecla = {};
            if (data) {
                tecla.nombre = data.nombre;
                tecla.valor = data.valor;
            } else {
                tecla.nombre = textTecla;
                tecla.valor = textvalor;
            }

            var li = document.createElement('LI');
            if (data) {
                li.id = data.nombre;
            } else {
                li.id = textTecla.toString();
            }
            var img = document.createElement('IMG');
            img.src = "img/noExists.png";
            img.className = 'indicator';
            if (data) {
                img.setAttribute('onclick', "deleteValueTeclas('" + theValuer.id + "','" + data.nombre + "')");
            } else {
                img.setAttribute('onclick', "deleteValueTeclas('" + theValuer.id + "','" + textTecla.toString() + "')");
            }
            li.appendChild(img);
            var label = document.createElement('LABEL');
            label.id = "get";
            var labelValor = document.createElement('LABEL');
            labelValor.id = "getValue";
            if (data) {
                labelValor.setAttribute("value", data.valor);
            } else {
                labelValor.setAttribute("value", textvalor.toString());
            }

            if (data) {

                label.textContent = data.nombre;
                label.setAttribute("value", data.nombre);

            } else {
                label.textContent = textTecla.toString();
                //  label.setAttribute("value", textMetodo.toString());
                label.setAttribute("value", textTecla.toString());

            }

            li.appendChild(label);
            li.appendChild(labelValor);
            // li.appendChild(labelTecla);
            theValuer.appendChild(li);
            listaTeclas[listaTeclas.length] = tecla;
            tecla = {};
            document.getElementById('selTeclas').value = "";

        } else {
            alert("Este elemento esta repetido");
        }
    } else {
        alert("selecione una tecla");
    }

    // return theValuer;
}

function validateValueTecla() {
    var go = true;
    $("#contTeclas li").each(function () {
        if ($(this).children('label').attr('id') === "get") {
            var value = document.getElementById('selTeclas').value;
            var compareValAdded = $(this).children('#getValue').attr("value");
            if (value === compareValAdded) {
                go = false;
            }
        }

    });

    return go;
}

function addValueEvento(data) {
    var divgrup = document.getElementById('contEventosFull');
    var listWrap2;
    var ul2;
    if (document.getElementById('listEventos')) {
        listWrap2 = document.getElementById('listEventos');
        ul2 = document.createElement('valuerEventos');
    } else {
        listWrap2 = document.createElement('DIV');
        listWrap2.id = "listEventos";
        listWrap2.className = 'listWrapper';
        listWrap2.style.width = "100%";
        ul2 = document.createElement('UL');
        ul2.id = "valuerEventos";
        listWrap2.appendChild(ul2);
    }

    //listWrap2.style.border = "thin dotted";
    var evento = {};
    divgrup.appendChild(listWrap2);
    var theValuer = document.getElementById('valuerEventos');
    // var textMetodo = document.getElementById('txtMetodo').value;
    var textEvento = document.getElementById('selEventos').value;
    if (textEvento || data) {
        if (validateValueEvent()) {
            var li = document.createElement('LI');
            if (data) {
                li.id = data.nombreEvento;
                evento.nombreEvento = data.nombreEvento;
                evento.metodos = data.metodos;
                evento.teclas = data.teclas;
            } else {
                li.id = textEvento.toString();
                evento.nombreEvento = textEvento.toString();
                evento.metodos = listaMetodos;
                evento.teclas = listaTeclas;
            }

            var img = document.createElement('IMG');
            img.src = "img/noExists.png";
            img.className = 'indicator';
            if (data) {
                img.setAttribute('onclick', "deleteValueEvento('" + theValuer.id + "','" + data.nombreEvento + "')");

            } else {
                img.setAttribute('onclick', "deleteValueEvento('" + theValuer.id + "','" + textEvento.toString() + "')");
            }
            li.appendChild(img);
            var label = document.createElement('LABEL');
            label.id = "get";
            var labelValor = document.createElement('LABEL');
            labelValor.id = "getValue";
            if (data) {
                labelValor.setAttribute("value", data.nombreEvento);
            } else {
                labelValor.setAttribute("value", textEvento.toString());
            }

            if (data) {
                label.textContent = data.nombreEvento;
                label.setAttribute("value", data.nombreEvento);
            } else {
                label.textContent = textEvento.toString();
                label.setAttribute("value", textEvento.toString());
            }

            

            li.appendChild(label);
            li.appendChild(labelValor);
            if (data) {
                for (var i = 0; i < data.metodos.length; i++) {
                    var li2 = document.createElement('LI');
                    li2.id = data.metodos[i].nombreMetodoFull;
                    li2.innerHTML = data.metodos[i].nombreMetodoFull;
                    li2.style.marginLeft = "15px";
                    li.appendChild(li2);
                }
            } else {
                if(listaMetodos.length>0){
                    for (var i = 0; i < listaMetodos.length; i++) {
                        var li2 = document.createElement('LI');
                        li2.id = listaMetodos[i].nombreMetodoFull;
                        li2.innerHTML = listaMetodos[i].nombreMetodoFull;
                        li2.style.marginLeft = "15px";
                        li.appendChild(li2);
                    }
                }
            }
            theValuer.appendChild(li);
            listaEventos[listaEventos.length] = evento;
            limpiarEventos();
        } else {
            alert("Este elemento esta repetido");
        }
    } else {
        alert("Llene los campos evento");
    }
}

function limpiarEventos() {
    document.getElementById('txtMetodo').value = "";
    document.getElementById('selMetodos').value = "";
    document.getElementById('selTeclas').value = "";
    document.getElementById('selTeclas').disabled = true;
    document.getElementById('btnAddTeclas').disabled = true;
    if (document.getElementById('contMetodos').childNodes.length > 0) {
        $('#contMetodos').empty();
    }
    if (document.getElementById('contTeclas').childNodes.length > 0) {
        $('#contTeclas').empty();
    }
    document.getElementById('contEventosFull').style.display = "";
    listaMetodos = new Array();
    listaTeclas = new Array();
}