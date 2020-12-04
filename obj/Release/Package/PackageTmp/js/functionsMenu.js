/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */
var route = "";
var select = false;
var buqueda = false;
var detalleNor = false;
var detalleMas = false;
var idiomaSelecionado;
var idioma;
var tipoComponentes = 1;/* 1::Cmpts. Html, 2::Cmpts. DevExtreme */
var lasUserConfigs = null;
var level = [];
var typeIcon = "";
var typeTheme = "";
var imageByCompanie = null;

jQuery(document).ready(function () {
    imageByCompanie = localStorage.getItem('imageByCompanie');
    if (imageByCompanie !== null) {
        imageByCompanie = imageByCompanie.toString().split(",");
    }
    lasUserConfigs = getConfigs();
    displayCompanies();
    getConfigApariencia();
    loadLanguage();
    desplegarHubInicio();
    setConfigColor();
    setPortal();
    //autoAction();
    //loadMyMenu();
});

function myFunction() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    return "Width: " + w + "<br>Height: " + h;
}

function loadMyMenu() {
    $('#MP').click();
    var liSel = $("#5");
    liSel.children("a").click();
    liSel.find("li a").click();
    var menu = $("#hub").children(".container-view").eq(7);
    menu.find("a").click();
}

function autoAction() {
    $("#MP").trigger('click');
    var a = $(".sidebar-nav").find("#5").find("a");
    a.trigger('click');
    var container = $(".hub-container .container-view:eq(3)");
    container.trigger('click');
    closeNav();
}

function setConfigColor() {
    if (imageByCompanie[3] !== undefined && imageByCompanie[3] !== null) {
        $("#fastMenu").css("background-color", imageByCompanie[3]);
    }

    if (imageByCompanie[4] !== undefined && imageByCompanie[4] !== null) {
        $(".level").css("color", imageByCompanie[4]);
    }
}

function setConfigIconTheme() {
    var getCnfAp = sessionStorage.getItem('apariencia');
    getCnfAp = getCnfAp.toString().split(",");
    var getTypeTheme = getCnfAp[0].toString();
    var getTypeIcon = getCnfAp[1].toString();
    //Icon
    if (getTypeIcon === "1") {
        typeIcon = "azul";
    } else if (getTypeIcon === "2") {
        typeIcon = "azul-verde";
    } else if (getTypeIcon === "3") {
        typeIcon = "cobalto";
    } else if (getTypeIcon === "4") {
        typeIcon = "colores";
    } else if (getTypeIcon === "5") {
        typeIcon = "fiesta";
    } else if (getTypeIcon === "6") {
        typeIcon = "fiesta 2";
    } else if (getTypeIcon === "7") {
        typeIcon = "fiesta 3";
    } else if (getTypeIcon === "8") {
        typeIcon = "infantil";
    } else if (getTypeIcon === "9") {
        typeIcon = "limon";
    } else if (getTypeIcon === "10") {
        typeIcon = "marron";
    } else if (getTypeIcon === "11") {
        typeIcon = "metro";
    } else if (getTypeIcon === "12") {
        typeIcon = "morado";
    } else if (getTypeIcon === "13") {
        typeIcon = "naranja";
    } else if (getTypeIcon === "14") {
        typeIcon = "negocios";
    } else if (getTypeIcon === "15") {
        typeIcon = "negocios 2";
    } else if (getTypeIcon === "16") {
        typeIcon = "retro";
    } else if (getTypeIcon === "17") {
        typeIcon = "sepia";
    } else if (getTypeIcon === "18") {
        typeIcon = "verde";
    }

    //Theme
    if (getTypeTheme === "0") {
        typeTheme = "Default";
    } else if (getTypeTheme === "1") {
        typeTheme = "DevEx";
    } else if (getTypeTheme === "2") {
        typeTheme = "Aqua";
    } else if (getTypeTheme === "3") {
        typeTheme = "BlackGlass";
    }

    $("#container").attr('class', typeTheme);
}

function setPortal() {
    var accesData = getCookie('eochair');
    if (accesData !== "") {
        var getTk = decodeJwt(getCookie('eochair'));
        var getPortal = sessionStorage.getItem('keyPortal');
        if (getPortal === null) {
            sessionStorage.setItem('keyPortal', getTk.payload.keyPortal);
        }
    }
}


window.onload = function () {
    Init();
};

