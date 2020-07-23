/**
 *  var t = new TIMER([ID]/[CLASS]);
 *  (object) target is the element on which the timer will be displayed
 */

function TIMER(target) {
    var self = this;
    self.timer = false;
    self.sec = 0;

    /**
     *	Initiates TIMER on target-element(s)
     */
    self.init = function () {
        var style = $('<style></style>').attr('type', 'text/css').html(target + ' .inline{display: inline-block}');
        $('head').append(style);
        self.sec = 0;
        $(target).html('');
        var minutes = $('<div/>', {
            id: 'minutes',
            class: 'inline'
        }).css({
            'padding-right': '6px'
        }).html(self.pad(parseInt(self.sec / 60, 10)));

        var seconds = $('<div/>', {
            id: 'seconds',
            class: 'inline'
        }).css({
            'padding-left': '6px'
        }).html(self.pad(self.sec % 60));

        $(target).append(minutes, ':', seconds).css('font-size', '2.0em');

    };

    /**
     *	(int) val
     *	Puts a leading 0 in front if val < 10
     */
    self.pad = function (val) {
        return val > 9 ? val : "0" + val;
    };

    /**
     *	Start TIMER with interval of 1000ms
     */
    self.start = function () {
        if (self.timer === false) {
            self.timer = setInterval(
                    function () {
                        $("#seconds").html(self.pad(++self.sec % 60));
                        $("#minutes").html(self.pad(parseInt(self.sec / 60, 10)));
                    },
                    1000);
        }
    };

    /**
     *	Stops TIMER
     */
    self.stop = function () {
        clearInterval(self.timer);
    };

    /**
     *	Stops TIMER and reinitiates it
     */
    self.reset = function () {
        self.stop();
        self.init();
    };

    /**
     * returns (string) with current min and sec
     */
    self.getTime = function () {
        return self.pad(parseInt(self.sec / 60, 10)) + ':' + self.pad(self.sec % 60);
    }

    self.init();
}