var vlimpiar = 0;
var contenedorActual = null;
var certificado = null;
var getCertificado = null;
var razonSocialActual = {};
var idiomaSelecionadoCol;
var obj = new Array();

var elements = new Array("txtClave", "txtRazonSocial", "txtContrasena", "txtNoCert");
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
  
    addListenersCnf();

});

function addListenersCnf() {
    $("#fileCert").on('change', function (e) {
        var fileName = e.target.files[0].name.toString();
        var labelMainFile = e.target.parentNode;
        var extension = e.target.files[0].type;
        var spanFile = labelMainFile.querySelector('.file-custom');
        var textFileLink = spanFile.querySelector('.file-watch');
        textFileLink.text = fileName;

       
        var valFile = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(valFile);
        reader.onload = function () {
            var getFile = reader.result;
            labelMainFile.setAttribute("nameFile", fileName);
            labelMainFile.setAttribute("value", /base64,(.+)/.exec(getFile)[1]);
            textFileLink.href = "data:" + extension + ";base64," + labelMainFile.getAttribute("value");
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        
        
    });

    $("#fileKey").on('change', function (e) {
        var fileName = e.target.files[0].name.toString();
        var labelMainFile = e.target.parentNode;
        var extension = e.target.files[0].type;
        var spanFile = labelMainFile.querySelector('.file-custom');
        var textFileLink = spanFile.querySelector('.file-watch');
        textFileLink.text = fileName;
        var valFile = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(valFile);
        reader.onload = function () {
            var getFile = reader.result;
            labelMainFile.setAttribute("nameFile", fileName);
            labelMainFile.setAttribute("value", /base64,(.+)/.exec(getFile)[1]);
            textFileLink.href = "data:" + extension + ";base64," + labelMainFile.getAttribute("value");
         
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    });

    

   
}
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
    limpiar();
    
    removeWait();
}
function getRazonSocialActual() {
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);

    var url = route + "/api/Certificados/RazonSocialPorID";
    var dataToPost = JSON.stringify(razon.id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        razonSocialActual = Mensaje.resultado;
    }

    

}
/*Table selector*/
function selectorCertificados() {

    //Parameters
    nameCmp = "selectorCert";
    title = "Certificados";
    table = "Certificados";
    nameCols = idiomaSelecionado.messageFormatter("CertificadoClave")() + "," + idiomaSelecionado.messageFormatter("CertificadoNoCert")()  ;
    campos = "clave,noCertificado";//Quit ID;
  
    var filtersSearch = [];
 
    return buildTableSearch(nameCmp, title, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener);
}

function selectorCertificadosShow(val) {
    searchCertificados(val[0]);
    
}

function searchCertificados(id) {
  
    var url = route + "/api/Certificados/getPorIdCertificados";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
       
    } else {
       
        certificado = Mensaje.resultado;
        mostrarCertificado();
       // var controlCred = "TipoCorrida" + certificado.id;
        //getContenedorPorControl(controlCred);
        document.getElementById("btnGuardar").style.display = "none";
        document.getElementById("btnActualizar").style.display = "inline-block";
        document.getElementById("btnEliminar").style.display = "inline-block";
        
    }
}

function mostrarCertificado() {
    if (certificado !== null) {
       
        document.getElementById("txtRazonSocial").value = razonSocialActual.razonsocial;
        document.getElementById("txtClave").value = certificado.clave;
        document.getElementById("txtid").value = certificado.id;
        
        document.getElementById("txtContrasena").value = certificado.password;
        document.getElementById("txtFechadesde").value = formatDateddmmyyy(new Date(certificado.vigenciaDesde));
        document.getElementById("txtFechahasta").value = formatDateddmmyyy(new Date(certificado.vigenciaHasa));
        document.getElementById("txtNoCert").value = certificado.noCertificado;


        $('#selectorFileCert').attr("value", certificado.certificado);
        $('#file-watch').text(certificado.noCertificado+".cert");
        var imgCert = "data:cert;base64," + certificado.certificado;
        $('#file-watch').attr("href", imgCert);
       // $('#imgLogoPreview').attr("src", imgLogo);

        //key
        $('#selectorFileKey').attr("value", certificado.llavePrivada);
        $('#file-watchK').text(certificado.noCertificado + ".key");
        var imgKey = "data:key;base64," + certificado.llavePrivada;
        $('#file-watchK').attr("href", imgKey);
      //  $('#imgBannerPreview').attr("src", imgBanner);


       

     



        document.getElementById("btnGuardar").style.display = "inline-block";
        document.getElementById("btnActualizar").style.display = "none";
        document.getElementById("btnEliminar").style.display = "none";
    }

}


