class ExerciseCMS extends all
{
    constructor() 
    {
        super();

        this.JSON_DATA = 
        {
            id: 0,
            title: "new exercise",
            language: "nl_NL",
            application: "invul_zin_V3",
            main_object: 
            {
                title: "new exercise",
                language: "nl_NL",
                exercises: [{'wordArray':[],'audio':'','img':''}]
            }
        };

        this.getLanguageSelector();
        this.audio = new Audio();
        this.MEDIA_OBJECT = [];
        this.ID = this.getUrlParameter('id');
        this.SOME = new RegExp(/[A-Za-zÀ-ÿ]/g);
        this.TITLE = "CMS";
        this.LANGUAGE = "nl_NL";
        this.createAll();
        this.EXERCISES = [];
        this.counter = 0;

        if (this.ID == "new")
        {
            this.getFileArray();
        }
        else
        {
            this.readJSONData();
        } 
    }


	getLanguageSelector()
	{
		var s = this;
		$.ajax({
				url: "https://test.diglin.eu/api/languages/unique",
				type: "post",
				async: true,
				dataType: 'json'
		}).done(function (response)
		{
                var selector = $('#languageSelector');
                
				$.each(response, function ()
				{
						var option = (this.isoCode === s.LANGUAGE) ? $('<option selected></option>').val(this.isoCode).html(this.fullname) : $('<option></option>').val(this.isoCode).html(this.fullname);
						$(selector).append(option);
                });
                s.LANGUAGE = $('#languageSelector').val();

                $(selector).on("change", function() {
                    s.LANGUAGE = $(this).val();
                    s.getFileArray();
                })
				$(selector).selectpicker();
		}).fail(function (jqXHR, textStatus, errorThrown)
		{
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
		});
    }

