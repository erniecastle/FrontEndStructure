var propSource = "";
var propSourceDetalle = "";
var id;
var detalles = false;
var parametrosconcep = new Array();
var tipocapturaglobal;
var idioma;
var columnasTablasobj = {};
var detallesDeLaForma = {};
var numberCompInsideDiv = 0;
var numberCompInside = 0;
function definirIdioma(idiomasele) {
    idioma = idiomasele;
}

function cragarpropdetalle(infoOrigin) {
    if (tipoComponentes === 1) {
        propSource = getCamposOrigen(infoOrigin);
    } else if (tipoComponentes === 2) {
        propSourceDetalle = getCamposOrigen(infoOrigin);
    }

}

function createJsDivGlobal(data, selector, contieneCapturaDetalle) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iDiv = document.createElement('div');
    var contPag = document.createElement('NAV');
    var btnAdd;
    try {
        if (typeof (text) !== 'undefined') {
            iDiv.innerHTML = text;
        }
        if (typeof (attributes.id) !== 'undefined') {
            iDiv.id = attributes.id;

        }
        if (typeof (attributes.mode) !== 'undefined') {
            iDiv.setAttribute('mode', attributes.mode);
        }
        if (typeof (attributes.sourcecontainer) !== 'undefined') {
            iDiv.setAttribute('sourcecontainer', attributes.sourcecontainer);
        }
        if (typeof (attributes.class) !== 'undefined') {
            iDiv.className = attributes.class;
            if (iDiv.classList.contains('containerTable')) {
                if (attributes.mode === 'selector' || attributes.mode === 'search') {
                    var btnSearch = createButtonFiltroBusqueda();
                    iDiv.appendChild(btnSearch);
                }
                //var contPag = document.createElement('NAV');
                //contPag.id = "containerPag";
                //var contUl = document.createElement('UL');
                //contUl.id = "listPag" + attributes.sourcecontainer;
                //contUl.className = "pagination";
                //contPag.appendChild(contUl);
                //iDiv.appendChild(contPag);
                if (attributes.mode === 'selector') {
                    btnAdd = createButtonAgregar(false);
                    iDiv.appendChild(btnAdd);
                } else if (attributes.mode === 'capture') {
                    btnAdd = createButtonAgregar(attributes.sourcecontainer, true);
                    iDiv.appendChild(btnAdd);
                }
            }
        }
        if (typeof (attributes.style) !== 'undefined') {
            iDiv.style = attributes.style;
        }
        if (typeof (attributes.alto) !== 'undefined') {
            iDiv.style.height = attributes.alto;
        }
        if (typeof (attributes.ancho) !== 'undefined') {
            iDiv.style.width = attributes.ancho;
        }
        if (typeof (attributes.maxAlto) !== 'undefined') {
            iDiv.style.maxWidth = attributes.maxAlto;
        }
        if (typeof (attributes.display) !== 'undefined') {//se agrego esto
            iDiv.style.display = attributes.display;
        }
        if (typeof (attributes.bordeEstilo) !== 'undefined') {//se agrego esto
            iDiv.style.borderStyle = attributes.bordeEstilo;
        }
        if (typeof (attributes.bordeGrosor) !== 'undefined') {//se agrego esto
            iDiv.style.borderWidth = attributes.bordeGrosor;
        }
        if (typeof (attributes.bordeAbajo) !== 'undefined') {//se agrego esto
            iDiv.style.borderBottomStyle = attributes.bordeAbajo;
        }
        if (typeof (attributes.bordeIzquierda) !== 'undefined') {//se agrego esto
            iDiv.style.borderLeftStyle = attributes.bordeIzquierda;
        }
        if (typeof (attributes.bordeDerecha) !== 'undefined') {//se agrego esto
            iDiv.style.borderRightStyle = attributes.bordeDerecha;
        }
        if (typeof (attributes.bordeArriba) !== 'undefined') {//se agrego esto
            iDiv.style.borderTopStyle = attributes.bordeArriba;
        }

        if (typeof (attributes.margenInferior) !== 'undefined') {//se agrego esto
            iDiv.style.marginBottom = attributes.margenInferior;
        }

        if (typeof (attributes.margenSuperior) !== 'undefined') {//se agrego esto
            iDiv.style.marginTop = attributes.margenSuperior;
        }

        if (typeof (attributes.margenIzquierdo) !== 'undefined') {//se agrego esto
            iDiv.style.marginLeft = attributes.margenIzquierdo;
        }

        if (typeof (attributes.margenDerecho) !== 'undefined') {//se agrego esto
            iDiv.style.marginRight = attributes.margenDerecho;
        }



        if (typeof (attributes.source) !== 'undefined') {
            iDiv.setAttribute('source', attributes.source);
        }

        if (typeof (attributes.dataedit) !== 'undefined') {
            iDiv.setAttribute('dataedit', attributes.dataedit);

        }
        if (typeof (attributes.functedit) !== 'undefined') {
            iDiv.setAttribute('functedit', attributes.functedit);

        }
        if (typeof (attributes.table) !== 'undefined') {
            iDiv.setAttribute('table', attributes.table);

        }
        if (typeof (attributes.camposamostrar) !== 'undefined') {
            iDiv.setAttribute('camposamostrar', attributes.camposamostrar);

        }
        if (typeof (attributes.rango) !== "undefined") {
            iDiv.setAttribute("rango", attributes.rango);
        }
        if (typeof (attributes.titulo) !== 'undefined') {//se agrego esto
            iDiv.setAttribute('titulo', attributes.titulo);
        }
        if (content !== null && content !== undefined && (typeof (attributes.titulo) === 'undefined')) {
            for (var i = 0; i < content.length; i++) {
                if (content[i].elemento === "IDIV") {
                    var subDiv = createJsDivGlobal(content[i], selector, contieneCapturaDetalle);
                    iDiv.appendChild(subDiv);
                    if (subDiv.className.contains("scrollit")) {
                        contPag.id = "containerPag";
                        var contUl = document.createElement('UL');
                        contUl.id = "listPag" + attributes.sourcecontainer;
                        contUl.className = "pagination";
                        contPag.appendChild(contUl);
                        iDiv.appendChild(contPag);
                    }

                }
                else if (content[i].elemento === "IH1") {
                    var h1 = createJsH1Global(content[i]);
                    iDiv.appendChild(h1);
                }
                else if (content[i].elemento === "IH2") {
                    var h2 = createJsH2Global(content[i]);
                    iDiv.appendChild(h2);
                } else if (content[i].elemento === "IH3") {
                    var h3 = createJsH3Global(content[i]);
                    iDiv.appendChild(h3);
                } else if (content[i].elemento === "IH4") {
                    var h4 = createJsH4Global(content[i]);
                    iDiv.appendChild(h4);
                }
                else if (content[i].elemento === "ILABEL") {
                    var label = createJsLabelGlobal(content[i]);
                    iDiv.appendChild(label);
                }
                else if (content[i].elemento === "IBUTTON") {
                    var button = createJsButtonGlobal(content[i]);
                    iDiv.appendChild(button);
                }
                else if (content[i].elemento === "IINPUT") {
                    var text = createJsInputTextGlobal(content[i]);
                    iDiv.appendChild(text);
                }
                else if (content[i].elemento === "ISELECT") {
                    var select = createJsSelectGlobal(content[i]);
                    iDiv.appendChild(select);
                } else if (content[i].elemento === "IHR") {
                    var hr = createJsHrGlobal(content[i]);
                    iDiv.appendChild(hr);
                }
                else if (content[i].elemento === "ITABLE") {
                    var tablee = createJsTableGlobal(content[i]);
                    var botonAterior;
                    var botonSiguente;
                    if (selector === 'capture') {
                        if (tipocapturaglobal === 5) {
                            if (tipoComponentes === 1) {
                                botonAterior = createButtonAntMasiva();
                                botonSiguente = createButtonSigMasiva();
                            }
                        } else {
                            if (tipoComponentes === 1) {
                                botonAterior = createButtonAnterior(tablee.getAttribute('persist'), true);
                                botonSiguente = createButtonSiguiente(tablee.getAttribute('persist'), true);
                            }

                        }
                    } else if (selector === 'CaptureDetalle') {
                        if (tipoComponentes === 1) {
                            botonAterior = createButtonAntMasiva();
                            botonSiguente = createButtonSigMasiva();
                        }
                    } else {
                        if (tipoComponentes === 1) {
                            botonAterior = createButtonAnterior(tablee.getAttribute('persist'), false);
                            botonSiguente = createButtonSiguiente(tablee.getAttribute('persist'), false);
                        }

                    }
                    if (selector !== 'Buscar') {
                        var botonAgregar;
                        if (selector !== 'CaptureDetalle') {
                            if (tipoComponentes === 1) {
                                //  botonAgregar = createButtonAgregar(tablee.id, contieneCapturaDetalle);
                            } else if (tipoComponentes === 2) {

                                var botonAgregar = document.createElement('DIV');
                                if (contieneCapturaDetalle) {
                                    botonAgregar.id = "buttonAgregarDetalleNorm";
                                    botonAgregar.className = "DevExtreme";
                                    // botonAgregar.id = "buttonAgregar";
                                    //botonAgregar.className = "DevExtreme";
                                } else {

                                    botonAgregar.id = "buttonAgregar";
                                }

                            }
                        } else {
                            if (tipoComponentes === 2) {
                                var botonAgregar = document.createElement('DIV');
                                botonAgregar.id = "buttonAgregarMasiva";
                            } else if (tipoComponentes === 1) {
                            }
                        }
                    }



                    iDiv.appendChild(tablee);
                    id = undefined;
                }
                else {
                    iDiv.innerHTML = content[i].content;
                }
            }
        } else {
            if (propSource[iDiv.getAttribute('source')]) {
                var keyDataSource = JSON.stringify(propSource[iDiv.getAttribute('source')]);
                var keySrc = JSON.parse(keyDataSource);
                var configcaptura = JSON.parse(keySrc['configuracionTipoCaptura']);
                var properties = new Object();
                properties.source = iDiv.getAttribute('source');
                var titulo = iDiv.getAttribute('titulo');
                var label = createLabel(properties, titulo);
                iDiv.appendChild(label);
                if (configcaptura['tipoCaptura'] === "2") {
                    var valores = configcaptura['lista'];
                    for (var i = 0; i < valores.length; i++) {
                        var addcomp = createRadioButton(properties, iDiv, undefined, undefined, valores.length, titulo, valores[i], valores[i]);
                        iDiv.appendChild(addcomp);
                    }
                } else if (configcaptura['tipoCaptura'] === "3") {
                    var valores = configcaptura['equivalencias'];
                    for (var key in valores) {
                        var addcomp = createRadioButton(properties, iDiv, undefined, undefined, valores.length, titulo, valores[key], key);
                        iDiv.appendChild(addcomp);
                    }
                }
                //console.log(keySrc);
            }
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            console.log(e);
            // sentencias para manejar excepciones TypeError
        } else if (e instanceof RangeError) {
            // sentencias para manejar excepciones RangeError
            console.log(e);
        } else if (e instanceof EvalError) {
            // sentencias para manejar excepciones EvalError
            console.log(e);
        } else {
            // sentencias para manejar cualquier excepción no especificada
            logMyErrors(e); // pasa el objeto de la excepción al manejador de errores
        }
    }
    finally {
        console.log('The construction is correct');
    }
    return iDiv;
}

function createJsH1Global(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;

    var iH1 = document.createElement('H1');

    if (typeof (text) !== 'undefined') {
        iH1.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iH1.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iH1.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iH1.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iH1.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iH1.style.width = attributes.ancho;
    }
    if (typeof (attributes.idetiqueta) !== 'undefined') {
        iH1.setAttribute('idetiqueta', attributes.idetiqueta);
        if (validateMessageGlobalize(iH1.getAttribute('idetiqueta'))) {
            iH1.innerHTML = idioma.messageFormatter(iH1.getAttribute('idetiqueta'))();
        }
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iH1.innerHTML = content[i];
        }
    }
    return iH1;
}

function createJsHrGlobal(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;

    var iHr = document.createElement('HR');

    //if (typeof (text) !== 'undefined') {
    //    iH1.innerHTML = text;
    //}
    if (typeof (attributes.id) !== 'undefined') {
        iHr.id = attributes.id;
    }
    if (typeof (attributes.size) !== 'undefined') {
        iHr.size = attributes.size;
    }
    if (typeof (attributes.noshade) !== 'undefined') {
        iHr.setAttribute('noshade', attributes.noshade);
        // iHr.style = attributes.noshade;
    }
    //if (typeof (attributes.alto) !== 'undefined') {
    //    iH1.style.height = attributes.alto;
    //}
    //if (typeof (attributes.ancho) !== 'undefined') {
    //    iH1.style.width = attributes.ancho;
    //}
    //if (content !== null && content !== undefined) {
    //    for (var i = 0; i < content.length; i++) {
    //        iH1.innerHTML = content[i];
    //    }
    //}
    return iHr;
}

function createJsH2Global(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;

    var iH1 = document.createElement('H2');

    if (typeof (text) !== 'undefined') {
        iH1.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iH1.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iH1.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iH1.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iH1.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iH1.style.width = attributes.ancho;
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iH1.innerHTML = content[i];
        }
    }
    return iH1;
}

function createJsH3Global(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iH3 = document.createElement('H3');
    if (typeof (text) !== 'undefined') {
        iH3.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iH3.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iH3.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iH3.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iH3.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iH3.style.width = attributes.ancho;
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iH3.innerHTML = content[i];
        }
    }
    return iH3;
}

function createJsH4Global(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iH4 = document.createElement('H4');
    if (typeof (text) !== 'undefined') {
        iH4.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iH4.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iH4.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iH4.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iH4.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iH4.style.width = attributes.ancho;
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iH4.innerHTML = content[i];
        }
    }
    return iH4;
}

function createJsLabelGlobal(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iLabel = document.createElement('LABEL');
    if (typeof (text) !== 'undefined') {
        iLabel.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iLabel.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iLabel.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iLabel.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iLabel.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iLabel.style.width = attributes.ancho;
    }
    if (typeof (attributes.display) !== 'undefined') {
        iLabel.style.display = attributes.display;
    }
    if (typeof (attributes.for) !== 'undefined') {
        iLabel.setAttribute('for', attributes.for);
    }
    if (typeof (attributes.source) !== 'undefined') {
        if (propSource) {
            setDataSourceGlobal(attributes.source, iLabel);
        }
    }
    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {
            iLabel.innerHTML = content[i];
        }
    }
    if (iLabel.getAttribute('idetiqueta')) {
        if (validateMessageGlobalize(iLabel.getAttribute('idetiqueta'))) {
            iLabel.innerText = idioma.messageFormatter(iLabel.getAttribute('idetiqueta'))();
        }
    }
    return iLabel;
}

