class AppExercise {

    constructor(options) {

        this.options = this.setOptions(options);
        this.app = {
            id: 0,
            title: '',
            application: '',
            language: '',
            mainobject: {}
        };
        this.score = {};
        this.timer = {};
        this.preloads = {
            images: {},
            audios: {}
        };

        this.localMedia = ['https://app.diglinplus.nl'];
        this.apiUrl = 'https://test.diglin.eu';

        this.init();
    }

    init() {

        let self = this;
        $('body').append(self.getLoading());
        this.setId(this.determineId());
        this.setApplication(this.determineApplication());
        this.getJsonData();
    }

    getLoading() {

        let container = $('<div/>', {
            class: 'container waiting'
        }).css({
            'padding-top': '25px'
        });

        let row = $('<div/>', {
            class: 'row'
        });

        let col = $('<div/>', {
            class: 'col text-center'
        }).html('<i class="fas fa-spinner fa-pulse fa-4x"></i>');

        row.append(col);
        container.append(row);

        return container;
    }

    /**
     *
     * @returns {AppExercise.app}
     */
    getApp() {

        return this.app;
    }

    /**
     *
     * @param {Object} app
     * @returns {undefined}
     */
    setApp(app) {
        this.app = app;
    }

    /**
     *
     * @param {Object} options
     * @returns {unresolved}
     */
    setOptions(options) {

        options['container'] = options.container || 'container';
        options['cardheader'] = options.card || 'card-header bg-primary text-white';
        options['directory'] = options.directory || false;
        options['filename'] = options.filename || false;
        options['timer'] = (options.timer === true);
        options['score'] = (options.score === true);
        options['containerPaddingTop'] = options.containerPaddingTop || '15px';
        options['cardBodyPaddingTop'] = options.cardBodyPaddingTop || '15px';

        return options;
    }

    getOption(option) {

        let self = this;

        return ((self.options[option] !== undefined) ? self.options[option] : false);
    }

    determineId() {

        return ((getUrlParameter('id') !== undefined) ? getUrlParameter('id') : getUrlParameter('Id'));
    }

    /**
     *
     * @returns {Integer} id
     */
    getId() {

        return this.app.id;
    }

    /**
     *
     * @param {Integer/String} id
     * @returns {undefined}
     */
    setId(id) {

        this.app.id = parseInt(id);
    }

    /**
     *
     * @returns {String} title
     */
    getTitle() {

        return this.app.title;
    }

    /**
     *
     * @param {String} title
     * @returns {undefined}
     */
    setTitle(title) {

        this.app.title = title;
    }

    /**
     * Returns ISO 639 standard; country codes are from ISO 3166 (ISO-639_ISO-3166
     * @returns {String} language
     */
    getLanguage() {
        return this.app.language;
    }

    /**
     *
     * @param {String} language
     * @returns {undefined}
     */
    setLanguage(language) {

        this.app.language = language;
    }

    /**
     *
     * @returns {String} application
     */
    getApplication() {

        return this.app.application;
    }

    setApplication(application) {

        this.app.application = application;
    }

    /**
     *
     * @param {String} sParam
     * @returns {AppExercise.getUrlParameter.sParameterName|Boolean}
     */
    getUrlParameter(sParam) {

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
    }

    /**
     * Get current application
     * @returns {String}
     */
    determineApplication() {

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

        return app;
    }

    /**
     *
     * @returns {undefined}
     */
    getJsonData() {

        let self = this;
        let postObject = {
            _: new Date().getTime(),
            'id': self.getId(),
            'application': self.getApplication()
        };

        if (self.options.directory !== undefined) {
            postObject['directory'] = self.options.directory;
        }

        if (self.options.filename !== undefined) {
            postObject['filename'] = self.options.filename;
        }

        $.post(setJsonApiUrl() + '/api/appexercise/get/' + self.getId(), postObject).done(function (response) {

            response['title'] = response.exercisetitle;
            response['mainobject'] = response.main_object;
            delete response.exercisetitle;
            delete response.main_object;

            self.setApp(response);
            self.startApplication();

            //TR.setTracker(response);
        }).fail(function (jqXHR, textStatus, errorThrown) {

            self.getErrorMessage(jqXHR, textStatus, errorThrown);

        }).always(function () {
            /**
             * finaly, after the entire game is loaded, remove the spinner-icon
             */
            $('.waiting').remove();
        });
    }

    getErrorMessage(jqXHR, textStatus, errorThrown) {

        let self = this;
        let container = self.getContainer();
        let card = self.getCard(self.getErrorCardHeader());
        card.append(self.getErrorCardBody(jqXHR.responseText));
        container.append(card);

        $('body').append(container);

        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
    }

    getContainer() {

        let self = this;
        let container = $('<div/>', {
            class: self.options.container
        }).css({
            'padding-top': self.options.containerPaddingTop
        });

        return container;
    }

