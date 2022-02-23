import { ICallbackObject, ICommand } from 'wokcommands';
import { MessageEmbed } from 'discord.js';
import ConfigurationModel from '../models/configuration.model';
import { AppColors } from '../configuration/colors';

export = {
  description: 'Configure Bot',
  category: 'Configuration',
  name: 'configure',
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '[bot_logging_channel]',
  slash: true,
  requireRoles: true,
  guildOnly: true,
  testOnly: false,
  options: [{
    name: 'bot_logging_channel',
    description: 'the Channel where we should send important bot log messages',
    type: 'CHANNEL',
    required: true,
  }],
  callback: async (options: ICallbackObject) => {

    const { args, user, guild, interaction, instance } = options;
    try {
      if (args.length === 0) {
        return instance.messageHandler.get(guild, 'SYNTAX_ERROR');
      }

      const loggingChannel = interaction.options.getChannel('bot_logging_channel', true);
      const loggingChannelId = loggingChannel.id;

      if (guild) {
        if (!instance.isDBConnected()) {
          return instance.messageHandler.get(guild, 'NO_DATABASE_FOUND');
        }

        await ConfigurationModel.findOneAndUpdate(
          {
            guild_id: guild.id,
          },
          {
            guild_id: guild.id,
            logging_channel_id: loggingChannelId,
          },
          { upsert: true },
        );

        const confirmationEmbed = new MessageEmbed()
          .setColor(AppColors.SUCCESS_GREEN)
          .setDescription(`Thank you <@${user.id}>! The configuration has been saved. The bot logging channel is set to <#${loggingChannelId}>.`);

        return [confirmationEmbed];
      }

      return 'Command not allowed in DMs';
    }
    catch (e) {
      console.error(e);
      return instance.messageHandler.get(guild, 'EXCEPTION');
    }
  },
} as ICommand;
