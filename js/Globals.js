//function isAdmin()
//    {
//        if (sessionStorage.getItem("Rank") == "1")
//        {
//            $(".nav.navbar-nav").append("<li><a href='backoffice.html'>Back Office</a></li>");
//    }

//}

var config = {//without this variable, the geolocation won't exist on android phone (but on iphone doesn't matter)
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 18000000
}

$(document).ready(init);

function init()
{
    $("#userName").text(sessionStorage.UserName);
}

var errjson = {
    msg: "",
    src: "",
    linen: "",
    coln: "",
    err:""
}

function errFunc(message, source, lineno, colno, error) {
    
    // all errors will be caught here
    // you can use `message` to make sure it's the error you're looking for
    // returning true overrides the default window behaviour

    //$("result").val("source: " + source + ", linenumber: " + lineno + " ,message:  " + messag + " END OF FILE.");
    //alert("source: " + source + ", linenumber: " + lineno + " ,message:  " + messag + " END OF FILE.");
    errjson.msg = message;
    errjson.src = source;
    errjson.linen = lineno;
    alert("message: " + errjson.msg+" line number: "+errjson.linen+" src: "+errjson.src);


    return true;
};
//window.onerror = errFunc;

//window.onerror = function shakira(message, source, lineno, colno, error)
//{
//  // all errors will be caught here
//  // you can use `message` to make sure it's the error you're looking for
//  // returning true overrides the default window behaviour

//    //$("result").val("source: " + source + ", linenumber: " + lineno + " ,message:  " + messag + " END OF FILE.");
//    //alert("source: " + source + ", linenumber: " + lineno + " ,message:  " + messag + " END OF FILE.");
//    errjson.msg = msg;
//    errjson.src = source;
//    errjson.linen = lineno;
//    alert("here is onerror!!!");


//  return true; 
//};
//function errfunc(message, source, lineno, colno, error) {
//    // all errors will be caught here
//    // you can use `message` to make sure it's the error you're looking for
//    // returning true overrides the default window behaviour

//    //$("result").val("source: " + source + ", linenumber: " + lineno + " ,message:  " + messag + " END OF FILE.");
//    //alert("source: " + source + ", linenumber: " + lineno + " ,message:  " + messag + " END OF FILE.");
//    errjson.msg = msg;
//    errjson.src = source;
//    errjson.linen = lineno;
//    alert("message: " + errjson.msg);


//    return true;
//};

var WebServiceURL1 = 'WebService.asmx';
 var WebServiceURL2 = "http://ruppinmobile.ac.il.preview26.livedns.co.il/site14/WebService.asmx";
 var WebServiceUrlDev3 = './WebService.asmx';

 var WebServiceURL = WebServiceURL1;
$(document).ready(function () {

    $(".navbar-header").swipe({
        swipeUp: function (event, direction, distance, duration) {
            console.log("You swiped " + direction);
            //TODO: close
            
        },
        swipeDown: function (event, direction, distance, duration) {
            console.log("You swiped " + direction);
            //TODO: open
        },
        click: function (event, target) {
        },
        threshold: 100,
        allowPageScroll: "vertical"
    });

});



function ShowLoader() {
    var container = $('<div class="container position-absolute mt-5" style="top:100px;pointer-events:none" id="loader"></div>');
    var row = $('<div class="row mt-5"></div>');
    var col = $('<div class="col mt-5" id="loading_cont" style="background-image:url(media/img/loading.gif);height:126px;background-repeat:no-repeat;background-position:center;">');
    row.append(col);
    container.append(row);
    $("body").append(container);
}

function DestroyLoader()
{
    $("#loader").remove();
}