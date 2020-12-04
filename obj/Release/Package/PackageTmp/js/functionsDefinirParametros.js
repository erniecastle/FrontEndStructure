var route = "";
var inMode = "A";
/*Start pagination*/
var items = 0, rowsByPage = 10, numbersByPage = 15,
    fromPage = 0, pagina = 0, totalPages;
/*End pagination*/
var filterValues = null;
var parametro = {};
var listaParametros = new Array();
var listaElemetosAplicacion;
var listaElemtosPorParam = new Array();
var arraOpciones = new Array();
var contadorOpc = 1;
var tipoconfiguracion=0;
var propiedadConfig="";


jQuery(document).ready(function () {
    //call origen datos
    // searchAll();
    busquedaRangos(0);
    //getElementosAplicacion();
    $("#myFilter").on('change', function () {
        var selected = $("#myFilter").val().toString(); //here I get all options and convert to string
        var document_style = document.documentElement.style;
        if (selected !== "") {
            document.getElementById('txtElementoCap').value = "";
            var valores = selected.split(',');
            var texto = "";
            for (var k = 0; k < valores.length; k++) {
                for (var i = 0; i < listaElemetosAplicacion.length; i++) {
                    if (listaElemetosAplicacion[i].id === parseInt(valores[k])) {
                        listaElemtosPorParam[listaElemtosPorParam.length] = listaElemetosAplicacion[i];
                        if (k == 0) {
                            texto = listaElemetosAplicacion[i].clave + "-" + listaElemetosAplicacion[i].nombre;
                        } else {

                            texto = texto + "," + listaElemetosAplicacion[i].clave + "-" + listaElemetosAplicacion[i].nombre;
                        }
                        break;
                    }
                }
            }
            document.getElementById('txtElementoCap').value = texto;
            // document_style.setProperty('--text', "'" + selected + "'");
        } else {
            document.getElementById('txtElementoCap').value = "";
            document_style.setProperty('--text', "'Selecione el valor'");
        }
    });

   

    //$('#myFilter option').mousedown(function (e) { //no ctrl to select multiple
    //    e.preventDefault();
    //    $(this).prop('selected', $(this).prop('selected') ? false : true); //set selected options on click
    //    $(this).parent().change(); //trigger change event
    //});



    $("#txtClaveCap").keydown(function (e) {
        if (e.keyCode === 13 || e.keyCode === 9) {
            var obj = {};
            obj["Tabla"] = "Parametros";
            obj["Campo"] = "clave";
            obj["Valor"] = document.getElementById('txtClaveCap').value;
            exiteClave(obj);
        }
    });
});

function searchAll(tabla) {
    var resultado;
    // activarSelect = select;
    var url = route + "/api/SearchGenericAll";
    var dataToPost = JSON.stringify(tabla);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado != null) {
        resultado = Mensaje.resultado;
    }
    return resultado;
}

function getElementosAplicacion() {

    var resultado;
    // activarSelect = select;
    var url = route + "/api/DefinirParametros/getAllElementosAplicacion";
    // var dataToPost = JSON.stringify(tabla);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, null, false);
    if (Mensaje.resultado != null) {
        $('#myFilter option').remove();
        resultado = Mensaje.resultado;
        listaElemetosAplicacion = resultado;
        for (var i = 0; i < resultado.length; i++) {
            $('#myFilter').append('<option value=' + resultado[i].id + '>' + resultado[i].nombre + '</option>');
        }
        $('#myFilter option').mousedown(function (e) { //no ctrl to select multiple
            e.preventDefault();
            $(this).prop('selected', $(this).prop('selected') ? false : true); //set selected options on click
            $(this).parent().change(); //trigger change event
        });
        //console.log(resultado);
    }
    return resultado;
}

function search(id) {
    var url = route + "/api/DefinirParametros/getPorIdParametro";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        parametro = Mensaje.resultado;
        console.log(parametro);
        mostrarobject(parametro);
        var answer = confirm("¿Seguro que desea eliminar el registro?");
        if (answer) {
            eliminarParam(parametro);
            limpiar();
        } else {
            limpiar();
        }
    }
}