$(window).scroll(function () {
    $("#mySidenav").css("top", Math.max(0, 116 - $(this).scrollTop()));
});

function Init() {
    document.getElementById("closeWindow").style.visibility = "hidden";
}

function cambiarIdioma(idioma) {
    sessionStorage.setItem('idioma', idioma);
    idiomaSelecionado = cargarArchivoIdioma(idioma);
}

function tiposPantalla(sel, search, Detalle, DetalleMasiva) {
    select = sel;
    buqueda = search;
    detalleNor = Detalle;
    detalleMas = DetalleMasiva;
}

function loadLanguage() {
    cargarArchivosGlobalize();
    cambiarIdioma(sessionStorage["idioma"] !== undefined ? sessionStorage["idioma"] : "es");
    if (sessionStorage["idioma"] !== undefined) {
        if (document.getElementById('idioma')) {
            document.getElementById('idioma').value = sessionStorage["idioma"];
        }
    }
}

function getConfigs() {
    var url = route + "/api/Usuario/getLastConfig";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado !== null) {
        return JSON.parse(Mensaje.resultado);
    }
}

function getCompanies() {
    var url = route + "/api/RazonSocialConfiguracion/getRazonesSocialesUsuario";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false, false);
    if (Mensaje.resultado !== null) {
        $('#cbxCompanies').find('option').not(':first').remove();
        var companies = Mensaje.resultado;
        for (let i = 0; i < companies.length; i++) {
            let opt = document.createElement("option");
            opt.value = companies[i].id + "," + companies[i].razonSocial.claveRazonSocial;
            opt.innerHTML = companies[i].razonSocial['nombreRazonSocial'];
            $('#cbxCompanies').append(opt);
        }
        if (companies.length === 0) {
            alert("Este usuario no tiene empresas asignadas");
        } else if (companies.length === 1) {
            return false;
        }
        else if (companies.length > 1) {
            return true;
        }
    }
}

function setCompanie(isOne, lastRazon) {
    isOne = typeof isOne !== 'undefined' ? isOne : false;
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    var e = document.getElementById("cbxCompanies");
    var getidRazon = "";
    var getRazon = "";
    if (lastRazon != null) {
        for (var i = 0; i < e.options.length; i++) {
            if (e.options[i].value === lastRazon.toString()) {
                var getValCompany = e.options[i].value.split(",");
                getidRazon = getValCompany[0];
                getRazon = getValCompany[1];
                getRazonName = e.options[i].text;
                break;
            }
        }
    } else {
        var getRazonName = "";
        if (isOne) {
            var getValCompany = e.options[1].value.split(",");
            getidRazon = getValCompany[0];
            getRazon = getValCompany[1];
            getRazonName = e.options[1].text;
        }
        else {
            var getValCompany = e.options[e.selectedIndex].value.split(",");
            getidRazon = getValCompany[0];
            getRazon = getValCompany[1];
            getRazonName = e.options[e.selectedIndex].text;
        }
    }
    if (getRazon === "") {
        modal.style.display = "block";
        alert("Debes seleccionar al menos un Razón social");
    } else {
        document.getElementById('nameCompany').innerHTML = "" + getRazonName;
        var rz = { 'id': getidRazon, 'clave': getRazon, 'nombreRazon': getRazonName };
        localStorage.setItem('RazonSocial', JSON.stringify(rz));
        buildMenu();
        //Call service Last-Log
        setLastConfigByUSer();
    }
}

function setLastConfigByUSer() {
    var url = route + "/api/Usuario/setLastConfig";
    var rz = JSON.parse(localStorage.getItem("RazonSocial"));
    var keyRazon = rz['clave'];
    var data = new Object();
    data['RazonSocial'] = keyRazon;
    data = JSON.stringify(data);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false);
    if (Mensaje.resultado !== null) {

    }
}

