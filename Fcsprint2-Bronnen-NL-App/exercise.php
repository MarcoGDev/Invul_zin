<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <link type="text/css" rel="stylesheet" href="../../assets/vendor/bootstrap-4/dist/css/bootstrap.min.css"> 
        <link type="text/css" rel="stylesheet" href="../../assets/vendor/font-awesome-5/css/all.css"> 
        <link type="text/css" rel="stylesheet" href="../../assets/vendor/jquery-ui/themes/base/all.css">   
        <link type="text/css" rel="stylesheet" href="../../assets/vendor/bootstrap-select-4/dist/css/bootstrap-select.min.css"> 
        <link type="text/css" rel="stylesheet" href="../../css/fonts.css"> +
        <link type="text/css" rel="stylesheet" href="css/style.css"> 
    
        <script type='text/javascript' src="../../assets/vendor/jquery/dist/jquery.min.js"></script> 
        <script type='text/javascript' src="../../assets/vendor/jquery-ui/jquery-ui.min.js"></script> 
        
        <script type='text/javascript' src="../../assets/vendor/popper.js/dist/umd/popper.min.js"></script> 
        <script type="text/javascript" src="../../assets/vendor/bootstrap-4/dist/js/bootstrap.min.js"></script> 

        <script type="text/javascript" src="../../assets/vendor/font-awesome-5/js/all.min.js"></script> 
        <script type="text/javascript" src="../../assets/vendor/bootstrap-select-4/dist/js/bootstrap-select.min.js"></script> 
        <script type='text/javascript' src="../../assets/vendor/bootbox.js/bootbox.js"></script> 
        <script type="text/javascript" src="../../../js/applications/AppExercise.js"></script> 
        <script type="text/javascript" src="../../js/generic/checker.js"></script> 
        <script type='text/javascript' src="../../js/generic/app_js.js"></script> 
        <script type="text/javascript" src="../../js/generic/nt2school.js"></script> 
        <script type="text/javascript" src="../../js/generic/navigation.js"></script> 
        <script type="text/javascript" src="../../js/generic/timer-5.js"></script> 
        <script type="text/javascript" src="../../js/generic/score-5.js"></script> 
        <script type="text/javascript" src="js/unStringify.js"></script>
        <script type="text/javascript" src="js/all.js"></script>
        <script type="text/javascript" src="js/GetExercise.js"></script> 
        
        <script type="text/javascript">
            $(document).ready(function()
            {
               EX = new GetExercise();
            });
        </script>
    </head>

    <body>
        <div class="navigation">
            
        </div>

        <div class="container containerCustom">
            <div class="row">
                <div class="col-xs-8 col-sm-8 col-md-8">
                    <div class="card border-primary  mb-3" style="max-width: 156rem;">
                        <div class="card-header text-white bg-primary">
                            <div class="row">
                                <div class="col-md-10">
                                    <h2 id="tHead"></h2>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="score" class="inline" style="font-size: 2em;">
                                <div id="right" class="inline text-success">
                                    <div class="rightInner inline">0</div>
                                    <div class="symbol inline">
                                        <i class="fas fa-check"></i>
                                    </div>
                                </div>
                                |
                                <div id="wrong" class="inline text-danger">
                                    <div class="wrongInner inline" style="margin-left: 10px;">0</div>
                                    <div class="symbol inline">
                                        <i class="fas fa-times"></i>
                                    </div>
                                </div>
                            </div>
                            <h2 class="inline" id="timer" style="font-size: 2em; float:right !important">
                                    <div id="minutes" class="inline">00</div>:<div id="seconds" class="inline">00</div>
                                </h2>
                            <div class="container" id="holder">
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4">
                    <div class="card">
                         <div class="row">
                             <div class="col-sm-12">
                                <div id="imgholder" class="card-body text-center border border-primary"> 
                                </div>
                            </div>  
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>

