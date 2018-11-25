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

var offset = 0
var mySubTaskCounter = 0
var calendar = require('node-calendar');

// Load client secrets from a local file.
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



function doALL(){
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listCalenders);

});
}












var myEvent = {
  name: "Hello Kitty",
  subEvents: [
    { name: "task1Kitty", duration: 1 },
    { name: "task2Kitty", duration: 2 },
    { name: "task3Kitty", duration: 3 }
  ],
  startDate: new Date(2018, 10, 25, 0, 0, 0, 0),
  endDate: new Date(2018, 10, 30, 0, 0, 0, 0),
  preferredStartTime: new Date(0, 0, 0, 10, 30, 0, 0),
  preferredEndTime: new Date(0, 0, 0, 19, 30, 0, 0),
  wellNess:[
    { name: "run" },
    { name: "walk" },
    { name: "jog" }
    ]
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
          calanderIDs.push({ id: element.id, name: element.summary })


        })



        listEvents(auth, calanderIDs)

        // or JSON.stringify(result.data)
      }


    }
  );
}



  


function listEvents(auth, calanderIDs) {
  
  
  
  var eventsOutOfOrder = []
  var counter = calanderIDs.length

  calendar = google.calendar({ version: 'v3', auth });
  for (var i = 0; i < calanderIDs.length; i++) {
    calendar.events.list({
      calendarId: calanderIDs[i].id,
      timeMin: (new Date(2018, 10, 25, 0, 0, 0, 0)).toISOString(),
      timeMax: (new Date(2018, 11, 30, 0, 0, 0, 0)).toISOString(),
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
            eventsOutOfOrder.push({ start: start, end: end })

          }
     

        });
      }
      else {
        console.log('No upcoming events found.');
      }
    });

  }

 setTimeout(function() {

     startEndDay (auth,new Date(0,0,0,8,30,0,0),new Date(0,0,0,23,30,0,0),new Date(2018, 10, 25, 0, 0, 0, 0),new Date(2018, 10, 30, 0, 0, 0, 0),eventsOutOfOrder)
  }, 1000);

}


function startEndDay(auth,startDay, endDay, startDate, endDate,eventsOutOfOrder) {
  var NumberOfDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))

  for (var i = 0; i < NumberOfDays; i++) {

    var endOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), endDay.getHours(), endDay.getMinutes(), endDay.getSeconds());

    startDate.setDate(startDate.getDate() + 1)

    var startOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDay.getHours(), startDay.getMinutes(), startDay.getSeconds());


    eventsOutOfOrder.push({ start: (new Date(endOfDay)).toISOString(), end: (new Date(startOfDay)).toISOString() })


    // console.log(new Date(startOfDay).toLocaleString() )
    // console.log(new Date(endOfDate).toLocaleString() )


  }
  //ADD Wellness Here

 // console.log(eventsOutOfOrder)
   //
  sortDates(auth,eventsOutOfOrder)
 

}




function sortDates(auth, eventsOutOfOrder) {
  var eventsInOrder;
  eventsInOrder = eventsOutOfOrder.sort(function(a, b) {
    return new Date(a.start) - new Date(b.start)
  });


 dayBreakdown(auth, myEvent,eventsInOrder)


}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}



