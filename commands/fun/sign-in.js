const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./path/fulin/Nee6.db');

module.exports = {
    name: '簽到',
    description: '簽到並記錄到數據庫，查詢本月簽到次數，以及今天簽到的人數和名單',
    execute(message, args) {
        const userId = message.author.id;
        const today = new Date().toISOString().split('T')[0]; // 獲取當天日期
        const firstDayOfMonth = new Date(today);
        firstDayOfMonth.setDate(1); // 設置為當月第一天
        firstDayOfMonth.setHours(0, 0, 0, 0); // 設置時間為午夜12點
        const firstDayOfMonthString = firstDayOfMonth.toISOString().split('T')[0];

        // 如果用戶輸入的是查詢今天簽到的人數和名單
        if (args[0] === '今日名單') {
            // ... (省略了原有的程式碼)
        } else {
            // 檢查用戶今天是否已經簽到
            db.get('SELECT date FROM sign_ins WHERE user_id = ? AND date = ?', [userId, today], (err, row) => {
                if (err) {
                    console.error(err.message);
                    message.reply('檢查簽到時出錯，請稍後再試。');
                    return;
                }
                // 如果用戶今天已經簽到
                if (row) {
                    message.reply('這位客官感謝您的再次光臨，但今日已經打卡過囉！期待明日的相見。');
                } else {
                    // 如果用戶今天還沒有簽到，記錄簽到
                    db.run('INSERT INTO sign_ins (user_id, date) VALUES (?, ?)', [userId, today], function(insertErr) {
                        if (insertErr) {
                            console.error(insertErr.message);
                            message.reply('打卡失敗，請稍後再試');
                            return;
                        }
                        // 簽到成功，獲得 50 點數
                        db.run(`INSERT OR IGNORE INTO economy (userId, points) VALUES (?, 0)`, [userId]); // 如果用戶還沒有記錄，創建一個
                        db.run(`UPDATE economy SET points = points + 50 WHERE userId = ?`, [userId]);
                        // 計算本月簽到次數
                        db.all('SELECT COUNT(*) AS count FROM sign_ins WHERE user_id = ? AND date >= ?', [userId, firstDayOfMonthString], 
                        (countErr, rows) => {
                            if (countErr) {
                                console.error(countErr.message);
                                message.reply('計算本月光臨次數時出錯，請稍後再試。');
                                return;
                            }
                            const count = rows[0].count;
                            message.reply(`打卡成功，你獲得了 50 點數，本月光臨次數 ${count} 天，期待客官明日的到來🎉🎉`);
                        });
                    });
                }
            });
        }
    },
};
