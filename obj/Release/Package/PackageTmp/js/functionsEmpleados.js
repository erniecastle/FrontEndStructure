/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Brief: Clase estatica para el catalogo de Empleados
 */

var route = "";
var getEmpleados = null;
var listaGenero = new Array();
var dataFamiliares = new Array();
var deleteFamiliares = new Array();
var dataFormaAcade = new Array();
var deleteFormaAcade = new Array();
var dataCapacitacion = new Array();
var deleteCapacitacion = new Array();
var dataExpeLaboExt = new Array();
var deleteExpeLaboExt = new Array();
var dataExpeLaboInt = new Array();
var deleteExpeLaboInt = new Array();
var dataDocumentacion = new Array();
var deleteDocumentacion = new Array();
var elements = new Array("txtClaveEmp", "txtApellPatEmp", "txtApellMatEmp", "txtNombreEmp",
      "txtNombreAbrevEmp", "txtFechaNacEmp", "cbxPaisesOrEm", "txtNacionEmp", "editEmpleadosEstadoNac",
       "txtLugarNacEmp", "cbxGeneroEm", "cbxEstadoCivEm", "txtFechaIngreEmp", "txtRFCEmp", "txtCurpEmp",
       "txtNoSegSocialEmp", "txtClinicaEmp", "txtCorreoElEmp", "txtTelefonoEmp", /*"txtCalleEmp", "txtNumExtEmp","txtNumIntEmp", "txtColoniaEmp",*/
    "editEmpleadosCp", "editEmpleadosCiudades", "editEmpleadosMunicipio", "editEmpleadosEstado", "editEmpleadosPais");
var idiomaSelecionadoCol;

jQuery(document).ready(function () {
    var idioma = sessionStorage.getItem("idioma");
    idiomaSelecionadoCol = cargarArchivoIdioma(idioma);
    nombreTablaBDs = "Empleados";
    addListenersEmp();
    initEmp();

    //alert(" Height: " + $(document).height() + " Width: " + $(document).width());
});

function InitAction() {
    InitDefault();
}

function InitDefault() {
    //document.getElementById("txtClaveEmp").value = obj.clave;
    document.getElementById("txtApellPatEmp").value = "Hinojosa";
    document.getElementById("txtApellMatEmp").value = "Delacourt";
    document.getElementById("txtNombreEmp").value = "Estefanía";
    document.getElementById("txtNombreAbrevEmp").value = "Stefanie";
    var date = new Date();
    date.setDate(15);
    date.setMonth(03);
    date.setYear(1990);
    document.getElementById("txtFechaNacEmp").value = formatDate(date);
    // $("#cbxEstadoNacEm").val('45');
    document.getElementById("txtLugarNacEmp").value = "Culiacan";
    // $('#imageToView').attr('src', "data:image/jpeg;base64," + obj.foto).width(80).height(80);
    $("#cbxPaisesOrEm").val('2');
    document.getElementById("txtNacionEmp").value = "Mexicana";
    $("#cbxGeneroEm").val("1");
    $("#cbxEstadoCivEm").val(1);
    document.getElementById("txtRFCEmp").value = "2540536569874";
    document.getElementById("txtCurpEmp").value = "2540536569874";
    document.getElementById("txtNoSegSocialEmp").value = "440997349903";
    document.getElementById("txtClinicaEmp").value = "44972998974432";
    document.getElementById("txtCorreoElEmp").value = "test@mail.com";
    document.getElementById("txtTelefonoEmp").value = "6681151211";
    document.getElementById("txtCalleEmp").value = "Av. Park Avenue";
    document.getElementById("txtNumExtEmp").value = "1340";
    document.getElementById("txtNumIntEmp").value = "1111";
    document.getElementById("txtColoniaEmp").value = "Jackson Town";
    //$("#cbxCpEm").val("2");
    // $("#cbxCiudadesEm").val("1");
    $("#cbxMunicipiosEm").val("1");
    $("#cbxEstadosEm").val("1");
    $("#cbxPaisesEm").val("1");
}

function initEmp() {
    //Set main default key
    generateValueEmpleado();
    var date = new Date(getFechaSistema());
    document.getElementById("txtFechaIngreEmp").value = formatDate(date);
    //Fill Genero
    var url = route + "/api/Genero/getAllGenero";
    Common.sendRequestJsonWithFunction('POST', url, null, undefined, true, null, "fillGenero");
    //var url = route + "/api/Estados/getAllEstados";
    //Common.sendRequestJsonWithFunction('POST', url, null, undefined, true, null, "fillEstadoNac");
    //Fill Estado civil
    fillEstadoCivil();
    var url = route + "/api/Genero/getAllGenero";
    Common.sendRequestJsonWithFunction('POST', url, null, undefined, true, null, "createTableFamiliares");

    //Create Table Estudios
    OpenTable(document.getElementById('tblEstudios'));
    //Create Table Capacitaciones
    OpenTable(document.getElementById('tblCapacitacion'));
    //Create Table Experiencia Laboral Externa
    OpenTable(document.getElementById('tblExpeLaboExt'));
    //Create Table Experiencia Laboral Interna
    OpenTable(document.getElementById('tblExpeLaboInt'));
    //Create Documentacion
    OpenTable(document.getElementById('tblDocumentos'));

}

function addListenersEmp() {
    document.getElementById("txtApellPatEmp").addEventListener("change", callGenerator);
    document.getElementById("txtApellMatEmp").addEventListener("change", callGenerator);
    document.getElementById("txtNombreEmp").addEventListener("change", callGenerator);
    document.getElementById("txtFechaNacEmp").addEventListener("change", callGenerator);
    document.getElementById("cbxGeneroEm").addEventListener("change", callGenerator);
    // document.getElementById("txtEditKeyEmpleadosEstadoNac").addEventListener("change", callGenerator);
    document.getElementById("txtEditBriefEmpleadosEstadoNac").addEventListener("change", callGenerator);
    //document.getElementById("txtEditKeyEmpleadosEstadoNac").addEventListener("change", callGenerator);

    $("#txtClaveEmp").on("keydown", function (event) {
        var valor = this.value;
        if (event.keyCode === 13 || event.keyCode === 9) {
            if (valor !== "") {
                valor = construyeMascara("clave", valor);
                this.value = valor;
            }
        }
    });

    //txtApellPatEmp
    //txtApellMatEmp
    // txtNombreEmp
    //txtFechaNacEmp
    //cbxGeneroEm
    //cbxEstadoNacEm
}


function callGenerator(event) {
    // var element = event.currentTarget
    var apellidoPaterno = document.getElementById('txtApellPatEmp').value,
        apellidoMaterno = document.getElementById('txtApellMatEmp').value,
        nombre = document.getElementById('txtNombreEmp').value,
        fechaNacimiento = document.getElementById('txtFechaNacEmp').value,
        genero = document.getElementById('cbxGeneroEm').value,
        estado = document.getElementById("editEmpleadosEstadoNac").getAttribute("value");
    //estado = document.getElementById('cbxEstadoNacEm').value.toString();

    if (fechaNacimiento.length > 0) {
        var genDate = new Date(fechaNacimiento);
        fechaNacimiento = getCustomformatDatemmddyyy(genDate);
    }

    genero = genero === "" ? "" : genero === "1" ? "M" : "H";
    estado = getKeyEstado(estado);

    if (apellidoPaterno.length > 0 && apellidoMaterno.length > 0
       && nombre.length > 0 && fechaNacimiento.length > 0) {
        var generatedRFC = Utilerias.prototype.calcularRFC(
            apellidoPaterno, apellidoMaterno, nombre, fechaNacimiento);
        var genRFC = Utilerias.prototype.calcularRFC(apellidoPaterno, apellidoMaterno,
               nombre, fechaNacimiento)

        document.getElementById('txtRFCEmp').value = generatedRFC.toString();
        if (genero.length > 0 && estado > -1) {
            var genCurp = Utilerias.prototype.calcularCURP(apellidoPaterno, apellidoMaterno,
               nombre, fechaNacimiento, genero, estado);
            document.getElementById('txtCurpEmp').value = genCurp.toString();

        }
    }

    //console.log(element.id, element.value)
}

function getCustomformatDatemmddyyy(date) {
    var hoy = date;
    var dd = hoy.getDate() + 1;
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();

    dd = addZero(dd);
    mm = addZero(mm);
    //console.log(yyyy + '-' + mm + '-' + dd);
    return dd + '/' + mm + '/' + yyyy;
}

function getKeyEstado(valEstado) {

    if (valEstado === "1") {
        return 1;//AGUASCALIENTES
    } else if (valEstado === "2") {
        return 2; //BAJA CALIFORNIA
    } else if (valEstado === "3") {
        return 3 //BAJA CALIFORNIA SUR
    } else if (valEstado === "4") {
        return 4; //CAMPECHE
    } else if (valEstado === "5") {
        return 7; //CHIAPAS
    } else if (valEstado === "6") {
        return 8; //CHIHUAHUA
    } else if (valEstado === "7") {
        return 5; //COAHUILA
    } else if (valEstado === "8") {
        return 6; //COLIMA
    } else if (valEstado === "9") {
        return 0; //DISTRITO FEDERAL
    } else if (valEstado === "10") {
        return 9; //DURANGO
    } else if (valEstado === "11") {
        return 10; //GUANAJUATO
    } else if (valEstado === "12") {
        return 11; //GUERRERO
    } else if (valEstado === "13") {
        return 12; //HIDALGO
    } else if (valEstado === "14") {
        return 13; //JALISCO
    } else if (valEstado === "15") {
        return 14; //ESTADO DE MEXICO
    } else if (valEstado === "16") {
        return 15; //MICHOACAN
    } else if (valEstado === "17") {
        return 16; //MORELOS
    } else if (valEstado === "18") {
        return 17; //NAYARIT
    } else if (valEstado === "19") {
        return 18; //NUEVO LEON 
    } else if (valEstado === "20") {
        return 19; //OAXACA
    } else if (valEstado === "21") {
        return 20; //PUEBLA
    } else if (valEstado === "22") {
        return 21; //QUERETARO
    } else if (valEstado === "23") {
        return 22; //QUINTANA ROO
    } else if (valEstado === "24") {
        return 23; //SAN LUIS POTOSI
    } else if (valEstado === "25") {
        return 24; //SINALOA
    } else if (valEstado === "26") {
        return 25; //SONORA
    } else if (valEstado === "27") {
        return 26; //TABASCO
    } else if (valEstado === "28") {
        return 27; //TAMAULIPAS
    } else if (valEstado === "29") {
        return 28; //TLAXCALA
    } else if (valEstado === "30") {
        return 29; //VERACRUZ
    } else if (valEstado === "31") {
        return 30; //YUCATAN
    } else if (valEstado === "32") {
        return 31; //ZACATECAS
    }
}