function getConfigApariencia() {
    var url = route + "/api/Apariencia/getAparienciaActual";
    var objCnfAp = {};
    objCnfAp.razonSocial = getRazonSocial().id;
    var data = JSON.stringify(objCnfAp);
    var Mensaje = Common.sendRequestJson('POST', url, data, undefined, false, false);
    if (Mensaje.resultado !== null) {
        var cnfAppear = Mensaje.resultado;
        var configAp;
        if (cnfAppear.Usuario !== undefined && cnfAppear.Usuario !== null) {
            var cnfApUsuario = JSON.parse(cnfAppear.Usuario);
            tema = cnfApUsuario.tema.toString();
            iconos = cnfApUsuario.iconos.toString();
            configAp = [tema, iconos];
        } else if (cnfAppear.RazonesSociales !== undefined && cnfAppear.RazonesSociales !== null) {
            var cnfApRazonSocial = JSON.parse(cnfAppear.RazonesSociales);
            tema = cnfApRazonSocial.tema.toString();
            iconos = cnfApRazonSocial.iconos.toString();
            configAp = [tema, iconos];
        } else {
            configAp = [cnfAppear.Apariencia.tema, cnfAppear.Apariencia.iconos];
        }
        sessionStorage.setItem('apariencia', configAp);
        setConfigColor();
        setConfigIconTheme();
        $('#closeWindow').css('background-image', 'url(../img/Iconos/' + typeIcon + '/izquierda.png)');
    } else {

    }
}

function buildMenu() {
    var url = route + "/api/Menu/getMainMenu";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, 2, false);
    if (Mensaje.resultado !== null) {
        createMenuLeftSide(Mensaje.resultado);
    }
    addListeners();
}

function createMenuLeftSide(data) {
    var sideBar = document.getElementById('sidebar');
    sideBar.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        var li = document.createElement("li");
        li.className = "sub-sidebar-brand";
        li.id = data[i]["idTipoHer"];
        var typeToll = document.createElement("a");
        typeToll.className = "sub";
        typeToll.innerHTML = data[i]["llave"];
        li.appendChild(typeToll);
        var subMenu = document.createElement("ul");
        subMenu.className = "sub-menu";
        for (var z = 0; z < data[i]["Herramientas"].length; z++) {
            var liSub = document.createElement("li");
            liSub.id = data[i]["Herramientas"][z]["id"];
            liSub.className = "sub-sidebar-brand";
            var aSub = document.createElement("a");
            aSub.innerHTML = data[i]["Herramientas"][z]["nombre"];
            liSub.appendChild(aSub);
            subMenu.appendChild(liSub);
        }

        for (var l = 0; l < data[i]['contenedores'].length; l++) {

            if (data[i]['contenedores'][l]['accesoMenu']) {
                var liSubcon = document.createElement("li");
                liSubcon.id = data[i]["contenedores"][l]["id"];
                liSubcon.className = "accesDirect";
                var aSubcon = document.createElement("a");
                aSubcon.setAttribute('Opener', data[i]['contenedores'][l]['accion']);
                aSubcon.innerHTML = data[i]["contenedores"][l]["nombre"];
                liSubcon.appendChild(aSubcon);
                subMenu.appendChild(liSubcon);
            }
        }

        li.appendChild(subMenu);
        sideBar.appendChild(li);
    }
}

function addListeners() {
    $('.sidebar-nav > .sub-sidebar-brand:first').click(function () {
        var url = route + "/api/Menu/getUserHubMenu";
        var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false, false);
        if (Mensaje.resultado !== null) {
            buildPersonalizedShowMenu(Mensaje.resultado);
        }
    })

    $('.sub').click(function () {
        $(this).parent().toggleClass('active');
        level = [];
        var liId = $(this).parent().attr("id");
        if (liId === "1") {
            level.push("S:Inicio");
        } else {
            level.push($(this).text());
        }
        createLevels(level);
        var padre = $(this)[0].parentNode
        var hijos = padre.childNodes;
        if (hijos[1].childNodes.length > 0) {
            $('.sub').not(this).each(function (idx, li) {
                $(this).parent().removeClass('active');
            });
        } else {
            $('.sub').not(this).each(function (idx, li) {
                $(this).parent().removeClass('active');
            });

            var url = route + "/api/Menu/getHubMenuTipoHer";
            var tipoherrId = padre.id;
            var dataToPost = JSON.stringify(tipoherrId);
            var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false, false);
            if (Mensaje.resultado !== null) {
                clearWindows();
                buildShowMenu(Mensaje.resultado);
                document.getElementById('hub').style.display = 'block';

            }
        }
    });
    $('.sub-menu > .sub-sidebar-brand > a').click(function () {
        var url = route + "/api/Menu/getHubMenu";
        if ($(".sub-menu .activeDirect").length > 0) {
            $('.accesDirect').removeClass('activeDirect');
            level.splice(1, level.length);
        }

        if (typeof level[1] === 'undefined') {
            level.push($(this).text());
        }
        else {
            level[1] = $(this).text();
        }
        createLevels(level);
        var herrId = $(this).parent().attr("id");

        var dataToPost = JSON.stringify(herrId);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false, false);
        if (Mensaje.resultado !== null) {
            clearWindows();
            buildShowMenu(Mensaje.resultado);
            document.getElementById('hub').style.display = 'block';

        }
    });

    $('.accesDirect > a').click(function () {
        var url = route + "/api/Menu/getHubMenu";
        $(this).parent().addClass("activeDirect");
        level = level.slice(0, 1);
        if (typeof level[1] === 'undefined') {
            level.push($(this).text());
        }
        else {
            level[1] = $(this).text();
        }
        createLevels(level);
        closeNav();
        document.getElementById("closeWindow").style.visibility = "visible";
        document.getElementById("hub").style.display = "none";
        element = document.getElementById("container");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        var composer = $("#container");
        composer.data("opener", this.getAttribute("opener"));
        displayWindow();
        startCustomTools();

        changeIconByWindow();


    });

}

