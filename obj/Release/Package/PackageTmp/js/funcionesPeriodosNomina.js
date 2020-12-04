var fechaSistemas;
var tipoCorrida = null;
var tipoNomina = null;
var getData = new Array();
var periodosNomina = new Array();
var addPeriodosNomina = new Array();
var deletePeriodosNomina = new Array();
var aplicaAjuste = false;
var fechaBase = null;
var fechaInicioPeriodo = null;
var isClicAceptar = false;
var continua = false;
var c = new Date();//This is the assigment date warning!!
var identificador = false;
var fechaComparar = null;
var dias;
var año;
var ajusta = false;
var tc;
var usuario = null;
var acumulaMes = new Date();
var finicial = new Date();
var ffinal = new Date();
var fcierre = new Date();
var fpago = new Date();
var calendarito = new Date();
var periodoNominaAux = {};
var cierreMesCambio = false;
var idSelecionado = "";
var periodoAgregado = false;
var mode = "ADD";
var start = 0;
var end = 10;
jQuery(document).ready(function () {
    startCustomTools();
    OpenTable(document.getElementById('PeriodosNomina'));
    InitEventsTable();
    fechaSistemas = getFechaSistema();
    document.getElementById("txtEjercicio").value = fechaSistemas.getFullYear();
   // console.log(fechaSistemas.getMonth());
    setEditObject("editTipoCorrida", "PER");
    var fecha = formatDate(fechaSistemas);
    $("#txtEjercicio").on('keydown', function (e) {
        if (e.keyCode === 9 || e.keyCode === 13) {
            valorSelecionado();
        }
    });

  

    activarEdicion(true);
    usuario = getUsuario();
   // console.log(usuario);
});
function addEventoRenglon() {
    $(".hidetd").click(function () {
        $('.bodytr').find('tr').removeClass("selected");
        
        $(this).addClass('selected');
        var tr = $(this);
        idSelecionado = tr[0].id;
      //  console.log(idSelecionado);
     
    });
}

function getUsuario() {
    var url = route + "/api/PeriodosNomina/getClaveUser";
    //var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {

        return null;
    } else {

        return Mensaje.resultado;
    }
}

function mostrarFormaCaptura(ocultar) {
    if (!ocultar) {
        if (tipoNomina === null) {
            alert("el tipo de nomina no debe estar vacio");
        } else {
            mode = "ADD";
            document.getElementById("txtClave").value = textformateaValorAMascara(getData.length + 1, "###");
            document.getElementById("txtFechaInicial").value = formatDate(fechaSistemas);
            document.getElementById("txtFechaFinal").value = formatDate(fechaSistemas);
            document.getElementById("txtFechaPago").value = formatDate(fechaSistemas);
            document.getElementById("txtFechaAsistenciaInicial").value = formatDate(fechaSistemas);
            document.getElementById("txtFechaAsistenciaFinal").value = formatDate(fechaSistemas);
            document.getElementById("txtDiasPago").value = 0;
            document.getElementById("txtDiasIMSS").value = 0;
            document.getElementById("chkCierreMes").disabled = true;
            document.getElementById("txtStatus").disabled = true;
            document.getElementById("txtStatus").value = "Alta";
            document.getElementById("txtFechaModificado").disabled = true;
            document.getElementById("txtFechaModificado").value =formatDatemmddyyy(fechaSistemas);
            document.getElementById("txtUsuario").disabled = true;
            document.getElementById("txtUsuario").value = usuario.clave;
            document.getElementById("selAcumulaMes").value = fechaSistemas.getMonth().toString();
            document.getElementById("txtTipoNomina").value = tipoNomina.Descripcion;
            document.getElementById("txtTipoNomina").disabled = true;
            initDefaultPeriodo();
            document.getElementById("con1").style.display = "none";
            document.getElementById("con2").style.display = "block";
            document.getElementById("Gruopbotones").style.display = "none";
        }
    } else {
        document.getElementById("con1").style.display = "block";
        document.getElementById("con2").style.display = "none";
        document.getElementById("Gruopbotones").style.display = "block";
    }
}

function setEditTipoNomina() {
    nameCmp = "EditTipoNomina";
    table = "TipoNomina";
    nameCols = "Clave,Descripcón,Periodicidad";
    campos = "clave,descripcion,periodicidad.descripcion";//Quit ID;
    camposObtener = "clave,descripcion,periodicidad.descripcion,periodicidad.dias";
    var subEntities = "periodicidad"; //Unnecesary
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Tipo Nomina";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditTipoNominaShow(values) {
    if (values !== null) {
        //console.log(values);
        tipoNomina = values[0];
        valorSelecionado();
    }
}

function setEditTipoCorrida() {
    nameCmp = "EditTipoCorrida";
    table = "TipoCorrida";
    nameCols = "Clave,Descripcón";
    campos = "clave,descripcion";//Quit ID;
    camposObtener = "clave,descripcion,usaCorrPeriodica";
    //var subEntities = "periodicidad"; //Unnecesary
    camposMostrar = ["clave", "descripcion"];
    var tituloSel = "Tipo corrida";
    var tamañoSel = "size-2";
    return buildParametersEditModal(nameCmp, table, nameCols, campos,
        typeof subEntities === 'undefined' ? null : subEntities, camposMostrar,
        typeof preFilters === 'undefined' ? null : preFilters,
        typeof filtersSearch === 'undefined' ? null : filtersSearch,
        typeof camposObtener === 'undefined' ? null : camposObtener, tituloSel, tamañoSel);
}

function setEditTipoCorridaShow(values) {
    if (values !== null) {
        // console.log(values);
        tipoCorrida = values[0];
        valorSelecionado();
    }
}

function valorSelecionado() {
    if (document.getElementById("txtEjercicio").value !== "" && tipoNomina !== null && tipoCorrida !== null) {
        activarEdicion(false);

        if (tipoCorrida.UsaCorrPeriodica) {
            if (tipoCorrida.Clave === "PER") {
                generarPeriodos(tipoCorrida);
            } else {
                //consulta
                var listaPeriodosNomina = getPeriodosNominaPorAñoYTipoNominaYTipoCorrida(parseInt(document.getElementById("txtEjercicio").value), tipoCorrida.Clave, tipoNomina.Clave);
                if (listaPeriodosNomina.length === 0) {
                    alert("Esta sincronizada con la corrida periódica ocupa generar los periodos de la corrida periódica ");
                } else {
                    activarEdicion(true);
                    generarPeriodos(null);
                }
            }
        } else {
            generarPeriodos(null);
        }
    }
}

function activarEdicion(valor) {
    //document.getElementById("btnModificarPER").disabled = valor;
    document.getElementById("btnAgregarPER").disabled = valor;
}