function createJImgGlobal(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var img = document.createElement('img');
    if (typeof (attributes.class) !== 'undefined') {
        img.className = attributes.class;
    }

    if (typeof (attributes.src) !== 'undefined') {
        img.src = attributes.src;
    }

    return img;
}

function createJsButtonGlobal(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iButton = document.createElement('BUTTON');

    if (typeof (text) !== 'undefined') {
        iButton.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iButton.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iButton.className = attributes.class;
    }
    if (typeof (attributes.style) !== 'undefined') {
        iButton.style = attributes.style;
    }
    if (typeof (attributes.alto) !== 'undefined') {
        iButton.style.height = attributes.alto;
    }
    if (typeof (attributes.ancho) !== 'undefined') {
        iButton.style.width = attributes.ancho;
    }

    if (typeof (attributes.onclick) !== 'undefined' !== undefined) {
        iButton.setAttribute("onclick", attributes.onclick);
    }

    if (content !== null && content !== undefined) {
        for (var i = 0; i < content.length; i++) {

            if (content[i].elemento === "IIMG") {
                var img = createJImgGlobal(content[i]);
                iButton.appendChild(img);
            }
            //iButton.innerHTML = content[i];
        }
    }
    return iButton;
}

function createJsInputTextGlobal(data) {
    var attributes = data.attributes;
    var content = data.content;
    var iText;
    if (tipoComponentes === 1) {
        iText = document.createElement('INPUT');
        if (typeof (attributes.id) !== 'undefined') {
            iText.id = attributes.id;
        }
        if (typeof (attributes.class) !== 'undefined') {
            iText.className = attributes.class;
        }
        if (typeof (attributes.name) !== 'undefined') {
            iText.setAttribute("name", attributes.name);
        }
        if (typeof (attributes.style) !== 'undefined') {
            iText.style = attributes.style;
        }
        if (typeof (attributes.alto) !== 'undefined') {
            iText.style.height = attributes.alto;
        }
        if (typeof (attributes.ancho) !== 'undefined') {
            iText.style.width = attributes.ancho;
        }
        if (typeof (attributes.display) !== 'undefined') {
            iText.style.display = attributes.display;
        }
        if (typeof (attributes.type) !== 'undefined' !== undefined) {
            iText.setAttribute("type", attributes.type);
            if (attributes.type === 'checkbox') {
                iText.style.display = "none";
            }
        }
        if (typeof (attributes.valor) !== 'undefined') {
            iText.value = attributes.valor;
        }
        if (typeof (attributes.valordefault) !== 'undefined') {
            iText.setAttribute('valordefault', attributes.valordefault);
        }
        if (typeof (attributes.placeholder) !== 'undefined') {
            iText.setAttribute('placeholder', attributes.placeholder);
        }
        if (typeof (attributes.source) !== 'undefined') {
            iText.setAttribute('source', attributes.source);
            if (propSource) {
                setDataSourceGlobal(attributes.source, iText);
            }
        }
        if (attributes.kind) {
            iText.setAttribute('kind', attributes.kind);
        }


        if (typeof (attributes.placeholder) !== 'undefined') {
            iText.setAttribute("placeholder", attributes.placeholder);
        }
        if (typeof (attributes.disabled) !== 'undefined') {
            iText.setAttribute("disabled", attributes.disabled);
        }

        if (content !== null && content !== undefined) {
            for (var i = 0; i < content.length; i++) {
                iText.innerHTML = content[i];
            }
        }
    } else if (tipoComponentes === 2) {
        iText = document.createElement('div');
        if (typeof (attributes.id) !== 'undefined') {
            iText.id = "TextBox" + attributes.id;
        }
        if (typeof (attributes.type) !== 'undefined' !== undefined) {
            if (attributes.type === "checkbox") {
                iText.setAttribute("tipo", "CheckBox");
                if (typeof (attributes.id) !== 'undefined') {
                    iText.id = "CheckBox" + attributes.id;
                }
            } else if (attributes.type === "text") {
                iText.setAttribute("tipo", "TextBox");
                if (typeof (attributes.id) !== 'undefined') {
                    iText.id = "TextBox" + attributes.id;
                }
            }

        }

        if (typeof (attributes.source) !== 'undefined') {
            iText.setAttribute('source', attributes.source);
            iText.id = iText.id + attributes.source;
            //var keyDataSource = JSON.stringify(propSource[iText.getAttribute('source')]);
            //var keySrc = JSON.parse(keyDataSource);
        }
        if (typeof (attributes.ancho) !== 'undefined') {
            iText.style.width = attributes.ancho;
        }
    }

    return iText;
}

function createJsSelectGlobal(data) {
    var attributes = data.attributes;
    var content = data.content;
    var iSelect;
    if (tipoComponentes === 1) {
        iSelect = document.createElement('SELECT');
        if (typeof (attributes.id) !== 'undefined') {
            iSelect.id = attributes.id;
        }
        if (typeof (attributes.class) !== 'undefined') {
            iSelect.className = attributes.class;
        }
        if (typeof (attributes.style) !== 'undefined') {
            iSelect.style = attributes.style;
        }
        if (typeof (attributes.alto) !== 'undefined') {
            iSelect.style.height = attributes.alto;
        }
        if (typeof (attributes.ancho) !== 'undefined') {
            iSelect.style.width = attributes.ancho;
            // divSelect.style.width = attributes.ancho;
        }
        if (typeof (attributes.onchange) !== "undefined") {
            iSelect.setAttribute("onchange", attributes.onchange);
        }
        if (typeof (attributes.rango) !== "undefined") {
            iSelect.setAttribute("rango", attributes.rango);
        }
        if (typeof (attributes.size) !== "undefined") {
            iSelect.setAttribute("size", attributes.size);
        }
        if (typeof (attributes.valordefault) !== "undefined") {
            iSelect.setAttribute('valordefault', attributes.valordefault);
        }
        if (typeof (attributes.source) !== 'undefined') {
            iSelect.setAttribute('source', attributes.source);
            //MakeChanges
            if (propSource) {
                setDataSourceGlobal(attributes.source, iSelect);
            }
        }
        if (attributes.kind) {
            iSelect.setAttribute('kind', attributes.kind);
        }
        if (content !== null && content !== undefined) {
            for (var i = 0; i < content.length; i++) {
                iSelect.innerHTML = content[i];
            }
        }
    } else if (tipoComponentes === 2) {
        iSelect = document.createElement('div');
        if (typeof (attributes.id) !== 'undefined') {
            iSelect.id = "SeletcBox" + attributes.id;
        }
        iSelect.setAttribute('Selector', select);
        iSelect.setAttribute("tipo", "select");
        if (typeof (attributes.source) !== 'undefined') {
            iSelect.setAttribute('source', attributes.source);
            iSelect.id = iSelect.id + attributes.source;
            var keyDataSource;
            var keySrc;
            if (propSource && propSource[iSelect.getAttribute('source')]) {
                keyDataSource = JSON.stringify(propSource[iSelect.getAttribute('source')]);
                keySrc = JSON.parse(keyDataSource);
            } else if (propSourceDetalle && propSourceDetalle[iSelect.getAttribute('source')]) {
                keyDataSource = JSON.stringify(propSourceDetalle[iSelect.getAttribute('source')]);
                keySrc = JSON.parse(keyDataSource);
            }

            iSelect.setAttribute("persist", keySrc["campo"]);
        }
    }


    return iSelect;
}

function setDataSourceGlobal(src, element) {

    /*
     campo -
     estado (Solo en diseño)
     llave -
     requerido -
     idEtiqueta -
     tipoDeDato (Relación, Texto, Entero, Fecha)
     compAncho -
     tipoCaptura (Componente:Texbox,Combobox)
     origenDatos_ID
     */
    var keyDataSource;
    var keySrc;
    if (propSource[src]) {
        keyDataSource = JSON.stringify(propSource[src]);
        keySrc = JSON.parse(keyDataSource);
    } else if (propSourceDetalle) {
        if (propSourceDetalle[src]) {
            keyDataSource = JSON.stringify(propSourceDetalle[src]);
            keySrc = JSON.parse(keyDataSource);
        }
    }

    if (keySrc) {
        if (element.tagName === "LABEL") {
            if (keySrc["idEtiqueta"]) {
                element.setAttribute("idetiqueta", keySrc["idEtiqueta"]);
            }
        }
        else if (element.tagName === "INPUT") {
            if (keySrc["llave"]) {
                element.setAttribute("isKey", keySrc["llave"]);
            }
            if (keySrc["requerido"]) {
                element.setAttribute("required", keySrc["requerido"]);
            }

            if (keySrc["campo"]) {
                element.setAttribute("persist", keySrc["campo"]);
            }
            element.setAttribute("origendedatos", keySrc["origenNombre"]);
            var configCaptura = JSON.parse(keySrc['configuracionTipoCaptura']);
            var expresion = configCaptura['expresion'];
            var maxcar = configCaptura['maxcar'];
            if (maxcar !== "") {
                element.setAttribute("maxlength", maxcar);
            }
            if (expresion !== "") {
                element.setAttribute("pattern", maxcar);
            }
            if (configCaptura['eventos']) {
                var datos = configCaptura['eventos'];
                var listMetodos = new Array();
                for (var i = 0; i < datos.length; i++) {
                    //    element.setAttribute(datos[i]['nombreEvento'], datos[i]['nombreMetodo']);
                    element.setAttribute("nombreEvento", datos[i].nombreEvento);
                    for (var j = 0; j < datos[i].metodos.length; j++) {
                        //element.setAttribute("nombreMetodo", datos[i].metodos[j].nombreMetodo);
                        //element.setAttribute("ParametrosMetodo", datos[i].metodos[j].parametrosMetodo);
                        var metodo = {};
                        metodo.nombre = datos[i].metodos[j].nombreMetodo;
                        metodo.parametros = datos[i].metodos[j].parametrosMetodo
                        listMetodos[listMetodos.length] = metodo;
                    }
                    element.setAttribute("Metodos", JSON.stringify(listMetodos));
                    // element.setAttribute("nombreMetodo", datos[i].nombreMetodo);
                    //if(datos[i].valorTecla){
                    //    element.setAttribute("valorTecla", datos[i].valorTecla);
                    //}
                    var teclas;
                    for (var k = 0; k < datos[i].teclas.length; k++) {
                        if (k == 0) {
                            teclas = datos[i].teclas[k].valor;
                        } else {
                            teclas = teclas + "," + datos[i].teclas[k].valor;
                        }
                    }
                    element.setAttribute("valorTecla", teclas);
                }
            }
            if (element.getAttribute('valordefault')) {
                if (element.getAttribute('type') !== "checkbox") {
                    element.value = element.getAttribute('valordefault');
                } else {
                    if (element.getAttribute('valordefault') === "on") {
                        element.checked = true;
                    }
                }

            }
        }
        else if (element.tagName === "DIV") {
            if (keySrc["compAncho"]) {
                element.style.width = keySrc["compAncho"] + "%";
                element.style.maxWidth = keySrc["compAncho"] + "%";
            }
        } else if (element.tagName === "SELECT") {
            if (keySrc["requerido"]) {
                element.setAttribute("required", keySrc["requerido"]);
            }
            if (keySrc["llave"]) {
                element.setAttribute("isKey", keySrc["llave"]);
            }
            if (keySrc["campo"]) {
                var campo = keySrc["campo"].toString();
                if (campo.includes("_ID")) {
                    var tabla = campo.replace("_ID", "");
                    tabla = tabla.charAt(0).toUpperCase() + tabla.slice(1);
                    if (tabla.toString() === "Empleado") {
                        tabla = tabla + "s";
                    } else if (tabla.toString() === "TipoCentroCosto") {
                        tabla = tabla + "s";
                    }
                    element.setAttribute("Table", tabla);
                    var resultado;
                    if (keySrc["campo"] !== "periodosNomina_ID" && keySrc["campo"] !== "concepNomDefi_ID") {
                        resultado = searchAll(tabla);
                    }
                    // var resultado = searchAll(tabla);
                    if (resultado !== undefined && resultado.length > 0) {
                        var configCaptura = JSON.parse(keySrc['configuracionTipoCaptura']);
                        var valores = configCaptura['origenes'];
                        $(element).append($("<option></option>")
                            .attr("value", "")
                            .text(""));
                        for (var i = 0; i < resultado.length; i++) {
                            if (campo === 'tipoNomina_ID' || campo === 'tipoCorrida_ID') {
                                if (valores['campovalor1'] !== "" && valores['campovalor2'] !== "") {
                                    $(element).append($("<option></option>")
                                        .attr("value", resultado[i]['id'])
                                        .text(resultado[i][valores['campovalor1']] + "-" + resultado[i][valores['campovalor2']]));
                                } else if (valores['campovalor1'] !== "") {
                                    $(element).append($("<option></option>")
                                        .attr("value", resultado[i]['id'])
                                        .text(resultado[i][valores['campovalor1']]));
                                } else {
                                    $(element).append($("<option></option>")
                                        .attr("value", resultado[i]['id'])
                                        .text(resultado[i]['descripcion']));
                                }
                            } else {
                                if (tabla === 'Empleados') {
                                    if (valores['campovalor1'] !== "" && valores['campovalor2'] !== "") {
                                        $(element).append($("<option></option>")
                                            .attr("value", resultado[i]['id'] /*+ "-" + resultado[i][valores['campovalor1']] + "-" + resultado[i][valores['campovalor2']]*/)
                                            .text(resultado[i][valores['campovalor1']] + "-" + resultado[i][valores['campovalor2']]));
                                    } else if (valores['campovalor1'] !== "") {
                                        $(element).append($("<option></option>")
                                            .attr("value", resultado[i]['id'] /*+ "-" + resultado[i][valores['campovalor1']]*/)
                                            .text(resultado[i][valores['campovalor1']]));
                                    } else {
                                        $(element).append($("<option></option>")
                                            .attr("value", resultado[i]['id'])
                                            .text(resultado[i]['nombre']));
                                    }

                                } else {
                                    if (valores['campovalor1'] !== "" && valores['campovalor2'] !== "") {
                                        $(element).append($("<option></option>")
                                            .attr("value", resultado[i]['id'])
                                            .text(resultado[i][valores['campovalor1']] + "-" + resultado[i][valores['campovalor2']]));
                                    } else if (valores['campovalor1'] !== "") {
                                        $(element).append($("<option></option>")
                                            .attr("value", resultado[i]['id'])
                                            .text(resultado[i][valores['campovalor1']]));
                                    } else {
                                        $(element).append($("<option></option>")
                                            .attr("value", resultado[i]['id'])
                                            .text(resultado[i]['descripcion']));
                                    }

                                }
                            }
                        }
                    }
                } else {
                    var configu = JSON.parse(keySrc['configuracionTipoCaptura']);
                    if (configu['tipoCaptura'] === "2") {
                        $(element).append($("<option></option>")
                            .attr("value", "")
                            .text(""));
                        var valores = configu['lista'];
                        for (var i = 0; i < valores.length; i++) {
                            $(element).append($("<option></option>")
                                .attr("value", valores[i])
                                .text(valores[i]));
                        }
                    } else if (configu['tipoCaptura'] === "3") {
                        var valores = configu['equivalencias'];
                        $(element).append($("<option></option>")
                            .attr("value", "")
                            .text(""));
                        for (var key in valores) {
                            $(element).append($("<option></option>")
                                .attr("value", key)
                                .text(valores[key]));
                        }
                        //console.log(valores);
                    }
                }
                element.setAttribute("persist", keySrc["campo"]);
                if (element.getAttribute('valordefault')) {
                    element.value = element.getAttribute('valordefault');
                }
            }
        }
    }

}