function desplegarHubInicio() {
    var url = route + "/api/Menu/getUserHubMenu";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false, false);
    if (Mensaje.resultado !== null) {
        buildPersonalizedShowMenu(Mensaje.resultado);
        level.push("S:Inicio");
        createLevels(level);
    }
}

function buildShowMenu(data) {
    var hub = document.getElementById('hub');
    while (hub.firstChild) {
        hub.removeChild(hub.firstChild);
    }
    if (data.length > 0) {
        var divtituloPrin = document.createElement("div");
        divtituloPrin.className = "tituloHer";
        var h2Titulo = document.createElement("H2");
        h2Titulo.innerHTML = data[0][3];
        var pdesTitulo = document.createElement("p");
        pdesTitulo.innerHTML = data[0][4];
        divtituloPrin.appendChild(h2Titulo);
        divtituloPrin.appendChild(pdesTitulo);
        hub.appendChild(divtituloPrin);
    }

    for (var z = 0; z < data.length; z++) {
        var div = document.createElement("H2");
        if (data[z][1] === "") {
            div.className = "hub-row";
        } else {
            div.className = "hub-rowBorder";
            div.style.borderBottomColor = imageByCompanie[3];
        }
        div.innerHTML = data[z][1];
        hub.appendChild(div);
        for (var i = 0; i < data[z][2].length; i++) {
            var div = document.createElement("div");
            div.setAttribute("Opener", data[z][2][i][2]);
            div.className = "container-view";
            div.setAttribute("onclick", "Opener(this);return false;");
            var a = document.createElement("div");
            a.className = "iconoText";
            var img = document.createElement("img");
            img.src = "img/Iconos/" + typeIcon + "/" + data[z][2][i][3] + ".png";
            var p = document.createElement("p");
            p.innerHTML = data[z][2][i][1];
            p.className = "tituloClass";
            var pdes = document.createElement("p");
            pdes.innerHTML = data[z][2][i][4];
            pdes.className = "textDescripcionClass";
            a.appendChild(img);
            a.appendChild(p);
            div.appendChild(a);
            div.appendChild(pdes);
            hub.appendChild(div);
        }
    }
    closeNav();
}