function generarPeriodos(corrida) {
    if (getData.length > 0) {
        if (getData[0].año === parseInt(document.getElementById("txtEjercicio").value) && getData[0].tipoNomina_ID === tipoNomina.Id) {
            return;
        }
    }
   
    limpiarComponentesForma();
    if (corrida !== null) {
        tc = corrida;
    } else {
        tc = tipoCorrida;
    }
    getData = new Array();
    var periodosAux = getPeriodosNominaPorAñoYTipoNominaYTipoCorrida(parseInt(document.getElementById("txtEjercicio").value), tc.Clave, tipoNomina.Clave);


    if (periodosAux.length === 0 && tc.UsaCorrPeriodica) {
        console.log(periodosAux);
        dias = parseInt(tipoNomina.Periodicidaddias);
        var yearCalculate = parseInt(document.getElementById("txtEjercicio").value);

        var d = null;

        var mifecha = new Date();
        var backToFoward = false;
        var listperiodosNomina = new Array();
        if (dias === 30 || dias === 15) {
            listperiodosNomina = getPeriodosNominaPorAñoYTipoNominaYTipoCorrida(yearCalculate, tc.Clave, tipoNomina.Clave);
        } else {
            listperiodosNomina = getPeriodosNominaPorAñoYTipoNominaYTipoCorrida(yearCalculate + 1, tc.Clave, tipoNomina.Clave);
            if (listperiodosNomina.length === 0) {
                listperiodosNomina = getPeriodosNominaPorAñoYTipoNominaYTipoCorrida(yearCalculate - 1, tc.Clave, tipoNomina.Clave);
            } else {
                backToFoward = true;
            }

            if (!backToFoward) {
                var fecMax = ObtenerFechaFinalMax(tipoNomina.Clave, tc.Clave, yearCalculate - 1);
                if (fecMax !== null) {
                    d = new Date(fecMax);
                    //d = new Date(yearCalculate, d.getMonth(), d.getDate());
                }
            }
        }
        if (listperiodosNomina.length > 0 && d === null) {
            if (dias !== 30 && dias !== 15) {
                identify = true;
                if (!backToFoward) {
                    var fechaMax = ObtenerFechaFinalMax(tipoNomina.Clave, tc.Clave, yearCalculate + 1);
                    if (fechaMax !== null) {
                        d = new Date(fechaMax);
                        //d = new Date(yearCalculate, d.getMonth(), d.getDate());
                        fechaComparar = new Date(fechaMax);
                        //fechaComparar = new Date(yearCalculate, fechaComparar.getMonth(), fechaComparar.getDate());
                    }


                    mifecha = new Date(d.getFullYear, d.getMonth(), d.getDate() - 1);
                    var calendar = new Date(yearCalculate, 1, 1);
                    var diasatras = 0;
                    if (((yearCalculate % 4 === 0) && (yearCalculate % 100 !== 0)) || (yearCalculate % 400 === 0)) {
                        diasatras = 366;
                    } else {
                        diasatras = 365;
                    }

                    for (var j = 0; j < diasatras; j--) {
                        if ((j % dias) === 0) {
                            mifecha = new Date(mifecha.getFullYear(), mifecha.getMonth(), mifecha.getDate() - dias);
                            if (mifecha.getFullYear() === (yearCalculate - 1)) {
                                mifecha = new Date(mifecha.getFullYear(), mifecha.getMonth(), dias);
                                break;
                            }
                        }
                    }

                    d = new (mifecha.getFullYear(), mifecha.getMonth(), mifecha.getDay());

                } else {
                    var fecMax1 = ObtenerFechaFinalMax(tipoNomina.Clave, tc.Clave, yearCalculate - 1);
                    if (fecMax1 !== null) {
                        d = new Date(fecMax1);
                        //d = new Date(yearCalculate, d.getMonth(), d.getDate());
                    }
                    var fechaMin = ObtenerFechaFinalMin(tipoNomina.Clave, tc.Clave, yearCalculate + 1);
                    if (fechaMin !== null) {
                        fechaComparar = new Date(fechaMin);
                        //fechaComparar = new Date(yearCalculate, fechaComparar.getMonth(), fechaComparar.getDate());
                    }
                }
            }
        }

        año = parseInt(document.getElementById("txtEjercicio").value);
        //var p15 = 0;
        //var ajustaPeriodo = 0;
        //var dias2;
        //var continuar = true;

        //var fechaInicial = new Date();

        //var fechaFinal = new Date();
        //var fechaInicial2 = new Date();
        //var fechaFinal2 = new Date();


        c = new Date(año, 0, 1);
        if (d !== null) {
            c = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            //c.add(Calendar.DAY_OF_WEEK, +1);
            aplicaAjuste = false;
        }

        getData = new Array();

        if ((dias !== 30) && (dias !== 15)) {
            if (d === null) {
                fechaBase = null;
            } else {
                fechaBase = new Date(c.getFullYear(), c.getMonth(), c.getDate());
            }

            fechaInicioPeriodo = new Date(c.getFullYear(), c.getMonth(), c.getDate());
            if (tc.Clave === "PER") {


                AbrirDialogo(fechaInicioPeriodo);
            }

            //    if (isClicAceptar) {
            //        c = new Date(fechaInicioPeriodo.getFullYear(), fechaInicioPeriodo.getMonth(), fechaInicioPeriodo.getDate());
            //        aplicaAjuste = true;
            //    } else {
            //        continuar = false;
            //    }

        } else {
            setFechaInicial();
        }

        //if (continuar) {
        //    if (dias === 30 || dias === 15) {
        //        //genera periodos mensuales o quincenales
        //    } else if (dias >= 365) {
        //        //genera periodo anual
        //    } else {
        //        //genera periodos normales
        //        var ideBreak = false;

        //        for (var periodo = 1; ; periodo++) {
        //            fechaInicial = new Date(c.getFullYear(), c.getMonth(), c.getDate());
        //            c.setDate(fechaInicial.getDate + dias);
        //            fechaFinal = new Date(c.getFullYear(), c.getMonth(), c.getDate());
        //            fechaFinal.setDate(fechaFinal.getDate() - 1);
        //            console.log(fechaInicial);
        //            console.log(fechaFinal);


        //        }
        //    }

        //} else {
        //    //poner el foco en edit nomina
        //}


    } else {
        cargarPeriododos(periodosAux);
    }

}