function createJsTableGlobal(data) {
    var attributes = data.attributes;
    var content = data.content;
    var iTable;
    var idorigen;
    if (tipoComponentes === 1) {
        iTable = document.createElement('TABLE');
        if (typeof (attributes.id) !== 'undefined') {
            var nombre;
            var array = attributes.tableidentifier.split('|');
            nombre = array[1];
            idorigen = array[0];
            iTable.id = attributes.id;
            iTable.setAttribute("persist", nombre);
        }
        if (typeof (attributes.class) !== 'undefined') {
            iTable.className = attributes.class;
        }
        if (typeof (attributes.style) !== 'undefined') {
            iTable.style = attributes.style;
        }
        if (typeof (attributes.alto) !== 'undefined') {
            if (activeimportscreen !== true) {
                iTable.style.height = attributes.alto;
            }
        }
        if (typeof (attributes.title) !== 'undefined') {
            iTable.title = attributes.title;
        }
        if (typeof (attributes.ancho) !== 'undefined') {
            iTable.style.width = attributes.ancho;
        }
        if (typeof (attributes.tableidentifier) !== 'undefined') {
            iTable.setAttribute('tableidentifier', attributes.tableidentifier);
        }
        if (typeof (attributes.subentities) !== 'undefined') {
            iTable.setAttribute('subentities', attributes.subentities);
        }
        if (typeof (attributes.agregar) !== 'undefined') {
            iTable.setAttribute('Agregar', attributes.agregar);
        }
        if (typeof (attributes.editar) !== 'undefined') {
            iTable.setAttribute('Editar', attributes.editar);
        }
        if (typeof (attributes.eliminar) !== 'undefined') {
            iTable.setAttribute('Eliminar', attributes.eliminar);
        }
        if (content !== null && content !== undefined) {
            for (var i = 0; i < content.length; i++) {
                if (content[i].elemento === "ITHEAD") {
                    var thead = document.createElement('THEAD');
                    thead.setAttribute("id", content[i].attributes.id);
                    var colHeadCount = content[i].content.length;
                    for (var r = 0; r < colHeadCount; r++) {
                        var row = document.createElement('TR');
                        var count = content[i].content[r].content.length;
                        for (var j = 0; j < count; j++) {
                            if (content[i].content[r].content[j].elemento === "ITH") {
                                var th = document.createElement("th");
                                var datath = document.createTextNode(content[i].content[r].content[j].texto);
                                if (content[i].content[r].content[j].texto !== "Editar" && content[i].content[r].content[j].texto !== "Eliminar" && content[i].content[r].content[j].texto !== "Selecionar") {
                                    var atrr = content[i].content[r].content[j].attributes;
                                    if (atrr !== undefined) {
                                        th.id = atrr['id'];
                                        if (atrr["fieldsource"]) {
                                            th.setAttribute("fieldsource", atrr["fieldsource"]);
                                        }
                                        if (atrr["idetiqueta"]) {
                                            th.setAttribute("idetiqueta", atrr["idetiqueta"]);
                                            if (validateMessageGlobalize(atrr["idetiqueta"])) {
                                                datath = document.createTextNode(idioma.messageFormatter(atrr["idetiqueta"])());
                                            }
                                        }
                                        if (propSource) {//Verificar
                                            var keyDataSource;
                                            var keySrc;
                                            if (propSource[atrr['source']]) {//Verificar si esto se seguira usando
                                                keyDataSource = JSON.stringify(propSource[atrr['source']]);
                                                keySrc = JSON.parse(keyDataSource);
                                                if (keySrc["idEtiqueta"]) {
                                                    th.setAttribute("idetiqueta", keySrc["idEtiqueta"]);
                                                    if (validateMessageGlobalize(keySrc["idEtiqueta"])) {
                                                        datath = document.createTextNode(idioma.messageFormatter(keySrc["idEtiqueta"])());
                                                    }
                                                }
                                                if (keySrc["campo"]) {
                                                    th.setAttribute("persist", keySrc["campo"]);
                                                }
                                                //Verificar
                                            } else {
                                                var infoOrigin = new Object();
                                                infoOrigin.id = idorigen;
                                                infoOrigin.toDict = true;
                                                if (atrr["fieldsource"]) {
                                                    th.setAttribute("fieldsource", atrr["fieldsource"]);
                                                }
                                                var prop = getCamposOrigen(infoOrigin);
                                                if (prop) {
                                                    if (prop[atrr['source']]) {
                                                        keyDataSource = JSON.stringify(prop[atrr['source']]);
                                                        keySrc = JSON.parse(keyDataSource);
                                                        if (keySrc["idEtiqueta"]) {
                                                            th.setAttribute("idetiqueta", keySrc["idEtiqueta"]);
                                                            if (validateMessageGlobalize(keySrc["idEtiqueta"])) {
                                                                datath = document.createTextNode(idioma.messageFormatter(keySrc["idEtiqueta"])());
                                                            }
                                                        }
                                                        if (keySrc["campo"]) {
                                                            th.setAttribute("persist", keySrc["campo"]);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    var atrr = content[i].content[r].content[j].attributes;
                                    th.id = atrr['id'];
                                    if (content[i].content[r].content[j].texto === "Editar") {
                                        datath = document.createTextNode(idioma.messageFormatter("Editar")());
                                    } else if (content[i].content[r].content[j].texto === "Eliminar") {
                                        datath = document.createTextNode(idioma.messageFormatter("Eliminar")());
                                    } else if (content[i].content[r].content[j].texto === "Selecionar") {
                                        datath = document.createTextNode(idioma.messageFormatter("Selecionar")());
                                    }
                                }
                                th.appendChild(datath);
                                row.appendChild(th);
                            } else {
                                var cell = document.createElement("TD");
                                var datacell = document.createTextNode(content[i].content[j].texto);
                                cell.appendChild(datacell);
                                row.appendChild(cell);
                            }
                        }
                    }
                }
                thead.appendChild(row);
                iTable.appendChild(thead);
            }
        }
    } else if (tipoComponentes === 2) {
        iTable = document.createElement('div');
        iTable.className = "dx-datagrid";
        var div2 = document.createElement('div');
        if (typeof (attributes.id) !== 'undefined') {
            div2.id = attributes.id;
            var nombre;
            var array = attributes.tableidentifier.split('|');
            nombre = array[1];
            div2.setAttribute("persistSearch", nombre);
            idorigen = array[0];
            //  div2.className="DecEX";//attributes.id;
        }
        if (typeof (attributes.tableidentifier) !== 'undefined') {
            div2.setAttribute('tableidentifier', attributes.tableidentifier);
        }
        if (typeof (attributes.subentities) !== undefined) {
            div2.setAttribute("subentities", attributes.subentities);
        }
        iTable.appendChild(div2);
        var columns = new Array();

        if (content !== null && content !== undefined) {
            for (var i = 0; i < content.length; i++) {

                var count = content[i].content.length;
                for (var j = 0; j < count; j++) {
                    if (content[i].content[j].elemento === "ITH") {
                        var atrr = content[i].content[j].attributes;
                        var col = {};

                        if (atrr !== undefined) {
                            if (atrr['idetiqueta']/*propSource*/) {
                                if (validateMessageGlobalize(atrr['idetiqueta'])) {
                                    col['texto'] = idioma.messageFormatter(atrr['idetiqueta'])();
                                } else {
                                    col['texto'] = content[i].content[j].texto
                                }

                                if (atrr['fieldsource']) {
                                    col['fieldsource'] = atrr['fieldsource'];
                                }
                                //if (atrr['subentities']) {
                                //    col['subentities'] = atrr['subentities'];
                                //}
                                //var keyDataSource;
                                //var keySrc;
                                //if (propSource[atrr['source']]) {
                                //    keyDataSource = JSON.stringify(propSource[atrr['source']]);
                                //    keySrc = JSON.parse(keyDataSource);
                                //    if (keySrc["idEtiqueta"]) {
                                //        //th.setAttribute("idetiqueta", keySrc["idEtiqueta"]);
                                //        //datath = document.createTextNode(idioma.messageFormatter(keySrc["idEtiqueta"])());
                                //        if (validateMessageGlobalize(keySrc["idEtiqueta"])) {
                                //            col['texto'] = idioma.messageFormatter(keySrc["idEtiqueta"])();
                                //        } else {
                                //            col['texto'] = content[i].content[j].texto
                                //        }
                                //        //col['texto'] = idioma.messageFormatter(keySrc["idEtiqueta"])();

                                //    }
                                //    if (keySrc["campo"]) {
                                //        col['valor'] = keySrc["campo"];
                                //    }
                                //} else {
                                //    var infoOrigin = new Object();
                                //    infoOrigin.id = idorigen;
                                //    infoOrigin.toDict = true;
                                //    var prop = getCamposOrigen(infoOrigin);
                                //    if (prop) {
                                //        if (prop[atrr['source']]) {
                                //            keyDataSource = JSON.stringify(prop[atrr['source']]);
                                //            keySrc = JSON.parse(keyDataSource);
                                //            if (keySrc["idEtiqueta"]) {
                                //                //th.setAttribute("idetiqueta", keySrc["idEtiqueta"]);
                                //                //datath = document.createTextNode(idioma.messageFormatter(keySrc["idEtiqueta"])());
                                //                if (validateMessageGlobalize(keySrc["idEtiqueta"])) {
                                //                    col['texto'] = idioma.messageFormatter(keySrc["idEtiqueta"])();
                                //                } else {
                                //                    col['texto'] = content[i].content[j].texto
                                //                }
                                //            }
                                //            if (keySrc["campo"]) {
                                //                col['valor'] = keySrc["campo"];
                                //            }

                                //        }
                                //    }

                                //}

                            }

                            if (atrr['id'] === "tbEditar") {
                                col['texto'] = idioma.messageFormatter("Editar")();
                                col['valor'] = "tbEditar";
                            } else if (atrr['id'] === "tbEliminar") {
                                col['texto'] = idioma.messageFormatter("Eliminar")();
                                col['valor'] = "tbEliminar";
                            } else if (atrr['id'] === "tbSelecionar") {
                                col['texto'] = idioma.messageFormatter("Selecionar")();
                                col['valor'] = "tbSelecionar";
                            }
                        }
                        //  idioma.messageFormatter("Editar")()
                        //if (atrr['id'] !== "tbEditar" && atrr['id'] !== "tbEliminar" && atrr['id'] !== "tbSelecionar") {
                        //    col['texto'] = idioma.messageFormatter(atrr['persist'])();
                        //    col['valor'] = atrr['persist'];
                        //} else {
                        //    if (atrr['id'] === "tbEditar") {
                        //        col['texto'] = idioma.messageFormatter("Editar")();
                        //        col['valor'] = "Editar";
                        //    }else if(atrr['id'] === "tbEliminar"){
                        //        col['texto'] = idioma.messageFormatter("Eliminar")();
                        //        col['valor'] = "Eliminar";
                        //    } else if (atrr['id'] === "tbSelecionar") {
                        //        col['texto'] = idioma.messageFormatter("Selecionar")();
                        //        col['valor'] = "Selecionar";
                        //    }
                        //}
                        // if (content[i].content[j].texto !== "Editar" && content[i].content[j].texto !== "Eliminar" && content[i].content[j].texto !== "Selecionar") {
                        columns[j] = col;
                    }
                    //} else {

                    //}
                }

            }
        }
        columnasTablasobj[div2.id] = columns;
        llenarColumnas(columns);

    }

    return iTable;
}

function createFormGlobal(id) {
    var form = document.createElement("form");
    form.setAttribute('id', "idCatalog");
    form.setAttribute('name', "idCatalog");
    form.setAttribute('method', "post");
    //form.setAttribute('mainorigen', id);
    form.setAttribute('action', "submit.php");
    form.setAttribute('onsubmit', "return verifyData()");
    return form;
}

function createButtonAnterior(table, activar) {
    var idivant = document.createElement('DIV');
    idivant.id = 'contenedorante';
    idivant.style.display = 'inline-block';
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btnAterior';
    addComp.className = 'mainPanelContentComponents';
    addComp.innerHTML = "<";
    addComp.setAttribute('onclick', "previous('" + table + "'" + "," + activar + ")");
    //addComp.style.width = prop.width + prop.displayIn;
    //if (prop.height !== 'Vacio') {
    //    var pixels = null;
    //    if (prop.displayIn === "%") {
    //        pixels = parseInt(prop.height);
    //    } else {
    //        pixels = parseInt(prop.height);
    //    }
    //    addComp.style.height = pixels + "px";
    //}
    idivant.appendChild(addComp);
    return idivant;
}

function createButtonSiguiente(table, activar) {
    var idivseg = document.createElement('DIV');
    idivseg.id = 'Contenedoraseg';
    idivseg.style.display = 'inline-block';
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btnSiguiente'
    addComp.className = 'mainPanelContentComponents';
    addComp.innerHTML = ">";
    addComp.setAttribute('onclick', "next('" + table + "'" + "," + activar + ")");
    idivseg.appendChild(addComp);
    return idivseg;
}

function createButtonSigMasiva() {
    var idivseg = document.createElement('DIV');
    idivseg.id = 'Contenedoraseg';
    idivseg.style.display = 'inline-block';
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btnSiguienteMasiva'
    addComp.className = 'mainPanelContentComponents';
    addComp.innerHTML = ">";
    addComp.setAttribute('onclick', "nextPag()");
    idivseg.appendChild(addComp);
    return idivseg;
}

function createButtonAntMasiva() {
    var idivant = document.createElement('DIV');
    idivant.id = 'Contenedorante';
    idivant.style.display = 'inline-block';
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btnAteriorMasiva'
    addComp.className = 'mainPanelContentComponents';
    addComp.innerHTML = "<";
    addComp.setAttribute('onclick', "previousPag()");
    //addComp.style.width = prop.width + prop.displayIn;
    //if (prop.height !== 'Vacio') {
    //    var pixels = null;
    //    if (prop.displayIn === "%") {
    //        pixels = parseInt(prop.height);
    //    } else {
    //        pixels = parseInt(prop.height);
    //    }
    //    addComp.style.height = pixels + "px";
    //}
    idivant.appendChild(addComp);
    return idivant;
}

function createButtonAgregar(source, isDetail) {
    source = typeof source !== 'undefined' ? source : "";
    var idivAgre = document.createElement('DIV');
    idivAgre.id = 'containerBtnAdd' + source;
    idivAgre.style.display = 'flex';
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btnAgregar' + source;
    addComp.className = 'mainPanelContentComponents defaultButton';
    // addComp.innerHTML = idioma.messageFormatter('btnAgregar')();
    addComp.setAttribute('idetiqueta', 'btnAgregar');
    var imgCan = document.createElement("img");
    imgCan.className = "imgBoton";
    imgCan.src = "img/Iconos/nuevo.png";
    addComp.appendChild(imgCan);
    var spanCan = document.createElement("span");
    spanCan.innerHTML = idioma.messageFormatter('btnAgregar')();
    addComp.appendChild(spanCan);
    if (isDetail) {
        addComp.setAttribute('onclick', "ocultarformacapture(false,false,false,true)");
    } else {
        addComp.setAttribute('onclick', "ocultarformaSelect()");
    }
    idivAgre.appendChild(addComp);
    return idivAgre;
}

function createButtonFiltroBusqueda() {
    var idivFilter = document.createElement('DIV');
    idivFilter.id = 'containerBtnFilterSearch';
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btnFiltroBuscar';
    addComp.className = 'mainPanelContentComponents defaultButton right';
    // addComp.innerHTML = idioma.messageFormatter('btnBuscar')();
    addComp.setAttribute('idetiqueta', 'btnBuscar');
    addComp.setAttribute('onclick', "searchByFilters()");
    var imgCan = document.createElement("img");
    imgCan.className = "imgBoton";
    imgCan.src = "img/Iconos/buscar.png";
    addComp.appendChild(imgCan);
    var spanCan = document.createElement("span");
    spanCan.innerHTML = idioma.messageFormatter('btnBuscar')();
    addComp.appendChild(spanCan);
    idivFilter.appendChild(addComp);
    return idivFilter;
}

function createButtonCancelar(capture, detalle, busqueda, capturaDetalle) {
    if (!capturaDetalle && !busqueda) {
        var idivAgre = document.createElement('DIV');
        idivAgre.id = 'ContenedoraCancelar';
        idivAgre.style.display = "inline";
    }
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btncancelar';
    addComp.className = 'mainPanelContentComponents defaultButton';
    //addComp.innerHTML = idioma.messageFormatter('btnCancelar')();
    addComp.setAttribute('idetiqueta', 'btnCancelar');
    if (detalle) {
        addComp.setAttribute('onclick', "ocultarformacapture(false,true,false,false)");
        addComp.style.display = "inline";
    } else if (capture) {
        addComp.setAttribute('onclick', "ocultarformacapture(true,false,false,false)");
        addComp.style.display = "inline";
    } else if (busqueda) {
        addComp.setAttribute('onclick', "ocultarformacapture(false,false,true,false)");
        addComp.style.display = "inline";
    } else if (capturaDetalle) {
        addComp.setAttribute('onclick', "ocultarformacapture(true,false,false,false)");
        addComp.style.display = "inline";
    }
    var imgCan = document.createElement("img");
    imgCan.className = "imgBoton";
    imgCan.src = "img/Iconos/cancelar.png";
    addComp.appendChild(imgCan);
    var spanCan = document.createElement("span");
    spanCan.innerHTML = idioma.messageFormatter('btnCancelar')();
    addComp.appendChild(spanCan);
    if (capturaDetalle || busqueda) {
        return addComp;
    } else {
        idivAgre.appendChild(addComp);
        return idivAgre;
    }
}

function createButtonBuscar() {
    var idivAgre = document.createElement('DIV');
    idivAgre.id = 'ContenedoraBuscar';
    idivAgre.style.display = "inline";
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btnBuscar';
    addComp.className = 'mainPanelContentComponents defaultButton';
    //addComp.innerHTML = "Buscar";
    // addComp.innerHTML = idioma.messageFormatter('btnBuscar')();
    addComp.setAttribute('idetiqueta', 'btnBuscar');
    addComp.setAttribute('onclick', "abrirFormaBusqueda()");
    addComp.style.display = "inline";
    var imgCan = document.createElement("img");
    imgCan.className = "imgBoton";
    imgCan.src = "img/Iconos/buscar.png";
    addComp.appendChild(imgCan);
    var spanCan = document.createElement("span");
    spanCan.innerHTML = idioma.messageFormatter('btnBuscar')();
    addComp.appendChild(spanCan);

    idivAgre.appendChild(addComp);
    return idivAgre;
}

function createButtonCancelarBusqueda() {
    var idivAgre = document.createElement('DIV');
    idivAgre.id = 'ContenedoraCancelarbus';
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btncancelar_Buscar';
    addComp.className = 'mainPanelContentComponents defaultButton';
    // addComp.innerHTML = "Cancelar";
    // addComp.innerHTML = idioma.messageFormatter('btnCancelar')();
    addComp.setAttribute('idetiqueta', 'btnCancelar');
    addComp.setAttribute('onclick', "cerrarFromaBusqueda()");
    var imgCan = document.createElement("img");
    imgCan.className = "imgBoton";
    imgCan.src = "img/Iconos/cancelar.png";
    addComp.appendChild(imgCan);
    var spanCan = document.createElement("span");
    spanCan.innerHTML = idioma.messageFormatter('btnCancelar')();
    addComp.appendChild(spanCan);
    idivAgre.appendChild(addComp);
    return idivAgre;
}

function createDivCamOcultos(data) {
    var text = data.texto;
    var attributes = data.attributes;
    var content = data.content;
    var iDiv = document.createElement('div');
    if (typeof (text) !== 'undefined') {
        iDiv.innerHTML = text;
    }
    if (typeof (attributes.id) !== 'undefined') {
        iDiv.id = attributes.id;
    }
    if (typeof (attributes.class) !== 'undefined') {
        iDiv.className = attributes.class;
    }
    if (content !== null && content !== undefined && (typeof (attributes.titulo) === 'undefined')) {
        for (var i = 0; i < content.length; i++) {
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            if (typeof (content[i].attributes.id) !== 'undefined') {
                input.id = content[i].attributes.id;
            }
            if (typeof (content[i].attributes.source) !== 'undefined') {
                input.setAttribute('source', content[i].attributes.source);
            }
            if (typeof (content[i].attributes.isoculto) !== 'undefined') {
                input.setAttribute('isoculto', content[i].attributes.isoculto);
            }
            if (typeof (content[i].attributes.tipovalor) !== 'undefined') {
                input.setAttribute('tipovalor', content[i].attributes.tipovalor);
            }
            if (typeof (content[i].attributes.persist) !== 'undefined') {
                input.setAttribute('persist', content[i].attributes.persist);
            }
            if (typeof (content[i].attributes.valordefault) !== 'undefined') {
                input.setAttribute('valordefault', content[i].attributes.valordefault);
                input.value = content[i].attributes.valordefault;
            }
            iDiv.appendChild(input);
        }

    }
    return iDiv;
}

function mapDOMGlobal(element, json) {
    var treeObject = {};
    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser) {
            parser = new DOMParser();
            docNode = parser.parseFromString(element, "text/xml");
        } else { // Microsoft strikes again
            docNode = new ActiveXObject("Microsoft.XMLDOM");
            docNode.async = false;
            docNode.loadXML(element);
        }
        element = docNode;//.firstChild;
    }

    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
        var typeName = element.nodeName;
        //Personalized converter types
        typeName = "I" + typeName;
        object["elemento"] = typeName;

        var nodeList = element.childNodes;
        if (nodeList !== null) {
            if (nodeList.length) {
                object["content"] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType === 3) {// 1 Element 2 Attr 3 Text
                        if (!nodeList[i].nodeValue.startsWith('\n')) {
                            object["texto"] = nodeList[i].nodeValue;
                        }
                    } else {
                        object["content"].push({});
                        treeHTML(nodeList[i], object["content"][object["content"].length - 1]);
                    }
                }
            }
        }
        if (element.attributes !== null) {
            if (element.attributes.length) {
                object["attributes"] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    if (element.value) {
                        object["attributes"]["valor"] = element.value;
                    }
                    if (element.attributes[i].nodeName === "style") {
                        //Get style an remove spaces to separated after
                        var styles = element.attributes[i].nodeValue.toString().replace(/ /g, '');
                        var arrayStyle = styles.split(";");
                        for (var p = 0; p < arrayStyle.length; p++) {
                            if (arrayStyle[p] !== "") {//Add another estilos
                                var getPropertie = arrayStyle[p].split(":");
                                if (getPropertie[0] === "width") {
                                    object["attributes"]["ancho"] = getPropertie[1];
                                } else if (getPropertie[0] === "height") {
                                    object["attributes"]["alto"] = getPropertie[1];
                                } else if (getPropertie[0] === "display") {
                                    object["attributes"]["display"] = getPropertie[1];
                                } else if (getPropertie[0] === "max-width") {
                                    object["attributes"]["maxAlto"] = getPropertie[1];
                                }
                                //display
                                // console.log("NameProp: " + getPropertie[0] + " Valueprop: " + getPropertie[1]);
                            }
                        }
                    }
                    else {
                        object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                    }
                }
            }
        }
    }
    treeHTML(element, treeObject);
    return (json) ? JSON.stringify(treeObject) : treeObject;
}