function mostrarobject(data) {

    mostrarCaptura(true);
    document.getElementById('txtClaveCap').value = data.clave;
    document.getElementById('txtNombreCap').value = data.nombre;

    if (data.tipoConfiguracion === 1) {
        $('#selValor option').remove();
        document.getElementById('DivGroupValorCap1').style.display = "none";
        document.getElementById('DivGroupValorCap2').style.display = "block";
        document.getElementById('DivGroupValorCap3').style.display = "none";
        document.getElementById('DivGroupValorCap4').style.display = "none";
        if (data.valor === "1") {
            document.getElementById('chkValorCap').checked = true;
        } else {
            document.getElementById('chkValorCap').checked = false;
        }
    } else if (data.tipoConfiguracion === 2) {
        $('#selValor option').remove();
        document.getElementById('DivGroupValorCap1').style.display = "none";
        document.getElementById('DivGroupValorCap2').style.display = "none";
        document.getElementById('DivGroupValorCap3').style.display = "block";
        document.getElementById('DivGroupValorCap4').style.display = "none";
        var valores = data.propiedadConfig.split('|');
        for (var k = 0; k < valores.length; k++) {

            $('#selValor').append('<option value=' + (k + 1) + '>' + valores[k] + '</option>');
        }

        document.getElementById('selValor').value = data.valor;
    } else if (data.tipoConfiguracion === 3) {
        $('#selValor option').remove();
        document.getElementById('DivGroupValorCap1').style.display = "none";
        document.getElementById('DivGroupValorCap2').style.display = "none";
        document.getElementById('DivGroupValorCap3').style.display = "block";
        document.getElementById('DivGroupValorCap4').style.display = "none";

        var valores = data.propiedadConfig.split('|');
        var res = searchAll(valores[0]);
        for (var i = 0; i < res.length; i++) {
            $('#selValor').append('<option value=' + res[i].id + '>' + res[i][valores[1].toLowerCase()] + "-" + res[i][valores[2].toLowerCase()] + '</option>');
        }
        console.log(res);
        document.getElementById('selValor').value = data.valor;
    } else if (data.tipoConfiguracion === 4) {
        $('#selValor option').remove();
        document.getElementById('DivGroupValorCap1').style.display = "block";
        document.getElementById('DivGroupValorCap2').style.display = "none";
        document.getElementById('DivGroupValorCap3').style.display = "none";
        document.getElementById('DivGroupValorCap4').style.display = "none";

        var valores = data.propiedadConfig.split('|');
        //^[0-9]{1,2}$|^[0-9]{1,2}\.[0-9]{1,2}$
        var patern;
        if (valores[0] !== "@" && valores[1] !== "@") {
            patern = "^[0-9]{1," + valores[0] + "}$|^[0-9]{1," + valores[1] + "}\.[0-9]{1," + valores[1] + "}$";
        } else if (valores[1] === "@") {
            patern = "^[0-9]{1," + valores[0] + "}$";
        }
        //var patern = "^[0-9]{1," + valores[0] + "}$|^[0-9]{1," + valores[1] + "}\.[0-9]{1," + valores[1] + "}$";
        document.getElementById('txtValorCap').setAttribute('pattern', patern);

        document.getElementById('txtValorCap').value = data.valor;

    } else if (data.tipoConfiguracion === 5) {
        $('#selValor option').remove();
        document.getElementById('DivGroupValorCap1').style.display = "block";
        document.getElementById('DivGroupValorCap2').style.display = "none";
        document.getElementById('DivGroupValorCap3').style.display = "none";
        document.getElementById('DivGroupValorCap4').style.display = "none";

        var valores = data.propiedadConfig.split('|');
        //^[0-9]{1,2}$|^[0-9]{1,2}\.[0-9]{1,2}$
        var patern;
        if (valores[0] !== "@" && valores[1] !== "@") {
            patern = "^[#]{1," + valores[0] + "}$|^[#]{1," + valores[1] + "}\.[#]{1," + valores[1] + "}$";
        } else if (valores[1] === "@") {
            patern = "^[#]{1," + valores[0] + "}$";
        }
        //var patern = "^[0-9]{1," + valores[0] + "}$|^[0-9]{1," + valores[1] + "}\.[0-9]{1," + valores[1] + "}$";
        document.getElementById('txtValorCap').setAttribute('pattern', patern);

        document.getElementById('txtValorCap').value = data.valor;
    } else if (data.tipoConfiguracion === 6) {
        $('#selValor option').remove();
        document.getElementById('txtValorCap').value = "";
        document.getElementById('chkValorCap').checked = false;
        document.getElementById('DivGroupValorCap1').style.display = "block";
        document.getElementById('DivGroupValorCap2').style.display = "none";
        document.getElementById('DivGroupValorCap3').style.display = "none";
        document.getElementById('DivGroupValorCap4').style.display = "none";
        document.getElementById('txtValorCap').setAttribute('maxlength', data.propiedadConfig);
        document.getElementById('txtValorCap').value = data.valor;
    }

    document.getElementById('txtInfoAdicCap').value = data.opcionesParametros;
    var textoElemetos = "";
    for (var i = 0; i < data.elementosAplicacion.length; i++) {
        if (i == 0) {
            textoElemetos = data.elementosAplicacion[i].clave + "-" + data.elementosAplicacion[i].nombre;
        } else {

            textoElemetos = textoElemetos + ", " + data.elementosAplicacion[i].clave + "-" + data.elementosAplicacion[i].nombre;
        }
        $("#myFilter option[value='" + data.elementosAplicacion[i].id.toString() + "']").prop("selected", true);
        // document.getElementById('myFilter').value = data.elementosAplicacion[i].id;
    }
    document.getElementById('txtElementoCap').value = textoElemetos;
    document.getElementById('selClasificacionCap').value = data.clasificacion;
    tipoconfiguracion = parametro.tipoConfiguracion;
    propiedadConfig = parametro.propiedadConfig;
   

}