/*Fillers*/
function fillGenero(Mensaje) {
    if (Mensaje.resultado !== null) {
        var typesGen = Mensaje.resultado;
        var cbxGen = document.getElementById('cbxGeneroEm');
        cbxGen.appendChild(new Option("", ""));
        typesGen.forEach(function (val, index) {
            var opt = document.createElement('option');
            opt.innerHTML = val['clave'] + " " + val['descripcion'];
            opt.value = val['id'];
            cbxGen.appendChild(opt);
        });
    }
}

//DEAR
//function fillCp(Mensaje) {
//    if (Mensaje.resultado !== null) {
//        var typesCp = Mensaje.resultado;
//        var cbx = document.getElementById('cbxCpEm');
//        cbx.appendChild(new Option("", ""));
//        typesCp.forEach(function (val, index) {
//            var opt = document.createElement('option');
//            opt.innerHTML = val['clave'] + " " + val['descripcion'];
//            opt.value = val['id'];
//            cbx.appendChild(opt);
//        });
//    }
//}

//function fillCiudad(Mensaje) {
//    if (Mensaje.resultado !== null) {
//        var typesCiu = Mensaje.resultado;
//        var cbx = document.getElementById('cbxCiudadesEm');
//        cbx.appendChild(new Option("", ""));
//        typesCiu.forEach(function (val, index) {
//            var opt = document.createElement('option');
//            opt.innerHTML = val['clave'] + " " + val['descripcion'];
//            opt.value = val['id'];
//            cbx.appendChild(opt);
//        });
//    }
//}

//function fillMunicipio(Mensaje) {
//    if (Mensaje.resultado !== null) {
//        var typesMun = Mensaje.resultado;
//        var cbx = document.getElementById('cbxMunicipiosEm');
//        cbx.appendChild(new Option("", ""));
//        typesMun.forEach(function (val, index) {
//            var opt = document.createElement('option');
//            opt.innerHTML = val['clave'] + " " + val['descripcion'];
//            opt.value = val['id'];
//            cbx.appendChild(opt);
//        });
//    }
//}

//function fillEstados(Mensaje) {
//    if (Mensaje.resultado !== null) {
//        var typesEs = Mensaje.resultado;
//        var cbx = document.getElementById('cbxEstadosEm');
//        cbx.appendChild(new Option("", ""));
//        typesEs.forEach(function (val, index) {
//            var opt = document.createElement('option');
//            opt.innerHTML = val['clave'] + " " + val['descripcion'];
//            opt.value = val['id'];
//            cbx.appendChild(opt);
//        });
//    }
//}

//function fillPaises(Mensaje) {
//    if (Mensaje.resultado !== null) {
//        var typesPa = Mensaje.resultado;
//        var cbx = document.getElementById('cbxPaisesEm');
//        cbx.appendChild(new Option("", ""));
//        typesPa.forEach(function (val, index) {
//            var opt = document.createElement('option');
//            opt.innerHTML = val['clave'] + " " + val['descripcion'];
//            opt.value = val['id'];
//            cbx.appendChild(opt);
//        });
//    }
//}

//function fillPaisesOr(Mensaje) {
//    if (Mensaje.resultado !== null) {
//        var typesPa = Mensaje.resultado;
//        var cbx = document.getElementById('cbxPaisesOrEm');
//        cbx.appendChild(new Option("", ""));
//        typesPa.forEach(function (val, index) {
//            var opt = document.createElement('option');
//            opt.innerHTML = val['clave'] + " " + val['descripcion'];
//            opt.value = val['id'];
//            cbx.appendChild(opt);
//        });
//    }
//}

function fillEstadoNac(clavePais) {
    var cbxEstadoNac = document.getElementById('cbxEstadoNacEm');
    cbxEstadoNac.appendChild(new Option("", ""));
    var url = route + "/api/Estados/getEstadosPorPais";
    var data = JSON.stringify(clavePais);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false, null);
    if (Mensaje.resultado !== null) {
        typesEs = Mensaje.resultado;
        typesEs.forEach(function (val, index) {
            var opt = document.createElement('option');
            opt.innerHTML = val['clave'] + " " + val['descripcion'];
            opt.value = val['id'];
            cbxEstadoNac.appendChild(opt);
        });
    }
}

function fillEstadoCivil(Mensaje) {
    var select = document.getElementById("cbxEstadoCivEm");
    select.appendChild(new Option("", ""));
    var option = document.createElement("option");
    option.text = "Soltero(a)";
    option.value = "1";
    select.appendChild(option);
    option = document.createElement("option");
    option.text = "Casado(a)";
    option.value = "2";
    select.appendChild(option);
    option = document.createElement("option");
    option.text = "Divorciado(a)";
    option.value = "3";
    select.appendChild(option);
    option = document.createElement("option");
    option.text = "Viudo(a)";
    option.value = "4";
    select.appendChild(option);
    option = document.createElement("option");
    option.text = "Union libre";
    option.value = "5";
    select.appendChild(option);
    option = document.createElement("option");
    option.text = "Separado(a)";
    option.value = "6";
    select.appendChild(option);
}

function createTableFamiliares(Mensaje) {
    if (Mensaje.resultado !== null) {
        var typesEs = Mensaje.resultado;
        typesEs.forEach(function (val, index) {
            var obj = {};
            if (val['id'] === 1) {
                obj.id = true;
            } else {
                obj.id = false;
            }

            obj.clave = val['clave'];
            obj.descripcion = val['descripcion'];
            listaGenero[listaGenero.length] = obj;
        });
    }
    OpenTable(document.getElementById('tblFamiliares'));
    InitEventsTable();
}

function getEmpleado(idVal) {
    var empleado = undefined;
    var valId = idVal;
    var url = route + "/api/Empleados/getPorIdEmpleado";
    var razon = localStorage.getItem("RazonSocial");
    var data = new Object();
    data['idEmpleado'] = valId;
    data['claveRazonSocial'] = getRazonSocial().clave;
    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {
        empleado = Mensaje.resultado;
    } else {
        console.log(Mensaje.error);
    }
    if (empleado === undefined) {
        var empleado = {};
    }
    return empleado;
}

function generateValueEmpleado() {
    var obj = {};
    obj.fuentePrincipal = "Empleados";
    obj.campo = "clave";
    var keyIngreRein = document.getElementById("txtClaveEmp").value;
    var url = route + "/api/Generic/obtenerClaveStringMax";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.error === "") {
        var key = Mensaje.resultado;
        if (key === "") {
            key = 1;
        } else {
            key = generaClaveMax(key);
        }
        var clave = construyeMascara("Clave", key);
        document.getElementById("txtClaveEmp").value = clave;
    } else {
        console.log(Mensaje.error);
    }
}

function construirEmp(obj) {
    var empleados = null;
    if (obj === undefined || obj === null) {
        empleados = {};
    } else {
        empleados = {};
        if (obj[0].id !== undefined) {
            empleados.id = obj[0].id;
        }
    }

    empleados.clave = document.getElementById("txtClaveEmp").value;
    empleados.apellidoPaterno = document.getElementById("txtApellPatEmp").value;
    empleados.apellidoMaterno = document.getElementById("txtApellMatEmp").value;
    empleados.nombre = document.getElementById("txtNombreEmp").value;
    empleados.nombreAbreviado = document.getElementById("txtNombreAbrevEmp").value;
    empleados.fechaNacimiento = document.getElementById("txtFechaNacEmp").value;
    //var cbxEstadoNac = document.getElementById("cbxEstadoNacEm");
    //var valEstadoNac = cbxEstadoNac.options[cbxEstadoNac.selectedIndex].value;
    //if (valEstadoNac !== undefined) {
    //    empleados.estadoNacimiento_ID = valEstadoNac;
    //}

    empleados.estadoNacimiento_ID = document.getElementById("editEmpleadosEstadoNac").getAttribute("value")
    empleados.lugarNacimiento = document.getElementById("txtLugarNacEmp").value;
    var imagetoPut = $('#imageToView').data("image");
    if (imagetoPut !== undefined) {
        empleados.foto = $('#imageToView').data("image");
    }
    if (document.getElementById("editEmpleadosPaisOr").getAttribute("value")) {
        empleados.paisOrigen_ID = document.getElementById("editEmpleadosPaisOr").getAttribute("value");
    }
    //var cbxPaisOr = document.getElementById("cbxPaisesOrEm");
    //var valPaisOr = cbxPaisOr.options[cbxPaisOr.selectedIndex].value;
    //if (valPaisOr !== undefined) {
    //    empleados.paisOrigen_ID = valPaisOr;
    //}
    empleados.nacionalidad = document.getElementById("txtNacionEmp").value;
    var cbxGenEm = document.getElementById("cbxGeneroEm");
    var valGenEm = cbxGenEm.options[cbxGenEm.selectedIndex].value;
    if (valGenEm !== undefined) {
        empleados.genero_ID = valGenEm;
    }
    var cbxEstadoCiv = document.getElementById("cbxEstadoCivEm");
    var valEstCiv = cbxEstadoCiv.options[cbxEstadoCiv.selectedIndex].value;
    if (valEstCiv !== undefined) {
        empleados.estadoCivil = valEstCiv;
    }

    empleados.fechaIngresoEmpresa = document.getElementById("txtFechaIngreEmp").value;
    empleados.RFC = document.getElementById("txtRFCEmp").value;
    empleados.CURP = document.getElementById("txtCurpEmp").value;
    empleados.IMSS = document.getElementById("txtNoSegSocialEmp").value;
    empleados.clinicaIMSS = document.getElementById("txtClinicaEmp").value;
    empleados.correoElectronico = document.getElementById("txtCorreoElEmp").value;
    empleados.telefono = document.getElementById("txtTelefonoEmp").value;
    empleados.domicilio = document.getElementById("txtCalleEmp").value;
    empleados.numeroExt = document.getElementById("txtNumExtEmp").value;
    empleados.numeroInt = document.getElementById("txtNumIntEmp").value;
    empleados.colonia = document.getElementById("txtColoniaEmp").value;

    //Dear
    if (document.getElementById("editEmpleadosCp").getAttribute("value")) {
        empleados.cp_ID = document.getElementById("editEmpleadosCp").getAttribute("value");
    }
    if (document.getElementById("editEmpleadosCiudades").getAttribute("value")) {
        empleados.ciudades_ID = document.getElementById("editEmpleadosCiudades").getAttribute("value");
    }
    if (document.getElementById("editEmpleadosMunicipio").getAttribute("value")) {
        empleados.municipios_ID = document.getElementById("editEmpleadosMunicipio").getAttribute("value");
    }
    if (document.getElementById("editEmpleadosEstado").getAttribute("value")) {
        empleados.estados_ID = document.getElementById("editEmpleadosEstado").getAttribute("value");
    }
    if (document.getElementById("editEmpleadosPais").getAttribute("value")) {
        empleados.paises_ID = document.getElementById("editEmpleadosPais").getAttribute("value");
    }
    //var cbxCpEm = document.getElementById("cbxCpEm");
    //var valCpEm = cbxCpEm.options[cbxCpEm.selectedIndex].value;
    //if (valCpEm !== undefined) {
    //    empleados.cp_ID = valCpEm;
    //}
    //var cbxCiudEm = document.getElementById("cbxCiudadesEm");
    //var valCiuEm = cbxCiudEm.options[cbxCiudEm.selectedIndex].value;
    //if (valCiuEm !== undefined) {
    //    empleados.ciudades_ID = valCiuEm;
    //}

    //var cbxMunEm = document.getElementById("cbxMunicipiosEm");
    //var valMunEm = cbxMunEm.options[cbxMunEm.selectedIndex].value;
    //if (valMunEm !== undefined) {
    //    empleados.municipios_ID = valMunEm;
    //}

    //var cbxEstado = document.getElementById("cbxEstadosEm");
    //var valEst = cbxEstado.options[cbxEstado.selectedIndex].value;
    //if (valEst !== undefined) {
    //    empleados.estados_ID = valEst;
    //}
    //var cbxPais = document.getElementById("cbxPaisesEm");
    //var valPais = cbxPais.options[cbxPais.selectedIndex].value;
    //if (valPais !== undefined) {
    //    empleados.paises_ID = valPais;
    //}

    empleados.razonesSociales_ID = getRazonSocial().id;

    return empleados;
}

