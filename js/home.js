var results = document.getElementById("result");

var GuserLat;
var GuserLong;
var watchID = null;
var GEndMarker;
var usermarker;
var map = null;//variables moved up in the document

$(document).ready(init);
function init() {
    $("#startquest_btn").click(start_quest);
    $("#submit_answer_btn").click(checkAnswer); 
    getFilters();
    show_quests();
    $("#filter_select").change(filterQuests);
    $("#filter_text").keyup(filterQuests);
    $('#AnswerModal').on('hidden.bs.modal', function (e) {
        $("#answer_input").val("");
    });
}





function filterQuests() {
    var value = $("#filter_text").val();
    var chosenTxt = $("#filter_select option:selected").text();
    if (chosenTxt == "Difficulty" && value == "") {
        $(".my_table .row:not(:first)").removeClass("d-none");
    }
    else
    {
        $(".my_table .row:not(:first)").each(function () {
            if ((chosenTxt != "Difficulty" && $(this).attr("dif") != "lvl_" + chosenTxt) || ($(this).find(".searchEnable").eq(0).text().toLowerCase().indexOf($("#filter_text").val().toLowerCase()) == "-1" && $(this).find(".searchEnable").eq(1).text().toLowerCase().indexOf($("#filter_text").val().toLowerCase()) == "-1")) {
                $(this).addClass("d-none");
            }
            else
                $(this).removeClass("d-none");
        }
        );
    }
}

function getFilters()
{
    $.ajax({
        url: WebServiceURL + "/GetFilters",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        error: function (a, b, c) {
            //ShowFloatMessage(c, "error");
            alert(a);
            alert(b);
            alert(c);
            alert("ajax error:" + a);
        },
        success: function (data) {
            var option;
            var x = JSON.parse(data.d);
            for (var i = 0; i < x.length; i++) {
                option = $('<option value="' + x[i]["DIF_No"] + '">' + x[i]["DIF_Desc"] + '</option>');
                $("#filter_select").append(option);   
            }
            
        }
    });
}

function setQuestHelperText() // 20/01 - Izhar Fine
{
    if ($(this).attr("id") == "btn_info")
    {
        $("#ShowHelperModalTtl").text("Riddle for: " + sessionStorage.questname + ", " + sessionStorage.stageName + " (" + sessionStorage.stage + ").");
        $("#quest_helper_output").text(sessionStorage.riddle);
    }
    else if ($(this).attr("id") == "btn_report")
    {
        $("#ShowHelperModalTtl").text("Report for:" + sessionStorage.questname + ", " + sessionStorage.stageName);
        
        $("#quest_helper_output").text(sessionStorage.hint);
    }
    else
    {
        $("#ShowHelperModalTtl").text("Hint for: " + sessionStorage.questname + ", " + sessionStorage.stageName + " (" + sessionStorage.stage + ").");
        $("#quest_helper_output").text(sessionStorage.hint);
    }
}

function checkAnswer()
{
    if (sessionStorage.getItem("answer").toLowerCase() != $("#answer_input").val().toLowerCase())
    {
        $("#quest_output").text("Incorret answer");
        $("#quest_outputTTl").text("Inncorect!");
        $("#quest_output_modal").modal("show");
        return;
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(checkAnswerAjax, showError, config);
    } else {
        $("#quest_output").text("Geolocation is not supported by this browser.");
        $("#quest_outputTTl").text("ERROR!");
        $("#quest_output_modal").modal("show");
    }
}


function start_quest() {

    $(".close_btn").trigger("click");
    $(".my_table").addClass("hidden");
    $("#filter_cont").addClass("hidden");



    var mapCode = $('<div id="map_cont">' +
        '        <div class="row map_btn_cont" style="text-align:center">' +
        '            <a href="#" id="btn_hint" class="col btn hvr-bounce-out quest_btn" data-toggle="modal" data-target="#quest_helper_modal">GET HINT</a>' +
        '            <a href="#" id="btn_info" class="col btn hvr-bounce-out quest_btn" data-toggle="modal" data-target="#quest_helper_modal">DETAILS</a>' +
        '        </div>' +
        '        <div id="map"></div>' +
        '        <div class="my_row  map_btn_cont" style="text-align:center">' +
        '            <a href="#" id="map_quest_btn" class="btn btn-success hvr-bounce-out quest_btn mt-2" class="btn btn-primary" data-toggle="modal" data-target="#AnswerModal">FOUND IT!</a>' +
        '        </div>' +
        '    </div>');

    $(mapCode).find("a[data-toggle='modal']").click(setQuestHelperText); // 20/01 - Izhar Fine

    $("#wrapper").append(mapCode);//adding the map html elements
    //here will be the script tag google maps insertion
    $(".container.mt-3.mb-3").addClass("d-none");

    getStagePosition();
}


