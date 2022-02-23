require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env.CLIENT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildIds = process.env.TEST_GUILD_IDS.split(',');

for (const guildId in guildIds) {
  const rest = new REST({ version: '9' }).setToken(token);
  rest.get(Routes.applicationGuildCommands(clientId, guildId))
    .then(data => {
      const promises = [];
      for (const command of data) {
        const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
        promises.push(rest.delete(deleteUrl));
      }
      return Promise.all(promises);
    });
}
