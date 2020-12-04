
var listaConfigMascaras = new Array();
var configMascaraModi = new Array();
var start = 0;
var end = 10;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    startCustomTools();
    OpenTable(document.getElementById('contTable'));
    InitEventsTable();

    document.getElementById("txtCaracterReempleazo").value = "_";
    getConfigMascaraALL();
    //nombreTablaBDs = "Bancos";
    llenartabla(0, rowsByPage);
    //construyeMascara("clave","1");
});

function getConfigMascaraALL() {
    var url = route + "/api/ConfigMascara/getConfigmascaraALL";
    // var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        listaConfigMascaras = Mensaje.resultado;
    }
}

function llenartabla(start,end) {
    if (listaConfigMascaras.length > 0) {
        var datosTabla = new Array();
        var obj = {};
        for (var i = 0; i < listaConfigMascaras.length; i++) {
            obj = {};
            obj.id = listaConfigMascaras[i].id;
            obj.clave = listaConfigMascaras[i].clave;
            obj.descripcion = listaConfigMascaras[i].descripcion;
            obj.mascara = listaConfigMascaras[i].mascara;
            obj.activaMascara = listaConfigMascaras[i].activaMascara;

            datosTabla[datosTabla.length] = obj;
        }

       // clearTable("contTable");
        if (start===0) {
            createEditPagination(datosTabla.length, "contTable");
        }
        llenarTablaGen("contTable", datosTabla, start, end);
        InitEventsTable();

    } else {
        clearTable("contTable");
        InitEventsTable();
    }
}

function setMascara(values) {
    var mascara = values[0];
    var tr = values[1];
    var id = tr.id;
    for (var i = start; i < end; i++) {
        if (listaConfigMascaras[i].id === parseInt(id)) {
            listaConfigMascaras[i].mascara = mascara;
            listaConfigMascaras[i].status = "update";
            break;
        }
    }
    
}

function setActivarMascar(values) {
    var activa = values[0];
    var tr = values[1];
    var id = tr.id;
    for (var i = start; i < end; i++) {
        if (listaConfigMascaras[i].id === parseInt(id)) {
            listaConfigMascaras[i].activaMascara = mascara;
            listaConfigMascaras[i].status = "update";
            break;
        }
    }
   
}

function saveConfigMascara() {
    var obj = {};
    var listaMascaras = new Array();

    for (var i = 0; i < listaConfigMascaras.length; i++) {
        if (listaConfigMascaras[i].status === "update") {
            delete listaConfigMascaras[i].status;
            listaMascaras[listaMascaras.length] = listaConfigMascaras[i];
        }
    }

    if (listaMascaras.length > 0) {
        obj.saveOrUpdate = listaMascaras;
        var url = route + "/api/ConfigMascara/saveConfigMascara";
        var dataToPost = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado === null) {
            alert("No object");
            cancelar();
        } else {
            alert("Guardado Exitosamenta");
            cancelar();
        }
    } else {
        cancelar();
    }
}

function cancelar() {
    listaConfigMascaras = new Array();
    getConfigMascaraALL();
    createEditPagination(listaConfigMascaras.length, "contTable");
    llenartabla(0, rowsByPage);
}

///metodos para la tabla
function editConfigMascaras() {

    var nameTable = "contTable";
    var nameCols = crearListaColumnas();
    var activaAdd = false;
    var activaDelete = false;
    var activarEditar = false;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete, activarEditar);
}

function crearListaColumnas() {
    var columnasTabla = new Array();
    columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConfiguracionMascaraClave")(), "nombreCompo": "clave", "editable": false, "tipoCompon": "text", "persist": "clave", "ancho": "100px", "funcion": "" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConfiguracionMascaraDescripcion")(), "nombreCompo": "descripcion", "editable": false, "tipoCompon": "text", "persist": "descripcion", "ancho": "400px", "funcion": "" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConfiguracionMascaraMascara")(), "nombreCompo": "mascara", "editable": true, "tipoCompon": "text", "persist": "mascara", "ancho": "70px", "funcion": "setMascara" },
        { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConfiguracionMascaraActivarMascara")(), "nombreCompo": "activaMascara", "editable": true, "tipoCompon": "checkbox", "persist": "activaMascara", "ancho": "70px", "funcion": "setActivarMascar" });

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




    } else {
        var tbl = document.getElementById(valores[1]);
        var totalReg = tbl.childNodes.length;
        trUltimo = tbl.lastElementChild;
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


        AgregarVac();


    }
    //if (exito) {

    //    var $clone = $('#' + valores[0]).find('tr.hide').clone(true).removeClass('hide table-line');
    //    $clone[0].setAttribute("class", "hidetd");
    //    $clone.className = "hidetd";
    //    // $clone.id = rString;
    //    var edit = $clone[0].querySelectorAll(".edit");
    //    if (edit) {
    //        for (var i = 0; i < edit.length; i++) {
    //            edit[i].removeAttribute("value");
    //            edit[i].querySelector(".editKey").value = "";
    //        }
    //    }


    //    $('#' + valores[1]).append($clone);
    //}
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
        //agregarCreditoEmpleado(obj);
    } else {
        obj['id'] = tr.id;
        //actualizarCreditoEmpleado(obj);
    }

}

function tableRemove(registro) {

    var exito = false;
    var rowIndex = registro.rowIndex - 2;


    if (rowIndex === 0 || rowIndex + 1 === modelVacaciones.length) {
        exito = true;
        if (parseInt(modelVacaciones[rowIndex].id)) {
            deleteVacaciones[deleteVacaciones.length] = modelVacaciones[rowIndex].id;
        }
        modelVacaciones.splice(rowIndex, 1);


    } else {
        alert("solo puede eliminar el primer registro o el ultimo");
    }


    return exito;


    //if (parseInt(id)) {
    //    for (var i = 0; i < dataRegAhorro.length; i++) {
    //        if (dataRegAhorro[i].id === parseInt(id)) {
    //            dataRegAhorro.splice(i, 1);
    //            break;
    //        }
    //    }
    //    //for (var i = 0; i < listaAsistNuevosYMod.length; i++) {
    //    //    if (listaAsistNuevosYMod[i].id === parseInt(id)) {
    //    //        listaAsistNuevosYMod.splice(i, 1);
    //    //        break;
    //    //    }
    //    //}
    //    deleteAhorro[deleteAhorro.length] = parseInt(id);

    //} else {
    //    for (var j = 0; j < dataRegAhorro.length; j++) {
    //        if (dataRegAhorro[j].id === id) {
    //            dataRegAhorro.splice(j, 1);
    //            break;
    //        }
    //    }
    //}


    //  alert("eliminado" + ".- " + name.id);
}

function editarTable(registro) {
    //idSelecionado = registro.id;
    //ConstruirModificarPer();
}

function prevalidacionColumna(valores) {

    var columnas = valores[1];
    var renglon = valores[0];
    //if (columnas.getAttribute("persist") === "creditoPorEmpleado_ID") {
    //    var clave = renglon.cells[0].innerText;
    //    if (clave !== "") {
    //        claveEmpleado = clave;
    //    } else {
    //        //renglon.cells[0].focus();
    //        // alert("selecione un empelado");
    //    }
   // }

}

function cambiarPagina(valores) {
    //alert(valores);
    var tbl = valores['origen'];
    end = rowsByPage;
    start = valores['fromPage'];
    if (listaConfigMascaras.length > rowsByPage) {
        var res =(rowsByPage + start) - listaConfigMascaras.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = listaConfigMascaras.length;
    }
    llenartabla(start, end);
}

//end metodos
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}