function AbrirDialogo(fechaPeriodoInicio) {

    var modal = document.getElementById("myDialogo");
    modal.style.display = "block";
    document.getElementById("txtFechaBase").value = formatDate(fechaPeriodoInicio);
    //var span = document.getElementsByClassName("close")[0];
    //span.onclick = function () {
    //    modal.style.display = "none";
    //}
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

function setFechaInicial() {
    
    var p15 = 0;
    var ajustaPeriodo = 0;
    var dias2;
    var continuar = true;

    var fechaInicial = new Date();

    var fechaFinal = new Date();
    var fechaInicial2 = new Date();
    var fechaFinal2 = new Date();
    if (document.getElementById("txtFechaBase").value!=="") {
        fechaInicioPeriodo = new Date(formantDdMmYyyy(document.getElementById("txtFechaBase").value.toString()));
    }
    if (fechaBase === null) {
        continua = true;
        isClicAceptar = true;
        var modal = document.getElementById("myDialogo");
        modal.style.display = "none";
    } else {

        if (fechaBase > fechaInicioPeriodo) {
            alert("La fecha debe ser mayor a la fecha final del periodo anterior");
            continuar = false;
            isClicAceptar = false;
        } else {
            continua = true;
            isClicAceptar = true;
            var modal1 = document.getElementById("myDialogo");
            modal1.style.display = "none";
        }

    }

    if (isClicAceptar) {
        if (fechaInicioPeriodo !== null) {
            c = new Date(fechaInicioPeriodo.getFullYear(), fechaInicioPeriodo.getMonth(), fechaInicioPeriodo.getDate());
            aplicaAjuste = true;
        }
    } else {
        continuar = false;
    }
    var k=0;
    var isIgual = false;
    var p = {};
    var pq = {};
    if (continuar) {
        if (dias === 30 || dias === 15) {
            //genera periodos mensuales o quincenales
            var diaMes;
            for (var periodosNom = 1; periodosNom <= 12; periodosNom++) {
                //console.log(c);

                fechaInicial = new Date(c.getFullYear(), c.getMonth(), c.getDate());
                diaMes = c.getDate();
                c.setMonth(c.getMonth() + 1);
                c.setDate(1);
                fechaFinal = new Date(c.getFullYear(), c.getMonth(), c.getDate() - 1);
                p = {};
                p.id = "id" + randomString(2, '0123456789');
                if (dias === 15 && diaMes < 15) {
                    p15++;
                    p.clave = textformateaValorAMascara(p15, "###");
                    p.descripcion = generaDescripcion(tipoNomina.Periodicidaddescripcion, p.clave, fechaInicial, fechaFinal);
                    p.cierreMes = false;
                } else {
                    p.clave = textformateaValorAMascara(periodosNom, "###");
                    p.descripcion = generaDescripcion(tipoNomina.Periodicidaddescripcion, p.clave, fechaInicial, fechaFinal);
                    p.cierreMes = true;
                }

                p.acumularAMes = formatDateddmmyyy(fechaInicial);
                p.bloquear=false;
                p.fechaAsistenciInicial = formatDateddmmyyy(fechaInicial);
                p.fechaAsistenciaFinal = formatDateddmmyyy(fechaFinal);
                p.fechaFinal = formatDateddmmyyy(fechaFinal);
                p.fechaInicial = formatDateddmmyyy(fechaInicial);
                p.fechaCierre = formatDateddmmyyy(fechaFinal);
                p.fechaModificado = formatDateddmmyyy(new Date());
                p.fechaPago = formatDateddmmyyy(fechaFinal);
                p.tipoNomina = tipoNomina;
                p.tipoNomina_ID = tipoNomina.Id;
                p.tipoCorrida = tc;
                p.tipoCorrida_ID = tc.Id;
                p.año=año;
                p.descontarAhorro=false;
                p.descontarPrestamo=false;
                p.diasIMSS=dias;
                p.diasPago=dias;
                p.incluirBajas=false;
                p.soloPercepciones=false;
                p.status=true;
                p.tipoUso=0;
                p.claveUsuario = usuario.clave;//(MainPrincipal.getUsuarioActual().getClave());
                p.origen=true;

                if (dias === 15 && diaMes < 15) {
                    fechaInicial2 = new Date(fechaInicial.getFullYear(), fechaInicial.getMonth(), fechaInicial.getDate());
                    fechaFinal2 = new Date(fechaFinal.getFullYear(), fechaFinal.getMonth(), fechaFinal.getDate());


                    fechaFinal.setDate(dias); 

                    fechaInicial2.setDate(dias +1 );
                    p15++;
                    pq = {};
                    pq.id = "id" + randomString(2, '0123456789');
                    pq.clave = textformateaValorAMascara(p15, "###");
                    pq.descripcion = generaDescripcion(tipoNomina.Periodicidaddescripcion, pq.clave, fechaInicial2, fechaFinal2);
                    pq.acumularAMes = formatDateddmmyyy(fechaInicial2);
                    pq.bloquear=false;
                    pq.cierreMes=true;
                    pq.fechaAsistenciInicial = formatDateddmmyyy(fechaInicial2);
                    pq.fechaAsistenciaFinal = formatDateddmmyyy(fechaFinal2);
                    pq.fechaFinal = formatDateddmmyyy(fechaFinal2);
                    pq.fechaInicial = formatDateddmmyyy(fechaInicial2);
                    pq.fechaCierre = formatDateddmmyyy(fechaFinal2);
                    pq.fechaModificado = formatDateddmmyyy(new Date());
                    pq.fechaPago = formatDateddmmyyy(fechaFinal2);
                    pq.tipoNomina = tipoNomina;
                    pq.tipoNomina_ID = tipoNomina.Id;
                    pq.tipoCorrida = tc;
                    pq.tipoCorrida_ID = tc.Id;
                    pq.año=año;
                    pq.descontarAhorro=false;
                    pq.descontarPrestamo=false;
                    pq.diasIMSS=dias;
                    pq.diasPago=dias;
                    pq.incluirBajas=false;
                    pq.soloPercepciones=false;
                    pq.status=true;
                    pq.tipoUso=0;
                    pq.claveUsuario = usuario.clave;//(MainPrincipal.getUsuarioActual().getClave());
                    pq.origen=true;

                    p.fechaAsistenciInicial = formatDateddmmyyy(fechaInicial);
                    p.fechaAsistenciaFinal = formatDateddmmyyy(fechaFinal);
                    p.fechaFinal = formatDateddmmyyy(fechaFinal);
                    p.fechaInicial = formatDateddmmyyy(fechaInicial);
                    p.fechaCierre = formatDateddmmyyy(fechaFinal);
                    p.fechaModificado = formatDateddmmyyy(new Date());
                    p.fechaPago = formatDateddmmyyy(fechaFinal);
                    p.descripcion = generaDescripcion(tipoNomina.Periodicidaddescripcion, p.clave, fechaInicial, fechaFinal);
                   
                    periodosNomina[periodosNomina.length] = p;
                    getData[getData.length] = p;
                    if (addPeriodosNomina.length === 0) {
                        addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[getData.length - 1];
                    } else {
                         isIgual = false;
                        for ( k = 0; k < addPeriodosNomina.length; k++) {
                            if (addPeriodosNomina[k]["clave"] === periodosNomina[periodosNomina.length - 1]["clave"]) {
                                isIgual = true;
                                break;
                            }
                        }

                        if (!isIgual) {
                            addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[periodosNomina.length - 1];
                        }
                    }

                    periodosNomina[periodosNomina.length] = pq;
                    getData[getData.length] = pq;
                    if (addPeriodosNomina.length === 0) {
                        addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[getData.length - 1];
                    } else {
                        isIgual = false;
                        for ( k = 0; k < addPeriodosNomina.length; k++) {
                            if (addPeriodosNomina[k]["clave"] === periodosNomina[periodosNomina.length - 1]["clave"]) {
                                isIgual = true;
                                break;
                            }
                        }

                        if (!isIgual) {
                            addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[periodosNomina.length - 1];
                        }
                    }

                } else {
                    periodosNomina[periodosNomina.length] = p;
                    getData[getData.length] = p;
                    if (addPeriodosNomina.length === 0) {
                        addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[getData.length - 1];
                    } else {
                         isIgual = false;
                        for ( k = 0; k < addPeriodosNomina.length; k++) {
                            if (addPeriodosNomina[k]["clave"] === periodosNomina[periodosNomina.length - 1]["clave"]) {
                                isIgual = true;
                                break;
                            }
                        }

                        if (!isIgual) {
                            addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[periodosNomina.length - 1];
                        }
                    }
                }

                if (c.getFullYear() === año + 1) {
                    break;
                }
            }
            if (start === 0) {
                createEditPagination(getData.length, "PeriodosNomina");
            }
            if (getData.length < rowsByPage) {
                end = getData.length;
            } else {
                end = rowsByPage;
            }
            llenartablaPer(start, end, getData);
            //clearTable("contTable");
            //InitEventsTable();
            //llenarTablaGen("PeriodosNomina", getData);
           // addEventoRenglon();
        } else if (dias >= 365) {
            //genera periodo anual
            fechaInicial = new Date(c.getFullYear(), c.getMonth(), c.getDate());
           // c.setDate(fechaInicial.getDate() + dias);
            fechaFinal = new Date(c.getFullYear() + 1, c.getMonth(), c.getDate());
            fechaFinal.setDate(fechaFinal.getDate() - 1);
            p = {};//
            var pAux = {};
            p.id = "id" + randomString(2, '0123456789');
            p.clave = textformateaValorAMascara("1", "###");//JSA01
            p.descripcion = generaDescripcion(tipoNomina.Periodicidaddescripcion, p.clave, fechaInicial, fechaFinal);
            p.cierreMes=true;
            p.acumularAMes=formatDateddmmyyy(fechaInicial);
            p.bloquear=false;
            p.fechaAsistenciInicial = formatDateddmmyyy(fechaInicial);
            p.fechaAsistenciaFinal = formatDateddmmyyy(fechaFinal);
            p.fechaFinal = formatDateddmmyyy(fechaFinal);
            p.fechaInicial = formatDateddmmyyy(fechaInicial);
            p.fechaCierre = formatDateddmmyyy(fechaFinal);
            p.fechaModificado = formatDateddmmyyy(new Date());
            p.fechaPago = formatDateddmmyyy(fechaFinal);
            p.tipoNomina = tipoNomina;
            p.tipoNomina_ID = tipoNomina.Id;
            p.tipoCorrida = tc;
            p.tipoCorrida_ID = tc.Id;
            p.año=año;
            p.descontarAhorro=false;
            p.descontarPrestamo=false;
            p.diasIMSS=dias;
            p.diasPago=dias;
            p.incluirBajas=false;
            p.soloPercepciones=false;
            p.status=true;
            p.tipoUso=0;
            p.claveUsuario = usuario.clave;//(MainPrincipal.getUsuarioActual().getClave());pendiente
            p.origen=true;
            
            periodosNomina[periodosNomina.length] = p;
            getData[getData.length] = p;
            if (addPeriodosNomina.length === 0) {
                addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[getData.length - 1];
            } else {
                 isIgual = false;
                for ( k = 0; k < addPeriodosNomina.length; k++) {
                    if (addPeriodosNomina[k]["clave"] === periodosNomina[periodosNomina.length - 1]["clave"]) {
                        isIgual = true;
                        break;
                    }
                }

                if (!isIgual) {
                    addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[periodosNomina.length - 1];
                }
            }
            if (start === 0) {
                createEditPagination(getData.length, "PeriodosNomina");
            }
            if (getData.length < rowsByPage) {
                end = getData.length;
            } else {
                end = rowsByPage;
            }
            llenartablaPer(start, end, getData);
            //clearTable("contTable");
            //InitEventsTable();
            //llenarTablaGen("PeriodosNomina", getData);
           // addEventoRenglon();

        } else {
            //genera periodos normales
            var ideBreak = false;

            for (var periodo = 1; ; periodo++) {
                fechaInicial = new Date(c.getFullYear(), c.getMonth(), c.getDate());
                c.setDate(fechaInicial.getDate() + dias);
                fechaFinal = new Date(c.getFullYear(), c.getMonth(), c.getDate());
                fechaFinal.setDate(fechaFinal.getDate() - 1);
                p = {};
                var pTabla = {};
                p.id = "id" + randomString(2, '0123456789');
                pTabla.id = p.id;
                if (identificador) {
                    if (fechaComparar !== null) {
                        if (fechaComparar.getTime() === fechaInicial.getTime()) {
                            break;
                        } else if (fechaComparar > fechaInicial && fechaComparar < fechaFinal) {
                            var daysBack = dias;
                            for (var i = 0; i < daysBack; i++) {
                                fechaFinal.setDate(fechaFinal.getDate() - 1);
                                if (fechaFinal < fechaComparar) {
                                    break;
                                }
                            }
                            ideBreak = true;
                        }
                    }
                }

                if (ajusta && aplicaAjuste) {
                    ajustaPeriodo++;
                    p.clave = textformateaValorAMascara(ajustaPeriodo, "###");
                    p.descripcion = generaDescripcion(tipoNomina.Periodicidaddescripcion, p.clave, fechaInicial, fechaFinal);
                    
                } else {
                    p.clave = textformateaValorAMascara(periodo, "###");
                    p.descripcion = generaDescripcion(tipoNomina.Periodicidaddescripcion, p.clave, fechaInicial, fechaFinal);
                }
                pTabla.clave = p.clave;
                pTabla.descripcion = p.descripcion;
                p.acumularAMes = formatDateddmmyyy(fechaInicial);
                p.bloquear = false;
                pTabla.bloquear = p.bloquear;//esto es para mostrar en la tabla
                if (fechaInicial.getMonth() === fechaFinal.getMonth() && fechaFinal.getMonth() === c.getMonth()) {
                    p.cierreMes = false;
                } else {
                    p.cierreMes = true;
                }

                pTabla.cierreMes = p.cierreMes;
                p.fechaAsistenciInicial=(formatDateddmmyyy(fechaInicial));
                p.fechaAsistenciaFinal=(formatDateddmmyyy(fechaFinal));
                p.fechaFinal=(formatDateddmmyyy(fechaFinal));
                p.fechaInicial=(formatDateddmmyyy(fechaInicial));
                p.fechaCierre=(formatDateddmmyyy(fechaFinal));
                p.fechaModificado=(formatDateddmmyyy(new Date()));
                p.fechaPago=(formatDateddmmyyy(fechaFinal));
                pTabla.fechaInicial = p.fechaInicial;
                pTabla.fechaFinal = p.fechaFinal;
                pTabla.fechaCierre = p.fechaCierre;
                pTabla.fechaPago = p.fechaPago;

                p.tipoNomina_ID = tipoNomina.Id;
                p.tipoNomina = tipoNomina;
                p.tipoCorrida_ID = tc.Id;
                p.tipoCorrida = tc;
                p.año=año;
                p.descontarAhorro=false;
                p.descontarPrestamo=false;
                p.diasIMSS=dias;
                p.diasPago=dias;
                p.incluirBajas=false;
                p.soloPercepciones=false;
                p.status=true;
                p.tipoUso=0;
                p.claveUsuario = usuario.clave;//(MainPrincipal.getUsuarioActual().getClave());
                p.origen = true;
                if (ajusta && fechaInicial.getMonth() !== fechaFinal.getMonth() && aplicaAjuste) {
                    fechaInicial2 = new Date(fechaInicial.getFullYear(), fechaInicial.getMonth(), fechaInicial.getDate());
                    fechaFinal2 = new Date(fechaFinal.getFullYear(), fechaFinal.getMonth(), fechaFinal.getDate());
                    for (; ;) {
                        fechaFinal.setDate(fechaFinal.getDate() - 1);
                        if (fechaFinal.getMonth() === fechaInicial.getMonth()) {
                            break;
                        }
                    }

                    fechaInicial2.setDate(fechaFinal.getDate() + 1);

                    ajustaPeriodo++;
                    var resta = fechaFinal2.getTime() - fechaInicial2.getTime();
                    dias2 = Math.round(resta / (1000 * 60 * 60 * 24));
                    pq = {};
                    var pqTable = {};
                    pq.id = "id" + randomString(2, '0123456789');
                    pq.clave = textformateaValorAMascara(ajustaPeriodo, "###");//JSA01
                    pq.descripcion = generaDescripcion(tipoNomina.Periodicidaddescripcion, pq.clave, fechaInicial2, fechaFinal2);
                    pq.acumularAMes = formatDateddmmyyy(fechaInicial2);
                    pq.bloquear=false;
                    pq.cierreMes = false;
                    pq.fechaAsistenciInicial =formatDateddmmyyy(fechaInicial2);
                    pq.fechaAsistenciaFinal=formatDateddmmyyy(fechaFinal2);
                    pq.fechaFinal = formatDateddmmyyy(fechaFinal2);
                    pq.fechaInicial = formatDateddmmyyy(fechaInicial2);
                    pq.fechaCierre = formatDateddmmyyy(fechaFinal2);
                    pq.fechaModificado = formatDateddmmyyy(new Date());
                    pq.fechaPago = formatDateddmmyyy(fechaFinal2);
                    pq.tipoNomina = tipoNomina;
                    pq.tipoNomina_ID = tipoNomina.Id;
                    pq.tipoCorrida=tc;
                    pq.tipoCorrida_ID = tc.Id;
                    pq.año=año;
                    pq.descontarAhorro=false;
                    pq.descontarPrestamo=false;
                    pq.diasIMSS=dias2;
                    pq.diasPago=dias2;
                    pq.incluirBajas=false;
                    pq.soloPercepciones=false;
                    pq.status=true;
                    pq.tipoUso=0;
                    pq.origen=true;
                    pq.claveUsuario = usuario.clave;//(MainPrincipal.getUsuarioActual().getClave());pendiente
                    pqTable.clave = pq.clave;
                    pqTable.descripcion = pq.descripcion;
                    pqTable.fechaInicial = pq.fechaInicial;
                    pqTable.fechaFinal = pq.fechaFinal;
                    pqTable.fechaCierre = pq.fechaCierre;
                    pqTable.fechaPago = pq.fechaPago;
                    pqTable.cierreMes = pq.cierreMes;
                    pqTable.bloquear = pq.bloquear;

                    p.fechaAsistenciInicial = formatDateddmmyyy(fechaInicial);
                    p.fechaAsistenciaFinal = formatDateddmmyyy(fechaFinal);
                    p.fechaFinal=formatDateddmmyyy(fechaFinal);
                    p.fechaInicial = formatDateddmmyyy(fechaInicial);
                    p.fechaCierre = formatDateddmmyyy(fechaFinal);
                    p.fechaModificado = formatDateddmmyyy(new Date());
                    p.fechaPago = formatDateddmmyyy(fechaFinal);
                    p.descripcion = generaDescripcion(tipoNomina.Periodicidaddescripcion, p.clave, fechaInicial, fechaFinal);
                    p.diasIMSS=dias - dias2;
                    p.diasPago = dias - dias2;
                    pTabla.clave = p.clave;
                    pTabla.descripcion = p.descripcion;
                    pTabla.fechaInicial = p.fechaInicial;
                    pTabla.fechaFinal = p.fechaFinal;
                    pTabla.fechaCierre = p.fechaCierre;
                    pTabla.fechaPago = p.fechaPago;
                    var j;
                    periodosNomina[periodosNomina.length] = p;
                    getData[getData.length] = p;
                    if (addPeriodosNomina.length === 0) {
                        addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[periodosNomina.length - 1];
                    } else {
                         isIgual = false;
                        for ( j = 0; j < addPeriodosNomina.length; j++) {
                            if (addPeriodosNomina[j] === periodosNomina[periodosNomina.length - 1]) {
                                isIgual = true;
                                break;
                            }
                        }

                        if (!isIgual) {
                            addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[periodosNomina.length - 1];
                        }
                    }
                    if (ideBreak) {//JEVC01
                        break;
                    }

                    if (fechaFinal2.getFullYear() === año) {
                        periodosNomina[periodosNomina.length] = pq;
                        getData[getData.length] = pq;
                        if (addPeriodosNomina.length === 0) {
                            addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[periodosNomina.length - 1];
                        } else {
                             isIgual = false;
                            for ( j = 0; j < addPeriodosNomina.length; j++) {
                                if (addPeriodosNomina[j] === periodosNomina[periodosNomina.length - 1]) {
                                    isIgual = true;
                                    break;
                                }
                            }

                            if (!isIgual) {
                                addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[periodosNomina.length - 1];
                            }
                        }
                    } else {
                        break;
                    }
                    //if (fechaInicial2.get(Calendar.YEAR) == año) {
                    //    getData().add(pq);
                    //    if (!addPeriodosNomina.contains(getData().get(getData().size() - 1))) {
                    //        addPeriodosNomina.add(getData().get(getData().size() - 1));
                    //    }
                    //} else {
                    //    break;
                    //}

                } else {
                    
                    periodosNomina[periodosNomina.length] = p;
                    getData[getData.length] = p;
                    if (addPeriodosNomina.length === 0) {
                        addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[getData.length - 1];
                    } else {
                         isIgual= false;
                        for ( k   = 0; k < addPeriodosNomina.length; k++) {
                            if (addPeriodosNomina[k]["clave"] === periodosNomina[periodosNomina.length - 1]["clave"] ) {
                                isIgual = true;
                                break;
                            }
                        }

                        if (!isIgual) {
                            addPeriodosNomina[addPeriodosNomina.length] = periodosNomina[periodosNomina.length - 1];
                        }
                    }

                    if (ideBreak) {
                        break;
                    }
                }
                //console.log(c);
                if (c.getFullYear() === año + 1) {
                    break;
                }
            }
            if (start === 0) {
                createEditPagination(getData.length, "PeriodosNomina");
            }
            if (getData.length < rowsByPage) {
                end = getData.length;
            } else {
                end = rowsByPage;
            }
            llenartablaPer(start, end, getData);
            //clearTable("contTable");
            //InitEventsTable();
            //if () {

            //}
            //llenarTablaGen("PeriodosNomina", getData);
            //addEventoRenglon();
        }
        if (getData.length > 0) {
            alert("El sistema no encontro periódos almacenados, asi que se generaron en automático para ser guardados");
        }
    } else {
        //poner el foco en edit nomina
    }
}

function generaDescripcion(tipoPeriodo, periodo, finicial, ffinal) {
    var fechaIni = formatDateddmmyyy(finicial);
    var fechafin = formatDateddmmyyy(ffinal);

    var descripcionPeriodo = tipoPeriodo + " " + periodo + "° " + "Periodo del " + fechaIni + " al " + fechafin;
    return descripcionPeriodo;

}

function cargarPeriododos(listaPeriodos) {
    //console.log(listaPeriodos);
    periodosNomina = listaPeriodos;

    for (var i = 0; i < listaPeriodos.length; i++) {
        var datos = {};
        datos.id = listaPeriodos[i].id;
        datos.clave = listaPeriodos[i].clave;
        datos.descripcion = listaPeriodos[i].descripcion;

        datos.fechaInicial = formatDatemmddyyy(new Date(listaPeriodos[i].fechaInicial));
        datos.fechaFinal = formatDatemmddyyy(new Date(listaPeriodos[i].fechaFinal));
        datos.fechaCierre = formatDatemmddyyy(new Date(listaPeriodos[i].fechaCierre));
        datos.fechaPago = formatDatemmddyyy(new Date(listaPeriodos[i].fechaPago));
        datos.cierreMes = listaPeriodos[i].cierreMes;
        datos.bloquear = listaPeriodos[i].bloquear;

        getData[i] = datos;

        llenarTablaGen("PeriodosNomina", getData);
       // addEventoRenglon();
        //InitEventsTable();
    }


    if (start === 0) {
        createEditPagination(getData.length, "PeriodosNomina");
    }
    if (getData.length < rowsByPage) {
        end = getData.length;
    } else {
        end = rowsByPage;
    }
    llenartablaPer(start, end, getData);
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function getPeriodosNominaPorAñoYTipoNominaYTipoCorrida(ejercicio, claveTc, claveTn) {
    var obj = {};
    var periodos;
    obj["ejercicio"] = ejercicio;
    obj["claveTc"] = claveTc;
    obj["claveTn"] = claveTn;
    var url = route + "/api/PeriodosNomina/getPeriodosNominaPorAñoYTipoNominaYTipoCorrida";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        periodos = Mensaje.resultado;
        return periodos;
    } else {
        periodos = Mensaje.resultado;
        return periodos;
    }
}

function ObtenerFechaFinalMax(claveTn, claveTc, year) {
    var obj = {};
    var fecha;
    obj["ejercicio"] = year;
    obj["claveTc"] = claveTc;
    obj["claveTn"] = claveTn;
    var url = route + "/api/PeriodosNomina/ObtenerFechaFinalMax";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        fecha = null;
        return fecha;
    } else {
        fecha = Mensaje.resultado;
        return fecha;
    }
}

