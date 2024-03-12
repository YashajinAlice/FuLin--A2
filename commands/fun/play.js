const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'play',
    description: '播放音樂',
    execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.reply('您需要在語音頻道中才能播放音樂！');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK'))
            return message.reply('我需要權限來加入和在語音頻道中說話！');

        // 檢查是否提供了URL或歌曲名
        if (args.length === 0)
            return message.reply('請提供一個YouTube URL或歌曲名稱！');

        // 如果提供了URL，檢查是否有效
        if (ytdl.validateURL(args[0])) {
            const stream = ytdl(args[0], { filter: 'audioonly' });
            // 加入語音頻道並播放音樂
            voiceChannel.join().then(connection => {
                const dispatcher = connection.play(stream);
                dispatcher.on('finish', () => voiceChannel.leave());
            });
            message.reply(`正在播放: ${args[0]}`);
        } else {
            // 如果提供了歌曲名，進行搜索並讓用戶選擇
            // 這裡需要實現搜索功能和用戶選擇邏輯
        }
    }
};