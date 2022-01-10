# RBC Discord Bot

This bot welcomes new users to the RBC discord server, tells them the rules, and provides helpful links

## Setup

This requires a `.env` file with some values for running it locally. Create a `.env` file at the root and add:

```
TOKEN=<place your token here>
```

## Running the server

`npm run start` is enough to get the server running and connected to discord if you have the right env vars and invited the bot to the server.

## Deploying

Currently, the repo is set to automatically deploy to Heroku. Any new commits to master will get built and deployed.
