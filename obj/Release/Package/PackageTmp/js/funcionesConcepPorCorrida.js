var route = "";
var contCaptura;
var contSelector;
var listaGlobalConcepto = new Array();
var listaConceptoNuevos = new Array();
var listaConceptoEliminar = new Array();
var tipoCorrida = null;
var concepto = null;
var tbloriginal;
var claveTipoCorrida = null;
var start = 0;
var end = 10;
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    startCustomTools();
    OpenTable(document.getElementById('ConceptosPorCorrida'));
    InitEventsTable();
    contCaptura = document.getElementById('con2');
    contSelector = document.getElementById('con1');
    //tbloriginal = document.getElementById('tblConcep').innerHTML;
   // getTipoCorridaALL();
});

function setEditTipoCorrida() {

    //Parameters
    nameCmp = "EditTipoCorrida";
    table = "TipoCorrida";
    nameCols = idiomaSelecionadoCol.messageFormatter("TipoCorridaclave")() + "," + idiomaSelecionadoCol.messageFormatter("TipoCorridadescripcion")();
    //nameCols = "Clave,Descripción";
    campos = "clave,descripcion";//Quit ID;
    camposObtener = "clave,descripcion";
    //var subEntities = "periodicidad"; //Unnecesary
    camposMostrar = ["clave", "descripcion"];
    var preFilters = setPreFilters(preFilters = null);
    var tituloSel = "Tipo corrida";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);


}

function setEditTipoCorridaShow(value) {
    if (value !== null) {
        var obj = value[0];
        claveTipoCorrida = obj.Clave;
        tipoCorrida = {};
        tipoCorrida.id = obj.Id;
        tipoCorrida.clave = claveTipoCorrida;
        tipoCorrida.descripcion = obj.Descripcion;
        getconceptoPorTipoCorrida(tipoCorrida.id);
    }
}


function setEditTipoCorridaDet() {

    //Parameters
    nameCmp = "EditTipoCorridaDet";
    table = "TipoCorrida";
    nameCols = idiomaSelecionadoCol.messageFormatter("TipoCorridaclave")() + "," + idiomaSelecionadoCol.messageFormatter("TipoCorridadescripcion")();
    //nameCols = "Clave,Descripción";
    campos = "clave,descripcion";//Quit ID;
    camposObtener = "clave,descripcion";
    //var subEntities = "periodicidad"; //Unnecesary
    var preFilters = setPreFilters(preFilters = null);
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Tipo corrida";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);


}

function setEditTipoCorridaShowDet(value) {
    if (value !== null) {
        var obj = value[0];
        claveTipoCorrida = obj.Clave;
    }
}

function setEditConcepNomina() {

    //Parameters
    nameCmp = "EditConcepNomina";
    table = "ConceptoPorTipoCorrida";
    nameCols = idiomaSelecionadoCol.messageFormatter("ConceptosNominaClave")() + "," + idiomaSelecionadoCol.messageFormatter("ConceptosNominaDescripcion")() + "," + idiomaSelecionadoCol.messageFormatter("ConceptosNominaDescripcionAbre")();
    //nameCols = "Clave,Descripción,Descripción abreviada";
    campos = "concepNomDefi.clave,concepNomDefi.descripcion,concepNomDefi.descripcionAbreviada";//Quit ID;
    camposObtener = "concepNomDefi.id,concepNomDefi.clave,concepNomDefi.descripcion";
    var subEntities = "concepNomDefi,tipoCorrida"; //Unnecesary
    camposMostrar = ["concepNomDefi.clave", "concepNomDefi.descripcion"];
    var claveConcep = new Array();
    for (var i = 0; i < listaConceptoNuevos.length; i++) {
        claveConcep[i] = listaGlobalConcepto[i].concepNomDefi.clave;
    }
    var preFilters = setPreFilters(preFilters = null);
    //var preFilters = {};
    //if (claveConcep.length > 0) {
    //    preFilters = { "concepNomDefi.clave#IN": claveConcep  };
    //}
   // var idTipocorrida = document.getElementById('editTipoCorrida').getAttribute('value');
    //var preFilters = { "concepNomDefi.clave": tipoCorrida.id, "concepNomDefi.activado#=": true };//Unnecesary
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
        concepto = {};
        concepto.id = value[0].ConcepNomDefiid;
        concepto.clave = value[0].ConcepNomDeficlave;
        concepto.descripcion = value[0].ConcepNomDefidescripcion;
    }
}

