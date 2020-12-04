var obj = {};
var serieRazonSocial = null;
var tipoCorrida = null;
var claveTipoNomina = null;
var tipoNomina = null;
var PeriodoNomina = null;
var delEmpleado = null;
var AlEmpleado = null;
var centroCostos = null;
var registroPatronal = null;
var departamento = null;
var razonSocialActual;
var listaEmpleados = new Array();
var listaEmpleadosGenerados = new Array();
var listado = new Array();
var dataEnvEmpleados = null;
var start = 0;
var end = 10;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    var query = getParameterByName('screen');
    if (query !== "") {
        inicializaCfg(query);
    } else {
        var obj = JSON.parse($("#container").data("opener"));
        query = obj.tipoCaptura + "|" + obj.IdScreen + "|" + obj.config;
        value = query.split('|');
        inicializaCfg(value[2]);
    }

});
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
function inicializaCfg(id) {
    showWait();
    getRazonSocialActual();
    listaEmpleados = null;
    removeWait();
}
function getRazonSocialActual() {
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);

    var url = route + "/api/CFDIEmpleado/RazonSocialPorID";
    var dataToPost = JSON.stringify(razon.id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        razonSocialActual = Mensaje.resultado;
    }

    desplegarInfo();

}

// tabla
function editTableCanc() {

    var nameTable = "contTable";
    var nameCols = crearListaColumnas();
    var activaAdd = false;
    var activaDelete = false;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}
function crearListaColumnas() {
    var columnasTabla = new Array();

    columnasTabla.push(
        { "tituloColumna": "id", "nombreCompo": "id", "editable": false, "tipoCompon": "text", "persist": "id", "ancho": "40px", "hide": true },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CFDIEnProcesoCancTc")(), "nombreCompo": "tipoCorrida", "editable": false, "tipoCompon": "text", "persist": "tipoCorrida", "ancho": "40px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CFDIEnProcesoCancTn")(), "nombreCompo": "tipoNomina", "editable": false, "tipoCompon": "text", "persist": "tipoNomina", "ancho": "40px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CFDIEnProcesoCancPer")(), "nombreCompo": "periodo", "editable": false, "tipoCompon": "text", "persist": "periodo", "ancho": "40px" },
    
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CFDIEnProcesoCancSerie")(), "nombreCompo": "serieCFDI", "editable": false, "tipoCompon": "text", "persist": "serieCFDI", "ancho": "40px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CFDIEnProcesoCancFolio")(), "nombreCompo": "folioCFDI", "editable": false, "tipoCompon": "text", "persist": "folioCFDI", "ancho": "85px" },
        { "tituloColumna": "idEmpleado", "nombreCompo": "idEmpleado", "editable": false, "tipoCompon": "text", "persist": "idEmpleado", "ancho": "150px", "hide": true },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CFDIEnProcesoCancClave")(), "nombreCompo": "claveEmpleado", "editable": false, "tipoCompon": "text", "persist": "claveEmpleado", "ancho": "65px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CFDIEnProcesoCancNombre")(), "nombreCompo": "nombreEmp", "editable": false, "text": "edit", "persist": "nombreEmp", "ancho": "240px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CFDIEnProcesoCancFcIntCanc")(), "nombreCompo": "fecha", "editable": false, "tipoCompon": "text", "persist": "fecha", "ancho": "85px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CFDIEnProcesoCancUUID")(), "nombreCompo": "uuid", "editable": false, "tipoCompon": "text", "persist": "uuid", "ancho": "90px" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("CFDIEnProcesoCancMensaje")(), "nombreCompo": "mensaje", "editable": false, "tipoCompon": "text", "persist": "mensaje", "ancho": "200px" },
        { "tituloColumna": "Seleccionar", "nombreCompo": "Seleccionar", "editable": true, "tipoCompon": "checkbox", "persist": "seleccionado", "ancho": "90px", "selectable": true, "funcion": "setActivarSeleccionado" }
    );


    return columnasTabla;
}
function tableAdd(valores) {
    var exito = true;
    if (valores.length === 3) {

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
            //--
        }
    }

 


    $('#' + valores[1]).append($clone);
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



    } else {
        for (var j = 0; j < dataRegCred.length; j++) {
            if (dataRegCred[j].id === id) {
                dataRegCred.splice(j, 1);
                break;
            }
        }
    }

}
function cambiarPagina(valores) {
    //alert(valores);
    end = rowsByPage;
    start = valores;
    if (listado.length > rowsByPage) {
        var res = (rowsByPage + start) - listado.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = listado.length;
    }
    mostrarTabla(start, end);
}

//--

