var route = "";
var datosFields = {};
var listParametros = new Array();
var listParametrosAyM = new Array();
var listParametrosEliminar = new Array();
var listAcciones = new Array();
var listAccionesAyM = new Array();
var listAccionesEliminar = new Array();
var procesoOrigen;
var inModeParam = "a";
var inMode = "a";
var inModeAcciones = "a";
var idParametro;
var idAcciones;
var id;
var proces;
/*Start pagination*/
var items = 0, rowsByPage = 5, numbersByPage = 10,
        fromPage = 0, pagina = 0, totalPages;
var totalByPage = 3;
var start = 0, end = rowsByPage;
var expReg = {
    "Solo numeros enteros": "[0-9]+", "Solo Letras": "[A-Za-z]+", "Solo mayusculas": "[A-Z]+", "Solo minusculas": "[a-z]+",
    "Numeros decimales enteros": "^[0-9]{1,5}(\.[0-9]{0,2})?$", "Miles con decimales": "^\d{1,3}(,\d{3})*(\.\d+)?$",
    "Telefono movil 10 digitos": "[0-9]{10}", "Valida email": "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$",
    "Número de teléfono internacional": "^\(\+\d{2,3}\)\d{10}$", "Validar una página web": "^http[s]?:\/\/[\w]+([\.]+[\w]+)+$", "Numeros positivos y negativos enteros": "^-?[0-9]+",
    "Numeros positivos y negativos decimales": "^-?[0-9]+(\.\d{1,2})?$"
}
jQuery(document).ready(function () {
    //call origen datos
    inMode = "a";
    //document.getElementsByClassName("typeModes")[0].textContent = "Agregar";
    searchRango(0);
    //getMaxValue();
    llenarProceso();
    //addListeners();
    //getOrigenesDatos();
    //  pageMe({ pagerSelector: '#myPager', showPrevNext: true, hidePageNumbers: false, perPage: 3 });


});
function addListenerEnter() {
    var input = document.getElementById("txtTexto");
    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            var type = document.getElementById('txtTipoCapturaParam').value;
            if (type === "2") {
                addValue(false);
            } else if (type === "3") {
                addValue(true);
            }
        }
    });
}

function mostrarCaptura(mostrar) {
    if (mostrar) {
        document.getElementById('SelectCaptura').style.display = "none";
        document.getElementById('CapturaPrinci').style.display = "block";
    } else {
        document.getElementById('SelectCaptura').style.display = "block";
        document.getElementById('CapturaPrinci').style.display = "none";
        searchRango(0);
    }
}

function mostrarParametros(mostrar) {
    if (mostrar) {
        document.getElementById('CapturaPrinci').style.display = "none";
        document.getElementById('CapturaParam').style.display = "block";

    } else {
        document.getElementById('CapturaPrinci').style.display = "block";
        document.getElementById('CapturaParam').style.display = "none";
        inModeParam = "a";
    }
}

function mostrarAcciones(mostrar) {
    if (mostrar) {
        document.getElementById('CapturaPrinci').style.display = "none";
        document.getElementById('CapturaAccion').style.display = "block";

    } else {
        document.getElementById('CapturaPrinci').style.display = "block";
        document.getElementById('CapturaAccion').style.display = "none";
        inModeAcciones = "a";
    }
}

function cambiar() {
    var pdrs = document.getElementById('file-upload').files[0].name;
    document.getElementById('info').innerHTML = pdrs;
}

function limpiarCaptura() {
    document.getElementById('txtClave').value = "";
    document.getElementById('txtNombre').value = "";
    document.getElementById('txtEstado').value = null;
    document.getElementById('txtIdetiqueta').value = "";
    listParametros = new Array();
    listParametrosAyM = new Array();
    listParametrosEliminar = new Array();
    listAcciones = new Array();
    listAccionesAyM = new Array();
    listAccionesEliminar = new Array();
    $('#tableParametros').find("tr:gt(0)").remove();
    $('#tableAccion').find("tr:gt(0)").remove();
    inMode = "a";
    mostrarCaptura(false);

}

function limpiarAcciones(islimpiar) {
    document.getElementById('txtClaveAccion').value = "";
    document.getElementById('txtDescripcionAccion').value = "";
    document.getElementById('txtEstadoAccion').value = null;
    document.getElementById('txtIdEtiquetaAccion').value = "";
    document.getElementById('txtRequeridoAccion').checked = false;
    document.getElementById('txtImagenAccion').value = "";
    if (islimpiar) {
        createPagination(listAcciones.length, "acciones");
        llenarTablaAcciones(0);
        mostrarAcciones(false);
    }
}

function limpiarParametros(islimpiar) {
    document.getElementById('txtCampoParam').value = "";
    document.getElementById('txtEstadoParam').value = null;
    document.getElementById('txtIdEtiquetaParam').value = "";
    document.getElementById('txtRequeridoParam').checked = false;
    document.getElementById('txtRangoParam').checked = false;
    document.getElementById('txttipoDeDatoParam').value = "";
    document.getElementById('txtCompAnchoParam').value = "";
    $('#txtTipoCapturaParam option:not(:first)').remove();
    $("#adapterType").empty();
    document.getElementById('adapterType').style.border = "";
    if (islimpiar) {
        createPagination(listParametros.length, "parametros");
        llenarTablaParametros(0);
        mostrarParametros(false);
    }

}

