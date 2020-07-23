class GetExercise extends all
{
    constructor()
    { 
         super();
         
        this.fileURL = this.URL + "/media/";
        this.playAudio = false;
        this.fileObject;

        this.tm = new TIMER("#timer");
        this.score = new SCORE("#score");
        this.language;
        this.timeStop = 0;
        this.timeStop1 = 0;
        this.wrongCount = 0;
        this.oldInput;
        this.readJSONData();
    }

    readJSONData() 
    {
        const self = this;
        let host = window.location.href.split('\/');
        let foundID = host.indexOf('applications');
        let app = '';

        if(foundID > -1) app = host[foundID + 1];
        let appData = getAppData();

        $.post(setJsonApiUrl() + '/api/appexercise/get/' + appData.id, 
        {
            _: new Date().getTime(),
            'id': appData.id,
            'application': appData.app
        }).done(function(response) 
        {
            self.JSON_DATA = self.unstring.returnData({'data':response, 'keys':['img','audio', 'input']});
            self.language = self.JSON_DATA.main_object.language;
            console.log(response)
            $('#tHead').html(self.JSON_DATA.main_object.title);
            self.fileObject = self.buildFileObject(self.JSON_DATA.main_object.exercises);
            }).fail(function(jqXHR,textStatus,errorThrown) 
            {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        );
    }

    buildFileObject(array)
    {
        let self = this;
        let ob = {};
        let count = 0; 
        let audioArray = [];
        let imgArray = [];
        let fileCount = 0;

        for (let i = 0; i < array.length; i++)
        {
            if (array[i]['audio'] !== '')
            {
                audioArray.push(array[i]['audio']); 
                count++;
            }

            if (array[i]['img'] !== '')
            {
                imgArray.push(array[i]['img']); 
                count++;
            }
        }

        for (let i = 0; i < array.length; i++)
        {
            for (let j = 0; j < array[i]['wordArray'].length; j++)
            {
                if (array[i]['wordArray'][j]['audio'])
                {
                    let path = self.fileURL + self.language + '/audio/' + array[i]['wordArray'][j]['word'] + '.mp3';
                    if (audioArray.indexOf(path) < 0)
                    {
                        audioArray.push(path);
                        count++;
                    }
                }

                if (array[i]['wordArray'][j]['img'])
                {
                    let path = self.fileURL + self.language + '/img/' + array[i]['wordArray'][j]['word'] + '.jpg';
                    if (imgArray.indexOf(path) < 0)
                    {
                        imgArray.push(path);
                        count++;
                    }
                }
            }
        }

        for (let i = 0; i < audioArray.length; i++)
        {
            var aUrl = setMediaUrl(audioArray[i]);
            var audio = new Audio(aUrl);
            ob[aUrl] = audio;
            
            audio.oncanplaythrough = function()
            {
                fileCount++;
                if(count === fileCount)
                {
                    self.createAll();
                }
            };
        }

        for (let i = 0; i < imgArray.length; i++)
        {
            let IUrl = setMediaUrl(imgArray[i]);
            var im = new Image();

            im.onload = function() 
            {
                fileCount++;
                if(count === fileCount)
                {
                    self.createAll();
                }
            }

            im.src = IUrl;
            ob[IUrl] = im;
        }

        return ob;
    }



    createAll()
    {
        let self = this;
        
        let groups = self.createGroups();
       
        $("#holder").append(groups);
    
    }
    
    createGroups()
    {
        let self = this;
        let exercises = self.JSON_DATA.main_object.exercises;
        let groups = $('<div/>', 
        {
            id: 'groups',
            class: ''
        });
        for (let i = 0; i < exercises.length; i++)
        {
            let group = self.createGroup(i);
            groups.append(group);
        }   
        return groups;
    }


    exerciseButton(index) 
    {
        let self = this;

        let imgPlace = self.JSON_DATA.main_object.exercises[index]['img'];
        let audioPlace = self.JSON_DATA.main_object.exercises[index]['audio'];
         
        let div =  $('<div/>',
        {
            'class':'form-group row'
        });   

        let imgButton = $('<button/>',
        {
            'class':'btn btn-info space',
            'data-img': setMediaUrl(imgPlace) 
        }).append('<i class="fas fa-camera" aria-hidden="true"></i>').on('click', function()
        {                     

            $('#imgholder').html(self.fileObject[$(this).data('img')]);

        });

        let audioPlayBtn = $('<button/>',
        {
            'class':'btn btn-info space',
            'data-audio': setMediaUrl(audioPlace)
        }).append('<i class="fas fa-volume-up" aria-hidden="true"></i>').on('click',function()
        {
            console.log($(this).data('audio'));
            self.fileObject[$(this).data('audio')].play(); 

            // if (!self.playAudio)
            // {
            //     audio.play();
            //     self.playAudio = true;
            // }

            // audio.addEventListener('ended', function()
            // {
            //     self.playAudio = false;
            // });
        });
        div.append((imgPlace !== '') ? imgButton : '', (audioPlace !== '') ? audioPlayBtn : '');
        //div.append(imgButton, audioPlayBtn);
        return div;
    }

    createGroup(i) 
    {

        let exerciseButtons = this.exerciseButton(i)
        let self = this;
        let input = self.inputField(i);
        let group = $("<div/>", 
        {
            id:'group-' + i,
            class:''
        }).append(input, exerciseButtons);
        return group;
    }

    inputField(i) 
    {
        let self = this;
        let textarea = self.JSON_DATA.main_object.exercises[i].wordArray;

        let div = $("<div/>", 
        {
            class: "form-group row"
        });

        let word;

        for (let a = 0; a < textarea.length; a++) 
        {
            if (textarea[a].input) 
            {
                word = $("<input/>", 
                {
                    class: 'col-auto form-control col-auto my-1 mx-1',
                    style: 'width: 100px',
                    id:'answerField' + a
                }).on('input', function()
                { 
                    if (self.oldInput !== $(this).attr('id')) 
                    {
                        self.wrongCount = 0;
                    }
                    self.tm.start()

                    if ($(this).val() == textarea[a].word)
                    {
                        self.timeStop++;
                        self.score.addRight();

                        let btn = $('<button/>',
                        {
                            'class':'btn btn-success ',
                            'data-audio':textarea[a]['audio'] ? setMediaUrl(self.fileURL + self.language + '/audio/' + textarea[a].word + '.mp3') : '',
                            'data-img': textarea[a]['img'] ?  setMediaUrl(self.fileURL + self.language + "/img/" + textarea[a].word + ".jpg") : ''
                        }).append(textarea[a].word);

                        btn.on('click',function()
                        {
                            if($(this).data('audio') !== '')
                            {
                                self.fileObject[$(this).data('audio')].play(); 

                                // if (!self.playAudio)
                                // {
                                //     audio.play();
                                //     self.playAudio = true;
                                // }

                                // audio.addEventListener('ended',function()
                                // {
                                //     self.playAudio = false;
                                // });
                            }

                            if($(this).data('img') !== '')
                            {
                                $('#imgholder').html(self.fileObject[$(this).data('img')]);
                            }
                        });

                        $(this).replaceWith(btn);
                        self.Timer(); 
                        self.wrongCount = 0;
                    }

                    else if ($(this).val() != textarea[a].word)
                    {
                        let bool = self.checkWord($(this).val(), textarea[a].word);
                        if (!bool)
                        {
                            self.wrongCount++;
                            if (self.wrongCount === 1) 
                            {
                                self.score.addWrong();
                            }
                        }
                    }
                    self.oldInput = $(this).attr('id');
                });
                this.timeStop1++;
                div.append(word);
            }
            else
            {
                let wordSpan = $('<span/>',
                {
                    'class':'singleWord'
                }).append(textarea[a].word);

                if (textarea[a]['audio'] && textarea[a]['img'])  //Audio en plaatje
                {
                    wordSpan.on('click', function()
                    {
                        let sound = self.fileURL + self.language + '/audio/' + textarea[a].word + '.mp3';
                        console.log(sound);
                        var aUrl = setMediaUrl(sound);
                        var audio = new Audio(aUrl);

                        if (!self.playAudio)
                        {
                            audio.play();
                            self.playAudio = true;
                        }
                        
                        audio.addEventListener('ended', function()
                        {
                            self.playAudio = false;
                        });

                        var imgSRC = self.fileURL + self.language + "/img/" + textarea[a].word + ".jpg";
                        var imgURL = setMediaUrl(imgSRC);
                        var image = new Image();
                        image.src = imgSRC;

                        $('#imgholder').html(image);
                    }).addClass('underLine').addClass('btn btn-success');
                }
                else if (!textarea[a]['audio'] && textarea[a]['img']) //Alleen plaatje
                {
                    wordSpan.on('click',function() 
                    {
                        var imgSRC = self.fileURL + self.language + "/img/" + textarea[a].word + ".jpg";
                        var imgURL = setMediaUrl(imgSRC);
                        var image = new Image();
                        image.src = imgSRC;

                        $('#imgholder').html(image);
                    }).addClass('btn btn-success');
                }
                else if (textarea[a]['audio'] && !textarea[a]['img'])  //Alleen audio
                {
                    wordSpan.on('click',function()
                    {
                        let sound = self.fileURL + self.language + '/audio/' + textarea[a].word + '.mp3';
                        var aUrl = setMediaUrl(sound);
                        var audio = new Audio(aUrl);

                        if (!self.playAudio)
                        {
                            audio.play();
                            self.playAudio = true;
                        }

                        audio.addEventListener('ended',function() 
                        {
                            self.playAudio = false;
                        });
                    }).addClass('underLine');
                }
                else
                {
                    wordSpan.addClass('btn btn-outline-secondary');
                }
                div.append(wordSpan);
            }
        }
        return div;       
    }

    checkWord(givenAnswer, realAnswer)
    {
        let givenArray = givenAnswer.split('');
        let realArray = realAnswer.split('');
        let count = 0;
    
        for (let i = 0; i < givenArray.length; i++)
        {
            if (givenArray[i] !==  realArray[i])
            {
                count++;
            }   
        }
        if (count === 0) 
        {
            return true;
        }
        else 
        { 
            return false
        }
    }

    Timer()
    {
        let self = this;
        if (this.timeStop == this.timeStop1) 
        {    
            self.tm.stop();
            
        }
    }
}