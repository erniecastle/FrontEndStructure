var cont;
var configuracionIMSS;
var guardarObjecto;
jQuery(document).ready(function () {
    cont = document.getElementById('capture');
    var fecha = new Date();
    var fechaActual = hoyFecha(fecha);
   // document.getElementById('txt_fechaAplica').value = fechaActual.toString();
    configuracionIMSS = getexiteConfiguracionIMSS(fechaActual);  
    mostrarobject(configuracionIMSS);

});

function hoyFecha(date) {
   // var hoy = date;
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();

    dd = addZero(dd);
    mm = addZero(mm);

    return yyyy + '-' + mm + '-' + dd;
}

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

function getexiteConfiguracionIMSS(fechaActual) {
    var getData;
    var url = route + "/api/getConfiguracionIMSSActual";
    var dataToPost = JSON.stringify(fechaActual);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        getData = Mensaje.resultado;
    }
    return getData
}

function mostrarobject(data) {

    document.getElementById('txt_fechaAplica').value = hoyFecha(new Date(data.fechaAplica));

    //Empleado
    document.getElementById('txt_tasaEspecieEnfermeMater').value = formatearDoubles(data.tasaEspecieEnfermeMater);// data.tasaEspecieEnfermeMater;
    document.getElementById('txt_tasaDineEnfermeMater').value =formatearDoubles(data.tasaDineEnfermeMater);
    document.getElementById('txt_tasaGastosPension').value = formatearDoubles(data.tasaGastosPension);
    document.getElementById('txt_tasaInvalidezVida').value = formatearDoubles(data.tasaInvalidezVida);
    document.getElementById('txt_tasaCesantiaVejez').value = formatearDoubles(data.tasaCesantiaVejez);

    //Patron
    document.getElementById('txt_tasaFijaPatron').value = formatearDoubles(data.tasaFijaPatron);
    document.getElementById('txt_tasaExcedentePatron').value = formatearDoubles(data.tasaExcedentePatron);
    document.getElementById('txt_tasaGastosPensPatron').value = formatearDoubles(data.tasaGastosPensPatron);
    document.getElementById('txt_tasaRiesgosPatron').value = formatearDoubles(data.tasaRiesgosPatron);
    document.getElementById('txt_tasaInvaliVidaPatron').value = formatearDoubles(data.tasaInvaliVidaPatron);
    document.getElementById('txt_tasaGuarderiaPatron').value = formatearDoubles(data.tasaGuarderiaPatron);
    document.getElementById('txt_tasaPrestDinePatron').value = formatearDoubles(data.tasaPrestDinePatron);
    document.getElementById('txt_tasaCesanVejezPatron').value = formatearDoubles(data.tasaCesanVejezPatron);

    //Topes
    document.getElementById('txt_topeRiesgoTrabajoGuarderias').value = formatearDoubles(data.topeRiesgoTrabajoGuarderias);
    document.getElementById('txt_topeInfonavit').value = formatearDoubles(data.topeInfonavit);
    document.getElementById('txt_topeEnfermedadMaternidad').value = formatearDoubles(data.topeEnfermedadMaternidad);
    document.getElementById('txt_topeRetiro').value = formatearDoubles(data.topeRetiro);
    document.getElementById('txt_topeCesanVejezInvaliVida').value = formatearDoubles(data.topeCesanVejezInvaliVida);

    document.getElementById('txt_tasaAportacionRetiroPatron').value = formatearDoubles(data.tasaAportacionRetiroPatron);
    document.getElementById('txt_tasaAportacionInfonavitPatron').value = formatearDoubles(data.tasaAportacionInfonavitPatron);
    document.getElementById('txt_excedenteEspecie').value = formatearDoubles(data.excedenteEspecie); 
    document.getElementById('txt_cuotaFijaPatron').value = formatearDoubles(data.cuotaFijaPatron);
}

function formatearDoubles(numero) {
    return parseFloat(Math.round(numero*100)/100).toFixed(4);
}