function changeDataType(type) {
    var typeCap = document.getElementById('txtTipoCapturaParam');
    if (type === "0") {//Relacion
        $('#txtTipoCapturaParam option:not(:first)').remove();
        var option = document.createElement('option');
        option.value = "4"
        option.innerHTML = "Origen de datos";
        typeCap.add(option);
        typeCap.value = "4";
        typeCap.disabled = true;
    } else if (type === "1") {//Texto
        $('#txtTipoCapturaParam option:not(:first)').remove();
        var option = document.createElement('option');
        option.value = "1"
        option.innerHTML = "Libre";
        typeCap.add(option);
        var option2 = document.createElement('option');
        option2.value = "2"
        option2.innerHTML = "Lista";
        typeCap.add(option2);
        var option3 = document.createElement('option');
        option3.value = "3"
        option3.innerHTML = "Equivalencia";
        typeCap.add(option3);
        typeCap.value = "1";
        typeCap.disabled = false;
    }
    else if (type === "2") {//Entero
        $('#txtTipoCapturaParam option:not(:first)').remove();
        var option = document.createElement('option');
        option.value = "1"
        option.innerHTML = "Libre";
        typeCap.add(option);
        var option2 = document.createElement('option');
        option2.value = "2"
        option2.innerHTML = "Lista";
        typeCap.add(option2);
        var option3 = document.createElement('option');
        option3.value = "3"
        option3.innerHTML = "Equivalencia";
        typeCap.add(option3);
        typeCap.value = "1";
        typeCap.disabled = false;
    } else if (type === "3") {//Double
        $('#txtTipoCapturaParam option:not(:first)').remove();
        var option = document.createElement('option');
        option.value = "1"
        option.innerHTML = "Libre";
        typeCap.add(option);
        var option2 = document.createElement('option');
        option2.value = "2"
        option2.innerHTML = "Lista";
        typeCap.add(option2);
        var option3 = document.createElement('option');
        option3.value = "3"
        option3.innerHTML = "Equivalencia";
        typeCap.add(option3);
        typeCap.value = "1";
        typeCap.disabled = false;

    } else if (type === "4") {//Fecha
        $('#txtTipoCapturaParam option:not(:first)').remove();
        var option = document.createElement('option');
        option.value = "1"
        option.innerHTML = "Libre";
        typeCap.add(option);
        var option2 = document.createElement('option');
        option2.value = "2"
        option2.innerHTML = "Lista";
        typeCap.add(option2);
        typeCap.value = "1";
        typeCap.disabled = false;
    } else if (type === "5") {//Boleano
        $('#txtTipoCapturaParam option:not(:first)').remove();
        var option = document.createElement('option');
        option.value = "1"
        option.innerHTML = "Libre";
        typeCap.add(option);
        typeCap.value = "1";
        typeCap.disabled = true;
    } else if (type = "6") {//Tiempo
        $('#txtTipoCapturaParam option:not(:first)').remove();
        var option = document.createElement('option');
        option.value = "1"
        option.innerHTML = "Libre";
        typeCap.add(option);
        var option2 = document.createElement('option');
        option2.value = "2"
        option2.innerHTML = "Lista";
        typeCap.add(option2);
        typeCap.value = "1";
        typeCap.disabled = false;
    }

    if (typeCap) {
        createTypeCaptura(typeCap.value);
    }
}

