const tmi = require('tmi.js');
const http = require('http');
const request = require('request');

var d = new Date();
var setAndMark = d.getTime();

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);
console.log(`Initiating client connection.`);
// Register our event handlers (defined below)
client.on('message', onMessageHandler); 
client.on('connected', onConnectedHandler); 
// Connect to Twitch:
client.connect();
console.log(`Client is connected.`);

// call to start the safety break functions
// Interval calculations 
var myIntervalMilliSeconds = 1000;
var myIntervalSeconds = 60; // 60 seconds in one minute
var myIntervalMinutes = 2; // 10 minute interval
var myIntervalLength = myIntervalMilliSeconds * myIntervalSeconds * myIntervalMinutes;

const intervalObj_SB = setInterval(wrapperISB , myIntervalLength); 

function wrapperISB()
{
    client.on('message', Initialize_Safety_Break);
}

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) 
{
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim(); 

    // If the command is known, let's execute it    
    const channel = context;  
    //console.log(`* recieved channel ${channel} `);
    const user = target;  
    //console.log(`* recieved user ${user['display-name']}`);
    const message = msg.trim();
    //console.log(`* recieved ${message} command`);
    const username = `${user['display-name']}`; 
    
    switch(message) {  
      case '!SBlist': 
        client.say(target, `Our commands are !SBlist (to see this list), !safetyBreak,!SBuptime `);
        console.log(`* Executed ${message} command`);
        break; 
      //////// extra commands  
      case '!safetyBreak':
          Initialize_Safety_Break(client, channel, target, msg, self);
          console.log(`* Executed ${message} command`);
          break;       
      case '!SBuptime':
          Initialize_Safety_Break(client, channel, target, msg, self);
          console.log(`* Executed ${message} command`);
          break;    
      default:        
        console.log(`* Unknown command ${message}`);
        break;
     }    
} 

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) 
{
  console.log(`* Connected to ${addr}:${port}`);  
}
 
function Initialize_Safety_Break(client, channel, context, msg, self)
{
   //console.log("Initialize_Safety_Break: start");
   //console.log(`* recieved channel:username ${channel['username']} `); 
   //console.log(`* recieved channel:display-name ${channel['display-name']} `);  
   if (self) { return; } // Ignore messages from the bot  
   loadDoc(client, `${channel['username']}`, msg);     
}

function loadDoc(client, channel, msg) 
{ 
  //console.log("loadDoc: Start");   
  //console.log(channel);
  var x = channel.search("#");
  if(x > -1)
  {
    target = channel.slice(1);
  }  
  
  var urlString = uptimeCheck("uptime", channel, channel);
  //console.log("loadDoc: urlString: "+urlString);   
  
  http.get(urlString, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) 
  {
    error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
  } 
  else if (!/^text\/plain/.test(contentType)) 
  {
    error = new Error('Invalid content-type.\n' + `Expected text/plain but received ${contentType}`);
  }
  if (error) 
  {
    console.error(error.message);
    // Consume response data to free up memory
    res.resume();
    return;
  }
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => 
  {
    try 
    {
      const parsedData = rawData;
      //console.log(parsedData);
      parseResponseTextHMS(client, channel, rawData, msg)      
    } 
    catch (e) 
    {
      console.error(e.message);
    }
  });
  res.on('error', (e) => 
  {
    console.error(`Got error: ${e.message}`);
  });        
 });     
} 
  
function uptimeCheck(varSwitch, CHANNEL, USER)
{  
    //console.log("uptimeCheck - Start");
	  // https://decapi.me/twitch/status/decicus 	
	  var baseUrl = "http://decapi.me/twitch/";
	  //  'uptime' => 'uptime/{CHANNEL}'
	  if(varSwitch == "uptime") 
	  {		
		    url = "uptime/";
	      url = url + CHANNEL;
	  } 	
    url = baseUrl + url;
    //console.log("uptimeCheck: url: " + url);
    return url;	  
}