function ObtenerFechaFinalMin(claveTn, claveTc, year) {
    var obj = {};
    var fecha;
    obj["ejercicio"] = year;
    obj["claveTc"] = claveTc;
    obj["claveTn"] = claveTn;
    var url = route + "/api/PeriodosNomina/ObtenerFechaFinalMin";
    var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {
        fecha = null;
        return fecha;
    } else {
        fecha = Mensaje.resultado;
        return fecha;
    }
}

function limpiarComponentesForma() {
    //getData = new Array();
    periodosNomina = new Array();
    addPeriodosNomina = new Array();
    deletePeriodosNomina = new Array();
   // clearTable("contTable");
    InitEventsTable();
}

function savePeriodosNomina() {
    var completo = true;
    var datosGuardar = {};
    var i = 0;

    if (deletePeriodosNomina.length > 0) {
        datosGuardar["Delete"] = deletePeriodosNomina;
    }

    for (i = 0; i < getData.length; i++) {
        if (getData[i].clave === "") {
            alert("La clave no debe de estar vacía");
            completo = false;
        }
    }

    if (tipoCorrida.Clave ==="PER") {
        var listaCorrida = null;
        var ListaPerNomina = new Array();
        listaCorrida = getTipoCorridaAll();
        if (listaCorrida !== null) {
            for (i = 0; i < listaCorrida.length; i++) {
                if (listaCorrida[i].usaCorrPeriodica && listaCorrida[i].clave !== "PER") {
                    for (var j = 0; j < addPeriodosNomina.length; j++) {
                        if (!Number.isInteger(addPeriodosNomina[j].id)) {
                            var perNuevo = {};
                            perNuevo = nuevaInstancia(addPeriodosNomina[j], listaCorrida[i]);
                            ListaPerNomina[ListaPerNomina.length] = perNuevo;
                        }
                    }
                }
            }

            for (var k = 0; k < ListaPerNomina.length; k++) {
                addPeriodosNomina[addPeriodosNomina.length] = ListaPerNomina[k];
            }

        } else {
            alert("no encontro tipo corrida almacenadas");
            return;
        }

    }

    if (completo) {
        limpiarPerNominaAntesDeSave();
        datosGuardar["SaveOrUpdate"] = addPeriodosNomina;
        datosGuardar["tipoCorrida"] = tipoCorrida.Id;
        var url = route + "/api/PeriodosNomina/saveDeletePeriodosNomina";
        var dataToPost = JSON.stringify(datosGuardar);
        var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
        if (Mensaje.resultado === null) {

           // return null;
        } else {

            //return Mensaje.resultado;
        }
        limpiar();
    }


}

