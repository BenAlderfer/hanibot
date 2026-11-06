# Hanibot

This bot welcomes new users to the RBC YA discord server, tells them the rules, and provides helpful links.

## Setup

This requires a `.env` file with some values for running it locally. Create a `.env` file at the root and add:

```
TOKEN=<place your token here>
```

The token can be found by visiting https://discord.com/developers/applications/ and using either an existing application or making a new one. You should be able to find the token under the Bot page. If it's a new app, you'll need to add a bot to it. If the bot already exists, you may need to reset the token to be able to access it.

### Log channel (optional)

Some events are also posted to a Discord channel (currently: confirmation that a new member was sent the welcome DM). To enable this, add the channel's ID:

```
LOG_CHANNEL_ID=<channel id>
```

Use a different channel ID per environment (e.g. testing vs. production server). To get the ID, enable Developer Mode in Discord (User Settings → Advanced), then right-click the channel → Copy Channel ID. The bot needs permission to view and send messages in that channel. If `LOG_CHANNEL_ID` is not set, channel logging is skipped.

To send something else to the log channel, call `channelLogger.send(message)` where you want it logged. Only messages sent explicitly this way go to the channel.

## Running the server

`npm run start` is enough to get the server running and connected to discord if you have the right env vars and invited the bot to the server.

## Deploying

Currently, the repo is set to automatically deploy to Railway. Any new commits to `master` will get built and deployed to the staging environment, and anything on the `railway` branch will be sent to production.
