var twichers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas", "agravein", "tellMeWHY?"];

$(document).ready(getData);

function getData() {
    twichers.map(name => {
        co(updatePage(name))
            .then(co(updateStreamPageData(name)))
            .catch(console.log);
    });
}

function* updatePage(userName) {
    var data = yield getTwitcherData(userName);
    var element = $("div[hidden] .media").clone().first();
    element.find(".profile-picture").attr("src", data.logo);
    element.find(".user-name").html(userName);
    element.find(".status").html(data.status);
    element.find(".url").attr("href", data.url);
    element.attr("id", userName);
    $("#all").append(element);
    $("#all-user-count").html(twichers.length);
}

function* updateStreamPageData(userName) {
    var data = yield* getTwitcherStreamData(userName);
    var status = data["stream"]["status"];
    var element = $("#" + userName);
    element.find(".status").html(status);
    element.find(".online").removeAttr("hidden");
    $("#online-user-count")[0].innerHTML++;
    $("#online").append(element.clone());
}

function getTwitcherData(name) {
    return fetch(`https://wind-bow.glitch.me/twitch-api/channels/${name}`)
        .then(data => data.json())
        .then(json => !json.error ? json
                : {
                    logo: "https://www.twitch.tv/images/xarth/dead_glitch.png",
                    status: "A streamer has closed their Twitch account (or the account never existed)",
                    url: "#"
                });
}

function* getTwitcherStreamData(name) {
    var dataFetch = yield fetch(`https://wind-bow.glitch.me/twitch-api/streams/${name}`);
    var json = yield dataFetch.json();
    if (!json["stream"]) throw new Error(`User ${name} don't have a stream right now`);
    return json;
}