function validateMessageGlobalize(idEtiqueta) {
    var message = idioma.cldr.get(["globalize-messages/{bundle}"].concat(idEtiqueta));
    if (message === undefined) {
        return false;
    } else {
        return true;
    }
}

function ejecutarCapture(configCap) {
    var contSelect = false;
    var contSearch = false;
    var formaSelect = null;
    var formaCapture = null;
    var formaCaptureSearch = null;
    var formaCaptureDetalle = null;
    //idioma = idiomaSelecionado;
    var idiv = document.createElement('DIV');
    idiv.id = 'ContenedorPrincipal';
    idiv.className = 'contenedor';
    idiv.style.maxWidth = "100%";
    idiv.style.width = "100%";
    var infoOrigin = new Object();
    infoOrigin.id = configCap.origenDeDatos.id;
    if (configCap.origenDeDatos.nombre === "Despensa") {
        var oHead = document.getElementsByTagName('head')[0];
        var oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src = "js/ConfiguracionDespensa.js";
        oScript.async = false;
        oHead.appendChild(oScript);
    } else if (configCap.origenDeDatos.nombre === "ConfiguracionIMSS") {
        var oHead = document.getElementsByTagName('head')[0];
        var oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src = "js/ConfiguracionIMSS.js";
        oScript.async = false;
        oHead.appendChild(oScript);
    }
    infoOrigin.toDict = true;
    propSource = getCamposOrigen(infoOrigin);
    tipocapturaglobal = configCap.tipoDeCaptura;
    if (configCap.tipoDeCaptura === 5) {
        formaCapture = configCap.fileForma1;
        formaCaptureDetalle = configCap.fileForma2;
        idiv.setAttribute('tipocaptura', configCap.tipoDeCaptura);
    } else {
        if (configCap.selectRegistros) {
            formaSelect = configCap.fileForma2;
        }
        formaCapture = configCap.fileForma1;

        formaCaptureSearch = configCap.fileForma3;

    }


    if (formaSelect !== null && formaSelect.toString().length > 100) {
        var dataselect = JSON.parse(formaSelect);
        var infoSelect = dataselect.content[0];
        var idivSelct = document.createElement('DIV');
        idivSelct.id = 'Selector';
        idivSelct.className = 'contenedor';
        idivSelct.style.maxWidth = "100%";
        idivSelct.style.width = "100%";

        for (var i = 0; i < infoSelect.content.length; i++) {
            if (infoSelect.content[i].elemento === "IDIV") {
                // var buscar1 = true;
                var iDiv = createJsDivGlobal(infoSelect.content[i], undefined);
                idivSelct.appendChild(iDiv);
            }
        }
        idivSelct.style.display = "block";
        contSelect = true;
        activarSelector(true);
        idiv.appendChild(idivSelct);
    }
    if (formaCaptureSearch !== null && formaCaptureSearch.toString().length > 100) {
        var dataCaptureSearch = JSON.parse(formaCaptureSearch);
        var infoCaptureSearch = dataCaptureSearch.content[0];
        var idivbuscar = document.createElement('DIV');
        idivbuscar.id = 'Buscar';
        idivbuscar.className = 'contenedor';
        idivbuscar.style.maxWidth = "100%";
        idivbuscar.style.width = "100%";
        var idivbot = document.createElement('DIV');
        idivbot.id = 'botones';
        idivbot.className = 'contenedor';
        idivbot.style.maxWidth = "100%";
        idivbot.style.width = "100%";
        var div = document.createElement('DIV');
        for (var i = 0; i < infoCaptureSearch.content.length; i++) {
            if (infoCaptureSearch.content[i].elemento === "IDIV") {
                var buscar1 = 'Buscar';
                var iDiv = createJsDivGlobal(infoCaptureSearch.content[i], 'Buscar');
                var btnCancelar;
                if (tipoComponentes === 1) {
                    btnCancelar = createButtonCancelar(false, false, true, false);
                } else if (tipoComponentes === 2) {
                    var btnCancelar = document.createElement('div');
                    btnCancelar.id = "buttonCancelarSearch";
                }
                //var btnCancelar = createButtonCancelar(false, false, true, false);

                idivbot.appendChild(btnCancelar);
                div.appendChild(idivbot);
                iDiv.appendChild(div);
                idivbuscar.appendChild(iDiv);
                // idivbuscar.appendChild(idivbot);
            }
        }
        contSearch = true;
        idivbuscar.style.display = "none";
        idiv.appendChild(idivbuscar);
    }
    if (formaCapture !== null && formaCapture.toString().length > 100) {
        var dataCapture = JSON.parse(formaCapture);
        var infoCapture = dataCapture.content;
        var idivcap = document.createElement('DIV');
        idivcap.id = 'capture';
        idivcap.className = 'contenedor';
        idivcap.style.maxWidth = "100%";
        idivcap.style.width = "100%";
        var idivbot = document.createElement('DIV');
        idivbot.id = 'botones';
        idivbot.className = 'contenedor';
        idivbot.style.maxWidth = "100%";
        idivbot.style.width = "100%";
        for (var k = 0; k < infoCapture.length; k++) {
            for (var i = 0; i < infoCapture[k].content.length; i++) {
                if (infoCapture[k].content[i].elemento === "IDIV" && infoCapture[k].attributes.id !== "contOcultos") {
                    //var buscar1 = true;
                    var contieneCapturaDetalle;
                    if (formaCaptureDetalle !== null) {
                        contieneCapturaDetalle = true;
                        //detalles = true;
                    }
                    if (configCap.detalleConfigCapturas.length > 0) {
                        detalles = true;
                    }
                    var iDiv = null;
                    if (contieneCapturaDetalle) {
                        if (tipoComponentes === 2) {
                            iDiv = createJsDivGlobal(infoCapture[k].content[i], 'capture', false);
                        } else {
                            iDiv = createJsDivGlobal(infoCapture[k].content[i], 'capture', contieneCapturaDetalle);
                        }
                    } else {
                        iDiv = createJsDivGlobal(infoCapture[k].content[i], 'capture', detalles);
                    }
                    var btnGuardar;//= createButtonGuardar();
                    if (configCap.tipoDeCaptura === 5) {
                        if (tipoComponentes === 1) {
                            btnGuardar = createButtonGuardar();
                            btnGuardar.setAttribute('onclick', "SaveMasiva()");
                        } else if (tipoComponentes === 2) {
                            btnGuardar = document.createElement('div');
                            btnGuardar.id = "buttonGuardarSaveMasiva";
                            btnGuardar.style.marginRight = "15px";
                        }
                    } else if (detalles) {
                        if (tipoComponentes === 1) {
                            if (configCap.origenDeDatos.nombre === "Despensa") {
                                btnGuardar = createButtonGuardar();
                                btnGuardar.setAttribute('onclick', "");
                            } else {
                                btnGuardar = createButtonGuardar();
                                btnGuardar.setAttribute('onclick', "save()");
                            }
                        } else if (tipoComponentes === 2) {
                            btnGuardar = document.createElement('div');
                            btnGuardar.id = "buttonGuardarSaveDetalles";
                            btnGuardar.style.marginRight = "15px";
                        }

                    } else {
                        if (contSelect) {
                            if (tipoComponentes === 1) {
                                btnGuardar = createButtonGuardar();
                                btnGuardar.setAttribute('onclick', "saveOrUpdate()");
                            } else if (tipoComponentes === 2) {
                                btnGuardar = document.createElement('div');
                                btnGuardar.id = "buttonGuardarSaveOrUpdate";
                                btnGuardar.style.marginRight = "15px";
                            }

                        } else {
                            if (tipoComponentes === 1) {
                                if (configCap.origenDeDatos.nombre === "Despensa") {
                                    btnGuardar = createButtonGuardar();
                                    btnGuardar.setAttribute('onclick', "");
                                } else {
                                    btnGuardar = createButtonGuardar();
                                    btnGuardar.setAttribute('onclick', "save()");
                                }
                            } else if (tipoComponentes === 2) {
                                btnGuardar = document.createElement('div');
                                btnGuardar.id = "buttonGuardarSave";
                                btnGuardar.style.marginRight = "15px";
                            }

                        }
                    }
                    // iDiv.appendChild(btnGuardar);
                    // idivcap.appendChild(btnGuardar);
                    idivbot.appendChild(btnGuardar);
                    if (contSearch) {
                        var btnActualizar; //= createButtonActualizar();
                        if (tipoComponentes === 1) {
                            btnActualizar = createButtonActualizar();
                            btnActualizar.setAttribute('onclick', "update()");
                        } else if (tipoComponentes === 2) {
                            var btnActualizar = document.createElement('div');
                            btnActualizar.id = "buttonActualizar";
                            btnActualizar.style.marginRight = "15px";
                            btnActualizar.style.display = 'none';
                        }


                        idivbot.appendChild(btnActualizar);
                    }
                    if (formaCaptureSearch !== null && formaCaptureSearch.toString().length > 100) {
                        var btnEliminar;//= createButtonEliminar(contSearch);
                        if (contieneCapturaDetalle) {
                            if (tipoComponentes === 1) {
                                btnEliminar = createButtonEliminar(contSearch);
                                btnEliminar.setAttribute('onclick', 'saveDetalles()');
                            } else if (tipoComponentes === 2) {
                                btnEliminar = document.createElement('div');
                                btnEliminar.id = "buttonEliminarDetalle";
                                btnEliminar.style.marginRight = "15px";
                                btnEliminar.style.display = 'none';
                            }

                        } else {
                            if (tipoComponentes === 1) {
                                btnEliminar = createButtonEliminar(contSearch);
                                btnEliminar.setAttribute('onclick', "eliminarObject()");
                            } else if (tipoComponentes === 2) {
                                btnEliminar = document.createElement('div');
                                btnEliminar.id = "buttonEliminarNormal";
                                btnEliminar.style.marginRight = "15px";
                                btnEliminar.style.display = 'none';
                            }

                        }
                        idivbot.appendChild(btnEliminar);

                        var btnBuscar; //= createButtonBuscar();
                        if (tipoComponentes === 1) {
                            btnBuscar = createButtonBuscar();
                        } else if (tipoComponentes === 2) {
                            btnBuscar = document.createElement('div');
                            btnBuscar.id = "buttonBuscar";
                            btnBuscar.style.marginRight = "15px";
                        }
                        idivbot.appendChild(btnBuscar);
                    }

                    if (contSelect) {
                        var btnCancelar;// = createButtonCancelar(true, false, true);
                        if (tipoComponentes === 1) {
                            btnCancelar = createButtonCancelar(true, false, true);
                        } else if (tipoComponentes === 2) {
                            btnCancelar = document.createElement('div');
                            btnCancelar.id = "buttonCancelarSelect";
                        }
                        idivbot.appendChild(btnCancelar);
                    } else if (contSearch) {
                        var btnCancelar;// = createButtonCancelar(false, false, true);
                        if (tipoComponentes === 1) {
                            btnCancelar = createButtonCancelar(false, false, true);
                            btnCancelar.setAttribute('onclick', "clearObjetosgen()");
                        } else if (tipoComponentes === 2) {
                            btnCancelar = document.createElement('div');
                            btnCancelar.id = "buttonCancelarLimpiar";
                        }

                        idivbot.appendChild(btnCancelar);
                    }

                    idivcap.appendChild(iDiv);
                    idivcap.appendChild(idivbot);
                } else {
                    var iDiv = createDivCamOcultos(infoCapture[k].content[i]);
                    idiv.appendChild(iDiv);
                }
            }
        }
        if (contSelect) {
            idivcap.style.display = "none";
        } else {
            idiv.style.display = "block";
        }


        checarDetallesGlobal(idivcap, configCap.detalleConfigCapturas);
        idiv.appendChild(idivcap);

        // idiv.appendChild(btnGuardar);
    }



    if (formaCaptureDetalle !== null && formaCaptureDetalle.toString().length > 100) {
        var dataCaptureDetalle = JSON.parse(formaCaptureDetalle);
        var infoCaptureDetalle = dataCaptureDetalle.content[0];
        var idivbuscar = document.createElement('DIV');
        idivbuscar.id = 'CaptureDetalle';
        idivbuscar.className = 'contenedor';
        idivbuscar.style.maxWidth = "100%";
        idivbuscar.style.width = "100%";
        var idivbot = document.createElement('DIV');
        idivbot.id = 'botones';
        idivbot.className = 'contenedor';
        idivbot.style.maxWidth = "100%";
        idivbot.style.width = "100%";
        for (var i = 0; i < infoCaptureDetalle.content.length; i++) {
            if (infoCaptureDetalle.content[i].elemento === "IDIV") {
                // var buscar1 = 'Buscar';
                var iDiv = createJsDivGlobal(infoCaptureDetalle.content[i], 'CaptureDetalle');
                var btnCancelar;
                if (tipoComponentes === 1) {
                    btnCancelar = createButtonCancelar(false, false, false, true);
                    btnCancelar.setAttribute('onclick', "ocultarformacapture(true, false, false, false)");
                } else if (tipoComponentes === 2) {
                    btnCancelar = document.createElement('div');
                    btnCancelar.id = "buttonCancelarDetalleMasiva";
                }

                var btnAceptar;// = createButtonAceptar();
                if (tipoComponentes === 1) {
                    btnAceptar = createButtonAceptar();
                } else if (tipoComponentes === 2) {
                    btnAceptar = document.createElement('div');
                    btnAceptar.id = "buttonAceptarDetalleMasiva";
                    btnAceptar.style.marginRight = "15px";
                }
                var div = document.createElement('DIV');
                idivbot.appendChild(btnAceptar);
                idivbot.appendChild(btnCancelar);
                div.appendChild(idivbot);
                //div.appendChild(btnCancelar);
                if (tipoComponentes === 1) {
                    var botones = iDiv.querySelectorAll('button');
                    for (var i = 0; i < botones.length; i++) {
                        if (botones[i].id === 'btnAgregar') {
                            botones[i].setAttribute('onclick', "agregar()");
                            break;
                        }
                    }
                } else if (tipoComponentes === 2) {

                }
                // console.log(botones);
                iDiv.appendChild(div);
                idivbuscar.appendChild(iDiv);
            }
        }
        idivbuscar.style.display = "none";
        idiv.appendChild(idivbuscar);
    }
    var panelDetalle = document.createElement('DIV');
    panelDetalle.id = 'panelDetalle';
    panelDetalle.className = 'contenedor';
    panelDetalle.style.maxWidth = "100%";
    panelDetalle.style.width = "100%";
    panelDetalle.style.display = "none";
    tiposPantalla(contSelect, contSearch, detalles, contieneCapturaDetalle);
    var cont = document.getElementById('container');
    cont.appendChild(idiv);
    idiv.appendChild(panelDetalle);

    if ($('[kind="filter"]').length === 0) {
        if (document.getElementById("btnFiltroBuscar")) {
            document.getElementById("btnFiltroBuscar").style.display = "none";
        }
    }

    if (tipoComponentes === 2) {
        crearCajatexto(idiv);
        crearSelectBox();
        crearBotonAgregar(contieneCapturaDetalle);
        crearBotonBuscar();
        crearBotonGuardar();
        crearBotonActualizar();
        crearBotonEliminar();
        crearBotonAceptar()
        crearBotonCancelar();
        crearGrid();
    }

    return idiv;

}

