/*
 * FC-Sprint2 project => navigation.js
 *
 * The project "diglin.eu" is property of FC-Sprint2
 *
 * Created at:
 * 8-dec-2016 @ 9:06:35
 *
 * Created by:
 * Andries van Weeren
 * a.weeren@fcroc.nl
 */

function NAVIGATION(target, brand) {
    var self = this;
    self.brand = brand || '';

    self.init = function () {

        var style = '<style type="text/css">.navbar{margin-bottom: 0px;} .navbar-control{position: fixed;display: block;top: 0.3em;right: 1.0em;z-index: 1000;} .menuright{margin-right: 3.0em;}.list-unstyled li{margin:2px 0px}.navbar-logo{height:35px;margin:0px auto;margin-top:5px;}</style>';
        var navbar = '<div class="navbar-control"> \
                <ul class="list-unstyled"> \
                    <li><a class="navbar-toggler btn btn-primary" id="btnReload"><i class="fa fa-refresh"></i></a></li> \
                    <li><a class="navbar-toggler btn btn-primary" id="btnBack" href="javascript:history.go(-1)" data-rel="back"><i class="fa fa-arrow-left"></i></a></li> \
                </ul> \
            </div>';

        $('head').append(style);
        $(target).empty().append(navbar);
        self.events();
    };

    self.events = function () {
        //    if (device.platform === "iOS" && parseInt(device.version) === 9) {
        //        $.mobile.hashListeningEnabled = false;
        //    }
        function goBack() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
                // IOS DEVICE
                history.go(-1);
            }
            else if (userAgent.match(/Android/i)) {
                // ANDROID DEVICE
                navigator.app.backHistory();
            }
            else {
                // EVERY OTHER DEVICE
                history.go(-1);
            }
        }

        $(document).on('click', '#btnReload', function () {
            location.reload();
        });
    };
    self.init();
}
