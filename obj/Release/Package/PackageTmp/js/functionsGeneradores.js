/*!
 * Copyright 2020 Inc.
 * Author: Ernesto Castillo
 * Licensed under the MIT license
 * Brief: Class for personalized components 
 */


var Utilerias = (function () {
    function Utilerias() {

    }

    /*calcularCURP*/
    Utilerias.prototype.calcularCURP = function (apellidoPaterno, apellidoMaterno, nombre, fechaNacimiento, genero, estado) {
        var nom = nombre, pat = apellidoPaterno, mat = apellidoMaterno, fecha = fechaNacimiento, genero = genero, edo = estado;

        var quitar, nombres, curp;
        nom = nom.toUpperCase();
        pat = pat.toUpperCase();
        mat = mat.toUpperCase();
        genero = genero.toUpperCase();

        quitar = new RegExp(/^(DE |DEL |LO |LOS |LA |LAS )+/);
        nombres = new RegExp(/^(MARIA |JOSE )/);
        nom = nom.replace(quitar, '');
        nom = nom.replace(nombres, '');
        nom = nom.replace(quitar, '');
        pat = pat.replace(quitar, '');
        mat = mat.replace(quitar, '');
        if (mat == '') mat = 'X';

        curp = pat.substring(0, 1) + validacionesCurp.buscaVocal(pat) + mat.substring(0, 1) + nom.substring(0, 2);
        curp = validacionesCurp.cambiaPalabra(curp);
        curp += fecha.substring(8, 10) + fecha.substring(3, 5) + fecha.substring(0, 2);
        curp += (genero == 'M' ? 'H' : 'M') + validacionesCurp.estado(edo);
        curp += validacionesCurp.buscaConsonante(pat) + validacionesCurp.buscaConsonante(mat) + validacionesCurp.buscaConsonante(nom);
        curp += fecha.substring(6, 8) == '19' ? '0' : 'A';
        curp += validacionesCurp.ultdig(curp);


        return curp;
    }

    /*calcularRFC*/
    Utilerias.prototype.calcularRFC = function (apellidoPaterno, apellidoMaterno, nombre, fechaNacimiento) {
        if ((function (lhs, rhs) { return lhs || rhs; })((function (lhs, rhs) { return lhs || rhs; })
            (apellidoPaterno.length < 3, apellidoMaterno.length < 3), nombre.length < 3)) {
            return "";
        }

        fechaNacimiento = (function (sb) { sb.str = sb.str.concat(fechaNacimiento.substring(8, 10)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(fechaNacimiento.substring(3, 5)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(fechaNacimiento.substring(0, 2)); return sb; })(({ str: "", toString: function () { return this.str; } })))).str;
        apellidoPaterno = validacionesString.removerAcentos(apellidoPaterno.trim().toUpperCase());
        if (apellidoMaterno != null) {
            apellidoMaterno = validacionesString.removerAcentos(apellidoMaterno.trim().toUpperCase());
        }
        nombre = validacionesString.removerAcentos(nombre.trim().toUpperCase());
        apellidoPaterno = validacionesString.removeChar(validacionesString.removeChar(apellidoPaterno, '\''), '.'); 
        if (apellidoMaterno != null) {
            apellidoMaterno = validacionesString.removeChar(validacionesString.removeChar(apellidoMaterno, '\''), '.'); 
        }
        nombre = validacionesString.removeChar(validacionesString.removeChar(nombre, '\''), '.'); 
        var s4 = (function (sb) { sb.str = sb.str.concat(nombre); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(" "); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(apellidoMaterno == null ? "" : (function (sb) { sb.str = sb.str.concat(apellidoMaterno); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(" "); return sb; })(({ str: "", toString: function () { return this.str; } }))).str); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(apellidoPaterno); return sb; })(({ str: "", toString: function () { return this.str; } }))))).str;
        var s5;
        var s6;
        apellidoPaterno = this.quitarArticulos(apellidoPaterno);
        apellidoMaterno = this.quitarArticulos(apellidoMaterno);
        if (apellidoMaterno != null) {
            if (apellidoMaterno.length === 1 || apellidoMaterno.length === 2) {
                s5 = apellidoPaterno.substring(0, 1);
                s5 = (function (sb) { sb.str = sb.str.concat(apellidoMaterno.substring(0, 1)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s5); return sb; })(({ str: "", toString: function () { return this.str; } }))).str;
                nombre = this.ignoraNombreComun(nombre);
                s5 = (function (sb) { sb.str = sb.str.concat(nombre.substring(0, 2)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s5); return sb; })(({ str: "", toString: function () { return this.str; } }))).str;
            }
            else {
                s5 = apellidoPaterno.substring(0, 1);
                var i_1 = 1;
                do {
                    {
                        if (i_1 >= apellidoPaterno.length) {
                            break;
                        }
                        if (validacionesString.esVocal(apellidoPaterno.charAt(i_1))) { 
                            s5 = (function (sb) { sb.str = sb.str.concat(apellidoPaterno.charAt(i_1)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s5); return sb; })(({ str: "", toString: function () { return this.str; } }))).str;
                            break;
                        }
                        i_1++;
                    }
                } while ((true));
                s5 = (function (sb) { sb.str = sb.str.concat(apellidoMaterno.substring(0, 1)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s5); return sb; })(({ str: "", toString: function () { return this.str; } }))).str;
                nombre = this.ignoraNombreComun(nombre);
                s5 = (function (sb) { sb.str = sb.str.concat(nombre.substring(0, 1)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s5); return sb; })(({ str: "", toString: function () { return this.str; } }))).str;
            }
        }
        else {
            s5 = apellidoPaterno.substring(0, 2);
            nombre = this.ignoraNombreComun(nombre);
            s5 = (function (sb) { sb.str = sb.str.concat(nombre.substring(0, 1)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat("X"); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s5); return sb; })(({ str: "", toString: function () { return this.str; } })))).str;
        }
        s6 = new UtilidadesRFC().obtenerTRFCPalInconv(s5);
        if (s6 != null) {
            s5 = s6;
        }
        s5 = (function (sb) { sb.str = sb.str.concat(fechaNacimiento.substring(0, 2)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(fechaNacimiento.substring(2, 4)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(fechaNacimiento.substring(4, 6)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s5); return sb; })(({ str: "", toString: function () { return this.str; } }))))).str;
        s5 = this.calcularHomoclave(s4, fechaNacimiento, s5);
        return s5;
    };

    /*private*/
    Utilerias.prototype.ignoraNombreComun = function (s) {
        s = this.quitarArticulos(s);
        var s1 = "";
        var as = s.split(" ");
        var i = 0;
        var as1 = as;
        var j = as1.length;
        var _loop_1 = function (k) {
            {
                var s2_1 = as1[k];
                if (as.length > 1 && i < as.length - 1 && ((function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                }
                )(s2_1, "JOSE") || (function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_1, "J") || (function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_1, "MARIA") || (function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_1, "MA"))) {
                    i++;
                }
                else {
                    s1 = (function (sb) { sb.str = sb.str.concat(s2_1); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s1.length <= 0 ? "" : " "); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s1); return sb; })(({ str: "", toString: function () { return this.str; } })))).str;
                }
            }
            ;
        };
        for (var k = 0; k < j; k++) {
            _loop_1(k);
        }
        return s1;
    };


    /*private*/
    Utilerias.prototype.quitarArticulos = function (s) {
        if (s == null) {
            return null;
        }
        var as = s.split(" ");
        var s1 = "";
        var as1 = as;
        var i = as1.length;
        var _loop_2 = function (j) {
            {
                var s2_2 = as1[j];
                if (!(function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_2, "A") && !(function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_2, "DE") && !(function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_2, "DEL") && !(function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_2, "LA") && !(function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_2, "LAS") && !(function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_2, "LOS") && !(function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_2, "LOS") && !(function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_2, "Y") && !(function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_2, "Y") && !(function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_2, "VAN") && !(function (o1, o2) {
            if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                }
                })(s2_2, "VON")) {
                    s1 = (function (sb) { sb.str = sb.str.concat(s2_2); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s1.length <= 0 ? "" : " "); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s1); return sb; })(({ str: "", toString: function () { return this.str; } })))).str;
                }
            }
            ;
        };
        for (var j = 0; j < i; j++) {
            _loop_2(j);
        }
        return s1;
    };

    /*private*/
    Utilerias.prototype.calcularHomoclave = function (s, s1, s2) {
        var stringbuilder = { str: "", toString: function () { return this.str; } };
        var l = 0;
        /* append */ (function (sb) { sb.str = sb.str.concat(0); return sb; })(stringbuilder);
        var _loop_3 = function (i) {
            {
                var valor_1 = new UtilidadesRFC().obtenerTablaRFC1((function (sb) { sb.str = sb.str.concat(""); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s.charAt(i)); return sb; })(({ str: "", toString: function () { return this.str; } }))).str);
                if (valor_1 != null) {
                    /* append */ (function (sb) { sb.str = sb.str.concat(valor_1); return sb; })(stringbuilder);
                }
                else {
                    /* append */ (function (sb) { sb.str = sb.str.concat("00"); return sb; })(stringbuilder);
                }
            };
        };
        for (var i = 0; i < s.length; i++) {
            _loop_3(i);
        }
        var _loop_4 = function (j) {
            {
                l += (parseInt(/* toString */ /* append */(function (sb) { sb.str = sb.str.concat(stringbuilder.str.charAt(j)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(""); return sb; })(({ str: "", toString: function () { return this.str; } }))).str) * 10 + parseInt(/* toString */ /* append */(function (sb) { sb.str = sb.str.concat(stringbuilder.str.charAt(j + 1)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(""); return sb; })(({ str: "", toString: function () { return this.str; } }))).str)) * parseInt(/* toString */ /* append */(function (sb) { sb.str = sb.str.concat(stringbuilder.str.charAt(j + 1)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(""); return sb; })(({ str: "", toString: function () { return this.str; } }))).str);
            }
            ;
        };
        for (var j = 0; j < stringbuilder.str.length - 1; j++) {
            _loop_4(j);
        }
        var k;
        var i1;
        k = (l | 0) % 1000;
        i1 = k % 34;
        k = ((k - i1) / 34 | 0);
        var j1 = 0;
        var s3 = "";
        var _loop_5 = function () {
            {
                var getValue_1 = ('' + (j1 !== 0 ? i1 : k));
                var valor_2 = new UtilidadesRFC().obtenerTablaRFC2((function (sb) { sb.str = sb.str.concat(getValue_1); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(""); return sb; })(({ str: "", toString: function () { return this.str; } }))).str);
                if (valor_2 != null) {
                    s3 = (function (sb) { sb.str = sb.str.concat(valor_2); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s3); return sb; })(({ str: "", toString: function () { return this.str; } }))).str;
                }
                else {
                    s3 = (function (sb) { sb.str = sb.str.concat("Z"); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s3); return sb; })(({ str: "", toString: function () { return this.str; } }))).str;
                }
            }
            ;
        };
        for (; j1 <= 1; j1++) {
            _loop_5();
        }

        s2 = (function (sb) { sb.str = sb.str.concat(s3); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s2); return sb; })(({ str: "", toString: function () { return this.str; } }))).str;
        var flag = false;
        var l1 = 0;
        var _loop_6 = function (j2) {
            {
                var valor = new UtilidadesRFC().obtenerTablaRFC3((function (sb) { sb.str = sb.str.concat(s2.charAt(j2)); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(""); return sb; })(({ str: "", toString: function () { return this.str; } }))).str);
                if (valor != null) {
                    var k1 = parseInt(valor);
                    l1 += k1 * (14 - (j2 + 1));
                }
            }
            ;
        };
        for (var j2 = 0; j2 < s2.length; j2++) {
            _loop_6(j2);
        }
        var k2 = l1 % 11;
        if (k2 === 0) {
            s2 = (function (sb) { sb.str = sb.str.concat("0"); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s2); return sb; })(({ str: "", toString: function () { return this.str; } }))).str;
        }
        else {
            var i2_1 = 11 - k2;
            if (i2_1 === 10) {
                s2 = (function (sb) { sb.str = sb.str.concat("A"); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s2); return sb; })(({ str: "", toString: function () { return this.str; } }))).str;
            }
            else {
                s2 = (function (sb) { sb.str = sb.str.concat(i2_1); return sb; })(/* append */(function (sb) { sb.str = sb.str.concat(s2); return sb; })(({ str: "", toString: function () { return this.str; } }))).str;
            }
        }
        return s2;
    };

    return Utilerias;
}());


