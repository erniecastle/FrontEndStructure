/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */
var route = "";

jQuery(document).ready(function () {
    setMainLogo();
    getInfoUser();
});

function getInfoUser() {
    var url = route + "/api/Usuario/getUser";
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false, false);
    if (Mensaje.resultado !== null) {
        var user = Mensaje.resultado;
        //sessionStorage.setItem('keyUser', user["id"]);
        document.getElementById('nameUser').innerHTML = "" + user["nombre"];
        sessionStorage.setItem('idioma', user["idioma"]===1 ? "es" : "en");
        loadLanguage();
    } else {

    }
}

function setMainLogo() {
    var imageByCompanie = localStorage.getItem('imageByCompanie');
    imageByCompanie = imageByCompanie.toString().split(",");
    var imgMainLogo = "data:image/png;base64," + imageByCompanie[0];
    var imgMainBanner = "data:image/png;base64," + imageByCompanie[1];
    var typeToDisplay = imageByCompanie[2];
    if (typeToDisplay === "0" || typeToDisplay === "1") {
        $('#imgMainLogo').attr("src", imgMainBanner);
        $('#imgMainLogo').css('max-width', '270px');
        $('#imgMainLogo').css('max-height', '80px');
    }
    else if (typeToDisplay === "0" || typeToDisplay === "2") {
        $('#imgMainLogo').attr("src", imgMainLogo);
        $('#imgMainLogo').css('max-width', '270px');
        $('#imgMainLogo').css('max-height', '80px');
    }

}