    getFileArray() 
    {
        let self = this;
        let request = {language: self.LANGUAGE};
        $.ajax({
            url: "https://media.fcsprint2.nl/api/media/fileList",
            type: "post",
            async: true,
            data: request,
            dataType: 'json'
        }).done(function(response)
        {
            //console.log(response);
            self.MEDIA_OBJECT = response;
            self.createEdit();
        }).fail(function(jqXHR, textStatus, errorThrown) 
        {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
    }

    readJSONData()
    {
        let self = this;
        let host = window.location.href.split('\/');
        let foundID = host.indexOf('applications');
        let app = '';
        if(foundID > -1) app = host[foundID + 1]
 
        let appData = getAppData();
 
        $.post(setJsonApiUrl() + '/api/appexercise/get/' + appData.id, {
          _: new Date().getTime(),
          'id': appData.id,
          'application': appData.app
 
        }).done(function(response)
        {
            // console.log(response);
            self.JSON_DATA = self.unstring.returnData({'data':response, 'keys':['img','audio']});
            console.log(self.JSON_DATA);
            
            self.getFileArray();
        }).fail(function(jqXHR,textStatus,errorThrown)
        {
        //     console.log(jqHRX);
        //     console.log(textStatus);
        //     console.log(errorThrown);
        })
    }

    createEdit()
    {
        let self = this;
        let exercises = self.JSON_DATA.main_object.exercises;
        $('#Title').val(self.JSON_DATA.main_object.title);
        $('#holder').html('');
        for (let i = 0; i < exercises.length; i++)
        {
            let cardBodyBackground = self.cardBodyAppend(i, true, true);
            $('#holder').append(cardBodyBackground);
            
        }
    }

    // Initializing
    createAll() 
    {
        const self = this;
		$("#languageSelector")
        self.createCardBody();
        

    }

    exerciseTitle(edit) 
    {
        let topButtons = this.topButtons();

        let titleWidth =$('<div/>',
        {
            'class':'col-6'
        });

        let createTitle=$('<input/>', 
        {
            'id':'Title',
            'placeholder':'Title',
            'class':'form-control '
        });

        let containerFluid=$('<div/>',
        {
            'class':'container-fluid'
        });

        (titleWidth).append(createTitle, containerFluid, topButtons);

        return titleWidth
    }


    topButtons()
    {
        let self = this;
        let topControlBtn=$('<div/>', 
        {
            'class':'topBtn'
        });

        let plusButton=$('<button/>', 
        {
            'class':'btn btn-primary m-2 ml-1 btn-md'
        }).html('<i class="fas fa-plus fa-fw" aria-hidden="true"></i>').on('click', function() 
        {
                let x = $(".outputButtons").length;
                let cardBodyBackground = self.cardBodyAppend(x);
                $('#main').append(cardBodyBackground);
        });


        let infoButton=$('<button/>', 
        {
            'class': 'btn btn-info',
            'data-toggle':'modal',
            'data-target':'#infoModal'
         }).html('<i class="fas fa-info-circle fa-fw"></i>').on("click", function() {
            bootbox.alert({
                size: "medium",
                title: "Exercise info",
                message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lectus ex, ullamcorper non tellus vel, efficitur pellentesque urna. Nunc hendrerit iaculis arcu, sit amet elementum magna aliquet sit amet. Nam quis pretium eros. Phasellus vehicula vehicula eros, ac ultricies magna facilisis eu. Quisque vitae fringilla risus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla in quam feugiat arcu mattis venenatis a nec libero.",
            })
         });

         let backButton=$('<button/>', 
        {
            'class':'btn btn-danger m-2 ml-1 btn-md'
            }).html('<i class="fas fa-arrow-left fa-fw" aria-hidden="true"></i>').on("click", function() 
        {
             window.location.replace("./index.php");
                
        });

          topControlBtn.append(plusButton, infoButton, backButton);
          return topControlBtn;
    }

    saveButton() 
    {
        let self = this;

        let saveBtnRow=$('<button/>', 
        {
            'id':'saveBtnRow',
            'class':'btn btn-primary m-4 btn-md'
        }).on("click", function() {
            self.getAllData();
          }).html('<i class="fas fa-save fa-fw"></i>');
          
          return saveBtnRow;
    };

    delMethod(cardBodyBackground, index)
    {
        let self = this;

        let divDelBtnRow=$('<div/>', 
        {
            'class': 'col-md-1'
        });

        let deleteButton=$('<button/>', 
        {
            'class':'btn btn-danger mw-1',
            'id':'del_' + index
        }).html('<i class="fa fa-trash fa-fw" aria-hidden="true"></i>').on("click", function()
        {
            let ID = self.id(this);
            //$(cardBodyBackground).remove();
            self.JSON_DATA.main_object.exercises.splice(ID,1);
            self.createEdit();

        });

           (divDelBtnRow).append(deleteButton);
            return divDelBtnRow;
    };


    createCardBody() 
    {
        let self = this;
        let createRow = this.createRow();

        let cardBody =$('<div/>',
        {
            'class':'card-body '
        });

        $('#main').prepend(cardBody);
        $(cardBody).append(createRow);

        let holder =$('<div/>',
        {
            'class':'card-body',
            'id':'holder'
        }).appendTo('#main');
    }

    createRow()
    {
        let titleWidth = this.exerciseTitle();
        let saveBtnRow = this.saveButton();

        let createRow =$('<div/>',
        {
            'class':'row justify-content-between'

        });

        (createRow).append(titleWidth, saveBtnRow);

        return createRow;
    }



    textInputField(x, edit, outputButtons) 
    {   
        let wordRemember;
        let sentenceRemember;

        let self = this;

        let createText=$('<textarea/>', 
        {
            'id':'Text_' + x,
            'placeholder':'Text',
            'class':'form-control col col-md-4',
            'rows':'10'
        }).on("input", function() 
        {
            let ID = self.id(this);
            wordRemember = $(this).val();

            let woorden = $(this).val().match(/\b(\w|')+\b/gim);

           
            $('.word').popover('hide');
            outputButtons.empty();
            let objectArray = [];
            for (let i = 0; i < woorden.length; i++) 
            {

                objectArray.push({'word':woorden[i],'input': false,'audio': false, 'img': false});

             }

             self.JSON_DATA.main_object.exercises[ID] = {'wordArray':objectArray,'audio':'','img':''};

             for (let i = 0; i < objectArray.length; i++)
             {
                console.log(objectArray[i]['word']); 
                let btnID = '#btn_' + x + '_' + i;
                
                let outputBtn = self.btnCheckbox(objectArray[i]['word'], edit ,objectArray[i]['input'], btnID);
                outputButtons.append(outputBtn);  
             }

                 // self.eventFunctions();
        });

        if (edit)
        {
            let textarea = self.JSON_DATA.main_object.exercises[x].wordArray;
            let text = '';
            for (let i = 0; i < textarea.length; i++)
            {
                text = text + textarea[i].word;
                if (i != textarea.length - 1)
                {
                    text += ' ';
                }
                let btnID = '#btn_' + x + '_' + i;

                let outputBtn = self.btnCheckbox(textarea[i].word, edit, textarea[i].input,btnID)
                outputButtons.append(outputBtn);
            }
                createText.val(text);
                // self.eventFunctions();
        }
        return createText;
    }

    btnCheckbox(woord, edit, input, btnID)
    {
        let self = this;
        let ID = self.id(btnID);


        let btnCheckBoxVolume = $('<input/>', 
        {
            'type':'checkbox',
            'class':'my-2',
            'checked':self.JSON_DATA.main_object.exercises[ID[0]]['wordArray'][ID[1]]['audio']
        }).on('click', function()
        {
            let bool = $(this).is(':checked');
            
            let ID = self.id(btnID);
            
            self.JSON_DATA.main_object.exercises[ID[0]]['wordArray'][ID[1]]['audio'] = bool;
        });

        let audioUrl = self.MEDIA_OBJECT.domain + "/media/"+ self.LANGUAGE + "/audio/" + woord.toLowerCase() + ".mp3"

        let checkboxVolumeIcon=$('<i/>', 
        {
            'class':'fas fa-fw fa-volume-up mt-1 mr-1'
        }).on('click', function()
        {
            self.audio.src = self.MEDIA_OBJECT.domain + "/media/"+ self.LANGUAGE + "/audio/" + woord.toLowerCase() + ".mp3";
            self.audio.play();
            console.log(self.audio.src);
            
        });
       
        let btnCheckImageBox =$('<input/>',
         {
            'type':'checkbox',
            'class':'my-2',
            'checked':self.JSON_DATA.main_object.exercises[ID[0]]['wordArray'][ID[1]]['img']
        }).on('click', function(){
            let bool = $(this).is(':checked');
            
            let ID = self.id(btnID);
            
            self.JSON_DATA.main_object.exercises[ID[0]]['wordArray'][ID[1]]['img'] = bool;
            console.log(self.JSON_DATA.main_object.exercises);
        
        });

        let checkboxImageIcon=$('<i/>', 
        {
            'class':'fas fa-fw fa-image mt-1 mr-1'
        }).on('click', function(){

            let image = $("<img/>",
            {
                src: self.MEDIA_OBJECT.domain + "/media/" + self.LANGUAGE + "/img/" + woord.toLowerCase() + ".jpg"      
            });
                bootbox.alert
                ({        
                size: "small",
                title: "",
                message: image
            });
            outputBtn.popover('hide');

        });


        var imgLink = self.MEDIA_OBJECT.domain + "/media/" + self.LANGUAGE + "/img/"
        console.log(imgLink);

        let buttonImageIcon=$('<i/>', 
        {
            'class':'fas fa-fw fa-times'
        });

        let btnCheckBoxDiv=$('<div/>', 
        {
            'class':'text-center'
        })

        let outputBtn = self.outputBtn(btnCheckBoxDiv, woord, edit, input, btnID);


        var arrPath = self.JSON_DATA.main_object.exercises[ID[0]]['wordArray'][ID[1]]['word'];


        if (self.MEDIA_OBJECT.image.files.indexOf(arrPath + '.jpg') === -1 &&
            self.MEDIA_OBJECT.audio.files.indexOf(arrPath + '.mp3') === -1)
        {
           outputBtn.popover('disable');
        }

        if (self.MEDIA_OBJECT.image.files.indexOf(arrPath + '.jpg') > -1 &&
            self.MEDIA_OBJECT.audio.files.indexOf(arrPath + '.mp3') > -1 )
        {
            btnCheckBoxDiv.append(checkboxVolumeIcon, btnCheckBoxVolume, checkboxImageIcon, btnCheckImageBox);
        } 
        else if (self.MEDIA_OBJECT.image.files.indexOf(arrPath + '.jpg') === -1 &&
            self.MEDIA_OBJECT.audio.files.indexOf(arrPath + '.mp3') > -1)
        {
            btnCheckBoxDiv.append(checkboxVolumeIcon, btnCheckBoxVolume);
        }
        else if (self.MEDIA_OBJECT.image.files.indexOf(arrPath + '.jpg') > -1 &&
            self.MEDIA_OBJECT.audio.files.indexOf(arrPath + '.mp3') === -1)
        {
            btnCheckBoxDiv.append(checkboxImageIcon, btnCheckImageBox);

        }
        
        return outputBtn;
    }

    outputBtn(btnCheckBoxDiv, woord, edit, input, btnID)
    {
        let self = this;
        let outputBtn=$('<button/>', 
        {
            'class': 'word btn btn-secondary mt-2 mr-2 pop',
            'data-container':'body',
            'data-toggle':'popover',
            'data-placement':'bottom'
        }).html(woord).on('click',function()
        {
            var ID = self.id(btnID);
            
            $('.word').not(this).popover('hide');
            
            if($(this).hasClass('btn btn-secondary'))
            {
                $(this).toggleClass('btn-secondary btn-outline-danger');
                self.JSON_DATA.main_object.exercises[ID[0]]['wordArray'][ID[1]]['input'] = true;
            }
            else
            {
                $(this).toggleClass('btn-outline-danger btn-secondary');
                self.JSON_DATA.main_object.exercises[ID[0]]['wordArray'][ID[1]]['input'] = false;
            }
        }).popover({trigger: "manual",html: true,animation:false, container:'body',placement:'bottom', content: btnCheckBoxDiv})
        .on("mouseenter", function(e)
        {
            var s = this;

            var id = $(this).attr('aria-describedby');

            $('body>.popover').each(function(i,ui)
            {
                if(id !== $(ui).attr('id'))
                {
                    $(ui).popover('hide');
                }
            });
            
            $(this).popover("show");

            $(".popover").on("mouseleave", function()
            {
                $(s).popover('hide');
            });
        }).on("mouseleave", function()
        {
            var s = this;
            setTimeout(function()
            {
                if (!$(".popover:hover").length)
                {
                    $(s).popover("hide");
                }
            }, 400);
        });


        if (edit)
        {
            if (input == "true")
            {
                outputBtn.toggleClass('btn-outline-danger btn-secondary');
            }
        }
        return outputBtn;
    }


    textGroupAppend(index, cardBodyBackground, edit)
    {
        let textGroup=$('<div/>', 
        {
            'class':'input-group mb-2'
        });

        let textButton=$('<button/>', 
        {
             'id':'textButton',
             'class':'btn btn-primary'
        }).html('<i class="fas fa-font fa-fw"></i>');

        let textGroupAppend=$('<div/>',
        {
            'class':'input-group-append'
        });

        let outputButtons = $('<div/>', 
        {
            'class':'col outputButtons',
            'id':'outputButtons_' + index
        });

        let createText = this.textInputField(index, edit, outputButtons);
        let divDelBtnRow = this.delMethod(cardBodyBackground, index);

        $(textGroupAppend).append(textButton);
        $(textGroup).append(createText, textGroupAppend, outputButtons, divDelBtnRow);

        return [textGroup];

    }

    cardBodyAppend(index, edit, NEW ) 
    {   
        
        let cardBodyBackground=$('<div/>', 
        {
            'class': 'card-body form-group  bg-light exercise-rule inputs',
            'id':'cardBodyBG_' + index
        });

        let cardRow =$('<div/>',
        {
            'class':'row col col-md-2 '
        });

        let textGroupAppend = this.textGroupAppend(index, cardBodyBackground, edit);
        let textGroup = textGroupAppend[0];
        let showcaseIMG = textGroupAppend[1];
        let audioGroup = this.audioGroup(index, edit);
        let imgGroup = this.imgGroup(showcaseIMG, index, edit);
        
        (cardBodyBackground).append(cardRow, textGroup, audioGroup, imgGroup);

        return cardBodyBackground;
    }

    audioGroup(x, edit)
    {
        let self = this;

            let audioGroup=$('<div/>', 
            {
                'class':'input-group mb-2'
            });

            let createAudio=$('<input/>', 
            {
                'id':'audioInput_' + x,
                'placeholder':'Audio',
                'class':'form-control col col-md-4'
            }).autocomplete(
            {
                maxResults: 10,
                minLength: 2,
                source: function (request, response) 
                {
                    var results = $.ui.autocomplete.filter(self.MEDIA_OBJECT.audio.files, request.term);
                    response(results.slice(0, this.options.maxResults));
                },
                close: function(e, ui)
                {
                    var ID = self.id(e.target.id);
                    var m = e.target.value.match(self.getName);
 
                    $('#audioInput_' + ID).val(m[1]);

                    self.JSON_DATA.main_object.exercises[ID]['audio'] = self.URL + self.MEDIA_OBJECT.audio.path + m[0];
                }
            }).on('input',function()
            {
                let ID = self.id(this);
                if ($(this).val() === '')
                {
                    self.JSON_DATA.main_object.exercises[ID]['audio'] = '';
                }
            });

             let audioGroupAppend=$('<div/>',
            {
              'class':'input-group-append'
            });

             let audioButton = this.audioButton(createAudio);

             if (edit) {
                let name = self.JSON_DATA.main_object.exercises[x].audio.match(self.getName);
                createAudio.val(name[1]);
            }
            
             (audioGroupAppend).append(audioButton);
             (audioGroup).append(createAudio, audioGroupAppend);

             return audioGroup;
    }

    audioButton(createAudio) 
    {
        let self = this;
        let audioButton=$('<button/>', 
        {
            'id':'audioButton',
             'class':'btn btn-primary'
        }).on('click', function ()
        {
            let audioInput = createAudio
            if (!self.audio.paused) 
        {
            self.audio.pause();
            self.audio.currentTime = 0

            console.log(audioInput);
            
            if(self.audio.src !== self.MEDIA_OBJECT.domain + "/media/"+ self.LANGUAGE + "/audio/" + audioInput.val().replace(/(\s)/ig, '%20')) 
            {
              self.audio.src = self.MEDIA_OBJECT.domain + "/media/"+ self.LANGUAGE + "/audio/" + audioInput.val()
              self.audio.play();
            }
        }
           else  
          {
            self.audio.src = self.MEDIA_OBJECT.domain + "/media/"+ self.LANGUAGE + "/audio/" + audioInput.val()
            self.audio.play();
          }
        }).html('<i class="fas fa-volume-up fa-fw"></i>');

        return audioButton;
    }

    imgGroup(showcaseIMG, x, edit)
    {
        let self = this;

        let imgGroup=$('<div/>', 
        {
            'class':'input-group mb-2'
        });

        let imgGroupAppend=$('<div/>',
        {
            'class':'input-group-append'
        });

        let imgButton=$('<button/>', 
        {
            'id':'imgButton',
            'class':'btn btn-primary'
        }).on('click', function()
        {
            let val = $(getIMG).val()
            
            let path = self.URL + self.MEDIA_OBJECT.image.path + val;
            console.log(val);
            
            console.log(path);

           self.getBootBoxImage(path);
       }).html('<i class="fas fa-camera fa-fw"></i>');

        let getIMG=$('<input/>', 
        {
            'id':'imgInput_' + x,
            'placeholder':'IMG',
            'class':'form-control  col col-md-4 '
        }).autocomplete(
            {    
                maxResults: 10,
                minLength: 2,
                source: function (request, response) 
                {
    
                    var results = $.ui.autocomplete.filter(self.MEDIA_OBJECT.image.files, request.term);
                    response(results.slice(0, this.options.maxResults));
                },
                select: function (event, ui) 
                {
                    self.grabImage(ui.item.value, showcaseIMG);
                },
                close: function(e, ui)
                {
                    var ID = self.id(e.target.id);
                    var m = e.target.value.match(self.getName);
 
                    $('#imgInput_' + ID).val(m[1]);

                    self.JSON_DATA.main_object.exercises[ID]['img'] = self.URL + self.MEDIA_OBJECT.image.path + m[0];
                }
            }).on('input',function()
            {
                let ID = self.id(this);
                if ($(this).val() === '')
                {
                    self.JSON_DATA.main_object.exercises[ID]['img'] = '';
                }
            });

            if (edit) {
                let name = self.JSON_DATA.main_object.exercises[x].img.match(self.getName);
                getIMG.val(name[1]);
            }
            
            (imgGroupAppend).append(imgButton);
            (imgGroup).append(getIMG, imgGroupAppend);
             return imgGroup;
    }

    getBootBoxImage(path)
    {

        let self = this;

        let titleRow = $('<div/>', 
        {
            class: 'row'
        });

        let titleCol = $('<div/>', 
        {
            class: 'col'
        });

        let name = path.split("/");

        let a = $('<a/>', {
            href: path,
            target: "_blank"
        }).html(name[name.length-1].split(".")[0]);

        titleCol.append(a);
        titleRow.append(titleCol);

        let messageRow = $('<div/>', 
        {
            class: 'row'
        });

        let messageCol = $('<div/>', 
        {
            class: 'col text-center'
        });

        let im = new Image();
        im.src = path;

        messageCol.append(im);
        messageRow.append(messageCol);

        let b = bootbox.alert(
        {
            size: 'large',
            title: titleRow,
            message: messageRow
        });
    }

    grabImage (val, imgGroup) 
    {
        let self = this;

        let imageUrl = self.URL + self.MEDIA_OBJECT.image.path + val;
         $(imgGroup).attr('src', imageUrl);
    } 
    
    getUrlParameter(sParam) 
    {
        let sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

        for (i = 0; i < sURLVariables.length; i++) 
                {
                    sParameterName = sURLVariables[i].split('=');
                    if (sParameterName[0] === sParam) 
                    {
                      return sParameterName[1] === undefined ? true : sParameterName[1];
                    }
                }
    }

    getAllData() 
    {
        console.log('getAllData');
        let self = this;
        this.EXERCISES = [];
        let cardBodyBackground = $('.cardBodyBG');
        $(cardBodyBackground).each(function() 
        {
            let cardBodyBackground = $(this);
            let exercise = 
            {
                textarea: [],
                audio: '',
                IMG: '',
                clickedButton: ''
            };

            let words = $(this).find('.word');
            for (let i = 0; i < words.length; i++)
            {
                exercise.textarea.push(
                {
                    word: $(words[i]).html(),
                    input: $(words[i]).hasClass("btn-outline-danger")

                });
            }
            exercise.audio = $(this).find('#audioInput').val();
            exercise.IMG = $(this).find('#imgInput').val();
            self.EXERCISES.push(exercise);
        });
        self.sendData(self.saveJSON());       
    }            
    
    saveJSON() 
    {
            let self = this;
            let etitle = (self.SOME.test($('#Title').val())) ? $('#Title').val() : self.TITLE;
            let JSON_DATA = 
            {
                id: self.ID,
                title: etitle,
                language: self.LANGUAGE,
                application: "invul_zin_V3",
                main_object: 
                {
                    title: etitle,
                    language: self.LANGUAGE,
                    exercises: self.JSON_DATA.main_object.exercises
                }
            }
        return JSON_DATA;
    }

    sendData(exObject) 
    {
        let editUrl = '/admin/appexercise/edit';
        $.ajax(
        {
            url: editUrl,
            type: 'post',
            data: {'data': exObject},
            dataType:'json'
        }).done(function (response) 
        {
            window.location.href = './';
        }).fail(function (jqXHR, textStatus, errorThrown) 
        {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
    }
}