function mostrarObjetoEmp(obj) {
    var employeeData = obj[0];
    var familiaresData = obj[1];
    var formaAcadeData = obj[2];
    var capacitaData = obj[3];
    var expLabExtData = obj[4];
    var expLabIntData = obj[5];
    var documData = obj[6];

    document.getElementById("txtClaveEmp").value = employeeData.clave;
    document.getElementById("txtApellPatEmp").value = employeeData.apellidoPaterno;
    document.getElementById("txtApellMatEmp").value = employeeData.apellidoMaterno;
    document.getElementById("txtNombreEmp").value = employeeData.nombre;
    document.getElementById("txtNombreAbrevEmp").value = employeeData.nombreAbreviado;
    document.getElementById("txtFechaNacEmp").value = formatDate(new Date(employeeData.fechaNacimiento));

    document.getElementById("txtLugarNacEmp").value = employeeData.lugarNacimiento;
    if (employeeData.foto == null) {
        $("#imageUpload").val("");
        $('#imageToView').attr('src', "img/profile.png");
        $('#imageToView').removeData('image');
    } else {
        $('#imageToView').attr('src', "data:image/jpeg;base64," + employeeData.foto).width(80).height(80);
    }
    setEditObjectByID("editEmpleadosPaisOr", employeeData.paisOrigen_ID);

    var estadoNacID = employeeData.estadoNacimiento_ID;

    setEditObjectByID("editEmpleadosEstadoNac", estadoNacID.toString());

    // $("#cbxEstadoNacEm").val(estadoNacID.toString());

    //$("#cbxPaisesOrEm").val(employeeData.paisOrigen_ID);
    document.getElementById("txtNacionEmp").value = employeeData.nacionalidad;
    document.getElementById("txtFechaIngreEmp").value = formatDate(new Date(employeeData.fechaIngresoEmpresa));
    $("#cbxGeneroEm").val(employeeData.genero_ID);
    $("#cbxEstadoCivEm").val(employeeData.estadoCivil);
    document.getElementById("txtRFCEmp").value = employeeData.RFC;
    document.getElementById("txtRFCEmp").value = employeeData.RFC;
    document.getElementById("txtCurpEmp").value = employeeData.CURP;
    document.getElementById("txtNoSegSocialEmp").value = employeeData.IMSS;
    document.getElementById("txtClinicaEmp").value = employeeData.clinicaIMSS;
    document.getElementById("txtCorreoElEmp").value = employeeData.correoElectronico;
    document.getElementById("txtTelefonoEmp").value = employeeData.telefono;
    document.getElementById("txtCalleEmp").value = employeeData.domicilio;
    document.getElementById("txtNumExtEmp").value = employeeData.numeroExt;
    document.getElementById("txtNumIntEmp").value = employeeData.numeroInt;
    document.getElementById("txtColoniaEmp").value = employeeData.colonia;
    //Dear
    setEditObjectByID("editEmpleadosCp", employeeData.cp_ID);
    setEditObjectByID("editEmpleadosPais", employeeData.paises_ID);
    setEditObjectByID("editEmpleadosEstado", employeeData.estados_ID);
    setEditObjectByID("editEmpleadosMunicipio", employeeData.municipios_ID);
    setEditObjectByID("editEmpleadosCiudades", employeeData.ciudades_ID);

    //$("#cbxCpEm").val(employeeData.cp_ID);
    //$("#cbxCiudadesEm").val(employeeData.ciudades_ID);
    //$("#cbxMunicipiosEm").val(employeeData.municipios_ID);
    //$("#cbxEstadosEm").val(employeeData.estados_ID);
    //$("#cbxPaisesEm").val(employeeData.paises_ID);

    //Fill Familiares
    // var dataAux = contruirDatosTabla(dataRegBloq);
    dataFamiliares = familiaresData;
    dataFormaAcade = formaAcadeData;
    dataCapacitacion = capacitaData;
    dataExpeLaboExt = expLabExtData;
    dataExpeLaboInt = expLabIntData;
    dataDocumentacion = documData;

    /*W:7*/
    if (familiaresData.length > 0) {
        llenarTablaGen("tblFamiliares", familiaresData, 0, familiaresData.length);
    }
    if (formaAcadeData.length > 0) {
        llenarTablaGen("tblEstudios", formaAcadeData, 0, formaAcadeData.length);
    }
    if (capacitaData.length > 0) {
        llenarTablaGen("tblCapacitacion", capacitaData, 0, capacitaData.length);
    }
    if (expLabExtData.length > 0) {
        llenarTablaGen("tblExpeLaboExt", expLabExtData, 0, expLabExtData.length);
    }
    if (expLabIntData.length > 0) {
        llenarTablaGen("tblExpeLaboInt", expLabIntData, 0, expLabIntData.length);
    }
    if (documData.length > 0) {
        llenarTablaGen("tblDocumentos", documData, 0, documData.length);
    }
}

function addDataToPersist(listData) {
    var addOnthisList = new Array();
    for (var i = 0; i < listData.length; i++) {
        if (listData[i].statusFila === "NUEVO" || listData[i].statusFila === "MODIFICADOBDS") {
            addOnthisList[addOnthisList.length] = listData[i];
        }
    }
    return addOnthisList;
}

function clearUnnesecaryReferencesFamiliares(listFamiliares) {
    for (var i = 0; i < listFamiliares.length; i++) {
        delete listFamiliares[i].statusFila;
        delete listFamiliares[i].parentesco_Clave;
        delete listFamiliares[i].descripcionParentesco;
        if (!Number.isInteger(listFamiliares[i].id)) {
            listFamiliares[i].id = 0;
        }
    }
    return listFamiliares;
}

function clearUnnesecaryReferencesFormacionAcadem(listForAc) {
    for (var i = 0; i < listForAc.length; i++) {
        delete listForAc[i].statusFila;
        if (!Number.isInteger(listForAc[i].id)) {
            listForAc[i].id = 0;
        }
    }
    return listForAc;
}

function clearUnnesecaryReferencesCapacitacion(listToClear) {
    for (var i = 0; i < listToClear.length; i++) {
        delete listToClear[i].statusFila;
        if (!Number.isInteger(listToClear[i].id)) {
            listToClear[i].id = 0;
        }
    }
    return listToClear;
}

function clearUnnesecaryReferencesExpeLaboExt(listToClear) {
    for (var i = 0; i < listToClear.length; i++) {
        delete listToClear[i].statusFila;
        if (!Number.isInteger(listToClear[i].id)) {
            listToClear[i].id = 0;
        }
    }
    return listToClear;
}

function clearUnnesecaryReferencesExpeLaboInt(listToClear) {
    for (var i = 0; i < listToClear.length; i++) {
        delete listToClear[i].statusFila;
        if (!Number.isInteger(listToClear[i].id)) {
            listToClear[i].id = 0;
        }
    }
    return listToClear;
}

function clearUnnesecaryReferencesDoc(listToClear) {
    for (var i = 0; i < listToClear.length; i++) {
        delete listToClear[i].statusFila;
        if (!Number.isInteger(listToClear[i].id)) {
            listToClear[i].id = 0;
        }
    }
    return listToClear;
}