function mostrarTabla(start, end) {
     
    var datos = new Array();
    if (listaEmpleadosGenerados.length !== undefined) {
        for (var i = 0; i < listaEmpleadosGenerados.length; i++) {
            var objEmpleado = {};


            var rString = randomString(2, '0123456789');
            listaEmpleadosGenerados[i].idTabla = rString;
            objEmpleado.id = listaEmpleadosGenerados[i].idTabla;

            objEmpleado.tipoCorrida = listaEmpleadosGenerados[i].tipoCorridaClave;
            objEmpleado.tipoNomina = listaEmpleadosGenerados[i].tipoNominaClave;
            objEmpleado.periodo = listaEmpleadosGenerados[i].periodoNominaClave;

            objEmpleado.serieCFDI = listaEmpleadosGenerados[i].cfdiRecibo.serie;
            objEmpleado.folioCFDI = listaEmpleadosGenerados[i].cfdiRecibo.folioCFDI;
            objEmpleado.idEmpleado = listaEmpleadosGenerados[i].idEmpleadoTabla;
            objEmpleado.claveEmpleado = listaEmpleadosGenerados[i].clave;
            objEmpleado.nombreEmp = listaEmpleadosGenerados[i].apellidoPaterno + " " + listaEmpleadosGenerados[i].apellidoMaterno + " " + listaEmpleadosGenerados[i].nombre;
            objEmpleado.fecha = formatDatemmddyyy(new Date(listaEmpleadosGenerados[i].cfdiRecibo.fechaGeneraInfo));
            objEmpleado.uuid = listaEmpleadosGenerados[i].cfdiRecibo.UUID;
            objEmpleado.mensaje = "";
            if (listaEmpleadosGenerados[i].mensaje !== null) {
                if (listaEmpleadosGenerados[i].mensaje !== undefined) {
                    objEmpleado.mensaje = listaEmpleadosGenerados[i].mensaje;
                }

            }
            objEmpleado.seleccionado = false;

            datos[datos.length] = objEmpleado;

            dataEnvEmpleados = datos;

        }
        if (start === 0) {
            if (dataEnvEmpleados.length !== undefined)
                createEditPagination(dataEnvEmpleados.length, "contTable");
            else
                createEditPagination(0, "contTable");
        }
        if (dataEnvEmpleados.length < end)
            llenarTablaGen("contTable", dataEnvEmpleados, start, dataEnvEmpleados.length);
        else
            llenarTablaGen("contTable", dataEnvEmpleados, start, end);
        InitEventsTable();



        document.getElementById("btnCargar").style.display = "inline-block";
        document.getElementById("btnVisualizarStatus").style.display = "inline-block";
    }
    else {
        clearTable("contTable");
        InitEventsTable();
    }
    
}

function setActivarSeleccionado(values) {
    var activa = values[0];
    var tr = values[1];
    var id = tr.id;
    for (var i = start; i < end; i++) {
        if (listaEmpleadosGenerados[i].idTabla === id) {
            listaEmpleadosGenerados[i].seleccionado = activa;

            break;
        }
    }

}

function desplegarInfo()
{
    var obj3 = parametros();
    listaEmpleadosGenerados = mostrarInformacion(obj3);

    if (listaEmpleadosGenerados !== null) {
        if (listaEmpleadosGenerados.length === 0) {
            alert("No hay información.");

        }
        else {
            mostrarTabla(start, end);
        }

    }

}

function parametros() {
    obj = {};
    obj['razonSocialActual'] = razonSocialActual.id;
    return obj;

}

function mostrarInformacion(valores) {
    var url = route + "/api/CFDIEmpleado/BuscarEnProcesoCanc";
    var dataToPost = JSON.stringify(valores);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null)
    {
        if (Mensaje.noError === 6) {
            alert("El periodo de nómina está abierto");
        }
        else {

            if (Mensaje.noError === 50) {
                alert(Mensaje.error);
            }
            else {

                alert("No object");
            }


        }
        return null;

    } else {
       return Mensaje.resultado;
    }
}



function sendOnlySelected(dataClear) {
    var paraCancelar = [];
    for (var i = 0; i < dataClear.length; i++) {
        if (dataClear[i]["seleccionado"] === true) {

            paraTimbrar.push(dataClear[i].idEmpleadoTabla);
        }
    }
    return paraCancelar;
}

function parametros2() {
    obj = {};
    obj['razonSocialActual'] = razonSocialActual.id;
   
    obj['ParaCancelar'] = sendOnlySelected(listaEmpleadosGenerados);
   

    if (obj['ParaCancelar'].length === 0) {
        alert("Debe de seleccionar por lo menos un empleado para recuperar acuse");
        return null;
    }
    else {
        return obj;
    }

    
}

function ejecutaproceso() {
    var url = route + "/api/CFDIEmpleado/RecuperarAcuse";
     var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        if (Mensaje.noError === 6) {
            alert("El periodo de nómina está abierto");
        }
        else {
            if (Mensaje.noError === 50) {
                alert(Mensaje.error);
            }
            else {

                alert("No object");
            }
        }
        return null;

    } else {
        return Mensaje.resultado;
    }
}


function EjecutarCancelado() {
    var obj1 = {};
    obj1 = parametros2();
    if (obj1 !== null) {
        dataEnvEmpleados = new Array();
        listaEmpleadosGenerados = new Array();
        listaEmpleadosGenerados = ejecutaproceso();

        if (listaEmpleadosGenerados !== null) {
            mostrarTabla(start, end);
        }
        else {
            createEditPagination(listaEmpleadosGenerados.length, "contTable");
            mostrarTabla(0, rowsByPage);

        }
    }
    



}


function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}