function dayBreakdown(auth, myEvent,eventsInOrder) {
  
  var listOfEnhancedQuarterHour = []
 var startDate = new Date(myEvent.startDate)
  var endDate = new Date(myEvent.endDate)
  var endOfPeriod = Math.round((endDate-startDate)/(1000*60))/15
  
  
 // console.log(endOfPeriod)
      
  for (var i = 0; i < endOfPeriod;i++){
  var enhancedQuarterHour = {};
    var nextQuarterHour = startDate.setMinutes(startDate.getMinutes() + 15 )
    
    enhancedQuarterHour.time = new Date(nextQuarterHour)
    
    enhancedQuarterHour.open = true
    
    var nextPerferedStartTime = new Date( enhancedQuarterHour.time.getFullYear(),  
    enhancedQuarterHour.time.getMonth(), 
    enhancedQuarterHour.time.getDate(), 
    myEvent.preferredStartTime.getHours(),
    myEvent.preferredStartTime.getMinutes(), 
    myEvent.preferredStartTime.getSeconds())
    
     var nextPerferedEndTime = new Date( enhancedQuarterHour.time.getFullYear(),  
    enhancedQuarterHour.time.getMonth(), 
    enhancedQuarterHour.time.getDate(), 
    myEvent.preferredEndTime.getHours(),
    myEvent.preferredEndTime.getMinutes(), 
    myEvent.preferredEndTime.getSeconds())
    
    
    
    for (var j = 0; j < eventsInOrder.length; j++){
       //console.log(parseISOString(eventsInOrder[j].start) )
      if (parseISOString(eventsInOrder[j].start) <= enhancedQuarterHour.time && parseISOString(eventsInOrder[j].end) >= enhancedQuarterHour.time){
          enhancedQuarterHour.open = false
        
        break;
      }
    }
     enhancedQuarterHour.pref = false
    if (enhancedQuarterHour.time >= nextPerferedStartTime && enhancedQuarterHour.time <=nextPerferedEndTime ){
      
      enhancedQuarterHour.pref = true
    }
    
    listOfEnhancedQuarterHour.push(enhancedQuarterHour)
    
    
    
  // console.log(enhancedQuarterHour)
    
    
  };
 
  smartInsertion(auth, myEvent,listOfEnhancedQuarterHour);
}



function smartInsertion(auth, myEvent,listOfEnhancedQuarterHour) {
   var eventLock = false;
  var counter = 0;
  var start,end;

  for (var i =0; i < listOfEnhancedQuarterHour.length; i ++){
    
    if (listOfEnhancedQuarterHour[i].open == true && listOfEnhancedQuarterHour[i].pref == true && eventLock==false){
      eventLock = true;
      // console.log("started event lock")
      start = listOfEnhancedQuarterHour[i].time
      
    }
    if (eventLock == true){
      counter++
    }
  
    if (listOfEnhancedQuarterHour[i].open == false || listOfEnhancedQuarterHour[i].pref == false){
      eventLock = false;
       //console.log(counter/4,"ended event lock")
      end = listOfEnhancedQuarterHour[i].time
      
      
      // console.log(counter,myEvent.subEvents[1].duration)
      
      if ((counter/4) >= myEvent.subEvents[mySubTaskCounter].duration )
      {
        var endTime = new Date(start)
        endTime.setHours(endTime.getHours()+myEvent.subEvents[mySubTaskCounter].duration)
        
        
                 insertEvent(auth, "(bobby) " + myEvent.name + ":" + myEvent.subEvents[mySubTaskCounter].name, start, endTime,myEvent.subEvents.length)

        console.log(start,endTime)
          counter=0
        break;
      }
           counter=0
    }
 
    
  }
  
  
}





function insertEvent(auth, name, startTime, endTime,numSubEvents) {
  const calendar = google.calendar({ version: 'v3', auth });




  //ALGORITHEM HAPPENS HERER

  var eventTest = {
    'summary': name,
    'location': '',
    'description': '',
    'colorId': 6,
    'start': {
      'dateTime': new Date((startTime.setHours(startTime.getHours() + 5))).toISOString(),
      'timeZone': 'America/Los_Angeles',

    },
    'end': {
      'dateTime': new Date((endTime.setHours(endTime.getHours() + 5))).toISOString(),
      'timeZone': 'America/Los_Angeles',
    },
    'reminders': {
      'useDefault': true
    },
  };



  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: eventTest,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink);
    mySubTaskCounter++
   if (mySubTaskCounter < numSubEvents){
      doALL()
 
  

    }else{
    wdoALL()
    }
  });


}

function deleteEvent(eventId) {

      var params = {
        calendarId: 'primary',
        eventId: eventId,
      };

      calendar.events.delete(params, function(err) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        console.log('Event deleted.');
      });
    }


