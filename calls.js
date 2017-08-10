envBase = require("./envBase.js");
express = require('express');
fetch = require("node-fetch");
urlencode = require("urlencode");
HashMap = require("hashmap");
iso8601 = require("iso8601-convert");
http = require('http');
path = require('path');
unirest = require('unirest');

const app = express();

// environment variables
const ENVIRONMENT = process.env.NODE_ENV;
const DEPARTMENT = process.env.DEPARTMENT;
const PORT = 8080; // TODO move to env variable

let apiInfo = {
    startDate: new Date(),
    endDate: new Date(),
    apiUrl: "",

    updateAPIURL: function () {
        this.apiUrl = `${envBase.url(ENVIRONMENT)}calls?after=${urlencode.encode(this.startDate.toISOString())}&before=${urlencode.encode(this.endDate.toISOString())}&dir=outbound&tk=thinkingphones`;
    },

    updateDates: function () {
        this.startDate = new Date();
        this.endDate = new Date();
        this.startDate.setDate(this.endDate.getDate() - 1);
        this.updateAPIURL();
    }

};

// initialize dates and URL
apiInfo.updateDates();

// global vars
let longestCallStart = new Date();
let longestCallEnd = new Date();
let longestCallDuration = 0;
let longestCallUserId = null;
let lastCallDuration = 0;
let lastCallUserId = null;
let mostCallsPlaced = 0;
let mostCallsUserId = null;
let callsPlacedHTML = "";
let callsPerUserMap = new HashMap();
let aCall = null;

/**
 * Uses unirest module to perform a get request call data from a fuze data endpoint and sends the data in a callback
 * @param callback
 * @param guiResponse
 */
function requestCallData(callback, guiResponse) {

    apiInfo.updateDates();

    // initiliaze global vars to prevent data duplication
    initGlobalVars()

    let req = unirest("GET", apiInfo.apiUrl);

    req.headers(envBase.headers(ENVIRONMENT));

    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        // get call vars
        json_body = res.body;

        aCall = json_body.calls[0];
        lastCallStart = iso8601.toDate(aCall.startedAt);
        lastCallEnd = iso8601.toDate(aCall.endedAt);
        lastCallDuration = lastCallEnd - lastCallStart;
        lastCallUserId = aCall.from.userId;
        // for debug
        console.log(res.body.calls[0].from.userId);
        console.log(apiInfo.startDate + apiInfo.endDate);

        // Loop through all the calls
        for (let j = 0; j < json_body.calls.length; j++)
        {
            aCall = json_body.calls[j];

            // Create a list of all the users
            if (callsPerUserMap.has(aCall.from.userId) === false)
            {
                callsPerUserMap.set(aCall.from.userId, 1);
            }
            else
            {
                callsPerUserMap.set(aCall.from.userId, callsPerUserMap.get(aCall.from.userId) + 1);
            }
        }

        // Try to figure out who made most calls and render the calls placed html
        callsPerUserMap.forEach(function(value, key) {
            callsPlacedHTML += `<div class='collection-item'>${key}: ${value}</div>`;
            if (value > mostCallsPlaced)
            {
                mostCallsPlaced = value;
                mostCallsUserId = key;
            }

        });

        // call the callback to send the data back
        callback(req, guiResponse);
        console.log("success");
    });
}

/**
 * Resets the global vars - TODO lsc: move this system to use closures to move away from globals
 */
function initGlobalVars() {

    longestCallDuration = 0;
    longestCallUserId = null;
    lastCallDuration = 0;
    lastCallUserId = null;
    mostCallsPlaced = 0;
    mostCallsUserId = null;
    callsPlacedHTML = "";
    callsPerUserMap = new HashMap();
    aCall = null;

}

function fuzeDataCallback(req, res) {
    res.send(`
<div class="row">
    <div class="col s12">
        <div class="card-panel teal accent-4 white-text">
            <h3>Last Call</h3>
            <p>`+lastCallDuration+`(ms) made by `+lastCallUserId+`</P>
        </div>
    </div>
</div>
<div class="row">
    <div class="col s12">
        <div class="card-panel teal accent-4 white-text">
            <h3>Most Placed Calls</h3>
            <p>`+mostCallsPlaced+` made by `+mostCallsUserId+`</P>
        </div>
    </div>
</div>
<div class="row">
    <div class="col s12">
        <h3 class="card-panel teal accent-4 white-text">Calls Placed in Past 24 hours</h3>
        <div class="collection">`+callsPlacedHTML+`</div>
    </div>
</div>`);
}

/**
 * Serves the homepage using express
 */
app.get('/', function (req, res) {
    console.log('hit endpoint');
    res.sendFile(path.join(__dirname + '/index.html'));
});

/**
 * Refresh the call data using a button that calls this endpoint
 */
app.get('/getData', function (req, res) {
    console.log("getting Data");

    // fetchData();
    // requestData();
    requestCallData(fuzeDataCallback, res);

});

// allow files to be indescriminately retrieved from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT);