function mostrarCaptura(mostrar) {
    if (mostrar) {
        if (claveTipoCorrida !== null) {
            contSelector.style.display = "none";
            contCaptura.style.display = "block";
            setEditObject("editTipoCorridaDet", claveTipoCorrida);
            // getConcepNomPorTc();
            if (claveTipoCorrida === "LIQ" || claveTipoCorrida === "FIN") {
                ocultarComponentes(true);
            } else {
                ocultarComponentes(false);
            }
        } else {
            alert("Selecione un tipo de corrida");
        }
    } else {
    contCaptura.style.display = "none";
    contSelector.style.display = "block";
    limpiarCaptura();
    }
}

function getconceptoPorTipoCorrida(idCorrida) {
    var url = route + "/api/ConcepPorCorrida/getconceptoPorTipoCorrida";
    var dataToPost = JSON.stringify(idCorrida);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        clearTable("ConceptosPorCorrida");
        InitEventsTable();
        listaGlobalConcepto = Mensaje.resultado;
        if (listaGlobalConcepto.length < rowsByPage) {
            end = listaGlobalConcepto.length;
        } else {
            end = rowsByPage;
        }
        llenarTable(0, end);
        //console.log(listaGlobalConcepto);
    }

}

///metodos para la tabla
function editTableConceptosPorCorrida() {

    var nameTable = "ConceptosPorCorrida";
    var nameCols = crearListaColumnas();
    var activaAdd = false;
    var activaDelete = true;
    var activarEditar = false;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete, activarEditar);
}

function crearListaColumnas() {
    var columnasTabla = new Array();
    if (claveTipoCorrida === null || claveTipoCorrida === "FIN" || claveTipoCorrida === "LIQ") {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptoXTipoCorridaTblConcepto")(), "nombreCompo": "concepto", "editable": false, "tipoCompon": "text", "persist": "concepto", "ancho": "35px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptoXTipoCorridaTblDescripcion")(), "nombreCompo": "concepDescripcion", "editable": false, "tipoCompon": "text", "persist": "concepDescripcion", "ancho": "360px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptoXTipoCorridaTblMostrar")(), "nombreCompo": "mostrar", "editable": false, "tipoCompon": "checkbox", "persist": "mostrar", "ancho": "70px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptoXTipoCorridaTblOpcional")(), "nombreCompo": "opcional", "editable": false, "tipoCompon": "checkbox", "persist": "opcional", "ancho": "70px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptoXtipoCorridaTblIncluir")(), "nombreCompo": "incluir", "editable": false, "tipoCompon": "checkbox", "persist": "incluir", "ancho": "70px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptoXTipoCorridaTblCatImp")(), "nombreCompo": "cantImp", "editable": false, "tipoCompon": "text", "persist": "cantImp", "ancho": "70px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptoXTipoCorridaTblModCant")(), "nombreCompo": "modCantidad", "editable": false, "tipoCompon": "checkbox", "modCantidad": "cierreMes", "ancho": "70px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptoXTipoCorridaTblModImp")(), "nombreCompo": "modImporte", "editable": false, "tipoCompon": "checkbox", "persist": "modImporte", "ancho": "55px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptoXTipoCorridaTblDescuento")(), "nombreCompo": "descuento", "editable": false, "tipoCompon": "text", "persist": "descuento", "ancho": "55px", "funcion": "" });
    } else {
        columnasTabla.push({ "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptoXTipoCorridaTblConcepto")(), "nombreCompo": "concepto", "editable": false, "tipoCompon": "text", "persist": "concepto", "ancho": "35px", "funcion": "" },
            { "tituloColumna": idiomaSelecionadoCol.messageFormatter("ConceptoXTipoCorridaTblDescripcion")(), "nombreCompo": "concepDescripcion", "editable": false, "tipoCompon": "text", "persist": "concepDescripcion", "ancho": "360px", "funcion": "" });
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
        //agregarCreditoEmpleado(obj);
    } else {
        obj['id'] = tr.id;
        //actualizarCreditoEmpleado(obj);
    }

}

