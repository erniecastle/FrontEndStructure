/*!
 * Copyright 2019 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 */

function defaultValues(async, cache, data, typeWait, callMethod) {

    var obj = {
        asyncF: async,
        cacheF: cache,
        dataF: data,
        typeWaitF: typeWait,
        callMethod: callMethod
    };

    if (typeof async === "undefined" || async === undefined || async === null) {
        obj.asyncF = true;
    }
    if (typeof cache === "undefined" || cache === undefined || cache === null) {
        obj.cacheF = false;
    }
    if (typeof data === "undefined" || data === undefined || data === null) {
        obj.dataF = "{}";
    }
    if (typeof typeWait === "undefined" || typeWait === undefined || typeWait === null) {
        obj.typeWaitF = undefined;
    } else {
        showWait(typeWait);
    }
    if (typeof callMethod === "undefined" || callMethod === undefined || callMethod === null) {
        obj.callMethod = undefined;
    }

    return obj;
}

var Common = {

    //Default Sender For Aut JSON Request
    sendAutRequestJson: function (httpMethod, url, data, typeWait, async, cache) {
        var dv = defaultValues(async, cache, data, typeWait);
        var contType = 'application/x-www-form-urlencoded; charset=UTF-8';
        var dataType = 'json';
        return Common.sendRequest(1, httpMethod, url, dv.dataF, contType, dataType, dv.typeWaitF, dv.asyncF, true, true, false);
    },

    //Default Sender For JSON Request
    sendRequestJson: function (httpMethod, url, data, typeWait, async, cache) {
        var dv = defaultValues(async, cache, data, typeWait);
        var contType = 'application/json';
        var dataType = 'json';
        return Common.sendRequest(2, httpMethod, url, dv.dataF, contType, dataType, dv.typeWaitF, dv.asyncF, dv.cacheF, true, true);
    },

    //Default Sender For JSON Request With Functions
    sendRequestJsonWithFunction: function (httpMethod, url, data, typeWait, async, cache, callMethod) {
        var dv = defaultValues(async, cache, data, typeWait, callMethod);
        var contType = 'application/json';
        var dataType = 'json';
        return Common.sendRequest(2, httpMethod, url, dv.dataF, contType, dataType, dv.typeWaitF, dv.asyncF, dv.cacheF, true, true, dv.callMethod);
    },

    //Default Sender For Local files JSON Request
    sendLocalFileRequestJson: function (httpMethod, url, data, typeWait, async, cache) {
        var dv = defaultValues(async, cache, data, typeWait);
        var contType = 'application/json';
        var dataType = 'json';
        return Common.sendRequest(3, httpMethod, url, dv.dataF, contType, dataType, dv.typeWaitF, dv.asyncF, dv.cacheF, true, true);
    },

    //Generic sender any type of content
    sendRequest: function (typeServer, httpMethod, url, data, contType, dataType, typeWait, async, cache, crossDomain, withCredentials, callMethod) {
        var Mensaje = new Object();
        Mensaje.error = "";
        Mensaje.noError = "";
        Mensaje.resultado = 0;
        interceptor();
        var uri = "";
        if (typeServer == 1) {
            uri = uriAut + url;
        } else if (typeServer == 2) {
            uri = uriApi + url;
        } else if (typeServer == 3) {
            uri = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
            uri += url;
        }
        var ajaxObj = $.ajax({
            type: httpMethod.toUpperCase(),
            url: uri,
            data: data,
            contentType: contType,
            dataType: dataType,
            async: async,
            cache: cache,
            //beforeSend: function (request) {
            //    if (typeServer !== 1) {
            //        request.setRequestHeader("Authorization", getCookieAuth());
            //    }
            //},
            xhrFields: {
                withCredentials: withCredentials
            },
            crossDomain: crossDomain,
            success: function (result) {
                Mensaje = result;
                if (Mensaje.noError != null) {
                    if (Mensaje.noError == 55555) {
                        //  redirectToLogin();
                    }
                }
                if (callMethod !== undefined) {
                    callCustomMethod['customFunction'](callMethod, Mensaje);
                }
                return Mensaje;
            },
            error: function (err, type, httpStatus) {
                Mensaje = Common.AjaxFailureCallback(err, type, httpStatus);
            },
            complete: function () {
                Common.CompleteAction(typeWait);
            }
        });

        if (Mensaje.noError == 55555) {
            redirectToLogin();
            sessionStorage.clear();
        }

        return Mensaje;
        //return ajaxObj;
    },

    DisplaySuccess: function (message) {
        Common.ShowSuccessSavedMessage(message);
    },

    DisplayError: function (error) {
        Common.ShowFailSavedMessage(message);
    },

    AjaxFailureCallback: function (err, type, httpStatus) {
        var Mensaje = new Object();
        Mensaje.error = err.responseText;
        Mensaje.noError = err.status;
        Mensaje.resultado = null;
        var failureMessage = 'Error occurred in ajax call' + err.status + " - " + err.responseText + " - " + httpStatus;
        console.log(failureMessage);
        if (err.status === 401) {
            alert("Su session ha caducado");//Refresh token
            exit();
        }
        return Mensaje;
    },

    CompleteAction: function (typeWait) {
        if (typeof typeWait !== "undefined") {
            removeWait();
        }
    },

    SuccessAction: function (Mensaje) {
        if (typeof Mensaje !== "undefined") {
            return Mensaje;
        }
    },

    ShowFailSavedMessage: function (messageText) {

    }
}