function buildPersonalizedShowMenu(data) {
    var hub = document.getElementById('hub');
    while (hub.firstChild) {
        hub.removeChild(hub.firstChild);
    }
    for (var z = 0; z < data.length; z++) {
        var h2 = document.createElement("H2");
        if (data[z]["llave"] === "") {
            h2.className = "hub-row";
        } else {
            h2.className = "hub-rowBorder";
            h2.style.borderBottomColor = imageByCompanie[3];
        }
        h2.innerHTML = data[z]["llave"];
        hub.appendChild(h2);
        data[z]["ContenedoresPersonalizados"].forEach(function (item) {
            for (var i = 0; i < item.length; i++) {
                var div = document.createElement("div");
                div.setAttribute("Opener", item[i]["accion"]);
                div.className = "container-view";
                div.setAttribute("onclick", "Opener(this);return false;");
                var a = document.createElement("div");
                a.className = "iconoText";
                var img = document.createElement("img");
                img.src = "img/Iconos/" + typeIcon + "/" + item[i]["nombreIcono"] + ".png";
                var p = document.createElement("p");
                p.className = "tituloClass";
                p.innerHTML = item[i]["nombre"];
                var pdes = document.createElement("p");
                pdes.className = "textDescripcionClass";
                pdes.innerHTML = item[i]["descripcion"];
                a.appendChild(img);
                a.appendChild(p);
                div.appendChild(a);
                div.appendChild(pdes);
                hub.appendChild(div);
            }
        });
    }
    //Change Icon Back

    closeNav();
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px"; // was 250px
    //document.getElementById("hub").style.marginLeft = "21%"; // was 21%
    //document.getElementById("hub").style.width = "80%"; //was 80%

    //document.getElementById("container").style.marginLeft = "250px";
    //document.getElementById("container").style.marginLeft = "250px";

    //document.getElementById("MP").style.visibility = "hidden";
    if ($('#container').children().length > 0) {
        // do something
    } else {
        document.getElementById('hub').style.display = 'block';
    }
    //  document.getElementById("closeWindow").style.visibility = "hidden";
    //document.getElementById('top').style.display = 'none';
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
    //document.getElementById("hub").style.marginLeft = "0";
    //document.getElementById("hub").style.width = "100%";
    //document.getElementById("container").style.marginLeft = "0";
    //  document.getElementById("MP").style.visibility = "visible";
    //document.getElementById('top').style.display = 'block';
    document.getElementById("mySidenav").style.width = "0px";
}

function closeSideMenu() {
    clearfastMenu();
    closeNav();
}

function clearfastMenu() {
    var numberSelected = $('.fastMenu > a').length;
    if (numberSelected === 6) {
        $('.fastMenu > a:nth-child(n+5)').remove();
        level = [];
        desplegarHubInicio();
    }
}

function setfastMenuHome() {
    $('.fastMenu > a:nth-child(n+5)').remove();
    level = [];
    document.getElementById('hub').style.display = 'block';
    document.getElementById("closeWindow").style.visibility = "hidden";
    clearWindows();
    desplegarHubInicio();
}

function closeWindow() {
    if ($(".sub-menu .activeDirect").length > 0) {
        $('.accesDirect').removeClass('activeDirect');
        $('.sub-sidebar-brand').removeClass('active');
        setfastMenuHome();
    }
    else if (document.getElementById("selectorSearchTool")) {
        $("#selectorSearchTool").remove();
        document.getElementById("mainContent").style.display = "block";
    } else if (document.getElementById("Buscar")) {
        if ($('#Buscar').css('display') == 'none') {
            closeWithClear();
            level.pop()
        } else {
            $("#Buscar").find("#btncancelar").click();
        }
    }
    else {
        closeWithClear();
    }
}

function closeWithClear() {
    $('.fastMenu > a:nth-last-child(1)').remove();
    $('.fastMenu > a:nth-last-child(1)').remove();
    document.getElementById('hub').style.display = 'block';
    document.getElementById("closeWindow").style.visibility = "hidden";
    clearWindows();
}

function clearWindows() {
    excludeFilesToOperate();
    $("#container").empty();
}

function Opener(e) {
    var p = e.querySelector("p[class='tituloClass']");
    if (level[0].includes("S:")) {
        level.splice(1, level.length);
    }
    if (level.length === 1) {
        if (typeof level[1] === 'undefined') {
            level.push(p.textContent);
        }
        else {
            level[1] = p.textContent;
        }
    } else {
        if (typeof level[2] === 'undefined') {
            //if (level[1] === p.textContent) {
            //const index = level.indexOf(level[1]);
            //if (index > -1) {
            //    level.splice(index, 1);
            //}
            //}
            level.push(p.textContent);
        }
        else {
            level[2] = p.textContent;
        }
    }
    createLevels(level);
    closeNav();
    document.getElementById("closeWindow").style.visibility = "visible";
    document.getElementById("hub").style.display = "none";
    var composer = $("#container");
    composer.data("opener", e.getAttribute("opener"));
    displayWindow();
    startCustomTools();

    changeIconByWindow();
}

function changeIconByWindow() {
    $(".imgBoton").each(function () {
        var sourceImage = $(this).attr('src');
        var n = sourceImage.lastIndexOf('/');
        var result = sourceImage.substring(n + 1);
        var createSource = "img/Iconos/";
        createSource += typeIcon;
        createSource += "/" + result;
        $(this).attr("src", createSource);
    });
}