function ejecutarCaptureProceso(configCap) {
    var formaCapture = null;

    var idiv = document.createElement('DIV');
    idiv.id = 'ContenedorPrincipal';
    idiv.className = 'contenedor';
    idiv.style.maxWidth = "100%";
    idiv.style.width = "100%";
    formaCapture = configCap.fileForma1;

    var procesoOrigen = configCap.procesoOrigen_ID;
    propSourceProceso = getParametrosProcesoOrigen(procesoOrigen);
    var acciones = getAccionesProcesoOrigen(procesoOrigen);
    if (formaCapture !== null && formaCapture.toString().length > 100) {
        var dataCapture = JSON.parse(formaCapture);
        var infoCapture = dataCapture.content;
        var idivcap = document.createElement('DIV');
        idivcap.id = 'capture';
        idivcap.className = 'contenedor';
        idivcap.style.maxWidth = "100%";
        idivcap.style.width = "100%";
        var idivbot = document.createElement('DIV');
        idivbot.id = 'botones';
        idivbot.className = 'contenedor';
        idivbot.style.maxWidth = "100%";
        idivbot.style.width = "100%";
        for (var k = 0; k < infoCapture.length; k++) {
            for (var i = 0; i < infoCapture[k].content.length; i++) {
                if (infoCapture[k].content[i].elemento === "IDIV" && infoCapture[k].attributes.id !== "contOcultos") {
                    //var buscar1 = true;
                    var contieneCapturaDetalle;
                    var iDiv = null;
                    if (tipoComponentes === 2) {
                        iDiv = createJsDivGlobal(infoCapture[k].content[i], 'capture', false);
                    } else {
                        iDiv = createJsDivGlobal(infoCapture[k].content[i], 'capture', contieneCapturaDetalle);
                    }

                    idivcap.appendChild(iDiv);
                    idivcap.appendChild(idivbot);
                } else {
                    var iDiv = createDivCamOcultos(infoCapture[k].content[i]);
                    idiv.appendChild(iDiv);
                }
            }
        }

        idiv.appendChild(idivcap);
        if (tipoComponentes === 2) {
            crearCajatexto(idiv);
            crearSelectBox();
            crearBotonAgregar(contieneCapturaDetalle);
            crearBotonBuscar();
            crearBotonGuardar();
            crearBotonActualizar();
            crearBotonEliminar();
            crearBotonAceptar()
            crearBotonCancelar();
            crearGrid();
        } else {

            var elements = idiv.querySelectorAll("select,input,label");

            for (var i = 0; i < elements.length; i++) {

                setDataProcesoOrigen(elements[i]);
            }
        }
        var cont = document.getElementById('container');
        if (configCap.procesoOrigen.clave === "1") {

            var calculo = document.createElement('button');
            calculo.className = "mainPanelContentComponents defaultButton";
            calculo.setAttribute("onclick", "CalculoNomina()");
            calculo.innerHTML = "Calcular";
            idiv.appendChild(calculo);
            var oHead = document.getElementsByTagName('head')[0];
            var oScript = document.createElement('script');
            oScript.type = 'text/javascript';
            oScript.src = "js/CalculoDeNomina.js";
            oScript.async = false;
            oHead.appendChild(oScript);
        } else if (configCap.procesoOrigen.clave === "2") {
            var calculoSDI = document.createElement('button');
            calculoSDI.className = "mainPanelContentComponents defaultButton";
            calculoSDI.setAttribute("onclick", "CalculoSDI()");
            calculoSDI.innerHTML = "Calcular";
            idiv.appendChild(calculoSDI);
            var oHeadSDI = document.getElementsByTagName('head')[0];
            var oScriptSDI = document.createElement('script');
            oScriptSDI.type = 'text/javascript';
            oScriptSDI.src = "js/CalculoSDI.js";
            oScriptSDI.async = false;
            oHeadSDI.appendChild(oScriptSDI);


        } else if (configCap.procesoOrigen.clave === "3") {
            var oHead = document.getElementsByTagName('head')[0];
            var oScript = document.createElement('script');
            oScript.type = 'text/javascript';
            oScript.src = "js/AbrirCerraPeriodoNomina.js";
            oScript.async = false;
            oHead.appendChild(oScript);
            if (acciones) {
                var divAcciones = document.createElement('div');
                divAcciones.id = "divAcciones";
                divAcciones.style.maxWidth = "100%";
                divAcciones.style.width = "100%";
                for (var i = 0; i < acciones.length; i++) {
                    var Accionbtn = document.createElement('button');
                    Accionbtn.className = "mainPanelContentComponents defaultButton";
                    Accionbtn.style.display = "inline-block";
                    if (acciones[i].clave === "1") {
                        Accionbtn.setAttribute("onclick", "AbrirPeriodo()");
                    } else if (acciones[i].clave === "2") {
                        Accionbtn.setAttribute("onclick", "CerrarPeriodo()");
                    }
                    // Accionbtn.setAttribute("onclick", "AbrirPeriodo()");
                    Accionbtn.innerHTML = acciones[i].descripcion;
                    divAcciones.appendChild(Accionbtn);
                }

                idiv.appendChild(divAcciones);
            }

            var selectTN = idiv.querySelector('[persist=TipoNomina]');
            selectTN.setAttribute('onchange', 'getPeriodosNomina()');
            var selectPer = idiv.querySelector('[persist=PeriodosNomina]');
            selectPer.setAttribute('onchange', 'getPeriodoNominaID(this.value)');

        }
        cont.appendChild(idiv);

    }


    return idiv;
}

