/*
 * FC-Sprint2 project => nt2school.js
 *
 * The project "diglin.eu" is property of FC-Sprint2
 *
 * Created at:
 * 4-jul-2017 @ 10:32:52
 *
 * Created by:
 * Andries van Weeren
 * a.weeren@fcroc.nl
 */


function checkMediaLocation() {
    var ip = location.host;
    var locations = [
        'app.diglinplus.nl',
        'lcl.diglin-plus.eu'
    ];

    if (locations.indexOf(ip) > -1) {
        return true;
    }

    return false;
}

function checkLocation() {
    var ip = location.host;
    var locations = [
        '10.35.92.70',
        '10.35.92.71',
        '37.46.138.72',
        'www.diglinplus.nl',
        'lcl.diglin-plus.eu',
        'ld.fcsprint2.nl',
        'app.diglinplus.nl'
    ];

    if (locations.indexOf(ip) > -1) {
        return true;
    }

    return false;
}

function getAppData() {
    var host = window.location.href.split('\/');
    var foundID = host.indexOf('applications');
    var app = '';
    if (foundID > -1) {
        app = host[foundID + 1];
    }
    else {
        foundID = host.indexOf('application');
        app = host[foundID + 1];
    }

    return {
        'id': ((getUrlParameter('id') !== undefined) ? getUrlParameter('id') : getUrlParameter('Id')),
        'app': app
    };
}

function setJsonUrl(app) {
    var host = window.location.href.split('\/');
    var foundID = host.indexOf('applications');

    app = app || null;

    if (foundID > -1) {
        app = host[foundID + 1];
    }
    else {
        foundID = host.indexOf('application');
        app = host[foundID + 1];

    }

    if (window.location.hostname.indexOf('nt2school') > -1 || window.location.hostname.indexOf('diglin-plus') > -1 || checkLocation()) {
        return 'https://test.diglin.eu/applications/' + app + '/';
    }
    return '';
}

function setMediaUrl(url) {

    if (url === null) {
        return '';
    }

    url = url.replace('../../', '').replace('https://test.diglin.eu/', '').replace('https://media.fcsprint2.nl/', '').replace(location.protocol + '//' + location.host + '/', '');

    if (url[0] === '/') {
        url = url.substr(1);
    }

    var ip = location.host;
    var urlArray = url.split('\/');

    var soundbarId = urlArray.indexOf('soundbars');
    var mediaId = urlArray.indexOf('media');

    if (urlArray.indexOf('soundbars') > -1) {
        var lang = urlArray[(mediaId + 2)];
        url = url.replace('\/\/', '\/').replace('media/soundbars/' + lang, 'media/' + lang + '/soundbar');
    }

    if (urlArray.indexOf('audio') > -1 || urlArray.indexOf('img') > -1) {
        var lang = urlArray[(mediaId + 2)];
        url = url.replace('media/audio/' + lang, 'media/' + lang + '/audio').replace('media/img/' + lang, 'media/' + lang + '/img');
    }

    if (checkMediaLocation()) {

        return location.protocol + '//' + location.host + '/' + url;
    }

    return 'https://media.fcsprint2.nl/' + url;
}

function setJsonApiUrl() {

    if (window.location.hostname.indexOf('nt2school') > -1 || window.location.hostname.indexOf('diglin-plus') > -1 || checkLocation()) {
        return 'https://test.diglin.eu';
    }
    return '';
}

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
