var twichers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas", "agravein", "tellMeWHY?"];

$(document).ready(getData);

function getData() {
    twichers.map(function (name) {
        var twitcherData =  getTwitcherData(name);

        twitcherData
            .then((data) => ({
                    profilePicture: data["logo"],
                    status: data["status"],
                    url: data["url"]}),
                () => ({
                    profilePicture: "https://www.twitch.tv/images/xarth/dead_glitch.png",
                    status: "A streamer has closed their Twitch account (or the account never existed)",
                    url: "#"}))
            .then((result) => updatePage(result, name));

        twitcherData.then(() => getTwitcherStreamData(name))
            .then((result) => updateStreamPageData(result, name))
            .catch((error) => console.log(error));
    })
}

function updatePage(data, userName) {
    let element = $("div[hidden] .media").clone().first();
    element.find(".profile-picture").attr("src", data.profilePicture);
    element.find(".user-name").html(userName);
    element.find(".status").html(data.status);
    element.find(".url").attr("href", data.url);
    element.attr("id", userName);

    $("#all").append(element);

    $("#all-user-count").html(twichers.length);
}

function updateStreamPageData(data, userName) {
    var status = data["stream"]["status"];
    var element = $("#" + userName);
    element.find(".status").html(status);
    element.find(".online").removeAttr("hidden");

    $("#online-user-count")[0].innerHTML++;

    $("#online").append(element.clone());
}

function getTwitcherData(name) {
    return new Promise((correct, reject) => {
        $.ajax({
            url:`https://wind-bow.gomix.me/twitch-api/channels/${name}`,
            success: (data) => !data.error
                ? correct(data)
                : reject({data: data, name, method: getTwitcherData.name}),
            dataType: "jsonp"
        })
    });
}

function getTwitcherStreamData(name) {
    return new Promise((correct, reject) => {
        $.ajax({
            url: `https://wind-bow.gomix.me/twitch-api/streams/${name}`,
            success: (data) => data.stream
                ? correct(data)
                : reject({data: data, name, method: getTwitcherStreamData.name}),
            dataType: "jsonp"
        })
    });
}


