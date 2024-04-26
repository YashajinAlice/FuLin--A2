module.exports = {
    name: 'unmute',
    description: '解除用戶的靜言',
    execute(message, args) {
        if (!message.member.permissions.has('MUTE_MEMBERS')) {
            return message.reply('你沒有解除靜言用戶的權限。');
        }

        const userToUnmute = message.mentions.members.first();

        if (!userToUnmute) {
            return message.reply('請提及一個用戶。');
        }

        userToUnmute.timeout(null)
            .then(() => {
                message.reply(`${userToUnmute.user.tag} 的靜言已被解除。`);
                // 創建一個內嵌消息
                const unmuteEmbed = new MessageEmbed()
                    .setTitle('解除靜言通知')
                    .setDescription(`${userToUnmute.user.tag} 的靜言已被解除`)
                    .addField('用戶名', userToUnmute.user.username, true)
                    .addField('用戶ID', userToUnmute.user.id, true)
                    .setColor('#00ff00')
                    .setTimestamp();
                // 發送到日誌頻道
                const logChannel = message.guild.channels.cache.find(channel => channel.name === '∆╵酒館與百分百警告通知區域╷');
                if (logChannel) {
                    logChannel.send({ embeds: [unmuteEmbed] });
                }
            })
            .catch(error => message.reply('發生錯誤，無法解除靜言該用戶。'));
    },
};