function getTipoCorridaAll() {
    var url = route + "/api/PeriodosNomina/getTipoCorridaAll";
    //var dataToPost = JSON.stringify(obj);
    var Mensaje = Common.sendRequestJson('POST', url, undefined, undefined, false);
    if (Mensaje.resultado === null) {
        
        return null;
    } else {
       
        return Mensaje.resultado;
    }
}

function nuevaInstancia(per, tpCorrida) {
    var periodonomina = {};
    periodonomina.acumularAMes=per.acumularAMes;
    periodonomina.año=per.año;
    periodonomina.bloquear=per.bloquear;
    periodonomina.cierreMes=per.cierreMes;
    periodonomina.clave=per.clave;
    periodonomina.claveUsuario=per.claveUsuario;
    periodonomina.descontarAhorro=per.descontarAhorro;
    periodonomina.descontarPrestamo=per.descontarPrestamo;
    periodonomina.descripcion=per.descripcion;
    periodonomina.detalleConceptoRecibo=per.detalleConceptoRecibo;
    periodonomina.diasIMSS=per.diasIMSS;
    periodonomina.diasPago=per.diasPago;
    periodonomina.fechaAsistenciInicial=per.fechaAsistenciInicial;
    periodonomina.fechaAsistenciaFinal=per.fechaAsistenciaFinal;
    periodonomina.fechaCierre=per.fechaCierre;
    periodonomina.fechaFinal=per.fechaFinal;
    periodonomina.fechaInicial=per.fechaInicial;
    periodonomina.fechaModificado=per.fechaModificado;
    periodonomina.fechaPago=per.fechaPago;
    periodonomina.incluirBajas=per.incluirBajas;
    periodonomina.soloPercepciones=per.soloPercepciones;
    periodonomina.status=per.status;
    periodonomina.tipoCorrida = tpCorrida;
    periodonomina.tipoCorrida_ID = tpCorrida.id;
    periodonomina.tipoNomina = per.tipoNomina;
    periodonomina.tipoNomina_ID = per.tipoNomina_ID;
    periodonomina.tipoUso=per.tipoUso;
    periodonomina.origen=per.origen;

    return periodonomina;
}