function tableRemove(registro) {

    var id = registro.id;
    for (var i = 0; i < listaGlobalConcepto.length; i++) {
        if (listaGlobalConcepto[i].id === id) {
            if (Number.isInteger(id)) {
                    listaConceptoEliminar[listaConceptoEliminar.length] = listaGlobalConcepto[i].id;
                }

                listaGlobalConcepto.splice(i, 1);
            }

        }
    if (!Number.isInteger(id)) {
            for (var k = 0; k < listaConceptoNuevos.length; k++) {
                if (listaConceptoNuevos[k].id === id) {
                    listaConceptoNuevos.splice(k, 1);
                }
            }
    }
    llenarTable(start, end);
}

function editarTable(registro) {
    idSelecionado = registro.id;
    ConstruirModificarPer();
}

function cambiarPagina(valores) {
    //alert(valores);
    var tbl = valores['origen'];
    end = rowsByPage;
    start = valores['fromPage'];
    if (listaGlobalConcepto.length > rowsByPage) {
        var res = (rowsByPage + start) - listaGlobalConcepto.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = listaGlobalConcepto.length;
    }
    llenarTable(start, end);
}

function llenarTable(start, end) {
    var datos = construirDatosTbl(start, end);
    if (start === 0) {
        createEditPagination(listaGlobalConcepto.length, "ConceptosPorCorrida");
    }
    llenarTablaGen("ConceptosPorCorrida", datos, start, end);
}

function construirDatosTbl(start, end) {
  
    var listaDatos = new Array();
    for (var i = 0; i < listaGlobalConcepto.length; i++) {
        var obj = {};
        obj.id = listaGlobalConcepto[i].id;
        obj.concepto = listaGlobalConcepto[i].concepNomDefi.clave;
        obj.concepDescripcion = listaGlobalConcepto[i].concepNomDefi.descripcion;
        if (claveTipoCorrida === "LIQ" || claveTipoCorrida === "FIN") {
            obj.mostrar = listaGlobalConcepto[i].mostrar;
            obj.opcional = listaGlobalConcepto[i].opcional;
            obj.incluir = listaGlobalConcepto[i].incluir;
            obj.cantImp = listaGlobalConcepto[i].cantidad;
            obj.modCantidad = listaGlobalConcepto[i].modificarCantidad;
            obj.modImporte = listaGlobalConcepto[i].modificarImporte;
            if (listaGlobalConcepto[i].descuentoCreditos === 1) {
                obj.descuento = "No descontar";
               
            } else if (listaGlobalConcepto[i].descuentoCreditos === 2) {
                obj.descuento = "Descontar solo en el periodo Correspondiente";
               
            } else if (listaGlobalConcepto[i].descuentoCreditos === 3) {
                obj.descuento = "Descontar solo en el mes correspondiente";
               
            } else if (listaGlobalConcepto[i].descuentoCreditos === 4) {
                obj.descuento = "Descontar saldo actual";
                
            }
        }

        listaDatos[listaDatos.length] = obj;
    }
    return listaDatos;
}

function limpiarCaptura() {

    concepto = null;
    clearEdit("editTipoCorridaDet");
    clearEdit("editConcepNomina");
    document.getElementById('txtConceptoDescripcion').value = "";
    document.getElementById("chkOpcional").checked = false;
    document.getElementById("chkMostrar").checked = false;
    document.getElementById("chkModificarImporte").checked = false;
    document.getElementById("chkModificarCantidad").checked = false;
    document.getElementById("chkIncluir").checked = false;
    document.getElementById('txtCantidad').value = "";
    document.getElementById('selDescuento').value = "";
}


function ocultarComponentes(mostrar) {
    if (mostrar) {
        document.getElementById('DivGroupOpcional').style.display = "";
        document.getElementById('DivGroupMostar').style.display = "";
        document.getElementById('DivGroupModificarImporte').style.display = "";
        document.getElementById('DivGroupModificarCantidad').style.display = "";
        document.getElementById('DivGroupIncluir').style.display = "";
        document.getElementById('DivGroupCantidad').style.display = "";
        document.getElementById('DivGroupDescuento').style.display = "";
    } else {
        document.getElementById('DivGroupOpcional').style.display = "none";
        document.getElementById('DivGroupMostar').style.display = "none";
        document.getElementById('DivGroupModificarImporte').style.display = "none";
        document.getElementById('DivGroupModificarCantidad').style.display = "none";
        document.getElementById('DivGroupIncluir').style.display = "none";
        document.getElementById('DivGroupCantidad').style.display = "none";
        document.getElementById('DivGroupDescuento').style.display = "none";
    }
}

