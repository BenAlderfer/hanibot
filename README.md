# RBC Discord Bot

This bot welcomes new users to the RBC discord server, tells them the rules, and provides helpful links

## Setup

This requires a `.env` file with some values for running it locally. Create a `.env` file at the root and add:

```
TOKEN=<place your token here>
```

The token can be found by visiting https://discord.com/developers/applications/ and using either an existing application or making a new one. You should be able to find the token under the Bot page. If it's a new app, you'll need to add a bot to it. If the bot already exists, you may need to reset the token to be able to access it.

## Running the server

`npm run start` is enough to get the server running and connected to discord if you have the right env vars and invited the bot to the server.

## Deploying

Currently, the repo is set to automatically deploy to Heroku. Any new commits to master will get built and deployed.