function limpiarPerNominaAntesDeSave() {

    for (var i = 0; i < addPeriodosNomina.length; i++) {

        addPeriodosNomina[i].tipoCorrida = undefined;
        addPeriodosNomina[i].tipoNomina = undefined;
      
        delete addPeriodosNomina[i].tipoCorrida;
        delete addPeriodosNomina[i].tipoNomina;
        if (!Number.isInteger(addPeriodosNomina[i].id)) {
            addPeriodosNomina[i].id = 0;
        }
    }

}

function limpiar() {

    tipoCorrida = null;
    tipoNomina = null;
    document.getElementById("txtEjercicio").value = fechaSistemas.getFullYear();
    periodosNomina = new Array();
    addPeriodosNomina = new Array();
    deletePeriodosNomina = new Array();
    getData = new Array();
    clearEdit("editTipoCorrida");
    clearEdit("editTipoNomina");
    setEditObject("editTipoCorrida", "PER");
  //  clearTable("contTable");
    InitEventsTable();
}

function initDefaultPeriodo() {
    periodoNominaAux = {};
   // Calendar calendar = Calendar.getInstance();
    periodoNominaAux.id = "id" + randomString(2, '0123456789');
    periodoNominaAux.clave="";
    periodoNominaAux.descripcion="";
    periodoNominaAux.fechaInicial = formatDatemmddyyy(fechaSistemas);
    periodoNominaAux.fechaFinal = formatDatemmddyyy(fechaSistemas);
    periodoNominaAux.fechaCierre = formatDatemmddyyy(fechaSistemas);
    periodoNominaAux.fechaPago = formatDatemmddyyy(fechaSistemas);
    periodoNominaAux.fechaModificado = formatDateddmmyyy(new Date());
    periodoNominaAux.cierreMes=false;
    periodoNominaAux.bloquear = false;
    periodoNominaAux.tipoNomina = tipoNomina;
    periodoNominaAux.tipoNomina_ID = tipoNomina.Id;
    periodoNominaAux.tipoCorrida = tipoCorrida;
    periodoNominaAux.tipoCorrida_ID = tipoCorrida.Id;
    periodoNominaAux.acumulaMes = formatDatemmddyyy(fechaSistemas);
    periodoNominaAux.año = parseInt(document.getElementById("txtEjercicio").value);
    periodoNominaAux.claveUsuario = usuario.clave;
    periodoNominaAux.descontarAhorro=false;
    periodoNominaAux.descontarPrestamo=false;
    periodoNominaAux.diasIMSS=0;
    periodoNominaAux.diasPago=0;
    periodoNominaAux.fechaAsistenciInicial = formatDatemmddyyy(fechaSistemas);
    periodoNominaAux.fechaAsistenciaFinal = formatDatemmddyyy(fechaSistemas);
    periodoNominaAux.incluirBajas=false;
    periodoNominaAux.soloPercepciones=false;
    periodoNominaAux.status=true;
    periodoNominaAux.tipoUso=0;
    periodoNominaAux.origen=false;

}

function construirPeriodo() {
   
    acumulaMes.setMonth(parseInt(document.getElementById("selAcumulaMes").value));
   
    periodoNominaAux.clave = document.getElementById("txtClave").value;
    periodoNominaAux.descripcion = document.getElementById("txtDescripcion").value;
    var acumulaMesAux = new Date(periodoNominaAux.acumulaMes);
    var periodoNominaAcumulaMes = new Date(acumulaMesAux.getFullYear(), acumulaMesAux.getMonth(), acumulaMesAux.getDate());
    if (periodoNominaAcumulaMes.getMonth() !== acumulaMes.getMonth() || periodoNominaAux.cierreMes !== document.getElementById("chkCierreMes").checked) {
        periodoNominaAux.acumulaMes = formatDatemmddyyy(new Date(acumulaMes.getFullYear(), acumulaMes.getMonth(), acumulaMes.getDate()));
        periodoNominaAux.cierreMes = document.getElementById("chkCierreMes").checked;
        cierreMesCambio = true;
    } else {
        cierreMesCambio = false;
    }
    periodoNominaAux.bloquear = document.getElementById("chkBloquear").checked;
    //console.log(formatDatemmddyyy(new Date(formantDdMmYyyy(document.getElementById("txtFechaAsistenciaInicial").value))));
    periodoNominaAux.fechaAsistenciInicial = formantDdMmYyyy(document.getElementById("txtFechaAsistenciaInicial").value);
    periodoNominaAux.fechaAsistenciaFinal = formantDdMmYyyy(document.getElementById("txtFechaAsistenciaFinal").value);
    periodoNominaAux.fechaFinal = formantDdMmYyyy(document.getElementById("txtFechaFinal").value);
    periodoNominaAux.fechaInicial = formantDdMmYyyy(document.getElementById("txtFechaInicial").value);
    periodoNominaAux.fechaCierre = formantDdMmYyyy(document.getElementById("txtFechaFinal").value);
    periodoNominaAux.fechaModificado = formatDateddmmyyy(new Date());
    periodoNominaAux.fechaPago = formantDdMmYyyy(document.getElementById("txtFechaPago").value);
    periodoNominaAux.descontarAhorro = document.getElementById("chkDescontarAhorros").checked;
    periodoNominaAux.descontarPrestamo = document.getElementById("chkDescontarPrestamos").checked;
    periodoNominaAux.diasIMSS = parseInt(document.getElementById("txtDiasIMSS").value );
    periodoNominaAux.diasPago = parseInt(document.getElementById("txtDiasPago").value );
    periodoNominaAux.incluirBajas = document.getElementById("chkIncluirBajas").checked;
    periodoNominaAux.soloPercepciones = document.getElementById("chkSoloPrestaciones").checked;
    periodoNominaAux.status = true;
    if (document.getElementById("txtDescripcionRecibo").value.toString().length > 0) {
        periodoNominaAux.detalleConceptoRecibo = document.getElementById("txtDescripcionRecibo").value;
    }

    return periodoNominaAux;
}

function ConstruirModificarPer() {
    var periodoUpdate = {};
    var isNumerico = false;
    if (idSelecionado !== "") {
        for (var i = 0; i < periodosNomina.length; i++) {
            if (!Number.isInteger(periodosNomina[i].id)) {
                if (periodosNomina[i].id === idSelecionado) {
                    periodoUpdate = periodosNomina[i];
                    isNumerico = false;
                    break;
                }
            } else {
                if (periodosNomina[i].id === parseInt(idSelecionado)) {
                    periodoUpdate = periodosNomina[i];
                    isNumerico = true;
                    break;
                }
            }
        }

        //console.log(periodoUpdate);
        var isMovimientosPer=0;
        if (isNumerico) {
            isMovimientosPer = verificarPeriodosMov(periodoUpdate.id, periodoUpdate.tipoNomina_ID);
           // console.log(isMovimientosPer);
        }

        if (isMovimientosPer === 0) {
            SubConfigPeriodosNomina(periodoUpdate);
            mode = "UPDATE";
            document.getElementById("con1").style.display = "none";
            document.getElementById("con2").style.display = "block";
            document.getElementById("Gruopbotones").style.display = "none";
 
        } else {
            alert("este periodo ya esta calculado");
        }


    } else {
        alert("Selecione un periodo para modificar");
    }

}

