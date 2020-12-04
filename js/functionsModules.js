var route = "";
var select = false;
var buqueda = false;
var detalleNor = false;
var detalleMas = false;
var archivo = "js/CalculoDeNomina.js";
var archivosDecExtreJS = "scripts/dx.all.js";
var archivosDecExtreCSS = "Content/dx.common.css";
var archivosDecExtreCSS2 = ["Content/dx.light.css", "generic.light", "dx-theme"];
var idiomaSelecionado;
var idioma;
//1:Componentes html, 2:Componentes de devExtreme
var tipoComponentes = 1;
jQuery(document).ready(function () {
    var oHead = document.getElementsByTagName('head')[0];
    var query = getParameterByName('screen');
    cargarArchivosGlobalize();
    cambiarIdioma(sessionStorage["idioma"] !== undefined ? sessionStorage["idioma"] : "es");
    if (sessionStorage["idioma"] !== undefined) {
        if (document.getElementById('idioma')) {
            document.getElementById('idioma').value = sessionStorage["idioma"];
        }
    }

    var path = window.location.pathname;
    var page = path.split("/").pop();

    if (query !== "" || page === "main.html") {
        //url = window.location.href;
        //if (tipoComponentes === 2) {
        //    $.ajax({
        //        url: archivosDecExtreJS,
        //        dataType: 'script',
        //        success: function (data) { console.log(data);/*incluirJavaScritYCSS();*/ },
        //        async: false
        //    });
        //}
        getCaptura();
    } else {
        crearMenu();
    }
});

function tiposPantalla(sel, search, Detalle, DetalleMasiva) {
    select = sel;
    buqueda = search;
    detalleNor = Detalle;
    detalleMas = DetalleMasiva;
}

function incluirJavaScritYCSS() {

    if (tipoComponentes === 2) {
        var oHead = document.getElementsByTagName('head')[0];

        var scriptAL = oHead.querySelectorAll('script')


        var oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src = archivosDecExtreJS;
        oScript.async = false;
        //oScript.onload = function () {
        //    alert("se cargo el archivo");
        //};

        for (var i = 0; i < scriptAL.length; i++) {
            //  if (scriptAL[i].getAttribute('src') === "scripts/cldr.js") {
            //console.log(scriptAL[i]);
            oHead.insertBefore(oScript, scriptAL[i]);

            // }
        }

    }


}

function getlistaCapturas() {
    var res;
    var url = route + "/api/ConfiguracionCapturas/SearchAll";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        res = Mensaje.resultado;
    }
    return res;
}

function getlistaCapturasProceso() {
    var res;
    var url = route + "/api/ConfiguracionCapturasProces/SearchAll";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        res = Mensaje.resultado;
    }
    return res;
}

function getCaptura() {
    var query = getParameterByName('screen');
    var url;
    var value;
    if (query !== '') {
        value = query.split('|');
    } else {
        var obj = JSON.parse($("#container").data("opener"));
        query = obj.tipoCaptura + "|" + obj.IdScreen;
        value = query.split('|');
    }

    var clave = value[1];
    if (value[0] === "1" || value[0] === "5") {
        url = route + "/api/ConfiguracionCapturas/SearchByKey";
    } else if (value[0] === "2") {
        url = route + "/api/ConfiguracionCapturasProces/SearchByKey";
    }

    if (value[0] === "1010") {
        url = route + "/api/ConfiguracionCapturas/ReadHtml";
        var nameWindow = value[1];
        var uri = window.location.protocol + "//" + window.location.host + window.location.pathname;
        uri = uri.substring(0, uri.lastIndexOf("/") + 1) + nameWindow + ".html";
        var dataToPost = JSON.stringify(uri);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado === null) {

        } else {
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(Mensaje.resultado, 'text/html');
            var con = htmlDoc.getElementById("container");
            buildStaticModule(con);
            //alert(htmlDoc.body.innerHTML);
        }
    }
    else {
        var dataToPost = JSON.stringify(clave);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado === null) {
            alert("No exists window");
        } else {
            buildModule(Mensaje.resultado);
        }
    }
}

function activarSelector(sel) {
    select = sel;
}