function busquedaRangos(start, clasificacion) {
    var obj = {};
    obj.inicio = start;
    obj.fin = rowsByPage;
    if (clasificacion !== undefined) {
        obj.clasificacion = clasificacion;
    }
    var url = route + "/api/DefinirParametros/busquedaRangos";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No hay información para esta tabla");
    } else {

        if (start === 0) {
            createPagination(Mensaje.resultado[0]);
        }
        llenarTablaSel(Mensaje.resultado[1]);
    }
}

function buscarPorClasificacion(value) {

    busquedaRangos(0, value);
}

function llenarTablaSel(data) {
    var tbl = document.getElementById("tableSelector");
    $('#tableSelector').find("tr:gt(0)").remove();
    for (var i = 0; i < data.length; i++) {
        var valueId = data[i]['id'];
        var tr = document.createElement('tr');
        tr.id = valueId.toString();

        var sizeColumns = tbl.rows[0].cells;
        var columnsLength = sizeColumns.length - 2;

        for (var k = 0; k < columnsLength; k++) {
            if (sizeColumns[k].id == "clave") {
                td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]["clave"]));
                tr.appendChild(td);
            } else if (sizeColumns[k].id === "nombre") {
                td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]["nombre"]));
                tr.appendChild(td);
            } else if (sizeColumns[k].id === "valor") {
                td = document.createElement('td');
                if (data[i]["tipoConfiguracion"] === 1) {
                    if (data[i]["valor"] === "1") {
                        td.appendChild(document.createTextNode("SI"));
                    } else {
                        td.appendChild(document.createTextNode("NO"));
                    }
                } else {
                    td.appendChild(document.createTextNode(data[i]["valor"]));
                }

                tr.appendChild(td);
            } else if (sizeColumns[k].id === "infoAdicional") {
                td = document.createElement('td');
                td.appendChild(document.createTextNode(data[i]["opcionesParametros"]));
                tr.appendChild(td);
            } else if (sizeColumns[k].id === "elemento") {
                td = document.createElement('td');
                var texto;
                for (var j = 0; j < data[i]["elementosAplicacion"].length; j++) {
                    if (j === 0) {
                        texto = data[i]["elementosAplicacion"][j]['clave'] + "-" + data[i]["elementosAplicacion"][j]['nombre'];
                    } else {
                        texto = texto + ", " + data[i]["elementosAplicacion"][j]['clave'] + "-" + data[i]["elementosAplicacion"][j]['nombre'];
                    }
                }
                td.appendChild(document.createTextNode(texto));
                tr.appendChild(td);
            } else if (sizeColumns[k].id === "clasificacion") {
                td = document.createElement('td');
                if (data[i]['clasificacion'] == 0) {
                    td.appendChild(document.createTextNode("Global"));
                } else if (data[i]['clasificacion'] == 1) {
                    td.appendChild(document.createTextNode("Horarios y turnos"));
                } else if (data[i]['clasificacion'] == 2) {
                    td.appendChild(document.createTextNode("Calculo"));
                } else if (data[i]['clasificacion'] == 3) {
                    td.appendChild(document.createTextNode("ISR"));
                } else if (data[i]['clasificacion'] == 4) {
                    td.appendChild(document.createTextNode("IMSS"));
                } else if (data[i]['clasificacion'] == 5) {
                    td.appendChild(document.createTextNode("Sueldos"));
                } else if (data[i]['clasificacion'] == 6) {
                    td.appendChild(document.createTextNode("Prestaciones"));
                } else if (data[i]['clasificacion'] == 7) {
                    td.appendChild(document.createTextNode("Información nominal"));
                } else if (data[i]['clasificacion'] == 8) {
                    td.appendChild(document.createTextNode("Movimientos"));
                } else if (data[i]['clasificacion'] == 9) {
                    td.appendChild(document.createTextNode("Conceptos"));
                } else if (data[i]['clasificacion'] == 10) {
                    td.appendChild(document.createTextNode("Reportes"));
                }

                tr.appendChild(td);
            }
        }
        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Editar");
        a.appendChild(linkText);
        a.href = "javascript:editObject('" + valueId + "');";
        td.appendChild(a);
        tr.appendChild(td);
        td = document.createElement('td');
        var a = document.createElement('a');
        var linkText = document.createTextNode("Eliminar");
        a.appendChild(linkText);
        a.href = "javascript:deleteObject('" + valueId + "');";
        td.appendChild(a);
        tr.appendChild(td);
        tbl.appendChild(tr);
    }
}

function mostrarCaptura() {
    document.getElementById('Captura').style.display = "block";
    document.getElementById('slectorCapturas').style.display = "none";
    getElementosAplicacion();
}

function ocultarCaptura() {
    document.getElementById('Captura').style.display = "none";
    document.getElementById('slectorCapturas').style.display = "block";
}