function construirCertificado()
{

    if (certificado === null)
    {
        certificado = {};
    }
   
    if (document.getElementById("txtid").value === "0") {
        certificado.id = -1;
    }
    else {

        certificado.id = document.getElementById("txtid").value;

    }
    
    certificado.clave = document.getElementById("txtClave").value;
    var fileCertificado = $('#selectorFileCert').attr("value");
    if (fileCertificado !== undefined) {
        certificado.certificado = fileCertificado;
    }

    var fileKey = $('#selectorFileKey').attr("value");
    if (fileKey !== undefined) {
        certificado.llavePrivada = fileKey;
    }    
    
    certificado.password =document.getElementById("txtContrasena").value 
    certificado.vigenciaDesde =document.getElementById("txtFechadesde").value;
    certificado.vigenciaHasa=document.getElementById("txtFechahasta").value;
    certificado.noCertificado = document.getElementById("txtNoCert").value;
    certificado.razonesSociales_ID = razonSocialActual.id;

}


function saveCertificado() {
    if (preValidateBeforeSave()) {
        var obj = {};
        construirCertificado();
        obj.Certificado = certificado;
        var url = route + "/api/Certificados/saveCertificado";
        var dataToPost = JSON.stringify(obj);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
        if (Mensaje.resultado === null) {
            alert("No object");
            limpiar();
        } else {
            limpiar();
        }

    }
    
    
}

function limpiar() {

    document.getElementById("txtClave").value = "";
    document.getElementById("txtid").value = 0;
    document.getElementById("txtRazonSocial").value = "";
    document.getElementById("txtRazonSocial").value = razonSocialActual.razonsocial;

    
    $('#selectorFileCert').attr("value", "");
    $('#selectorFileCert').attr("namefile", "");
    $('#file-watch').text("");
    $('#file-watch').attr("href", "");

    $('#selectorFileKey').attr("value", "");
    $('#selectorFileKey').attr("namefile", "");
    $('#file-watchK').text("");
    $('#file-watchK').attr("href", "");
   
    
    document.getElementById("txtContrasena").value = "";
    document.getElementById("txtFechadesde").value = "";
    document.getElementById("txtFechahasta").value = "";
    document.getElementById("txtNoCert").value = "";

    document.getElementById("btnGuardar").style.display = "inline-block";
    document.getElementById("btnActualizar").style.display = "none";
    document.getElementById("btnEliminar").style.display = "none";

   // document.getElementById("txtClave").focus();
}

function actualizarCertificado() {
    var obj = {};
    construirCertificado();
    obj.Certificado = certificado;
    var url = route + "/api/Certificados/saveCertificado";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");
        limpiar();
    } else {
        limpiar();
    }
}

function eliminarCertificado() {
    var answer = confirm("¿Quieres eliminar este registro?");
    if (answer) {

        var url = route + "/api/Certificados/deleteCertificado";
        var dataToPost = JSON.stringify(certificado.id);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
        if (Mensaje.resultado === null) {
            alert("No object");
            limpiar();
        } else {
            limpiar();
        }
    }

}

function procesaCertificado()
{
    var infCert = {};
    var fileCertificado = $('#selectorFileCert').attr("value");
    if (fileCertificado !== undefined) {
        infCert.fileCertificado = fileCertificado;
    }

    var fileKey = $('#selectorFileKey').attr("value");
    if (fileKey !== undefined) {
        infCert.fileKey = fileKey;
    }

    var password = document.getElementById("txtContrasena").value;
    if (password !== undefined) {
        infCert.password = password;
    }

    // return infCert;
    var url = route + "/api/Certificados/getDatosCertificado";
    var dataToPost = JSON.stringify(infCert);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);
    if (Mensaje.resultado === null) {
        alert("No object");

    } else {
        obj = Mensaje.resultado;
        if (obj[5] === true) {
            if (obj[4] === true) {
                document.getElementById("txtFechadesde").value = formatDateddmmyyy(new Date(obj[0]));
                document.getElementById("txtFechahasta").value = formatDateddmmyyy(new Date(obj[1]));
                document.getElementById("txtNoCert").value = obj[3];

            }
            else {
                alert("Contraseña incorrecta");
            }
        }
        else {
            alert("Certificado vencido");
        }

        
    }

}

function preValidateBeforeSave() {
    var isValid = true;

    
    isValid = validateComponents(elements);
    

          

       
    
    //isValid = camposNecesariosIngresosBajas();
    return isValid
}