var callCustomMethod = {
    customFunction: function (nameFunction, args) {
        return executeFunctionByName(nameFunction, window, args);
    }
};

function executeFunctionByName(functionName, context, args) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }

    if (typeof context[func] === 'function') {
        return context[func].apply(context, args);
    } else {
        return null;
    }
}

// typeWaits 1.- loadingNext.gif 2.- loadingWait.gif
function showWait(typeImage) {
    var imageWait = "";
    if (typeImage === 1) {
        imageWait = 'img/iconos/loading1.gif';
    } else if (typeImage === 2) {
        imageWait = 'img/iconos/loading1.gif';
    } else if (typeImage === 3) {
        imageWait = 'img/iconos/loading3.gif';
    } else if (typeImage === 4) {
        imageWait = 'img/iconos/loading4.gif';
    }
    var div = document.createElement('div');
    div.setAttribute("id", "loadingWait");
    //var img = document.createElement('img');
    //img.src = imageWait;
    ///div.style.cssText = 'position: fixed; top: 50%; left: 50%; z-index: 5000;\n\
    //               -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);';
    div.appendChild(constLoad());
    //var container = document.getElementById("container");
    //container.appendChild(div);
    document.body.appendChild(div);
}

function removeWait() {
    if (document.getElementById("loadingWait")) {
        document.getElementById("loadingWait").remove();
    }
}

function exit() {
    out();
    redirectToLogin();
    localStorage.clear();
    sessionStorage.clear();
}

function redirectToLogin() {
    var uri = window.location.protocol + "//" + window.location.host + window.location.pathname;
    uri = uri.substring(0, uri.lastIndexOf("/") + 1) + "login.html";
    window.location.href = uri;
    localStorage.clear();
}

function out() {
    deletecookie("eochair");
    var data = new Object();
    data.client_id = "a588355f7bea42d19ea65b74fcf7fd5a";
    data.keyPortal = sessionStorage.getItem('keyPortal');
    data.out = "-1";
    var url = route + "/oauth2/token";
    var Mensaje = Common.sendAutRequestJson('POST', url, data, 1, false, null);
    console.log(Mensaje);
}

function interceptor() {
    var accesData = getCookie('eochair');
    if (accesData !== "") {
        var getTk = decodeJwt(getCookie('eochair'));
        var getPortal = sessionStorage.getItem('keyPortal');
        if (getPortal != null) {
            if (getTk.payload.keyPortal !== getPortal) {
                deletecookie("eochair");
                redirectToLogin();
                return;
            }
        }
    }
}

function getDomain() {
    var i = 0, domain = document.domain, p = domain.split('.'), s = '_gd' + (new Date()).getTime();
    while (i < (p.length - 1) && document.cookie.indexOf(s + '=' + s) == -1) {
        domain = p.slice(-1 - (++i)).join('.');
        document.cookie = s + "=" + s + ";domain=" + domain + ";";
    }
    document.cookie = s + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + domain + ";";
    return domain;
}