function deleteAllWellnessEvents(auth){
  calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date(2018, 10, 25, 0, 0, 0, 0)).toISOString(),
      timeMax: (new Date(2018, 11, 30, 0, 0, 0, 0)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {

        events.map((event, i) => {
          var start = event.start.dateTime;
       //   var end = event.end.dateTime;


          if (typeof(start) !== "undefined") {
            
            if (event.summary.includes("(wellNess)")){
              deleteEvent(event.id)
            }
         

          }
     

        });
      }
      else {
        console.log('No upcoming events found.');
      }
    });

}

doALL();




 // [END calendar_quickstart]





































function wdoALL(){
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), wlistCalenders);

});
}



function wlistCalenders(auth) {
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
          calanderIDs.push({ id: element.id, name: element.summary })


        })



        wlistEvents(auth, calanderIDs)

        // or JSON.stringify(result.data)
      }


    }
  );
}



  


function wlistEvents(auth, calanderIDs) {
  
  
  
  var eventsOutOfOrder = []
  var counter = calanderIDs.length

  calendar = google.calendar({ version: 'v3', auth });
  for (var i = 0; i < calanderIDs.length; i++) {
    calendar.events.list({
      calendarId: calanderIDs[i].id,
      timeMin: (new Date(2018, 10, 25, 0, 0, 0, 0)).toISOString(),
      timeMax: (new Date(2018, 11, 30, 0, 0, 0, 0)).toISOString(),
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
            eventsOutOfOrder.push({ start: start, end: end })

          }
     

        });
      }
      else {
        console.log('No upcoming events found.');
      }
    });

  }

 setTimeout(function() {

     wstartEndDay (auth,new Date(0,0,0,8,30,0,0),new Date(0,0,0,23,30,0,0),new Date(2018, 10, 25, 0, 0, 0, 0),new Date(2018, 10, 30, 0, 0, 0, 0),eventsOutOfOrder)
  }, 1000);

}


function wstartEndDay(auth,startDay, endDay, startDate, endDate,eventsOutOfOrder) {
  var NumberOfDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))

  for (var i = 0; i < NumberOfDays; i++) {

    var endOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), endDay.getHours(), endDay.getMinutes(), endDay.getSeconds());

    startDate.setDate(startDate.getDate() + 1)

    var startOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDay.getHours(), startDay.getMinutes(), startDay.getSeconds());


    eventsOutOfOrder.push({ start: (new Date(endOfDay)).toISOString(), end: (new Date(startOfDay)).toISOString() })


    // console.log(new Date(startOfDay).toLocaleString() )
    // console.log(new Date(endOfDate).toLocaleString() )


  }
  //ADD Wellness Here

 // console.log(eventsOutOfOrder)
   //
  wsortDates(auth,eventsOutOfOrder)
 

}




function wsortDates(auth, eventsOutOfOrder) {
  var eventsInOrder;
  eventsInOrder = eventsOutOfOrder.sort(function(a, b) {
    return new Date(a.start) - new Date(b.start)
  });


 wdayBreakdown(auth, myEvent,eventsInOrder)


}

function wparseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}