function makeActionEmp(action, obj) {
    var succes = false;
    //var objEmpleados = construirEmp(obj);
    var listFamiliaresAddMod = addDataToPersist(dataFamiliares);
    listFamiliaresAddMod = clearUnnesecaryReferencesFamiliares(listFamiliaresAddMod);

    var listFormacionAcademAddMod = addDataToPersist(dataFormaAcade);
    listFormacionAcademAddMod = clearUnnesecaryReferencesFormacionAcadem(listFormacionAcademAddMod);

    var listCapacitacionAddMod = addDataToPersist(dataCapacitacion);
    listCapacitacionAddMod = clearUnnesecaryReferencesCapacitacion(listCapacitacionAddMod);

    var listExLbExtAddMod = addDataToPersist(dataExpeLaboExt);
    listExLbExtAddMod = clearUnnesecaryReferencesExpeLaboExt(listExLbExtAddMod);

    var listExLbIntAddMod = addDataToPersist(dataExpeLaboInt);
    listExLbIntAddMod = clearUnnesecaryReferencesExpeLaboInt(listExLbIntAddMod);

    var listDocucAddMod = addDataToPersist(dataDocumentacion);
    listDocucAddMod = clearUnnesecaryReferencesDoc(listDocucAddMod);

    var objEmpleados = {};
    objEmpleados.entity = construirEmp(obj);
    objEmpleados.listFamiliaresAM = listFamiliaresAddMod;
    objEmpleados.listFamiliaresDE = deleteFamiliares;
    objEmpleados.listFormacionAcademicaAM = listFormacionAcademAddMod;
    objEmpleados.listFormacionAcademicaDE = deleteFormaAcade;
    objEmpleados.listCapacitacionAM = listCapacitacionAddMod;
    objEmpleados.listCapacitacioneDE = deleteCapacitacion;
    objEmpleados.listExLbExtAM = listExLbExtAddMod;
    objEmpleados.listExLbExtDE = deleteExpeLaboExt;
    objEmpleados.listExLbIntAM = listExLbIntAddMod;
    objEmpleados.listExLbIntDE = deleteExpeLaboInt;
    objEmpleados.listDocAM = listDocucAddMod;
    objEmpleados.listDocDE = deleteDocumentacion;

    if (action === "A") {
        var url = route + "/api/Empleados/saveEmpleado";
        //ADD EMPLEADO
        var data = JSON.stringify(objEmpleados);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado !== null) {
            var result = Mensaje.resultado
            succes = true;
        } else {
            alert(Mensaje.error);
        }
    }
    else if (action === "M") {
        var url = route + "/api/Empleados/saveEmpleado";
        //UPDATE EMPLEADO
        var data = JSON.stringify(objEmpleados);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado !== null) {
            var result = Mensaje.resultado;
            if (result) {
                succes = true;
            }
            else {
                alert(Mensaje.error);
            }
        }
    }
    else if (action === "E") {
        var url = route + "/api/Empleados/eliminarEmpleado";
        //DELETE EMPLEADO
        var data = JSON.stringify(objEmpleados.entity);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        var resultEl = Mensaje.resultado;
        if (resultEl === null) {
            alert(Mensaje.error);
        } else {
            if (resultEl === true) {
                succes = true;
            } else if (resultEl === 2) {
                alert("Este empleado tiene plazas, no se puede eliminar");
            } else if (resultEl === 3) {
                alert("Este empleado tiene creditos, no se puede eliminar");
            }
        }
    }
    return succes;
}

function preValidateBeforeSaveEmp() {
    var goEmployee = true;
    goEmployee = validateComponents(elements);
    return goEmployee;
}

/*Function Buttons*/
function saveEmp() {
    if (preValidateBeforeSaveEmp()) {
        var succes = false;
        succes = makeActionEmp("A", null);
        if (succes) {
            limpiarComponentesEmp();
            generateValueEmpleado();
        }
    }
}

function updateEmp() {
    var succes = false;
    if (preValidateBeforeSaveEmp()) {
        succes = makeActionEmp("M", getEmpleados);
        if (succes) {
            limpiarComponentesEmp();
            changeModeButtons("U");
            generateValueEmpleado();
        }
    }
}

function deleteEmp() {
    var succes = false;
    var msg = confirm("¿Deseas realmente eliminar el Empleado?");
    if (msg == true) {
        succes = makeActionEmp("E", getEmpleados);
        if (succes) {
            limpiarComponentesEmp();
            changeModeButtons("E");
            generateValueEmpleado();
        }
    }
}

function cancelEmp() {
    limpiarComponentesEmp();
    generateValueEmpleado();
    changeModeButtons("U");
    // enabledCatalogEmp(true);
}

function changeModeButtons(type) {
    if (type === "M") {
        document.getElementById("btnActualizar").style.display = "inline";
        document.getElementById("btnEliminar").style.display = "inline";
        document.getElementById("btnBuscar").style.display = "inline";
        document.getElementById("btnCancelar").style.display = "inline";
        document.getElementById("btnGuardar").style.display = "inline";
        //  if (!isPrm) {
        document.getElementById("btnGuardar").style.display = "none";
        //  }
    }
    else if (type === "C" || type === "E" || type === "U") {
        document.getElementById("btnActualizar").style.display = "none";
        document.getElementById("btnEliminar").style.display = "none";
        document.getElementById("btnBuscar").style.display = "inline";
        document.getElementById("btnCancelar").style.display = "inline";
        if (type === "C") {
            document.getElementById("btnGuardar").style.display = "none";
        } else {
            document.getElementById("btnGuardar").style.display = "inline";
        }
    }
}

/*Default Functions*/
function limpiarComponentesEmp() {
    document.getElementById("txtClaveEmp").value = "";
    document.getElementById("txtApellPatEmp").value = "";
    document.getElementById("txtApellMatEmp").value = "";
    document.getElementById("txtNombreEmp").value = "";
    document.getElementById("txtNombreAbrevEmp").value = "";
    document.getElementById("txtFechaNacEmp").value = "";
    // $("#cbxEstadoNacEm option:first").prop('selected', 'selected');
    clearEdit("editEmpleadosEstadoNac");
    document.getElementById("txtLugarNacEmp").value = "";
    /*****Start Imagen *****/
    $("#imageUpload").val("");
    $('#imageToView').attr('src', "img/profile.png");
    $('#imageToView').removeData('image');
    /*****END Imagen *****/
    clearEdit("editEmpleadosPaisOr");
    // $("#cbxPaisesOrEm option:first").prop('selected', 'selected');
    document.getElementById("txtNacionEmp").value = "";
    $("#cbxGeneroEm option:first").prop('selected', 'selected');
    $("#cbxEstadoCivEm option:first").prop('selected', 'selected');
    var date = new Date(getFechaSistema());
    document.getElementById("txtFechaIngreEmp").value = formatDate(date);
    document.getElementById("txtRFCEmp").value = "";
    document.getElementById("txtCurpEmp").value = "";
    document.getElementById("txtNoSegSocialEmp").value = "";
    document.getElementById("txtClinicaEmp").value = "";
    document.getElementById("txtCorreoElEmp").value = "";
    document.getElementById("txtTelefonoEmp").value = "";
    document.getElementById("txtCalleEmp").value = "";
    document.getElementById("txtNumExtEmp").value = "";
    document.getElementById("txtNumIntEmp").value = "";
    document.getElementById("txtColoniaEmp").value = "";
    //Dear
    clearEdit("editEmpleadosCp");
    clearEdit("editEmpleadosCiudades");
    clearEdit("editEmpleadosMunicipio");
    clearEdit("editEmpleadosEstado");
    clearEdit("editEmpleadosPais");
    //$("#cbxCpEm option:first").prop('selected', 'selected');
    //$("#cbxCiudadesEm option:first").prop('selected', 'selected');
    //$("#cbxMunicipiosEm option:first").prop('selected', 'selected');
    //$("#cbxEstadosEm option:first").prop('selected', 'selected');
    //$("#cbxPaisesEm option:first").prop('selected', 'selected');

    //Clear Global Variables
    getEmpleados = null;
    //listaGenero = new Array();
    /*W:8*/
    dataFamiliares = new Array();
    deleteFamiliares = new Array();
    clearTable("tblFamiliares");
    dataFormaAcade = new Array();
    deleteFormaAcade = new Array();
    clearTable("tblEstudios");
    dataCapacitacion = new Array();
    deleteCapacitacion = new Array();
    clearTable("tblCapacitacion");
    dataExpeLaboExt = new Array();
    deleteExpeLaboExt = new Array();
    clearTable("tblExpeLaboExt");
    dataExpeLaboInt = new Array();
    deleteExpeLaboInt = new Array();
    clearTable("tblExpeLaboInt");
    dataDocumentacion = new Array();
    deleteDocumentacion = new Array();
    clearTable("tblDocumentos");
    validateComponents(elements, true);
    InitEventsTable();
}