function construirObjetc() {
    var obj = {};
    var objConcep = {};
    if (tipoCorrida.clave == "FIN" || tipoCorrida.clave == "LIQ") {
        obj.id = concepto.clave + tipoCorrida.id;
        objConcep.id = concepto.id;
        objConcep.clave = concepto.clave;
        objConcep.descripcion = concepto.descripcion;
        obj.concepNomDefi = objConcep;
        obj.cantidad = document.getElementById('txtCantidad').value == "" ? 0 : parseFloat(document.getElementById('txtCantidad').value);
        obj.concepNomDefi_ID = concepto.id;
        obj.descuentoCreditos = parseInt(document.getElementById('selDescuento').value);
        obj.incluir = document.getElementById('chkIncluir').checked;
        obj.modificarCantidad = document.getElementById('chkModificarCantidad').checked;;
        obj.modificarImporte = document.getElementById('chkModificarImporte').checked;;
        obj.mostrar = document.getElementById('chkMostrar').checked;;
        obj.opcional = document.getElementById('chkOpcional').checked;;
        obj.tipoCorrida_ID = tipoCorrida.id;
    } else {
        obj.id = concepto.clave + tipoCorrida.id;
        objConcep.id = concepto.id;
        objConcep.clave = concepto.clave;
        objConcep.descripcion = concepto.descripcion;
        obj.concepNomDefi = objConcep;
        obj.cantidad = 0;
        obj.concepNomDefi_ID = concepto.id;
        obj.descuentoCreditos = 3;
        obj.incluir = false;
        obj.modificarCantidad = false;
        obj.modificarImporte = false;
        obj.mostrar = false;
        obj.opcional = false;
        obj.tipoCorrida_ID = tipoCorrida.id;
    }

    return obj;
}

function addConcepto() {
    if (validarConceptoExite()) {
        var concepTc = construirObjetc();
        console.log(concepTc);
        listaConceptoNuevos[listaConceptoNuevos.length] = concepTc;
        listaGlobalConcepto[listaGlobalConcepto.length] = concepTc;
        mostrarCaptura(false);
        if (listaGlobalConcepto.length < rowsByPage) {
            end = listaGlobalConcepto.length;
        } else {
            end = rowsByPage;
        }
        llenarTable(start, end);
    } else {
        alert("el concepto ya exite");
    }
}

function validarConceptoExite() {
    var exito = true;
    for (var i = 0; i < listaGlobalConcepto.length; i++) {
        if (concepto.clave === listaGlobalConcepto[i].concepNomDefi.clave) {
            exito= false;
        }
    }

    return exito;
}

//function deleteConcep(idconcep) {
//    var answer = confirm("¿Quieres eliminar este movimiento?")
//    if (answer) {
//        for (var i = 0; i < listaGlobalConcepto.length; i++) {
//            if (listaGlobalConcepto[i].id === idconcep) {
//                if (Number.isInteger(idconcep)) {
//                    listaConceptoEliminar[listaConceptoEliminar.length] = listaGlobalConcepto[i].id;
//                }

//                listaGlobalConcepto.splice(i, 1);
//            }

//        }
//        if (!Number.isInteger(idconcep)) {
//            for (var k = 0; k < listaConceptoNuevos.length; k++) {
//                if (listaConceptoNuevos[k].id === idconcep) {
//                    listaConceptoNuevos.splice(k, 1);
//                }
//            }
//        }
//        llenarTable();
//    }
//}

function guardar() {
    var obj = {};
    limpiarobjantesSave();
    obj['add'] = listaConceptoNuevos;
    obj['delete'] = listaConceptoEliminar;

    var url = route + "/api/ConcepPorCorrida/saveDeleteConceptoPorTipoCorrida";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        limpiar();
    }
    
}

function limpiarobjantesSave() {
    for (var i = 0; i < listaConceptoNuevos.length; i++) {
        listaConceptoNuevos[i].id = undefined;
        listaConceptoNuevos[i].concepNomDefi = undefined;
    }

}

function limpiar() {
    clearEdit("editTipoCorrida");
    clearTable("ConceptosPorCorrida");
    InitEventsTable();
    tipoCorrida = null;
}