function wdayBreakdown(auth, myEvent,eventsInOrder) {
  
  var listOfEnhancedQuarterHour = []
 var startDate = new Date(myEvent.startDate)
  var endDate = new Date(myEvent.endDate)
  var endOfPeriod = Math.round((endDate-startDate)/(1000*60))/15
  
  
 // console.log(endOfPeriod)
      
  for (var i = 0; i < endOfPeriod;i++){
  var enhancedQuarterHour = {};
    var nextQuarterHour = startDate.setMinutes(startDate.getMinutes() + 15 )
    
    enhancedQuarterHour.time = new Date(nextQuarterHour)
    
    enhancedQuarterHour.open = true
    
    var nextPerferedStartTime = new Date( enhancedQuarterHour.time.getFullYear(),  
    enhancedQuarterHour.time.getMonth(), 
    enhancedQuarterHour.time.getDate(), 
    myEvent.preferredStartTime.getHours(),
    myEvent.preferredStartTime.getMinutes(), 
    myEvent.preferredStartTime.getSeconds())
    
     var nextPerferedEndTime = new Date( enhancedQuarterHour.time.getFullYear(),  
    enhancedQuarterHour.time.getMonth(), 
    enhancedQuarterHour.time.getDate(), 
    myEvent.preferredEndTime.getHours(),
    myEvent.preferredEndTime.getMinutes(), 
    myEvent.preferredEndTime.getSeconds())
    
    
    
    for (var j = 0; j < eventsInOrder.length; j++){
       //console.log(parseISOString(eventsInOrder[j].start) )
      if (parseISOString(eventsInOrder[j].start) <= enhancedQuarterHour.time && parseISOString(eventsInOrder[j].end) >= enhancedQuarterHour.time){
          enhancedQuarterHour.open = false
        
        break;
      }
    }
     enhancedQuarterHour.pref = false
    if (enhancedQuarterHour.time >= nextPerferedStartTime && enhancedQuarterHour.time <=nextPerferedEndTime ){
      
      enhancedQuarterHour.pref = true
    }
    
    listOfEnhancedQuarterHour.push(enhancedQuarterHour)
    
    
    
  // console.log(enhancedQuarterHour)
    
    
  };
 
  wsmartInsertion(auth, myEvent,listOfEnhancedQuarterHour);
}



function wsmartInsertion(auth, myEvent,listOfEnhancedQuarterHour) {

  var counter = 0;
  var start,end;

  for (var i =0; i < listOfEnhancedQuarterHour.length; i ++){
      
     if (listOfEnhancedQuarterHour[i].open == true &&  listOfEnhancedQuarterHour[i].pref == true){
   
      start = new Date(listOfEnhancedQuarterHour[i].time.setMinutes(listOfEnhancedQuarterHour[i].time.getMinutes()-15))
  
      var endTime = new Date(start)
      
        endTime.setMinutes(endTime.getMinutes()+15)
      
            if (getRandomArbitrary(0,100) <= 12){
              //console.log(start,endTime)
              winsertEvent(auth, "(wellNess) " + myEvent.wellNess[getRandomArbitrary(0,2)].name, start, endTime,myEvent.subEvents.length)
            
            }
   
      
     }

  
  
}
}

function getRandomArbitrary(min, max) {
    return Math.round( Math.random() * (max - min) + min);
}


function winsertEvent(auth, name, startTime, endTime,numSubEvents) {
  const calendar = google.calendar({ version: 'v3', auth });




  //ALGORITHEM HAPPENS HERER

  var eventTest = {
    'summary': name,
    'location': '',
    'description': '',
    'colorId': 2,
    'start': {
      'dateTime': new Date((startTime.setHours(startTime.getHours() + 5))).toISOString(),
      'timeZone': 'America/Los_Angeles',

    },
    'end': {
      'dateTime': new Date((endTime.setHours(endTime.getHours() + 5))).toISOString(),
      'timeZone': 'America/Los_Angeles',
    },
    'reminders': {
      'useDefault': true
    },
  };



  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: eventTest,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink);
  

  });


}

function wdeleteEvent(eventId) {

      var params = {
        calendarId: 'primary',
        eventId: eventId,
      };

      calendar.events.delete(params, function(err) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        console.log('Event deleted.');
      });
    }


function wdeleteAllWellnessEvents(auth){
  calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date(2018, 10, 25, 0, 0, 0, 0)).toISOString(),
      timeMax: (new Date(2018, 11, 30, 0, 0, 0, 0)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {

        events.map((event, i) => {
          var start = event.start.dateTime;
       //   var end = event.end.dateTime;


          if (typeof(start) !== "undefined") {
            
            if (event.summary.includes("(bobby)")){
              deleteEvent(event.id)
            }
         

          }
     

        });
      }
      else {
        console.log('No upcoming events found.');
      }
    });

}