function enabledCatalogEmp(change) {
    if (change) {
        document.getElementById("txtClaveEmp").disabled = false;
        document.getElementById("txtApellPatEmp").disabled = false;
        document.getElementById("txtApellMatEmp").disabled = false;
        document.getElementById("txtNombreEmp").disabled = false;
        document.getElementById("txtNombreAbrevEmp").disabled = false;
        document.getElementById("txtFechaNacEmp").disabled = false;
        //document.getElementById("cbxEstadoNacEm").disabled = false;
        enabledEdit("editEmpleadosEstadoNac", false);
        document.getElementById("txtLugarNacEmp").disabled = false;
        document.getElementById("imageUpload").disabled = false;
        enabledEdit("editEmpleadosPaisOr", false);
        //document.getElementById("cbxPaisesOrEm").disabled = false;
        document.getElementById("txtNacionEmp").disabled = false;
        document.getElementById("cbxGeneroEm").disabled = false;
        document.getElementById("cbxEstadoCivEm").disabled = false;
        document.getElementById("txtRFCEmp").disabled = false;
        document.getElementById("txtCurpEmp").disabled = false;
        document.getElementById("txtNoSegSocialEmp").disabled = false;
        document.getElementById("txtClinicaEmp").disabled = false;
        document.getElementById("txtCorreoElEmp").disabled = false;
        document.getElementById("txtTelefonoEmp").disabled = false;
        document.getElementById("txtCalleEmp").disabled = false;
        document.getElementById("txtNumExtEmp").disabled = false;
        document.getElementById("txtNumIntEmp").disabled = false;
        document.getElementById("txtColoniaEmp").disabled = false;
        //Dear
        enabledEdit("editEmpleadosCp", false);
        enabledEdit("editEmpleadosCiudades", false);
        enabledEdit("editEmpleadosMunicipio", false);
        enabledEdit("editEmpleadosEstado", false);
        enabledEdit("editEmpleadosPais", false);
        //document.getElementById("cbxCpEm").disabled = false;
        //document.getElementById("cbxCiudadesEm").disabled = false;
        //document.getElementById("cbxMunicipiosEm").disabled = false;
        //document.getElementById("cbxEstadosEm").disabled = false;
        //document.getElementById("cbxPaisesEm").disabled = false;
    } else {
        document.getElementById("txtClaveEmp").disabled = true;
        document.getElementById("txtApellPatEmp").disabled = true;
        document.getElementById("txtApellMatEmp").disabled = true;
        document.getElementById("txtNombreEmp").disabled = true;
        document.getElementById("txtNombreAbrevEmp").disabled = true;
        document.getElementById("txtFechaNacEmp").disabled = true;
        //document.getElementById("cbxEstadoNacEm").disabled = true;
        enabledEdit("editEmpleadosEstadoNac", true);
        enabledEdit("editEmpleadosPaisOr", true);
        document.getElementById("txtLugarNacEmp").disabled = true;
        document.getElementById("imageUpload").disabled = true;
        document.getElementById("cbxPaisesOrEm").disabled = true;
        document.getElementById("txtNacionEmp").disabled = true;
        document.getElementById("cbxGeneroEm").disabled = true;
        document.getElementById("cbxEstadoCivEm").disabled = true;
        document.getElementById("txtRFCEmp").disabled = true;
        document.getElementById("txtCurpEmp").disabled = true;
        document.getElementById("txtNoSegSocialEmp").disabled = true;
        document.getElementById("txtClinicaEmp").disabled = true;
        document.getElementById("txtCorreoElEmp").disabled = true;
        document.getElementById("txtTelefonoEmp").disabled = true;
        document.getElementById("txtCalleEmp").disabled = true;
        document.getElementById("txtNumExtEmp").disabled = true;
        document.getElementById("txtNumIntEmp").disabled = true;
        document.getElementById("txtColoniaEmp").disabled = true;
        //Dear
        enabledEdit("editEmpleadosCp", true);
        enabledEdit("editEmpleadosCiudades", true);
        enabledEdit("editEmpleadosMunicipio", true);
        enabledEdit("editEmpleadosEstado", true);
        enabledEdit("editEmpleadosPais", true);
        //document.getElementById("cbxCpEm").disabled = true;
        //document.getElementById("cbxCiudadesEm").disabled = true;
        //document.getElementById("cbxMunicipiosEm").disabled = true;
        //document.getElementById("cbxEstadosEm").disabled = true;
        //document.getElementById("cbxPaisesEm").disabled = true;
    }
}

/*Table selector*/
function selectorEmpleados() {
    //Parameters
    nameCmp = "selectorEmp";
    title = "Empleados";
    table = "Empleados";
    nameCols = idiomaSelecionadoCol.messageFormatter("EmpleadosClave")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosNombre")() + "," +
        idiomaSelecionadoCol.messageFormatter("EmpleadosApePaterno")() + "," + idiomaSelecionadoCol.messageFormatter("EmpleadosApeMaterno")() + "," +
        idiomaSelecionadoCol.messageFormatter("EmpleadosNombreAbre")();
    //nameCols = "Clave,Nombre(s),Apellido Paterno, Apellido Materno";
    campos = "clave,nombre,apellidoPaterno,apellidoMaterno,nombreAbreviado";

    preFilters = {
        "razonesSociales.id#=": getRazonSocial().id
    };

    preFilters = setPreFilters(preFilters);

    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Nombre", "tipo": "string", "campo": "nombre", "medida": "m" };

    return buildTableSearch(nameCmp, title, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch);
}

function selectorEmpleadosShow(idVal) {
    var dataget = getEmpleado(idVal[0]);
    if (dataget === undefined) {
        console.log("Problems to select Employee");
    } else {
        mostrarObjetoEmp(dataget);
        getEmpleados = dataget;
        changeModeButtons("M");
    }
}

function readImage(input) {
    if (input.files && input.files[0]) {

        var file = input.files[0];
        var fileType = file["type"];
        var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
        if ($.inArray(fileType, ValidImageTypes) < 0) {
            document.getElementById("imageToView").style.display = "none";
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imageToView').attr('src', '');
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            document.getElementById("imageToView").style.display = "inline";
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imageToView')
                        .attr('src', e.target.result)
                        .width(80)
                        .height(80);

                $('#imageToView').data("image", /base64,(.+)/.exec(e.target.result)[1]);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
}

/*--------------- Start Logic Tables ---------------*/

/*---------------W:1 Config Table---------------*/
function editTableFamiliares() {
    var nameTable = "tblFamiliares";
    var nameCols = crearListaColumnas(1);
    var activaAdd = true;
    var activaDelete = true;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function editTableEstudios() {
    var nameTable = "tblEstudios";
    var nameCols = crearListaColumnas(2);
    var activaAdd = true;
    var activaDelete = true;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function editTableCapacitacion() {
    var nameTable = "tblCapacitacion";
    var nameCols = crearListaColumnas(3);
    var activaAdd = true;
    var activaDelete = true;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function editTableExpeLaboExt() {
    var nameTable = "tblExpeLaboExt";
    var nameCols = crearListaColumnas(4);
    var activaAdd = true;
    var activaDelete = true;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function editTableExpeLaboInt() {
    var nameTable = "tblExpeLaboInt";
    var nameCols = crearListaColumnas(5);
    var activaAdd = true;
    var activaDelete = true;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

function editTableDocumentos() {
    var nameTable = "tblDocumentos";
    var nameCols = crearListaColumnas(6);
    var activaAdd = true;
    var activaDelete = true;
    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete);
}

/*---------------W:1 END Config Table---------------*/

/*W:2*/
function crearListaColumnas(typeTbl) {
    var columnasTabla = new Array();

    if (typeTbl === 1) {//Familiares
        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Parentesco")(), "nombreCompo": "Parentesco", "editable": true,
            "tipoCompon": "editConsulta", "persist": "parentesco_Clave", "ancho": "110px", "required": true
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Parentescodescripcion")(), "nombreCompo": "Descripcion", "editable": false,
            "tipoCompon": "text", "persist": "descripcionParentesco", "ancho": "150px"
        }
        columnasTabla.push(col);

        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Empleados")(), "nombreCompo": "Empleados", "editable": true,
            "tipoCompon": "checkbox", "persist": "isEmpleado", "ancho": "110px", "required": true
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FamiliarNombreFam")(), "nombreCompo": "NombreFamiliar", "editable": true,
            "tipoCompon": "text", "persist": "nombre", "ancho": "260px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FamiliaresSexo")(), "nombreCompo": "Sexo", "editable": true,
            "tipoCompon": "select", "persist": "isSexo", "ancho": "150px", "required": true,
            "data": listaGenero
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FamiliaresFechaNacimiento")(), "nombreCompo": "FechaNacimiento", "editable": true,
            "tipoCompon": "date", "persist": "fechaNacimiento", "ancho": "150px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FamiliaresFinado")(), "nombreCompo": "Finado", "editable": true,
            "tipoCompon": "checkbox", "persist": "isFinado", "ancho": "100px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FamiliaresDependiente")(), "nombreCompo": "DependienteEc", "editable": true,
            "tipoCompon": "checkbox", "persist": "isDependiente", "ancho": "100px"
        }
        columnasTabla.push(col);
    }
    else if (typeTbl === 2) {//Estudios
        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Estudios")(), "nombreCompo": "Estudios", "editable": true,
            "tipoCompon": "editConsulta", "persist": "estudios_Clave", "ancho": "150px", "required": true
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Estudiosdescripcion")(), "nombreCompo": "Descripcion", "editable": false,
            "tipoCompon": "text", "persist": "descripcionEstudios", "ancho": "170px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("DeFecha")(), "nombreCompo": "Defecha", "editable": true,
            "tipoCompon": "date", "persist": "fechaInicio", "ancho": "150px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("AFecha")(), "nombreCompo": "AFecha", "editable": true,
            "tipoCompon": "date", "persist": "fechaFin", "ancho": "150px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FormacionAcademicaInstitucion")(), "nombreCompo": "institucion", "editable": true,
            "tipoCompon": "text", "persist": "institucion", "ancho": "260px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FormacionAcademicaComentarios")(), "nombreCompo": "Comentarios", "editable": true,
            "tipoCompon": "text", "persist": "comentarios", "ancho": "260px"
        }
        columnasTabla.push(col);
    }
    else if (typeTbl === 3) {//Capacitacion
        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Cursos")(), "nombreCompo": "Cursos", "editable": true,
            "tipoCompon": "editConsulta", "persist": "cursos_Clave", "ancho": "150px", "required": true
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Cursosdescripcion")(), "nombreCompo": "Descripcion", "editable": false,
            "tipoCompon": "text", "persist": "descripcionCursos", "ancho": "170px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("DeFecha")(), "nombreCompo": "Defecha", "editable": true,
            "tipoCompon": "date", "persist": "fechaInicioCapacitacion", "ancho": "150px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("AFecha")(), "nombreCompo": "AFecha", "editable": true,
            "tipoCompon": "date", "persist": "fechaFinCapacitacion", "ancho": "150px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("FormacionAcademicaComentarios")(), "nombreCompo": "Comentarios", "editable": true,
            "tipoCompon": "text", "persist": "comentariosCapacitacion", "ancho": "260px"
        }
        columnasTabla.push(col);
    }
    else if (typeTbl === 4) {//Experiencia Laboral Externa
        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Puestos")(), "nombreCompo": "Puesto", "editable": true,
            "tipoCompon": "text", "persist": "puesto", "ancho": "150px", "required": true
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Puestosdescripcion")(), "nombreCompo": "Descripcion", "editable": true,
            "tipoCompon": "text", "persist": "descripcionPuesto", "ancho": "170px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("DeFecha")(), "nombreCompo": "Defecha", "editable": true,
            "tipoCompon": "date", "persist": "fechaInicioExpLabExt", "ancho": "150px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("AFecha")(), "nombreCompo": "AFecha", "editable": true,
            "tipoCompon": "date", "persist": "fechaFinExpLabExt", "ancho": "150px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("RazonesSociales")(), "nombreCompo": "RazonSocial", "editable": true,
            "tipoCompon": "text", "persist": "empresa", "ancho": "260px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("ExperienciaLaboralExternaJefeInmediato")(), "nombreCompo": "JefeInmediato", "editable": true,
            "tipoCompon": "text", "persist": "jefeInmediato", "ancho": "260px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("ExperienciaLaboralExternaComet")(), "nombreCompo": "Comentarios", "editable": true,
            "tipoCompon": "text", "persist": "comentarios", "ancho": "260px"
        }
        columnasTabla.push(col);
    }
    else if (typeTbl === 5) {//Experiencia Laboral Interna
        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Puestos")(), "nombreCompo": "Puestos", "editable": true,
            "tipoCompon": "editConsulta", "persist": "puestos_Clave", "ancho": "150px", "required": true
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("Puestosdescripcion")(), "nombreCompo": "Descripcion", "editable": false,
            "tipoCompon": "text", "persist": "descripcionPuestos", "ancho": "170px"
        }
        columnasTabla.push(col);
        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("CentroDeCosto")(), "nombreCompo": "CentroDeCosto", "editable": true,
            "tipoCompon": "editConsulta", "persist": "centroDeCosto_Clave", "ancho": "150px"
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcion")(), "nombreCompo": "Descripcion", "editable": false,
            "tipoCompon": "text", "persist": "descripcionCentroDeCosto", "ancho": "170px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("DeFecha")(), "nombreCompo": "Defecha", "editable": true,
            "tipoCompon": "date", "persist": "fechaInicioExpLabInt", "ancho": "150px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("AFecha")(), "nombreCompo": "AFecha", "editable": true,
            "tipoCompon": "date", "persist": "fechaFinExpLabInt", "ancho": "150px"
        }
        columnasTabla.push(col);
    }
    else if (typeTbl === 6) {//Documentos
        var col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("DocumentacionDocumento")(), "nombreCompo": "Documento", "editable": true,
            "tipoCompon": "file", "persist": "archivo", "ancho": "300px", "required": true
        };
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("DocumentacionDescripcion")(), "nombreCompo": "Descripcion", "editable": true,
            "tipoCompon": "text", "persist": "descripcionDocumentacion", "ancho": "170px", "required": true
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("DocumentacionEntrego")(), "nombreCompo": "Entrego", "editable": true,
            "tipoCompon": "checkbox", "persist": "entrego", "ancho": "110px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("DocumentacionFechaEntrega")(), "nombreCompo": "FechaEntrega", "editable": true,
            "tipoCompon": "date", "persist": "fechaEntrega", "ancho": "150px"
        }
        columnasTabla.push(col);
        col = {
            "tituloColumna": idiomaSelecionadoCol.messageFormatter("DocumentacionFechaDevolucion")(), "nombreCompo": "FechaDevolucion", "editable": true,
            "tipoCompon": "date", "persist": "fechaDevolucion", "ancho": "150px"
        }
        columnasTabla.push(col);
    }
    return columnasTabla;
}

