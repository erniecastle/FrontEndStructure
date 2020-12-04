var fechaSistemasRegCred;
var tipoSueldo = null;
var status = null;
var contenedor;
var cmpFecha;
var periodo;
var tipoNomina;
var claveTipoCorrida = null;
var claveTipoNomina = null;
var claveRegPatronal = null;
var claveCtrCosto = null;
var claveDepto = null;
var claveEmpIni = null;
var claveEmpFin = null;
var claveCategoriasPuestos = null;
var clavePuesto = null;
var claveTurno = null;
var tipoSalario = null;
var claveFormaDePago = null;
var tipoContrato = null;

var razonSocialActual;
jQuery(document).ready(function () {
    contenedor = document.getElementById("capture");
    cmpFecha = contenedor.querySelector("[persist = FechaCalculo]");
    fechaSistemasRegCred = getFechaSistema();
    fecha = formatDate(fechaSistemasRegCred);
    cmpFecha.value = fecha;
    startCustomTools();
});
function CalculoSDI() {
    var obj = {};

    var cbxStatus = contenedor.querySelector("[persist = Estatus]");

    var cbxTipoSueldo = contenedor.querySelector("[persist = TipoSalario]");
    claveTipoCorrida = document.querySelector("[persist=TipoCorrida]").value;
    obj['claveTipoCorrida'] = claveTipoCorrida;
    claveTipoNomina = document.getElementById("editTipoNomina").getAttribute("extravalues").split(",")[0];
    obj['claveTipoNomina'] = claveTipoNomina;
    if (document.getElementById("editRegistroPatronal").getAttribute("extravalues")) {
        claveRegPatronal = document.getElementById("editRegistroPatronal").getAttribute("extravalues").split(",")[0];
        obj['claveRegPatronal'] = claveRegPatronal;
    }

    if (document.getElementById("editCentroDeCosto").getAttribute("extravalues")) {
        claveCtrCosto = document.getElementById("editCentroDeCosto").getAttribute("extravalues").split(",")[0];
        obj['claveCtrCosto'] = claveCtrCosto;
    }

    if (document.getElementById("editDepartamentos").getAttribute("extravalues")) {
        claveDepto = document.getElementById("editDepartamentos").getAttribute("extravalues").split(",")[0];
        obj['claveDepto'] = claveDepto;
    }

    claveEmpIni = document.querySelector("[dataedit=EditEmpleadosinicio]").getAttribute("extravalues").split(",")[0];
    obj['claveEmpIni'] = claveEmpIni;
    claveEmpFin = document.querySelector("[dataedit=EditEmpleadosfin]").getAttribute("extravalues").split(",")[0];
    obj['claveEmpFin'] = claveEmpFin;


    if (document.getElementById("editCategoriasPuestos").getAttribute("extravalues")) {
        claveCategoriasPuestos = document.getElementById("editCategoriasPuestos").getAttribute("extravalues").split(",")[0];
        obj['claveCategoriasPuestos'] = claveCategoriasPuestos;
    }
    if (document.getElementById("editPuestos").getAttribute("extravalues")) {
        clavePuesto = document.getElementById("editPuestos").getAttribute("extravalues").split(",")[0];
        obj['clavePuesto'] = clavePuesto;
    }
    if (document.getElementById("editTurnos").getAttribute("extravalues")) {
        claveTurno = document.getElementById("editTurnos").getAttribute("extravalues").split(",")[0];
        obj['claveTurno'] = claveTurno;
    }

    tipoContrato = document.querySelector("[persist=TipoContrato]").value;
    obj['tipoContrato'] = tipoContrato;

    if (document.getElementById("editFormasDePago").getAttribute("extravalues")) {
        claveFormaDePago = document.getElementById("editFormasDePago").getAttribute("extravalues").split(",")[0];
        obj['claveFormaDePago'] = claveFormaDePago;
    }


    if (cbxStatus.value === "1") {
        status = true;
        obj['status'] = status;
    } else if (cbxStatus.value === "2") {
        status = false;
        obj['status'] = status;
    }
    
    if (cbxTipoSueldo.value === "0") {
        tipoSueldo = 0;
    } else if (cbxTipoSueldo.value === "1") {
        tipoSueldo = 1;
    } else if (cbxTipoSueldo.value==="2") {
        tipoSueldo = 2;
    }
    obj['tipoSalario'] = tipoSueldo;

    obj['claveRazonSocial'] = "0001";
    var extra = {};
    extra.fechaCalculoSDI = new Date(formantDdMmYyyy(cmpFecha.value));
    obj['parametrosExtra'] = extra;

    var controlador = "#RazonesSociales" + obj['claveRazonSocial'];
    if (obj['claveRegPatronal'] !== "" && typeof obj['claveRegPatronal'] !=='undefined') {
        controlador = controlador + "#RegistroPatronal" + obj['claveRegPatronal'];
    }
    if (obj['claveCtrCosto'] !== "" && typeof obj['claveCtrCosto'] !== 'undefined') {
        controlador = controlador + "#CentroDeCostos" + obj['claveCtrCosto'];
    }

    if (obj['claveDepto'] !== "" && typeof obj['claveRegPatronal'] !== 'undefined') {
        controlador = controlador + "#Deparatamentos" + obj['claveDepto'];
    }
    if (obj['claveEmpIni'] !== "" && obj['claveEmpFin'] === "") {
        controlador = controlador + "#Empleados" + obj['claveEmpIni'];
    } else if (obj['claveEmpIni'] === "" && obj['claveEmpFin'] !== "") {
        controlador = controlador + "#Empleados" + obj['claveEmpFin'];
    } else if (obj['claveEmpIni'] !== "" && obj['claveEmpFin'] !== "") {
        controlador = controlador + "#Empleados" + obj['claveEmpIni'];
    }
    controlador = controlador + "#TipoNomina" + obj['claveTipoNomina'];
    if (obj['claveCategoriasPuestos'] !== "" && typeof obj['claveCategoriasPuestos'] !== 'undefined' ) {
        controlador = controlador + "#CategoriasPuestos" + obj['claveCategoriasPuestos'];
    }

    if (obj['clavePuesto'] !== "" && typeof obj['clavePuesto'] !== 'undefined') {
        controlador = controlador + "#Puestos" + obj['clavePuesto'];
    }

    controlador = controlador + "#TipoCorrida" + obj['claveTipoCorrida'];
    obj['controlador'] = controlador;
    obj['uso'] = 0;
    obj['soloCalculo'] = false;
    obj['peticionModuloCalculoSalarioDiarioIntegrado'] = true;
    calculoSdi(obj);
}