function OpcionesParamCap(mostrar) {
    if (mostrar) {
        document.getElementById('opcionesParametros').style.display = "block";
        mostrarobjectOpParam();
    } else {
        limpiarCapturaOpcParam();
        document.getElementById('opcionesParametros').style.display = "none";
    }

}

function eventoOpcionesParam(comp) {
    if (comp.checked) {
        if (comp.id === "rbnSiNo") {

            document.getElementById('grupoPorComponente').style.display = "none";
            document.getElementById('grupoCadena').style.display = "none";
            document.getElementById('grupoMascaraNumerica').style.display = "none";
            document.getElementById('grupoMultiplesOpciones').style.display = "none";
            document.getElementById('grupoNumerico').style.display = "none";

            document.getElementById('txtEnteros').value = "";
            document.getElementById('txtDecimales').value = "";
            document.getElementById('txtEnteros1').value = "";
            document.getElementById('txtDecimales1').value = "";
            document.getElementById('txtCaracteres').value = "";
            document.getElementById('txtNombreOpcion').value = "";
            $('#listaopciones option').remove();
            document.getElementById('txtTabla').value = "";
            document.getElementById('txtCampoClave').value = "";
            document.getElementById('txtCamposMostrar').value = "";

        } else if (comp.id === "rbnMultiple") {

            document.getElementById('grupoPorComponente').style.display = "none";
            document.getElementById('grupoCadena').style.display = "none";
            document.getElementById('grupoMascaraNumerica').style.display = "none";
            document.getElementById('grupoMultiplesOpciones').style.display = "block";
            document.getElementById('grupoNumerico').style.display = "none";

            document.getElementById('txtEnteros').value = "";
            document.getElementById('txtDecimales').value = "";
            document.getElementById('txtEnteros1').value = "";
            document.getElementById('txtDecimales1').value = "";
            document.getElementById('txtCaracteres').value = "";
            document.getElementById('txtTabla').value = "";
            document.getElementById('txtCampoClave').value = "";
            document.getElementById('txtCamposMostrar').value = "";

        } else if (comp.id === "rbnComponente") {


            document.getElementById('grupoPorComponente').style.display = "block";
            document.getElementById('grupoCadena').style.display = "none";
            document.getElementById('grupoMascaraNumerica').style.display = "none";
            document.getElementById('grupoMultiplesOpciones').style.display = "none";
            document.getElementById('grupoNumerico').style.display = "none";

            document.getElementById('txtEnteros').value = "";
            document.getElementById('txtDecimales').value = "";
            document.getElementById('txtEnteros1').value = "";
            document.getElementById('txtDecimales1').value = "";
            document.getElementById('txtCaracteres').value = "";
            document.getElementById('txtNombreOpcion').value = "";
            $('#listaopciones option').remove();

        } else if (comp.id === "rbnNumerico") {

            document.getElementById('grupoPorComponente').style.display = "none";
            document.getElementById('grupoCadena').style.display = "none";
            document.getElementById('grupoMascaraNumerica').style.display = "none";
            document.getElementById('grupoNumerico').style.display = "block";
            document.getElementById('grupoMultiplesOpciones').style.display = "none";

            document.getElementById('txtEnteros1').value = "";
            document.getElementById('txtDecimales1').value = "";
            document.getElementById('txtCaracteres').value = "";
            document.getElementById('txtNombreOpcion').value = "";
            $('#listaopciones option').remove();
            document.getElementById('txtTabla').value = "";
            document.getElementById('txtCampoClave').value = "";
            document.getElementById('txtCamposMostrar').value = "";

        } else if (comp.id === "rbnMascaraNumerica") {

            document.getElementById('grupoPorComponente').style.display = "none";
            document.getElementById('grupoCadena').style.display = "none";
            document.getElementById('grupoMascaraNumerica').style.display = "block";
            document.getElementById('grupoNumerico').style.display = "none";
            document.getElementById('grupoMultiplesOpciones').style.display = "none";

            document.getElementById('txtEnteros').value = "";
            document.getElementById('txtDecimales').value = "";
            document.getElementById('txtCaracteres').value = "";
            document.getElementById('txtNombreOpcion').value = "";
            $('#listaopciones option').remove();
            document.getElementById('txtTabla').value = "";
            document.getElementById('txtCampoClave').value = "";
            document.getElementById('txtCamposMostrar').value = "";

        } else if (comp.id === "rbnCaracteres") {

            document.getElementById('grupoPorComponente').style.display = "none";
            document.getElementById('grupoCadena').style.display = "block";
            document.getElementById('grupoMascaraNumerica').style.display = "none";
            document.getElementById('grupoNumerico').style.display = "none";
            document.getElementById('grupoMultiplesOpciones').style.display = "none";

            document.getElementById('txtEnteros').value = "";
            document.getElementById('txtDecimales').value = "";
            document.getElementById('txtEnteros1').value = "";
            document.getElementById('txtDecimales1').value = "";
            document.getElementById('txtNombreOpcion').value = "";
            $('#listaopciones option').remove();
            document.getElementById('txtTabla').value = "";
            document.getElementById('txtCampoClave').value = "";
            document.getElementById('txtCamposMostrar').value = "";

        } else if (comp.id === "rbnImagen") {

            document.getElementById('grupoPorComponente').style.display = "none";
            document.getElementById('grupoCadena').style.display = "none";
            document.getElementById('grupoMascaraNumerica').style.display = "none";
            document.getElementById('grupoNumerico').style.display = "none";
            document.getElementById('grupoMultiplesOpciones').style.display = "none";

            document.getElementById('txtEnteros').value = "";
            document.getElementById('txtDecimales').value = "";
            document.getElementById('txtEnteros1').value = "";
            document.getElementById('txtDecimales1').value = "";
            document.getElementById('txtCaracteres').value = "";
            document.getElementById('txtNombreOpcion').value = "";
            $('#listaopciones option').remove();
            document.getElementById('txtTabla').value = "";
            document.getElementById('txtCampoClave').value = "";
            document.getElementById('txtCamposMostrar').value = "";

        } else if (comp.id === "rbnCarpeta") {

            document.getElementById('grupoPorComponente').style.display = "none";
            document.getElementById('grupoCadena').style.display = "none";
            document.getElementById('grupoMascaraNumerica').style.display = "none";
            document.getElementById('grupoNumerico').style.display = "none";
            document.getElementById('grupoMultiplesOpciones').style.display = "none";

            document.getElementById('txtEnteros').value = "";
            document.getElementById('txtDecimales').value = "";
            document.getElementById('txtEnteros1').value = "";
            document.getElementById('txtDecimales1').value = "";
            document.getElementById('txtCaracteres').value = "";
            document.getElementById('txtNombreOpcion').value = "";
            $('#listaopciones option').remove();
            document.getElementById('txtTabla').value = "";
            document.getElementById('txtCampoClave').value = "";
            document.getElementById('txtCamposMostrar').value = "";
        }

    }


}