function changeIconByCmp(src) {
    var sourceImage = src;
    var n = sourceImage.lastIndexOf('/');
    var result = sourceImage.substring(n + 1);
    var createSource = "img/Iconos/";
    createSource += typeIcon;
    createSource += "/" + result;
    return createSource;
}

function changeCompanie() {
    lasUserConfigs = getConfigs();
    getCompanies();
    displayCompanies(false);
}

function displayCompanies(defaultCompanie) {

    var displayNameCompanie = imageByCompanie[5];
    if (displayNameCompanie === "true") {
        $('#nameCompany').show();
        $("#nameUser").css("padding-top", "10px");
    } else {
        $('#nameCompany').hide();
        $("#nameUser").css("padding-top", "0px");
    }

    defaultCompanie = typeof defaultCompanie !== 'undefined' ? defaultCompanie : true;
    if (!defaultCompanie) {
        openModal();
        return;
    }
    if (localStorage.getItem("RazonSocial") === null) {
        var companie = getCompanies();
        if (companie) {
            if (lasUserConfigs != null) {
                setCompanie(true, lasUserConfigs.RazonSocial);
            }
            else {
                openModal();
            }
        } else {
            setCompanie(true);
        }
    } else {
        var rz = JSON.parse(localStorage.getItem("RazonSocial"));
        document.getElementById('nameCompany').innerHTML = "" + rz['nombreRazon'];
        buildMenu();
        //Call service Last-Log
        setLastConfigByUSer();
    }
}

function createLevels(levels) {
    $('.fastMenu > a:nth-child(n+5)').remove();
    levels.forEach(setLevels);
    setConfigColor();
}

function setLevels(item, index) {
    var iconLevel = document.createElement("a");
    iconLevel.className = "iconNextLevel";
    $('.fastMenu').append(iconLevel);
    var nameLevel = document.createElement("a");
    nameLevel.className = "level";
    if (item.includes(":")) {
        var itemEl = item.split(":");
        nameLevel.innerHTML = itemEl[1].toString();
        $('.fastMenu').append(nameLevel);
    } else {
        nameLevel.innerHTML = item.toString();
        $('.fastMenu').append(nameLevel);
    }
}

function openModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    //var span = document.getElementsByClassName("close")[0];
    //span.onclick = function () {
    //    modal.style.display = "none";
    //}
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function displayWindow() {
    definirIdioma(idiomaSelecionado);
    var obj = JSON.parse($("#container").data("opener"));
    if (obj) {
        query = obj.tipoCaptura + "|" + obj.IdScreen;
        value = query.split('|');
        $("#container").removeClass("size-2 size-4 size-6 size-8 size-10");
        if (obj.size) {
            $("#container").addClass("size-" + obj.size);
        } else {
            $("#container").addClass("size-10");
        }
        var tyCapture = value[0];
        var clave = value[1];
        if (tyCapture === "1" || tyCapture === "5") {
            url = route + "/api/ConfiguracionCapturas/SearchByKey";
        } else if (tyCapture === "2") {
            url = route + "/api/ConfiguracionCapturasProces/SearchByKey";
        }
        if (tyCapture === "1010" || tyCapture === "1111") {
            url = route + "/api/ConfiguracionCapturas/ReadHtml";
            var nameWindow = value[1];
            var uri = window.location.protocol + "//" + window.location.host + window.location.pathname;
            uri = uri.substring(0, uri.lastIndexOf("/") + 1) + nameWindow + ".html";
            var dataToPost = JSON.stringify(uri);
            var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
            if (Mensaje.resultado === null) {
                console.log("Esta pantalla no existe");
            } else {
                var parser = new DOMParser();
                var head = document.getElementsByTagName('head')[0];
                var htmlDoc = parser.parseFromString(Mensaje.resultado, 'text/html');
                var references = htmlDoc.head;
                var list = [];
                for (var i = 0, l = references.childNodes.length; i < l; i++) {
                    var ld = references.childNodes[i];
                    if (ld.className !== null) {
                        if (ld.className === "AD") {
                            var dt = {};
                            var attr = ld.attributes;
                            dt.kind = ld.tagName;
                            if (typeof (attr.type) !== 'undefined') {
                                dt.type = attr.type.nodeValue;
                            }
                            if (typeof (attr.rel) !== 'undefined') {
                                dt.rel = attr.rel.nodeValue;
                            }
                            if (typeof (attr.href) !== 'undefined') {
                                dt.href = attr.href.nodeValue;
                            }
                            if (typeof (attr.src) !== 'undefined') {
                                dt.src = attr.src.nodeValue;
                            }
                            if (typeof (attr.datatheme) !== 'undefined') {
                                dt.datatheme = attr.datatheme.nodeValue;
                            }
                            list.push(dt);
                        }
                    }
                }
            }
            includeFilesToOperate(tyCapture, list);
            var con = htmlDoc.getElementById("mainContent");

            buildStaticModule(con);
        }
        else {
            includeFilesToOperate(1);
            var dataToPost = JSON.stringify(clave);
            var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
            if (Mensaje.resultado === null) {
                alert("No exists window");
            } else {
                buildModule(Mensaje.resultado);
            }
        }
    }
}