function calculoSdi(valores) {

    var url = route + "/api/CalculoNomina/calculoSDI";
    var dataToPost = JSON.stringify(valores);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        console.log(Mensaje.resultado);
    } else {
        console.log(Mensaje.resultado);
    }
    
}

function cargarArchivoProCol(origen) {

    var origenSel;
    var url = '/Resources/PropiedadesColumnas.json';
    var Mensaje = new Object();
    Mensaje.error = "";
    Mensaje.noError = "";
    Mensaje.resultado = Common.sendLocalFileRequestJson('GET', url, undefined, undefined, false);
    if (Mensaje.resultado !== null) {
        var archivo = Mensaje.resultado;
        origenSel = archivo[origen];

        //archivo = unescape(encodeURIComponent(archivo));
        //console.log(origenSel);
    }

    return origenSel;
}

function setEditObjectGeneric(data) {
    var origenSel = cargarArchivoProCol(data[0]);
    nameCmp = data[2];
    var table;
    if (data[0] !== "Empleados") {
        table = data[0];
    } else if (data[0] === "Empleados") {
        table = "PlazasPorEmpleadosMov";
    }

    nameCols = origenSel.nameColsObl;
    campos = origenSel.camposObl;//Quit ID;
    camposObtener = origenSel.camposObtenerObl;
    var subEntities = origenSel.subEntitiesObl; //Unnecesary
    camposMostrar = origenSel.camposMostrar;
    var preFilters = {};
    if (origenSel.camposWhere.length > 0) {
        for (var i = 0; i < origenSel.camposWhere.length; i++) {
            var dato = origenSel.camposValor[i];
            if (dato !== "RazonSocial") {
                var valor = document.querySelector("[table=" + dato + "]").getAttribute("value");
                if (typeof valor === "undefined") {
                    valor = document.querySelector("[persist=" + dato + "]").value;
                }
            } else {
                var razon = JSON.parse(localStorage.getItem("RazonSocial"));
                valor = razon.id;
            }
            if (typeof valor !== "undefined") {
                preFilters[origenSel.camposWhere[i]] = valor;
            } else {
                preFilters[origenSel.camposWhere[i]] = dato;
            }

        }
    }

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener);
}