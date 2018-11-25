const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'calendar/token.json';


module.exports = (callback) => {
    //callback(null, "WORKING running");
    // Load client secrets from a local file.
    fs.readFile('calendar/credentials.json', (err, content) => {
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
    function authorize(credentials, ccallback) {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, ccallback);
        oAuth2Client.setCredentials(JSON.parse(token));
        ccallback(oAuth2Client);
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
    function listCalenders(auth) {
      const calendar = google.calendar({ version: 'v3', auth });
      calendar.calendarList.list({},
        (err, result) => {
          if (err) {
            callback(err, null);
          }
          else {
            var calendars = [];
            result.data.items.forEach(function(element) {
              //console.log("Name: " + element.summary);
              calendars.push({id: element.id, name: element.summary})
            })
            listEvents(auth, calendars)
          }
        }
      );
    }
    var eventsOutOfOrder = []
    
    function listEvents(auth, calanderIDs) {
      const calendar = google.calendar({ version: 'v3', auth });
      let counter = calanderIDs.length;
      for (var i = 0; i < calanderIDs.length; i++) {
        calendar.events.list({
          calendarId: calanderIDs[i].id,
          timeMin: (new Date(2018, 10, 24, 15, 0, 0, 0)).toISOString(),
          timeMax: (new Date(2018, 11, 30, 18, 0, 0, 0)).toISOString(),
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
                counter--;
                if(counter == 0)
                    viewSortedListOfDates(eventsOutOfOrder);
              }
            });
          }
          else {
            console.log('No upcoming events found.');
          }
        });
      }
    }

    function parseISOString(s) {
      var b = s.split(/\D+/);
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }
    function viewSortedListOfDates(eventsOutOfOrder) {
      var eventsInOrder = eventsOutOfOrder.sort(function(a, b) {
        return new Date(a.start) - new Date(b.start) 
      });
    
      for (var i = 0; i < eventsInOrder.length - 1; i++) {
        eventsInOrder[i].freeTimeTillNext =( Math.round(( parseISOString(eventsInOrder[i+1].start) - parseISOString(eventsInOrder[i].end) ) / 36e5* 100) / 100);
      }
        callback(null, eventsInOrder);
    }
};
