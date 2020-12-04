var contenedorActual = null;
var tipoCorrida = null;
var razonSocialActual = {};
var idiomaSelecionadoCol;
jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    getRazonSocialActual();
});
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
/*Table selector*/
function selectorTipoCorr() {

    //Parameters
    nameCmp = "selectorCatalogoTipoCorr";
    //if (tipoConfiguracion === 1) {
    //    title = "Configurar credito";
    //} else if (tipoConfiguracion === 2) {
    //    title = "Configurar Ahorros";
    //}
    title = "Tipo Corrida";
    table = "TipoCorrida";
    nameCols = idiomaSelecionado.messageFormatter("TipoCorridaclave")() + "," + idiomaSelecionado.messageFormatter("TipoCorridadescripcion")();
    campos = "clave,descripcion";//Quit ID;
    //o0,01,02,03
    

    //camposMostrar = ["clave", "puestos.descripcion"];

    /*var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);*/
    //var preFilters = { "razonesSociales.id": razonSocialActual.id }; 


    var filtersSearch = [];
    //filtersSearch[0] = { "etiqueta": "Clave de plaza", "tipo": "string", "campo": "clave", "medida": "s" };
    //filtersSearch[1] = { "etiqueta": "Nombre de la plaza", "tipo": "string", "campo": "puestos.descripcion", "medida": "m" };

    return buildTableSearch(nameCmp, title, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener);
}

function selectorTipoCorrShow(val) {
   
    searchTipoCorrida(val[0]);

    //alert(val);
}

function searchTipoCorrida(id) {
    //var obj = construirRegIncap();
    // console.log(obj);
    var url = route + "/api/TipoCorrida/getPorIdTipoCorrida";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
       // limpiarIcapacidades();
    } else {
        //limpiarIcapacidades();
        tipoCorrida = Mensaje.resultado;
        mostrarTipoCorra();
        var controlCred = "TipoCorrida" + tipoCorrida.id;
        getContenedorPorControl(controlCred);
        document.getElementById("btnGuarda").style.display = "none";
        document.getElementById("btnActualizar").style.display = "inline-block";
        document.getElementById("btnEliminar").style.display = "inline-block";
        //console.log(Mensaje.resultado);
    }
} 

function mostrarTipoCorra() {
    if (tipoCorrida !== null) {
        document.getElementById("txtClave").value = tipoCorrida.clave;
        document.getElementById("txtDescripcion").value = tipoCorrida.descripcion;
        document.getElementById("txtDetalleConceptoRecibo").value = tipoCorrida.detalleConceptoRecibo;
        document.getElementById("txtOrden").value = tipoCorrida.orden;
        document.getElementById("rbMostrarMenu").checked = tipoCorrida.mostrarMenuCalc;
        document.getElementById("rbUsaCorridaPer").checked = tipoCorrida.usaCorrPeriodica;
    }

}

function construitTipoCorida() {
    if (tipoCorrida === null) {
        tipoCorrida = {};
    }

    tipoCorrida.clave = document.getElementById("txtClave").value;
    tipoCorrida.descripcion = document.getElementById("txtDescripcion").value;
    tipoCorrida.detalleConceptoRecibo = document.getElementById("txtDetalleConceptoRecibo").value;
    tipoCorrida.mostrarMenuCalc = document.getElementById("rbMostrarMenu").checked;
    tipoCorrida.orden = parseInt(document.getElementById("txtOrden").value);
    tipoCorrida.sistema = true;
    tipoCorrida.tipoDeCalculo = 0;
    tipoCorrida.usaCorrPeriodica = document.getElementById("rbUsaCorridaPer").checked;

}

function crearContenedor() {
    var contenedor = {};
    contenedor.id = getContenedorIDMax() + 1;
    contenedor.habilitado = true;
    contenedor.nombre = document.getElementById("txtDescripcion").value;
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
    contenedor.tipoHerramienta_ID = 6;
    contenedor.descripcion = "";
    contenedor.nombreIcono = "";
    contenedor.accesoMenu = true;

    return contenedor;
}

function saveTipoCorrida() {
    var obj = {};
    construitTipoCorida();
    obj.tipoCorrida = tipoCorrida;

    if (document.getElementById("rbMostrarMenu").checked ) {
        var contenedor = crearContenedor();
        obj.contenedor = contenedor;
    }
    var url = route + "/api/TipoCorrida/saveTipoCorrida";
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

function limpiar() {
    tipoCorrida = null;
    contenedorActual = null;
  
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtDetalleConceptoRecibo").value = "";
    document.getElementById("txtOrden").value = "";
    document.getElementById("rbMostrarMenu").checked = false;
    document.getElementById("rbUsaCorridaPer").checked = false;
    document.getElementById("txtClave").value = "";
    document.getElementById("btnGuarda").style.display = "inline-block";
    document.getElementById("btnActualizar").style.display = "none";
    document.getElementById("btnEliminar").style.display = "none";
    
    //clearEdit("editConceptoInteresMen");


}

function actualizarTipoCorrida() {
    var obj = {};
    construitTipoCorida();
    obj.tipoCorrida = tipoCorrida;
    if (document.getElementById("rbMostrarMenu").checked && contenedorActual === null) {
        var contenedor = crearContenedor();
        obj.contenedor = contenedor;
    } else if (document.getElementById("rbMostrarMenu").checked && contenedorActual !== null) {
        contenedorActual.nombre = document.getElementById("txtDescripcion").value;
       
        contenedorActual.accesoMenu = true;
        obj.contenedor = contenedorActual;
    } else if (!document.getElementById("rbMostrarMenu").checked) {
        contenedorActual.accesoMenu = false;
        obj.contenedor = contenedorActual;
    }

    var url = route + "/api/TipoCorrida/saveTipoCorrida";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiar();
    } else {
        limpiar();
    }
}

function eliminarTipoCorrida() {
    var answer = confirm("¿Quieres eliminar este registro?");
    if (answer) {
      
        var url = route + "/api/TipoCorrida/deleteTipoCorrida";
        var dataToPost = JSON.stringify(tipoCorrida);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado === null) {
            alert("No object");
            limpiar();
        } else {
            limpiar();
        }
    }

}

function getContenedorIDMax() {
    var idContedor;
    var url = route + "/api/TipoCorrida/getContenedorIDMAx";
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
    var url = route + "/api/TipoCorrida/getContenedorPorControl";
    var dataToPost = JSON.stringify(claveControl);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        contenedorActual = null;

    } else {
        contenedorActual = Mensaje.resultado;
    }

}