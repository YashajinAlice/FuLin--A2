const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'kiss',
    description: '隨機選擇一個親吻的動作',
    execute(message, args) {
        // 確保有用戶被標記
        if (!message.mentions.users.size) {
            return message.reply('請標記一個用戶。');
        }

        // 設定 JSON 文件的正確路徑
        const jsonPath = path.join(__dirname, '..', '..', 'noip_kiss.json');

        // 讀取 JSON 文件
        const kisses = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

        // 從 JSON 中隨機選擇一個選項
        const kissValues = Object.values(kisses);
        const randomKissText = kissValues[Math.floor(Math.random() * kissValues.length)];

        // 獲取被標記的用戶
        const taggedUser = message.mentions.users.first();

        // 創建回應消息
        message.channel.send(`${taggedUser} 被 ${message.author} 親了! `);
        message.channel.send(`${randomKissText}`);
    }
};
