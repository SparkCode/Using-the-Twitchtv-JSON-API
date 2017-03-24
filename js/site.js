var twichers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas", "agravein", "storbeck"];

$(document).ready(getData);

function getData() {
    twichers.map(function (name) {
        getTwitcherData(name, updatePage)
    })
}

function updatePage(data, userName) {

    var userName = userName;

    if (data.hasOwnProperty("error"))
    {
        var profilePicture = "https://www.twitch.tv/images/xarth/dead_glitch.png";
        var status = "A streamer has closed their Twitch account (or the account never existed)";
        var url = "#";
    }
    else
    {
        profilePicture = data["logo"];
        status = data["status"];
        url = data["url"];
    }

    var element = $("div[hidden] .media").clone().first();
    element.find(".profile-picture").attr("src", profilePicture);
    element.find(".user-name").html(userName);
    element.find(".status").html(status);
    element.find(".url").attr("href", url);
    element.attr("id", userName);

    $("#all").append(element);

    $("#all-user-count").html(twichers.length);

    getTwitcherStreamData(userName, updateStreamPageData)
}

function updateStreamPageData(data, userName) {
    if (data["stream"] == null) return;

    var status = data["stream"]["status"];
    var element = $("#" + userName);
    element.find(".status").html(status);
    element.find(".online").removeAttr("hidden");

    $("#online-user-count")[0].innerHTML++;

    $("#online").append(element.clone());
}




function getTwitcherData(name, callback) {
    $.ajax({
        url:"https://wind-bow.gomix.me/twitch-api/channels/" + name,
        success: function (data) {
            callback(data, name);
        },
        dataType: "jsonp"
    })
}

function getTwitcherStreamData(name, callback) {
    $.ajax({
        url: "https://wind-bow.gomix.me/twitch-api/streams/" + name,
        success: function (data) {
            callback(data, name);
        },
        dataType: "jsonp"
    })
    
}