function parseResponseTextHMS(client, channel, TextString)
{	    
    //console.log("parseResponseTextHMS: - Start ");
    //console.log("parseResponseTextHMS: TextString: " + String(TextString));
  
	  var test;		
	  test = TextString.search("offline");
	  if(test > 0 )
	  {
		  console.log("parseResponseTextHMS: Offline: " + TextString);		
	  }
	  else
	  {	      
      console.log("parseResponseTextHMS: Online: " + TextString);		0
      if(msg == "!SBuptime")
      {  
        client.say(channel, "Online: " + TextString);		
      }  
      // break it up
		  Words = TextString.split(",");
		  for(var t=0; t< Words.length;t++)
		  {
			  Words[t] = Words[t].trim();
		  }
      // check for content
		  for(var t=0; t< Words.length;t++)
		  {			  		    		           
		    if(-1 < Words[t].search("hours"))
		    {		
            var test1 = Words[t].search("hours");
			      var UpTimeHours = Words[t].split(" ");
			      var myHoursUp = UpTimeHours[0];
            //console.log("parseResponseTextHMS: myHoursUp: " + myHoursUp);
        } 
        if(-1 < Words[t].search("minutes"))
        { 
          var test2 = Words[t].search("minutes");
			    var UpTimeMinutes = Words[t].split(" ");
			    var myMinutesUp = UpTimeMinutes[0];
          //console.log("parseResponseTextHMS: myMinutesUp: " + myMinutesUp);
        }  
        if(-1 < Words[t].search("seconds"))
        {
          var test3 = Words[t].search("seconds");
			    var UpTimeSeconds = Words[t].split(" ");
          var mySecondsUp = UpTimeSeconds[0];		
          //console.log("parseResponseTextHMS: mySecondsUp: " + mySecondsUp);
        }  
	   }    
     if(( test1 > -1 ) || (test2 > -1) || (test3 > -1) )  
     {  
        //console.log("parseResponseTextHMS: Success: call PreachIt");
  	    PreachIt(client, channel, myHoursUp, myMinutesUp); 
     } 
  }         
}

function PreachIt(client, channel, myHoursUp, myMinutesUp)
{   
  //console.log("PreachIt: Start");
  //console.log("PreachIt: myHoursUp: "+myHoursUp);  
  //console.log("PreachIt: myMinutesUp: "+myMinutesUp);  
  // to test this I need to leave the connection live for a while, and see what it prints and when. 
	if(myHoursUp == 1 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, have you taken a safety break yet?");
	}
  else if(myHoursUp == 2 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, have you taken a safety break yet?");
	}	
	else if(myHoursUp == 3 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, Time for a Safety Break, Cheers!");
	}	
	else if(myHoursUp == 4 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, Dude, Puff Puff Pass");
	}	
	else if(myHoursUp == 5 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, Give me back my lighter!");
	}	
	else if(myHoursUp == 6 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, Don't bogart!");
	}	
	else if(myHoursUp == 7 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, you have to cough to get off, so puff puff.");
	}	
	else if(myHoursUp == 8 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, My dog ate my stash Man.");
	}	
	else if(myHoursUp == 9 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, Higher than a giraffe’s ass!");
	}	
	else if(myHoursUp == 10 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, My dog ate my stash Man.");
	}	
	else if(myHoursUp == 11 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, My dog ate my stash Man.");
	}	
	else if(myHoursUp == 12 && myMinutesUp == 1)
	{
		client.say(channel, "You've been online for "+myHoursUp+" hours, My dog ate my stash Man.");
	}	
	else if(myHoursUp == 4 && myMinutesUp == 20)
	{
		client.say(channel, "You've been online for 4 hours and 20 minutes, guess what time it is?");
	}	
	else if(myHoursUp == 7 && myMinutesUp == 10)
	{
		client.say(channel, "You've been online for 7 hours and 10 minutes, Oil anyone?");
	}else
	{
		client.say(channel, "Get back to work! "+ myHoursUp +"hrs and "+ myMinutesUp +" minutes");
	}
  			    
}
 