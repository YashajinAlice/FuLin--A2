const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./path/fulin/Nee6.db');

// 創建 birthdays 表
db.run(`CREATE TABLE IF NOT EXISTS birthdays (
    userId TEXT PRIMARY KEY,
    date TEXT,
    channelId TEXT,
    message TEXT
)`, function(err) {
    if (err) {
        console.error(err.message);
    }
});

module.exports = {
    name: '生日',
    description: '新增生日並記錄到數據庫，設定祝福詞台詞，並在生日當天發送祝福詞',
    execute(message, args) {
        const userId = message.author.id;
        const channelId = message.channel.id; // 獲取頻道 ID

        // 1. 新增生日
        if (args[0] === '新增') {
            const date = args.slice(1).join(' ');
            if (!date) {
                return message.reply('請提供生日日期，範例 2024 03 11');
            }
            // 儲存生日和頻道 ID 到數據庫
            db.run(`INSERT INTO birthdays (userId, date, channelId) VALUES (?, ?, ?)`, [userId, date, channelId], function(err) {
                if (err) {
                    console.error(err.message);
                    return message.reply('新增生日時出錯，請稍後再試。');
                }
                return message.reply(`已經為你設定生日為 ${date}`);
            });
        }

        // 2. 設定祝福詞台詞
        if (args[0] === '祝福詞') {
            const messageContent = args.slice(1).join(' ');
            if (!messageContent) {
                return message.reply('請您提供生日祝福詞');
            }
            // 儲存祝福詞和頻道 ID 到數據庫
            db.run(`UPDATE birthdays SET message = ?, channelId = ? WHERE userId = ?`, [messageContent, channelId, userId], function(err) {
                if (err) {
                    console.error(err.message);
                    return message.reply('設定祝福詞時出錯，請稍後再試。');
                }
                return message.reply(`已經為你設定祝福詞為 "${messageContent}"`);
            });
        }
    },
};