/*W:3*/
function construirObj(tr, nameTable) {

    var obj = {};

    for (var i = 0; i < tr.cells.length; i++) {//Puede quitarse de aquí
        var tipoCmp = tr.cells[i].getAttribute('tipocompon');
        if (tr.cells[i].getAttribute('persist') !== "eliminar" && tr.cells[i].getAttribute("contenteditable") === "true") {
            if (tr.cells[i].getAttribute('tipocompon') === "editConsulta") {
                obj[tr.cells[i].getAttribute('persist')] = parseInt(tr.cells[i].firstElementChild.getAttribute('value'));
            } else if (tr.cells[i].getAttribute('tipocompon') === "select") {
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].getAttribute('valor');
            } else if (tr.cells[i].getAttribute('tipocompon') === "file") {
                obj["documento"] = tr.cells[i].firstElementChild.getAttribute('namefile');
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].firstElementChild.getAttribute('value');
            } else {
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
            }
        } else if (tr.cells[i].getAttribute('tipocompon') === "checkbox") {
            obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].firstElementChild.firstElementChild.checked;
        }
    }

    if (tr.id === "") {
        var rString = "id" + randomString(2, '0123456789');
        obj['id'] = rString;
        tr.id = obj.id;
        if (nameTable === "tableEdittblFamiliares") {
            agregarFamiliares(obj);
        } else if (nameTable === "tableEdittblEstudios") {
            agregarFormacionAcademica(obj);
        } else if (nameTable === "tableEdittblCapacitacion") {
            agregarCapacitacion(obj);
        } else if (nameTable === "tableEdittblExpeLaboExt") {
            agregarExpeLaboExt(obj);
        } else if (nameTable === "tableEdittblExpeLaboInt") {
            agregarExpeLaboInt(obj);
        } else if (nameTable === "tableEdittblDocumentos") {
            agregarDocumentos(obj);
        }

    } else {
        obj['id'] = tr.id;
        if (nameTable === "tableEdittblFamiliares") {
            actualizarFamiliares(obj);
        } else if (nameTable === "tableEdittblEstudios") {
            actualizarFormacionAcademica(obj);
        } else if (nameTable === "tableEdittblCapacitacion") {
            actualizarCapacitacion(obj);
        } else if (nameTable === "tableEdittblExpeLaboExt") {
            actualizarExpeLaboExt(obj);
        } else if (nameTable === "tableEdittblExpeLaboInt") {
            actualizarExpeLaboInt(obj);
        } else if (nameTable === "tableEdittblDocumentos") {
            actualizarDocumentos(obj);
        }
    }
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
    //}
}

/*---------------W:4---------------*/
function agregarFamiliares(value) {
    var obj = {};
    obj.id = value.id;
    obj.dependiente = value.isDependiente;
    obj.empleado = value.isEmpleado;
    obj.fechaNacimiento = value.fechaNacimiento;
    obj.finado = value.isFinado;
    obj.empleados_ID = null;
    obj.nombre = value.nombre;
    obj.sexo = value.isSexo;
    obj.parentesco_ID = value.parentesco_Clave;
    obj.statusFila = "NUEVO";
    dataFamiliares.push(obj);
}

function agregarFormacionAcademica(value) {
    var obj = {};
    obj.id = value.id;
    obj.estudios_ID = value.estudios_Clave;
    obj.institucion = value.institucion;
    obj.comentarios = value.comentarios;
    if (value.fechaInicio !== "") {
        obj.fechaInicio = value.fechaInicio;
    }
    if (value.fechaFin !== "") {
        obj.fechaFin = value.fechaFin;
    }
    obj.empleados_ID = null;
    obj.statusFila = "NUEVO";
    dataFormaAcade.push(obj);
}

function agregarCapacitacion(valTable) {
    var obj = {};
    obj.id = valTable.id;
    obj.cursos_ID = valTable.cursos_Clave;

    obj.comentarios = valTable.comentariosCapacitacion == null ? "" : valTable.comentariosCapacitacion;
    if (obj.fechaInicio !== "") {
        obj.fechaInicio = valTable.fechaInicioCapacitacion;
    }

    if (obj.fechaFin !== "") {
        obj.fechaFin = valTable.fechaFinCapacitacion;
    }

    obj.empleados_ID = null;
    obj.statusFila = "NUEVO";
    dataCapacitacion.push(obj);
}

function agregarExpeLaboExt(valTable) {
    var obj = {};
    obj.id = valTable.id;
    obj.puesto = valTable.puesto;
    obj.descripcion = valTable.descripcionPuesto;
    obj.empresa = valTable.empresa;
    obj.jefeInmediato = valTable.jefeInmediato;
    obj.comentarios = valTable.comentarios;
    obj.fechaInicio = valTable.fechaInicioExpLabExt;
    obj.fechaFin = valTable.fechaFinExpLabExt;
    obj.empleados_ID = null;
    obj.statusFila = "NUEVO";
    dataExpeLaboExt.push(obj);
}

function agregarExpeLaboInt(valTable) {
    var obj = {};
    obj.puestos_ID = valTable.puestos_Clave;
    obj.centroCostos_ID = valTable.centroDeCosto_Clave;
    obj.fechaInicio = valTable.fechaInicioExpLabInt;
    obj.fechaFin = valTable.fechaFinExpLabInt;
    obj.empleados_ID = null;
    obj.statusFila = "NUEVO";
    dataExpeLaboInt.push(obj);
}

function agregarDocumentos(valTable) {
    var obj = {};
    obj.archivo = valTable.archivo;
    obj.documento = valTable.documento;
    obj.descripcion = valTable.descripcionDocumentacion;
    obj.entrego = valTable.entrego;
    obj.fechaEntrega = valTable.fechaEntrega;
    obj.fechaDevolucion = valTable.fechaDevolucion;
    obj.empleados_ID = null;
    obj.statusFila = "NUEVO";
    dataDocumentacion.push(obj);
}

/*---------------END TABLE W:4---------------*/

/*---------------W:5---------------*/
function actualizarFamiliares(valTable) {
    var getAuxFam = {};
    for (var i = 0; i < dataFamiliares.length; i++) {

        if (dataFamiliares[i].id === parseInt(valTable.id)
            || dataFamiliares[i].id === valTable.id) {
            getAuxFam = dataFamiliares[i];
            if (valTable.parentesco_Clave) {
                getAuxFam.parentesco_ID = valTable.parentesco_Clave;
            }

            if (valTable.isEmpleado) {
                getAuxFam.empleado = valTable.isEmpleado;
            }
            if (valTable.nombre) {
                getAuxFam.nombre = valTable.nombre;
            }

            if (valTable.isDependiente) {
                getAuxFam.dependiente = valTable.isDependiente;
            }

            if (valTable.fechaNacimiento) {
                getAuxFam.fechaNacimiento = valTable.fechaNacimiento;
            }

            if (valTable.isFinado) {
                getAuxFam.finado = valTable.isFinado;
            }

            if (valTable.isSexo) {
                getAuxFam.sexo = valTable.isSexo;
            }

            getAuxFam.statusFila = "MODIFICADOBDS";
            dataFamiliares[i] = getAuxFam;
            break;
        }
    }
}

function actualizarFormacionAcademica(valTable) {
    var getAuxFormAc = {};
    for (var i = 0; i < dataFormaAcade.length; i++) {
        if (dataFormaAcade[i].id === parseInt(valTable.id)
            || dataFormaAcade[i].id === valTable.id) {
            getAuxFormAc = dataFormaAcade[i];
            if (valTable.estudios_Clave) {
                getAuxFormAc.estudios_ID = valTable.estudios_Clave;
            }

            if (valTable.isEmpleado) {
                getAuxFormAc.empleado = valTable.isEmpleado;
            }
            if (valTable.institucion) {
                getAuxFormAc.institucion = valTable.institucion;
            }

            if (valTable.comentarios) {
                getAuxFormAc.comentarios = valTable.comentarios;
            }

            if (valTable.fechaInicio) {
                getAuxFormAc.fechaInicio = valTable.fechaInicio;
            }

            if (valTable.fechaFin) {
                getAuxFormAc.fechaFin = valTable.fechaFin;
            }

            getAuxFormAc.statusFila = "MODIFICADOBDS";
            dataFormaAcade[i] = getAuxFormAc;
            break;
        }
    }
}

