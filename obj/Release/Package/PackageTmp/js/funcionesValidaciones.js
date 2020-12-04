var nombreTablaBDs = "";
var nombreCamposLlaveBDs;
var classEntidad;
var filtrarEntidadPorRazonSocial = false;
var camposWhere = new Array();
var componentesFiltroWhere = new Array();
var componentesLlave = new Array();



function ejecutarGeneraClave() {


}

function generaClaveMax(nombreTablaBDs, campo) {
    return generaClave(nombreTablaBDs, campo, classEntidad, filtrarEntidadPorRazonSocial, camposWhere, componentesFiltroWhere);
}

function generaClave(nombreTablaBDs, campo, classEntidad, filtrarEntidadPorRazonSocial, camposWhere, componentesFiltroWhere) {
    claveMax = "";


    return claveMax;
}

function construyeMascara(campo, valor) {
    var dato = "";
    var obj = {};

    var configMascara = obtenerMascara(nombreTablaBDs + campo);

    if (valor !== undefined && configMascara !== undefined) {
        if (valor !== "" && configMascara.activaMascara) {

            if (valor.toString().length < configMascara.mascara.length) {
                obj.valor = parseInt(valor);
                var sub = configMascara.mascara.substring(0, configMascara.mascara.length - valor.toString().length);
                sub = sub.replace(/#/g, '0');
                //console.log(sub);
                var mascaraFin = sub + configMascara.mascara.substring(configMascara.mascara.length - valor.toString().length, configMascara.mascara.length);
                // console.log(mascara);

                obj.mascara = mascaraFin;

                var url = route + "/api/ConfigMascara/txtFormatearMask";
                var dataToPost = JSON.stringify(obj);
                var Mensaje = Common.sendRequestJson('POST', url, dataToPost, 2, false);

                if (Mensaje !== "") {
                    dato = Mensaje;
                    //    key = Mensaje.resultado;
                    //    if (key === "") {
                    //        key = 1;
                    //    } else {
                    //        key = generaClaveMax(key);
                    //    }

                } else {
                    console.log("no hay datos");
                }
            } else {
                dato = valor;
            }
            //console.log(dato);
            return dato;
        }
    }

    // console.log(mascara);
}

function obtenerMascara(claveMascara) {
    var url = route + "/api/ConfigMascara/getConfigMascaraPorClave";
    var dataToPost = JSON.stringify(claveMascara);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No se encontro Mascara para la clave " + claveMascara);
    } else {
        return Mensaje.resultado;
    }
}