/*!
 * Copyright 2019 Inc.
 * Author: Ernesto Castillo
 * Brief: Class for utils and common functions
 */

function getFechaSistema() {
    var url = route + "/api/Generic/getFechaSistema";
    var dateSystem = Common.sendRequestJson('POST', url, undefined, undefined, false);
    var date = new Date(dateSystem);
    return date;
}

function generaClaveMax(claveMax, mascara) {
    var genClaveMax = parseInt(claveMax);
    genClaveMax = genClaveMax + 1;
    return genClaveMax;
}

function calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    // var ampm = hours >= 12 ? 'pm' : 'am';
    //hours = hours % 12;
    //hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes;
    return strTime;
}

function formatDate(date) {
    var hoy = date;
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();

    dd = addZero(dd);
    mm = addZero(mm);
    //console.log(yyyy + '-' + mm + '-' + dd);
    return yyyy + '-' + mm + '-' + dd;
}

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

function formatDatemmddyyy(date) {
    var hoy = date;
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();

    dd = addZero(dd);
    mm = addZero(mm);
    //console.log(yyyy + '-' + mm + '-' + dd);
    return dd + '/' + mm + '/' + yyyy;
}

function formatDateddmmyyy(date) {
    var hoy = date;
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();

    dd = addZero(dd);
    mm = addZero(mm);
    //console.log(yyyy + '-' + mm + '-' + dd);
    return mm + '/' + dd + '/' + yyyy;
}

function formantDdMmYyyy(valor) {
    var valores = valor.split('-');
    var yyyy = valores[0];
    var mm = valores[1];
    var dd = valores[2];
    return mm + '/' + dd + '/' + yyyy;
}

function formantMmDDYyyy(valor) {
    var valores = valor.split('/');
    var yyyy = valores[2];
    var mm = valores[0];
    var dd = valores[1];
    return mm + '/' + dd + '/' + yyyy;
}

function isEmpty(str) {
    return (!str || 0 === str.length || str === null);
}


function importe_format(importe, decimals,Simbol) {

    importe += ''; // por si pasan un numero en vez de un string
    importe = parseFloat(importe.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

    decimals = decimals || 0; // por si la variable no fue fue pasada

    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(importe) || importe === 0)
        return parseFloat(0).toFixed(decimals);

    // si es mayor o menor que cero retorno el valor formateado como numero
    importe = '' + importe.toFixed(decimals);

    var importe_parts = importe.split('.'),
        regexp = /(\d+)(\d{3})/;

    while (regexp.test(importe_parts[0]))
        importe_parts[0] = importe_parts[0].replace(regexp, '$1' + ',' + '$2');
    if (Simbol !== null) {
        return Simbol + importe_parts.join('.');
    } 
    return importe_parts.join('.');
}

function quitarFormatImporte(valor) {
    valor = valor.replace("$", "");
    valor = valor.replace(",", "");

    return valor;
}