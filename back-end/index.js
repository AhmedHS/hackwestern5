/**
 * @license
 * Copyright Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// [START calendar_quickstart]
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listCalenders);

});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
var eventsOutOfOrder = []
/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, calanderIDs) {
  const calendar = google.calendar({ version: 'v3', auth });
  for (var i = 0; i < calanderIDs.length; i++) {
    calendar.events.list({
      calendarId: calanderIDs[i],
      timeMin: (new Date(2018, 10, 24, 15, 0, 0, 0)).toISOString(),
      timeMax: (new Date(2018, 11, 26, 18, 0, 0, 0)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {

        events.map((event, i) => {
          var start = event.start.dateTime;
          var end = event.end.dateTime;


          if (typeof(start) !== "undefined") {
            eventsOutOfOrder.push({ start:  start, end: end})

          }


          // console.log(new Date(end) - new Date(start)  );
          //console.log(event)



        });
      }
      else {
        console.log('No upcoming events found.');
      }
    });

  }
  setTimeout(function() {
    viewSortedListOfDates(eventsOutOfOrder)
  }, 5000);


}
startEndDay (new Date(0,0,0,8,30,0,0),new Date(0,0,0,23,30,0,0),new Date(2018, 10, 24, 0, 0, 0, 0),new Date(2018, 10, 26, 0, 0, 0, 0))

function startEndDay (startDay,endDay,startDate,endDate){
  var NumberOfDays = Math.round((endDate-startDate)/(1000*60*60*24))

  for (var i = 0; i < NumberOfDays; i++){

      var endOfDay = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),endDay.getHours(),endDay.getMinutes(),endDay.getSeconds());
    
  startDate.setDate(startDate.getDate() + 1)

    var startOfDay = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),startDay.getHours(),startDay.getMinutes(),startDay.getSeconds());

  
  eventsOutOfOrder.push({ start: new Date(endOfDay), end: new Date(startOfDay) })
    
    
     // console.log(new Date(startOfDay).toLocaleString() )
     // console.log(new Date(endOfDate).toLocaleString() )
    
      
    }
  
}

function viewSortedListOfDates(eventsOutOfOrder) {
  var eventsInOrder = eventsOutOfOrder.sort(function(a, b) {
    return a.start - b.start 
  });

  for (var i = 0; i < eventsInOrder.length - 1; i++) {

    eventsInOrder[i].freeTimeTillNext = (eventsInOrder[i+1].start-  eventsInOrder[i].end / 36e5);
  }

  for (var i = 0; i < eventsOutOfOrder.length; i++) {

    console.log(eventsInOrder[i]);
  }
}


function listCalenders(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  calendar.calendarList.list({},
    (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        var calanderIDs = [];
        result.data.items.forEach(function(element) {
          //console.log("Name: " + element.summary);
          calanderIDs.push(element.id)

        })



        listEvents(auth, calanderIDs)

        // or JSON.stringify(result.data)
      }


    }
  );
} // [END calendar_quickstart]


function insertEvent(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  var event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2018-11-24T09:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': '2018-11-24T17:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'reminders': {
      'useDefault': true
    },
  };

  calendar.events.insert({
    auth: auth,
    calendarId: ['primary', "6mjsqtkef2t2c4g7mh09kca4l4@group.calendar.google.com"],
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink);
  });


}


var calendar = require('node-calendar');


function freeTime(startTimeDate, endTimeDate) {


}
