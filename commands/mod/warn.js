const fs = require('fs');
const { MessageEmbed } = require('discord.js');

// 警告文件的路徑
const WARN_FILE_PATH = './warn.json';

// 讀取警告數據
function readWarnings() {
    try {
        const data = fs.readFileSync(WARN_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // 如果文件不存在或者無法解析，返回一個空陣列
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
            return [];
        } else {
            console.error('讀取警告文件時出錯:', error);
            return []; // 確保函數返回一個陣列
        }
    }
}

// 寫入警告數據
function writeWarnings(warnings) {
    try {
        fs.writeFileSync(WARN_FILE_PATH, JSON.stringify(warnings, null, 4), 'utf8');
    } catch (error) {
        console.error('寫入警告文件時出錯:', error);
    }
}

module.exports = {
    name: 'warn',
    description: '警告用戶',
    execute(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('你沒有警告用戶的權限。');
        }

        const userToWarn = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || '違反規定';

        if (!userToWarn) {
            return message.reply('請提及一個用戶。');
        }

        // 獲取當前所有警告
        const currentWarnings = readWarnings();

        // 創建新的警告對象
        const newWarning = {
            id: currentWarnings.length + 1,
            username: userToWarn.user.username,
            userId: userToWarn.id,
            time: new Date().toISOString(),
            operator: message.author.tag
        };

        // 添加新的警告到數據中
        currentWarnings.push(newWarning);

        // 寫入更新後的警告到文件
        writeWarnings(currentWarnings);

        message.reply(`${userToWarn.user.tag} 已被警告。理由: ${reason}`);

        // 創建一個內嵌消息
        const warnEmbed = new MessageEmbed()
            .setTitle('警告通知')
            .setDescription(`${userToWarn.user.tag} 已被警告`)
            .addField('用戶名', userToWarn.user.username, true)
            .addField('警告理由', reason, true)
            .addField('警告ID', newWarning.id.toString(), true)
            .setColor('#ff9900')
            .setTimestamp();

        // 發送到日誌頻道
        const logChannel = message.guild.channels.cache.find(channel => channel.name === '∆╵酒館與百分百警告通知區域╷');
        if (logChannel) {
            logChannel.send({ embeds: [warnEmbed] });
        }
    },
};
