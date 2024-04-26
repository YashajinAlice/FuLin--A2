const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'kick',
    description: '踢出用戶',
    execute(message, args) {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('你沒有踢出用戶的權限。');
        }

        const userToKick = message.mentions.users.first();
        const reason = args.slice(1).join(' ') || '違反規定';

        if (!userToKick) {
            return message.reply('請提及一個用戶。');
        }

        message.guild.members.kick(userToKick, { reason })
            .then(() => {
                message.reply(`${userToKick.tag} 已被踢出。理由: ${reason}`);
                // 發送到日誌頻道
                const logChannel = message.guild.channels.cache.find(channel => channel.name === '∆╵酒館與百分百警告通知區域╷');
                if (logChannel) {
                    const kickEmbed = new MessageEmbed()
                        .setTitle('踢出通知')
                        .setDescription(`${userToKick.tag} 已被踢出`)
                        .addField('用戶名', userToKick.username, true)
                        .addField('踢出理由', reason, true)
                        .addField('用戶ID', userToKick.id, true)
                        .setColor('#ff0000')
                        .setTimestamp();
                    logChannel.send({ embeds: [kickEmbed] });
                }
            })
            .catch(error => message.reply('發生錯誤，無法踢出該用戶。'));
    },
};