function checkAnswerAjax(position)
{
    // 20/01 - Izhar Fine
    if (Math.abs(GuserLat - sessionStorage.getItem("targetLat")) >= $("#LatLongCheck").val())
    {
        $("#quest_output").text("Incorret place");
        $("#quest_outputTTl").text("Inncorect!");
        $("#quest_output_modal").modal("show");
        return;
    }
    if (Math.abs(GuserLong - sessionStorage.getItem("targetLon")) >= $("#LatLongCheck").val())
    {
        $("#quest_output").text("Incorret place");
        $("#quest_outputTTl").text("Inncorect!");
        $("#quest_output_modal").modal("show");
        return;
    } // 20/01 - Izhar Fine

    var userinquest = // IZHAR FINE - WEBSERVICES AS WELL, LESS PARAMS
        {
            userid: sessionStorage.getItem("UserID"),
            questid: sessionStorage.getItem("quest"),
        }
    $.ajax({
        url: WebServiceURL + "/CheckAnswer",
        dataType: "json",
        type: "POST",
        data: JSON.stringify(userinquest),
        contentType: "application/json; charset=utf-8",
        error: function (a, b, c) {
            //ShowFloatMessage(c, "error");
            alert(a);
            alert(b);
            alert(c);
            alert("ajax error:" + a);
        },
        success: function (data) {
            if (data.d.length != 0) {
                var questDetails = JSON.parse(data.d);
                if (questDetails[0].Result == "END")
                {
                    $("#quest_output").text("You finished the quest!");
                    $("#quest_outputTTl").text("WELL DONE!");
                    $("#quest_output_modal .modal-header").removeClass("quest_Hard quest_Med quest_Easy");
                    $("#quest_output_modal .modal-header").addClass("finished");
                    $("#quest_output_modal").modal("show");
                    //alert("Well done! You finished the quest!");
                    var changeLocation = function () {
                        window.location.href = "home.html";
                    }
                    window.setTimeout(changeLocation, 4500);
                }
                else if (questDetails[0].Result == "OK")
                {
                    $("#quest_output").text(questDetails[0].riddle);
                    updateQuestDetails(questDetails);
                    $("#quest_outputTTl").text("Next Riddle:");
                    $("#AnswerModal").modal("hide");
                    $("#quest_output_modal").modal("show");
                }
                GEndMarker.setMap(null);
            }
        }
    });
}



function showError(error) {
    alert("GEO problem: message -> " + error.message);
    results.innerText = "GEO problem: message -> " + error.message+"          ";
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            results.innerText += "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            results.innerText += "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            results.innerText += "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            results.innerText += "An unknown error occurred.";
            break;
    }
}

function getLocation() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: -33, lng: 151 },
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ['roadmap', 'terrain']
        }
    });
    var UsermarkerOptn = {
        map: map,
        icon: './media/img/user.png'
    };

    usermarker = new google.maps.Marker(UsermarkerOptn);
    var googleEndLatLng;
    if (sessionStorage.stage == 1) {
         googleEndLatLng = new google.maps.LatLng(parseFloat(sessionStorage.getItem("targetLat")), parseFloat(sessionStorage.getItem("targetLon")));      
    }
    else
    {
        
        googleEndLatLng = new google.maps.LatLng(parseFloat(sessionStorage.getItem("prevTargetLat")), parseFloat(sessionStorage.getItem("prevTargetLon")));
    }
    addEndMarker(map, googleEndLatLng, "Get Here", "Good Luck");
   

    var optn = {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
    };
    DestroyLoader();
    if (navigator.geolocation)
    {
        navigator.geolocation.watchPosition(success, fail, optn);
    }
    else
        $("p").html("HTML5 Not Supported");

}

function success(position) {
    var googleLatLng = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);
    
    GuserLat = position.coords.latitude;
    GuserLong = position.coords.longitude;
    map.setCenter(googleLatLng);



    addStartMarker(map, googleLatLng, "Escape Reality",
        "Izhar Fine and Moshe Cohen");
    usermarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude))
    var googleEndLatLng = new google.maps.LatLng(parseFloat(sessionStorage.getItem("targetLat")), parseFloat(sessionStorage.getItem("targetLon")));
    var bounds = new google.maps.LatLngBounds();//MOSHE: zoom bug fixed 
    bounds.extend(googleLatLng);
    bounds.extend(googleEndLatLng);
    map.fitBounds(bounds);//THANKS TO Schmitzenbergh FROM renegade x
}

function addEndMarker(map, googleLatLng, title, content) {
    var markerOptn = {
        position: googleLatLng,
        map: map,
        icon: "./media/img/destination_marker.png",
        title: title
    };



    GEndMarker = new google.maps.Marker(markerOptn);


}

function addStartMarker(map, googleLatLng, title, content) {
    var markerOptn = {
        position: googleLatLng,
        map: map,
        icon: './media/img/red_dot.png',
        title: title
    };



    var marker = new google.maps.Marker(markerOptn);

}

function fail(error) {
    var errorType = {
        0: "Unknown Error",
        1: "Permission denied by the user",
        2: "Position of the user not available",
        3: "Request timed out"
    };

    var errMsg = errorType[error.code];

    if (error.code == 0 || error.code == 2) {
        errMsg = errMsg + " - " + error.message;
    }

    $("p").html(errMsg);
}