/********************* validacionesCURP *********************/

var validacionesCurp = (function () {
    function validacionesCurp() {
    }

    validacionesCurp.buscaVocal = function (str) {
        var vocales = 'AEIOU';
        var i, c;
        for (i = 1; i < str.length; i++) {
            c = str.charAt(i);
            if (vocales.indexOf(c) >= 0) {
                return c;
            }
        }
        return 'X';
    }

    validacionesCurp.buscaConsonante = function (str) {
        var vocales = 'AEIOU ��.';
        var i, c;
        for (i = 1; i < str.length; i++) {
            c = str.charAt(i);
            if (vocales.indexOf(c) < 0) {
                return c;
            }
        }
        return 'X';
    }

    validacionesCurp.cambiaPalabra = function (str) {
        var pal1 = new RegExp(/BUEI|BUEY|CACA|CACO|CAGA|CAGO|CAKA|CAKO|COGE|COJA|COJE|COJI|COJO|CULO|FETO|GUEY/);
        var pal2 = new RegExp(/JOTO|KACA|KACO|KAGA|KAGO|KOGE|KOJO|KAKA|KULO|LOCA|LOCO|MAME|MAMO|MEAR|MEAS|MEON/);
        var pal3 = new RegExp(/MION|MOCO|MULA|PEDA|PEDO|PENE|PUTA|PUTO|QULO|RATA|RUIN/);
        var val;

        str = str.substring(0, 4);

        val = pal1.test(str) || pal2.test(str);
        val = pal3.test(str) || val;

        if (val)
            return str.substring(0, 1) + 'X' + str.substring(2, 4);

        return str;

    }

    validacionesCurp.estado = function (edo) {
        var edo;
        var vestado = new Array('DF', 'AS', 'BC', 'BS', 'CC', 'CL', 'CM', 'CS', 'CH', 'DG', 'GT', 'GR', 'HG', 'JC', 'MC', 'MN',
                        'MS', 'NT', 'NL', 'OC', 'PL', 'QT', 'QR', 'SP', 'SL', 'SR', 'TC', 'TS', 'TL', 'VZ', 'YN', 'ZS', 'NE');
        return vestado[edo];
    }

    function tabla(i, x) {
        if (i >= '0' && i <= '9') return x - 48;
        else if (i >= 'A' && i <= 'N') return x - 55;
        else if (i >= 'O' && i <= 'Z') return x - 54;
        else return 0;
    }

    validacionesCurp.ultdig = function (curp) {
        var i, c, dv = 0;
        //en este punto, la variable curp tiene todo excepto el ultimo digito verificador
        //ejemplo: JIRA0302024MVZMVNA
        for (i = 0; i < curp.length; i++) {
            c = tabla(curp.charAt(i), curp.charCodeAt(i));
            dv += c * (18 - i);
        }
        dv %= 10;
        return dv == 0 ? 0 : 10 - dv;
    }

    return validacionesCurp;
}());