function limpiar() {
    document.getElementById('txtClaveCap').value = "";
    document.getElementById('txtNombreCap').value = "";
    document.getElementById('txtValorCap').value = "";
    document.getElementById('chkValorCap').checked =false;
    document.getElementById('txtInfoAdicCap').value = "";
    document.getElementById('txtElementoCap').value = "";
    document.getElementById('selClasificacionCap').value = "";
    $('#myFilter option').remove();
    $('#selValor option').remove();
    tipoconfiguracion = 0;
    propiedadConfig = "";
    parametro = {};
    contadorOpc = 1;
    arraOpciones = new Array();
    listaElemetosAplicacion = undefined;
    listaElemtosPorParam = new Array();
    limpiarCapturaOpcParam();
    document.getElementById('DivGroupValorCap1').style.display = "block";
    document.getElementById('DivGroupValorCap2').style.display = "none";
    document.getElementById('DivGroupValorCap3').style.display = "none";
    document.getElementById('DivGroupValorCap4').style.display = "none";
    ocultarCaptura();
    inMode = "A";
    busquedaRangos(0);
}

function limpiarCapturaOpcParam() {

    document.getElementById('rbnSiNo').checked = false;
    document.getElementById('rbnMultiple').checked = false;
    document.getElementById('rbnComponente').checked = false;
    document.getElementById('rbnNumerico').checked = false;
    document.getElementById('rbnMascaraNumerica').checked = false;
    document.getElementById('rbnCaracteres').checked = false;
    document.getElementById('rbnImagen').checked = false;
    document.getElementById('rbnCarpeta').checked = false;

    document.getElementById('txtEnteros').value = "";
    document.getElementById('txtDecimales').value = "";
    document.getElementById('txtEnteros1').value = "";
    document.getElementById('txtDecimales1').value = "";
    document.getElementById('txtCaracteres').value = "";
    document.getElementById('txtNombreOpcion').value = "";
    $('#listaopciones option').remove();
    document.getElementById('txtTabla').value = "";
    document.getElementById('txtCampoClave').value = "";
    document.getElementById('txtCamposMostrar').value = "";

    document.getElementById('grupoCadena').style.display = "none";
    document.getElementById('grupoMascaraNumerica').style.display = "none";
    document.getElementById('grupoMultiplesOpciones').style.display = "none";
    document.getElementById('grupoNumerico').style.display = "none";
    document.getElementById('grupoPorComponente').style.display = "none";

    contadorOpc = 1;
}