function updateQuestDetails(questDetails)
{
    
     // 20/01 - Izhar Fine
    sessionStorage.setItem("hint", questDetails[0].hint);
    sessionStorage.setItem("riddle", questDetails[0].riddle);
    sessionStorage.setItem("stage", questDetails[0].stageNumber);
    sessionStorage.setItem("quest", questDetails[0].questid);
    sessionStorage.setItem("answer", questDetails[0].answer);
    sessionStorage.setItem("stageName", questDetails[0].stageName);
    sessionStorage.setItem("targetLon", questDetails[0].stageLong);
    sessionStorage.setItem("targetLat", questDetails[0].stageLat);
    sessionStorage.setItem("prevTargetLon", questDetails[0].prevLong);
    sessionStorage.setItem("prevTargetLat", questDetails[0].prevLat);
    sessionStorage.setItem("questname", questDetails[0].questname);
    sessionStorage.setItem("currectDiff", questDetails[0].DIF_Desc);
}


function getStagePosition() {
    ShowLoader();
    debugger;
    var user =
        {
            userid: sessionStorage.getItem("UserID"),
            questid: $("#ShowQuestDetailsModal").attr("quest_no"),
            stageid: "1"//this is need to get stageid from DB 
        };
    $.ajax({
        url: WebServiceURL + "/UsersInQuest",
        dataType: "json",
        type: "POST",
        data: JSON.stringify(user),
        contentType: "application/json; charset=utf-8",
        error: function (a, b, c) {
            //ShowFloatMessage(c, "error");
            alert(a);
            alert(b);
            alert(c);
            DestroyLoader();
        },
        success: function (data) {
            if (data.d.length != 0) {

                $("#quest_helper_modal .modal-header").removeClass("quest_Hard quest_Easy quest_Med finished");
                $("#quest_output_modal .modal-header").removeClass("quest_Hard quest_Easy quest_Med finished");
                var questDetails = JSON.parse(data.d);
                $("#quest_helper_modal .modal-header").addClass("quest_" + questDetails[0].DIF_Desc);
                $("#quest_output_modal .modal-header").addClass("quest_" + questDetails[0].DIF_Desc);
                updateQuestDetails(questDetails);
                $(".map_btn_cont").removeClass("hidden");
                getLocation();
                debugger;
                //google.maps.event.trigger(map, "resize");//event to refresh the map because it was hidden div it may cause problems
            }
        }
    });
}



function show_lvl_desc(pointer) {
    ShowQuestMsg($(pointer).children('.fulldesc').text(), $(pointer).attr("dif"), $(pointer).children().first().text());
    $("#ShowQuestDetailsModal").attr("quest_no", $(pointer).attr("quest_no"));
}

function show_quests() {
    $(".my_table").removeClass("hidden");
    $("#filter_cont").removeClass("hidden");
    $(".title_cont").addClass("hidden");
    ShowLoader();
    debugger;
    $.ajax({
        url: WebServiceURL + "/GetQuests",
        dataType: "json",
        type: "POST",
        data: JSON.stringify({ id: sessionStorage.getItem("UserID") }),
        contentType: "application/json; charset=utf-8",
        error: function (a, b, c) {
            alert(c);
            DestroyLoader();
        },
        success: function (data) {
            var output = "";
            var x = JSON.parse(data.d);
            for (var i = 0; i < x.length; i++) {
                output += '<div dif="lvl_' + x[i]["DIF_Desc"] + '" onclick="show_lvl_desc(this)" quest_no=' + x[i]["questid"] + ' class="row tablelvl_' + x[i]["DIF_Desc"] + ' ' + (x[i]["finished"] != "True" ? "" : "finished") + ' mt-2 p-3 " data-toggle="modal" data-target="#ShowQuestDetailsModal">';
                output += '<div class="col searchEnable">' + x[i]["questname"] + '</div>';
                output += '<div class="col searchEnable">' + x[i]["locationname"] + '</div>';
                output += '<div class="col d-none">' + x[i]["DIF_Desc"] + '</div>';
                output += '<div class="col-4 d-none"><div class="d-none ma-0 w-50 lvl_' + x[i]["DIF_Desc"] + '">' + x[i]["DIF_Desc"] + '</div></div>';
                output += '<div class="hidden fulldesc">' + x[i]["questdescription"] + '</div>';
                output += '</div>';
            }
            DestroyLoader();
            $(".my_table").append(output);
        }
    });
    $("#btn_start").addClass("hidden");
}

function ShowQuestMsg(msg, diff, ttl) {
    $("#ShowQuestDetailsModalTtl").text(ttl);
    $("#QuestDetailsText").text(msg);
    $("#ShowQuestDetailsModalDiff").attr("class", "");
    $("#ShowQuestDetailsModalDiff").addClass(diff);
    //$(".popup_cont").addClass(classname);
}