function actualizarCapacitacion(valTable) {
    var getAuxCap = {};
    for (var i = 0; i < dataCapacitacion.length; i++) {
        if (dataCapacitacion[i].id === parseInt(valTable.id)
            || dataCapacitacion[i].id === valTable.id) {
            getAuxCap = dataCapacitacion[i];
            if (valTable.cursos_Clave) {
                getAuxCap.cursos_ID = valTable.cursos_Clave;
            }

            if (valTable.comentariosCapacitacion) {
                getAuxCap.comentarios = valTable.comentariosCapacitacion;
            }

            if (valTable.fechaInicioCapacitacion) {
                getAuxCap.fechaInicio = valTable.fechaInicioCapacitacion;
            }

            if (valTable.fechaFinCapacitacion) {
                getAuxCap.fechaFin = valTable.fechaFinCapacitacion;
            }

            getAuxCap.statusFila = "MODIFICADOBDS";
            dataCapacitacion[i] = getAuxCap;
            break;
        }
    }
}

function actualizarExpeLaboExt(valTable) {
    var getExpLabExt = {};
    for (var i = 0; i < dataExpeLaboExt.length; i++) {
        if (dataExpeLaboExt[i].id === parseInt(valTable.id)
            || dataExpeLaboExt[i].id === valTable.id) {
            getExpLabExt = dataExpeLaboExt[i];
            if (valTable.puesto) {
                getExpLabExt.puesto = valTable.puesto;
            }

            if (valTable.descripcionPuesto) {
                getExpLabExt.descripcion = valTable.descripcionPuesto;
            }

            if (valTable.empresa) {
                getExpLabExt.empresa = valTable.empresa;
            }

            if (valTable.jefeInmediato) {
                getExpLabExt.jefeInmediato = valTable.jefeInmediato;
            }

            if (valTable.comentarios) {
                getExpLabExt.comentarios = valTable.comentarios;
            }

            if (valTable.fechaInicioExpLabExt) {
                getExpLabExt.fechaInicio = valTable.fechaInicioExpLabExt;
            }

            if (valTable.fechaFinExpLabExt) {
                getExpLabExt.fechaFin = valTable.fechaFinExpLabExt;
            }
            getExpLabExt.statusFila = "MODIFICADOBDS";
            dataExpeLaboExt[i] = getExpLabExt;
            break;
        }
    }
}

function actualizarExpeLaboInt(valTable) {
    var getExpLabInt = {};
    for (var i = 0; i < dataExpeLaboInt.length; i++) {
        if (dataExpeLaboInt[i].id === parseInt(valTable.id)
            || dataExpeLaboInt[i].id === valTable.id) {
            getExpLabInt = dataExpeLaboInt[i];
            if (valTable.puestos_Clave) {
                getExpLabInt.puestos_ID = valTable.puestos_Clave;
            }
            if (valTable.centroDeCosto_Clave) {
                getExpLabInt.centroCostos_ID = valTable.centroDeCosto_Clave;
            }

            if (valTable.fechaInicioExpLabInt) {
                getExpLabInt.fechaInicio = valTable.fechaInicioExpLabInt;
            }

            if (valTable.fechaFinExpLabInt) {
                getExpLabInt.fechaFin = valTable.fechaFinExpLabInt;
            }
            getExpLabInt.statusFila = "MODIFICADOBDS";
            dataExpeLaboInt[i] = getExpLabInt;
            break;
        }
    }
}

function actualizarDocumentos(valTable) {
    var getDocum = {};
    for (var i = 0; i < dataDocumentacion.length; i++) {
        if (dataDocumentacion[i].id === parseInt(valTable.id)
            || dataDocumentacion[i].id === valTable.id) {
            getDocum = dataDocumentacion[i];
            if (valTable.documento) {
                getDocum.documento = valTable.documento;
            }
            if (valTable.descripcionDocumentacion) {
                getDocum.descripcion = valTable.descripcionDocumentacion;
            }

            if (valTable.entrego) {
                getDocum.entrego = valTable.entrego;
            }

            if (valTable.fechaEntrega) {
                getDocum.fechaEntrega = valTable.fechaEntrega;
            }

            if (valTable.fechaDevolucion) {
                getDocum.fechaDevolucion = valTable.fechaDevolucion;
            }

            if (valTable.archivo) {
                getDocum.archivo = valTable.archivo;
            }

            getDocum.statusFila = "MODIFICADOBDS";
            dataDocumentacion[i] = getDocum;
            break;
        }
    }
}

/*---------------END TABLE W:5---------------*/

/*W:6*/
function tableRemove(registro) {
    var id = registro.id;
    var nameTable = registro.closest("table").id;
    var listToDelete = null;
    if (nameTable === "tableEdittblFamiliares") {
        listToDelete = dataFamiliares;
    } else if (nameTable === "tableEdittblEstudios") {
        listToDelete = dataFormaAcade;
    } else if (nameTable === "tableEdittblCapacitacion") {
        listToDelete = dataCapacitacion;
    } else if (nameTable === "tableEdittblExpeLaboExt") {
        listToDelete = dataExpeLaboExt;
    } else if (nameTable === "tableEdittblExpeLaboInt") {
        listToDelete = dataExpeLaboInt;
    } else if (nameTable === "tableEdittblDocumentos") {
        listToDelete = dataDocumentacion;
    }
    if (parseInt(id)) {
        for (var i = 0; i < listToDelete.length; i++) {
            if (listToDelete[i].id === parseInt(id)) {
                listToDelete.splice(i, 1);
                break;
            }
        }
        if (nameTable === "tableEdittblFamiliares") {
            deleteFamiliares[deleteFamiliares.length] = parseInt(id);
        } else if (nameTable === "tableEdittblEstudios") {
            deleteFormaAcade[deleteFormaAcade.length] = parseInt(id);
        } else if (nameTable === "tableEdittblCapacitacion") {
            deleteCapacitacion[deleteCapacitacion.length] = parseInt(id);
        } else if (nameTable === "tableEdittblExpeLaboExt") {
            deleteExpeLaboExt[deleteExpeLaboExt.length] = parseInt(id);
        } else if (nameTable === "tableEdittblExpeLaboInt") {
            deleteExpeLaboInt[deleteExpeLaboInt.length] = parseInt(id);
        } else if (nameTable === "tableEdittblDocumentos") {
            deleteDocumentacion[deleteDocumentacion.length] = parseInt(id);
        }
    } else {
        for (var j = 0; j < listToDelete.length; j++) {
            if (listToDelete[j].id === id) {
                listToDelete.splice(j, 1);
                break;
            }
        }
    }
}

/*W:7= llenarTablaGen & Opentable*/

/*W:8= Clear Variables Table*/


