const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'mute',
    description: '靜言用戶',
    execute(message, args) {
        if (!message.member.permissions.has('MUTE_MEMBERS')) {
            return message.reply('你沒有靜言用戶的權限。');
        }

        const userToMute = message.mentions.members.first();
        const time = args[1];
        const reason = args.slice(2).join(' ') || '違反規定';

        // 檢查是否有指定時間
        if (!time) {
            return message.reply('請指定禁言時長（例如：fu.mute @user 1h 1m）。');
        }

        // 嘗試解析時間
        let muteTime = ms(time);
        if (!muteTime) {
            return message.reply('無效的時間格式。請使用如 1h 或 1m 的格式。');
        }

        if (!userToMute) {
            return message.reply('請提及一個用戶。');
        }

        userToMute.timeout(muteTime, reason)
            .then(() => {
                message.reply(`${userToMute.user.tag} 已被靜言。時間: ${time}, 理由: ${reason}`);
                // 創建一個內嵌消息
                const muteEmbed = new MessageEmbed()
                    .setTitle('靜言通知')
                    .setDescription(`${userToMute.user.tag} 已被靜言`)
                    .addField('用戶名', userToMute.user.username, true)
                    .addField('靜言時間', time, true)
                    .addField('靜言理由', reason, true)
                    .addField('用戶ID', userToMute.user.id, true)
                    .setColor('#ff9900')
                    .setTimestamp();
                // 發送到日誌頻道
                const logChannel = message.guild.channels.cache.find(channel => channel.name === '∆╵酒館與百分百警告通知區域╷');
                if (logChannel) {
                    logChannel.send({ embeds: [muteEmbed] });
                }
            })
            .catch(error => message.reply('發生錯誤，無法靜言該用戶。'));
    },
};
