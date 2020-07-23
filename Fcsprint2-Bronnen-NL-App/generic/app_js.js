/*
 * FC-Sprint2 project => app_js.js
 *
 * The project "diglin.eu" is property of FC-Sprint2
 *
 * Created at:
 * 17-mei-2017 @ 12:20:58
 *
 * Created by:
 * Andries van Weeren
 * a.weeren@fcroc.nl
 */

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function shuffleArray(array) {
    var arr = array;
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function AjaxCall(object) {

    $.ajax({
        url: object.url,
        async: object.async || true,
        type: object.type,
        data: object.data || {},
        dataType: object.dataType,
        beforeSend: object.beforeSend || function () {}
    })
            .done(object.success || function () {})
            .fail(object.error || function () {})
            .always(object.complete || function () {});
}