function construirObject() {

    if (configuracionIMSS === undefined) {
        configuracionIMSS = {};
    }
    var contador = 0, total = 0;
    guardarObjecto = true;
    if (configuracionIMSS.id === undefined) {

        configuracionIMSS.excedenteEspecie = document.getElementById('txt_excedenteEspecie').value.trim();
        configuracionIMSS.cuotaFijaPatron = document.getElementById('txt_cuotaFijaPatron').value.trim();

        //Empleado
        configuracionIMSS.tasaEspecieEnfermeMater = document.getElementById('txt_tasaEspecieEnfermeMater').value.trim();
        configuracionIMSS.tasaDineEnfermeMater = document.getElementById('txt_tasaDineEnfermeMater').value.trim();
        configuracionIMSS.tasaGastosPension = document.getElementById('txt_tasaGastosPension').value.trim();
        configuracionIMSS.tasaInvalidezVida = document.getElementById('txt_tasaInvalidezVida').value.trim();
        configuracionIMSS.tasaCesantiaVejez = document.getElementById('txt_tasaCesantiaVejez').value.trim();

        //Patron
        configuracionIMSS.tasaFijaPatron = document.getElementById('txt_tasaFijaPatron').value.trim();
        configuracionIMSS.tasaExcedentePatron = document.getElementById('txt_tasaExcedentePatron').value.trim();
        configuracionIMSS.tasaGastosPensPatron = document.getElementById('txt_tasaGastosPensPatron').value.trim();
        configuracionIMSS.tasaRiesgosPatron = document.getElementById('txt_tasaRiesgosPatron').value.trim();
        configuracionIMSS.tasaInvaliVidaPatron = document.getElementById('txt_tasaInvaliVidaPatron').value.trim();
        configuracionIMSS.tasaGuarderiaPatron = document.getElementById('txt_tasaGuarderiaPatron').value.trim();
        configuracionIMSS.tasaPrestDinePatron = document.getElementById('txt_tasaPrestDinePatron').value.trim();
        configuracionIMSS.tasaCesanVejezPatron = document.getElementById('txt_tasaCesanVejezPatron').value.trim();

        //Topes
        configuracionIMSS.topeRiesgoTrabajoGuarderias = document.getElementById('txt_topeRiesgoTrabajoGuarderias').value.trim();
        configuracionIMSS.topeInfonavit = document.getElementById('txt_topeInfonavit').value.trim();
        configuracionIMSS.topeEnfermedadMaternidad = document.getElementById('txt_topeEnfermedadMaternidad').value.trim();
        configuracionIMSS.topeRetiro = document.getElementById('txt_topeRetiro').value.trim();
        configuracionIMSS.topeCesanVejezInvaliVida = document.getElementById('txt_topeCesanVejezInvaliVida').value.trim();

        configuracionIMSS.tasaAportacionRetiroPatron = document.getElementById('txt_tasaAportacionRetiroPatron').value.trim();
        configuracionIMSS.tasaAportacionInfonavitPatron = document.getElementById('txt_tasaAportacionInfonavitPatron').value.trim();

        configuracionIMSS.fechaAplica = document.getElementById('txt_fechaAplica').value;

    } else {

        configuracionIMSS.excedenteEspecie = document.getElementById('txt_excedenteEspecie').value.trim();
        configuracionIMSS.cuotaFijaPatron = document.getElementById('txt_cuotaFijaPatron').value.trim();

        //Empleado
        configuracionIMSS.tasaEspecieEnfermeMater = document.getElementById('txt_tasaEspecieEnfermeMater').value.trim();
        configuracionIMSS.tasaDineEnfermeMater = document.getElementById('txt_tasaDineEnfermeMater').value.trim();
        configuracionIMSS.tasaGastosPension = document.getElementById('txt_tasaGastosPension').value.trim();
        configuracionIMSS.tasaInvalidezVida = document.getElementById('txt_tasaInvalidezVida').value.trim();
        configuracionIMSS.tasaCesantiaVejez = document.getElementById('txt_tasaCesantiaVejez').value.trim();

        //Patron
        configuracionIMSS.tasaFijaPatron = document.getElementById('txt_tasaFijaPatron').value.trim();
        configuracionIMSS.tasaExcedentePatron = document.getElementById('txt_tasaExcedentePatron').value.trim();
        configuracionIMSS.tasaGastosPensPatron = document.getElementById('txt_tasaGastosPensPatron').value.trim();
        configuracionIMSS.tasaRiesgosPatron = document.getElementById('txt_tasaRiesgosPatron').value.trim();
        configuracionIMSS.tasaInvaliVidaPatron = document.getElementById('txt_tasaInvaliVidaPatron').value.trim();
        configuracionIMSS.tasaGuarderiaPatron = document.getElementById('txt_tasaGuarderiaPatron').value.trim();
        configuracionIMSS.tasaPrestDinePatron = document.getElementById('txt_tasaPrestDinePatron').value.trim();
        configuracionIMSS.tasaCesanVejezPatron = document.getElementById('txt_tasaCesanVejezPatron').value.trim();

        //Topes
        configuracionIMSS.topeRiesgoTrabajoGuarderias = document.getElementById('txt_topeRiesgoTrabajoGuarderias').value.trim();
        configuracionIMSS.topeInfonavit = document.getElementById('txt_topeInfonavit').value.trim();
        configuracionIMSS.topeEnfermedadMaternidad = document.getElementById('txt_topeEnfermedadMaternidad').value.trim();
        configuracionIMSS.topeRetiro = document.getElementById('txt_topeRetiro').value.trim();
        configuracionIMSS.topeCesanVejezInvaliVida = document.getElementById('txt_topeCesanVejezInvaliVida').value.trim();

        configuracionIMSS.tasaAportacionRetiroPatron = document.getElementById('txt_tasaAportacionRetiroPatron').value.trim();
        configuracionIMSS.tasaAportacionInfonavitPatron = document.getElementById('txt_tasaAportacionInfonavitPatron').value.trim();


    }

    return configuracionIMSS;
}

//function saveOrUpdate() {
//    var objConfigIMSS = construirObject();
//    var url;
//    if (objConfigIMSS.id == undefined) {
//        url = route + "/api/saveIMSS";
//    } else {
//        url = route + "/api/updateIMSS";
//    }
//    var obj = {};
//    obj.IMSS = objConfigIMSS;
//    var dataToPost = JSON.stringify(obj);
//    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, null, false);
//    if (Mensaje.resultado === null) {
//        alert("No object");
//    } else {
//        alert("exito");
//    }

//}