function decodeJwt(t) {
    let token = {};
    token.raw = t;
    token.header = JSON.parse(window.atob(t.split('.')[0]));
    token.payload = JSON.parse(window.atob(t.split('.')[1]));
    return (token)
}

//function getCookieAuth() {
//    var getAuth = getCookie('eochair');
//    if (getAuth !== "") {
//        getAuth = "Bearer " + getCookie('eochair');
//    }
//    return getAuth;
//}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setcookie(name, value) {
    var expires = "";
    var domainName = getDomain();
    document.cookie = name + "=" + value + expires + ";domain=" + domainName + ";path=/";
}

function deletecookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    var domainName = getDomain();
    document.cookie = name + "=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=" + domainName;
}

function getGlobalVars(keyNames) {
    var data = JSON.stringify(keyNames);
    var url = route + "/api/Usuario/getGlobalVariables";
    var Mensaje = Common.sendRequestJson('POST', url, data, 1, false, null);
    return Mensaje.resultado;
}


function getRazonSocial() {
    var razon = localStorage.getItem("RazonSocial");
    razon = JSON.parse(razon);
    return razon;
}

function constLoad() {
    var configload = null;
    var imageByCompanieTools = localStorage.getItem('imageByCompanie');
    if (imageByCompanieTools !== undefined && imageByCompanieTools !== null) {
        imageByCompanieTools = imageByCompanieTools.toString().split(",");
        if (imageByCompanieTools.length > 7) {
            configload = JSON.parse(imageByCompanieTools[6] + "," + imageByCompanieTools[7] + "," + imageByCompanieTools[8] + "," + imageByCompanieTools[9]);
        }
    }
    var divPrincipal = document.createElement('div');
    divPrincipal.className = "overlay-wrapper overlay-modal overlay-shader loadpanel-wrapper";
    if (configload !== null) {
        if (configload.quitarFondo) {
            divPrincipal.style.cssText = 'background:transparent; z-index: 1501; position: fixed; left: 0px; top: 0px; transform: translate(0px, 0px); transition: all 0s ease 0s;';
        } else {
            divPrincipal.style.cssText = 'z-index: 1501; position: fixed; left: 0px; top: 0px; transform: translate(0px, 0px); transition: all 0s ease 0s;';
        }
    } else {
        divPrincipal.style.cssText = 'z-index: 1501; position: fixed; left: 0px; top: 0px; transform: translate(0px, 0px); transition: all 0s ease 0s;';
    }

    var subDiv = document.createElement('div');
    subDiv.className = "overlay-content resizable loadpanel-content";
    if (configload !== null) {
        if (configload.quitarPanel) {
            subDiv.style.cssText = 'background:transparent;border: 0px; box-shadow: 0 0px 0px rgba(0,0,0,0);width: 222px; height: 90px; z-index: 1501; margin: 0px; left: 0px; top: 0px; transform: translate(550px, 300px); transition: all 0s ease 0s;';
        } else {
            subDiv.style.cssText = 'width: 222px; height: 90px; z-index: 1501; margin: 0px; left: 0px; top: 0px; transform: translate(550px, 300px); transition: all 0s ease 0s;';
        }
    } else {
        subDiv.style.cssText = 'width: 222px; height: 90px; z-index: 1501; margin: 0px; left: 0px; top: 0px; transform: translate(550px, 300px); transition: all 0s ease 0s;';
    }


    var loadpanelcont = document.createElement('div');
    loadpanelcont.className = "loadpanel-content-wrapper";

    var loadpanelindicator = document.createElement('div');
    loadpanelindicator.className = "loadpanel-indicator loadindicator widget";
    if (configload !== null) {
        if (configload.quitarIndicador) {
            loadpanelindicator.style.display = "ruby-base";
        }


    }

    var loadindicatorwrapper = document.createElement('div');
    loadindicatorwrapper.className = "loadindicator-wrapper";
    if (configload !== null) {
        if (configload.quitarIndicador) {
            loadindicatorwrapper.style.display = "none";
        }

    }
    var loadindicatorcontent = document.createElement('div');
    loadindicatorcontent.className = "loadindicator-content";

    var loadindicatoricon = document.createElement('div');
    loadindicatoricon.className = "loadindicator-icon";

    var segment7 = document.createElement('div');
    segment7.className = "loadindicator-segment loadindicator-segment7";
    if (imageByCompanieTools !== undefined && imageByCompanieTools !== null) {
        if (configload !== null) {
            segment7.style.cssText = 'width:' + configload.anchoAni + ';background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        } else {
            segment7.style.cssText = 'background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        }
    }
    var segment6 = document.createElement('div');
    segment6.className = "loadindicator-segment loadindicator-segment6";
    if (imageByCompanieTools !== undefined && imageByCompanieTools !== null) {
        if (configload !== null) {
            segment6.style.cssText = 'width:' + configload.anchoAni + ';background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        } else {
            segment6.style.cssText = 'background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        }
    }
    var segment5 = document.createElement('div');
    segment5.className = "loadindicator-segment loadindicator-segment5";
    if (imageByCompanieTools !== undefined && imageByCompanieTools !== null) {
        if (configload !== null) {
            segment5.style.cssText = 'width:' + configload.anchoAni + ';background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        } else {
            segment5.style.cssText = 'background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        }
    }
    var segment4 = document.createElement('div');
    segment4.className = "loadindicator-segment loadindicator-segment4";
    if (imageByCompanieTools !== undefined && imageByCompanieTools !== null) {
        if (configload !== null) {
            segment4.style.cssText = 'width:' + configload.anchoAni + ';background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        } else {
            segment4.style.cssText = 'background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        }
    }
    var segment3 = document.createElement('div');
    segment3.className = "loadindicator-segment loadindicator-segment3";
    if (imageByCompanieTools !== undefined && imageByCompanieTools !== null) {
        if (configload !== null) {
            segment3.style.cssText = 'width:' + configload.anchoAni + ';background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        } else {
            segment3.style.cssText = 'background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        }
    }
    var segment2 = document.createElement('div');
    segment2.className = "loadindicator-segment loadindicator-segment2";
    if (imageByCompanieTools !== undefined && imageByCompanieTools !== null) {
        if (configload !== null) {
            segment2.style.cssText = 'width:' + configload.anchoAni + ';background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        } else {
            segment2.style.cssText = 'background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        }
    }
    var segment1 = document.createElement('div');
    segment1.className = "loadindicator-segment loadindicator-segment1";
    if (imageByCompanieTools !== undefined && imageByCompanieTools !== null) {
        if (configload !== null) {
            segment1.style.cssText = 'width:' + configload.anchoAni + ';background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        } else {
            segment1.style.cssText = 'background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        }
    }
    var segment0 = document.createElement('div');
    segment0.className = "loadindicator-segment loadindicator-segment0";
    if (imageByCompanieTools !== undefined && imageByCompanieTools !== null) {
        if (configload !== null) {
            segment0.style.cssText = 'width:' + configload.anchoAni + ';background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        } else {
            segment0.style.cssText = 'background:' + imageByCompanieTools[3] + ';-webkit-box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';box-shadow: 0 0 1px' + imageByCompanieTools[3] + ';';
        }
    }

    loadindicatoricon.appendChild(segment7);
    loadindicatoricon.appendChild(segment6);
    loadindicatoricon.appendChild(segment5);
    loadindicatoricon.appendChild(segment4);
    loadindicatoricon.appendChild(segment3);
    loadindicatoricon.appendChild(segment2);
    loadindicatoricon.appendChild(segment1);
    loadindicatoricon.appendChild(segment0);

    var loadpanelmessage = document.createElement('div');
    loadpanelmessage.className = "loadpanel-message";
    loadpanelmessage.innerHTML = "Espere...";

    loadindicatorwrapper.appendChild(loadindicatoricon);
    loadindicatorwrapper.appendChild(loadindicatorcontent);
    loadpanelindicator.appendChild(loadindicatorwrapper);
    loadpanelcont.appendChild(loadpanelindicator);
    subDiv.appendChild(loadpanelcont);
    subDiv.appendChild(loadpanelmessage);
    divPrincipal.appendChild(subDiv);
    return divPrincipal;
}