function crearOpcionesParam() {

    if (document.getElementById('rbnSiNo').checked) {
        document.getElementById('DivGroupValorCap1').style.display = "none";
        document.getElementById('DivGroupValorCap2').style.display = "block";
        document.getElementById('DivGroupValorCap3').style.display = "none";
        document.getElementById('DivGroupValorCap4').style.display = "none";

        tipoconfiguracion = 1;
        propiedadConfig = "";
        
        OpcionesParamCap(false);

    } else if (document.getElementById('rbnMultiple').checked) {
        document.getElementById('DivGroupValorCap1').style.display = "none";
        document.getElementById('DivGroupValorCap2').style.display = "none";
        document.getElementById('DivGroupValorCap3').style.display = "block";
        document.getElementById('DivGroupValorCap4').style.display = "none";

        $('#selValor option').remove();
        var config = "";
     
        for (var i = 0; i < arraOpciones.length; i++) {
            $('#selValor').append('<option value=' + arraOpciones[i] + '>' + arraOpciones[i] + '</option>');
            if (i == 0) {
                config = arraOpciones[i];
                
            } else {
                config = config + "|" + arraOpciones[i];
                
            }
        }
        
        tipoconfiguracion = 2;
        propiedadConfig = config;
       
        OpcionesParamCap(false);
    } else if (document.getElementById('rbnComponente').checked) {
        document.getElementById('DivGroupValorCap1').style.display = "none";
        document.getElementById('DivGroupValorCap2').style.display = "none";
        document.getElementById('DivGroupValorCap3').style.display = "block";
        document.getElementById('DivGroupValorCap4').style.display = "none";

        $('#selValor option').remove();
        tipoconfiguracion = 3;
        propiedadConfig = document.getElementById('txtTabla').value + "|" + document.getElementById('txtCampoClave').value + "|" + document.getElementById('txtCamposMostrar').value
        var res = searchAll(document.getElementById('txtTabla').value);
        if (res != null) {

            for (var i = 0; i < res.length; i++) {
                $('#selValor').append('<option value=' + res[i].id + '>' + res[i][document.getElementById('txtCampoClave').value.toLowerCase()] + "-" + res[i][document.getElementById('txtCamposMostrar').value.toLowerCase()] + '</option>');
            }
        }
        OpcionesParamCap(false);

    } else if (document.getElementById('rbnNumerico').checked) {
        document.getElementById('DivGroupValorCap1').style.display = "block";
        document.getElementById('DivGroupValorCap2').style.display = "none";
        document.getElementById('DivGroupValorCap3').style.display = "none";
        document.getElementById('DivGroupValorCap4').style.display = "none";

        document.getElementById("txtValorCap").removeAttribute("maxlength");
        tipoconfiguracion = 4;
        propiedadConfig = (document.getElementById('txtEnteros').value == "" ? "@" : document.getElementById('txtEnteros').value) + "|" + (document.getElementById('txtDecimales').value == "" ? "@" : document.getElementById('txtDecimales').value);

        var valores = propiedadConfig.split('|');
        //^[0-9]{1,2}$|^[0-9]{1,2}\.[0-9]{1,2}$
        var patern;
        if (valores[0] !== "@" && valores[1] !== "@") {
            patern = "^[0-9]{1," + valores[0] + "}$|^[0-9]{1," + valores[1] + "}\.[0-9]{1," + valores[1] + "}$";
        } else if (valores[1] === "@") {
            patern = "^[0-9]{1," + valores[0] + "}$";
        }
        //var patern = "^[0-9]{1," + valores[0] + "}$|^[0-9]{1," + valores[1] + "}\.[0-9]{1," + valores[1] + "}$";
        document.getElementById('txtValorCap').setAttribute('pattern', patern);
        OpcionesParamCap(false);

    } else if (document.getElementById('rbnMascaraNumerica').checked) {
        document.getElementById('DivGroupValorCap1').style.display = "block";
        document.getElementById('DivGroupValorCap2').style.display = "none";
        document.getElementById('DivGroupValorCap3').style.display = "none";
        document.getElementById('DivGroupValorCap4').style.display = "none";

        document.getElementById("txtValorCap").removeAttribute("maxlength");
        tipoconfiguracion = 5;
        propiedadConfig = (document.getElementById('txtEnteros1').value == "" ? "@" : document.getElementById('txtEnteros1').value) + "|" + (document.getElementById('txtDecimales1').value == "" ? "@" : document.getElementById('txtDecimales1').value);

        var valores = propiedadConfig.split('|');
        //^[0-9]{1,2}$|^[0-9]{1,2}\.[0-9]{1,2}$
        var patern;
        if (valores[0] !== "@" && valores[1] !== "@") {
            patern = "^[#]{1," + valores[0] + "}$|^[#]{1," + valores[1] + "}\.[#]{1," + valores[1] + "}$";
        } else if (valores[1] === "@") {
            patern = "^[#]{1," + valores[0] + "}$";
        }
        //var patern = "^[0-9]{1," + valores[0] + "}$|^[0-9]{1," + valores[1] + "}\.[0-9]{1," + valores[1] + "}$";
        document.getElementById('txtValorCap').setAttribute('pattern', patern);
        OpcionesParamCap(false);
    } else if (document.getElementById('rbnCaracteres').checked) {
        document.getElementById('DivGroupValorCap1').style.display = "block";
        document.getElementById('DivGroupValorCap2').style.display = "none";
        document.getElementById('DivGroupValorCap3').style.display = "none";
        document.getElementById('DivGroupValorCap4').style.display = "none";

        document.getElementById("txtValorCap").removeAttribute("pattern");
        tipoconfiguracion = 6;
        propiedadConfig = document.getElementById('txtCaracteres').value;

        document.getElementById('txtValorCap').setAttribute('maxlength', parametro.propiedadConfig);
        OpcionesParamCap(false);

    } else if (document.getElementById('rbnImagen').checked || document.getElementById('rbnCarpeta').checked) {
        document.getElementById('DivGroupValorCap1').style.display = "none";
        document.getElementById('DivGroupValorCap2').style.display = "none";
        document.getElementById('DivGroupValorCap3').style.display = "none";
        document.getElementById('DivGroupValorCap4').style.display = "block";

    }

}

