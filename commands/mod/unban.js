const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unban',
    description: '解除封禁用戶',
    execute(message, args) {
        // 確保命令由管理員執行
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('你沒有解除封禁用戶的權限。');
        }

        const userId = args[0];

        if (!userId) {
            return message.reply('請提供一個用戶ID。');
        }

        // 解除封禁用戶
        message.guild.members.unban(userId)
            .then(() => {
                message.reply(`用戶ID ${userId} 已被解除封禁。`);
                // 創建一個內嵌消息
                const unbanEmbed = new MessageEmbed()
                    .setTitle('解除封禁通知')
                    .setDescription(`用戶ID ${userId} 已被解除封禁`)
                    .setColor('#00ff00')
                    .setTimestamp();
                // 發送到日誌頻道
                const logChannel = message.guild.channels.cache.find(channel => channel.name === '∆╵酒館與百分百警告通知區域╷');
                if (logChannel) {
                    logChannel.send({ embeds: [unbanEmbed] });
                }
            })
            .catch(error => message.reply('發生錯誤，無法解除封禁該用戶。'));
    },
};
