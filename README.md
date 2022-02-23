# TypeScript Discord Starter Bot

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
