var twichers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas", "agravein", "tellMeWHY?"];

$(document)
    .ready(co(getData)
        .catch(console.log));

function* getData() {
    for (let name of twichers)
    {
        yield* updatePage(name);
    }

    for (let name of twichers)
    {
        try {
            yield* updateStreamPageData(name)
        }
        catch(e) {
            console.log(e);
        }
    }
}

function* updatePage(userName) {
    let data = yield getTwitcherData(userName)
        .then((data) => ({
            profilePicture: data["logo"],
            status: data["status"],
            url: data["url"]}),
        () => ({
            profilePicture: "https://www.twitch.tv/images/xarth/dead_glitch.png",
            status: "A streamer has closed their Twitch account (or the account never existed)",
            url: "#"}));

    let element = $("div[hidden] .media").clone().first();
    element.find(".profile-picture").attr("src", data.profilePicture);
    element.find(".user-name").html(userName);
    element.find(".status").html(data.status);
    element.find(".url").attr("href", data.url);
    element.attr("id", userName);
    $("#all").append(element);
    $("#all-user-count").html(twichers.length);
}

function* updateStreamPageData(userName) {
    let data = yield getTwitcherStreamData(userName);

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


