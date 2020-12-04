/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */

var route = "";
var getConfigImg = null;


jQuery(document).ready(function () {
    initCnfImg();
    addListenersCnfImg();

});


function addListenersCnfImg() {
    $("#fileImagen").on('change', function (e) {
        var fileName = e.target.files[0].name.toString();
        var labelMainFile = e.target.parentNode;
        var extension = e.target.files[0].type;
        var spanFile = labelMainFile.querySelector('.file-custom');
        var textFileLink = spanFile.querySelector('.file-watch');
        if (fileName.length > 15) {
            var subCutNameFile = fileName.substring(0, 15);
            textFileLink.text = subCutNameFile.concat("...");
        } else {
            textFileLink.text = fileName;
        }
        var valFile = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(valFile);
        reader.onload = function () {
            var getFile = reader.result;
            labelMainFile.setAttribute("nameFile", fileName);
            labelMainFile.setAttribute("value", /base64,(.+)/.exec(getFile)[1]);
            textFileLink.href = "data:" + extension + ";base64," + labelMainFile.getAttribute("value");
            var imgLogo = "data:image/png;base64," + labelMainFile.getAttribute("value");
            $('#imgLogoPreview').attr("src", imgLogo);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    });

    $("#fileBanner").on('change', function (e) {
        var fileName = e.target.files[0].name.toString();
        var labelMainFile = e.target.parentNode;
        var extension = e.target.files[0].type;
        var spanFile = labelMainFile.querySelector('.file-custom');
        var textFileLink = spanFile.querySelector('.file-watch');
        if (fileName.length > 15) {
            var subCutNameFile = fileName.substring(0, 15);
            textFileLink.text = subCutNameFile.concat("...");
        } else {
            textFileLink.text = fileName;
        }
        var valFile = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(valFile);
        reader.onload = function () {
            var getFile = reader.result;
            labelMainFile.setAttribute("nameFile", fileName);
            labelMainFile.setAttribute("value", /base64,(.+)/.exec(getFile)[1]);
            textFileLink.href = "data:" + extension + ";base64," + labelMainFile.getAttribute("value");
            var imgBanner = "data:image/png;base64," + labelMainFile.getAttribute("value");
            $('#imgBannerPreview').attr("src", imgBanner);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    });

    $("#fileImFondo").on('change', function (e) {
        var fileName = e.target.files[0].name.toString();
        var labelMainFile = e.target.parentNode;
        var extension = e.target.files[0].type;
        var spanFile = labelMainFile.querySelector('.file-custom');
        var textFileLink = spanFile.querySelector('.file-watch');
        if (fileName.length > 15) {
            var subCutNameFile = fileName.substring(0, 15);
            textFileLink.text = subCutNameFile.concat("...");
        } else {
            textFileLink.text = fileName;
        }
        var valFile = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(valFile);
        reader.onload = function () {
            var getFile = reader.result;
            labelMainFile.setAttribute("nameFile", fileName);
            labelMainFile.setAttribute("value", /base64,(.+)/.exec(getFile)[1]);
            textFileLink.href = "data:" + extension + ";base64," + labelMainFile.getAttribute("value");
            var imgFondo = "data:image/png;base64," + labelMainFile.getAttribute("value");
            $('#imgImFondoPreview').attr("src", imgFondo);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    });

    $('#ckbQuitarIndicador').click(function () {
        if ($(this).is(':checked')) {
            document.getElementById("panelIndicador").style.display = "none";
            document.getElementById("panelIndicadorPrinc").style.display = "ruby-base";
        } else {
            document.getElementById("panelIndicador").style.display = "";
            document.getElementById("panelIndicadorPrinc").style.display = "";
        }
    });

    $('#ckbQuitarPanel').click(function () {
        if ($(this).is(':checked')) {
            document.getElementById("panelOverlay").style.background = "transparent";
            document.getElementById("panelOverlay").style.border = "0px";
            document.getElementById("panelOverlay").style.boxShadow = "0 0px 0px rgba(0,0,0,0)";
           
        } else {
            document.getElementById("panelOverlay").style.background = "";
            document.getElementById("panelOverlay").style.border = "0px";
            document.getElementById("panelOverlay").style.boxShadow = "";
          
        }
    });

    $('#ckbQuitarFondo').click(function () {
        if ($(this).is(':checked')) {
            document.getElementById("panelFondo").style.background = "transparent";
            

        } else {
            document.getElementById("panelFondo").style.background = "";
         

        }
    });

    $('#imgColorFondo').change(function () {
        cambiarColorIndicador(this.value);
    });
}

function initCnfImg() {
    getActualImg();
}

function getActualImg() {
    var dataget = getConfiguraImg();
    if (dataget === undefined) {
        console.log("Problems to select Configuración Imagen");
    } else {
        if (dataget !== null) {
            mostrarObjetoCnfImg(dataget);
        }
        getConfigImg = dataget;
    }
}


function getConfiguraImg() {
    var cnfPortal = {};
    var cnfPortal = makeActionCnfImg("C");
    return cnfPortal;
}

function construirCnfImg(obj) {
    var obj = obj;
    if (obj === undefined || obj === null) {
        cnfImg = {};
    } else {
        cnfImg = {};
        if (obj.id !== undefined) {
            cnfImg.id = obj.id;
            cnfImg.clave = obj.clave;
            cnfImg.nombre = obj.nombre;
            cnfImg.url = obj.url;
            cnfImg.estado = obj.estado;
            cnfImg.postLogin = obj.postLogin;
            cnfImg.imgLogo = obj.imgLogo;
            cnfImg.imgFondo = obj.imgFondo;
            cnfImg.imgBanner = obj.imgBanner;
            cnfImg.isNombreCorpo = obj.isNombreCorpo;
            cnfImg.isBannerCorpo = obj.isBannerCorpo;
            cnfImg.textoBienvenida = obj.textoBienvenida;
            cnfImg.configLoader = obj.configLoader;
        }
    }

    cnfImg.textoPrincipal = "";

    var imageLogo = $('#selectorFileLogo').attr("value");
    if (imageLogo !== undefined) {
        cnfImg.imgLogo = imageLogo;
    }

    var imageBanner = $('#selectorFileBanner').attr("value");
    if (imageBanner !== undefined) {
        cnfImg.imgBanner = imageBanner;
    }

    var imageFondo = $('#selectorFileImFondo').attr("value");
    if (imageFondo !== undefined) {
        cnfImg.imgFondo = imageFondo;
    }

    var rbnImgBanner = document.getElementById("rbImgBanner");
    var rbnImgLogotipo = document.getElementById("rbImgLogotipo");

    if (rbnImgBanner.checked) {
        cnfImg.imgBannerLogo = 1;
    } else if (rbnImgLogotipo.checked) {
        cnfImg.imgBannerLogo = 2;
    }

    cnfImg.colorFondo = document.getElementById("imgColorFondo").value;
    cnfImg.colorFuente = document.getElementById("imgColorFuente").value;
    cnfImg.colorExceEncabe = document.getElementById("imgColorFondoEncabezado").value;
    cnfImg.colorExceTextoEncabe = document.getElementById("imgColorTextoEncabezado").value;
    cnfImg.colorExceGruposTot = document.getElementById("imgColorGruposTotales").value;


    var rbnImgNombreCorpo = document.getElementById("imgShowName");
    if (rbnImgNombreCorpo.checked) {
        cnfImg.isNombreCorpo = true;
    } else {
        cnfImg.isNombreCorpo = false;
    }

    var rbnImgBannerCorpo = document.getElementById("imgShowBannerLogin");
    if (rbnImgBannerCorpo.checked) {
        cnfImg.isBannerCorpo = true;
    } else {
        cnfImg.isBannerCorpo = false;
    }

    cnfImg.textoBienvenida = document.getElementById("txtImgTextoBienv").value;

    cnfImg.configLoader = JSON.stringify(construirConfLoader());

    return cnfImg;
}

function mostrarObjetoCnfImg(obj) {
    var obj = obj;
    if (obj === undefined) {
        //limpiarComponentesCnfImg();
    } else {
        $('#selectorFileLogo').attr("value", obj.imgLogo);
        $('#fileWatchLogo').text("Logo");
        var imgLogo = "data:image/png;base64," + obj.imgLogo;
        $('#fileWatchLogo').attr("href", imgLogo);
        $('#imgLogoPreview').attr("src", imgLogo);

        //Banner
        $('#selectorFileBanner').attr("value", obj.imgBanner);
        $('#fileWatchBanner').text("Banner");
        var imgBanner = "data:image/png;base64," + obj.imgBanner;
        $('#fileWatchBanner').attr("href", imgBanner);
        $('#imgBannerPreview').attr("src", imgBanner);

        //Fondo
        $('#selectorFileImFondo').attr("value", obj.imgFondo);
        $('#fileWatchImFondo').text("ImagenFondo");
        var imgFondo = "data:image/png;base64," + obj.imgFondo;
        $('#fileWatchImFondo').attr("href", imgFondo);
        $('#imgImFondoPreview').attr("src", imgFondo);

        //Pagina Principal
        if (obj.imgBannerLogo === 1) {
            $('#rbImgBanner').prop('checked', true);
        } else if (obj.imgBannerLogo === 2) {
            $('#rbImgLogotipo').prop('checked', true);
        }

        if (obj.colorFondo !== null) {
            document.getElementById("imgColorFondo").value = obj.colorFondo.toString();
        }
        if (obj.colorFuente !== null) {
            document.getElementById("imgColorFuente").value = obj.colorFuente.toString();
        }


        if (obj.colorExceEncabe !== null) {
            document.getElementById("imgColorFondoEncabezado").value = obj.colorExceEncabe.toString();
        }

        if (obj.colorExceTextoEncabe !== null) {
            document.getElementById("imgColorTextoEncabezado").value = obj.colorExceTextoEncabe.toString();
        }

        if (obj.colorExceGruposTot !== null) {
            document.getElementById("imgColorGruposTotales").value = obj.colorExceGruposTot.toString();
        }

        if (obj.isNombreCorpo === true) {
            $('#imgShowName').prop('checked', true);
        } else {
            $('#imgShowName').prop('checked', false);
        }

        if (obj.isBannerCorpo === true) {
            $('#imgShowBannerLogin').prop('checked', true);
        } else {
            $('#imgShowBannerLogin').prop('checked', false);
        }

        document.getElementById("txtImgTextoBienv").value = obj.textoBienvenida;
        if (obj.configLoader !== null) {
            var configLoad = JSON.parse(obj.configLoader);
            mostrarLoading(configLoad, obj.colorFondo);
        }

        

    }
}

function makeActionCnfImg(action, obj) {
    if (action === "M") {
        var succes = false;
        var objCnfImg = {};
        objCnfImg.entity = construirCnfImg(obj);
        var url = route + "/api/Portales/modificar";
        var data = JSON.stringify(objCnfImg);
        var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
        if (Mensaje.resultado !== null) {
            var result = Mensaje.resultado;
            if (result) {
                getConfigImg = objCnfImg.entity;
                succes = true;
            }
            else {
                alert(Mensaje.error);
            }
        }

        return succes;
    }
    else if (action === "C") {
        var hostnameKey = sessionStorage.getItem("keyPortal");
        var cnfPortal = {};
        var url = route + "/api/Portales/getPortalesByKey";
        var data = JSON.stringify(hostnameKey);
        var Mensaje = Common.sendRequestJson('POST', url, data, 2, false);
        if (Mensaje.resultado !== null) {
            cnfPortal = Mensaje.resultado;
        } else {
            console.log(Mensaje.error);
        }
        if (cnfPortal === undefined) {
            cnfPortal = {};
        }
        return cnfPortal;
    }
}

function preValidateBeforeSaveCnfImg() {
    //var goConfigApa = true;
    //goConfigApa = validateComponents(elementsConfigApa);
    //return goConfigApa;
    return true;
}

function saveCnfImg() {
    if (preValidateBeforeSaveCnfImg()) {
        var succes = false;
        succes = makeActionCnfImg("M", getConfigImg);
        if (succes) {
            var imageByCompanie = [getConfigImg.imgLogo, getConfigImg.imgBanner, getConfigImg.imgBannerLogo, getConfigImg.colorFondo,
                getConfigImg.colorFuente, getConfigImg.isNombreCorpo, getConfigImg.configLoader.toString(), getConfigImg.colorExceEncabe, getConfigImg.colorExceTextoEncabe, getConfigImg.colorExceGruposTot];
            localStorage.setItem('imageByCompanie', imageByCompanie);
            var imgMainLogo = "data:image/png;base64," + imageByCompanie[0];
            var imgMainBanner = "data:image/png;base64," + imageByCompanie[1];
            var typeToDisplay = imageByCompanie[2];
            if (typeToDisplay === "0" || typeToDisplay === "1") {
                $('#imgMainLogo').attr("src", imgMainBanner);
            }
            else if (typeToDisplay === "0" || typeToDisplay === "2") {
                $('#imgMainLogo').attr("src", imgMainLogo);
            }
            $("#fastMenu").css("background-color", getConfigImg.colorFondo);
            //div.style.borderBottomColor = imageByCompanie[3];
            $('.hub-rowBorder').css('border-bottom-color', getConfigImg.colorFondo);
            $(".level").css("color", getConfigImg.colorFuente);

            var displayNameCompanie = imageByCompanie[5];
            if (displayNameCompanie) {
                $('#nameCompany').show();
                $("#nameUser").css("padding-top", "10px");
            } else {
                $('#nameCompany').hide();
                $("#nameUser").css("padding-top", "0px");
            }

            limpiarComponentesCnfImg();
            location.reload();
            alert("Configuración de imagen guardada");
        }
    }
}

function cancelCnfImg() {
    getActualImg();
}

/*Default Functions*/
function limpiarComponentesCnfImg() {


}


/*funciones loader*/
function mostrarLoading(configLoad,colorFondo) {
    document.getElementById("ckbQuitarFondo").checked = configLoad.quitarFondo;
    document.getElementById("ckbQuitarPanel").checked = configLoad.quitarPanel;
    document.getElementById("ckbQuitarIndicador").checked = configLoad.quitarIndicador;
    document.getElementById("selAnchoIndicador").value = configLoad.anchoAni;
    cambiarColorIndicador(colorFondo);
    cambiarAnchoInd(configLoad.anchoAni);

    if (configLoad.quitarFondo) {
        document.getElementById("panelFondo").style.background = "transparent";
    } else {
        document.getElementById("panelFondo").style.background = "";
    }

    if (configLoad.quitarPanel) {
        document.getElementById("panelOverlay").style.background = "transparent";
        document.getElementById("panelOverlay").style.border = "0px";
        document.getElementById("panelOverlay").style.boxShadow = "0 0px 0px rgba(0,0,0,0)";
    } else {
        document.getElementById("panelOverlay").style.background = "";
        document.getElementById("panelOverlay").style.border = "0px";
        document.getElementById("panelOverlay").style.boxShadow = "";
    }
    if (configLoad.quitarIndicador) {
        document.getElementById("panelIndicador").style.display = "none";
        document.getElementById("panelIndicadorPrinc").style.display = "ruby-base";
    } else {
        document.getElementById("panelIndicador").style.display = "";
        document.getElementById("panelIndicadorPrinc").style.display = "";
    }


}

function cambiarColorIndicador(colorFondo) {
    document.getElementById("segment7").style.cssText = 'background:' + colorFondo + ';-webkit-box-shadow: 0 0 1px' + colorFondo + ';box-shadow: 0 0 1px' + colorFondo + ';';
    document.getElementById("segment6").style.cssText = 'background:' + colorFondo + ';-webkit-box-shadow: 0 0 1px' + colorFondo + ';box-shadow: 0 0 1px' + colorFondo + ';';
    document.getElementById("segment5").style.cssText = 'background:' + colorFondo + ';-webkit-box-shadow: 0 0 1px' + colorFondo + ';box-shadow: 0 0 1px' + colorFondo + ';';
    document.getElementById("segment4").style.cssText = 'background:' + colorFondo + ';-webkit-box-shadow: 0 0 1px' + colorFondo + ';box-shadow: 0 0 1px' + colorFondo + ';';
    document.getElementById("segment3").style.cssText = 'background:' + colorFondo + ';-webkit-box-shadow: 0 0 1px' + colorFondo + ';box-shadow: 0 0 1px' + colorFondo + ';';
    document.getElementById("segment2").style.cssText = 'background:' + colorFondo + ';-webkit-box-shadow: 0 0 1px' + colorFondo + ';box-shadow: 0 0 1px' + colorFondo + ';';
    document.getElementById("segment1").style.cssText = 'background:' + colorFondo + ';-webkit-box-shadow: 0 0 1px' + colorFondo + ';box-shadow: 0 0 1px' + colorFondo + ';';
    document.getElementById("segment0").style.cssText = 'background:' + colorFondo + ';-webkit-box-shadow: 0 0 1px' + colorFondo + ';box-shadow: 0 0 1px' + colorFondo + ';';
}

function cambiarAnchoInd(value) {
    document.getElementById("segment7").style.width = value;
    document.getElementById("segment6").style.width = value;
    document.getElementById("segment5").style.width = value;
    document.getElementById("segment4").style.width = value;
    document.getElementById("segment3").style.width = value;
    document.getElementById("segment2").style.width = value;
    document.getElementById("segment1").style.width = value;
    document.getElementById("segment0").style.width = value;
}

function construirConfLoader() {
    var obj = {};
    if (document.getElementById("ckbQuitarFondo").checked) {
        obj.quitarFondo = true;
    } else {
        obj.quitarFondo = false;
    }

    if (document.getElementById("ckbQuitarPanel").checked) {
        obj.quitarPanel = true;
    } else {
        obj.quitarPanel = false;
    }
    if (document.getElementById("ckbQuitarIndicador").checked) {
        obj.quitarIndicador = true;
    } else {
        obj.quitarIndicador = false;
    }
    obj.anchoAni = document.getElementById("selAnchoIndicador").value;

    return obj;

}