function AddOpcion() {
    var valor = document.getElementById('txtNombreOpcion').value;
    if (valor !== "" || valor !== " ") {
        arraOpciones[arraOpciones.length] = valor;
        $('#listaopciones').append('<option value=' + contadorOpc + '>' + valor + '</option>');
        contadorOpc++;
    } else {
        alert("llene el campo ");
    }
}

function QuitOpcion() {
    var valor = document.getElementById('listaopciones').value;
    var text = $('#listaopciones option[value="' + valor + '"]');
    $('#listaopciones option[value="' + valor + '"]').remove();
    var index = arraOpciones.indexOf(text[0].innerText);
    if (index !== -1) {
        arraOpciones.splice(index, 1);
    }


}

function createPagination(numberData) {
    var typeDetail = typeof typeDetail !== 'undefined' ? typeDetail : false;
    // var paginador = $(".pagination");
    var paginador = $("#listPag");
    // alert(paginador.attr("id"));
    // paginador.attr("sourcePage", origen);
    // paginador.attr("isDetail", typeDetail);
    paginador.attr("totaReg", numberData);
    // alert(origen);
    paginador.html("");
    items = numberData;
    //  alert(rowsByPage);
    totalPages = Math.ceil(items / rowsByPage);

    //$('<li><a href="#" class="first_link">&#9664;</a></li>').appendTo(paginador);
    //$('<li><a href="#" class="prev_link">&laquo;</a></li>').appendTo(paginador);

    $('<li><a href="#" class="first_link">&#9664;</a></li>').appendTo(paginador);
    $('<li><a href="#" class="prev_link">&laquo;</a></li>').appendTo(paginador);

    for (var b = 0; totalPages > b;)
        $('<li><a href="#" class="page_link">' + (b + 1) + "</a></li>").appendTo(paginador), b++;

    numbersByPage > 1 && ($(".page_link").hide(), $(".page_link").slice(0, numbersByPage).show());

    $('<li><a href="#" class="next_link">&raquo;</a></li>').appendTo(paginador);
    $('<li><a href="#" class="last_link">&#9654;</a></li>').appendTo(paginador);

    0 === pagina && (paginador.find(".page_link:first").addClass("active"),
        paginador.find(".page_link:first").parents("li").addClass("active"));

    paginador.find(".prev_link").hide(), paginador.find("li .page_link").click(function () {
        var a = $(this).html().valueOf() - 1;
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .first_link").click(function () {
        var a = 0;
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .prev_link").click(function () {
        var a = parseInt(paginador.data("pag")) - 1;
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .next_link").click(function () {
        if (paginador.data("pag") === undefined) {
            a = 1;
        } else {
            a = parseInt(paginador.data("pag")) + 1;

        }
        return cargaPagina(a, paginador), !1;
    }), paginador.find("li .last_link").click(function () {
        items = paginador.attr("totaReg");
        totalPages = Math.ceil(items / rowsByPage);
        var a = totalPages - 1;
        return cargaPagina(a, paginador), !1;
    });
}

function cargaPagina(a, paginador) {
    //  var origen = paginador.attr("sourcePage");
    // var typeDetail = paginador.attr("isDetail");
    pagina = a;
    fromPage = pagina * rowsByPage;
    pagina >= 1 ? paginador.find(".prev_link").show() : paginador.find(".prev_link").hide();
    totalPages - numbersByPage > pagina ? paginador.find(".next_link").show() : paginador.find(".next_link").hide(),
        paginador.data("pag", pagina), numbersByPage > 1 && ($(".page_link").hide(),
            totalPages - numbersByPage > pagina ? $(".page_link").slice(pagina, numbersByPage + pagina).show() :
                totalPages > numbersByPage ? $(".page_link").slice(totalPages - numbersByPage).show() :
                    $(".page_link").slice(0).show()), paginador.children().removeClass("active"),
        paginador.children().eq(pagina + 2).addClass("active");
    /// alert("From Page: " + fromPage);

    if (document.getElementById('selClasificacion').value !== "") {
        busquedaRangos(fromPage, document.getElementById('selClasificacion').value);
    } else {
        busquedaRangos(fromPage);
    }


}

function editObject(value) {
    inMode = "U";

    search(value);
}

function deleteObject(value) {
    inMode = "D";
    search(value);
}