function createTypeCaptura(type) {
    var adapter = document.getElementById('adapterType');
    adapter.style.border = "dotted gray";
    $("#adapterType").empty();
    var br = document.createElement('br');
    if (type === "1") {
        var divGroup = document.createElement('DIV');
        divGroup.className = "mainPanelDivGruop";
        var label = document.createElement('LABEL');
        label.innerHTML = "Máximo de caracteres";
        divGroup.appendChild(label);
        var textBox = document.createElement('INPUT');
        textBox.id = "txtLibre";
        textBox.type = "text";
        textBox.name = "txtLibre";
        textBox.value = "255";
        textBox.style.display = "block";
        adapter.appendChild(textBox);
        divGroup.appendChild(textBox);
        var label2 = document.createElement('LABEL');
        label2.innerHTML = "Expresión regular";
        divGroup.appendChild(label2);
        var divSelect = document.createElement('DIV');
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
        textBox2.type = "text";
        textBox2.name = "txtRegular";
        textBox2.style.display = "block";
        textBox2.style.width = "100%";
        textBox2.disabled = true;
        divGroup.appendChild(textBox2);
        adapter.appendChild(divGroup);
        llenarExpre();
    }
    else if (type === "2") {
        var divGroup = document.createElement('DIV');
        divGroup.className = "mainPanelDivGruop";
        var label = document.createElement('LABEL');
        label.innerHTML = "Valores";
        divGroup.appendChild(label);
        divGroup.appendChild(br);
        var tipoDato = document.getElementById('txttipoDeDatoParam').value;
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
    }
    else if (type === "3") {
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
    }
    else if (type === "4") {
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
        //var label3 = document.createElement('LABEL');
        //label3.innerHTML = "Campos adicionales:";
        //divGroup.appendChild(label3);
        //divGroup.appendChild(document.createElement("br"));
        //var selectField2 = document.createElement("SELECT");
        //selectField2.id = "cbxValor2";
        //divSelect3.appendChild(selectField2);
        //divGroup.appendChild(divSelect3);
        //var btn = document.createElement('BUTTON');
        //btn.id = 'btnAddValuesAdic';
        //btn.className = 'btnAddValues defaultButton';
        //btn.setAttribute('onclick', "addValueOrigenAdic()");
        //var t = document.createTextNode('+');
        //btn.appendChild(t);
        //btn.style.cssFloat = "left";
        //btn.style.padding = "1.5% 2%";
        //btn.style.marginLeft = "0.5%";
        //divGroup.appendChild(btn);
        //var btn2 = document.createElement('BUTTON');
        //btn2.id = 'btnAddAllValuesAdic';
        //btn2.className = 'btnAddAllValuesAdic defaultButton';
        //btn2.setAttribute('onclick', "addValuesAllOrigenAdic()");
        //btn2.style.cssFloat = "left";
        //btn2.style.padding = "1.5% 2%";
        //btn2.style.marginLeft = "0.5%";
        //var t = document.createTextNode('+ Todos');
        //btn2.appendChild(t);
        //divGroup.appendChild(btn2);
        //var listWrap2 = document.createElement('DIV');
        //listWrap2.className = 'listWrapper';
        //listWrap2.style.width = "50%";
        ////listWrap2.style.border = "thin dotted";
        //var ul2 = document.createElement('UL');
        //ul2.id = "valuerAdic";
        //listWrap2.appendChild(ul2);
        //divGroup.appendChild(listWrap2);
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
    } else {
        adapter.style.border = "";
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

function validarTipoDato(e, input) {
    var key = e.keyCode || e.which;

    // var teclado = String.fromCharCode(key);
    var tipoDato = document.getElementById('txttipoDeDatoParam').value;
    if (tipoDato === "2") {
        if (key < 48 || key > 57) {
            return false;
        }
        //var numero = "0123456789";
        //if (numero.indexOf(teclado) === -1) {
        //    return false;
        //}
    } else if (tipoDato === "3") {
        // var key = window.Event ? evt.which : evt.keyCode;
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

function getOrigenesDatos() {
    showWait();
    var getData = "";
    var url = route + "/api/FuenteDatos/getOrigenDatos";
    //var dataToPost = JSON.stringify(clave);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        getData = Mensaje.resultado;
    }
    removeWait();
    if (getData) {
        return getData;
    }
}

function showWait() {
    var div = document.createElement('div');
    div.setAttribute("id", "loadingWait");
    var img = document.createElement('img');
    img.src = 'img/loadingWait.gif';
    div.style.cssText = 'position: fixed; top: 50%; left: 50%; z-index: 5000;\n\
                    -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);';
    div.appendChild(img);
    document.body.appendChild(div);
}

function removeWait() {
    document.getElementById("loadingWait").remove();
}

function addOrigenesTablaCaptura(data) {
    $('#cbxOrigenDatosTipoCaptura').append($('<option>',
            {
                value: "",
                text: ""
            }));
    for (var i = 0; i < data.length; i++) {
        $('#cbxOrigenDatosTipoCaptura').append('<option value=' + data[i]['id'] + '|' + data[i]['nombre'] + '>' + (i + 1) + ".- " + data[i]['nombre'] + '</option>');
    }
}

function addCamposByFuente(fuente) {
    fuente = fuente.split('|');
    var data = getCampoOrigen(fuente[1], true);
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

function getCampoOrigen(fuente, withGetData) {
    var getData = "";
    withGetData = (withGetData === undefined) ? false : withGetData;
    showWait();
   
    var url = route + "/api/CamposOrigenDatos/CamposPorOrigen";
    var dataToPost = JSON.stringify(fuente);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        //Este construira la fuente del lado izquierdo con -° °- °°
        if (withGetData) {
            getData = Mensaje.resultado;
        } else {
            setPropFields(Mensaje.resultado);
        }
    }
    removeWait(); 
    if (getData) {
        return getData;
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
        var tipodatoPrin = document.getElementById('txttipoDeDatoParam').value;
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

function deleteValue(element, value) {
    // document.getElementById(value).remove();
    $('#' + element.toString()).children("#" + value.toString()).remove();
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

function addValuesAllOrigenAdic() {
    $('#valuerAdic').empty()
    $("#cbxValor2 > option").each(function () {
        addValueOrigenAdic(this.value);
    });

}

function agregarParametro() {
    if (inModeParam === "a") {
        if (document.getElementById('txtCampoParam').value !== "" && document.getElementById('txtEstadoParam').value !== "") {
            var param = {};
            param['id'] = listParametros.length + 1 + document.getElementById('txtCampoParam').value;
            param['campo'] = document.getElementById('txtCampoParam').value;
            param['estado'] = document.getElementById('txtEstadoParam').value;
            param['requerido'] = document.getElementById('txtRequeridoParam').checked === true ? true : false;;
            param['capturaRango'] = document.getElementById('txtRangoParam').checked === true ? true : false;;
            param['idEtiqueta'] = document.getElementById('txtIdEtiquetaParam').value;
            param['tipoDeDato'] = document.getElementById('txttipoDeDatoParam').value;
            param['compAncho'] = document.getElementById('txtCompAnchoParam').value;
            var tipoCap = document.getElementById("txtTipoCapturaParam").value.toString();
            var configTipCap = createConfigTipoCap(tipoCap);
            param['configuracionTipoCaptura'] = JSON.stringify(configTipCap);;
            listParametros[listParametros.length] = param;
            listParametrosAyM[listParametrosAyM.length] = param;
            var confirma = confirm("¿Quieres seguir agregando?");
            if (confirma) {
                limpiarParametros(false);
                inModeParam = "a";
            } else {


                limpiarParametros(true);
                llenarTablaParametros(0);
            }

        } else {

            alert("el campo clave o estado estan vacios");
        }
    } else {
        updateDetalles(idParametro, true, false);
        llenarTablaParametros(0);
    }
}

function agregarAccion() {
    if (inModeAcciones === "a") {
        if (document.getElementById('txtDescripcionAccion').value !== "" && document.getElementById('txtEstadoAccion').value !== "") {
            var accion = {};
            accion['id'] = listAcciones.length + 1 + document.getElementById('txtDescripcionAccion').value;
            accion['clave'] = document.getElementById('txtClaveAccion').value;
            accion['descripcion'] = document.getElementById('txtDescripcionAccion').value;
            accion['estado'] = document.getElementById('txtEstadoAccion').value;
            accion['requerido'] = document.getElementById('txtRequeridoAccion').checked === true ? true : false;
            accion['idEtiqueta'] = document.getElementById('txtIdEtiquetaAccion').value;
            accion['rutaImagen'] = document.getElementById('txtImagenAccion').value;
            listAcciones[listAcciones.length] = accion;
            listAccionesAyM[listAccionesAyM.length] = accion;
            var confirma = confirm("¿Quieres seguir agregando?");
            if (confirma) {
                limpiarAcciones(false)
                inModeAcciones = "a";
            } else {
                limpiarAcciones(true);
                llenarTablaAcciones(0);
            }
        } else {

            alert("el campo descripcion o estado estan vacios");
        }
    } else {
        updateDetalles(idAcciones, false, true);
        llenarTablaAcciones(0);
    }
}

function updateDetalles(id, isParam, isAccion) {
    var exito = false;
    if (isParam) {
        for (var i = 0; i < listParametros.length; i++) {
            if (id === listParametros[i]['id']) {
                exito = true;
                listParametros[i]['campo'] = document.getElementById('txtCampoParam').value;
                listParametros[i]['estado'] = document.getElementById('txtEstadoParam').value;
                listParametros[i]['requerido'] = document.getElementById('txtRequeridoParam').checked === true ? true : false;;
                listParametros[i]['capturaRango'] = document.getElementById('txtRangoParam').checked === true ? true : false;;
                listParametros[i]['idEtiqueta'] = document.getElementById('txtIdEtiquetaParam').value;
                listParametros[i]['tipoDeDato'] = document.getElementById('txttipoDeDatoParam').value;
                listParametros[i]['compAncho'] = document.getElementById('txtCompAnchoParam').value;
                var tipoCap = document.getElementById("txtTipoCapturaParam").value.toString();
                var configTipCap = createConfigTipoCap(tipoCap);
                listParametros[i]['configuracionTipoCaptura'] = JSON.stringify(configTipCap);
                var entro = true;
                for (var k = 0; k < listParametrosAyM.length; k++) {
                    if (listParametrosAyM[k]['id'] === listParametros[i]['id']) {
                        listParametrosAyM[k] = listParametros[i];
                        entro = false;
                        break;
                    }
                }
                if (entro) {
                    listParametrosAyM[listParametrosAyM.length] = listParametros[i];
                }
                break;
            }
        }
        if (exito) {
            alert("Actualizado correctamete");
            inModeParam = "a";
            limpiarParametros(true);
            createPagination(listParametros.length, "parametros");
        }
    }
    if (isAccion) {
        for (var i = 0; i < listAcciones.length; i++) {
            if (id === listAcciones[i]['id']) {
                exito = true;
                listAcciones[i]['clave'] = document.getElementById('txtClaveAccion').value;
                listAcciones[i]['descripcion'] = document.getElementById('txtDescripcionAccion').value;
                listAcciones[i]['estado'] = document.getElementById('txtEstadoAccion').value;
                listAcciones[i]['requerido'] = document.getElementById('txtRequeridoAccion').checked === true ? true : false;
                listAcciones[i]['idEtiqueta'] = document.getElementById('txtIdEtiquetaAccion').value;
                listAcciones[i]['rutaImagen'] = document.getElementById('txtImagenAccion').value;
                var entro = true;
                for (var k = 0; k < listAccionesAyM.length; k++) {
                    if (listAccionesAyM[k]['id'] === listAcciones[i]['id']) {
                        listAccionesAyM[k] = listAcciones[i];
                        entro = false;
                        break;
                    }
                }
                if (entro) {
                    listAccionesAyM[listAccionesAyM.length] = listAcciones[i];
                }
            }
        }
        if (exito) {
            alert("Actualizado correctamete");
            inModeAcciones = "a";
            limpiarAcciones(true);
        }
    }


}

function deleteDetalles(id, isParam, isAccion) {

    if (isParam) {
        var exito = false;
        for (var i = 0; i < listParametros.length; i++) {
            if (id === listParametros[i]['id']) {
                for (var k = 0; k < listParametrosAyM.length; k++) {
                    if (id === listParametrosAyM[k]['id']) {
                        listParametrosAyM.splice(k, 1);
                        break;
                    }
                }
                if (Number.isInteger(listParametros[k]['id'])) {
                    listParametrosEliminar[listParametrosEliminar.length] = listParametros[i]['id'];
                }

                listParametros.splice(i, 1);
                exito = true;
                break;
            }
        }
        if (exito) {
            createPagination(listParametros.length, "parametros");
            llenarTablaParametros(0);
            alert("Eliminado correctamente");
            inModeParam = "a";
        }
    }
    if (isAccion) {
        var exito = false;
        for (var i = 0; i < listAcciones.length; i++) {
            if (id === listAcciones[i]['id']) {
                for (var k = 0; k < listAccionesAyM.length; k++) {
                    if (id === listAccionesAyM[k]['id']) {
                        listAccionesAyM.splice(k, 1);
                        break;
                    }
                }
                if (Number.isInteger(listAcciones[k]['id'])) {
                    listAccionesEliminar[listAccionesEliminar.length] = listAcciones[i]['id'];
                }
                // listAccionesEliminar[listAccionesEliminar.length] = listAcciones[i];
                listAcciones.splice(i, 1);
                exito = true;
                break;
            }
        }
        if (exito) {
            createPagination(listAcciones.length, "acciones");
            llenarTablaAcciones(0);
            // alert("Eliminado correctamente");
            inModeAcciones = "a";
        }
    }
}

function searchDetalles(id, isParam, isAccion) {
    var exito = false;
    if (isParam) {
        for (var i = 0; i < listParametros.length; i++) {
            if (id === listParametros[i]['id']) {
                exito = true;
                if (inModeParam === "u") {
                    setPropertieParam(listParametros[i]);
                }
                idParametro = listParametros[i]['id'];
                break;
            }
        }
        if (exito && inModeParam === "u") {
            mostrarParametros(true);
        } else if (exito && inModeParam === "d") {
            var confirmar = confirm("¿Quiere eliminar el parametro?");
            if (confirmar) {
                deleteDetalles(idParametro, isParam, isAccion);
            }

        }
    }

    if (isAccion) {
        for (var i = 0; i < listAcciones.length; i++) {
            if (id === listAcciones[i]['id']) {
                exito = true;
                if (inModeAcciones === "u") {
                    setPripertieAccion(listAcciones[i]);
                }
                idAcciones = listAcciones[i]['id'];
                break;

            }
        }
        if (exito && inModeAcciones === "u") {
            mostrarAcciones(true);
        } else if (exito && inModeAcciones === "d") {
            var confirmar = confirm("¿Quiere eliminar la accion?");
            if (confirmar) {
                deleteDetalles(idAcciones, isParam, isAccion);
            }
        }
    }
}

function llenarTablaParametros(start) {


    var tbl = document.getElementById('tableParametros');
    $('#tableParametros').find("tr:gt(0)").remove();

    var dataLength = listParametros.length;
    var fin;
    if (dataLength > rowsByPage) {
        var res = (rowsByPage + start) - dataLength;
        if (res > 0) {
            fin = (rowsByPage + start) - res;
        } else {
            fin = rowsByPage + start;
        }

    } else {
        fin = dataLength;
    }

    for (var i = start; i < fin; i++) {
        var valueId = listParametros[i]['id'];
        var tr = document.createElement('tr');
        tr.id = valueId;
        var sizeColumns = tbl.rows[0].cells;
        var columnsLength = sizeColumns.length - 2;
        var td = null;
        for (var k = 0; k < columnsLength; k++) {
            td = document.createElement('td');
            if (sizeColumns[k].getAttribute('fieldsource') === "estado") {
                if (listParametros[i][sizeColumns[k].getAttribute('fieldsource')] === "true" || listParametros[i][sizeColumns[k].getAttribute('fieldsource')] === true) {
                    td.appendChild(document.createTextNode("Disponible"));
                } else {
                    td.appendChild(document.createTextNode("No Disponible"));
                }
            } else if (sizeColumns[k].getAttribute('fieldsource') === "tipoDeDato") {
                if (listParametros[i][sizeColumns[k].getAttribute('fieldsource')] === "1") {
                    td.appendChild(document.createTextNode("Texto"));
                } else if (listParametros[i][sizeColumns[k].getAttribute('fieldsource')] === "2") {
                    td.appendChild(document.createTextNode("Entero"));
                } else if (listParametros[i][sizeColumns[k].getAttribute('fieldsource')] === "3") {
                    td.appendChild(document.createTextNode("Double"));
                } else if (listParametros[i][sizeColumns[k].getAttribute('fieldsource')] === "4") {
                    td.appendChild(document.createTextNode("Fecha"));
                } else if (listParametros[i][sizeColumns[k].getAttribute('fieldsource')] === "5") {
                    td.appendChild(document.createTextNode("Boleano"));
                } else if (listParametros[i][sizeColumns[k].getAttribute('fieldsource')] === "6") {
                    td.appendChild(document.createTextNode("Tiempo"));
                } else {
                    td.appendChild(document.createTextNode("Relacion"));
                }
            } else if (sizeColumns[k].getAttribute('fieldsource') === "configuracionTipoCaptura") {
                if (listParametros[i][sizeColumns[k].getAttribute('fieldsource')]) {
                    var config = JSON.parse(listParametros[i][sizeColumns[k].getAttribute('fieldsource')]);
                    if (config["tipoCaptura"] === "1") {
                        td.appendChild(document.createTextNode("Libre"));
                    } else if (config["tipoCaptura"] === "2") {
                        td.appendChild(document.createTextNode("Lista"));
                    } else if (config["tipoCaptura"] === "3") {
                        td.appendChild(document.createTextNode("Equivalencia"));
                    } else {
                        td.appendChild(document.createTextNode("Origen de datos"));
                    }
                }
            } else {
                td.appendChild(document.createTextNode(listParametros[i][sizeColumns[k].getAttribute('fieldsource')]));
            }

            tr.appendChild(td);
        }
        //Default buttons for Details
        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Editar");
        a.appendChild(linkText);
        if (Number.isInteger(valueId)) {
            a.href = "javascript:editObjectDetalles(" + valueId + "," + true + "," + false + ");";
        } else {
            a.href = "javascript:editObjectDetalles('" + valueId + "'," + true + "," + false + ");";
        }
        td.appendChild(a);
        tr.appendChild(td);
        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Eliminar");
        a.appendChild(linkText);
        if (Number.isInteger(valueId)) {
            a.href = "javascript:deleteObjectDetalles(" + valueId + "," + true + "," + false + ");";
        } else {
            a.href = "javascript:deleteObjectDetalles('" + valueId + "'," + true + "," + false + ");";
        }
        td.appendChild(a);
        tr.appendChild(td);
        tbl.appendChild(tr);
    }
}

function llenarTablaAcciones(start) {


    var tbl = document.getElementById('tableAccion');
    $('#tableAccion').find("tr:gt(0)").remove();

    var dataLength = listAcciones.length;
    var fin;
    if (dataLength > rowsByPage) {
        var res = (rowsByPage + start) - dataLength;
        if (res > 0) {
            fin = (rowsByPage + start) - res;
        } else {
            fin = rowsByPage + start;
        }

    } else {
        fin = dataLength;
    }

    for (var i = start; i < fin; i++) {
        var valueId = listAcciones[i]['id'];
        var tr = document.createElement('tr');
        tr.id = valueId;
        var sizeColumns = tbl.rows[0].cells;
        var columnsLength = sizeColumns.length - 2;
        var td = null;
        for (var k = 0; k < columnsLength; k++) {
            td = document.createElement('td');
             if (sizeColumns[k].getAttribute('fieldsource') === "estado") {
                if (listAcciones[i][sizeColumns[k].getAttribute('fieldsource')] === "true" || listAcciones[i][sizeColumns[k].getAttribute('fieldsource')] === true) {
                    td.appendChild(document.createTextNode("Disponible"));
                } else {
                    td.appendChild(document.createTextNode("No Disponible"));
                }
            } else if (sizeColumns[k].getAttribute('fieldsource') === "tipoDeDato") {
                if (listAcciones[i][sizeColumns[k].getAttribute('fieldsource')] === "1") {
                    td.appendChild(document.createTextNode("Texto"));
                } else if (listAcciones[i][sizeColumns[k].getAttribute('fieldsource')] === "2") {
                    td.appendChild(document.createTextNode("Entero"));
                } else if (listAcciones[i][sizeColumns[k].getAttribute('fieldsource')] === "3") {
                    td.appendChild(document.createTextNode("Double"));
                } else if (listAcciones[i][sizeColumns[k].getAttribute('fieldsource')] === "4") {
                    td.appendChild(document.createTextNode("Fecha"));
                } else if (listAcciones[i][sizeColumns[k].getAttribute('fieldsource')] === "5") {
                    td.appendChild(document.createTextNode("Boleano"));
                } else if (listAcciones[i][sizeColumns[k].getAttribute('fieldsource')] === "6") {
                    td.appendChild(document.createTextNode("Tiempo"));
                } else {
                    td.appendChild(document.createTextNode("Relacion"));
                }
            } else {
                td.appendChild(document.createTextNode(listAcciones[i][sizeColumns[k].getAttribute('fieldsource')]));
            }

            tr.appendChild(td);
        }
        //Default buttons for Details
        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Editar");
        a.appendChild(linkText);
        if (Number.isInteger(valueId)) {
            a.href = "javascript:editObjectDetalles(" + valueId + "," + false + "," + true + ");";
        } else {
            a.href = "javascript:editObjectDetalles('" + valueId + "'," + false + "," + true + ");";
        }
        td.appendChild(a);
        tr.appendChild(td);
        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Eliminar");
        a.appendChild(linkText);
        if (Number.isInteger(valueId)) {
            a.href = "javascript:deleteObjectDetalles(" + valueId + "," + false + "," + true + ");";
        } else {
            a.href = "javascript:deleteObjectDetalles('" + valueId + "'," + false + "," + true + ");";
        }
        td.appendChild(a);
        tr.appendChild(td);
        tbl.appendChild(tr);
    }
}

function llenarTablaSelector(data) {


    var tbl = document.getElementById('tableSelector');
    $('#tableSelector').find("tr:gt(0)").remove();

    for (var i = 0; i < data.length; i++) {
        var value = data[i]['id'];
        var tr = document.createElement('tr');
        tr.id = value.toString();
        var sizeColumns = tbl.rows[0].cells;
        var columnsLength = sizeColumns.length - 2;
        for (var k = 0; k < columnsLength; k++) {
            if (k === 0) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]['clave']));
            } else if (k === 1) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]['nombre']));
            } else if (k === 2) {
                var td = document.createElement('td');
                if (data[i]['estado'] === true) {
                    td.appendChild(document.createTextNode("Disponible"));
                } else {
                    td.appendChild(document.createTextNode("No disponible"));
                }

            } else if (k === 3) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]['idEtiqueta']));
            }
            tr.appendChild(td);
        }
        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Editar");
        a.appendChild(linkText);
        a.href = "javascript:editObject(" + value + ");";
        td.appendChild(a);
        tr.appendChild(td);
        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Eliminar");
        a.appendChild(linkText);
        a.href = "javascript:deleteObject(" + value + ");";
        td.appendChild(a);
        tr.appendChild(td);
        tbl.appendChild(tr);
    }


}

