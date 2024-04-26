// DelWarning.js
const { readWarnings, writeWarnings } = require('../../warningUtils');

module.exports = {
    name: 'delwarning',
    description: '刪除警告',
    execute(message, args) {
        const warningId = args[0];
        if (!warningId) {
            return message.reply('請提供一個警告ID。');
        }

        const currentWarnings = readWarnings();
        const index = currentWarnings.findIndex(warning => warning.id.toString() === warningId);

        if (index === -1) {
            return message.reply('找不到該警告ID。');
        }

        currentWarnings.splice(index, 1);
        writeWarnings(currentWarnings);

        message.reply(`警告ID ${warningId} 已被刪除。`);
    },
};

// ClearWarnings.js

module.exports = {
    name: 'clearwarnings',
    description: '刪除特定用戶警告',
    execute(message, args) {
        const userToClear = message.mentions.members.first();
        if (!userToClear) {
            return message.reply('請提及一個用戶。');
        }

        const currentWarnings = readWarnings();
        const newWarnings = currentWarnings.filter(warning => warning.userId !== userToClear.id);

        if (newWarnings.length === currentWarnings.length) {
            return message.reply('該用戶沒有警告。');
        }

        writeWarnings(newWarnings);

        message.reply(`${userToClear.user.tag} 的所有警告已被刪除。`);
    },
};
