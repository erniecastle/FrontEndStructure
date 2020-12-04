/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */
var route = "";

jQuery(document).ready(function () {
    verifyUs();
    // initDefault();
 
});

function initDefault() {
    document.getElementById("text1").value = "sistemas";
    document.getElementById("text2").value = "12345";
    document.getElementById("btnLoggin").click();
}

function verifyUs() {
    setConfig();
    var url = route + "/api/Usuario/verifySession";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, 1, false, false);
    if (Mensaje.resultado !== null) {
        if (Mensaje.resultado == true) {
            succesLogin();
        } else {
            submit();
            document.getElementById("cld").style.display = "block";
        }
    }
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function setConfig() {
    var hostname = window.location.hostname;
    var url = window.location.search;
    if (hostname === "localhost") {
        if (url.match("portal") !== null) {
            var getCompany = getParameterByName("portal");
            hostname = getCompany;
        }
    }

    var url = route + "/api/Portales/getPortalesByHost";
    var dataToPost = JSON.stringify(hostname);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 1, false, false);
    if (Mensaje.resultado !== null) {
        var propHost = Mensaje.resultado;
        document.getElementById('lgTextoBienvenida').innerHTML = propHost["textoBienvenida"];
        document.getElementById('main').style.background = "url('data:image/png;base64," + propHost.imgFondo + "')";
        document.getElementById('main').style.backgroundRepeat = "no-repeat";
        document.getElementById("main").style.backgroundSize = "cover";
        document.getElementById("main").style.backgroundPosition = "center";

        if (propHost["isBannerCorpo"]) {
            document.getElementById("imageIcon").src = "data:image/png;base64," + propHost.imgBanner;
        }

        document.getElementById("contentLogin").style.cssFloat = propHost.postLogin === 1
            ? "Left" : propHost.postLogin === 3 ? "Right" : "";

        sessionStorage.setItem('keyPortal', propHost["clave"]);
        var imageByCompanie = [propHost["imgLogo"], propHost["imgBanner"], propHost["imgBannerLogo"], propHost["colorFondo"], propHost["colorFuente"], propHost["isNombreCorpo"], propHost["configLoader"]];
        localStorage.setItem('imageByCompanie', imageByCompanie);
        document.getElementById('titleAvs').innerHTML = propHost.avisos[0]["titulo"];
        document.getElementById('messageAvs').innerHTML = propHost.avisos[0]["mensaje"];
    }
    if (Mensaje.noError !== 0) {
        sessionStorage.clear();
    }
}

function submit() {
    $("#form1").submit(function () {
        var data = new Object();
        data.client_id = "a588355f7bea42d19ea65b74fcf7fd5a";
        data.keyPortal = sessionStorage.getItem('keyPortal');
        data.username = document.getElementById('text1').value;
        data.password = document.getElementById('text2').value;
        data.grant_type = "password";
        var url = route + "/oauth2/token";
        var Mensaje = Common.sendAutRequestJson('POST', url, data, 1, false, null);
        if (Mensaje.noError == "400") {
            alert("Usuario invalido");
        } else if (Mensaje.access_token !== undefined && Mensaje.access_token !== null) {
            setcookie("eochair", Mensaje.access_token);
            succesLogin();
        }
    });
}

function succesLogin() {
    var uri = window.location.protocol + "//" + window.location.host + window.location.pathname;
    uri = uri.substring(0, uri.lastIndexOf("/") + 1) + "main.html";
    window.location.href = uri;
}