function createConfigTipoCap(tipoCap) {
    var configTipCap = {};
    configTipCap.tipoCaptura = tipoCap;
    //if (isPassword) {
    //    configTipCap.isPassword = isPassword;
    //}
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
        var valueTipCap = getOrigenTipCap.options[getOrigenTipCap.selectedIndex].value.split('|');
        //var fieldKey = $("#cbxValor").attr("campollave");
        // var fieldKey = $("#cbxValor2").attr("campollave");
        var fieldValOne = $("ul#valuer li").eq(0).text();
        var fieldValTwo = $("ul#valuer li").eq(1).text();
        //.children('#get').text();
        //var fieldsAdic = [];
        //$("ul#valuerAdic li").each(function () {
        //    fieldsAdic.push(datosFields[$(this).attr('id')]);
        //});

        var assocArray = {
            "origen": valueTipCap[1],
            "origenID": valueTipCap[0],
            //"campollave": fieldKey,
            "campovalor1": fieldValOne,
            "campovalor2": fieldValTwo
        };

        //if (fieldsAdic.length > 0) {
        //    assocArray['camposAdicionales'] = fieldsAdic;
        //    // or assocArray.camposAdicionales = fieldsAdic;
        //}
        configTipCap.origenes = assocArray;
    }
    //var eventosArreglo = [];
    //$("ul#valuerEventos li").each(function () {
    //    var eventosArray = {};
    //    eventosArray['nombreMetodo'] = $(this).children('#get').attr("value");
    //    eventosArray['nombreEvento'] = $(this).children('#getValue').attr("value");
    //    eventosArreglo[eventosArreglo.length] = eventosArray;
    //});

    //if (eventosArreglo.length > 0) {
    //    configTipCap.eventos = eventosArreglo;
    //    console.log(configTipCap);
    //}
    return configTipCap;
}