function AgregarPeriodo() {
    var per = construirPeriodo();
    getData[getData.length] = per;
    periodosNomina[periodosNomina.length] = per;
    addPeriodosNomina[addPeriodosNomina.length] = per;
   //// clearTable("contTable");
   // InitEventsTable();
   // llenarTablaGen("PeriodosNomina", getData);
    if (start === 0) {
        createEditPagination(getData.length, "PeriodosNomina");
    }
    if (getData.length < rowsByPage) {
        end = getData.length;
    } else {
        end = rowsByPage;
    }
    llenartablaPer(start, end, getData);
    mostrarFormaCaptura(true);
    //addEventoRenglon();
}

function saveOrUpdatePER() {
    if (mode === "ADD") {
        AgregarPeriodo();
    } else if (mode === "UPDATE") {
        modificarPer();
    }
}

function modificarPer() {
    var per = construirPeriodo();
    var i = 0;
    var exito = false;
    for (i = 0; i < getData.length; i++) {
        if (Number.isInteger(per.id)) {
            if (parseInt(per.id) === getData[i].id) {
                getData[i] = per;
                exito = true;
                break;
            }
        } else {
            if (per.id === getData[i].id) {
                getData[i] = per;
                exito = true;
                break;
            }
        }
    }
    if (!exito) {
        getData[getData.length] = per;
    }

    exito = false;
    i = 0;
    for (i = 0; i < periodosNomina.length; i++) {
        if (Number.isInteger(per.id)) {
            if (parseInt(per.id) === periodosNomina[i].id) {
                periodosNomina[i] = per;
                exito = true;
                break;
            }
        } else {
            if (per.id === periodosNomina[i].id) {
                periodosNomina[i] = per;
                exito = true;
                break;
            }
        }
    }
    if (!exito) {
        periodosNomina[periodosNomina.length] = per;
    }


    exito = false;
    i = 0;
    for (i = 0; i < addPeriodosNomina.length; i++) {
        if (Number.isInteger(per.id)) {
            if (parseInt(per.id) === addPeriodosNomina[i].id) {
                addPeriodosNomina[i] = per;
                exito = true;
                break;
            }
        } else {
            if (per.id === addPeriodosNomina[i].id) {
                addPeriodosNomina[i] = per;
                exito = true;
                break;
            }
        }
    }
    if (!exito) {
        addPeriodosNomina[addPeriodosNomina.length] = per;
    }

   // clearTable("contTable");
    //InitEventsTable();
    //llenarTablaGen("PeriodosNomina", getData);
    if (start === 0) {
        createEditPagination(getData.length, "PeriodosNomina");
    }
    //if (getData.length < rowsByPage) {
    //    end = getData.length;
    //} else {
    //    end = rowsByPage;
    //}
    llenartablaPer(start, end, getData);
    mostrarFormaCaptura(true);
   // addEventoRenglon();
}

function SubConfigPeriodosNomina(periodo) {
    periodoNominaAux = periodo;
    if (periodo.clave === null || periodo.clave.length === 0) {
        document.getElementById("txtClave").value = textformateaValorAMascara(getData.length + 1, "###");
    } else {
        document.getElementById("txtClave").value = periodo.clave;
    }

    document.getElementById("txtDescripcion").value = periodo.descripcion;
    document.getElementById("txtTipoNomina").value = periodo.tipoNomina.Descripcion;
    document.getElementById("txtTipoNomina").disabled = true;
    document.getElementById("txtDiasIMSS").value = periodo.diasIMSS;
    document.getElementById("txtDiasPago").value = periodo.diasPago;
    document.getElementById("txtDiasPago").disabled = true;
    document.getElementById("txtDiasIMSS").disabled = true;

    document.getElementById("txtFechaAsistenciaInicial").value = formatDate(new Date(periodo.fechaAsistenciInicial));
    document.getElementById("txtFechaAsistenciaFinal").value = formatDate(new Date(periodo.fechaAsistenciaFinal));
    document.getElementById("txtFechaFinal").value = formatDate(new Date(periodo.fechaFinal));
    document.getElementById("txtFechaInicial").value = formatDate(new Date(periodo.fechaInicial));
    document.getElementById("txtFechaPago").value = formatDate(new Date(periodo.fechaPago));

    var calandario = new Date(periodo.acumulaMes);
    document.getElementById("selAcumulaMes").value = calendarito.getMonth().toString();


    document.getElementById("chkDescontarAhorros").checked = periodo.descontarAhorro;
    document.getElementById("chkDescontarPrestamos").checked = periodo.descontarPrestamo;
    document.getElementById("chkIncluirBajas").checked = periodo.incluirBajas;
    document.getElementById("chkSoloPrestaciones").checked = periodo.soloPercepciones;

    document.getElementById("txtFechaModificado").disabled = true;
    document.getElementById("txtFechaModificado").value = formatDatemmddyyy(new Date(periodo.fechaModificado));
    document.getElementById("txtUsuario").disabled = true;
    document.getElementById("txtUsuario").value = periodo.claveUsuario;

    document.getElementById("chkCierreMes").checked = periodo.cierreMes;
    document.getElementById("chkBloquear").checked = periodo.bloquear;

    if (periodo.status) {
        document.getElementById("txtStatus").disabled = true;
        document.getElementById("txtStatus").value = "Alta";
    } else {
        document.getElementById("txtStatus").disabled = true;
        document.getElementById("txtStatus").value = "Cerrado";
        
    }

    if (!Number.isInteger(periodo.id)) {
        bloquerModificaciones(false, periodo.status);
        document.getElementById("selAcumulaMes").disabled = false;
    } else if (!periodo.status) {
        bloquerModificaciones(true, periodo.status);
    } else if (periodo.bloquear) {
        bloquerModificaciones(true, periodo.status);
    }

    periodoAgregado = false;
    document.getElementById("txtDescripcionRecibo").value = periodo.detalleConceptoRecibo;

}

function bloquerModificaciones(habilitar, cerrado) {
    document.getElementById("txtDescripcion").disabled = habilitar;
    document.getElementById("txtDiasPago").disabled = habilitar;
    document.getElementById("txtDiasIMSS").disabled = habilitar;
    document.getElementById("txtFechaInicial").disabled = habilitar;
    document.getElementById("txtFechaFinal").disabled = habilitar;
    document.getElementById("txtFechaPago").disabled = habilitar;
    document.getElementById("txtFechaAsistenciaInicial").disabled = habilitar;
    document.getElementById("txtFechaAsistenciaFinal").disabled = habilitar;
    document.getElementById("chkDescontarAhorros").disabled = habilitar;
    document.getElementById("chkDescontarPrestamos").disabled = habilitar;
    document.getElementById("chkIncluirBajas").disabled = habilitar;
    document.getElementById("chkSoloPrestaciones").disabled = habilitar;

    if (!cerrado) {
        document.getElementById("chkBloquear").disabled = habilitar;
        document.getElementById("btnGuarda2").disabled = habilitar;
    }
    var fechaIni = new Date(formantDdMmYyyy(document.getElementById("txtFechaInicial").value.toString()));
    var fechafin = new Date(formantDdMmYyyy(document.getElementById("txtFechaFinal").value.toString()));

    if (fechaIni.getMonth() !== fechafin.getMonth()) {
        document.getElementById("chkCierreMes").disabled = habilitar;
    } else {
        document.getElementById("chkCierreMes").disabled = false; 
    }
    document.getElementById("txtDescripcionRecibo").disabled = habilitar;

}

function verificarPeriodosMov(idPeriodo, idTipoNomina) {
    var datos = {};
    datos["idPeriodo"] = idPeriodo;
    datos["idTipoNomina"] = idTipoNomina;
    var url = route + "/api/PeriodosNomina/getMovPer";
    var dataToPost = JSON.stringify(datos);
    var Mensaje = Common.sendRequestJson('POST', url, dataToPost, undefined, false);
    if (Mensaje.resultado === null) {

        return null;
    } else {

        return Mensaje.resultado;
    }
}

///metodos para la tabla
function editTablePeriodosNomina() {

    var nameTable = "PeriodosNomina";
    var nameCols = crearListaColumnas();
    var activaAdd = false;
    var activaDelete = true;
    var activarEditar = true;

    return buildTableTools(nameTable, nameCols, activaAdd, activaDelete, activarEditar);
}

