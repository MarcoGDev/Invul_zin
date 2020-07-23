/*
 * FC-Sprint2 project => score.js
 *
 * The project "diglin.eu" is property of FC-Sprint2
 *
 * Created at:
 * 30-nov-2016 @ 9:49:36
 *
 * Created by:
 * Andries van Weeren
 * a.weeren@fcroc.nl
 */


/**
 *  var s = new SCORE([ID]/[CLASS]);
 *  (object) target is the element on which the score will be displayed
 */
function SCORE(target) {
    var self = this;
    self.right = 0;
    self.wrong = 0;
    self.audio = {
        right: new Audio('/js/generic/audio/good.mp3'),
        wrong: new Audio('/js/generic/audio/false.mp3')
    };

    /**
     *	If tagert is set initiate SCORE on target-element(s)
     */
    self.init = function (right, wrong) {
        self.right = right || 0;
        self.wrong = wrong || 0;

        target = target || null;
        if (target !== null) {
            var style = $('<style></style>').attr('type', 'text/css').html(target + ' .inline{display: inline-block;}' + target + ' .symbol{margin: 0px 10px;}');
            $('head').append(style);

            $(target).html('');
            var rightInner = $('<div></div>').addClass('rightInner inline').html(self.right);
            var iCheck = $('<i></i>').addClass('fas fa-check');
            var rightOuter = $('<div></div>').addClass('symbol inline').append(iCheck);

            var wrongInner = $('<div></div>').addClass('wrongInner inline').css('margin-left', '10px').html(self.wrong);
            var wrontOuter = $('<div></div>').addClass('symbol inline').append($('<i></i>').addClass('fas fa-times'));

            var right = $('<div></div>').attr('id', 'right').addClass('inline text-success').append(rightInner, rightOuter);
            var wrong = $('<div></div>').attr('id', 'wrong').addClass('inline text-danger').append(wrongInner, wrontOuter);
            $(target).append(right, ' | ', wrong).css('font-size', '2.0em');
        }

    };

    /**
     *	Adds 1 to self.right
     */
    self.addRight = function () {
        self.right++;
        $('.rightInner').html(self.right);
    };

    /**
     *	Adds 1 to self.wrong
     */
    self.addWrong = function () {
        self.wrong++;
        $('.wrongInner').html(self.wrong);
    };

    /**
     *	Resets SCORE
     */
    self.reset = function (right, wrong) {
        right = right || 0;
        wrong = wrong || 0;
        self.init(right, wrong);
    };

    /**
     * Plays good.mp3
     */
    self.playRight = function () {
        self.audio.right.play();
    };

    /**
     * Plays false.mp3
     */
    self.playWrong = function () {
        self.audio.wrong.play();
    };

    self.init();
}