function setPropertieParam(data) {
    var getProperties = data;
    document.getElementById("txtCampoParam").value = getProperties.campo;
    if (getProperties.estado === true || getProperties.estado === "true") {
        document.getElementById('txtEstadoParam').value = 'true';
    } else {
        document.getElementById('txtEstadoParam').value = 'false';
    }
    if (getProperties.requerido === true) {
        document.getElementById("txtRequeridoParam").checked = true;
    } else {
        document.getElementById('txtRequeridoParam').checked = false;
    }
    if (getProperties.capturaRango === true) {
        document.getElementById("txtRangoParam").checked = true;
    } else {
        document.getElementById('txtRangoParam').checked = false;
    }
    document.getElementById("txtIdEtiquetaParam").value = getProperties.idEtiqueta;
    var tipoDato = document.getElementById('txttipoDeDatoParam');
    tipoDato.value = getProperties.tipoDeDato;
    changeDataType(tipoDato.value);
    document.getElementById('txtCompAnchoParam').value = getProperties.compAncho;
    if (getProperties.configuracionTipoCaptura) {
        var infoCnfCap = JSON.parse(getProperties.configuracionTipoCaptura);
        var type = document.getElementById('txtTipoCapturaParam').value = infoCnfCap.tipoCaptura;
        createTypeCaptura(type);
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
            var fontTipCap = document.getElementById("cbxOrigenDatosTipoCaptura").value = origenes.origenID + '|' + origenes.origen;
            addCamposByFuente(fontTipCap);
            if (origenes.campovalor1) {
                addValueOrigen(origenes.campovalor1);
            }
            if (origenes.campovalor2) {
                addValueOrigen(origenes.campovalor2);
            }
            //if (origenes.camposAdicionales) {
            //    var valuesAdic = origenes.camposAdicionales;
            //    var arrayLength = origenes.camposAdicionales.length;
            //    for (var i = 0; i < arrayLength; i++) {
            //        addValueOrigenAdic(valuesAdic[i]);
            //    }
            //}
        }
        //if (infoCnfCap.eventos) {
        //    var datos = infoCnfCap.eventos;
        //    for (var i = 0; i < datos.length; i++) {
        //        addValueEvento(datos[i]);
        //    }
        //}
    } else {
        // $("#tipoCaptura").val("");
        //$('#adapterType').empty();
        // $('#adapterType').attr('style', '');
    }


}

