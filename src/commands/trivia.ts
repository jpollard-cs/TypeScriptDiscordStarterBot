import { ICallbackObject, ICommand } from 'wokcommands';
import { ButtonInteraction, Interaction, Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, TextChannel } from 'discord.js';
import { AppColors } from '../configuration/colors';
import { setTimeout } from 'timers/promises';
import questionsList from '../data/trivia/questions';
import { nanoid } from 'nanoid';
import { triviaCategoriesList } from '../data/trivia/categories';
import { intersection, range, take } from 'ramda';
import randomColor from 'randomcolor';
import { shuffle } from '../utils';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

export = {
  description: 'start a trivia session',
  category: 'Fun & Games Admin',
  name: 'trivia',
  maxArgs: 2,
  minArgs: 1,
  permissions: ['ADMINISTRATOR'],
  expectedArgs: '<number-of-questions> [channel]',
  options: [{
    name: 'number-of-questions',
    description: 'how many questions to ask',
    required: true,
    type: 'INTEGER',
  }, {
    name: 'channel',
    description: '[optional] text channel to run trivia in if different from current channel',
    required: false,
    type: 'CHANNEL',
  }],
  cooldown: '2s',
  slash: true,
  guildOnly: true,
  testOnly: true,

  callback: async (options: ICallbackObject) => {
    const { interaction, instance, guild } = options;
    try {
      if (!guild) {
        return 'Command not allowed in DMs';
      }

      const numberOfQuestions = interaction.options.getInteger('number-of-questions');
      const channel = (interaction.options.getChannel('channel') || interaction.channel) as TextChannel;
      const channelId = channel.id;
      if (!channel.isText || !channel.isText()) {
        const errorEmbed = new MessageEmbed()
          .setColor(AppColors.WARNING_RED)
          .setDescription(`<:warning:910016022654877736> Invalid channel <#${channelId}>. Channel must be a text channel.`);
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        return;
      }

      await interaction.deferReply({ ephemeral: true });

      const numberOfQuestionsPerCategory = questionsList.reduce((acc, current) => {
        for (const category of current.categories) {
          acc[category] = (acc[category] || 0) + 1;
        }
        return acc;
      }, {});

      const categorySelectionId = nanoid();
      const categorySelectionEmbed = new MessageEmbed()
        .setColor(AppColors.SUCCESS_GREEN)
        .setTitle('Please select a category.');
      const categorySelectionComponent = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId(categorySelectionId)
            .setPlaceholder('Nothing selected')
            .setMinValues(1)
            .addOptions(triviaCategoriesList.map(c => ({
              // label and # of questions
              label: `${c} (${numberOfQuestionsPerCategory[c] || 0})`,
              value: c,
            }))),
        );

      const categorySelectionMessage = (await interaction.editReply({
        embeds: [categorySelectionEmbed],
        components: [categorySelectionComponent],
      })) as Message;

      const categorySelectionFilter = i => {
        if (!i.isSelectMenu()) { return; }
        i.deferUpdate();
        return i.customId === categorySelectionId && i.user.id === interaction.user.id;
      };

      const selectInteraction = await categorySelectionMessage.awaitMessageComponent({
        filter: categorySelectionFilter,
        componentType: 'SELECT_MENU',
        time: 60000,
      });

      const triviaSuccessEmbed = new MessageEmbed()
        .setColor(AppColors.SUCCESS_GREEN)
        .setTitle('Get ready for some trivia!')
        .addFields(
          { name: 'Number of questions', value: numberOfQuestions.toString() },
          { name: 'Categories', value: selectInteraction.values.join(', ') },
        );

      await interaction.editReply({ embeds: [triviaSuccessEmbed], components: [] });

      const questions =
          take(numberOfQuestions, shuffle(questionsList.filter(q => intersection(q.categories, selectInteraction.values)?.length > 0)));

      const answerData = [];
      const participatingUsers = new Set<string>();
      for (const question of questions) {
        const questionSelectionId = nanoid();
        const questionSelectionEmbed = new MessageEmbed()
          .setColor(AppColors.SUCCESS_GREEN)
          .setTitle(question.text);
        const answerButtons = [ ...take(3, shuffle(question.fakeAnswers)), question.correctAnswer].map(a => {
          return new MessageButton()
            .setCustomId(`${questionSelectionId}:${a.id}`)
            .setLabel(a.value)
            .setStyle('PRIMARY');
        });
        const questionSelectionComponent = new MessageActionRow()
          .addComponents(
            ...shuffle(answerButtons),
          );

        const questionMessage = await channel.send({
          embeds: [questionSelectionEmbed],
          components: [questionSelectionComponent],
        });

        const questionSelectionFilter = (i: Interaction) => {
          if (!i.isButton()) { return; }
          i.deferUpdate();
          return i.customId.split(':')[0] === questionSelectionId;
        };

        const answerCollector = await channel.createMessageComponentCollector({
          filter: questionSelectionFilter,
          time: 1000 * 5,
        });

        const getCollectorResultsAsync = async () => {
          return new Promise((resolve, reject) => {
            try {
              const collectedAnswers = {};
              answerCollector.on('collect', i => {
                collectedAnswers[i.user.id] = (i as ButtonInteraction).customId.split(':')[1] === question.correctAnswer.id;
              });

              answerCollector.on('end', async () => {
                await questionMessage.edit({
                  components: [],
                });
                const previousTally = answerData.length ? answerData[answerData.length - 1] : {};
                const newTally = {};
                for (const userId in collectedAnswers) {
                  participatingUsers.add(userId);
                  if (collectedAnswers[userId]) {
                    newTally[userId] = previousTally[userId] ? previousTally[userId] + 1 : 1;
                  }
                  else {
                    newTally[userId] = previousTally[userId] ? previousTally[userId] : 0;
                  }
                }
                resolve(newTally);
              });
            }
            catch (err) {
              console.error(err);
              reject(err);
            }
          });
        };

        const newTally = await getCollectorResultsAsync();
        answerData.push(newTally);

        await setTimeout(1000 * 1);
      }

      const chartData = answerData.reduce((acc, current) => {
        for (const userId of participatingUsers.values()) {
          const dataset = acc.get(userId) || {
            label: userId,
            data: [0],
            fill: false,
            borderColor: randomColor({
              luminosity: 'bright',
              format: 'rgb',
            }),
            tension: 0.1,
          };
          dataset.data.push(current[userId] || dataset.data[dataset.data.length - 1]);
          acc.set(userId, dataset);
        }
        return acc;
      }, new Map());
      const chartConfig = {
        type: 'line',
        data: {
          labels: range(0, answerData.length + 1).map(x => x.toString()),
          datasets: Array.from(chartData.values()),
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Chart.js Line Chart',
            },
          },
        },
      };
      const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
      const image = await chartJSNodeCanvas.renderToBuffer(chartConfig as any);
      await channel.send({
        content: 'Here are the results!',
        files: [
          { attachment: image },
        ],
      });
      return;
    }
    catch (e) {
      console.error(e);
      await interaction.followUp({
        content: instance.messageHandler.get(guild, 'EXCEPTION'),
        ephemeral: true,
      // eslint-disable-next-line no-empty-function
      }).catch(() => { });
    }
  },
} as ICommand;
