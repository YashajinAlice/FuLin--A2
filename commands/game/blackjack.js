const { MessageActionRow, MessageButton } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: 'blackjack',
    description: '開始一場21點遊戲',
    execute(message) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('join_game')
                    .setLabel('加入遊戲')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('start_game')
                    .setLabel('開始遊戲')
                    .setStyle('PRIMARY')
                /*new MessageButton()
                    .setCustomId('stop_game')
                    .setLabel('結束遊戲')
                    .setStyle()*/
            );

        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('21點遊戲準備')
            .setDescription('你要和誰遊玩？')
            .addField('操作', '點擊下方按鈕加入遊戲或開始遊戲。');

        message.channel.send({ embeds: [embed], components: [row] });
    }
};
