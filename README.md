# United Glass Minds - Safety Bot
=================

## Chatbot Overview

This bot is similar to the hydration bot, and it excutes on a timer, checks your uptime, and then updates chat with a message about taking a break.
As of 4/10/2019 it is live but still under development. The timer function is not working correctly.

### Manual Commands

`!safetyBreak`  (This is known as a chatbot command.) 

### Timer Calls
The timer will fire every 2 minutes if the chatbot remains online. 
If the chatbot goes to sleep on the glitch server, the timer will reset the next time it reloads.
It only have a 1 minute window to sink up with chat, and it is not accurately firing due to the glitch sleep settings.
I'm working on an alternative. 

### ReMix ME?
You need to get permission to remix this bot. 
This bot was custom made for a group of my friends, and relies on my webserver for AJAX calls to function.
I do not want to have a larger number of people calling my server. 
If you have your own server and would like a copy of the server side code, I'm more than happy to share it.
Just contact me for a copy of the code. elsandkls@gmail.com

### Get Environment Variables (REMIX)

To start, you’ll need three environment variables:
 
| *Variable*  | *Description*   |
|---|---|---|---|---|
|`BOT_USERNAME`  |  The account (username) that the chatbot uses to send chat messages. This can be your Twitch account. Alternately, many developers choose to create a second Twitch account for their bot, so it's clear from whom the messages originate. |  
|`CHANNEL_NAME`  |  The Twitch channel name where you want to run the bot. Usually this is your main Twitch account.
|`OAUTH_TOKEN`   |  The token to authenticate your chatbot with Twitch's servers. Generate this with [https://twitchapps.com/tmi/](https://twitchapps.com/tmi/) (a Twitch community-driven wrapper around the Twitch API), while logged in to your chatbot account. The token will be an alphanumeric string.|  


What you need (Twitch Setup Instructions)
-------------------
 - First, your own [Twitch.tv account](https://twitch.tv/signup).
 - Log out (or use different browser) after creating your account.
 - Create an [account](https://twitch.tv/signup) for your bot to use.
 - Stay logged in to the bot account and continue to the next step.
 - Visit [TwitchApps/TMI](https://twitchapps.com/tmi/) to generate and oauth token

### Running the bot (Twitch bot Setup Instructions)
-------------------
1. To start with this template, click the Remix button in the upper right. 
2. Glitch automatically installs Node and Tmi.js for us.
3. Add the three environmental vars in our [`.env`] file.
   - Edit .env file add the USERNAME and oauth PASSWORD for your bot.
   - It autosaves.  
4. View the code in `bot.js`. 
5. Your chatbot is ready to run! Glitch automatically deploys & runs each version. 
   - View the status button to ensure there are no errors. 
   - Make sure you keep the bot open in a window, so it stays awake.

6. Try the chatbot! Interact with your channel (twitch.tv/<CHANNEL_NAME>) by trying  the `!multilink` command. 

**Note**: This bot connects to the IRC network as a client and isn't designed to respond over HTTP. 

## Next Steps

Enjoy!

