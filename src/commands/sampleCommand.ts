import { ICallbackObject, ICommand } from 'wokcommands';
import { MessageEmbed } from 'discord.js';
import whitelistModel from '../models/sample.model';

export = {
  description: 'Allows a user to add themselves to the whitelist',
  category: 'Configuration',
  name: 'whitelist',
  maxArgs: 1,
  expectedArgs: '[address]',
  cooldown: '2s',
  slash: 'both',
  requireRoles: true,
  guildOnly: true,
  testOnly: false,

  callback: async (options: ICallbackObject) => {
    const { args, text, instance, user, guild } = options;
    try {
      if (args.length === 0) {
        return instance.messageHandler.get(guild, 'SYNTAX_ERROR');
      }

      if (guild) {
        if (!instance.isDBConnected()) {
          return instance.messageHandler.get(guild, 'NO_DATABASE_FOUND');
        }

        await whitelistModel.findOneAndUpdate(
          {
            user_id: user.id,
            guild_id: guild.id,
          },
          {
            user_id: user.id,
            guild_id: guild.id,
            address: text,
            user_tag: user.tag,
          },
          { upsert: true },
        );

        const embed = new MessageEmbed()
          .setTitle('Whitelist')
          .setDescription(`Congratulations! your address **${text}** has been added to the whitelist!`);

        return [embed];
      }

      return 'Command not allowed in DMs';
    }
    catch (e) {
      console.error(e);
      return instance.messageHandler.get(guild, 'EXCEPTION');
    }
  },
} as ICommand;