function crearListaColumnas() {
    var columnasTabla = new Array();
    columnasTabla.push({ "tituloColumna": "No", "nombreCompo": "NoPeriodo", "editable": false, "tipoCompon": "text", "persist": "clave", "ancho": "35px", "funcion": "" },
        { "tituloColumna": "Descripción", "nombreCompo": "descripcionPer", "editable": false, "tipoCompon": "text", "persist": "descripcion", "ancho": "360px", "funcion": "" },
        { "tituloColumna": "Fecha Inicial", "nombreCompo": "FechaInicialPer", "editable": false, "tipoCompon": "text", "persist": "fechaInicial", "ancho": "70px", "funcion": "" },
        { "tituloColumna": "Fecha Final", "nombreCompo": "FechaFinalPer", "editable": false, "tipoCompon": "text", "persist": "fechaFinal", "ancho": "70px", "funcion": "" },
        { "tituloColumna": "Fecha Cierre", "nombreCompo": "FechaCierrePer", "editable": false, "tipoCompon": "text", "persist": "fechaCierre", "ancho": "70px", "funcion": "" },
        { "tituloColumna": "Fecha Pago", "nombreCompo": "FechaPagoPer", "editable": false, "tipoCompon": "text", "persist": "fechaPago", "ancho": "70px", "funcion": "" },
        { "tituloColumna": "Cierre Mes", "nombreCompo": "cierreMesPer", "editable": false, "tipoCompon": "checkbox", "persist": "cierreMes", "ancho": "70px", "funcion": "" },
        { "tituloColumna": "Bloquear", "nombreCompo": "BloquearPer", "editable": false, "tipoCompon": "checkbox", "persist": "bloquear", "ancho": "55px", "funcion": "" });

    return columnasTabla;
}

function tableAdd(valores) {
    var exito = true;
    if (valores.length === 3) {
        //var rString = "id" + randomString(2, '0123456789');
        //valores[2].id = rString;
        var trUltimo;
        if (typeof valores[2] !== 'undefined') {
            trUltimo = $(valores[2]).nextAll('tr:last')[0];
            for (var j = 0; j < valores[2].cells.length; j++) {
                if (valores[2].cells[j].getAttribute('contenteditable') === "true") {
                    if (valores[2].cells[j].innerText === "") {
                        exito = false;
                        break;
                    }
                }
            }
            if (exito) {
                construirObj(valores[2]);
            }
        }



        if (typeof trUltimo !== 'undefined') {
            for (var k = 0; k < trUltimo.cells.length; k++) {
                if (trUltimo.cells[k].getAttribute('contenteditable') === "true") {
                    if (trUltimo.cells[k].innerText === "") {
                        exito = false;
                        break;
                    }
                }
            }
        }
    }
    if (exito) {

        var $clone = $('#' + valores[0]).find('tr.hide').clone(true).removeClass('hide table-line');
        $clone[0].setAttribute("class", "hidetd");
        $clone.className = "hidetd";
        // $clone.id = rString;
        var edit = $clone[0].querySelectorAll(".edit");
        if (edit) {
            for (var i = 0; i < edit.length; i++) {
                edit[i].removeAttribute("value");
                edit[i].querySelector(".editKey").value = "";
            }
        }


        $('#' + valores[1]).append($clone);
    }
}

function prevalidacionAddRow(tr) {
    var tds = tr.cells;
    var exito = true;
    for (var i = 0; i < tds.length; i++) {
        if (tds[i].getAttribute("contenteditable") === "true") {
            if (tds[i].innerText === "") {
                exito = false;
                break;
            }
        }

    }
    return exito;
}

function construirObj(tr) {
    var obj = {};

    for (var i = 0; i < tr.cells.length; i++) {

        if (tr.cells[i].getAttribute('persist') !== "eliminar" && tr.cells[i].getAttribute("contenteditable") === "true") {
            if (tr.cells[i].getAttribute('tipocompon') === "editConsulta") {
                obj[tr.cells[i].getAttribute('persist')] = parseInt(tr.cells[i].firstElementChild.getAttribute('value'));
            } else if (tr.cells[i].getAttribute('tipocompon') === "select") {
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].getAttribute('valor');
            } else {
                obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
            }
            // console.log(tr.cells[i].getAttribute('persist'), "-", tr.cells[i].innerText);
        } else if (tr.cells[i].getAttribute('persist') === "numeroCredito") {
            obj[tr.cells[i].getAttribute('persist')] = tr.cells[i].innerText;
        }
    }

    if (tr.id === "") {
        var rString = "id" + randomString(2, '0123456789');
        obj['id'] = rString;
        tr.id = obj.id;
        //agregarCreditoEmpleado(obj);
    } else {
        obj['id'] = tr.id;
        //actualizarCreditoEmpleado(obj);
    }

}

function tableRemove(registro) {

    var id = registro.id;
    var i = 0;
    var per = {};
    var isNumberID = false;
    
    for (i = 0; i < periodosNomina.length; i++) {
        if (parseInt(id)) {
            if (parseInt(id) === periodosNomina[i].id) {
                per = periodosNomina[i];
                isNumberID = true;
                break;
            }
        } else {
            if (id === periodosNomina[i].id) {
                per = periodosNomina[i];
                break;
            }
        }
    }
    var movNumber = 0;
    if (isNumberID) {
        movNumber = verificarPeriodosMov(per.tipoCorrida_ID, per.tipoNomina_ID);
    } 

    if (!per.bloquear && per.status && movNumber === 0) {
        if (Number.isInteger(per.id)) {
            deletePeriodosNomina[deletePeriodosNomina.length] = per;
        }

        for (i = 0; i < periodosNomina.length; i++) {
            if (per.id === periodosNomina[i].id) {
                periodosNomina.splice(i, 1);
                break;
            }
        }
        for (i = 0; i < getData.length; i++) {
            if (per.id === getData[i].id) {
                getData.splice(i, 1);
                break;
            }
        }

        for (i = 0; i < addPeriodosNomina.length; i++) {
            if (per.id === addPeriodosNomina[i].id) {
                addPeriodosNomina.splice(i, 1);
                break;
            }
        }

    } else {

        if (!per.status) {
            alert("El periodo esta cerrado");
        } else if (movNumber > 0) {
            alert("El periodo ya esta calculado");
        } else {
            alert("El periodo esta bloqueado");
        }
        
    }


    //if (parseInt(id)) {
    //    for (var i = 0; i < dataRegAhorro.length; i++) {
    //        if (dataRegAhorro[i].id === parseInt(id)) {
    //            dataRegAhorro.splice(i, 1);
    //            break;
    //        }
    //    }
    //    //for (var i = 0; i < listaAsistNuevosYMod.length; i++) {
    //    //    if (listaAsistNuevosYMod[i].id === parseInt(id)) {
    //    //        listaAsistNuevosYMod.splice(i, 1);
    //    //        break;
    //    //    }
    //    //}
    //    deleteAhorro[deleteAhorro.length] = parseInt(id);

    //} else {
    //    for (var j = 0; j < dataRegAhorro.length; j++) {
    //        if (dataRegAhorro[j].id === id) {
    //            dataRegAhorro.splice(j, 1);
    //            break;
    //        }
    //    }
    //}


    //  alert("eliminado" + ".- " + name.id);
}

function editarTable(registro) {
    idSelecionado = registro.id;
    ConstruirModificarPer();
}

function cambiarPagina(valores) {
    //alert(valores);
    var tbl = valores['origen'];
    end = rowsByPage;
    start = valores['fromPage'];
    if (getData.length > rowsByPage) {
        var res = (rowsByPage + start) - getData.length;
        if (res > 0) {
            end = (rowsByPage + start) - res;
        } else {
            end = rowsByPage + start;
        }
    } else {
        end = getData.length;
    }
    llenartablaPer(start, end, getData);
}

//end metodos

function llenartablaPer(start, end, getData) {
    llenarTablaGen("PeriodosNomina", getData, start, end);
}

function textformateaValorAMascara(valor, mascara) {
    var dato = "";
    var obj = {};
    obj.valor = valor;
    var sub = mascara.substring(0, mascara.length - valor.toString().length);
    sub = sub.replace(/#/g, '0');
    //console.log(sub);
    mascara = sub + mascara.substring(mascara.length - valor.toString().length, mascara.length);
    // console.log(mascara);

    obj.mascara = mascara;
    var url = route + "/api/PeriodosNomina/txtFormatearMask";
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

    return dato;
}