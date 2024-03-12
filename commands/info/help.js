const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: '顯示幫助訊息',
    execute(message) {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('幫助訊息')
            .setDescription('這裡是目前支援的指令列表『前綴 fu.』：')
            .addFields(
                { name: '抽籤', value: '類似於神社抽籤的功能，例如 吉、大吉。' },
                { name: '計算', value: '類似於計算機的功能，例如 1 + 1' },
                { name: 'ping', value: '查詢目前延遲' },
                { name: '自動回復', value: '服務生會跟你聊聊天『基於測試功能』' },
                // 更多的命令...
            )
            .setTimestamp()
            .setFooter('by FuLin | Ver1.1.1');

        message.channel.send({ embeds: [embed] });
    }
};