function setDataProcesoOrigen(element) {
    var keyDataSource;
    var keySrc;
    if (propSourceProceso[element.getAttribute('source')]) {
        keyDataSource = JSON.stringify(propSourceProceso[element.getAttribute('source')]);
        keySrc = JSON.parse(keyDataSource);
    }
    if (keySrc) {
        if (element.tagName === "LABEL") {
            if (keySrc["idEtiqueta"]) {
                element.setAttribute("idetiqueta", keySrc["idEtiqueta"]);
            }
        }
        else if (element.tagName === "INPUT") {
            if (keySrc["llave"]) {
                element.setAttribute("isKey", keySrc["llave"]);
            }
            if (keySrc["requerido"]) {
                element.setAttribute("required", keySrc["requerido"]);
            }

            if (keySrc["campo"]) {
                element.setAttribute("persist", keySrc["campo"]);
            }
            var configCaptura = JSON.parse(keySrc['configuracionTipoCaptura']);
            var expresion = configCaptura['expresion'];
            var maxcar = configCaptura['maxcar'];
            if (maxcar !== "") {
                element.setAttribute("maxlength", maxcar);
            }
            if (expresion !== "") {
                element.setAttribute("pattern", maxcar);
            }
            if (configCaptura['eventos']) {
                var datos = configCaptura['eventos'];
                for (var i = 0; i < datos.length; i++) {
                    element.setAttribute(datos[i]['nombreEvento'], datos[i]['nombreMetodo']);
                }
            }
            if (element.getAttribute('valordefault')) {
                if (element.getAttribute('type') !== "checkbox") {
                    element.value = element.getAttribute('valordefault');
                } else {
                    if (element.getAttribute('valordefault') === "on") {
                        element.checked = true;
                    }
                }

            }
        }
        else if (element.tagName === "SELECT") {
            if (keySrc["requerido"]) {
                element.setAttribute("required", keySrc["requerido"]);
            }
            if (keySrc["capturaRango"]) {
                element.setAttribute("capturaRango", keySrc["capturaRango"]);
            }
            if (keySrc["campo"]) {
                var campo = keySrc["campo"].toString();
                var configu = JSON.parse(keySrc['configuracionTipoCaptura']);
                if (configu.tipoCaptura === "2") {
                    $(element).append($("<option></option>")
                        .attr("value", "")
                        .text(""));
                    var valores = configu['lista'];
                    for (var i = 0; i < valores.length; i++) {
                        $(element).append($("<option></option>")
                            .attr("value", valores[i])
                            .text(valores[i]));
                    }
                } else if (configu.tipoCaptura === "3") {
                    var valores = configu['equivalencias'];
                    $(element).append($("<option></option>")
                        .attr("value", "")
                        .text(""));
                    for (var key in valores) {
                        $(element).append($("<option></option>")
                            .attr("value", key)
                            .text(valores[key]));
                    }
                } else if (configu.tipoCaptura === "4") {
                    var values = configu.origenes;
                    element.setAttribute("Table", values.origen);
                    var resultado = searchAll(values.origen);
                    if (resultado !== undefined && resultado.length > 0) {
                        $(element).append($("<option></option>")
                            .attr("value", "")
                            .text(""));
                    }
                    for (var k = 0; k < resultado.length; k++) {
                        if (values.campovalor1 !== "" && values.campovalor2 !== "") {
                            $(element).append($("<option></option>")
                                .attr("value", resultado[k]['clave'])
                                .text(resultado[k][values['campovalor1']] + "-" + resultado[k][values['campovalor2']]));
                        } else if (values.campovalor1 !== "") {
                            $(element).append($("<option></option>")
                                .attr("value", resultado[k]['clave'])
                                .text(resultado[k][values['campovalor1']]));
                        }
                    }
                }
                element.setAttribute("persist", keySrc["campo"]);
                if (element.getAttribute('valordefault')) {
                    element.value = element.getAttribute('valordefault');
                }
            }
        }
    }
}

function checarDetallesGlobal(divContenedor, listaDetalles) {
    //var tabladetalle = divContenedor.getElementsByTagName('table');
    if (tipoComponentes === 1) {
        var tabladetalle = divContenedor.getElementsByTagName('table');
        var i = 0, cells;
        contardetalles(listaDetalles.length);
        for (var r = 0; r < listaDetalles.length; r++) {
            cells = listaDetalles[r];
            while (i < tabladetalle.length) {
                var tbl_origen = cells.origenDeDatosNombre + "Detail";
                var tableSource = cells.origenDeDatosNombre;
                if (tabladetalle[i].id === tbl_origen) {
                    detalles = true;

                    var origen = { "id": cells.origenDatos, "nombre": cells.origenDeDatosNombre };
                    var contedorBtn = divContenedor.querySelector('#containerBtnAdd' + tableSource);

                    var btnAgregar = contedorBtn.querySelector('#btnAgregar' + tableSource);
                    btnAgregar.setAttribute('onclick', "addValuetoDetail(" + cells.fileFormaCaptura + "," + JSON.stringify(origen) + ")");
                    if (tabladetalle[i].getAttribute('Agregar') !== "true") {
                        contedorBtn.style.display = "none";

                    }
                    //btnAgregar.setAttribute('onclick', "creardetalles(" + cells.fileFormaCaptura + "," + JSON.stringify(origen) + ")");//Modificado

                    //Create pagination here

                    //var contedorBtn = divContenedor.get('containerBtn' + tableSource);

                    // var btnAgregar = contedorBtn[0].getElementsByClassName('mainPanelContentComponents');
                    // var btnAgregar = contedorBtn[0].getElementsByClassName('mainPanelContentComponents');
                    // alert(document.getElementById("btnAgregarEstados"));
                    // btnAgregar[2].setAttribute('onclick', "creardetalles(" + cells.fileFormaCaptura + "," + JSON.stringify(origen) + ")");
                    //var dig

                    //                    var conteAnt = btnAgregar[0].parentNode;
                    //                    conteAnt.id = conteAnt.id + tabladetalle[i].id;
                    //                    var conteSig = btnAgregar[1].parentNode;
                    //                    conteSig.id = conteSig.id + tabladetalle[i].id;


                    // btnAgregar[0].id = btnAgregar[0].id + tabladetalle[i].id
                    //btnAgregar[1].id = btnAgregar[1].id + tabladetalle[i].id
                    i++;
                    break;
                }
            }


        }
    } else if (tipoComponentes === 2) {
        var tabladetalle = divContenedor.getElementsByClassName('dx-datagrid');
        var i = 0, cells;
        for (var r = 0; r < listaDetalles.length; r++) {
            cells = listaDetalles[r];
            while (i < tabladetalle.length) {
                var tbl_origen = cells.origenDeDatosNombre + "Detail";
                var tableSource = cells.origenDeDatosNombre;
                if (tabladetalle[i].firstChild.id === tbl_origen) {
                    detalles = true;
                    var origen = { "id": cells.origenDatos, "nombre": cells.origenDeDatosNombre };
                    var contedorBtn = divContenedor.querySelector('#containerBtnAdd' + tableSource);
                    var btnAgregar = contedorBtn.querySelector('#btnAgregar' + tableSource);
                    btnAgregar.setAttribute('onclick', "addValuetoDetail(" + cells.fileFormaCaptura + "," + JSON.stringify(origen) + ")");
                    //var origen = { "id": cells.origenDatos, "nombre": cells.origenDeDatosNombre };
                    //var contedorBtn = divContenedor.getElementsByClassName('btnTable' + tabladetalle[i].firstChild.id);
                    //var botones = contedorBtn[0].getElementsByClassName('DevExtreme');
                    //contedorBtn[0].className = "";
                    var datos = { "forma": cells.fileFormaCaptura, "origen": JSON.stringify(origen) };
                    detallesDeLaForma[tbl_origen] = datos;
                    //$(function () {

                    //    $('#' + botones[0].id).dxButton({
                    //        text: idioma.messageFormatter('btnAgregar')(),
                    //        onClick: function () {
                    //            // if (detalleNor) {
                    //            //   ocultarformacapture(false, false, false, true);
                    //            //} else {
                    //            creardetalles(cells.fileFormaCaptura, JSON.stringify(origen));
                    //            //}
                    //        }
                    //    });
                    //});
                    i++;
                    break;
                }
            }
        }
    }

}

function crearFormadeTblMovNonConcep() {


}

function createRadioButton(prop, divSelected, tipoDato, tipoCaptura, totalelemen, titulo, titulo2, valor) {
    /*var mainCompDiv = document.createElement('DIV');
     mainCompDiv.id = 'DI' + prop.nameGlobal;
     mainCompDiv.className = 'mainPanelContentComponents';
     mainCompDiv.style.width = prop.width + prop.displayIn;
     if (prop.height !== 'Vacio') {
     var pixels = null;
     if (prop.displayIn === "%") {
     pixels = parseInt(prop.height);
     } else {
     pixels = parseInt(prop.height);
     }
     mainCompDiv.style.height = pixels + "px";
     }*/
    var texto = titulo + titulo2;
    var addComp = document.createElement('INPUT');
    addComp.id = replaceAll(texto, " ", "");
    addComp.type = 'radio';
    addComp.name = 'idradio' + replaceAll(titulo, " ", "");
    // addComp.className = 'mainPanelContentComponents';
    // addComp.style.display = 'inline';
    if (prop.source) {
        addComp.setAttribute('source', prop.source);
        if (propSource) {
            setDataSourceGlobal(prop.source, addComp);
        }
    }
    if (tipoDato !== undefined) {
        addComp.setAttribute('tipoDato', tipoDato);
    }
    if (tipoCaptura !== undefined) {
        addComp.setAttribute('tipoCaptura', tipoCaptura);
    }
    if (totalelemen !== undefined) {
        addComp.setAttribute('totalelemen', totalelemen);
    }
    if (titulo !== undefined) {
        addComp.setAttribute('titulo', titulo);
    }
    if (valor !== undefined) {
        addComp.setAttribute('value', valor);
    }
    nameGlobal = (numberCompInsideDiv + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    prop.nameGlobal = nameGlobal;
    var idiv2 = document.createElement('DIV');
    idiv2.id = 'DivGroup' + prop.nameGlobal;
    if (prop.source) {
        idiv2.setAttribute('source', prop.source);
    }
    idiv2.className = "mainPanelDivGroup";
    idiv2.style.maxWidth = "100%";
    idiv2.style.width = "100%";
    // createDiv(addComp, prop);
    idiv2.appendChild(addComp);
    nameGlobal = 'T' + (numberCompInside + 1) + (divSelected === null ? '' : 'F' + divSelected.id);
    prop.nameGlobal = nameGlobal;
    var labelCheck = document.createElement('LABEL');
    labelCheck.id = replaceAll(texto, " ", "");
    labelCheck.setAttribute('for', replaceAll(texto, " ", ""));
    labelCheck.className = 'containerRadio';
    labelCheck.innerHTML = titulo2;
    labelCheck.style.display = 'inline';
    idiv2.appendChild(labelCheck);
    var compcheck = idiv2;

    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        compcheck.style.height = pixels + "px";
    }

    return compcheck;
}

function createLabel(prop, titulo) {
    var addComp = document.createElement('LABEL');
    addComp.id = "idtitulo";
    if (prop.source) {
        addComp.setAttribute('source', prop.source);
    }
    addComp.className = 'mainPanelContentComponents';
    addComp.style.width = prop.width + prop.displayIn;
    addComp.innerHTML = titulo;
    if (prop.height !== 'Vacio') {
        var pixels = null;
        if (prop.displayIn === "%") {
            pixels = parseInt(prop.height);
        } else {
            pixels = parseInt(prop.height);
        }
        addComp.style.height = pixels + "px";
    }
    return addComp;
}

function createButtonAceptar() {
    //var idivAgre = document.createElement('DIV');
    //idivAgre.id = 'ContenedoraAceptar';
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btnAceptar'
    addComp.className = 'mainPanelContentComponents defaultButton';
    // addComp.innerHTML = "Aceptar";
    addComp.innerHTML = idioma.messageFormatter('btnAceptar')();
    addComp.setAttribute('idetiqueta', 'btnAceptar');
    addComp.style.display = "inline";
    //if (detalle) {
    addComp.setAttribute('onclick', "agregarTablaGlobal()");
    //} else if (capture) {
    //addComp.setAttribute('onclick', "ocultarformacapture(true,false,false,false)");
    //} else if (busqueda) {
    //    addComp.setAttribute('onclick', "ocultarformacapture(false,false,true,false)");
    //} else if (capturaDetalle) {
    //    addComp.setAttribute('onclick', "ocultarformacapture(true,false,false,false)");
    //}
    //idivAgre.appendChild(addComp);
    return addComp;
}