/********************* validacionesString *********************/

var validacionesString = (function () {

    function validacionesString() {
    }
    //Function: arrayToString
    validacionesString.arrayToString = function (ai, s) {
        var stringbuffer = { str: "", toString: function () { return this.str; } };
        if (ai.length > 0) {
            /* append */ (function (sb) { sb.str = sb.str.concat(ai[0]); return sb; })(stringbuffer);
            var _loop_1 = function (i) {
                {
                    /* append */ (function (sb) { sb.str = sb.str.concat(s); return sb; })(stringbuffer);
                    /* append */ (function (sb) { sb.str = sb.str.concat(ai[i]); return sb; })(stringbuffer);
                }
                ;
            };
            for (var i = 1; i < ai.length; i++) {
                _loop_1(i);
            }
        }
        return stringbuffer.str;
    };

    //Function: removeChar
    validacionesString.removeChar = function (s, c) {
        var stringbuffer = { str: "", toString: function () { return this.str; } };
        /* setLength */ (function (sb, length) { return sb.str = sb.str.substring(0, length); })(stringbuffer, s.length);
        var i = 0;
        for (var j = 0; j < s.length; j++) {
            {
                var c1 = s.charAt(j);
                if ((function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(c1) != (function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(c))
                    (function (sb, index, c) { return sb.str = sb.str.substr(0, index) + c + sb.str.substr(index + 1); })(stringbuffer, i++, c1);
            }
            ;
        }
        return stringbuffer.str;
    };

    //Function: removerAcentos
    validacionesString.removerAcentos = function (s) {
        if (s == null || (function (o1, o2) {
if (o1 && o1.equals) {
            return o1.equals(o2);
        }
        else {
            return o1 === o2;
        }
        })(s.trim(), ""))
            return null;
        var stringbuilder = { str: "", toString: function () { return this.str; } };
        var i = s.length;
        var _loop_2 = function (j) {
            {
                var c_1 = s.charAt(j);
                if ((function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(c_1) == '\u0147'.charCodeAt(0))
                    c_1 = '\u00d1';
                if ((function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(c_1) == '\u0148'.charCodeAt(0))
                    c_1 = '\u00f1';
                var k_1 = "\u00c0\u00e0\u00c8\u00e8\u00cc\u00ec\u00d2\u00f2\u00d9\u00f9\u00c1\u00e1\u00c9\u00e9\u00cd\u00ed\u00d3\u00f3\u00da\u00fa\u00dd\u00fd\u00c2\u00e2\u00ca\u00ea\u00ce\u00ee\u00d4\u00f4\u00db\u00fb\u0176\u0177\u00c3\u00e3\u00d5\u00f5\u00c4\u00e4\u00cb\u00eb\u00cf\u00ef\u00d6\u00f6\u00dc\u00fc\u0178\u00ff\u00c5\u00e5\u00c7\u00e7\u0150\u0151\u0170\u0171".indexOf(c_1);
                if (k_1 > -1)
                    (function (sb) { sb.str = sb.str.concat("AaEeIiOoUuAaEeIiOoUuYyAaEeIiOoUuYyAaOoNnAaEeIiOoUuYyAaCcOoUu".charAt(k_1)); return sb; })(stringbuilder);
                else 
                    (function (sb) { sb.str = sb.str.concat(c_1); return sb; })(stringbuilder);
            }
            ;
        };
        for (var j = 0; j < i; j++) {
            _loop_2(j);
        }
        return stringbuilder.str;
    };

    //Function: esVocal
    validacionesString.esVocal = function (c) {
        return (function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(c) == 'A'.charCodeAt(0) || (function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(c) == 'E'.charCodeAt(0) || (function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(c) == 'I'.charCodeAt(0) || (function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(c) == 'O'.charCodeAt(0) || (function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(c) == 'U'.charCodeAt(0);
    };

    //Function: toStringCapitalized
    validacionesString.toStringCapitalized = function (s) {
        if (s == null || (function (o1, o2) {
if (o1 && o1.equals) {
            return o1.equals(o2);
        }
        else {
            return o1 === o2;
        }
        })(s, ""))
            return null;
        s = s.toLowerCase();
        var ac = (function (s) {
            var a = []; while (s-- > 0)
                a.push(null); return a;
        })(s.length);
        var c1 = '.';
        for (var i = 0; i < s.length; i++) {
            {
                var c = s.charAt(i);
                if (/[a-zA-Z]/.test(c[0]) && !/[a-zA-Z]/.test(c1[0]))
                    ac[i] = c.toUpperCase();
                else
                    ac[i] = c;
                c1 = c;
            }
            ;
        }
        return ac.join('');
    };

    return validacionesString;
}());


/********************* UtilidadesRFC *********************/

var UtilidadesRFC = (function () {

    function UtilidadesRFC() {
        if (this.tRFCPalInconv === undefined)
            this.tRFCPalInconv = null;
        if (this.tCURPPalAltisonante === undefined)
            this.tCURPPalAltisonante = null;
        if (this.tablaRFC1 === undefined)
            this.tablaRFC1 = null;
        if (this.tablaRFC2 === undefined)
            this.tablaRFC2 = null;
        if (this.tablaRFC3 === undefined)
            this.tablaRFC3 = null;
        this.tRFCPalInconv = ([]);
        /* add */ (this.tRFCPalInconv.push(["BUEI", "BUEX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["BUEI", "BUEX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["BUEY", "BUEX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["CACA", "CACX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["CACO", "CACX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["CAGA", "CAGX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["CAGO", "CAGX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["CAKA", "CAKX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["CAKO", "CAKX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["COGE", "COGX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["COJA", "COJX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["COJE", "COJX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["COJI", "COJX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["COJO", "COJX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["CULO", "CULX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["FETO", "FETX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["GUEY", "GUEX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["JOTO", "JOTX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["KACA", "KACX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["KACO", "KACX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["KAGA", "KAGX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["KAGO", "KAGX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["KOGE", "KOGX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["KOJO", "KOJX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["KAKA", "KAKX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["KULO", "KULX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["LOCA", "LOCX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["LOCO", "LOCX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["LOKA", "LOKX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["LOKO", "LOKX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["MAME", "MAMX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["MAMO", "MAMX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["MEAR", "MEAX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["MEAS", "MEAX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["MEON", "MEOX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["MION", "MIOX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["MOCO", "MOCX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["MULA", "MULX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["PEDA", "PEDX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["PEDO", "PEDX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["PENE", "PENX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["PUTA", "PUTX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["PUTO", "PUTX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["QULO", "QULX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["RATA", "RATX"]) > 0);
        /* add */ (this.tRFCPalInconv.push(["RUIN", "RUIX"]) > 0);
        this.tCURPPalAltisonante = ([]);
        /* add */ (this.tCURPPalAltisonante.push(["BACA", "BXCA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["BAKA", "BXKA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["BUEI", "BXEI"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["BUEY", "BXEY"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["CACA", "CXCA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["CACO", "CXCO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["CAGA", "CXGA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["CAGO", "CXGO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["CAKA", "CXKA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["CAKO", "CXKO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["COGE", "CXGE"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["COGI", "CXGI"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["COJA", "CXJA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["COJE", "CXJE"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["COJI", "CXJI"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["COJO", "CXJO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["COLA", "CXLA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["CULO", "CXLO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["FALO", "FXLO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["FETO", "FXTO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["GETA", "GXTA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["GUEI", "GXEI"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["GUEY", "GXEY"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["JETA", "JXTA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["JOTO", "JXTO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KACA", "KXCA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KACO", "KXCO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KAGA", "KXGA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KAGO", "KXGO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KAKA", "KXKA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KAKO", "KXKO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KOGE", "KXGE"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KOGI", "KXGI"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KOJA", "KXJA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KOJE", "KXJE"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KOJI", "KXJI"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KOJO", "KXJO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KOLA", "KXLA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["KULO", "KXLO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["LILO", "LXLO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["LOCA", "LXCA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["LOCO", "LXCO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["LOKA", "LXKA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["LOKO", "LXKO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["MAME", "MXME"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["MAMO", "MXMO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["MEAR", "MXAR"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["MEAS", "MXAS"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["MEON", "MXON"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["MIAR", "MXAR"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["MION", "MXON"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["MOCO", "MXCO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["MOKO", "MXKO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["MULA", "MXLA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["MULO", "MXLO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["NACA", "NXCA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["NACO", "NXCO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["PEDA", "PXDA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["PEDO", "PXDO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["PENE", "PXNE"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["PIPI", "PXPI"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["PITO", "PXTO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["POPO", "PXPO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["PUTA", "PXTA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["PUTO", "PXTO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["QULO", "QXLO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["RATA", "RXTA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["ROBA", "RXBA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["ROBE", "RXBE"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["ROBO", "RXBO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["RUIN", "RXIN"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["SENO", "SXNO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["TETA", "TXTA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["VACA", "VXCA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["VAGA", "VXGA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["VAGO", "VXGO"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["VAKA", "VXKA"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["VUEI", "VXEI"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["VUEY", "VXEY"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["WUEI", "WXEI"]) > 0);
        /* add */ (this.tCURPPalAltisonante.push(["WUEY", "WXEY"]) > 0);
        this.tablaRFC1 = ([]);
        /* add */ (this.tablaRFC1.push([" ", "0"]) > 0);
        /* add */ (this.tablaRFC1.push(["-", "0"]) > 0);
        /* add */ (this.tablaRFC1.push(["\u00d1", "10"]) > 0);
        /* add */ (this.tablaRFC1.push(["\u00dc", "10"]) > 0);
        /* add */ (this.tablaRFC1.push(["0", "0"]) > 0);
        /* add */ (this.tablaRFC1.push(["1", "1"]) > 0);
        /* add */ (this.tablaRFC1.push(["2", "2"]) > 0);
        /* add */ (this.tablaRFC1.push(["3", "3"]) > 0);
        /* add */ (this.tablaRFC1.push(["4", "4"]) > 0);
        /* add */ (this.tablaRFC1.push(["5", "5"]) > 0);
        /* add */ (this.tablaRFC1.push(["6", "6"]) > 0);
        /* add */ (this.tablaRFC1.push(["7", "7"]) > 0);
        /* add */ (this.tablaRFC1.push(["8", "8"]) > 0);
        /* add */ (this.tablaRFC1.push(["9", "9"]) > 0);
        /* add */ (this.tablaRFC1.push(["&", "10"]) > 0);
        /* add */ (this.tablaRFC1.push(["A", "11"]) > 0);
        /* add */ (this.tablaRFC1.push(["B", "12"]) > 0);
        /* add */ (this.tablaRFC1.push(["C", "13"]) > 0);
        /* add */ (this.tablaRFC1.push(["D", "14"]) > 0);
        /* add */ (this.tablaRFC1.push(["E", "15"]) > 0);
        /* add */ (this.tablaRFC1.push(["F", "16"]) > 0);
        /* add */ (this.tablaRFC1.push(["G", "17"]) > 0);
        /* add */ (this.tablaRFC1.push(["H", "18"]) > 0);
        /* add */ (this.tablaRFC1.push(["I", "19"]) > 0);
        /* add */ (this.tablaRFC1.push(["J", "21"]) > 0);
        /* add */ (this.tablaRFC1.push(["K", "22"]) > 0);
        /* add */ (this.tablaRFC1.push(["L", "23"]) > 0);
        /* add */ (this.tablaRFC1.push(["M", "24"]) > 0);
        /* add */ (this.tablaRFC1.push(["N", "25"]) > 0);
        /* add */ (this.tablaRFC1.push(["O", "26"]) > 0);
        /* add */ (this.tablaRFC1.push(["P", "27"]) > 0);
        /* add */ (this.tablaRFC1.push(["Q", "28"]) > 0);
        /* add */ (this.tablaRFC1.push(["R", "29"]) > 0);
        /* add */ (this.tablaRFC1.push(["S", "32"]) > 0);
        /* add */ (this.tablaRFC1.push(["T", "33"]) > 0);
        /* add */ (this.tablaRFC1.push(["U", "34"]) > 0);
        /* add */ (this.tablaRFC1.push(["V", "35"]) > 0);
        /* add */ (this.tablaRFC1.push(["W", "36"]) > 0);
        /* add */ (this.tablaRFC1.push(["X", "37"]) > 0);
        /* add */ (this.tablaRFC1.push(["Y", "38"]) > 0);
        /* add */ (this.tablaRFC1.push(["Z", "39"]) > 0);
        this.tablaRFC2 = ([]);
        /* add */ (this.tablaRFC2.push(["0", "1"]) > 0);
        /* add */ (this.tablaRFC2.push(["1", "2"]) > 0);
        /* add */ (this.tablaRFC2.push(["2", "3"]) > 0);
        /* add */ (this.tablaRFC2.push(["3", "4"]) > 0);
        /* add */ (this.tablaRFC2.push(["4", "5"]) > 0);
        /* add */ (this.tablaRFC2.push(["5", "6"]) > 0);
        /* add */ (this.tablaRFC2.push(["6", "7"]) > 0);
        /* add */ (this.tablaRFC2.push(["7", "8"]) > 0);
        /* add */ (this.tablaRFC2.push(["8", "9"]) > 0);
        /* add */ (this.tablaRFC2.push(["9", "A"]) > 0);
        /* add */ (this.tablaRFC2.push(["10", "B"]) > 0);
        /* add */ (this.tablaRFC2.push(["11", "C"]) > 0);
        /* add */ (this.tablaRFC2.push(["12", "D"]) > 0);
        /* add */ (this.tablaRFC2.push(["13", "E"]) > 0);
        /* add */ (this.tablaRFC2.push(["14", "F"]) > 0);
        /* add */ (this.tablaRFC2.push(["15", "G"]) > 0);
        /* add */ (this.tablaRFC2.push(["16", "H"]) > 0);
        /* add */ (this.tablaRFC2.push(["17", "I"]) > 0);
        /* add */ (this.tablaRFC2.push(["18", "J"]) > 0);
        /* add */ (this.tablaRFC2.push(["19", "K"]) > 0);
        /* add */ (this.tablaRFC2.push(["20", "L"]) > 0);
        /* add */ (this.tablaRFC2.push(["21", "M"]) > 0);
        /* add */ (this.tablaRFC2.push(["22", "N"]) > 0);
        /* add */ (this.tablaRFC2.push(["23", "P"]) > 0);
        /* add */ (this.tablaRFC2.push(["24", "Q"]) > 0);
        /* add */ (this.tablaRFC2.push(["25", "R"]) > 0);
        /* add */ (this.tablaRFC2.push(["26", "S"]) > 0);
        /* add */ (this.tablaRFC2.push(["27", "T"]) > 0);
        /* add */ (this.tablaRFC2.push(["28", "U"]) > 0);
        /* add */ (this.tablaRFC2.push(["29", "V"]) > 0);
        /* add */ (this.tablaRFC2.push(["30", "W"]) > 0);
        /* add */ (this.tablaRFC2.push(["31", "X"]) > 0);
        /* add */ (this.tablaRFC2.push(["32", "Y"]) > 0);
        /* add */ (this.tablaRFC2.push(["33", "Z"]) > 0);
        this.tablaRFC3 = ([]);
        /* add */ (this.tablaRFC3.push(["0", "00"]) > 0);
        /* add */ (this.tablaRFC3.push(["1", "01"]) > 0);
        /* add */ (this.tablaRFC3.push(["2", "02"]) > 0);
        /* add */ (this.tablaRFC3.push(["3", "03"]) > 0);
        /* add */ (this.tablaRFC3.push(["4", "04"]) > 0);
        /* add */ (this.tablaRFC3.push(["5", "05"]) > 0);
        /* add */ (this.tablaRFC3.push(["6", "06"]) > 0);
        /* add */ (this.tablaRFC3.push(["7", "07"]) > 0);
        /* add */ (this.tablaRFC3.push(["8", "08"]) > 0);
        /* add */ (this.tablaRFC3.push(["9", "09"]) > 0);
        /* add */ (this.tablaRFC3.push(["A", "10"]) > 0);
        /* add */ (this.tablaRFC3.push(["B", "11"]) > 0);
        /* add */ (this.tablaRFC3.push(["C", "12"]) > 0);
        /* add */ (this.tablaRFC3.push(["D", "13"]) > 0);
        /* add */ (this.tablaRFC3.push(["E", "14"]) > 0);
        /* add */ (this.tablaRFC3.push(["F", "15"]) > 0);
        /* add */ (this.tablaRFC3.push(["G", "16"]) > 0);
        /* add */ (this.tablaRFC3.push(["H", "17"]) > 0);
        /* add */ (this.tablaRFC3.push(["I", "18"]) > 0);
        /* add */ (this.tablaRFC3.push(["J", "19"]) > 0);
        /* add */ (this.tablaRFC3.push(["K", "20"]) > 0);
        /* add */ (this.tablaRFC3.push(["L", "21"]) > 0);
        /* add */ (this.tablaRFC3.push(["M", "22"]) > 0);
        /* add */ (this.tablaRFC3.push(["N", "23"]) > 0);
        /* add */ (this.tablaRFC3.push(["&", "24"]) > 0);
        /* add */ (this.tablaRFC3.push(["O", "25"]) > 0);
        /* add */ (this.tablaRFC3.push(["P", "26"]) > 0);
        /* add */ (this.tablaRFC3.push(["Q", "27"]) > 0);
        /* add */ (this.tablaRFC3.push(["R", "28"]) > 0);
        /* add */ (this.tablaRFC3.push(["S", "29"]) > 0);
        /* add */ (this.tablaRFC3.push(["T", "30"]) > 0);
        /* add */ (this.tablaRFC3.push(["U", "31"]) > 0);
        /* add */ (this.tablaRFC3.push(["V", "32"]) > 0);
        /* add */ (this.tablaRFC3.push(["W", "33"]) > 0);
        /* add */ (this.tablaRFC3.push(["X", "34"]) > 0);
        /* add */ (this.tablaRFC3.push(["Y", "35"]) > 0);
        /* add */ (this.tablaRFC3.push(["Z", "36"]) > 0);
        /* add */ (this.tablaRFC3.push([" ", "37"]) > 0);
        /* add */ (this.tablaRFC3.push(["\u00d1", "38"]) > 0);
    }

    UtilidadesRFC.prototype.obtenertCURPPalAltisonante = function (valor) {
        for (var i = 0; i < this.tCURPPalAltisonante.length; i++) {
            {
                if ((function (o1, o2) { return o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()); })(/* get */ this.tCURPPalAltisonante[i][0], valor)) {
                    return this.tCURPPalAltisonante[i][1];
                }
            }
            ;
        }
        return null;
    };

    //Function: obtenerTRFCPalInconv
    UtilidadesRFC.prototype.obtenerTRFCPalInconv = function (valor) {
        for (var i = 0; i < this.tRFCPalInconv.length; i++) {
            {
                if ((function (o1, o2) { return o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()); })(/* get */ this.tRFCPalInconv[i][0], valor)) {
                    return this.tRFCPalInconv[i][1];
                }
            }
            ;
        }
        return null;
    };

    UtilidadesRFC.prototype.obtenerTablaRFC1 = function (valor) {
        for (var i = 0; i < this.tablaRFC1.length; i++) {
            {
                if ((function (o1, o2) { return o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()); })(/* get */ this.tablaRFC1[i][0], valor)) {
                    return this.tablaRFC1[i][1];
                }
            }
            ;
        }
        return null;
    };

    UtilidadesRFC.prototype.obtenerTablaRFC2 = function (valor) {
        for (var i = 0; i < this.tablaRFC2.length; i++) {
            {
                if ((function (o1, o2) { return o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()); })(/* get */ this.tablaRFC2[i][0], valor)) {
                    return this.tablaRFC2[i][1];
                }
            }
            ;
        }
        return null;
    };

    UtilidadesRFC.prototype.obtenerTablaRFC3 = function (valor) {
        for (var i = 0; i < this.tablaRFC3.length; i++) {
            {
                if ((function (o1, o2) {
                    return o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase());
                })
                    (/* get */this.tablaRFC3[i][0], valor)) {
                    return this.tablaRFC3[i][1];
                }
            };
        }
        return null;
    };
    return UtilidadesRFC;

}());