function setPripertieAccion(data) {
    var getProperties = data;
    document.getElementById("txtDescripcionAccion").value = getProperties.descripcion;
    document.getElementById("txtClaveAccion").value=getProperties.clave;
    if (getProperties.estado === true || getProperties.estado === "true") {
        document.getElementById('txtEstadoAccion').value = 'true';
    } else {
        document.getElementById('txtEstadoAccion').value = 'false';
    }
    if (getProperties.requerido === true) {
        document.getElementById("txtRequeridoAccion").checked = true;
    } else {
        document.getElementById('txtRequeridoAccion').checked = false;
    }
    document.getElementById("txtIdEtiquetaAccion").value = getProperties.idEtiqueta;
    document.getElementById("txtImagenAccion").value = getProperties.rutaImagen;

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

function editObjectDetalles(id, isParam, isAccion) {

    if (isParam) {
        inModeParam = "u";
    }
    if (isAccion) {
        inModeAcciones = "u";
    }
    searchDetalles(id, isParam, isAccion);
}

function deleteObjectDetalles(id, isParam, isAccion) {
    if (isParam) {
        inModeParam = "d";
    }
    if (isAccion) {
        inModeAcciones = "d";
    }
    searchDetalles(id, isParam, isAccion);
}

function editObject(id) {
    inMode = "u";
    searchPorIdProceso(id);
}

function deleteObject(id) {
    inMode = "d";
    searchPorIdProceso(id);
}

function getPropertieCaptura() {
    var objPrin = {};
    var objParam = {};
    var objAccion = {};
    if (inMode === "a") {
        var obj = {};
        obj['clave'] = document.getElementById('txtClave').value;
        obj['nombre'] = document.getElementById('txtNombre').value;
        obj['estado'] = document.getElementById('txtEstado').value;
        obj['idEtiqueta'] = document.getElementById('txtIdetiqueta').value;
        for (var i = 0; i < listParametrosAyM.length; i++) {
            if (!Number.isInteger(listParametrosAyM[i]['id'])) {
                listParametrosAyM[i]['id'] = 0;
            }
        }
        obj['parametrosProcesoOrigen'] = listParametrosAyM;
        for (var i = 0; i < listAccionesAyM.length; i++) {
            if (!Number.isInteger(listAccionesAyM[i]['id'])) {
                listAccionesAyM[i]['id'] = 0;
            }
        }
        obj['accionesProcesoOrigen'] = listAccionesAyM;
        objPrin['ProcesoOrigen'] = obj;
    } else if (inMode === "u") {
        procesoOrigen['nombre'] = document.getElementById('txtNombre').value;
        procesoOrigen['estado'] = document.getElementById('txtEstado').value;
        procesoOrigen['idEtiqueta'] = document.getElementById('txtIdetiqueta').value;
        for (var i = 0; i < listParametrosAyM.length; i++) {
            if (!Number.isInteger(listParametrosAyM[i]['id'])) {
                listParametrosAyM[i]['id'] = 0;
            }
        }
        procesoOrigen['parametrosProcesoOrigen'] = listParametrosAyM;
        for (var i = 0; i < listAccionesAyM.length; i++) {
            if (!Number.isInteger(listAccionesAyM[i]['id'])) {
                listAccionesAyM[i]['id'] = 0;
            }
        }
        procesoOrigen['accionesProcesoOrigen'] = listAccionesAyM;

        objPrin['ProcesoOrigen'] = procesoOrigen;
        if (listParametrosEliminar.length > 0) {
            objPrin['deleteParam'] = listParametrosEliminar;
        }
        if (listAccionesEliminar.length > 0) {
            objPrin['deleteAcciones'] = listAccionesEliminar;
        }
    }

    return objPrin;
}

function setPropertieCaptura(data) {

    document.getElementById('txtClave').value = data['clave'];
    document.getElementById('txtNombre').value = data['nombre'];
    if (data['estado'] === true) {
        document.getElementById('txtEstado').value = 'true';
    } else {
        document.getElementById('txtEstado').value = 'false';
    }
    document.getElementById('txtIdetiqueta').value = data['idEtiqueta'];
    listParametros = data['parametrosProcesoOrigen'];
    createPagination(listParametros.length, "parametros");
    llenarTablaParametros(0);
    listAcciones = data['accionesProcesoOrigen'];
    createPagination(listAcciones.length, "acciones");
    llenarTablaAcciones(0);

}

function save() {
    var valor = getPropertieCaptura();
    var getData = "";
    var url = route + "/api/ProcesoOrigen/Save";
    var dataToPost = JSON.stringify(valor);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        alert("Datos guardados exitosamente");
        searchRango(0);
        limpiarCaptura();
    }
 }