function createButtonGuardar() {
    //  var idivAgre = document.createElement('DIV');
    // idivAgre.id = 'ContenedoraGuardar';
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btnGuardar';
    addComp.className = 'mainPanelContentComponents defaultButton';
    //addComp.innerHTML = "Guardar";
    //addComp.innerHTML = idioma.messageFormatter('btnGuardar')();
    addComp.setAttribute('idetiqueta', 'btnGuardar');
    addComp.style.display = "inline";
    //if (detalle) {
    addComp.setAttribute('onclick', "");
    //} else if (capture) {
    //addComp.setAttribute('onclick', "ocultarformacapture(true,false,false,false)");
    //} else if (busqueda) {
    //    addComp.setAttribute('onclick', "ocultarformacapture(false,false,true,false)");
    //} else if (capturaDetalle) {
    //    addComp.setAttribute('onclick', "ocultarformacapture(true,false,false,false)");
    //}
    //idivAgre.appendChild(addComp);
    var imgCan = document.createElement("img");
    imgCan.className = "imgBoton";
    imgCan.src = "img/Iconos/aceptar.png";
    addComp.appendChild(imgCan);
    var spanCan = document.createElement("span");
    spanCan.innerHTML = idioma.messageFormatter('btnGuardar')();
    addComp.appendChild(spanCan);
    return addComp;
}

function createButtonActualizar() {
    //  var idivAgre = document.createElement('DIV');
    // idivAgre.id = 'ContenedoraGuardar';
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btnActualizar'
    addComp.className = 'mainPanelContentComponents defaultButton';
    //  addComp.innerHTML = "Actualizar";
    //addComp.innerHTML = idioma.messageFormatter('btnActualizar')();
    addComp.setAttribute('idetiqueta', 'btnActualizar');
    addComp.style.display = "none";
    //if (detalle) {
    addComp.setAttribute('onclick', "");
    //} else if (capture) {
    //addComp.setAttribute('onclick', "ocultarformacapture(true,false,false,false)");
    //} else if (busqueda) {
    //    addComp.setAttribute('onclick', "ocultarformacapture(false,false,true,false)");
    //} else if (capturaDetalle) {
    //    addComp.setAttribute('onclick', "ocultarformacapture(true,false,false,false)");
    //}
    //idivAgre.appendChild(addComp);
    var imgCan = document.createElement("img");
    imgCan.className = "imgBoton";
    imgCan.src = "img/Iconos/editar.png";
    addComp.appendChild(imgCan);
    var spanCan = document.createElement("span");
    spanCan.innerHTML = idioma.messageFormatter('btnActualizar')();
    addComp.appendChild(spanCan);
    return addComp;
}

function createButtonContinuar(nametable) {
    //  var idivAgre = document.createElement('DIV');
    // idivAgre.id = 'ContenedoraGuardar';
    var addComp;
    if (tipoComponentes === 1) {
        addComp = document.createElement('BUTTON');
        addComp.id = 'btnContinuar';
        addComp.className = 'mainPanelContentComponents';
        addComp.innerHTML = idioma.messageFormatter('btnContinuar')();
        addComp.setAttribute('idetiqueta', 'btnContinuar');
        addComp.setAttribute('onclick', "buscaPorFiltrosMasiva('" + nametable + "')");
    } else if (tipoComponentes === 2) {
        addComp = document.createElement('div');
        addComp.id = "buttonContinuar";
        addComp.style.marginBottom = "15px";

    }
    return addComp;
}

function addparametrosConcep(param) {
    parametrosconcep = param;
}