function buildModule(configCap) {
    showWait(2);
    if (configCap.tipoDeCaptura === 1 || configCap.tipoDeCaptura === 5) {
        var idiv = ejecutarCapture(configCap);
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

function buildStaticModule(con) {
    var cont = document.getElementById('container');
    cont.appendChild(con);
    cambiarIdiomaPantallas(cont);
}

function excludeFilesToOperate() {
    var con = document.getElementById("container");
    var tyCapture = null;
    if (con) {
        var getDat = $("#container").data("opener");
        var obj = "";
        if (getDat) {
            var obj = JSON.parse(getDat);
        }
        if (obj) {
            query = obj.tipoCaptura + "|" + obj.IdScreen;
            value = query.split('|');
            tyCapture = value[0];
        }
        var head = document.getElementsByTagName('head')[0];
        var getFiles = getListFilesToOperate(tyCapture);
        if (getFiles != null) {
            for (var i = 0; i < getFiles.length; i++) {
                var elem = document.getElementById("sfr" + i);
                if (elem) {
                    elem.parentNode.removeChild(elem);
                }
            }
        }
        $("head").children('[id*="sfr"]').each(function () {
            if (this.nodeName === "LINK") {
                $("#" + this.id).attr({ "href": "" });
                dels = true;
            }
            else if (this.nodeName === "SCRIPT") {
                $("#" + this.id).attr({ "src": "" });
                dels = true;
            }
            this.remove();
        });
    }
}

function includeFilesToOperate(tipeCapture, list) {
    var getFiles = null;
    var head = document.getElementsByTagName('head')[0];
    //var con = document.getElementById("main");
    if (tipeCapture === "1010" || tipeCapture === "1111") {
        getFiles = list;
    } else {
        getFiles = getListFilesToOperate('1');
    }
    for (var i = 0; i < getFiles.length; i++) {
        var file;
        if (getFiles[i]['kind'] !== undefined) {
            file = document.createElement(getFiles[i]['kind']);
            file.setAttribute("id", "sfr" + i);
        } if (getFiles[i]['type'] !== undefined) {
            file.type = getFiles[i]['type'];
            file.setAttribute("type", getFiles[i]['type']);
        } if (getFiles[i]['rel'] !== undefined) {
            file.rel = getFiles[i]['rel'];
        } if (getFiles[i]['href'] !== undefined) {
            file.href = getFiles[i]['href'];
        } if (getFiles[i]['src'] !== undefined) {
            file.src = getFiles[i]['src'];
        } if (getFiles[i]['datatheme'] !== undefined) {
            file.setAttribute("data-theme", getFiles[i]['datatheme']);
        }

        //con.appendChild(file);
        head.append(file);
    }
}

function getListFilesToOperate(tipeCapture) {
    var list = null;
    if (tipeCapture === '1') {
        list = [
    //{ kind: 'link', rel: 'stylesheet', type: 'text/css', href: "css/stylepreview.css" },
    { kind: 'link', rel: 'stylesheet', type: 'text/css', href: "Content/dx.common.css" },
    { kind: 'link', rel: 'dx-theme', datatheme: 'generic.light', href: "Content/dx.light.css" },
        ];
    }
    return list;
}

function cambiarIdiomaPantallas(forma) {
    //sessionStorage.setItem('idioma', idioma);
    //idiomaSelecionado = cargarArchivoIdioma(idioma);
    var cont = forma.querySelectorAll('[idetiqueta]');
    for (var i = 0; i < cont.length; i++) {
        cont[i].innerHTML = idiomaSelecionado.messageFormatter(cont[i].getAttribute("idEtiqueta"))();
    }
}