function searchRango(startin) {
    var nameselements = new Array();
    nameselements[0] = startin;
    nameselements[1] = rowsByPage;
    showWait();
    var getData = "";
    var url = route + "/api/ProcesoOrigen/SearchRangos";
    var dataToPost = JSON.stringify(nameselements);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        if (startin === 0) {
            createPagination(Mensaje.resultado[1], "captura");
        }
        llenarTablaSelector(Mensaje.resultado[0]);
    }
    removeWait();

}

function searchPorIdProceso(id) {
    var getData = "";
    var url = route + "/api/ProcesoOrigen/SearchPorIdProceso";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        id = Mensaje.resultado['id'];
        procesoOrigen = Mensaje.resultado;
        setPropertieCaptura(Mensaje.resultado);
        mostrarCaptura(true);
        if (inMode === "d") {
            var answer = confirm("¿Quieres eliminar esta configuración?")
            if (answer) {
                //var object = crearObjeto(Mensaje.resultado);
                deleteProceso(Mensaje.resultado);
                limpiarCaptura(true);
                searchRango(0);
            }
            else {
                //clearObjetos();
            }
        }
    }
}

function deleteProceso(data) {
    
    var url = route + "/api/ProcesoOrigen/DeleteProceso";
    var dataToPost = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        alert("Datos eliminados exitosamente");
    }
    
}

