const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'slap',
    description: '隨機選擇一個打拍掌的動作',
    execute(message, args) {
        // 確保有用戶被標記
        if (!message.mentions.users.size) {
            return message.reply('請標記一個用戶。');
        }

        // 設定 JSON 文件的正確路徑
        const jsonPath = path.join(__dirname, '..', '..', 'noip_slap.json');

        // 讀取 JSON 文件
        const kisses = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

        // 從 JSON 中隨機選擇一個選項
        const kissValues = Object.values(kisses);
        const randomKissText = kissValues[Math.floor(Math.random() * kissValues.length)];

        // 獲取被標記的用戶
        const taggedUser = message.mentions.users.first();

        // 創建回應消息
        message.channel.send(`${taggedUser} 被 ${message.author} 打了一巴掌! `);
        message.channel.send(`${randomKissText}`);
    }
};
