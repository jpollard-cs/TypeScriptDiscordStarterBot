# TypeScript Discord Starter Bot

This project was created to make it easy for you to get up and running with a discord bot.

It's setup in a way that you should easily be able to host it on Repl.it using nix to run node 16.10+ (required by the latest Discord.js package).
To keep your bot up and running use [UptimeRobot](https://uptimerobot.com/) to hit your server periodically (see `src/server.ts` for details) or use a self or paid hosting option.

You can use a free mongo db instance from here to get yourself up and running fast [MongoDB Atlas](https://www.mongodb.com/atlas/database)
If MongoDB isn't your flavor I have a fork of WOKCommands that allows you to use any database you desire by simply implementing a few require repositories, but it needs some love - feel free to help me get it ready for production https://github.com/jpollard-cs/WOKCommands

This is built on the excellent WOKCommands library [WOKCommands Documentation](https://docs.wornoffkeys.com/setup-and-options-object)

Alexander Flores, the creator of WOKCommands, has some amazing videos if you're just getting started [WOKCommands / Discord.js 13 Playlist on YouTube](https://www.youtube.com/playlist?list=PLaxxQQak6D_f4Z5DtQo0b1McgjLVHmE8Q)

Add the following environment variables to your repl or .env file

`CLIENT_TOKEN` the client token for your bot

`CLIENT_ID` the oath client id for your bot

`TEST_GUILD_IDS` the comma delimited list of ids of the guilds you plan to use for testing your bot

`MONGO_DB_URI` the connection string from your mongo db instance including your username and password (if you need a database)

`IS_LOCAL` whether or not you're running the code locally

Download and install nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

cd into the project directory and run

```bash
nvm use
```

that will install the appropriate version of node as defined in the `.nvmrc` file

then you can run the following which will enable yarn

```bash
corepack enable
```

and now you can start the extension via

```bash
yarn && yarn start
```

To test locally with docker-compose run

```bash
docker-compose -f docker-compose.local.yml up
```

You _could_ also use the Dockerfile to deploy to production, but it currently requires you have all your secrets in a .env file while you probably want to use a secret store for secrets outside of your local environment

Alternatively you can easily deploy to Heroku. Working procfiles are already provided. Heroku has great guides on deploying node applications so I won't go into further details here.