function crearComponentesParametros() {
    var con = document.getElementById('ContenedorBtnTableDetalle');

    //con.parentNode.insertBefore(createButtonContinuar(configCap.origenDeDatos.nombre), con);
    // if (document.getElementById("ContPara")) {
    var divCont;
    if (!document.getElementById("ContPara")) {
        divCont = document.createElement("DIV");
        divCont.id = "ContPara";
        divCont.style.width = "100%";
        divCont.style.maxWidth = "100%";
        divCont.className = "mainPanelDivGroup";
    } else {
        divCont = document.getElementById("ContPara");
        while (divCont.firstChild) {
            divCont.removeChild(divCont.firstChild);
        }
    }
    // var 

    for (var i = 0; i < parametrosconcep.length; i++) {
        var div = document.createElement("DIV");
        div.className = "mainPanelDivGroup";
        div.style.width = "100%";
        div.style.maxWidth = "30%";
        var label = document.createElement("LABEL");
        label.id = parametrosconcep[i]['id'] + parametrosconcep[i]['descripcion'];
        label.innerText = parametrosconcep[i]['descripcion'];
        div.appendChild(label);
        var cajaText = document.createElement("INPUT");
        cajaText.className = "mainPanelContentComponents";
        if (parametrosconcep[i]['tipo'] === "INTEGER") {
            cajaText.type = "text";

        } else if (parametrosconcep[i]['tipo'] === "STRING") {
            cajaText.type = "text";
        }
        cajaText.id = parametrosconcep[i]['descripcion'] + parametrosconcep[i]['id'];
        cajaText.style.width = "100%";
        cajaText.setAttribute('persist', parametrosconcep[i]['descripcion']);
        cajaText.setAttribute('isparam', 'true');
        cajaText.setAttribute('source', parametrosconcep[i]['id']);
        div.appendChild(cajaText);
        divCont.appendChild(div);
        // con.parentNode.insertBefore(div, con);
    }
    if (con) {
        con.parentNode.insertBefore(divCont, con);
    }
    if (parametrosconcep.length > 0) {
        createTableMovNomConcepDeta(parametrosconcep);
    }
    //  }

}
function createTableMovNomConcepDeta(parametros) {
    var table = $("table[persist='" + "MovNomConcep" + "']")[1]
    var rowCount = table.rows;
    var cols = rowCount[0].cells;
    var campostable = new Array();
    var resultado = ConcepNomiDefiPorClave();
    //var parametros = resultado['paraConcepDeNom'];
    addparametrosConcep(parametros);
    for (var i = 0; i < cols.length; i++) {
        //if (cols[i].innerText === "empleado_ID" || cols[i].innerText === "empleado" || cols[i].innerText === "nombre") {
        // if (cols[i].innerText === "empleado_ID") {
        //   campostable[campostable.length] = "empleado";
        // campostable[campostable.length] = "nombre";
        //} else if (cols[i].innerText === "empleado" || cols[i].innerText === "nombre") {
        if (cols[i].getAttribute('fieldsource')) {
            campostable[campostable.length] = cols[i].innerText;
        }
        //campostable[campostable.length] = cols[i].innerText;
        //}

        //}
    }
    if (parametros.length > 0) {
        for (var i = 0; i < 3; i++) {
            if (i < parametros.length) {
                campostable[campostable.length] = parametros[i]['descripcion'];
            }

        }
    }
    //campostable[campostable.length] = 'Editar';
    //campostable[campostable.length] = 'Eliminar';
    var hilera = document.createElement("tr");
    var hilera2 = document.createElement("tr");
    for (var j = 0; j < campostable.length; j++) {
        var th = document.createElement("th");
        var th2 = document.createElement("th");
        var textoth = document.createTextNode(campostable[j]);
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].innerText === campostable[j]) {
                if (cols[i].getAttribute('persist')) {
                    th.setAttribute('persist', cols[i].getAttribute('persist'));
                }
            }
        }
        var textoth2 = document.createTextNode("");
        th.appendChild(textoth);
        th2.appendChild(textoth2);
        hilera.appendChild(th);
        // hilera2.appendChild(th2);
    }

    table.deleteRow(0);
    table.appendChild(hilera);
    // table.appendChild(hilera2);

    console.log(campostable);


}
function createButtonEliminar(busqueda) {
    var addComp = document.createElement('BUTTON');
    addComp.id = 'btnEliminar';
    addComp.className = 'mainPanelContentComponents defaultButton';
    addComp.setAttribute('idetiqueta', 'btnEliminar');

    if (busqueda) {
        addComp.style.display = "none";
    } else {
        addComp.style.display = "inline";
    }
    addComp.setAttribute('onclick', "");
    //} else if (capture) {
    //addComp.setAttribute('onclick', "ocultarformacapture(true,false,false,false)");
    //} else if (busqueda) {
    //    addComp.setAttribute('onclick', "ocultarformacapture(false,false,true,false)");
    //} else if (capturaDetalle) {
    //    addComp.setAttribute('onclick', "ocultarformacapture(true,false,false,false)");
    //}
    //idivAgre.appendChild(addComp);
    var imgCan = document.createElement("img");
    imgCan.className = "imgBoton";
    imgCan.src = "img/Iconos/eliminar.png";
    addComp.appendChild(imgCan);
    var spanCan = document.createElement("span");
    spanCan.innerHTML = idioma.messageFormatter('btnEliminar')();
    addComp.appendChild(spanCan);
    return addComp;
}
//funciones para componentes devExtreme crear y agregarles metodos o atributos
function crearSelectBox(activaSelect) {
    var table = "";
    var conte = document.getElementById('ContenedorPrincipal');

    var element = conte.querySelectorAll('div[persist]');

    for (var i = 0; i < element.length; i++) {
        $('#' + element[i].id).dxSelectBox({
            dataSource: [""],
            searchEnabled: true,
            placeholder: "Seleciona",
        });
        if (propSource || propSourceDetalle) {

            var keyDataSource;// = JSON.stringify(propSource[element[i].getAttribute('source')]);
            var keySrc;// = JSON.parse(keyDataSource);
            if (propSource[element[i].getAttribute('source')]) {
                keyDataSource = JSON.stringify(propSource[element[i].getAttribute('source')]);
                keySrc = JSON.parse(keyDataSource);
            } else if (propSourceDetalle[element[i].getAttribute('source')]) {
                keyDataSource = JSON.stringify(propSourceDetalle[element[i].getAttribute('source')]);
                keySrc = JSON.parse(keyDataSource);
            }
            if (keySrc["requerido"]) {
                //    sele.inputAttr({ required: keySrc["requerido"] });
                $("#" + element[i].id + " input").attr("required", keySrc["requerido"]);
            }
            if (keySrc["llave"]) {
                //sele.inputAttr({ isKey: keySrc["llave"] });
                $("#" + element[i].id + " input").attr("isKey", keySrc["llave"]);
                // element.setAttribute("isKey", keySrc["llave"]);
            }
            //var datos = new Array();
            //if (keySrc["campo"]) {
            //    var campo = keySrc["campo"].toString();
            //    if (campo.includes("_ID")) {
            //        table = campo.replace("_ID", "");
            //        table = table.charAt(0).toUpperCase() + table.slice(1);
            //        if (table === "Empleado") {
            //            table = table + "s";
            //        }
            //        $("#" + element[i].id + " input").attr("Table", table);
            //        var resultado = undefined;
            //        if (keySrc["campo"] !== "periodosNomina_ID" && keySrc["campo"] !== "concepNomDefi_ID") {
            //            resultado = searchAll(table);
            //        }
            //        if (resultado !== undefined && resultado.length > 0) {

            //            var configCaptura = JSON.parse(keySrc['configuracionTipoCaptura']);
            //            var valores = configCaptura['origenes'];
            //            for (var j = 0; j < resultado.length; j++) {
            //                if (campo === 'tipoNomina_ID' || campo === 'tipoCorrida_ID') {
            //                    if (valores['campovalor1'] !== "" && valores['campovalor2'] !== "") {
            //                        var datos2 = {};
            //                        datos2['id'] = resultado[j]['id'];
            //                        datos2[valores['campovalor1'] + valores['campovalor2']] = resultado[j][valores['campovalor1']] + "-" + resultado[j][valores['campovalor2']];
            //                        datos[j] = datos2;
            //                        $('#' + element[i].id).dxSelectBox({
            //                            valueExpr: "id",
            //                            displayExpr: valores['campovalor1'] + valores['campovalor2'],
            //                            valueChangeEvent: 'id',
            //                            searchEnabled: true

            //                        });
            //                    } else if (valores['campovalor1'] !== "") {
            //                        var datos2 = {};
            //                        datos2['id'] = resultado[j]['id'];
            //                        datos2[valores['campovalor1']] = resultado[j][valores['campovalor1']];

            //                        datos[i] = datos2;
            //                        $('#' + element[i].id).dxSelectBox({
            //                            valueExpr: "id",
            //                            displayExpr: valores['campovalor1'],
            //                            valueChangeEvent: 'id',
            //                            searchEnabled: true

            //                        });
            //                    } else {
            //                        var datos2 = {};
            //                        datos2['id'] = resultado[j]['id'];
            //                        datos2['descripcion'] = resultado[j]['descripcion'];

            //                        datos[j] = datos2;
            //                        $('#' + element[i].id).dxSelectBox({
            //                            valueExpr: "id",
            //                            displayExpr: "descripcion",
            //                            valueChangeEvent: 'id',
            //                            searchEnabled: true

            //                        });
            //                    }
            //                } else {
            //                    if (tabla === 'Empleados') {
            //                        if (valores['campovalor1'] !== "" && valores['campovalor2'] !== "") {
            //                            var datos2 = {};
            //                            datos2['id'] = resultado[j]['id'];
            //                            datos2[valores['campovalor1'] + valores['campovalor2']] = resultado[j][valores['campovalor1']] + "-" + resultado[j][valores['campovalor2']];
            //                            datos[j] = datos2;
            //                            $('#' + element[i].id).dxSelectBox({
            //                                valueExpr: "id",
            //                                displayExpr: valores['campovalor1'] + valores['campovalor2'],
            //                                valueChangeEvent: 'id',
            //                                searchEnabled: true

            //                            });
            //                        } else if (valores['campovalor1'] !== "") {
            //                            var datos2 = {};
            //                            datos2['id'] = resultado[i]['id'];
            //                            datos2[valores['campovalor1']] = resultado[j][valores['campovalor1']];

            //                            datos[j] = datos2;
            //                            $('#' + element[i].id).dxSelectBox({
            //                                valueExpr: "id",
            //                                displayExpr: valores['campovalor1'],
            //                                valueChangeEvent: 'id',
            //                                searchEnabled: true

            //                            });
            //                        } else {
            //                            var datos2 = {};
            //                            datos2['id'] = resultado[j]['id'];
            //                            datos2['nombre'] = resultado[j]['nombre'];

            //                            datos[j] = datos2;
            //                            $('#' + element[i].id).dxSelectBox({
            //                                valueExpr: "id",
            //                                displayExpr: "nombre",
            //                                valueChangeEvent: 'id',
            //                                searchEnabled: true

            //                            });
            //                        }

            //                    } else {

            //                        if (valores['campovalor1'] !== "" && valores['campovalor2'] !== "") {
            //                            var datos2 = {};
            //                            datos2['id'] = resultado[j]['id'];
            //                            datos2[valores['campovalor1'] + valores['campovalor2']] = resultado[j][valores['campovalor1']] + "-" + resultado[j][valores['campovalor2']];
            //                            datos[j] = datos2;
            //                            $('#' + element[i].id).dxSelectBox({
            //                                valueExpr: "id",
            //                                displayExpr: valores['campovalor1'] + valores['campovalor2'],
            //                                valueChangeEvent: 'id',
            //                                searchEnabled: true

            //                            });
            //                        } else if (valores['campovalor1'] !== "") {
            //                            var datos2 = {};
            //                            datos2['id'] = resultado[j]['id'];
            //                            datos2[valores['campovalor1']] = resultado[j][valores['campovalor1']];

            //                            datos[j] = datos2;
            //                            $('#' + element[i].id).dxSelectBox({
            //                                valueExpr: "id",
            //                                displayExpr: valores['campovalor1'],
            //                                valueChangeEvent: 'id',
            //                                searchEnabled: true

            //                            });
            //                        } else {
            //                            var datos2 = {};
            //                            datos2['id'] = resultado[j]['id'];
            //                            datos2['descripcion'] = resultado[j]['descripcion'];

            //                            datos[j] = datos2;
            //                            $('#' + element[i].id).dxSelectBox({
            //                                valueExpr: "id",
            //                                displayExpr: "descripcion",
            //                                valueChangeEvent: 'id',
            //                                searchEnabled: true

            //                            });
            //                        }

            //                    }
            //                }
            //            }
            //            //console.log(element[i].getAttribute('Selector'));
            //            if (element[i].getAttribute('Selector') === "true") {
            //                $('#' + element[i].id).dxSelectBox({
            //                    dataSource: datos,
            //                    searchEnabled: true,
            //                    onValueChanged: function(e) {
            //                        busquedaFiltros(table, activaSelect);
            //                    }

            //                });
            //            } else {
            //                $('#' + element[i].id).dxSelectBox({
            //                    dataSource: datos,
            //                    searchEnabled: true,
            //                    //onValueChanged: function (e) {
            //                    //    busquedaFiltros(table, activaSelect);
            //                    //}

            //                });
            //            }
            //        }
            //    } else {
            //        var configu = JSON.parse(keySrc['configuracionTipoCaptura']);
            //        if (configu['tipoCaptura'] === "2") {
            //            var valores = configu['lista'];
            //            for (var j = 0; j < valores.length; j++) {
            //                var datos2 = {};
            //                datos2['id'] = valores[j];
            //                datos2[valores[j]] = valores[j];

            //                datos[j] = datos2;
            //                //  datos[i] = valores[i];
            //            }
            //            $('#' + element[i].id).dxSelectBox({
            //                dataSource: datos,
            //                searchEnabled: true,
            //                valueExpr: "id",
            //                valueChangeEvent: 'id'
            //                        //onValueChanged: function (e) {
            //                        //    busquedaFiltros(table, activaSelect);
            //                        //}

            //            });
            //        } else if (configu['tipoCaptura'] === "3") {
            //            var valores = configu['equivalencias'];
            //            for (var key in valores) {
            //                var datos2 = {};
            //                datos2['id'] = key;
            //                datos2[valores[key]] = valores[key];

            //                //datos[j] = datos2;
            //                datos[datos.length] = datos2;
            //            }
            //        }
            //        $('#' + element[i].id).dxSelectBox({
            //            dataSource: datos,
            //            searchEnabled: true,
            //            valueExpr: "id",
            //            valueChangeEvent: 'id'
            //                    //onValueChanged: function (e) {
            //                    //    busquedaFiltros(table, activaSelect);
            //                    //}

            //        });

            //    }

            //}

        }

        $("#" + element[i].id + " input").attr("source", element[i].getAttribute('source'));
        $("#" + element[i].id + " input").attr("persist", element[i].getAttribute('persist'));
    }



}
function crearCajatexto(conte) {
    var table = "";
    // var conte = document.getElementById('ContenedorPrincipal');

    var element = conte.querySelectorAll('div[tipo]');
    if (propSource || propSourceDetalle) {

        for (var i = 0; i < element.length; i++) {
            var keyDataSource;
            var keySrc;

            if (propSource[element[i].getAttribute('source')]) {
                keyDataSource = JSON.stringify(propSource[element[i].getAttribute('source')]);
                keySrc = JSON.parse(keyDataSource);
            } else if (propSourceDetalle) {
                if (propSourceDetalle[element[i].getAttribute('source')]) {
                    keyDataSource = JSON.stringify(propSourceDetalle[element[i].getAttribute('source')]);
                    keySrc = JSON.parse(keyDataSource);
                }
            }

            //var keyDataSource = JSON.stringify(propSource[element[i].getAttribute('source')]);
            //var keySrc = JSON.parse(keyDataSource);
            if (element[i].getAttribute('tipo') === "TextBox") {
                var ancho = element[i].parentNode.style.maxWidth;
                $('#' + element[i].id).dxTextBox({
                    // width: ancho + "%"
                    width: ancho
                    //  placeholder: "Ingrese " + keySrc["campo"]
                });
                if (keySrc["llave"]) {
                    //element.setAttribute("isKey", keySrc["llave"]);
                    $("#" + element[i].id + " input").attr("isKey", keySrc["llave"]);
                }
                if (keySrc["requerido"]) {
                    // element.setAttribute("required", keySrc["requerido"]);

                    $("#" + element[i].id + " input").attr("required", keySrc["requerido"]);

                }

                if (keySrc["campo"]) {
                    // element.setAttribute("persist", keySrc["campo"]);
                    $("#" + element[i].id + " input").attr("persist", keySrc["campo"]);
                }
                var configCaptura = JSON.parse(keySrc['configuracionTipoCaptura']);
                var expresion = configCaptura['expresion'];
                var maxcar = configCaptura['maxcar'];
                if (maxcar !== "") {
                    // element.setAttribute("maxlength", maxcar);
                    $("#" + element[i].id + " input").attr("maxlength", maxcar);
                }
                if (expresion !== "") {
                    //element.setAttribute("pattern", maxcar);
                    $("#" + element[i].id + " input").attr("pattern", expresion);
                }
            } else if (element[i].getAttribute('tipo') === "CheckBox") {
                $('#' + element[i].id).dxCheckBox({
                    value: false
                });
                if (keySrc["llave"]) {
                    //element.setAttribute("isKey", keySrc["llave"]);
                    $("#" + element[i].id + " input").attr("isKey", keySrc["llave"]);
                }
                if (keySrc["requerido"]) {
                    // element.setAttribute("required", keySrc["requerido"]);

                    $("#" + element[i].id + " input").attr("required", keySrc["requerido"]);

                }

                if (keySrc["campo"]) {
                    // element.setAttribute("persist", keySrc["campo"]);
                    $("#" + element[i].id + " input").attr("persist", keySrc["campo"]);
                }

            }
        }
    }
}
function crearBotonAgregar(detalleNor) {

    if (document.getElementById('buttonAgregar')) {
        var elemet = document.getElementById('buttonAgregar');

        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnAgregar')(),
            onClick: function () {
                if (detalleNor) {
                    ocultarformacapture(false, false, false, true);
                } else {
                    ocultarformaSelect();
                }
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnAgregar');
    }
    if (document.getElementById('buttonAgregarDetalleNor')) {
        var elemet = document.getElementById('buttonAgregarDetalleNor');

        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnAgregar')(),
            onClick: function () {
                //  if (detalleNor) {
                ocultarformacapture(false, false, false, true);
                // } else {
                //   ocultarformaSelect();
                //}
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnAgregar');
    }
    if (document.getElementById('buttonAgregarMasiva')) {
        var elemet = document.getElementById('buttonAgregarMasiva');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnAgregar')(),
            onClick: function () {
                agregar()
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnAgregar');
    }
}
function crearBotonCancelar() {
    if (document.getElementById('buttonCancelarSearch')) {
        var elemet = document.getElementById('buttonCancelarSearch');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnCancelar')(),
            onClick: function () {
                ocultarformacapture(false, false, true, false);
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnCancelar');
    }
    if (document.getElementById('buttonCancelarSelect')) {
        var elemet = document.getElementById('buttonCancelarSelect');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnCancelar')(),
            onClick: function () {
                ocultarformacapture(true, false, false, false);
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnCancelar');
    }
    if (document.getElementById('buttonCancelarLimpiar')) {
        var elemet = document.getElementById('buttonCancelarLimpiar');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnCancelar')(),
            onClick: function () {
                clearObjetosgen();
            },
            elementAttr: { "id": "btnLimpiar" },
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnCancelar');
    }
    if (document.getElementById('buttonCancelarDetalleMasiva')) {
        var elemet = document.getElementById('buttonCancelarDetalleMasiva');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnCancelar')(),
            onClick: function () {
                ocultarformacapture(true, false, false, false);
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnCancelar');
    }
    if (document.getElementById('buttonCancelarDetalleNor')) {
        var elemet = document.getElementById('buttonCancelarDetalleNor');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnCancelar')(),
            onClick: function () {
                ocultarformacapture(false, true, false, false);
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnCancelar');
    }
}
function crearBotonGuardar() {
    if (document.getElementById('buttonGuardarSaveOrUpdate')) {
        var elemet = document.getElementById('buttonGuardarSaveOrUpdate');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnGuardar')(),
            onClick: function () {
                saveOrUpdate();
            }
        });

        $('#' + elemet.id).attr('idetiqueta', 'btnGuardar');
    }
    if (document.getElementById('buttonGuardarSave')) {
        var elemet = document.getElementById('buttonGuardarSave');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnGuardar')(),
            onClick: function () {
                save();
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnGuardar');
    }

    if (document.getElementById('buttonGuardarSaveMasiva')) {
        var elemet = document.getElementById('buttonGuardarSaveMasiva');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnGuardar')(),
            onClick: function () {
                SaveMasiva();
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnGuardar');
    }
    if (document.getElementById('buttonGuardarSaveDetalles')) {
        var elemet = document.getElementById('buttonGuardarSaveDetalles');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnGuardar')(),
            onClick: function () {
                save();
            }
        });

        $('#' + elemet.id).attr('idetiqueta', 'btnGuardar');
    }
}
function crearBotonAceptar() {
    if (document.getElementById('buttonAceptarDetalleMasiva')) {
        var elemet = document.getElementById('buttonAceptarDetalleMasiva');

        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnAceptar')(),
            onClick: function () {
                agregarTablaGlobal();
                //if (detalleNor) {
                //    ocultarformacapture(false, false, false, true);
                //} else {
                //    ocultarformaSelect();
                //}
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnAceptar');
    }
    if (document.getElementById('buttonAceptarDetalleNor')) {
        var elemet = document.getElementById('buttonAceptarDetalleNor');

        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnAceptar')(),
            onClick: function () {
                saveDetalles();
                // agregarTablaGlobal();
                //if (detalleNor) {
                //    ocultarformacapture(false, false, false, true);
                //} else {
                //    ocultarformaSelect();
                //}
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnAceptar');
    }
}
function crearBotonActualizar() {

    if (document.getElementById('buttonActualizar')) {
        var elemet = document.getElementById('buttonActualizar');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnActualizar')(),
            onClick: function () {
                update();
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnActualizar');
    }
}
function crearBotonEliminar() {

    if (document.getElementById('buttonEliminarDetalle')) {
        var elemet = document.getElementById('buttonEliminarDetalle');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnEliminar')(),
            onClick: function () {
                saveDetalles();
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnEliminar');
    }
    if (document.getElementById('buttonEliminarNormal')) {
        var elemet = document.getElementById('buttonEliminarNormal');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnEliminar')(),
            onClick: function () {
                deleteObject();
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnEliminar');
    }
}
function crearBotonContinuar() {
    if (document.getElementById('buttonContinuar')) {
        var elemet = document.getElementById('buttonContinuar');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnContinuar')(),
            onClick: function () {
                buscaPorFiltrosMasiva(nametable);
                //if (detalleNor) {
                //    ocultarformacapture(false, false, false, true);
                //} else {
                //    ocultarformaSelect();
                //}
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnContinuar');
    }
}
function crearBotonBuscar() {
    if (document.getElementById('buttonBuscar')) {
        var elemet = document.getElementById('buttonBuscar');
        $('#' + elemet.id).dxButton({
            text: idioma.messageFormatter('btnBuscar')(),
            onClick: function () {
                abrirFormaBusqueda();
            }
        });
        $('#' + elemet.id).attr('idetiqueta', 'btnBuscar');
    }
}
function crearGrid() {
    var grids = document.querySelectorAll('.dx-datagrid');
    for (var i = 0; i < grids.length; i++) {
        var hijo = grids[i].firstChild;
        var table = $('#' + hijo.id).dxDataGrid({
            showBorders: true,
            noDataText: "No Hay Datos",
            paging: {
                pageSize: 10

            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [5, 10, 20],
                showNavigationButtons: true,
                showInfo: true,
                infoText: "Pagina {0}. Total: {1} ({2} datos)"
            }
        }).dxDataGrid("instance");
        var columnasadd = columnasTablasobj[hijo.id];
        var columns = table.option("columns");
        for (var j = 0; j < columnasadd.length; j++) {
            table.addColumn({ caption: columnasadd[j]['texto'], dataField: columnasadd[j]['valor'], visibleIndex: j });
        }

    }
}
function getParametrosProcesoOrigen(id) {
    var getData = "";
    var url = route + "/api/ProcesoOrigen/ParametrosProcesoOrigenDict";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        getData = Mensaje.resultado;
    }
    if (getData) {
        return getData;
    }
}

function isObject(val) {
    return val instanceof Object;
}

function getCamposOrigen(originData) {
    var infoOrigin = new Object();
    var isObj = isObject(originData);
    if (isObj) {
        infoOrigin = originData;
    } else {
        infoOrigin.id = originData;
    }

    var getData = "";
    var url = route + "/api/FormasCaptura/CamposOrigenDatos";
    var dataToPost = JSON.stringify(infoOrigin);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado !== null) {
        if (isObj) {
            getData = Mensaje.resultado;
        }
    }
    if (getData) {
        return getData;
    }
}

function getAccionesProcesoOrigen(id) {
    var getData = "";
    var url = route + "/api/ProcesoOrigen/getAccionesProcesoOrigen";
    var dataToPost = JSON.stringify(id);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        alert("No object");
    } else {
        getData = Mensaje.resultado;
    }
    if (getData) {
        return getData;
    }

}

function replaceAll(text, busca, reemplaza) {
    while (text.toString().indexOf(busca) != -1)
        text = text.toString().replace(busca, reemplaza);
    return text;
}