function buildStaticModule(con) {
    var cont = document.getElementById('container');

    cont.appendChild(con);



}

function buildModule(configCap) {
    showWait(2);
    if (document.getElementById('comboIdioma')) {
        document.getElementById('comboIdioma').style.display = 'none';
    }
    definirIdioma(idiomaSelecionado);
    if (configCap.tipoDeCaptura === 1 || configCap.tipoDeCaptura === 5) {
        var idiv = ejecutarCapture(configCap);
        // var cont = document.getElementById('container');
        if (configCap.tipoDeCaptura === 5) {
            if (document.getElementById('ContenedorBtnTable')) {
                var con = document.getElementById('ContenedorBtnTable');

                con.parentNode.insertBefore(createButtonContinuar(configCap.origenDeDatos.nombre), con);
            }
            if (tipoComponentes === 2) {
                crearBotonContinuar();
            }
        }
        if (select) {
            buquedaRangos(0, configCap.origenDeDatos.nombre);
        } else {
            selecionarTabla(configCap.origenDeDatos.nombre);
            activarMode();
        }
        getnames();
        if (idiv.getAttribute('tipocaptura')) {
            getnamecaptureDetalle();
        }
        if (select) {
            getnamesSelector();
        }
        addListerner(addEventListener)
        llenarSelects();
    } else if (configCap.tipoDeCaptura === 2) {
        var div = ejecutarCaptureProceso(configCap);

    }
    removeWait();
}

