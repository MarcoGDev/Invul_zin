/*
 * FC-Sprint2 project => checker.js
 *
 * The project "diglin.eu" is property of FC-Sprint2
 *
 * Created at:
 * 1-sep-2016 @ 8:36:42
 *
 * Created by:
 * Andries van Weeren
 * a.weeren@fcroc.nl
 */

$(document).ready(function () {

    if ($('form')) {
        var getForm = $('form');
        $('.container').prepend(getForm);
    }

    $('body').hide();
    var check_URL = '/api/login_check',
            Target_URL = '/login_check_ext',
            Return_URL = window.location.href;
    $.ajax({
        async: false,
        url: check_URL
    }).done(function (response) {

        if (response.IS_AUTHENTICATED_FULLY === true ||
                response.IS_AUTHENTICATED_REMEMBERED === true) {
            if (response.user.username.roles.indexOf('ROLE_ADMIN') > -1) {

                $('body').show();
            }
            else {
                $('body').html('<div class="container">\
                                        <div class="col-md-12 text-center text-danger">You have no permission to view the requested page</div>\
                                        <div class="col-md-12 text-center text-danger">\
                                            <form id="targeturl" action="' + Target_URL + '" method="post">\
                                                <input type="hidden" name="api_url" value="' + Return_URL + '" />\
                                                <input type="submit" class="btn btn-primary" value="Login"/></div>\
                                            </form>\
                                        </div>').show();
            }
        }
        else {
            var form = $('<form id="targeturl" action="' + Target_URL + '" method="post">' +
                    '<input type="text" name="api_url" value="' + Return_URL + '" />' +
                    '</form>');
            $('body').html(form);
            $(form).submit();
        }
    }).fail(function () {
        $('body').html('Not allowed').show();
    });
    $('table.table').css({'width': '100%'});
});