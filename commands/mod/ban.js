const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ban',
    description: '封禁用戶',
    execute(message, args) {
        // 確保命令由管理員執行
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('你沒有封禁用戶的權限。');
        }

        const userToBan = message.mentions.users.first();
        const reason = args.slice(1).join(' ') || '違反規定';

        if (!userToBan) {
            return message.reply('請提及一個用戶。');
        }

        // 封禁用戶並發送DM
        message.guild.members.ban(userToBan, { reason })
            .then(() => {
                message.reply(`${userToBan.tag} 已被封禁。理由: ${reason}`);
                // 發送DM給被封禁用戶
                userToBan.send(`你已被封禁。理由: ${reason}`)
                    .catch(error => console.log(`無法發送DM給 ${userToBan.tag}.`));

                // 創建一個內嵌消息
                const banEmbed = new MessageEmbed()
                    .setTitle('封禁通知')
                    .setDescription(`${userToBan.tag} 已被封禁`)
                    .addField('用戶名', userToBan.username, true)
                    .addField('封禁理由', reason, true)
                    .addField('用戶ID', userToBan.id, true)
                    .setColor('#ff0000')
                    .setTimestamp();

                // 發送到日誌頻道
                const logChannel = message.guild.channels.cache.find(channel => channel.name === '∆╵酒館與百分百警告通知區域╷');
                if (logChannel) {
                    logChannel.send({ embeds: [banEmbed] });
                }
            })
            .catch(error => message.reply('發生錯誤，無法封禁該用戶。'));
    },
};