function getParameterByName(name) {

    var url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
    if (!results)
        return '';
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function crearMenu() {
    var res = getlistaCapturas();
    var cont = document.getElementById("Menu");
    var h2 = document.createElement('h2');
    h2.innerHTML = "Catalogos";
    cont.appendChild(h2);
    for (var i = 0; i < res.length; i++) {
        var a = document.createElement('a');
        var linkText = document.createTextNode(res[i]['nombre']);
        a.appendChild(linkText);
        a.href = "modulo.html?screen=" + res[i]['tipoDeCaptura'] + "|" + res[i]['clave'];
        // a.style.display = "block";
        a.style.cssText = ' -webkit-border-radius: 20px -moz-border-radius: 20px; border-radius: 20px;\n\
        border: solid 1px #20538D; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);\n\
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        background: #4479BA; color: #FFF; padding: 8px 12px; text-decoration: none; display:block; margin: 5px;';
        cont.appendChild(a);
    }
    var resMov = getlistaConfigMovimientos();
    if (resMov !== undefined) {
        for (var i = 0; i < resMov.length; i++) {
            var a = document.createElement('a');
            var linkText = document.createTextNode(resMov[i]['nombre']);
            a.appendChild(linkText);
            a.href = "MovientosNomina.html?screen=" + resMov[i]['id'];
            // a.style.display = "block";
            a.style.cssText = ' -webkit-border-radius: 20px -moz-border-radius: 20px; border-radius: 20px;\n\
        border: solid 1px #20538D; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);\n\
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        background: #4479BA; color: #FFF; padding: 8px 12px; text-decoration: none; display:block; margin: 5px;';
            cont.appendChild(a);
        }
    }
    var a = document.createElement('a');
    var linkText = document.createTextNode("Configuracion Movimientos");
    a.appendChild(linkText);
    a.href = "configMovimientos.html";
    // a.style.display = "block";
    a.style.cssText = ' -webkit-border-radius: 20px -moz-border-radius: 20px; border-radius: 20px;\n\
        border: solid 1px #20538D; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);\n\
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        background: #4479BA; color: #FFF; padding: 8px 12px; text-decoration: none; display:block; margin: 5px;';
    cont.appendChild(a);
    var a = document.createElement('a');
    var linkText = document.createTextNode("Concepto Por Corrida");
    a.appendChild(linkText);
    a.href = "conceptoPorCorrida.html";
    // a.style.display = "block";
    a.style.cssText = ' -webkit-border-radius: 20px -moz-border-radius: 20px; border-radius: 20px;\n\
        border: solid 1px #20538D; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);\n\
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        background: #4479BA; color: #FFF; padding: 8px 12px; text-decoration: none; display:block; margin: 5px;';
    cont.appendChild(a);
    var a = document.createElement('a');
    var linkText = document.createTextNode("Difinir Parametros");
    a.appendChild(linkText);
    a.href = "definirParametros.html";
    // a.style.display = "block";
    a.style.cssText = ' -webkit-border-radius: 20px -moz-border-radius: 20px; border-radius: 20px;\n\
        border: solid 1px #20538D; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);\n\
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        background: #4479BA; color: #FFF; padding: 8px 12px; text-decoration: none; display:block; margin: 5px;';
    cont.appendChild(a);

    var a = document.createElement('a');
    var linkText = document.createTextNode("Prueba cfdi");
    a.appendChild(linkText);
    a.href = "javascript:pruebacfdi();";
    // a.style.display = "block";
    a.style.cssText = ' -webkit-border-radius: 20px -moz-border-radius: 20px; border-radius: 20px;\n\
        border: solid 1px #20538D; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);\n\
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        background: #4479BA; color: #FFF; padding: 8px 12px; text-decoration: none; display:block; margin: 5px;';
    cont.appendChild(a);
    var a = document.createElement('a');
    var linkText = document.createTextNode("Configuracion de Creditos y Ahorros");
    a.appendChild(linkText);
    a.href = "configuracionCreditoAhorro.html";
    // a.style.display = "block";
    a.style.cssText = ' -webkit-border-radius: 20px -moz-border-radius: 20px; border-radius: 20px;\n\
        border: solid 1px #20538D; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);\n\
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        background: #4479BA; color: #FFF; padding: 8px 12px; text-decoration: none; display:block; margin: 5px;';
    cont.appendChild(a);

    var a = document.createElement('a');
    var linkText = document.createTextNode("Configuracion Asistencias");
    a.appendChild(linkText);
    a.href = "configAsistencia.html";
    // a.style.display = "block";
    a.style.cssText = ' -webkit-border-radius: 20px -moz-border-radius: 20px; border-radius: 20px;\n\
        border: solid 1px #20538D; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);\n\
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        background: #4479BA; color: #FFF; padding: 8px 12px; text-decoration: none; display:block; margin: 5px;';
    cont.appendChild(a);

    var a = document.createElement('a');
    var linkText = document.createTextNode("Prueba consulta especial");
    a.appendChild(linkText);
    a.href = "javascript:pruebaconsultaespecial();";
    // a.style.display = "block";
    a.style.cssText = ' -webkit-border-radius: 20px -moz-border-radius: 20px; border-radius: 20px;\n\
        border: solid 1px #20538D; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);\n\
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        background: #4479BA; color: #FFF; padding: 8px 12px; text-decoration: none; display:block; margin: 5px;';
    cont.appendChild(a);

    var a = document.createElement('a');
    var linkText = document.createTextNode("Prueba Table");
    a.appendChild(linkText);
    a.href = "pruebTableCustom.html";
    // a.style.display = "block";
    a.style.cssText = ' -webkit-border-radius: 20px -moz-border-radius: 20px; border-radius: 20px;\n\
        border: solid 1px #20538D; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);\n\
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        background: #4479BA; color: #FFF; padding: 8px 12px; text-decoration: none; display:block; margin: 5px;';
    cont.appendChild(a);


    var h2p = document.createElement('h2');
    h2p.innerHTML = "Proceso";
    cont.appendChild(h2p);
    var resProceso = getlistaCapturasProceso();
    for (var i = 0; i < resProceso.length; i++) {
        var a = document.createElement('a');
        var linkText = document.createTextNode(resProceso[i]['nombre']);
        a.appendChild(linkText);
        a.href = "modulo.html?screen=" + resProceso[i]['clave'] + "|" + resProceso[i]['tipoDeCaptura'];;
        // a.style.display = "block";
        a.style.cssText = ' -webkit-border-radius: 20px -moz-border-radius: 20px; border-radius: 20px;\n\
        border: solid 1px #20538D; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);\n\
        -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\n\
        background: #0f6bdb; color: #FFF; padding: 8px 12px; text-decoration: none; display:block; margin: 5px;';
        cont.appendChild(a);
    }
}

function cambiarIdioma(idioma) {
    sessionStorage.setItem('idioma', idioma);
    idiomaSelecionado = cargarArchivoIdioma(idioma);
    var cont = document.querySelectorAll('[idetiqueta]');
    for (var i = 0; i < cont.length; i++) {
        cont[i].innerHTML = idiomaSelecionado.messageFormatter(cont[i].getAttribute("idEtiqueta"))();
    }
}

function cambiarTema(tema) {
    var con = document.getElementById('principalCont');
    con.className = "";
    con.className = tema;
}

function getlistaConfigMovimientos() {
    var res;
    var url = route + "/api/MovimientosNomina/getAllConfiguracionMovimientos";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        res = Mensaje.resultado;
    }
    return res;
}