function mostrarobjectOpParam() {

    if (tipoconfiguracion > 0) {
        if (tipoconfiguracion === 1) {
            document.getElementById('rbnSiNo').checked = true;
        } else if (tipoconfiguracion === 2) {
            document.getElementById('rbnMultiple').checked = true;
            document.getElementById('grupoMultiplesOpciones').style.display = "block";
            var valores = propiedadConfig.split('|');
            arraOpciones = valores;
            for (var i = 0; i < valores.length; i++) {
                $('#listaopciones').append('<option value=' + (i + 1) + '>' + valores[i] + '</option>');
            }

        } else if (tipoconfiguracion === 3) {
            document.getElementById('rbnComponente').checked = true;
            document.getElementById('grupoPorComponente').style.display = "block";
            var valores = propiedadConfig.split('|');

            document.getElementById('txtTabla').value = valores[0];
            document.getElementById('txtCampoClave').value = valores[1];
            document.getElementById('txtCamposMostrar').value = valores[2];
        } else if (tipoconfiguracion === 4) {
            document.getElementById('rbnNumerico').checked = true;
            document.getElementById('grupoNumerico').style.display = "block";
            var valores = propiedadConfig.split('|');

            document.getElementById('txtEnteros').value = valores[0] == "@" ? "" : valores[0];
            document.getElementById('txtDecimales').value = valores[1] == "@" ? "" : valores[1];
        } else if (tipoconfiguracion === 5) {
            document.getElementById('rbnMascaraNumerica').checked = true;
            document.getElementById('grupoMascaraNumerica').style.display = "block";
            var valores = propiedadConfig.split('|');

            document.getElementById('txtEnteros1').value = valores[0] == "@" ? "" : valores[0];
            document.getElementById('txtDecimales1').value = valores[1] == "@" ? "" : valores[1];
        } else if (tipoconfiguracion === 6) {
            document.getElementById('rbnCaracteres').checked = true;
            document.getElementById('grupoCadena').style.display = "block";
            var valores = propiedadConfig.split('|');

            document.getElementById('txtCaracteres').value = valores[0] == "@" ? "" : valores[0];
            // document.getElementById('txtDecimales').value = valores[1] == "@" ? "" : valores[1];
        }


    } else {

        document.getElementById('rbnSiNo').checked = true;
    }


}

function construirObjectParam() {

    parametro.clave = document.getElementById('txtClaveCap').value;
    parametro.nombre = document.getElementById('txtNombreCap').value;
    parametro.tipoConfiguracion = tipoconfiguracion;
    if (tipoconfiguracion === 1) {
        if (document.getElementById('chkValorCap').checked) {
            parametro.valor = "1";
        } else {
            parametro.valor = "2";
        }
    } else if (tipoconfiguracion === 2 || tipoconfiguracion === 3) {

        parametro.valor = document.getElementById('selValor').value;
    } else if (tipoconfiguracion === 4 || tipoconfiguracion === 5 || tipoconfiguracion === 6) {
        parametro.valor = document.getElementById('txtValorCap').value;
    }
    parametro.propiedadConfig = propiedadConfig;
    parametro.opcionesParametros = document.getElementById('txtInfoAdicCap').value;
    parametro.elementosAplicacion = listaElemtosPorParam;
    parametro.modulo_ID = 1;
    parametro.ordenId = 1;//pendiente
    parametro.clasificacion = parseInt(document.getElementById('selClasificacionCap').value);

    return parametro;
}

function exiteClave(obj) {
    var url = route + "/api/DefinirParametros/existeClave";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado !== null) {
        if (Mensaje.resultado === true) {
            var answer = confirm("¿Ya exite un registro con esa clave quieres editar?");
            if (answer) {
                searchPorClave(obj["Valor"]);
            } else {
                //document.getElementById('txtNombreCap').select();
                //setTimeout(function () { document.getElementById('txtNombreCap').focus(); txtvalor.select(); }, 1);
            }
        } else {
            //setTimeout(function () { document.getElementById('txtNombreCap').nextElementSibling.focus(); }, 1);
        }
    }
}

function searchPorClave(obj) {
    var url = route + "/api/DefinirParametros/getPorClaveParametros";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado === null) {
        alert('No object');
    } else {

        parametro = Mensaje.resultado;
        mostrarobject(parametro);
    }
}

function saveParametros() {
    var obj = {};
    obj.param = construirObjectParam();
    var url;
    if (inMode == "A") {
         url = route + "/api/DefinirParametros/save";
    } else {
         url = route + "/api/DefinirParametros/update";
    }
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado === null) {
        alert('No object');
    } else {
        alert("exito");
        //parametro = Mensaje.resultado;
        //mostrarobject(parametro);
    }
    limpiar();
}

function eliminarParam(obj) {
    var obj2 = {};
    obj2.param = obj;
    var url = route + "/api/DefinirParametros/delete";
    var dataToPost = JSON.stringify(obj2);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado === null) {
        alert('No object');
    } else {
        alert("exito");
        //parametro = Mensaje.resultado;
        //mostrarobject(parametro);
    }
    limpiar();
}