    getCard(header) {

        header = header || false;
        let self = this;
        let card = $('<div/>', {
            class: 'card'
        });

        if (!header) {
            card.append(self.getCardHeader());
        }
        else {
            card.append(header);
        }

        return card;
    }

    getCardHeader() {

        let self = this;
        let cardHeader = $('<h3/>', {
            class: self.options.cardheader
        }).html(((self.getTitle() !== null && self.getTitle() !== '') ? self.getTitle() : self.getApplication()));

        return cardHeader;
    }

    getCardBody(bodyContent) {

        let self = this;
        bodyContent = bodyContent || $('<div/>', {
            class: 'row'
        }).append($('<div/>', {
            class: 'col col-md-12'
        }));

        let cardBody = $('<div/>', {
            class: 'card-body'
        }).css({
            'padding-top': self.options.cardBodyPaddingTop
        });

        if (self.options.timer || self.options.score) {

            let rowTimerScore = $('<div/>', {
                class: 'row score-timer'
            });

            if (self.options.score) {

                rowTimerScore.append(self.getScore());
            }

            if (self.options.timer) {

                rowTimerScore.append(self.getTimer());
            }

            cardBody.append(rowTimerScore);
        }

        cardBody.append(bodyContent);

        return cardBody;
    }

    getTimer() {

        let self = this;

        let colTimer = $('<div/>', {
            class: 'col col-md-6 col-timer text-right'
        });

        if (!self.getOption('score')) {

            colTimer.removeClass('col-md-6 text-right').addClass('col-md-12');
        }

        self.timer = new TIMER(colTimer);

        return colTimer;
    }

    getScore() {

        let self = this;

        let colScore = $('<div/>', {
            class: 'col col-md-6 col-score'
        });

        if (!self.getOption('timer')) {

            colScore.removeClass('col-md-6').addClass('col-md-12');
        }

        self.score = new SCORE(colScore);

        return colScore;
    }

    getErrorCardHeader() {

        let self = this;
        let cardHeader = $('<h3/>', {
            class: 'card-header bg-danger text-white'
        }).html('An Error has occured');

        return cardHeader;
    }

    getErrorCardBody(bodyContent) {

        let self = this;
        bodyContent = $('<div/>', {
            class: 'row'
        }).append($('<div/>', {
            class: 'col col-md-12'
        }).html(JSON.stringify(JSON.parse(bodyContent).error.exception[0].message, null, 2)));

        let cardBody = $('<div/>', {
            class: 'card-body'
        }).css({
            'padding-top': self.options.cardBodyPaddingTop
        });

        cardBody.append(bodyContent);

        return cardBody;
    }

    addImage(url) {
        url = this.setMediaUrl(url);

        let im = new Image();
        im.src = url;

        this.preloads.images[url] = im;
    }

    getImage(url) {

        url = this.setMediaUrl(url);
        return this.preloads.images[url];
    }

    addAudio(url) {

        url = this.setMediaUrl(url);

        let au = new Audio();
        au.src = url;

        this.preloads.audios[url] = au;
    }

    getAudio(url) {

        url = this.setMediaUrl(url);
        return this.preloads.audios[url];
    }

    setMediaUrl(url) {

        if (url === null) {
            return '';
        }

        var urlArray = url.split('\/');
        var mediaId = urlArray.indexOf('media');

        if (urlArray.indexOf('soundbars') > -1) {
            var lang = urlArray[(mediaId + 2)];
            url = url.replace('\/\/', '\/').replace('media/soundbars/' + lang, 'media/' + lang + '/soundbar');
        }

        if (urlArray.indexOf('audio') > -1 || urlArray.indexOf('img') > -1) {
            var lang = urlArray[(mediaId + 2)];
            url = url.replace('media/audio/' + lang, 'media/' + lang + '/audio').replace('media/img/' + lang, 'media/' + lang + '/img');
        }

        if (!this.checkLocalMedia()) {

            if (url.indexOf('https://media.fcsprint2.nl') > -1) {

                return url;
            }
            else if (url.indexOf('https') > -1 || url.indexOf('http') > -1) {

                let splitUrl = url.split('/');
                splitUrl[0] = 'https:';
                splitUrl[2] = 'media.fcsprint2.nl';
                url = splitUrl.join('/');
            }
            else {

                url = 'https://media.fcsprint2.nl' + url;
            }

            return url;
        }

        url = url.replace('../../', '')
                .replace('https://', '')
                .replace('http://', '')
                .replace('test.diglin.eu/', '')
                .replace('media.fcsprint2.nl/', '')
                .replace(location.protocol + '//' + location.host + '/', '');

        if (url[0] === '/') {
            url = url.substr(1);
        }

        return window.location.origin + '/' + url;

//        if (this.checkLocalMedia()) {
//
//            return window.location.origin + '/' + url;
//        }
//
//        return 'https://media.fcsprint2.nl/' + url;
    }

    checkLocalMedia() {

        if (this.localMedia.indexOf(window.location.origin) > -1) {

            return true;
        }

        return false;
    }

    setJsonApiUrl() {

        return this.apiUrl;
    }
}