/*Default Method ¿? */
function tableAdd(valores) {
    var nameTable = valores[0];
    var exito = true;
    if (valores.length === 3) {
        var trSelected;
        trSelected = $(valores[2]).nextAll('tr:last')[0];
        var nameTable = valores[0];
        construirObj(valores[2], nameTable);

        var trLast = $('#' + nameTable + ' tr:last');
        //Logica para verificar ultima celda esta vacia y saber si se agrega
        if (nameTable === "tableEdittblEstudios"
            || nameTable === "tableEdittblCapacitacion"
            || nameTable === "tableEdittblExpeLaboExt"
            || nameTable === "tableEdittblExpeLaboInt") {
            if (typeof trLast !== 'undefined') {
                if (typeof trLast.attr("id") === 'undefined') {
                    exito = false;
                    return;
                }
            }
        }

        if (typeof trSelected !== 'undefined') {
            for (var k = 0; k < trSelected.cells.length; k++) {
                if (trSelected.cells[k].getAttribute('contenteditable') === "true") {
                    if (trSelected.cells[k].innerText === "") {
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
        $('#' + valores[1]).append($clone);
        var edit = document.getElementById(valores[1]).querySelectorAll(".edit");
        if (edit) {
            for (var i = 0; i < edit.length; i++) {
                edit[i].removeAttribute("value");
                edit[i].querySelector(".editKey").value = "";
            }
        }
    }
}

/*Default Method Table*/
function prevalidacionAddRow(tr) {
    var tds = tr.cells;
    var exito = true;
    var table = $(tr).closest("table").attr("id");

    for (var i = 0; i < tds.length; i++) {
        if (table === "tableEdittblEstudios"
            || table === "tableEdittblCapacitacion"
            || table === "tableEdittblExpeLaboExt"
            || table === "tableEdittblExpeLaboInt"
            ) {
            if (tds[i].getAttribute("required") === "true") {
                if (tds[i].innerText === "") {
                    exito = false;
                    break;
                }
            }
        } else {
            if (tds[i].getAttribute("contenteditable") === "true") {
                if (tds[i].innerText === "") {
                    exito = false;
                    break;
                }
            }
        }
    }

    return exito;
}

/*End Default Method Table*/

/*Set Edit For Tables*/
function setEditParentescoDetalle() {
    nameCmp = "EditParentescoDetalle";
    table = "Parentesco";
    nameCols = idiomaSelecionadoCol.messageFormatter("Parentescoclave")() + "," + idiomaSelecionadoCol.messageFormatter("Parentescodescripcion")();
    //nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposObtener = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Parentesco";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}

function setEditParentescoDetalleShow(value) {
    if (value !== null) {
        var obj = value[0];
        datoSecundario = obj[2];

        if (classNameBlur) {
            var tdClave = setTdKeyForEdit("parentesco_Clave", "descripcionParentesco");
            //If you want to make another thing get variable
            var tdescripcion = setTdExtraForEdit("descripcionParentesco", datoSecundario);

            if (prevalidacionAddRow(renglon)) {
                var nametable = renglon.parentNode.parentNode.id;
                var nameBody = renglon.parentNode.id;
                var rowTr = renglon;
                var obj2 = [nametable, nameBody, rowTr];
                tableAdd(obj2);
            }
            //Optional function
            nextFocus(tdClave);
        }
    }
}

function setEditEstudiosDetalle() {
    nameCmp = "EditEstudiosDetalle";
    table = "Estudios";
    nameCols = idiomaSelecionadoCol.messageFormatter("Estudiosclave")() + "," + idiomaSelecionadoCol.messageFormatter("Estudiosdescripcion")();
    // nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposObtener = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Estudios";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}

function setEditEstudiosDetalleShow(value) {
    if (value !== null) {
        var obj = value[0];
        datoSecundario = obj[2];

        if (classNameBlur) {
            var tdClave = setTdKeyForEdit("estudios_Clave", "descripcionEstudios");
            //If you want to make another thing get variable
            var tdescripcion = setTdExtraForEdit("descripcionEstudios", datoSecundario);

            if (prevalidacionAddRow(renglon)) {
                var nametable = renglon.parentNode.parentNode.id;
                var nameBody = renglon.parentNode.id;
                var rowTr = renglon;
                var obj2 = [nametable, nameBody, rowTr];
                tableAdd(obj2);
            }
            //Optional function
            nextFocus(tdClave);
        }
    }
}

function setEditCursosDetalle() {
    nameCmp = "EditCursosDetalle";
    table = "Cursos";
    nameCols = idiomaSelecionadoCol.messageFormatter("Cursosclave")() + "," + idiomaSelecionadoCol.messageFormatter("Cursosdescripcion")();
    // nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposObtener = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Curso";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}

function setEditCursosDetalleShow(value) {
    if (value !== null) {
        var obj = value[0];
        datoSecundario = obj[2];

        if (classNameBlur) {
            var tdClave = setTdKeyForEdit("cursos_Clave", "descripcionCursos");
            //If you want to make another thing get variable
            var tdescripcion = setTdExtraForEdit("descripcionCursos", datoSecundario);

            if (prevalidacionAddRow(renglon)) {
                var nametable = renglon.parentNode.parentNode.id;
                var nameBody = renglon.parentNode.id;
                var rowTr = renglon;
                var obj2 = [nametable, nameBody, rowTr];
                tableAdd(obj2);
            }
            //Optional function
            nextFocus(tdClave);
        }
    }
}

function setEditPuestosDetalle() {
    nameCmp = "EditPuestosDetalle";
    table = "Puestos";
    nameCols = idiomaSelecionadoCol.messageFormatter("Puestosclave")() + "," + idiomaSelecionadoCol.messageFormatter("Puestosdescripcion")();
    // nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposObtener = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "puesto";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}

function setEditPuestosDetalleShow(value) {
    if (value !== null) {
        var obj = value[0];
        datoSecundario = obj[2];
        if (classNameBlur) {
            var tdClave = setTdKeyForEdit("puestos_Clave", "descripcionPuestos");
            //If you want to make another thing get variable
            var tdescripcion = setTdExtraForEdit("descripcionPuestos", datoSecundario);

            if (prevalidacionAddRow(renglon)) {
                var nametable = renglon.parentNode.parentNode.id;
                var nameBody = renglon.parentNode.id;
                var rowTr = renglon;
                var obj2 = [nametable, nameBody, rowTr];
                tableAdd(obj2);
            }
            //Optional function
            nextFocus(tdClave);
        }
    }
}

function setEditCentroDeCostoDetalle() {
    nameCmp = "EditCentroDeCostoDetalle";
    table = "CentroDeCosto";
    nameCols = idiomaSelecionadoCol.messageFormatter("CentroDeCostoclave")() + "," + idiomaSelecionadoCol.messageFormatter("CentroDeCostodescripcion")();
    //nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposObtener = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "centro de costo";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel,
        typeof optionals === 'undefined' ? "" : optionals);
}

function setEditCentroDeCostoDetalleShow(value) {
    if (value !== null) {
        var obj = value[0];
        datoSecundario = obj[2];
        if (classNameBlur) {
            var tdClave = setTdKeyForEdit("centroDeCosto_Clave", "descripcionCentroDeCosto");
            //If you want to make another thing get variable
            var tdescripcion = setTdExtraForEdit("descripcionCentroDeCosto", datoSecundario);

            if (prevalidacionAddRow(renglon)) {
                var nametable = renglon.parentNode.parentNode.id;
                var nameBody = renglon.parentNode.id;
                var rowTr = renglon;
                var obj2 = [nametable, nameBody, rowTr];
                tableAdd(obj2);
            }
            //Optional function
            nextFocus(tdClave);
        }
    }
}

///

function setEditEmpleadosCp() {
    //Parameters
    nameCmp = "editEmpleadosCp";
    table = "Cp";
    nameCols = idiomaSelecionadoCol.messageFormatter("Cpclave")() + "," + idiomaSelecionadoCol.messageFormatter("Cpdescripcion")() + "," +
        idiomaSelecionadoCol.messageFormatter("Ciudades")();
    // nameCols = "Clave,Descripción,Ciudad";
    campos = "clave,descripcion,ciudades.descripcion";
    var subEntities = "ciudades";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "codigo postal";
    var tamañoSel = "size-2";
    //var razon = localStorage.getItem("RazonSocial");
    //razon = JSON.parse(razon);
    //var preFilters = { "razonesSociales.id": razon.id };

    preFilters = setPreFilters();
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de Cp", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción codigo postal", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditEmpleadosCpShow(value) {
    if (value !== null) {

    }
}


function setEditEmpleadosCiudades() {
    //Parameters
    nameCmp = "editEmpleadosCiudades";
    table = "Ciudades";
    nameCols = idiomaSelecionadoCol.messageFormatter("Ciudadesclave")() + "," + idiomaSelecionadoCol.messageFormatter("Ciudadesdescripcion")() + "," +
        idiomaSelecionadoCol.messageFormatter("Municipios")();
    // nameCols = "Clave,Descripción,Municipio";
    campos = "clave,descripcion,municipios.descripcion";
    var subEntities = "municipios";
    camposMostrar = ["clave", "descripcion"];

    preFilters = setPreFilters();
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de ciudad", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción ciudad", "tipo": "string", "campo": "descripcion", "medida": "m" };
    var tituloSel = "ciudad";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditEmpleadosMunicipio() {
    //Parameters
    nameCmp = "editEmpleadosMunicipio";
    table = "Municipios";
    nameCols = idiomaSelecionadoCol.messageFormatter("Municipiosclave")() + "," + idiomaSelecionadoCol.messageFormatter("Municipiosdescripcion")() + "," +
        idiomaSelecionadoCol.messageFormatter("Estados")();
    //nameCols = "Clave,Descripción,Estado";
    campos = "clave,descripcion,estados.descripcion";
    var subEntities = "estados";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Municipio";
    var tamañoSel = "size-2";
    preFilters = setPreFilters();
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de municipio", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción municipio", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditEmpleadosEstado() {
    //Parameters
    nameCmp = "editEmpleadosEstado";
    table = "Estados";
    nameCols = idiomaSelecionadoCol.messageFormatter("Estadosclave")() + "," + idiomaSelecionadoCol.messageFormatter("Estadosdescripcion")() + "," +
        idiomaSelecionadoCol.messageFormatter("Paises")();
    // nameCols = "Clave,Descripción,Pais";
    campos = "clave,descripcion,paises.descripcion";
    var subEntities = "paises";
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "estado";
    var tamañoSel = "size-2";
    preFilters = setPreFilters();
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de estado", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción estado", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditEmpleadosPais() {
    //Parameters
    nameCmp = "editEmpleadosPais";
    table = "Paises";
    nameCols = idiomaSelecionadoCol.messageFormatter("Paisesclave")() + "," + idiomaSelecionadoCol.messageFormatter("Paisesdescripcion")();
    //nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];

    preFilters = setPreFilters();
    var tituloSel = "pais";
    var tamañoSel = "size-2";
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de país", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción país", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}


function setEditEmpleadosEstadoNac() {
    //Parameters
    nameCmp = "editEmpleadosEstadoNac";
    table = "Estados";
    nameCols = idiomaSelecionadoCol.messageFormatter("Estadosclave")() + "," + idiomaSelecionadoCol.messageFormatter("Estadosdescripcion")() + "," +
        idiomaSelecionadoCol.messageFormatter("Paises")();
    // nameCols = "Clave,Descripción,Pais";
    campos = "clave,descripcion,paises.descripcion";
    var subEntities = "paises";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = null;
    var tituloSel = "estado";
    var tamañoSel = "size-2";
    var preFilters = null;
    if (document.getElementById("editEmpleadosPaisOr").getAttribute("value")) {
        //document.getElementById("editEmpleadosPaisOr").getAttribute("value")
        preFilters = { "paises.clave": getExtraValues("editEmpleadosPaisOr")[0] };
    }

    preFilters = setPreFilters(preFilters);


    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de estado", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción estado", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditEmpleadosEstadoNacShow(value) {
    if (value === null) {

    } else {
        callGenerator();
    }
}


function setEditEmpleadosPaisOr() {
    //Parameters
    nameCmp = "editEmpleadosPaisOr";
    table = "Paises";
    nameCols = idiomaSelecionadoCol.messageFormatter("Paisesclave")() + "," + idiomaSelecionadoCol.messageFormatter("Paisesdescripcion")();
    //nameCols = "Clave,Descripción";
    campos = "clave,descripcion";
    camposMostrar = ["clave", "descripcion"];
    camposObtener = ["[]clave", "[]nacionalidad"];
    var tituloSel = "Pais de origen";
    var tamañoSel = "size-2";
    preFilters = setPreFilters();
    var filtersSearch = [];
    filtersSearch[0] = { "etiqueta": "Clave de país", "tipo": "string", "campo": "clave", "medida": "s" };
    filtersSearch[1] = { "etiqueta": "Descripción país", "tipo": "string", "campo": "descripcion", "medida": "m" };

    return buildParametersEditModal(nameCmp, table, nameCols, campos,
         typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
         typeof preFilters === 'undefined' ? null : preFilters,
         typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}


function setEditEmpleadosPaisOrShow(value) {
    if (value === null) {

    } else {
        var obj = value[0];
        document.getElementById("txtNacionEmp").value = obj.Nacionalidad;
        var clavePais = obj.Clave;
        // fillEstadoNac(clavePais);
    }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