function createPagination(numberData, origen) {
    var paginador = $("#listPag" + origen);
    paginador.attr("sourcePage", origen);
    paginador.attr("totaReg", numberData);

    paginador.html("");
    items = numberData;
    totalPages = Math.ceil(items / rowsByPage);

    $('<li><a href="#" class="first_link' + origen + '">&#9664;</a></li>').appendTo(paginador);
    $('<li><a href="#" class="prev_link' + origen + '">&laquo;</a></li>').appendTo(paginador);

    for (var b = 0; totalPages > b;)
        $('<li><a href="#" class="page_link' + origen + '">' + (b + 1) + "</a></li>").appendTo(paginador), b++;

    numbersByPage > 1 && ($(".page_link" + origen).hide(), $(".page_link" + origen).slice(0, numberData).show());

    $('<li><a href="#" class="next_link' + origen + '">&raquo;</a></li>').appendTo(paginador);
    $('<li><a href="#" class="last_link' + origen + '">&#9654;</a></li>').appendTo(paginador);

    0 == pagina && (paginador.find(".page_link" + origen + ":first").addClass("active"),
           paginador.find(".page_link" + origen + ":first").parents("li").addClass("active"));

    paginador.find(".prev_link" + origen).hide(),
    paginador.find("li .page_link" + origen).click(function () {
        var a = $(this).html().valueOf() - 1;
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .first_link" + origen).click(function () {
        var a = 0;
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .prev_link" + origen).click(function () {
        var a = parseInt(paginador.data("pag")) - 1;
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .next_link" + origen).click(function () {
        if (paginador.data("pag") === undefined) {
            a = 1;
        } else {
            a = parseInt(paginador.data("pag")) + 1;
        }
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .last_link" + origen).click(function () {
        items = paginador.attr("totaReg");
        totalPages = Math.ceil(items / rowsByPage);
        var a = totalPages - 1;
        return cargaPagina(a, paginador), !1;
    });
}

function cargaPagina(a, paginador) {
    var origen = paginador.attr("sourcePage");
    pagina = a;
    fromPage = pagina * rowsByPage;

    pagina >= 1 ? paginador.find(".prev_link" + origen).show() : paginador.find(".prev_link" + origen).hide();

    totalPages - 1 == pagina ? paginador.find(".next_link" + origen).hide() : paginador.find(".next_link" + origen).show(),
            paginador.data("pag", pagina), numbersByPage > 1 && ($(".page_link" + origen).hide(),
            totalPages - numbersByPage > pagina ? $(".page_link" + origen).slice(pagina, numbersByPage + pagina).show() :
            totalPages > numbersByPage ? $(".page_link" + origen).slice(totalPages - numbersByPage).show() :
            $(".page_link" + origen).slice(0).show()), paginador.children().removeClass("active"),
            paginador.children().eq(pagina + 2).addClass("active");

    if (origen === "captura") {
        searchRango(fromPage);
    } else if (origen === "parametros") {
        llenarTablaParametros(fromPage);
    } else {
        llenarTablaAcciones(fromPage);
    }
}

function getMaxValue() {
    var getData = "";
    var url = route + "/api/ConfiguracionCapturas/GetMaxValue";
    //var dataToPost = JSON.stringify(clave);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        var res = parseInt(Mensaje.resultado) + 1;
        document.getElementById("txtClave").value = res;
    }
}

function validarSiNumero(e) {
    var key = e.keyCode || e.which;
    if (key < 48 || key > 57) {
        return false;
    }
}

function llenarProceso() {
    var getData = "";
    var url = route + "/Resources/ProcesosDelSistema.json";
    var Mensaje = new Object();
    Mensaje.error = "";
    Mensaje.noError = "";
    Mensaje.resultado = Common.sendLocalFileRequestJson('GET', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
         proces = Mensaje.resultado.Procesos;

        for (var i = 0; i < proces.length; i++) {
            $('#txtProceso').append($("<option></option>")
                               .attr("value", proces[i].Referencia)
                               .text(proces[i].NombreMetodo));
        }
    }

}

function selectProceso(compo) {
    document.getElementById('txtClave').value = compo.value;
    document.getElementById('txtNombre').value = document.getElementById('txtProceso').options[compo.selectedIndex].innerHTML;
    $('#tableAccion').find("tr:gt(0)").remove();
    $('#tableParametros').find("tr:gt(0)").remove();
    listParametros = new Array();
    listAcciones = new Array();
    crearParametros(compo.value);
    crearAcciones(compo.value);
}

function crearParametros(refer) {
    var parametros;
    for (var k = 0; k < proces.length; k++) {
        if (proces[k].Referencia === refer) {
            parametros = proces[k].Parametros;
        }
    }
    console.log(parametros);

    for (var i = 0; i < parametros.length; i++) {
        var param = {};
        param['id'] = listParametros.length + 1 + parametros[i].Nombre;
        param['campo'] = parametros[i].Nombre;
        param['estado'] = false;
        param['requerido'] = document.getElementById('txtRequeridoParam').checked === true ? true : false;
        param['capturaRango'] = document.getElementById('txtRangoParam').checked === true ? true : false;;
        param['idEtiqueta'] = parametros[i].Nombre;
        param['tipoDeDato'] = parametros[i].TipoDato;
        param['compAncho'] = "";
        listParametros[listParametros.length] = param;
        listParametrosAyM[listParametrosAyM.length] = param;
        // var tipoCap = document.getElementById("txtTipoCapturaParam").value.toString();
        // var configTipCap = createConfigTipoCap(tipoCap);
        // param['configuracionTipoCaptura'] = JSON.stringify(configTipCap);;
    }

    createPagination(listParametros.length, "parametros");
    llenarTablaParametros(0);
}

function crearAcciones(refer) {
    var Acciones;
    for (var k = 0; k < proces.length; k++) {
        if (proces[k].Referencia === refer) {
            Acciones = proces[k].Acciones;
        }
    }
    console.log(Acciones);

    if (Acciones.length > 0) {
        for (var i = 0; i < Acciones.length; i++) {
            var accion = {};
            accion['id'] = listAcciones.length + 1 + Acciones[i].Nombre;
            accion['clave'] = Acciones[i].ReferenciaAccion;
            accion['descripcion'] = Acciones[i].Nombre;
            accion['estado'] = true;
            accion['requerido'] = document.getElementById('txtRequeridoAccion').checked === true ? true : false;
            accion['idEtiqueta'] = "";
            accion['rutaImagen'] = "";
            listAcciones[listAcciones.length] = accion;
            listAccionesAyM[listAccionesAyM.length] = accion;
        }
    }
    createPagination(listAcciones.length, "acciones");
    llenarTablaAcciones(0);
}

function selectAcciones(compo) {
    document.getElementById('txtReferenciaAccion').value = compo.value;
    document.getElementById('txtDescripcionAccion').value = document.getElementById('txtAcciones').options[compo.selectedIndex].innerHTML;
}