function pruebacfdi() {
    var res = {};
    var url = route + "/api/CFDIEmpleado/GeneraTimbrado";
    var dataToPost = JSON.stringify(res);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        //res = Mensaje.resultado;
    }

}

function pruebaconsultaespecial() {
    var res = {};
    var url = route + "/api/Generic/getConsultaPorFiltrosEspecial";
    var valoresWhere = new Array();
    valoresWhere[0] = "0001";
    valoresWhere[1] = null;
    valoresWhere[2] = new Date();
    valoresWhere[3] = new Date();

    res.valoresWhere = valoresWhere;
    res.inicio = 0;
    res.rango = 25;
    res.identificador = "QueryEmpleadoEspecialMovimientosNomina";
    res.isLista = true;
    var dataToPost = JSON.stringify(res);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        //res = Mensaje.resultado;
        console.log(JSON.parse(Mensaje.resultado));
    }

}

function imprimirReports() {

    var url = route + "/api/Generic/getReporte";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje === null) {
        console.log("error");
    } else {
        console.log(JSON.stringify(Mensaje));
       
                // Create a new report instance
                var report = new Stimulsoft.Report.StiReport();
                // Load report from url
               report.loadFile("Content/ReporteNomina.mrt");

                // Create new DataSet object
                var dataSet = new Stimulsoft.System.Data.DataSet("Datos");
                // Load JSON data file from specified URL to the DataSet object readJsonFile
                dataSet.readJson(Mensaje);
                // Remove all connections from the report template
                report.dictionary.databases.clear();
                // Register DataSet object


                report.regData("Datos", "Datos", dataSet);
                report.dictionary.synchronize();
                // Render report with registered data

                report.render();
                var viewer = new Stimulsoft.Viewer.StiViewer();
                viewer.report = report;
                //buildModule(Mensaje.resultado);
                //alert(Mensaje.resultado);
                //document.write("Complete.<br>");
                //document.write("Rendered pages count: " + report.renderedPages.count);
    }
    //$.ajax({
    //    type: "POST",
    //    url: route + "/api/Generic/getReporte",
    //    contentType: 'application/json',
    //    dataType: 'json',
    //    async: false,
    //    success: function (Mensaje) {
    //        if (Mensaje === null) {
    //            alert("No object");
    //        } else {

    //            console.log(JSON.stringify(Mensaje));
    //            // Create a new report instance
    //            var report = new Stimulsoft.Report.StiReport();
    //            // Load report from url
    //            report.loadFile("/Content/ReporteNomina.mrt");

    //            // Create new DataSet object
    //            var dataSet = new Stimulsoft.System.Data.DataSet("Datos");
    //            // Load JSON data file from specified URL to the DataSet object readJsonFile
    //            dataSet.readJson(Mensaje);
    //            // Remove all connections from the report template
    //            report.dictionary.databases.clear();
    //            // Register DataSet object


    //            report.regData("Datos", "Datos", dataSet);
    //            report.dictionary.synchronize();
    //            // Render report with registered data

    //            report.render();
    //            var viewer = new Stimulsoft.Viewer.StiViewer();
    //            viewer.report = report;
    //            //buildModule(Mensaje.resultado);
    //            //alert(Mensaje.resultado);
    //            //document.write("Complete.<br>");
    //            //document.write("Rendered pages count: " + report.renderedPages.count);
    //        }
    //    },
    //    error: function (e) {
    //        console.log(e);
    //    }
    //});

}