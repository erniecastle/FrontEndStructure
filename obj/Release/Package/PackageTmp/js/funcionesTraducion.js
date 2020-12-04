function cargarArchivosGlobalize() {
    var url = '/Resources/likelySubtags.json';
    var Mensaje = new Object();
    Mensaje.error = "";
    Mensaje.noError = "";
    Mensaje.resultado = Common.sendLocalFileRequestJson('GET', url, undefined, undefined, false);
    if (Mensaje.resultado !== null) {
        Globalize.load(Mensaje.resultado);
    }
}

function cargarArchivoIdioma(idioma) {
    var nombreArchivo = "";
    var idiomaSeleciona;
    if (idioma === "es") {
        nombreArchivo = "Idioma-" + idioma + '.json';
    } else if (idioma === "en") {
        nombreArchivo = "Idioma-" + idioma + '.json';
    }

    var url = '/Resources/' + nombreArchivo;
    var Mensaje = new Object();
    Mensaje.error = "";
    Mensaje.noError = "";
    Mensaje.resultado = Common.sendLocalFileRequestJson('GET', url, undefined, undefined, false);
    if (Mensaje.resultado !== null) {
        Globalize.loadMessages(Mensaje.resultado);
        idiomaSeleciona = new Globalize(idioma);
    }

    return idiomaSeleciona;
}

